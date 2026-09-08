/**
 * ====================================================================
 * BANCO DE DADOS DOS WORKSPACES DO CALISTO - O PERIQUITO EXPLORADOR 🦜
 * ====================================================================
 * Você pode editar este arquivo facilmente direto no GitHub ou no bloco de notas!
 */

const DEFAULT_WORKSPACES = [
  {
    id: 1,
    titulo: "Viagem pelo Sistema Solar",
    icone: "🚀",
    subtitulo: "Planetas, estrelas e cometas no espaço!",
    cor: "linear-gradient(135deg, #4A00E0, #8E2DE2)",
    videoUrl: "https://www.youtube-nocookie.com/embed/fD3BqA3k1tY",
    resumo: "Vamos embarcar numa nave espacial com o Calisto para conhecer o Sol, a Terra, a Lua e todos os planetas vizinhos!",
    topicos: [
      "O Sol é uma estrela gigante que ilumina e aquece nosso planeta Terra.",
      "A Terra é o 3º planeta mais próximo do Sol e o único que sabemos que tem vida!",
      "A Lua é o satélite natural da Terra e gira ao nosso redor.",
      "Júpiter é o maior planeta de todos, e Saturno tem anéis lindos feitos de gelo e rocha!"
    ],
    curiosidades: [
      "Sabia que em Marte o pôr do sol é azulado? 🔴✨",
      "Um ano em Mercúrio dura apenas 88 dias terrestres! Muito rápido!"
    ],
    flashcards: [
      {
        pergunta: "Qual é a estrela mais próxima da Terra?",
        resposta: "O Sol! Ele nos dá luz, calor e energia para viver. ☀️"
      },
      {
        pergunta: "Qual planeta é conhecido como o 'Planeta Vermelho'?",
        resposta: "Marte! Ele tem essa cor avermelhada por causa do ferro em seu solo. 🔴"
      },
      {
        pergunta: "Qual é o maior planeta do Sistema Solar?",
        resposta: "Júpiter! Ele é tão gigante que todos os outros planetas caberiam dentro dele. 🪐"
      },
      {
        pergunta: "Quantos planetas existem no nosso Sistema Solar?",
        resposta: "São 8 planetas principais: Mercúrio, Vênus, Terra, Marte, Júpiter, Saturno, Urano e Netuno! 🌌"
      }
    ],
    quiz: [
      {
        pergunta: "Em qual planeta nós vivemos?",
        opcoes: ["Marte", "Terra", "Saturno", "Vênus"],
        respostaCorreta: 1,
        explicacao: "Excelente! A Terra é a nossa linda casa azul cheia de oceanos e florestas! 🌍"
      },
      {
        pergunta: "O que fica no centro do Sistema Solar?",
        opcoes: ["A Lua", "A Terra", "O Sol", "Um Cometa"],
        respostaCorreta: 2,
        explicacao: "Muito bem! O Sol é a grande estrela no centro e todos os planetas giram ao redor dele! ☀️"
      },
      {
        pergunta: "Qual planeta tem anéis brilhantes e famosos?",
        opcoes: ["Mercúrio", "Saturno", "Plutão", "Terra"],
        respostaCorreta: 1,
        explicacao: "Isso aí! Saturno é o senhor dos anéis cósmicos! 🪐"
      }
    ]
  },
  {
    id: 2,
    titulo: "O Mundo dos Dinossauros",
    icone: "🦖",
    subtitulo: "Gigantes que habitaram a Terra há milhões de anos!",
    cor: "linear-gradient(135deg, #11998e, #38ef7d)",
    videoUrl: "https://www.youtube-nocookie.com/embed/9w_Yh8jW3n8",
    resumo: "Venha descobrir com o Calisto como viviam os T-Rex, Tricerátops e Braquiossauros antes dos seres humanos!",
    topicos: [
      "Os dinossauros viveram na Terra na Era Mesozóica, há mais de 65 milhões de anos.",
      "Alguns eram herbívoros (comiam plantas) e outros eram carnívoros (caçavam).",
      "Os cientistas que estudam fósseis de dinossauros se chamam Paleontólogos!",
      "As aves de hoje, como eu (Calisto!), são parentes muito próximas dos dinossauros!"
    ],
    curiosidades: [
      "O Braquiossauro tinha um pescoço tão longo que alcançava o topo de prédios de 4 andares!",
      "Alguns dinossauros tinham penas coloridas, parecidas com as minhas!"
    ],
    flashcards: [
      {
        pergunta: "Como se chama o cientista que estuda os fósseis de dinossauros?",
        resposta: "Paleontólogo! Eles escavam a terra como verdadeiros detetives do passado! 🦴🔍"
      },
      {
        pergunta: "O que comiam os dinossauros herbívoros?",
        resposta: "Folhas, galhos, frutas e plantas! 🌿"
      },
      {
        pergunta: "Qual dinossauro tinha três chifres na cabeça?",
        resposta: "O Tricerátops! Seu nome significa 'três chifres no rosto'! 🦕"
      }
    ],
    quiz: [
      {
        pergunta: "O terrível Tiranossauro Rex era:",
        opcoes: ["Herbíboro (só comia plantas)", "Carnívoro (comia carne)", "Aquático", "Voador"],
        respostaCorreta: 1,
        explicacao: "Acertou em cheio! O T-Rex era um dos predadores carnívoros mais temidos! 🦖"
      },
      {
        pergunta: "Como os paleontólogos descobrem a história dos dinossauros?",
        opcoes: ["Vendo fotos antigas", "Estudando fósseis e ossos petrificados", "Perguntando aos dinossauros", "Lendo jornais antigos"],
        respostaCorreta: 1,
        explicacao: "Isso mesmo! Os fósseis guardam segredos de milhões de anos! 🦴"
      }
    ]
  },
  {
    id: 3,
    titulo: "O Segredo das Plantas e Florestas",
    icone: "🌿",
    subtitulo: "Como as folhas produzem o ar puro que respiramos!",
    cor: "linear-gradient(135deg, #0ba360, #3cba92)",
    videoUrl: "https://www.youtube-nocookie.com/embed/up_wOqKj7c4",
    resumo: "Descubra com o Calisto a mágica da fotossíntese e como as árvores ajudam todos os animais da floresta!",
    topicos: [
      "As plantas precisam de luz do sol, água e ar para crescer fortes.",
      "Pela fotossíntese, as folhas produzem oxigênio para nós respirarmos.",
      "As raízes sugam água da terra e mantêm a árvore firme no solo.",
      "As flores se transformam em frutos doces com sementes dentro!"
    ],
    curiosidades: [
      "A árvore mais alta do mundo tem mais de 115 metros de altura!",
      "As plantas conversam entre si por baixo da terra através de suas raízes!"
    ],
    flashcards: [
      {
        pergunta: "O que é a fotossíntese?",
        resposta: "É o processo em que a planta usa a luz do sol para criar seu próprio alimento e liberar oxigênio! ☀️🌱"
      },
      {
        pergunta: "Para que servem as raízes de uma planta?",
        resposta: "Para absorver água e nutrientes da terra e segurar a planta no chão! 🪵"
      }
    ],
    quiz: [
      {
        pergunta: "O que as plantas liberam no ar durante o dia que é essencial para nós?",
        opcoes: ["Fumaça", "Oxigênio puro", "Poeira", "Vento"],
        respostaCorreta: 1,
        explicacao: "Perfeito! As árvores são os pulmões verdes do nosso planeta! 🍃"
      }
    ]
  },
  {
    id: 4,
    titulo: "Mistérios do Fundo do Mar",
    icone: "🌊",
    subtitulo: "Baleias, golfinhos, corais e tubarões fantásticos!",
    cor: "linear-gradient(135deg, #00c6ff, #0072ff)",
    videoUrl: "https://www.youtube-nocookie.com/embed/1kH3P5h4hO4",
    resumo: "Mergulhe com o Calisto pelos recifes de corais e profundezas do oceano!",
    topicos: [
      "Mais de 70% da superfície da Terra é coberta por água salgada.",
      "A Baleia Azul é o maior animal que já existiu no planeta!",
      "Os corais são animais vivos coloridos que formam verdadeiras cidades submarinas.",
      "Os golfinhos são muito inteligentes e se comunicam por assobios e cliques."
    ],
    curiosidades: [
      "O polvo tem três corações e o sangue dele é azul!",
      "Alguns peixes que vivem no fundo escuro do mar brilham como lâmpadas mágicas!"
    ],
    flashcards: [
      {
        pergunta: "A baleia é um peixe?",
        resposta: "Não! A baleia é um mamífero aquático. Ela respira ar pelos pulmões e amamenta seus filhotinhos! 🐋"
      },
      {
        pergunta: "Quantos corações tem um polvo?",
        resposta: "Ele tem 3 corações! 🐙"
      }
    ],
    quiz: [
      {
        pergunta: "Qual é o maior animal vivo de todo o planeta Terra?",
        opcoes: ["Tubarão Branco", "Baleia Azul", "Elefante Africano", "Polvo Gigante"],
        respostaCorreta: 1,
        explicacao: "Incrível! A baleia azul é gigantesca e seu coração é do tamanho de um carro pequeno! 🐋"
      }
    ]
  },
  {
    id: 5,
    titulo: "Aventura dos Números e Formas",
    icone: "🧮",
    subtitulo: "Matemática divertida com jogos, desafios e enigmas!",
    cor: "linear-gradient(135deg, #f857a6, #ff5858)",
    videoUrl: "https://www.youtube-nocookie.com/embed/8w9W4G_7s48",
    resumo: "Os números são como superpoderes que o Calisto usa para contar sementes e resolver mistérios!",
    topicos: [
      "Somar (+) é juntar amigos e brinquedos!",
      "Subtrair (-) é descobrir quantos sobraram depois de comer algumas sementes saborosas.",
      "Formas geométricas estão por toda parte: a bola é um círculo, a janela é um quadrado!",
      "Os padrões numéricos nos ajudam a prever o próximo passo dos enigmas."
    ],
    curiosidades: [
      "O número zero foi uma das maiores invenções da história humana!",
      "As abelhas constroem colmeias em formato de hexágonos perfeitos!"
    ],
    flashcards: [
      {
        pergunta: "Se você tem 3 maçãs e ganha mais 4, com quantas fica?",
        resposta: "7 maçãs deliciosas! (3 + 4 = 7) 🍎"
      },
      {
        pergunta: "Qual forma tem 3 lados e 3 pontinhas?",
        resposta: "O Triângulo! 📐"
      }
    ],
    quiz: [
      {
        pergunta: "Quantos lados tem um quadrado perfeito?",
        opcoes: ["3 lados", "4 lados iguais", "5 lados", "Nenhum lado"],
        respostaCorreta: 1,
        explicacao: "Certíssimo! Quatro lados iguaizinhos e quatro cantos retos! 🟧"
      },
      {
        pergunta: "Se o Calisto tem 10 sementes e come 4, quantas sobram?",
        opcoes: ["5", "6", "7", "8"],
        respostaCorreta: 1,
        explicacao: "Cálculo certeiro! 10 menos 4 é igual a 6 sementes saborosas! 🥜"
      }
    ]
  },
  {
    id: 6,
    titulo: "Como Funciona o Corpo Humano",
    icone: "🫀",
    subtitulo: "Uma máquina fantástica feita de ossos, músculos e órgãos!",
    cor: "linear-gradient(135deg, #ff7e5f, #feb47b)",
    videoUrl: "https://www.youtube-nocookie.com/embed/7k_0w9Jk3qA",
    resumo: "Descubra com o Calisto como o cérebro pensa, o coração bombeia o sangue e os pulmões nos dão energia!",
    topicos: [
      "O coração é uma bomba muscular incansável que bate cerca de 100.000 vezes por dia.",
      "O cérebro é a central de comando do seu corpo: controla pensamentos, memórias e movimentos.",
      "O esqueleto é formado por mais de 200 ossos que sustentam nosso corpo.",
      "Comer alimentos coloridos e beber água nos dá superenergia e proteção!"
    ],
    curiosidades: [
      "Os seus dentes são tão duros quanto pedras de quartzo!",
      "Quando você dorme, seu cérebro organiza tudo o que você aprendeu durante o dia!"
    ],
    flashcards: [
      {
        pergunta: "Qual órgão é responsável por bombear o sangue pelo corpo?",
        resposta: "O coração! Ele bate sem parar com muita força! ❤️"
      },
      {
        pergunta: "Qual é o maior órgão de todo o corpo humano?",
        resposta: "A pele! Ela protege todo o nosso corpo contra sujeiras e micróbios! 🛡️"
      }
    ],
    quiz: [
      {
        pergunta: "Qual órgão comanda nossos pensamentos, sentimentos e brincadeiras?",
        opcoes: ["O estômago", "O cérebro", "O joelho", "O pé"],
        respostaCorreta: 1,
        explicacao: "Genial! O cérebro é o supercomputador do nosso corpo! 🧠"
      }
    ]
  },
  {
    id: 7,
    titulo: "Grandes Invenções da Humanidade",
    icone: "💡",
    subtitulo: "A roda, o avião, a lâmpada e os computadores!",
    cor: "linear-gradient(135deg, #f7971e, #ffd200)",
    videoUrl: "https://www.youtube-nocookie.com/embed/5k9eJk4q9w0",
    resumo: "Conheça com o Calisto as pessoas curiosas e inventores que mudaram a história do mundo!",
    topicos: [
      "A roda foi inventada há mais de 5.000 anos e permitiu transportar coisas pesadas.",
      "Santos Dumont e os irmãos Wright sonharam em voar pelos céus como os pássaros.",
      "Thomas Edison ajudou a criar a lâmpada elétrica para iluminar a noite.",
      "Hoje usamos celulares e internet para conversar com quem está longe!"
    ],
    curiosidades: [
      "O velcro foi inventado após um cientista reparar em carrapichos presos na coleira do seu cão!",
      "A primeira mensagem enviada pela internet foi apenas a palavra LO!"
    ],
    flashcards: [
      {
        pergunta: "Quem é o famoso inventor brasileiro conhecido como o Pai da Aviação?",
        resposta: "Alberto Santos Dumont, que voou com o famoso 14-Bis! ✈️"
      }
    ],
    quiz: [
      {
        pergunta: "O que a invenção da lâmpada elétrica trouxe para as nossas casas?",
        opcoes: ["Chuva", "Luz clara e segura ao apertar um botão", "Barulho de trovão", "Vento gelado"],
        respostaCorreta: 1,
        explicacao: "Muito bem! A lâmpada iluminou cidades inteiras e transformou a noite em dia! 💡"
      }
    ]
  },
  {
    id: 8,
    titulo: "O Clima e as Estações do Ano",
    icone: "🌦️",
    subtitulo: "Primavera, Verão, Outono e Inverno explicados!",
    cor: "linear-gradient(135deg, #36D1DC, #5B86E5)",
    videoUrl: "https://www.youtube-nocookie.com/embed/6y7u8I9v0w1",
    resumo: "O Calisto explica por que chove, como se formam os arco-íris e por que as estações mudam durante o ano!",
    topicos: [
      "A Terra é inclinada e gira ao redor do Sol: isso cria as 4 estações do ano!",
      "Primavera é a estação das flores e do nascimento dos filhotes.",
      "Verão é quentinho e perfeito para praia e brincadeiras ao ar livre.",
      "Outono faz as folhas das árvores caírem e o Inverno é a época do friozinho gostoso."
    ],
    curiosidades: [
      "O arco-íris se forma quando a luz do sol passa pelas gotinhas de chuva como um prisma!",
      "Nenhum floquinho de neve é exatamente igual a outro!"
    ],
    flashcards: [
      {
        pergunta: "Como se forma o arco-íris no céu?",
        resposta: "Quando os raios de sol atravessam gotinhas de chuva no ar, separando a luz em 7 cores lindas! 🌈"
      }
    ],
    quiz: [
      {
        pergunta: "Quantas estações do ano existem?",
        opcoes: ["2 estações", "4 estações", "6 estações", "12 estações"],
        respostaCorreta: 1,
        explicacao: "Exato! Primavera, Verão, Outono e Inverno! ☀️"
      }
    ]
  },
  {
    id: 9,
    titulo: "O Reino dos Animais Fascinantes",
    icone: "🐾",
    subtitulo: "Mamíferos, aves, répteis, anfíbios e peixes!",
    cor: "linear-gradient(135deg, #f12711, #f5af19)",
    videoUrl: "https://www.youtube-nocookie.com/embed/7h8j9K0L1M2",
    resumo: "Vamos explorar a selva e florestas com o Calisto para conhecer os animais mais incríveis do mundo!",
    topicos: [
      "As aves têm penas, asas, bicos e botam ovos (assim como eu, o periquito Calisto!).",
      "Os mamíferos mamam quando bebês e têm pelos no corpo.",
      "O camaleão consegue mudar de cor para se camuflar na natureza.",
      "O guepardo é o animal terrestre mais rápido do planeta!"
    ],
    curiosidades: [
      "Os periquitos Ringneck como o Calisto são conhecidos pela sua inteligência, fala e anel no pescoço!",
      "As girafas têm a língua tão comprida que limpam as próprias orelhas com ela!"
    ],
    flashcards: [
      {
        pergunta: "Qual é o animal terrestre mais rápido do mundo?",
        resposta: "O Guepardo (ou Chita)! Ele corre tão rápido quanto um carro na estrada! 🐆"
      }
    ],
    quiz: [
      {
        pergunta: "Os periquitos e papagaios pertencem a qual grupo de animais?",
        opcoes: ["Peixes", "Aves com penas e asas", "Répteis com escamas", "Insetos"],
        respostaCorreta: 1,
        explicacao: "Com certeza! Somos aves alegres, inteligentes e cheias de penas! 🦜"
      }
    ]
  },
  {
    id: 10,
    titulo: "Fábula das Palavras & Leitura Divertida",
    icone: "📖",
    subtitulo: "Aventuras mágicas com rimas, poesias e contação de histórias!",
    cor: "linear-gradient(135deg, #8A2387, #E94057, #F27121)",
    videoUrl: "https://www.youtube-nocookie.com/embed/9j0K1L2M3N4",
    resumo: "As palavras têm asas para nos levar a castelos e reinos de imaginação com o Calisto!",
    topicos: [
      "Ler histórias nos ajuda a viajar pelo tempo e imaginar mundos mágicos.",
      "Rimas são palavras que terminam com sons parecidos, como Coração e Balão!",
      "Todo livro é um baú de tesouros cheio de amizades e aprendizados.",
      "Escrever histórias próprias é uma forma linda de mostrar seus sentimentos!"
    ],
    curiosidades: [
      "O livro mais antigo do mundo foi impresso em blocos de madeira há mais de mil anos!",
      "Quem lê todo dia aprende centenas de palavras novas a cada semana!"
    ],
    flashcards: [
      {
        pergunta: "Qual palavra rima com 'CALISTO'?",
        resposta: "'Visto', 'Misto', 'Conquisto' ou 'Cristo'! 🦜✨"
      }
    ],
    quiz: [
      {
        pergunta: "Qual dessas palavras rima com 'ESTRELA'?",
        opcoes: ["Caminhão", "Janela", "Caderno", "Bola"],
        respostaCorreta: 1,
        explicacao: "Que ouvido afiado! Estrela e Janela combinam perfeitamente na rima! ⭐"
      }
    ]
  }
];

