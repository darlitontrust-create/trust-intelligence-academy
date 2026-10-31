/* =====================================================================
   dax-data.js — Modelo de dados do Power BI (NexusMarket)
   ---------------------------------------------------------------------
   Esquema estrela:
     fVendas  (fato)  → dProduto, dCliente, dLoja, dCalendario[Data]
                        (DataEntrega → dCalendario: relação INATIVA)
     fMetas   (fato)  → dLoja, dCalendario[Data]
   Datas em número serial (dias desde 30/12/1899), como no Excel e no
   Power BI. As vendas vão de jan/2025 a jun/2026 (HOJE = 30/06/2026).
   Os dados são gerados por um sorteio com semente fixa: sempre iguais.
   ===================================================================== */
(function (global) {
  'use strict';
  const serial = function (y, m, d) { return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(1899, 11, 30)) / 86400000); };
  const fromSerial = function (n) { const d = new Date(Date.UTC(1899, 11, 30) + n * 86400000); return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate(), wd: d.getUTCDay() }; };
  const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const DIAS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

  /* ------------------------------ Dimensões ------------------------------ */
  const dProduto = [
    ['P01', 'Smartphone Galaxy A55', 'Eletrônicos', 'Smartphones', 'TecnoMax', 2199, 1500],
    ['P02', 'Fone Bluetooth Pulse', 'Eletrônicos', 'Áudio', 'SoundCo', 349.9, 180],
    ['P03', 'Smart TV 50 4K', 'Eletrônicos', 'TVs', 'TecnoMax', 2899, 2100],
    ['P04', 'Notebook Pro 14', 'Informática', 'Notebooks', 'CompuBR', 5499, 4100],
    ['P05', 'Mouse Sem Fio', 'Informática', 'Acessórios', 'CompuBR', 89.9, 35],
    ['P06', 'Monitor 27 IPS', 'Informática', 'Monitores', 'TecnoMax', 1599, 1080],
    ['P07', 'Air Fryer 5L', 'Casa', 'Eletroportáteis', 'LarFácil', 449.9, 250],
    ['P08', 'Cafeteira Expresso', 'Casa', 'Eletroportáteis', 'LarFácil', 899, 540],
    ['P09', 'Aspirador Robô', 'Casa', 'Limpeza', 'LarFácil', 1899, 1200],
    ['P10', 'Bicicleta Aro 29', 'Esportes', 'Ciclismo', 'MoveOn', 2390, 1600],
    ['P11', 'Tênis de Corrida', 'Esportes', 'Calçados', 'MoveOn', 599.9, 280],
    ['P12', 'Kit Halteres 20kg', 'Esportes', 'Musculação', 'MoveOn', 319, 150],
  ];
  const dCliente = [
    ['C01', 'Ana Souza', 'Varejo', 'São Paulo', 'SP', 'Sudeste', serial(2024, 3, 12)],
    ['C02', 'Bruno Lima', 'Varejo', 'Rio de Janeiro', 'RJ', 'Sudeste', serial(2024, 6, 2)],
    ['C03', 'Clara Mendes', 'Varejo', 'Belo Horizonte', 'MG', 'Sudeste', serial(2024, 9, 21)],
    ['C04', 'Daniel Rocha', 'Varejo', 'Curitiba', 'PR', 'Sul', serial(2024, 11, 5)],
    ['C05', 'Eduarda Alves', 'Varejo', 'Porto Alegre', 'RS', 'Sul', serial(2025, 1, 18)],
    ['C06', 'Felipe Costa', 'Varejo', 'Recife', 'PE', 'Nordeste', serial(2025, 2, 9)],
    ['C07', 'Gabriela Dias', 'Varejo', 'Salvador', 'BA', 'Nordeste', serial(2025, 4, 27)],
    ['C08', 'Henrique Melo', 'Varejo', 'Goiânia', 'GO', 'Centro-Oeste', serial(2025, 6, 14)],
    ['C09', 'Isabela Nunes', 'Varejo', 'Manaus', 'AM', 'Norte', serial(2025, 8, 3)],
    ['C10', 'TechSul Ltda', 'Corporativo', 'Florianópolis', 'SC', 'Sul', serial(2024, 5, 20)],
    ['C11', 'Grupo Horizonte', 'Corporativo', 'São Paulo', 'SP', 'Sudeste', serial(2024, 8, 8)],
    ['C12', 'Nordeste Digital', 'Corporativo', 'Fortaleza', 'CE', 'Nordeste', serial(2025, 3, 30)],
    ['C13', 'Lucas Pereira', 'Varejo', 'Brasília', 'DF', 'Centro-Oeste', serial(2025, 10, 11)],
    ['C14', 'Mariana Teixeira', 'Varejo', 'Campinas', 'SP', 'Sudeste', serial(2026, 1, 22)],
  ];
  const dLoja = [
    ['L1', 'Paulista', 'Loja física', 'Sudeste', 'Marcos Vieira'],
    ['L2', 'Curitiba Centro', 'Loja física', 'Sul', 'Patrícia Gomes'],
    ['L3', 'Recife Boa Viagem', 'Loja física', 'Nordeste', 'Helena Duarte'],
    ['L4', 'Site', 'Online', 'Nacional', 'Rafael Souza'],
    ['L5', 'Marketplace', 'Online', 'Nacional', 'Rafael Souza'],
  ];

  /* ------------------------------ Calendário ------------------------------ */
  const dCalendario = [];
  for (let n = serial(2025, 1, 1); n <= serial(2026, 12, 31); n++) {
    const d = fromSerial(n);
    dCalendario.push([n, d.y, d.m, MESES[d.m - 1], MESES[d.m - 1] + '/' + d.y, d.y * 100 + d.m, 'T' + Math.ceil(d.m / 3), d.y + '-T' + Math.ceil(d.m / 3), DIAS[d.wd], d.wd !== 0 && d.wd !== 6]);
  }

  /* ------------------------------ Fatos ------------------------------ */
  let seed = 20260630;
  const rnd = function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const pick = function (arr, w) { if (!w) return arr[Math.floor(rnd() * arr.length)]; const t = w.reduce(function (a, b) { return a + b; }, 0); let r = rnd() * t; for (let i = 0; i < arr.length; i++) { r -= w[i]; if (r <= 0) return arr[i]; } return arr[arr.length - 1]; };
  const fVendas = [];
  let pedido = 5001;
  const prodW = [9, 12, 5, 4, 14, 6, 11, 7, 4, 3, 9, 6];
  const lojaW = [24, 14, 12, 30, 20];
  // ~ 18 meses; mais pedidos em 2026 (crescimento) e em nov/dez (Black Friday e Natal)
  for (let y = 2025; y <= 2026; y++) {
    for (let m = 1; m <= 12; m++) {
      if (y === 2026 && m > 6) break;
      const base = (y === 2025 ? 13 : 16) + (m === 11 ? 7 : m === 12 ? 6 : m === 5 ? 2 : 0);
      const last = m === 12 ? 31 : fromSerial(serial(y, m + 1, 1) - 1).d;
      for (let k = 0; k < base; k++) {
        const day = 1 + Math.floor(rnd() * last);
        const data = serial(y, m, day);
        const p = pick(dProduto, prodW);
        const cli = dCliente.filter(function (c) { return c[6] <= data; });
        const c = pick(cli);
        const corp = c[2] === 'Corporativo';
        const l = pick(dLoja, lojaW);
        const qtd = corp ? 2 + Math.floor(rnd() * 4) : 1 + Math.floor(rnd() * (p[5] < 500 ? 3 : 2));
        const desc = pick([0, 0.05, 0.1], corp ? [2, 3, 3] : [6, 3, 1]);
        const valor = Math.round(qtd * p[5] * (1 - desc) * 100) / 100;
        const custo = Math.round(qtd * p[6] * 100) / 100;
        const entrega = data + (l[2] === 'Online' ? 2 + Math.floor(rnd() * 6) : 0);
        const status = rnd() < 0.06 ? 'Devolvido' : 'Entregue';
        fVendas.push([0, data, entrega, p[0], c[0], l[0], qtd, p[5], desc, valor, custo, status]);
      }
    }
  }
  fVendas.sort(function (a, b) { return a[1] - b[1]; });
  fVendas.forEach(function (r) { r[0] = pedido++; });

  const fMetas = [];
  const metaBase = { L1: 7500, L2: 4000, L3: 3500, L4: 10500, L5: 6500 };
  for (let y = 2025; y <= 2026; y++) {
    for (let m = 1; m <= 12; m++) {
      dLoja.forEach(function (l) {
        const sazonal = m === 11 ? 1.5 : m === 12 ? 1.4 : m === 1 || m === 2 ? 0.85 : 1;
        fMetas.push([l[0], serial(y, m, 1), Math.round(metaBase[l[0]] * sazonal * (y === 2026 ? 1.12 : 1) / 100) * 100]);
      });
    }
  }

  /* ------------------------------ Modelo ------------------------------ */
  const TABLES = {
    fVendas: { kind: 'fato', cols: ['Pedido', 'Data', 'DataEntrega', 'CodProduto', 'CodCliente', 'CodLoja', 'Qtd', 'Preço Unit', 'Desconto', 'Valor', 'Custo', 'Status'], rows: fVendas,
      types: { Data: 'date', DataEntrega: 'date', 'Preço Unit': 'money', Desconto: 'pct', Valor: 'money', Custo: 'money' } },
    fMetas: { kind: 'fato', cols: ['CodLoja', 'Data', 'Meta'], rows: fMetas, types: { Data: 'date', Meta: 'money' } },
    dProduto: { kind: 'dimensão', cols: ['CodProduto', 'Produto', 'Categoria', 'Subcategoria', 'Marca', 'Preço Lista', 'Custo Unit'], rows: dProduto, types: { 'Preço Lista': 'money', 'Custo Unit': 'money' } },
    dCliente: { kind: 'dimensão', cols: ['CodCliente', 'Cliente', 'Segmento', 'Cidade', 'UF', 'Região', 'Cadastro'], rows: dCliente, types: { Cadastro: 'date' } },
    dLoja: { kind: 'dimensão', cols: ['CodLoja', 'Loja', 'Canal', 'Região Loja', 'Gerente'], rows: dLoja },
    dCalendario: { kind: 'calendário', cols: ['Data', 'Ano', 'Mês', 'Nome Mês', 'Mês Ano', 'AnoMês', 'Trimestre', 'Ano Trimestre', 'Dia Semana', 'Dia Útil'], rows: dCalendario,
      types: { Data: 'date' }, sortBy: { 'Mês Ano': 'AnoMês', 'Nome Mês': 'Mês', 'Ano Trimestre': 'Ano Trimestre' }, dateTable: 'Data' },
  };
  const RELATIONSHIPS = [
    { from: 'fVendas', fromCol: 'CodProduto', to: 'dProduto', toCol: 'CodProduto', active: true },
    { from: 'fVendas', fromCol: 'CodCliente', to: 'dCliente', toCol: 'CodCliente', active: true },
    { from: 'fVendas', fromCol: 'CodLoja', to: 'dLoja', toCol: 'CodLoja', active: true },
    { from: 'fVendas', fromCol: 'Data', to: 'dCalendario', toCol: 'Data', active: true },
    { from: 'fVendas', fromCol: 'DataEntrega', to: 'dCalendario', toCol: 'Data', active: false },
    { from: 'fMetas', fromCol: 'CodLoja', to: 'dLoja', toCol: 'CodLoja', active: true },
    { from: 'fMetas', fromCol: 'Data', to: 'dCalendario', toCol: 'Data', active: true },
  ];
  /** Medidas que já existem no modelo (podem ser usadas nos exercícios). */
  const MEASURES = [
    { name: 'Total Vendas', expr: 'SUM(fVendas[Valor])', fmt: 'money', desc: 'Soma do valor vendido.' },
    { name: 'Qtd Vendida', expr: 'SUM(fVendas[Qtd])', fmt: 'int', desc: 'Unidades vendidas.' },
    { name: 'Custo Total', expr: 'SUM(fVendas[Custo])', fmt: 'money', desc: 'Custo das mercadorias vendidas.' },
    { name: 'Lucro', expr: '[Total Vendas] - [Custo Total]', fmt: 'money', desc: 'Vendas menos custo.' },
    { name: 'Pedidos', expr: 'COUNTROWS(fVendas)', fmt: 'int', desc: 'Quantidade de pedidos.' },
    { name: 'Total Metas', expr: 'SUM(fMetas[Meta])', fmt: 'money', desc: 'Soma das metas mensais.' },
  ];

  global.DaxData = { TABLES: TABLES, RELATIONSHIPS: RELATIONSHIPS, MEASURES: MEASURES, serial: serial, fromSerial: fromSerial, MESES: MESES, TODAY: serial(2026, 6, 30) };
})(typeof window !== 'undefined' ? window : globalThis);
