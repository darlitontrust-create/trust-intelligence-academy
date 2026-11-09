/* =====================================================================
   pq-exercises.js — 150 casos da trilha de Power Query (50 por nível)
   ---------------------------------------------------------------------
   Mesmos tipos da Gestão e da Estatística (a tela de prática é a mesma):
     choice (opts[0] é a correta) · multi (ok = índices) · order (itens na
     ordem certa) · classify (items: [texto, categoria]) · calc (a, unit,
     dec, tol). Figuras: table (dados antes/depois), code (linguagem M) e
     steps (painel de etapas aplicadas).
   Etapas (posições 1–17, 18–34 e 35–50 de cada nível):
     1.1 Primeiros passos · 1.2 Limpeza básica · 1.3 Estruturando tabelas
     2.1 Combinar consultas · 2.2 Remodelar · 2.3 Linguagem M
     3.1 Automação · 3.2 Desempenho e atualização · 3.3 Modelagem e projeto
   As respostas de contagem e soma são calculadas a partir dos dados (PQData).
   ===================================================================== */
(function (global) {
  'use strict';
  const r = global.GQCharts.round, f = global.GQCharts.fmt;

  const Q = function (t, n, s, g, opts, x, o) { return Object.assign({ kind: 'choice', t: t, n: n, s: s, g: g, opts: opts, x: x }, o || {}); };
  const M = function (t, n, s, g, opts, ok, x, o) { return Object.assign({ kind: 'multi', t: t, n: n, s: s, g: g, opts: opts, ok: ok, x: x }, o || {}); };
  const O = function (t, n, s, g, items, x, o) { return Object.assign({ kind: 'order', t: t, n: n, s: s, g: g, items: items, x: x }, o || {}); };
  const K = function (t, n, s, g, cats, items, x, o) { return Object.assign({ kind: 'classify', t: t, n: n, s: s, g: g, cats: cats, items: items, x: x }, o || {}); };
  const N = function (t, n, s, g, a, x, o) { return Object.assign({ kind: 'calc', t: t, n: n, s: s, g: g, a: a, x: x }, o || {}); };
  const code = function (c) { return { type: 'code', code: c }; };
  const steps = function (items, sel) { return { type: 'steps', items: items, sel: sel }; };

  /* ------------------------------ Dados ------------------------------ */
  // Exportação bruta de pedidos do sistema (com problemas de qualidade de propósito)
  const P = [
    [1001, '03/01/2025', 'SP', 'App', ' Ana Souza ', 189.9],
    [1002, '03/01/2025', 'RJ', 'Site', 'BRUNO LIMA', 75.5],
    [1003, '04/01/2025', 'MG', 'App', 'carla dias', 240],
    [1003, '04/01/2025', 'MG', 'App', 'carla dias', 240],
    [1004, '05/01/2025', 'SP', 'Loja', 'Diego Reis', null],
    [1005, '05/01/2025', 'BA', 'Site', 'Elisa Prado', 132],
    [1006, '06/01/2025', 'sp', 'app', 'Fábio Nunes', 98],
    [1007, '07/01/2025', 'PR', 'Marketplace', 'Gabi Rocha', 310],
    [1008, '07/01/2025', 'RJ', 'App', 'Hugo Alves', 56.4],
    [1009, '08/01/2025', 'SP', 'Site', 'Iara Melo', 410],
  ];
  const pedFig = { type: 'table', title: 'Pedidos (exportação do sistema)', cols: ['pedido_id', 'uf', 'canal', 'cliente', 'valor'], rows: P.map(function (x) { return [String(x[0]), x[2], x[3], x[4] !== x[4].trim() ? '"' + x[4] + '"' : x[4], x[5] == null ? 'null' : f(x[5], 2)]; }), note: 'Aspas mostram os espaços sobrando no início e no fim do nome.' };
  const uniq = P.filter(function (x, i) { return P.findIndex(function (y) { return y[0] === x[0]; }) === i; });
  const appExato = uniq.filter(function (x) { return x[3] === 'App'; });
  const appTodos = uniq.filter(function (x) { return x[3].toLowerCase() === 'app'; });
  const somaApp = appTodos.reduce(function (s, x) { return s + (x[5] || 0); }, 0);
  const validos = uniq.filter(function (x) { return x[5] != null; });
  const sp = uniq.filter(function (x) { return x[2].toUpperCase() === 'SP'; });

  // Fato de vendas e dimensão de produtos (para mesclar)
  const V = [[1, 'P01', 2], [2, 'P02', 1], [3, 'P01', 5], [4, 'P05', 3], [5, 'P03', 2]];
  const PR = [['P01', 'Fone Bluetooth', 'Áudio'], ['P02', 'Mouse sem fio', 'Periféricos'], ['P03', 'Teclado mecânico', 'Periféricos'], ['P04', 'Webcam HD', 'Vídeo']];
  const vendFig = { type: 'table', title: 'Vendas', cols: ['venda_id', 'produto_id', 'qtd'], rows: V.map(function (x) { return [String(x[0]), x[1], x[2]]; }) };
  const prodFig = { type: 'table', title: 'Produtos', cols: ['produto_id', 'nome', 'categoria'], rows: PR };
  const temProd = function (id) { return PR.some(function (p) { return p[0] === id; }); };
  const J = {
    leftOuter: V.length,
    inner: V.filter(function (v) { return temProd(v[1]); }).length,
    leftAnti: V.filter(function (v) { return !temProd(v[1]); }).length,
    rightAnti: PR.filter(function (p) { return !V.some(function (v) { return v[1] === p[0]; }); }).length,
  };
  J.fullOuter = J.inner + J.leftAnti + J.rightAnti;
  J.rightOuter = J.inner + J.rightAnti;

  // Metas mensais em formato "largo" (uma coluna por mês)
  const largo = { type: 'table', title: 'Metas por loja (formato largo)', cols: ['loja', 'jan', 'fev', 'mar'], rows: [['Centro', 120, 130, 125], ['Norte', 80, 85, 90], ['Sul', 95, 100, 98], ['Leste', 60, 70, 65]] };

  // Vendas por canal para agrupar
  const G = [['App', 189.9], ['Site', 75.5], ['App', 240], ['Site', 132], ['App', 98], ['Marketplace', 310], ['App', 56.4], ['Site', 410]];
  const somaSite = G.filter(function (x) { return x[0] === 'Site'; }).reduce(function (s, x) { return s + x[1]; }, 0);

  /* ===================== NÍVEL 1 · FUNDAMENTOS ===================== */
  const iniciante = [
    // ---- 1.1 Primeiros passos · O que é o Power Query (4)
    Q('O que é o Power Query', 'Para que serve', 'Todo mês, a analista copia a exportação do ERP, apaga colunas, corrige nomes e cola na planilha do relatório. Leva 3 horas.', 'Como o Power Query ajuda?',
      ['Grava cada transformação como uma etapa; no mês seguinte, basta clicar em Atualizar', 'Cria gráficos automaticamente', 'Substitui o banco de dados do ERP', 'Envia o relatório por e-mail sozinho'],
      'O Power Query é uma ferramenta de ETL (extrair, transformar e carregar). As etapas ficam registradas e se repetem a cada atualização.',
      { w: ['Gráficos são feitos depois, no Excel ou no Power BI.', 'Ele lê os dados da fonte, não substitui a fonte.', 'Envio de e-mail não é função do Power Query.'] }),
    K('O que é o Power Query', 'Extrair, transformar ou carregar?', 'Você descreve o fluxo do relatório de vendas.', 'Classifique cada atividade na etapa do ETL.', ['Extrair', 'Transformar', 'Carregar'],
      [['Conectar à pasta com os CSVs do ERP', 0], ['Remover colunas que não serão usadas', 1], ['Corrigir o tipo da coluna de data', 1], ['Enviar a tabela tratada para o modelo do Power BI', 2], ['Ler a planilha de metas no SharePoint', 0], ['Fechar e carregar para uma tabela do Excel', 2]],
      'Extrair é ler a fonte; transformar é limpar e remodelar; carregar é entregar o resultado para o Excel ou o modelo do Power BI.'),
    Q('O que é o Power Query', 'Onde ele está', 'Um colega diz que o Power Query “é coisa do Power BI”.', 'O que é verdade?',
      ['O mesmo Power Query existe no Excel (Obter Dados) e no Power BI (Transformar dados), com a linguagem M', 'Ele só existe no Power BI', 'No Excel, ele se chama VBA', 'É um site separado da Microsoft'],
      'O Power Query está no Excel, no Power BI e em outros produtos (como os Dataflows). As etapas e a linguagem M são as mesmas.'),
    Q('O que é o Power Query', 'Os dados originais', 'Você removeu 5 colunas e filtrou linhas no Power Query.', 'O que acontece com o arquivo de origem?',
      ['Nada: o Power Query lê a fonte e aplica as etapas numa cópia, sem alterar a origem', 'As colunas são apagadas do arquivo original', 'O arquivo original é sobrescrito ao salvar', 'O arquivo original é movido para a lixeira'],
      'A fonte nunca é alterada. As transformações valem só para o resultado da consulta.'),
    // Fontes de dados (4)
    K('Fontes de dados', 'Qual conector?', 'A NexusMarket tem dados em vários lugares.', 'Classifique o conector mais adequado.', ['Arquivo (Excel/CSV)', 'Pasta', 'Banco de dados', 'Web/SharePoint'],
      [['Um CSV de pedidos exportado do ERP', 0], ['Doze arquivos mensais com o mesmo layout numa pasta', 1], ['Tabela de clientes no SQL Server', 2], ['Planilha de metas numa biblioteca do SharePoint', 3], ['Planilha de comissões no computador da analista', 0], ['Tabela de produtos no PostgreSQL', 2]],
      'Escolha o conector pela origem. Para vários arquivos iguais, o conector de Pasta combina todos de uma vez.'),
    Q('Fontes de dados', 'CSV com acentos estranhos', 'Ao importar o CSV, “São Paulo” aparece como “SÃ£o Paulo”.', 'O que ajustar?',
      ['A codificação do arquivo (origem do arquivo) para UTF-8', 'O tipo da coluna para número', 'O delimitador para ponto e vírgula', 'Remover a coluna de cidade'],
      'Caracteres trocados indicam codificação errada. Na janela de importação, escolha 65001: Unicode (UTF-8) em Origem do Arquivo.'),
    Q('Fontes de dados', 'Delimitador', 'O CSV usa ponto e vírgula, mas tudo veio numa coluna só, com “1001;03/01/2025;SP;App”.', 'O que fazer?',
      ['Definir o delimitador como ponto e vírgula na importação (ou dividir a coluna por “;”)', 'Mudar a codificação', 'Promover cabeçalhos', 'Remover duplicadas'],
      'CSV no Brasil costuma usar “;”. Ajuste o delimitador na etapa Fonte para separar as colunas corretamente.'),
    Q('Fontes de dados', 'Caminho do arquivo', 'A consulta aponta para C:\\Users\\ana\\vendas.xlsx e vai ser atualizada pelo time inteiro.', 'Qual o risco?',
      ['O caminho local só existe no computador da Ana: a atualização falha para os outros', 'Nenhum, o caminho é universal', 'O arquivo fica mais lento', 'O Excel não abre arquivos em C:'],
      'Prefira fontes compartilhadas (SharePoint, rede ou banco) e, de preferência, um parâmetro com o caminho.'),
    // Etapas aplicadas (4)
    Q('Etapas aplicadas', 'O painel de etapas', 'O painel mostra as etapas da consulta de pedidos.', 'O que acontece ao clicar em “Linhas Filtradas”?',
      ['A pré-visualização mostra os dados exatamente como estavam depois dessa etapa', 'A etapa é apagada', 'Todas as etapas seguintes são executadas de novo na fonte e salvas', 'O filtro é desfeito'],
      'Cada etapa é um retrato dos dados naquele ponto. Clicar nela permite inspecionar o resultado sem apagar nada.', { d: steps(['Fonte', 'Navegação', 'Cabeçalhos Promovidos', 'Tipo Alterado', 'Linhas Filtradas', 'Colunas Removidas'], 4) }),
    Q('Etapas aplicadas', 'Inserir no meio', 'Você selecionou a etapa “Tipo Alterado” e adicionou um filtro.', 'O que o Power Query faz?',
      ['Insere a nova etapa logo depois de “Tipo Alterado” e avisa que isso pode afetar as etapas seguintes', 'Coloca o filtro no fim, sempre', 'Substitui a etapa “Tipo Alterado”', 'Apaga as etapas seguintes'],
      'As etapas são uma sequência: inserir no meio é possível, mas as etapas seguintes passam a receber dados diferentes.', { d: steps(['Fonte', 'Cabeçalhos Promovidos', 'Tipo Alterado', 'Colunas Removidas', 'Linhas Classificadas'], 2) }),
    O('Etapas aplicadas', 'Ordem lógica', 'Você vai preparar a exportação de pedidos.', 'Coloque as etapas na ordem mais lógica.',
      ['Fonte (conectar ao arquivo)', 'Promover cabeçalhos', 'Remover colunas desnecessárias', 'Definir os tipos de dados', 'Filtrar as linhas do período'],
      'Primeiro a fonte e os cabeçalhos; depois, tirar o que não será usado; então tipos corretos e filtros.', { d: pedFig }),
    M('Etapas aplicadas', 'Boas práticas nas etapas', 'A consulta tem 27 etapas chamadas “Personalização Adicionada1”, “Personalização Adicionada2”…', 'Marque as boas práticas.',
      ['Renomear as etapas com nomes que digam o que fazem', 'Juntar etapas repetidas do mesmo tipo', 'Adicionar uma descrição nas etapas importantes', 'Criar uma etapa para cada coluna renomeada', 'Nunca apagar etapas, mesmo as inúteis'], [0, 1, 2],
      'Nomes claros e menos etapas tornam a consulta fácil de entender e manter.'),
    // Tipos de dados (5)
    K('Tipos de dados', 'Tipo certo', 'Você vai definir os tipos da tabela de pedidos.', 'Classifique o tipo de cada coluna.', ['Número inteiro', 'Número decimal fixo (moeda)', 'Data', 'Texto'],
      [['pedido_id (1001, 1002…) usado como chave, sem contas', 3], ['data (03/01/2025)', 2], ['valor (189,90)', 1], ['quantidade de itens', 0], ['CEP (01310-100)', 3], ['uf (SP, RJ)', 3]],
      'Códigos (pedido_id, CEP) são texto: não se somam e podem ter zeros à esquerda. Valores em dinheiro ficam melhor como decimal fixo.', { d: pedFig }),
    Q('Tipos de dados', 'Zeros sumindo', 'O código do produto “00452” virou 452 depois da importação.', 'Por que e como corrigir?',
      ['O Power Query detectou o tipo como número; altere a coluna para Texto antes da etapa de tipo', 'O arquivo está corrompido', 'Usar Arredondar', 'Dividir a coluna'],
      'Ao converter para número, os zeros à esquerda se perdem. Códigos devem ser texto.'),
    Q('Tipos de dados', 'Data invertida', 'A data “03/01/2025” virou 1º de março de 2025.', 'Qual o ajuste?',
      ['Alterar o tipo usando a localidade Português (Brasil): “Alterar tipo > Usando localidade”', 'Mudar para texto e deixar assim', 'Dividir a data em três colunas', 'Remover a coluna'],
      'A data foi lida no padrão americano (mês/dia). Com a localidade pt-BR, “03/01” vira 3 de janeiro.'),
    Q('Tipos de dados', 'Por que o tipo importa', 'A coluna “valor” ficou com o tipo Qualquer (ABC123).', 'Qual o problema?',
      ['Somas, filtros de número e o modelo do Power BI podem tratar o valor como texto', 'Nenhum, o tipo Qualquer é o mais rápido', 'Os valores são apagados', 'A consulta deixa de atualizar'],
      'Defina o tipo explicitamente: ele garante cálculos corretos, filtros adequados e menos erros no modelo.'),
    N('Tipos de dados', 'Erros de conversão', 'Na coluna valor, 1.200 linhas foram convertidas para número e 15 mostram Error porque têm o texto “a confirmar”.', 'Qual % das linhas deu erro (2 casas)?', r(15 / 1215 * 100, 2),
      '15 ÷ 1.215 = ' + f(15 / 1215 * 100, 2) + '%. Erros de tipo aparecem quando o texto não pode virar número; trate-os antes ou substitua os erros.', { unit: '%', dec: 2 }),

    // ---- 1.2 Limpeza básica · Colunas (4)
    Q('Colunas', 'Remover ou escolher', 'A exportação tem 45 colunas e você precisa de 6. Novas colunas podem surgir no ERP.', 'Qual comando é mais robusto?',
      ['Escolher Colunas (mantém só as 6 listadas)', 'Remover Colunas (lista as 39 que saem)', 'Ocultar as colunas no Excel', 'Apagar as colunas no arquivo de origem'],
      'Escolher Colunas (Table.SelectColumns) ignora colunas novas na origem. Com Remover, cada coluna nova entra no resultado.'),
    Q('Colunas', 'Renomear', 'A coluna se chama “VLR_TOT_PED_C/IMP”.', 'Qual o melhor nome para o modelo?',
      ['Valor do pedido', 'VLR_TOT_PED_C/IMP', 'Coluna1', 'v'],
      'Nomes claros aparecem nos campos do Power BI e nas tabelas dinâmicas. Renomeie cedo, numa única etapa.'),
    Q('Colunas', 'Duplicar coluna', 'Você quer manter a data original e criar uma coluna só com o mês.', 'Qual abordagem?',
      ['Adicionar Coluna > Data > Mês (cria uma coluna nova e mantém a original)', 'Transformar > Data > Mês na própria coluna', 'Apagar a coluna de data', 'Dividir a data por “/”'],
      'A guia Adicionar Coluna cria colunas novas; a guia Transformar altera a coluna selecionada.'),
    K('Colunas', 'Transformar ou adicionar?', 'Você vai preparar a tabela de pedidos.', 'Classifique em qual guia fazer cada ação.', ['Transformar (altera a coluna)', 'Adicionar Coluna (cria nova)'],
      [['Corrigir os espaços no nome do cliente', 0], ['Criar a coluna Ano a partir da data, mantendo a data', 1], ['Deixar a UF em maiúsculas', 0], ['Calcular valor com imposto ao lado do valor', 1], ['Arredondar o valor na própria coluna', 0], ['Criar a faixa de valor (até 100, 100 a 300, acima)', 1]],
      'Use Transformar para corrigir a coluna e Adicionar Coluna para derivar uma informação nova.'),
    // Filtrar linhas (4)
    N('Filtrar linhas', 'Filtro de canal', 'A exportação tem os pedidos mostrados em Dados do caso. Depois de remover as duplicadas, você filtra canal = "App".', 'Quantas linhas sobram?', appExato.length,
      'O filtro do Power Query diferencia maiúsculas: “app” (pedido 1006) fica de fora. Sobram ' + appExato.length + ' pedidos: 1001, 1003 e 1008.', { dec: 0, d: pedFig, h: 'Compare letra por letra: “App” e “app” são textos diferentes.' }),
    Q('Filtrar linhas', 'Maiúsculas e minúsculas', 'O filtro canal = "App" deixou de fora o pedido com “app”.', 'Como corrigir de forma robusta?',
      ['Padronizar o texto antes do filtro (Colocar Cada Palavra em Maiúscula ou MAIÚSCULAS)', 'Filtrar “App” e “app” manualmente', 'Remover o pedido 1006', 'Mudar o tipo para número'],
      'Padronize primeiro, filtre depois. Assim, variações futuras (“APP”, “aPP”) também entram.', { d: pedFig }),
    Q('Filtrar linhas', 'Filtro de data dinâmico', 'O relatório deve mostrar sempre os pedidos dos últimos 30 dias.', 'Qual filtro usar?',
      ['Filtros de Data > No(s) Anterior(es) 30 dias', 'Data entre 01/12 e 31/12, digitado', 'Remover as primeiras 30 linhas', 'Manter as últimas 30 linhas'],
      'Filtros relativos se ajustam a cada atualização. Datas fixas exigem edição manual todo mês.'),
    M('Filtrar linhas', 'Filtros comuns', 'A base de pedidos precisa de limpeza.', 'Marque os filtros adequados para remover linhas inválidas.',
      ['valor diferente de null', 'pedido_id diferente de vazio', 'status diferente de "Teste"', 'canal igual a "App" (para o relatório geral)', 'valor maior que 1000 (para o relatório geral)'], [0, 1, 2],
      'Filtrar nulos, chaves vazias e registros de teste limpa a base. Filtrar canal ou faixa de valor muda o escopo do relatório.'),
    // Duplicadas e erros (4)
    N('Duplicadas e erros', 'Remover duplicadas', 'Na exportação de pedidos, você seleciona pedido_id e usa Remover Duplicadas.', 'Quantas linhas sobram?', uniq.length,
      'O pedido 1003 aparece duas vezes. Das ' + P.length + ' linhas, sobram ' + uniq.length + '.', { dec: 0, d: pedFig }),
    Q('Duplicadas e erros', 'Qual coluna selecionar', 'Você selecionou TODAS as colunas antes de Remover Duplicadas.', 'Qual a diferença em relação a selecionar só pedido_id?',
      ['Só remove linhas idênticas em todas as colunas; um pedido repetido com um campo diferente continua duplicado', 'Nenhuma', 'Remove mais linhas', 'Apaga as colunas'],
      'Remover Duplicadas compara as colunas selecionadas. Para garantir um pedido por linha, selecione a chave.'),
    N('Duplicadas e erros', 'Linhas válidas', 'Depois de remover as duplicadas, você filtra valor diferente de null.', 'Quantas linhas restam?', validos.length,
      uniq.length + ' pedidos únicos − 1 com valor nulo (1004) = ' + validos.length + '.', { dec: 0, d: pedFig }),
    Q('Duplicadas e erros', 'Substituir erros', 'Após a conversão de tipo, 15 células da coluna de quantidade mostram Error.', 'Qual a abordagem mais segura?',
      ['Investigar a causa (Manter Erros para ver as linhas) e só então substituir ou corrigir', 'Remover Erros sem olhar', 'Mudar a coluna para Qualquer', 'Ignorar, o Excel resolve'],
      'Erros revelam problemas na origem. Manter Erros mostra as linhas; depois decida: corrigir, substituir ou remover.'),
    // Texto (5)
    K('Texto', 'Qual transformação?', 'A coluna cliente tem valores como " Ana Souza ", "BRUNO LIMA" e "carla dias".', 'Classifique a transformação para cada objetivo.', ['Aparar', 'Limpar', 'Colocar Cada Palavra em Maiúscula', 'MAIÚSCULAS'],
      [['Remover os espaços no início e no fim', 0], ['Remover caracteres invisíveis (quebras de linha, tabulações)', 1], ['Padronizar nomes como “Ana Souza”', 2], ['Padronizar a UF como “SP”', 3]],
      'Aparar (Text.Trim) tira espaços nas pontas; Limpar (Text.Clean) remove caracteres de controle; Text.Proper e Text.Upper padronizam letras.', { d: pedFig }),
    Q('Texto', 'Espaços invisíveis', 'O PROCX não encontra “ Ana Souza ” na tabela de clientes.', 'Qual transformação resolve?',
      ['Aparar (Text.Trim) na coluna cliente', 'Mudar o tipo para número', 'Remover duplicadas', 'Classificar em ordem alfabética'],
      'Espaços nas pontas fazem textos “iguais” serem diferentes. Apare antes de mesclar ou procurar.', { d: pedFig }),
    N('Texto', 'Vendas do App corrigidas', 'Depois de remover duplicadas e padronizar o canal com Colocar Cada Palavra em Maiúscula, você filtra canal = "App".', 'Qual a soma do valor desses pedidos (R$, 2 casas)?', r(somaApp, 2),
      'Pedidos 1001, 1003, 1006 e 1008: ' + appTodos.map(function (x) { return f(x[5], 2); }).join(' + ') + ' = R$ ' + f(somaApp, 2) + '.', { unit: 'R$', dec: 2, d: pedFig }),
    Q('Texto', 'Extrair parte do texto', 'O código do pedido vem como “NX-2025-001001” e você precisa só do ano.', 'Qual comando usar?',
      ['Extrair > Texto Entre Delimitadores (entre o primeiro e o segundo “-”)', 'Aparar', 'Colocar em maiúsculas', 'Remover duplicadas'],
      'Extrair (Primeiros caracteres, Últimos, Intervalo, Entre delimitadores) pega partes do texto sem dividir a coluna.'),
    Q('Texto', 'Prefixo', 'Os SKUs vêm como “452”, mas o padrão do cadastro é “SKU-452”.', 'Qual transformação?',
      ['Formatar > Adicionar Prefixo “SKU-”', 'Dividir a coluna', 'Substituir “452” por “SKU-452” em cada valor', 'Mudar o tipo para número'],
      'Adicionar Prefixo/Sufixo aplica o mesmo texto a todos os valores, de uma vez.'),

    // ---- 1.3 Estruturando tabelas · Cabeçalhos e linhas (4)
    O('Cabeçalhos e linhas', 'Relatório com capa', 'O relatório do ERP tem 3 linhas de título, depois a linha de cabeçalhos e os dados. No fim, uma linha de “Total geral”.', 'Coloque as etapas na ordem.',
      ['Remover as 3 primeiras linhas', 'Usar a primeira linha como cabeçalho', 'Remover a última linha (Total geral)', 'Definir os tipos de dados'],
      'Primeiro tire o lixo do topo, então promova o cabeçalho, remova o total do fim e defina os tipos.'),
    Q('Cabeçalhos e linhas', 'Total no meio dos dados', 'A exportação tem linhas de “Subtotal” espalhadas entre os pedidos.', 'Como removê-las de forma robusta?',
      ['Filtrar a coluna onde aparece “Subtotal” com “não contém Subtotal”', 'Remover linhas alternadas', 'Remover as últimas 5 linhas', 'Apagar no arquivo de origem a cada mês'],
      'Filtrar pelo conteúdo funciona mesmo quando a quantidade e a posição dos subtotais mudam.'),
    Q('Cabeçalhos e linhas', 'Cabeçalho com nome fixo', 'O arquivo do mês traz o cabeçalho “Vendas jan/25”; no mês seguinte, “Vendas fev/25”.', 'Qual o risco para a consulta?',
      ['Etapas que citam o nome da coluna (como Tipo Alterado) quebram quando o nome muda', 'Nenhum, o Power Query adivinha', 'A consulta fica mais rápida', 'Só muda a cor da coluna'],
      'Etapas guardam os nomes das colunas. Renomeie pela posição ou peça um cabeçalho fixo na origem.'),
    Q('Cabeçalhos e linhas', 'Rebaixar cabeçalhos', 'Você precisa usar os nomes das colunas como uma linha de dados para depois transpor.', 'Qual comando?',
      ['Usar Cabeçalhos como Primeira Linha', 'Usar Primeira Linha como Cabeçalho', 'Remover Linhas Superiores', 'Manter Linhas Inferiores'],
      'Rebaixar os cabeçalhos transforma os nomes das colunas na primeira linha de dados.'),
    // Dividir colunas (4)
    Q('Dividir colunas', 'Nome e sobrenome', 'A coluna cliente tem “Ana Souza”, “Bruno Lima”, “Carla Maria Dias”.', 'Como separar o primeiro nome do restante?',
      ['Dividir Coluna por Delimitador (espaço), na ocorrência mais à esquerda', 'Dividir a cada ocorrência do espaço', 'Dividir por número de caracteres (4)', 'Extrair os últimos 5 caracteres'],
      'Dividir na ocorrência mais à esquerda gera duas colunas: o primeiro nome e todo o resto.'),
    N('Dividir colunas', 'Colunas geradas', 'A coluna “endereco” tem valores como “Rua A, 100, Centro, São Paulo, SP”. Você divide a cada ocorrência da vírgula.', 'Quantas colunas são criadas?', 5,
      'São 4 vírgulas, então 5 partes: rua, número, bairro, cidade e UF.', { dec: 0 }),
    Q('Dividir colunas', 'Dividir em linhas', 'A coluna “tags” tem “frete grátis; promoção; app” e você quer uma linha por tag.', 'Qual opção usar?',
      ['Dividir por delimitador “;” nas opções avançadas: Dividir em Linhas', 'Dividir em colunas', 'Transpor a tabela', 'Agrupar por'],
      'Dividir em Linhas cria uma linha para cada parte, repetindo os outros campos. Ideal para listas dentro de uma célula.'),
    Q('Dividir colunas', 'Código composto', 'O SKU vem como “ELE-0452-PRETO” e você quer categoria, código e cor separados.', 'Qual divisão?',
      ['Dividir por delimitador “-” a cada ocorrência', 'Dividir por número de caracteres', 'Dividir por mudança de minúscula para maiúscula', 'Extrair os primeiros 3 caracteres e pronto'],
      'Com um delimitador consistente, dividir a cada ocorrência separa todas as partes.'),
    // Substituir e preencher (4)
    Q('Substituir e preencher', 'Preencher abaixo', 'Num relatório, a região aparece só na primeira linha de cada grupo e as linhas seguintes ficam vazias (null).', 'Qual comando resolve?',
      ['Preencher > Para Baixo', 'Remover Linhas em Branco', 'Substituir Valores por “Sem região”', 'Remover Duplicadas'],
      'Preencher para baixo copia o último valor não nulo para as linhas seguintes, completando o agrupamento.', { d: { type: 'table', cols: ['regiao', 'loja', 'vendas'], rows: [['Sudeste', 'Centro', 120], ['null', 'Paulista', 95], ['null', 'Moema', 80], ['Sul', 'Batel', 70], ['null', 'Moinhos', 65]] } }),
    Q('Substituir e preencher', 'Substituir valores', 'A coluna canal tem “Mkt”, “Marketplace” e “MKTPLACE” para o mesmo canal.', 'Qual a abordagem?',
      ['Substituir Valores para unificar em “Marketplace” (ou usar uma tabela de-para)', 'Remover as linhas', 'Filtrar só “Marketplace”', 'Dividir a coluna'],
      'Substituir Valores padroniza variações. Com muitas variações, uma tabela de-para mesclada é mais fácil de manter.'),
    Q('Substituir e preencher', 'Nulos em quantidade', 'A coluna desconto tem null onde não houve desconto.', 'O que fazer antes de calcular o valor líquido?',
      ['Substituir null por 0 na coluna desconto', 'Remover as linhas com null', 'Mudar o tipo para texto', 'Preencher para cima'],
      'Qualquer conta com null resulta em null. Quando nulo significa zero, substitua por 0.'),
    Q('Substituir e preencher', 'Substituir parte do texto', 'Você substituiu “SP” por “São Paulo” e “ESPANHA” virou “ESão PauloANHA”.', 'O que aconteceu?',
      ['A substituição trocou o trecho em qualquer posição; marque “Coincidir com o conteúdo inteiro da célula”', 'Erro do Power Query', 'Faltou mudar o tipo', 'Faltou aparar'],
      'Sem a opção de célula inteira, a substituição troca o trecho onde quer que apareça.'),
    // Coluna condicional (4)
    Q('Coluna condicional', 'Faixa de valor', 'Você quer classificar pedidos: até R$ 100 = “Baixo”, até R$ 300 = “Médio”, acima = “Alto”.', 'Qual recurso usar sem escrever código?',
      ['Adicionar Coluna > Coluna Condicional', 'Agrupar por', 'Dividir coluna', 'Mesclar consultas'],
      'A Coluna Condicional monta um if…then…else com regras avaliadas em ordem.'),
    N('Coluna condicional', 'Pedidos altos', 'Nos pedidos únicos e com valor (Dados do caso), a regra é: valor > 300 = “Alto”.', 'Quantos pedidos são “Alto”?', validos.filter(function (x) { return x[5] > 300; }).length,
      'Pedidos 1007 (R$ 310) e 1009 (R$ 410): ' + validos.filter(function (x) { return x[5] > 300; }).length + ' pedidos.', { dec: 0, d: pedFig }),
    Q('Coluna condicional', 'Ordem das regras', 'A coluna condicional tem: 1) valor > 100 → “Médio”; 2) valor > 300 → “Alto”; senão “Baixo”.', 'Qual o problema?',
      ['Um pedido de R$ 410 para na primeira regra e vira “Médio”: a regra mais restritiva deve vir antes', 'Nenhum', 'Falta a regra de null', 'As regras não podem usar “maior que”'],
      'As regras são avaliadas de cima para baixo e a primeira verdadeira vence. Coloque > 300 antes de > 100.'),
    Q('Coluna condicional', 'Coluna de exemplos', 'Você quer criar a coluna “Primeiro nome” a partir de “Ana Souza” sem saber qual função usar.', 'Qual recurso ajuda?',
      ['Coluna de Exemplos: digite alguns resultados e o Power Query deduz a transformação', 'Coluna Condicional', 'Coluna de Índice', 'Agrupar por'],
      'A Coluna de Exemplos gera a fórmula M a partir dos exemplos. Confira o código gerado antes de confirmar.'),
  ];

  /* ===================== NÍVEL 2 · COMBINAR E REMODELAR ===================== */
  const intermediario = [
    // ---- 2.1 Combinar consultas · Acrescentar consultas (4)
    N('Acrescentar consultas', 'Empilhar meses', 'Você tem 3 consultas com o mesmo layout: Jan (1.200 linhas), Fev (1.350) e Mar (1.100).', 'Quantas linhas tem a consulta acrescentada?', 1200 + 1350 + 1100,
      'Acrescentar empilha as tabelas: 1.200 + 1.350 + 1.100 = 3.650 linhas.', { dec: 0 }),
    Q('Acrescentar consultas', 'Acrescentar ou mesclar?', 'Você quer juntar as vendas de 2024 e de 2025, que têm as mesmas colunas.', 'Qual operação usar?',
      ['Acrescentar (empilhar linhas)', 'Mesclar (juntar colunas por uma chave)', 'Agrupar por', 'Transpor'],
      'Mesmo layout, períodos diferentes → Acrescentar. Tabelas diferentes ligadas por uma chave → Mesclar.'),
    Q('Acrescentar consultas', 'Colunas com nomes diferentes', 'Em Jan a coluna se chama “valor”; em Fev, “Valor”. Você acrescentou as duas.', 'O que acontece?',
      ['Surgem duas colunas, “valor” e “Valor”, cada uma com null nas linhas da outra tabela', 'O Power Query une as duas sozinho', 'A consulta dá erro', 'Os valores são somados'],
      'Acrescentar alinha pelo nome exato (inclusive maiúsculas). Padronize os nomes antes de acrescentar.'),
    M('Acrescentar consultas', 'Antes de acrescentar', 'Você vai acrescentar as vendas de 5 lojas que enviam planilhas separadas.', 'Marque o que conferir antes.',
      ['Nomes de colunas idênticos', 'Tipos de dados iguais', 'Uma coluna que identifique a loja de origem', 'Mesma quantidade de linhas em todas', 'Mesma cor de cabeçalho nas planilhas'], [0, 1, 2],
      'Nomes e tipos alinhados evitam colunas duplicadas e erros. Uma coluna de origem permite saber de onde veio cada linha.'),
    // Mesclar consultas (4)
    Q('Mesclar consultas', 'Trazer o nome do produto', 'A tabela Vendas tem produto_id e você quer o nome do produto, que está em Produtos.', 'Qual operação usar?',
      ['Mesclar Consultas (Vendas com Produtos, pela coluna produto_id) e expandir “nome”', 'Acrescentar Produtos em Vendas', 'Agrupar Vendas por produto_id', 'Transpor Produtos'],
      'Mesclar é o PROCX do Power Query: junta tabelas por uma chave e traz as colunas desejadas.', { d: vendFig }),
    N('Mesclar consultas', 'Junção externa esquerda', 'Você mescla Vendas (esquerda, em Dados do caso) com Produtos (direita, que tem P01 a P04) por produto_id, com junção Externa Esquerda.', 'Quantas linhas tem o resultado?', J.leftOuter,
      'A externa esquerda mantém todas as ' + V.length + ' vendas. A venda do P05, que não existe em Produtos, fica com null no nome.', { dec: 0, d: vendFig }),
    Q('Mesclar consultas', 'Coluna aninhada', 'Depois de mesclar, aparece uma coluna “Produtos” com o valor “Table” em cada linha.', 'O que fazer?',
      ['Clicar no botão de expandir e escolher as colunas (nome, categoria)', 'Apagar a coluna', 'Mudar o tipo para texto', 'Transpor a tabela'],
      'A mesclagem traz a tabela relacionada aninhada. Expandir escolhe quais colunas trazer.'),
    Q('Mesclar consultas', 'Chave suja', 'A mesclagem por cliente não encontra “ Ana Souza ” na tabela de cadastro, onde está “Ana Souza”.', 'Como corrigir?',
      ['Aparar e padronizar o texto da chave nas duas tabelas antes de mesclar', 'Usar junção externa completa', 'Mesclar por outra coluna qualquer', 'Remover a linha'],
      'Chaves precisam ser idênticas. Aparar, limpar e padronizar maiúsculas antes evita “não encontrados”.'),
    // Tipos de junção (4)
    K('Tipos de junção', 'Qual junção?', 'Você mescla Vendas (esquerda) com Produtos (direita).', 'Classifique a junção para cada pergunta.', ['Externa esquerda', 'Interna', 'Anti esquerda', 'Anti direita'],
      [['Todas as vendas, com o nome do produto quando existir', 0], ['Só vendas cujo produto está cadastrado', 1], ['Vendas com produto que não existe no cadastro', 2], ['Produtos cadastrados que nunca venderam', 3]],
      'Externa esquerda mantém tudo da esquerda; interna, só o que casa; anti esquerda, o que só existe na esquerda; anti direita, o que só existe na direita.'),
    N('Tipos de junção', 'Junção interna', 'Vendas tem os produtos P01, P02, P01, P05 e P03. Produtos tem P01 a P04.', 'Quantas linhas tem a junção interna?', J.inner,
      'Só as vendas com produto cadastrado: P01, P02, P01 e P03 = ' + J.inner + ' linhas. A venda do P05 sai.', { dec: 0, d: vendFig }),
    N('Tipos de junção', 'Produtos sem venda', 'Vendas tem os produtos P01, P02, P01, P05 e P03. Produtos tem P01 a P04.', 'Quantas linhas tem a junção anti direita?', J.rightAnti,
      'Só o P04 (Webcam HD) está no cadastro e não aparece em Vendas: ' + J.rightAnti + ' linha.', { dec: 0, d: prodFig }),
    N('Tipos de junção', 'Externa completa', 'Vendas tem os produtos P01, P02, P01, P05 e P03. Produtos tem P01 a P04.', 'Quantas linhas tem a junção externa completa?', J.fullOuter,
      J.inner + ' que casam + ' + J.leftAnti + ' só em Vendas (P05) + ' + J.rightAnti + ' só em Produtos (P04) = ' + J.fullOuter + ' linhas.', { dec: 0, d: vendFig }),
    // Combinar arquivos (5)
    O('Combinar arquivos', 'Pasta de arquivos', 'Todo mês, um CSV novo com o mesmo layout cai na pasta “Vendas”.', 'Coloque as etapas na ordem.',
      ['Obter Dados > Pasta e escolher a pasta', 'Filtrar a extensão .csv e os arquivos certos', 'Combinar arquivos (usando um arquivo de exemplo)', 'Ajustar a consulta de exemplo (cabeçalhos, tipos)', 'Carregar; nos próximos meses, basta atualizar'],
      'O conector de Pasta lê todos os arquivos e cria uma função a partir do exemplo, aplicada a cada arquivo.'),
    Q('Combinar arquivos', 'Arquivo intruso', 'Alguém salvou “vendas_jan - Copia.csv” e um “leia-me.txt” na pasta e a atualização falhou.', 'Como evitar?',
      ['Filtrar a lista de arquivos por extensão e por um padrão de nome antes de combinar', 'Proibir as pessoas de abrir a pasta', 'Combinar manualmente todo mês', 'Desativar a atualização'],
      'Filtrar Extension = ".csv" e nomes que começam com “vendas_” protege a consulta de arquivos estranhos.'),
    Q('Combinar arquivos', 'Nome do arquivo como coluna', 'Os arquivos se chamam vendas_2025-01.csv, vendas_2025-02.csv… e não têm coluna de mês.', 'Como saber de que mês veio cada linha?',
      ['Manter a coluna Source.Name (nome do arquivo) e extrair o mês dela', 'Adivinhar pela ordem das linhas', 'Abrir cada arquivo e digitar o mês', 'Não é possível'],
      'Ao combinar, a coluna Source.Name guarda o arquivo de origem. Extraia o período dela.'),
    Q('Combinar arquivos', 'Consultas auxiliares', 'Depois de combinar, apareceram as consultas “Arquivo de Exemplo”, “Parâmetro1” e “Transformar Arquivo”.', 'Para que serve “Transformar Arquivo”?',
      ['É a função aplicada a cada arquivo: alterações na consulta de exemplo valem para todos', 'É um backup da pasta', 'Pode ser apagada sem efeito', 'Guarda os arquivos excluídos'],
      'Editar a consulta “Transformar Arquivo de Exemplo” muda a função, que roda em todos os arquivos da pasta.'),
    N('Combinar arquivos', 'Linhas combinadas', 'A pasta tem 12 arquivos mensais com 850 linhas de dados cada. Cada arquivo também tem 1 linha de cabeçalho, promovida na função.', 'Quantas linhas de dados tem o resultado?', 12 * 850,
      'O cabeçalho é promovido em cada arquivo e não vira dado: 12 × 850 = 10.200 linhas.', { dec: 0 }),

    // ---- 2.2 Remodelar · Agrupar por (4)
    N('Agrupar por', 'Soma por canal', 'Você agrupa os pedidos por canal com a operação Soma de valor. Pedidos: ' + G.map(function (x) { return x[0] + ' ' + f(x[1], 2); }).join('; ') + '.', 'Qual o valor do grupo “Site” (R$, 2 casas)?', r(somaSite, 2),
      '75,50 + 132,00 + 410,00 = R$ ' + f(somaSite, 2) + '.', { unit: 'R$', dec: 2 }),
    Q('Agrupar por', 'Agrupamento avançado', 'Você quer, por canal, a soma do valor, a quantidade de pedidos e o ticket médio.', 'Como fazer?',
      ['Agrupar por canal no modo Avançado, com três agregações: Soma, Contar Linhas e Média', 'Três agrupamentos separados e mesclar depois', 'Coluna condicional', 'Transpor e somar'],
      'O modo avançado do Agrupar por cria várias agregações de uma vez.'),
    Q('Agrupar por', 'Linhas que somem', 'Depois de agrupar por canal, a coluna “cliente” desapareceu.', 'Por quê?',
      ['Agrupar por mantém só as colunas de agrupamento e as agregações; o resto é resumido', 'Erro de atualização', 'A coluna foi renomeada', 'O cliente estava vazio'],
      'Agrupar muda a granularidade: uma linha por grupo. Colunas não agregadas saem. Use Todas as Linhas para manter o detalhe aninhado.'),
    Q('Agrupar por', 'Onde agregar', 'O relatório do Power BI precisa analisar vendas por dia, produto e loja.', 'Agrupar no Power Query por mês é uma boa ideia?',
      ['Não: o modelo perde o detalhe por dia; agrupe só se a análise nunca precisar do nível mais fino', 'Sim, sempre agrupe por mês', 'Sim, porque o DAX não soma', 'Não, porque o Power Query não agrupa datas'],
      'Agrupar reduz o tamanho, mas perde detalhe. Defina a granularidade pela análise que o modelo precisa responder.'),
    // Transformar colunas em linhas (4)
    Q('Transformar colunas em linhas', 'Formato largo', 'A planilha de metas tem uma coluna por mês (jan, fev, mar…).', 'O que fazer para relacionar com o calendário no Power BI?',
      ['Selecionar a coluna loja e usar Transformar Outras Colunas em Linhas (unpivot)', 'Transpor a tabela', 'Agrupar por loja', 'Mesclar com o calendário'],
      'O unpivot gera as colunas Atributo (mês) e Valor (meta): uma linha por loja e mês, pronta para o modelo.', { d: largo }),
    N('Transformar colunas em linhas', 'Linhas após o unpivot', 'A tabela de metas tem 4 lojas e 3 colunas de meses (jan, fev, mar).', 'Quantas linhas após transformar os meses em linhas?', 4 * 3,
      '4 lojas × 3 meses = 12 linhas, com as colunas loja, Atributo e Valor.', { dec: 0, d: largo }),
    Q('Transformar colunas em linhas', 'Outras colunas', 'Você pode selecionar as colunas de meses e usar “Transformar Colunas em Linhas”, ou selecionar loja e usar “Transformar Outras Colunas em Linhas”.', 'Qual é mais robusta quando surgir a coluna “abr”?',
      ['Transformar Outras Colunas em Linhas: qualquer mês novo entra automaticamente', 'Transformar Colunas em Linhas, com os meses listados', 'As duas são iguais', 'Nenhuma aceita colunas novas'],
      '“Outras colunas” guarda só a coluna fixa (loja). Meses novos são transformados sem editar a consulta.'),
    N('Transformar colunas em linhas', 'Meta do trimestre', 'Na tabela de metas, a loja Norte tem 80, 85 e 90 (jan a mar).', 'Depois do unpivot e de um Agrupar por loja com Soma, qual a meta da Norte?', 80 + 85 + 90,
      '80 + 85 + 90 = 255. Com os dados em formato longo, agregações ficam simples.', { dec: 0, d: largo }),
    // Colunas dinâmicas (4)
    Q('Colunas dinâmicas', 'Pivot', 'A tabela tem uma linha por loja e indicador (Vendas, Pedidos, Ticket) e você precisa de uma coluna por indicador.', 'Qual comando?',
      ['Coluna Dinâmica (pivot) na coluna indicador, usando a coluna valor', 'Transformar Colunas em Linhas', 'Transpor', 'Dividir coluna'],
      'Pivot é o inverso do unpivot: transforma os valores de uma coluna em novas colunas.'),
    Q('Colunas dinâmicas', 'Não agregar', 'Ao fazer o pivot, cada combinação loja + indicador aparece uma única vez.', 'Qual opção de agregação usar?',
      ['Não Agregar', 'Soma', 'Contagem', 'Mediana'],
      'Quando cada célula tem um valor só, “Não Agregar” mantém o valor original. Com repetições, ela gera erro.'),
    Q('Colunas dinâmicas', 'Pivot no modelo', 'O analista fez pivot das vendas para ter uma coluna por mês e carregou no Power BI.', 'Qual o problema?',
      ['Para o modelo, o formato longo (uma coluna de mês) é melhor: filtros e inteligência de tempo ficam mais simples', 'Nenhum, é o ideal', 'O Power BI não aceita colunas numéricas', 'O pivot apaga as lojas'],
      'O formato largo é bom para leitura; para modelagem, o longo (normalizado) é melhor.'),
    Q('Colunas dinâmicas', 'Transpor ou pivot?', 'Você quer simplesmente trocar linhas por colunas, como “colar especial transposto”.', 'Qual comando?',
      ['Transpor', 'Coluna Dinâmica', 'Transformar Colunas em Linhas', 'Agrupar por'],
      'Transpor gira a tabela inteira. Pivot usa os valores de uma coluna como novos cabeçalhos.'),
    // Datas e calendário (5)
    N('Datas e calendário', 'Calendário de 2025', 'A tabela calendário é criada com List.Dates(#date(2025, 1, 1), Duracao, #duration(1, 0, 0, 0)) para cobrir o ano inteiro.', 'Qual deve ser o valor de Duracao?', 365,
      '2025 não é bissexto: 365 dias. Para 2024, seriam 366.', { dec: 0, d: code('let\n    Inicio = #date(2025, 1, 1),\n    Datas = List.Dates(Inicio, 365, #duration(1, 0, 0, 0)),\n    Tabela = Table.FromList(Datas, Splitter.SplitByNothing(), {"Data"})\nin\n    Tabela') }),
    K('Datas e calendário', 'Coluna de data', 'Você vai criar colunas na tabela calendário.', 'Classifique a função M que gera cada coluna.', ['Date.Year', 'Date.Month', 'Date.DayOfWeekName', 'Date.StartOfMonth'],
      [['2025', 0], ['1 (janeiro)', 1], ['quarta-feira', 2], ['01/01/2025 para qualquer dia de janeiro', 3]],
      'As funções Date.* extraem partes da data. Date.DayOfWeekName aceita a cultura "pt-BR".'),
    Q('Datas e calendário', 'Idade do pedido', 'Você quer os dias entre a data do pedido e a data de entrega.', 'Qual expressão de coluna personalizada?',
      ['Duration.Days([entrega] - [data_pedido])', '[entrega] + [data_pedido]', 'Date.Year([entrega])', 'Text.Length([entrega])'],
      'Subtrair datas gera uma duração; Duration.Days extrai o número de dias.'),
    Q('Datas e calendário', 'Calendário dinâmico', 'O calendário deve ir do primeiro pedido até o último, ajustando-se sozinho.', 'Como definir o início e o fim?',
      ['List.Min e List.Max da coluna de data da tabela de pedidos', 'Digitar as datas fixas', 'Usar sempre 1900 a 2100', 'Usar a data de hoje como início'],
      'List.Min(Pedidos[data]) e List.Max(Pedidos[data]) acompanham os dados a cada atualização.'),
    Q('Datas e calendário', 'Data e hora', 'A coluna “criado_em” tem data e hora (03/01/2025 14:32:10) e vai se relacionar com o calendário.', 'O que fazer?',
      ['Extrair só a data (DateTime.Date) e definir o tipo Data', 'Manter data e hora no relacionamento', 'Transformar em texto', 'Dividir por “:”'],
      'O calendário tem uma linha por dia. Para relacionar, a coluna da fato precisa ser do tipo Data, sem hora.'),

    // ---- 2.3 Linguagem M · Estrutura let (4)
    Q('Estrutura let', 'Lendo o código', 'Veja o código M em Dados do caso.', 'Qual etapa a consulta devolve?',
      ['Filtradas, a etapa depois do in', 'Fonte, a primeira etapa', 'Todas as etapas juntas', 'Tipos'],
      'Em let…in, cada linha é uma etapa nomeada. O que vem depois do in é o resultado da consulta.', { d: code('let\n    Fonte = Csv.Document(File.Contents("vendas.csv"), [Delimiter = ";"]),\n    Cabecalhos = Table.PromoteHeaders(Fonte),\n    Tipos = Table.TransformColumnTypes(Cabecalhos, {{"valor", type number}}),\n    Filtradas = Table.SelectRows(Tipos, each [valor] <> null)\nin\n    Filtradas') }),
    Q('Estrutura let', 'Referência à etapa anterior', 'Na linha Filtradas = Table.SelectRows(Tipos, each [valor] <> null).', 'O que significa “Tipos” aqui?',
      ['A tabela resultante da etapa Tipos, usada como entrada do filtro', 'Uma função que muda os tipos', 'O nome de uma coluna', 'Um comentário'],
      'Cada etapa normalmente recebe a anterior como primeiro argumento. É assim que a sequência se encadeia.'),
    Q('Estrutura let', 'Nome com espaço', 'O editor gerou a etapa #"Linhas Filtradas".', 'Por que o nome tem #" "?',
      ['Nomes com espaço ou acento precisam ser escritos como #"nome"', 'Indica que a etapa está com erro', 'É um comentário', 'Indica uma coluna'],
      '#"…" permite identificadores com espaços. Renomear as etapas sem espaços deixa o código mais limpo.'),
    O('Estrutura let', 'Montando a consulta', 'Você vai escrever a consulta à mão no Editor Avançado.', 'Coloque as linhas na ordem correta.',
      ['let', 'Fonte = Excel.Workbook(File.Contents("metas.xlsx")),', 'Metas = Fonte{[Name = "Metas"]}[Data],', 'Tipos = Table.TransformColumnTypes(Metas, {{"meta", type number}})', 'in', 'Tipos'],
      'let abre as etapas (separadas por vírgula, menos a última), in indica a etapa devolvida.'),
    // Coluna personalizada (4)
    Q('Coluna personalizada', 'Valor líquido', 'Você quer o valor líquido = valor − desconto numa coluna nova.', 'Qual fórmula na Coluna Personalizada?',
      ['[valor] - [desconto]', '=valor-desconto', 'SUM(valor) - SUM(desconto)', 'valor.desconto'],
      'Na Coluna Personalizada, as colunas da linha atual são referenciadas entre colchetes.'),
    N('Coluna personalizada', 'Com imposto', 'Coluna personalizada: Number.Round([valor] * 1.1, 2). O pedido 1009 tem valor 410.', 'Qual o resultado para esse pedido?', r(410 * 1.1, 2),
      '410 × 1,1 = 451,00.', { dec: 2, unit: 'R$', d: pedFig }),
    Q('Coluna personalizada', 'each e _', 'O código tem Table.AddColumn(Tipos, "Faixa", each if [valor] > 300 then "Alto" else "Baixo").', 'O que “each” significa?',
      ['Uma função aplicada a cada linha; [valor] é a coluna da linha atual', 'Um laço que soma todas as linhas', 'Uma variável global', 'Um comentário'],
      'each é atalho para (_) => …. [valor] é o mesmo que _[valor]: o campo da linha atual.'),
    Q('Coluna personalizada', 'Null na conta', 'A coluna personalizada [valor] - [desconto] dá null em algumas linhas.', 'Por quê?',
      ['Qualquer operação com null resulta em null: o desconto está vazio nessas linhas', 'Erro de tipo', 'Falta o each', 'O valor é negativo'],
      'Substitua null por 0 antes ou use (if [desconto] = null then 0 else [desconto]).'),
    // Funções M (4)
    K('Funções M', 'Família da função', 'Você consulta a documentação das funções M.', 'Classifique cada função pela família.', ['Texto', 'Número', 'Data', 'Tabela'],
      [['Text.Trim', 0], ['Number.Round', 1], ['Date.AddDays', 2], ['Table.SelectRows', 3], ['Text.Upper', 0], ['Table.Group', 3]],
      'As funções M são organizadas por prefixo: Text., Number., Date., Table., List.…'),
    Q('Funções M', 'Diferencia maiúsculas', 'A fórmula usa text.trim([cliente]) e dá erro.', 'Por quê?',
      ['M diferencia maiúsculas e minúsculas: o nome correto é Text.Trim', 'Faltou o each', 'Text.Trim não existe', 'O cliente é número'],
      'Em M, funções, etapas e colunas diferenciam maiúsculas. text.trim ≠ Text.Trim.'),
    Q('Funções M', 'Contém texto', 'Você quer marcar os produtos cujo nome contém “Bluetooth”.', 'Qual fórmula?',
      ['Text.Contains([nome], "Bluetooth")', 'Text.Start([nome], "Bluetooth")', '[nome] = "Bluetooth"', 'Text.Length([nome]) = 9'],
      'Text.Contains devolve true/false. Use o terceiro argumento Comparer.OrdinalIgnoreCase para ignorar maiúsculas.'),
    N('Funções M', 'Avaliando a função', 'Qual o resultado de Text.Length(Text.Trim(" Ana Souza "))?', 'Digite o número de caracteres.', 'Ana Souza'.length,
      'Text.Trim tira os espaços das pontas: “Ana Souza” tem 9 caracteres (o espaço do meio conta).', { dec: 0 }),
    // Listas e registros (5)
    K('Listas e registros', 'Que estrutura é?', 'Você está lendo código M.', 'Classifique cada valor.', ['Lista', 'Registro', 'Tabela'],
      [['{1, 2, 3}', 0], ['[nome = "Ana", uf = "SP"]', 1], ['#table({"a", "b"}, {{1, 2}})', 2], ['Pedidos[valor]', 0], ['Pedidos{0}', 1]],
      'Lista entre chaves; registro entre colchetes com campos; tabela é uma coleção de registros. Tabela[coluna] devolve uma lista; Tabela{n} devolve a linha n como registro.'),
    N('Listas e registros', 'List.Sum', 'Qual o resultado de List.Sum({189.9, 240, 98, 56.4})?', 'Digite o valor (2 casas).', r(189.9 + 240 + 98 + 56.4, 2),
      '189,9 + 240 + 98 + 56,4 = ' + f(189.9 + 240 + 98 + 56.4, 2) + '.', { dec: 2 }),
    Q('Listas e registros', 'Primeira linha', 'O código tem Pedidos{0}[cliente].', 'O que ele devolve?',
      ['O cliente da primeira linha (o índice começa em 0)', 'O cliente da linha 1, que é a segunda', 'A lista de todos os clientes', 'Um erro'],
      'Em M, as posições começam em 0. {0} é a primeira linha; [cliente] pega o campo.', { d: pedFig }),
    N('Listas e registros', 'Contar itens', 'Qual o resultado de List.Count(List.Distinct({"SP", "RJ", "MG", "SP", "BA", "RJ"}))?', 'Digite o número.', 4,
      'List.Distinct deixa {"SP", "RJ", "MG", "BA"}; List.Count conta 4 itens.', { dec: 0 }),
  ];

  /* ===================== NÍVEL 3 · AUTOMAÇÃO E PROJETO ===================== */
  const avancado = [
    // ---- 3.1 Automação · Parâmetros (4)
    Q('Parâmetros', 'Caminho em parâmetro', 'Cinco consultas apontam para \\\\servidor\\vendas\\2025 e a pasta vai mudar de lugar.', 'Qual a solução?',
      ['Criar um parâmetro com o caminho e usá-lo nas cinco consultas', 'Editar as cinco consultas toda vez', 'Copiar a pasta para cada computador', 'Criar cinco parâmetros iguais'],
      'Parâmetros centralizam valores que mudam (caminhos, servidores, datas). Uma alteração vale para todas as consultas.'),
    K('Parâmetros', 'Bom candidato a parâmetro?', 'Você revisa as consultas do projeto.', 'Classifique cada valor.', ['Parâmetro', 'Fixo no código'],
      [['Nome do servidor do banco (homologação ou produção)', 0], ['Caminho da pasta de arquivos', 0], ['Data de início da carga', 0], ['Nome da função Table.SelectRows', 1], ['A palavra-chave let', 1], ['Taxa de imposto usada em várias consultas', 0]],
      'Valores que mudam entre ambientes ou com o tempo viram parâmetros. A estrutura do código fica fixa.'),
    Q('Parâmetros', 'Filtro por parâmetro', 'O parâmetro DataInicio vale 01/01/2025.', 'Como usá-lo no filtro de pedidos?',
      ['Table.SelectRows(Tipos, each [data] >= DataInicio)', 'Table.SelectRows(Tipos, each [data] >= "DataInicio")', 'Table.SelectRows(Tipos, DataInicio)', 'Table.Parameter(DataInicio)'],
      'Parâmetro é usado como qualquer valor, pelo nome, sem aspas.', { d: code('Filtradas = Table.SelectRows(Tipos, each [data] >= DataInicio)') }),
    Q('Parâmetros', 'Parâmetro no Power BI Service', 'O mesmo relatório roda em homologação e em produção.', 'Qual a vantagem do parâmetro de servidor?',
      ['Trocar o ambiente nas configurações do conjunto de dados, sem editar consultas', 'Deixar o relatório mais bonito', 'Dispensar credenciais', 'Acelerar o DAX'],
      'Parâmetros podem ser alterados no serviço, facilitando a promoção entre ambientes.'),
    N('Parâmetros', 'Parâmetro de imposto', 'O parâmetro Imposto vale 0.12 e a coluna personalizada é [valor] * (1 + Imposto). O pedido 1003 tem valor 240.', 'Qual o resultado da coluna para esse pedido (2 casas)?', r(240 * 1.12, 2),
      '240 × 1,12 = 268,80. Se a alíquota mudar, basta alterar o parâmetro.', { unit: 'R$', dec: 2, d: pedFig }),
    // Funções personalizadas (4)
    Q('Funções personalizadas', 'Criar uma função', 'Você repete a mesma limpeza de texto (aparar, limpar e padronizar) em 6 colunas de 3 consultas.', 'O que fazer?',
      ['Criar uma função personalizada (texto) => … e invocá-la onde for preciso', 'Copiar as etapas 18 vezes', 'Fazer à mão no Excel', 'Criar 18 colunas condicionais'],
      'Funções evitam repetição: muda-se a regra num só lugar.', { d: code('LimparTexto = (t as nullable text) as nullable text =>\n    if t = null then null\n    else Text.Proper(Text.Clean(Text.Trim(t)))') }),
    N('Funções personalizadas', 'Avaliando a função', 'A função é Desconto = (valor as number, pct as number) => valor * (1 - pct).', 'Qual o resultado de Desconto(240, 0.15)?', r(240 * 0.85, 2),
      '240 × (1 − 0,15) = 240 × 0,85 = 204.', { dec: 2 }),
    Q('Funções personalizadas', 'Invocar em cada linha', 'Você tem a função LimparTexto e quer aplicá-la à coluna cliente.', 'Qual código?',
      ['Table.TransformColumns(Tipos, {{"cliente", LimparTexto}})', 'LimparTexto(Tipos)', 'Table.AddColumn(LimparTexto)', 'each LimparTexto'],
      'Table.TransformColumns aplica a função a cada valor da coluna indicada.'),
    Q('Funções personalizadas', 'Função para arquivos', 'Ao combinar arquivos de uma pasta, o Power Query cria “Transformar Arquivo”.', 'O que ela é?',
      ['Uma função personalizada gerada a partir do arquivo de exemplo, invocada para cada arquivo', 'Uma tabela de backup', 'Um parâmetro de texto', 'Um erro'],
      'É o mesmo conceito: uma função aplicada a cada item (cada arquivo) da lista.'),
    // Tratamento de erros (4)
    Q('Tratamento de erros', 'try otherwise', 'A conversão Number.From([qtd]) dá erro quando a quantidade vem como “a confirmar”.', 'Qual expressão devolve 0 nesses casos?',
      ['try Number.From([qtd]) otherwise 0', 'if error then 0', 'Number.From([qtd]) ?? 0', 'IFERROR(Number.From([qtd]), 0)'],
      'try … otherwise captura o erro e devolve o valor alternativo, sem quebrar a consulta.'),
    N('Tratamento de erros', 'Linhas com erro', 'A coluna qtd tem 2.000 linhas; 40 são “a confirmar”, 10 são “-” e o resto são números.', 'Quantas linhas recebem 0 com try … otherwise 0?', 50,
      '40 + 10 = 50 textos não convertem e caem no otherwise.', { dec: 0 }),
    Q('Tratamento de erros', 'Registrar o erro', 'Você quer manter o valor convertido e, quando der erro, guardar a mensagem para auditoria.', 'Qual abordagem?',
      ['Usar try sem otherwise: o resultado é um registro com HasError, Value e Error, que pode ser expandido', 'Remover Erros', 'Substituir Erros por null', 'Mudar o tipo para Qualquer'],
      'try sem otherwise devolve um registro. Expandindo-o, você tem o valor e a mensagem de erro para revisar.'),
    M('Tratamento de erros', 'Consulta resiliente', 'A consulta de pedidos quebra com frequência na atualização das 6h.', 'Marque as práticas que aumentam a resiliência.',
      ['Escolher colunas pelo nome (Table.SelectColumns com MissingField.UseNull)', 'Tratar conversões com try … otherwise', 'Criar uma consulta de erros para auditoria', 'Remover Erros sem olhar', 'Usar caminhos locais de arquivo'], [0, 1, 2],
      'Antecipe colunas ausentes, trate conversões e audite os erros. Remover às cegas esconde problemas.'),
    // Referência e organização (4)
    Q('Referência e organização', 'Referência ou duplicar?', 'Você precisa de duas consultas a partir da mesma base tratada: uma com vendas por loja e outra com devoluções.', 'Qual opção usar?',
      ['Referência: as duas partem da consulta base, e mudanças na base valem para ambas', 'Duplicar: copia todas as etapas, que passam a ser independentes', 'Copiar e colar o resultado em outra planilha', 'Criar a base duas vezes'],
      'Referência cria uma nova consulta que começa no resultado da base. Duplicar repete as etapas, e manter duas cópias dá trabalho.'),
    O('Referência e organização', 'Camadas', 'Você organiza o projeto do Power BI em camadas.', 'Coloque na ordem do fluxo.',
      ['Origem: conexão com a fonte, sem transformação', 'Staging: limpeza e tipos', 'Modelo: dimensões e fatos finais', 'Carga: só as consultas finais habilitadas'],
      'Separar origem, preparação e modelo facilita a manutenção e o reaproveitamento.'),
    Q('Referência e organização', 'Desabilitar carga', 'As consultas de origem e de staging aparecem como tabelas no modelo do Power BI.', 'O que fazer?',
      ['Desmarcar “Habilitar carga” nas consultas intermediárias', 'Apagar as consultas intermediárias', 'Ocultar as tabelas no relatório', 'Duplicar as tabelas'],
      'Consultas intermediárias continuam sendo calculadas, mas sem a carga não pesam no modelo nem confundem o usuário.'),
    Q('Referência e organização', 'Grupos de consultas', 'O projeto tem 34 consultas soltas no painel lateral.', 'Como organizar?',
      ['Criar grupos (Parâmetros, Funções, Staging, Dimensões, Fatos) e nomes padronizados', 'Juntar tudo numa consulta só', 'Apagar as antigas', 'Ordenar alfabeticamente e pronto'],
      'Grupos e convenções de nome deixam o projeto navegável para quem vem depois.'),

    // ---- 3.2 Desempenho e atualização · Query folding (4)
    Q('Query folding', 'O que é', 'A consulta lê uma tabela do SQL Server com 50 milhões de linhas e filtra o ano de 2025.', 'O que é query folding nesse caso?',
      ['O Power Query traduz o filtro para SQL e o servidor devolve só as linhas de 2025', 'O Power Query baixa tudo e filtra no computador', 'A consulta é dobrada em duas', 'O filtro é ignorado'],
      'Com folding, as etapas viram uma consulta nativa executada na fonte. Muito menos dados trafegam.'),
    K('Query folding', 'Dobra ou quebra?', 'A consulta lê uma tabela de um banco SQL.', 'Classifique cada etapa (em geral).', ['Costuma dobrar', 'Costuma quebrar o folding'],
      [['Filtrar linhas por data', 0], ['Remover colunas', 0], ['Agrupar por com soma', 0], ['Adicionar coluna de índice', 1], ['Table.Buffer', 1], ['Coluna personalizada com função M sem equivalente em SQL', 1]],
      'Operações com equivalente em SQL dobram. Índice, buffer e funções sem tradução quebram, e as etapas seguintes rodam localmente.'),
    Q('Query folding', 'Ver a consulta nativa', 'Você quer saber se uma etapa ainda está dobrando.', 'Como verificar?',
      ['Clicar com o botão direito na etapa: se “Exibir Consulta Nativa” estiver habilitado, ela dobra (ou usar os indicadores de folding)', 'Olhar a cor da coluna', 'Contar as linhas', 'Atualizar duas vezes'],
      'Exibir Consulta Nativa mostra o SQL gerado. Os indicadores de etapa também mostram onde o folding para.'),
    Q('Query folding', 'Ordem das etapas', 'Uma coluna de índice foi adicionada antes do filtro de data.', 'O que melhora o desempenho?',
      ['Mover os filtros e a remoção de colunas para antes das etapas que quebram o folding', 'Adicionar mais índices', 'Colocar Table.Buffer no início', 'Nada, a ordem não importa'],
      'Faça primeiro tudo o que dobra (filtros, seleção de colunas). O que quebra o folding vai para o fim.'),
    // Desempenho (4)
    M('Desempenho', 'Consulta lenta', 'A atualização da consulta de pedidos leva 25 minutos.', 'Marque as ações que costumam acelerar.',
      ['Filtrar linhas e remover colunas o mais cedo possível', 'Garantir o query folding nas fontes de banco', 'Evitar mesclagens com tabelas enormes sem necessidade', 'Adicionar uma coluna de índice no início', 'Duplicar a consulta para dividir o trabalho'], [0, 1, 2],
      'Menos dados desde o começo e trabalho na fonte reduzem o tempo. Índice no início quebra o folding.'),
    N('Desempenho', 'Colunas desnecessárias', 'A tabela tem 60 colunas e o modelo usa 12.', 'Qual % das colunas pode sair (sem casas)?', r(48 / 60 * 100, 0),
      '(60 − 12) ÷ 60 = 80%. Remover colunas reduz o tamanho do modelo e o tempo de atualização.', { unit: '%', dec: 0 }),
    Q('Desempenho', 'Table.Buffer', 'Uma consulta de 200 linhas é usada dentro de uma função chamada para cada uma das 50 mil linhas de outra tabela.', 'Quando Table.Buffer ajuda?',
      ['Para guardar a tabela pequena em memória e evitar que ela seja relida a cada chamada', 'Sempre, em todas as etapas', 'Para garantir o query folding', 'Para reduzir o número de colunas'],
      'Buffer guarda o resultado em memória. Ajuda em reuso repetido, mas quebra o folding e consome memória.'),
    Q('Desempenho', 'Coluna calculada ou Power Query?', 'Você precisa da faixa de valor do pedido (Baixo, Médio, Alto) no modelo.', 'Onde é melhor criar?',
      ['No Power Query (ou na fonte): a coluna é calculada na carga e comprime melhor', 'Sempre em DAX, como coluna calculada', 'Num visual do relatório', 'No Excel, à mão'],
      'Quanto mais perto da fonte, melhor (Roche: “o mais a montante possível e o mais a jusante necessário”).'),
    // Privacidade e credenciais (4)
    Q('Privacidade e credenciais', 'Erro de firewall', 'A consulta mescla um arquivo do SharePoint com o banco de clientes e dá o erro “Formula.Firewall”.', 'O que ele indica?',
      ['O Power Query está protegendo os dados ao combinar fontes com níveis de privacidade diferentes', 'O arquivo está corrompido', 'O banco caiu', 'Faltou o each'],
      'O firewall impede que dados de uma fonte vazem para outra. Ajuste os níveis de privacidade ou reorganize as consultas.'),
    K('Privacidade e credenciais', 'Nível de privacidade', 'Você configura as fontes do projeto.', 'Classifique o nível mais adequado.', ['Privado', 'Organizacional', 'Público'],
      [['Banco de dados com salários', 0], ['SharePoint interno da empresa', 1], ['Site de cotação do dólar', 2], ['Cadastro de clientes com CPF', 0], ['Planilha de metas da diretoria comercial', 1]],
      'Privado isola dados sensíveis; organizacional permite combinar dentro da empresa; público é para dados abertos.'),
    Q('Privacidade e credenciais', 'Credenciais', 'Um colega abriu o arquivo e o Power Query pediu login no banco de dados.', 'Por quê?',
      ['As credenciais ficam no computador (ou no serviço) de cada usuário, não no arquivo', 'O arquivo perdeu as consultas', 'O banco foi apagado', 'O colega não tem Excel'],
      'Credenciais não viajam com o arquivo. Cada usuário precisa de acesso à fonte, o que protege os dados.'),
    Q('Privacidade e credenciais', 'Senha no código', 'Um analista colocou o usuário e a senha do banco no código M para “facilitar”.', 'Qual o problema?',
      ['Quem abrir o arquivo vê a senha: use o gerenciador de credenciais', 'Nenhum', 'O código fica lento', 'O M não aceita texto'],
      'Senhas no código vazam junto com o arquivo. Credenciais pertencem às configurações da fonte de dados.'),
    // Atualização (5)
    Q('Atualização', 'Atualização agendada', 'O relatório no Power BI Service lê um banco SQL Server instalado na rede interna da empresa.', 'O que é necessário para a atualização agendada?',
      ['Um gateway de dados local conectando o serviço à rede interna', 'Nada, o serviço acessa a rede interna sozinho', 'Abrir o Power BI Desktop todo dia', 'Copiar o banco para o OneDrive'],
      'Fontes locais precisam do gateway. Fontes na nuvem (SharePoint Online, Azure SQL) não precisam.'),
    K('Atualização', 'Precisa de gateway?', 'O projeto tem várias fontes.', 'Classifique cada fonte.', ['Precisa de gateway', 'Não precisa'],
      [['SQL Server no servidor da empresa', 0], ['Pasta compartilhada na rede (\\\\servidor\\vendas)', 0], ['Planilha no SharePoint Online', 1], ['Banco Azure SQL', 1], ['Arquivo no disco C: de um computador', 0]],
      'Tudo o que está dentro da rede ou num computador local precisa do gateway; serviços de nuvem, não.'),
    Q('Atualização', 'Atualização incremental', 'A tabela de pedidos tem 8 anos de histórico e a carga completa leva 2 horas.', 'Qual recurso ajuda?',
      ['Atualização incremental com os parâmetros RangeStart e RangeEnd, recarregando só o período recente', 'Apagar o histórico', 'Atualizar uma vez por ano', 'Dividir em 8 arquivos'],
      'A incremental particiona por data e recarrega só os últimos dias ou meses. Depende de folding no filtro de datas.'),
    Q('Atualização', 'Excel: atualizar ao abrir', 'O relatório de Excel deve trazer os dados atualizados toda vez que alguém abre o arquivo.', 'Qual configuração?',
      ['Propriedades da consulta > Atualizar dados ao abrir o arquivo', 'Gravar uma macro de copiar e colar', 'Fechar e Carregar Para… uma nova planilha a cada vez', 'Não é possível no Excel'],
      'Nas propriedades da conexão, “Atualizar ao abrir” e “Atualizar a cada N minutos” automatizam a atualização no Excel.'),
    N('Atualização', 'Tempo economizado', 'Antes, o relatório levava 3 horas por mês de trabalho manual. Com o Power Query, leva 10 minutos.', 'Quantas horas por ano são economizadas (1 casa)?', r((180 - 10) * 12 / 60, 1),
      '(180 − 10) min × 12 meses = 2.040 min = 34 horas por ano.', { unit: 'horas', dec: 1 }),

    // ---- 3.3 Modelagem e projeto · Dimensões e fatos (4)
    K('Dimensões e fatos', 'Fato ou dimensão?', 'Você está desenhando o modelo estrela da NexusMarket.', 'Classifique cada tabela.', ['Fato', 'Dimensão'],
      [['Pedidos (data, cliente, produto, valor)', 0], ['Clientes (nome, cidade, segmento)', 1], ['Produtos (nome, categoria, marca)', 1], ['Devoluções (data, pedido, motivo, valor)', 0], ['Calendário', 1], ['Lojas (cidade, região, gerente)', 1]],
      'Fatos registram eventos com medidas (valor, quantidade); dimensões descrevem quem, o quê, onde e quando.'),
    O('Dimensões e fatos', 'Da planilha única ao modelo', 'Você recebeu uma planilha única com pedido, cliente, cidade, produto, categoria e valor.', 'Coloque as etapas na ordem.',
      ['Criar a consulta base tratada (tipos e limpeza)', 'Criar a dimensão Produtos por referência, com colunas de produto e Remover Duplicadas', 'Criar a dimensão Clientes da mesma forma', 'Criar a fato com as chaves e as medidas, sem os atributos descritivos', 'Carregar e relacionar no modelo estrela'],
      'A partir de uma base única, as dimensões saem por referência e remoção de duplicadas; a fato fica só com chaves e medidas.'),
    Q('Dimensões e fatos', 'Atributos na fato', 'A fato de pedidos carrega nome do cliente, cidade, categoria e marca em cada linha (2 milhões de linhas).', 'Qual o problema?',
      ['Repetição de texto que aumenta o modelo; esses atributos pertencem às dimensões', 'Nenhum, é mais simples', 'O DAX não lê texto', 'O Power Query não aceita'],
      'Fatos estreitas (chaves + números) e dimensões descritivas formam o modelo estrela, menor e mais rápido.'),
    Q('Dimensões e fatos', 'Desnormalizar dimensões', 'Produtos tem categoria_id e a tabela Categorias tem o nome da categoria (modelo floco de neve).', 'O que fazer no Power Query para o modelo estrela?',
      ['Mesclar Categorias em Produtos e expandir o nome, deixando uma única dimensão Produtos', 'Manter as duas tabelas relacionadas em cadeia', 'Acrescentar Categorias em Produtos', 'Apagar a categoria'],
      'No modelo estrela, cada dimensão é uma tabela só. Mesclar desnormaliza a cadeia.'),
    // Chaves e granularidade (4)
    Q('Chaves e granularidade', 'Chave da dimensão', 'A dimensão Clientes tem cliente_id repetido para o mesmo cliente com dois endereços.', 'Qual o problema no modelo?',
      ['A relação 1:N exige chave única no lado da dimensão; a duplicidade quebra ou distorce o relacionamento', 'Nenhum', 'Só um aviso visual', 'O Power BI soma os endereços'],
      'Na dimensão, a chave deve ser única. Decida qual endereço manter (o mais recente, por exemplo) antes de carregar.'),
    N('Chaves e granularidade', 'Clientes únicos', 'Uma lista de cliente_id tem: C1, C2, C3, C2, C4, C1, C5, C3.', 'Quantas linhas a dimensão terá depois de Remover Duplicadas por cliente_id?', 5,
      'C1, C2, C3, C4 e C5: 5 clientes únicos.', { dec: 0 }),
    Q('Chaves e granularidade', 'Granularidade da meta', 'As vendas estão por dia e produto; as metas, por mês e categoria.', 'Como relacionar?',
      ['Manter cada tabela na sua granularidade e relacionar pelas dimensões em comum (mês do calendário, categoria)', 'Repetir a meta em cada linha de venda', 'Agrupar as vendas por mês e jogar fora o detalhe', 'Mesclar as metas na fato de vendas'],
      'Fatos com granularidades diferentes convivem no modelo, ligadas a dimensões no nível comum.'),
    Q('Chaves e granularidade', 'Chave composta', 'Não existe um id único na tabela de estoque: a linha é única pela combinação loja + produto + data.', 'Como criar uma chave para relacionar?',
      ['Uma coluna personalizada concatenando loja, produto e data (ou relacionar pelas dimensões separadas)', 'Usar só a coluna loja', 'Adicionar um índice aleatório', 'Não relacionar'],
      'Chave composta concatenada resolve quando é preciso um relacionamento por várias colunas.'),
    // Perfil e qualidade (4)
    Q('Perfil e qualidade', 'Qualidade da coluna', 'Você ativou Exibir > Qualidade da Coluna.', 'O que ela mostra?',
      ['% de valores válidos, com erro e vazios em cada coluna', 'A média de cada coluna', 'O tempo de atualização', 'O tamanho do arquivo'],
      'Qualidade, Distribuição e Perfil da Coluna mostram a saúde dos dados antes de carregar.'),
    Q('Perfil e qualidade', 'Só 1.000 linhas', 'O perfil da coluna mostra 0% de erros, mas o modelo recebe erros na carga.', 'Qual a explicação provável?',
      ['O perfil é calculado sobre as primeiras 1.000 linhas; mude para “com base no conjunto de dados inteiro”', 'O perfil está errado', 'Os erros vêm do DAX', 'O Power BI cria erros sozinho'],
      'Por padrão, o perfil usa as primeiras 1.000 linhas. Na barra de status, troque para o conjunto inteiro.'),
    N('Perfil e qualidade', 'Valores vazios', 'Na coluna e-mail, a Qualidade da Coluna mostra 92% válidos e 0% de erros, em 25.000 linhas.', 'Quantas linhas estão vazias?', 25000 * 0.08,
      '100% − 92% − 0% = 8% vazios; 8% × 25.000 = 2.000 linhas.', { dec: 0 }),
    M('Perfil e qualidade', 'Checklist de qualidade', 'Antes de publicar o modelo, você revisa os dados.', 'Marque as verificações importantes.',
      ['Chaves únicas nas dimensões', 'Tipos corretos em todas as colunas', 'Contagem de linhas batendo com a fonte', 'Nomes das etapas em inglês', 'Todas as colunas da fonte carregadas'], [0, 1, 2],
      'Chaves, tipos e reconciliação com a fonte garantem a confiança. Carregar tudo só pesa o modelo.'),
    // Desafio final (4)
    O('Desafio final', 'O projeto completo', 'Desafio final: o relatório mensal de vendas da NexusMarket vai ser automatizado.', 'Coloque as etapas na ordem.',
      ['Conectar à pasta de CSVs com um parâmetro de caminho', 'Combinar os arquivos e tratar tipos, textos e erros', 'Mesclar com as dimensões de produto e loja', 'Remodelar as metas com unpivot e criar o calendário', 'Desabilitar a carga das consultas intermediárias', 'Publicar e agendar a atualização com gateway'],
      'Fonte parametrizada → limpeza → combinação → remodelagem → organização → publicação.'),
    Q('Desafio final', 'Diagnóstico', 'Desafio final: depois que o ERP mudou o nome de uma coluna de “Valor” para “Valor Total”, a consulta parou de atualizar com “A coluna Valor da tabela não foi encontrada”.', 'Qual a correção mais robusta?',
      ['Renomear a coluna logo no início (ou selecionar com MissingField) e alinhar com a equipe do ERP um layout estável', 'Apagar a etapa Tipo Alterado', 'Recriar a consulta do zero todo mês', 'Desativar a atualização'],
      'Etapas guardam nomes de colunas. Trate a mudança num ponto só, no começo, e combine contratos de layout com a origem.'),
    K('Desafio final', 'Escolha a transformação', 'Desafio final: escolha a transformação para cada problema.', 'Classifique cada problema.', ['Mesclar', 'Acrescentar', 'Transformar colunas em linhas', 'Agrupar por', 'Preencher para baixo'],
      [['Trazer a categoria do produto para as vendas', 0], ['Juntar as vendas de 2024 e 2025', 1], ['Metas com uma coluna por mês', 2], ['Total de vendas por loja', 3], ['Região só na primeira linha de cada grupo', 4]],
      'Chave → mesclar; mesmo layout → acrescentar; colunas de período → unpivot; resumo → agrupar; células vazias de grupo → preencher.'),
    N('Desafio final', 'Pedidos de SP', 'Desafio final: com os pedidos de Dados do caso, você remove as duplicadas por pedido_id, coloca a UF em MAIÚSCULAS e filtra uf = "SP".', 'Quantos pedidos sobram?', sp.length,
      'Pedidos 1001, 1004, 1006 (“sp”, corrigido para SP) e 1009: ' + sp.length + ' pedidos.', { dec: 0, d: pedFig }),
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
        id: 'pq' + lv.id + '-' + String(pos).padStart(2, '0'), index: EXERCISES.length,
        level: lv.id, levelName: lv.nome, pos: pos, diff: difficulty(lv.id, pos), track: 'powerquery',
      }));
    });
  });
  global.PQData = { P: P, pedFig: pedFig, vendFig: vendFig, prodFig: prodFig, largo: largo, J: J, uniq: uniq, validos: validos, appTodos: appTodos, somaApp: somaApp };
  global.PQBank = { EXERCISES: EXERCISES, LEVELS: LEVELS.map(function (l) { return { id: l.id, key: l.key, nome: l.nome }; }) };
})(typeof window !== 'undefined' ? window : globalThis);
