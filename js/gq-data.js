/* =====================================================================
   gq-data.js — Dados da operação da NexusMarket para a trilha de Gestão
   ---------------------------------------------------------------------
   Centro de distribuição (CD), SAC, lojas e e-commerce. Os mesmos dados
   alimentam os exemplos das aulas e vários exercícios.
   ===================================================================== */
(function (global) {
  'use strict';
  const D = {
    empresa: 'NexusMarket',
    /** Reclamações do SAC no trimestre, por motivo. */
    reclamacoes: [['Atraso na entrega', 142], ['Produto avariado', 88], ['Item errado', 61], ['Cobrança indevida', 27], ['Falta de peça', 19], ['Embalagem violada', 14], ['Outros', 9]],
    /** Prazo médio de entrega (dias) em 24 dias úteis. O dia 14 teve greve na transportadora. */
    prazo: [2.4, 2.2, 2.5, 2.3, 2.6, 2.4, 2.1, 2.5, 2.3, 2.4, 2.2, 2.6, 2.5, 3.7, 2.4, 2.3, 2.5, 2.2, 2.4, 2.6, 2.3, 2.5, 2.4, 2.3],
    /** Tempo de separação de 40 pedidos (min). Especificação: até 12 min. */
    separacao: [6.2, 7.1, 7.8, 8.0, 8.3, 8.5, 8.7, 8.9, 9.0, 9.1, 9.2, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 10.0, 10.1, 10.2, 10.3, 10.4, 10.6, 10.7, 10.9, 11.0, 11.2, 11.4, 11.6, 11.8, 12.1, 12.4, 12.9, 13.5, 9.3, 9.6, 10.0, 10.5, 8.8, 9.9],
    /** Temperatura do galpão (°C) × avarias por dia. */
    temperatura: [[22, 3], [24, 4], [25, 4], [27, 6], [28, 5], [29, 7], [30, 8], [31, 8], [32, 10], [33, 9], [34, 11], [35, 12]],
    /** Linha de embalagem num turno. */
    oee: { planned: 480, down: 60, ideal: 0.5, produced: 760, defects: 38 },
    /** Peso da embalagem padrão (g): especificação 500 ± 5. */
    peso: { mean: 501.5, sd: 1.2, lie: 495, lse: 505, alvo: 500 },
    /** FMEA da expedição: [modo de falha, S, O, D]. */
    fmea: [['Etiqueta trocada no pedido', 7, 5, 4], ['Produto frágil sem proteção', 8, 4, 6], ['Atraso na coleta da transportadora', 6, 6, 3], ['Erro de digitação do endereço', 7, 3, 7], ['Leitor de código de barras falha', 5, 3, 2]],
    /** Fluxo do pedido online (min). */
    vsm: [{ n: 'Receber pedido', ct: 2, wait: 30 }, { n: 'Separar', ct: 9, wait: 120 }, { n: 'Conferir', ct: 3, wait: 45 }, { n: 'Embalar', ct: 5, wait: 60 }, { n: 'Expedir', ct: 4, wait: 240 }],
    /** Matriz GUT dos problemas do CD: [problema, G, U, T]. */
    gut: [['Atrasos na expedição', 5, 5, 4], ['Erros de etiquetagem', 4, 4, 3], ['Fila no SAC', 3, 4, 4], ['Layout do estoque confuso', 3, 2, 3]],
  };
  global.GQData = D;
})(typeof window !== 'undefined' ? window : globalThis);
