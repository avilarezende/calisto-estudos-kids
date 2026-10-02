const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = 8085;
const PUBLIC_DIR = path.resolve(__dirname);

// ----- SSRF protection --------------------------------------------
// Sufixos de host permitidos para o endpoint /api/fetch-workspace.
// O recurso foi concebido para workspaces do NotebookLM (que redireciona
// para notebook.google.com) e embeds do YouTube. Manter o mais restrito
// possível: hosts que terminam em um destes sufixos (ou são exatamente
// o sufixo, ex.: youtu.be).
const ALLOWED_FETCH_HOST_SUFFIXES = [
  'google.com',        // notebooklm.google.com, notebook.google.com, docs.google.com...
  'youtube.com',       // youtube.com, www.youtube.com, m.youtube.com...
  'youtube-nocookie.com',
  'youtu.be'
];

// Redirecionamento para a tela de login do Google indica conteúdo protegido;
// retornamos o estado isGoogleAuth em vez de segui-lo.
const GOOGLE_AUTH_REDIRECT_HOSTS = ['accounts.google.com', 'accounts.youtube.com'];

// Bloqueia IPs privados, link-local, loopback e metadata da cloud,
// evitando que o servidor vire um proxy para a rede interna.
const BLOCKED_IP_RANGES = [
  '10.', '127.', '169.254.', '172.16.', '172.17.', '172.18.', '172.19.',
  '172.20.', '172.21.', '172.22.', '172.23.', '172.24.', '172.25.', '172.26.',
  '172.27.', '172.28.', '172.29.', '172.30.', '172.31.', '192.168.', '0.',
  '::', '::1', 'fc', 'fd', 'fe80'
];

const MAX_RESPONSE_BYTES = 1024 * 1024; // 1 MB por workspace buscado

function isBlockedIp(ip) {
  return BLOCKED_IP_RANGES.some(prefix => ip.startsWith(prefix));
}

function isAllowedHost(hostname) {
  return ALLOWED_FETCH_HOST_SUFFIXES.some(suffix =>
    hostname === suffix || hostname.endsWith('.' + suffix)
  );
}

// Valida a URL alvo: protocolo https, host na allowlist e IP não privado.
function validateFetchTarget(targetUrl) {
  let parsedUrl;
  try {
    parsedUrl = new URL(targetUrl);
  } catch {
    throw new Error('URL inválida.');
  }

  if (parsedUrl.protocol !== 'https:') {
    throw new Error('Apenas URLs https:// são permitidas.');
  }

  const hostname = parsedUrl.hostname.toLowerCase();
  if (!isAllowedHost(hostname)) {
    throw new Error(`Host "${hostname}" não está na lista de URLs permitidas.`);
  }

  return parsedUrl;
}

// Resolve o IP real do host (DNS) e bloqueia endereços internos.
function assertPublicHost(hostname) {
  return new Promise((resolve, reject) => {
    require('dns').lookup(hostname, { all: true }, (err, addresses) => {
      if (err) return reject(new Error(`Falha ao resolver o host "${hostname}".`));
      if (!addresses || addresses.length === 0) {
        return reject(new Error(`Host "${hostname}" sem endereço resolvido.`));
      }
      const blocked = addresses.some(addr => isBlockedIp(addr.address));
      if (blocked) {
        return reject(new Error(`Host "${hostname}" resolve para um endereço interno e foi bloqueado.`));
      }
      resolve();
    });
  });
}

// ----- Security headers --------------------------------------------
function applySecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; frame-src https://www.youtube-nocookie.com;"
  );
}

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.ogg': 'audio/ogg',
  '.mp3': 'audio/mpeg'
};

/**
 * Função utilitária para buscar URL com suporte a redirecionamentos.
 * SSRF-safe: valida host na allowlist + IP público antes de cada requisição
 * (inclusive em redirecionamentos) e limita o tamanho da resposta.
 */
