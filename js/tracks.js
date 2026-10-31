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
      id: 'gestao', status: 'ativo', icon: 'cycle', start: 'dashboard', kind: 'gestao',
      nome: 'Gestão da Qualidade', short: 'Gestão', tag: 'Melhoria contínua',
      color: { a: '#ff9a76', b: '#ff5e3a' },            // coral
      desc: 'PDCA, Pareto, Ishikawa, Lean, CEP, Seis Sigma e FMEA, com casos práticos e correção automática na operação da NexusMarket.',
      facts: ['150 exercícios', '3 níveis', '50h'], total: 150, bankName: 'GQBank',
      summary: 'dos conceitos de qualidade e do PDCA às ferramentas da qualidade, MASP, 8D, Lean, controle estatístico, Seis Sigma, FMEA e ISO 9001',
    },
    {
      id: 'python', status: 'em-breve', icon: 'code', nome: 'Python para Dados', short: 'Python', tag: 'Programação',
      color: { a: '#fff59d', b: '#d4c21a' },            // amarelo em outro tom (limão)
      desc: 'pandas, limpeza de dados, análises exploratórias e automação de relatórios.', facts: ['pandas', 'Automação', 'Gráficos'],
    },
    {
      id: 'ia', status: 'em-breve', icon: 'sparkle', nome: 'IA para Dados', short: 'IA', tag: 'Inteligência Artificial',
      color: { a: '#d8b4fe', b: '#a46bff' },            // violeta
      desc: 'Prompts para análise, automação de relatórios e integração de IA com bancos e painéis.', facts: ['Prompts', 'Automação', 'Integrações'],
    },
    {
      id: 'estatistica', status: 'em-breve', icon: 'bell', nome: 'Estatística Aplicada', short: 'Estatística', tag: 'Análise',
      color: { a: '#d6dbe8', b: '#8e94b0' },            // cinza
      desc: 'Médias, dispersão, correlação e testes para decisões de negócio.', facts: ['Descritiva', 'Correlação', 'Testes A/B'],
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
