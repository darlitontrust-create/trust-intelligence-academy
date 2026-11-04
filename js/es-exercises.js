/* =====================================================================
   es-exercises.js — 150 casos da trilha de Estatística Aplicada (50 por nível)
   ---------------------------------------------------------------------
   Mesmos tipos da Gestão e do Lean Six Sigma (a tela de prática é a mesma):
     choice (opts[0] é a correta) · multi (ok = índices) · order (itens na
     ordem certa) · classify (items: [texto, categoria]) · calc (a, unit,
     dec, tol). Campos: t tópico · n título · s cenário · g missão ·
     x explicação · h dica · d figura (GQCharts) · w motivos das erradas.
   Etapas (posições 1–17, 18–34 e 35–50 de cada nível):
     1.1 Dados e amostras · 1.2 Posição e dispersão · 1.3 Distribuição e gráficos
     2.1 Probabilidade · 2.2 Distribuições · 2.3 Estimação
     3.1 Testes de hipótese · 3.2 Correlação e regressão · 3.3 Séries e decisão
   As respostas de cálculo vêm dos dados (ESData) via GQCharts.calc.
   ===================================================================== */
(function (global) {
  'use strict';
  const D = global.ESData, C = global.GQCharts.calc, r = global.GQCharts.round, f = global.GQCharts.fmt;

  const Q = function (t, n, s, g, opts, x, o) { return Object.assign({ kind: 'choice', t: t, n: n, s: s, g: g, opts: opts, x: x }, o || {}); };
  const M = function (t, n, s, g, opts, ok, x, o) { return Object.assign({ kind: 'multi', t: t, n: n, s: s, g: g, opts: opts, ok: ok, x: x }, o || {}); };
  const O = function (t, n, s, g, items, x, o) { return Object.assign({ kind: 'order', t: t, n: n, s: s, g: g, items: items, x: x }, o || {}); };
  const K = function (t, n, s, g, cats, items, x, o) { return Object.assign({ kind: 'classify', t: t, n: n, s: s, g: g, cats: cats, items: items, x: x }, o || {}); };
  const N = function (t, n, s, g, a, x, o) { return Object.assign({ kind: 'calc', t: t, n: n, s: s, g: g, a: a, x: x }, o || {}); };

  const tk = C.describe(D.ticket), fe = C.iqrFences(D.ticket), it = C.describe(D.itens), rp = C.describe(D.rapida), fx = C.describe(D.flex);
  const sul = C.describe(D.sul), ci = C.ciMean(D.sul), t1 = C.t1(D.sul, 4), t2 = C.t2(D.freteGratis, D.fretePago), tp = C.tpaired(D.antes, D.depois);
  const ab = C.prop2(D.ab.B[0], D.ab.B[1], D.ab.A[0], D.ab.A[1]), ab2 = C.prop2(D.ab2.B[0], D.ab2.B[1], D.ab2.A[0], D.ab2.A[1]);
  const ch = C.chi2(D.satisf.tab), an = C.anova(Object.values(D.sac)), rg = C.regress(D.midia), mr = C.mreg(D.mreg.X, D.mreg.y), sv = C.regress(D.sorvete);
  const nt = C.wmean(D.notas.v, D.notas.n), yoy = C.growth(680, 790), ma3 = C.movAvg(D.vendas, 3);
  const totCanais = D.canais.reduce(function (a, c) { return a + c[1]; }, 0);
  const tickHist = { type: 'hist', values: D.ticket, from: 0, bin: 60, xlab: 'Valor do pedido (R$)' };
  const boxT = { type: 'box', groups: [{ n: 'Rápida', v: D.rapida }, { n: 'Flex', v: D.flex }], unit: 'dias' };
  const notasFig = { type: 'bars', labels: ['1★', '2★', '3★', '4★', '5★'], series: [{ name: 'Avaliações', values: D.notas.n }] };
  const satisfFig = { type: 'table', cols: ['Canal', 'Satisfeito', 'Neutro', 'Insatisfeito', 'Total'], rows: [['App', 320, 60, 20, 400], ['Site', 250, 70, 40, 360], ['Loja', 180, 50, 30, 260], ['Total', 750, 180, 90, 1020]], tot: true };
  const vendasFig = { type: 'line', values: D.vendas, labels: D.meses, name: 'Vendas (R$ mil)' };

  /* =================== NÍVEL 1 · ESTATÍSTICA DESCRITIVA =================== */
  const iniciante = [
    // ---- 1.1 Dados e amostras · Tipos de dados (4)
    K('Tipos de dados', 'Cada coluna no seu tipo', 'A equipe de dados recebeu a base de pedidos da NexusMarket e precisa definir como analisar cada coluna.', 'Classifique cada coluna pelo tipo de variável.', ['Qualitativa nominal', 'Qualitativa ordinal', 'Quantitativa discreta', 'Quantitativa contínua'],
      [['Canal de venda (App, Site, Loja)', 0], ['Nota do app (1 a 5 estrelas)', 1], ['Itens no pedido', 2], ['Valor total do pedido (R$)', 3], ['Cidade de entrega', 0], ['Tempo de entrega (horas)', 3]],
      'Categorias sem ordem são nominais; com ordem, ordinais. Contagens são discretas; medidas (valor, tempo) são contínuas.'),
    Q('Tipos de dados', 'A média do CEP', 'Um analista calculou a “média do CEP” dos clientes para descobrir a região típica e obteve 45.312-118.', 'O que há de errado?',
      ['CEP é um identificador: média de códigos não tem significado', 'Deveria ter usado a mediana do CEP', 'Faltou arredondar o resultado', 'Nada, a média indica a região central'],
      'Números que funcionam como rótulos (CEP, ID, código de produto) não são quantidades. Para região típica, conte clientes por região (moda).', { w: ['Mediana de códigos também não tem significado.', 'Arredondar não corrige o conceito.', 'CEPs não são distâncias: a média cai num lugar qualquer.'] }),
    Q('Tipos de dados', 'Porte do cliente', 'O CRM classifica as empresas clientes em Pequena, Média e Grande.', 'Que tipo de variável é o porte?',
      ['Qualitativa ordinal', 'Qualitativa nominal', 'Quantitativa discreta', 'Quantitativa contínua'],
      'São categorias com ordem natural (P < M < G), mas sem distância numérica definida entre elas.'),
    M('Tipos de dados', 'Onde a média faz sentido', 'O gerente quer um painel com “a média de tudo”.', 'Marque as colunas em que a média faz sentido.',
      ['Valor do pedido (R$)', 'Tempo de entrega (dias)', 'Itens por pedido', 'Número do pedido', 'Canal de venda', 'Código do produto'], [0, 1, 2],
      'Média só faz sentido para variáveis quantitativas. Número do pedido e código do produto são identificadores; canal é categoria.'),
    // População e amostra (4)
    Q('População e amostra', 'Parâmetro ou estatística?', 'De 120 mil clientes ativos do app, 500 foram sorteados para uma pesquisa. A nota média dos 500 foi ' + f(nt, 2) + '.', 'Como se chama o valor ' + f(nt, 2) + '?',
      ['Estatística (descreve a amostra)', 'Parâmetro (descreve a população)', 'Taxa-base', 'Valor-p'],
      'Valores calculados na amostra são estatísticas; eles estimam o parâmetro, que é a média (desconhecida) de todos os 120 mil.', { d: notasFig }),
    Q('População e amostra', 'Pesquisa no SAC', 'Para medir a satisfação geral, a equipe pesquisou apenas os clientes que ligaram para o SAC no mês.', 'Qual é o problema dessa amostra?',
      ['Viés de seleção: quem liga ao SAC costuma ter problema', 'Ela é pequena demais', 'Falta calcular o desvio padrão', 'Nenhum, todo cliente pode ligar'],
      'A amostra não representa a população: clientes satisfeitos raramente ligam ao SAC. A nota sairia artificialmente baixa.', { w: ['O problema é quem entrou, não quantos.', 'Desvio padrão não corrige viés.', 'Poder ligar não é o mesmo que ser sorteado.'] }),
    Q('População e amostra', 'Tamanho não é tudo', 'Uma enquete no Instagram da marca teve 18 mil respostas; uma pesquisa por sorteio teve 600.', 'Qual tende a representar melhor os clientes?',
      ['A de 600 respostas sorteadas', 'A de 18 mil respostas', 'As duas são equivalentes', 'Nenhuma pode ser usada'],
      'Amostra grande e enviesada continua enviesada: seguidores do Instagram não representam todos os clientes. O sorteio dá a mesma chance a todos.'),
    K('População e amostra', 'Termos do estudo', 'O estudo de prazo de entrega usou 400 pedidos sorteados entre os 52 mil do trimestre.', 'Classifique cada item.', ['População', 'Amostra', 'Parâmetro', 'Estatística'],
      [['Os 52 mil pedidos do trimestre', 0], ['Os 400 pedidos sorteados', 1], ['O prazo médio real de todos os 52 mil', 2], ['O prazo médio dos 400 pedidos', 3]],
      'População é o todo; amostra, a parte observada. Parâmetro descreve o todo; estatística, a amostra.'),
    // Tabelas de frequência (5)
    N('Tabelas de frequência', 'Frequência relativa', 'Das 500 avaliações do app, 275 deram 5 estrelas.', 'Qual a frequência relativa de 5 estrelas (%)?', 55,
      '275 ÷ 500 = 0,55 = 55%.', { unit: '%', dec: 1, d: notasFig }),
    N('Tabelas de frequência', 'Acumulada de cima', 'Nas 500 avaliações: 5★ = 275, 4★ = 140, 3★ = 45, 2★ = 22, 1★ = 18.', 'Qual % das avaliações tem 4 estrelas ou mais?', 83,
      '(275 + 140) ÷ 500 = 415 ÷ 500 = 83%.', { unit: '%', dec: 1, d: notasFig }),
    N('Tabelas de frequência', 'Notas baixas', 'Nas 500 avaliações: 2★ = 22 e 1★ = 18.', 'Qual % das avaliações tem 1 ou 2 estrelas?', 8,
      '(22 + 18) ÷ 500 = 40 ÷ 500 = 8%.', { unit: '%', dec: 1, d: notasFig }),
    Q('Tabelas de frequência', 'Faixas do ticket', 'O analista montou faixas de valor do pedido: R$ 0–50, 50–100, 100–300 e 300–1.000.', 'Qual o problema dessas faixas?',
      ['Larguras diferentes distorcem a comparação entre faixas', 'Há faixas demais', 'Valores em reais não podem ser agrupados', 'Falta a frequência acumulada'],
      'Faixas de larguras desiguais fazem as mais largas parecerem mais frequentes. Use faixas de mesma largura (e uma faixa aberta no fim, se necessário).'),
    N('Tabelas de frequência', 'Itens no pedido', 'Em 20 pedidos, os itens foram: ' + D.itens.join(', ') + '.', 'Quantos pedidos tiveram exatamente 1 item?', D.itens.filter(function (x) { return x === 1; }).length,
      'Contando os valores iguais a 1, são ' + D.itens.filter(function (x) { return x === 1; }).length + ' pedidos, a frequência absoluta da categoria “1 item”.', { dec: 0 }),
    // Proporções e porcentagens (4)
    N('Proporções e porcentagens', 'Participação do app', 'No mês, foram ' + f(totCanais, 0) + ' pedidos: App ' + f(D.canais[0][1], 0) + ', Site ' + f(D.canais[1][1], 0) + ', Marketplace ' + f(D.canais[2][1], 0) + ' e Loja ' + f(D.canais[3][1], 0) + '.', 'Qual a participação do App (%)?', r(D.canais[0][1] / totCanais * 100, 1),
      f(D.canais[0][1], 0) + ' ÷ ' + f(totCanais, 0) + ' = 42%.', { unit: '%', dec: 1, d: { type: 'bars', labels: D.canais.map(function (c) { return c[0]; }), series: [{ name: 'Pedidos', values: D.canais.map(function (c) { return c[1]; }) }] } }),
    N('Proporções e porcentagens', 'Variação do faturamento', 'O faturamento de novembro foi R$ 620 mil em 2024 e R$ 720 mil em 2025.', 'Qual a variação percentual (1 casa)?', r(C.growth(620, 720) * 100, 1),
      '(720 − 620) ÷ 620 = 0,161 = 16,1%.', { unit: '%', dec: 1 }),
    Q('Proporções e porcentagens', 'Pontos ou por cento?', 'A taxa de devolução caiu de 5% para 4%. O relatório diz “queda de 1%”.', 'Qual a forma correta?',
      ['Queda de 1 ponto percentual, ou 20% em termos relativos', 'Queda de 1%, como está', 'Queda de 25%', 'Queda de 4 pontos percentuais'],
      'Diferença entre taxas é em pontos percentuais (5 − 4 = 1 p.p.). Em termos relativos, (4 − 5) ÷ 5 = −20%.'),
    N('Proporções e porcentagens', 'Desconto em cima de desconto', 'Um produto de R$ 200 teve 20% de desconto e, na Black Friday, mais 10% sobre o preço já com desconto.', 'Qual o desconto total em relação aos R$ 200 (%)?', 28,
      '200 × 0,8 × 0,9 = 144. Desconto total = (200 − 144) ÷ 200 = 28%, e não 30%.', { unit: '%', dec: 1 }),

    // ---- 1.2 Posição e dispersão · Média, mediana e moda (5)
    N('Média, mediana e moda', 'Ticket médio', 'Os 30 pedidos do site somam R$ ' + f(tk.mean * 30, 2) + '.', 'Qual o ticket médio (R$)?', r(tk.mean, 2),
      'Média = ' + f(tk.mean * 30, 2) + ' ÷ 30 = R$ ' + f(tk.mean, 2) + '.', { unit: 'R$', dec: 2, d: tickHist }),
    N('Média, mediana e moda', 'Ticket mediano', 'Os 30 pedidos do site, em ordem: ' + D.ticket.join(', ') + ' (R$).', 'Qual a mediana (R$)?', tk.median,
      'Com n = 30 (par), a mediana é a média do 15º e do 16º valores: (118 + 124) ÷ 2 = R$ 121.', { unit: 'R$', dec: 2, d: tickHist }),
    Q('Média, mediana e moda', 'Qual valor típico?', 'O ticket médio é R$ ' + f(tk.mean, 2) + ' e o mediano, R$ ' + f(tk.median, 2) + '. O marketing vai anunciar “o cliente típico gasta…”.', 'Qual número usar?',
      ['A mediana, porque poucos pedidos altos puxam a média para cima', 'A média, porque usa todos os valores', 'A moda, sempre', 'O maior valor'],
      'Com assimetria à direita, a mediana descreve melhor o caso típico. A média é útil para totais (receita = média × pedidos).', { d: tickHist }),
    N('Média, mediana e moda', 'Moda dos itens', 'Itens em 20 pedidos: ' + D.itens.join(', ') + '.', 'Qual a moda (quantidade de itens mais frequente)?', C.mode(D.itens),
      'O valor 1 aparece ' + D.itens.filter(function (x) { return x === 1; }).length + ' vezes, mais que qualquer outro.', { dec: 0 }),
    N('Média, mediana e moda', 'Média dos itens', 'Itens em 20 pedidos: ' + D.itens.join(', ') + ' (soma = ' + D.itens.reduce(function (a, b) { return a + b; }, 0) + ').', 'Qual a média de itens por pedido (2 casas)?', r(it.mean, 2),
      f(it.mean * 20, 0) + ' ÷ 20 = ' + f(it.mean, 2) + ' itens por pedido.', { dec: 2 }),
    // Média ponderada (3)
    N('Média ponderada', 'Nota média do app', 'Avaliações: 1★ = 18, 2★ = 22, 3★ = 45, 4★ = 140, 5★ = 275.', 'Qual a nota média (2 casas)?', r(nt, 2),
      'Σ(nota × qtd) = 2.132; Σqtd = 500; média = 2.132 ÷ 500 = ' + f(nt, 3) + '.', { dec: 2, d: notasFig, h: 'Multiplique cada nota pela quantidade de avaliações.' }),
    N('Média ponderada', 'Ticket de duas lojas', 'Loja Centro: 300 pedidos com ticket médio R$ 120. Loja Bairro: 100 pedidos com ticket médio R$ 80.', 'Qual o ticket médio das duas lojas juntas (R$)?', 110,
      '(300 × 120 + 100 × 80) ÷ 400 = 44.000 ÷ 400 = R$ 110. A média simples (R$ 100) ignoraria o volume.', { unit: 'R$', dec: 2 }),
    Q('Média ponderada', 'Margem média do mix', 'Margens: eletrônicos 10% (R$ 800 mil vendidos), casa 30% (R$ 150 mil) e moda 40% (R$ 50 mil). O diretor diz que a margem média é (10 + 30 + 40) ÷ 3 = 26,7%.', 'Qual a margem média correta?',
      ['14,5%, ponderando pelas vendas', '26,7%, como ele calculou', '30%', '10%'],
      '(0,10 × 800 + 0,30 × 150 + 0,40 × 50) ÷ 1.000 = 145 ÷ 1.000 = 14,5%. Ponderando pelas vendas, a margem é bem menor que a média simples, porque eletrônicos (margem baixa) dominam o volume.'),
    // Dispersão (5)
    Q('Dispersão', 'Mesma média, serviços diferentes', 'As transportadoras Rápida e Flex têm prazo médio de ' + f(rp.mean, 1) + ' dias. Desvio padrão: Rápida ' + f(rp.sd, 2) + ' e Flex ' + f(fx.sd, 2) + ' dias.', 'Qual escolher para prometer prazo ao cliente?',
      ['Rápida, porque varia muito menos', 'Flex, porque às vezes entrega em 1 dia', 'Tanto faz, a média é igual', 'Flex, porque o desvio maior indica mais rapidez'],
      'Com a mesma média, a menor variação permite prometer um prazo que será cumprido. A Flex chega a 7 dias.', { d: boxT }),
    N('Dispersão', 'Amplitude da Flex', 'Prazos da Flex (dias): ' + D.flex.join(', ') + '.', 'Qual a amplitude (dias)?', fx.range,
      'Máximo 7 − mínimo 1 = 6 dias.', { dec: 0, d: boxT }),
    N('Dispersão', 'Desvio padrão da Rápida', 'Prazos da Rápida (dias): ' + D.rapida.join(', ') + '. Média = ' + f(rp.mean, 4) + '.', 'Qual o desvio padrão amostral (2 casas)?', r(rp.sd, 2),
      'Oito pedidos com 3 dias e quatro com 4 dias. Σ(x − x̄)² = 8 × 0,111 + 4 × 0,444 = 2,667; s² = 2,667 ÷ 11 = 0,242; s = ' + f(rp.sd, 2) + '.', { dec: 2, tol: 0.01, h: 'Use n − 1 no denominador da variância.' }),
    N('Dispersão', 'Coeficiente de variação', 'Prazo da Flex: média ' + f(fx.mean, 2) + ' dias e desvio ' + f(fx.sd, 2) + ' dias.', 'Qual o CV (%)?', r(C.cv(D.flex) * 100, 1),
      'CV = ' + f(fx.sd, 2) + ' ÷ ' + f(fx.mean, 2) + ' = ' + f(C.cv(D.flex) * 100, 1) + '%: dispersão alta.', { unit: '%', dec: 1, tol: 0.2, d: boxT }),
    Q('Dispersão', 'Comparando o incomparável', 'O ticket tem média R$ 153 e desvio R$ 105; o prazo tem média 4,4 dias e desvio 0,49 dia.', 'Como comparar qual variável é mais dispersa?',
      ['Pelo coeficiente de variação (desvio ÷ média)', 'Pelo desvio padrão, o maior é mais disperso', 'Pela amplitude', 'Não é possível comparar'],
      'Unidades diferentes exigem medida relativa. CV do ticket ≈ 69%; do prazo ≈ 11%: o ticket varia muito mais.'),
    // Quartis e boxplot (4)
    N('Quartis e boxplot', 'Terceiro quartil', 'Ticket dos 30 pedidos (ordenados): ' + D.ticket.join(', ') + '.', 'Qual o Q3 (R$), pelo método de interpolação do Excel (QUARTIL.INC)?', fe.q3,
      'Posição do Q3 = (30 − 1) × 0,75 = 21,75 (contando do zero): entre 165 e 179 → 165 + 0,75 × 14 = R$ 175,50.', { unit: 'R$', dec: 2, tol: 0.5, d: { type: 'box', groups: [{ n: 'Ticket', v: D.ticket }], unit: 'R$' } }),
    N('Quartis e boxplot', 'Intervalo interquartil', 'Ticket: Q1 = R$ ' + f(fe.q1, 2) + ' e Q3 = R$ ' + f(fe.q3, 2) + '.', 'Qual o IQR (R$)?', fe.iqr,
      'IQR = ' + f(fe.q3, 2) + ' − ' + f(fe.q1, 2) + ' = R$ ' + f(fe.iqr, 2) + ': os 50% centrais dos pedidos estão nessa faixa.', { unit: 'R$', dec: 2 }),
    Q('Quartis e boxplot', 'Meta de serviço', 'A meta de entrega é “P90 ≤ 5 dias”. Na Flex, o P90 é 6,1 dias.', 'O que isso significa?',
      ['Mais de 10% das entregas levam mais de 5 dias', 'A média passa de 5 dias', '90% das entregas atrasam', 'A meta foi cumprida'],
      'P90 = 6 significa que cerca de 10% das entregas levam 6 dias ou mais, ou seja, passam de 5. A meta não foi cumprida.', { d: boxT }),
    Q('Quartis e boxplot', 'Lendo os boxplots', 'O boxplot compara os prazos da Rápida e da Flex.', 'Qual leitura é correta?',
      ['A caixa da Flex é muito mais larga: o miolo dos prazos varia mais', 'A Flex tem prazo mediano maior que a Rápida', 'As duas têm a mesma dispersão', 'A Flex não tem mediana'],
      'A caixa representa os 50% centrais (Q1 a Q3). Caixa da Flex: ' + f(fx.q1, 2) + ' a ' + f(fx.q3, 2) + ' dias; da Rápida: 3 a 4 dias.', { d: boxT }),

    // ---- 1.3 Distribuição e gráficos · Histograma e forma (4)
    Q('Histograma e forma', 'Forma do ticket', 'O histograma do ticket mostra muitos pedidos entre R$ 60 e R$ 180 e poucos acima de R$ 300.', 'Qual a forma da distribuição?',
      ['Assimétrica à direita', 'Simétrica', 'Assimétrica à esquerda', 'Bimodal'],
      'A cauda longa aponta para valores altos. Por isso a média (R$ ' + f(tk.mean, 0) + ') fica acima da mediana (R$ ' + f(tk.median, 0) + ').', { d: tickHist }),
    Q('Histograma e forma', 'Dois picos', 'O histograma do tempo de entrega mostra um pico em 2 dias e outro em 6 dias.', 'Qual a explicação mais provável?',
      ['Dois grupos misturados, como capitais e interior', 'Erro no software do gráfico', 'Distribuição normal perfeita', 'Excesso de outliers'],
      'Bimodalidade costuma indicar populações diferentes juntas. Separe por região e analise cada grupo.'),
    M('Histograma e forma', 'Variáveis com cauda à direita', 'O time vai analisar várias métricas do e-commerce.', 'Marque as que costumam ter assimetria à direita.',
      ['Valor do pedido', 'Tempo de atendimento no SAC', 'Renda dos clientes', 'Nota de 1 a 5 com média 4,3'], [0, 1, 2],
      'Valores, tempos e renda têm limite em zero e poucos casos muito altos. Notas concentradas em 4 e 5 têm cauda para a esquerda.'),
    Q('Histograma e forma', 'Barras ou histograma?', 'O analista fez um “histograma” com as barras App, Site, Marketplace e Loja.', 'O que ele fez, na verdade?',
      ['Um gráfico de barras de categorias', 'Um histograma correto', 'Um boxplot', 'Uma série temporal'],
      'Histograma é para faixas de uma variável numérica. Categorias pedem gráfico de barras, de preferência ordenado.'),
    // Outliers (3)
    N('Outliers', 'Limite superior', 'Ticket: Q1 = R$ ' + f(fe.q1, 2) + ', Q3 = R$ ' + f(fe.q3, 2) + '.', 'Qual o limite superior para outliers pela regra de 1,5 × IQR (R$)?', fe.hi,
      'IQR = ' + f(fe.iqr, 2) + '; limite = ' + f(fe.q3, 2) + ' + 1,5 × ' + f(fe.iqr, 2) + ' = R$ ' + f(fe.hi, 2) + '.', { unit: 'R$', dec: 2, d: { type: 'box', groups: [{ n: 'Ticket', v: D.ticket }], unit: 'R$' } }),
    N('Outliers', 'Quantos outliers?', 'Ticket (R$): ' + D.ticket.join(', ') + '. Limite superior: R$ ' + f(fe.hi, 2) + '.', 'Quantos pedidos são outliers?', D.ticket.filter(function (x) { return x > fe.hi; }).length,
      'Acima de R$ ' + f(fe.hi, 2) + ': 310, 395 e 520. São 3 pedidos.', { dec: 0 }),
    Q('Outliers', 'Apagar ou investigar?', 'O pedido de R$ 520 é um outlier. Um colega sugere apagá-lo “para a média ficar mais real”.', 'Qual a melhor conduta?',
      ['Verificar se é erro, evento especial ou cliente real antes de decidir', 'Apagar, porque distorce a média', 'Substituir pela média', 'Duplicar o valor para equilibrar'],
      'Outlier pode ser informação valiosa (um cliente corporativo, por exemplo). Investigue, documente e, se for real, mantenha e use a mediana para o caso típico.'),
    // Escore Z (3)
    N('Escore Z', 'Z da loja', 'As lojas vendem em média 400 pedidos por semana, com desvio 60. A Loja Centro vendeu 520.', 'Qual o escore Z da Loja Centro?', 2,
      'Z = (520 − 400) ÷ 60 = 2,0: dois desvios acima da média.', { dec: 2 }),
    Q('Escore Z', 'Quem foi mais excepcional?', 'Vendedor A: 52 vendas (média da equipe 40, desvio 6). Vendedor B: 130 vendas (média 110, desvio 20).', 'Quem teve o desempenho mais excepcional em relação à própria equipe?',
      ['A, com Z = 2,0', 'B, com Z = 1,0', 'B, porque vendeu mais', 'Empate'],
      'Z(A) = (52 − 40) ÷ 6 = 2,0; Z(B) = (130 − 110) ÷ 20 = 1,0. O Z remove a diferença de escala.'),
    N('Escore Z', 'De volta à escala', 'O tempo de separação tem média 12 min e desvio 2 min. A meta é alertar pedidos com Z ≥ 2,5.', 'A partir de quantos minutos o alerta dispara?', 17,
      'x = média + Z × desvio = 12 + 2,5 × 2 = 17 minutos.', { unit: 'min', dec: 1 }),
    // Escolha do gráfico (3)
    K('Escolha do gráfico', 'O gráfico certo', 'O painel de BI precisa responder a várias perguntas.', 'Classifique cada pergunta pelo gráfico mais adequado.', ['Linha', 'Barras', 'Histograma', 'Dispersão'],
      [['Como as vendas evoluíram nos últimos 24 meses?', 0], ['Qual canal vendeu mais no mês?', 1], ['Como se distribui o valor dos pedidos?', 2], ['Mais desconto está ligado a mais vendas?', 3], ['Qual categoria teve mais devoluções?', 1], ['O tempo médio de entrega melhorou semana a semana?', 0]],
      'Tempo → linha; comparar categorias → barras; distribuição de um número → histograma; relação entre dois números → dispersão.'),
    Q('Escolha do gráfico', 'Eixo cortado', 'Um gráfico de barras compara a conversão de dois canais (4,8% e 5,1%) com o eixo começando em 4,5%. A barra do canal B parece o dobro da de A.', 'Qual o problema?',
      ['O eixo das barras deve começar em zero para não exagerar diferenças', 'Deveria ser um gráfico de pizza', 'As cores estão erradas', 'Não há problema'],
      'O comprimento da barra precisa ser proporcional ao valor. Com eixo cortado, 0,3 p.p. vira uma diferença visual enorme.'),
    M('Escolha do gráfico', 'Boas práticas', 'Você vai revisar o gráfico das vendas mensais antes da reunião de diretoria.', 'Marque as boas práticas.',
      ['Título com a conclusão (ex.: “Vendas crescem 16% ao ano”)', 'Destacar em cor o que importa e o resto em cinza', 'Usar efeito 3D para ficar mais bonito', 'Colocar 12 fatias numa pizza', 'Indicar a unidade (R$ mil)'], [0, 1, 4],
      'Título com mensagem, destaque seletivo e unidade clara ajudam. 3D distorce e pizza com muitas fatias é ilegível.', { d: vendasFig }),
    // Desafio do nível (3)
    O('Desafio do nível', 'Relatório descritivo', 'Desafio do nível: você vai apresentar o retrato do ticket do site.', 'Coloque as etapas na ordem.',
      ['Definir a pergunta e o período dos dados', 'Informar n e checar dados faltantes', 'Calcular centro (média e mediana)', 'Medir a dispersão (desvio e IQR)', 'Olhar a forma e os outliers', 'Concluir com a recomendação'],
      'Do contexto aos números e dos números à decisão.'),
    M('Desafio do nível', 'O resumo certo', 'Desafio do nível: o ticket tem média R$ ' + f(tk.mean, 2) + ', mediana R$ ' + f(tk.median, 2) + ', IQR R$ ' + f(fe.iqr, 2) + ' e 3 outliers.', 'Marque as conclusões corretas.',
      ['A distribuição é assimétrica à direita', 'O cliente típico gasta perto de R$ 121', 'Metade dos pedidos está entre R$ 89 e R$ 175,50', 'A maioria dos pedidos passa de R$ 153', 'Os outliers devem ser apagados'], [0, 1, 2],
      'Média > mediana indica cauda à direita; a mediana é o valor típico; Q1 a Q3 contém os 50% centrais. A maioria fica ABAIXO da média.', { d: tickHist }),
    N('Desafio do nível', 'Receita prevista', 'Desafio do nível: a meta é 2.000 pedidos no site no próximo mês, com o mesmo perfil de ticket (média R$ ' + f(tk.mean, 2) + ', mediana R$ ' + f(tk.median, 2) + ').', 'Qual a receita esperada (R$)?', r(tk.mean * 2000, 2),
      'Para totais, use a média: 2.000 × ' + f(tk.mean, 2) + ' = R$ ' + f(tk.mean * 2000, 2) + '. A mediana subestimaria a receita.', { unit: 'R$', dec: 2, tol: 1 }),
  ];

  /* ================= NÍVEL 2 · PROBABILIDADE E INFERÊNCIA ================= */
  const intermediario = [
    // ---- 2.1 Probabilidade básica (5)
    N('Probabilidade básica', 'Chance de atraso', 'No trimestre, 4.160 de 52.000 pedidos atrasaram.', 'Qual a probabilidade de um pedido atrasar (%)?', 8,
      '4.160 ÷ 52.000 = 0,08 = 8% (probabilidade pela frequência histórica).', { unit: '%', dec: 1 }),
    N('Probabilidade básica', 'Dois atrasos seguidos', 'Cada pedido tem 8% de chance de atrasar, de forma independente.', 'Qual a probabilidade de os dois próximos pedidos de um cliente atrasarem (%)?', 0.64,
      '0,08 × 0,08 = 0,0064 = 0,64%.', { unit: '%', dec: 2 }),
    N('Probabilidade básica', 'Pelo menos um atraso', 'Um cliente fez 3 pedidos; cada um tem 8% de chance de atrasar, independentemente.', 'Qual a chance de pelo menos um atrasar (%)?', r((1 - Math.pow(0.92, 3)) * 100, 1),
      '1 − 0,92³ = 1 − 0,7787 = ' + f((1 - Math.pow(0.92, 3)) * 100, 1) + '%.', { unit: '%', dec: 1, h: 'Calcule a chance de nenhum atrasar e use o complemento.' }),
    N('Probabilidade básica', 'Ou um ou outro', 'Entre os clientes, 30% compram eletrônicos, 25% compram casa e 10% compram os dois.', 'Qual a % que compra eletrônicos ou casa?', 45,
      'P(A ou B) = 0,30 + 0,25 − 0,10 = 0,45 = 45%. Sem descontar a interseção, os 10% seriam contados duas vezes.', { unit: '%', dec: 1 }),
    Q('Probabilidade básica', 'Falácia do apostador', 'O sorteio diário de brindes já saiu para clientes do app cinco dias seguidos. A chance de cada canal é a mesma todo dia.', 'Qual a chance de amanhã sair para o app?',
      ['A mesma de sempre: sorteios independentes não têm memória', 'Menor, porque “está devendo” para os outros canais', 'Maior, porque está em sequência', 'Zero'],
      'Em eventos independentes, o histórico não altera a próxima chance. Achar que “está na vez” é a falácia do apostador.'),
    // Probabilidade condicional (4)
    N('Probabilidade condicional', 'Insatisfeitos no site', 'Na pesquisa, 40 dos 360 clientes do Site ficaram insatisfeitos.', 'Qual P(insatisfeito | Site) (%)?', r(40 / 360 * 100, 1),
      '40 ÷ 360 = 11,1%. A condição (Site) define o denominador.', { unit: '%', dec: 1, d: satisfFig }),
    N('Probabilidade condicional', 'Insatisfação geral', 'Na pesquisa, 90 dos 1.020 clientes ficaram insatisfeitos.', 'Qual P(insatisfeito) (%)?', r(90 / 1020 * 100, 1),
      '90 ÷ 1.020 = 8,8%. Compare com 11,1% no Site e 5,0% no App: a insatisfação depende do canal.', { unit: '%', dec: 1, d: satisfFig }),
    Q('Probabilidade condicional', 'Inverter a condicional', 'Um relatório diz: “80% dos clientes que cancelaram tinham reclamado no SAC”. O diretor conclui: “80% de quem reclama cancela”.', 'A conclusão está certa?',
      ['Não: P(reclamou | cancelou) é diferente de P(cancela | reclamou)', 'Sim, é a mesma informação', 'Sim, se a amostra for grande', 'Não, porque deveria ser 20%'],
      'Muitos clientes reclamam e não cancelam. Para P(cancela | reclamou), o denominador é o total de quem reclamou.'),
    N('Probabilidade condicional', 'Cancelamento após reclamação', 'De 2.000 clientes que reclamaram no SAC, 300 cancelaram. De 18.000 que não reclamaram, 360 cancelaram.', 'Qual P(cancelar | reclamou) (%)?', 15,
      '300 ÷ 2.000 = 15%, contra 360 ÷ 18.000 = 2% de quem não reclamou: reclamar está muito associado a cancelar.', { unit: '%', dec: 1 }),
    // Teorema de Bayes (4)
    N('Teorema de Bayes', 'Alerta de fraude', 'Fraudes são 1% dos pedidos. O modelo alerta 95% das fraudes e também 5% dos pedidos legítimos.', 'Qual a chance de um pedido com alerta ser fraude (%)?', r(95 / 590 * 100, 1),
      'Em 10.000 pedidos: 95 alertas verdadeiros e 495 falsos. 95 ÷ 590 = ' + f(95 / 590 * 100, 1) + '%.', { unit: '%', dec: 1, d: { type: 'table', cols: ['', 'Alerta', 'Sem alerta', 'Total'], rows: [['Fraude', 95, 5, 100], ['Legítimo', 495, 9405, 9900], ['Total', 590, 9410, 10000]], tot: true }, h: 'Imagine 10.000 pedidos e monte a tabela.' }),
    O('Teorema de Bayes', 'Bayes sem fórmula', 'Você vai calcular a chance de um cliente com score alto realmente pagar em dia.', 'Coloque os passos na ordem.',
      ['Imaginar uma base de 10.000 clientes', 'Dividir pela taxa-base (bons e maus pagadores)', 'Aplicar a taxa de score alto em cada grupo', 'Somar todos os clientes com score alto', 'Dividir os bons pagadores com score alto pelo total com score alto'],
      'Contar casos em uma base imaginária torna Bayes intuitivo e evita erros de fórmula.'),
    Q('Teorema de Bayes', 'Taxa-base', 'Um teste de qualidade aponta 99% dos lotes defeituosos e só 2% dos lotes bons. Defeitos são raríssimos: 1 lote em 1.000.', 'O que esperar dos lotes reprovados?',
      ['A maioria será de lotes bons (falsos positivos)', 'Quase todos serão defeituosos', 'Metade e metade', 'Nenhum será bom'],
      'Em 100.000 lotes: 99 defeituosos reprovados contra 1.998 bons reprovados. Com taxa-base baixa, os falsos positivos dominam.'),
    N('Teorema de Bayes', 'Reprovação correta', 'Em 100.000 lotes, 100 são defeituosos. O teste reprova 99 dos defeituosos e 2% dos 99.900 bons.', 'Qual % dos reprovados é realmente defeituoso (1 casa)?', r(99 / (99 + 1998) * 100, 1),
      'Reprovados bons = 1.998. 99 ÷ (99 + 1.998) = ' + f(99 / 2097 * 100, 1) + '%.', { unit: '%', dec: 1 }),
    // Valor esperado (4)
    N('Valor esperado', 'Cupom para inativos', 'Um cupom de R$ 20 é enviado a clientes inativos. 30% voltam e geram margem de R$ 45 (antes do cupom); 70% não voltam, e o envio custa R$ 1.', 'Qual o valor esperado por cliente (R$)?', 6.8,
      'E = 0,3 × (45 − 20) + 0,7 × (−1) = 7,5 − 0,7 = R$ 6,80.', { unit: 'R$', dec: 2 }),
    N('Valor esperado', 'Garantia estendida', 'A garantia estendida custa R$ 90. A chance de defeito no período é 6% e o conserto custa R$ 900 à seguradora.', 'Qual o lucro esperado da seguradora por garantia vendida (R$)?', 36,
      'E = 90 − 0,06 × 900 = 90 − 54 = R$ 36 por garantia.', { unit: 'R$', dec: 2 }),
    Q('Valor esperado', 'Duas campanhas', 'Campanha A: ganho certo de R$ 50 mil. Campanha B: 40% de chance de R$ 150 mil e 60% de R$ 0.', 'Qual a leitura correta?',
      ['B tem valor esperado maior (R$ 60 mil), mas com risco de não ganhar nada', 'A tem valor esperado maior', 'As duas têm o mesmo valor esperado', 'B sempre ganha R$ 60 mil'],
      'E(B) = 0,4 × 150 = R$ 60 mil > R$ 50 mil. Mas o resultado de B varia muito; a escolha depende do apetite a risco.'),
    N('Valor esperado', 'Itens esperados', 'Itens por pedido: 1 item (45%), 2 itens (30%), 3 itens (15%), 4 itens (10%).', 'Qual o número esperado de itens por pedido?', 1.9,
      'E = 1×0,45 + 2×0,30 + 3×0,15 + 4×0,10 = 0,45 + 0,60 + 0,45 + 0,40 = 1,9.', { dec: 2 }),

    // ---- 2.2 Distribuições · Binomial (5)
    N('Distribuição binomial', 'Nenhuma compra', 'A conversão do site é 10%. Chegam 10 visitantes, de forma independente.', 'Qual a chance de nenhum comprar (%)?', r(C.binom(10, 0, 0.1) * 100, 1),
      'P(X = 0) = 0,9¹⁰ = ' + f(C.binom(10, 0, 0.1) * 100, 1) + '%.', { unit: '%', dec: 1 }),
    N('Distribuição binomial', 'Exatamente duas', 'Conversão de 10% e 10 visitantes independentes.', 'Qual a chance de exatamente 2 comprarem (%)?', r(C.binom(10, 2, 0.1) * 100, 1),
      'P(X = 2) = C(10,2) × 0,1² × 0,9⁸ = 45 × 0,01 × 0,4305 = ' + f(C.binom(10, 2, 0.1) * 100, 1) + '%.', { unit: '%', dec: 1, tol: 0.1 }),
    N('Distribuição binomial', 'Atrasos esperados', 'Num lote de 200 pedidos, cada um tem 8% de chance de atrasar.', 'Quantos atrasos se esperam?', 16,
      'Média da binomial = n × p = 200 × 0,08 = 16.', { dec: 0 }),
    N('Distribuição binomial', 'Desvio dos atrasos', 'Lote de 200 pedidos com 8% de chance de atraso cada.', 'Qual o desvio padrão do número de atrasos (2 casas)?', r(Math.sqrt(200 * 0.08 * 0.92), 2),
      '√(n·p·(1 − p)) = √(200 × 0,08 × 0,92) = √14,72 = ' + f(Math.sqrt(14.72), 2) + '.', { dec: 2 }),
    M('Distribuição binomial', 'É binomial?', 'O time quer usar a binomial em vários problemas.', 'Marque as situações que seguem uma binomial.',
      ['Quantos de 50 e-mails enviados são abertos, com 22% de abertura cada', 'Quantos de 20 pedidos atrasam, com 8% de chance cada', 'Tempo de entrega de 20 pedidos', 'Quantas chamadas chegam ao SAC por hora', 'Quantos de 30 clientes avaliam com 5 estrelas, com 55% de chance cada'], [0, 1, 4],
      'Binomial exige n fixo de tentativas sim/não com p constante. Tempo é contínuo; chamadas por hora (sem n fixo) são Poisson.'),
    // Poisson (4)
    N('Distribuição de Poisson', 'Nenhuma chamada', 'O SAC recebe em média 3 chamadas a cada 5 minutos.', 'Qual a chance de não chegar nenhuma chamada em 5 minutos (%)?', r(C.poisson(3, 0) * 100, 1),
      'P(0) = e⁻³ = ' + f(C.poisson(3, 0) * 100, 1) + '%.', { unit: '%', dec: 1 }),
    N('Distribuição de Poisson', 'Pico de chamadas', 'Média de 3 chamadas a cada 5 minutos. A equipe dá conta de até 5.', 'Qual a chance de chegarem mais de 5 chamadas em 5 minutos (%)?', r((1 - C.poissonCdf(3, 5)) * 100, 1),
      '1 − P(X ≤ 5) = 1 − ' + f(C.poissonCdf(3, 5), 4) + ' = ' + f((1 - C.poissonCdf(3, 5)) * 100, 1) + '%.', { unit: '%', dec: 1, tol: 0.1, d: { type: 'bars', labels: ['0', '1', '2', '3', '4', '5', '6', '7+'], series: [{ name: 'P(X = k) em %', values: [0, 1, 2, 3, 4, 5, 6].map(function (k) { return r(C.poisson(3, k) * 100, 1); }).concat([r((1 - C.poissonCdf(3, 6)) * 100, 1)]) }] } }),
    N('Distribuição de Poisson', 'Ajustando o intervalo', 'O CD recebe em média 36 pedidos urgentes por hora.', 'Qual o λ para um intervalo de 10 minutos?', 6,
      '36 por hora ÷ 6 intervalos de 10 minutos = 6 por intervalo.', { dec: 1 }),
    Q('Distribuição de Poisson', 'Média e variância', 'As devoluções diárias têm média 4, mas a variância é 15, porque às vezes chegam lotes de devoluções de uma só vez.', 'A Poisson é adequada?',
      ['Não: há sobredispersão (eventos em lote)', 'Sim, Poisson sempre serve para contagens', 'Sim, porque a média é 4', 'Não, porque a média deveria ser maior'],
      'Na Poisson, média = variância. Variância muito maior indica eventos agrupados; um modelo com sobredispersão é mais adequado.'),
    // Normal (5)
    N('Distribuição normal', 'Regra 68-95-99,7', 'O tempo de separação é normal, com média 12 min e desvio 2 min.', 'Qual % dos pedidos fica entre 8 e 16 min (aprox., regra empírica)?', 95,
      '8 e 16 estão a 2 desvios da média: cerca de 95%.', { unit: '%', dec: 0, tol: 0.6, d: { type: 'bell', mean: 12, sd: 2, lo: 8, hi: 16, d: 0, unit: 'min', show: false } }),
    N('Distribuição normal', 'Pedidos lentos', 'Separação normal, média 12 min e desvio 2 min.', 'Qual % dos pedidos passa de 15 min (1 casa)?', r((1 - C.normBetween(12, 2, null, 15)) * 100, 1),
      'Z = (15 − 12) ÷ 2 = 1,5. P(Z > 1,5) = 1 − 0,9332 = 6,7%.', { unit: '%', dec: 1, tol: 0.1, d: { type: 'bell', mean: 12, sd: 2, lo: 15, d: 0, unit: 'min', show: false } }),
    N('Distribuição normal', 'Entre dois valores', 'Peso das caixas: normal, média 500 g e desvio 4 g.', 'Qual % das caixas fica entre 496 g e 508 g (1 casa)?', r(C.normBetween(500, 4, 496, 508) * 100, 1),
      'Z de −1 a +2: 0,9772 − 0,1587 = 0,8186 = 81,9%.', { unit: '%', dec: 1, tol: 0.1, d: { type: 'bell', mean: 500, sd: 4, lo: 496, hi: 508, d: 0, unit: 'g', show: false } }),
    N('Distribuição normal', 'Prazo para prometer', 'O prazo de entrega é aproximadamente normal, com média 3 dias e desvio 0,5 dia. O site quer prometer um prazo cumprido em 97,5% dos pedidos.', 'Qual prazo prometer (dias, 2 casas)?', r(3 + 1.96 * 0.5, 2),
      'Percentil 97,5 = média + 1,96 × desvio = 3 + 0,98 = 3,98 dias (na prática, 4 dias).', { unit: 'dias', dec: 2, tol: 0.01 }),
    Q('Distribuição normal', 'Quando não usar a normal', 'O analista quer usar a regra 68-95-99,7 no ticket dos pedidos (média R$ ' + f(tk.mean, 0) + ', desvio R$ ' + f(tk.sd, 0) + ').', 'Qual o problema?',
      ['O ticket é muito assimétrico; média − 2 desvios daria valor negativo', 'Não há problema', 'A regra só vale para porcentagens', 'O desvio é pequeno demais'],
      'Média − 2σ = ' + f(tk.mean - 2 * tk.sd, 0) + ' reais, impossível. Dados assimétricos não seguem a normal; use percentis.', { d: tickHist }),
    // TCL (3)
    N('Teorema central do limite', 'Erro padrão', 'O ticket tem desvio R$ ' + f(tk.sd, 2) + '. A pesquisa vai usar amostras de 100 pedidos.', 'Qual o erro padrão da média (R$)?', r(tk.sd / 10, 2),
      'Erro padrão = σ ÷ √n = ' + f(tk.sd, 2) + ' ÷ 10 = R$ ' + f(tk.sd / 10, 2) + '.', { unit: 'R$', dec: 2, tol: 0.02 }),
    Q('Teorema central do limite', 'Médias de dados assimétricos', 'O ticket individual é muito assimétrico. O analista vai tirar 1.000 amostras de 50 pedidos e fazer o histograma das 1.000 médias.', 'Como deve ficar esse histograma?',
      ['Aproximadamente normal, centrado na média verdadeira', 'Tão assimétrico quanto os dados', 'Uniforme', 'Com dois picos'],
      'Pelo teorema central do limite, as médias amostrais tendem à normal mesmo quando os dados não são normais, desde que n seja razoável.'),
    N('Teorema central do limite', 'Quanto mais amostra', 'Com amostras de 25 pedidos, o erro padrão do ticket é R$ 21.', 'Qual será o erro padrão com amostras de 100 pedidos (R$)?', 10.5,
      'Quadruplicar n divide o erro padrão por √4 = 2: R$ 21 ÷ 2 = R$ 10,50.', { unit: 'R$', dec: 2 }),

    // ---- 2.3 Estimação · Amostragem (4)
    K('Amostragem', 'Qual plano?', 'A NexusMarket vai fazer várias pesquisas.', 'Classifique cada plano de amostragem.', ['Aleatória simples', 'Estratificada', 'Sistemática', 'Conveniência'],
      [['Sortear 500 clientes da base inteira', 0], ['Sortear clientes em cada canal, na proporção do canal', 1], ['Auditar 1 a cada 40 notas fiscais', 2], ['Entrevistar quem passou pela loja numa tarde', 3], ['Sortear 100 clientes de cada região, proporcional ao tamanho', 1]],
      'Sorteio geral é aleatória simples; sorteio por grupo, estratificada; intervalo fixo, sistemática; quem está à mão, conveniência.'),
    N('Amostragem', 'Estrato do marketplace', 'A pesquisa terá 1.000 clientes estratificados pelos canais: App 42%, Site 31%, Marketplace 19%, Loja 8%.', 'Quantos clientes do Marketplace devem ser sorteados?', 190,
      '1.000 × 19% = 190 clientes.', { dec: 0, d: { type: 'bars', labels: D.canais.map(function (c) { return c[0]; }), series: [{ name: 'Participação (%)', values: [42, 31, 19, 8] }] } }),
    Q('Amostragem', 'Sistemática com ciclo', 'O CD audita o pedido nº 1 de cada 7 da fila diária. Os pedidos de domingo sempre caem nessa posição por causa da ordem de importação.', 'Qual o risco?',
      ['A amostra sistemática coincide com um ciclo e fica enviesada para domingo', 'Nenhum, sistemática é sempre aleatória', 'A amostra fica grande demais', 'O erro padrão vira zero'],
      'Amostragem sistemática falha quando a lista tem padrão periódico que coincide com o intervalo.'),
    Q('Amostragem', 'Não resposta', 'A pesquisa de NPS foi enviada a 10.000 clientes e só 4% responderam, a maioria muito satisfeita ou muito insatisfeita.', 'Qual viés preocupa?',
      ['Viés de não resposta: quem responde difere de quem não responde', 'Viés de sobrevivência', 'Multicolinearidade', 'Nenhum, 400 respostas bastam'],
      'Respondentes voluntários com opinião forte não representam a base. Lembretes, incentivos e comparação com o perfil da base ajudam.'),
    // Intervalo de confiança (5)
    N('Intervalo de confiança', 'Média da amostra', 'Prazos de 16 pedidos do Sul (dias): ' + D.sul.join('; ') + '.', 'Qual o prazo médio da amostra (dias, 3 casas)?', r(sul.mean, 3),
      'Soma = ' + f(sul.mean * 16, 1) + '; média = ' + f(sul.mean * 16, 1) + ' ÷ 16 = ' + f(sul.mean, 3) + ' dias.', { unit: 'dias', dec: 3 }),
    N('Intervalo de confiança', 'Margem de erro', 'Amostra do Sul: n = 16, média ' + f(sul.mean, 3) + ', desvio ' + f(sul.sd, 3) + '. t crítico (95%, 15 gl) = ' + f(global.GQCharts.tInv(0.05, 15), 3) + '.', 'Qual a margem de erro (dias, 3 casas)?', r(ci.half, 3),
      'Margem = t × s ÷ √n = ' + f(global.GQCharts.tInv(0.05, 15), 3) + ' × ' + f(sul.sd, 3) + ' ÷ 4 = ' + f(ci.half, 3) + ' dia.', { unit: 'dias', dec: 3, tol: 0.002 }),
    N('Intervalo de confiança', 'Limite superior', 'Amostra do Sul: média ' + f(sul.mean, 3) + ' dias e margem de erro ' + f(ci.half, 3) + ' (95%).', 'Qual o limite superior do IC de 95% (dias, 2 casas)?', r(ci.hi, 2),
      f(sul.mean, 3) + ' + ' + f(ci.half, 3) + ' = ' + f(ci.hi, 2) + ' dias. IC: ' + f(ci.lo, 2) + ' a ' + f(ci.hi, 2) + '.', { unit: 'dias', dec: 2, d: { type: 'bell', mean: sul.mean, sd: sul.sd / 4, lo: ci.lo, hi: ci.hi, d: 2, unit: 'dias', show: false } }),
    Q('Intervalo de confiança', 'Interpretando o IC', 'O IC de 95% do prazo médio do Sul é de ' + f(ci.lo, 2) + ' a ' + f(ci.hi, 2) + ' dias.', 'Qual a interpretação correta?',
      ['O método captura a média real em 95% das amostras; a média real é plausivelmente dessa faixa', '95% dos pedidos chegam entre ' + f(ci.lo, 2) + ' e ' + f(ci.hi, 2) + ' dias', 'A média real é exatamente ' + f(sul.mean, 2), 'Há 5% de pedidos atrasados'],
      'O IC é sobre a média, não sobre pedidos individuais. Pedidos individuais variam muito mais (de 3,7 a 5,3 dias na amostra).'),
    Q('Intervalo de confiança', 'Intervalo mais estreito', 'A diretoria achou o IC do prazo largo demais para decidir.', 'Qual a forma correta de estreitá-lo?',
      ['Coletar uma amostra maior', 'Reduzir a confiança para 50% sem avisar', 'Excluir os pedidos mais lentos', 'Usar a mediana no lugar da média'],
      'A margem cai com √n. Reduzir a confiança estreita o intervalo, mas aumenta o risco de errar; excluir dados cria viés.'),
    // IC de proporção (4)
    N('IC de proporção', 'Conversão observada', 'O checkout B teve ' + D.ab.B[0] + ' compras em ' + f(D.ab.B[1], 0) + ' visitas.', 'Qual a margem de erro de 95% da conversão (p.p., 2 casas)?', r(C.ciProp(D.ab.B[0], D.ab.B[1]).half * 100, 2),
      'Erro padrão = √(0,05 × 0,95 ÷ 5.000) = 0,00308; margem = 1,96 × 0,00308 = 0,60 p.p.', { unit: 'p.p.', dec: 2, tol: 0.01 }),
    N('IC de proporção', 'Pesquisa de recompra', 'Numa pesquisa com 400 clientes sorteados, 240 disseram que comprariam de novo.', 'Qual o limite inferior do IC de 95% (%, 1 casa)?', r(C.ciProp(240, 400).lo * 100, 1),
      'p̂ = 60%; erro padrão = √(0,6 × 0,4 ÷ 400) = 0,0245; margem = 4,8 p.p.; limite inferior = 55,2%.', { unit: '%', dec: 1, tol: 0.1 }),
    Q('IC de proporção', 'Empate técnico', 'Pesquisa de preferência: embalagem A 48%, embalagem B 45%, margem de erro de 4 p.p.', 'Qual a conclusão?',
      ['Não há diferença conclusiva: os intervalos se sobrepõem bastante', 'A embalagem A venceu', 'A embalagem B venceu', 'A pesquisa está errada'],
      'A: 44% a 52%; B: 41% a 49%. A diferença de 3 p.p. é menor que a incerteza: empate técnico.'),
    Q('IC de proporção', '3 em 5', 'Uma nova categoria teve 3 compras em 5 visitas. O gerente comemora “60% de conversão”.', 'Qual o problema?',
      ['A amostra é minúscula; a margem de erro é enorme', 'Deveria ser 30%', 'A conta está errada', 'Nenhum'],
      'Com n = 5, a conversão real pode estar em qualquer lugar entre cerca de 15% e 95%. É preciso mais dados.'),
    // Tamanho da amostra (3)
    N('Tamanho da amostra', 'Pesquisa de satisfação', 'O marketing quer estimar a % de clientes satisfeitos com margem de 3 p.p. e 95% de confiança, sem estimativa prévia.', 'Quantas respostas são necessárias?', C.nProp(0.5, 0.03),
      'n = 1,96² × 0,5 × 0,5 ÷ 0,03² = 1.067,1 → ' + C.nProp(0.5, 0.03) + ' (arredonde para cima).', { dec: 0, tol: 1 }),
    N('Tamanho da amostra', 'Estimar o prazo médio', 'O desvio do prazo de entrega é cerca de 1,2 dia. A logística quer estimar o prazo médio com margem de 0,2 dia (95%).', 'Qual o tamanho da amostra?', C.nMean(1.2, 0.2),
      'n = (1,96 × 1,2 ÷ 0,2)² = 11,76² = 138,3 → ' + C.nMean(1.2, 0.2) + ' pedidos.', { dec: 0, tol: 1 }),
    Q('Tamanho da amostra', 'Metade da margem', 'Com 1.068 respostas, a margem é de 3 p.p. A diretoria quer 1,5 p.p.', 'Quantas respostas, aproximadamente?',
      ['Cerca de 4.270 (4 vezes mais)', 'Cerca de 2.136 (2 vezes mais)', 'Cerca de 1.600', 'As mesmas 1.068'],
      'A margem cai com a raiz de n: metade da margem exige 4× a amostra.'),
  ];

  /* ================ NÍVEL 3 · TESTES, MODELOS E PREVISÃO ================ */
  const avancado = [
    // ---- 3.1 Testes de hipótese (5)
    K('Testes de hipótese', 'H₀ ou H₁?', 'O time vai testar se o novo layout do app aumenta o tempo de navegação.', 'Classifique cada afirmação.', ['Hipótese nula (H₀)', 'Hipótese alternativa (H₁)'],
      [['O novo layout não muda o tempo médio de navegação', 0], ['O novo layout muda o tempo médio de navegação', 1], ['A conversão das duas versões é igual', 0], ['A satisfação depende do canal', 1], ['Não há associação entre região e devolução', 0]],
      'H₀ afirma “sem efeito, sem diferença, sem associação”. H₁ é a afirmação que se quer demonstrar.'),
    Q('Testes de hipótese', 'Decisão pelo valor-p', 'O teste de prazo do Sul contra a meta de 4 dias deu valor-p = ' + f(t1.p, 4) + ', com α = 0,05.', 'Qual a decisão?',
      ['Rejeitar H₀: o prazo médio do Sul é diferente de 4 dias', 'Não rejeitar H₀: o prazo é 4 dias', 'Aceitar H₀ com 95% de certeza', 'Aumentar α para 0,10'],
      'p = ' + f(t1.p, 4) + ' < 0,05. A média da amostra (' + f(sul.mean, 2) + ') está acima da meta.'),
    K('Testes de hipótese', 'Tipos de erro', 'Em testes de campanhas, dois erros podem acontecer.', 'Classifique cada situação.', ['Erro tipo I', 'Erro tipo II', 'Decisão correta'],
      [['Concluir que a campanha funciona quando ela não funciona', 0], ['Concluir que não há efeito quando a campanha funciona', 1], ['Detectar o efeito de uma campanha que funciona', 2], ['Lançar um checkout “vencedor” que, na verdade, é igual ao antigo', 0], ['Descartar uma melhoria real por amostra pequena', 1]],
      'Tipo I = falso positivo (alarme falso). Tipo II = falso negativo (efeito real não detectado, falta de poder).'),
    Q('Testes de hipótese', 'Significativo e irrelevante', 'Com 2 milhões de visitas, a versão B aumentou o tempo na página de 61,2 s para 61,5 s, com p < 0,001.', 'Qual a melhor leitura?',
      ['Diferença real, mas pequena demais para importar ao negócio', 'Grande descoberta, pois p é muito pequeno', 'Erro do teste', 'A versão B deve substituir tudo imediatamente'],
      'Amostras enormes tornam significativas diferenças minúsculas. Olhe o tamanho do efeito e o impacto em receita.'),
    Q('Testes de hipótese', 'O que o valor-p não é', 'O relatório diz: “valor-p = 0,03, então há 97% de chance de a campanha funcionar”.', 'Qual o erro?',
      ['O valor-p não é a probabilidade de H₀ (ou H₁) ser verdadeira', 'O valor-p deveria ser 0,97', 'Nenhum, a frase está correta', 'Faltou multiplicar por 100'],
      'O valor-p é a chance de um resultado tão extremo SE H₀ fosse verdadeira. Não mede diretamente a chance de a hipótese ser verdadeira.'),
    // Teste t (4)
    N('Teste t', 'Estatística t de uma amostra', 'Sul: n = 16, média ' + f(sul.mean, 3) + ', desvio ' + f(sul.sd, 3) + '. Meta: 4 dias.', 'Qual o t (2 casas)?', r(t1.t, 2),
      't = (' + f(sul.mean, 3) + ' − 4) ÷ (' + f(sul.sd, 3) + ' ÷ 4) = ' + f(t1.t, 2) + '.', { dec: 2, tol: 0.02 }),
    N('Teste t', 'Diferença do frete grátis', 'Ticket com frete grátis: ' + D.freteGratis.join(', ') + '. Com frete pago: ' + D.fretePago.join(', ') + ' (R$).', 'Qual a diferença entre as médias (R$)?', r(t2.diff, 2),
      'Médias: R$ ' + f(t2.ma, 1) + ' e R$ ' + f(t2.mb, 1) + '. Diferença = R$ ' + f(t2.diff, 1) + '. Welch: t = ' + f(t2.t, 2) + ', p = ' + f(t2.p, 4) + '.', { unit: 'R$', dec: 2, d: { type: 'box', groups: [{ n: 'Frete grátis', v: D.freteGratis }, { n: 'Frete pago', v: D.fretePago }], unit: 'R$' } }),
    N('Teste t', 'Antes e depois', 'Tempo de separação (min) dos mesmos 8 separadores. Antes: ' + D.antes.join('; ') + '. Depois: ' + D.depois.join('; ') + '.', 'Qual a redução média por separador (min, 4 casas)?', r(tp.diff, 4),
      'Diferenças par a par (antes − depois) têm média ' + f(tp.diff, 4) + ' min. t pareado = ' + f(tp.t, 2) + ', p < 0,001.', { unit: 'min', dec: 4, tol: 0.0005 }),
    Q('Teste t', 'Qual teste?', 'Os mesmos 8 separadores foram cronometrados antes e depois do novo sistema.', 'Qual teste usar?',
      ['t pareado', 't de duas amostras independentes (Welch)', 'Qui-quadrado', 'ANOVA'],
      'São as mesmas unidades medidas duas vezes: o pareado compara cada separador consigo mesmo e remove a diferença entre pessoas.'),
    // Teste A/B (5)
    N('Teste A/B', 'Ganho relativo', 'Checkout A: ' + D.ab.A[0] + ' compras em ' + f(D.ab.A[1], 0) + ' visitas. Checkout B: ' + D.ab.B[0] + ' em ' + f(D.ab.B[1], 0) + '.', 'Qual o ganho relativo de conversão de B sobre A (%)?', 25,
      'A = 4,0%; B = 5,0%. (5 − 4) ÷ 4 = 25% de ganho relativo (+1 p.p.).', { unit: '%', dec: 1 }),
    N('Teste A/B', 'Estatística z', 'Checkout A: 200/5.000. Checkout B: 250/5.000.', 'Qual o z do teste de duas proporções (2 casas)?', r(ab.z, 2),
      'p combinado = 450 ÷ 10.000 = 0,045; erro = √(0,045 × 0,955 × (2 ÷ 5.000)) = 0,00415; z = 0,01 ÷ 0,00415 = ' + f(ab.z, 2) + '.', { dec: 2, tol: 0.02, h: 'Use a proporção combinada dos dois grupos no erro padrão.' }),
    Q('Teste A/B', 'Decisão do checkout', 'O teste do checkout deu z = ' + f(ab.z, 2) + ' e valor-p = ' + f(ab.p, 4) + ' (α = 0,05).', 'Qual a decisão?',
      ['B é significativamente melhor: adotar, após checar o impacto em receita', 'Não há diferença', 'A é melhor', 'Repetir até dar p < 0,01'],
      'p < 0,05: a diferença dificilmente é acaso. Antes de adotar, confira receita, ticket e métricas de proteção (devoluções, reclamações).', { d: { type: 'bars', labels: ['Checkout A', 'Checkout B'], series: [{ name: 'Conversão (%)', values: [4, 5] }] } }),
    Q('Teste A/B', 'Amostra pequena', 'Teste do botão do app: A 18/400 (4,5%) e B 26/400 (6,5%). Valor-p = ' + f(ab2.p, 3) + '.', 'Qual a conclusão?',
      ['Sem evidência suficiente: continuar o teste até a amostra planejada', 'B venceu, pois converteu 44% a mais', 'A venceu', 'Encerrar e lançar B'],
      'Com 400 visitas por versão, uma diferença de 2 p.p. ainda pode ser acaso (p = ' + f(ab2.p, 2) + '). Defina o tamanho da amostra antes do teste.'),
    M('Teste A/B', 'Teste bem feito', 'Você vai desenhar o próximo teste A/B da página de produto.', 'Marque as boas práticas.',
      ['Definir métrica principal e tamanho da amostra antes de começar', 'Sortear visitantes entre as versões', 'Rodar semanas completas', 'Parar assim que o valor-p ficar abaixo de 0,05', 'Mudar a versão B no meio do teste'], [0, 1, 2],
      'Planejamento prévio, sorteio e ciclos semanais completos evitam vieses. Espiar e parar cedo, ou mudar o teste no meio, gera falsos vencedores.'),
    // Qui-quadrado (3)
    N('Qui-quadrado', 'Valor esperado', 'Tabela satisfação × canal: o App tem 400 respostas, há 750 satisfeitos no total e 1.020 respostas.', 'Qual a frequência esperada de “App e satisfeito” sob independência (1 casa)?', r(400 * 750 / 1020, 1),
      'E = 400 × 750 ÷ 1.020 = ' + f(400 * 750 / 1020, 1) + '. Observado: 320, acima do esperado.', { dec: 1, d: satisfFig }),
    N('Qui-quadrado', 'Estatística χ²', 'Tabela satisfação × canal (3 × 3).', 'Qual o χ² (2 casas)?', r(ch.chi2, 2),
      'Somando (O − E)² ÷ E nas 9 células: χ² = ' + f(ch.chi2, 2) + ', com 4 graus de liberdade e p = ' + f(ch.p, 4) + '.', { dec: 2, tol: 0.05, d: satisfFig }),
    Q('Qui-quadrado', 'Conclusão do χ²', 'O teste de satisfação × canal deu χ² = ' + f(ch.chi2, 2) + ', gl = 4, p = ' + f(ch.p, 4) + '.', 'Qual a conclusão?',
      ['Satisfação e canal estão associados; o Site concentra mais insatisfeitos', 'Não há relação entre canal e satisfação', 'O canal causa a insatisfação', 'O teste não se aplica a contagens'],
      'p < 0,05 indica associação. Os resíduos mostram onde: o Site tem mais insatisfeitos que o esperado. Associação não prova causa.', { d: satisfFig }),

    // ---- 3.2 Correlação e regressão · ANOVA (3)
    N('ANOVA', 'Estatística F', 'Tempo de atendimento (min), 8 atendimentos por canal. Chat: ' + D.sac.Chat.join(', ') + '. Telefone: ' + D.sac.Telefone.join(', ') + '. E-mail: ' + D.sac['E-mail'].join(', ') + '.', 'Qual o F da ANOVA (2 casas)?', r(an.F, 2),
      'SQ entre = ' + f(an.ssb, 2) + ' (gl 2); SQ dentro = ' + f(an.ssw, 2) + ' (gl 21). F = (' + f(an.ssb, 2) + ' ÷ 2) ÷ (' + f(an.ssw, 2) + ' ÷ 21) = ' + f(an.F, 2) + '.', { dec: 2, tol: 0.05, d: { type: 'box', groups: Object.keys(D.sac).map(function (k) { return { n: k, v: D.sac[k] }; }), unit: 'min' } }),
    Q('ANOVA', 'Por que não três testes t?', 'Um analista quer comparar os três canais do SAC com três testes t (Chat × Telefone, Chat × E-mail, Telefone × E-mail), cada um a 5%.', 'Qual o problema?',
      ['A chance de algum falso positivo passa bem de 5%; a ANOVA controla isso', 'Testes t não funcionam com médias', 'Três testes dão menos poder que nenhum', 'Nenhum, é equivalente à ANOVA'],
      'Com três testes a 5%, a chance de pelo menos um falso positivo chega a cerca de 14%. A ANOVA testa tudo de uma vez.'),
    Q('ANOVA', 'Depois da ANOVA', 'A ANOVA do SAC deu F = ' + f(an.F, 1) + ' e p < 0,001. Médias: Chat ' + f(an.means[0], 2) + ', E-mail ' + f(an.means[2], 2) + ', Telefone ' + f(an.means[1], 2) + ' min.', 'Qual o próximo passo?',
      ['Fazer comparações par a par (ex.: Tukey) para saber quais canais diferem', 'Concluir que todos os canais diferem entre si', 'Concluir que o Chat é o melhor sem mais análise', 'Descartar o Telefone'],
      'A ANOVA indica que pelo menos uma média difere; o post-hoc mostra quais pares diferem.'),
    // Correlação (5)
    N('Correlação', 'Mídia e vendas', 'Mídia (R$ mil) × vendas (R$ mil) em 12 meses: ' + D.midia.map(function (p) { return '(' + p[0] + '; ' + p[1] + ')'; }).join(' ') + '.', 'Qual o coeficiente de correlação r (3 casas)?', r(rg.r, 3),
      'r = ' + f(rg.r, 3) + ': relação linear forte e positiva.', { dec: 3, tol: 0.002, d: { type: 'scatter', pairs: D.midia, xlab: 'Mídia (R$ mil)', ylab: 'Vendas (R$ mil)', showR: false } }),
    Q('Correlação', 'Sorvete e afogamentos', 'Nos meses quentes, as vendas de sorvete e os afogamentos sobem juntos (r = 0,92).', 'Qual a explicação mais provável?',
      ['Uma terceira variável, o calor, aumenta os dois', 'Sorvete causa afogamentos', 'Afogamentos aumentam as vendas de sorvete', 'É coincidência sem explicação'],
      'Variáveis confundidoras criam correlação sem causalidade direta.'),
    K('Correlação', 'Força da relação', 'O analista calculou várias correlações.', 'Classifique cada uma.', ['Forte positiva', 'Forte negativa', 'Fraca ou nula'],
      [['Mídia × vendas: r = 0,98', 0], ['Preço × quantidade vendida: r = −0,81', 1], ['Dia do mês × nota do app: r = 0,04', 2], ['Temperatura × sorvetes: r = 0,99', 0], ['Atraso × nota de satisfação: r = −0,74', 1], ['Idade × ticket: r = 0,12', 2]],
      '|r| ≥ 0,7 é forte; o sinal indica a direção. Perto de zero, não há relação linear relevante.'),
    Q('Correlação', 'r perto de zero', 'O r entre desconto (0% a 40%) e margem foi 0,05. O gráfico mostra uma curva em U invertido.', 'O que concluir?',
      ['Há relação, mas não linear; o r não a captura', 'Desconto não afeta a margem', 'O gráfico está errado', 'A relação é forte e positiva'],
      'O r mede só relação linear. Sempre olhe o gráfico de dispersão.'),
    N('Correlação', 'Variação explicada', 'A correlação entre mídia e vendas é r = ' + f(rg.r, 3) + '.', 'Qual o r² (%, 1 casa)?', r(rg.r2 * 100, 1),
      'r² = ' + f(rg.r, 3) + '² = ' + f(rg.r2 * 100, 1) + '% da variação das vendas está associada linearmente à mídia.', { unit: '%', dec: 1, tol: 0.1 }),
    // Regressão linear (5)
    N('Regressão linear', 'Inclinação', 'Regressão de vendas (R$ mil) sobre mídia (R$ mil), 12 meses.', 'Qual a inclinação b (3 casas)?', r(rg.b, 3),
      'b = ' + f(rg.b, 3) + ': cada R$ 1 mil a mais em mídia está associado, em média, a R$ ' + f(rg.b, 2) + ' mil em vendas.', { dec: 3, tol: 0.005, d: { type: 'scatter', pairs: D.midia, xlab: 'Mídia (R$ mil)', ylab: 'Vendas (R$ mil)', showR: false } }),
    N('Regressão linear', 'Previsão', 'A reta ajustada é Vendas = ' + f(rg.a, 2) + ' + ' + f(rg.b, 3) + ' × Mídia (R$ mil).', 'Qual a previsão de vendas para mídia de R$ 21 mil (R$ mil, 1 casa)?', r(rg.a + rg.b * 21, 1),
      f(rg.a, 2) + ' + ' + f(rg.b, 3) + ' × 21 = ' + f(rg.a + rg.b * 21, 1) + ' mil.', { unit: 'R$ mil', dec: 1, tol: 0.15, d: { type: 'scatter', pairs: D.midia, xlab: 'Mídia (R$ mil)', ylab: 'Vendas (R$ mil)', eq: true } }),
    Q('Regressão linear', 'Extrapolação', 'Os dados de mídia vão de R$ 10 mil a R$ 25 mil. O diretor quer usar a reta para prever as vendas com R$ 200 mil de mídia.', 'Qual o risco?',
      ['Extrapolação: a relação pode mudar muito fora da faixa observada (saturação)', 'Nenhum, a reta vale para qualquer valor', 'O R² cairia para zero', 'A previsão seria sempre menor'],
      'Fora da faixa dos dados, efeitos como saturação da audiência mudam a relação. Use a reta só dentro da faixa observada.'),
    Q('Regressão linear', 'Lendo o intercepto', 'Na reta Vendas = ' + f(rg.a, 1) + ' + ' + f(rg.b, 2) + ' × Mídia, o intercepto é ' + f(rg.a, 1) + '.', 'Como interpretá-lo?',
      ['Vendas estimadas com mídia zero, mas fora da faixa dos dados', 'Vendas mínimas garantidas', 'O ganho por R$ 1 mil de mídia', 'O R² do modelo'],
      'O intercepto é o valor de y quando x = 0. Como não há meses sem mídia nos dados, é uma extrapolação e serve mais como ajuste da reta.'),
    M('Regressão linear', 'Checando o modelo', 'Antes de usar a regressão no orçamento de mídia, você vai checar o modelo.', 'Marque as verificações adequadas.',
      ['Olhar o gráfico dos resíduos em busca de padrões', 'Verificar pontos muito influentes', 'Usar só dentro da faixa observada', 'Concluir que a mídia causa as vendas pelo R² alto', 'Ignorar a sazonalidade dos meses'], [0, 1, 2],
      'Resíduos, pontos influentes e faixa de validade são checagens básicas. R² alto não prova causa, e meses de alta temporada podem confundir.'),
    // Regressão múltipla (4)
    N('Regressão múltipla', 'Efeito do desconto', 'Regressão múltipla: vendas (R$ mil) explicadas por mídia (R$ mil) e desconto médio (%), 10 semanas.', 'Qual o coeficiente do desconto (2 casas)?', r(mr.b[2], 2),
      'Vendas = ' + f(mr.b[0], 2) + ' + ' + f(mr.b[1], 2) + '·mídia + ' + f(mr.b[2], 2) + '·desconto. Cada ponto de desconto adiciona ' + f(mr.b[2], 2) + ' mil, mantida a mídia.', { dec: 2, tol: 0.02, d: { type: 'table', cols: ['Semana', 'Mídia', 'Desconto (%)', 'Vendas'], rows: D.mreg.X.map(function (x, i) { return [i + 1, x[0], x[1], D.mreg.y[i]]; }) } }),
    N('Regressão múltipla', 'Previsão com dois fatores', 'Modelo: Vendas = ' + f(mr.b[0], 2) + ' + ' + f(mr.b[1], 2) + '·mídia + ' + f(mr.b[2], 2) + '·desconto.', 'Qual a previsão para mídia de R$ 20 mil e desconto de 8% (R$ mil, 1 casa)?', r(mr.b[0] + mr.b[1] * 20 + mr.b[2] * 8, 1),
      f(mr.b[0], 2) + ' + ' + f(mr.b[1], 2) + ' × 20 + ' + f(mr.b[2], 2) + ' × 8 = ' + f(mr.b[0] + mr.b[1] * 20 + mr.b[2] * 8, 1) + ' mil.', { unit: 'R$ mil', dec: 1, tol: 0.15 }),
    Q('Regressão múltipla', 'R² ou R² ajustado?', 'O modelo com mídia e desconto tem R² = ' + f(mr.r2, 3) + '. Ao incluir “cor do banner”, o R² subiu para ' + f(mr.r2 + 0.002, 3) + ', mas o R² ajustado caiu.', 'O que fazer?',
      ['Manter o modelo sem a cor do banner: a variável não acrescenta', 'Incluir a cor, pois o R² subiu', 'Remover a mídia', 'Usar só o intercepto'],
      'O R² sempre sobe com mais variáveis. O R² ajustado penaliza variáveis inúteis e indica que a cor do banner não melhora o modelo.'),
    Q('Regressão múltipla', 'Variáveis gêmeas', 'O modelo inclui “gasto com mídia” e “impressões dos anúncios”, que têm correlação 0,98 entre si. Os coeficientes mudam de sinal a cada nova semana de dados.', 'Qual o problema?',
      ['Multicolinearidade: as duas variáveis carregam a mesma informação', 'Sazonalidade', 'Viés de sobrevivência', 'Falta de outliers'],
      'Explicativas quase idênticas deixam os coeficientes instáveis. Mantenha uma delas ou combine-as.'),

    // ---- 3.3 Séries temporais e decisão · Séries (4)
    N('Séries temporais', 'Crescimento anual', 'Vendas de dezembro: R$ 680 mil em 2024 e R$ 790 mil em 2025.', 'Qual o crescimento YoY (%, 1 casa)?', r(yoy * 100, 1),
      '(790 − 680) ÷ 680 = ' + f(yoy * 100, 1) + '%.', { unit: '%', dec: 1, d: vendasFig }),
    Q('Séries temporais', 'Janeiro em queda', 'Em janeiro de 2025, as vendas caíram 34% em relação a dezembro de 2024. O diretor quer um plano de crise.', 'Qual a leitura correta?',
      ['É sazonalidade: compare com janeiro de 2024 (+18%)', 'É uma crise grave', 'Os dados estão errados', 'A tendência virou de baixa'],
      'Dezembro é sempre o pico. Contra jan/24 (380), jan/25 (450) cresceu 18%.', { d: vendasFig }),
    K('Séries temporais', 'Componentes da série', 'O time está descrevendo o comportamento das vendas.', 'Classifique cada observação.', ['Tendência', 'Sazonalidade', 'Ruído'],
      [['Vendas sobem ano após ano', 0], ['Picos todo novembro e dezembro', 1], ['Uma semana fraca sem explicação aparente', 2], ['Fevereiro sempre mais fraco que janeiro', 1], ['Crescimento médio de cerca de R$ 11 mil por mês', 0]],
      'Tendência é a direção de longo prazo; sazonalidade, o padrão que se repete; ruído, a variação sem padrão.', { d: vendasFig }),
    N('Séries temporais', 'Tendência mensal', 'Uma reta ajustada às vendas mensais (meses numerados de 0 a 23) tem inclinação de ' + f(C.regress(D.vendas.map(function (y, i) { return [i, y]; })).b, 2) + ' por mês.', 'Quanto a tendência adiciona em 12 meses (R$ mil, 1 casa)?', r(C.regress(D.vendas.map(function (y, i) { return [i, y]; })).b * 12, 1),
      f(C.regress(D.vendas.map(function (y, i) { return [i, y]; })).b, 2) + ' × 12 = ' + f(C.regress(D.vendas.map(function (y, i) { return [i, y]; })).b * 12, 1) + ' mil por ano, sem contar a sazonalidade.', { unit: 'R$ mil', dec: 1, tol: 0.15, d: { type: 'line', values: D.vendas, labels: D.meses, name: 'Vendas (R$ mil)', trend: true } }),
    // Médias móveis e previsão (4)
    N('Médias móveis e previsão', 'Média móvel de 3', 'Vendas de out, nov e dez de 2025: 590, 720 e 790 (R$ mil).', 'Qual a média móvel de 3 meses em dezembro (R$ mil, 1 casa)?', r(ma3[ma3.length - 1], 1),
      '(590 + 720 + 790) ÷ 3 = ' + f(ma3[ma3.length - 1], 1) + ' mil.', { unit: 'R$ mil', dec: 1, d: { type: 'line', values: D.vendas, labels: D.meses, name: 'Vendas (R$ mil)', ma: 3 } }),
    N('Médias móveis e previsão', 'Ingênua sazonal', 'Jan/25 vendeu R$ 450 mil. O crescimento anual recente é de ' + f(yoy * 100, 1) + '%.', 'Qual a previsão para jan/26 pela ingênua sazonal (R$ mil, inteiro)?', r(450 * (1 + yoy), 0),
      '450 × (1 + ' + f(yoy, 4) + ') = ' + f(450 * (1 + yoy), 0) + ' mil.', { unit: 'R$ mil', dec: 0, tol: 1 }),
    Q('Médias móveis e previsão', 'Método inadequado', 'Para prever janeiro de 2026, o analista usou a média móvel de out a dez/25: R$ ' + f(ma3[ma3.length - 1], 0) + ' mil.', 'Qual o problema?',
      ['Ignora a sazonalidade: janeiro é sempre bem mais fraco que o fim de ano', 'A janela deveria ser de 2 meses', 'Média móvel não serve para vendas', 'Nenhum, é a melhor previsão'],
      'A média do pico de fim de ano superestima janeiro. A ingênua sazonal (≈ ' + f(450 * (1 + yoy), 0) + ') respeita o padrão do ano.'),
    N('Médias móveis e previsão', 'MAPE', 'Previsões × real (R$ mil): 500 × 520, 480 × 450, 600 × 640.', 'Qual o MAPE (%, 1 casa)?', r((20 / 520 + 30 / 450 + 40 / 640) / 3 * 100, 1),
      'Erros: 20/520 = 3,8%; 30/450 = 6,7%; 40/640 = 6,3%. MAPE = média = ' + f((20 / 520 + 30 / 450 + 40 / 640) / 3 * 100, 1) + '%.', { unit: '%', dec: 1, tol: 0.1 }),
    // Armadilhas (4)
    Q('Armadilhas estatísticas', 'Paradoxo de Simpson', 'O Site converte melhor que o App entre clientes novos (12% × 10%) e entre recorrentes (35% × 33%). No total, o App converte 29,2% e o Site 15,8%.', 'Como isso é possível?',
      ['O App tem muito mais clientes recorrentes, que convertem mais (mix diferente)', 'Erro de cálculo', 'O App é melhor em todos os grupos', 'A conversão total é a média simples dos grupos'],
      'Paradoxo de Simpson: a composição dos grupos inverte a comparação no total. Compare dentro dos segmentos.', { d: { type: 'table', cols: ['Grupo', 'Site', 'App'], rows: [['Novos', '12,0% (120/1.000)', '10,0% (20/200)'], ['Recorrentes', '35,0% (70/200)', '33,0% (330/1.000)'], ['Total', '15,8%', '29,2%']], tot: true } }),
    Q('Armadilhas estatísticas', 'Lojas que sobreviveram', 'Um estudo conclui que “lojas em shopping sempre dão lucro”, analisando as 40 lojas abertas hoje.', 'Qual o problema?',
      ['Viés de sobrevivência: as lojas que fecharam por prejuízo ficaram de fora', 'Amostra grande demais', 'Falta de sazonalidade', 'Multicolinearidade'],
      'Olhar só quem sobreviveu esconde os fracassos. Inclua as lojas fechadas no período.'),
    Q('Armadilhas estatísticas', 'O pior mês', 'A loja com a pior nota de satisfação de março recebeu treinamento e, em abril, sua nota voltou para perto da média da rede.', 'O que se pode concluir?',
      ['Nada ainda: pode ser regressão à média; é preciso um grupo de controle', 'O treinamento funcionou com certeza', 'O treinamento piorou a loja', 'A nota de março estava errada'],
      'Resultados extremos tendem a voltar ao normal. Compare com lojas parecidas que não receberam o treinamento.'),
    N('Armadilhas estatísticas', 'Muitos testes', 'O time testou 20 métricas independentes, cada uma com α = 0,05, numa campanha que não teve efeito nenhum.', 'Qual a chance de pelo menos uma métrica dar “significativa” por acaso (%, 1 casa)?', r((1 - Math.pow(0.95, 20)) * 100, 1),
      '1 − 0,95²⁰ = ' + f((1 - Math.pow(0.95, 20)) * 100, 1) + '%. Por isso, defina a métrica principal antes e corrija o α para vários testes.', { unit: '%', dec: 1 }),
    // Desafio final (4)
    K('Desafio final', 'O teste certo', 'Desafio final: escolha o método para cada pergunta de negócio.', 'Classifique cada pergunta.', ['t de Welch', 't pareado', 'ANOVA', 'Teste de proporções', 'Qui-quadrado', 'Regressão'],
      [['O ticket do App é diferente do ticket do Site?', 0], ['Os mesmos vendedores venderam mais depois do treinamento?', 1], ['O prazo médio difere entre as 4 transportadoras?', 2], ['A nova página converte mais que a antiga?', 3], ['Região e motivo de devolução estão associados?', 4], ['Quanto cada R$ 1 mil de mídia adiciona às vendas?', 5]],
      'Duas médias independentes → Welch; mesmas unidades → pareado; 3+ médias → ANOVA; duas taxas → proporções; duas categóricas → qui-quadrado; efeito numérico → regressão.'),
    O('Desafio final', 'Da pergunta à decisão', 'Desafio final: a diretoria quer saber se vale a pena oferecer frete grátis acima de R$ 150.', 'Coloque as etapas na ordem.',
      ['Definir a pergunta e a métrica (margem por pedido)', 'Planejar o teste A/B e o tamanho da amostra', 'Rodar o teste com sorteio dos clientes', 'Descrever os resultados (médias, taxas, gráficos)', 'Testar a diferença e calcular o intervalo de confiança', 'Recomendar com custo, risco e plano de acompanhamento'],
      'Pergunta → plano → coleta → descritiva → inferência → decisão.'),
    N('Desafio final', 'Vale a pena?', 'Desafio final: o frete grátis aumentou o ticket médio em R$ ' + f(t2.diff, 1) + ' (IC de 95%: R$ 11 a R$ 30). O frete custa em média R$ 18 por pedido, e a margem bruta é de 40% do ticket.', 'Usando a diferença média, de quanto é o prejuízo esperado por pedido (R$, 2 casas)?', r(18 - t2.diff * 0.4, 2),
      'Margem extra = 0,40 × ' + f(t2.diff, 1) + ' = R$ ' + f(t2.diff * 0.4, 2) + '; menos R$ 18 de frete = prejuízo de R$ ' + f(18 - t2.diff * 0.4, 2) + ' por pedido. Mesmo com efeito significativo no ticket, a ação não se paga.', { unit: 'R$', dec: 2, h: 'Ganho = margem sobre o aumento do ticket − custo do frete.' }),
    M('Desafio final', 'O relatório final', 'Desafio final: você vai apresentar a análise do frete grátis à diretoria.', 'Marque o que deve constar no relatório.',
      ['Tamanho do efeito com intervalo de confiança', 'Impacto financeiro (margem − custo)', 'Premissas e limitações do teste', 'Apenas o valor-p, sem números de negócio', 'Só os resultados favoráveis à ideia'], [0, 1, 2],
      'Decisão boa precisa de efeito, impacto e limites. Valor-p sozinho e resultados escolhidos a dedo enganam.'),
  ];

  const LEVELS = [
    { id: 1, key: 'iniciante', nome: 'Iniciante', list: iniciante },
    { id: 2, key: 'intermediario', nome: 'Intermediário', list: intermediario },
    { id: 3, key: 'avancado', nome: 'Avançado', list: avancado },
  ];
  function difficulty(level, pos) {
    if (level === 1) return pos <= 30 ? 'facil' : 'media';
    if (level === 2) return pos <= 15 ? 'facil' : pos <= 40 ? 'media' : 'dificil';
    return pos <= 15 ? 'media' : 'dificil';
  }
  const EXERCISES = [];
  LEVELS.forEach(function (lv) {
    lv.list.forEach(function (ex, i) {
      const pos = i + 1;
      EXERCISES.push(Object.assign({}, ex, {
        id: 'st' + lv.id + '-' + String(pos).padStart(2, '0'), index: EXERCISES.length,
        level: lv.id, levelName: lv.nome, pos: pos, diff: difficulty(lv.id, pos), track: 'estatistica',
      }));
    });
  });
  global.ESBank = { EXERCISES: EXERCISES, LEVELS: LEVELS.map(function (l) { return { id: l.id, key: l.key, nome: l.nome }; }) };
})(typeof window !== 'undefined' ? window : globalThis);
