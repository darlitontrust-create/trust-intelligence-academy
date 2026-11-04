/* =====================================================================
   es-data.js — Dados da trilha de Estatística Aplicada (NexusMarket)
   ---------------------------------------------------------------------
   Os mesmos dados alimentam aulas e exercícios; as respostas dos
   exercícios são calculadas a partir deles (GQCharts.calc).
   ===================================================================== */
(function (global) {
  'use strict';
  const D = {
    /** Valor de 30 pedidos do site (R$), em ordem crescente: poucos pedidos muito altos. */
    ticket: [42, 58, 63, 71, 75, 80, 84, 88, 92, 95, 99, 104, 110, 115, 118, 124, 129, 135, 142, 150, 158, 165, 179, 192, 210, 235, 268, 310, 395, 520],
    /** Notas da avaliação do app (1 a 5 estrelas) e quantidade de avaliações. */
    notas: { v: [1, 2, 3, 4, 5], n: [18, 22, 45, 140, 275] },
    /** Prazo de entrega (dias) de 12 pedidos em duas transportadoras. */
    rapida: [3, 3, 4, 3, 3, 4, 3, 3, 4, 3, 3, 4],
    flex: [1, 2, 6, 3, 1, 7, 2, 5, 1, 6, 2, 4],
    /** Itens por pedido em 20 pedidos. */
    itens: [1, 2, 1, 3, 2, 1, 1, 4, 2, 1, 3, 1, 2, 1, 5, 2, 1, 1, 2, 3],
    /** Pedidos por canal no mês. */
    canais: [['App', 4200], ['Site', 3100], ['Marketplace', 1900], ['Loja física', 800]],
    /** Tempo de entrega (dias) de uma amostra de 16 pedidos da região Sul. */
    sul: [4.2, 3.8, 5.1, 4.6, 3.9, 4.4, 5.3, 4.0, 4.8, 4.1, 3.7, 4.9, 4.5, 4.3, 5.0, 4.2],
    /** Vendas mensais (R$ mil) de jan/2024 a dez/2025: tendência de alta e pico em nov e dez. */
    meses: ['jan/24', 'fev/24', 'mar/24', 'abr/24', 'mai/24', 'jun/24', 'jul/24', 'ago/24', 'set/24', 'out/24', 'nov/24', 'dez/24', 'jan/25', 'fev/25', 'mar/25', 'abr/25', 'mai/25', 'jun/25', 'jul/25', 'ago/25', 'set/25', 'out/25', 'nov/25', 'dez/25'],
    vendas: [380, 365, 410, 415, 450, 440, 455, 470, 480, 505, 620, 680, 450, 430, 480, 490, 525, 515, 530, 545, 560, 590, 720, 790],
    /** Teste A/B do checkout: compras e visitantes. */
    ab: { A: [200, 5000], B: [250, 5000] },
    /** Teste A/B do botão do app (amostra pequena). */
    ab2: { A: [18, 400], B: [26, 400] },
    /** Investimento em mídia (R$ mil) × vendas (R$ mil) em 12 meses. */
    midia: [[10, 128], [12, 130], [15, 158], [11, 121], [18, 165], [20, 186], [22, 190], [16, 150], [25, 214], [14, 150], [24, 198], [19, 180]],
    /** Vendas (R$ mil) explicadas por mídia (R$ mil) e desconto médio (%), 10 semanas. */
    mreg: { X: [[10, 5], [12, 8], [15, 5], [11, 10], [18, 6], [20, 12], [22, 4], [16, 9], [25, 7], [14, 11]], y: [121, 136, 150, 139, 163, 204, 172, 172, 210, 158] },
    /** Satisfação por canal (satisfeito, neutro, insatisfeito). */
    satisf: { canais: ['App', 'Site', 'Loja'], cols: ['Satisfeito', 'Neutro', 'Insatisfeito'], tab: [[320, 60, 20], [250, 70, 40], [180, 50, 30]] },
    /** Tempo de atendimento do SAC (min) por canal, 8 atendimentos cada. */
    sac: { 'Chat': [6, 7, 5, 8, 6, 7, 6, 5], 'Telefone': [9, 11, 10, 12, 9, 10, 11, 10], 'E-mail': [8, 9, 7, 10, 8, 9, 8, 9] },
    /** Ticket (R$) com e sem frete grátis, 10 pedidos cada. */
    freteGratis: [168, 182, 175, 190, 160, 185, 178, 195, 172, 188],
    fretePago: [150, 162, 158, 170, 145, 166, 155, 172, 149, 163],
    /** Tempo de separação (min) antes e depois do novo sistema, mesmos 8 separadores. */
    antes: [12.4, 11.8, 13.1, 12.6, 11.9, 13.4, 12.8, 12.1],
    depois: [11.2, 11.0, 12.0, 11.5, 11.1, 12.2, 11.9, 11.3],
    /** Temperatura máxima (°C) × sorvetes vendidos no quiosque (correlação × causalidade). */
    sorvete: [[22, 310], [25, 360], [28, 420], [31, 480], [33, 520], [35, 560]],
  };
  global.ESData = D;
})(typeof window !== 'undefined' ? window : globalThis);
