const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = 8085;
const PUBLIC_DIR = __dirname;

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
 * Função utilitária para buscar URL com suporte a redirecionamentos
 */
function fetchUrlContent(targetUrl, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) {
      return reject(new Error('Muitos redirecionamentos'));
    }

    try {
      const parsedUrl = new URL(targetUrl);
      const client = parsedUrl.protocol === 'https:' ? https : http;

      const req = client.get(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,application/json,*/*;q=0.8',
          'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
        },
        timeout: 10000
      }, (res) => {
        // Trata redirecionamentos 301, 302, 303, 307, 308
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
          const redirectUrl = new URL(res.headers.location, targetUrl).toString();
          // Detecta se foi redirecionado para a tela de login do Google
          if (redirectUrl.includes('accounts.google.com') || redirectUrl.includes('ServiceLogin') || redirectUrl.includes('InteractiveLogin')) {
            return resolve({
              statusCode: 401,
              isGoogleAuth: true,
              contentType: 'application/json',
              body: JSON.stringify({ isGoogleAuth: true, message: 'Google Auth Login Required' })
            });
          }
          return resolve(fetchUrlContent(redirectUrl, maxRedirects - 1));
        }

        let data = '';
        res.setEncoding('utf8');
        res.on('data', chunk => { data += chunk; });
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
      });

      req.on('error', err => reject(err));
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Tempo limite de conexão excedido'));
      });
    } catch (e) {
      reject(e);
    }
  });
}

const server = http.createServer(async (req, res) => {
  let reqUrl = req.url.split('?')[0];

  // ROTA DA API: /api/fetch-workspace?url=...
  if (reqUrl === '/api/fetch-workspace') {
    const urlObj = new URL(req.url, `http://${req.headers.host}`);
    const targetUrl = urlObj.searchParams.get('url');

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      return res.end();
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

  const filePath = path.join(PUBLIC_DIR, reqUrl);
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
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content);
    }
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Servidor rodando com sucesso em http://127.0.0.1:${PORT}`);
});

