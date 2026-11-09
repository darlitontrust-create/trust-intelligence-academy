/* =====================================================================
   pq-lessons.js — Aulas da trilha de Power Query
   ---------------------------------------------------------------------
   36 aulas em 9 etapas:
     Nível 1 · Fundamentos → 1.1 Primeiros passos · 1.2 Limpeza básica ·
       1.3 Estruturando tabelas
     Nível 2 · Combinar e remodelar → 2.1 Combinar consultas ·
       2.2 Remodelar · 2.3 Linguagem M
     Nível 3 · Automação e projeto → 3.1 Automação ·
       3.2 Desempenho e atualização · 3.3 Modelagem e projeto
   O slide "Como se escreve" mostra o código M gerado pela interface.
   Questões de prova: [pergunta, correta, errada1, errada2, errada3, explicação]
   ===================================================================== */
(function (global) {
  'use strict';
  const L = {}, MAP = {};
  const PD = global.PQData, f = global.GQCharts.fmt;
  function lesson(key, topic, kw, titulo, ideia, analogia, sintaxe, notas, exemplo, cuidados, quiz) {
    L[key] = { key: key, kw: kw, titulo: titulo, ideia: ideia, analogia: analogia, sintaxe: sintaxe, notas: notas, exemplo: exemplo, cuidados: cuidados, quiz: quiz };
    MAP[topic] = key;
  }
  const T = function (cols, rows, o) { return Object.assign({ type: 'table', cols: cols, rows: rows }, o || {}); };
  const pedLimpo = T(['pedido_id', 'uf', 'canal', 'cliente', 'valor'], PD.validos.map(function (x) { return [String(x[0]), x[2].toUpperCase(), x[3][0].toUpperCase() + x[3].slice(1).toLowerCase(), x[4].trim().toLowerCase().replace(/(^|\s)\S/g, function (c) { return c.toUpperCase(); }), f(x[5], 2)]; }));

  /* ========================= NÍVEL 1 · FUNDAMENTOS ========================= */
  // ---- Etapa 1.1 · Primeiros passos
  lesson('oque', 'O que é o Power Query', 'ETL', 'O que é o Power Query',
    'O Power Query é a ferramenta de preparação de dados do Excel e do Power BI. Ele faz ETL: extrai os dados da fonte (arquivo, pasta, banco, web), transforma (limpa, combina, remodela) e carrega o resultado numa tabela ou no modelo. Cada clique vira uma etapa gravada; no mês seguinte, basta atualizar e todas as etapas se repetem. A fonte original nunca é alterada.',
    'É como uma receita gravada: na primeira vez você anota cada passo; nas próximas, a cozinha executa sozinha com os ingredientes novos.',
    '// Excel: Dados > Obter Dados > De Arquivo > Do Texto/CSV\n// Power BI: Página Inicial > Transformar dados\nlet\n    Fonte = Csv.Document(File.Contents("pedidos.csv"), [Delimiter = ";"]),\n    Cabecalhos = Table.PromoteHeaders(Fonte)\nin\n    Cabecalhos',
    ['O mesmo Power Query e a mesma linguagem M existem no Excel e no Power BI.', 'Cada transformação vira uma etapa que você pode revisar.', 'Atualizar repete todas as etapas com os dados novos.'],
    { p: 'Relatório mensal de pedidos, antes e depois:', c: '// Antes: 3 horas por mês copiando, colando e corrigindo\n// Depois: as etapas ficam gravadas na consulta\nlet\n    Fonte = Csv.Document(File.Contents("pedidos.csv"), [Delimiter = ";"]),\n    Cabecalhos = Table.PromoteHeaders(Fonte),\n    SemDuplicadas = Table.Distinct(Cabecalhos, {"pedido_id"})\nin\n    SemDuplicadas', fig: { type: 'chevrons', steps: [{ k: 'E', t: 'Extrair: ler a fonte' }, { k: 'T', t: 'Transformar: limpar e remodelar' }, { k: 'L', t: 'Carregar: tabela ou modelo' }], speech: 'Extrair, transformar e carregar: o ciclo do Power Query.' } },
    ['Não edite a fonte à mão para “ajudar” a consulta.', 'Não confunda Power Query (preparação) com DAX (cálculos no modelo).', 'Não deixe etapas inúteis acumuladas.'],
    [['O Power Query é uma ferramenta de:', 'Extração, transformação e carga de dados (ETL)', 'Criação de gráficos', 'Envio de e-mails', 'Edição de imagens', 'Prepara os dados.'],
      ['Ao remover colunas no Power Query, o arquivo de origem:', 'Não é alterado', 'Perde as colunas', 'É sobrescrito', 'É apagado', 'As etapas valem só para o resultado.'],
      ['Para repetir as transformações com dados novos, basta:', 'Atualizar a consulta', 'Refazer todas as etapas', 'Copiar e colar', 'Criar outra consulta', 'As etapas são reaplicadas.']]);

  lesson('fontes', 'Fontes de dados', 'FONTES', 'Conectando às fontes de dados',
    'O primeiro passo é escolher o conector certo: Excel e CSV para arquivos, Pasta para vários arquivos iguais, SQL Server e outros bancos, SharePoint e Web. Em arquivos de texto, confira o delimitador (no Brasil, muitas vezes ponto e vírgula) e a codificação (UTF-8 evita “SÃ£o Paulo”). Prefira fontes compartilhadas a caminhos locais, como C:\\Users\\…, que só existem num computador.',
    'Conector é a tomada certa para cada aparelho: o adaptador errado não liga ou queima o equipamento.',
    'Csv.Document(File.Contents("vendas.csv"), [Delimiter = ";", Encoding = 65001])\nExcel.Workbook(File.Contents("metas.xlsx"))\nFolder.Files("\\\\servidor\\vendas")\nSql.Database("srv-dados", "nexus")\nSharePoint.Files("https://empresa.sharepoint.com/sites/bi")',
    ['Encoding 65001 é UTF-8.', 'Para vários arquivos com o mesmo layout, use o conector de Pasta.', 'Fontes na nuvem ou na rede facilitam a atualização por todos.'],
    { p: 'Importando o CSV do ERP com os ajustes certos:', c: 'let\n    Fonte = Csv.Document(\n        File.Contents("\\\\servidor\\erp\\pedidos.csv"),\n        [Delimiter = ";", Encoding = 65001]\n    ),\n    Cabecalhos = Table.PromoteHeaders(Fonte)\nin\n    Cabecalhos', fig: T(['Fonte', 'Conector', 'Atenção'], [['Exportação do ERP', 'Texto/CSV', 'Delimitador “;” e UTF-8'], ['12 arquivos mensais', 'Pasta', 'Mesmo layout em todos'], ['Clientes', 'SQL Server', 'Credenciais e gateway'], ['Metas', 'SharePoint', 'URL do site']], { speech: 'Cada fonte tem seu conector e seus cuidados.' }) },
    ['Não aponte para arquivos no seu computador se outros vão atualizar.', 'Não ignore acentos trocados: é codificação.', 'Não importe tudo numa coluna só: ajuste o delimitador.'],
    [['“SÃ£o Paulo” na importação indica problema de:', 'Codificação do arquivo', 'Delimitador', 'Tipo de dados', 'Duplicadas', 'Ajuste para UTF-8.'],
      ['Para doze CSVs mensais com o mesmo layout, use o conector:', 'Pasta', 'Web', 'Excel', 'Em branco', 'Combina todos de uma vez.'],
      ['Tudo veio numa coluna só, separado por “;”. Ajuste:', 'O delimitador', 'A codificação', 'O tipo de dados', 'O cabeçalho', 'CSV brasileiro costuma usar “;”.']]);

  lesson('etapas', 'Etapas aplicadas', 'ETAPAS', 'O editor e as etapas aplicadas',
    'O Editor do Power Query mostra a pré-visualização dos dados, a barra de fórmulas e o painel Etapas Aplicadas. Cada etapa é um retrato dos dados naquele momento: clique em uma para ver como estavam. Você pode renomear, mover, excluir ou inserir etapas no meio, mas lembre que as etapas seguintes passam a receber dados diferentes. Etapas com nomes claros tornam a consulta fácil de manter.',
    'É como o histórico de versões de um documento: você volta a qualquer ponto para ver como estava, sem perder o resto.',
    'let\n    Fonte = ...,\n    #"Cabeçalhos Promovidos" = Table.PromoteHeaders(Fonte),\n    #"Tipo Alterado" = Table.TransformColumnTypes(#"Cabeçalhos Promovidos", ...),\n    #"Linhas Filtradas" = Table.SelectRows(#"Tipo Alterado", ...)\nin\n    #"Linhas Filtradas"',
    ['Cada etapa recebe a anterior como entrada.', 'Renomeie etapas: “FiltroAno2025” diz mais que “Linhas Filtradas1”.', 'Ative a barra de fórmulas em Exibir.'],
    { p: 'O painel de etapas da consulta de pedidos:', c: '// Cada linha do painel é uma linha do código M\nFonte\nCabecalhos = Table.PromoteHeaders(Fonte)\nTipos = Table.TransformColumnTypes(Cabecalhos, ...)\nFiltroValor = Table.SelectRows(Tipos, each [valor] <> null)', fig: { type: 'steps', items: ['Fonte', 'Cabeçalhos Promovidos', 'Tipo Alterado', 'Duplicadas Removidas', 'Linhas Filtradas', 'Colunas Renomeadas'], sel: 4, speech: 'Clicando numa etapa, você vê os dados exatamente como estavam naquele ponto.' } },
    ['Não acumule dezenas de etapas com nomes genéricos.', 'Não exclua uma etapa do meio sem conferir as seguintes.', 'Não confunda clicar na etapa com desfazer.'],
    [['Clicar numa etapa do painel:', 'Mostra os dados como estavam naquele ponto', 'Apaga a etapa', 'Desfaz a etapa', 'Atualiza a fonte', 'Retrato de cada momento.'],
      ['Inserir uma etapa no meio da consulta:', 'É possível, mas afeta as etapas seguintes', 'Não é permitido', 'Apaga as seguintes', 'Coloca a etapa no fim', 'A sequência muda.'],
      ['Uma boa prática com as etapas é:', 'Dar nomes que digam o que fazem', 'Nunca renomear', 'Criar uma etapa por coluna', 'Manter as inúteis', 'Facilita a manutenção.']]);

  lesson('tipos', 'Tipos de dados', 'TIPOS', 'Tipos de dados',
    'Cada coluna precisa do tipo certo: texto, número inteiro, decimal, decimal fixo (moeda), data, data/hora, verdadeiro/falso. O tipo garante somas, filtros e relacionamentos corretos. Códigos (CEP, SKU, pedido) são texto: não se somam e têm zeros à esquerda. Datas brasileiras exigem a localidade pt-BR para “03/01” virar 3 de janeiro.',
    'É como etiquetar as caixas da mudança: se a caixa de pratos está marcada como “roupas”, alguém vai jogá-la em qualquer lugar.',
    'Table.TransformColumnTypes(Fonte, {\n    {"pedido_id", type text},\n    {"data", type date},\n    {"valor", Currency.Type},\n    {"itens", Int64.Type}\n}, "pt-BR")',
    ['O terceiro argumento ("pt-BR") define a localidade da conversão.', 'Defina os tipos depois de limpar e antes de calcular.', 'Erros de tipo mostram valores que não podem ser convertidos.'],
    { p: 'Tipos da tabela de pedidos:', c: 'Tipos = Table.TransformColumnTypes(Cabecalhos, {\n    {"pedido_id", type text},     // código, não número\n    {"data", type date},          // com localidade pt-BR\n    {"uf", type text},\n    {"valor", Currency.Type}      // decimal fixo\n}, "pt-BR")', fig: T(['Coluna', 'Exemplo', 'Tipo'], [['pedido_id', '1001', 'Texto'], ['cep', '01310-100', 'Texto'], ['data', '03/01/2025', 'Data (pt-BR)'], ['itens', '3', 'Número inteiro'], ['valor', '189,90', 'Decimal fixo']], { speech: 'Códigos são texto, datas usam a localidade pt-BR e valores em reais são decimal fixo.' }) },
    ['Não deixe colunas com o tipo Qualquer.', 'Não converta códigos para número.', 'Não confie na detecção automática para datas brasileiras.'],
    [['O código “00452” virou 452 porque:', 'A coluna foi convertida para número', 'O arquivo está corrompido', 'Faltou aparar', 'Foi dividido', 'Códigos devem ser texto.'],
      ['Para “03/01/2025” virar 3 de janeiro, use:', 'Alterar tipo usando a localidade pt-BR', 'Tipo texto', 'Dividir por “/”', 'Coluna condicional', 'Formato dia/mês.'],
      ['O melhor tipo para valores em reais é:', 'Decimal fixo (moeda)', 'Texto', 'Data', 'Verdadeiro/falso', 'Precisão para dinheiro.']]);

  // ---- Etapa 1.2 · Limpeza básica
  lesson('colunas', 'Colunas', 'COLUNAS', 'Escolher, remover e renomear colunas',
    'Comece tirando o que não será usado: menos colunas, consulta mais leve. “Escolher Colunas” mantém só as listadas e é mais robusto quando a fonte ganha colunas novas. Renomeie com nomes claros numa única etapa. Use a guia Transformar para alterar uma coluna e a guia Adicionar Coluna para criar uma nova a partir dela.',
    'Antes de cozinhar, você separa só os ingredientes da receita. O resto volta para a geladeira.',
    'Table.SelectColumns(Tipos, {"pedido_id", "data", "canal", "valor"})\nTable.RemoveColumns(Tipos, {"obs", "usuario_criacao"})\nTable.RenameColumns(Tipos, {{"VLR_TOT", "Valor do pedido"}})\nTable.DuplicateColumn(Tipos, "data", "data_original")',
    ['Escolher Colunas ignora colunas novas na fonte.', 'Renomeie cedo e numa etapa só.', 'Adicionar Coluna preserva a coluna original.'],
    { p: 'Das 45 colunas do ERP para as 5 necessárias:', c: 'Escolhidas = Table.SelectColumns(Cabecalhos,\n    {"pedido_id", "uf", "canal", "cliente", "VLR_TOT"}),\nRenomeadas = Table.RenameColumns(Escolhidas,\n    {{"VLR_TOT", "valor"}})', fig: pedLimpo },
    ['Não remova colunas listando as que saem quando a fonte muda com frequência.', 'Não deixe nomes técnicos como “VLR_TOT_C/IMP”.', 'Não transforme a coluna original quando precisar dela depois.'],
    [['Quando a fonte pode ganhar colunas novas, é mais robusto usar:', 'Escolher Colunas', 'Remover Colunas', 'Ocultar no Excel', 'Apagar na fonte', 'Mantém só as listadas.'],
      ['Para criar o Ano mantendo a data, use a guia:', 'Adicionar Coluna', 'Transformar', 'Página Inicial', 'Exibir', 'Cria coluna nova.'],
      ['A função M que renomeia colunas é:', 'Table.RenameColumns', 'Table.SelectRows', 'Text.Trim', 'Table.Group', 'Renomeia por pares {antigo, novo}.']]);

  lesson('filtros', 'Filtrar linhas', 'FILTROS', 'Filtrar linhas',
    'Filtros removem as linhas que não interessam: registros de teste, valores nulos, períodos fora do escopo. Atenção: o filtro de texto diferencia maiúsculas e minúsculas (“App” é diferente de “app”), então padronize antes. Para períodos que mudam, use filtros relativos (“últimos 30 dias”, “este ano”) em vez de datas digitadas.',
    'É a peneira da farinha: o que passa vai para o bolo; o que fica, não serve para esta receita.',
    'Table.SelectRows(Tipos, each [valor] <> null)\nTable.SelectRows(Tipos, each [canal] = "App")\nTable.SelectRows(Tipos, each [status] <> "Teste")\nTable.SelectRows(Tipos, each Date.IsInPreviousNDays([data], 30))',
    ['each … aplica a condição a cada linha.', 'Filtros cedo deixam a consulta mais rápida.', 'Combine condições com and e or.'],
    { p: 'Filtro de canal com e sem padronização:', c: '// Sem padronizar: “app” (pedido 1006) fica de fora\nApp = Table.SelectRows(SemDuplicadas, each [canal] = "App"),  // ' + PD.uniq.filter(function (x) { return x[3] === 'App'; }).length + ' linhas\n\n// Padronizando antes: entram todos\nPadrao = Table.TransformColumns(SemDuplicadas, {{"canal", Text.Proper}}),\nApp2 = Table.SelectRows(Padrao, each [canal] = "App")       // ' + PD.appTodos.length + ' linhas', fig: PD.pedFig },
    ['Não filtre texto sem padronizar maiúsculas.', 'Não digite datas fixas em relatórios recorrentes.', 'Não filtre o escopo do relatório quando a intenção é só limpar.'],
    [['O filtro canal = "App" ignora “app” porque:', 'O texto em M diferencia maiúsculas e minúsculas', 'O pedido está duplicado', 'O tipo está errado', 'Falta aparar', 'Padronize antes.'],
      ['Para mostrar sempre os últimos 30 dias, use:', 'Um filtro relativo de data', 'Datas digitadas', 'Remover linhas superiores', 'Manter linhas inferiores', 'Ajusta-se sozinho.'],
      ['Table.SelectRows(Tipos, each [valor] <> null) remove:', 'As linhas com valor nulo', 'A coluna valor', 'Os valores zero', 'As duplicadas', 'Mantém só valores preenchidos.']]);

  lesson('duplicadas', 'Duplicadas e erros', 'DUPLICADAS', 'Duplicadas e erros',
    'Remover Duplicadas compara as colunas selecionadas: selecione a chave (pedido_id) para garantir um registro por pedido. Erros aparecem quando uma conversão falha, como o texto “a confirmar” virando número. Antes de remover ou substituir erros, use Manter Erros para entender a causa: eles revelam problemas da origem.',
    'É revisar a lista de convidados: nomes repetidos saem, e quem está com o telefone errado merece uma ligação antes de ser cortado.',
    'Table.Distinct(Tipos, {"pedido_id"})          // duplicadas pela chave\nTable.SelectRowsWithErrors(Tipos, {"qtd"})     // Manter Erros\nTable.RemoveRowsWithErrors(Tipos, {"qtd"})     // Remover Erros\nTable.ReplaceErrorValues(Tipos, {{"qtd", 0}})  // Substituir Erros',
    ['Selecionar todas as colunas só remove linhas 100% idênticas.', 'Investigue os erros antes de tratar.', 'Remover duplicadas mantém a primeira ocorrência.'],
    { p: 'Limpeza da exportação de pedidos:', c: 'SemDuplicadas = Table.Distinct(Tipos, {"pedido_id"}),         // ' + PD.P.length + ' → ' + PD.uniq.length + ' linhas\nComValor = Table.SelectRows(SemDuplicadas, each [valor] <> null) // ' + PD.uniq.length + ' → ' + PD.validos.length + ' linhas', fig: pedLimpo },
    ['Não remova duplicadas sem saber qual é a chave.', 'Não remova erros às cegas.', 'Não substitua erros por zero quando o zero muda o resultado.'],
    [['Para garantir um registro por pedido, selecione antes de Remover Duplicadas:', 'A coluna pedido_id', 'Todas as colunas', 'A coluna valor', 'Nenhuma coluna', 'Compare pela chave.'],
      ['Antes de tratar erros de conversão, o ideal é:', 'Manter Erros para entender a causa', 'Remover Erros sem olhar', 'Mudar para o tipo Qualquer', 'Ignorar', 'Erros revelam problemas na origem.'],
      ['Table.Distinct(Tipos, {"pedido_id"}) faz:', 'Remove duplicadas pela coluna pedido_id', 'Conta pedidos', 'Ordena', 'Filtra nulos', 'Um registro por chave.']]);

  lesson('texto', 'Texto', 'TEXTO', 'Transformações de texto',
    'Textos chegam sujos: espaços nas pontas, caracteres invisíveis, maiúsculas misturadas. Aparar (Text.Trim) tira os espaços das pontas; Limpar (Text.Clean) remove caracteres de controle; Colocar Cada Palavra em Maiúscula (Text.Proper), MAIÚSCULAS e minúsculas padronizam. Extrair pega partes (primeiros caracteres, entre delimitadores) e Formatar adiciona prefixo ou sufixo.',
    'É passar a roupa antes da reunião: a camisa é a mesma, mas agora todo mundo reconhece que está arrumada.',
    'Table.TransformColumns(Tipos, {\n    {"cliente", each Text.Proper(Text.Trim(Text.Clean(_)))},\n    {"uf", Text.Upper},\n    {"sku", each "SKU-" & _}\n})\nText.BetweenDelimiters("NX-2025-001001", "-", "-")  // "2025"',
    ['Apare antes de mesclar ou procurar.', 'Padronize antes de filtrar ou agrupar.', '“_” representa o valor atual da coluna.'],
    { p: 'Padronizando cliente, UF e canal:', c: 'Padronizado = Table.TransformColumns(SemDuplicadas, {\n    {"cliente", each Text.Proper(Text.Trim(_))},\n    {"uf", Text.Upper},\n    {"canal", Text.Proper}\n})\n// " Ana Souza " → "Ana Souza" · "sp" → "SP" · "app" → "App"', fig: pedLimpo },
    ['Não mescle por texto sem aparar.', 'Não use Text.Proper em siglas (UF, SKU).', 'Não confunda Aparar (pontas) com remover todos os espaços.'],
    [['Para remover espaços no início e no fim, use:', 'Aparar (Text.Trim)', 'Limpar (Text.Clean)', 'MAIÚSCULAS', 'Dividir', 'Tira só as pontas.'],
      ['Text.Proper("carla dias") devolve:', '"Carla Dias"', '"CARLA DIAS"', '"carla dias"', '"Carla dias"', 'Cada palavra com inicial maiúscula.'],
      ['Para pegar “2025” em “NX-2025-001001”, use:', 'Texto entre delimitadores', 'Aparar', 'Prefixo', 'Remover duplicadas', 'Entre o 1º e o 2º “-”.']]);

  // ---- Etapa 1.3 · Estruturando tabelas
  lesson('cabecalhos', 'Cabeçalhos e linhas', 'CABEÇALHOS', 'Cabeçalhos e linhas do relatório',
    'Relatórios exportados vêm com capas, linhas em branco, subtotais e totais. Remova as linhas do topo, use a primeira linha como cabeçalho, filtre subtotais pelo conteúdo e remova o total final. Cuidado com cabeçalhos que mudam de nome a cada mês: as etapas guardam os nomes das colunas e quebram quando eles mudam.',
    'É tirar a embalagem antes de guardar as compras: caixa, plástico e etiqueta vão para o lixo, o produto vai para a prateleira.',
    'Table.Skip(Fonte, 3)                       // remover 3 linhas do topo\nTable.PromoteHeaders(SemTopo)              // primeira linha como cabeçalho\nTable.RemoveLastN(Cabecalhos, 1)           // remover o total final\nTable.SelectRows(SemTotal, each not Text.Contains([loja], "Subtotal"))',
    ['Filtrar pelo conteúdo é mais robusto que remover N linhas.', 'Promova os cabeçalhos antes de definir os tipos.', 'Peça à origem um layout estável quando possível.'],
    { p: 'Limpando o relatório do ERP:', c: 'let\n    Fonte = Excel.Workbook(File.Contents("relatorio_erp.xlsx")){0}[Data],\n    SemTopo = Table.Skip(Fonte, 3),\n    Cabecalhos = Table.PromoteHeaders(SemTopo),\n    SemSubtotais = Table.SelectRows(Cabecalhos,\n        each not Text.Contains([loja], "Subtotal")),\n    SemTotal = Table.RemoveLastN(SemSubtotais, 1)\nin\n    SemTotal', fig: T(['linha', 'conteúdo', 'ação'], [['1–3', 'Título, filtros e data do relatório', 'Remover linhas superiores'], ['4', 'loja · produto · vendas', 'Promover cabeçalho'], ['…', 'Subtotal Sudeste', 'Filtrar “não contém Subtotal”'], ['última', 'Total geral', 'Remover linhas inferiores']], { speech: 'Cada tipo de lixo do relatório tem sua etapa de limpeza.' }) },
    ['Não remova subtotais pela posição.', 'Não defina os tipos antes de promover os cabeçalhos.', 'Não dependa de cabeçalhos com o mês no nome.'],
    [['Para tirar subtotais espalhados entre os dados, o mais robusto é:', 'Filtrar “não contém Subtotal”', 'Remover linhas alternadas', 'Remover as últimas 5 linhas', 'Apagar na origem', 'Funciona com qualquer posição.'],
      ['Table.PromoteHeaders faz:', 'Usa a primeira linha como cabeçalho', 'Remove o cabeçalho', 'Ordena as colunas', 'Transpõe', 'Promove cabeçalhos.'],
      ['Cabeçalhos que mudam todo mês (“Vendas jan/25”) causam:', 'Quebra das etapas que citam o nome', 'Mais velocidade', 'Nada', 'Duplicadas', 'Etapas guardam nomes.']]);

  lesson('dividir', 'Dividir colunas', 'DIVIDIR', 'Dividir colunas',
    'Dividir Coluna separa um texto em partes por delimitador (vírgula, traço, espaço), por número de caracteres ou por posições. Escolha a ocorrência: mais à esquerda (duas partes), mais à direita ou a cada ocorrência (todas as partes). Nas opções avançadas, “Dividir em Linhas” cria uma linha para cada parte, ótimo para listas dentro de uma célula.',
    'É cortar a pizza: você decide se faz duas metades ou oito fatias, e onde passa a faca.',
    'Table.SplitColumn(Tipos, "sku",\n    Splitter.SplitTextByDelimiter("-"),\n    {"categoria", "codigo", "cor"})\nTable.SplitColumn(Tipos, "cliente",\n    Splitter.SplitTextByEachDelimiter({" "}, QuoteStyle.None, false),\n    {"primeiro_nome", "sobrenome"})',
    ['N delimitadores geram N + 1 partes.', 'Dividir em Linhas repete as outras colunas.', 'Defina os tipos das novas colunas depois.'],
    { p: 'Separando o SKU em três partes:', c: 'Dividido = Table.SplitColumn(Tipos, "sku",\n    Splitter.SplitTextByDelimiter("-", QuoteStyle.None),\n    {"categoria", "codigo", "cor"})\n// "ELE-0452-PRETO" → "ELE" | "0452" | "PRETO"', fig: T(['sku (antes)', 'categoria', 'codigo', 'cor'], [['ELE-0452-PRETO', 'ELE', '0452', 'PRETO'], ['CAS-1180-BRANCO', 'CAS', '1180', 'BRANCO'], ['ESP-0077-AZUL', 'ESP', '0077', 'AZUL']], { speech: 'Um delimitador consistente separa todas as partes do código.' }) },
    ['Não divida por número de caracteres quando os tamanhos variam.', 'Não esqueça que a parte numérica pode ter zeros à esquerda.', 'Não divida em colunas uma lista de tamanho variável: use linhas.'],
    [['“Rua A, 100, Centro, São Paulo, SP” dividido a cada vírgula gera:', '5 colunas', '4 colunas', '3 colunas', '1 coluna', '4 vírgulas, 5 partes.'],
      ['Para uma linha por tag em “frete; promoção; app”, use:', 'Dividir em Linhas', 'Dividir em Colunas', 'Transpor', 'Agrupar', 'Uma linha por parte.'],
      ['Para separar o primeiro nome do resto, divida no espaço:', 'Mais à esquerda', 'A cada ocorrência', 'Mais à direita', 'Por 4 caracteres', 'Duas partes: nome e restante.']]);

  lesson('substituir', 'Substituir e preencher', 'SUBSTITUIR', 'Substituir valores e preencher',
    'Substituir Valores padroniza variações (“Mkt”, “MKTPLACE” → “Marketplace”) e troca nulos por zero quando nulo significa zero. Marque “coincidir com o conteúdo inteiro da célula” para não trocar pedaços de outras palavras. Preencher Para Baixo copia o último valor não nulo para as linhas vazias, completando relatórios em que a região só aparece na primeira linha do grupo.',
    'É o corretor ortográfico com uma lista de substituições: troca “vc” por “você” só quando é a palavra inteira, não no meio de outra.',
    'Table.ReplaceValue(Tipos, "Mkt", "Marketplace", Replacer.ReplaceValue, {"canal"})\nTable.ReplaceValue(Tipos, null, 0, Replacer.ReplaceValue, {"desconto"})\nTable.ReplaceValue(Tipos, "SP", "São Paulo", Replacer.ReplaceText, {"uf"})  // troca pedaços!\nTable.FillDown(Tipos, {"regiao"})',
    ['Replacer.ReplaceValue troca a célula inteira; ReplaceText troca trechos.', 'Com muitas variações, use uma tabela de-para e mescle.', 'Preencher para baixo só funciona com null, não com texto vazio.'],
    { p: 'Completando a região do relatório:', c: 'Preenchido = Table.FillDown(Fonte, {"regiao"})\n// Sudeste, null, null, Sul, null\n// → Sudeste, Sudeste, Sudeste, Sul, Sul', fig: T(['regiao', 'loja', 'vendas'], [['Sudeste', 'Centro', 120], ['Sudeste', 'Paulista', 95], ['Sudeste', 'Moema', 80], ['Sul', 'Batel', 70], ['Sul', 'Moinhos', 65]], { speech: 'Depois de preencher para baixo, cada loja tem sua região.' }) },
    ['Não substitua trechos quando quer trocar a célula inteira.', 'Não substitua null por 0 quando nulo significa “sem informação”.', 'Converta textos vazios em null antes de preencher.'],
    [['A região só aparece na primeira linha do grupo. Use:', 'Preencher Para Baixo', 'Remover Linhas em Branco', 'Remover Duplicadas', 'Transpor', 'Copia o último valor não nulo.'],
      ['Substituir “SP” transformou “ESPANHA” em “ESão PauloANHA” porque:', 'A troca foi de trecho, não da célula inteira', 'O tipo estava errado', 'Faltou aparar', 'Houve duplicadas', 'Use a opção de célula inteira.'],
      ['Antes de calcular valor − desconto com descontos nulos, faça:', 'Substituir null por 0 no desconto', 'Remover as linhas', 'Mudar para texto', 'Preencher para cima', 'Conta com null dá null.']]);

  lesson('condicional', 'Coluna condicional', 'SE', 'Coluna condicional e coluna de exemplos',
    'A Coluna Condicional cria classificações sem escrever código: se valor > 300, “Alto”; senão, se valor > 100, “Médio”; senão, “Baixo”. As regras são avaliadas de cima para baixo e a primeira verdadeira vence, então coloque as mais restritivas primeiro. A Coluna de Exemplos deduz a transformação a partir de alguns resultados que você digita.',
    'É a triagem do pronto-socorro: os casos mais graves são avaliados primeiro; quem não se encaixa vai para a fila comum.',
    'Table.AddColumn(Tipos, "faixa", each\n    if [valor] = null then "Sem valor"\n    else if [valor] > 300 then "Alto"\n    else if [valor] > 100 then "Médio"\n    else "Baixo",\n    type text)',
    ['A ordem das regras importa.', 'Trate o null explicitamente.', 'Confira o código gerado pela Coluna de Exemplos.'],
    { p: 'Faixa de valor dos pedidos válidos:', c: 'Faixa = Table.AddColumn(ComValor, "faixa", each\n    if [valor] > 300 then "Alto"\n    else if [valor] > 100 then "Médio"\n    else "Baixo", type text)', fig: T(['pedido_id', 'valor', 'faixa'], PD.validos.map(function (x) { return [String(x[0]), f(x[5], 2), x[5] > 300 ? 'Alto' : x[5] > 100 ? 'Médio' : 'Baixo']; }), { speech: 'Cada pedido recebe sua faixa conforme o valor.' }) },
    ['Não coloque a regra mais ampla primeiro.', 'Não esqueça do caso “senão”.', 'Não defina a coluna sem tipo.'],
    [['Na coluna condicional, as regras são avaliadas:', 'De cima para baixo, e a primeira verdadeira vence', 'Todas ao mesmo tempo', 'De baixo para cima', 'Em ordem alfabética', 'A ordem importa.'],
      ['Com a regra “valor > 100 → Médio” antes de “valor > 300 → Alto”, um pedido de 410 vira:', 'Médio', 'Alto', 'Baixo', 'Erro', 'Para na primeira regra verdadeira.'],
      ['Para gerar a transformação a partir de exemplos digitados, use:', 'Coluna de Exemplos', 'Coluna Condicional', 'Coluna de Índice', 'Agrupar por', 'O Power Query deduz a fórmula.']]);

  /* ===================== NÍVEL 2 · COMBINAR E REMODELAR ===================== */
  // ---- Etapa 2.1 · Combinar consultas
  lesson('acrescentar', 'Acrescentar consultas', 'ACRESCENTAR', 'Acrescentar consultas (empilhar)',
    'Acrescentar empilha tabelas com o mesmo layout, uma embaixo da outra: vendas de janeiro, fevereiro e março; ou as planilhas de cinco lojas. As colunas são alinhadas pelo nome exato (inclusive maiúsculas). Se uma tabela tem “valor” e outra “Valor”, surgem duas colunas, cada uma com nulos. Padronize nomes e tipos antes.',
    'É juntar as folhas de presença de cada dia num único fichário: mesma folha, dias diferentes, uma atrás da outra.',
    'Table.Combine({Jan, Fev, Mar})\n// ou, na interface: Página Inicial > Acrescentar Consultas como Nova\nTable.AddColumn(Jan, "origem", each "Jan")  // marcar a origem',
    ['O total de linhas é a soma das tabelas.', 'Uma coluna de origem ajuda a rastrear.', 'Para muitos arquivos, prefira o conector de Pasta.'],
    { p: 'Empilhando três meses:', c: 'Trimestre = Table.Combine({Jan, Fev, Mar})\n// 1.200 + 1.350 + 1.100 = 3.650 linhas', fig: T(['Consulta', 'Linhas'], [['Jan', 1200], ['Fev', 1350], ['Mar', 1100], ['Trimestre (acrescentada)', 3650]], { tot: true, speech: 'Acrescentar soma as linhas das três consultas.' }) },
    ['Não acrescente tabelas com nomes de colunas diferentes.', 'Não confunda acrescentar com mesclar.', 'Não perca a informação de origem.'],
    [['Jan (1.200), Fev (1.350) e Mar (1.100) acrescentadas têm:', '3.650 linhas', '1.350 linhas', '1.200 linhas', '3 linhas', 'Soma das linhas.'],
      ['Acrescentar tabelas com “valor” e “Valor” gera:', 'Duas colunas diferentes, com nulos', 'Uma coluna somada', 'Um erro', 'A coluna some', 'Alinha pelo nome exato.'],
      ['Mesmo layout, períodos diferentes pedem:', 'Acrescentar', 'Mesclar', 'Pivot', 'Transpor', 'Empilhar linhas.']]);

  lesson('mesclar', 'Mesclar consultas', 'MESCLAR', 'Mesclar consultas (o PROCX do Power Query)',
    'Mesclar junta duas tabelas por uma ou mais colunas-chave, como um PROCX: a tabela de vendas recebe o nome e a categoria do produto. O resultado vem como uma coluna aninhada (Table), que você expande escolhendo as colunas. As chaves precisam ser idênticas: apare, limpe e padronize antes, ou as linhas não se encontram.',
    'É grampear a ficha do cliente em cada pedido: o número do cliente liga os dois papéis.',
    'Mesclado = Table.NestedJoin(Vendas, {"produto_id"},\n    Produtos, {"produto_id"}, "Produtos", JoinKind.LeftOuter),\nExpandido = Table.ExpandTableColumn(Mesclado, "Produtos",\n    {"nome", "categoria"})',
    ['Desmarque “Usar o nome da coluna original como prefixo” ao expandir.', 'A correspondência difusa ajuda com textos parecidos.', 'Mesclar por várias colunas: selecione-as na mesma ordem.'],
    { p: 'Trazendo o nome do produto para as vendas:', c: 'Mesclado = Table.NestedJoin(Vendas, {"produto_id"},\n    Produtos, {"produto_id"}, "Produtos", JoinKind.LeftOuter),\nExpandido = Table.ExpandTableColumn(Mesclado, "Produtos", {"nome"})\n// P05 não existe em Produtos: nome = null', fig: T(['venda_id', 'produto_id', 'qtd', 'nome'], [['1', 'P01', 2, 'Fone Bluetooth'], ['2', 'P02', 1, 'Mouse sem fio'], ['3', 'P01', 5, 'Fone Bluetooth'], ['4', 'P05', 3, 'null'], ['5', 'P03', 2, 'Teclado mecânico']], { speech: 'A venda do P05 fica sem nome: o produto não está no cadastro.' }) },
    ['Não mescle por chaves com espaços ou maiúsculas diferentes.', 'Não esqueça de expandir a coluna aninhada.', 'Não traga todas as colunas da outra tabela sem necessidade.'],
    [['Mesclar consultas equivale, no Excel, a:', 'PROCX', 'SOMA', 'CONCATENAR', 'Classificar', 'Busca por chave.'],
      ['Depois de mesclar, a coluna com “Table” deve ser:', 'Expandida', 'Excluída', 'Transformada em texto', 'Transposta', 'Escolha as colunas a trazer.'],
      ['“ Ana Souza ” não encontra “Ana Souza” porque:', 'As chaves não são idênticas (espaços)', 'O tipo de junção está errado', 'A tabela está vazia', 'Faltou agrupar', 'Apare antes.']]);

  lesson('juncoes', 'Tipos de junção', 'JUNÇÕES', 'Tipos de junção',
    'O tipo de junção define quais linhas ficam. Externa esquerda: todas da primeira, com dados da segunda quando houver. Interna: só as que casam. Externa completa: todas das duas. Externa direita: todas da segunda. Anti esquerda: só as da primeira sem par (ótima para achar inconsistências). Anti direita: só as da segunda sem par.',
    'Duas listas de convidados, a da noiva e a do noivo: a interna é quem está nas duas; a anti esquerda, quem só a noiva convidou.',
    'JoinKind.LeftOuter   // todas da esquerda\nJoinKind.Inner       // só as que casam\nJoinKind.FullOuter   // todas das duas\nJoinKind.RightOuter  // todas da direita\nJoinKind.LeftAnti    // só da esquerda, sem par\nJoinKind.RightAnti   // só da direita, sem par',
    ['Anti esquerda é ótima para auditoria (vendas de produto não cadastrado).', 'Interna pode “sumir” com linhas sem você perceber.', 'Confira a contagem de linhas depois da junção.'],
    { p: 'Vendas (P01, P02, P01, P05, P03) × Produtos (P01 a P04):', c: 'LeftOuter → ' + PD.J.leftOuter + ' linhas (P05 sem nome)\nInner     → ' + PD.J.inner + ' linhas\nLeftAnti  → ' + PD.J.leftAnti + ' linha (P05)\nRightAnti → ' + PD.J.rightAnti + ' linha (P04)\nFullOuter → ' + PD.J.fullOuter + ' linhas', fig: T(['Junção', 'Linhas', 'Quem fica'], [['Externa esquerda', PD.J.leftOuter, 'Todas as vendas'], ['Interna', PD.J.inner, 'Vendas com produto cadastrado'], ['Anti esquerda', PD.J.leftAnti, 'Venda do P05'], ['Anti direita', PD.J.rightAnti, 'Produto P04 sem venda'], ['Externa completa', PD.J.fullOuter, 'Tudo das duas tabelas']], { speech: 'Cada tipo de junção mantém um conjunto diferente de linhas.' }) },
    ['Não use interna sem conferir o que saiu.', 'Não confunda anti esquerda com externa esquerda.', 'Não ignore chaves duplicadas na tabela da direita: elas multiplicam linhas.'],
    [['Para achar vendas de produtos que não estão no cadastro, use:', 'Anti esquerda', 'Interna', 'Externa completa', 'Externa direita', 'Só da esquerda, sem par.'],
      ['A junção interna mantém:', 'Só as linhas que existem nas duas tabelas', 'Todas da esquerda', 'Todas da direita', 'Todas das duas', 'Interseção.'],
      ['Se a chave se repete na tabela da direita, a mesclagem pode:', 'Multiplicar as linhas da esquerda', 'Remover linhas', 'Dar erro de tipo', 'Somar valores', 'Uma linha para cada par.']]);

  lesson('pasta', 'Combinar arquivos', 'PASTA', 'Combinar arquivos de uma pasta',
    'O conector de Pasta lê todos os arquivos de uma pasta e os combina usando um arquivo de exemplo. O Power Query cria consultas auxiliares: o arquivo de exemplo, um parâmetro e a função “Transformar Arquivo”, aplicada a cada arquivo. Filtre extensões e nomes antes de combinar, e mantenha a coluna Source.Name para saber de onde veio cada linha.',
    'É uma esteira de fábrica: cada caixa (arquivo) que chega passa pela mesma máquina (função) e sai no mesmo formato.',
    'let\n    Fonte = Folder.Files("\\\\servidor\\vendas"),\n    SoCsv = Table.SelectRows(Fonte, each [Extension] = ".csv"\n        and Text.StartsWith([Name], "vendas_")),\n    Lidos = Table.AddColumn(SoCsv, "Dados", each #"Transformar Arquivo"([Content])),\n    Combinado = Table.ExpandTableColumn(Lidos, "Dados", {"pedido_id", "valor"})\nin\n    Combinado',
    ['Edite a consulta de exemplo para mudar o tratamento de todos os arquivos.', 'Novos arquivos na pasta entram na próxima atualização.', 'Extraia o período do nome do arquivo.'],
    { p: 'Doze meses numa consulta só:', c: 'Fonte = Folder.Files("\\\\servidor\\vendas"),\nSoCsv = Table.SelectRows(Fonte, each [Extension] = ".csv"),\nMes = Table.AddColumn(SoCsv, "mes", each Text.BetweenDelimiters([Name], "_", "."))\n// vendas_2025-01.csv → "2025-01"', fig: T(['Source.Name', 'pedido_id', 'valor'], [['vendas_2025-01.csv', '1001', '189,90'], ['vendas_2025-01.csv', '1002', '75,50'], ['vendas_2025-02.csv', '2001', '132,00'], ['vendas_2025-03.csv', '3001', '310,00']], { speech: 'A coluna Source.Name mostra de qual arquivo veio cada linha.' }) },
    ['Não deixe arquivos estranhos entrarem na combinação.', 'Não apague as consultas auxiliares.', 'Não combine arquivos com layouts diferentes sem tratar.'],
    [['A consulta “Transformar Arquivo” é:', 'A função aplicada a cada arquivo da pasta', 'Um backup', 'Um erro', 'Um parâmetro de data', 'Gerada do arquivo de exemplo.'],
      ['Para evitar que um “leia-me.txt” quebre a combinação:', 'Filtrar a extensão .csv antes de combinar', 'Proibir acesso à pasta', 'Combinar à mão', 'Desativar a atualização', 'Filtre a lista de arquivos.'],
      ['Para saber o mês de cada linha, use a coluna:', 'Source.Name', 'Content', 'Extension', 'Folder Path', 'Nome do arquivo de origem.']]);

  // ---- Etapa 2.2 · Remodelar
  lesson('agrupar', 'Agrupar por', 'AGRUPAR', 'Agrupar por',
    'Agrupar por resume a tabela: uma linha por grupo (canal, loja, mês) com agregações como soma, contagem, média, mínimo e máximo. No modo avançado, você cria várias agregações de uma vez e pode agrupar por mais de uma coluna. Atenção: agrupar muda a granularidade e as colunas não agregadas saem. No Power BI, agrupe só se o modelo nunca precisar do detalhe.',
    'É contar os votos por urna: a contagem por seção resume milhares de cédulas, mas você não sabe mais quem votou em quem.',
    'Table.Group(Pedidos, {"canal"}, {\n    {"vendas", each List.Sum([valor]), type number},\n    {"pedidos", each Table.RowCount(_), Int64.Type},\n    {"ticket", each List.Average([valor]), type number}\n})',
    ['Contar Linhas usa Table.RowCount(_).', '“Todas as Linhas” mantém o detalhe aninhado.', 'Agregações ignoram nulos.'],
    { p: 'Vendas por canal:', c: 'PorCanal = Table.Group(Pedidos, {"canal"}, {\n    {"vendas", each List.Sum([valor]), type number},\n    {"pedidos", each Table.RowCount(_), Int64.Type}\n})', fig: T(['canal', 'vendas', 'pedidos'], [['App', '584,30', 4], ['Site', '617,50', 3], ['Marketplace', '310,00', 1]], { speech: 'O Site tem menos pedidos que o App, mas vende um pouco mais.' }) },
    ['Não agrupe no Power Query o que o modelo precisa ver no detalhe.', 'Não esqueça de definir o tipo das agregações.', 'Não agrupe antes de limpar os textos da chave.'],
    [['Depois de agrupar por canal, a coluna cliente:', 'Sai, pois não foi agrupada nem agregada', 'Fica igual', 'Vira soma', 'Vira erro', 'A granularidade muda.'],
      ['Para soma, contagem e média de uma vez, use:', 'O modo avançado do Agrupar por', 'Três consultas', 'Coluna condicional', 'Transpor', 'Várias agregações.'],
      ['Table.RowCount(_) dentro do Agrupar por calcula:', 'A quantidade de linhas do grupo', 'A soma', 'A média', 'O máximo', 'Contar linhas.']]);

  lesson('unpivot', 'Transformar colunas em linhas', 'UNPIVOT', 'Transformar colunas em linhas (unpivot)',
    'Planilhas costumam vir no formato largo: uma coluna por mês. Para o modelo, o formato longo é melhor: uma linha por loja e mês, com as colunas Atributo e Valor. Selecione as colunas fixas (loja) e use “Transformar Outras Colunas em Linhas”: assim, meses novos entram automaticamente. É uma das transformações mais úteis do Power Query.',
    'É transformar uma tabela de horários escolares (dias nas colunas) numa agenda (uma linha por aula com o dia ao lado).',
    'Table.UnpivotOtherColumns(Metas, {"loja"}, "mes", "meta")\n// Selecionar colunas = Table.Unpivot(Metas, {"jan", "fev", "mar"}, "mes", "meta")',
    ['Linhas resultantes = linhas × colunas transformadas.', 'Renomeie Atributo e Valor para nomes claros.', 'Depois, converta o mês em data para relacionar com o calendário.'],
    { p: 'Metas do formato largo para o longo:', c: 'Longo = Table.UnpivotOtherColumns(Metas, {"loja"}, "mes", "meta")\n// 4 lojas × 3 meses = 12 linhas', fig: T(['loja', 'mes', 'meta'], [['Centro', 'jan', 120], ['Centro', 'fev', 130], ['Centro', 'mar', 125], ['Norte', 'jan', 80], ['Norte', 'fev', 85], ['Norte', 'mar', 90], ['…', '…', '…']], { speech: 'Cada loja passa a ter uma linha por mês.' }) },
    ['Não liste os meses quando eles podem aumentar: use “Outras Colunas”.', 'Não deixe os nomes Atributo e Valor.', 'Não carregue o formato largo no modelo.'],
    [['4 lojas e 3 colunas de meses, após o unpivot, viram:', '12 linhas', '7 linhas', '4 linhas', '3 linhas', '4 × 3.'],
      ['A opção mais robusta para meses novos é:', 'Transformar Outras Colunas em Linhas', 'Transformar Colunas em Linhas', 'Transpor', 'Agrupar', 'Fixa só a loja.'],
      ['O formato ideal para o modelo do Power BI é:', 'Longo (uma coluna de mês)', 'Largo (uma coluna por mês)', 'Transposto', 'Qualquer um', 'Facilita filtros e tempo.']]);

  lesson('pivot', 'Colunas dinâmicas', 'PIVOT', 'Colunas dinâmicas (pivot) e transpor',
    'Coluna Dinâmica é o inverso do unpivot: os valores de uma coluna (indicador: Vendas, Pedidos, Ticket) viram novas colunas. Escolha a coluna de valores e a agregação; use “Não Agregar” quando cada combinação aparece uma vez só. Transpor gira a tabela inteira, trocando linhas por colunas. O formato largo é bom para leitura; para o modelo, prefira o longo.',
    'É montar a tabela do campeonato: cada rodada (linha) vira uma coluna de pontos para cada time.',
    'Table.Pivot(Indicadores, List.Distinct(Indicadores[indicador]),\n    "indicador", "valor")              // Não Agregar\nTable.Pivot(Vendas, List.Distinct(Vendas[mes]), "mes", "valor", List.Sum)\nTable.Transpose(Fonte)',
    ['Com valores repetidos, “Não Agregar” gera erro.', 'Pivot cria colunas com nomes que vêm dos dados.', 'Transpor costuma vir junto de promover cabeçalhos.'],
    { p: 'Indicadores por loja:', c: 'Largo = Table.Pivot(Indicadores,\n    List.Distinct(Indicadores[indicador]), "indicador", "valor")', fig: T(['loja', 'Vendas', 'Pedidos', 'Ticket'], [['Centro', 120000, 640, '187,50'], ['Norte', 80000, 520, '153,85'], ['Sul', 95000, 560, '169,64']], { speech: 'Depois do pivot, cada indicador vira uma coluna.' }) },
    ['Não carregue tabelas pivotadas no modelo sem necessidade.', 'Não use “Não Agregar” com valores repetidos.', 'Não confunda pivot com transpor.'],
    [['Pivot é o inverso de:', 'Transformar colunas em linhas (unpivot)', 'Mesclar', 'Acrescentar', 'Agrupar', 'Linhas viram colunas.'],
      ['Quando cada célula do pivot tem um único valor, use a agregação:', 'Não Agregar', 'Soma', 'Contagem', 'Média', 'Mantém o valor original.'],
      ['Para girar a tabela inteira, trocando linhas por colunas, use:', 'Transpor', 'Coluna Dinâmica', 'Unpivot', 'Agrupar', 'Rotação completa.']]);

  lesson('datas', 'Datas e calendário', 'DATAS', 'Datas e tabela calendário',
    'As funções Date.* extraem ano, mês, dia da semana, início do mês e muito mais. Subtrair datas gera uma duração, e Duration.Days dá o número de dias. A tabela calendário pode ser criada com List.Dates, com início e fim dinâmicos (List.Min e List.Max das datas da fato). Para relacionar, a coluna da fato precisa ser Data, sem hora.',
    'O calendário é a régua do tempo do modelo: todas as tabelas medem as datas com ela.',
    'Inicio = List.Min(Pedidos[data]),\nFim = List.Max(Pedidos[data]),\nDatas = List.Dates(Inicio, Duration.Days(Fim - Inicio) + 1, #duration(1, 0, 0, 0)),\nCalendario = Table.FromList(Datas, Splitter.SplitByNothing(), {"Data"}),\nComAno = Table.AddColumn(Calendario, "Ano", each Date.Year([Data]))',
    ['2025 tem 365 dias; 2024, 366.', 'Date.DayOfWeekName([Data], "pt-BR") devolve o nome em português.', 'DateTime.Date tira a hora.'],
    { p: 'Calendário de 2025 com colunas úteis:', c: 'Datas = List.Dates(#date(2025, 1, 1), 365, #duration(1, 0, 0, 0)),\nCal = Table.FromList(Datas, Splitter.SplitByNothing(), {"Data"}),\nCal2 = Table.AddColumn(Cal, "Mes", each Date.Month([Data])),\nCal3 = Table.AddColumn(Cal2, "DiaSemana", each Date.DayOfWeekName([Data], "pt-BR"))', fig: T(['Data', 'Ano', 'Mes', 'DiaSemana'], [['01/01/2025', 2025, 1, 'quarta-feira'], ['02/01/2025', 2025, 1, 'quinta-feira'], ['03/01/2025', 2025, 1, 'sexta-feira'], ['…', '…', '…', '…'], ['31/12/2025', 2025, 12, 'quarta-feira']], { speech: 'O calendário tem uma linha por dia, com ano, mês e dia da semana.' }) },
    ['Não relacione data com hora ao calendário.', 'Não digite datas fixas de início e fim.', 'Não esqueça os anos bissextos.'],
    [['Para cobrir 2025 inteiro, List.Dates precisa de:', '365 dias', '366 dias', '360 dias', '12 dias', '2025 não é bissexto.'],
      ['Para os dias entre o pedido e a entrega, use:', 'Duration.Days([entrega] - [data_pedido])', '[entrega] + [data_pedido]', 'Date.Year([entrega])', 'Text.Length([entrega])', 'Diferença de datas.'],
      ['Para um calendário que acompanha os dados, o início deve ser:', 'List.Min da coluna de data da fato', 'Uma data digitada', 'Sempre 1900', 'A data de hoje', 'Dinâmico.']]);

  // ---- Etapa 2.3 · Linguagem M
  lesson('let', 'Estrutura let', 'LET', 'A estrutura let … in',
    'Toda consulta é um código M no formato let … in. Dentro do let, cada etapa tem um nome e uma expressão, separadas por vírgula (a última não leva vírgula). Cada etapa normalmente usa a anterior como entrada. Depois do in vem a etapa que a consulta devolve. Nomes com espaço ou acento são escritos como #"Nome da Etapa". Tudo diferencia maiúsculas e minúsculas.',
    'É uma receita numerada: cada passo usa o resultado do anterior, e o “in” diz qual prato vai para a mesa.',
    'let\n    Fonte = Csv.Document(File.Contents("vendas.csv"), [Delimiter = ";"]),\n    Cabecalhos = Table.PromoteHeaders(Fonte),\n    Tipos = Table.TransformColumnTypes(Cabecalhos, {{"valor", type number}}),\n    Filtradas = Table.SelectRows(Tipos, each [valor] <> null)\nin\n    Filtradas',
    ['Abra o código em Página Inicial > Editor Avançado.', 'Comentários: // linha ou /* bloco */.', 'Renomeie as etapas sem espaços para um código mais limpo.'],
    { p: 'A consulta de pedidos no Editor Avançado:', c: 'let\n    Fonte = Csv.Document(File.Contents("pedidos.csv"), [Delimiter = ";"]),\n    Cabecalhos = Table.PromoteHeaders(Fonte),\n    SemDuplicadas = Table.Distinct(Cabecalhos, {"pedido_id"}),\n    // o resultado da consulta é a etapa depois do in\n    ComValor = Table.SelectRows(SemDuplicadas, each [valor] <> null)\nin\n    ComValor', fig: { type: 'steps', items: ['Fonte', 'Cabecalhos', 'SemDuplicadas', 'ComValor'], sel: 3, speech: 'Cada linha do let é uma etapa do painel; a do in é o resultado.' } },
    ['Não esqueça a vírgula entre as etapas.', 'Não coloque vírgula depois da última etapa.', 'Não escreva text.trim: o certo é Text.Trim.'],
    [['O que vem depois do in é:', 'A etapa devolvida pela consulta', 'A primeira etapa', 'Um comentário', 'A fonte', 'O resultado.'],
      ['Nomes de etapa com espaço são escritos como:', '#"Nome da Etapa"', '[Nome da Etapa]', '{Nome da Etapa}', '"Nome da Etapa"', 'Identificador com aspas e #.'],
      ['Na linguagem M, maiúsculas e minúsculas:', 'Fazem diferença', 'Não importam', 'Só importam em textos', 'Só importam em números', 'Text.Trim ≠ text.trim.']]);

  lesson('personalizada', 'Coluna personalizada', 'EACH', 'Coluna personalizada e each',
    'A Coluna Personalizada usa uma fórmula M aplicada a cada linha. As colunas da linha atual são referenciadas entre colchetes: [valor] - [desconto]. Por trás, o Power Query escreve Table.AddColumn(…, each …): each é um atalho para uma função que recebe a linha (_). Qualquer conta com null resulta em null, então trate os nulos.',
    'É a calculadora ao lado de cada linha da planilha: a mesma conta, aplicada linha por linha.',
    'Table.AddColumn(Tipos, "liquido", each [valor] - [desconto], type number)\nTable.AddColumn(Tipos, "com_imposto", each Number.Round([valor] * 1.1, 2), type number)\n// each [valor] é o mesmo que (_) => _[valor]\nTable.AddColumn(Tipos, "liquido2", each [valor] - (if [desconto] = null then 0 else [desconto]))',
    ['Defina o tipo no quarto argumento.', 'Use if … then … else para tratar nulos.', 'Prefira as funções prontas da interface quando existirem.'],
    { p: 'Valor com imposto de 10%:', c: 'ComImposto = Table.AddColumn(ComValor, "com_imposto",\n    each Number.Round([valor] * 1.1, 2), type number)\n// 410,00 → 451,00', fig: T(['pedido_id', 'valor', 'com_imposto'], PD.validos.slice(0, 5).map(function (x) { return [String(x[0]), f(x[5], 2), f(Math.round(x[5] * 1.1 * 100) / 100, 2)]; }), { speech: 'A coluna personalizada calcula o valor com imposto para cada pedido.' }) },
    ['Não escreva fórmulas de Excel (=A2-B2) no Power Query.', 'Não esqueça que null contamina a conta.', 'Não deixe a coluna sem tipo.'],
    [['Na Coluna Personalizada, a coluna valor é referenciada como:', '[valor]', '=valor', 'valor()', '{valor}', 'Colchetes para colunas.'],
      ['each [valor] > 300 equivale a:', '(_) => _[valor] > 300', 'Um laço que soma', 'Uma variável global', 'Um comentário', 'Função aplicada a cada linha.'],
      ['[valor] - [desconto] com desconto nulo resulta em:', 'null', '0', 'O valor', 'Erro de tipo', 'Conta com null dá null.']]);

  lesson('funcoes', 'Funções M', 'FUNÇÕES', 'Funções da linguagem M',
    'A linguagem M tem centenas de funções organizadas por prefixo: Text. (texto), Number. (números), Date. (datas), List. (listas), Table. (tabelas), Record. (registros). Os nomes diferenciam maiúsculas. Para descobrir uma função, digite = #shared numa consulta em branco ou consulte a documentação. Funções podem ser combinadas: Text.Proper(Text.Trim(_)).',
    'É uma caixa de ferramentas com gavetas etiquetadas: a gaveta Text. guarda tudo o que mexe com palavras.',
    'Text.Trim(" Ana ")                       // "Ana"\nText.Contains("Fone Bluetooth", "Bluetooth")  // true\nNumber.Round(189.456, 2)                 // 189.46\nDate.AddDays(#date(2025, 1, 3), 7)       // 10/01/2025\nText.Length(Text.Trim(" Ana Souza "))    // 9',
    ['Text.Contains aceita Comparer.OrdinalIgnoreCase.', 'Funções aninhadas são executadas de dentro para fora.', 'Ctrl + Espaço sugere funções no editor.'],
    { p: 'Funções combinadas na limpeza de clientes:', c: 'Limpo = Table.TransformColumns(Tipos, {\n    {"cliente", each Text.Proper(Text.Trim(Text.Clean(_))), type text}\n}),\nFlag = Table.AddColumn(Limpo, "bluetooth",\n    each Text.Contains([produto], "bluetooth", Comparer.OrdinalIgnoreCase))', fig: T(['Família', 'Exemplo', 'Resultado'], [['Text.', 'Text.Upper("sp")', '"SP"'], ['Number.', 'Number.Round(189.456, 2)', '189,46'], ['Date.', 'Date.Year(#date(2025, 1, 3))', '2025'], ['List.', 'List.Sum({1, 2, 3})', '6'], ['Table.', 'Table.RowCount(Pedidos)', PD.P.length]], { speech: 'Cada família de funções tem seu prefixo.' }) },
    ['Não escreva o nome da função em minúsculas.', 'Não confunda Text.Start (primeiros caracteres) com Text.StartsWith (teste).', 'Não reinvente o que já existe numa função pronta.'],
    [['text.trim([cliente]) dá erro porque:', 'O nome correto é Text.Trim (M diferencia maiúsculas)', 'Falta o each', 'Text.Trim não existe', 'O cliente é número', 'Maiúsculas importam.'],
      ['Para testar se o nome contém “Bluetooth”, use:', 'Text.Contains', 'Text.Start', 'Text.Length', 'Text.Upper', 'Devolve true ou false.'],
      ['Text.Length(Text.Trim(" Ana Souza ")) resulta em:', '9', '11', '8', '10', 'Sem os espaços das pontas.']]);

  lesson('listas', 'Listas e registros', 'LISTAS', 'Listas, registros e tabelas',
    'A linguagem M tem três estruturas principais. Lista: valores entre chaves, {1, 2, 3}. Registro: campos com nome entre colchetes, [nome = "Ana", uf = "SP"]. Tabela: uma coleção de registros com as mesmas colunas. Tabela[coluna] devolve uma lista; Tabela{0} devolve a primeira linha como registro (o índice começa em 0). As funções List.* trabalham sobre listas.',
    'Lista é uma fila de pessoas; registro é a ficha de uma pessoa; tabela é o fichário inteiro.',
    '{1, 2, 3}                         // lista\n[nome = "Ana", uf = "SP"]         // registro\nPedidos[valor]                    // coluna como lista\nPedidos{0}                        // primeira linha (registro)\nPedidos{0}[cliente]               // campo da primeira linha\nList.Sum(Pedidos[valor])          // soma da coluna',
    ['Posições começam em 0.', 'List.Distinct, List.Max, List.Count são muito usadas.', 'Registros guardam configurações (como as opções do CSV).'],
    { p: 'Usando a coluna como lista:', c: 'MaiorPedido = List.Max(Pedidos[valor]),\nUFs = List.Count(List.Distinct({"SP", "RJ", "MG", "SP", "BA", "RJ"})),  // 4\nPrimeiro = Pedidos{0}[cliente]', fig: T(['Estrutura', 'Exemplo', 'Uso típico'], [['Lista', '{189.9, 240, 98}', 'List.Sum, List.Max, filtros'], ['Registro', '[nome = "Ana", uf = "SP"]', 'Uma linha, opções'], ['Tabela', 'Pedidos', 'Todas as transformações']], { speech: 'Lista, registro e tabela são as três estruturas da linguagem M.' }) },
    ['Não comece a contar posições do 1.', 'Não confunda {} (lista) com [] (registro ou coluna).', 'Não use Table.* em listas nem List.* em tabelas.'],
    [['Pedidos{0}[cliente] devolve:', 'O cliente da primeira linha', 'O cliente da segunda linha', 'Todos os clientes', 'Um erro', 'O índice começa em 0.'],
      ['Pedidos[valor] devolve:', 'Uma lista com os valores da coluna', 'Um registro', 'Uma tabela', 'Um número', 'Coluna como lista.'],
      ['List.Count(List.Distinct({"SP", "RJ", "SP"})) resulta em:', '2', '3', '1', '0', 'Dois valores únicos.']]);

  /* ===================== NÍVEL 3 · AUTOMAÇÃO E PROJETO ===================== */
  // ---- Etapa 3.1 · Automação
  lesson('parametros', 'Parâmetros', 'PARÂMETROS', 'Parâmetros',
    'Parâmetros guardam valores que mudam: caminho da pasta, servidor do banco (homologação ou produção), data de início, uma taxa usada em várias consultas. Crie em Gerenciar Parâmetros e use pelo nome, sem aspas. Uma alteração vale para todas as consultas. No Power BI Service, parâmetros podem ser trocados nas configurações, sem abrir o arquivo.',
    'É o termostato da casa: você muda num lugar só e todos os cômodos se ajustam.',
    '// Página Inicial > Gerenciar Parâmetros > Novo Parâmetro\nCaminhoPasta = "\\\\servidor\\vendas" meta [IsParameterQuery = true, Type = "Text"]\n\nFonte = Folder.Files(CaminhoPasta)\nFiltradas = Table.SelectRows(Tipos, each [data] >= DataInicio)\nComImposto = Table.AddColumn(Tipos, "bruto", each [valor] * (1 + Imposto))',
    ['Parâmetros são usados pelo nome, sem aspas.', 'Defina o tipo do parâmetro (texto, data, número).', 'Parâmetros RangeStart e RangeEnd são a base da atualização incremental.'],
    { p: 'Trocando de ambiente com um parâmetro:', c: 'Servidor = "srv-prod" meta [IsParameterQuery = true, Type = "Text"],\nFonte = Sql.Database(Servidor, "nexus"),\nPedidos = Fonte{[Schema = "dbo", Item = "pedidos"]}[Data]', fig: T(['Parâmetro', 'Valor', 'Usado em'], [['CaminhoPasta', '\\\\servidor\\vendas', '3 consultas de arquivos'], ['Servidor', 'srv-prod', '5 consultas de banco'], ['DataInicio', '01/01/2025', 'Filtro de pedidos'], ['Imposto', '0,12', 'Valor bruto']], { speech: 'Quatro parâmetros controlam o projeto inteiro.' }) },
    ['Não repita o mesmo caminho em várias consultas.', 'Não use aspas ao referenciar o parâmetro.', 'Não esqueça de definir o tipo.'],
    [['Para trocar o caminho de 5 consultas de uma vez, use:', 'Um parâmetro', 'Cinco edições', 'Uma macro', 'Um gráfico', 'Centraliza o valor.'],
      ['O filtro correto com o parâmetro DataInicio é:', 'each [data] >= DataInicio', 'each [data] >= "DataInicio"', 'DataInicio(each)', 'Table.Parameter(DataInicio)', 'Pelo nome, sem aspas.'],
      ['Um bom candidato a parâmetro é:', 'O nome do servidor do banco', 'A palavra let', 'O nome da função Table.SelectRows', 'O símbolo de vírgula', 'Muda entre ambientes.']]);

  lesson('funcpers', 'Funções personalizadas', 'FUNÇÕES', 'Funções personalizadas',
    'Quando a mesma lógica se repete, crie uma função: (parâmetros) => expressão. Ela vira uma consulta que pode ser invocada em qualquer lugar, inclusive em cada linha (Invocar Função Personalizada) ou em cada valor de uma coluna (Table.TransformColumns). O combinar arquivos de pasta usa exatamente isso: uma função aplicada a cada arquivo.',
    'É criar um carimbo: em vez de desenhar o logotipo em cada folha, você carimba.',
    'LimparTexto = (t as nullable text) as nullable text =>\n    if t = null then null\n    else Text.Proper(Text.Clean(Text.Trim(t)))\n\nDesconto = (valor as number, pct as number) as number => valor * (1 - pct)\n\nTable.TransformColumns(Tipos, {{"cliente", LimparTexto}})\nTable.AddColumn(Tipos, "liquido", each Desconto([valor], 0.15))',
    ['Tipos nos parâmetros documentam e validam.', 'Funções podem receber tabelas inteiras.', 'Teste a função com Invocar antes de usar.'],
    { p: 'A mesma limpeza em todas as colunas de texto:', c: 'LimparTexto = (t as nullable text) =>\n    if t = null then null else Text.Proper(Text.Trim(t)),\n\nLimpo = Table.TransformColumns(Pedidos, {\n    {"cliente", LimparTexto}, {"cidade", LimparTexto}, {"bairro", LimparTexto}\n})', fig: T(['Chamada', 'Resultado'], [['LimparTexto(" ana souza ")', '"Ana Souza"'], ['LimparTexto(null)', 'null'], ['Desconto(240, 0.15)', '204'], ['Desconto(100, 0.1)', '90']], { speech: 'A mesma função, chamada com valores diferentes.' }) },
    ['Não copie as mesmas etapas em várias consultas.', 'Não esqueça de tratar null dentro da função.', 'Não crie funções gigantes: prefira várias pequenas.'],
    [['Desconto = (valor, pct) => valor * (1 - pct). Desconto(240, 0.15) é:', '204', '36', '240', '255', '240 × 0,85.'],
      ['Para aplicar uma função a cada valor de uma coluna, use:', 'Table.TransformColumns', 'Table.Combine', 'Table.Pivot', 'Table.Transpose', 'Transforma cada valor.'],
      ['A sintaxe de uma função em M é:', '(parâmetros) => expressão', 'function()', 'def f():', '=FUNÇÃO()', 'Seta “=>”.']]);

  lesson('erros', 'Tratamento de erros', 'TRY', 'Tratamento de erros com try',
    'try expressão otherwise alternativa captura o erro e devolve um valor substituto, sem quebrar a consulta. Sem o otherwise, try devolve um registro com HasError, Value e Error, útil para auditoria: você sabe qual linha falhou e por quê. Combine com seleções resilientes de colunas (MissingField.UseNull) para consultas que sobrevivem a mudanças na origem.',
    'É a rede de proteção do trapezista: se ele cair, a apresentação continua, e alguém anota o que deu errado.',
    'Table.AddColumn(Tipos, "qtd_num", each try Number.From([qtd]) otherwise 0)\n\n// Para auditar:\nTentativa = Table.AddColumn(Tipos, "t", each try Number.From([qtd])),\nExpandido = Table.ExpandRecordColumn(Tentativa, "t", {"HasError", "Value"})\n\nTable.SelectColumns(Fonte, {"pedido_id", "valor"}, MissingField.UseNull)',
    ['otherwise define o valor quando dá erro.', 'Crie uma consulta de erros para revisar.', 'try não substitui corrigir a origem.'],
    { p: 'Convertendo a quantidade com segurança:', c: 'QtdNum = Table.AddColumn(Fonte, "qtd_num",\n    each try Number.From([qtd]) otherwise 0, Int64.Type)\n// "3" → 3 · "a confirmar" → 0 · "-" → 0', fig: T(['qtd (texto)', 'try Number.From([qtd]) otherwise 0'], [['3', 3], ['12', 12], ['a confirmar', 0], ['-', 0], ['7', 7]], { speech: 'Os textos que não viram número caem no otherwise e recebem zero.' }) },
    ['Não esconda erros sem registrar.', 'Não use 0 como alternativa quando zero muda a análise.', 'Não deixe a consulta quebrar por uma coluna ausente.'],
    [['try Number.From("a confirmar") otherwise 0 resulta em:', '0', 'Erro', 'null', '"a confirmar"', 'Cai no otherwise.'],
      ['try sem otherwise devolve:', 'Um registro com HasError, Value e Error', 'Sempre null', 'Sempre 0', 'Um erro', 'Útil para auditoria.'],
      ['MissingField.UseNull em Table.SelectColumns:', 'Cria a coluna com null se ela não existir na fonte', 'Remove a coluna', 'Gera erro', 'Ordena', 'Resiliência a mudanças.']]);

  lesson('organizacao', 'Referência e organização', 'ORGANIZAR', 'Referência, duplicar e organização do projeto',
    'Referência cria uma nova consulta que começa no resultado de outra: a base é tratada uma vez e várias consultas partem dela. Duplicar copia todas as etapas, que passam a ser independentes (e é preciso manter duas cópias). Organize o projeto em camadas (origem, staging, modelo), agrupe as consultas e desabilite a carga das intermediárias.',
    'Referência é seguir a mesma receita-base de massa para vários sabores de pizza; duplicar é reescrever a receita da massa em cada caderno.',
    '// Referência: a nova consulta começa assim\nlet\n    Fonte = PedidosBase\nin\n    Fonte\n\n// Camadas\n// 1. Origem   → conexão crua (carga desabilitada)\n// 2. Staging  → limpeza e tipos (carga desabilitada)\n// 3. Modelo   → dimensões e fatos (carregadas)',
    ['Clique com o botão direito > Habilitar Carga para desmarcar.', 'Grupos: Parâmetros, Funções, Staging, Dimensões, Fatos.', 'Nomes: prefixos como stg_, dim_, fat_.'],
    { p: 'Projeto organizado:', c: '// Grupo Staging (sem carga)\nstg_Pedidos = ... limpeza ...\n\n// Grupo Modelo (com carga)\nfat_Vendas = Table.SelectColumns(stg_Pedidos, {"pedido_id", "data", "cliente_id", "valor"})\ndim_Clientes = Table.Distinct(Table.SelectColumns(stg_Pedidos, {"cliente_id", "cliente", "uf"}), {"cliente_id"})', fig: { type: 'steps', head: 'Consultas', items: ['Parâmetros · CaminhoPasta', 'Funções · LimparTexto', 'Staging · stg_Pedidos (sem carga)', 'Modelo · dim_Clientes', 'Modelo · dim_Produtos', 'Modelo · fat_Vendas'], sel: 2, speech: 'Consultas agrupadas por camada, com a carga só no que vai para o modelo.' } },
    ['Não duplique uma consulta quando uma referência resolve.', 'Não carregue consultas intermediárias no modelo.', 'Não deixe dezenas de consultas soltas e sem padrão de nome.'],
    [['Para duas consultas que partem da mesma base tratada, use:', 'Referência', 'Duplicar', 'Copiar e colar valores', 'Criar a base duas vezes', 'Mudanças na base valem para ambas.'],
      ['Consultas intermediárias que não devem ir para o modelo devem ter:', 'A carga desabilitada', 'Sido excluídas', 'Sido ocultadas no relatório', 'Sido duplicadas', 'Calculadas, mas não carregadas.'],
      ['A ordem das camadas é:', 'Origem, staging e modelo', 'Modelo, origem e staging', 'Staging, modelo e origem', 'Qualquer uma', 'Da fonte ao modelo.']]);

  // ---- Etapa 3.2 · Desempenho e atualização
  lesson('folding', 'Query folding', 'FOLDING', 'Query folding',
    'Com fontes como bancos de dados, o Power Query tenta traduzir as etapas para a linguagem da fonte (SQL): é o query folding. O servidor faz o trabalho e devolve só o resultado, como as 300 mil linhas de 2025 em vez dos 50 milhões do histórico. Filtros, seleção de colunas e agrupamentos costumam dobrar; índices, Table.Buffer e funções sem equivalente quebram o folding, e daí em diante tudo roda no seu computador.',
    'É pedir ao restaurante só o prato que você vai comer, em vez de mandar entregar a cozinha inteira e escolher em casa.',
    '// Clique direito na etapa > Exibir Consulta Nativa\n// Gera algo como:\nselect [pedido_id], [data], [valor]\nfrom [dbo].[pedidos]\nwhere [data] >= \'2025-01-01\'',
    ['Faça primeiro tudo o que dobra (filtros, remover colunas).', 'Deixe para o fim as etapas que quebram o folding.', 'Os indicadores de etapa mostram onde o folding para.'],
    { p: 'Ordem que preserva o folding:', c: 'let\n    Fonte = Sql.Database("srv-prod", "nexus"),\n    Pedidos = Fonte{[Schema = "dbo", Item = "pedidos"]}[Data],\n    Ano2025 = Table.SelectRows(Pedidos, each [data] >= #date(2025, 1, 1)),  // dobra\n    Colunas = Table.SelectColumns(Ano2025, {"pedido_id", "data", "valor"}),  // dobra\n    Indice = Table.AddIndexColumn(Colunas, "idx", 1, 1)                      // quebra (no fim)\nin\n    Indice', fig: T(['Etapa', 'Dobra?'], [['Filtrar linhas', 'Sim'], ['Remover colunas', 'Sim'], ['Agrupar com soma', 'Sim'], ['Mesclar com outra tabela do mesmo banco', 'Sim'], ['Adicionar coluna de índice', 'Não'], ['Table.Buffer', 'Não']], { speech: 'Filtros, colunas e agrupamentos dobram; índices e buffer não.' }) },
    ['Não adicione índice antes dos filtros.', 'Não use Table.Buffer no começo da consulta de banco.', 'Não misture fontes diferentes antes de filtrar.'],
    [['Query folding significa:', 'Traduzir as etapas para a linguagem da fonte, que faz o trabalho', 'Dobrar a consulta em duas', 'Baixar tudo e filtrar localmente', 'Ocultar etapas', 'O servidor processa.'],
      ['Qual etapa costuma quebrar o folding?', 'Adicionar coluna de índice', 'Filtrar linhas', 'Remover colunas', 'Agrupar com soma', 'Não tem equivalente direto em SQL.'],
      ['Para conferir se a etapa dobra, use:', 'Exibir Consulta Nativa', 'Atualizar duas vezes', 'Contar as linhas', 'Olhar a cor da coluna', 'Mostra o SQL gerado.']]);

  lesson('desempenho', 'Desempenho', 'DESEMPENHO', 'Desempenho das consultas',
    'Consultas rápidas trazem menos dados desde o início: filtre linhas e remova colunas cedo, preserve o folding, evite mesclagens desnecessárias com tabelas enormes e crie colunas o mais perto possível da fonte (no banco ou no Power Query, não em DAX). Table.Buffer ajuda quando uma tabela pequena é reutilizada muitas vezes, mas consome memória e quebra o folding.',
    'É fazer a mala para uma viagem curta: leve só o necessário. Mala leve, viagem rápida.',
    '// Menos colunas, menos linhas, cedo\nColunas = Table.SelectColumns(Fonte, {"pedido_id", "data", "valor"}),\nAno = Table.SelectRows(Colunas, each Date.Year([data]) = 2025),\n// Buffer só para tabela pequena reutilizada\nProdutosMem = Table.Buffer(Produtos)',
    ['Cada coluna removida reduz o modelo e a atualização.', 'Desative “detecção de tipos” se for definir os tipos à mão.', 'Use o Diagnóstico de Consulta para medir as etapas.'],
    { p: 'Antes e depois da otimização:', c: '// Antes: 60 colunas, 8 anos, índice no início → 25 min\n// Depois: 12 colunas, filtro de período, folding preservado → 4 min\nColunas = Table.SelectColumns(Fonte, ListaColunas),\nPeriodo = Table.SelectRows(Colunas, each [data] >= DataInicio)', fig: { type: 'hbars', labels: ['Antes', 'Depois'], values: [25, 4], hl: 1, unit: ' min', d: 0, title: 'Tempo de atualização', speech: 'A atualização caiu de 25 para 4 minutos.' } },
    ['Não carregue colunas que o modelo não usa.', 'Não use Table.Buffer em tudo.', 'Não crie em DAX colunas que podem vir da fonte.'],
    [['Remover 48 de 60 colunas não usadas elimina:', '80% das colunas', '48%', '20%', '12%', '48 ÷ 60.'],
      ['Table.Buffer é útil quando:', 'Uma tabela pequena é reutilizada muitas vezes', 'Em todas as etapas', 'Para garantir o folding', 'Para remover colunas', 'Evita reler a tabela.'],
      ['Colunas derivadas devem ser criadas, de preferência:', 'O mais perto possível da fonte', 'Sempre em DAX', 'No visual', 'À mão no Excel', 'Comprimem melhor e pesam menos.']]);

  lesson('privacidade', 'Privacidade e credenciais', 'PRIVACIDADE', 'Níveis de privacidade e credenciais',
    'Ao combinar fontes, o Power Query protege os dados com níveis de privacidade: Privado (dados sensíveis, isolados), Organizacional (pode combinar dentro da empresa) e Público. O erro Formula.Firewall aparece quando uma consulta mistura fontes de forma insegura. Credenciais ficam nas configurações de cada usuário ou do serviço, nunca no código: quem abre o arquivo precisa ter o próprio acesso.',
    'É o cofre com várias chaves: cada pessoa tem a sua, e o cofre não aceita que alguém cole a senha num post-it na porta.',
    '// Arquivo > Opções > Configurações da Fonte de Dados\n// Nível de privacidade por fonte: Privado | Organizacional | Público\n// Credenciais: Windows, Banco de dados, Conta Microsoft…\n// Erro típico: Formula.Firewall: a consulta referencia outras consultas\n//              ou etapas e não pode acessar a fonte diretamente',
    ['Reorganize consultas (uma por fonte) para evitar o firewall.', 'Ignorar os níveis só é aceitável em ambiente controlado.', 'Credenciais não viajam com o arquivo.'],
    { p: 'Configuração das fontes do projeto:', c: '// Fonte                          Nível\n// SQL Server de RH (salários)    Privado\n// SharePoint interno             Organizacional\n// API pública de cotação         Público', fig: T(['Fonte', 'Nível', 'Por quê'], [['Banco de RH', 'Privado', 'Dados sensíveis'], ['Cadastro de clientes (CPF)', 'Privado', 'Dados pessoais'], ['SharePoint da empresa', 'Organizacional', 'Uso interno'], ['Cotação do dólar', 'Público', 'Dado aberto']], { speech: 'Cada fonte recebe o nível de privacidade de acordo com a sensibilidade.' }) },
    ['Não coloque senha no código M.', 'Não marque fontes sensíveis como públicas.', 'Não desligue a privacidade sem entender o risco.'],
    [['O erro Formula.Firewall indica:', 'Mistura de fontes com níveis de privacidade incompatíveis', 'Arquivo corrompido', 'Banco fora do ar', 'Falta de each', 'Proteção contra vazamento.'],
      ['Um banco com salários deve ter nível:', 'Privado', 'Público', 'Organizacional', 'Nenhum', 'Dados sensíveis.'],
      ['Quando um colega abre o arquivo e o Power Query pede login, é porque:', 'As credenciais ficam com cada usuário, não no arquivo', 'O arquivo perdeu as consultas', 'O banco foi apagado', 'O colega não tem Excel', 'Proteção dos dados.']]);

  lesson('atualizacao', 'Atualização', 'ATUALIZAR', 'Atualização, gateway e incremental',
    'No Excel, configure “Atualizar ao abrir” ou a cada N minutos nas propriedades da consulta. No Power BI Service, a atualização agendada precisa de um gateway de dados local para fontes da rede interna ou do computador (SQL Server local, pastas de rede); fontes na nuvem não precisam. Para tabelas enormes, a atualização incremental usa os parâmetros RangeStart e RangeEnd para recarregar só o período recente.',
    'O gateway é a ponte levadiça do castelo: o serviço na nuvem só entra na rede da empresa por ela.',
    '// Atualização incremental: filtro com os parâmetros reservados\nFiltrado = Table.SelectRows(Pedidos,\n    each [data] >= RangeStart and [data] < RangeEnd)\n// Política: manter 8 anos, atualizar os últimos 10 dias',
    ['RangeStart e RangeEnd devem ser do tipo Data/Hora.', 'O filtro incremental precisa dobrar na fonte.', 'Monitore o histórico de atualização no serviço.'],
    { p: 'Política de atualização dos pedidos:', c: 'Filtrado = Table.SelectRows(Pedidos,\n    each [data] >= RangeStart and [data] < RangeEnd)\n// Arquivar: 8 anos · Atualizar: últimos 10 dias\n// Carga diária: 2 h → 6 min', fig: T(['Fonte', 'Gateway?'], [['SQL Server na rede da empresa', 'Sim'], ['Pasta \\\\servidor\\vendas', 'Sim'], ['SharePoint Online', 'Não'], ['Azure SQL', 'Não'], ['Arquivo no C: de um notebook', 'Sim (e o notebook ligado)']], { speech: 'Fontes da rede interna precisam de gateway; fontes na nuvem, não.' }) },
    ['Não dependa de um notebook ligado para atualizar o relatório.', 'Não use incremental sem folding no filtro de data.', 'Não esqueça de configurar as credenciais no serviço.'],
    [['Para atualizar no serviço um SQL Server da rede interna, é preciso:', 'Um gateway de dados local', 'Nada', 'Abrir o Desktop todo dia', 'Copiar o banco para o OneDrive', 'A ponte até a rede interna.'],
      ['Os parâmetros da atualização incremental são:', 'RangeStart e RangeEnd', 'Inicio e Fim', 'DataMin e DataMax', 'From e To', 'Nomes reservados.'],
      ['Uma planilha no SharePoint Online precisa de gateway?', 'Não, é uma fonte na nuvem', 'Sim, sempre', 'Só no Excel', 'Só aos domingos', 'Nuvem acessa nuvem.']]);

  // ---- Etapa 3.3 · Modelagem e projeto
  lesson('estrela', 'Dimensões e fatos', 'ESTRELA', 'Preparando dimensões e fatos',
    'O Power Query é o lugar ideal para montar o modelo estrela. Fatos registram eventos (pedidos, devoluções) com chaves e medidas; dimensões descrevem (clientes, produtos, lojas, calendário). A partir de uma planilha única, crie as dimensões por referência, escolhendo as colunas descritivas e removendo duplicadas pela chave; a fato fica só com chaves e números. Cadeias de dimensões (floco de neve) podem ser mescladas numa só.',
    'É organizar uma biblioteca: o livro de empréstimos (fato) registra só o código do leitor e do livro; os detalhes ficam nos fichários de leitores e de livros (dimensões).',
    'dim_Produtos = Table.Distinct(\n    Table.SelectColumns(Base, {"produto_id", "produto", "categoria", "marca"}),\n    {"produto_id"}),\ndim_Clientes = Table.Distinct(\n    Table.SelectColumns(Base, {"cliente_id", "cliente", "cidade", "uf"}),\n    {"cliente_id"}),\nfat_Vendas = Table.SelectColumns(Base,\n    {"pedido_id", "data", "cliente_id", "produto_id", "qtd", "valor"})',
    ['Fatos estreitas e longas; dimensões largas e curtas.', 'Mescle Categorias em Produtos para evitar o floco de neve.', 'Dimensões saem por referência da base tratada.'],
    { p: 'Da planilha única ao modelo estrela:', c: '// Base: pedido, data, cliente, cidade, produto, categoria, valor (2 mi de linhas)\nfat_Vendas   → pedido_id, data, cliente_id, produto_id, valor\ndim_Clientes → cliente_id, cliente, cidade, uf\ndim_Produtos → produto_id, produto, categoria, marca\ndim_Calendario → Data, Ano, Mes, DiaSemana', fig: T(['Tabela', 'Tipo', 'Colunas'], [['fat_Vendas', 'Fato', 'pedido_id, data, cliente_id, produto_id, valor'], ['dim_Clientes', 'Dimensão', 'cliente_id, cliente, cidade, uf'], ['dim_Produtos', 'Dimensão', 'produto_id, produto, categoria, marca'], ['dim_Calendario', 'Dimensão', 'Data, Ano, Mes, DiaSemana']], { speech: 'Uma fato com chaves e números, cercada de dimensões descritivas.' }) },
    ['Não carregue nome, cidade e categoria repetidos na fato.', 'Não deixe dimensões em cadeia sem necessidade.', 'Não esqueça a dimensão calendário.'],
    [['A tabela de pedidos com data, cliente, produto e valor é:', 'Uma fato', 'Uma dimensão', 'Um parâmetro', 'Uma função', 'Registra eventos com medidas.'],
      ['Para criar dim_Produtos a partir da base, você:', 'Escolhe as colunas de produto e remove duplicadas pela chave', 'Acrescenta a base nela mesma', 'Agrupa por valor', 'Transpõe a base', 'Uma linha por produto.'],
      ['Produtos → Categorias em cadeia (floco de neve) se resolve com:', 'Mesclar Categorias em Produtos', 'Acrescentar', 'Pivot', 'Apagar a categoria', 'Uma dimensão única.']]);

  lesson('chaves', 'Chaves e granularidade', 'CHAVES', 'Chaves e granularidade',
    'A granularidade é o que representa cada linha: um pedido, um item do pedido, um dia por loja. As dimensões precisam de chave única para o relacionamento 1:N funcionar. Fatos com granularidades diferentes (vendas por dia e produto, metas por mês e categoria) convivem no modelo, ligadas a dimensões no nível comum. Quando não há id único, crie uma chave composta concatenando colunas.',
    'Granularidade é o zoom do mapa: país, estado ou rua. Comparar mapas com zooms diferentes exige um ponto de referência comum.',
    '// Chave única na dimensão\ndim_Clientes = Table.Distinct(Clientes, {"cliente_id"})\n\n// Chave composta\nComChave = Table.AddColumn(Estoque, "chave",\n    each [loja] & "|" & [produto_id] & "|" & Date.ToText([data], "yyyyMMdd"))',
    ['Defina a granularidade antes de carregar a fato.', 'Duplicidade na dimensão quebra o relacionamento.', 'Use um separador na chave composta.'],
    { p: 'Garantindo a chave única:', c: 'Clientes = Table.Sort(Bruto, {{"atualizado_em", Order.Descending}}),\ndim_Clientes = Table.Distinct(Clientes, {"cliente_id"})\n// C1, C2, C3, C2, C4, C1, C5, C3 → 5 clientes', fig: T(['cliente_id', 'antes (linhas)', 'depois'], [['C1', 2, 1], ['C2', 2, 1], ['C3', 2, 1], ['C4', 1, 1], ['C5', 1, 1], ['Total', 8, 5]], { tot: true, speech: 'Oito linhas viram cinco clientes únicos.' }) },
    ['Não carregue dimensão com chave repetida.', 'Não repita a meta mensal em cada venda diária.', 'Não crie chave composta sem separador.'],
    [['Na dimensão de um relacionamento 1:N, a chave deve ser:', 'Única', 'Repetida', 'Nula', 'Numérica sempre', 'Lado “1” da relação.'],
      ['Vendas por dia e metas por mês se relacionam:', 'Pelas dimensões no nível comum (mês, categoria)', 'Repetindo a meta em cada venda', 'Agrupando e descartando o detalhe', 'Não se relacionam', 'Cada fato no seu nível.'],
      ['C1, C2, C3, C2, C4, C1, C5, C3 sem duplicadas resultam em:', '5 clientes', '8 clientes', '4 clientes', '3 clientes', 'Valores únicos.']]);

  lesson('qualidade', 'Perfil e qualidade', 'QUALIDADE', 'Perfil e qualidade dos dados',
    'Em Exibir, ative Qualidade da Coluna (% de válidos, erros e vazios), Distribuição da Coluna (valores distintos e únicos) e Perfil da Coluna (estatísticas e histograma). Por padrão, o perfil usa só as primeiras 1.000 linhas: na barra de status, mude para “com base no conjunto de dados inteiro”. Antes de publicar, confira chaves únicas, tipos e a contagem de linhas contra a fonte.',
    'É o check-up antes da viagem: pneus, óleo e combustível. Um problema visto na garagem custa menos que na estrada.',
    '// Exibir > Qualidade da Coluna | Distribuição da Coluna | Perfil da Coluna\n// Barra de status: "Criação de perfil de coluna com base no conjunto de dados inteiro"\nTable.Profile(Pedidos)                 // estatísticas de todas as colunas\nTable.RowCount(Pedidos)                // reconciliar com a fonte',
    ['Válidos + erros + vazios = 100%.', 'Distintos × únicos ajuda a achar chaves.', 'Reconciliar totais com a fonte gera confiança.'],
    { p: 'Qualidade da coluna e-mail:', c: '// 25.000 linhas\n// Válidos 92% · Erros 0% · Vazios 8% → 2.000 linhas sem e-mail\nSemEmail = Table.SelectRows(Clientes, each [email] = null or [email] = "")', fig: { type: 'bars', labels: ['Válidos', 'Erros', 'Vazios'], series: [{ name: '% das linhas', values: [92, 0, 8] }], hl: 2, speech: 'Oito por cento das linhas estão sem e-mail.' } },
    ['Não confie no perfil das primeiras 1.000 linhas.', 'Não publique sem conferir as chaves.', 'Não carregue colunas desnecessárias “por garantia”.'],
    [['A Qualidade da Coluna mostra:', '% de válidos, erros e vazios', 'A média', 'O tempo de atualização', 'O tamanho do arquivo', 'Saúde da coluna.'],
      ['O perfil diz 0% de erros, mas a carga dá erro. Provavelmente:', 'O perfil usou só as primeiras 1.000 linhas', 'O perfil está quebrado', 'O erro é do DAX', 'O Power BI inventa erros', 'Use o conjunto inteiro.'],
      ['Com 92% válidos e 0% de erros em 25.000 linhas, os vazios são:', '2.000 linhas', '200 linhas', '8 linhas', '23.000 linhas', '8% de 25.000.']]);

  lesson('final', 'Desafio final', 'PROJETO', 'Desafio final: automatizando o relatório',
    'Um projeto completo de Power Query: parâmetros para caminhos e servidores; conexão à pasta e combinação dos arquivos; limpeza de tipos, textos e erros; mesclagem com as dimensões; unpivot das metas e calendário dinâmico; organização em camadas com a carga só nas tabelas finais; e publicação com atualização agendada e gateway. Mudanças na origem são tratadas num ponto só, no começo.',
    'É montar uma linha de produção: cada estação faz bem uma tarefa, e o produto sai pronto sem ninguém precisar refazer à mão.',
    '1. Parâmetros     → CaminhoPasta, Servidor, DataInicio\n2. Fonte          → Folder.Files(CaminhoPasta)\n3. Limpeza        → tipos, Text.Trim, try … otherwise\n4. Combinação     → Table.NestedJoin com dim_Produtos\n5. Remodelagem    → Table.UnpivotOtherColumns nas metas\n6. Organização    → camadas e carga só no modelo\n7. Publicação     → gateway e atualização agendada',
    ['Trate mudanças de layout no início da consulta.', 'Documente as etapas importantes.', 'Reconcilie os totais com a fonte.'],
    { p: 'Pedidos de SP com todas as técnicas:', c: 'let\n    Fonte = Csv.Document(File.Contents(CaminhoPasta & "pedidos.csv"), [Delimiter = ";"]),\n    Cab = Table.PromoteHeaders(Fonte),\n    Unicos = Table.Distinct(Cab, {"pedido_id"}),\n    UF = Table.TransformColumns(Unicos, {{"uf", Text.Upper}}),\n    SP = Table.SelectRows(UF, each [uf] = "SP")\nin\n    SP   // ' + PD.uniq.filter(function (x) { return x[2].toUpperCase() === 'SP'; }).length + ' pedidos', fig: { type: 'chevrons', steps: [{ k: '1', t: 'Parâmetros' }, { k: '2', t: 'Fonte' }, { k: '3', t: 'Limpeza' }, { k: '4', t: 'Combinação' }, { k: '5', t: 'Remodelagem' }, { k: '6', t: 'Organização' }, { k: '7', t: 'Publicação' }], speech: 'Sete etapas levam do arquivo bruto ao relatório que se atualiza sozinho.' } },
    ['Não deixe passos manuais no meio do processo.', 'Não esqueça do gateway para fontes internas.', 'Não publique sem conferir a qualidade.'],
    [['Para juntar as vendas de 2024 e 2025 (mesmo layout), use:', 'Acrescentar', 'Mesclar', 'Unpivot', 'Agrupar', 'Empilhar.'],
      ['Para trazer a categoria do produto para as vendas, use:', 'Mesclar', 'Acrescentar', 'Transpor', 'Preencher para baixo', 'Junção por chave.'],
      ['Metas com uma coluna por mês devem passar por:', 'Transformar outras colunas em linhas', 'Pivot', 'Transpor', 'Remover duplicadas', 'Formato longo.']]);

  /* ------------------------------ Pacote ------------------------------ */
  function register() {
    if (!global.Lessons || !global.Lessons.registerPack) return;
    global.Lessons.registerPack('powerquery', {
      LESSONS: L, MAP: MAP, fallback: 'oque', goalLabel: 'Sua missão',
      steps: ['Conceito', 'Como se escreve', 'Exemplo aplicado', 'Cuidados', 'Seu desafio'],
      syntaxTitle: 'Como se escreve em M',
      solution: function (ex) {
        const esc = global.UI.esc; let html = '';
        if (ex.kind === 'choice') html = '<p class="ls-ans">' + esc(ex.opts[0]) + '</p>';
        else if (ex.kind === 'multi') html = '<ul class="ls-anslist">' + ex.ok.map(function (i) { return '<li>' + esc(ex.opts[i]) + '</li>'; }).join('') + '</ul>';
        else if (ex.kind === 'order') html = '<ol class="ls-anslist num">' + ex.items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ol>';
        else if (ex.kind === 'classify') html = '<ul class="ls-anslist">' + ex.items.map(function (it) { return '<li><span>' + esc(it[0]) + '</span><b>' + esc(ex.cats[it[1]]) + '</b></li>'; }).join('') + '</ul>';
        else html = '<p class="ls-ans">' + esc((ex.unit === 'R$' ? 'R$ ' : '') + global.GQCharts.fmt(ex.a, ex.dec == null ? 2 : ex.dec) + (ex.unit && ex.unit !== 'R$' ? (ex.unit === '%' ? '%' : ' ' + ex.unit) : '')) + '</p>';
        return { label: 'Resposta', html: html, note: ex.x, speech: ex.x };
      }, syntaxSpeech: 'Agora, o código M que a interface gera por trás de cada clique.', compareSpeech: 'Repare como cada etapa transforma a tabela.',
      codeHtml: function (code) { return global.GQCharts.highlightM(code); },
      example: function (les) {
        const out = global.GQCharts.render(Object.assign({ theme: 'powerquery' }, les.exemplo.fig));
        return { code: les.exemplo.c, badge: 'Aplicado aos dados da NexusMarket', liveHtml: out.html, speech: out.speech };
      },
      tags: function (ex) {
        const K = { choice: ['target', 'Estudo de caso'], multi: ['check', 'Marque todas as corretas'], order: ['bars', 'Coloque em ordem'], classify: ['grid', 'Classifique os itens'], calc: ['code', 'Resultado da transformação'] }[ex.kind] || ['target', 'Caso'];
        return [{ icon: K[0], label: K[1] }].concat(ex.d ? [{ icon: ex.d.type === 'code' ? 'code' : 'table', label: ex.d.type === 'code' ? 'Com código M' : ex.d.type === 'steps' ? 'Com etapas aplicadas' : 'Com tabela de dados' }] : []);
      },
    });
  }
  register();
  global.PQLessons = { LESSONS: L, MAP: MAP };
})(typeof window !== 'undefined' ? window : globalThis);
