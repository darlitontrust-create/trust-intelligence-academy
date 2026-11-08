/* =====================================================================
   lessons.js — Conteúdo teórico exibido antes de cada exercício
   ---------------------------------------------------------------------
   Cada exercício aponta para uma aula (pelo tópico `t`). A aula vira um
   carrossel de 5 slides:
     1. Conceito       — ideia central + analogia
     2. Sintaxe        — estrutura do comando + observações
     3. Exemplo ao vivo — consulta executada de verdade no banco
     4. Cuidados       — erros comuns e boas práticas
     5. Seu desafio    — gerado a partir do próprio exercício
   Cada slide tem um roteiro de narração por voz (ver narrator.js).
   ===================================================================== */
(function (global) {
  'use strict';

  /* ------------------------------ Conteúdo ------------------------------ */
  const L = {};
  function lesson(key, kw, titulo, ideia, analogia, sintaxe, notas, exemplo, cuidados) {
    L[key] = { key: key, kw: kw, titulo: titulo, ideia: ideia, analogia: analogia, sintaxe: sintaxe, notas: notas, exemplo: exemplo, cuidados: cuidados };
  }

  lesson('select', 'SELECT', 'SELECT e FROM: lendo uma tabela',
    'Toda consulta começa dizendo de onde vêm os dados (FROM) e quais colunas você quer ver (SELECT). O banco devolve uma tabela de resultado sem alterar os dados originais.',
    'Pense numa planilha: FROM escolhe a aba e SELECT escolhe as colunas que vão aparecer no relatório.',
    'SELECT coluna1, coluna2\nFROM tabela;\n\n-- todas as colunas\nSELECT *\nFROM tabela;',
    ['O asterisco (*) traz todas as colunas, na ordem em que foram criadas.', 'Separe as colunas por vírgula. A última não leva vírgula.', 'O ponto e vírgula encerra a instrução.'],
    { p: 'Listando nome e cargo da equipe:', sql: 'SELECT nome, cargo\nFROM funcionarios;' },
    ['Em tabelas grandes, evite SELECT * em produção: traga só as colunas necessárias.', 'O nome da coluna precisa existir na tabela. Confira a estrutura antes de escrever.', 'SQL não diferencia maiúsculas nos comandos, mas escrever SELECT, FROM e WHERE em maiúsculas facilita a leitura.']);

  lesson('alias', 'AS', 'Apelidos (AS) e colunas calculadas',
    'Você pode renomear colunas no resultado com AS e criar colunas novas a partir de contas com as existentes. Nada disso muda a tabela; vale só para a consulta.',
    'É como trocar o cabeçalho de uma coluna no relatório e adicionar uma coluna de fórmula ao lado.',
    'SELECT coluna AS novo_nome,\n       preco * 0.9 AS preco_desconto\nFROM tabela;',
    ['Operadores aritméticos: +  -  *  /', 'Use apelidos sem espaços, ou entre aspas duplas.', 'ROUND(valor, 2) arredonda para 2 casas decimais.'],
    { p: 'Margem em reais de cada produto:', sql: 'SELECT nome AS produto,\n       preco - custo AS margem_reais\nFROM produtos;' },
    ['Divisão entre inteiros pode truncar: use 100.0 em vez de 100 para forçar decimal.', 'O apelido criado no SELECT pode ser usado no ORDER BY, mas não no WHERE.', 'Qualquer conta com NULL resulta em NULL.']);

  lesson('distinct', 'DISTINCT', 'DISTINCT: removendo repetições',
    'DISTINCT elimina linhas duplicadas do resultado. É a forma mais rápida de descobrir quais valores diferentes existem em uma coluna.',
    'Equivale ao "Remover duplicatas" do Excel, aplicado só ao resultado da consulta.',
    'SELECT DISTINCT coluna\nFROM tabela;\n\n-- combinações únicas\nSELECT DISTINCT coluna1, coluna2\nFROM tabela;',
    ['Com várias colunas, DISTINCT considera a combinação inteira.', 'Fica logo depois do SELECT, antes das colunas.'],
    { p: 'Quais cargos existem na empresa?', sql: 'SELECT DISTINCT cargo\nFROM funcionarios;' },
    ['DISTINCT não é filtro: ele não escolhe qual linha manter, só remove as iguais.', 'Usar DISTINCT para "consertar" duplicatas de um JOIN costuma esconder um erro de relacionamento.', 'COUNT(DISTINCT coluna) conta quantos valores únicos existem.']);

  lesson('limit', 'LIMIT', 'LIMIT: só as primeiras linhas',
    'LIMIT corta o resultado em uma quantidade máxima de linhas. Combinado com ORDER BY, vira a ferramenta de "Top N".',
    'É pedir "me mostra só os 5 primeiros da lista".',
    'SELECT colunas\nFROM tabela\nLIMIT 5;\n\n-- pulando linhas (paginação)\nSELECT colunas FROM tabela\nLIMIT 5 OFFSET 10;',
    ['LIMIT é sempre a última cláusula.', 'No SQL Server o equivalente é TOP; no Oracle, FETCH FIRST n ROWS ONLY.'],
    { p: 'Três primeiros pedidos cadastrados:', sql: 'SELECT id, data_pedido, valor_total\nFROM pedidos\nLIMIT 3;' },
    ['Sem ORDER BY, "as primeiras linhas" não têm ordem garantida.', 'Use LIMIT para explorar tabelas grandes sem travar a consulta.', 'OFFSET permite paginar resultados.']);

  lesson('where', 'WHERE', 'WHERE: filtrando linhas',
    'WHERE define uma condição. Só as linhas em que a condição é verdadeira entram no resultado.',
    'É o filtro da planilha: você define a regra e o banco esconde o que não atende.',
    "SELECT colunas\nFROM tabela\nWHERE coluna = 'valor';",
    ['Comparações:  =   <>   >   <   >=   <=', 'Textos e datas vão entre aspas simples; números, sem aspas.'],
    { p: 'Funcionários do departamento de Tecnologia (id 3):', sql: 'SELECT nome, cargo, salario\nFROM funcionarios\nWHERE departamento_id = 3;' },
    ["Aspas duplas indicam nome de coluna. Para texto use aspas simples: 'MG'.", "A comparação de texto diferencia maiúsculas: 'mg' é diferente de 'MG'.", 'WHERE vem depois do FROM e antes do GROUP BY e do ORDER BY.']);

  lesson('logic', 'AND', 'AND, OR e parênteses',
    'Para combinar condições use AND (todas precisam ser verdadeiras) e OR (basta uma). NOT inverte uma condição.',
    'AND estreita a busca; OR amplia.',
    'WHERE condicao1 AND condicao2\nWHERE condicao1 OR condicao2\nWHERE (a OR b) AND c\nWHERE NOT condicao',
    ['AND é avaliado antes de OR.', 'Parênteses deixam a intenção explícita.'],
    { p: 'Pedidos entregues acima de R$ 5.000:', sql: "SELECT id, status, valor_total\nFROM pedidos\nWHERE status = 'Entregue'\n  AND valor_total > 5000;" },
    ["status = 'A' OR status = 'B' AND valor > 10 é lido como A OR (B AND valor > 10).", 'Na dúvida, coloque parênteses.', 'Vários OR na mesma coluna ficam mais legíveis com IN.']);

  lesson('in-between', 'IN', 'IN e BETWEEN',
    'IN testa se o valor está em uma lista. BETWEEN testa se está dentro de um intervalo, incluindo as duas pontas.',
    'IN é uma lista de convidados; BETWEEN é uma faixa de idade.',
    "WHERE estado IN ('SP', 'RJ')\nWHERE estado NOT IN ('SP')\nWHERE preco BETWEEN 100 AND 500",
    ['BETWEEN a AND b equivale a >= a AND <= b.', 'Funciona com números, textos e datas no formato AAAA-MM-DD.'],
    { p: 'Pedidos do segundo trimestre de 2026:', sql: "SELECT id, data_pedido, status\nFROM pedidos\nWHERE data_pedido BETWEEN '2026-04-01' AND '2026-06-30';" },
    ['BETWEEN inclui os dois limites.', "Em colunas com data e hora, BETWEEN '2026-06-01' AND '2026-06-30' perde o dia 30 depois da meia-noite.", 'NOT IN com uma lista que contenha NULL não retorna nenhuma linha.']);

  lesson('like', 'LIKE', 'LIKE: buscando por padrão de texto',
    'LIKE compara um texto com um padrão usando curingas: % representa qualquer sequência de caracteres e _ representa exatamente um caractere.',
    'É a busca "começa com", "termina com" ou "contém".',
    "WHERE nome LIKE 'A%'      -- começa com A\nWHERE nome LIKE '%silva'  -- termina com silva\nWHERE nome LIKE '%pro%'   -- contém pro\nWHERE codigo LIKE 'A_1'   -- A, um caractere, 1",
    ['No SQLite, LIKE ignora maiúsculas e minúsculas em letras sem acento.'],
    { p: 'Clientes com e-mail do domínio email.com:', sql: "SELECT nome, email\nFROM clientes\nWHERE email LIKE '%@email.com';" },
    ['Padrões que começam com % não usam índice e podem ser lentos.', 'Em outros bancos LIKE diferencia maiúsculas (no PostgreSQL existe ILIKE).', 'Sem curingas, LIKE funciona como =.']);

  lesson('null', 'NULL', 'NULL: o valor desconhecido',
    'NULL significa ausência de valor. Não é zero nem texto vazio, e qualquer comparação com = NULL fica indefinida. Por isso usamos IS NULL.',
    'Um campo NULL é uma pergunta do formulário que ficou sem resposta.',
    "WHERE email IS NULL\nWHERE email IS NOT NULL\nSELECT COALESCE(email, 'sem e-mail')",
    ['COALESCE devolve o primeiro valor não nulo da lista.', 'IFNULL(a, b) é a versão com dois argumentos.'],
    { p: 'Funcionários sem gestor (topo da hierarquia):', sql: 'SELECT nome, cargo\nFROM funcionarios\nWHERE gerente_id IS NULL;' },
    ['= NULL nunca é verdadeiro; use IS NULL.', 'COUNT(coluna) ignora NULL; COUNT(*) conta todas as linhas.', 'Somar com NULL resulta em NULL: proteja com COALESCE(coluna, 0).']);

  lesson('order', 'ORDER BY', 'ORDER BY: ordenando o resultado',
    'ORDER BY define a ordem das linhas. ASC é crescente (o padrão) e DESC é decrescente. Dá para ordenar por várias colunas.',
    'É o "Classificar de A a Z" com níveis de desempate.',
    'SELECT colunas\nFROM tabela\nORDER BY coluna1 DESC, coluna2 ASC;',
    ['A segunda coluna só desempata quando a primeira é igual.', 'Pode ordenar pelo apelido ou pela posição da coluna: ORDER BY 2.'],
    { p: 'Equipe do maior para o menor salário:', sql: 'SELECT nome, cargo, salario\nFROM funcionarios\nORDER BY salario DESC;' },
    ['Sem ORDER BY a ordem do resultado não é garantida.', 'Com LIMIT, defina critérios de desempate para resultados estáveis.', 'No SQLite, NULL aparece primeiro em ordem crescente.']);

  lesson('dates', 'DATE', 'Trabalhando com datas',
    'No SQLite as datas são guardadas como texto AAAA-MM-DD. Esse formato ordena e compara corretamente, e funções como date(), strftime() e julianday() fazem as contas.',
    '2026-06-30 é lido da esquerda para a direita como um número grande: ano, mês, dia.',
    "date('2026-06-30', '-30 days')      -- 2026-05-31\nstrftime('%Y-%m', data_pedido)      -- '2026-06'\nstrftime('%Y', data_pedido)         -- '2026'\njulianday(fim) - julianday(inicio)  -- dias entre datas",
    ['Modificadores aceitos: +1 day, -1 month, start of month.', 'Em outros bancos: DATEADD, DATEDIFF e EXTRACT.'],
    { p: 'Dias desde a admissão até 30/06/2026:', sql: "SELECT nome, data_admissao,\n       julianday('2026-06-30') - julianday(data_admissao) AS dias\nFROM funcionarios;" },
    ['Datas como 30/06/2026 não ordenam corretamente.', 'strftime devolve texto; use CAST(... AS INTEGER) para fazer contas.', 'Aplicar funções na coluna dentro do WHERE impede o uso de índice.']);

  lesson('aggregates', 'SUM', 'Funções de agregação',
    'Agregações resumem várias linhas em um único valor: COUNT conta, SUM soma, AVG calcula a média, MIN e MAX encontram os extremos.',
    'É a linha de total que você coloca no rodapé de uma planilha.',
    'SELECT COUNT(*)   AS linhas,\n       SUM(valor) AS total,\n       AVG(valor) AS media,\n       MIN(valor), MAX(valor)\nFROM tabela;',
    ['COUNT(DISTINCT coluna) conta valores únicos.', 'Agregações aceitam expressões: SUM(quantidade * preco).'],
    { p: 'Resumo da folha de pagamento:', sql: 'SELECT COUNT(*) AS pessoas,\n       SUM(salario) AS folha,\n       ROUND(AVG(salario), 2) AS media,\n       MAX(salario) AS maior\nFROM funcionarios;' },
    ['Agregações ignoram NULL (exceto COUNT(*)).', 'Sem GROUP BY, o resultado é sempre uma única linha.', 'Não misture coluna comum e agregação no SELECT sem GROUP BY.']);

  lesson('groupby', 'GROUP BY', 'GROUP BY: agrupando dados',
    'GROUP BY separa as linhas em grupos com o mesmo valor e calcula as agregações para cada grupo. É a base de quase todo relatório.',
    'É a tabela dinâmica do Excel: as linhas são a coluna do GROUP BY e os valores são a agregação.',
    'SELECT coluna_grupo, COUNT(*), SUM(valor)\nFROM tabela\nGROUP BY coluna_grupo;',
    ['Toda coluna do SELECT que não é agregação deve estar no GROUP BY.', 'Pode agrupar por expressões, como o mês de uma data.'],
    { p: 'Pessoas e salário médio por departamento:', sql: 'SELECT departamento_id,\n       COUNT(*) AS pessoas,\n       ROUND(AVG(salario), 2) AS media\nFROM funcionarios\nGROUP BY departamento_id;' },
    ['Ordem de execução: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY.', 'O SQLite aceita colunas fora do GROUP BY, mas outros bancos dão erro. Evite.', 'Filtre linhas antes com WHERE; filtre grupos depois com HAVING.']);

  lesson('having', 'HAVING', 'HAVING: filtrando grupos',
    'HAVING filtra o resultado depois do agrupamento e pode usar agregações. WHERE não aceita SUM ou COUNT porque roda antes de os grupos existirem.',
    'WHERE escolhe quais notas fiscais entram na soma; HAVING escolhe quais totais aparecem no relatório.',
    'SELECT coluna, SUM(valor) AS total\nFROM tabela\nWHERE condicao_de_linha\nGROUP BY coluna\nHAVING SUM(valor) > 1000;',
    ['HAVING vem depois do GROUP BY.', 'WHERE e HAVING podem aparecer na mesma consulta.'],
    { p: 'Departamentos com mais de 2 pessoas:', sql: 'SELECT departamento_id, COUNT(*) AS pessoas\nFROM funcionarios\nGROUP BY departamento_id\nHAVING COUNT(*) > 2;' },
    ['WHERE SUM(...) gera erro: use HAVING.', 'Filtros que não dependem de agregação são mais rápidos no WHERE.', 'Repita a expressão no HAVING para manter compatibilidade com outros bancos.']);

  lesson('calc', 'ROUND', 'Cálculos, arredondamento e percentuais',
    'Relatórios precisam de números prontos para leitura: margens, percentuais e médias arredondadas. Tudo isso é feito com expressões no SELECT.',
    'É a coluna de fórmula que transforma valores brutos em indicadores.',
    'ROUND(valor, 2)\n100.0 * parte / total             -- percentual\n(preco - custo) / preco * 100     -- margem %\nparte / (SELECT SUM(x) FROM t)    -- % do total',
    ['Multiplique por 100.0 para evitar divisão inteira.', 'Uma subconsulta pode trazer o total geral para o cálculo.'],
    { p: 'Peso de cada departamento na folha:', sql: 'SELECT departamento_id,\n       SUM(salario) AS folha,\n       ROUND(100.0 * SUM(salario) /\n         (SELECT SUM(salario) FROM funcionarios), 1) AS pct\nFROM funcionarios\nGROUP BY departamento_id;' },
    ['5 / 2 = 2 em divisão inteira; 5.0 / 2 = 2.5.', 'Arredonde só no final para não acumular erro.', 'Proteja divisões por zero com NULLIF(divisor, 0).']);

  lesson('subquery', '( SELECT )', 'Subconsultas',
    'Uma subconsulta é um SELECT dentro de outro, entre parênteses. Ela pode devolver um valor (escalar), uma lista (para IN) ou uma tabela inteira (no FROM).',
    'É resolver uma pergunta auxiliar antes da principal: "qual é a média?" e depois "quem está acima dela?".',
    'WHERE preco > (SELECT AVG(preco) FROM produtos)\nWHERE id IN (SELECT cliente_id FROM pedidos)\nFROM (SELECT ...) AS t',
    ['A subconsulta escalar precisa retornar exatamente um valor.', 'No FROM, dê um apelido à subconsulta.'],
    { p: 'Funcionários que ganham acima da média geral:', sql: 'SELECT nome, salario\nFROM funcionarios\nWHERE salario > (SELECT AVG(salario) FROM funcionarios);' },
    ['NOT IN com subconsulta que retorna NULL não devolve nada; prefira NOT EXISTS.', 'Subconsultas repetidas podem ser lentas; considere uma CTE.', 'Teste a subconsulta sozinha antes de encaixá-la.']);

  lesson('join', 'JOIN', 'INNER JOIN: cruzando tabelas',
    'Dados relacionais ficam espalhados em tabelas ligadas por chaves. INNER JOIN junta as linhas que têm correspondência nas duas tabelas.',
    'É o PROCV do Excel, só que trazendo quantas colunas quiser e de várias tabelas ao mesmo tempo.',
    'SELECT p.id, c.nome\nFROM pedidos p\nJOIN clientes c ON c.id = p.cliente_id;',
    ['JOIN e INNER JOIN são a mesma coisa.', 'Apelidos curtos (p, c) evitam ambiguidade.', 'Encadeie vários JOINs para três ou mais tabelas.'],
    { p: 'Funcionários com o nome do departamento:', sql: 'SELECT f.nome, d.nome AS departamento\nFROM funcionarios f\nJOIN departamentos d ON d.id = f.departamento_id;' },
    ['Linhas sem correspondência somem no INNER JOIN.', 'Colunas com o mesmo nome nas duas tabelas precisam de prefixo (p.id).', 'Uma condição de ON errada multiplica linhas: confira a contagem.']);

  lesson('leftjoin', 'LEFT JOIN', 'LEFT JOIN: mantendo todas as linhas da esquerda',
    'LEFT JOIN traz todas as linhas da tabela da esquerda, mesmo sem correspondência. Onde não há par, as colunas da direita ficam NULL.',
    'É a lista completa de clientes com a coluna de pedidos em branco para quem nunca comprou.',
    'SELECT c.nome, p.id\nFROM clientes c\nLEFT JOIN pedidos p ON p.cliente_id = c.id;\n\n-- só quem não tem par\n... WHERE p.id IS NULL',
    ['Use COUNT(p.id) para contar 0 em quem não tem par.', 'COALESCE troca o NULL por um valor padrão.'],
    { p: 'Departamentos e quantidade de pessoas, incluindo vazios:', sql: 'SELECT d.nome, COUNT(f.id) AS pessoas\nFROM departamentos d\nLEFT JOIN funcionarios f ON f.departamento_id = d.id\nGROUP BY d.id, d.nome;' },
    ['Filtrar a tabela da direita no WHERE transforma o LEFT em INNER. Coloque o filtro no ON.', 'COUNT(*) conta 1 para linhas sem par; use COUNT(coluna_da_direita).', 'A ordem das tabelas importa no LEFT JOIN.']);

  lesson('rightjoin', 'RIGHT JOIN', 'RIGHT JOIN e FULL JOIN',
    'RIGHT JOIN é o espelho do LEFT: mantém todas as linhas da tabela da direita. FULL JOIN mantém as linhas das duas tabelas.',
    'O resultado é o mesmo do LEFT, só que lendo a consulta pelo outro lado.',
    'SELECT ...\nFROM a\nRIGHT JOIN b ON b.id = a.b_id;\n\nSELECT ...\nFROM a\nFULL JOIN b ON b.id = a.b_id;',
    ['A RIGHT JOIN B equivale a B LEFT JOIN A.', 'O SQLite suporta RIGHT e FULL a partir da versão 3.39.'],
    { p: 'Departamentos e funcionários a partir de um RIGHT JOIN:', sql: 'SELECT d.nome AS departamento, f.nome\nFROM funcionarios f\nRIGHT JOIN departamentos d ON d.id = f.departamento_id;' },
    ['Muitos times padronizam em LEFT JOIN para facilitar a leitura.', 'Misturar LEFT e RIGHT na mesma consulta confunde; reorganize as tabelas.', 'FULL JOIN é útil para reconciliar duas fontes de dados.']);

  lesson('selfjoin', 'SELF JOIN', 'SELF JOIN: a tabela com ela mesma',
    'Quando uma tabela aponta para ela mesma (funcionário → gerente), você a usa duas vezes no FROM, com apelidos diferentes.',
    'São duas cópias do mesmo cadastro: uma para o funcionário, outra para o chefe.',
    'SELECT f.nome, g.nome AS gerente\nFROM funcionarios f\nLEFT JOIN funcionarios g ON g.id = f.gerente_id;',
    ['Os apelidos são obrigatórios aqui.', 'Use LEFT JOIN para manter quem não tem gerente.'],
    { p: 'Quantos subordinados diretos cada gestor tem:', sql: 'SELECT g.nome AS gestor, COUNT(f.id) AS equipe\nFROM funcionarios g\nJOIN funcionarios f ON f.gerente_id = g.id\nGROUP BY g.id, g.nome;' },
    ['Sem apelidos o banco não sabe qual "cópia" você quer.', 'Para vários níveis de hierarquia, use CTE recursiva.', 'Também serve para comparar linhas da mesma tabela, como pares de produtos.']);

  lesson('union', 'UNION', 'UNION e UNION ALL',
    'UNION empilha resultados de consultas diferentes em uma única tabela. UNION remove duplicatas; UNION ALL mantém tudo e é mais rápido.',
    'É colar uma lista embaixo da outra.',
    "SELECT nome, 'Cliente' AS tipo FROM clientes\nUNION ALL\nSELECT nome, 'Funcionário' FROM funcionarios;",
    ['Mesmo número de colunas em todos os SELECTs.', 'Os nomes das colunas vêm do primeiro SELECT.'],
    { p: 'Contagem de registros de duas tabelas em uma só consulta:', sql: "SELECT 'departamentos' AS tabela, COUNT(*) AS linhas FROM departamentos\nUNION ALL\nSELECT 'categorias', COUNT(*) FROM categorias;" },
    ['Os tipos das colunas devem ser compatíveis na mesma posição.', 'ORDER BY vale para o resultado final e vai no último SELECT.', 'Prefira UNION ALL quando duplicatas não importam.']);

  lesson('setops', 'EXCEPT', 'INTERSECT e EXCEPT',
    'INTERSECT devolve o que aparece nos dois resultados. EXCEPT devolve o que está no primeiro e não está no segundo.',
    'São a interseção e a diferença de conjuntos, como num diagrama de Venn.',
    'SELECT cliente_id FROM a\nINTERSECT\nSELECT cliente_id FROM b;\n\nSELECT id FROM produtos\nEXCEPT\nSELECT produto_id FROM itens_pedido;',
    ['Removem duplicatas, como o UNION.', 'No Oracle o EXCEPT se chama MINUS.'],
    { p: 'Vendedores com pedidos em 2025 e também em 2026:', sql: "SELECT vendedor_id FROM pedidos WHERE data_pedido < '2026-01-01'\nINTERSECT\nSELECT vendedor_id FROM pedidos WHERE data_pedido >= '2026-01-01';" },
    ['A ordem importa no EXCEPT: A EXCEPT B é diferente de B EXCEPT A.', 'As colunas precisam ser equivalentes nas duas consultas.', 'EXISTS e NOT EXISTS resolvem o mesmo problema quando você precisa de mais colunas.']);

  lesson('case', 'CASE', 'CASE: lógica condicional',
    'CASE cria valores de acordo com condições, como o SE do Excel. Serve para classificar, criar faixas e transformar linhas em colunas.',
    'É um SE(…; …; SE(…)) aninhado, só que bem mais legível.',
    "CASE\n  WHEN condicao1 THEN 'A'\n  WHEN condicao2 THEN 'B'\n  ELSE 'C'\nEND AS classe",
    ['A primeira condição verdadeira vence.', 'Dentro de SUM, conta as linhas que atendem à condição.'],
    { p: 'Classificando funcionários por tempo de casa:', sql: "SELECT nome, data_admissao,\n  CASE\n    WHEN data_admissao < '2019-01-01' THEN 'Veterano'\n    WHEN data_admissao < '2022-01-01' THEN 'Experiente'\n    ELSE 'Recente'\n  END AS perfil\nFROM funcionarios;" },
    ['Sem ELSE, o resultado é NULL quando nenhuma condição combina.', 'A ordem das condições importa: coloque as mais restritivas primeiro.', 'SUM(CASE WHEN ... THEN 1 ELSE 0 END) é o "contar se" do SQL.']);

  lesson('cte', 'WITH', 'CTE: consultas com WITH',
    'Uma CTE (Common Table Expression) dá nome a uma consulta intermediária usando WITH. Você monta o raciocínio em etapas, como blocos.',
    'É criar uma aba auxiliar na planilha antes do relatório final.',
    'WITH etapa1 AS (\n  SELECT ...\n),\netapa2 AS (\n  SELECT ... FROM etapa1\n)\nSELECT * FROM etapa2;',
    ['Várias CTEs são separadas por vírgula, com um único WITH.', 'A CTE existe apenas durante a consulta.'],
    { p: 'Salário médio por departamento, depois filtrando os maiores:', sql: 'WITH medias AS (\n  SELECT departamento_id, AVG(salario) AS media\n  FROM funcionarios\n  GROUP BY departamento_id\n)\nSELECT d.nome, ROUND(m.media, 2) AS media\nFROM medias m\nJOIN departamentos d ON d.id = m.departamento_id\nWHERE m.media > 12000;' },
    ['Não coloque vírgula antes do SELECT final.', 'Dê nomes que digam o que a CTE representa (totais, vendas_mes).', 'CTEs deixam consultas longas fáceis de revisar e depurar.']);

  lesson('view', 'VIEW', 'VIEW: consultas salvas',
    'Uma view guarda uma consulta com nome dentro do banco. Depois você consulta a view como se fosse uma tabela, e ela sempre reflete os dados atuais.',
    'É um relatório salvo que qualquer pessoa ou ferramenta, como o Power BI, pode abrir.',
    'CREATE VIEW vw_nome AS\nSELECT ...\nFROM ...;\n\nSELECT * FROM vw_nome;',
    ['Prefixos como vw_ ajudam a identificar views.', 'DROP VIEW vw_nome remove a view.'],
    { p: 'Criando e consultando uma view da equipe:', sql: 'CREATE VIEW vw_equipe AS\nSELECT f.nome, d.nome AS departamento\nFROM funcionarios f\nJOIN departamentos d ON d.id = f.departamento_id;\n\nSELECT * FROM vw_equipe;' },
    ['A view não guarda dados, só a consulta (exceto views materializadas).', 'Evite views em cima de views em muitos níveis: fica difícil otimizar.', 'Views simplificam o acesso e escondem a complexidade dos JOINs.']);

  lesson('groupconcat', 'CONCAT', 'GROUP_CONCAT: juntando textos',
    'GROUP_CONCAT junta os valores de um grupo em um único texto, separado pelo delimitador que você escolher.',
    'É o UNIRTEXTO do Excel aplicado a cada grupo.',
    "SELECT grupo, GROUP_CONCAT(coluna, ', ')\nFROM tabela\nGROUP BY grupo;",
    ['No PostgreSQL e no SQL Server a função se chama STRING_AGG.', 'No MySQL também é GROUP_CONCAT.'],
    { p: 'Pessoas de cada departamento em uma linha:', sql: "SELECT departamento_id, GROUP_CONCAT(nome, ', ') AS pessoas\nFROM funcionarios\nGROUP BY departamento_id;" },
    ['A ordem dos itens não é garantida.', 'Bom para exibição, ruim para análise: não filtre por um texto concatenado.', 'Valores NULL são ignorados.']);

  lesson('correlated', 'EXISTS', 'Subconsultas correlacionadas e EXISTS',
    'Uma subconsulta correlacionada usa colunas da consulta de fora e é avaliada para cada linha. EXISTS verifica se a subconsulta retorna pelo menos uma linha.',
    'Para cada cliente, a pergunta: "existe algum pedido dele acima de X?".',
    'SELECT c.nome\nFROM clientes c\nWHERE EXISTS (\n  SELECT 1 FROM pedidos p\n  WHERE p.cliente_id = c.id\n);',
    ['SELECT 1 é convenção: EXISTS só se importa se há linha.', 'NOT EXISTS é o jeito seguro de dizer "não tem".'],
    { p: 'Funcionários acima da média do próprio departamento:', sql: 'SELECT f.nome, f.departamento_id, f.salario\nFROM funcionarios f\nWHERE f.salario > (\n  SELECT AVG(f2.salario) FROM funcionarios f2\n  WHERE f2.departamento_id = f.departamento_id\n);' },
    ['Use apelidos diferentes dentro e fora da subconsulta.', 'Em tabelas grandes, correlacionadas podem ser lentas; window functions costumam resolver melhor.', 'NOT EXISTS lida corretamente com NULL; NOT IN não.']);

  lesson('kpis', 'KPI', 'Indicadores de negócio em SQL',
    'Receita, custo, lucro, margem, ticket médio e atingimento de meta são as métricas que a diretoria acompanha. Em SQL, cada uma é uma combinação de agregações.',
    'É a mesma lógica de uma medida DAX, só que calculada na origem dos dados.',
    'receita = SUM(qtd * preco_unitario)\nlucro   = receita - SUM(qtd * custo)\nmargem  = 100.0 * lucro / receita\nticket  = AVG(valor_total)\nmeta %  = 100.0 * realizado / meta',
    ['Defina o filtro de negócio (por exemplo, sem cancelados) antes de agregar.', 'Calcule em uma CTE e formate no SELECT final.'],
    { p: 'Receita, custo e margem de tudo o que foi vendido:', sql: 'SELECT SUM(i.quantidade * i.preco_unitario) AS receita,\n       SUM(i.quantidade * p.custo) AS custo,\n       ROUND(100.0 * (SUM(i.quantidade * i.preco_unitario) - SUM(i.quantidade * p.custo))\n         / SUM(i.quantidade * i.preco_unitario), 1) AS margem\nFROM itens_pedido i\nJOIN produtos p ON p.id = i.produto_id;' },
    ['Média de percentuais é diferente do percentual da soma. Calcule a razão sobre os totais.', 'Deixe claro no relatório quais status entram no faturamento.', 'LEFT JOIN garante que metas sem venda apareçam com 0.']);

  lesson('rownumber', 'OVER', 'Window functions e ROW_NUMBER',
    'Window functions calculam sobre um conjunto de linhas relacionadas sem agrupar o resultado: cada linha continua visível. ROW_NUMBER numera as linhas segundo uma ordem.',
    'É como numerar a fila de cada caixa do supermercado separadamente.',
    'ROW_NUMBER() OVER (\n  PARTITION BY grupo\n  ORDER BY coluna\n) AS n',
    ['PARTITION BY reinicia a contagem por grupo (é opcional).', 'ORDER BY define a sequência dentro da janela.'],
    { p: 'Numerando funcionários por admissão em cada departamento:', sql: 'SELECT departamento_id, nome, data_admissao,\n  ROW_NUMBER() OVER (PARTITION BY departamento_id ORDER BY data_admissao) AS ordem\nFROM funcionarios;' },
    ['Window functions não podem ir direto no WHERE. Calcule numa CTE e filtre fora.', 'ROW_NUMBER nunca repete números, mesmo com empate.', '"O primeiro de cada grupo" é ROW_NUMBER ... = 1.']);

  lesson('rank', 'RANK', 'RANK e DENSE_RANK',
    'RANK e DENSE_RANK criam rankings tratando empates: valores iguais recebem a mesma posição. RANK pula posições depois de um empate; DENSE_RANK não.',
    'Dois medalhistas de ouro: no RANK o próximo é o 3º; no DENSE_RANK é o 2º.',
    'RANK()       OVER (ORDER BY valor DESC)\nDENSE_RANK() OVER (PARTITION BY grupo ORDER BY valor DESC)',
    ['Valores 100, 100, 90 → RANK 1, 1, 3 · DENSE_RANK 1, 1, 2 · ROW_NUMBER 1, 2, 3.'],
    { p: 'Ranking de orçamento dos departamentos:', sql: 'SELECT nome, orcamento,\n  RANK() OVER (ORDER BY orcamento DESC) AS posicao\nFROM departamentos;' },
    ['Para "Top N por grupo", use DENSE_RANK numa CTE e filtre <= N.', 'Escolha a função pela regra de empate do negócio.', 'Lembre do DESC para "maior primeiro".']);

  lesson('windowagg', 'SUM OVER', 'Acumulados e médias móveis com OVER',
    'SUM, AVG e COUNT também funcionam como window functions. Com ORDER BY dentro do OVER viram acumulados; com um frame (ROWS BETWEEN) viram médias móveis.',
    'É o saldo do extrato bancário: cada linha mostra o total até ali.',
    'SUM(valor) OVER (ORDER BY data)                  -- acumulado\nSUM(valor) OVER (PARTITION BY cliente ORDER BY data)\nAVG(valor) OVER (ORDER BY data\n  ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)        -- média móvel\nSUM(valor) OVER ()                               -- total geral',
    ['OVER () vazio considera todas as linhas.', 'Útil para calcular % do total sem subconsulta.'],
    { p: 'Folha acumulada por ordem de admissão:', sql: 'SELECT nome, data_admissao, salario,\n  SUM(salario) OVER (ORDER BY data_admissao) AS folha_acumulada\nFROM funcionarios;' },
    ['Com datas repetidas, o frame padrão soma as linhas empatadas juntas. Use ROWS para controlar.', 'A média móvel das primeiras linhas usa menos de N valores.', 'Agregação com OVER não reduz linhas, ao contrário do GROUP BY.']);

  lesson('laglead', 'LAG', 'LAG e LEAD: olhando para trás e para frente',
    'LAG busca o valor da linha anterior e LEAD o da próxima, dentro da ordem que você definir. É a forma natural de comparar períodos.',
    'É a coluna "mês anterior" ao lado do mês atual.',
    'LAG(valor)  OVER (ORDER BY mes)               -- anterior\nLEAD(valor) OVER (PARTITION BY cliente ORDER BY data)\nLAG(valor, 2, 0) OVER (...)                    -- 2 linhas atrás, padrão 0',
    ['Crescimento % = 100.0 * (atual - anterior) / anterior.'],
    { p: 'Salário do colega admitido antes, no mesmo departamento:', sql: 'SELECT departamento_id, nome, data_admissao, salario,\n  LAG(salario) OVER (PARTITION BY departamento_id ORDER BY data_admissao) AS salario_anterior\nFROM funcionarios;' },
    ['A primeira linha de cada partição recebe NULL.', 'Para filtrar pelo resultado do LAG, calcule numa CTE.', 'LAG pega a linha anterior, não o mês anterior: garanta que não faltam períodos.']);

  lesson('ntile', 'NTILE', 'NTILE, FIRST_VALUE e CUME_DIST',
    'NTILE(n) divide as linhas em n grupos de tamanho parecido (quartis, decis). FIRST_VALUE traz o primeiro valor da janela. CUME_DIST mostra a posição relativa, de 0 a 1.',
    'NTILE(4) é separar a turma em quatro filas pela nota.',
    'NTILE(4) OVER (ORDER BY valor DESC)\nFIRST_VALUE(nome) OVER (PARTITION BY grupo ORDER BY valor DESC)\nCUME_DIST() OVER (ORDER BY valor)',
    ['LAST_VALUE precisa do frame completo: ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING.'],
    { p: 'Dividindo a equipe em 3 faixas salariais:', sql: 'SELECT nome, salario,\n  NTILE(3) OVER (ORDER BY salario DESC) AS faixa\nFROM funcionarios;' },
    ['Se o total não divide exato, os primeiros grupos ficam com uma linha a mais.', 'Inclua um desempate no ORDER BY para resultados estáveis.', 'CUME_DIST 0,8 significa que 80% dos valores são menores ou iguais.']);

  lesson('recursive', 'RECURSIVE', 'CTE recursiva',
    'Uma CTE recursiva chama a si mesma. Começa com uma consulta âncora e repete a parte recursiva até não gerar novas linhas. Serve para hierarquias e para gerar sequências.',
    'É descer um organograma nível por nível até chegar ao último funcionário.',
    'WITH RECURSIVE r(n) AS (\n  SELECT 1                -- âncora\n  UNION ALL\n  SELECT n + 1 FROM r     -- passo\n  WHERE n < 10            -- parada\n)\nSELECT * FROM r;',
    ['Sempre tenha uma condição de parada.', 'Ótimo para gerar calendários e preencher meses sem dados.'],
    { p: 'Gerando os 7 primeiros dias de julho de 2026:', sql: "WITH RECURSIVE dias(d) AS (\n  SELECT '2026-07-01'\n  UNION ALL\n  SELECT date(d, '+1 day') FROM dias WHERE d < '2026-07-07'\n)\nSELECT d AS dia, strftime('%w', d) AS dia_semana FROM dias;" },
    ['Sem condição de parada, a consulta roda até estourar o limite.', 'Use UNION ALL: é mais rápido e é o padrão em recursão.', 'No SQL Server não se escreve RECURSIVE; no PostgreSQL e no SQLite, sim.']);

  lesson('trigger', 'TRIGGER', 'Triggers: automação no banco',
    'Um trigger executa comandos automaticamente quando algo acontece em uma tabela: INSERT, UPDATE ou DELETE. Dentro dele, OLD é a linha antes e NEW é a linha depois.',
    'É uma regra "quando isso acontecer, faça aquilo", como uma automação do Power Automate.',
    'CREATE TRIGGER nome\nAFTER UPDATE OF coluna ON tabela\nWHEN OLD.coluna <> NEW.coluna\nBEGIN\n  INSERT INTO log (...) VALUES (OLD.id, ...);\nEND;',
    ['BEFORE roda antes da operação; AFTER, depois.', 'RAISE(ABORT, mensagem) cancela a operação.'],
    { p: 'Trigger que registra mudanças de orçamento, testado com um UPDATE:', sql: 'CREATE TABLE log_orc (dep INTEGER, antes REAL, depois REAL);\nCREATE TRIGGER trg_orc AFTER UPDATE OF orcamento ON departamentos\nBEGIN\n  INSERT INTO log_orc VALUES (OLD.id, OLD.orcamento, NEW.orcamento);\nEND;\nUPDATE departamentos SET orcamento = orcamento * 1.05 WHERE id = 2;\nSELECT * FROM log_orc;' },
    ['Triggers ficam "invisíveis" para quem lê a aplicação: documente-os.', 'Evite triggers que disparam outros triggers em cadeia.', 'Use para auditoria e integridade, não para regras de negócio complexas.']);

  lesson('procedure', 'EXEC', 'Stored procedures',
    'Uma stored procedure é um bloco de SQL salvo no banco, com nome e parâmetros, que você executa quando precisar. Ela centraliza rotinas repetidas.',
    'É uma macro do Excel com campos de entrada.',
    'CREATE PROCEDURE sp_nome (@param INTEGER) AS\nBEGIN\n  SELECT ... WHERE coluna = @param;\nEND;\n\nEXEC sp_nome 10;',
    ['Sintaxe no estilo T-SQL (SQL Server).', 'O SQLite não tem procedures: a plataforma emula CREATE PROCEDURE e EXEC para você praticar.'],
    { p: 'Procedure que lista a equipe de um departamento:', sql: 'CREATE PROCEDURE sp_equipe (@dep INTEGER) AS\nBEGIN\n  SELECT nome, cargo FROM funcionarios WHERE departamento_id = @dep;\nEND;\nEXEC sp_equipe 3;' },
    ['Parâmetros de texto e data vão entre aspas no EXEC.', 'Procedures facilitam permissões: o usuário executa sem acessar a tabela diretamente.', 'No PostgreSQL a sintaxe usa CREATE PROCEDURE ou FUNCTION com LANGUAGE plpgsql.']);

  lesson('upsert', 'MERGE', 'MERGE e UPSERT',
    'MERGE sincroniza uma tabela destino com uma origem: atualiza o que já existe e insere o que é novo. No SQLite e no PostgreSQL isso é feito com INSERT ... ON CONFLICT DO UPDATE.',
    'É atualizar a planilha mestra com um arquivo novo sem duplicar linhas.',
    '-- SQL Server / Oracle\nMERGE INTO destino d USING origem o ON d.id = o.id\nWHEN MATCHED THEN UPDATE SET ...\nWHEN NOT MATCHED THEN INSERT ...;\n\n-- SQLite / PostgreSQL\nINSERT INTO destino (...) VALUES (...)\nON CONFLICT (chave) DO UPDATE SET col = excluded.col;',
    ['excluded representa a linha que tentou entrar.', 'A chave do ON CONFLICT precisa ser PRIMARY KEY ou UNIQUE.', 'UPDATE ... FROM atualiza a partir de outra tabela.'],
    { p: 'Renomeando uma categoria existente e criando outra no mesmo comando:', sql: "INSERT INTO categorias (id, nome) VALUES (6, 'Brinquedos e Jogos'), (7, 'Games')\nON CONFLICT (id) DO UPDATE SET nome = excluded.nome;\nSELECT * FROM categorias;" },
    ['Com INSERT ... SELECT, o SQLite exige um WHERE antes do ON CONFLICT (WHERE true).', 'Teste a carga numa cópia antes de rodar em produção.', 'Depois da carga, confira quantas linhas foram inseridas e atualizadas.']);

  lesson('customer', 'RFM', 'Análise de clientes: ciclo de vida, RFM e retenção',
    'Para entender clientes, analistas usam três lentes: ciclo de vida (primeira e última compra), RFM (Recência, Frequência e Valor) e retenção (quem voltou a comprar).',
    'É o raio-X da carteira de clientes que alimenta o CRM.',
    "recencia   = julianday('hoje') - julianday(MAX(data))\nfrequencia = COUNT(*)\nvalor      = SUM(valor_total)\nscore      = NTILE(3) OVER (ORDER BY metrica)\nretencao   = clientes presentes nos dois períodos",
    ['Monte uma CTE base por cliente e calcule os scores em seguida.', 'Na recência, quanto menor, melhor.'],
    { p: 'Primeira e última venda de cada vendedor (a mesma ideia aplicada à equipe):', sql: 'SELECT vendedor_id,\n       MIN(data_pedido) AS primeira,\n       MAX(data_pedido) AS ultima,\n       COUNT(*) AS pedidos\nFROM pedidos\nGROUP BY vendedor_id;' },
    ['Fixe a data de referência ("hoje") para ter resultados reproduzíveis.', 'Decida se pedidos cancelados entram na análise.', 'A taxa de retenção usa a base do período inicial como denominador.']);

  lesson('abc', 'ABC', 'Curva ABC e análise de Pareto',
    'A curva ABC ordena os itens pela contribuição e acumula o percentual. Os itens A somam cerca de 80% do resultado, os B os próximos 15% e os C o restante.',
    'É o princípio de Pareto: poucos produtos fazem a maior parte da receita.',
    "SUM(receita) OVER (ORDER BY receita DESC)  -- acumulado\n/ SUM(receita) OVER ()                     -- total\nCASE WHEN pct <= 80 THEN 'A' ...",
    ['Combina CTE, window function acumulada e CASE.'],
    { p: 'Participação acumulada da folha por funcionário:', sql: 'SELECT nome, salario,\n  ROUND(100.0 * SUM(salario) OVER (ORDER BY salario DESC, nome)\n    / SUM(salario) OVER (), 1) AS pct_acumulado\nFROM funcionarios;' },
    ['Inclua um desempate no ORDER BY para o acumulado ficar estável.', 'Os cortes 80/95 são convenção; ajuste ao negócio.', 'Calcule a receita por item antes, numa CTE.']);

  lesson('basket', 'PAIRS', 'Análise de cesta: comprados juntos',
    'Para descobrir produtos que saem juntos, faça um SELF JOIN dos itens pelo mesmo pedido e conte os pares. É a base das recomendações "quem comprou também levou".',
    'É olhar os carrinhos de compra e anotar quais itens aparecem lado a lado.',
    'FROM itens a\nJOIN itens b\n  ON a.pedido_id = b.pedido_id\n AND a.produto_id < b.produto_id\nGROUP BY a.produto_id, b.produto_id',
    ['a.produto_id < b.produto_id evita pares repetidos (A,B e B,A) e o item pareado com ele mesmo.'],
    { p: 'Pedidos com mais de um produto:', sql: 'SELECT pedido_id, COUNT(*) AS produtos\nFROM itens_pedido\nGROUP BY pedido_id\nHAVING COUNT(*) > 1;' },
    ['Use < e não <> para não contar o mesmo par duas vezes.', 'Filtre pares raros com HAVING.', 'Em bases grandes o SELF JOIN cresce rápido: restrinja o período.']);

  lesson('index', 'INDEX', 'Índices: acelerando consultas',
    'Um índice é uma estrutura ordenada que permite ao banco encontrar linhas sem ler a tabela inteira. Ele acelera WHERE, JOIN e ORDER BY nas colunas indexadas.',
    'É o índice remissivo de um livro: você vai direto à página certa.',
    'CREATE INDEX idx_tabela_coluna ON tabela (coluna);\nCREATE INDEX idx_composto ON tabela (col1, col2);\nEXPLAIN QUERY PLAN SELECT ...;',
    ['Em índice composto a ordem das colunas importa: o filtro deve usar a primeira.', 'EXPLAIN QUERY PLAN mostra se o índice está sendo usado.'],
    { p: 'Criando um índice e conferindo o plano de execução:', sql: 'CREATE INDEX idx_func_dep ON funcionarios (departamento_id);\nEXPLAIN QUERY PLAN\nSELECT nome FROM funcionarios WHERE departamento_id = 3;' },
    ['Índices aceleram leituras, mas deixam INSERT e UPDATE mais lentos.', 'Não indexe tudo: priorize colunas de filtro e de JOIN.', 'Chaves primárias já têm índice automaticamente.']);

  lesson('tuning', 'TUNING', 'Otimização: consultas eficientes',
    'Consultas lentas costumam repetir os mesmos padrões: funções aplicadas na coluna filtrada, subconsultas recalculadas a cada linha e colunas desnecessárias. Reescrever resolve a maioria.',
    'É reorganizar o caminho em vez de comprar um carro mais rápido.',
    "-- evite (não usa índice)\nWHERE strftime('%Y', data) = '2026'\n\n-- prefira (SARGable)\nWHERE data >= '2026-01-01' AND data < '2027-01-01'",
    ['SARGable significa que a condição permite busca pelo índice.', 'Troque subconsultas correlacionadas por CTE + JOIN.'],
    { p: 'Plano de execução de um filtro por intervalo de datas:', sql: "CREATE INDEX idx_ped_data ON pedidos (data_pedido);\nEXPLAIN QUERY PLAN\nSELECT id FROM pedidos\nWHERE data_pedido >= '2026-01-01' AND data_pedido < '2027-01-01';" },
    ['Meça antes e depois: otimize o que realmente é lento.', 'Traga só as colunas necessárias.', 'Calcule uma vez numa CTE e reutilize, em vez de repetir a mesma subconsulta.']);

  lesson('dashboard', 'BI', 'Do SQL ao painel executivo',
    'Um painel executivo reúne várias técnicas: CTEs para organizar, agregações para os números, window functions para ranking e participação, e JOINs para dar nome às coisas.',
    'É entregar ao Power BI uma tabela pronta, com as regras de negócio aplicadas na origem.',
    'WITH base AS (...),      -- filtros e JOINs\n     metricas AS (...),  -- GROUP BY\n     ranking AS (...)    -- window functions\nSELECT ...\nFROM metricas JOIN ranking ...',
    ['Construa etapa por etapa e rode cada CTE isoladamente.', 'Nomeie as colunas como elas vão aparecer no painel.'],
    { p: 'Mini-painel por departamento com ranking e participação:', sql: 'WITH m AS (\n  SELECT d.nome, COUNT(*) AS pessoas, SUM(f.salario) AS folha\n  FROM funcionarios f JOIN departamentos d ON d.id = f.departamento_id\n  GROUP BY d.nome\n)\nSELECT nome, pessoas, folha,\n  DENSE_RANK() OVER (ORDER BY folha DESC) AS posicao,\n  ROUND(100.0 * folha / SUM(folha) OVER (), 1) AS pct\nFROM m;' },
    ['Valide os totais com uma consulta simples antes de montar o painel.', 'Documente as regras (status considerados, data de referência).', 'Uma view com o resultado final facilita o consumo no Power BI.']);

  /* ------------------------- Tópico → aula ------------------------- */
  const MAP = {
    'SELECT *': 'select', 'SELECT colunas': 'select', 'Alias (AS)': 'alias', 'Colunas calculadas': 'alias', 'DISTINCT': 'distinct', 'LIMIT': 'limit',
    'WHERE': 'where', 'WHERE + AND': 'logic', 'WHERE + OR': 'logic', 'WHERE composto': 'logic', 'IN': 'in-between', 'BETWEEN': 'in-between', 'LIKE': 'like',
    'IS NULL': 'null', 'COALESCE': 'null', 'ORDER BY': 'order', 'ORDER BY + LIMIT': 'order', 'WHERE + ORDER BY': 'order', 'Filtro por data': 'dates',
    'COUNT': 'aggregates', 'SUM': 'aggregates', 'AVG': 'aggregates', 'MIN / MAX': 'aggregates', 'COUNT DISTINCT': 'aggregates', 'Agregação com expressão': 'aggregates',
    'GROUP BY': 'groupby', 'GROUP BY + SUM': 'groupby', 'GROUP BY + ORDER BY': 'groupby', 'GROUP BY por mês': 'groupby',
    'HAVING': 'having', 'WHERE + HAVING': 'having', 'HAVING + AVG': 'having', 'JOIN + HAVING': 'having', 'ROUND + ORDER BY': 'calc',
    'Subquery escalar': 'subquery', 'Subquery com IN': 'subquery', 'Subquery com NOT IN': 'subquery', 'Subquery no FROM': 'subquery',
    'INNER JOIN': 'join', 'JOIN + WHERE': 'join', 'JOIN 3 tabelas': 'join', 'JOIN + GROUP BY': 'join', 'JOIN + AVG': 'join', 'JOIN + LIMIT': 'join', 'Agregações combinadas': 'join', 'Múltiplas métricas': 'join',
    'LEFT JOIN': 'leftjoin', 'LEFT JOIN + COALESCE': 'leftjoin', 'RIGHT JOIN': 'rightjoin', 'SELF JOIN': 'selfjoin', 'UNION': 'union', 'UNION ALL': 'union', 'INTERSECT': 'setops', 'EXCEPT': 'setops',
    'CASE': 'case', 'CASE + agregação': 'case', 'CASE + GROUP BY': 'case', 'CASE pivot': 'case', 'CTE': 'cte', 'CTEs múltiplas': 'cte', 'CTE + CASE': 'cte',
    'VIEW': 'view', 'VIEW + consulta': 'view', 'VIEW + JOIN': 'view', 'GROUP_CONCAT': 'groupconcat', 'Percentual do total': 'calc', 'Percentual por grupo': 'calc',
    'Subquery correlacionada': 'correlated', 'EXISTS': 'correlated', 'NOT EXISTS': 'correlated', 'Datas + JOIN': 'dates', 'Datas': 'dates', 'Trimestres': 'dates', 'Desafio do nível': 'kpis',
    'ROW_NUMBER': 'rownumber', 'RANK': 'rank', 'DENSE_RANK': 'rank', 'RANK + PARTITION': 'rank', 'DENSE_RANK + filtro': 'rank',
    'SUM OVER': 'windowagg', 'SUM OVER + PARTITION': 'windowagg', 'Média móvel': 'windowagg', 'Window sem ORDER': 'windowagg', 'AVG OVER': 'windowagg', 'COUNT OVER': 'windowagg',
    'LAG': 'laglead', 'LEAD': 'laglead', 'LAG + PARTITION': 'laglead', 'LAG + filtro': 'laglead', 'Crescimento MoM': 'laglead',
    'NTILE': 'ntile', 'FIRST_VALUE': 'ntile', 'CUME_DIST': 'ntile', 'Recursive CTE': 'recursive', 'TRIGGER': 'trigger', 'STORED PROCEDURE': 'procedure',
    'MERGE (UPSERT)': 'upsert', 'MERGE (UPDATE FROM)': 'upsert', 'Análise complexa': 'customer', 'Análise RFM': 'customer', 'Retenção': 'customer', 'Meta x realizado': 'kpis',
    'Curva ABC': 'abc', 'Cesta de compras': 'basket', 'Otimização: índice': 'index', 'Otimização: índice composto': 'index', 'Otimização: reescrita': 'tuning', 'Otimização: SARGable': 'tuning', 'Desafio final': 'dashboard',
  };
  /* ----------------------------- Pacotes por trilha ----------------------------- */
  /**
   * Cada trilha registra um pacote de aulas:
   *   LESSONS, MAP (tópico → aula), fallback,
   *   codeHtml(código) → HTML realçado,
   *   example(aula) → { code, liveHtml, badge, speech },
   *   tags(exercício) → [{ icon, label }], goalLabel.
   */
  const PACKS = {};
  function registerPack(id, pack) { PACKS[id] = pack; }
  function packOf(ex) { return PACKS[(ex && ex.track) || 'sql'] || PACKS.sql; }
  function forExercise(ex) { const p = packOf(ex); return p.LESSONS[p.MAP[ex.t]] || p.LESSONS[p.fallback]; }

  /* Pacote de SQL */
  function sqlMiniTable(res) { return miniTable(res); }
  registerPack('sql', {
    LESSONS: L, MAP: MAP, fallback: 'select', goalLabel: 'Objetivo da consulta',
    codeHtml: function (c) { return global.UI.highlightSql(c); },
    example: function (les) {
      const run = global.SQLEngine.run(les.exemplo.sql);
      const nRows = run.ok && run.result ? run.result.values.length : null;
      return {
        code: les.exemplo.sql, badge: 'Executado agora no banco NexusMarket',
        liveHtml: run.ok ? sqlMiniTable(run.result) : '<p class="muted">' + global.UI.esc(run.explain || 'Erro') + '</p>',
        speech: nRows === null ? 'O comando foi executado agora mesmo no banco.' : 'A consulta foi executada agora mesmo no banco e trouxe ' + nRows + (nRows === 1 ? ' linha.' : ' linhas.'),
      };
    },
    tags: function (ex) { return global.SQLEngine.tablesOf(ex).map(function (t) { return { icon: 'table', label: t }; }); },
  });

  /* ------------------------- Roteiro de narração ------------------------- */
  /**
   * Texto falado dos 5 slides de um exercício (o código não é lido em voz alta).
   * Slides 1–4 são da aula (ids "<aula>-1".."<aula>-4"); o 5º é do exercício ("ex-<id>").
   * Usado pelo app e por build/export_narration.js, que gera os áudios gravados.
   */
  const ORD = ['Primeiro', 'Segundo', 'Terceiro', 'Quarto'];
  /**
   * Posição do exercício dentro da sequência de exercícios do mesmo tema:
   * k = 0 no primeiro (aula completa); k ≥ 1 nos seguintes (revisão variada).
   */
  function occurrence(ex) {
    const bank = (global.Tracks && global.Tracks.bankOf(ex.track || 'sql')) || null;
    if (!bank) return { k: 0, prev: null };
    const key = forExercise(ex).key; let k = 0, i = ex.index - 1;
    while (i >= 0 && forExercise(bank.EXERCISES[i]).key === key && bank.EXERCISES[i].level === ex.level) { k++; i--; }
    return { k: k, prev: k ? bank.EXERCISES[ex.index - 1] : null };
  }
  function pick(list, k) { return list && list.length ? list[(k - 1) % list.length] : ''; }
  /** Solução de um exercício para o slide "Exemplo resolvido". */
  function solutionOf(ex) {
    const pk = packOf(ex), CF = global.CodeFormat;
    const sol = pk.solution ? Object.assign({}, pk.solution(ex)) : { code: String(ex.q || '').replace(/;\s+(?=\S)/g, ';\n'), speech: 'Repare na solução no código.' };
    // quebra e recua a resposta para caber na caixa sem barra de rolagem
    if (sol.code && CF) sol.code = CF.forTrack(sol.code, (ex && ex.track) || 'sql');
    return sol;
  }
  function hintOf(ex, les, k) { return ex.h || pick(les.notas, k + 1) || les.notas[0]; }
  function narrationReview(ex, les, oc) {
    const pre = (ex.track && ex.track !== 'sql') ? ex.track + '-' : '';
    const q = pick(les.quiz, oc.k), sol = solutionOf(oc.prev);
    const parts = [
      ['Antes do seu desafio, veja como o exercício anterior foi resolvido: ' + oc.prev.n + '.', oc.prev.g, sol.speech || ''],
      ['Teste rápido sobre ' + les.titulo + '.', q[0], 'Escolha uma alternativa na tela para conferir.'],
      ['Algumas dicas para o seu desafio.', hintOf(ex, les, oc.k), 'Atenção: ' + pick(les.cuidados, oc.k)],
      ['Chegou a sua vez. O desafio é: ' + ex.n + '.', ex.s, 'O objetivo: ' + ex.g, 'Quando estiver pronto, é só clicar em Começar exercício.'],
    ];
    return parts.map(function (p, i) { return { id: pre + 'rv-' + ex.id + '-' + (i + 1), chunks: global.Narrator.chunk(p.filter(Boolean)) }; });
  }
  function narration(ex, full) {
    const oc = occurrence(ex);
    if (!full && oc.k > 0) return narrationReview(ex, forExercise(ex), oc);
    const les = forExercise(ex);
    const pk = packOf(ex), exm = pk.example(les);
    const parts = [
      [les.titulo + '.', les.ideia, 'Uma comparação que ajuda: ' + les.analogia],
      [typeof pk.syntaxSpeech === 'function' ? pk.syntaxSpeech(les) : (pk.syntaxSpeech || 'Agora, a sintaxe. Repare na estrutura do comando no código.')].concat(les.notas),
      ['Vamos ver na prática. ' + les.exemplo.p.replace(/:\s*$/, '.'),
        exm.speech,
        pk.compareSpeech || 'Compare o código com o resultado na tabela.'],
      ['Agora, alguns cuidados importantes.'].concat(les.cuidados.map(function (c, i) { return (ORD[i] || 'Também') + ': ' + c; })),
      ['Chegou a sua vez. O desafio é: ' + ex.n + '.', ex.s, 'O objetivo: ' + ex.g, 'Quando estiver pronto, é só clicar em Começar exercício.'],
    ];
    return parts.map(function (p, i) {
      const pre = (ex.track && ex.track !== 'sql') ? ex.track + '-' : '';
      return { id: i < 4 ? pre + les.key + '-' + (i + 1) : 'ex-' + ex.id, chunks: global.Narrator.chunk(p) };
    });
  }

  /* ------------------------------ Carrossel ------------------------------ */
  const STEPS = ['Conceito', 'Sintaxe', 'Exemplo ao vivo', 'Cuidados', 'Seu desafio'];

  function miniTable(res) {
    const { esc } = global.UI;
    if (!res) return '<p class="muted sm">Comando executado sem retornar linhas.</p>';
    const rows = res.values.slice(0, 6);
    const cell = function (v) { return v === null ? '<span class="null">NULL</span>' : typeof v === 'number' ? '<span class="num">' + (Number.isInteger(v) ? v : Math.round(v * 100) / 100) + '</span>' : esc(v); };
    return '<div class="dt"><div class="dt-scroll"><table><thead><tr>' + res.columns.map(function (c) { return '<th class="plain">' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      rows.map(function (r) { return '<tr>' + r.map(function (v) { return '<td>' + cell(v) + '</td>'; }).join('') + '</tr>'; }).join('') +
      '</tbody></table></div></div>' + (res.values.length > rows.length ? '<p class="muted sm">Mostrando 6 de ' + res.values.length + ' linhas.</p>' : '<p class="muted sm">' + res.values.length + ' linha(s).</p>');
  }

  /**
   * Monta o carrossel dentro de `host`.
   * opts.onStart() é chamado no botão final; devolve uma função de limpeza.
   */
  function mount(host, ex, opts) {
    if (opts && opts.library) return mountOnce(host, ex, opts, true, null);
    let cleanup = mountOnce(host, ex, opts, false, function () { cleanup(); cleanup = mountOnce(host, ex, opts, true, null); });
    return function () { cleanup(); };
  }
  function finalSlide(ex, pack, tags) {
    const { esc, icon } = global.UI, G = global.Gamification;
    return '<div class="ls-body ls-final"><span class="eyebrow">' + esc(ex.levelName) + ' · exercício ' + ex.pos + ' de 50</span><h2 class="ls-title">' + esc(ex.n) + '</h2>' +
      '<p class="ls-lead">' + global.UI.rich(ex.s) + '</p>' +
      '<div class="goal">' + icon('target') + '<div><h3 class="card-k">' + esc(pack.goalLabel) + '</h3><p>' + global.UI.rich(ex.g) + '</p></div></div>' +
      '<div class="ls-meta"><span class="tag d-' + ex.diff + '">' + G.DIFF_LABEL[ex.diff] + ' · ' + G.XP[ex.diff] + ' XP</span>' +
      tags.map(function (t) { return '<span class="tag tag-topic">' + icon(t.icon) + esc(t.label) + '</span>'; }).join('') + '</div></div>';
  }
  /** Quebra fórmulas e consultas longas das aulas para caber na caixa (sem barra de rolagem). */
  function fmtCode(code, ex) {
    const CF = global.CodeFormat, tr = (ex && ex.track) || 'sql';
    return CF && /^(sql|excel|powerbi|python)$/.test(tr) ? CF.lesson(code, tr) : code;
  }
  /** Último slide na biblioteca: teste rápido com as 3 questões da aula e os exercícios que usam o conteúdo. */
  function librarySlide(les, exs) {
    const { esc, icon } = global.UI, R = global.UI.rich;
    const quiz = (les.quiz || []).map(function (q, n) {
      let h = 11 + n; String(les.key).split('').forEach(function (c) { h = (h * 31 + c.charCodeAt(0)) >>> 0; });
      const opts = [1, 2, 3, 4].map(function (i) { return { t: q[i], ok: i === 1 }; });
      for (let i = opts.length - 1; i > 0; i--) { h = (h * 1103515245 + 12345) >>> 0; const j = h % (i + 1); const t = opts[i]; opts[i] = opts[j]; opts[j] = t; }
      return '<div class="ls-body ls-qbox"><p class="ls-q"><b>' + (n + 1) + '.</b> ' + R(q[0]) + '</p><div class="ls-quiz" role="group" aria-label="Alternativas">' +
        opts.map(function (o, i) { return '<button type="button" class="ls-qo" data-ok="' + (o.ok ? 1 : 0) + '"><span>' + 'ABCD'[i] + '</span><span class="ls-qt">' + R(o.t) + '</span></button>'; }).join('') +
        '</div><p class="ls-qexp" hidden></p><p class="ls-qexp-src" hidden>' + R(q[5]) + '</p></div>';
    }).join('');
    return '<div class="ls-body ls-lib-final"><h3 class="ls-h">Fixação · ' + esc(les.titulo) + '</h3>' + quiz +
      (exs.length ? '<div class="ls-lib-ex"><h4 class="card-k">' + icon('code') + 'Pratique este conteúdo</h4><ul>' + exs.slice(0, 8).map(function (e) {
        return '<li><a href="#ex-' + e.id + '"><span class="tag d-' + e.diff + '">' + e.levelName + ' ' + e.pos + '</span>' + esc(e.n) + '</a></li>'; }).join('') + '</ul></div>' : '') + '</div>';
  }
  /** Slides de revisão (2º, 3º… exercício do mesmo tema): exemplo resolvido, teste rápido e dicas. */
  function reviewSlides(ex, les, pack, oc, tags) {
    const { esc, icon } = global.UI, R = global.UI.rich;
    const prev = oc.prev, sol = solutionOf(prev), q = pick(les.quiz, oc.k);
    // alternativas do teste rápido em ordem fixa por exercício
    let h = 7; String(ex.id).split('').forEach(function (c) { h = (h * 31 + c.charCodeAt(0)) >>> 0; });
    const opts = [1, 2, 3, 4].map(function (i) { return { t: q[i], ok: i === 1 }; });
    for (let i = opts.length - 1; i > 0; i--) { h = (h * 1103515245 + 12345) >>> 0; const j = h % (i + 1); const t = opts[i]; opts[i] = opts[j]; opts[j] = t; }
    return [
      '<div class="ls-body"><span class="eyebrow">Exercício anterior · ' + esc(prev.levelName) + ' ' + prev.pos + '/50</span><h3 class="ls-h">Como foi resolvido: ' + esc(prev.n) + '</h3>' +
        '<div class="ls-split"><div class="ls-prev"><p>' + R(prev.s) + '</p><div class="goal">' + icon('target') + '<div><h3 class="card-k">Objetivo</h3><p>' + R(prev.g) + '</p></div></div></div>' +
        '<div class="ls-sol">' + (sol.label ? '<span class="ls-badge">' + icon('check') + esc(sol.label) + '</span>' : '') + (sol.code ? '<pre class="code-block">' + pack.codeHtml(sol.code) + '</pre>' : '') + (sol.html || '') + (sol.note ? '<p class="muted sm">' + R(sol.note) + '</p>' : '') + '</div></div></div>',
      '<div class="ls-body"><h3 class="ls-h">Teste rápido · ' + esc(les.titulo) + '</h3><p class="ls-q">' + R(q[0]) + '</p>' +
        '<div class="ls-quiz" role="group" aria-label="Alternativas">' + opts.map(function (o, i) { return '<button type="button" class="ls-qo" data-ok="' + (o.ok ? 1 : 0) + '"><span>' + 'ABCD'[i] + '</span><span class="ls-qt">' + R(o.t) + '</span></button>'; }).join('') + '</div>' +
        '<p class="ls-qexp" hidden></p><p class="ls-qexp-src" hidden>' + R(q[5]) + '</p></div>',
      '<div class="ls-body"><h3 class="ls-h">Dicas para o seu desafio</h3><ol class="ls-cards">' +
        '<li><span class="ls-num">' + icon('bulb') + '</span><p><b>Dica</b><br>' + R(hintOf(ex, les, oc.k)) + '</p></li>' +
        '<li><span class="ls-num">!</span><p><b>Atenção</b><br>' + R(pick(les.cuidados, oc.k)) + '</p></li>' +
        '<li><span class="ls-num">' + icon('book') + '</span><p><b>Ideia-chave</b><br>' + R(pick(les.notas, oc.k)) + '</p></li></ol></div>',
      finalSlide(ex, pack, tags),
    ];
  }
  function mountOnce(host, ex, opts, forceFull, onFull) {
    const { esc, icon, highlightSql } = global.UI;
    const G = global.Gamification;
    const les = forExercise(ex);
    const pack = packOf(ex);
    const exm = pack.example(les);
    const tags = pack.tags(ex);
    const oc = occurrence(ex);
    const review = !forceFull && oc.k > 0, lib = !!opts.library;
    const STEPS_NOW = review ? ['Exemplo resolvido', 'Teste rápido', 'Dicas', 'Seu desafio'] : lib ? (pack.steps || STEPS).slice(0, -1).concat(['Fixação']) : (pack.steps || STEPS);
    const LAST = STEPS_NOW.length - 1;
    const slides = review ? reviewSlides(ex, les, pack, oc, tags) : [
      // 1 · Conceito
      '<div class="ls-body"><span class="ls-ghost" aria-hidden="true">' + esc(les.kw) + '</span>' +
        '<h2 class="ls-title">' + esc(les.titulo) + '</h2><p class="ls-lead">' + global.UI.rich(les.ideia) + '</p>' +
        '<div class="ls-analogy">' + icon('bulb') + '<p>' + global.UI.rich(les.analogia) + '</p></div></div>',
      // 2 · Sintaxe
      '<div class="ls-body"><h3 class="ls-h">' + esc(pack.syntaxTitle || 'Como se escreve') + '</h3><div class="ls-split"><pre class="code-block">' + pack.codeHtml(fmtCode(les.sintaxe, ex)) + '</pre>' +
        '<ul class="ls-notes">' + les.notas.map(function (n) { return '<li>' + icon('chevR') + '<span>' + global.UI.rich(n) + '</span></li>'; }).join('') + '</ul></div></div>',
      // 3 · Exemplo ao vivo
      '<div class="ls-body"><h3 class="ls-h">' + global.UI.rich(les.exemplo.p) + '</h3><div class="ls-split ex"><pre class="code-block">' + pack.codeHtml(fmtCode(exm.code, ex)) + '</pre>' +
        '<div class="ls-live"><span class="ls-badge">' + icon('play') + esc(exm.badge) + '</span>' + exm.liveHtml + '</div></div></div>',
      // 4 · Cuidados
      '<div class="ls-body"><h3 class="ls-h">Cuidados e boas práticas</h3><ol class="ls-cards">' +
        les.cuidados.map(function (c, i) { return '<li><span class="ls-num">' + (i + 1) + '</span><p>' + global.UI.rich(c) + '</p></li>'; }).join('') + '</ol></div>',
      // 5 · Seu desafio (na biblioteca: fixação com o teste rápido e os exercícios do conteúdo)
      lib ? librarySlide(les, opts.exercises || []) : finalSlide(ex, pack, tags),
    ];

    const scripts = narration(ex, !review);
    if (lib) scripts[scripts.length - 1] = { id: 'lib-final', chunks: global.Narrator.chunk(['Para fixar, responda ao teste rápido e, se quiser, pratique os exercícios deste conteúdo.']) };
    const N = global.Narrator;
    const rates = [0.75, 1, 1.25, 1.5];

    host.innerHTML =
      '<section class="lesson glass" tabindex="-1" aria-roledescription="carrossel" aria-label="Conteúdo: ' + esc(les.titulo) + '">' +
        '<header class="ls-top"><div class="ls-kicker">' + icon('book') + '<span>' + (review ? 'Revisão · ' : 'Conteúdo · ') + '<b>' + esc(les.titulo) + '</b></span></div>' +
        '<div class="ls-top-r">' + (review ? '<button class="btn btn-quiet sm" data-a="full">' + icon('book') + '<span>Ver aula completa</span></button>' : '') + '<button class="btn btn-ghost sm ls-voice" data-a="voice" aria-pressed="false">' + icon('volume') + '<span>Ouvir narração</span></button>' +
        '<button class="btn btn-quiet sm" data-a="skip">' + (lib ? icon('chevL') + 'Voltar à biblioteca' : 'Pular para o exercício' + icon('chevR')) + '</button></div></header>' +
        '<ol class="ls-steps' + (review ? ' four' : '') + '">' + STEPS_NOW.map(function (s, i) { return '<li><button data-go="' + i + '" aria-label="Slide ' + (i + 1) + ': ' + s + '"><i></i><span>' + s + '</span></button></li>'; }).join('') + '</ol>' +
        '<div class="ls-viewport"><div class="ls-track">' + slides.map(function (s, i) { return '<article class="ls-slide" aria-label="' + (i + 1) + ' de ' + slides.length + '" ' + (i ? 'aria-hidden="true"' : '') + '>' + s + '</article>'; }).join('') + '</div></div>' +
        '<div class="ls-narr" hidden>' +
          '<button class="icon-btn sm" data-a="toggle" aria-label="Pausar narração">' + icon('pause') + '</button>' +
          '<span class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span>' +
          '<p class="ls-caption" aria-live="off"></p>' +
          '<div class="ls-narr-opts">' +
            '<label class="ls-sel"><span>Velocidade</span><select id="nr-rate">' + rates.map(function (r) { return '<option value="' + r + '">' + String(r).replace('.', ',') + 'x</option>'; }).join('') + '</select></label>' +
            '<label class="ls-sel ls-sel-voice"><span>Voz</span><select id="nr-voice"></select></label>' +
            '<label class="ls-check"><input type="checkbox" id="nr-auto"><span>Avançar sozinho</span></label>' +
          '</div>' +
          '<p class="ls-hint" hidden>' + icon('bulb') + '<span>A voz deste navegador é sintética. Para uma narração mais humana, abra no Microsoft Edge (vozes "Natural"), no Chrome conectado à internet (voz Google) ou ative uma voz "Aprimorada" no iPhone/Mac.</span></p>' +
        '</div>' +
        '<footer class="ls-foot"><button class="btn btn-ghost sm" data-a="prev">' + icon('chevL') + 'Anterior</button>' +
        '<span class="ls-count"><b>1</b> / ' + slides.length + '</span>' +
        '<button class="btn btn-primary sm" data-a="next">Próximo' + icon('chevR') + '</button></footer>' +
      '</section>';

    const root = host.querySelector('.lesson'), track = root.querySelector('.ls-track'), viewport = root.querySelector('.ls-viewport');
    const slideEls = root.querySelectorAll('.ls-slide');
    const prev = root.querySelector('[data-a=prev]'), next = root.querySelector('[data-a=next]');
    let idx = 0;

    /* --------------------------- Narração --------------------------- */
    const voiceBtn = root.querySelector('[data-a=voice]'), bar = root.querySelector('.ls-narr');
    const cap = root.querySelector('.ls-caption'), toggleBtn = root.querySelector('[data-a=toggle]');
    const hint = root.querySelector('.ls-hint');
    const rateSel = root.querySelector('#nr-rate'), voiceSel = root.querySelector('#nr-voice'), autoChk = root.querySelector('#nr-auto');
    let speaking = false, narrOn = false;
    function fillVoices() {
      const list = N.voices, cur = N.currentVoice();
      const label = function (v) { return (v.natural ? '★ ' : '') + v.name.replace(/^(Microsoft|Google)\s*/, '').replace(/\s*-\s*Portuguese.*$/i, '').replace(/\s*\((?!Natural).*\)$/, ''); };
      voiceSel.innerHTML = list.length ? list.map(function (v) { return '<option value="' + esc(v.voiceURI) + '"' + (cur && v.voiceURI === cur.voiceURI ? ' selected' : '') + '>' + esc(label(v)) + '</option>'; }).join('') : '<option value="">Padrão do sistema</option>';
      voiceSel.closest('label').hidden = list.length < 2;
      // dica quando só há vozes sintéticas antigas no aparelho
      hint.hidden = !list.length ? false : !!(cur && N.isNatural(cur));
    }
    function setSpeaking(v) {
      speaking = v;
      bar.classList.toggle('speaking', v);
      toggleBtn.innerHTML = icon(v ? 'pause' : 'play');
      toggleBtn.setAttribute('aria-label', v ? 'Pausar narração' : 'Ouvir este slide');
    }
    function narrate() {
      if (!narrOn) return;
      const my = idx;
      N.speak(scripts[idx], function () {
        setSpeaking(false);
        if (narrOn && N.prefs().auto && my === idx && idx < LAST) setTimeout(function () { if (narrOn && my === idx) go(idx + 1); }, 700);
      });
    }
    function setNarration(on) {
      narrOn = on;
      bar.hidden = !on;
      voiceBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
      voiceBtn.classList.toggle('on', on);
      voiceBtn.innerHTML = icon('volume') + '<span>' + (on ? 'Narração ligada' : 'Ouvir narração') + '</span>';
      if (on) { fillVoices(); narrate(); } else { N.stop(); setSpeaking(false); cap.textContent = ''; }
      viewport.style.height = slideEls[idx].offsetHeight + 'px';
    }
    const offNarr = N.on(function (e) {
      if (!narrOn) return;
      if (e.type === 'start') setSpeaking(true);
      if (e.type === 'caption') cap.textContent = e.text;
      if (e.type === 'stop') setSpeaking(false);
      if (e.type === 'voices') fillVoices();
      if (e.type === 'error' && e.error === 'not-allowed') { setSpeaking(false); cap.textContent = 'Toque no botão de play para ouvir.'; }
    });
    voiceBtn.onclick = function () {
      if (!N.supported) { global.UI.toast('Este navegador não oferece narração por voz. Tente o Chrome, Edge ou Safari atualizados.', 'warn', 5000); return; }
      const on = !narrOn; N.setPref('on', on); setNarration(on);
    };
    toggleBtn.onclick = function () { if (speaking) { N.stop(); cap.textContent = 'Narração pausada. Toque em play para ouvir este slide.'; } else narrate(); };
    rateSel.value = String(N.prefs().rate);
    autoChk.checked = N.prefs().auto;
    rateSel.onchange = function () { N.setPref('rate', +rateSel.value); if (speaking) narrate(); };
    voiceSel.onchange = function () { N.setPref('voice', voiceSel.value); fillVoices(); if (speaking) narrate(); };
    autoChk.onchange = function () { N.setPref('auto', autoChk.checked); };
    if (!N.supported) voiceBtn.classList.add('unavailable');

    function go(i) {
      idx = Math.max(0, Math.min(LAST, i));
      track.style.transform = 'translateX(' + (-idx * 100) + '%)';
      // a altura acompanha o slide atual (slides curtos não deixam espaço vazio)
      viewport.style.height = slideEls[idx].offsetHeight + 'px';
      slideEls.forEach(function (s, k) { s.setAttribute('aria-hidden', k === idx ? 'false' : 'true'); s.classList.toggle('on', k === idx); });
      root.querySelectorAll('.ls-steps li').forEach(function (li, k) { li.classList.toggle('on', k === idx); li.classList.toggle('done', k < idx); });
      root.querySelector('.ls-count b').textContent = idx + 1;
      prev.disabled = idx === 0;
      next.innerHTML = idx === LAST ? (lib ? icon('check') + 'Concluir aula' : icon('play') + 'Começar exercício') : 'Próximo' + icon('chevR');
      if (lib && idx === LAST && opts.onLast) opts.onLast();
      if (narrOn) narrate();
    }
    next.onclick = function () { if (idx === LAST) { N.stop(); opts.onStart(); } else go(idx + 1); };
    const fullBtn = root.querySelector('[data-a=full]'); if (fullBtn && onFull) fullBtn.onclick = function () { N.stop(); onFull(); };
    // teste rápido: responde e mostra a explicação
    root.querySelectorAll('.ls-qo').forEach(function (b) {
      b.onclick = function () {
        const box = b.closest('.ls-body'); if (box.classList.contains('answered')) return;
        box.classList.add('answered');
        box.querySelectorAll('.ls-qo').forEach(function (o) { o.disabled = true; o.classList.add(o.dataset.ok === '1' ? 'right' : (o === b ? 'wrong' : 'dim')); });
        const e = box.querySelector('.ls-qexp'); e.hidden = false;
        e.innerHTML = icon(b.dataset.ok === '1' ? 'check' : 'x') + '<span><b>' + (b.dataset.ok === '1' ? 'Isso mesmo.' : 'Não foi dessa vez.') + '</b> ' + box.querySelector('.ls-qexp-src').innerHTML + '</span>';
        e.className = 'ls-qexp ' + (b.dataset.ok === '1' ? 'ok' : 'no');
        viewport.style.height = slideEls[idx].offsetHeight + 'px';
      };
    });
    prev.onclick = function () { go(idx - 1); };
    root.querySelector('[data-a=skip]').onclick = function () { N.stop(); (lib ? opts.onClose : opts.onStart)(); };
    root.querySelectorAll('[data-go]').forEach(function (b) { b.onclick = function () { go(+b.dataset.go); }; });

    // teclado (setas) e gesto de arrastar no celular
    const onKey = function (e) {
      if (e.target.closest && e.target.closest('input, textarea, .CodeMirror')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); if (idx < LAST) go(idx + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(idx - 1); }
    };
    document.addEventListener('keydown', onKey);
    let x0 = null;
    root.querySelector('.ls-viewport').addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    root.querySelector('.ls-viewport').addEventListener('touchend', function (e) {
      if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 50) go(idx + (dx < 0 ? 1 : -1));
    });
    go(0);
    // retoma a narração automaticamente se a pessoa deixou ligada
    if (N.supported && N.prefs().on) setNarration(true);
    const onResize = function () { viewport.style.height = slideEls[idx].offsetHeight + 'px'; };
    global.addEventListener('resize', onResize);
    return function () { document.removeEventListener('keydown', onKey); global.removeEventListener('resize', onResize); offNarr(); N.stop(true); };
  }

  global.Lessons = { LESSONS: L, MAP: MAP, PACKS: PACKS, registerPack: registerPack, packOf: packOf, forExercise: forExercise, narration: narration, mount: mount, miniTable: miniTable, occurrence: occurrence };
})(typeof window !== 'undefined' ? window : globalThis);
