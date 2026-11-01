/* =====================================================================
   dax-lessons.js — Aulas e questões da trilha de Power BI (DAX)
   ---------------------------------------------------------------------
   Mesmo formato das outras trilhas: carrossel de 5 slides + narração.
   O exemplo do slide 3 é calculado ao vivo pelo DaxEngine no modelo da
   NexusMarket e mostrado como um visual de matriz.
   Questões de prova: [pergunta, correta, errada1, errada2, errada3, explicação]
   ===================================================================== */
(function (global) {
  'use strict';
  const L = {};
  function lesson(key, kw, titulo, ideia, analogia, sintaxe, notas, exemplo, cuidados, quiz) {
    L[key] = { key: key, kw: kw, titulo: titulo, ideia: ideia, analogia: analogia, sintaxe: sintaxe, notas: notas, exemplo: exemplo, cuidados: cuidados, quiz: quiz };
  }
  // exemplo: { p, f (DAX), rows, filters, fmt } ou { p, f, table (coluna calculada), show } ou { p, f, kind: 'table' }

  lesson('medidas', 'SUM', 'Medidas: o coração do Power BI',
    'Uma medida é um cálculo que resume dados e reage aos filtros do relatório. SUM(fVendas[Valor]) soma o valor das vendas que sobram depois dos filtros de cada linha do visual.',
    'É uma calculadora presa ao visual: cada célula aperta o botão de novo, só com os dados que a linha enxerga.',
    'Total Vendas = SUM(fVendas[Valor])\nQtd Vendida = SUM(fVendas[Qtd])\nCusto Total = SUM(fVendas[Custo])',
    ['Formato: Nome da medida = expressão.', 'Colunas são escritas como Tabela[Coluna]; medidas, só entre colchetes: [Total Vendas].'],
    { p: 'Total de vendas por categoria:', f: 'Total Vendas = SUM(fVendas[Valor])', rows: 'dProduto[Categoria]', fmt: 'money' },
    ['Medida não guarda resultado: ela recalcula para cada célula do visual.', 'Some colunas da tabela fato (fVendas), não da dimensão.', 'Dê nomes claros às medidas: elas aparecem para todo o time.'],
    [['O que acontece com uma medida quando o usuário filtra o relatório?', 'Ela é recalculada considerando o novo filtro', 'Ela mantém o valor calculado na carga', 'Ela gera uma nova coluna', 'Ela passa a ignorar o filtro', 'Medidas são avaliadas no contexto de filtro de cada célula.'],
      ['Qual a forma correta de referenciar uma coluna em DAX?', 'fVendas[Valor]', '[fVendas].Valor', 'fVendas.Valor', '"fVendas"[Valor]', 'Tabela[Coluna] é a sintaxe padrão.'],
      ['Como se referencia uma medida já existente?', '[Total Vendas]', 'Medidas[Total Vendas]', 'MEASURE(Total Vendas)', '{Total Vendas}', 'Medidas são escritas apenas entre colchetes.']]);

  lesson('agregacoes', 'COUNT', 'Agregações: média, mínimo, máximo e contagens',
    'Além de SUM, há AVERAGE, MIN, MAX, COUNT e COUNTROWS. DISTINCTCOUNT conta valores únicos, como clientes diferentes. Todas respeitam o contexto de filtro.',
    'É olhar a mesma pilha de notas fiscais e responder perguntas diferentes: quanto somou, qual a maior, quantas notas, quantos clientes.',
    'Pedidos = COUNTROWS(fVendas)\nClientes = DISTINCTCOUNT(fVendas[CodCliente])\nMaior Venda = MAX(fVendas[Valor])\nPreço Médio = AVERAGE(fVendas[Preço Unit])',
    ['COUNTROWS conta linhas de uma tabela; COUNT conta valores numéricos de uma coluna.', 'Sem linhas no contexto, as agregações devolvem BLANK (vazio), não zero.'],
    { p: 'Pedidos e clientes por loja (contagem de clientes):', f: 'Clientes = DISTINCTCOUNT(fVendas[CodCliente])', rows: 'dLoja[Loja]', fmt: 'int' },
    ['O total de DISTINCTCOUNT não é a soma das linhas: um cliente pode comprar em várias lojas.', 'AVERAGE ignora vazios.', 'Para pedidos, prefira COUNTROWS(fVendas) quando cada linha é um pedido.'],
    [['Qual função conta clientes sem repetir?', 'DISTINCTCOUNT', 'COUNTROWS', 'COUNT', 'SUM', 'DISTINCTCOUNT conta valores distintos.'],
      ['O que COUNTROWS(fVendas) devolve num contexto sem nenhuma venda?', 'BLANK (vazio)', '0', 'Erro', '1', 'Agregações sem linhas devolvem BLANK, por isso o visual oculta a linha.'],
      ['Por que o total de clientes distintos pode ser menor que a soma das lojas?', 'Porque o mesmo cliente comprou em mais de uma loja', 'Porque o total ignora filtros', 'Porque DISTINCTCOUNT arredonda', 'É um erro do visual', 'No total, cada cliente conta uma única vez.']]);

  lesson('divide', 'DIVIDE', 'Medidas que usam medidas e DIVIDE',
    'Medidas podem ser combinadas: Lucro = [Total Vendas] − [Custo Total]; Margem = DIVIDE([Lucro], [Total Vendas]). DIVIDE faz a divisão segura: se o denominador for zero ou vazio, devolve BLANK em vez de erro.',
    'É montar indicadores com blocos de Lego: uma vez criada, cada medida vira peça de outras.',
    'Lucro = [Total Vendas] - [Custo Total]\nMargem % = DIVIDE([Lucro], [Total Vendas])\nTicket Médio = DIVIDE([Total Vendas], [Pedidos])\nDIVIDE(numerador, denominador, [alternativo])',
    ['O 3º argumento de DIVIDE é o valor quando não dá para dividir.', 'ROUND(valor, casas) arredonda o resultado.'],
    { p: 'Margem % por categoria:', f: 'Margem % = DIVIDE([Lucro], [Total Vendas])', rows: 'dProduto[Categoria]', fmt: 'pct' },
    ['Evite o operador / com denominadores que podem ser zero.', 'Percentuais são números de 0 a 1: formate a medida como %.', 'A margem do total não é a média das margens das linhas: é recalculada.'],
    [['O que DIVIDE(10, 0) devolve?', 'BLANK', 'Erro de divisão por zero', '0', 'Infinito', 'DIVIDE trata a divisão por zero devolvendo BLANK (ou o alternativo).'],
      ['Como reaproveitar a medida Total Vendas dentro de outra?', 'Escrevendo [Total Vendas] na expressão', 'Copiando o código da medida sempre', 'Usando RELATED([Total Vendas])', 'Não é possível', 'Referenciar medidas evita repetir lógica.'],
      ['A margem % na linha Total é:', 'Recalculada com os totais de lucro e vendas', 'A média das margens das linhas', 'A soma das margens das linhas', 'Sempre vazia', 'Medidas são recalculadas em cada célula, inclusive no total.']]);

  lesson('colunas', 'COLUNA CALC.', 'Colunas calculadas e contexto de linha',
    'Uma coluna calculada é avaliada uma vez por linha da tabela e o resultado fica guardado no modelo. Nela existe contexto de linha: fVendas[Valor] é o valor da linha atual.',
    'É uma coluna nova escrita à mão em cada linha da planilha, só que com fórmula.',
    'Margem = fVendas[Valor] - fVendas[Custo]\nValor Bruto = fVendas[Qtd] * fVendas[Preço Unit]\nDias Entrega = fVendas[DataEntrega] - fVendas[Data]',
    ['Use colunas para classificar ou fatiar (aparecem em linhas, eixos, filtros).', 'Use medidas para resultados agregados que mudam com os filtros.'],
    { p: 'Margem de cada pedido (coluna em fVendas):', f: 'Margem = fVendas[Valor] - fVendas[Custo]', table: 'fVendas', show: ['Pedido', 'Valor', 'Custo'], fmt: 'money' },
    ['Colunas ocupam memória: não crie colunas que poderiam ser medidas.', 'Coluna calculada não reage a filtros: é calculada na atualização.', 'Numa medida, fVendas[Valor] sozinho dá erro: falta o contexto de linha.'],
    [['Quando uma coluna calculada é avaliada?', 'Na atualização do modelo, uma vez por linha', 'A cada clique no relatório', 'Só quando aparece num visual', 'Nunca', 'O resultado fica gravado no modelo.'],
      ['Por que fVendas[Valor] * 2 funciona numa coluna e falha numa medida?', 'Porque a coluna tem contexto de linha e a medida não', 'Porque medidas não aceitam multiplicação', 'Porque a medida exige RELATED', 'Funciona igual nos dois', 'Medidas precisam de agregação ou iterador.'],
      ['Qual é melhor como medida do que como coluna?', 'Total de vendas por mês', 'Faixa de preço de cada produto', 'Ano do pedido', 'Sigla da região', 'Totais que mudam com filtros são medidas.']]);

  lesson('related', 'RELATED', 'RELATED e relacionamentos',
    'O modelo é um esquema estrela: a fato fVendas se liga às dimensões dProduto, dCliente, dLoja e dCalendario. RELATED busca, a partir de uma linha da fato, um valor da dimensão relacionada.',
    'É o PROCV do Power BI, mas sem precisar dizer onde procurar: o relacionamento já sabe o caminho.',
    'Categoria = RELATED(dProduto[Categoria])\nCanal = RELATED(dLoja[Canal])\nSUMX(fVendas, fVendas[Qtd] * RELATED(dProduto[Custo Unit]))',
    ['RELATED vai do lado N (fato) para o lado 1 (dimensão).', 'Precisa de contexto de linha: coluna calculada ou iterador.'],
    { p: 'Categoria de cada venda (coluna em fVendas):', f: 'Categoria = RELATED(dProduto[Categoria])', table: 'fVendas', show: ['Pedido', 'CodProduto', 'Valor'] },
    ['Na direção contrária (dimensão → fato) use RELATEDTABLE.', 'Sem relacionamento ativo, RELATED não encontra o caminho.', 'Não traga para a fato colunas que já estão na dimensão sem necessidade.'],
    [['RELATED busca valores em qual direção?', 'Do lado N (fato) para o lado 1 (dimensão)', 'Do lado 1 para o lado N', 'Entre duas fatos', 'Em qualquer direção', 'Para o sentido contrário existe RELATEDTABLE.'],
      ['Onde RELATED pode ser usado?', 'Onde houver contexto de linha, como colunas calculadas e SUMX', 'Só em medidas sem iterador', 'Só em filtros do CALCULATE', 'Em qualquer lugar sem restrição', 'Ele lê a linha atual para seguir o relacionamento.'],
      ['Num esquema estrela, as tabelas de dimensão:', 'Descrevem os itens (produto, cliente, loja, data)', 'Guardam os valores das vendas', 'Não têm relacionamento', 'Substituem as medidas', 'As dimensões filtram a fato.']]);

  lesson('datascol', 'YEAR', 'Datas e FORMAT em colunas',
    'YEAR, MONTH, DAY e QUARTER extraem partes de uma data. FORMAT transforma a data em texto, como "jan/2026". Subtrair datas dá a diferença em dias.',
    'É etiquetar cada nota fiscal com o mês e o ano para depois agrupar.',
    'Ano Pedido = YEAR(fVendas[Data])\nMês Pedido = MONTH(fVendas[Data])\nPeríodo = FORMAT(fVendas[Data], "mmm/yyyy")\nDias Entrega = fVendas[DataEntrega] - fVendas[Data]',
    ['Formatos comuns: "dd/mm/yyyy", "mmm/yyyy", "mmmm", "yyyy".', 'Para análises por tempo, prefira as colunas da dCalendario.'],
    { p: 'Período em texto de cada venda:', f: 'Período = FORMAT(fVendas[Data], "mmm/yyyy")', table: 'fVendas', show: ['Pedido', 'Data'] },
    ['FORMAT devolve texto: ordena alfabeticamente (abr antes de jan).', 'Use "Classificar por coluna" no Power BI para ordenar meses.', 'Uma tabela calendário marcada habilita a inteligência de tempo.'],
    [['O que FORMAT(DATE(2026, 3, 5), "mmm/yyyy") devolve?', 'mar/2026', '03/2026', '05/03/2026', '2026-03', 'mmm é o mês abreviado e yyyy o ano com 4 dígitos.'],
      ['Por que meses em texto aparecem fora de ordem?', 'Porque texto é ordenado alfabeticamente', 'Porque FORMAT erra o mês', 'Porque o calendário está desligado', 'Não aparecem', 'Use uma coluna numérica para classificar.'],
      ['fVendas[DataEntrega] − fVendas[Data] devolve:', 'O número de dias entre as datas', 'Um texto', 'O mês da entrega', 'Um erro', 'Datas são números de dias.']]);

  lesson('logica', 'IF', 'IF e SWITCH',
    'IF testa uma condição e devolve um de dois resultados. SWITCH compara um valor com uma lista de opções. Os dois funcionam em colunas e em medidas.',
    'É a placa de bifurcação: se a condição for verdadeira, siga por um lado; senão, pelo outro.',
    'Faixa = IF(fVendas[Valor] >= 2000, "Alto", "Normal")\nSigla = SWITCH(dCliente[Região], "Sudeste", "SE", "Sul", "S", "N")\nStatus Meta = IF([Total Vendas] >= [Total Metas], "Batida", "Abaixo")',
    ['IF sem o 3º argumento devolve BLANK quando a condição é falsa.', 'No SWITCH, o último argumento sem par é o "senão".'],
    { p: 'Tipo de cliente (coluna em dCliente):', f: 'Tipo = IF(dCliente[Segmento] = "Corporativo", "B2B", "B2C")', table: 'dCliente', show: ['Cliente', 'Segmento'] },
    ['Comparações de texto no DAX não diferenciam maiúsculas.', 'Aninhar muitos IF fica ilegível: use SWITCH.', 'Numa medida, a condição deve usar medidas ou agregações.'],
    [['O que IF(condição, "A") devolve quando a condição é falsa?', 'BLANK', '"A"', 'FALSE', 'Erro', 'Sem o 3º argumento o resultado é vazio.'],
      ['Em SWITCH(x, "a", 1, "b", 2, 0), quando x = "c" o resultado é:', '0', '1', '2', 'BLANK', 'O último argumento sem par funciona como "senão".'],
      ['"casa" = "Casa" no DAX resulta em:', 'Verdadeiro', 'Falso', 'Erro', 'BLANK', 'Comparações de texto ignoram maiúsculas.']]);

  lesson('texto', 'TEXTO &', 'Funções de texto',
    'O & junta textos. LEFT, RIGHT e MID recortam partes; UPPER e LOWER mudam maiúsculas; LEN conta caracteres; SUBSTITUTE troca trechos.',
    'É montar etiquetas com pedaços de outras etiquetas.',
    'Rótulo = dProduto[Produto] & " (" & dProduto[Categoria] & ")"\nSigla Marca = UPPER(LEFT(dProduto[Marca], 3))\nSUBSTITUTE(texto, "antigo", "novo")',
    ['Números concatenados viram texto.', 'FORMAT controla como o número aparece no texto.'],
    { p: 'Sigla da marca (coluna em dProduto):', f: 'Sigla Marca = UPPER(LEFT(dProduto[Marca], 3))', table: 'dProduto', show: ['Produto', 'Marca'] },
    ['Colunas de texto longas pesam no modelo.', 'Para rótulos de visual, prefira medidas de texto com FORMAT.', 'Espaços extras atrapalham comparações: use TRIM.'],
    [['UPPER(LEFT("TecnoMax", 3)) resulta em:', 'TEC', 'Tec', 'MAX', 'TECNO', 'LEFT pega 3 caracteres e UPPER deixa em maiúsculas.'],
      ['Qual operador junta textos no DAX?', '&', '+', '||', ',', 'O & concatena, como no Excel.'],
      ['Qual função troca um trecho de texto por outro?', 'SUBSTITUTE', 'REPLACE', 'TRIM', 'FORMAT', 'SUBSTITUTE(texto, antigo, novo).']]);

  lesson('calculate', 'CALCULATE', 'CALCULATE: mudando o contexto de filtro',
    'CALCULATE avalia uma expressão num contexto de filtro modificado. Um filtro como dLoja[Canal] = "Online" substitui o filtro que existia nessa coluna e se soma aos demais filtros do visual.',
    'É ajustar os filtros do relatório por dentro da fórmula, só para aquela conta.',
    'Vendas Online = CALCULATE([Total Vendas], dLoja[Canal] = "Online")\nDevoluções = CALCULATE([Pedidos], fVendas[Status] = "Devolvido")\nCALCULATE(expressão, filtro1, filtro2, …)',
    ['Filtros separados por vírgula são combinados com E.', 'O filtro sobrescreve o filtro da mesma coluna que vinha do visual.'],
    { p: 'Vendas online por categoria:', f: 'Vendas Online = CALCULATE([Total Vendas], dLoja[Canal] = "Online")', rows: 'dProduto[Categoria]', fmt: 'money' },
    ['Filtros booleanos não podem usar medidas: use FILTER.', 'Um filtro booleano só pode usar colunas de uma tabela.', 'Para manter o filtro do visual e combinar, use KEEPFILTERS.'],
    [['O que CALCULATE faz?', 'Avalia uma expressão num contexto de filtro modificado', 'Cria uma coluna calculada', 'Ordena uma tabela', 'Converte texto em número', 'É a função mais importante do DAX.'],
      ['CALCULATE([Total Vendas], dProduto[Categoria] = "Casa") num visual por Categoria mostra:', 'O valor de Casa em todas as linhas', 'Só a linha Casa preenchida', 'Erro', 'O total geral', 'O filtro do CALCULATE substitui o filtro da linha na mesma coluna.'],
      ['Como combinar dois filtros no CALCULATE?', 'Separando-os por vírgula', 'Com o operador +', 'Usando dois CALCULATE sempre', 'Não é possível', 'Vários filtros funcionam como E.']]);

  lesson('calcmulti', 'IN / OR', 'Vários filtros, IN e percentuais',
    'Combine filtros no mesmo CALCULATE para cruzar condições. IN { … } aceita uma lista de valores. Dividindo um CALCULATE pela medida original, você obtém participações e taxas.',
    'É pedir ao relatório: "agora só Online e só 2026", sem mexer nos filtros da tela.',
    'CALCULATE([Total Vendas], dLoja[Canal] = "Online", dCalendario[Ano] = 2026)\nCALCULATE([Total Vendas], dCliente[Região] IN {"Sul", "Sudeste"})\nDIVIDE(CALCULATE([Pedidos], fVendas[Status] = "Devolvido"), [Pedidos])',
    ['Condições na mesma coluna com OU: use IN ou ||.', 'Taxas = parte ÷ todo, com DIVIDE.'],
    { p: 'Taxa de devolução por loja:', f: 'Taxa Devolução = DIVIDE(CALCULATE([Pedidos], fVendas[Status] = "Devolvido"), [Pedidos])', rows: 'dLoja[Loja]', fmt: 'pct' },
    ['Condições em tabelas diferentes viram filtros separados.', 'Um filtro de ano no CALCULATE ignora o filtro de ano da página.', 'Teste cada parte da divisão como medida separada.'],
    [['Como filtrar as regiões Sul e Sudeste ao mesmo tempo?', 'dCliente[Região] IN {"Sul", "Sudeste"}', 'dCliente[Região] = "Sul" && dCliente[Região] = "Sudeste"', 'dCliente[Região] = "Sul, Sudeste"', 'Não é possível', 'IN compara com uma lista de valores.'],
      ['A taxa de devolução é calculada como:', 'Pedidos devolvidos ÷ total de pedidos', 'Total de pedidos ÷ devolvidos', 'Devolvidos − total', 'Devolvidos × 100', 'Parte dividida pelo todo.'],
      ['Um CALCULATE com dCalendario[Ano] = 2026 numa página filtrada em 2025 mostra:', 'Os valores de 2026', 'Os valores de 2025', 'Vazio', 'A soma dos dois anos', 'O filtro do CALCULATE substitui o filtro de ano.']]);

  lesson('metas', 'METAS', 'Meta x realizado com duas tabelas fato',
    'O modelo tem duas fatos: fVendas e fMetas. As duas se ligam a dLoja e dCalendario, então um visual por loja ou por mês filtra as duas ao mesmo tempo. Basta comparar [Total Vendas] com [Total Metas].',
    'São dois cadernos (vendas e metas) com as mesmas abas (lojas e meses): ao abrir uma aba, você lê os dois cadernos na mesma página.',
    'Atingimento = DIVIDE([Total Vendas], [Total Metas])\nGap Meta = [Total Vendas] - [Total Metas]\nStatus Meta = IF([Total Vendas] >= [Total Metas], "Batida", "Abaixo")',
    ['Dimensões compartilhadas são o que permite comparar fatos diferentes.', 'A meta está por mês e loja; filtros de produto não chegam nela.'],
    { p: 'Atingimento da meta por loja em 2025:', f: 'Atingimento = DIVIDE([Total Vendas], [Total Metas])', rows: 'dLoja[Loja]', filters: { 'dCalendario[Ano]': 2025 }, fmt: 'pct' },
    ['Não relacione fVendas com fMetas diretamente: ligue as duas às dimensões.', 'Um filtro de categoria não muda a meta (ela não tem produto).', 'Defina o que é "meta batida" com o negócio antes de calcular.'],
    [['Por que um visual por loja filtra vendas e metas ao mesmo tempo?', 'Porque as duas fatos se relacionam com dLoja', 'Porque fVendas e fMetas estão relacionadas diretamente', 'Porque a meta é coluna da fVendas', 'Por acaso', 'Dimensões compartilhadas filtram várias fatos.'],
      ['Vendas de 90 mil com meta de 100 mil dão atingimento de:', '90%', '111%', '10%', '−10%', '90 ÷ 100 = 0,9.'],
      ['Um filtro de categoria de produto altera [Total Metas]?', 'Não, a fMetas não tem produto', 'Sim, sempre', 'Só no total', 'Só em 2026', 'O filtro não tem caminho até a fMetas.']]);

  lesson('blank', 'BLANK', 'BLANK, COALESCE e ISBLANK',
    'BLANK é o vazio do DAX. Agregações sem linhas devolvem BLANK e o visual esconde a linha. COALESCE devolve o primeiro valor não vazio; ISBLANK testa se algo é vazio.',
    'É a diferença entre "zero vendas" e "não há dado": o BLANK diz que não houve nada para medir.',
    'Vendas ou Zero = COALESCE([Total Vendas], 0)\nIF(ISBLANK([Total Vendas]), "Sem venda", "Com venda")\nBLANK() + 10 = 10',
    ['BLANK em soma vale 0; em multiplicação, o resultado continua BLANK.', 'Trocar BLANK por 0 faz o visual mostrar todas as linhas.'],
    { p: 'Vendas de 2026 com zero nos meses sem venda:', f: 'Vendas ou Zero = COALESCE([Total Vendas], 0)', rows: 'dCalendario[Mês Ano]', filters: { 'dCalendario[Ano]': 2026 }, fmt: 'money' },
    ['Zero em todas as combinações pode deixar visuais enormes e lentos.', 'Use COALESCE quando o negócio realmente precisa ver o zero.', 'DIVIDE já devolve BLANK em vez de erro.'],
    [['O que COALESCE([Total Vendas], 0) faz?', 'Mostra 0 quando não há vendas', 'Soma zero às vendas', 'Remove os zeros', 'Gera erro com vazio', 'Devolve o primeiro valor não vazio.'],
      ['BLANK() + 10 resulta em:', '10', 'BLANK', 'Erro', '0', 'Na soma, BLANK é tratado como zero.'],
      ['Por que o visual oculta algumas linhas?', 'Porque a medida devolveu BLANK nelas', 'Porque o valor é negativo', 'Por limite de linhas', 'Por erro de relacionamento', 'Linhas totalmente vazias não aparecem.']]);

  lesson('all', 'ALL', 'ALL e REMOVEFILTERS: percentual do total',
    'Dentro do CALCULATE, ALL(Tabela) remove os filtros daquela tabela. Assim o denominador vira o total geral e você calcula a participação de cada linha.',
    'É dar um passo para trás e olhar a foto inteira, mesmo estando numa linha específica.',
    '% Vendas = DIVIDE([Total Vendas], CALCULATE([Total Vendas], ALL(dProduto)))\nCALCULATE([Total Vendas], REMOVEFILTERS(dLoja))\nALL(dProduto[Produto])  ← remove só uma coluna',
    ['REMOVEFILTERS é o mesmo que ALL dentro do CALCULATE, com nome mais claro.', 'ALL(Tabela[Coluna]) remove o filtro só daquela coluna.'],
    { p: '% de cada categoria no total:', f: '% Vendas = DIVIDE([Total Vendas], CALCULATE([Total Vendas], ALL(dProduto)))', rows: 'dProduto[Categoria]', fmt: 'pct' },
    ['ALL remove também os filtros da página daquela tabela.', 'Escolha a tabela certa: ALL(dLoja) não afeta filtros de produto.', 'Para manter filtros da página, use ALLSELECTED.'],
    [['Para que serve ALL dentro do CALCULATE?', 'Para remover filtros de uma tabela ou coluna', 'Para somar todas as colunas', 'Para mostrar todas as linhas do visual', 'Para criar uma tabela nova', 'ALL é um modificador de filtro.'],
      ['Em % do total, o denominador deve ser:', 'O total sem o filtro da linha', 'A própria medida da linha', 'Sempre 100', 'O número de linhas', 'Por isso usamos CALCULATE com ALL.'],
      ['Qual a diferença entre ALL(dProduto) e ALL(dProduto[Produto])?', 'O segundo remove filtro só da coluna Produto', 'Nenhuma', 'O primeiro só funciona em colunas', 'O segundo remove filtros de todas as tabelas', 'ALL de coluna é mais específico.']]);

  lesson('allexcept', 'ALLEXCEPT', 'ALLEXCEPT e ALLSELECTED',
    'ALLEXCEPT(Tabela, Coluna) remove os filtros da tabela, menos os da coluna informada: ótimo para "% dentro da categoria". ALLSELECTED remove o filtro das linhas do visual, mas respeita os filtros da página e dos segmentadores.',
    'ALLEXCEPT é limpar a mesa e deixar só um papel; ALLSELECTED é considerar apenas o que o usuário escolheu no filtro.',
    'CALCULATE([Total Vendas], ALLEXCEPT(dProduto, dProduto[Categoria]))\nDIVIDE([Total Vendas], CALCULATE([Total Vendas], ALLSELECTED(dLoja)))',
    ['ALLSELECTED soma 100% dentro do que está selecionado.', 'ALL ignoraria também o filtro da página.'],
    { p: '% de cada loja dentro do canal Online (filtro da página):', f: '% Selecionado = DIVIDE([Total Vendas], CALCULATE([Total Vendas], ALLSELECTED(dLoja)))', rows: 'dLoja[Loja]', filters: { 'dLoja[Canal]': 'Online' }, fmt: 'pct' },
    ['ALLSELECTED depende do visual: teste com filtros diferentes.', 'ALLEXCEPT mantém só os filtros das colunas listadas daquela tabela.', 'Em matrizes com hierarquia, ALLEXCEPT é a base do "% do pai".'],
    [['ALLSELECTED(dLoja) dentro do CALCULATE:', 'Remove o filtro das linhas do visual e mantém os da página', 'Remove todos os filtros do relatório', 'Mantém só o filtro da linha', 'Seleciona a primeira loja', 'Ele respeita o que o usuário filtrou.'],
      ['Para o % de cada produto dentro da sua categoria, use:', 'ALLEXCEPT(dProduto, dProduto[Categoria])', 'ALL(dCalendario)', 'KEEPFILTERS(dProduto)', 'VALUES(dProduto[Produto])', 'O denominador mantém só a categoria.'],
      ['Com a página filtrada em Online, ALL(dLoja) no denominador daria:', 'O total de todas as lojas, inclusive físicas', 'O total só do online', 'Erro', 'BLANK', 'ALL ignora também o filtro da página.']]);

  lesson('filter', 'FILTER', 'FILTER: filtros com condição livre',
    'FILTER(Tabela, condição) devolve as linhas que atendem à condição, avaliada linha a linha. Pode usar medidas, comparações entre colunas e combinações que um filtro simples não aceita.',
    'É uma peneira: as linhas passam uma a uma e só ficam as que cabem no critério.',
    'CALCULATE([Total Vendas], FILTER(fVendas, fVendas[Valor] >= 3000))\nCOUNTROWS(FILTER(dCliente, [Total Vendas] > 15000))\nFILTER(VALUES(dProduto[Produto]), [Total Vendas] > 10000)',
    ['Dentro do FILTER há contexto de linha; medidas fazem transição de contexto.', 'Prefira filtrar dimensões ou VALUES em vez da fato inteira.'],
    { p: 'Clientes que passaram de R$ 15.000 em cada ano:', f: 'Clientes VIP = COUNTROWS(FILTER(dCliente, [Total Vendas] > 15000))', rows: 'dCalendario[Ano]', fmt: 'int' },
    ['FILTER sobre a fato inteira pode ser lento em modelos grandes.', 'Condições com medidas exigem FILTER (não funcionam como filtro booleano).', 'COUNTROWS(FILTER(...)) é o jeito de contar itens que atendem a uma condição.'],
    [['Como contar clientes com vendas acima de R$ 15.000?', 'COUNTROWS(FILTER(dCliente, [Total Vendas] > 15000))', 'CALCULATE(COUNT(dCliente), [Total Vendas] > 15000)', 'COUNTIF(dCliente, ">15000")', 'FILTER([Total Vendas] > 15000)', 'FILTER avalia a medida para cada cliente.'],
      ['Por que [Total Vendas] dentro do FILTER(dCliente, …) muda a cada linha?', 'Pela transição de contexto: a linha vira filtro', 'Porque FILTER ignora filtros', 'Porque é uma coluna', 'Não muda', 'Medidas convertem o contexto de linha em filtro.'],
      ['FILTER devolve:', 'Uma tabela', 'Um número', 'Um texto', 'Uma medida', 'Por isso é usado dentro de CALCULATE, COUNTROWS ou iteradores.']]);

  lesson('iteradores', 'SUMX', 'Iteradores: SUMX e AVERAGEX',
    'Funções terminadas em X percorrem uma tabela linha a linha, calculam uma expressão e agregam o resultado. SUMX(fVendas, fVendas[Qtd] * fVendas[Preço Unit]) multiplica em cada linha e soma tudo.',
    'É conferir nota por nota com a calculadora e só no fim somar os resultados.',
    'SUMX(fVendas, fVendas[Qtd] * fVendas[Preço Unit])\nSUMX(fVendas, fVendas[Qtd] * RELATED(dProduto[Custo Unit]))\nAVERAGEX(VALUES(dCliente[Cliente]), [Total Vendas])',
    ['Dentro do X existe contexto de linha (pode usar RELATED).', 'Iterar sobre VALUES de uma coluna dá médias "por item" (por cliente, por mês).'],
    { p: 'Faturamento bruto (antes do desconto) por categoria:', f: 'Faturamento Bruto = SUMX(fVendas, fVendas[Qtd] * fVendas[Preço Unit])', rows: 'dProduto[Categoria]', fmt: 'money' },
    ['SUM(a) * SUM(b) é diferente de SUMX(a * b).', 'Média por cliente (AVERAGEX) é diferente da média por pedido (AVERAGE).', 'Iteradores sobre tabelas enormes custam processamento.'],
    [['Por que SUMX é necessário para Qtd × Preço?', 'Porque a multiplicação precisa ser feita linha a linha', 'Porque SUM não soma números', 'Porque SUMX é mais curto', 'Não é necessário', 'Multiplicar os totais daria outro resultado.'],
      ['AVERAGEX(VALUES(dCliente[Cliente]), [Total Vendas]) calcula:', 'A média de vendas por cliente', 'A média de vendas por pedido', 'O total de clientes', 'O maior cliente', 'Itera sobre clientes e tira a média da medida.'],
      ['Dentro de SUMX(fVendas, …) é possível usar RELATED?', 'Sim, há contexto de linha da fVendas', 'Não, nunca', 'Só com CALCULATE', 'Só em colunas', 'O iterador cria o contexto de linha.']]);

  lesson('iteragg', 'MAXX', 'MAXX, MINX e médias por período',
    'Iterando sobre VALUES(dCalendario[Mês Ano]) você calcula a medida mês a mês e pega o maior (MAXX), o menor (MINX) ou a média (AVERAGEX). É assim que se acha o melhor mês ou a média mensal.',
    'É colocar os boletins de cada mês lado a lado e escolher o melhor.',
    'Melhor Mês = MAXX(VALUES(dCalendario[Mês Ano]), [Total Vendas])\nPior Mês = MINX(VALUES(dCalendario[Mês Ano]), [Total Vendas])\nMédia Mensal = AVERAGEX(VALUES(dCalendario[Mês Ano]), [Total Vendas])',
    ['VALUES devolve os meses visíveis no contexto atual.', 'Meses sem venda (BLANK) não entram na média.'],
    { p: 'Faturamento do melhor mês de cada ano:', f: 'Melhor Mês = MAXX(VALUES(dCalendario[Mês Ano]), [Total Vendas])', rows: 'dCalendario[Ano]', fmt: 'money' },
    ['MAXX devolve o valor; para o nome do mês, combine com FILTER ou TOPN.', 'A média mensal de um ano incompleto considera só os meses com venda.', 'Confira o resultado com um visual por mês.'],
    [['Como achar o faturamento do melhor mês?', 'MAXX(VALUES(dCalendario[Mês Ano]), [Total Vendas])', 'MAX([Total Vendas])', 'MAX(dCalendario[Mês Ano])', 'TOPN([Total Vendas])', 'MAX não aceita medida; MAXX itera pelos meses.'],
      ['Na média mensal com AVERAGEX, meses sem venda:', 'Ficam fora da média (BLANK)', 'Contam como zero', 'Geram erro', 'Dobram o valor', 'Agregações ignoram BLANK.'],
      ['Qual a diferença entre MAX e MAXX?', 'MAXX avalia uma expressão linha a linha', 'MAXX é mais antigo', 'MAX só funciona com texto', 'Nenhuma', 'MAX lê uma coluna; MAXX calcula antes de comparar.']]);

  lesson('values', 'VALUES', 'VALUES, SELECTEDVALUE e HASONEVALUE',
    'VALUES(Coluna) devolve os valores visíveis no contexto. SELECTEDVALUE devolve o valor quando há só um (ou um alternativo). HASONEVALUE testa se há um único valor, útil para tratar a linha de total.',
    'É perguntar ao visual: "quem está selecionado agora?".',
    'COUNTROWS(VALUES(fVendas[CodLoja]))\nSELECTEDVALUE(dProduto[Categoria], "Várias")\nIF(HASONEVALUE(dLoja[Loja]), [Total Vendas])',
    ['Na linha de total há vários valores: SELECTEDVALUE devolve o alternativo.', 'COUNTROWS(VALUES(...)) conta itens distintos visíveis.'],
    { p: 'Categoria em contexto (texto) por linha:', f: 'Categoria Atual = SELECTEDVALUE(dProduto[Categoria], "Várias")', rows: 'dProduto[Categoria]' },
    ['VALUES usado como valor único falha se houver vários valores.', 'Para títulos dinâmicos, SELECTEDVALUE é o padrão.', 'HASONEVALUE ajuda a esconder totais que não fazem sentido.'],
    [['O que SELECTEDVALUE(dLoja[Loja], "Todas") devolve na linha de total?', '"Todas"', 'A primeira loja', 'BLANK sempre', 'Erro', 'No total há várias lojas, então vale o alternativo.'],
      ['Para deixar a medida vazia no total, use:', 'IF(HASONEVALUE(dLoja[Loja]), [Total Vendas])', 'ALL(dLoja)', 'SUMX(dLoja, 0)', 'BLANK([Total Vendas])', 'Só calcula quando há uma loja no contexto.'],
      ['COUNTROWS(VALUES(fVendas[CodLoja])) conta:', 'Lojas distintas com venda no contexto', 'Pedidos', 'Todas as lojas do cadastro', 'Clientes', 'VALUES devolve os códigos distintos visíveis.']]);

  lesson('var', 'VAR', 'Variáveis: VAR e RETURN',
    'VAR guarda um resultado com nome e RETURN devolve o cálculo final. Variáveis deixam a medida legível e evitam recalcular a mesma expressão. Uma variável é calculada uma vez, no contexto onde foi declarada.',
    'São os rascunhos com nome antes da resposta final na prova.',
    'Margem = \nVAR vendas = [Total Vendas]\nVAR custo = [Custo Total]\nRETURN DIVIDE(vendas - custo, vendas)',
    ['Variáveis podem guardar números, textos ou tabelas.', 'Depois de calculada, a variável não muda, nem dentro de um CALCULATE.'],
    { p: 'Margem % com variáveis:', f: 'Margem VAR = VAR vendas = [Total Vendas] VAR custo = [Custo Total] RETURN DIVIDE(vendas - custo, vendas)', rows: 'dProduto[Categoria]', fmt: 'pct' },
    ['CALCULATE(v, …) com v sendo variável não recalcula v: a variável já é um valor.', 'Use nomes curtos e claros.', 'Variáveis ajudam a depurar: retorne uma variável por vez para testar.'],
    [['O que RETURN faz?', 'Define o resultado final da expressão', 'Volta ao filtro anterior', 'Cria uma nova medida', 'Encerra o relatório', 'Tudo antes dele são variáveis.'],
      ['VAR v = [Total Vendas] RETURN CALCULATE(v, dLoja[Canal] = "Online") devolve:', 'O mesmo valor de v, sem o filtro de Online', 'As vendas online', 'Erro', 'BLANK', 'A variável já foi calculada; o CALCULATE não a altera.'],
      ['Uma vantagem das variáveis é:', 'Legibilidade e evitar recálculo', 'Ignorar filtros', 'Criar relacionamentos', 'Deixar o modelo menor', 'O cálculo é feito uma vez e reutilizado.']]);

  lesson('switchtrue', 'SWITCH', 'SWITCH(TRUE()) para faixas',
    'SWITCH(TRUE(), condição1, resultado1, condição2, resultado2, senão) testa as condições em ordem e devolve o resultado da primeira verdadeira. É a forma limpa de criar faixas em medidas.',
    'É uma escada: você para no primeiro degrau que atende ao critério.',
    'Faixa Cliente = SWITCH(TRUE(),\n    [Total Vendas] >= 50000, "Ouro",\n    [Total Vendas] >= 20000, "Prata",\n    "Bronze")',
    ['Comece pela condição mais restritiva.', 'O último argumento sem par é o "senão".'],
    { p: 'Faixa de cada cliente:', f: 'Faixa Cliente = SWITCH(TRUE(), [Total Vendas] >= 50000, "Ouro", [Total Vendas] >= 20000, "Prata", "Bronze")', rows: 'dCliente[Cliente]' },
    ['Fora de ordem, todo mundo cai na primeira faixa ampla.', 'Guarde a medida numa variável para não recalcular em cada condição.', 'Para ordenar faixas no visual, crie também um número da faixa.'],
    [['Em SWITCH(TRUE(), v >= 100, "A", v >= 50, "B", "C"), v = 70 resulta em:', 'B', 'A', 'C', 'BLANK', 'A primeira condição verdadeira é v >= 50.'],
      ['Por que começar pela faixa mais alta?', 'Porque a primeira condição verdadeira é a usada', 'Por exigência de sintaxe', 'Para o visual ficar ordenado', 'Não importa a ordem', 'Uma condição ampla antes capturaria valores altos.'],
      ['Qual o papel do último argumento sem par?', 'É o resultado padrão (senão)', 'É ignorado', 'Gera erro', 'É a primeira condição', 'Vale quando nenhuma condição é verdadeira.']]);

  lesson('ytd', 'YTD', 'Acumulados: TOTALYTD, DATESYTD e TOTALQTD',
    'Com uma tabela de datas marcada, o DAX tem funções de inteligência de tempo. TOTALYTD acumula do 1º de janeiro até a última data do contexto. DATESYTD devolve essas datas para usar no CALCULATE.',
    'É o hodômetro do ano: zera em janeiro e só aumenta até dezembro.',
    'Vendas YTD = TOTALYTD([Total Vendas], dCalendario[Data])\nCALCULATE([Total Vendas], DATESYTD(dCalendario[Data]))\nTOTALQTD([Total Vendas], dCalendario[Data])',
    ['Use sempre a coluna de data da dCalendario, não a da fato.', 'QTD acumula no trimestre; MTD, no mês.'],
    { p: 'Vendas acumuladas no ano de 2026:', f: 'Vendas YTD = TOTALYTD([Total Vendas], dCalendario[Data])', rows: 'dCalendario[Mês Ano]', filters: { 'dCalendario[Ano]': 2026 }, fmt: 'money' },
    ['A tabela de datas precisa ter todos os dias, sem buracos.', 'Meses futuros repetem o acumulado: esconda-os com um filtro, se necessário.', 'O total da matriz mostra o acumulado até o fim do ano.'],
    [['TOTALYTD([Total Vendas], dCalendario[Data]) em março mostra:', 'As vendas de janeiro a março', 'Só as vendas de março', 'As vendas do ano inteiro', 'As vendas de março do ano anterior', 'Acumula desde o início do ano.'],
      ['Qual coluna de data usar nas funções de tempo?', 'A coluna de data da tabela calendário', 'A data da tabela fato', 'Qualquer coluna de texto', 'Um número do mês', 'A dCalendario é marcada como tabela de datas.'],
      ['TOTALQTD acumula:', 'Dentro do trimestre', 'Dentro da semana', 'Desde o início dos dados', 'Só no último mês', 'QTD = quarter to date.']]);

  lesson('sply', 'YoY', 'Comparando com o ano anterior',
    'SAMEPERIODLASTYEAR devolve as mesmas datas do contexto, um ano antes. Com CALCULATE você obtém as vendas do ano anterior e calcula o crescimento: (atual − anterior) ÷ anterior.',
    'É colocar o boletim deste ano ao lado do mesmo boletim do ano passado.',
    'Vendas AA = CALCULATE([Total Vendas], SAMEPERIODLASTYEAR(dCalendario[Data]))\nYoY % = \nVAR atual = [Total Vendas]\nVAR anterior = [Vendas AA]\nRETURN DIVIDE(atual - anterior, anterior)',
    ['DIVIDE evita erro quando não há ano anterior.', 'O mesmo padrão vale para DATEADD(…, -1, YEAR).'],
    { p: 'Vendas do mesmo mês em 2025 (página em 2026):', f: 'Vendas AA = CALCULATE([Total Vendas], SAMEPERIODLASTYEAR(dCalendario[Data]))', rows: 'dCalendario[Mês Ano]', filters: { 'dCalendario[Ano]': 2026 }, fmt: 'money' },
    ['Meses de 2026 ainda sem venda mostram crescimento de −100%.', 'Compare períodos completos: meio mês contra mês inteiro distorce.', 'Formate o crescimento como %.'],
    [['SAMEPERIODLASTYEAR(dCalendario[Data]) em mar/2026 devolve:', 'As datas de mar/2025', 'As datas de fev/2026', 'O ano de 2025 inteiro', 'mar/2027', 'Mesmo período, um ano antes.'],
      ['Crescimento YoY é calculado como:', '(atual − anterior) ÷ anterior', 'atual ÷ anterior', 'anterior − atual', '(atual − anterior) ÷ atual', 'Variação dividida pela base do ano anterior.'],
      ['Por que usar DIVIDE no YoY?', 'Para não dar erro quando o ano anterior é vazio', 'Para arredondar', 'Para mostrar em %', 'Não é necessário', 'Sem base, o resultado fica vazio.']]);

  lesson('dateadd', 'DATEADD', 'DATEADD, PREVIOUSMONTH e PARALLELPERIOD',
    'DATEADD desloca as datas do contexto (−1 MONTH = mês anterior). PREVIOUSMONTH devolve o mês anterior completo. PARALLELPERIOD devolve o período completo deslocado: com −1 YEAR, o ano anterior inteiro.',
    'É andar com o calendário para trás: um mês, um trimestre ou um ano.',
    'CALCULATE([Total Vendas], DATEADD(dCalendario[Data], -1, MONTH))\nCALCULATE([Total Vendas], PREVIOUSMONTH(dCalendario[Data]))\nCALCULATE([Total Vendas], PARALLELPERIOD(dCalendario[Data], -1, YEAR))',
    ['DATEADD aceita DAY, MONTH, QUARTER e YEAR.', 'PARALLELPERIOD sempre devolve períodos inteiros.'],
    { p: 'Vendas do mês anterior em 2026:', f: 'Vendas Mês Anterior = CALCULATE([Total Vendas], DATEADD(dCalendario[Data], -1, MONTH))', rows: 'dCalendario[Mês Ano]', filters: { 'dCalendario[Ano]': 2026 }, fmt: 'money' },
    ['Em janeiro, o mês anterior é dezembro do ano anterior: a tabela de datas precisa ter esse período.', 'No total da matriz, DATEADD desloca o ano todo.', 'MoM % = (atual − mês anterior) ÷ mês anterior.'],
    [['Qual expressão traz as vendas do mês anterior?', 'CALCULATE([Total Vendas], DATEADD(dCalendario[Data], -1, MONTH))', 'CALCULATE([Total Vendas], MONTH(-1))', '[Total Vendas] - 1', 'DATEADD([Total Vendas], -1)', 'DATEADD desloca as datas do contexto.'],
      ['PARALLELPERIOD(dCalendario[Data], -1, YEAR) em mar/2026 devolve:', 'Todas as datas de 2025', 'Só mar/2025', 'fev/2026', 'Todas as datas de 2026', 'Ele devolve o período inteiro deslocado.'],
      ['Qual intervalo NÃO é aceito por DATEADD?', 'HOUR', 'DAY', 'MONTH', 'YEAR', 'DATEADD trabalha com DAY, MONTH, QUARTER e YEAR.']]);

  lesson('keepfilters', 'KEEPFILTERS', 'KEEPFILTERS: somar em vez de substituir',
    'Um filtro do CALCULATE substitui o filtro da mesma coluna que vinha do visual. Com KEEPFILTERS, ele é combinado (interseção): a linha Casa continua sendo Casa e não vira Eletrônicos.',
    'Sem KEEPFILTERS, você troca o óculos do visual; com KEEPFILTERS, coloca uma lente a mais por cima.',
    'CALCULATE([Total Vendas], dProduto[Categoria] = "Eletrônicos")               ← Eletrônicos em todas as linhas\nCALCULATE([Total Vendas], KEEPFILTERS(dProduto[Categoria] = "Eletrônicos")) ← só na linha Eletrônicos',
    ['O comportamento padrão (substituir) é o que permite % do total e comparações.', 'KEEPFILTERS respeita o que o usuário filtrou.'],
    { p: 'Eletrônicos respeitando a linha do visual:', f: 'Só Eletrônicos = CALCULATE([Total Vendas], KEEPFILTERS(dProduto[Categoria] = "Eletrônicos"))', rows: 'dProduto[Categoria]', fmt: 'money' },
    ['Medidas com filtro fixo em visuais pela mesma coluna confundem o usuário.', 'Teste a medida num visual que usa a coluna filtrada.', 'KEEPFILTERS também funciona com FILTER e tabelas.'],
    [['Num visual por Categoria, CALCULATE([Total Vendas], dProduto[Categoria] = "Casa") mostra:', 'O valor de Casa em todas as linhas', 'Só a linha Casa', 'Erro', 'O total geral', 'O filtro do CALCULATE substitui o da linha.'],
      ['O que KEEPFILTERS muda?', 'Combina o filtro com o existente em vez de substituir', 'Remove todos os filtros', 'Guarda o resultado em cache', 'Cria uma coluna', 'A interseção mantém o filtro da linha.'],
      ['Com KEEPFILTERS(dProduto[Categoria] = "Casa"), a linha Esportes mostra:', 'BLANK', 'O valor de Casa', 'O valor de Esportes', 'O total geral', 'Casa ∩ Esportes não tem linhas.']]);

  lesson('transicao', 'TRANSIÇÃO', 'Transição de contexto em colunas',
    'Numa coluna calculada de dimensão, CALCULATE (ou uma medida) transforma a linha atual em filtro. Assim CALCULATE(SUM(fVendas[Valor])) em dProduto devolve o total vendido de cada produto. RELATEDTABLE devolve as linhas da fato ligadas à linha atual.',
    'É apontar para uma linha do cadastro e dizer: "agora, filtre o relatório por este item".',
    'Total Vendido = CALCULATE(SUM(fVendas[Valor]))           ← em dProduto\nPedidos Cliente = COUNTROWS(RELATEDTABLE(fVendas))   ← em dCliente\nGerente = LOOKUPVALUE(dLoja[Gerente], dLoja[CodLoja], fMetas[CodLoja])\nMeses de Casa = DATEDIFF(dCliente[Cadastro], TODAY(), MONTH)',
    ['Sem CALCULATE, SUM somaria a tabela inteira em todas as linhas.', 'LOOKUPVALUE busca sem precisar de relacionamento.'],
    { p: 'Total vendido de cada produto (coluna em dProduto):', f: 'Total Vendido = CALCULATE(SUM(fVendas[Valor]))', table: 'dProduto', show: ['Produto', 'Categoria'], fmt: 'money' },
    ['Colunas com transição de contexto ficam fixas até a próxima atualização.', 'Prefira medidas quando o resultado precisa reagir a filtros.', 'DATEDIFF aceita DAY, MONTH, QUARTER e YEAR.'],
    [['Em dProduto, SUM(fVendas[Valor]) sem CALCULATE devolve:', 'O total geral em todas as linhas', 'O total de cada produto', 'Erro', 'BLANK', 'Sem transição, não há filtro pela linha.'],
      ['COUNTROWS(RELATEDTABLE(fVendas)) numa coluna de dCliente conta:', 'Os pedidos de cada cliente', 'Todos os pedidos', 'Os clientes', 'Os produtos', 'RELATEDTABLE segue do lado 1 para o lado N.'],
      ['Quando usar LOOKUPVALUE?', 'Para buscar um valor sem relacionamento direto', 'Para somar uma coluna', 'Para criar uma tabela de datas', 'Para ordenar', 'Ele procura pelo valor da chave.']]);

  lesson('topn', 'TOPN', 'TOPN: os N maiores',
    'TOPN(N, Tabela, Expressão) devolve as N linhas com maior valor da expressão. Dentro do CALCULATE, vira filtro (vendas do Top 5); com MAXX ou CONCATENATEX, devolve nomes.',
    'É o pódio: só os primeiros colocados sobem.',
    'CALCULATE([Total Vendas], TOPN(5, ALL(dCliente[Cliente]), [Total Vendas]))\nMAXX(TOPN(1, VALUES(dProduto[Produto]), [Total Vendas]), dProduto[Produto])',
    ['Use ALL quando o Top precisa ignorar o filtro da linha.', 'Empates no último lugar entram todos.'],
    { p: 'Produto campeão de cada categoria:', f: 'Produto Campeão = MAXX(TOPN(1, VALUES(dProduto[Produto]), [Total Vendas]), dProduto[Produto])', rows: 'dProduto[Categoria]' },
    ['TOPN não ordena o resultado visualmente: só escolhe as linhas.', 'Escolha bem a tabela: VALUES respeita o contexto; ALL ignora.', 'Concentração = Top N ÷ total.'],
    [['TOPN(3, VALUES(dProduto[Produto]), [Total Vendas]) devolve:', 'Uma tabela com os 3 produtos mais vendidos', 'O valor do 3º produto', 'O ranking de cada produto', 'Os 3 primeiros em ordem alfabética', 'TOPN devolve linhas de uma tabela.'],
      ['Para somar as vendas dos 5 maiores clientes do ano, a tabela do TOPN deve ser:', 'ALL(dCliente[Cliente])', 'fVendas', 'dCalendario', 'VALUES(dLoja[Loja])', 'Todos os clientes concorrem ao Top 5.'],
      ['O que acontece com empates no último lugar do TOPN?', 'Todos os empatados entram', 'Só o primeiro entra', 'Dá erro', 'Nenhum entra', 'Por isso o resultado pode ter mais de N linhas.']]);

  lesson('rankx', 'RANKX', 'RANKX: rankings',
    'RANKX(Tabela, Expressão) devolve a posição do item atual comparando a expressão com todos os itens da tabela. Use ALL na tabela para comparar com todos, e não só com a linha atual.',
    'É a tabela de classificação do campeonato.',
    'Ranking Produto = RANKX(ALL(dProduto[Produto]), [Total Vendas])\nRANKX(ALL(dLoja[Loja]), [Pedidos], , DESC, DENSE)\nRANKX(ALLSELECTED(dProduto[Produto]), [Total Vendas])',
    ['DESC (padrão) dá 1 ao maior; ASC dá 1 ao menor.', 'DENSE não pula posições em empates.'],
    { p: 'Ranking de produtos por vendas:', f: 'Ranking Produto = RANKX(ALL(dProduto[Produto]), [Total Vendas])', rows: 'dProduto[Produto]', fmt: 'int' },
    ['Sem ALL, todos ficam em 1º (cada linha só vê a si mesma).', 'ALLSELECTED ranqueia só entre os itens filtrados.', 'No total da matriz o ranking não faz sentido: trate com HASONEVALUE.'],
    [['Por que usar ALL dentro do RANKX?', 'Para comparar o item com todos os outros', 'Para remover o ranking', 'Para ordenar o visual', 'Não é necessário', 'Sem ALL, a tabela teria só o item da linha.'],
      ['Com empate em 2º lugar, o próximo item em ranking padrão (SKIP) fica em:', '4º', '3º', '2º', '5º', 'SKIP pula as posições dos empatados; DENSE daria 3º.'],
      ['Qual argumento faz o ranking ficar crescente (1 = menor)?', 'ASC', 'DESC', 'DENSE', 'SKIP', 'DESC é o padrão.']]);

  lesson('acumulado', 'ACUMULADO', 'Acumulado com FILTER e ALL',
    'Para acumular desde o início dos dados, guarde a última data do contexto e filtre todas as datas até ela: CALCULATE([Total Vendas], FILTER(ALL(dCalendario[Data]), dCalendario[Data] <= d)).',
    'É a linha do tempo inteira, somando tudo até o ponto em que você está.',
    'Acumulado = \nVAR d = MAX(dCalendario[Data])\nRETURN CALCULATE(\n    [Total Vendas],\n    FILTER(ALL(dCalendario[Data]), dCalendario[Data] <= d))',
    ['A variável guarda a data antes do CALCULATE mudar o contexto.', 'Filtrar a data de uma tabela de datas marcada remove os demais filtros dela (ano, mês).'],
    { p: 'Acumulado desde jan/2025, olhando 2026:', f: 'Acumulado = VAR d = MAX(dCalendario[Data]) RETURN CALCULATE([Total Vendas], FILTER(ALL(dCalendario[Data]), dCalendario[Data] <= d))', rows: 'dCalendario[Mês Ano]', filters: { 'dCalendario[Ano]': 2026 }, fmt: 'money' },
    ['Sem a VAR, MAX seria reavaliado dentro do FILTER com outro contexto.', 'Para acumular só dentro do ano, use TOTALYTD.', 'Acumulados crescem sempre: confira se o último mês bate com o total.'],
    [['Por que guardar MAX(dCalendario[Data]) numa variável?', 'Para fixar a data do contexto antes do FILTER', 'Por exigência de sintaxe', 'Para deixar mais rápido apenas', 'Não é necessário', 'Dentro do FILTER(ALL(...)) o contexto muda.'],
      ['O acumulado desde o início difere do YTD porque:', 'Não zera na virada do ano', 'Só considera o ano atual', 'Usa outra tabela', 'Não usa datas', 'YTD reinicia em janeiro.'],
      ['ALL(dCalendario[Data]) no FILTER serve para:', 'Considerar todas as datas, não só as do mês', 'Remover a tabela fato', 'Ordenar as datas', 'Converter datas em texto', 'Depois o FILTER limita até a data guardada.']]);

  lesson('movel', 'MÉDIA MÓVEL', 'Períodos móveis com DATESINPERIOD',
    'DATESINPERIOD(Datas, DataFinal, −3, MONTH) devolve as datas dos 3 meses que terminam na data final. Com CALCULATE, vira soma móvel; com AVERAGEX por mês, média móvel.',
    'É uma janela que desliza pela linha do tempo, sempre mostrando os últimos 3 meses.',
    'Vendas 3M = CALCULATE([Total Vendas],\n    DATESINPERIOD(dCalendario[Data], MAX(dCalendario[Data]), -3, MONTH))\nMédia Móvel 3M = CALCULATE(AVERAGEX(VALUES(dCalendario[Mês Ano]), [Total Vendas]), DATESINPERIOD(…))\nCALCULATE([Total Vendas], DATESINPERIOD(dCalendario[Data], TODAY(), -30, DAY))',
    ['O número negativo olha para trás; positivo, para frente.', 'Use DAY para janelas de dias (últimos 30 dias).'],
    { p: 'Média móvel de 3 meses em 2025:', f: 'Média Móvel 3M = CALCULATE(AVERAGEX(VALUES(dCalendario[Mês Ano]), [Total Vendas]), DATESINPERIOD(dCalendario[Data], MAX(dCalendario[Data]), -3, MONTH))', rows: 'dCalendario[Mês Ano]', filters: { 'dCalendario[Ano]': 2025 }, fmt: 'money' },
    ['Nos primeiros meses a janela tem menos dados.', 'A média móvel por mês é diferente da média diária da janela.', 'DATESINPERIOD considera todas as datas da tabela, não só as do filtro.'],
    [['DATESINPERIOD(dCalendario[Data], MAX(dCalendario[Data]), -3, MONTH) em jun/2025 devolve:', 'As datas de abr, mai e jun/2025', 'Só jun/2025', 'jun, jul e ago/2025', 'O ano inteiro', 'Três meses terminando na data final.'],
      ['Para "vendas dos últimos 30 dias até hoje" use:', 'DATESINPERIOD(dCalendario[Data], TODAY(), -30, DAY)', 'DATEADD(dCalendario[Data], 30, DAY)', 'PREVIOUSMONTH(dCalendario[Data])', 'TOTALMTD([Total Vendas])', 'A janela termina hoje e volta 30 dias.'],
      ['A média móvel serve para:', 'Suavizar oscilações e mostrar tendência', 'Calcular o total do ano', 'Ordenar meses', 'Contar clientes', 'Ela reduz o efeito de meses atípicos.']]);

  lesson('userel', 'USERELATIONSHIP', 'Relacionamentos inativos e USERELATIONSHIP',
    'Entre duas tabelas só um relacionamento pode estar ativo. A fVendas tem Data (ativa) e DataEntrega (inativa) ligadas à dCalendario. USERELATIONSHIP ativa a relação inativa dentro de um CALCULATE.',
    'São duas portas entre os mesmos cômodos: uma fica aberta; a outra você abre só quando precisa.',
    'Vendas por Entrega = CALCULATE([Total Vendas],\n    USERELATIONSHIP(fVendas[DataEntrega], dCalendario[Data]))',
    ['Fora desse CALCULATE, vale a relação ativa.', 'Uma tabela de datas atende várias datas da fato.'],
    { p: 'Vendas pela data de entrega em 2025:', f: 'Vendas por Entrega = CALCULATE([Total Vendas], USERELATIONSHIP(fVendas[DataEntrega], dCalendario[Data]))', rows: 'dCalendario[Mês Ano]', filters: { 'dCalendario[Ano]': 2025 }, fmt: 'money' },
    ['O relacionamento inativo precisa existir no modelo.', 'Não duplique a tabela calendário à toa: USERELATIONSHIP resolve.', 'A diferença entre data da venda e da entrega mostra o que está em trânsito.'],
    [['Quantos relacionamentos ativos pode haver entre duas tabelas?', 'Um', 'Dois', 'Ilimitados', 'Nenhum', 'Os demais ficam inativos.'],
      ['Onde USERELATIONSHIP é usado?', 'Como argumento do CALCULATE', 'Como coluna calculada sozinha', 'Na Power Query', 'Em filtros de página', 'Ele modifica o contexto da expressão.'],
      ['Sem USERELATIONSHIP, [Total Vendas] por mês usa:', 'A data da venda (relação ativa)', 'A data de entrega', 'As duas somadas', 'Nenhuma data', 'Vale a relação ativa.']]);

  lesson('escopo', 'ISINSCOPE', 'ISINSCOPE e ISFILTERED',
    'ISINSCOPE(Coluna) diz se a linha do visual está agrupada por aquela coluna (é falso no total). ISFILTERED diz se a coluna está filtrada diretamente. Elas permitem tratar totais e mensagens.',
    'É saber em que andar do prédio você está: na sala de uma categoria ou no térreo do total.',
    'IF(ISINSCOPE(dProduto[Categoria]), "Categoria", "Total geral")\nIF(ISFILTERED(dLoja[Loja]), "Filtrado", "Todas as lojas")',
    ['Em hierarquias, ISINSCOPE identifica o nível atual.', 'ISCROSSFILTERED também detecta filtros vindos de outras tabelas.'],
    { p: 'Rótulo de nível por linha:', f: 'Nível = IF(ISINSCOPE(dProduto[Categoria]), "Categoria", "Total geral")', rows: 'dProduto[Categoria]' },
    ['Use para esconder rankings e percentuais sem sentido no total.', 'Filtros de página fazem ISFILTERED ser verdadeiro, mas não ISINSCOPE.', 'Teste as medidas no total do visual.'],
    [['Na linha de total, ISINSCOPE(dProduto[Categoria]) é:', 'Falso', 'Verdadeiro', 'BLANK', 'Erro', 'O total não está agrupado por categoria.'],
      ['ISFILTERED(dLoja[Loja]) é verdadeiro quando:', 'A coluna Loja está filtrada diretamente', 'Há qualquer filtro no relatório', 'A tabela tem dados', 'Sempre', 'Ele olha filtros diretos na coluna.'],
      ['Um uso comum de ISINSCOPE é:', 'Mostrar o ranking só nas linhas, não no total', 'Criar relacionamentos', 'Formatar datas', 'Contar linhas', 'No total o ranking não faz sentido.']]);

  lesson('clientes', 'CLIENTES', 'Análises de clientes: novos, recorrentes e inativos',
    'Combinando FILTER, VALUES e CALCULATE você responde perguntas de CRM: quem comprou nos dois anos, quem fez a 1ª compra no mês, quem não compra há 90 dias. A chave é avaliar uma medida por cliente.',
    'É olhar a ficha de cada cliente e marcar quem voltou, quem é novo e quem sumiu.',
    'Recorrentes = COUNTROWS(FILTER(VALUES(fVendas[CodCliente]),\n    CALCULATE([Pedidos], dCalendario[Ano] = 2025) > 0 &&\n    CALCULATE([Pedidos], dCalendario[Ano] = 2026) > 0))\nInativos = COUNTROWS(FILTER(dCliente, CALCULATE(MAX(fVendas[Data])) < TODAY() - 90))',
    ['CALCULATE(MIN(fVendas[Data]), ALL(dCalendario)) dá a primeira compra, ignorando o período.', 'DATEDIFF(MAX(fVendas[Data]), TODAY(), DAY) mede dias sem comprar.'],
    { p: 'Clientes que compraram em 2025 e em 2026:', f: 'Recorrentes = COUNTROWS(FILTER(VALUES(fVendas[CodCliente]), CALCULATE([Pedidos], dCalendario[Ano] = 2025) > 0 && CALCULATE([Pedidos], dCalendario[Ano] = 2026) > 0))', rows: 'dCliente[Segmento]', fmt: 'int' },
    ['Defina com o negócio o que é "ativo" e "inativo".', 'A primeira compra precisa ignorar o filtro de data do visual.', 'Clientes sem nenhuma compra também aparecem na dCliente.'],
    [['Para achar a 1ª compra do cliente, independentemente do mês do visual, use:', 'CALCULATE(MIN(fVendas[Data]), ALL(dCalendario))', 'MIN(fVendas[Data])', 'FIRSTDATE(fVendas[Data])', 'MAX(dCalendario[Data])', 'ALL remove o filtro do período.'],
      ['Clientes recorrentes são os que:', 'Compraram nos dois períodos comparados', 'Compraram só uma vez', 'Nunca compraram', 'Têm o maior ticket', 'Por isso as duas condições com &&.'],
      ['DATEDIFF(MAX(fVendas[Data]), TODAY(), DAY) mede:', 'Dias desde a última compra', 'Dias desde o cadastro', 'Idade do cliente', 'Dias do mês', 'Da última compra até hoje.']]);

  lesson('abc', 'ABC', 'Curva ABC (Pareto)',
    'A curva ABC ordena os itens do maior para o menor e acumula a participação. Itens até ~70% do faturamento são A, até 90% são B, o resto C. Em DAX, some as vendas dos itens com venda maior ou igual à do item atual.',
    'É a regra 80/20: poucos produtos respondem pela maior parte do faturamento.',
    '% Acumulado = \nVAR total = CALCULATE([Total Vendas], ALL(dProduto))\nVAR v = [Total Vendas]\nVAR acum = SUMX(FILTER(ALL(dProduto[Produto]), [Total Vendas] >= v), [Total Vendas])\nRETURN DIVIDE(acum, total)',
    ['O FILTER pega todos os produtos que vendem pelo menos o mesmo que o atual.', 'Depois, SWITCH(TRUE(), …) define A, B ou C.'],
    { p: '% acumulado de cada produto:', f: '% Acumulado = VAR total = CALCULATE([Total Vendas], ALL(dProduto)) VAR v = [Total Vendas] VAR acum = SUMX(FILTER(ALL(dProduto[Produto]), [Total Vendas] >= v), [Total Vendas]) RETURN DIVIDE(acum, total)', rows: 'dProduto[Produto]', fmt: 'pct' },
    ['Ordene o visual pelo % acumulado para ver a curva.', 'Os cortes (70/90) são decisão do negócio.', 'Em modelos grandes, a ABC pode ser pesada: considere uma coluna calculada.'],
    [['Na curva ABC, os itens A são:', 'Os poucos itens que somam a maior parte do valor', 'Os itens mais baratos', 'Os mais novos', 'Os sem venda', 'Concentram ~70% do faturamento.'],
      ['Por que comparar [Total Vendas] >= v no FILTER?', 'Para acumular do maior até o item atual', 'Para ordenar alfabeticamente', 'Para remover duplicados', 'Para criar um ranking negativo', 'Itens maiores ou iguais vêm antes na curva.'],
      ['Depois do % acumulado, a classe é definida com:', 'SWITCH(TRUE(), …)', 'RELATED', 'USERELATIONSHIP', 'DATEADD', 'Faixas por condições.']]);

  lesson('concatx', 'CONCATENATEX', 'CONCATENATEX e textos dinâmicos',
    'CONCATENATEX junta os textos de uma tabela com um separador e pode ordenar. Com FORMAT e SELECTEDVALUE você cria títulos e resumos que mudam com os filtros.',
    'É montar a legenda do gráfico automaticamente, com os nomes e números certos.',
    'CONCATENATEX(VALUES(dProduto[Produto]), dProduto[Produto], ", ", dProduto[Produto], ASC)\n"Vendas de " & SELECTEDVALUE(dLoja[Loja], "todas as lojas") & ": " & FORMAT([Total Vendas], "R$ #,##0")\nFORMAT(DIVIDE(a - b, b), "0.0%")',
    ['Os argumentos 4 e 5 ordenam a lista.', 'Formatos: "R$ #,##0", "0.0%", "mmm/yyyy".'],
    { p: 'Título dinâmico por loja:', f: 'Título = "Vendas de " & SELECTEDVALUE(dLoja[Loja], "todas as lojas") & ": " & FORMAT([Total Vendas], "R$ #,##0")', rows: 'dLoja[Loja]' },
    ['Medidas de texto não somam: use em cartões, títulos e tooltips.', 'Listas longas ficam ilegíveis: combine com TOPN.', 'FORMAT devolve texto; não use o resultado em contas.'],
    [['CONCATENATEX(VALUES(dLoja[Canal]), dLoja[Canal], ", ") devolve:', 'Os canais separados por vírgula', 'A quantidade de canais', 'O primeiro canal', 'Erro', 'Junta os textos da tabela.'],
      ['Para um título que mostra a loja filtrada, use:', 'SELECTEDVALUE(dLoja[Loja], "todas as lojas")', 'VALUES(dLoja)', 'ALL(dLoja[Loja])', 'COUNTROWS(dLoja)', 'Devolve a loja ou o texto alternativo.'],
      ['FORMAT(0.153, "0.0%") resulta em:', '15,3%', '0,153', '153%', '15%', 'O formato multiplica por 100 e mostra uma casa.']]);

  lesson('tabelas', 'TABELA', 'Tabelas virtuais e calculadas',
    'SUMMARIZE agrupa, ADDCOLUMNS acrescenta colunas, SELECTCOLUMNS escolhe colunas e CALCULATETABLE filtra uma tabela. Elas criam tabelas calculadas no modelo ou tabelas virtuais dentro de medidas.',
    'É montar uma planilha auxiliar sem sair do Power BI.',
    'Top 5 = TOPN(5, SUMMARIZE(fVendas, dProduto[Produto], "Vendas", [Total Vendas]), [Vendas])\nResumo = ADDCOLUMNS(VALUES(dLoja[Loja]), "Vendas", [Total Vendas])\nCALCULATETABLE(dCliente, dCliente[Segmento] = "Corporativo")\nMAXX(ADDCOLUMNS(VALUES(dCalendario[Mês Ano]), "V", [Total Vendas]), [V])',
    ['Colunas criadas com ADDCOLUMNS são referenciadas como [Nome].', 'Tabelas virtuais em variáveis deixam medidas complexas legíveis.'],
    { p: 'Resumo por loja (tabela calculada):', f: 'Resumo Lojas = ADDCOLUMNS(VALUES(dLoja[Loja]), "Vendas", [Total Vendas], "Pedidos", [Pedidos])', kind: 'table', fmts: ['', 'money', 'int'] },
    ['Tabelas calculadas são fixas até a atualização.', 'Use ADDCOLUMNS para calcular medidas em tabelas virtuais.', 'Dê nomes às colunas novas entre aspas.'],
    [['O que ADDCOLUMNS(VALUES(dLoja[Loja]), "Vendas", [Total Vendas]) faz?', 'Cria uma tabela de lojas com a coluna Vendas', 'Soma as vendas das lojas', 'Altera a tabela dLoja', 'Cria um relacionamento', 'Acrescenta uma coluna calculada à tabela virtual.'],
      ['Como filtrar uma tabela inteira por uma condição?', 'CALCULATETABLE(Tabela, filtro)', 'CALCULATE(Tabela)', 'SUM(Tabela)', 'SELECTEDVALUE(Tabela)', 'CALCULATETABLE é o CALCULATE que devolve tabela.'],
      ['Numa tabela virtual com a coluna "V", ela é referenciada como:', '[V]', 'Tabela[V]', '"V"', 'V()', 'Colunas virtuais usam só colchetes.']]);

  lesson('final', 'DESAFIO', 'Juntando tudo',
    'Medidas de negócio combinam várias peças: variáveis para cada parte, CALCULATE para mudar o contexto, inteligência de tempo para comparar períodos e FORMAT para apresentar. Monte por partes e teste cada uma.',
    'É montar o painel do carro: cada ponteiro é uma medida, e todos olham para o mesmo motor.',
    'Resumo = \nVAR v = [Total Vendas]\nVAR m = DIVIDE(v, [Total Metas])\nVAR aa = CALCULATE([Total Vendas], SAMEPERIODLASTYEAR(dCalendario[Data]))\nRETURN FORMAT(v, "R$ #,##0") & " | meta " & FORMAT(m, "0%")\n    & " | vs AA " & FORMAT(DIVIDE(v - aa, aa), "0%")',
    ['Teste cada variável retornando-a sozinha.', 'Prefira reaproveitar medidas a repetir lógica.'],
    { p: 'Projeção simples de 2026 (cartão):', f: 'Projeção 2026 = DIVIDE(TOTALYTD([Total Vendas], dCalendario[Data]), MONTH(MAX(fVendas[Data]))) * 12', rows: null, filters: { 'dCalendario[Ano]': 2026 }, fmt: 'money' },
    ['Medidas longas sem VAR são difíceis de manter.', 'Valide sempre com um visual simples.', 'Documente o objetivo de cada medida na descrição.'],
    [['Qual a melhor forma de depurar uma medida longa com variáveis?', 'Retornar uma variável por vez e conferir', 'Apagar tudo e recomeçar', 'Usar só colunas calculadas', 'Aumentar o visual', 'Assim você acha a parte errada.'],
      ['Para comparar com o ano anterior numa medida resumo, use:', 'CALCULATE com SAMEPERIODLASTYEAR', 'RELATED', 'LOOKUPVALUE', 'SELECTCOLUMNS', 'Muda o contexto de datas para um ano antes.'],
      ['Por que reaproveitar medidas como [Total Vendas]?', 'Para manter a mesma regra em todo o relatório', 'Porque é obrigatório', 'Para criar colunas', 'Para ignorar filtros', 'Uma regra, um lugar.']]);

  /* ------------------------- Tópico → aula ------------------------- */
  const MAP = {
    'SUM': 'medidas', 'Cartão': 'medidas', 'Medidas com operações': 'divide', 'Reaproveitando medidas': 'divide',
    'COUNTROWS': 'agregacoes', 'AVERAGE': 'agregacoes', 'MAX': 'agregacoes', 'MIN': 'agregacoes', 'DISTINCTCOUNT': 'agregacoes', 'COUNT': 'agregacoes',
    'DIVIDE': 'divide', 'ROUND': 'divide',
    'Coluna calculada': 'colunas', 'RELATED': 'related', 'IF em coluna': 'logica', 'SWITCH': 'logica', 'IF em medida': 'logica',
    'Datas em coluna': 'datascol', 'FORMAT': 'concatx', 'Texto': 'texto',
    'CALCULATE': 'calculate', 'CALCULATE com vários filtros': 'calcmulti', 'CALCULATE + DIVIDE': 'calcmulti',
    'Meta x realizado': 'metas', 'BLANK e COALESCE': 'blank', 'Desafio do nível': 'divide',
    'ALL': 'all', 'REMOVEFILTERS': 'all', 'ALLEXCEPT': 'allexcept', 'ALLSELECTED': 'allexcept',
    'FILTER': 'filter', 'SUMX': 'iteradores', 'SUMX + RELATED': 'iteradores', 'AVERAGEX': 'iteradores',
    'MAXX': 'iteragg', 'MINX': 'iteragg', 'VALUES': 'values', 'SELECTEDVALUE': 'values', 'HASONEVALUE': 'values',
    'VAR / RETURN': 'var', 'SWITCH(TRUE())': 'switchtrue',
    'TOTALYTD': 'ytd', 'DATESYTD': 'ytd', 'TOTALQTD': 'ytd', 'SAMEPERIODLASTYEAR': 'sply', 'Crescimento YoY': 'sply', 'YTD do ano anterior': 'sply',
    'DATEADD': 'dateadd', 'Crescimento MoM': 'dateadd', 'PREVIOUSMONTH': 'dateadd', 'PARALLELPERIOD': 'dateadd',
    'KEEPFILTERS': 'keepfilters', 'CALCULATE substitui filtros': 'keepfilters',
    'RELATEDTABLE': 'transicao', 'Transição de contexto': 'transicao', 'LOOKUPVALUE': 'transicao', 'DATEDIFF': 'transicao',
    'TOPN': 'topn', 'AVERAGEX + TOPN': 'topn', 'RANKX': 'rankx', 'RANKX + ALLSELECTED': 'rankx',
    'Acumulado': 'acumulado', 'Média móvel': 'movel', 'DATESINPERIOD': 'movel', 'Clientes ativos': 'movel',
    'USERELATIONSHIP': 'userel', 'ISINSCOPE': 'escopo', 'ISFILTERED': 'escopo',
    'Clientes recorrentes': 'clientes', 'Clientes novos': 'clientes', 'Clientes inativos': 'clientes',
    'Curva ABC': 'abc', 'CONCATENATEX': 'concatx', 'CONCATENATEX + TOPN': 'concatx', 'Títulos dinâmicos': 'concatx',
    'SUMMARIZE': 'tabelas', 'ADDCOLUMNS': 'tabelas', 'Tabela calculada': 'tabelas', 'CALCULATETABLE': 'tabelas', 'SELECTCOLUMNS': 'tabelas',
    'Projeção': 'final', 'ALL + VALUES': 'all', 'AVERAGEX + ALL': 'iteradores', 'Desafio final': 'final',
  };

  /* --------------------------- Exemplo ao vivo --------------------------- */
  /** Calcula a expressão e devolve o HTML de uma mini matriz, coluna ou tabela. */
  function preview(ex) {
    const X = global.DaxEngine, esc = global.UI.esc;
    let c;
    try { c = X.compile(ex.f); } catch (e) { return { html: '<p class="muted">' + esc(e.msg) + '</p>', speech: '' }; }
    try {
      if (ex.kind === 'table') {
        const t = X.tableExpr(c.ast); const f = ex.fmts || [];
        return { html: '<div class="dt"><div class="dt-scroll"><table class="pbi-mini"><thead><tr>' + t.cols.map(function (h) { return '<th class="plain">' + esc(h) + '</th>'; }).join('') + '</tr></thead><tbody>' +
          t.rows.slice(0, 8).map(function (r) { return '<tr>' + r.map(function (v, i) { return '<td>' + esc(X.display(v, f[i])) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div></div>',
          speech: 'A tabela foi calculada agora mesmo e tem ' + t.rows.length + ' linhas.' };
      }
      if (ex.table) {
        const T = global.DaxData.TABLES[ex.table]; const vals = X.column(ex.table, c.ast);
        const cols = ex.show || []; const ci = cols.map(function (k) { return T.cols.indexOf(k); });
        return { html: '<div class="dt"><div class="dt-scroll"><table class="pbi-mini"><thead><tr>' + cols.map(function (h) { return '<th class="plain">' + esc(h) + '</th>'; }).join('') + '<th class="plain res">' + esc(c.name || 'Nova coluna') + '</th></tr></thead><tbody>' +
          vals.slice(0, 5).map(function (v, i) { return '<tr>' + ci.map(function (k, j) { return '<td>' + esc(X.display(T.rows[i][k], (T.types || {})[cols[j]])) + '</td>'; }).join('') + '<td class="res">' + esc(X.display(v, ex.fmt)) + '</td></tr>'; }).join('') + '</tbody></table></div></div>' +
          '<p class="muted sm">Coluna calculada em ' + esc(ex.table) + ' (' + vals.length + ' linhas). Mostrando as 5 primeiras.</p>',
          speech: 'A coluna foi calculada agora mesmo em cada linha da tabela ' + ex.table + '.' };
      }
      const r = X.visual({ rows: ex.rows, filters: ex.filters }, c.ast, c.name);
      const filt = ex.filters ? Object.keys(ex.filters).map(function (k) { return k + ' = ' + ex.filters[k]; }).join(', ') : '';
      if (!ex.rows) return { html: '<div class="pbi-card-mini"><small>' + esc(c.name || 'Medida') + '</small><b>' + esc(X.display(r.total.v, ex.fmt)) + '</b>' + (filt ? '<span>Filtro: ' + esc(filt) + '</span>' : '') + '</div>', speech: 'O cartão mostra ' + X.display(r.total.v, ex.fmt) + '.' };
      const rows = r.groups.filter(function (g) { return g.v !== null; });
      return { html: (filt ? '<p class="muted sm">Filtro da página: ' + esc(filt) + '</p>' : '') + '<div class="dt"><div class="dt-scroll"><table class="pbi-mini"><thead><tr><th class="plain">' + esc(r.rowsLabel) + '</th><th class="plain res">' + esc(c.name || 'Medida') + '</th></tr></thead><tbody>' +
        rows.slice(0, 7).map(function (g) { return '<tr><td>' + esc(X.display(g.label, r.rowsType)) + '</td><td class="res">' + esc(X.display(g.v, ex.fmt)) + '</td></tr>'; }).join('') +
        '<tr class="tot"><td>Total</td><td class="res">' + esc(X.display(r.total.v, ex.fmt)) + '</td></tr></tbody></table></div></div>' + (rows.length > 7 ? '<p class="muted sm">Mostrando 7 de ' + rows.length + ' linhas.</p>' : ''),
        speech: 'A medida foi calculada agora mesmo no visual, linha a linha, e também no total.' };
    } catch (e) { return { html: '<p class="muted">' + esc(e.msg || String(e)) + '</p>', speech: '' }; }
  }

  function register() {
    if (!global.Lessons || !global.Lessons.registerPack) return;
    global.Lessons.registerPack('powerbi', {
      LESSONS: L, MAP: MAP, fallback: 'medidas', goalLabel: 'Objetivo da medida',
      codeHtml: function (code) { return global.DaxLang.highlight(code); },
      solution: function (ex) { return { label: ex.kind === 'measure' ? 'Medida' : ex.kind === 'column' ? 'Coluna calculada em ' + ex.table : 'Tabela calculada', code: global.DaxLang.pretty(ex.q), speech: 'Repare na estrutura da expressão DAX no código.' }; },
      example: function (les) { const pv = preview(les.exemplo); return { code: global.DaxLang.pretty(les.exemplo.f), badge: 'Calculado agora no modelo NexusMarket', liveHtml: pv.html, speech: pv.speech }; },
      tags: function (ex) {
        const t = [];
        if (ex.kind === 'measure') { t.push({ icon: 'bars', label: ex.v.rows ? 'Matriz · ' + ex.v.rows : 'Cartão' }); if (ex.v.filters) t.push({ icon: 'target', label: Object.keys(ex.v.filters).map(function (k) { return k.replace(/^.*\[|\]$/g, '') + ' ' + ex.v.filters[k]; }).join(', ') }); }
        else if (ex.kind === 'column') t.push({ icon: 'table', label: 'Coluna em ' + ex.table });
        else t.push({ icon: 'table', label: 'Tabela calculada' });
        return t;
      },
    });
  }
  register();
  global.DaxLessons = { LESSONS: L, MAP: MAP, preview: preview };
})(window);