/**
 * Utilitário para gerar slides ricos e dinâmicos para qualquer workspace
 */
function gerarSlidesParaWorkspace(ws) {
  if (ws.slides && Array.isArray(ws.slides) && ws.slides.length > 0) {
    return ws.slides;
  }

  const slides = [];

  // Slide 1: Abertura / Boas-vindas
  slides.push({
    id: 1,
    tipo: 'intro',
    icone: ws.icone || '🌟',
    titulo: ws.titulo,
    subtitulo: ws.subtitulo || 'Uma aventura de conhecimento com o Calisto',
    falaCalisto: `Hehehe! Olá, pequenos exploradores! Sejam bem-vindos à nossa grande apresentação sobre ${ws.titulo}! Eu sou o sábio Calisto e vou guiar vocês em cada descoberta!`,
    destaque: `Apresentação especial do módulo: ${ws.titulo}`,
    topicos: [
      `Tema do dia: ${ws.titulo}`,
      `Resumo geral: ${ws.resumo || 'Vamos descobrir mistérios incríveis juntos!'}`,
      `Mascote Guia: Periquito Ringneck Calisto 🦜`
    ]
  });

  // Slide 2: Resumo e Fundamentos
  slides.push({
    id: 2,
    tipo: 'conceito',
    icone: '📖',
    titulo: 'Fundamentos & Descobertas',
    subtitulo: 'O que você precisa saber para começar',
    falaCalisto: `Vejam só que interessante! ${ws.resumo || 'Cada detalhe aqui foi preparado para despertar sua curiosidade científica!'} Prestem bastante atenção nos pontos principais!`,
    destaque: ws.resumo || 'Conhecimento é uma aventura mágica!',
    topicos: (ws.topicos && ws.topicos.length > 0) ? ws.topicos.slice(0, 3) : ['Conceito chave número 1', 'Conceito chave número 2']
  });

  // Slide 3: Tópicos aprofundados / Linha do tempo
  if (ws.topicos && ws.topicos.length > 3) {
    slides.push({
      id: 3,
      tipo: 'conceito',
      icone: '🔍',
      titulo: 'Explorando Mais a Fundo',
      subtitulo: 'Detalhes fascinantes do nosso estudo',
      falaCalisto: `Pelos meus cem anos de penas, aqui estão detalhes que quase ninguém percebe! Olhem só esses outros pontos incríveis!`,
      destaque: 'Fique atento para o quiz no final!',
      topicos: ws.topicos.slice(3)
    });
  }

  // Slide 4: Áudio Overview / Podcast do NotebookLM
  if (ws.audioUrl || ws.audioOverviewText) {
    slides.push({
      id: slides.length + 1,
      tipo: 'audio',
      icone: '🎙️',
      titulo: 'Áudio Overview do NotebookLM',
      subtitulo: 'Conversa e explicações sonoras',
      falaCalisto: `Hehehe! Chegou a hora do nosso Áudio Overview gerado no NotebookLM! Ouça os especialistas conversando e preste atenção aos detalhes!`,
      destaque: ws.audioOverviewText || 'Ouça o bate-papo explicativo dos especialistas do NotebookLM.',
      audioUrl: ws.audioUrl || '',
      topicos: [
        'Resumo em formato de conversa interativa',
        'Conexões entre os pontos mais importantes',
        'Dicas especiais do Calisto para fixar o conteúdo'
      ]
    });
  }

  // Slide 5: Curiosidades
  if (ws.curiosidades && ws.curiosidades.length > 0) {
    slides.push({
      id: slides.length + 1,
      tipo: 'curiosidade',
      icone: '💡',
      titulo: 'Baú de Segredos & Curiosidades',
      subtitulo: 'Fatos surpreendentes que vão te deixar de bico aberto!',
      falaCalisto: `Ai minhas penas! Vocês sabiam disso? Olha que curiosidades inacreditáveis eu descobri nos meus livros mágicos!`,
      destaque: 'Curiosidades de ouro do Calisto!',
      topicos: ws.curiosidades
    });
  }

  // Slide 6: Flashcards / Desafio Rápido
  if (ws.flashcards && ws.flashcards.length > 0) {
    const fc = ws.flashcards[0];
    slides.push({
      id: slides.length + 1,
      tipo: 'desafio',
      icone: '🃏',
      titulo: 'Desafio Rápido do Calisto',
      subtitulo: 'Teste sua memória antes do quiz!',
      falaCalisto: `Hora de testar a cabeça! Pense rápido: ${fc.pergunta}`,
      destaque: `❓ ${fc.pergunta}`,
      respostaDestaque: `💡 ${fc.resposta}`,
      topicos: [
        'Gire as engrenagens da mente!',
        'A resposta será revelada ao virar o cartão mágico.',
        'Pronto para o quiz final?'
      ]
    });
  }

  // Slide 7: Conclusão & Convite ao Quiz
  slides.push({
    id: slides.length + 1,
    tipo: 'conclusao',
    icone: '🏆',
    titulo: 'Missão Cumprida na Apresentação!',
    subtitulo: 'Agora é hora de ganhar estrelas e troféus!',
    falaCalisto: `Parabéns pela dedicação! Vocês acompanharam toda a apresentação como verdadeiros mestres! Agora vamos para o Quiz e para os Cartões Mágicos para ganhar estrelas e troféus!`,
    destaque: 'Você completou a apresentação com o Calisto! ⭐⭐⭐',
    topicos: [
      'Apresentação 100% concluída!',
      'Ganhe +3 Estrelas completando a Missão Desafio (Quiz).',
      'Treine a memória com todos os Cartões Mágicos.'
    ]
  });

  return slides;
}