function fetchUrlContent(targetUrl, maxRedirects = 3) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) {
      return reject(new Error('Muitos redirecionamentos'));
    }

    let parsedUrl;
    try {
      parsedUrl = validateFetchTarget(targetUrl);
    } catch (e) {
      return reject(e);
    }

    // Bloqueia IPs internos antes de abrir conexão (proteção DNS rebinding).
    assertPublicHost(parsedUrl.hostname)
      .then(() => {
        const client = parsedUrl.protocol === 'https:' ? https : http;

        const req = client.get(parsedUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,application/json,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
          },
          timeout: 10000
        }, (res) => {
          // Trata redirecionamentos 301, 302, 303, 307, 308
          if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
            res.resume(); // descarta o corpo
            let redirectParsed;
            try {
              redirectParsed = new URL(res.headers.location, parsedUrl);
            } catch {
              return reject(new Error('Redirect inválido.'));
            }

            // Redirecionamento para a tela de login do Google (conteúdo protegido)
            if (GOOGLE_AUTH_REDIRECT_HOSTS.includes(redirectParsed.hostname.toLowerCase())) {
              return resolve({
                statusCode: 401,
                isGoogleAuth: true,
                contentType: 'application/json',
                body: JSON.stringify({ isGoogleAuth: true, message: 'Google Auth Login Required' })
              });
            }

            // Cada redirect passa de novo pela allowlist + IP público.
            let validated;
            try {
              validated = validateFetchTarget(redirectParsed.toString());
            } catch (e) {
              return reject(e);
            }
            return assertPublicHost(validated.hostname)
              .then(() => fetchUrlContent(validated.toString(), maxRedirects - 1))
              .then(resolve, reject);
          }

          if (res.statusCode >= 400) {
            res.resume(); // descarta o corpo
            return resolve({
              statusCode: res.statusCode,
              isGoogleAuth: false,
              contentType: res.headers['content-type'] || '',
              body: ''
            });
          }

          let data = '';
          let size = 0;
          res.setEncoding('utf8');
          res.on('data', chunk => {
            size += Buffer.byteLength(chunk);
            if (size > MAX_RESPONSE_BYTES) {
              req.destroy();
              reject(new Error(`Conteúdo excede o limite de ${Math.round(MAX_RESPONSE_BYTES / 1024)} KB.`));
            } else {
              data += chunk;
            }
          });
          res.on('end', () => {
            const isGoogleAuth = data.includes('accounts.google.com') ||
              data.includes('InteractiveLogin') ||
              data.includes('identifierId') ||
              data.includes('Sign in - Google') ||
              data.includes('Fazer login nas Contas do Google');

            resolve({
              statusCode: isGoogleAuth ? 401 : res.statusCode,
              isGoogleAuth: isGoogleAuth,
              contentType: res.headers['content-type'] || '',
              body: isGoogleAuth ? JSON.stringify({ isGoogleAuth: true }) : data
            });
          });
          res.on('error', err => reject(err));
        });

        req.on('error', err => reject(err));
        req.on('timeout', () => {
          req.destroy();
          reject(new Error('Tempo limite de conexão excedido'));
        });
      })
      .catch(reject);
  });
}

const server = http.createServer(async (req, res) => {
  // Aplica headers de segurança em TODAS as respostas.
  applySecurityHeaders(res);

  let reqUrl = req.url.split('?')[0];

  // ROTA DA API: /api/fetch-workspace?url=...
  if (reqUrl === '/api/fetch-workspace') {
    const urlObj = new URL(req.url, `http://${req.headers.host}`);
    const targetUrl = urlObj.searchParams.get('url');

    // CORS restrito ao app local (remove o "*" que criava um proxy aberto).
    res.removeHeader('Access-Control-Allow-Origin');
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8085');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      return res.end();
    }

    if (req.method !== 'GET') {
      res.writeHead(405, { 'Content-Type': 'application/json; charset=UTF-8' });
      return res.end(JSON.stringify({ success: false, error: 'Método não permitido.' }));
    }

    if (!targetUrl) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=UTF-8' });
      return res.end(JSON.stringify({ success: false, error: 'Parâmetro "url" é obrigatório.' }));
    }

    try {
      const result = await fetchUrlContent(targetUrl);
      if (result.isGoogleAuth) {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
        return res.end(JSON.stringify({
          success: false,
          isGoogleAuth: true,
          targetUrl: targetUrl,
          error: 'Este workspace do NotebookLM requer autenticação da sua Conta Google.'
        }));
      }

      res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
      return res.end(JSON.stringify({
        success: true,
        targetUrl: targetUrl,
        contentType: result.contentType,
        body: result.body
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=UTF-8' });
      return res.end(JSON.stringify({
        success: false,
        error: err.message || 'Falha ao buscar a URL'
      }));
    }
  }

  if (reqUrl === '/') reqUrl = '/index.html';

  // Path traversal: resolve o caminho e garante que NÃO saia de PUBLIC_DIR.
  const filePath = path.resolve(PUBLIC_DIR, '.' + path.sep + reqUrl.replace(/^(\/|\\)+/, ''));
  const relative = path.relative(PUBLIC_DIR, filePath);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=UTF-8' });
    return res.end('403 Proibido');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
        res.end('404 Não Encontrado');
      } else {
        res.writeHead(500);
        res.end('500 Erro Interno');
      }
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache'
      });
      res.end(content);
    }
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Servidor rodando com sucesso em http://127.0.0.1:${PORT}`);
});

