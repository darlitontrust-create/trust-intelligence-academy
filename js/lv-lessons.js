/* =====================================================================
   lv-lessons.js — Aulas da trilha Lovable
   ---------------------------------------------------------------------
   27 aulas em 9 etapas (projeto-guia: NexusHub, portal dos lojistas):
     Nível 1 · Fundamentos → 1.1 Primeiros passos · 1.2 Prompts que
       funcionam · 1.3 Interface e design
     Nível 2 · Dados, login e funções → 2.1 Dados no Lovable Cloud ·
       2.2 Login e segurança · 2.3 Funcionalidades
     Nível 3 · Produção e produto → 3.1 Depuração · 3.2 Código, equipe
       e créditos · 3.3 Lançamento e produto
   Mesmo carrossel da Gestão e do Storytelling.
   Questões de prova: [pergunta, correta, errada1, errada2, errada3, explicação]
   Nomes de recursos conforme a documentação do Lovable em nov/2026
   (Plan, antes Chat; Build, antes Agent; Knowledge; Lovable Cloud; Drafts).
   ===================================================================== */
(function (global) {
  'use strict';
  const L = {}, MAP = {};
  function lesson(key, topic, kw, titulo, ideia, analogia, sintaxe, notas, exemplo, cuidados, quiz) {
    L[key] = { key: key, kw: kw, titulo: titulo, ideia: ideia, analogia: analogia, sintaxe: sintaxe, notas: notas, exemplo: exemplo, cuidados: cuidados, quiz: quiz };
    MAP[topic] = key;
  }
  const P = function (code, role, reply) { return { type: 'prompt', code: code, role: role || 'Prompt no Lovable', reply: reply, replyRole: 'O que o Lovable faz' }; };

  /* ============================ NÍVEL 1 · FUNDAMENTOS ============================ */
  // ---- Etapa 1.1 · Primeiros passos
  lesson('oque', 'O que é o Lovable', 'VIBE CODING', 'O que é o Lovable',
    'O Lovable é um construtor de aplicações com IA. Você descreve em português o que quer, e ele escreve o código, mostra a prévia e permite publicar com um link. Por baixo, é código de verdade (React, TypeScript e Tailwind) e, quando precisa de dados e login, um back-end gerenciado, o Lovable Cloud. Construir conversando ganhou o apelido de vibe coding.',
    'É como trabalhar com um desenvolvedor muito rápido que nunca se cansa: ele faz o que você pede, mas é você quem sabe o que o negócio precisa e quem confere se ficou certo.',
    'Você      → descreve o objetivo, o público e as telas\nLovable   → escreve o código e mostra a prévia\nVocê      → testa e pede ajustes\nCloud     → guarda dados, login e arquivos\nPublicar  → gera o link para os usuários',
    ['O código pode ir para o GitHub da empresa: você não fica preso à ferramenta.', 'Protótipos, ferramentas internas e portais simples são o ponto forte.', 'Quem constrói continua responsável por testes, segurança e privacidade.'],
    { p: 'O NexusHub, portal dos lojistas parceiros da NexusMarket:', c: 'Público  → lojistas parceiros e a equipe de parcerias\nProblema → pedidos e suporte espalhados em e-mails\nNúcleo   → login, pedidos da loja e chamados\nMeta     → piloto com 5 lojistas em 2 semanas', fig: { type: 'cards', items: [['Lojistas', 'Entram com e-mail e veem só a própria loja.'], ['Pedidos', 'Lista com status, filtros e detalhes.'], ['Chamados', 'Abrir e acompanhar pedidos de suporte.'], ['Admin', 'A equipe vê tudo e responde os chamados.']], speech: 'O NexusHub terá quatro áreas: lojistas, pedidos, chamados e a área da equipe.' } },
    ['Não publique sem testar só porque a IA disse que terminou.', 'Não trate o app como descartável se ele vai guardar dados reais.', 'Não espere que a IA adivinhe regras de negócio que você não contou.'],
    [['O Lovable é melhor descrito como:', 'Um construtor de aplicações com IA que gera código real a partir de conversas', 'Um editor de planilhas', 'Um serviço de hospedagem de e-mails', 'Uma linguagem de programação própria', 'Ele transforma descrições em apps com código padrão de mercado.'],
      ['Com o Lovable, quem garante que o app está correto e seguro?', 'Quem constrói, testando e revisando', 'Ninguém: a IA garante sozinha', 'Só o suporte do Lovable', 'Os usuários finais', 'A IA acelera; a responsabilidade continua sendo sua.'],
      ['O back-end integrado do Lovable, com banco, login e arquivos, se chama:', 'Lovable Cloud', 'Lovable Sheets', 'Lovable Drive', 'Lovable Mail', 'O Cloud reúne banco Postgres, autenticação e armazenamento.']]);

  lesson('modos', 'Plan e Build', 'MODOS', 'Plan e Build: pensar antes de construir',
    'O Lovable tem dois modos de conversa. No Plan (antes chamado Chat), ele discute, investiga o projeto e propõe um plano sem alterar o código. No Build (antes chamado Agent), ele executa: escreve e muda arquivos, roda ferramentas e verifica o resultado. O hábito que mais economiza tempo é planejar as mudanças grandes no Plan e só então aprovar para o Build construir.',
    'É a diferença entre conversar com o arquiteto sobre a planta e mandar o pedreiro levantar a parede. Mudar a planta é barato; derrubar parede, não.',
    'Plan   → perguntas, comparações, investigação de erros\n       → propõe um plano; não mexe no código\nAprovar → o plano vira tarefa para o Build\nBuild  → implementa, testa e mostra o resultado\nRegra  → dúvida ou mudança grande? comece no Plan',
    ['Ajuste o plano antes de aprovar: é o momento mais barato para mudar de ideia.', 'Para investigar um erro sem risco de quebrar mais coisas, use o Plan.', 'Tarefas pequenas e claras podem ir direto para o Build.'],
    { p: 'Planejando os chamados do NexusHub no Plan:', c: P('Quero que os lojistas abram chamados de suporte ligados a um pedido.\nA equipe da NexusMarket responde e muda o status (aberto, em andamento, resolvido).\nAntes de construir, proponha as tabelas, as telas e as regras de acesso.\nNão altere o código ainda.', 'Plan', 'Propõe 3 tabelas (chamados, mensagens, anexos), 4 telas e as regras: o lojista vê só os chamados da loja; a equipe vê todos. Aguarda sua aprovação.') },
    ['Não use o Build para “descobrir” o que fazer: você paga em retrabalho.', 'Não aprove um plano que você não entendeu.', 'Não repita o mesmo pedido no Build quando a causa do erro é desconhecida.'],
    [['O modo que conversa e planeja sem alterar o código é o:', 'Plan', 'Build', 'Publish', 'Cloud', 'O Plan (antes Chat) é para pensar e decidir.'],
      ['Uma funcionalidade grande deve começar:', 'Com um plano revisado no Plan', 'Direto no Build, ajustando depois', 'Pela publicação', 'Pela escolha das cores', 'Planejar é mais barato que desfazer.'],
      ['Para investigar por que a lista aparece vazia sem arriscar quebrar o app, use:', 'O Plan', 'O Build com “conserte”', 'A publicação', 'O domínio próprio', 'O Plan lê o projeto e raciocina sem mudar arquivos.']]);

  lesson('publicar', 'Prévia e publicação', 'PUBLICAR', 'Prévia, versões e publicação',
    'Tudo o que você constrói aparece primeiro na prévia, o ambiente de construção. Os usuários só veem as mudanças quando você publica (ou atualiza a publicação). Cada alteração gera uma versão no histórico, e você pode voltar a uma versão anterior quando algo dá errado. Antes de divulgar o link, teste o app publicado como se fosse um usuário.',
    'A prévia é o ensaio geral do teatro; a publicação é a estreia. Ninguém vende ingresso para o ensaio.',
    'Prévia    → onde você constrói e testa\nVersão    → cada mudança fica no histórico\nRestaurar → volta para uma versão boa\nPublicar  → leva a versão atual para o link público\nDivulgar  → só depois de testar o publicado',
    ['Restaurar uma versão é mais rápido do que pedir para a IA “lembrar” como era.', 'Mantenha o projeto privado: o editor descreve o seu negócio.', 'Teste o login com uma conta nova antes de enviar o link.'],
    { p: 'Roteiro antes de mandar o link para o piloto:', c: '1 → testar login, pedidos e chamados na prévia\n2 → revisar textos e permissões\n3 → publicar\n4 → testar de novo no link publicado\n5 → enviar aos 5 lojistas do piloto', fig: { type: 'chevrons', steps: [{ k: '1', t: 'Testar na prévia' }, { k: '2', t: 'Revisar' }, { k: '3', t: 'Publicar' }, { k: '4', t: 'Testar o publicado' }, { k: '5', t: 'Divulgar' }], speech: 'Teste, revise, publique, teste de novo e só então divulgue.' } },
    ['Não confunda prévia com app publicado.', 'Não divulgue antes de testar no link publicado.', 'Não compartilhe o editor do projeto com usuários finais.'],
    [['Uma mudança feita na prévia chega aos usuários quando:', 'Você publica ou atualiza a publicação', 'Você salva a mensagem', 'O usuário recarrega a página', 'A IA termina de responder', 'Prévia e app publicado são separados.'],
      ['A última mudança estragou o menu. O caminho mais rápido é:', 'Restaurar a versão anterior pelo histórico', 'Descrever o menu antigo de memória', 'Apagar o projeto', 'Publicar mesmo assim', 'Cada mudança gera uma versão restaurável.'],
      ['Depois de publicar, antes de divulgar, você deve:', 'Testar o app no link publicado', 'Apagar a prévia', 'Mudar o domínio', 'Desligar o login', 'O ambiente publicado pode ter diferenças.']]);

  // ---- Etapa 1.2 · Prompts que funcionam
  lesson('prompt', 'Anatomia do prompt', 'PROMPT', 'Anatomia de um bom prompt',
    'Um bom prompt diz o resultado esperado sem deixar a IA adivinhar. Ele traz o contexto (quem usa e para quê), o conteúdo (dados e elementos da tela), o comportamento (o que acontece em cada ação), as regras e o critério de aceite: como você vai saber que ficou certo. Também vale dizer o que não deve mudar.',
    'É como pedir uma reforma: “melhore a cozinha” rende surpresas; “troque a bancada por granito preto de 2 m e não mexa nos armários” rende o que você quer.',
    'Contexto      → quem usa a tela e para quê\nConteúdo      → dados e elementos que aparecem\nComportamento → o que acontece ao clicar, filtrar, enviar\nRegras        → restrições e o que não mudar\nAceite        → como saber que ficou certo',
    ['O formato “como [papel], quero [ação], para [benefício]” ajuda muito.', '“Melhore” e “deixe bonito” obrigam a IA a adivinhar.', 'Diga o que deve permanecer igual em mudanças pontuais.'],
    { p: 'Prompt da página de pedidos do NexusHub:', c: P('Como lojista, quero ver os pedidos da minha loja para acompanhar as entregas.\n\nCrie a página Pedidos com uma tabela: número, data, cliente, valor (R$) e status.\n- Filtro por status no topo.\n- Clique na linha abre o detalhe do pedido.\n- Ordem padrão: mais recentes primeiro.\n\nAceite: um lojista vê só os pedidos da própria loja e o filtro funciona.\nNão altere o menu nem a página Início.', 'Build') },
    ['Não junte várias telas num pedido só.', 'Não use elogios ou ameaças para “motivar” a IA: não muda o resultado.', 'Não esqueça o critério de aceite.'],
    [['Qual destes elementos define como saber se o pedido foi atendido?', 'Critério de aceite', 'Elogio à IA', 'Cor do botão', 'Nome do projeto', 'O aceite diz o resultado verificável.'],
      ['Para trocar só o texto de um botão, o prompt deve:', 'Dizer o alvo exato e que nada mais deve mudar', 'Pedir para revisar a página', 'Pedir um layout mais moderno', 'Repetir o pedido três vezes', 'Pedidos amplos convidam mudanças indesejadas.'],
      ['“Como lojista, quero abrir um chamado para receber ajuda” é um exemplo de:', 'História de usuário', 'Regra de banco de dados', 'Critério de design', 'Mensagem de erro', 'Papel, ação e benefício.']]);

  lesson('incremental', 'Construção incremental', 'INCREMENTAL', 'Construção incremental: um passo de cada vez',
    'Apps grandes são construídos em passos pequenos e testados. O primeiro prompt cria o esqueleto (objetivo, público, páginas e estilo). Depois, uma funcionalidade por vez: construir, testar na prévia, ajustar e só então seguir. Se a base ficou errada, é melhor replanejar ou voltar a uma versão do que remendar mensagem por mensagem.',
    'É montar um móvel seguindo o manual, peça por peça, conferindo cada encaixe. Apertar todos os parafusos de uma vez e só depois descobrir a peça trocada dá muito mais trabalho.',
    'Passo 1 → esqueleto: páginas, navegação e estilo\nPasso 2 → login\nPasso 3 → dados centrais (pedidos)\nPasso 4 → filtros e detalhes\nPasso 5 → funções extras (chamados)\nEntre cada passo → testar na prévia',
    ['Pedidos pequenos são fáceis de verificar e de desfazer.', 'Teste antes de empilhar a próxima mudança.', 'Base errada? Replaneje em vez de remendar.'],
    { p: 'A ordem de construção do NexusHub:', c: 'Esqueleto → Login → Pedidos → Filtros → Chamados\nCada passo: construir, testar, ajustar', fig: { type: 'chevrons', steps: [{ k: '1', t: 'Páginas e navegação' }, { k: '2', t: 'Login' }, { k: '3', t: 'Pedidos' }, { k: '4', t: 'Filtros e detalhe' }, { k: '5', t: 'Chamados' }], speech: 'Primeiro a base, depois o login, os pedidos, os filtros e por fim os chamados.' } },
    ['Não mande um prompt com 20 requisitos.', 'Não comece pelas funções que dependem de dados que ainda não existem.', 'Não insista em remendos quando a estrutura está errada.'],
    [['O primeiro prompt de um app deve trazer:', 'Objetivo, público, páginas principais e estilo geral', 'Todas as regras dos próximos meses', 'Só a cor da marca', 'Só o nome do app', 'O primeiro prompt cria o esqueleto.'],
      ['Entre uma funcionalidade e outra, o ideal é:', 'Testar a que acabou de ser feita', 'Pedir logo a próxima', 'Publicar sem testar', 'Mudar o design', 'Validar evita erro sobre erro.'],
      ['Depois de 15 mensagens a estrutura não faz sentido. A melhor decisão é:', 'Replanejar ou voltar a uma versão anterior', 'Continuar remendando', 'Ignorar e seguir', 'Pedir tudo de novo num prompt gigante', 'Base errada contamina o resto.']]);

  lesson('knowledge', 'Referências e Knowledge', 'KNOWLEDGE', 'Imagens, referências e Knowledge',
    'Imagens dão precisão: um rascunho no papel, um print de referência ou a tela atual com uma marcação valem por parágrafos de descrição. Já a Knowledge guarda instruções que o Lovable segue em todos os pedidos: o que é o produto, quem usa, regras de negócio estáveis e padrões de design e texto. Há a knowledge do workspace (vale para todos os projetos) e a do projeto (específica de cada app).',
    'A Knowledge é o crachá com as regras da casa que todo funcionário novo recebe. Ninguém precisa repetir as regras a cada tarefa.',
    'Imagem          → rascunho, print ou tela marcada + o que cada parte faz\nKnowledge projeto → contexto, usuários, regras, padrões do app\nKnowledge workspace → manual de marca e padrões da empresa\nNunca → senhas e chaves nas instruções',
    ['Referências servem para padrões de interface, não para copiar marca ou textos de terceiros.', 'Atualize a Knowledge quando uma decisão importante mudar.', 'Problemas pontuais vão na conversa, não na Knowledge.'],
    { p: 'Trecho da Knowledge do NexusHub:', c: P('# Produto\nNexusHub: portal dos lojistas parceiros da NexusMarket.\n\n# Usuários\nLojista: vê só a própria loja. Equipe NexusMarket: vê tudo.\n\n# Padrões\nPortuguês do Brasil, tom cordial.\nValores em R$ com 2 casas; datas dd/mm/aaaa.\nStatus sempre com texto, nunca só cor.', 'Knowledge do projeto') },
    ['Não coloque senhas, chaves ou dados pessoais na Knowledge.', 'Não copie logos, textos e imagens de outros sites.', 'Não deixe a Knowledge desatualizada.'],
    [['Instruções que o Lovable deve seguir em todos os pedidos ficam:', 'Na Knowledge', 'Em cada mensagem', 'No nome do projeto', 'Num arquivo local', 'A Knowledge é persistente.'],
      ['O manual de marca usado por vários apps da empresa fica na knowledge:', 'Do workspace', 'De cada mensagem', 'Do banco de dados', 'De um único projeto', 'Regras comuns ficam no nível do workspace.'],
      ['Nunca deve ir para a Knowledge:', 'A chave secreta de uma API', 'O público do app', 'O padrão de datas', 'As regras de acesso', 'Segredos ficam nos segredos do projeto.']]);

  // ---- Etapa 1.3 · Interface e design
  lesson('layout', 'Layout e navegação', 'LAYOUT', 'Layout, páginas e navegação',
    'Uma boa interface começa pelo mapa de páginas: poucas páginas, nomes claros e um menu igual em todas. Em cada tela, o topo mostra o que é mais importante e o que pede ação. E toda tela tem quatro estados que precisam ser pedidos: carregando, vazia, com erro e com dados.',
    'É a sinalização de um shopping: corredores com nomes claros, mapa igual em todos os andares e placas que dizem o que fazer quando uma loja está fechada.',
    'Mapa de páginas → Início, Pedidos, Chamados, Minha loja\nMenu            → o mesmo componente em todas as páginas\nTopo da tela    → indicadores e ações mais importantes\nEstados         → carregando, vazio, erro, com dados\nRegra           → registre o layout base na Knowledge',
    ['Estado vazio deve explicar o que fazer, não parecer defeito.', 'O mais importante fica no topo; histórico e detalhes, abaixo.', 'Um layout base único evita menus diferentes em cada página.'],
    { p: 'A página Início do NexusHub:', c: 'Topo    → Pedidos hoje · A enviar · Chamados abertos\nMeio    → Últimos pedidos (5) com atalho para todos\nLateral → Avisos da NexusMarket\nVazio   → “Você ainda não tem pedidos. Veja como divulgar sua loja.”', fig: { type: 'table', cols: ['Estado', 'O que a tela mostra'], rows: [['Carregando', 'Esqueleto dos cards e da lista'], ['Vazio', 'Mensagem e próximo passo'], ['Erro', 'Aviso e botão Tentar de novo'], ['Com dados', 'Indicadores e lista de pedidos']], speech: 'Toda tela tem quatro estados: carregando, vazio, erro e com dados.' } },
    ['Não crie uma página para cada pequeno relatório.', 'Não deixe telas em branco sem explicação.', 'Não use dados falsos para disfarçar a tela vazia.'],
    [['Os quatro estados de uma tela de lista são:', 'Carregando, vazio, erro e com dados', 'Aberto, fechado, pausado e ativo', 'Claro, escuro, alto contraste e cinza', 'Rascunho, revisão, aprovado e publicado', 'Peça todos de forma explícita.'],
      ['O topo da página Início deve mostrar:', 'Os indicadores e ações mais importantes', 'Um texto longo de boas-vindas', 'A tabela completa do ano', 'Só o logo', 'O topo é o espaço mais valioso.'],
      ['Para o menu ficar igual em todas as páginas, o melhor é:', 'Um layout base único registrado na Knowledge', 'Ajustar página por página', 'Não ter menu', 'Um menu por página', 'Consistência vem de um componente comum.']]);

  lesson('design', 'Design e edição visual', 'DESIGN', 'Design system e edição visual',
    'Um design system reúne as decisões visuais do app: cores, fontes, espaçamentos e componentes padrão (botões, cards, tabelas). Com ele, mudar a cor primária uma vez atualiza tudo. Para ajustes pontuais de texto, cor ou espaçamento, a edição visual direto na prévia é mais rápida que um prompt. Comportamento, dados e regras continuam pedindo prompt.',
    'É o uniforme de uma empresa: definido uma vez, todos usam igual. Ninguém escolhe a cor da própria camisa a cada dia.',
    'Design system → cores, fontes, espaçamentos, componentes\nDestaque      → cor só para o que pede ação\nEdição visual → textos, cores e espaços pontuais\nPrompt        → comportamento, dados e regras\nIdentidade    → paleta e tom da marca na Knowledge',
    ['Se tudo é destaque, nada é: use cor com intenção.', 'Componentes com campos definidos podem ser reaproveitados.', '“Deixe mais bonito” não dá direção; diga paleta, fonte e tom.'],
    { p: 'Onde fazer cada ajuste:', c: 'Trocar “Enviar” por “Abrir chamado” → edição visual\nAumentar o espaço entre cards       → edição visual\nFiltro por período                  → prompt no Build\nAlerta de pedido atrasado           → prompt no Build', fig: { type: 'table', cols: ['Ajuste', 'Caminho'], rows: [['Texto de um botão', 'Edição visual'], ['Espaçamento', 'Edição visual'], ['Novo filtro', 'Prompt'], ['Regra de alerta', 'Prompt']], speech: 'Aparência pontual vai na edição visual; comportamento vai no prompt.' } },
    ['Não ajuste cores tela por tela.', 'Não escreva valores fixos dentro de componentes reutilizáveis.', 'Não peça “mais moderno” sem dizer o que isso significa.'],
    [['Um design system centraliza:', 'Cores, fontes, espaçamentos e componentes', 'As senhas do app', 'Os pedidos dos clientes', 'As regras de acesso', 'Decisões visuais em um lugar só.'],
      ['Para trocar o texto de um botão, o caminho mais eficiente é:', 'A edição visual na prévia', 'Um prompt longo no Build', 'Recriar a página', 'Editar o banco de dados', 'Ajuste pontual de aparência.'],
      ['Na lista de pedidos, o atrasado deve:', 'Ganhar cor e ícone de alerta, com o resto neutro', 'Ficar igual aos outros', 'Ter fonte menor', 'Sumir da lista', 'Destaque com intenção.']]);

  lesson('responsivo', 'Responsivo e acessível', 'RESPONSIVO', 'Responsivo e acessível',
    'Muitos usuários vão abrir o app no celular. Tabelas largas viram listas de cards com o essencial e detalhe ao toque. Acessibilidade garante que todos consigam usar: contraste suficiente, botões com texto ou rótulo, navegação pelo teclado, texto alternativo em imagens importantes e nenhuma informação transmitida só pela cor.',
    'É como uma calçada com rampa: feita para quem usa cadeira de rodas, ajuda também quem empurra carrinho de bebê ou mala.',
    'Celular       → cards com o essencial; detalhe ao tocar\nContraste     → texto legível sobre o fundo\nRótulos       → botões com texto, não só ícone\nTeclado       → tudo alcançável sem mouse\nCor           → sempre com texto ou ícone junto\nTeste         → prévia no tamanho de celular + aparelho real',
    ['Teste os fluxos completos no celular, não só a página inicial.', 'Status com bolinha colorida precisa de texto ao lado.', 'Fonte minúscula para “caber” não resolve o celular.'],
    { p: 'Lista de pedidos no celular:', c: 'Computador → tabela com 6 colunas\nCelular    → card: nº do pedido · valor · status (texto + cor)\n             toque abre o detalhe completo', fig: { type: 'cards', items: [['#48213 · R$ 389,90', 'Status: Atrasado (ícone de alerta)'], ['#48207 · R$ 129,00', 'Status: Enviado'], ['#48199 · R$ 1.020,00', 'Status: Entregue']], speech: 'No celular, cada pedido vira um card com número, valor e status escrito.' } },
    ['Não force a tabela larga com rolagem lateral no celular.', 'Não use só cor para indicar status.', 'Não esqueça de testar num aparelho de verdade.'],
    [['No celular, uma tabela de 8 colunas deve virar:', 'Uma lista de cards com o essencial e detalhe ao toque', 'Uma tabela com fonte menor', 'Uma imagem da tabela', 'Uma página escondida', 'Telas pequenas pedem outro formato.'],
      ['Indicar status apenas com cores é um problema porque:', 'Quem não distingue cores não entende a informação', 'Fica colorido demais', 'O banco não aceita cores', 'Atrapalha o login', 'Cor deve vir com texto ou ícone.'],
      ['É um item de acessibilidade:', 'Navegação possível pelo teclado', 'Animação em todas as páginas', 'Fonte decorativa nos títulos', 'Ícones sem rótulo', 'Teclado, contraste, rótulos e texto alternativo.']]);

  /* ======================= NÍVEL 2 · DADOS, LOGIN E FUNÇÕES ======================= */
  // ---- Etapa 2.1 · Dados no Lovable Cloud
  lesson('banco', 'Banco de dados', 'BANCO', 'Banco de dados no Lovable Cloud',
    'Quando os dados precisam persistir e ser compartilhados (pedidos, chamados, lojas), o app precisa de um banco. O Lovable Cloud oferece um banco Postgres gerenciado, além de login, armazenamento de arquivos e funções de servidor, tudo administrado pelo painel do projeto. Você pede as tabelas descrevendo campos, valores permitidos e ligações, e confere os dados direto no painel.',
    'Os dados de exemplo no código são como anotar pedidos num post-it colado na tela. O banco é o arquivo da empresa: organizado, compartilhado e guardado.',
    'Tabela   → um tipo de coisa (lojas, pedidos, chamados)\nColuna   → um atributo (status, valor, data)\nLinha    → um registro (o pedido #48213)\nPedido   → campos + valores permitidos + ligações\nConferir → painel do Cloud, direto na tabela',
    ['Configurações visuais ficam no código, não no banco.', 'Use dados de teste realistas, marcados e removidos antes do lançamento.', 'Para investigar “sumiu”, confira primeiro se o registro existe no banco.'],
    { p: 'Pedido da tabela de chamados:', c: P('Crie a tabela chamados com:\n- loja_id (ligada à tabela lojas)\n- pedido_id (opcional, ligada a pedidos)\n- assunto (texto, obrigatório)\n- descricao (texto, obrigatório)\n- status: aberto | em andamento | resolvido\n- prioridade: alta | média | baixa\n- criado_em e atualizado_em', 'Build') },
    ['Não use dados pessoais reais em testes.', 'Não guarde dados importantes só no navegador do usuário.', 'Não peça “um banco” sem dizer os campos.'],
    [['Dados que precisam persistir e ser compartilhados entre usuários devem ficar:', 'Num banco de dados', 'No código da página', 'No navegador de cada usuário', 'Na Knowledge', 'O banco é o lugar dos dados do negócio.'],
      ['O banco do Lovable Cloud é baseado em:', 'Postgres', 'Planilhas Excel', 'Arquivos de texto', 'E-mails', 'Banco relacional gerenciado.'],
      ['Um lojista diz que o chamado sumiu. Primeiro você:', 'Confere no painel se o registro existe na tabela', 'Recria a tabela', 'Pede para ele abrir outro', 'Publica de novo', 'Separe gravação de exibição.']]);

  lesson('relacoes', 'Tabelas e relacionamentos', 'RELACIONAMENTO', 'Tabelas e relacionamentos',
    'Bancos relacionais evitam repetição ligando tabelas por chaves. Uma loja tem muitos pedidos: cada pedido guarda só o loja_id. Quando a relação é de muitos para muitos (um gerente cuida de várias lojas e uma loja tem vários usuários), cria-se uma tabela de ligação. Campos com valores fixos, como status, devem ter a lista de valores permitidos definida no banco.',
    'É o RG nas fichas: em vez de copiar o endereço da pessoa em cada documento, você anota o número e consulta o cadastro quando precisar.',
    'Um para muitos   → pedidos.loja_id → lojas.id\nMuitos para muitos → usuarios_lojas (usuario_id, loja_id)\nSem repetição     → dado guardado uma vez, ligado pela chave\nValores fixos     → status só aceita a lista definida\nOrdem             → entidades → campos → ligações → revisar → criar',
    ['Dados repetidos ficam inconsistentes quando algo muda.', 'Mudar o modelo depois de ter dados é bem mais trabalhoso: revise no Plan.', 'Lista fechada de valores mantém filtros e relatórios confiáveis.'],
    { p: 'O modelo do NexusHub:', c: 'lojas (id, nome, cidade)\npedidos (id, loja_id → lojas, valor, status)\nchamados (id, loja_id → lojas, pedido_id → pedidos, status)\nusuarios_lojas (usuario_id, loja_id)', fig: { type: 'table', cols: ['Tabela', 'Liga com', 'Tipo'], rows: [['pedidos', 'lojas', 'Muitos pedidos para uma loja'], ['chamados', 'lojas e pedidos', 'Muitos chamados para uma loja'], ['mensagens', 'chamados', 'Muitas mensagens por chamado'], ['usuarios_lojas', 'usuários e lojas', 'Muitos para muitos']], speech: 'Cada tabela se liga às outras por chaves, sem repetir dados.' } },
    ['Não repita nome e endereço da loja em cada pedido.', 'Não guarde listas dentro de uma coluna de texto.', 'Não deixe status como texto livre.'],
    [['Uma loja tem muitos pedidos. O pedido deve guardar:', 'O loja_id', 'Todos os dados da loja', 'Nada sobre a loja', 'O nome do gerente', 'A chave liga sem repetir.'],
      ['Relação de muitos para muitos exige:', 'Uma tabela de ligação', 'Uma coluna de texto com a lista', 'Duplicar os registros', 'Uma tabela por loja', 'Ex.: usuarios_lojas.'],
      ['Para evitar “resolvdo” e “Resolvido” no status:', 'Restringir a uma lista de valores permitidos', 'Pedir atenção ao digitar', 'Corrigir à mão', 'Aceitar as variações', 'Consistência garantida pelo banco.']]);

  lesson('crud', 'CRUD', 'CRUD', 'Criar, ler, atualizar e excluir',
    'Quase toda tela é uma combinação de quatro operações: criar, ler, atualizar e excluir (CRUD). Bons pedidos descrevem cada uma: o formulário de criação, a lista e o detalhe, a edição com valores atuais e a exclusão com confirmação. Em listas grandes, peça paginação e filtros feitos no banco. Muitas vezes, arquivar é melhor do que excluir.',
    'É a rotina de qualquer arquivo de escritório: abrir uma pasta nova, consultar, atualizar uma ficha e, de vez em quando, arquivar o que não se usa mais.',
    'Create → formulário com validação e feedback\nRead   → lista paginada + detalhe\nUpdate → valores atuais, salvar, cancelar\nDelete → confirmação; prefira arquivar\nListas grandes → paginação e filtros no banco',
    ['Ações destrutivas sempre pedem confirmação.', 'Arquivar preserva o histórico para auditoria.', 'Carregar 12 mil linhas de uma vez deixa tudo lento.'],
    { p: 'O CRUD dos chamados:', c: 'Criar     → lojista abre chamado (assunto, descrição, pedido)\nLer       → lista da loja + detalhe com mensagens\nAtualizar → equipe muda status e responsável\nArquivar  → resolvidos há mais de 90 dias saem da lista', fig: { type: 'cards', items: [['Criar', 'Lojista abre um chamado.'], ['Ler', 'Lista e detalhe com mensagens.'], ['Atualizar', 'Equipe muda o status.'], ['Excluir/arquivar', 'Com confirmação; histórico preservado.']] } },
    ['Não exclua definitivamente o que pode ser útil para auditoria.', 'Não salve a cada tecla sem avisar.', 'Não carregue todos os registros de uma vez.'],
    [['CRUD significa:', 'Criar, ler, atualizar e excluir', 'Calcular, revisar, unir e dividir', 'Copiar, recortar, usar e desfazer', 'Conectar, rodar, usar e depurar', 'As quatro operações básicas.'],
      ['Para chamados antigos resolvidos, a opção mais segura é:', 'Arquivar mantendo o histórico', 'Excluir tudo de vez', 'Apagar a tabela', 'Deixar na lista principal', 'Histórico serve para auditoria.'],
      ['Uma loja com 12 mil pedidos deixou a página lenta. Peça:', 'Paginação e filtros feitos no banco', 'Carregar tudo de uma vez', 'Excluir pedidos', 'Uma tela maior', 'Traga só o necessário.']]);

  // ---- Etapa 2.2 · Login e segurança
  lesson('login', 'Login e cadastro', 'LOGIN', 'Login e cadastro',
    'Sem saber quem é o usuário, não há como mostrar só os dados dele. A autenticação identifica a pessoa: e-mail e senha, login com Google ou link mágico por e-mail. Em portais de parceiros, o cadastro costuma ser por convite ou aprovação. As páginas internas precisam exigir login, e o fluxo de “esqueci a senha” é obrigatório.',
    'É a portaria de um prédio comercial: só entra quem se identifica, e cada um recebe o crachá do andar onde trabalha.',
    'Identificar → e-mail e senha, Google ou link mágico\nCadastro    → por convite ou aprovação da equipe\nVínculo     → usuário ligado à(s) sua(s) loja(s)\nRotas       → páginas internas exigem login\nSenha       → redefinição por e-mail; nunca exibir',
    ['Esconder o link não é controle de acesso.', 'Senha única compartilhada não identifica ninguém.', 'Teste o cadastro com uma conta nova, do zero.'],
    { p: 'Fluxo de entrada de um lojista novo:', c: 'Convite → cria conta → confirma e-mail → primeiro login\n       → vinculado à loja → vê os próprios pedidos', fig: { type: 'flow', steps: [{ t: 'start', label: 'Lojista recebe o convite' }, { label: 'Cria a conta e confirma o e-mail' }, { t: 'dec', label: 'Está vinculado a uma loja?', no: 'Equipe vincula' }, { t: 'end', label: 'Vê os pedidos da própria loja' }], speech: 'O lojista recebe o convite, cria a conta, é vinculado à loja e só então vê os dados.' } },
    ['Não deixe o cadastro aberto para qualquer pessoa num portal de parceiros.', 'Não proteja páginas só escondendo o menu.', 'Não mostre senhas na tela.'],
    [['Antes de mostrar os pedidos de uma loja, o app precisa:', 'Saber quem é o usuário (autenticação)', 'Mudar a cor do tema', 'Ter domínio próprio', 'Ter muitos dados', 'Login vem antes das regras de acesso.'],
      ['Em um portal de parceiros, o cadastro ideal é:', 'Por convite ou aprovação', 'Aberto a qualquer pessoa', 'Com senha única para todos', 'Sem senha', 'Controle de quem entra.'],
      ['Abrir /pedidos sem estar logado deve:', 'Redirecionar para a tela de entrada', 'Mostrar os pedidos', 'Mostrar uma tela em branco', 'Pedir o nome da loja', 'Rotas internas exigem sessão.']]);

  lesson('rls', 'Regras de acesso (RLS)', 'RLS', 'Regras de acesso no banco (RLS)',
    'Filtrar dados na tela é conveniência, não segurança: quem souber consultar o banco direto vê o que o filtro escondia. A proteção de verdade são as regras de acesso por linha (Row Level Security): o próprio banco só devolve e só aceita gravar as linhas que o usuário pode. Papéis, como lojista e equipe, ficam numa tabela que o usuário não consegue alterar.',
    'O filtro na tela é a cortina do provador; a RLS é a fechadura do cofre. A cortina esconde, a fechadura protege.',
    'Leitura  → só pedidos das lojas ligadas ao usuário\nEscrita  → só chamados para a própria loja\nPapéis   → tabela própria; usuário não se promove\nTeste    → entrar como loja A e tentar ver a loja B\nAlerta   → tabela sem RLS = prioridade máxima',
    ['Estar logado não significa poder ver tudo.', 'Teste como atacante: outra loja, sem login, tentando virar admin.', 'Use a verificação de segurança do Lovable e entenda cada alerta.'],
    { p: 'Regra de leitura de pedidos, em linguagem simples:', c: P('Ative as regras de acesso (RLS) na tabela pedidos:\n- Lojista: lê apenas pedidos cujo loja_id está em usuarios_lojas para ele.\n- Equipe (papel admin na tabela papeis): lê todos.\n- Ninguém altera a tabela papeis, exceto admins.\nDepois, explique cada regra criada.', 'Build') },
    ['Não confie em filtros da tela para proteger dados.', 'Não guarde o papel de admin num campo que o usuário edita.', 'Não teste segurança só com a conta de admin.'],
    [['A proteção real para que um lojista não veja pedidos de outro fica:', 'Nas regras de acesso do banco (RLS)', 'No filtro da tela', 'No menu', 'Na cor da tabela', 'O banco aplica a regra para qualquer acesso.'],
      ['O papel de admin deve ser guardado:', 'Numa tabela que o próprio usuário não altera', 'No perfil editável do usuário', 'No navegador', 'No nome do usuário', 'Evita autopromoção.'],
      ['Um bom teste de RLS é:', 'Entrar como loja A e tentar abrir um pedido da loja B', 'Entrar só como admin', 'Trocar as cores', 'Publicar e esperar', 'Teste como quem tenta burlar.']]);

  lesson('segredos', 'Chaves e segredos', 'SEGREDOS', 'Chaves e segredos',
    'Tudo o que roda no navegador pode ser visto pelo usuário. Por isso, chaves de APIs, senhas de serviços e chaves de pagamento ficam nos segredos do projeto e só são usadas por funções no servidor. A função recebe o pedido do app, usa a chave e devolve só o resultado. Se uma chave vazar, gere outra e invalide a antiga.',
    'A chave do cofre fica com o gerente, não pendurada na porta da loja. O cliente pede, o gerente abre e entrega só o que foi pedido.',
    'Segredos   → chaves e senhas do projeto\nServidor   → funções que usam a chave\nNavegador  → nunca recebe a chave\nVazou?     → revogar, gerar nova, atualizar\nBoas práticas → uma chave por serviço, permissão mínima, troca periódica',
    ['Apagar a mensagem com a chave não desfaz a exposição.', 'Chaves com permissão mínima limitam o estrago de um vazamento.', 'Knowledge e prompts não são lugar de segredo.'],
    { p: 'Consulta ao rastreio da transportadora:', c: 'App (navegador) → pede o rastreio do pedido #48213\nFunção (servidor) → lê a chave nos segredos → chama a API\nFunção → devolve só: status, cidade, previsão\nNavegador → nunca vê a chave', fig: { type: 'flow', steps: [{ t: 'start', label: 'Lojista abre o pedido' }, { label: 'App chama a função do servidor' }, { label: 'Função usa a chave guardada nos segredos' }, { t: 'end', label: 'App recebe só o status do rastreio' }], speech: 'A chave fica no servidor; o navegador recebe apenas o resultado.' } },
    ['Não escreva chaves no código da página.', 'Não compartilhe chaves por mensagem.', 'Não use a mesma chave em todos os projetos.'],
    [['A chave secreta de uma API deve ficar:', 'Nos segredos do projeto, usada só no servidor', 'No código da página', 'Na Knowledge', 'No prompt', 'O navegador é público.'],
      ['Uma chave foi exposta por engano. O certo é:', 'Revogar e gerar uma nova', 'Apagar a mensagem', 'Renomear a variável', 'Esperar', 'Exposta = comprometida.'],
      ['Uma função de servidor serve para:', 'Usar segredos e devolver só o resultado ao app', 'Mostrar a chave ao usuário', 'Mudar cores', 'Substituir o banco', 'Ela é o intermediário seguro.']]);

  // ---- Etapa 2.3 · Funcionalidades
  lesson('formularios', 'Formulários e validação', 'VALIDAÇÃO', 'Formulários e validação',
    'Formulário bom pede só o necessário, valida na tela para orientar e valida também no servidor ou no banco para garantir. As mensagens de erro aparecem junto do campo e dizem como corrigir. Durante o envio, o botão fica desabilitado com “Enviando…”, evitando duplicidade. Coletar só o necessário também é exigência da LGPD.',
    'É o atendente que confere a ficha com você no balcão (validação na tela) e o sistema que recusa a ficha incompleta mesmo assim (validação no servidor).',
    'Campos      → só o necessário para a finalidade\nTela        → valida e orienta, campo a campo\nServidor    → garante a regra de verdade\nEnvio       → botão desabilitado + “Enviando…”\nFim         → sucesso claro ou erro com instrução',
    ['“Erro 400” não ajuda ninguém: diga o que corrigir.', 'Não apague o que o usuário digitou quando houver erro.', 'CPF, renda e nascimento só se forem realmente necessários.'],
    { p: 'Regras do formulário de chamado:', c: 'Assunto    → obrigatório, até 120 caracteres\nDescrição  → pelo menos 20 caracteres\nPedido     → escolhido da lista da própria loja\nPrioridade → alta, média ou baixa\nErro       → “Descreva o problema em pelo menos 20 caracteres”', fig: { type: 'flow', steps: [{ t: 'start', label: 'Lojista preenche' }, { t: 'dec', label: 'Campos válidos na tela?', no: 'Mostra o erro no campo' }, { label: 'Botão: Enviando…' }, { t: 'dec', label: 'Servidor confirma?', no: 'Mensagem de erro clara' }, { t: 'end', label: 'Chamado aberto' }] } },
    ['Não valide só na tela.', 'Não peça dados pessoais sem finalidade.', 'Não deixe o botão ativo durante o envio.'],
    [['A validação deve existir:', 'Na tela e também no servidor ou banco', 'Só na tela', 'Só no banco', 'Em nenhum lugar', 'Uma orienta, a outra garante.'],
      ['Chamados duplicados por clique duplo se evitam com:', 'Botão desabilitado durante o envio', 'Pedido para clicar uma vez', 'Limpeza semanal', 'Botão maior', 'Estado de envio.'],
      ['Pedir só os dados necessários atende ao princípio da LGPD de:', 'Minimização', 'Portabilidade', 'Anonimização', 'Publicidade', 'Colete só o necessário.']]);

  lesson('arquivos', 'Upload e armazenamento', 'ARQUIVOS', 'Upload e armazenamento de arquivos',
    'Arquivos (fotos, PDFs, notas fiscais) ficam no armazenamento de arquivos do Cloud; o banco guarda só a referência. Defina tipos aceitos, tamanho máximo e mostre o progresso. Anexos de chamados são privados: ficam em local protegido, com as mesmas regras de acesso dos dados, e são abertos por links temporários. Imagens grandes devem ser comprimidas e exibidas como miniaturas.',
    'O banco é o índice da biblioteca; o storage é a estante. O índice diz onde está o livro, mas não guarda o livro dentro dele.',
    'Storage   → o arquivo em si\nBanco     → caminho, tipo, tamanho, quem enviou\nRegras    → tipos permitidos e tamanho máximo\nPrivado   → anexos com regras de acesso e links temporários\nDesempenho → compressão e miniaturas',
    ['Anexo de chamado não deve ser público na internet.', 'Defina por quanto tempo os arquivos ficam guardados.', 'Fotos de celular costumam ser pesadas: comprima antes de salvar.'],
    { p: 'Banco ou storage?', c: 'Foto do produto avariado → storage (privado)\nPDF da nota fiscal       → storage (privado)\nCaminho do arquivo       → banco\nStatus do chamado        → banco', fig: { type: 'table', cols: ['Item', 'Onde fica'], rows: [['Foto do produto', 'Armazenamento'], ['PDF da nota', 'Armazenamento'], ['Caminho do arquivo', 'Banco'], ['Status do chamado', 'Banco']] } },
    ['Não guarde arquivos como texto no banco.', 'Não aceite qualquer tipo e tamanho de arquivo.', 'Não deixe anexos sensíveis com link público permanente.'],
    [['Fotos anexadas a chamados devem ficar:', 'No armazenamento de arquivos, com o caminho no banco', 'Dentro de uma coluna de texto', 'No e-mail da equipe', 'No código', 'Storage para arquivos, banco para referências.'],
      ['Anexos sensíveis devem ser:', 'Privados, com links temporários para quem pode ver', 'Públicos para facilitar', 'Enviados por e-mail', 'Convertidos em texto', 'Mesmas regras dos dados.'],
      ['Fotos de 8 MB deixam a tela lenta. Peça:', 'Compressão e miniaturas nas listas', 'Limite de 50 MB', 'Proibir fotos', 'Mostrar em tamanho original', 'Otimize antes de salvar.']]);

  lesson('integracoes', 'Integrações', 'INTEGRAÇÕES', 'APIs, e-mails e pagamentos',
    'Integrações conectam o app a outros serviços: e-mails automáticos quando o chamado é respondido, rastreio da transportadora, pagamentos. O padrão é sempre o mesmo: um evento do app aciona uma função no servidor, que usa a credencial guardada nos segredos. Para pagamentos, use um provedor especializado: seu app nunca guarda números de cartão.',
    'É a central telefônica da empresa: os setores pedem a ligação, a central disca com as credenciais dela e passa só a resposta.',
    'Evento     → status mudou, chamado respondido, pedido criado\nFunção     → roda no servidor com a chave dos segredos\nServiço    → e-mail, rastreio, pagamento\nFalha      → plano se o serviço estiver fora do ar\nPagamento  → provedor especializado; sem cartão no seu banco',
    ['Informe a documentação da API e o que você quer buscar.', 'Considere limites de uso e custos do serviço.', 'Avalie quais dados pessoais vão para o serviço externo.'],
    { p: 'Aviso por e-mail quando o chamado é respondido:', c: P('Quando a equipe responder um chamado ou mudar o status para Resolvido,\nenvie um e-mail ao lojista responsável pela loja, com:\n- assunto do chamado e novo status\n- link para abrir o chamado no NexusHub\nUse o serviço de e-mail configurado nos segredos (EMAIL_API_KEY).\nSe o envio falhar, registre o erro e tente de novo depois.', 'Build') },
    ['Não chame APIs externas direto do navegador com chaves secretas.', 'Não guarde dados de cartão no seu banco.', 'Não integre sem saber o que acontece quando o serviço cai.'],
    [['Para cobrar dos lojistas com cartão, o correto é:', 'Usar um provedor de pagamentos especializado', 'Salvar o cartão no banco', 'Pedir o cartão por e-mail', 'Criar um formulário próprio de cartão', 'Dados de cartão exigem padrões rígidos.'],
      ['Um e-mail automático deve ser enviado por:', 'Uma função no servidor acionada por um evento', 'O navegador do lojista', 'Um texto fixo na página', 'A Knowledge', 'Eventos disparam funções no servidor.'],
      ['Antes de integrar um serviço, verifique:', 'O que acontece se ele estiver fora do ar', 'A cor do logo dele', 'Se ele tem modo escuro', 'Se o nome é curto', 'Falhas, custos, privacidade e permissões.']]);

  /* ======================== NÍVEL 3 · PRODUÇÃO E PRODUTO ======================== */
  // ---- Etapa 3.1 · Depuração
  lesson('erros', 'Erros e correções', 'ERROS', 'Ler erros e corrigir com método',
    'Corrigir bem começa por um bom relato: o que você fez, o que esperava, o que aconteceu, a mensagem de erro e o dispositivo. Mensagens técnicas ficam no console do navegador e nos registros das funções e do banco. O método é reproduzir, coletar, investigar no Plan, corrigir no Build e retestar o caso e os vizinhos. A correção automática ajuda, mas se o erro volta, pare e investigue.',
    'É uma consulta médica: sintomas descritos com precisão e exames na mão levam ao diagnóstico certo. “Estou mal, me dá um remédio” não.',
    'Reproduzir → o erro acontece sempre? em que passos?\nColetar    → mensagem exata, print, dispositivo\nInvestigar → no Plan, com hipóteses\nCorrigir   → no Build, mudança específica\nRetestar   → o caso e os fluxos vizinhos',
    ['Classifique a origem: interface, dados e permissões ou serviço externo.', 'Erro só no publicado costuma ser configuração (domínio, URLs, segredos).', 'Copie a mensagem exata, não um resumo dela.'],
    { p: 'Relato de bug para o Lovable:', c: P('Passos: entrei como lojista da Loja Centro (celular, Chrome),\nabri Pedidos e cliquei em Abrir chamado no pedido #48213.\nEsperado: abrir o formulário.\nAconteceu: nada; o console mostra\n"permission denied for table chamados".\nInvestigue a causa no Plan antes de mudar o código.', 'Plan', 'Identifica que a regra de escrita da tabela chamados não considera usuários vinculados por usuarios_lojas e propõe ajustar a regra.') },
    ['Não mande “não funciona, conserte”.', 'Não clique em corrigir dez vezes seguidas.', 'Não reescreva a tela inteira por um erro de permissão.'],
    [['Um bom relato de bug inclui:', 'Passos, esperado, ocorrido, mensagem de erro e dispositivo', 'Só “não funciona”', 'Só um print', 'A cor da tela', 'Evidência leva à causa.'],
      ['Detalhes técnicos de um “Algo deu errado” ficam:', 'No console do navegador e nos logs', 'Na Knowledge', 'No nome do projeto', 'No histórico de cores', 'Copie a mensagem exata.'],
      ['Na prévia funciona e no publicado o login falha. Verifique primeiro:', 'Configurações do ambiente, como URLs de redirecionamento e segredos', 'A cor do botão', 'O texto do rodapé', 'A fonte', 'Diferenças de ambiente.']]);

  lesson('versoes', 'Versões e histórico', 'VERSÕES', 'Versões, drafts e ambientes',
    'Antes de mudanças grandes, marque a versão estável ou trabalhe num draft: uma cópia separada, com chat e prévia próprios, que só entra no projeto se você aceitar. Restaurar o código não desfaz automaticamente as mudanças já aplicadas no banco, então mudanças de estrutura pedem cuidado. Para não misturar testes e clientes, separe ambiente de teste e de produção.',
    'É salvar o jogo antes do chefão: se der errado, você volta ao ponto seguro em vez de recomeçar a fase inteira.',
    'Versão estável → ponto de retorno marcado\nDraft          → experimento em cópia separada\nRestaurar      → volta o código, não o banco\nAmbientes      → teste × produção, bancos separados\nRegistro       → o que mudou em cada publicação',
    ['Depois de restaurar, reaplique só o que era bom, de forma específica.', 'Dados de teste no meio de dados reais confundem todo mundo.', 'Anote as mudanças de cada publicação para a equipe.'],
    { p: 'Experimentando um novo layout da página Início:', c: 'Projeto principal → estável, publicado\nDraft “Início v2” → novo layout, testado à parte\nAceitar o draft   → as mudanças entram no projeto\nExcluir o draft   → tudo descartado', fig: { type: 'flow', steps: [{ t: 'start', label: 'Criar draft a partir do projeto' }, { label: 'Construir e testar o novo layout' }, { t: 'dec', label: 'Ficou melhor?', no: 'Excluir o draft' }, { t: 'end', label: 'Aceitar: entra no projeto' }] } },
    ['Não faça mudanças grandes direto no que está em produção sem ponto de retorno.', 'Não espere que restaurar o código desfaça mudanças do banco.', 'Não teste com dados de clientes reais.'],
    [['Um draft no Lovable é:', 'Uma cópia separada do projeto para experimentar', 'Um rascunho de e-mail', 'Uma tabela temporária', 'Uma publicação privada', 'Só entra no projeto se for aceito.'],
      ['Restaurar uma versão antiga do código:', 'Não desfaz automaticamente mudanças já feitas no banco', 'Apaga todos os dados', 'Restaura o banco também', 'Republica o app', 'Código e dados têm ciclos diferentes.'],
      ['Testes criando chamados no meio dos reais pedem:', 'Ambientes de teste e produção separados', 'Parar de testar', 'Apagar os reais', 'Avisar a equipe', 'Bancos separados.']]);

  lesson('loops', 'Quando a IA trava', 'LOOP', 'Quando a IA trava em loop',
    'Às vezes a IA diz que corrigiu e o erro continua. Repetir o mesmo pedido gera o mesmo resultado. Mude a abordagem: volte ao Plan, peça hipóteses antes de mudar código, dê um exemplo concreto do dado que falha, restaure a última versão boa e refaça em passos menores. Se o problema persiste e é crítico, sincronize com o GitHub e peça apoio técnico.',
    'É como explicar o caminho para alguém perdido: repetir a mesma frase mais alto não ajuda. Mude o ponto de referência.',
    'Sinal     → mesma correção 3 vezes, mesmo erro\nPare      → não repita o pedido\nPlan      → liste hipóteses e a causa provável\nContexto  → mensagem exata + exemplo de dado\nVolte     → última versão boa, passos menores\nEscale    → GitHub + apoio técnico',
    ['Peça explicação das mudanças antes de aprovar.', 'Pedidos pequenos e testados previnem loops.', 'Saber pedir ajuda também é competência.'],
    { p: 'Saindo do loop do erro de data:', c: P('Já tentamos 3 correções e o erro continua.\nNão altere o código agora.\nListe 3 hipóteses para a data aparecer como 01/01/1970 na lista de pedidos,\ncom o arquivo e o trecho envolvido em cada uma.\nExemplo de dado no banco: criado_em = "2026-11-03T14:22:10Z".', 'Plan', 'Aponta que a data está sendo convertida de texto para número antes da formatação e propõe a correção em um único arquivo.') },
    ['Não escreva o mesmo pedido em maiúsculas achando que muda algo.', 'Não aprove correções que você não entende.', 'Não insista sozinho por dias num problema que afeta todos os usuários.'],
    [['Depois de 4 correções sem sucesso, o melhor é:', 'Parar, voltar ao Plan e pedir hipóteses com mais contexto', 'Repetir o pedido mais vezes', 'Publicar com o erro', 'Mudar as cores', 'Mude a abordagem.'],
      ['Ajuda a IA a sair do loop:', 'Um exemplo concreto do dado que falha', '“Conserte tudo”', 'Letras maiúsculas', 'Elogios', 'Evidência nova gera resposta nova.'],
      ['Um problema crítico que resiste a tudo deve:', 'Ser escalado a alguém técnico com o código no GitHub', 'Ser ignorado', 'Levar à exclusão de dados', 'Ser resolvido apagando o app', 'Saber escalar faz parte.']]);

  // ---- Etapa 3.2 · Código, equipe e créditos
  lesson('github', 'GitHub e código', 'GITHUB', 'GitHub e o código do app',
    'Conectar o projeto ao GitHub cria sincronização nos dois sentidos: as mudanças feitas no Lovable vão para o repositório, e as feitas no repositório voltam para o Lovable. Isso dá histórico completo, revisão por pessoas técnicas, posse do código pela empresa e a opção de hospedar em outro lugar. Combine quem mexe em quê para evitar conflitos.',
    'É guardar a obra no cartório: há registro de cada alteração, outras pessoas podem conferir e a propriedade é sua.',
    'Conectar  → repositório da empresa\nSincronia → Lovable ⇄ GitHub, nos dois sentidos\nRevisão   → TI revisa mudanças sensíveis\nLer       → peça ao Plan para explicar trechos\nCombinado → quem edita o quê, e quando',
    ['Mesmo sem programar, você pode pedir que a IA explique o código.', 'Edições pequenas e diretas no código economizam mensagens.', 'Revisão técnica pega riscos que a prévia não mostra.'],
    { p: 'Revisão que a TI fez no repositório:', c: 'Arquivo   → src/lib/pedidos.ts\nAchado    → busca pedidos sem filtrar pela loja\nRisco     → depende só da RLS; sem RLS, vazaria\nAção      → filtrar pela loja e manter a RLS como garantia', fig: { type: 'cards', items: [['Histórico', 'Cada mudança registrada.'], ['Revisão', 'A TI confere o que é sensível.'], ['Portabilidade', 'Dá para hospedar fora, se preciso.'], ['Posse', 'O código é da empresa.']] } },
    ['Não editem o mesmo arquivo ao mesmo tempo no Lovable e no GitHub.', 'Não desligue a revisão em mudanças de segurança.', 'Não trate o código como caixa-preta.'],
    [['A integração do Lovable com o GitHub é:', 'Sincronização nos dois sentidos', 'Só um backup estático', 'Só para publicar', 'Uma forma de esconder o código', 'Mudanças fluem nas duas direções.'],
      ['Uma vantagem de ter o código no GitHub da empresa é:', 'Revisão técnica e posse do código', 'Não precisar mais testar', 'Créditos ilimitados', 'Login automático', 'Histórico, revisão e portabilidade.'],
      ['Para entender uma regra no código sem programar:', 'Peça ao Plan que explique o trecho em linguagem simples', 'Apague a regra', 'Ignore o código', 'Reescreva sem olhar', 'A IA também explica.']]);

  lesson('equipe', 'Equipe e padrões', 'EQUIPE', 'Equipe, padrões e governança',
    'Com mais pessoas no projeto, a Knowledge vira o manual: contexto, glossário, papéis, padrões de componentes e textos e as decisões importantes com o porquê. Comentários na prévia apontam ajustes no ponto exato. Um responsável pelo produto prioriza e aprova mudanças, numa rotina curta: coletar pedidos, priorizar, planejar, construir e testar, publicar e comunicar.',
    'É uma cozinha profissional: receitas padronizadas, um chef que decide o cardápio e todos falando a mesma língua. Sem isso, cada prato sai de um jeito.',
    'Knowledge   → manual vivo do projeto\nComentários → ajuste marcado no ponto da tela\nDono        → prioriza e aprova mudanças\nRemix       → nova base a partir de um app pronto\nRotina      → ouvir → priorizar → planejar → construir → comunicar',
    ['Ferramenta rápida sem governança gera bagunça rápida.', 'Registre decisões e o motivo delas.', 'Comunique as mudanças aos usuários a cada publicação.'],
    { p: 'Rotina semanal do NexusHub:', c: 'Segunda → coletar pedidos dos lojistas\nTerça   → priorizar com a coordenadora\nQuarta  → planejar no Plan\nQuinta  → construir e testar\nSexta   → publicar e comunicar', fig: { type: 'cycle', steps: [{ k: '1', t: 'Ouvir', d: 'Pedidos e problemas dos lojistas' }, { k: '2', t: 'Priorizar', d: 'O que entra na semana' }, { k: '3', t: 'Planejar', d: 'Plano no Plan' }, { k: '4', t: 'Construir', d: 'Build e testes' }, { k: '5', t: 'Comunicar', d: 'Publicar e avisar' }], center: 'Ciclo semanal' } },
    ['Não deixe cada pessoa pedir mudanças sem prioridade.', 'Não guarde credenciais na Knowledge.', 'Não publique sem avisar o que mudou.'],
    [['Em um projeto com várias pessoas, a Knowledge deve conter:', 'Contexto, glossário, padrões e decisões', 'As senhas dos serviços', 'O bug de ontem', 'Só o nome do app', 'É o manual do projeto.'],
      ['Muitas pessoas pedindo mudanças sem critério pede:', 'Um responsável pelo produto que prioriza e aprova', 'Bloquear tudo', 'Recomeçar o app', 'Deixar cada um decidir', 'Governança.'],
      ['Um portal parecido para fornecedores pode começar:', 'Por um remix do NexusHub', 'Sempre do zero', 'Com o mesmo app sem mudanças', 'Por um contrato externo', 'Reaproveite a base.']]);

  lesson('creditos', 'Créditos', 'CRÉDITOS', 'Créditos e custo de construção',
    'Cada mensagem ao Lovable consome créditos, e o que mais gasta é o retrabalho: pedidos vagos, loops de correção e mudanças desfeitas e refeitas. Medir ajuda: some os créditos por tipo de mensagem e veja quanto foi para correções. Planejar no Plan, escrever pedidos claros e usar a edição visual em ajustes pequenos reduz o consumo sem perder qualidade.',
    'É a conta do táxi: o trajeto planejado sai barato; ficar dando voltas porque ninguém sabia o endereço é o que encarece.',
    'Medir      → créditos por tipo: Plan, Build, correções, ajustes\nPercentual → parte ÷ total × 100\nDesperdício → loops, idas e vindas, ajustes simples no Build\nEconomia   → planejar, pedidos claros, edição visual',
    ['Os preços e regras de créditos mudam: confira o plano atual do seu workspace.', 'Retrabalho evitado é o melhor desconto.', 'Acompanhe o consumo mês a mês.'],
    { p: 'Créditos do mês no NexusHub:', c: 'Plan 40 + Build 110 + Correções 35 + Ajustes 15 = 200\nCorreções = 35 ÷ 200 = 17,5%', fig: { type: 'hbars', labels: ['Plan (planejar)', 'Build (construir)', 'Correções', 'Ajustes visuais'], values: [40, 110, 35, 15], hl: 2, d: 0, title: 'Créditos usados no mês', speech: 'As correções consumiram 35 de 200 créditos, 17,5% do mês.' } },
    ['Não repita pedidos esperando um resultado diferente.', 'Não use o Build para trocar um texto.', 'Não compare meses sem considerar o tamanho das entregas.'],
    [['O que mais desperdiça créditos é:', 'Retrabalho: loops e pedidos vagos', 'Planejar no Plan', 'Pedidos com critério claro', 'Testar na prévia', 'Clareza economiza.'],
      ['Foram 200 créditos no mês, 35 em correções. As correções representam:', '17,5%', '35%', '7%', '20%', '35 ÷ 200 = 17,5%.'],
      ['Ajustes pequenos de texto e espaço gastam menos usando:', 'A edição visual', 'O Build', 'O GitHub', 'Um draft', 'Edição visual direta.']]);

  // ---- Etapa 3.3 · Lançamento e produto
  lesson('dominio', 'Domínio e SEO', 'DOMÍNIO', 'Domínio, SEO e compartilhamento',
    'Para o app ficar em parceiros.nexusmarket.com.br, conecte o domínio ao projeto publicado e configure o DNS indicado. Páginas públicas precisam de título, descrição, imagem de compartilhamento e ícone. Páginas internas exigem login e ficam fora da busca. E-mails enviados com domínio próprio autenticado chegam mais à caixa de entrada.',
    'O domínio é o endereço da loja na avenida principal; o SEO é a placa e a vitrine que fazem as pessoas acharem e entrarem.',
    'Domínio   → conectar e configurar o DNS\nPúblico   → título, descrição, imagem, ícone\nInterno   → login obrigatório, fora da busca\nE-mail    → domínio próprio autenticado\nDemo      → conta de demonstração com dados fictícios',
    ['Divulgação não deve exigir senha; áreas de dados, sim.', 'Mostre o app a terceiros com uma conta de demonstração.', 'Teste login e e-mails depois de trocar o domínio.'],
    { p: 'Dia do lançamento:', c: '1 → congelar mudanças e testar o roteiro\n2 → publicar a versão final\n3 → conferir domínio, login e e-mails\n4 → enviar o comunicado\n5 → acompanhar erros nas primeiras horas', fig: { type: 'chevrons', steps: [{ k: '1', t: 'Testar' }, { k: '2', t: 'Publicar' }, { k: '3', t: 'Conferir' }, { k: '4', t: 'Comunicar' }, { k: '5', t: 'Monitorar' }] } },
    ['Não deixe páginas internas aparecerem no Google.', 'Não empreste sua senha para demonstrações.', 'Não lance sem conferir os e-mails de login no domínio novo.'],
    [['Para usar um domínio próprio, é necessário:', 'Conectar o domínio e configurar o DNS', 'Renomear o projeto', 'Mudar o título da página', 'Criar outro projeto', 'O DNS aponta para o app.'],
      ['Páginas internas com dados de lojistas devem:', 'Exigir login e ficar fora da busca', 'Aparecer no Google', 'Ser públicas', 'Ter senha única', 'Busca é só para o público.'],
      ['Para mostrar o app a um parceiro externo, use:', 'Uma conta de demonstração com dados fictícios', 'Sua senha', 'Dados reais de outras lojas', 'O editor do projeto', 'Proteja os dados reais.']]);

  lesson('qualidade', 'Qualidade e segurança', 'QUALIDADE', 'Qualidade e segurança antes de lançar',
    'Antes de abrir para muitos usuários, verifique o que bloqueia o lançamento: regras de acesso testadas com contas diferentes, segredos fora do código, verificação de segurança sem alertas críticos e login funcionando no domínio final. Mantenha um roteiro fixo de testes dos fluxos críticos antes de cada publicação, monitore erros e uso, e tenha backup dos dados com restauração testada.',
    'É o checklist do piloto antes da decolagem: curto, sempre igual e inegociável. Ninguém decola porque “da última vez deu certo”.',
    'Bloqueia → vazamento de dados, segredo exposto, login quebrado\nPode esperar → ícone desalinhado, erro de digitação\nRegressão → roteiro fixo de testes a cada publicação\nMonitorar → logs, erros, métricas e alertas\nBackup    → cópias + restauração testada',
    ['Lentidão costuma vir de dados demais ou consultas sem filtro.', 'Histórico de código não é backup de dados.', 'Classifique problemas por gravidade, não por ordem de chegada.'],
    { p: 'Triagem antes do lançamento:', c: 'Lojista vê chamados de outra loja → BLOQUEIA\nChave de API no código da página  → BLOQUEIA\nLogin falha no domínio próprio    → BLOQUEIA\nÍcone desalinhado no rodapé       → próxima versão', fig: { type: 'table', cols: ['Problema', 'Decisão'], rows: [['Vazamento entre lojas', 'Bloqueia'], ['Chave exposta', 'Bloqueia'], ['Login quebrado', 'Bloqueia'], ['Ícone desalinhado', 'Próxima versão'], ['Erro de digitação', 'Próxima versão']], hl: [0, 1, 2] } },
    ['Não lance com alertas críticos de segurança abertos.', 'Não teste só a parte nova.', 'Não confunda histórico de versões com backup.'],
    [['Bloqueia o lançamento:', 'Um lojista conseguir ver chamados de outra loja', 'Um ícone desalinhado', 'Um erro de digitação no rodapé', 'Uma cor diferente do manual', 'Vazamento de dados é crítico.'],
      ['Testes de regressão servem para:', 'Garantir que o que já funcionava continua funcionando', 'Testar só a parte nova', 'Medir créditos', 'Trocar o domínio', 'Roteiro fixo a cada publicação.'],
      ['Um backup só vale se:', 'A restauração foi testada', 'Ficar no mesmo computador', 'For feito uma vez', 'Tiver nome bonito', 'Teste a volta, não só a ida.']]);

  lesson('produto', 'Do MVP ao produto', 'MVP', 'Do MVP ao produto: métricas e privacidade',
    'Depois do lançamento, o app vira produto: decisões passam a ser guiadas por métricas. O funil mostra onde as pessoas se perdem (visitantes, contas, lojas cadastradas, primeiro pedido). E a privacidade é parte do produto: dados de pessoas, mesmo de representantes de empresas, são dados pessoais pela LGPD, com finalidade informada, coleta mínima, segurança e direitos do titular.',
    'O MVP é a barraca de teste na feira; o produto é a loja na rua. Na loja, você mede quem entra, quem compra e por que os outros desistem.',
    'Funil      → etapa seguinte ÷ etapa anterior\nConversão  → última etapa ÷ primeira\nMaior perda → onde a taxa é menor\nLGPD       → finalidade, minimização, segurança, direitos\nEvolução   → planejar, revisar, testar, monitorar',
    ['Ataque primeiro a etapa com a maior perda.', 'Política de privacidade e canal de contato fazem parte do produto.', 'Velocidade sem método vira retrabalho e risco.'],
    { p: 'Funil do primeiro mês do NexusHub:', c: 'Visitaram 4.000 → contas 1.200 (30%)\nContas 1.200 → lojas 720 (60%)\nLojas 720 → primeiro pedido 360 (50%)\nTotal: 360 ÷ 4.000 = 9%', fig: { type: 'hbars', labels: ['Visitaram', 'Criaram conta', 'Cadastraram loja', 'Primeiro pedido'], values: [4000, 1200, 720, 360], d: 0, title: 'Funil do NexusHub no 1º mês', speech: 'De 4 mil visitantes, 360 chegaram ao primeiro pedido: 9%. A maior perda está na criação de conta.' } },
    ['Não decida pelo “achismo” quando há dados.', 'Não trate dados de representantes de empresas como se não fossem pessoais.', 'Não guarde dados para sempre sem necessidade.'],
    [['De 4.000 visitantes, 360 chegaram ao primeiro pedido. A conversão total é:', '9%', '36%', '0,9%', '90%', '360 ÷ 4.000 = 9%.'],
      ['Nome e telefone do responsável por uma loja são, pela LGPD:', 'Dados pessoais', 'Dados da empresa, sem proteção', 'Dados públicos', 'Dados anônimos', 'São dados de uma pessoa.'],
      ['Num funil, a primeira etapa a melhorar é:', 'A que tem a menor taxa de conversão', 'A última', 'A mais barata', 'A mais bonita', 'Ataque a maior perda.']]);

  /* ------------------------------ Pacote ------------------------------ */
  const COMPUTED = { hbars: 1, bars: 1 };
  function register() {
    if (!global.Lessons || !global.Lessons.registerPack) return;
    global.Lessons.registerPack('lovable', {
      LESSONS: L, MAP: MAP, fallback: 'oque', goalLabel: 'Sua missão',
      steps: ['Conceito', 'Como fazer', 'Exemplo no NexusHub', 'Cuidados', 'Seu desafio'],
      syntaxTitle: 'Como fazer',
      solution: function (ex) {
        const esc = global.UI.esc; let html = '';
        if (ex.kind === 'choice') html = '<p class="ls-ans">' + esc(ex.opts[0]) + '</p>';
        else if (ex.kind === 'multi') html = '<ul class="ls-anslist">' + ex.ok.map(function (i) { return '<li>' + esc(ex.opts[i]) + '</li>'; }).join('') + '</ul>';
        else if (ex.kind === 'order') html = '<ol class="ls-anslist num">' + ex.items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ol>';
        else if (ex.kind === 'classify') html = '<ul class="ls-anslist">' + ex.items.map(function (it) { return '<li><span>' + esc(it[0]) + '</span><b>' + esc(ex.cats[it[1]]) + '</b></li>'; }).join('') + '</ul>';
        else html = '<p class="ls-ans">' + esc(global.GQCharts.fmt(ex.a, ex.dec == null ? 2 : ex.dec) + (ex.unit ? (ex.unit === '%' ? '%' : ' ' + ex.unit) : '')) + '</p>';
        return { label: 'Resposta', html: html, note: ex.x, speech: ex.x };
      }, syntaxSpeech: 'Agora, o passo a passo. Repare em como cada pedido deixa claro o resultado esperado.', compareSpeech: 'Veja como isso aparece no NexusHub.',
      codeHtml: function (code) { return global.GQCharts.highlight(code); },
      example: function (les) {
        const fig = les.exemplo.fig || { type: 'prompt', code: les.exemplo.c };
        const out = global.GQCharts.render(Object.assign({ theme: 'lovable' }, fig));
        return { code: les.exemplo.fig && les.exemplo.fig.type !== 'prompt' ? les.exemplo.c : '', badge: COMPUTED[fig.type] ? 'Desenhado agora com os números do NexusHub' : 'Aplicado ao NexusHub', liveHtml: out.html, speech: out.speech };
      },
      tags: function (ex) {
        const K = { choice: ['target', 'Estudo de caso'], multi: ['check', 'Marque todas as corretas'], order: ['bars', 'Coloque em ordem'], classify: ['grid', 'Classifique os itens'], calc: ['code', 'Cálculo com dados do projeto'] }[ex.kind] || ['target', 'Caso'];
        return [{ icon: K[0], label: K[1] }].concat(ex.d ? [{ icon: 'bars', label: 'Com gráfico' }] : []);
      },
    });
  }
  // exemplo com objeto de prompt: a figura é o próprio prompt
  Object.keys(L).forEach(function (k) { const e = L[k].exemplo; if (e.c && typeof e.c === 'object') { e.fig = e.c; e.c = e.c.code; } });
  register();
  global.LVLessons = { LESSONS: L, MAP: MAP };
})(typeof window !== 'undefined' ? window : globalThis);
