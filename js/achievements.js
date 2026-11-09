/* =====================================================================
   achievements.js — XP, promoções, conquistas e ranking (por trilha)
   ---------------------------------------------------------------------
   • XP por dificuldade: fácil 10 · média 20 · difícil 30
     (metade do XP se o gabarito tiver sido revelado antes de acertar).
   • Cada trilha tem sua carreira: 3 promoções por nível (aos 17, 34 e 50
     exercícios do nível) + promoção final aos 150.
   • Conquistas comuns + conquistas próprias de cada trilha.
   • Tudo é resolvido para a trilha atual (Tracks.activeId()).
   ===================================================================== */
(function (global) {
  'use strict';

  const XP = { facil: 10, media: 20, dificil: 30 };
  const DIFF_LABEL = { facil: 'Fácil', media: 'Média', dificil: 'Difícil' };

  /* ------------------------------- Carreiras ------------------------------- */
  function career(names, descs, start, finalName, finalDesc) {
    const promos = names.map(function (n, i) {
      return { key: 'p' + (Math.floor(i / 3) + 1) + '-' + (i % 3 + 1), level: Math.floor(i / 3) + 1, need: [17, 34, 50][i % 3], nome: n, desc: descs[i] };
    });
    const fin = { key: 'final', level: 4, need: 150, nome: finalName, desc: finalDesc, final: true };
    return { START_ROLE: start, PROMOTIONS: promos, FINAL: fin, ALL_ROLES: promos.concat([fin]) };
  }
  const CAREERS = {
    sql: career(
      ['Explorador de Dados', 'Analista Aprendiz', 'Operador SQL', 'Especialista em Consultas', 'Arquiteto de Relatórios', 'Analista de Dados Pleno', 'Engenheiro SQL', 'Mestre das Consultas', 'Arquiteto de Dados'],
      ['Domina SELECT, filtros e ordenação.', 'Resume dados com agregações e GROUP BY.', 'Concluiu o nível Iniciante com subconsultas.',
        'Cruza tabelas com todos os tipos de JOIN.', 'Monta relatórios com CASE, CTEs e views.', 'Concluiu o nível Intermediário.',
        'Usa window functions com fluência.', 'Automatiza com triggers, procedures e MERGE.', 'Concluiu o nível Avançado.'],
      { key: 'trainee', nome: 'Trainee de Dados', desc: 'Primeiros passos na NexusMarket.' },
      'Lenda SQL', 'Concluiu os 150 exercícios da trilha de SQL.'),
    excel: career(
      ['Explorador de Planilhas', 'Analista de Fórmulas', 'Operador de Planilhas', 'Especialista em Funções', 'Construtor de Relatórios', 'Analista de Planilhas Pleno', 'Engenheiro de Planilhas', 'Mestre das Fórmulas', 'Arquiteto de Modelos'],
      ['Domina operações, referências e funções básicas.', 'Trabalha com SE, CONT.SE e funções de texto.', 'Concluiu o nível Iniciante com datas e SOMASE.',
        'Cruza planilhas com PROCV, PROCX e ÍNDICE + CORRESP.', 'Monta relatórios com SOMASES, SES e TEXTO.', 'Concluiu o nível Intermediário.',
        'Usa matrizes dinâmicas: FILTRO, CLASSIFICAR e ÚNICO.', 'Domina LET, SOMARPRODUTO e estatística.', 'Concluiu o nível Avançado.'],
      { key: 'trainee', nome: 'Assistente de Planilhas', desc: 'Primeiros passos nas planilhas da NexusMarket.' },
      'Lenda do Excel', 'Concluiu os 150 exercícios da trilha de Excel.'),
    powerbi: career(
      ['Explorador de Dashboards', 'Analista de Medidas', 'Modelador Júnior', 'Especialista em CALCULATE', 'Analista de Inteligência de Tempo', 'Analista de BI Pleno', 'Engenheiro de Analytics', 'Mestre do DAX', 'Arquiteto de BI'],
      ['Cria medidas com SUM, COUNTROWS e DIVIDE.', 'Domina colunas calculadas, RELATED e IF.', 'Concluiu o nível Iniciante com CALCULATE e metas.',
        'Controla filtros com ALL, ALLEXCEPT e FILTER.', 'Compara períodos com YTD, ano anterior e DATEADD.', 'Concluiu o nível Intermediário.',
        'Cria rankings, Top N, acumulados e médias móveis.', 'Analisa clientes, curva ABC e tabelas virtuais.', 'Concluiu o nível Avançado.'],
      { key: 'trainee', nome: 'Assistente de BI', desc: 'Primeiros passos no modelo da NexusMarket.' },
      'Lenda do Power BI', 'Concluiu os 150 exercícios da trilha de Power BI.'),
    gestao: career(
      ['Analista de Indicadores', 'Facilitador de Melhoria', 'Analista da Qualidade Júnior', 'Solucionador de Problemas', 'Praticante Lean', 'Analista da Qualidade Pleno', 'Especialista em Controle Estatístico', 'Especialista Seis Sigma', 'Gestor da Qualidade'],
      ['Domina conceitos de qualidade, processos, indicadores e PDCA.', 'Aplica brainstorming, Pareto e Ishikawa.', 'Concluiu o nível Iniciante com as 7 ferramentas da qualidade.',
        'Resolve problemas com MASP, 8D e A3.', 'Elimina desperdícios com VSM, takt, kaizen e poka-yoke.', 'Concluiu o nível Intermediário com OEE e controle estatístico.',
        'Conduz DMAIC e mede o nível sigma e a capabilidade.', 'Antecipa riscos com FMEA, CTQ e MSA.', 'Concluiu o nível Avançado.'],
      { key: 'trainee', nome: 'Assistente da Qualidade', desc: 'Primeiros passos na operação da NexusMarket.' },
      'Lenda da Melhoria Contínua', 'Concluiu os 150 exercícios da trilha de Gestão da Qualidade.'),
    sixsigma: career(
      ['White Belt · Fundamentos', 'Yellow Belt · Definição de Projetos', 'Yellow Belt · Ferramentas de Melhoria', 'Green Belt · Medição (Measure)', 'Green Belt · Análise (Analyze)', 'Green Belt · Melhoria e Controle', 'Black Belt · Estatística Avançada', 'Black Belt · Experimentos e DFSS', 'Black Belt · Liderança de Programa'],
      ['Conhece Lean, Six Sigma, VOC, desperdícios, variação e DMAIC.', 'Define projetos com carta, SIPOC e CTQ.', 'Concluiu o conteúdo de Yellow Belt: Pareto, Ishikawa, 5S e kaizen.',
        'Mede com amostragem, MSA, DPMO e nível sigma.', 'Analisa com VSM, fluxo, OEE, testes de hipótese e regressão.', 'Concluiu o conteúdo de Green Belt: soluções, FMEA, CEP e Cpk.',
        'Aplica ANOVA, qui-quadrado, regressão múltipla e poder.', 'Planeja experimentos (DOE), DFSS e QFD.', 'Concluiu o conteúdo de Black Belt: portfólio, ganhos e liderança.'],
      { key: 'trainee', nome: 'Aprendiz de Melhoria', desc: 'Primeiros passos no Lean Six Sigma.' },
      'Lenda Lean Six Sigma', 'Concluiu os 150 exercícios, do White ao Black Belt, com visão de Master Black Belt.'),
    estatistica: career(
      ['Analista Descritivo · Dados e Amostras', 'Analista Descritivo · Posição e Dispersão', 'Analista Descritivo · Distribuições e Gráficos', 'Analista Quantitativo · Probabilidade', 'Analista Quantitativo · Distribuições', 'Analista Quantitativo · Estimação', 'Estatístico Aplicado · Testes de Hipótese', 'Estatístico Aplicado · Correlação e Regressão', 'Estatístico Aplicado · Previsão e Decisão'],
      ['Classifica variáveis, monta amostras, frequências e percentuais.', 'Resume dados com média, mediana, desvio e quartis.', 'Concluiu o nível Iniciante: histogramas, outliers, escore Z e gráficos.',
        'Calcula probabilidades, condicionais, Bayes e valor esperado.', 'Usa as distribuições binomial, Poisson e normal e o TCL.', 'Concluiu o nível Intermediário: amostragem, intervalos e tamanho da amostra.',
        'Conduz testes t, testes A/B e qui-quadrado.', 'Aplica ANOVA, correlação e regressão simples e múltipla.', 'Concluiu o nível Avançado: séries temporais, previsão e decisão.'],
      { key: 'trainee', nome: 'Curioso dos Números', desc: 'Primeiros passos na estatística da NexusMarket.' },
      'Lenda da Estatística', 'Concluiu os 150 exercícios da trilha de Estatística Aplicada.'),
    storytelling: career(
      ['Comunicador de Dados · Contexto e Mensagem', 'Comunicador de Dados · Escolha do Gráfico', 'Comunicador de Dados · Clareza Visual', 'Designer de Informação · Design com Intenção', 'Designer de Informação · Narrativa', 'Designer de Informação · Comparações e KPIs', 'Contador de Histórias · Dashboards', 'Contador de Histórias · Apresentações', 'Contador de Histórias · Decisão e Impacto'],
      ['Define público, objetivo e a grande ideia da comunicação.', 'Escolhe o gráfico certo para comparar, mostrar tempo e composição.', 'Concluiu o nível Iniciante: menos poluição, Gestalt, destaque e cor.',
        'Organiza a hierarquia, escreve títulos que concluem e anota os gráficos.', 'Estrutura a história com arco narrativo, SCR e storyboard.', 'Concluiu o nível Intermediário: referências, KPIs e gráficos honestos.',
        'Desenha dashboards executivos, acessíveis e bem organizados.', 'Apresenta com slides objetivos, resumo executivo e respostas às objeções.', 'Concluiu o nível Avançado: recomendações, incerteza e ética.'],
      { key: 'trainee', nome: 'Aprendiz de Narrativas', desc: 'Primeiros passos para contar histórias com os dados da NexusMarket.' },
      'Lenda do Storytelling', 'Concluiu os 150 exercícios da trilha de Storytelling com Dados.'),
    powerquery: career(
      ['Preparador de Dados · Primeiros Passos', 'Preparador de Dados · Limpeza', 'Preparador de Dados · Estrutura', 'Engenheiro de Consultas · Combinações', 'Engenheiro de Consultas · Remodelagem', 'Engenheiro de Consultas · Linguagem M', 'Arquiteto de Dados · Automação', 'Arquiteto de Dados · Desempenho', 'Arquiteto de Dados · Modelagem'],
      ['Conecta fontes, entende as etapas aplicadas e define os tipos.', 'Limpa colunas, filtros, duplicadas, erros e textos.', 'Concluiu o nível Iniciante: cabeçalhos, divisões, substituições e colunas condicionais.',
        'Acrescenta, mescla e combina arquivos de pastas.', 'Agrupa, faz unpivot, pivot e cria calendários.', 'Concluiu o nível Intermediário: let, colunas personalizadas, funções e listas em M.',
        'Automatiza com parâmetros, funções personalizadas e tratamento de erros.', 'Garante folding, desempenho, privacidade e atualização.', 'Concluiu o nível Avançado: modelo estrela, chaves e qualidade.'],
      { key: 'trainee', nome: 'Organizador de Planilhas', desc: 'Primeiros passos no Power Query da NexusMarket.' },
      'Lenda do Power Query', 'Concluiu os 150 exercícios da trilha de Power Query.'),
    python: career(
      ['Programador Iniciante', 'Explorador de Estruturas', 'Desenvolvedor Python Júnior', 'Organizador de Dados', 'Limpador de Dados', 'Analista Python Pleno', 'Analista de Dados com pandas', 'Engenheiro de Análises', 'Cientista de Dados'],
      ['Domina print, variáveis, operadores e textos.', 'Usa listas, fatias, decisões e laços.', 'Concluiu o nível Iniciante com dicionários e funções.',
        'Agrupa e ordena dados com compreensões, lambda e Counter.', 'Trata datas, erros e textos sujos.', 'Concluiu o nível Intermediário com statistics, csv e relatórios.',
        'Filtra, cria colunas e agrega com pandas.', 'Usa groupby, agg, merge e tabelas dinâmicas.', 'Concluiu o nível Avançado.'],
      { key: 'trainee', nome: 'Estagiário de Dados', desc: 'Primeiras linhas de código na NexusMarket.' },
      'Lenda do Python', 'Concluiu os 150 exercícios da trilha de Python para Dados.'),
    ingles: career(
      ['Viajante Iniciante', 'Comunicador do Dia a Dia', 'Falante Básico', 'Viajante Independente', 'Conversador Social', 'Falante Intermediário', 'Profissional Bilíngue', 'Negociador Internacional', 'Falante Fluente'],
      ['Se apresenta, pergunta preços e horários.', 'Pede no café, faz compras e pede direções.', 'Concluiu o nível Iniciante: conta o fim de semana e faz planos.',
        'Resolve aeroporto, hotel, transporte e farmácia.', 'Conversa sobre experiências, convida e reclama com educação.', 'Concluiu o nível Intermediário.',
        'Participa de reuniões, escreve e-mails e apresenta dados.', 'Faz entrevistas, negocia e dá feedback em inglês.', 'Concluiu o nível Avançado.'],
      { key: 'trainee', nome: 'Turista Curioso', desc: 'Primeiras palavras em inglês.' },
      'Lenda do Inglês', 'Concluiu os 150 exercícios da trilha de Inglês para o Dia a Dia.'),
  };
  function C() { return CAREERS[global.Tracks.activeId()] || CAREERS.sql; }

  /* ------------------------------ Conquistas ------------------------------ */
  const isTopic = function (ex, list) { return list.some(function (t) { return ex.t.toUpperCase().indexOf(t) >= 0; }); };
  const solvedList = function (st) {
    return global.ExerciseBank.EXERCISES.filter(function (e) { return st.progress.solved[e.id]; });
  };
  const levelCount = function (st, lv) { return solvedList(st).filter(function (e) { return e.level === lv; }).length; };
  const has = function (topics) { return function (st) { return solvedList(st).some(function (e) { return isTopic(e, topics); }); }; };

  const COMMON = [
    { key: 'streak-5', nome: 'Precisão Cirúrgica', desc: 'Acerte 5 exercícios seguidos na primeira tentativa.', icon: 'target', test: function (st) { return st.progress.firstTryStreak >= 5; } },
    { key: 'scholar', nome: 'Estudioso', desc: 'Conclua 20 conteúdos em slides antes dos exercícios.', icon: 'book', test: function (st) { return Object.keys(st.progress.lessonsSeen || {}).length >= 20; } },
    { key: 'exam-ace', nome: 'Gabaritou', desc: 'Tire 100% em uma prova de certificado.', icon: 'award', test: function (st) { return Object.values(st.progress.exams || {}).some(function (x) { return x.best === 15; }); } },
    { key: 'ex-10', nome: 'Aquecimento', desc: 'Conclua 10 exercícios.', icon: 'star', test: function (st) { return solvedList(st).length >= 10; } },
    { key: 'ex-50', nome: '50 Exercícios Concluídos', desc: 'Meio caminho andado em volume.', icon: 'medal', test: function (st) { return solvedList(st).length >= 50; } },
    { key: 'ex-100', nome: '100 Exercícios Concluídos', desc: 'Dois terços da trilha.', icon: 'medal', test: function (st) { return solvedList(st).length >= 100; } },
    { key: 'xp-1000', nome: 'Mil Pontos', desc: 'Alcance 1.000 XP.', icon: 'sparkle', test: function (st) { return st.progress.xp >= 1000; } },
    { key: 'self-taught', nome: 'Autodidata', desc: 'Resolva 25 exercícios sem revelar o gabarito.', icon: 'bulb', test: function (st) { return solvedList(st).filter(function (e) { return !st.progress.solved[e.id].usedSolution; }).length >= 25; } },
    { key: 'skill-1', nome: 'Skill Iniciante', desc: 'Conquiste o Desafio de Skills Iniciante deste tema.', icon: 'flag', test: function (st) { return !!((st.progress.skills || {})[1] || {}).passedAt; } },
    { key: 'skill-2', nome: 'Skill Intermediário', desc: 'Conquiste o Desafio de Skills Intermediário deste tema.', icon: 'flag', test: function (st) { return !!((st.progress.skills || {})[2] || {}).passedAt; } },
    { key: 'skill-3', nome: 'Skill Avançado', desc: 'Conquiste o Desafio de Skills Avançado deste tema.', icon: 'flag', test: function (st) { return !!((st.progress.skills || {})[3] || {}).passedAt; } },
    { key: 'night-owl', nome: 'Coruja', desc: 'Resolva um exercício depois das 22h.', icon: 'moon', test: function (st, ctx) { return !!(ctx && ctx.justSolved && new Date().getHours() >= 22); } },
  ];
  const SPECIFIC = {
    sql: [
      { key: 'first-select', nome: 'Primeiro SELECT', desc: 'Resolva seu primeiro exercício.', icon: 'play', test: function (st) { return solvedList(st).length >= 1; } },
      { key: 'first-join', nome: 'Primeira JOIN', desc: 'Resolva um exercício de JOIN.', icon: 'share', test: has(['JOIN']) },
      { key: 'first-cte', nome: 'Primeira CTE', desc: 'Resolva um exercício com WITH.', icon: 'code', test: has(['CTE']) },
      { key: 'first-window', nome: 'Janela Aberta', desc: 'Resolva sua primeira window function.', icon: 'bars', test: has(['ROW_NUMBER', 'RANK', 'OVER', 'LAG', 'LEAD', 'NTILE', 'FIRST_VALUE', 'CUME_DIST', 'MÉDIA MÓVEL']) },
      { key: 'first-trigger', nome: 'Gatilho Disparado', desc: 'Crie seu primeiro trigger.', icon: 'flame', test: has(['TRIGGER']) },
      { key: 'sql-master', nome: 'SQL Master', desc: 'Conclua os 150 exercícios.', icon: 'trophy', test: function (st) { return solvedList(st).length >= 150; } },
    ],
    excel: [
      { key: 'first-formula', nome: 'Primeira Fórmula', desc: 'Resolva seu primeiro exercício de Excel.', icon: 'play', test: function (st) { return solvedList(st).length >= 1; } },
      { key: 'first-if', nome: 'Tomador de Decisão', desc: 'Resolva um exercício com SE.', icon: 'share', test: function (st) { return solvedList(st).some(function (e) { return /^SES?\b|^SE\s|^SE$/.test(e.t.toUpperCase()); }); } },
      { key: 'first-lookup', nome: 'Primeiro PROCV', desc: 'Busque dados em outra planilha.', icon: 'search', test: has(['PROCV', 'PROCX', 'ÍNDICE']) },
      { key: 'first-dynamic', nome: 'Matriz Dinâmica', desc: 'Resolva um exercício com FILTRO, CLASSIFICAR ou ÚNICO.', icon: 'bars', test: has(['FILTRO', 'CLASSIFICAR', 'ÚNICO', 'SEQUÊNCIA']) },
      { key: 'first-let', nome: 'Fórmula Elegante', desc: 'Use LET para organizar um cálculo.', icon: 'flame', test: has(['LET']) },
      { key: 'excel-master', nome: 'Excel Master', desc: 'Conclua os 150 exercícios.', icon: 'trophy', test: function (st) { return solvedList(st).length >= 150; } },
    ],
    powerbi: [
      { key: 'first-measure', nome: 'Primeira Medida', desc: 'Crie sua primeira medida DAX.', icon: 'play', test: function (st) { return solvedList(st).length >= 1; } },
      { key: 'first-calculate', nome: 'Senhor do Contexto', desc: 'Resolva um exercício com CALCULATE.', icon: 'target', test: has(['CALCULATE']) },
      { key: 'first-iterator', nome: 'Linha a Linha', desc: 'Use um iterador como SUMX ou AVERAGEX.', icon: 'bars', test: has(['SUMX', 'AVERAGEX', 'MAXX', 'MINX']) },
      { key: 'first-time', nome: 'Viajante do Tempo', desc: 'Resolva um exercício de inteligência de tempo.', icon: 'clock', test: has(['YTD', 'QTD', 'SAMEPERIODLASTYEAR', 'DATEADD', 'PREVIOUSMONTH', 'PARALLELPERIOD', 'YOY', 'MOM', 'DATESINPERIOD']) },
      { key: 'first-rank', nome: 'Pódio', desc: 'Crie um ranking com RANKX ou TOPN.', icon: 'trophy', test: has(['RANKX', 'TOPN']) },
      { key: 'pbi-master', nome: 'Power BI Master', desc: 'Conclua os 150 exercícios.', icon: 'trophy', test: function (st) { return solvedList(st).length >= 150; } },
    ],
    gestao: [
      { key: 'first-case', nome: 'Primeiro Caso Resolvido', desc: 'Resolva seu primeiro caso de gestão.', icon: 'play', test: function (st) { return solvedList(st).length >= 1; } },
      { key: 'first-pareto', nome: 'Regra 80/20', desc: 'Resolva um exercício de Pareto.', icon: 'bars', test: has(['PARETO']) },
      { key: 'first-root', nome: 'Caçador de Causas', desc: 'Resolva um exercício de Ishikawa ou 5 Porquês.', icon: 'search', test: has(['ISHIKAWA', 'PORQUÊS']) },
      { key: 'first-lean', nome: 'Pensamento Lean', desc: 'Resolva um exercício de desperdícios, VSM ou kaizen.', icon: 'flame', test: has(['DESPERDÍCIOS', 'VSM', 'KAIZEN', 'TAKT']) },
      { key: 'first-sigma', nome: 'Faixa Preta', desc: 'Resolva um exercício de DMAIC, sigma ou capabilidade.', icon: 'target', test: has(['DMAIC', 'SIGMA', 'CAPABILIDADE']) },
      { key: 'gq-master', nome: 'Mestre da Qualidade', desc: 'Conclua os 150 exercícios.', icon: 'trophy', test: function (st) { return solvedList(st).length >= 150; } },
    ],
    python: [
      { key: 'first-code', nome: 'Hello, World!', desc: 'Resolva seu primeiro exercício de Python.', icon: 'play', test: function (st) { return solvedList(st).length >= 1; } },
      { key: 'first-loop', nome: 'Em Loop', desc: 'Resolva um exercício com for ou while.', icon: 'refresh', test: has(['FOR', 'WHILE', 'ACUMULADORES']) },
      { key: 'first-def', nome: 'Função Própria', desc: 'Crie sua primeira função com def.', icon: 'code', test: has(['FUNÇÕES']) },
      { key: 'first-comp', nome: 'Uma Linha Só', desc: 'Resolva um exercício de compreensão de lista.', icon: 'flame', test: has(['COMPREENSÃO']) },
      { key: 'first-pandas', nome: 'Panda Domado', desc: 'Resolva seu primeiro exercício com pandas.', icon: 'table', test: function (st) { return solvedList(st).some(function (e) { return e.level === 3; }); } },
      { key: 'first-groupby', nome: 'Agrupador', desc: 'Use groupby ou pivot_table.', icon: 'bars', test: has(['GROUPBY', 'AGG', 'PIVOT']) },
      { key: 'py-master', nome: 'Pythonista', desc: 'Conclua os 150 exercícios.', icon: 'trophy', test: function (st) { return solvedList(st).length >= 150; } },
    ],
    sixsigma: [
      { key: 'first-belt', nome: 'Primeira Faixa', desc: 'Resolva seu primeiro caso de Lean Six Sigma.', icon: 'play', test: function (st) { return solvedList(st).length >= 1; } },
      { key: 'first-muda', nome: 'Caçador de Desperdícios', desc: 'Resolva um caso de desperdícios ou VSM.', icon: 'flame', test: has(['DESPERDÍCIOS', 'VSM', 'FLUXO']) },
      { key: 'first-dmaic', nome: 'Roteiro DMAIC', desc: 'Resolva um caso de DMAIC ou carta de projeto.', icon: 'map', test: has(['DMAIC', 'CARTA DE PROJETO']) },
      { key: 'first-test', nome: 'Valor-p na Mão', desc: 'Resolva um caso de teste de hipótese, ANOVA ou qui-quadrado.', icon: 'search', test: has(['TESTES DE HIPÓTESE', 'ANOVA', 'QUI-QUADRADO']) },
      { key: 'first-doe', nome: 'Experimentador', desc: 'Resolva um caso de DOE.', icon: 'target', test: has(['DOE', 'FATORIAL']) },
      { key: 'ss-black', nome: 'Faixa Preta', desc: 'Conclua o nível Avançado (Black Belt).', icon: 'medal', test: function (st) { return levelCount(st, 3) >= 50; } },
      { key: 'ss-master', nome: 'Rumo ao Master', desc: 'Conclua os 150 casos.', icon: 'trophy', test: function (st) { return solvedList(st).length >= 150; } },
    ],
    estatistica: [
      { key: 'first-stat', nome: 'Primeiro Número', desc: 'Resolva seu primeiro exercício de estatística.', icon: 'play', test: function (st) { return solvedList(st).length >= 1; } },
      { key: 'first-median', nome: 'Além da Média', desc: 'Resolva um exercício de mediana, dispersão ou quartis.', icon: 'bars', test: has(['MEDIANA', 'DISPERSÃO', 'QUARTIS']) },
      { key: 'first-bayes', nome: 'Pensamento Bayesiano', desc: 'Resolva um exercício de Bayes ou probabilidade condicional.', icon: 'bulb', test: has(['BAYES', 'CONDICIONAL']) },
      { key: 'first-ic', nome: 'Margem de Erro', desc: 'Resolva um exercício de intervalo de confiança.', icon: 'target', test: has(['INTERVALO DE CONFIANÇA', 'IC DE PROPORÇÃO']) },
      { key: 'first-ab', nome: 'Teste A/B', desc: 'Resolva um exercício de teste A/B ou teste t.', icon: 'search', test: has(['TESTE A/B', 'TESTE T']) },
      { key: 'first-reg', nome: 'Na Linha Certa', desc: 'Resolva um exercício de regressão.', icon: 'flame', test: has(['REGRESSÃO']) },
      { key: 'es-master', nome: 'Mestre dos Dados', desc: 'Conclua os 150 exercícios.', icon: 'trophy', test: function (st) { return solvedList(st).length >= 150; } },
    ],
    storytelling: [
      { key: 'first-story', nome: 'Primeira História', desc: 'Resolva seu primeiro exercício de storytelling.', icon: 'play', test: function (st) { return solvedList(st).length >= 1; } },
      { key: 'first-idea', nome: 'A Grande Ideia', desc: 'Resolva um exercício de grande ideia ou de público.', icon: 'bulb', test: has(['GRANDE IDEIA', 'PÚBLICO']) },
      { key: 'first-chart', nome: 'Gráfico Certo', desc: 'Resolva um exercício de barras, linhas ou composição.', icon: 'bars', test: has(['BARRAS', 'TEMPO', 'COMPOSIÇÃO']) },
      { key: 'first-clean', nome: 'Menos é Mais', desc: 'Resolva um exercício de poluição visual ou de destaque.', icon: 'eraser', test: has(['POLUIÇÃO', 'PRÉ-ATENTIVOS']) },
      { key: 'first-arc', nome: 'Narrador', desc: 'Resolva um exercício de arco narrativo ou storyboard.', icon: 'book', test: has(['ARCO', 'STORYBOARD', 'COMPLICAÇÃO']) },
      { key: 'first-dash', nome: 'Painel Executivo', desc: 'Resolva um exercício de dashboard ou de layout.', icon: 'grid', test: has(['DASHBOARDS', 'LAYOUT']) },
      { key: 'dv-master', nome: 'Mestre das Histórias', desc: 'Conclua os 150 exercícios.', icon: 'trophy', test: function (st) { return solvedList(st).length >= 150; } },
    ],
    powerquery: [
      { key: 'first-query', nome: 'Primeira Consulta', desc: 'Resolva seu primeiro exercício de Power Query.', icon: 'play', test: function (st) { return solvedList(st).length >= 1; } },
      { key: 'first-clean', nome: 'Faxina de Dados', desc: 'Resolva um exercício de duplicadas, erros ou texto.', icon: 'eraser', test: has(['DUPLICADAS', 'TEXTO']) },
      { key: 'first-merge', nome: 'Mesclador', desc: 'Resolva um exercício de mesclar ou tipos de junção.', icon: 'nodes', test: has(['MESCLAR', 'JUNÇÃO']) },
      { key: 'first-unpivot', nome: 'Do Largo ao Longo', desc: 'Resolva um exercício de transformar colunas em linhas.', icon: 'refresh', test: has(['COLUNAS EM LINHAS', 'DINÂMICAS']) },
      { key: 'first-m', nome: 'Fala M', desc: 'Resolva um exercício da linguagem M.', icon: 'code', test: has(['ESTRUTURA LET', 'FUNÇÕES M', 'LISTAS']) },
      { key: 'first-fold', nome: 'Dobra Perfeita', desc: 'Resolva um exercício de query folding ou desempenho.', icon: 'flame', test: has(['FOLDING', 'DESEMPENHO']) },
      { key: 'pq-master', nome: 'Mestre das Consultas', desc: 'Conclua os 150 exercícios.', icon: 'trophy', test: function (st) { return solvedList(st).length >= 150; } },
    ],
    ingles: [
      { key: 'first-hello', nome: 'Hello, World!', desc: 'Resolva seu primeiro exercício de inglês.', icon: 'play', test: function (st) { return solvedList(st).length >= 1; } },
      { key: 'first-cafe', nome: 'Coffee, Please', desc: 'Resolva um exercício no café ou nas compras.', icon: 'heart', test: has(['CAFÉ', 'COMPRAS']) },
      { key: 'first-trip', nome: 'Pé na Estrada', desc: 'Resolva um exercício de aeroporto, hotel ou transporte.', icon: 'map', test: has(['AEROPORTO', 'HOTEL', 'TRANSPORTE']) },
      { key: 'first-ear', nome: 'Ouvido Afiado', desc: 'Acerte um exercício de ditado.', icon: 'volume', test: function (st) { return solvedList(st).some(function (e) { return e.kind === 'dictation'; }); } },
      { key: 'first-meeting', nome: 'Voz na Reunião', desc: 'Resolva um exercício de reunião ou videochamada.', icon: 'user', test: has(['REUNIÕES', 'VIDEOCHAMADAS']) },
      { key: 'first-deal', nome: 'Negócio Fechado', desc: 'Resolva um exercício de negociação.', icon: 'target', test: has(['NEGOCIAÇÃO']) },
      { key: 'en-master', nome: 'Fluent Speaker', desc: 'Conclua os 150 exercícios.', icon: 'trophy', test: function (st) { return solvedList(st).length >= 150; } },
    ],
  };
  function achievements() { return (SPECIFIC[global.Tracks.activeId()] || SPECIFIC.sql).slice(0, 1).concat(COMMON, (SPECIFIC[global.Tracks.activeId()] || SPECIFIC.sql).slice(1)); }

  /** Medalhas de conclusão de nível. */
  const MEDALS = [
    { level: 1, nome: 'Medalha Bronze', desc: 'Nível Iniciante completo', tone: 'bronze' },
    { level: 2, nome: 'Medalha Prata', desc: 'Nível Intermediário completo', tone: 'silver' },
    { level: 3, nome: 'Medalha Ouro', desc: 'Nível Avançado completo', tone: 'gold' },
  ];

  /* ------------------------- Promoções: cálculo ------------------------- */
  function earnedPromotions(st) {
    const total = solvedList(st).length;
    return C().ALL_ROLES.filter(function (p) { return p.final ? total >= 150 : levelCount(st, p.level) >= p.need; });
  }
  function currentRole(st) {
    const e = earnedPromotions(st);
    return e.length ? e[e.length - 1] : C().START_ROLE;
  }
  function nextRole(st) {
    const earned = earnedPromotions(st).map(function (p) { return p.key; });
    const next = C().ALL_ROLES.find(function (p) { return earned.indexOf(p.key) < 0; });
    if (!next) return null;
    const have = next.final ? solvedList(st).length : levelCount(st, next.level);
    const prevNeed = next.final ? 0 : (C().PROMOTIONS.filter(function (p) { return p.level === next.level && p.need < next.need; }).pop() || { need: 0 }).need;
    return { role: next, have: have, need: next.need, remaining: next.need - have, pct: Math.max(0, Math.min(1, (have - prevNeed) / (next.need - prevNeed))) };
  }

  /** Avalia novas promoções e conquistas após uma mudança de estado. */
  function evaluate(st, ctx) {
    const now = new Date().toISOString();
    const got = st.progress.promotions.map(function (p) { return p.key; });
    const newPromotions = earnedPromotions(st).filter(function (p) { return got.indexOf(p.key) < 0; });
    newPromotions.forEach(function (p) { st.progress.promotions.push({ key: p.key, at: now }); });
    const newAchievements = achievements().filter(function (a) { return !st.progress.achievements[a.key] && a.test(st, ctx); });
    newAchievements.forEach(function (a) { st.progress.achievements[a.key] = now; });
    if (solvedList(st).length >= 150 && !st.progress.completedAt) st.progress.completedAt = now;
    return { newPromotions: newPromotions, newAchievements: newAchievements };
  }

  /* --------------------------------- Ranking --------------------------------- */
  const TIERS = [
    { min: 0, nome: 'Bronze', tone: 'bronze' }, { min: 300, nome: 'Prata', tone: 'silver' }, { min: 900, nome: 'Ouro', tone: 'gold' },
    { min: 1700, nome: 'Platina', tone: 'platinum' }, { min: 2500, nome: 'Diamante', tone: 'diamond' }, { min: 3000, nome: 'Lenda', tone: 'legend' },
  ];
  function tierOf(xp) { return TIERS.filter(function (t) { return xp >= t.min; }).pop(); }
  const LEAGUE = [
    ['Marina Okada', 2870], ['Caio Bernardes', 2440], ['Lívia Antunes', 2010], ['Otávio Reis', 1690], ['Yasmin Prates', 1360],
    ['Gustavo Leal', 1080], ['Renata Sá', 820], ['Pedro Galvão', 590], ['Aline Cunha', 360], ['Tomás Viana', 210], ['Beatriz Moura', 90], ['Igor Matos', 30],
  ];
  function leaderboard(st) {
    const me = { nome: st.profile.apelido || st.profile.nome || 'Você', xp: st.progress.xp, me: true };
    const C = global.Cloud, real = C && C.uid && C.board(st.currentTrack);
    if (real) {   // liga real: alunos da plataforma (Firebase)
      return real.filter(function (r) { return r.uid !== C.uid; }).map(function (r) { return { nome: r.nome, xp: r.xp }; }).concat([me])
        .sort(function (a, b) { return b.xp - a.xp || (a.me ? -1 : b.me ? 1 : 0); })
        .map(function (p, i) { return Object.assign(p, { pos: i + 1, tier: tierOf(p.xp) }); });
    }
    return LEAGUE.map(function (p) { return { nome: p[0], xp: p[1] }; }).concat([me])
      .sort(function (a, b) { return b.xp - a.xp || (a.me ? -1 : b.me ? 1 : 0); })
      .map(function (p, i) { return Object.assign(p, { pos: i + 1, tier: tierOf(p.xp) }); });
  }

  global.Gamification = {
    XP: XP, DIFF_LABEL: DIFF_LABEL, MEDALS: MEDALS, TIERS: TIERS, CAREERS: CAREERS,
    get START_ROLE() { return C().START_ROLE; },
    get PROMOTIONS() { return C().PROMOTIONS; },
    get FINAL() { return C().FINAL; },
    get ALL_ROLES() { return C().ALL_ROLES; },
    get ACHIEVEMENTS() { return achievements(); },
    get MAX_XP() { return global.ExerciseBank.EXERCISES.reduce(function (s, e) { return s + XP[e.diff]; }, 0); },
    solvedList: solvedList, levelCount: levelCount, earnedPromotions: earnedPromotions, currentRole: currentRole, nextRole: nextRole, evaluate: evaluate, tierOf: tierOf, leaderboard: leaderboard,
  };
})(window);