// Exemplos prontos de exportação do NotebookLM para importação rápida
const NOTEBOOKLM_PRESETS = [
  {
    nome: "🚀 Guia de Estudo: Robótica & Inteligência Artificial Infantil",
    url: "https://notebooklm.google.com/notebook/robotica-ia-kids",
    rawContent: `# Guia de Estudo do NotebookLM: O Fantástico Mundo dos Robôs e da IA

## Resumo do Briefing
Os robôs são máquinas incríveis programadas por seres humanos para realizar tarefas úteis, desde aspirar a sala até explorar planetas distantes como Marte. A Inteligência Artificial (IA) é como o cérebro que ajuda o computador a aprender e tomar boas decisões.

## Tópicos Principais
- Um robô é composto por sensores (olhos e ouvidos), processador (cérebro) e atuadores (motores e braços).
- A Inteligência Artificial aprende reconhecendo padrões em muitos dados, assim como uma criança aprende a reconhecer fotos de gatinhos.
- Existem robôs que ajudam médicos em cirurgias, robôs que constroem carros e robôs que limpam a casa.
- A regra mais importante da robótica é que robôs devem sempre ajudar e proteger as pessoas e a natureza.

## Curiosidades
- O primeiro conceito de autômato foi imaginado na Grécia Antiga há mais de 2.000 anos!
- O robô Perseverance em Marte tem lasers para analisar rochas vermelhas!

## Glossário & Perguntas de Fixação (FAQ)
- O que é um sensor em um robô? | É como os olhos e ouvidos do robô para sentir o ambiente ao redor!
- O que é um algoritmo? | É uma receita passo a passo que diz ao computador exatamente o que fazer.
- Para que serve a IA nos robôs? | Para ajudá-los a reconhecer caminhos, desviar de obstáculos e tomar decisões espertas!

## Questões para Quiz
1. Qual parte do robô funciona como os "olhos" e "ouvidos" dele?
A) Bateria
B) Sensores
C) Rodas
D) Tinta
Correta: B
Explicação: Os sensores captam luz, sons e toques ao redor do robô!

2. O que é Inteligência Artificial (IA)?
A) Um brinquedo de madeira
B) Uma capacidade de computadores aprenderem e resolverem problemas
C) Um tipo de lâmpada colorida
D) Uma comida para robôs
Correta: B
Explicação: A IA é a tecnologia que permite que máquinas aprendam com exemplos!`
  },
  {
    nome: "🌊 Briefing Doc: O Mistério dos Recifes de Coral & Vida Marinha",
    url: "https://notebooklm.google.com/notebook/recifes-coral-oceanos",
    rawContent: `# Documento de Briefing NotebookLM: A Vida Secreta dos Corais e Oceanos

## Resumo do Briefing
Os recifes de coral são conhecidos como as florestas tropicais dos oceanos. Embora cubram menos de 1% do fundo do mar, abrigam mais de 25% de todas as espécies marinhas do planeta Terra!

## Tópicos Principais
- Os corais parecem pedras ou plantas, mas na verdade são pequenos animais chamados pólipos.
- Os corais vivem em parceria com algas microscópicas que lhes dão suas cores brilhantes e alimento através da luz solar.
- Tartarugas marinhas, peixes-palhaço, polvos e estrelas-do-mar dependem dos corais para morar e se proteger.
- Cuidar dos oceanos e evitar o plástico nas praias ajuda a manter os corais saudáveis e coloridos.

## Curiosidades
- A Grande Barreira de Corais na Austrália é tão colossal que pode ser vista do espaço sideral!
- Os polvos têm três corações e o sangue deles é azulado!

## Glossário & FAQ
- O que são corais na realidade? | São colônias de pequenos animais marinhos construtores chamados pólipos.
- Por que os corais perdem a cor quando a água esquenta? | Porque as algas parceiras vão embora quando a água fica muito quente.
- Quem é o amigo do peixe-palhaço no oceano? | A anêmona-do-mar, que o protege com seus tentáculos mágicos!

## Questões para Quiz
1. Os corais do oceano são:
A) Plantas aquáticas
B) Pequenos animais marinhos chamados pólipos
C) Rochas sem vida
D) Pedaços de plástico
Correta: B
Explicação: Os corais são animais vivos que formam grandes estruturas marinhas!

2. Quantos corações tem um polvo?
A) Um coração
B) Dois corações
C) Três corações
D) Nenhum coração
Correta: C
Explicação: Os polvos têm três corações incríveis e sangue azul!`
  }
];

function carregarWorkspaces() {
  const salvos = localStorage.getItem("CALISTO_CUSTOM_WORKSPACES");
  if (salvos) {
    try {
      const parsed = JSON.parse(salvos);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
      console.warn("Erro ao ler workspaces personalizados, usando os padrões.", e);
    }
  }
  return DEFAULT_WORKSPACES;
}

function salvarWorkspaces(novosDados) {
  localStorage.setItem("CALISTO_CUSTOM_WORKSPACES", JSON.stringify(novosDados));
}

function restaurarWorkspacesPadrao() {
  localStorage.removeItem("CALISTO_CUSTOM_WORKSPACES");
  return DEFAULT_WORKSPACES;
}

window.WORKSPACES_DATA = carregarWorkspaces();
window.DEFAULT_WORKSPACES = DEFAULT_WORKSPACES;
window.NOTEBOOKLM_PRESETS = NOTEBOOKLM_PRESETS;
window.gerarSlidesParaWorkspace = gerarSlidesParaWorkspace;
window.salvarWorkspaces = salvarWorkspaces;
window.restaurarWorkspacesPadrao = restaurarWorkspacesPadrao;

