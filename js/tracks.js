/* =====================================================================
   tracks.js — Catálogo de temas (trilhas) da Trust Intelligence Academy
   ---------------------------------------------------------------------
   Cada tema é uma trilha independente com progresso próprio
   (state.tracks[id] no storage), cor, símbolo, exercícios, aulas,
   carreira e certificados.
   Para lançar um tema novo:
     1. Crie o banco de exercícios (window.<X>Bank) e o pacote de aulas.
     2. Troque `status` para 'ativo' e aponte `bank` para o banco.
   `ExerciseBank` é um atalho que sempre aponta para a trilha atual.
   ===================================================================== */
(function (global) {
  'use strict';

  const TRACKS = [
    {
      id: 'sql', status: 'ativo', icon: 'db', start: 'dashboard', kind: 'sql',
      nome: 'SQL Prático', short: 'SQL', tag: 'Banco de dados',
      color: { a: '#2fd8f0', b: '#4d7cff' },            // azul
      desc: 'Do primeiro SELECT a window functions, triggers e otimização, com correção automática em SQLite.',
      facts: ['150 exercícios', '3 níveis', '50h'], total: 150, bankName: 'SQLBank',
      summary: 'do primeiro SELECT a window functions, CTEs recursivas, triggers, procedures, MERGE e otimização de consultas',
    },
    {
      id: 'excel', status: 'ativo', icon: 'table', start: 'dashboard', kind: 'excel',
      nome: 'Excel Prático', short: 'Excel', tag: 'Planilhas',
      color: { a: '#4ade80', b: '#10b981' },            // verde
      desc: 'Fórmulas, PROCX, SOMASES, matrizes dinâmicas e análises de negócio, com correção automática em planilha.',
      facts: ['150 exercícios', '3 níveis', '50h'], total: 150, bankName: 'ExcelBank',
      summary: 'das primeiras fórmulas a PROCX, ÍNDICE e CORRESP, SOMASES, matrizes dinâmicas, LET, estatística e matemática financeira',
    },
    {
      id: 'powerbi', status: 'ativo', icon: 'bars', start: 'dashboard', kind: 'powerbi',
      nome: 'Power BI & DAX', short: 'Power BI', tag: 'Business Intelligence',
      color: { a: '#ffd76a', b: '#f2a900' },            // amarelo
      desc: 'Medidas DAX, CALCULATE, contexto de filtro, inteligência de tempo e rankings, com correção automática num modelo estrela.',
      facts: ['150 exercícios', '3 níveis', '50h'], total: 150, bankName: 'PBIBank',
      summary: 'das primeiras medidas a CALCULATE, contexto de filtro, iteradores, inteligência de tempo, RANKX, curva ABC e tabelas virtuais',
    },
    {
      id: 'powerquery', status: 'ativo', icon: 'funnel', start: 'dashboard', kind: 'powerquery',
      nome: 'Power Query', short: 'Power Query', tag: 'Preparação de dados',
      color: { a: '#7dd3fc', b: '#0284c7' },            // azul-céu
      desc: 'Limpe, combine e remodele dados no Excel e no Power BI: etapas aplicadas, mesclagens, unpivot, linguagem M e atualização automática.',
      facts: ['150 exercícios', '3 níveis', '50h'], total: 150, bankName: 'PQBank',
      summary: 'dos primeiros passos no editor (fontes, tipos, filtros e limpeza de texto) a mesclar, acrescentar, agrupar e transformar colunas em linhas, à linguagem M, parâmetros, funções, query folding, atualização e preparação do modelo estrela',
      related: [{ id: 'powerbi', label: 'Próximo passo: medidas DAX' }, { id: 'excel', label: 'Também funciona no Excel' }, { id: 'sql', label: 'Base para fontes de banco' }],
    },
    {
      id: 'gestao', status: 'ativo', icon: 'cycle', start: 'dashboard', kind: 'gestao',
      nome: 'Gestão da Qualidade', short: 'Gestão', tag: 'Melhoria contínua',
      color: { a: '#ff9a76', b: '#ff5e3a' },            // coral
      desc: 'PDCA, Pareto, Ishikawa, Lean, CEP, Seis Sigma e FMEA, com casos práticos e correção automática na operação da NexusMarket.',
      facts: ['150 exercícios', '3 níveis', '50h'], total: 150, bankName: 'GQBank',
      summary: 'dos conceitos de qualidade e do PDCA às ferramentas da qualidade, MASP, 8D, Lean, controle estatístico, Seis Sigma, FMEA e ISO 9001',
      related: [{ id: 'sixsigma', label: 'Próximo passo' }],
    },
    {
      id: 'python', status: 'ativo', icon: 'code', start: 'dashboard', kind: 'python',
      nome: 'Python para Dados', short: 'Python', tag: 'Programação',
      color: { a: '#fff59d', b: '#d4c21a' },            // amarelo em outro tom (limão)
      desc: 'Do primeiro print() ao pandas: listas, dicionários, funções, limpeza de dados, groupby e merge, com Python de verdade no navegador.',
      facts: ['150 exercícios', '3 níveis', '50h'], total: 150, bankName: 'PyBank',
      summary: 'dos fundamentos (variáveis, listas, dicionários, laços e funções) à análise de dados com a biblioteca padrão e com pandas: filtros, groupby, merge, tabelas dinâmicas e datas',
    },
    {
      id: 'sixsigma', status: 'ativo', icon: 'target', start: 'dashboard', kind: 'sixsigma',
      nome: 'Lean Six Sigma', short: 'Six Sigma', tag: 'White ao Black Belt',
      color: { a: '#5eead4', b: '#14b8a6' },            // verde-água
      desc: 'Do White ao Black Belt: DMAIC, Lean, estatística, testes de hipótese, DOE e liderança de projetos, com casos reais da NexusMarket.',
      facts: ['150 exercícios', '3 níveis', '4 faixas'], total: 150, bankName: 'SSBank',
      summary: 'do White e Yellow Belt (fundamentos, Lean e ferramentas) ao Green Belt (DMAIC completo) e ao Black Belt (estatística avançada, DOE e liderança do programa)',
      related: [{ id: 'gestao', label: 'Base' }, { id: 'estatistica', label: 'Base estatística' }, { id: 'python', label: 'Ferramenta para as análises' }, { id: 'powerbi', label: 'Ferramenta para os painéis' }],
    },
    {
      id: 'ingles', status: 'ativo', icon: 'chat', start: 'dashboard', kind: 'ingles',
      nome: 'Inglês para o Dia a Dia', short: 'Inglês', tag: 'Idiomas',
      color: { a: '#ff9fd2', b: '#e8459b' },            // rosa
      desc: 'Conversação para viagem, vida social e trabalho: ouça diálogos, monte frases, pratique a fala e use o inglês em situações reais.',
      facts: ['150 exercícios', '3 níveis', '50h'], total: 150, bankName: 'EnBank',
      summary: 'das apresentações e pedidos no café às viagens, à conversa social e ao inglês do trabalho: reuniões, e-mails, apresentação de dados, entrevistas e negociação',
    },
    {
      id: 'estatistica', status: 'ativo', icon: 'bell', start: 'dashboard', kind: 'estatistica',
      nome: 'Estatística Aplicada', short: 'Estatística', tag: 'Análise de dados',
      color: { a: '#a5b4fc', b: '#6366f1' },            // índigo
      desc: 'Da estatística descritiva aos testes A/B, regressão e previsão, com dados reais e cálculos feitos na hora para decidir melhor.',
      facts: ['150 exercícios', '3 níveis', '50h'], total: 150, bankName: 'ESBank',
      summary: 'da estatística descritiva (médias, dispersão, quartis e gráficos) à probabilidade, distribuições, intervalos de confiança, testes de hipótese, testes A/B, regressão e previsão de séries temporais',
      related: [{ id: 'python', label: 'Ferramenta para as análises' }, { id: 'sixsigma', label: 'Aplicação em melhoria de processos' }, { id: 'powerbi', label: 'Ferramenta para os painéis' }],
    },
    {
      id: 'storytelling', status: 'ativo', icon: 'slides', start: 'dashboard', kind: 'storytelling',
      nome: 'Storytelling com Dados', short: 'Storytelling', tag: 'Comunicação',
      color: { a: '#fdba74', b: '#f97316' },            // laranja
      desc: 'Transforme análises em decisões: contexto, escolha do gráfico, clareza visual, narrativa, painéis executivos e apresentações que convencem.',
      facts: ['150 exercícios', '3 níveis', '50h'], total: 150, bankName: 'DVBank',
      summary: 'do contexto e da grande ideia à escolha do gráfico, clareza visual (Gestalt, atributos pré-atentivos e cor), títulos que concluem, arco narrativo, KPIs e comparações honestas, até dashboards executivos, apresentações, recomendações e ética',
      related: [{ id: 'powerbi', label: 'Ferramenta para os painéis' }, { id: 'estatistica', label: 'Base para comparações honestas' }],
    },
    {
      id: 'ia', status: 'em-breve', icon: 'sparkle', nome: 'IA para Dados', short: 'IA', tag: 'Inteligência Artificial',
      color: { a: '#d8b4fe', b: '#a46bff' },            // violeta
      desc: 'Prompts para análise, automação de relatórios e integração de IA com bancos e painéis.', facts: ['Prompts', 'Automação', 'Integrações'],
    },
    {
      id: 'ml', status: 'em-breve', icon: 'nodes', nome: 'Machine Learning Aplicado', short: 'ML', tag: 'Ciência de dados',
      color: { a: '#86efac', b: '#22c55e' },            // verde-menta
      desc: 'Previsão de demanda, churn e segmentação de clientes: do modelo simples à avaliação, com Python e casos de negócio.', facts: ['Classificação', 'Previsão', 'Segmentação'],
    },
    {
      id: 'automacao', status: 'em-breve', icon: 'bolt', nome: 'Automação com Power Automate', short: 'Automação', tag: 'Produtividade',
      color: { a: '#fda4af', b: '#f43f5e' },            // rosa-coral
      desc: 'Relatórios que se enviam sozinhos, alertas de indicadores e fluxos entre Excel, Power BI, Teams e e-mail, sem programar.', facts: ['Fluxos', 'Alertas', 'Integrações'],
    },
  ];

  function get(id) { return TRACKS.find(function (t) { return t.id === id; }); }
  /** Id da trilha atual (SQL quando ainda não há sessão). */
  function activeId() {
    const st = global.AppStorage && global.AppStorage.state;
    const id = st && st.currentTrack;
    const t = id && get(id);
    return t && t.status === 'ativo' ? id : 'sql';
  }
  function active() { return get(activeId()); }
  function bankOf(id) { return global[get(id).bankName]; }

  /** Banco de exercícios da trilha atual (propriedades resolvidas na hora). */
  const ExerciseBank = {
    get EXERCISES() { return bankOf(activeId()).EXERCISES; },
    get LEVELS() { return bankOf(activeId()).LEVELS; },
  };

  global.Tracks = { TRACKS: TRACKS, get: get, active: active, activeId: activeId, bankOf: bankOf };
  global.ExerciseBank = ExerciseBank;
})(typeof window !== 'undefined' ? window : globalThis);
