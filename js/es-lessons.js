/* =====================================================================
   es-lessons.js — Aulas da trilha de Estatística Aplicada
   ---------------------------------------------------------------------
   36 aulas em 9 etapas:
     Nível 1 · Estatística descritiva  → 1.1 Dados e amostras ·
       1.2 Posição e dispersão · 1.3 Distribuição e gráficos
     Nível 2 · Probabilidade e inferência → 2.1 Probabilidade ·
       2.2 Distribuições · 2.3 Estimação
     Nível 3 · Testes, modelos e previsão → 3.1 Testes de hipótese ·
       3.2 Correlação e regressão · 3.3 Séries temporais e decisão
   Mesmo carrossel da Gestão; gráficos e números calculados na hora.
   Questões de prova: [pergunta, correta, errada1, errada2, errada3, explicação]
   ===================================================================== */
(function (global) {
  'use strict';
  const L = {}, MAP = {};
  const D = global.ESData, C = global.GQCharts.calc, r = global.GQCharts.round, f = global.GQCharts.fmt;
  function lesson(key, topic, kw, titulo, ideia, analogia, sintaxe, notas, exemplo, cuidados, quiz) {
    L[key] = { key: key, kw: kw, titulo: titulo, ideia: ideia, analogia: analogia, sintaxe: sintaxe, notas: notas, exemplo: exemplo, cuidados: cuidados, quiz: quiz };
    MAP[topic] = key;
  }
  const tk = C.describe(D.ticket), fe = C.iqrFences(D.ticket), rp = C.describe(D.rapida), fx = C.describe(D.flex);
  const ci = C.ciMean(D.sul), sul = C.describe(D.sul), ab = C.prop2(D.ab.B[0], D.ab.B[1], D.ab.A[0], D.ab.A[1]);
  const rg = C.regress(D.midia), mr = C.mreg(D.mreg.X, D.mreg.y), ch = C.chi2(D.satisf.tab), an = C.anova(Object.values(D.sac)), t2 = C.t2(D.freteGratis, D.fretePago);
  const nt = C.wmean(D.notas.v, D.notas.n), totN = D.notas.n.reduce(function (a, b) { return a + b; }, 0);

  /* ===================== NÍVEL 1 · ESTATÍSTICA DESCRITIVA ===================== */
  // ---- Etapa 1.1 · Dados e amostras
  lesson('tipos', 'Tipos de dados', 'VARIÁVEIS', 'Tipos de dados e variáveis',
    'Toda análise começa entendendo o tipo de cada variável. Qualitativas (categóricas) descrevem categorias: canal de venda, cidade, status. Quantitativas são números que medem algo: discretas contam (itens no pedido) e contínuas medem (tempo, valor, peso). O tipo define o que faz sentido calcular e qual gráfico usar.',
    'É como separar a roupa antes de lavar: brancas, coloridas e delicadas recebem tratamentos diferentes. Calcular a média do CEP é como lavar a seda na água quente.',
    'Qualitativa nominal  → categorias sem ordem (canal, cidade)\nQualitativa ordinal  → categorias com ordem (nota 1 a 5, porte P/M/G)\nQuantitativa discreta → contagens (itens, reclamações)\nQuantitativa contínua → medidas (tempo, valor, peso)\nIdentificadores       → CPF, CEP, nº do pedido: não são para contas',
    ['Número nem sempre é quantidade: CEP e código do produto são rótulos.', 'Para categorias, conte e calcule percentuais; para números, médias e dispersão.', 'Variáveis ordinais têm ordem, mas a distância entre as categorias não é garantida.'],
    { p: 'As colunas da base de pedidos da NexusMarket:', c: 'pedido_id   → identificador\ncanal       → qualitativa nominal\nnota_app    → qualitativa ordinal (1 a 5)\nitens       → quantitativa discreta\nvalor_total → quantitativa contínua', fig: { type: 'cards', items: [['Nominal', 'Canal: App, Site, Marketplace, Loja.'], ['Ordinal', 'Nota do app: de 1 a 5 estrelas.'], ['Discreta', 'Itens no pedido: 1, 2, 3…'], ['Contínua', 'Valor do pedido: R$ 84,90.']], speech: 'Cada coluna da base tem um tipo, e o tipo decide a análise.' } },
    ['Não calcule média de códigos (CEP, ID).', 'Não trate nota de 1 a 5 como medida exata sem pensar: é ordinal.', 'Confira o tipo antes de escolher o gráfico.'],
    [['O número de itens em um pedido é uma variável:', 'Quantitativa discreta', 'Quantitativa contínua', 'Qualitativa nominal', 'Qualitativa ordinal', 'Contagens são discretas.'],
      ['O canal de venda (App, Site, Loja) é uma variável:', 'Qualitativa nominal', 'Qualitativa ordinal', 'Quantitativa discreta', 'Quantitativa contínua', 'Categorias sem ordem.'],
      ['Qual destas NÃO faz sentido somar ou tirar média?', 'CEP do cliente', 'Valor do pedido', 'Tempo de entrega', 'Itens no pedido', 'CEP é um rótulo, não uma quantidade.']]);

  lesson('amostra', 'População e amostra', 'AMOSTRA', 'População, amostra e parâmetro',
    'População é o conjunto inteiro que queremos entender (todos os clientes); amostra é a parte que conseguimos observar. Um parâmetro descreve a população (a média real de todos), uma estatística descreve a amostra (a média dos 500 entrevistados). A estatística serve para estimar o parâmetro, e por isso a amostra precisa representar bem a população.',
    'É provar a sopa: uma colherada (amostra) diz como está a panela (população), desde que você mexa bem antes. Se pegar só a parte de cima, a conclusão sai errada.',
    'População → todos os elementos de interesse (N)\nAmostra   → parte observada (n)\nParâmetro → μ (média), σ (desvio), p (proporção) da população\nEstatística → x̄, s, p̂ calculadas na amostra\nViés      → amostra que não representa a população',
    ['Amostra grande e enviesada continua errada.', 'Sorteio aleatório é a forma mais simples de evitar viés.', 'Defina a população antes de coletar: “clientes ativos em 2025”, não “clientes”.'],
    { p: 'Pesquisa de satisfação do app:', c: 'População → 120.000 clientes ativos do app\nAmostra   → 500 clientes sorteados\nEstatística → nota média ' + f(nt, 2) + '\nParâmetro → nota média de todos (desconhecida)', fig: { type: 'bars', labels: ['1★', '2★', '3★', '4★', '5★'], series: [{ name: 'Avaliações', values: D.notas.n }], speech: 'Na amostra de 500 avaliações, as notas 4 e 5 concentram a maioria.' } },
    ['Pesquisa só com quem reclamou no SAC não representa todos os clientes.', 'Respostas voluntárias atraem quem tem opinião forte.', 'Não generalize para quem ficou fora da população estudada.'],
    [['A média de todos os clientes (desconhecida) é um:', 'Parâmetro', 'Estatística', 'Viés', 'Outlier', 'Descreve a população.'],
      ['Para evitar viés de seleção, o mais indicado é:', 'Sortear a amostra aleatoriamente', 'Entrevistar só os clientes fiéis', 'Usar só quem respondeu nas redes sociais', 'Escolher os mais fáceis de contatar', 'Todos têm a mesma chance de entrar.'],
      ['Uma pesquisa com 10.000 respostas só de quem reclamou:', 'Continua enviesada, apesar do tamanho', 'É perfeita pelo tamanho', 'Representa todos os clientes', 'Não tem erro amostral', 'Tamanho não corrige viés.']]);

  lesson('freq', 'Tabelas de frequência', 'FREQUÊNCIA', 'Tabelas de frequência',
    'A tabela de frequência resume os dados contando quantas vezes cada valor ou faixa aparece. A frequência absoluta é a contagem; a relativa é a contagem dividida pelo total (em %); a acumulada soma as linhas até ali. É o primeiro retrato de qualquer variável.',
    'É como organizar as moedas do cofrinho em pilhas por valor: em segundos você vê quantas há de cada tipo e quanto isso representa do total.',
    'Absoluta  → quantas vezes aparece\nRelativa  → absoluta ÷ total × 100\nAcumulada → soma das relativas até a linha\nFaixas    → para números contínuos (classes de mesma largura)\nTotal     → relativas somam 100%',
    ['Para variáveis contínuas, agrupe em faixas de mesma largura.', 'A frequência acumulada responde “quantos até X?”.', 'Sempre mostre o total para dar contexto.'],
    { p: 'Notas do app (' + f(totN, 0) + ' avaliações):', c: 'Nota | Absoluta | Relativa\n5★   | 275      | 55,0%\n4★   | 140      | 28,0%\n3★   | 45       | 9,0%\n2★   | 22       | 4,4%\n1★   | 18       | 3,6%', fig: { type: 'table', cols: ['Nota', 'Absoluta', 'Relativa', 'Acumulada (de 5★ para baixo)'], rows: [['5★', 275, '55,0%', '55,0%'], ['4★', 140, '28,0%', '83,0%'], ['3★', 45, '9,0%', '92,0%'], ['2★', 22, '4,4%', '96,4%'], ['1★', 18, '3,6%', '100,0%']], speech: '83% das avaliações são de 4 ou 5 estrelas.' } },
    ['Não esqueça a linha de total.', 'Faixas de tamanhos diferentes distorcem a leitura.', 'Percentual sem o total esconde amostras pequenas.'],
    [['Frequência relativa é:', 'A contagem dividida pelo total', 'A contagem acumulada', 'A média dos valores', 'O maior valor', 'Proporção de cada categoria.'],
      ['Das 500 avaliações, 140 são 4★. A frequência relativa é:', '28%', '14%', '40%', '72%', '140 ÷ 500 = 0,28.'],
      ['A frequência acumulada responde a perguntas do tipo:', 'Quantos casos até determinado valor?', 'Qual é a média?', 'Qual é o desvio padrão?', 'Qual é a moda?', 'Soma das linhas até ali.']]);

  lesson('prop', 'Proporções e porcentagens', '%', 'Proporções, porcentagens e variação',
    'Proporção é parte ÷ todo; porcentagem é a proporção × 100. Para comparar períodos, use a variação percentual: (novo − antigo) ÷ antigo. Diferença entre percentuais se mede em pontos percentuais (p.p.): passar de 4% para 5% é +1 p.p., mas +25% em termos relativos.',
    'É a diferença entre dizer “o preço subiu R$ 2” e “o preço subiu 20%”: o mesmo fato, com bases diferentes. Saber a base evita sustos e manchetes enganosas.',
    'Proporção   = parte ÷ todo\nPorcentagem = proporção × 100\nVariação %  = (novo − antigo) ÷ antigo × 100\nPontos percentuais (p.p.) = % novo − % antigo\nParticipação = valor do grupo ÷ total',
    ['Sempre pergunte: percentual de quê?', 'Pontos percentuais e variação percentual não são a mesma coisa.', 'Uma queda de 50% seguida de alta de 50% não volta ao início.'],
    { p: 'Pedidos por canal no mês:', c: 'Total = 10.000 pedidos\nApp = 4.200 → 42%\nSite = 3.100 → 31%\nMarketplace = 1.900 → 19%\nLoja física = 800 → 8%', fig: { type: 'bars', labels: D.canais.map(function (x) { return x[0]; }), series: [{ name: 'Pedidos', values: D.canais.map(function (x) { return x[1]; }) }], speech: 'O app responde por 42% dos 10 mil pedidos do mês.' } },
    ['Não some percentuais de bases diferentes.', 'Crescimento sobre base pequena parece enorme.', 'Explique se é p.p. ou %.'],
    [['A conversão passou de 4% para 5%. Em pontos percentuais, a alta foi de:', '1 p.p.', '25 p.p.', '5 p.p.', '20 p.p.', '5 − 4 = 1 ponto percentual.'],
      ['E em variação percentual relativa, a mesma alta de 4% para 5% é de:', '25%', '1%', '5%', '20%', '(5 − 4) ÷ 4 = 0,25.'],
      ['Um preço cai 50% e depois sobe 50%. Em relação ao início, ele fica:', '25% menor', 'Igual', '25% maior', '50% menor', '0,5 × 1,5 = 0,75.']]);

  // ---- Etapa 1.2 · Posição e dispersão
  lesson('centro', 'Média, mediana e moda', 'MÉDIA', 'Média, mediana e moda',
    'As medidas de posição resumem o “centro” dos dados. A média soma tudo e divide pela quantidade; a mediana é o valor do meio com os dados ordenados; a moda é o valor mais frequente. Quando há valores muito altos (cauda longa), a média é puxada para cima e a mediana representa melhor o caso típico.',
    'Num bar com dez pessoas, entra um bilionário: a renda média dispara, mas a mediana quase não muda. A mediana conta como vive a pessoa típica do bar.',
    'Média   = Σx ÷ n\nMediana = valor central (n par: média dos dois centrais)\nModa    = valor mais frequente\nAssimetria à direita → média > mediana\nSimétrica            → média ≈ mediana',
    ['Use a mediana para renda, preço de imóveis e tickets com cauda longa.', 'A moda é a única que serve para dados nominais.', 'Informe média e mediana juntas quando elas divergem.'],
    { p: 'Ticket de 30 pedidos do site:', c: 'Média   = R$ ' + f(tk.mean, 2) + '\nMediana = R$ ' + f(tk.median, 2) + '\n# poucos pedidos de R$ 300 a R$ 520 puxam a média', fig: { type: 'hist', values: D.ticket, from: 0, bin: 60, xlab: 'Valor do pedido (R$)' } },
    ['Não reporte só a média de dados assimétricos.', 'Mediana não é “a média do meio”: é a posição central.', 'Moda pode não existir ou haver várias.'],
    [['Os pedidos têm média R$ 153 e mediana R$ 121. A distribuição é:', 'Assimétrica à direita', 'Simétrica', 'Assimétrica à esquerda', 'Uniforme', 'Média acima da mediana indica cauda à direita.'],
      ['A mediana de 3, 5, 8, 10 é:', '6,5', '5', '8', '6', 'Média dos dois centrais: (5 + 8) ÷ 2.'],
      ['Para o canal mais usado (App, Site, Loja), a medida adequada é:', 'Moda', 'Média', 'Mediana', 'Desvio padrão', 'Dado nominal só tem moda.']]);

  lesson('ponderada', 'Média ponderada', 'PONDERADA', 'Média ponderada',
    'Na média ponderada, cada valor pesa de acordo com sua importância ou quantidade: Σ(valor × peso) ÷ Σpesos. É a forma certa de calcular a nota média de várias avaliações agrupadas, o preço médio de compras com quantidades diferentes ou a margem média de produtos com vendas diferentes.',
    'É a nota do boletim: a prova vale mais que o trabalho. Somar as notas e dividir por dois daria peso igual ao que não tem peso igual.',
    'Média ponderada = Σ(xᵢ × wᵢ) ÷ Σwᵢ\nPesos → quantidades, importâncias, participações\nMédia de médias → só é correta se os grupos têm o mesmo tamanho',
    ['Média de médias com grupos de tamanhos diferentes engana.', 'Os pesos podem ser quantidades, receitas ou importâncias.', 'Na prática, Excel: SOMARPRODUTO(valores; pesos) ÷ SOMA(pesos).'],
    { p: 'Nota média do app a partir da tabela de frequências:', c: 'Σ(nota × qtd) = 1×18 + 2×22 + 3×45 + 4×140 + 5×275 = 2.132\nΣ qtd = 500\nMédia = 2.132 ÷ 500 = ' + f(nt, 3), fig: { type: 'bars', labels: ['1★', '2★', '3★', '4★', '5★'], series: [{ name: 'Avaliações', values: D.notas.n }], speech: 'A nota média ponderada do app é ' + f(nt, 2) + '.' } },
    ['Não calcule (1 + 2 + 3 + 4 + 5) ÷ 5 = 3 ignorando as quantidades.', 'Confira se os pesos somam o total correto.', 'Médias de lojas com vendas diferentes precisam de peso.'],
    [['Loja A: 100 pedidos com ticket R$ 50; loja B: 300 pedidos com ticket R$ 90. O ticket médio geral é:', 'R$ 80', 'R$ 70', 'R$ 75', 'R$ 90', '(100×50 + 300×90) ÷ 400 = 80.'],
      ['Quando a média de médias é correta?', 'Quando os grupos têm o mesmo tamanho', 'Sempre', 'Nunca', 'Quando há outliers', 'Pesos iguais.'],
      ['Na média ponderada, os pesos:', 'Definem quanto cada valor influencia o resultado', 'Precisam somar 1 obrigatoriamente', 'São sempre iguais', 'Substituem os valores', 'Basta dividir pela soma dos pesos.']]);

  lesson('dispersao', 'Dispersão', 'DESVIO', 'Amplitude, variância, desvio padrão e CV',
    'Duas transportadoras podem ter o mesmo prazo médio e serviços muito diferentes. A dispersão mede o quanto os dados se espalham: amplitude (máximo − mínimo), variância (média dos desvios ao quadrado) e desvio padrão (raiz da variância, na mesma unidade dos dados). O coeficiente de variação (CV = desvio ÷ média) compara dispersões de grandezas diferentes.',
    'É a pontaria de dois arqueiros: ambos acertam “em média” o centro, mas um agrupa as flechas e o outro espalha pelo alvo todo. O desvio padrão mede esse espalhamento.',
    'Amplitude = máx − mín\nVariância (amostra) s² = Σ(x − x̄)² ÷ (n − 1)\nDesvio padrão s = √s²\nCV = s ÷ x̄ (em %)\nRegra prática: CV < 15% baixa dispersão; > 30% alta',
    ['Média sem dispersão é meia informação.', 'Use n − 1 na amostra (correção de Bessel).', 'O CV permite comparar R$ com dias, por exemplo.'],
    { p: 'Prazo de entrega (dias) em 12 pedidos de cada transportadora:', c: 'Rápida → média ' + f(rp.mean, 2) + ' · desvio ' + f(rp.sd, 2) + ' · CV ' + f(C.cv(D.rapida) * 100, 1) + '%\nFlex   → média ' + f(fx.mean, 2) + ' · desvio ' + f(fx.sd, 2) + ' · CV ' + f(C.cv(D.flex) * 100, 1) + '%', fig: { type: 'box', groups: [{ n: 'Rápida', v: D.rapida }, { n: 'Flex', v: D.flex }], unit: 'dias' } },
    ['A amplitude depende só de dois valores: é sensível a extremos.', 'A variância está em unidades ao quadrado; para comunicar, use o desvio.', 'Não compare desvios de grandezas diferentes sem o CV.'],
    [['Duas transportadoras têm média de 3,3 dias. A Rápida tem desvio 0,5 e a Flex, 2,2. Qual é mais previsível?', 'A Rápida', 'A Flex', 'As duas são iguais', 'Não dá para saber', 'Menor desvio, menos surpresa.'],
      ['O desvio padrão é a raiz quadrada da:', 'Variância', 'Média', 'Amplitude', 'Mediana', 's = √s².'],
      ['Média 200 e desvio 30. O CV é:', '15%', '30%', '6,7%', '170', '30 ÷ 200 = 0,15.']]);

  lesson('quartis', 'Quartis e boxplot', 'QUARTIS', 'Quartis, percentis e boxplot',
    'Os quartis dividem os dados ordenados em quatro partes iguais: Q1 (25%), Q2 (mediana) e Q3 (75%). O intervalo interquartil (IQR = Q3 − Q1) mostra onde estão os 50% centrais. O boxplot desenha tudo isso: a caixa vai de Q1 a Q3, a linha é a mediana e as hastes chegam aos valores típicos; pontos isolados são candidatos a outlier.',
    'Pense numa fila por altura dividida em quatro grupos do mesmo tamanho: os quartis são as pessoas nas três divisas. A caixa do boxplot é o miolo da fila.',
    'Q1 → 25% dos dados abaixo\nQ2 → mediana (50%)\nQ3 → 75% dos dados abaixo\nIQR = Q3 − Q1\nPercentil p → p% abaixo (P90 = 90% abaixo)\nOutlier → fora de [Q1 − 1,5·IQR ; Q3 + 1,5·IQR]',
    ['Percentis são ótimos para metas de serviço: “P90 da entrega em 5 dias”.', 'IQR é robusto: não é afetado por extremos.', 'Boxplot lado a lado compara grupos rapidamente.'],
    { p: 'Ticket dos 30 pedidos:', c: 'Q1 = R$ ' + f(fe.q1, 2) + '\nMediana = R$ ' + f(tk.median, 2) + '\nQ3 = R$ ' + f(fe.q3, 2) + '\nIQR = R$ ' + f(fe.iqr, 2), fig: { type: 'box', groups: [{ n: 'Ticket', v: D.ticket }], unit: 'R$' } },
    ['Softwares usam métodos de interpolação diferentes: pequenas diferenças nos quartis são normais.', 'Caixa grande = muita dispersão no miolo.', 'Não confunda percentil com porcentagem.'],
    [['O que o Q3 indica?', 'Que 75% dos dados estão abaixo dele', 'Que 3% dos dados estão abaixo', 'A média dos maiores valores', 'O máximo', 'Terceiro quartil.'],
      ['Q1 = 80 e Q3 = 140. O IQR é:', '60', '220', '110', '140', '140 − 80.'],
      ['Meta: “P90 do prazo de entrega ≤ 5 dias” significa:', '90% das entregas em até 5 dias', 'Média de 5 dias', '90 entregas por dia', '5% de atrasos', 'Percentil 90.']]);

  // ---- Etapa 1.3 · Distribuição e gráficos
  lesson('histograma', 'Histograma e forma', 'HISTOGRAMA', 'Histograma e forma da distribuição',
    'O histograma mostra como os valores se distribuem em faixas: onde se concentram, se são simétricos, se há cauda longa ou dois picos. Distribuições assimétricas à direita (cauda para valores altos) são comuns em valores de compra, tempo de atendimento e renda. Dois picos costumam indicar dois grupos misturados.',
    'É a silhueta de uma cidade vista de longe: você percebe onde estão os prédios altos e onde a cidade é baixa, sem olhar prédio por prédio.',
    'Simétrica           → média ≈ mediana\nAssimétrica direita → cauda para valores altos (média > mediana)\nAssimétrica esquerda → cauda para valores baixos\nBimodal             → dois picos: misture de grupos?\nLargura da faixa    → teste algumas: muito larga esconde, muito estreita vira ruído',
    ['Olhe o histograma antes de escolher média ou mediana.', 'Bimodal: separe os grupos (canal, região, turno) antes de analisar.', 'Faixas iguais, eixo vertical começando em zero.'],
    { p: 'Distribuição do ticket dos 30 pedidos:', c: '# muitos pedidos entre R$ 60 e R$ 180\n# poucos pedidos acima de R$ 300\n→ assimetria à direita', fig: { type: 'hist', values: D.ticket, from: 0, bin: 60, xlab: 'Valor do pedido (R$)' } },
    ['Não confunda histograma (faixas contínuas) com gráfico de barras (categorias).', 'Amostra pequena gera histograma irregular.', 'Desconfie de picos em valores redondos: arredondamento na coleta.'],
    [['Um histograma com cauda longa para valores altos indica:', 'Assimetria à direita', 'Assimetria à esquerda', 'Simetria perfeita', 'Ausência de variação', 'A cauda aponta para a direita.'],
      ['Um histograma com dois picos sugere:', 'Dois grupos diferentes misturados', 'Dados perfeitamente normais', 'Erro no software', 'Média igual à moda', 'Separe por grupo.'],
      ['A diferença entre histograma e gráfico de barras é que o histograma:', 'Mostra faixas de uma variável numérica contínua', 'Mostra categorias nominais', 'Não tem eixo', 'Só serve para porcentagem', 'Barras encostadas, faixas contínuas.']]);

  lesson('outlier', 'Outliers', 'OUTLIER', 'Outliers: detectar e decidir',
    'Outlier é um valor muito distante dos demais. A regra do boxplot marca como suspeitos os valores abaixo de Q1 − 1,5·IQR ou acima de Q3 + 1,5·IQR. Antes de remover, investigue: pode ser erro de digitação (corrigir), um evento especial (registrar) ou um cliente real e importante (manter e analisar à parte).',
    'É como uma nota 100 numa turma em que todos tiraram entre 40 e 60: pode ser cola, erro de lançamento ou um aluno brilhante. Você investiga antes de apagar.',
    'IQR    = Q3 − Q1\nLimite inferior = Q1 − 1,5 × IQR\nLimite superior = Q3 + 1,5 × IQR\nDecisão → erro? corrigir · evento? registrar · real? manter e explicar',
    ['Nunca apague outliers só porque atrapalham a média.', 'Documente toda exclusão e o motivo.', 'A mediana e o IQR são robustos a outliers.'],
    { p: 'Pedidos do site acima do limite superior:', c: 'Q1 = ' + f(fe.q1, 2) + ' · Q3 = ' + f(fe.q3, 2) + ' · IQR = ' + f(fe.iqr, 2) + '\nLimite superior = ' + f(fe.q3, 2) + ' + 1,5 × ' + f(fe.iqr, 2) + ' = R$ ' + f(fe.hi, 2) + '\nOutliers: R$ 310, R$ 395 e R$ 520', fig: { type: 'box', groups: [{ n: 'Ticket', v: D.ticket }], unit: 'R$' } },
    ['Em fraudes e falhas, o outlier É a informação mais importante.', 'Em amostras pequenas, a regra marca poucos pontos.', 'Teste a análise com e sem o outlier e compare.'],
    [['Q1 = 10, Q3 = 20. O limite superior para outliers é:', '35', '30', '25', '40', '20 + 1,5 × 10.'],
      ['Ao achar um outlier, o primeiro passo é:', 'Investigar a origem do valor', 'Apagar imediatamente', 'Duplicá-lo', 'Trocar pela média', 'Erro, evento ou caso real?'],
      ['Qual medida é pouco afetada por outliers?', 'Mediana', 'Média', 'Amplitude', 'Variância', 'Depende só da posição central.']]);

  lesson('escorez', 'Escore Z', 'Z', 'Escore Z: comparando valores de escalas diferentes',
    'O escore Z diz a quantos desvios padrão um valor está da média: Z = (x − média) ÷ desvio. Z = 0 é exatamente a média; Z = 2 está dois desvios acima. Ele permite comparar coisas de escalas diferentes (vendas de lojas grandes e pequenas, notas de provas diferentes) e é a base para identificar valores incomuns (|Z| > 3).',
    'É converter moedas para uma referência comum: R$ 100 e US$ 100 só se comparam depois da conversão. O Z converte tudo para “desvios padrão”.',
    'Z = (x − x̄) ÷ s\nZ > 0 → acima da média\nZ < 0 → abaixo da média\n|Z| > 2 → incomum · |Z| > 3 → muito raro\nVolta para a escala original: x = x̄ + Z × s',
    ['Z positivo não é “bom” nem “ruim”: depende do indicador.', 'Comparar lojas pelo Z remove o efeito de tamanho e escala.', 'A interpretação por probabilidade vale bem para dados aproximadamente normais.'],
    { p: 'Duas lojas, metas diferentes:', c: 'Loja Centro: vendeu 520; média 400, desvio 60 → Z = 2,0\nLoja Bairro: vendeu 130; média 100, desvio 10 → Z = 3,0\n→ o resultado da Loja Bairro é mais excepcional', fig: { type: 'bell', mean: 0, sd: 1, lo: -2, hi: 2, d: 0, z: true, speech: 'Cerca de 95% dos valores ficam entre Z igual a menos 2 e mais 2.' } },
    ['Não compare valores brutos de escalas diferentes.', 'Z de amostra pequena oscila muito.', 'Dados muito assimétricos distorcem a leitura do Z.'],
    [['Média 50, desvio 5, valor 60. O Z é:', '2', '10', '0,5', '1,2', '(60 − 50) ÷ 5.'],
      ['Um valor com Z = −1,5 está:', '1,5 desvio abaixo da média', '1,5 desvio acima', 'Na média', 'Fora dos dados', 'Sinal negativo: abaixo.'],
      ['Para que serve o escore Z?', 'Comparar valores de escalas diferentes', 'Somar variáveis nominais', 'Calcular a moda', 'Ordenar categorias', 'Padroniza em desvios.']]);

  lesson('graficos', 'Escolha do gráfico', 'GRÁFICOS', 'O gráfico certo para cada pergunta',
    'O gráfico depende da pergunta. Comparar categorias: barras. Evolução no tempo: linha. Distribuição de um número: histograma ou boxplot. Relação entre dois números: dispersão. Partes de um todo com poucas categorias: barras empilhadas ou, com moderação, pizza. Um bom gráfico tem título que diz a conclusão, eixo começando em zero nas barras e nada de 3D.',
    'É escolher a ferramenta da caixa: martelo para prego, chave de fenda para parafuso. Usar pizza para série temporal é martelar parafuso.',
    'Comparar categorias → barras (ordenadas)\nTempo               → linha\nDistribuição        → histograma, boxplot\nRelação X × Y       → dispersão\nComposição          → barras empilhadas (pizza só com 2 a 4 fatias)\nTítulo              → a mensagem, não só o assunto',
    ['Ordene as barras do maior para o menor.', 'Eixo de barras começa em zero; o de linha pode não começar.', 'Uma cor de destaque para o que importa, o resto em cinza.'],
    { p: 'Vendas mensais (R$ mil): a pergunta é “como evoluíram?” → linha', c: '# 24 meses, de jan/24 a dez/25\n# título com a mensagem:\n"Vendas crescem ~16% ao ano, com pico em novembro e dezembro"', fig: { type: 'line', values: D.vendas, labels: D.meses, name: 'Vendas (R$ mil)', speech: 'A linha mostra a tendência de alta e os picos de fim de ano.' } },
    ['Barras com eixo cortado exageram diferenças.', 'Pizza com muitas fatias é ilegível.', 'Dois eixos verticais confundem; prefira dois gráficos.'],
    [['Para mostrar a evolução das vendas em 24 meses, o melhor gráfico é:', 'Linha', 'Pizza', 'Histograma', 'Dispersão', 'Tempo no eixo X.'],
      ['Para ver se investimento em mídia se relaciona com vendas:', 'Dispersão', 'Pizza', 'Barras empilhadas', 'Tabela de frequência', 'Duas variáveis numéricas.'],
      ['Um gráfico de barras com eixo começando em 90 (e não em 0):', 'Exagera visualmente as diferenças', 'É sempre recomendado', 'Não muda a leitura', 'Diminui as diferenças', 'Comprimento das barras deixa de ser proporcional.']]);

  lesson('nivel1', 'Desafio do nível', 'DESCRITIVA', 'Desafio do nível: o relatório descritivo',
    'Um relatório descritivo completo responde: quantos casos (n), qual o centro (média e mediana), quanto variam (desvio, IQR), como se distribuem (histograma), se há valores estranhos (outliers) e como os grupos se comparam (boxplots lado a lado). Tudo com gráfico adequado e uma conclusão clara.',
    'É o check-up anual: peso, pressão, exames de sangue. Nenhum número sozinho conta a história, mas juntos dão um retrato confiável.',
    '1. n e período dos dados\n2. Centro → média e mediana\n3. Dispersão → desvio padrão, IQR, CV\n4. Forma → histograma (simetria, picos)\n5. Outliers → regra do IQR + investigação\n6. Comparação → boxplot por grupo\n7. Conclusão → o que muda na decisão',
    ['Comece pelas perguntas de negócio, não pelas fórmulas.', 'Mostre poucos números, bem escolhidos.', 'Termine com a recomendação.'],
    { p: 'Resumo do ticket dos 30 pedidos do site:', c: 'n = 30 · média R$ ' + f(tk.mean, 2) + ' · mediana R$ ' + f(tk.median, 2) + '\ndesvio R$ ' + f(tk.sd, 2) + ' · IQR R$ ' + f(fe.iqr, 2) + '\n3 outliers acima de R$ ' + f(fe.hi, 2), fig: { type: 'table', cols: ['Medida', 'Valor'], rows: [['n', 30], ['Média', 'R$ ' + f(tk.mean, 2)], ['Mediana', 'R$ ' + f(tk.median, 2)], ['Desvio padrão', 'R$ ' + f(tk.sd, 2)], ['IQR', 'R$ ' + f(fe.iqr, 2)], ['Outliers', '3 pedidos']], speech: 'O resumo mostra média acima da mediana e três pedidos muito altos.' } },
    ['Não empilhe 20 indicadores sem conclusão.', 'Informe sempre o n.', 'Separe os grupos antes de tirar conclusões gerais.'],
    [['Num relatório descritivo, a primeira informação a dar é:', 'O tamanho da amostra (n) e o período', 'O valor-p', 'A reta de regressão', 'A previsão do próximo mês', 'Contexto antes dos números.'],
      ['Média R$ 153 e mediana R$ 121 sugerem destacar:', 'A mediana como valor típico, explicando a cauda', 'Só a média', 'Só a moda', 'Nenhuma das duas', 'Dados assimétricos.'],
      ['Para comparar o prazo de três regiões de uma vez, use:', 'Boxplots lado a lado', 'Uma pizza', 'Uma tabela sem ordenação', 'Só a média geral', 'Mostra centro e dispersão por grupo.']]);

  /* ================= NÍVEL 2 · PROBABILIDADE E INFERÊNCIA ================= */
  // ---- Etapa 2.1 · Probabilidade
  lesson('prob', 'Probabilidade básica', 'P(A)', 'Probabilidade: regras básicas',
    'Probabilidade mede a chance de um evento, de 0 (impossível) a 1 (certo). Com casos igualmente prováveis, P = favoráveis ÷ possíveis; com histórico, usa-se a frequência observada. Regras: complemento P(não A) = 1 − P(A); soma P(A ou B) = P(A) + P(B) − P(A e B); produto, para eventos independentes, P(A e B) = P(A) × P(B).',
    'É a previsão do tempo: “70% de chuva” não promete que vai chover, mas diz que, em dias como hoje, choveu em 7 de cada 10.',
    'P(A) = favoráveis ÷ possíveis (ou frequência histórica)\nComplemento  → P(não A) = 1 − P(A)\nOu (união)   → P(A) + P(B) − P(A e B)\nE (independentes) → P(A) × P(B)\n“Pelo menos um” → 1 − P(nenhum)',
    ['“Pelo menos um” quase sempre se resolve pelo complemento.', 'Mutuamente exclusivos: não acontecem juntos (P(A e B) = 0).', 'Independência precisa ser verificada, não suposta.'],
    { p: 'Atrasos na entrega: 8% dos pedidos atrasam (independentes):', c: 'P(não atrasar) = 1 − 0,08 = 0,92\nP(2 pedidos atrasarem) = 0,08 × 0,08 = 0,0064\nP(pelo menos 1 de 3 atrasar) = 1 − 0,92³ = ' + f((1 - Math.pow(0.92, 3)) * 100, 1) + '%', fig: { type: 'cards', items: [['Complemento', '1 − P(A): a chance de não acontecer.'], ['União', 'P(A) + P(B) − P(A e B).'], ['Interseção', 'P(A) × P(B), se independentes.'], ['Pelo menos um', '1 − P(nenhum).']], speech: 'Quatro regras resolvem a maioria dos problemas de probabilidade do dia a dia.' } },
    ['Não some probabilidades de eventos que podem ocorrer juntos sem descontar a interseção.', 'Eventos raros acontecem quando há muitas tentativas.', 'Probabilidade não tem memória: depois de 5 caras, a próxima moeda continua 50%.'],
    [['8% dos pedidos atrasam. A chance de um pedido NÃO atrasar é:', '92%', '8%', '84%', '100%', 'Complemento.'],
      ['P(A) = 0,3 e P(B) = 0,5, independentes. P(A e B) =', '0,15', '0,8', '0,2', '0,35', '0,3 × 0,5.'],
      ['A forma mais simples de calcular “pelo menos um” é:', '1 − P(nenhum)', 'Somar todas as probabilidades', 'Multiplicar por n', 'Usar a mediana', 'Complemento.']]);

  lesson('condicional', 'Probabilidade condicional', 'P(A|B)', 'Probabilidade condicional e tabelas cruzadas',
    'Probabilidade condicional é a chance de A sabendo que B aconteceu: P(A|B) = P(A e B) ÷ P(B). Na prática, é olhar só a linha (ou coluna) de B numa tabela cruzada. Se P(A|B) é diferente de P(A), os eventos são dependentes: saber B muda a chance de A.',
    'A chance de um carro ser vermelho é uma; a chance de ser vermelho sabendo que é uma Ferrari é bem maior. A condição muda o universo de referência.',
    'P(A|B) = P(A e B) ÷ P(B)\nTabela cruzada → dividir pela linha/coluna da condição\nIndependentes → P(A|B) = P(A)\nP(A|B) ≠ P(B|A)  (cuidado!)',
    ['Defina claramente qual é a condição (o “dado que”).', 'Tabela cruzada é a forma mais segura de calcular.', 'Confundir P(A|B) com P(B|A) é um erro comum e grave.'],
    { p: 'Satisfação por canal (' + f(1020, 0) + ' respostas):', c: 'P(insatisfeito) = 90 ÷ 1.020 = 8,8%\nP(insatisfeito | Site) = 40 ÷ 360 = 11,1%\nP(insatisfeito | App)  = 20 ÷ 400 = 5,0%\n→ satisfação depende do canal', fig: { type: 'table', cols: ['Canal', 'Satisfeito', 'Neutro', 'Insatisfeito', 'Total'], rows: [['App', 320, 60, 20, 400], ['Site', 250, 70, 40, 360], ['Loja', 180, 50, 30, 260], ['Total', 750, 180, 90, 1020]], tot: true, speech: 'No site, a insatisfação é mais que o dobro da do app.' } },
    ['Não use o total geral como denominador numa condicional.', 'Grupo pequeno gera condicional instável.', 'Dependência não prova causa.'],
    [['Na tabela, 40 dos 360 clientes do Site estão insatisfeitos. P(insatisfeito | Site) =', '11,1%', '4,4%', '40%', '8,8%', '40 ÷ 360.'],
      ['Se P(A|B) = P(A), os eventos A e B são:', 'Independentes', 'Mutuamente exclusivos', 'Dependentes', 'Complementares', 'B não muda a chance de A.'],
      ['P(A|B) e P(B|A) são:', 'Em geral diferentes', 'Sempre iguais', 'Sempre complementares', 'Sempre zero', 'Os denominadores mudam.']]);

  lesson('bayes', 'Teorema de Bayes', 'BAYES', 'Teorema de Bayes: atualizando a crença',
    'Bayes inverte a condicional: a partir de P(alerta | fraude), calcula P(fraude | alerta). P(A|B) = P(B|A) × P(A) ÷ P(B). O ponto-chave é a taxa-base: quando o evento é raro, mesmo um teste bom gera muitos falsos positivos. Montar uma tabela com 10.000 casos imaginários deixa a conta intuitiva.',
    'Um alarme de incêndio muito sensível toca com fumaça de torrada. Se incêndios são raríssimos, a maioria dos alarmes será torrada, mesmo com um bom detector.',
    'P(A|B) = P(B|A) × P(A) ÷ P(B)\nP(B) = P(B|A)·P(A) + P(B|não A)·P(não A)\nTaxa-base → P(A) antes da evidência\nMétodo prático → tabela com 10.000 casos',
    ['Sempre comece pela taxa-base.', 'Sensibilidade alta não garante alerta confiável se o evento é raro.', 'A tabela de casos evita erros de fórmula.'],
    { p: 'Antifraude: 1% dos pedidos é fraude; o modelo detecta 95% das fraudes e alerta 5% dos pedidos legítimos:', c: 'Em 10.000 pedidos: 100 fraudes → 95 alertas\n9.900 legítimos → 495 alertas falsos\nP(fraude | alerta) = 95 ÷ (95 + 495) = ' + f(95 / 590 * 100, 1) + '%', fig: { type: 'table', cols: ['', 'Alerta', 'Sem alerta', 'Total'], rows: [['Fraude', 95, 5, 100], ['Legítimo', 495, 9405, 9900], ['Total', 590, 9410, 10000]], tot: true, speech: 'Só 16% dos alertas são fraudes de verdade, porque fraudes são raras.' } },
    ['Não confunda “o modelo acerta 95%” com “95% dos alertas são fraude”.', 'Atualize a taxa-base quando o contexto muda.', 'Mostre o resultado em números de casos, não só em fórmulas.'],
    [['Num evento raro, um teste com 95% de sensibilidade pode ter:', 'Muitos falsos positivos', 'Nenhum falso positivo', '100% de precisão', 'Taxa-base alta', 'A taxa-base pesa.'],
      ['No Teorema de Bayes, P(A) antes da evidência é chamada de:', 'Taxa-base (probabilidade a priori)', 'Valor-p', 'Variância', 'Mediana', 'Ponto de partida.'],
      ['Com 590 alertas e 95 fraudes reais, a precisão do alerta é cerca de:', '16%', '95%', '5%', '59%', '95 ÷ 590.']]);

  lesson('esperado', 'Valor esperado', 'E[X]', 'Valor esperado e decisão',
    'Valor esperado é a média ponderada pelos resultados possíveis: E[X] = Σ valor × probabilidade. Ele diz quanto se ganha (ou perde) em média por decisão, repetida muitas vezes. É a base para comparar campanhas, garantias estendidas, seguros e políticas de frete.',
    'É o cálculo do cassino: cada aposta pode ganhar ou perder, mas o valor esperado garante que, em milhares de jogadas, a casa ganha.',
    'E[X] = Σ xᵢ × pᵢ\nDecisão → escolha a opção de maior valor esperado (com risco aceitável)\nRisco   → olhe também a dispersão dos resultados\nCusto esperado = custo × probabilidade',
    ['Probabilidades precisam somar 1.', 'Valor esperado é média de longo prazo, não garantia de cada caso.', 'Inclua custos e não só ganhos.'],
    { p: 'Cupom de R$ 20 para clientes inativos:', c: '30% voltam e compram (margem R$ 45 − cupom R$ 20 = R$ 25)\n70% não voltam (custo de envio R$ 1)\nE = 0,3 × 25 + 0,7 × (−1) = R$ ' + f(0.3 * 25 - 0.7, 2) + ' por cliente', fig: { type: 'bars', labels: ['Volta (30%)', 'Não volta (70%)'], series: [{ name: 'Resultado (R$)', values: [25, 1] }], speech: 'Mesmo com 70% de não retorno, o valor esperado do cupom é positivo.' } },
    ['Não ignore o cenário ruim só porque é menos provável.', 'Valor esperado positivo com perda máxima inaceitável pode ser má ideia.', 'Recalcule quando as probabilidades mudarem.'],
    [['Ganho de R$ 100 com 20% de chance e perda de R$ 10 com 80%. E[X] =', 'R$ 12', 'R$ 90', 'R$ 20', 'R$ −8', '0,2×100 − 0,8×10.'],
      ['O valor esperado representa:', 'A média de longo prazo das decisões repetidas', 'O resultado garantido de cada caso', 'O pior cenário', 'O valor mais provável', 'Média ponderada.'],
      ['Para calcular o valor esperado, as probabilidades devem:', 'Somar 1', 'Ser iguais', 'Somar 100 cada', 'Ser maiores que 0,5', 'Cobrem todos os resultados.']]);

  // ---- Etapa 2.2 · Distribuições
  lesson('binomial', 'Distribuição binomial', 'BINOMIAL', 'Distribuição binomial',
    'A binomial conta sucessos em n tentativas independentes com a mesma probabilidade p: quantos de 20 visitantes compram, quantos de 50 pedidos atrasam. P(X = k) = C(n,k) · pᵏ · (1 − p)ⁿ⁻ᵏ. Média = n·p e desvio = √(n·p·(1 − p)).',
    'É jogar a mesma moeda viciada n vezes e contar as caras. Cada lançamento é sim ou não, e a chance não muda de um para o outro.',
    'Condições → n fixo · sim/não · p constante · independência\nP(X = k) = C(n,k) · pᵏ · (1 − p)ⁿ⁻ᵏ\nMédia = n·p\nDesvio = √(n·p·(1 − p))\nExcel: DISTR.BINOM(k; n; p; FALSO)',
    ['“Pelo menos 1” = 1 − P(X = 0) = 1 − (1 − p)ⁿ.', 'Para P(X ≤ k), some as probabilidades de 0 a k.', 'Se p muda entre tentativas, não é binomial.'],
    { p: 'Conversão de 10% e 10 visitantes:', c: 'P(X = 0) = 0,9¹⁰ = ' + f(C.binom(10, 0, 0.1) * 100, 1) + '%\nP(X = 1) = ' + f(C.binom(10, 1, 0.1) * 100, 1) + '%\nP(X = 2) = ' + f(C.binom(10, 2, 0.1) * 100, 1) + '%\nMédia = 10 × 0,1 = 1 compra', fig: { type: 'bars', labels: ['0', '1', '2', '3', '4', '5+'], series: [{ name: 'P(X = k) em %', values: [0, 1, 2, 3, 4].map(function (k) { return r(C.binom(10, k, 0.1) * 100, 1); }).concat([r((1 - C.binomCdf(10, 4, 0.1)) * 100, 1)]) }], speech: 'Com 10 visitantes e 10% de conversão, o mais provável é zero ou uma compra.' } },
    ['Confira a independência: clientes da mesma empresa podem decidir juntos.', 'p deve vir de dados recentes.', 'Para n grande, a normal aproxima a binomial.'],
    [['Qual situação é binomial?', 'Quantos de 20 pedidos atrasam, com 5% de chance cada', 'Tempo de entrega em horas', 'Número de chamadas por hora sem limite', 'Altura dos clientes', 'n fixo, sim/não, p constante.'],
      ['n = 50 e p = 0,2. A média da binomial é:', '10', '2,5', '0,2', '40', 'n × p.'],
      ['P(pelo menos 1 sucesso em 5 tentativas com p = 0,1) =', '1 − 0,9⁵', '5 × 0,1', '0,1⁵', '0,9⁵', 'Complemento de nenhum.']]);

  lesson('poisson', 'Distribuição de Poisson', 'POISSON', 'Distribuição de Poisson',
    'A Poisson modela contagens de eventos num intervalo (tempo, área) quando acontecem de forma independente a uma taxa média λ: chamadas por minuto no SAC, pedidos por hora, falhas por dia. P(X = k) = e⁻λ · λᵏ ÷ k!. A média e a variância são iguais a λ.',
    'É contar gotas de chuva num azulejo por minuto: elas caem ao acaso, mas numa taxa média estável. Às vezes caem 2, às vezes 7.',
    'Uso → contagem de eventos por intervalo\nP(X = k) = e⁻λ · λᵏ ÷ k!\nMédia = variância = λ\nMudar o intervalo → ajustar λ (4/hora = 1 a cada 15 min)\nExcel: DIST.POISSON(k; λ; FALSO)',
    ['Ajuste λ ao intervalo da pergunta.', 'Se a variância é muito maior que a média, há sobredispersão (eventos em lote).', 'Útil para dimensionar equipe e estoque de segurança.'],
    { p: 'SAC recebe em média 3 chamadas a cada 5 minutos:', c: 'P(0) = ' + f(C.poisson(3, 0) * 100, 1) + '%\nP(até 2) = ' + f(C.poissonCdf(3, 2) * 100, 1) + '%\nP(mais de 5) = ' + f((1 - C.poissonCdf(3, 5)) * 100, 1) + '%', fig: { type: 'bars', labels: ['0', '1', '2', '3', '4', '5', '6', '7+'], series: [{ name: 'P(X = k) em %', values: [0, 1, 2, 3, 4, 5, 6].map(function (k) { return r(C.poisson(3, k) * 100, 1); }).concat([r((1 - C.poissonCdf(3, 6)) * 100, 1)]) }], speech: 'Com média de 3 chamadas, 2 e 3 são os resultados mais prováveis.' } },
    ['Não use Poisson se os eventos chegam em grupos.', 'Taxa média de horário de pico é diferente da madrugada.', 'Converta a unidade de tempo antes de calcular.'],
    [['Na Poisson, média e variância são:', 'Iguais a λ', 'Sempre 1', 'Média = λ e variância = λ²', 'Independentes de λ', 'Propriedade da distribuição.'],
      ['Média de 12 pedidos por hora. Para 15 minutos, λ =', '3', '12', '48', '0,25', '12 ÷ 4.'],
      ['Qual situação combina com Poisson?', 'Número de chamadas no SAC por minuto', 'Altura dos funcionários', 'Sim/não de 10 clientes', 'Tempo de entrega em dias', 'Contagem por intervalo.']]);

  lesson('normal', 'Distribuição normal', 'NORMAL', 'Distribuição normal e a regra 68-95-99,7',
    'A normal é a curva em sino, simétrica em torno da média, descrita por média (μ) e desvio (σ). Cerca de 68% dos valores ficam a 1σ da média, 95% a 2σ e 99,7% a 3σ. Para outras faixas, converta para Z e use a tabela ou a função DIST.NORM.',
    'É a altura das pessoas: a maioria perto da média, poucos muito baixos ou muito altos, e a curva cai igual dos dois lados.',
    'Parâmetros → μ (centro) e σ (largura)\n68% em μ ± 1σ · 95% em μ ± 2σ · 99,7% em μ ± 3σ\nP(X < x) → Z = (x − μ) ÷ σ → tabela\nExcel: DIST.NORM(x; μ; σ; VERDADEIRO)\nInversa: INV.NORM(p; μ; σ)',
    ['Verifique a forma com histograma antes de assumir normalidade.', 'Tempos e valores costumam ser assimétricos.', 'A regra 68-95-99,7 dá respostas rápidas sem tabela.'],
    { p: 'Tempo de separação: média 12 min, desvio 2 min:', c: 'P(10 a 14 min) = 68,3%\nP(8 a 16 min) = 95,4%\nP(mais de 16 min) = ' + f((1 - C.normBetween(12, 2, null, 16)) * 100, 1) + '%', fig: { type: 'bell', mean: 12, sd: 2, lo: 10, hi: 14, d: 0, unit: 'min' } },
    ['Não aplique a regra empírica em dados muito assimétricos.', 'Cauda pesada (eventos extremos frequentes) não é normal.', 'Arredonde Z com 2 casas para usar a tabela.'],
    [['Numa normal, cerca de 95% dos valores ficam:', 'A 2 desvios da média', 'A 1 desvio da média', 'Acima da média', 'A 3 desvios abaixo', 'Regra 68-95-99,7.'],
      ['Média 100, desvio 15. Qual faixa tem cerca de 68% dos casos?', '85 a 115', '70 a 130', '100 a 115', '55 a 145', 'μ ± 1σ.'],
      ['A distribuição normal é:', 'Simétrica em torno da média', 'Assimétrica à direita', 'Sempre entre 0 e 1', 'Discreta', 'Curva em sino.']]);

  lesson('tcl', 'Teorema central do limite', 'TCL', 'Distribuição amostral e o teorema central do limite',
    'Se tirarmos muitas amostras e calcularmos a média de cada uma, essas médias formam uma distribuição centrada na média verdadeira, com desvio σ ÷ √n (erro padrão). O teorema central do limite garante que, para n razoavelmente grande (em geral 30 ou mais), essa distribuição das médias é aproximadamente normal, mesmo que os dados originais não sejam.',
    'Um único dado de seis faces é plano: qualquer número é igualmente provável. Mas a média de 30 lançamentos quase sempre fica perto de 3,5, e o histograma dessas médias vira um sino.',
    'Erro padrão = σ ÷ √n\nMédias amostrais → centradas em μ\nn ≥ 30 → médias aproximadamente normais (TCL)\nQuadruplicar n → erro padrão cai pela metade',
    ['É o TCL que permite intervalos de confiança e testes com dados não normais.', 'Mais amostra reduz o erro padrão, mas com ganho decrescente (raiz de n).', 'Erro padrão (das médias) não é o desvio padrão (dos dados).'],
    { p: 'Ticket com desvio R$ ' + f(tk.sd, 0) + ':', c: 'n = 25  → erro padrão = ' + f(tk.sd, 0) + ' ÷ 5  = R$ ' + f(tk.sd / 5, 1) + '\nn = 100 → erro padrão = ' + f(tk.sd, 0) + ' ÷ 10 = R$ ' + f(tk.sd / 10, 1) + '\n# 4× mais amostra, metade do erro', fig: { type: 'bars', labels: ['n = 25', 'n = 100', 'n = 400'], series: [{ name: 'Erro padrão (R$)', values: [r(tk.sd / 5, 1), r(tk.sd / 10, 1), r(tk.sd / 20, 1)] }], speech: 'Cada vez que a amostra quadruplica, o erro padrão cai pela metade.' } },
    ['Não confunda distribuição dos dados com distribuição das médias.', 'Com dados muito assimétricos, use n maior.', 'Amostras precisam ser independentes.'],
    [['O erro padrão da média é:', 'σ ÷ √n', 'σ × n', 'σ²', 'n ÷ σ', 'Diminui com √n.'],
      ['Para cortar o erro padrão pela metade, a amostra precisa ser:', '4 vezes maior', '2 vezes maior', '8 vezes maior', '10% maior', '√4 = 2.'],
      ['O teorema central do limite diz que as médias amostrais:', 'Tendem a uma distribuição normal quando n cresce', 'São sempre iguais à média', 'Seguem a distribuição dos dados', 'Ficam mais dispersas com n', 'Base da inferência.']]);

  // ---- Etapa 2.3 · Estimação
  lesson('amostragem', 'Amostragem', 'AMOSTRAGEM', 'Planos de amostragem',
    'O plano de amostragem define como escolher quem entra na amostra. Aleatória simples: sorteio. Estratificada: sorteio dentro de grupos (região, canal) na proporção certa. Sistemática: um a cada k da lista. Por conglomerados: sorteia grupos inteiros (lojas). Amostras por conveniência são rápidas, mas enviesadas.',
    'Para provar um bolo de três camadas, você corta uma fatia de cima a baixo (estratificada). Comer só a cobertura (conveniência) não diz nada sobre o recheio.',
    'Aleatória simples → todos com a mesma chance\nEstratificada     → sorteio dentro de cada grupo\nSistemática       → 1 a cada k (cuidado com ciclos)\nConglomerados     → sorteia grupos inteiros\nConveniência      → quem está à mão (viés!)',
    ['Estratifique quando os grupos são diferentes entre si.', 'Sistemática falha se a lista tem padrão repetido.', 'Registre o plano para que outros possam repetir.'],
    { p: 'Pesquisa com 1.000 clientes, proporcional ao canal:', c: 'App 42% → 420 · Site 31% → 310\nMarketplace 19% → 190 · Loja 8% → 80\n# sorteio aleatório dentro de cada canal', fig: { type: 'bars', labels: D.canais.map(function (x) { return x[0]; }), series: [{ name: 'Amostra estratificada', values: [420, 310, 190, 80] }], speech: 'A amostra estratificada respeita a participação de cada canal.' } },
    ['Não pare a coleta “quando der”: defina o tamanho antes.', 'Taxa de resposta baixa cria viés de não resposta.', 'Conveniência serve para explorar, não para concluir.'],
    [['Sortear clientes dentro de cada região, na proporção de cada uma, é amostragem:', 'Estratificada', 'Por conveniência', 'Sistemática', 'Por conglomerados', 'Estratos = grupos.'],
      ['Entrevistar só quem passou na frente da loja numa tarde é amostragem:', 'Por conveniência', 'Aleatória simples', 'Estratificada', 'Sistemática', 'Quem está à mão.'],
      ['Escolher 1 a cada 50 notas fiscais da lista é amostragem:', 'Sistemática', 'Estratificada', 'Por conglomerados', 'Por conveniência', 'Intervalo fixo.']]);

  lesson('ic', 'Intervalo de confiança', 'IC', 'Intervalo de confiança da média',
    'Uma média de amostra é uma estimativa, não a verdade. O intervalo de confiança dá uma faixa plausível para a média real: x̄ ± t × s ÷ √n. Um IC de 95% significa que o método, repetido muitas vezes, captura a média verdadeira em 95% das vezes. Mais amostra ou menos variação deixam o intervalo mais estreito.',
    'É a pesca com rede: você não acerta o peixe com um arpão (um número exato), mas joga uma rede com tamanho calculado para pegar o peixe 95% das vezes.',
    'IC = x̄ ± t × s ÷ √n\nMargem de erro = t × s ÷ √n\nt (95%, n grande) ≈ 1,96 · com n pequeno, use t com n − 1 graus\nMais confiança → intervalo mais largo\nMais amostra   → intervalo mais estreito',
    ['Sempre informe o IC junto com a média.', 'Intervalos que se sobrepõem muito sugerem diferença incerta.', '95% é sobre o método, não “95% de chance” de um intervalo específico.'],
    { p: 'Prazo de entrega no Sul, amostra de 16 pedidos:', c: 'x̄ = ' + f(sul.mean, 3) + ' dias · s = ' + f(sul.sd, 3) + '\nt(15 gl, 95%) = ' + f(global.GQCharts.tInv(0.05, 15), 3) + '\nMargem = ' + f(ci.half, 3) + '\nIC 95% = ' + f(ci.lo, 2) + ' a ' + f(ci.hi, 2) + ' dias', fig: { type: 'bell', mean: sul.mean, sd: sul.sd / 4, lo: ci.lo, hi: ci.hi, d: 2, unit: 'dias', speech: 'O intervalo de confiança vai de ' + f(ci.lo, 2) + ' a ' + f(ci.hi, 2) + ' dias.' } },
    ['Não use o IC da média para prever um pedido individual.', 'Amostra enviesada gera IC estreito e errado.', 'Com n pequeno, use t, não 1,96.'],
    [['Para estreitar um IC sem perder confiança, deve-se:', 'Aumentar a amostra', 'Diminuir a amostra', 'Aumentar a confiança para 99%', 'Usar a mediana', 'n maior, margem menor.'],
      ['Média 50, margem de erro 3. O IC é:', '47 a 53', '50 a 53', '44 a 56', '47 a 50', 'x̄ ± margem.'],
      ['Passar de 95% para 99% de confiança deixa o intervalo:', 'Mais largo', 'Mais estreito', 'Igual', 'Sem margem', 'Mais certeza exige rede maior.']]);

  lesson('icprop', 'IC de proporção', 'IC p', 'Intervalo de confiança de proporções',
    'Para taxas (conversão, satisfação, intenção de voto), o IC é p̂ ± z × √(p̂(1 − p̂) ÷ n). É a famosa “margem de erro” das pesquisas. Com 95% de confiança, z = 1,96. A margem é maior quando p̂ está perto de 50% e diminui com a raiz de n.',
    'É a pesquisa eleitoral: “42% com margem de 3 pontos” quer dizer que o valor real está plausivelmente entre 39% e 45%.',
    'p̂ = sucessos ÷ n\nErro padrão = √(p̂ × (1 − p̂) ÷ n)\nIC 95% = p̂ ± 1,96 × erro padrão\nMaior margem → p̂ = 50%\nValidade → n·p̂ ≥ 10 e n·(1 − p̂) ≥ 10',
    ['Diferenças menores que a margem de erro não são conclusivas.', 'Margem de erro não cobre viés de seleção.', 'Informe n e a confiança junto da margem.'],
    { p: 'Checkout B: ' + D.ab.B[0] + ' compras em ' + f(D.ab.B[1], 0) + ' visitas:', c: 'p̂ = ' + f(D.ab.B[0] / D.ab.B[1] * 100, 1) + '%\nErro padrão = √(0,05 × 0,95 ÷ 5.000) = ' + f(Math.sqrt(0.05 * 0.95 / 5000) * 100, 2) + ' p.p.\nIC 95% = ' + f(C.ciProp(D.ab.B[0], D.ab.B[1]).lo * 100, 2) + '% a ' + f(C.ciProp(D.ab.B[0], D.ab.B[1]).hi * 100, 2) + '%', fig: { type: 'bell', mean: 5, sd: Math.sqrt(0.05 * 0.95 / 5000) * 100, lo: C.ciProp(D.ab.B[0], D.ab.B[1]).lo * 100, hi: C.ciProp(D.ab.B[0], D.ab.B[1]).hi * 100, d: 2, unit: '%', speech: 'A conversão real do checkout B fica, com 95% de confiança, entre 4,4% e 5,6%.' } },
    ['Percentual de amostra pequena engana: 3 em 5 = 60%, com margem enorme.', 'Use o mesmo n do denominador da taxa.', 'Para taxas muito baixas, prefira intervalos exatos.'],
    [['Uma pesquisa mostra 40% com margem de 3 p.p. O intervalo é:', '37% a 43%', '40% a 43%', '38,8% a 41,2%', '34% a 46%', 'p̂ ± margem.'],
      ['A margem de erro de uma proporção é maior quando p̂ está perto de:', '50%', '0%', '100%', '5%', 'p(1 − p) é máximo em 0,5.'],
      ['A margem de erro cobre:', 'Só o erro do sorteio aleatório', 'Também o viés de seleção', 'Erros de digitação', 'Perguntas mal feitas', 'Viés não entra na conta.']]);

  lesson('tamanho', 'Tamanho da amostra', 'n', 'Tamanho da amostra',
    'Antes de coletar, calcule quantos casos são necessários para a precisão desejada. Para médias: n = (z × σ ÷ E)²; para proporções: n = z² × p(1 − p) ÷ E², onde E é a margem de erro desejada. Sem informação sobre p, use 0,5 (o caso mais conservador). Sempre arredonde para cima.',
    'É calcular quantos convidados cabem na festa antes de comprar a comida: pouca comida (amostra) deixa a festa sem resposta; demais é desperdício.',
    'Média      → n = (z × σ ÷ E)²\nProporção  → n = z² × p(1 − p) ÷ E²\nz → 1,645 (90%) · 1,96 (95%) · 2,576 (99%)\nSem estimativa de p → use 0,5\nArredonde para cima e preveja perdas',
    ['Metade da margem de erro exige 4× mais amostra.', 'Some uma folga para quem não responder.', 'População grande não exige amostra proporcionalmente maior.'],
    { p: 'Pesquisa de satisfação com margem de 3 p.p. e 95%:', c: 'n = 1,96² × 0,5 × 0,5 ÷ 0,03²\nn = ' + f(C.nProp(0.5, 0.03), 0) + ' respostas\n# com 30% de resposta: enviar ~' + f(Math.ceil(C.nProp(0.5, 0.03) / 0.3), 0) + ' convites', fig: { type: 'bars', labels: ['±5 p.p.', '±3 p.p.', '±2 p.p.', '±1 p.p.'], series: [{ name: 'Amostra necessária', values: [C.nProp(0.5, 0.05), C.nProp(0.5, 0.03), C.nProp(0.5, 0.02), C.nProp(0.5, 0.01)] }], speech: 'Reduzir a margem de 3 para 1 ponto exige quase 10 mil respostas.' } },
    ['Não defina n “de cabeça”.', 'A margem é por grupo: se for comparar canais, cada canal precisa de n suficiente.', 'Amostra maior não corrige viés.'],
    [['Para estimar uma proporção sem saber nada sobre p, usa-se:', 'p = 0,5', 'p = 0', 'p = 1', 'p = 0,05', 'Caso mais conservador.'],
      ['Para cortar a margem de erro pela metade, n deve ser multiplicado por:', '4', '2', '8', '0,5', 'n depende de 1/E².'],
      ['Ao calcular o tamanho da amostra, o resultado deve ser:', 'Arredondado para cima', 'Arredondado para baixo', 'Dividido por 2', 'Truncado', 'Garantir a precisão.']]);

  /* ================ NÍVEL 3 · TESTES, MODELOS E PREVISÃO ================ */
  // ---- Etapa 3.1 · Testes de hipótese
  lesson('hipotese', 'Testes de hipótese', 'H0', 'Lógica do teste de hipótese e valor-p',
    'Um teste de hipótese verifica se uma diferença observada é grande demais para ser só acaso. H₀ (hipótese nula) diz “não há efeito”; H₁ diz “há efeito”. O valor-p é a chance de ver um resultado tão extremo se H₀ fosse verdade. Se p < α (em geral 0,05), rejeitamos H₀. Erro tipo I: ver efeito que não existe; erro tipo II: não ver um efeito real.',
    'É o julgamento: o réu é inocente até prova em contrário (H₀). O valor-p mede o quanto as provas seriam improváveis se ele fosse inocente. Absolvição não prova inocência, só falta de provas.',
    'H₀ → sem efeito / sem diferença\nH₁ → existe efeito\nα  → risco aceito de erro tipo I (0,05)\np < α → rejeita H₀ (resultado significativo)\np ≥ α → não rejeita H₀ (não prova que H₀ é verdade)\nErro tipo II → efeito real não detectado (falta de poder)',
    ['Defina H₀, H₁ e α antes de olhar os dados.', 'Significância estatística não é relevância prática: olhe o tamanho do efeito.', 'Repetir testes até dar p < 0,05 infla o erro tipo I.'],
    { p: 'Prazo médio do Sul é diferente da meta de 4 dias?', c: 'H₀: μ = 4 · H₁: μ ≠ 4\nx̄ = ' + f(sul.mean, 3) + ' · n = 16\nt = ' + f(C.t1(D.sul, 4).t, 2) + ' · valor-p = ' + f(C.t1(D.sul, 4).p, 4) + '\n→ p < 0,05: o prazo está acima da meta', fig: { type: 'cards', items: [['H₀', 'Não há diferença: μ = 4 dias.'], ['Valor-p', 'Chance de um resultado tão extremo se H₀ fosse verdade.'], ['Erro tipo I', 'Rejeitar H₀ verdadeira (alarme falso).'], ['Erro tipo II', 'Não rejeitar H₀ falsa (efeito perdido).']], speech: 'Valor-p pequeno indica que o acaso explica mal a diferença.' } },
    ['Valor-p não é a probabilidade de H₀ ser verdadeira.', 'Não “aceite” H₀: diga que não há evidência suficiente.', 'Amostras enormes tornam significativas diferenças irrelevantes.'],
    [['Com α = 0,05 e valor-p = 0,02, a decisão é:', 'Rejeitar H₀', 'Não rejeitar H₀', 'Aceitar H₀', 'Aumentar α', 'p < α.'],
      ['Erro tipo I é:', 'Rejeitar H₀ quando ela é verdadeira', 'Não rejeitar H₀ falsa', 'Usar a amostra errada', 'Calcular a média errada', 'Alarme falso.'],
      ['O valor-p representa:', 'A chance de um resultado tão extremo se H₀ fosse verdade', 'A chance de H₀ ser verdade', 'O tamanho do efeito', 'A confiança do intervalo', 'Definição correta.']]);

  lesson('testet', 'Teste t', 'TESTE t', 'Teste t: uma amostra, duas amostras e pareado',
    'O teste t compara médias. Uma amostra: a média é diferente de um valor de referência? Duas amostras independentes (Welch): grupos diferentes têm médias diferentes? Pareado: as mesmas unidades antes e depois mudaram? O pareado é mais poderoso quando cada pessoa ou loja é medida duas vezes, porque elimina a variação entre elas.',
    'Comparar o peso de dois grupos diferentes é uma coisa; pesar as mesmas pessoas antes e depois da dieta é outra, muito mais precisa: cada um é comparado consigo mesmo.',
    'Uma amostra → t = (x̄ − μ₀) ÷ (s ÷ √n)\nDuas amostras (Welch) → grupos independentes, variâncias diferentes\nPareado → diferenças de cada par, depois t de uma amostra\nExcel: TESTE.T(m1; m2; 2; tipo) → 1 pareado · 3 Welch',
    ['Pareado só quando as medidas são das mesmas unidades.', 'Welch é a escolha segura para dois grupos.', 'Com n pequeno, verifique se os dados não são muito assimétricos.'],
    { p: 'Ticket com frete grátis × frete pago (10 pedidos cada):', c: 'Grátis: média R$ ' + f(t2.ma, 1) + ' · Pago: média R$ ' + f(t2.mb, 1) + '\nDiferença = R$ ' + f(t2.diff, 1) + '\nt = ' + f(t2.t, 2) + ' · gl ≈ ' + f(t2.df, 1) + ' · valor-p = ' + f(t2.p, 4), fig: { type: 'box', groups: [{ n: 'Frete grátis', v: D.freteGratis }, { n: 'Frete pago', v: D.fretePago }], unit: 'R$' } },
    ['Não use pareado com grupos diferentes.', 'Diferença significativa não diz se o frete grátis compensa: faça a conta da margem.', 'Muitos testes t entre vários grupos → use ANOVA.'],
    [['Medir o tempo dos mesmos 8 separadores antes e depois do sistema pede o teste:', 't pareado', 't de duas amostras independentes', 'Qui-quadrado', 'ANOVA', 'Mesmas unidades duas vezes.'],
      ['Comparar o ticket de clientes do App com o de clientes do Site pede o teste:', 't de duas amostras (Welch)', 't pareado', 't de uma amostra', 'Poisson', 'Grupos independentes.'],
      ['Testar se o prazo médio difere da meta de 4 dias pede o teste:', 't de uma amostra', 't pareado', 'Qui-quadrado', 'Regressão', 'Média contra um valor de referência.']]);

  lesson('ab', 'Teste A/B', 'A/B', 'Testes A/B de conversão',
    'Num teste A/B, visitantes são sorteados entre duas versões (A e B) e as taxas de conversão são comparadas com um teste de duas proporções: z = (p₁ − p₂) ÷ √(p(1 − p)(1/n₁ + 1/n₂)), com p combinado. Defina antes a métrica, o tamanho da amostra e a duração; não pare o teste quando o resultado “ficar bonito”.',
    'É a degustação às cegas: as pessoas não sabem qual receita estão provando, e o sorteio garante que os grupos são parecidos. Assim, a diferença vem da receita.',
    'Sorteio → grupos comparáveis\np₁ = x₁ ÷ n₁ · p₂ = x₂ ÷ n₂\np combinado = (x₁ + x₂) ÷ (n₁ + n₂)\nz = (p₁ − p₂) ÷ √(p(1 − p)(1/n₁ + 1/n₂))\nDecisão → valor-p < 0,05 e ganho relevante para o negócio',
    ['Rode semanas completas para cobrir os dias da semana.', 'Olhar o resultado todo dia e parar no primeiro p < 0,05 gera falsos vencedores.', 'Uma métrica principal; as demais são de apoio.'],
    { p: 'Novo checkout (B) × atual (A), 5.000 visitas cada:', c: 'A: ' + D.ab.A[0] + ' compras → ' + f(ab.p2 * 100, 1) + '%\nB: ' + D.ab.B[0] + ' compras → ' + f(ab.p1 * 100, 1) + '%\nz = ' + f(ab.z, 2) + ' · valor-p = ' + f(ab.p, 4) + '\nGanho relativo = +' + f((ab.p1 / ab.p2 - 1) * 100, 0) + '%', fig: { type: 'bars', labels: ['Checkout A', 'Checkout B'], series: [{ name: 'Conversão (%)', values: [r(ab.p2 * 100, 1), r(ab.p1 * 100, 1)] }], speech: 'O checkout B converteu 5%, contra 4% do A, com valor-p de ' + f(ab.p, 3) + '.' } },
    ['Amostra pequena não detecta diferenças pequenas.', 'Não mude o teste no meio do caminho.', 'Testar muitas versões ao mesmo tempo exige correção do α.'],
    [['O sorteio dos visitantes entre A e B serve para:', 'Tornar os grupos comparáveis', 'Aumentar a conversão', 'Reduzir o número de visitas', 'Dispensar o teste estatístico', 'A diferença passa a ser da versão.'],
      ['A teve 4% e B teve 5% de conversão. O ganho relativo de B é:', '25%', '1%', '5%', '20%', '(5 − 4) ÷ 4.'],
      ['Parar o teste assim que o valor-p fica abaixo de 0,05 causa:', 'Mais falsos positivos', 'Mais poder', 'Menos erro tipo I', 'Nenhum problema', 'Espiar infla o erro.']]);

  lesson('quiquadrado', 'Qui-quadrado', 'χ²', 'Teste qui-quadrado de independência',
    'O qui-quadrado verifica se duas variáveis categóricas estão associadas, comparando a tabela observada com a esperada se fossem independentes. Esperado = total da linha × total da coluna ÷ total geral. χ² = Σ (observado − esperado)² ÷ esperado, com (linhas − 1)(colunas − 1) graus de liberdade.',
    'Se o canal não importasse, a satisfação seria distribuída igual em todos. O qui-quadrado mede o quanto a realidade se afasta desse mundo “sem efeito”.',
    'Esperado = total da linha × total da coluna ÷ total geral\nχ² = Σ (O − E)² ÷ E\ngl = (linhas − 1) × (colunas − 1)\np < 0,05 → variáveis associadas\nCondição → esperados ≥ 5 em cada célula',
    ['Use contagens, não percentuais.', 'Associação não indica qual célula: olhe os resíduos (O − E).', 'Categorias com pouca contagem podem ser agrupadas.'],
    { p: 'Satisfação × canal (App, Site, Loja):', c: 'Esperado (App, Satisfeito) = 400 × 750 ÷ 1.020 = ' + f(400 * 750 / 1020, 1) + '\nχ² = ' + f(ch.chi2, 2) + ' · gl = ' + ch.df + '\nvalor-p = ' + f(ch.p, 4) + ' → satisfação depende do canal', fig: { type: 'bars', labels: D.satisf.canais, series: D.satisf.cols.map(function (c, j) { return { name: c, values: D.satisf.tab.map(function (row) { const tot = row.reduce(function (a, b) { return a + b; }, 0); return r(row[j] / tot * 100, 1); }) }; }), title: '% de cada resposta por canal', speech: 'O site tem mais insatisfeitos que os outros canais, e o teste confirma a associação.' } },
    ['Não aplique a percentuais.', 'Células com esperado menor que 5 tornam o teste pouco confiável.', 'Associação não é causa.'],
    [['O qui-quadrado de independência compara:', 'Duas variáveis categóricas', 'Duas médias', 'Uma média e uma meta', 'Duas variâncias', 'Tabela cruzada.'],
      ['Numa tabela 3 × 3, os graus de liberdade são:', '4', '9', '6', '3', '(3 − 1)(3 − 1).'],
      ['A frequência esperada de uma célula é:', 'Total da linha × total da coluna ÷ total geral', 'A média da linha', 'O observado menos 5', 'O total geral ÷ 9', 'Independência.']]);

  // ---- Etapa 3.2 · Correlação e regressão
  lesson('anova', 'ANOVA', 'ANOVA', 'ANOVA: comparando três ou mais médias',
    'A ANOVA testa se pelo menos uma média é diferente entre três ou mais grupos, sem inflar o erro de fazer vários testes t. Ela compara a variação entre os grupos com a variação dentro deles: F = QM entre ÷ QM dentro. F grande (valor-p pequeno) indica diferença; depois, comparações par a par (ex.: Tukey) mostram quais grupos diferem.',
    'É um concurso de culinária com três chefs: se as notas de cada chef são consistentes (pouca variação dentro) e as médias dos chefs bem diferentes (muita variação entre), há um vencedor claro.',
    'H₀ → todas as médias iguais\nF = QM entre ÷ QM dentro\nQM = SQ ÷ graus de liberdade\ngl entre = k − 1 · gl dentro = N − k\np < 0,05 → pelo menos uma média difere → teste post-hoc',
    ['Três testes t a 5% dão chance bem maior que 5% de um falso positivo.', 'ANOVA diz “há diferença”, não “onde”.', 'Grupos com variâncias muito diferentes pedem a versão de Welch.'],
    { p: 'Tempo de atendimento do SAC por canal (8 atendimentos cada):', c: 'Médias: Chat ' + f(an.means[0], 2) + ' · Telefone ' + f(an.means[1], 2) + ' · E-mail ' + f(an.means[2], 2) + ' min\nF = ' + f(an.F, 2) + ' (gl ' + an.dfb + ' e ' + an.dfw + ') · valor-p < 0,001', fig: { type: 'box', groups: Object.keys(D.sac).map(function (k) { return { n: k, v: D.sac[k] }; }), unit: 'min' } },
    ['Não faça vários testes t no lugar da ANOVA.', 'Olhe os boxplots: a ANOVA resume, o gráfico explica.', 'Significância não diz o tamanho da diferença.'],
    [['Para comparar o prazo médio de 4 transportadoras, usa-se:', 'ANOVA', 'Teste t pareado', 'Qui-quadrado', 'Binomial', 'Três ou mais médias.'],
      ['Na ANOVA, F grande indica:', 'Variação entre grupos grande em relação à de dentro', 'Grupos iguais', 'Amostra pequena', 'Erro de cálculo', 'Razão entre as variações.'],
      ['Se a ANOVA dá p < 0,05, o próximo passo é:', 'Comparações par a par (post-hoc) para achar quais diferem', 'Concluir que todas diferem', 'Repetir com α = 0,10', 'Descartar os dados', 'ANOVA não diz onde.']]);

  lesson('correlacao', 'Correlação', 'r', 'Correlação (r de Pearson) e causalidade',
    'A correlação de Pearson (r) mede a força da relação linear entre duas variáveis numéricas, de −1 a +1. Perto de ±1: relação forte; perto de 0: fraca ou inexistente (linearmente). Correlação não é causalidade: uma terceira variável (confundidora) pode mover as duas, como o calor que aumenta sorvetes e afogamentos.',
    'Nas cidades com mais bombeiros há mais incêndios. Bombeiros não causam incêndios: cidades maiores têm mais dos dois. O tamanho da cidade é a terceira variável.',
    'r ∈ [−1, +1]\n|r| ≥ 0,7 forte · 0,4 a 0,7 moderada · < 0,4 fraca\nr > 0 → sobem juntas · r < 0 → uma sobe, outra desce\nr² → % da variação explicada pela relação linear\nExcel: CORREL(x; y)',
    ['Sempre olhe o gráfico de dispersão: r não vê curvas.', 'Um outlier pode criar ou esconder uma correlação.', 'Para afirmar causa, é preciso experimento ou desenho causal.'],
    { p: 'Investimento em mídia × vendas, 12 meses:', c: 'r = ' + f(rg.r, 3) + ' → forte e positiva\nr² = ' + f(rg.r2, 3) + '\n# mas dezembro tem mais mídia E mais demanda natural', fig: { type: 'scatter', pairs: D.midia, xlab: 'Mídia (R$ mil)', ylab: 'Vendas (R$ mil)' } },
    ['Não conclua causa só pela correlação.', 'r perto de 0 não significa “sem relação”: pode ser não linear.', 'Correlação entre médias de grupos exagera a força individual.'],
    [['r = −0,85 indica relação:', 'Forte e negativa', 'Fraca e negativa', 'Forte e positiva', 'Inexistente', 'Perto de −1.'],
      ['Vendas de sorvete e afogamentos são correlacionados. A explicação mais provável é:', 'Uma terceira variável (calor) afeta os dois', 'Sorvete causa afogamento', 'Afogamento causa vendas', 'Erro estatístico', 'Variável confundidora.'],
      ['r = 0,9 implica r² igual a:', '0,81', '0,9', '0,45', '0,95', '0,9².']]);

  lesson('regressao', 'Regressão linear', 'REGRESSÃO', 'Regressão linear simples',
    'A regressão linear ajusta a reta y = a + b·x que melhor descreve a relação entre uma variável explicativa (x) e uma resposta (y). O coeficiente b diz quanto y muda, em média, para cada unidade a mais de x; o R² mostra quanto da variação de y a reta explica. Serve para estimar e prever dentro da faixa observada.',
    'É a régua de bolso do gerente: “cada R$ 1 mil a mais de mídia traz uns R$ 6 mil a mais de vendas”, desde que você não saia da faixa em que a régua foi calibrada.',
    'y = a + b·x\nb (inclinação) = variação de y por unidade de x\na (intercepto) = y quando x = 0\nR² = % da variação de y explicada\nPrevisão → só dentro da faixa observada de x\nExcel: INCLINAÇÃO, INTERCEPÇÃO, PREVISÃO.LINEAR',
    ['Confira os resíduos: padrões indicam modelo inadequado.', 'Extrapolar muito além dos dados é arriscado.', 'Coeficiente relevante + R² alto ainda não garantem causa.'],
    { p: 'Vendas (R$ mil) em função da mídia (R$ mil):', c: 'Vendas = ' + f(rg.a, 2) + ' + ' + f(rg.b, 3) + ' × mídia\nR² = ' + f(rg.r2, 3) + '\nPrevisão para mídia de R$ 21 mil = ' + f(rg.a + rg.b * 21, 1) + ' mil', fig: { type: 'scatter', pairs: D.midia, xlab: 'Mídia (R$ mil)', ylab: 'Vendas (R$ mil)', eq: true } },
    ['Não preveja para x = 100 se os dados vão de 10 a 25.', 'Intercepto pode não ter sentido prático.', 'Um ponto extremo pode mudar a reta inteira.'],
    [['Na reta Vendas = 64 + 5,9 × Mídia, o 5,9 significa:', 'Cada R$ 1 mil de mídia adiciona, em média, R$ 5,9 mil em vendas', 'Vendas mínimas de R$ 5,9 mil', 'O R² do modelo', 'A correlação', 'Inclinação.'],
      ['R² = 0,96 indica que:', '96% da variação das vendas é explicada pela mídia no modelo', 'A mídia causa 96% das vendas', 'O erro é de 96%', 'A previsão acerta 96% das vezes', 'Variação explicada.'],
      ['Usar a reta para prever muito além da faixa observada é:', 'Extrapolação arriscada', 'Sempre seguro', 'Obrigatório', 'Interpolação', 'A relação pode mudar fora dos dados.']]);

  lesson('multipla', 'Regressão múltipla', 'MÚLTIPLA', 'Regressão múltipla',
    'A regressão múltipla usa várias variáveis explicativas ao mesmo tempo: y = b₀ + b₁x₁ + b₂x₂ + … Cada coeficiente mostra o efeito de uma variável mantendo as outras constantes. O R² ajustado penaliza variáveis inúteis e é melhor para comparar modelos. Variáveis explicativas muito correlacionadas entre si (multicolinearidade) deixam os coeficientes instáveis.',
    'É a receita do bolo: farinha, açúcar e ovos contribuem juntos. A regressão múltipla mede quanto cada ingrediente adiciona, fixando os outros.',
    'y = b₀ + b₁x₁ + b₂x₂\nbᵢ → efeito de xᵢ com as demais constantes\nR² ajustado → compara modelos com nº diferente de variáveis\nMulticolinearidade → x’s muito correlacionados entre si\nPrevisão → substitua os valores de cada x',
    ['Comece pelas variáveis que fazem sentido de negócio.', 'Mais variáveis sempre aumentam o R², não o R² ajustado.', 'Valide o modelo com dados que ele não viu.'],
    { p: 'Vendas (R$ mil) por mídia (R$ mil) e desconto (%), 10 semanas:', c: 'Vendas = ' + f(mr.b[0], 2) + ' + ' + f(mr.b[1], 2) + '·mídia + ' + f(mr.b[2], 2) + '·desconto\nR² = ' + f(mr.r2, 3) + ' · R² ajustado = ' + f(mr.r2adj, 3) + '\nPrevisão (mídia 20, desconto 8) = ' + f(mr.b[0] + mr.b[1] * 20 + mr.b[2] * 8, 1), fig: { type: 'table', cols: ['Termo', 'Coeficiente', 'Leitura'], rows: [['Intercepto', f(mr.b[0], 2), 'Base sem mídia e sem desconto'], ['Mídia', f(mr.b[1], 2), 'R$ mil a mais por R$ 1 mil de mídia'], ['Desconto', f(mr.b[2], 2), 'R$ mil a mais por ponto de desconto']], speech: 'Cada ponto de desconto adiciona cerca de ' + f(mr.b[2], 1) + ' mil em vendas, mantida a mídia.' } },
    ['Não interprete coeficientes isolados quando as variáveis andam juntas.', 'Muitas variáveis com poucos dados geram sobreajuste.', 'Coeficiente de desconto positivo não diz se o desconto dá lucro.'],
    [['Na regressão múltipla, o coeficiente de uma variável indica:', 'O efeito dela mantendo as outras constantes', 'A correlação simples com y', 'O R² do modelo', 'A média da variável', 'Efeito parcial.'],
      ['Para comparar modelos com números diferentes de variáveis, use:', 'R² ajustado', 'R² simples', 'A média de y', 'O intercepto', 'Penaliza variáveis inúteis.'],
      ['Variáveis explicativas muito correlacionadas entre si causam:', 'Multicolinearidade', 'Heterocedasticidade', 'Sazonalidade', 'Viés de seleção', 'Coeficientes instáveis.']]);

  // ---- Etapa 3.3 · Séries temporais e decisão
  lesson('series', 'Séries temporais', 'SÉRIES', 'Séries temporais: tendência e sazonalidade',
    'Uma série temporal é uma variável medida ao longo do tempo. Ela costuma combinar tendência (direção de longo prazo), sazonalidade (padrão que se repete no ano, mês ou semana) e ruído. Para comparar períodos com sazonalidade, use a variação contra o mesmo período do ano anterior (YoY), não contra o mês anterior.',
    'É a maré na praia: o nível do mar sobe e desce todo dia (sazonalidade), mas também pode estar subindo ao longo dos anos (tendência). Comparar a maré alta com a baixa não mostra a tendência.',
    'Tendência     → direção de longo prazo\nSazonalidade  → padrão que se repete (nov e dez fortes)\nRuído         → variação sem padrão\nYoY           → (mês deste ano − mesmo mês do ano anterior) ÷ anterior\nMoM           → contra o mês anterior (afetado pela sazonalidade)',
    ['Dezembro contra novembro mistura sazonalidade com tendência.', 'Olhe pelo menos dois anos para enxergar sazonalidade.', 'Mudanças de calendário (feriados, dias úteis) afetam a comparação.'],
    { p: 'Vendas mensais (R$ mil), 2024 e 2025:', c: 'Dez/25 contra dez/24 = (790 − 680) ÷ 680 = +' + f(C.growth(680, 790) * 100, 1) + '% (YoY)\nJan/25 contra dez/24 = ' + f(C.growth(680, 450) * 100, 1) + '% (MoM, efeito sazonal)', fig: { type: 'line', values: D.vendas, labels: D.meses, name: 'Vendas (R$ mil)', trend: true, speech: 'A tendência é de alta, com picos sazonais em novembro e dezembro.' } },
    ['Queda de janeiro não é crise: é sazonal.', 'Média anual esconde a sazonalidade.', 'Compare dias úteis equivalentes quando possível.'],
    [['Para avaliar dezembro sem o efeito sazonal, compare com:', 'Dezembro do ano anterior', 'Novembro do mesmo ano', 'Janeiro seguinte', 'A média de todos os meses', 'YoY.'],
      ['Vendas fortes todo novembro e dezembro são exemplo de:', 'Sazonalidade', 'Tendência', 'Ruído', 'Outlier', 'Padrão que se repete.'],
      ['Uma subida contínua ao longo de vários anos é:', 'Tendência', 'Sazonalidade', 'Ruído', 'Resíduo', 'Direção de longo prazo.']]);

  lesson('previsao', 'Médias móveis e previsão', 'MÉDIA MÓVEL', 'Médias móveis e previsão',
    'A média móvel suaviza a série tirando a média das últimas k observações; ela revela a tendência escondida pelo ruído. Métodos simples de previsão: ingênua (repete o último valor), média móvel, ingênua sazonal (repete o mesmo mês do ano anterior ajustado pelo crescimento) e tendência linear. Mede-se a qualidade com o erro médio, como o MAPE (erro percentual absoluto médio).',
    'É dirigir à noite com farol: você não vê a estrada inteira, mas o trecho iluminado (as últimas observações) dá uma boa ideia do que vem logo à frente.',
    'Média móvel(k) = média das últimas k observações\nIngênua           → próximo = último\nIngênua sazonal   → próximo = mesmo mês do ano anterior × (1 + crescimento)\nTendência linear  → reta sobre o tempo\nMAPE = média de |real − previsto| ÷ real',
    ['Janela maior suaviza mais, mas reage mais devagar.', 'Teste o método com o passado antes de usar no futuro.', 'Previsão sempre vem com faixa de incerteza.'],
    { p: 'Previsão de jan/26 pela ingênua sazonal:', c: 'jan/25 = 450 · crescimento anual ≈ ' + f(C.growth(680, 790) * 100, 1) + '%\nPrevisão jan/26 = 450 × ' + f(1 + C.growth(680, 790), 3) + ' = ' + f(450 * (1 + C.growth(680, 790)), 0) + '\nMédia móvel de 3 (out a dez/25) = ' + f(C.movAvg(D.vendas, 3).slice(-1)[0], 1), fig: { type: 'line', values: D.vendas, labels: D.meses.concat(['jan/26', 'fev/26']), name: 'Vendas (R$ mil)', ma: 3, fc: [r(450 * (1 + C.growth(680, 790)), 0), r(430 * (1 + C.growth(680, 790)), 0)], speech: 'A média móvel suaviza a série e a previsão sazonal projeta janeiro e fevereiro.' } },
    ['Média móvel de 3 meses em dezembro “prevê” janeiro alto demais: ignora a sazonalidade.', 'Não ajuste o modelo e meça o erro nos mesmos dados.', 'Revise a previsão quando o cenário mudar.'],
    [['A média móvel de 3 meses de 100, 120 e 140 é:', '120', '140', '360', '100', '(100 + 120 + 140) ÷ 3.'],
      ['A previsão ingênua sazonal para janeiro usa:', 'Janeiro do ano anterior, ajustado pelo crescimento', 'Dezembro deste ano', 'A média do ano', 'O maior mês', 'Mesmo período.'],
      ['O MAPE mede:', 'O erro percentual médio das previsões', 'A tendência', 'A sazonalidade', 'O valor-p', 'Qualidade da previsão.']]);

  lesson('armadilhas', 'Armadilhas estatísticas', 'ARMADILHAS', 'Armadilhas: Simpson, sobrevivência e regressão à média',
    'Alguns erros se repetem em análises de negócio. Paradoxo de Simpson: a tendência dos grupos se inverte quando eles são somados. Viés de sobrevivência: olhar só quem “sobreviveu” (clientes ativos, lojas abertas). Regressão à média: depois de um resultado extremo, o próximo tende a ser mais normal, mesmo sem intervenção. E o p-hacking: testar até achar algo significativo.',
    'Pilotos elogiados após um ótimo pouso costumam pousar pior na vez seguinte; os criticados após um péssimo, melhor. Não foi o elogio nem a bronca: foi a regressão à média.',
    'Simpson        → compare dentro dos grupos (mix diferente)\nSobrevivência  → inclua quem saiu, fechou ou cancelou\nRegressão à média → extremos tendem a voltar ao normal\np-hacking      → muitos testes, um “significativo” por acaso\nDefesa         → plano de análise antes, grupo de controle',
    ['Desconfie de melhora logo após o pior mês: pode ser só regressão à média.', 'Compare taxas dentro de segmentos com mix diferente.', 'Registre quantos testes foram feitos.'],
    { p: 'Paradoxo de Simpson na conversão de dois canais:', c: 'Novos:       Site 12% (120/1.000) · App 10% (20/200)\nRecorrentes: Site 35% (70/200) · App 33% (330/1.000)\nTotal:       Site 15,8% · App 29,2%\n# o Site é melhor nos dois grupos, mas perde no total: o App tem mais recorrentes', fig: { type: 'table', cols: ['Grupo', 'Site', 'App'], rows: [['Clientes novos', '12,0%', '10,0%'], ['Recorrentes', '35,0%', '33,0%'], ['Total', '15,8%', '29,2%']], tot: true, speech: 'O site converte melhor em cada grupo, mas o app parece melhor no total porque atende mais clientes recorrentes.' } },
    ['Não compare totais de grupos com composição diferente.', 'Lojas fechadas também contam na análise do passado.', 'Ação depois do pior resultado precisa de grupo de controle para provar efeito.'],
    [['A loja com o pior mês recebe treinamento e melhora no mês seguinte. Sem grupo de controle, a melhora pode ser:', 'Regressão à média', 'Paradoxo de Simpson', 'Sazonalidade inversa', 'Multicolinearidade', 'Extremos voltam ao normal.'],
      ['Analisar só os clientes que continuam ativos para entender a satisfação gera:', 'Viés de sobrevivência', 'Erro tipo II', 'Regressão à média', 'Autocorrelação', 'Quem saiu ficou de fora.'],
      ['Testar 20 métricas e divulgar só a que deu p < 0,05 é:', 'p-hacking', 'Boa prática', 'Estratificação', 'Validação cruzada', 'Um falso positivo é esperado em 20 testes.']]);

  lesson('final', 'Desafio final', 'DECISÃO', 'Desafio final: da pergunta à decisão',
    'Uma análise completa segue um roteiro: pergunta de negócio clara, dados e amostra adequados, análise descritiva, teste ou modelo certo para a pergunta, verificação das premissas, tamanho do efeito com intervalo de confiança e uma recomendação que considera custo, risco e incerteza.',
    'É o trabalho do detetive: pista (dados), hipótese, teste, e só então a conclusão, apresentada de forma que o júri entenda.',
    '1. Pergunta → o que vai mudar na decisão?\n2. Dados    → população, amostra, viés\n3. Descritiva → centro, dispersão, gráficos\n4. Inferência → IC, teste ou modelo adequado\n5. Premissas → independência, forma, tamanho\n6. Efeito   → tamanho + intervalo, não só valor-p\n7. Decisão  → custo, risco, recomendação',
    ['Escolha o método pela pergunta e pelo tipo de dado.', 'Comunique incerteza sem esconder a recomendação.', 'Plano de acompanhamento depois da decisão.'],
    { p: 'Qual teste para cada pergunta?', c: '2 médias independentes → t de Welch\nmesmas unidades antes/depois → t pareado\n3+ médias → ANOVA\n2 proporções → teste z (A/B)\n2 categóricas → qui-quadrado\nrelação numérica → correlação e regressão', fig: { type: 'table', cols: ['Pergunta', 'Dados', 'Método'], rows: [['Dois grupos diferem na média?', 'Numérico × 2 grupos', 't de Welch'], ['Mudou depois da ação?', 'Mesmas unidades', 't pareado'], ['Três ou mais grupos?', 'Numérico × k grupos', 'ANOVA'], ['Versão B converte mais?', 'Sim/não × 2 grupos', 'Teste de 2 proporções'], ['Canal e satisfação se relacionam?', 'Categórico × categórico', 'Qui-quadrado'], ['Quanto x influencia y?', 'Numérico × numérico', 'Regressão']], speech: 'O tipo de dado e a pergunta definem o teste.' } },
    ['Não escolha o teste pelo resultado que você quer.', 'Valor-p sem tamanho do efeito é meia resposta.', 'A decisão é do negócio; a estatística reduz a incerteza.'],
    [['Para saber se canal (App/Site/Loja) e satisfação estão associados, usa-se:', 'Qui-quadrado', 'Teste t pareado', 'Regressão linear', 'ANOVA', 'Duas variáveis categóricas.'],
      ['Além do valor-p, um bom relatório informa:', 'O tamanho do efeito com intervalo de confiança', 'Só o valor-p', 'O nome do software', 'A cor dos gráficos', 'Relevância prática.'],
      ['O primeiro passo de uma análise é:', 'Definir a pergunta de negócio', 'Rodar todos os testes possíveis', 'Escolher o gráfico', 'Calcular o valor-p', 'Tudo parte da pergunta.']]);

  /* ------------------------------ Pacote ------------------------------ */
  const COMPUTED = { pareto: 1, control: 1, hist: 1, scatter: 1, normal: 1, box: 1, bell: 1, line: 1, bars: 1 };
  function register() {
    if (!global.Lessons || !global.Lessons.registerPack) return;
    global.Lessons.registerPack('estatistica', {
      LESSONS: L, MAP: MAP, fallback: 'tipos', goalLabel: 'Sua missão',
      steps: ['Conceito', 'Passo a passo', 'Exemplo aplicado', 'Cuidados', 'Seu desafio'],
      syntaxTitle: 'Como se calcula',
      solution: function (ex) {
        const esc = global.UI.esc; let html = '';
        if (ex.kind === 'choice') html = '<p class="ls-ans">' + esc(ex.opts[0]) + '</p>';
        else if (ex.kind === 'multi') html = '<ul class="ls-anslist">' + ex.ok.map(function (i) { return '<li>' + esc(ex.opts[i]) + '</li>'; }).join('') + '</ul>';
        else if (ex.kind === 'order') html = '<ol class="ls-anslist num">' + ex.items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ol>';
        else if (ex.kind === 'classify') html = '<ul class="ls-anslist">' + ex.items.map(function (it) { return '<li><span>' + esc(it[0]) + '</span><b>' + esc(ex.cats[it[1]]) + '</b></li>'; }).join('') + '</ul>';
        else html = '<p class="ls-ans">' + esc((ex.unit === 'R$' ? 'R$ ' : '') + global.GQCharts.fmt(ex.a, ex.dec == null ? 2 : ex.dec) + (ex.unit && ex.unit !== 'R$' ? (ex.unit === '%' ? '%' : ' ' + ex.unit) : '')) + '</p>';
        return { label: 'Resposta', html: html, note: ex.x, speech: ex.x };
      }, syntaxSpeech: 'Agora, o passo a passo. Repare em como o cálculo é feito.', compareSpeech: 'Repare como os números viram uma decisão.',
      codeHtml: function (code) { return global.GQCharts.highlight(code); },
      example: function (les) {
        const out = global.GQCharts.render(Object.assign({ theme: 'estatistica' }, les.exemplo.fig));
        return { code: les.exemplo.c, badge: COMPUTED[les.exemplo.fig.type] ? 'Calculado agora com dados da NexusMarket' : 'Aplicado aos dados da NexusMarket', liveHtml: out.html, speech: out.speech };
      },
      tags: function (ex) {
        const K = { choice: ['target', 'Estudo de caso'], multi: ['check', 'Marque todas as corretas'], order: ['bars', 'Coloque em ordem'], classify: ['grid', 'Classifique os itens'], calc: ['code', 'Cálculo com dados reais'] }[ex.kind] || ['target', 'Caso'];
        return [{ icon: K[0], label: K[1] }].concat(ex.d ? [{ icon: 'bars', label: 'Com gráfico' }] : []);
      },
    });
  }
  register();
  global.ESLessons = { LESSONS: L, MAP: MAP };
})(typeof window !== 'undefined' ? window : globalThis);
