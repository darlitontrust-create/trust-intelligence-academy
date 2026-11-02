/* =====================================================================
   ss-data.js — Dados da trilha de Lean Six Sigma (operação NexusMarket)
   ---------------------------------------------------------------------
   Os mesmos dados alimentam aulas e exercícios; as respostas dos
   exercícios são calculadas a partir deles (GQCharts.calc).
   ===================================================================== */
(function (global) {
  'use strict';
  const D = {
    /** Tempo de separação (min) por turno, 10 pedidos cada. */
    turnoA: [9.8, 10.4, 11.2, 10.9, 9.6, 10.8, 11.5, 10.1, 10.7, 11.0],
    turnoB: [8.9, 9.4, 8.7, 9.8, 9.1, 8.5, 9.6, 9.0, 8.8, 9.3],
    /** Tempo de separação antes e depois do novo layout, mesmos 8 separadores. */
    antes: [11.2, 10.8, 12.1, 11.5, 10.9, 12.4, 11.8, 11.1],
    depois: [10.1, 10.2, 10.9, 10.8, 10.0, 11.0, 10.9, 10.4],
    /** Prazo de entrega (h) em três CDs, 8 pedidos cada. */
    cds: { 'CD São Paulo': [26, 24, 28, 25, 27, 23, 26, 25], 'CD Belo Horizonte': [30, 32, 29, 31, 33, 30, 28, 31], 'CD Curitiba': [27, 26, 29, 28, 25, 27, 28, 26] },
    /** Entregas no prazo × atrasadas por transportadora. */
    transp: { nomes: ['Rápida', 'Expressa', 'Econômica'], tab: [[180, 20], [170, 30], [150, 50]] },
    /** Distância (km) × prazo de entrega (h), 10 entregas. */
    distancia: [[12, 8], [25, 7], [40, 14], [55, 13], [70, 20], [90, 21], [110, 29], [130, 28], [150, 37], [170, 36]],
    /** Tempo de separação (min) explicado por itens no pedido e corredores visitados. */
    mreg: { X: [[3, 2], [5, 3], [2, 1], [8, 4], [6, 4], [4, 2], [7, 5], [9, 6], [3, 3], [5, 2]], y: [6.4, 8.5, 4.6, 13.1, 11.8, 6.6, 13.4, 15.2, 7.4, 7.9] },
    /** DOE 2³ da seladora de embalagens: temperatura, pressão, tempo → resistência do selo (N). */
    doe: { fatores: ['Temperatura', 'Pressão', 'Tempo'], runs: [[-1, -1, -1, 18], [1, -1, -1, 27], [-1, 1, -1, 20], [1, 1, -1, 35], [-1, -1, 1, 19], [1, -1, 1, 28], [-1, 1, 1, 21], [1, 1, 1, 36]] },
    /** Pedidos com erro por dia (400 pedidos/dia), 20 dias. O dia 13 teve troca de sistema. */
    erros: [12, 10, 14, 11, 9, 13, 12, 10, 15, 11, 12, 10, 27, 13, 11, 12, 9, 14, 12, 11],
    /** Peso da embalagem (g), 15 subgrupos de 4 unidades. */
    pesos: [[500.8, 501.2, 499.9, 500.5], [501.0, 500.4, 500.9, 501.3], [499.8, 500.6, 500.2, 500.9], [500.5, 501.1, 500.7, 500.3], [501.4, 500.8, 501.0, 500.6], [500.2, 499.9, 500.7, 500.4], [500.9, 501.3, 500.6, 501.0], [500.3, 500.8, 500.1, 500.6], [501.1, 500.5, 501.4, 500.9], [500.6, 500.2, 500.9, 500.4], [502.4, 502.9, 502.1, 502.6], [500.7, 501.0, 500.3, 500.8], [500.4, 500.9, 500.6, 501.1], [501.0, 500.5, 500.8, 500.2], [500.6, 501.2, 500.4, 500.9]],
    /** Tempo de atendimento do SAC (min): assimétrico (muitos rápidos, poucos longos). */
    sac: [2.1, 2.4, 2.6, 2.8, 3.0, 3.1, 3.3, 3.5, 3.6, 3.8, 4.0, 4.2, 4.5, 4.8, 5.1, 5.5, 6.0, 6.8, 7.9, 9.6, 12.4, 3.2, 2.9, 4.1, 3.4],
    /** Reclamações do trimestre, por motivo. */
    reclamacoes: [['Atraso na entrega', 142], ['Produto avariado', 88], ['Item errado', 61], ['Cobrança indevida', 27], ['Falta de peça', 19], ['Embalagem violada', 14], ['Outros', 9]],
    /** Linha de base do projeto de pedidos com problema. */
    base: { pedidos: 5000, oport: 4, defeitos: 60 },
    /** Linha de embalagem num turno (OEE). */
    oee: { planned: 480, down: 72, ideal: 0.5, produced: 720, defects: 36 },
    /** Fluxo do pedido online (min). */
    vsm: [{ n: 'Receber pedido', ct: 2, wait: 30 }, { n: 'Separar', ct: 9, wait: 120 }, { n: 'Conferir', ct: 3, wait: 45 }, { n: 'Embalar', ct: 5, wait: 60 }, { n: 'Expedir', ct: 4, wait: 240 }],
  };
  global.SSData = D;
})(typeof window !== 'undefined' ? window : globalThis);
