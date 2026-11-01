/* =====================================================================
   py-data.js — Dados da NexusMarket para a trilha de Python
   ---------------------------------------------------------------------
   Os mesmos dados existem em JS (prévia na tela) e viram código Python
   que roda antes de cada exercício (prelude):
     produtos, clientes, vendas      → listas de dicionários
     cadastro_bruto, precos_texto    → dados "sujos" para limpeza
     VENDAS_CSV                      → texto CSV (módulo csv)
     vendas_df, produtos_df, clientes_df, pedidos_incompletos (pandas)
   ===================================================================== */
(function (global) {
  'use strict';
  const produtos = [
    ['P01', 'Notebook Pro 14', 'Eletrônicos', 4200, 3150, 8], ['P02', 'Smartphone X', 'Eletrônicos', 2500, 1800, 15], ['P03', 'Fone Bluetooth', 'Eletrônicos', 350, 190, 40],
    ['P04', 'Monitor 27', 'Informática', 1600, 1150, 12], ['P05', 'Teclado Mecânico', 'Informática', 420, 260, 25], ['P06', 'Mouse Sem Fio', 'Informática', 150, 80, 60],
    ['P07', 'Cadeira Ergonômica', 'Casa', 1300, 820, 6], ['P08', 'Luminária LED', 'Casa', 180, 95, 30], ['P09', 'Cafeteira', 'Casa', 520, 330, 14],
    ['P10', 'Tênis de Corrida', 'Esportes', 600, 360, 20], ['P11', 'Bicicleta Urbana', 'Esportes', 2200, 1500, 4], ['P12', 'Garrafa Térmica', 'Esportes', 90, 40, 80],
  ].map(function (r) { return { codigo: r[0], nome: r[1], categoria: r[2], preco: r[3], custo: r[4], estoque: r[5] }; });
  const clientes = [
    ['C01', 'Ana Souza', 'São Paulo', 'SP', 'Varejo', '2023-02-14'], ['C02', 'Bruno Lima', 'Campinas', 'SP', 'Corporativo', '2022-08-01'],
    ['C03', 'Carla Mendes', 'Rio de Janeiro', 'RJ', 'Varejo', '2024-01-20'], ['C04', 'Diego Rocha', 'Belo Horizonte', 'MG', 'Varejo', '2023-06-11'],
    ['C05', 'Elisa Prado', 'Curitiba', 'PR', 'Corporativo', '2021-11-30'], ['C06', 'Felipe Alves', 'Porto Alegre', 'RS', 'Varejo', '2024-03-05'],
    ['C07', 'Gabriela Nunes', 'Salvador', 'BA', 'Varejo', '2022-12-09'], ['C08', 'Henrique Dias', 'Recife', 'PE', 'Corporativo', '2023-09-17'],
    ['C09', 'Isabela Costa', 'São Paulo', 'SP', 'Corporativo', '2021-04-22'], ['C10', 'João Martins', 'Fortaleza', 'CE', 'Varejo', '2024-05-28'],
    ['C11', 'Karina Lopes', 'Goiânia', 'GO', 'Varejo', '2025-11-03'], ['C12', 'Lucas Ferreira', 'Manaus', 'AM', 'Corporativo', '2026-02-16'],
  ].map(function (r) { return { id: r[0], nome: r[1], cidade: r[2], estado: r[3], segmento: r[4], desde: r[5] }; });

  // vendas: 40 pedidos de jan a jun/2026 (gerador fixo)
  let seed = 20260101;
  const rnd = function () { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  const pickW = function (list, w) { const r = rnd() * w.reduce(function (a, b) { return a + b; }, 0); let acc = 0; for (let i = 0; i < list.length; i++) { acc += w[i]; if (r < acc) return list[i]; } return list[list.length - 1]; };
  const vendas = [];
  const pw = [3, 4, 6, 3, 4, 6, 2, 5, 4, 4, 2, 7];
  for (let i = 0; i < 40; i++) {
    const p = pickW(produtos, pw), c = clientes[Math.floor(rnd() * 10)];   // C11 e C12 ainda não compraram
    const m = 1 + Math.floor(i / 7), d = 2 + Math.floor(rnd() * 26);
    const qtd = p.preco > 2000 ? 1 + Math.floor(rnd() * 2) : 1 + Math.floor(rnd() * 4);
    const st = rnd() < 0.1 ? 'Cancelado' : (i >= 36 && rnd() < 0.6 ? 'Em trânsito' : 'Entregue');
    vendas.push({ pedido: 1001 + i, data: '2026-' + String(Math.min(m, 6)).padStart(2, '0') + '-' + String(d).padStart(2, '0'), cliente: c.id, produto: p.codigo, categoria: p.categoria, qtd: qtd, preco: p.preco, canal: rnd() < 0.55 ? 'Online' : 'Loja', status: st });
  }
  const cadastro_bruto = ['  ana souza ', 'BRUNO LIMA', 'carla  mendes', 'Diego Rocha ', ' elisa prado', 'FELIPE alves', 'gabriela nunes  '];
  const precos_texto = ['R$ 4.200,00', 'R$ 2.500,00', 'R$ 350,00', 'R$ 1.600,00', 'R$ 89,90'];

  /* --------------------------- Conversão para Python --------------------------- */
  function pyVal(v) {
    if (v === null || v === undefined) return 'None';
    if (typeof v === 'number') return Number.isInteger(v) ? String(v) : String(v);
    if (typeof v === 'boolean') return v ? 'True' : 'False';
    return "'" + String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
  }
  function pyList(rows) {
    return '[\n' + rows.map(function (r) { return '    {' + Object.keys(r).map(function (k) { return "'" + k + "': " + pyVal(r[k]); }).join(', ') + '}'; }).join(',\n') + '\n]';
  }
  function csvOf(rows) { const ks = Object.keys(rows[0]); return ks.join(',') + '\n' + rows.map(function (r) { return ks.map(function (k) { return r[k]; }).join(','); }).join('\n'); }

  const BASE = [
    'produtos = ' + pyList(produtos),
    'clientes = ' + pyList(clientes),
    'vendas = ' + pyList(vendas),
    'cadastro_bruto = [' + cadastro_bruto.map(pyVal).join(', ') + ']',
    'precos_texto = [' + precos_texto.map(pyVal).join(', ') + ']',
    'VENDAS_CSV = """' + csvOf(vendas.slice(0, 12)) + '"""',
  ].join('\n');
  const PANDAS = [
    'import pandas as pd',
    "pd.set_option('display.width', 120)", "pd.set_option('display.max_columns', 12)", "pd.set_option('display.max_rows', 30)",
    'vendas_df = pd.DataFrame(vendas)', 'produtos_df = pd.DataFrame(produtos)', 'clientes_df = pd.DataFrame(clientes)',
    "pedidos_incompletos = pd.DataFrame({'pedido': [2001, 2002, 2003, 2004, 2005, 2006], 'cliente': ['C01', None, 'C03', 'C04', None, 'C06'], 'qtd': [2, 1, None, 3, 1, None], 'valor': [840.0, 150.0, 520.0, None, 90.0, 1300.0], 'canal': ['Online', 'Loja', None, 'Online', 'Online', 'Loja']})",
  ].join('\n');

  /** Variáveis disponíveis (para a tela "Dados disponíveis"). */
  const VARS = {
    vendas: { rows: vendas, desc: 'Lista de dicionários com os 40 pedidos do semestre.' },
    produtos: { rows: produtos, desc: 'Lista de dicionários com os 12 produtos do catálogo.' },
    clientes: { rows: clientes, desc: 'Lista de dicionários com os 12 clientes (2 ainda não compraram).' },
    cadastro_bruto: { list: cadastro_bruto, desc: 'Lista de nomes digitados sem padrão.' },
    precos_texto: { list: precos_texto, desc: 'Lista de preços em texto, no formato brasileiro.' },
    VENDAS_CSV: { text: csvOf(vendas.slice(0, 12)), desc: 'Texto CSV com os 12 primeiros pedidos.' },
    vendas_df: { rows: vendas, df: true, desc: 'DataFrame com os 40 pedidos (pd.DataFrame(vendas)).' },
    produtos_df: { rows: produtos, df: true, desc: 'DataFrame do catálogo de produtos.' },
    clientes_df: { rows: clientes, df: true, desc: 'DataFrame de clientes.' },
    pedidos_incompletos: { rows: [{ pedido: 2001, cliente: 'C01', qtd: 2, valor: 840, canal: 'Online' }, { pedido: 2002, cliente: null, qtd: 1, valor: 150, canal: 'Loja' }, { pedido: 2003, cliente: 'C03', qtd: null, valor: 520, canal: null }, { pedido: 2004, cliente: 'C04', qtd: 3, valor: null, canal: 'Online' }, { pedido: 2005, cliente: null, qtd: 1, valor: 90, canal: 'Online' }, { pedido: 2006, cliente: 'C06', qtd: null, valor: 1300, canal: 'Loja' }], df: true, desc: 'DataFrame com valores ausentes (NaN/None).' },
  };

  global.PyData = { produtos: produtos, clientes: clientes, vendas: vendas, cadastro_bruto: cadastro_bruto, precos_texto: precos_texto, BASE: BASE, PANDAS: PANDAS, VARS: VARS, prelude: function (pandas) { return BASE + (pandas ? '\n' + PANDAS : ''); } };
})(typeof window !== 'undefined' ? window : globalThis);
