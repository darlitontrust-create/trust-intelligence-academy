/* =====================================================================
   quiz-sql.js — Banco de questões das provas da trilha de SQL
   ---------------------------------------------------------------------
   3 questões por aula. Formato de cada questão:
     [pergunta, resposta correta, errada 1, errada 2, errada 3, explicação]
   As alternativas são embaralhadas na hora da prova.
   ===================================================================== */
(function (global) {
  'use strict';
  const Q = {
    select: [
      ['Qual comando traz todas as colunas da tabela clientes?', 'SELECT * FROM clientes;', 'SELECT ALL clientes;', 'GET * FROM clientes;', 'SELECT clientes.*;', 'O asterisco (*) seleciona todas as colunas e FROM indica a tabela.'],
      ['Em "SELECT nome, email FROM clientes", o que FROM define?', 'De qual tabela os dados vêm', 'Quais colunas aparecem', 'A ordem das linhas', 'Um filtro de linhas', 'FROM indica a origem dos dados; SELECT escolhe as colunas.'],
      ['O que acontece com a tabela original ao executar um SELECT?', 'Nada: SELECT apenas lê os dados', 'As colunas não selecionadas são apagadas', 'A tabela é ordenada', 'Uma cópia é salva automaticamente', 'SELECT é uma consulta de leitura e não altera os dados.'],
    ],
    alias: [
      ['Para que serve o AS em "SELECT preco AS valor"?', 'Renomear a coluna no resultado', 'Converter o tipo da coluna', 'Criar uma nova coluna na tabela', 'Filtrar valores', 'AS cria um apelido apenas para o resultado da consulta.'],
      ['Como calcular o preço com 10% de desconto?', 'preco * 0.9', 'preco - 10', 'preco / 10', 'preco % 10', 'Multiplicar por 0.9 mantém 90% do valor.'],
      ['Qual é o resultado de uma conta com NULL, como 10 + NULL?', 'NULL', '10', '0', 'Um erro de sintaxe', 'Qualquer operação aritmética com NULL resulta em NULL.'],
    ],
    distinct: [
      ['O que DISTINCT faz?', 'Remove linhas duplicadas do resultado', 'Ordena o resultado', 'Conta os registros', 'Filtra valores nulos', 'DISTINCT mantém apenas combinações únicas.'],
      ['Com "SELECT DISTINCT estado, cidade", o que é considerado único?', 'A combinação de estado e cidade', 'Apenas o estado', 'Apenas a cidade', 'A primeira coluna da tabela', 'Com várias colunas, DISTINCT avalia a combinação inteira.'],
      ['Como contar quantos estados diferentes existem?', 'COUNT(DISTINCT estado)', 'DISTINCT COUNT(estado)', 'COUNT(estado DISTINCT)', 'SUM(DISTINCT estado)', 'COUNT(DISTINCT coluna) conta valores únicos.'],
    ],
    limit: [
      ['Como trazer apenas 5 linhas?', 'LIMIT 5', 'TOP 5 no final da consulta', 'MAX 5', 'ROWS 5', 'No SQLite, MySQL e PostgreSQL usa-se LIMIT n no final.'],
      ['Para obter os 3 produtos mais caros, o que é indispensável junto do LIMIT 3?', 'ORDER BY preco DESC', 'GROUP BY preco', 'WHERE preco > 3', 'DISTINCT preco', 'Sem ordenação, as "primeiras" linhas não têm ordem garantida.'],
      ['Onde fica o LIMIT na consulta?', 'Na última cláusula', 'Logo após SELECT', 'Antes do FROM', 'Antes do WHERE', 'LIMIT é sempre a última cláusula.'],
    ],
    where: [
      ['Qual cláusula filtra linhas?', 'WHERE', 'HAVING', 'ORDER BY', 'LIMIT', 'WHERE mantém apenas as linhas que atendem à condição.'],
      ['Como filtrar clientes de MG corretamente?', "WHERE estado = 'MG'", 'WHERE estado = MG', 'WHERE estado == "MG"', 'WHERE estado LIKE MG', 'Textos ficam entre aspas simples.'],
      ['Qual operador significa "diferente de" no SQL padrão?', '<>', '!==', '=!', '><', '<> é o operador padrão de diferença (muitos bancos também aceitam !=).'],
    ],
    logic: [
      ['Qual operador exige que as duas condições sejam verdadeiras?', 'AND', 'OR', 'NOT', 'IN', 'AND só é verdadeiro quando todas as condições são.'],
      ["Como o SQL lê: a = 1 OR b = 2 AND c = 3?", 'a = 1 OR (b = 2 AND c = 3)', '(a = 1 OR b = 2) AND c = 3', 'Dá erro de sintaxe', 'As três condições com AND', 'AND tem precedência sobre OR. Use parênteses para deixar claro.'],
      ['O que NOT faz em uma condição?', 'Inverte o resultado da condição', 'Remove nulos', 'Ignora a condição', 'Repete a condição', 'NOT transforma verdadeiro em falso e vice-versa.'],
    ],
    'in-between': [
      ["WHERE estado IN ('SP','RJ') equivale a:", "estado = 'SP' OR estado = 'RJ'", "estado = 'SP' AND estado = 'RJ'", "estado BETWEEN 'SP' AND 'RJ'", "estado LIKE 'SP%RJ'", 'IN testa se o valor está na lista.'],
      ['BETWEEN 100 AND 500 inclui os valores 100 e 500?', 'Sim, inclui os dois limites', 'Não inclui nenhum', 'Inclui só o 100', 'Inclui só o 500', 'BETWEEN equivale a >= 100 AND <= 500.'],
      ['Por que NOT IN com uma lista que contém NULL é perigoso?', 'Pode não retornar nenhuma linha', 'Fica mais rápido', 'Retorna linhas duplicadas', 'Ignora o NULL automaticamente', 'A comparação com NULL é desconhecida e invalida o NOT IN.'],
    ],
    like: [
      ["Qual padrão encontra nomes que começam com M?", "LIKE 'M%'", "LIKE '%M'", "LIKE 'M_'", "LIKE '*M'", '% representa qualquer sequência; M% = começa com M.'],
      ['O que o curinga _ representa no LIKE?', 'Exatamente um caractere', 'Qualquer sequência de caracteres', 'Um espaço', 'Um número', '_ vale por um único caractere.'],
      ["Qual padrão encontra textos que contêm 'pro' em qualquer posição?", "LIKE '%pro%'", "LIKE 'pro%'", "LIKE '%pro'", "LIKE '_pro_'", '% antes e depois aceita qualquer coisa ao redor.'],
    ],
    null: [
      ['Como filtrar clientes sem e-mail?', 'WHERE email IS NULL', 'WHERE email = NULL', "WHERE email = ''", 'WHERE email == NULL', 'Comparações com = NULL nunca são verdadeiras; use IS NULL.'],
      ["O que COALESCE(email, 'sem e-mail') retorna quando email é NULL?", "'sem e-mail'", 'NULL', 'Um erro', 'Uma string vazia', 'COALESCE devolve o primeiro valor não nulo.'],
      ['COUNT(email) conta linhas com e-mail nulo?', 'Não, COUNT(coluna) ignora NULL', 'Sim, conta todas as linhas', 'Só se houver DISTINCT', 'Depende do ORDER BY', 'COUNT(*) conta todas as linhas; COUNT(coluna) ignora NULL.'],
    ],
    order: [
      ['Como ordenar do maior para o menor preço?', 'ORDER BY preco DESC', 'ORDER BY preco ASC', 'SORT preco DESC', 'ORDER preco DOWN', 'DESC é decrescente; ASC (padrão) é crescente.'],
      ['Em ORDER BY estado, nome, quando a coluna nome é usada?', 'Para desempatar linhas com o mesmo estado', 'Sempre antes de estado', 'Nunca', 'Só se houver LIMIT', 'A segunda coluna só desempata.'],
      ['Sem ORDER BY, a ordem do resultado é:', 'Não garantida', 'Sempre alfabética', 'Sempre pela chave primária', 'Sempre por data', 'O banco pode devolver as linhas em qualquer ordem.'],
    ],
    dates: [
      ["Qual formato de data ordena corretamente como texto no SQLite?", 'AAAA-MM-DD', 'DD/MM/AAAA', 'MM/DD/AAAA', 'DD-MM-AA', 'Ano-mês-dia se ordena da esquerda para a direita.'],
      ["O que strftime('%Y-%m', data) devolve para 2026-06-15?", "'2026-06'", "'06/2026'", "'2026'", "'15'", '%Y é o ano com 4 dígitos e %m o mês.'],
      ['Como calcular dias entre duas datas no SQLite?', 'julianday(fim) - julianday(inicio)', 'fim - inicio', 'DATEDIFF(fim, inicio)', 'days(fim, inicio)', 'julianday converte em número de dias, e a subtração dá a diferença.'],
    ],
    aggregates: [
      ['Qual função calcula a média?', 'AVG', 'MEAN', 'MEDIAN', 'AVERAGE', 'AVG é a média aritmética no SQL.'],
      ['Sem GROUP BY, quantas linhas retorna "SELECT SUM(valor) FROM pedidos"?', 'Uma linha', 'Uma por pedido', 'Nenhuma', 'Uma por cliente', 'Agregações sem GROUP BY resumem tudo em uma linha.'],
      ['Agregações como SUM e AVG tratam NULL como:', 'Valores ignorados', 'Zero', 'Erro', 'Um', 'NULL é ignorado nas agregações (exceto COUNT(*)).'],
    ],
    groupby: [
      ['O que GROUP BY estado faz?', 'Calcula as agregações para cada estado', 'Ordena por estado', 'Remove estados nulos', 'Filtra um estado', 'Cada grupo recebe seus próprios totais.'],
      ['Toda coluna do SELECT que não é agregação deve:', 'Estar no GROUP BY', 'Estar no ORDER BY', 'Ter um alias', 'Ser numérica', 'Esse é o padrão SQL, exigido pela maioria dos bancos.'],
      ['Qual é a ordem lógica de execução?', 'FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY', 'SELECT → FROM → WHERE → ORDER BY', 'FROM → SELECT → WHERE → GROUP BY', 'WHERE → FROM → GROUP BY → SELECT', 'Por isso WHERE não enxerga apelidos nem agregações do SELECT.'],
    ],
    having: [
      ['Para manter só clientes com mais de 2 pedidos, usa-se:', 'HAVING COUNT(*) > 2', 'WHERE COUNT(*) > 2', 'GROUP BY COUNT(*) > 2', 'ORDER BY COUNT(*) > 2', 'Filtros com agregação vão no HAVING.'],
      ['Por que WHERE SUM(valor) > 100 dá erro?', 'WHERE roda antes da agregação existir', 'SUM não existe no SQL', 'Falta ORDER BY', 'Falta DISTINCT', 'WHERE filtra linhas antes do GROUP BY.'],
      ['Uma consulta pode ter WHERE e HAVING juntos?', 'Sim: WHERE filtra linhas e HAVING filtra grupos', 'Não, só um dos dois', 'Só com subconsulta', 'Só sem GROUP BY', 'São etapas diferentes e se complementam.'],
    ],
    calc: [
      ['Por que usar 100.0 em vez de 100 em percentuais?', 'Para evitar divisão inteira', 'Para arredondar', 'Para converter em texto', 'Para ignorar nulos', '5/2 = 2 em divisão inteira; 5.0/2 = 2.5.'],
      ['O que ROUND(12.345, 1) retorna?', '12.3', '12', '12.35', '13', 'Arredonda para 1 casa decimal.'],
      ['Como evitar divisão por zero em a / b?', 'a / NULLIF(b, 0)', 'a / COALESCE(b)', 'a / ROUND(b)', 'a / ABS(b)', 'NULLIF transforma 0 em NULL e o resultado vira NULL em vez de erro.'],
    ],
    subquery: [
      ['Uma subconsulta usada com > (como em preco > (SELECT ...)) precisa retornar:', 'Exatamente um valor', 'Várias colunas', 'Uma tabela inteira', 'Nada', 'Subconsultas escalares devolvem um único valor.'],
      ['Onde uma subconsulta pode aparecer?', 'No WHERE, no FROM e no SELECT', 'Só no WHERE', 'Só no FROM', 'Só depois do ORDER BY', 'Subconsultas são aceitas em vários pontos da consulta.'],
      ['Subconsulta no FROM precisa de:', 'Um apelido', 'Um índice', 'Um ORDER BY', 'Um LIMIT', 'Dê um nome à tabela derivada: FROM (SELECT ...) AS t.'],
    ],
    join: [
      ['O que INNER JOIN retorna?', 'Apenas linhas com correspondência nas duas tabelas', 'Todas as linhas da esquerda', 'Todas as linhas das duas tabelas', 'Apenas a tabela da direita', 'Linhas sem par são descartadas.'],
      ['Em "FROM pedidos p JOIN clientes c ON c.id = p.cliente_id", o ON define:', 'Como as tabelas se relacionam', 'Quais colunas aparecem', 'A ordem', 'Um limite', 'ON é a condição de ligação entre as tabelas.'],
      ['Por que usar p.id em vez de só id em um JOIN?', 'Para evitar ambiguidade entre colunas de mesmo nome', 'Porque é mais rápido', 'Porque id é palavra reservada', 'Para ordenar', 'Quando as duas tabelas têm id, o prefixo indica qual usar.'],
    ],
    leftjoin: [
      ['O que LEFT JOIN garante?', 'Todas as linhas da tabela da esquerda', 'Apenas linhas com par', 'Todas as linhas da direita', 'Nenhuma linha duplicada', 'Sem par, as colunas da direita ficam NULL.'],
      ['Como encontrar clientes sem pedidos com LEFT JOIN?', 'WHERE p.id IS NULL', 'WHERE p.id = 0', 'HAVING COUNT(*) = 0', "WHERE p.id = ''", 'Linhas sem correspondência têm NULL nas colunas da direita.'],
      ['Filtrar a tabela da direita no WHERE de um LEFT JOIN pode:', 'Transformá-lo em INNER JOIN', 'Acelerar sem efeito', 'Duplicar linhas', 'Gerar erro', 'Coloque esse filtro no ON para manter as linhas sem par.'],
    ],
    rightjoin: [
      ['A RIGHT JOIN B equivale a:', 'B LEFT JOIN A', 'A INNER JOIN B', 'A FULL JOIN B', 'B INNER JOIN A', 'São espelhos: muda só a ordem das tabelas.'],
      ['FULL JOIN mantém:', 'As linhas das duas tabelas', 'Só as linhas com par', 'Só a esquerda', 'Só a direita', 'FULL JOIN junta LEFT e RIGHT.'],
      ['Por que muitos times evitam RIGHT JOIN?', 'Padronizar em LEFT JOIN facilita a leitura', 'RIGHT JOIN é mais lento', 'RIGHT JOIN não existe', 'RIGHT JOIN remove nulos', 'É uma escolha de legibilidade; o resultado pode ser o mesmo.'],
    ],
    selfjoin: [
      ['O que é um SELF JOIN?', 'Uma tabela unida com ela mesma', 'Um JOIN sem condição', 'Um JOIN com subconsulta', 'Um JOIN entre três tabelas', 'Usado, por exemplo, para ligar funcionário e gerente.'],
      ['O que é obrigatório em um SELF JOIN?', 'Apelidos diferentes para cada cópia', 'GROUP BY', 'DISTINCT', 'LIMIT', 'Sem apelidos o banco não sabe qual cópia usar.'],
      ['Para listar também quem não tem gerente, use:', 'LEFT JOIN', 'INNER JOIN', 'CROSS JOIN', 'UNION', 'LEFT JOIN mantém quem tem gerente_id nulo.'],
    ],
    union: [
      ['Qual a diferença entre UNION e UNION ALL?', 'UNION remove duplicatas; UNION ALL mantém', 'UNION ALL remove duplicatas', 'Não há diferença', 'UNION só funciona com números', 'UNION ALL é mais rápido por não deduplicar.'],
      ['Para unir duas consultas, elas precisam ter:', 'O mesmo número de colunas', 'As mesmas tabelas', 'O mesmo WHERE', 'O mesmo número de linhas', 'Colunas na mesma posição devem ser compatíveis.'],
      ['Os nomes das colunas do resultado de um UNION vêm:', 'Do primeiro SELECT', 'Do último SELECT', 'Da tabela maior', 'São numerados automaticamente', 'O primeiro SELECT define os nomes.'],
    ],
    setops: [
      ['INTERSECT retorna:', 'O que aparece nos dois resultados', 'Tudo de ambos', 'O que está só no primeiro', 'O que está só no segundo', 'É a interseção de conjuntos.'],
      ['A EXCEPT B retorna:', 'O que está em A e não está em B', 'O que está em B e não em A', 'O que está em ambos', 'Tudo de A e de B', 'A ordem importa no EXCEPT.'],
      ['No Oracle, o equivalente ao EXCEPT é:', 'MINUS', 'DIFF', 'NOT IN', 'SUBTRACT', 'Oracle usa MINUS.'],
    ],
    case: [
      ['CASE no SQL é semelhante a:', 'A função SE do Excel', 'A função SOMA', 'Um JOIN', 'Um índice', 'CASE retorna valores de acordo com condições.'],
      ['Sem ELSE, quando nenhuma condição é verdadeira, CASE retorna:', 'NULL', '0', 'Erro', 'O primeiro THEN', 'O resultado padrão é NULL.'],
      ['Como contar pedidos cancelados dentro de um SELECT agregado?', "SUM(CASE WHEN status = 'Cancelado' THEN 1 ELSE 0 END)", "COUNT(status = 'Cancelado')", "CASE COUNT(status)", "SUM(status = Cancelado)", 'Esse padrão funciona como o "contar se".'],
    ],
    cte: [
      ['Qual palavra inicia uma CTE?', 'WITH', 'CTE', 'TEMP', 'DEFINE', 'WITH nome AS (consulta) cria uma etapa nomeada.'],
      ['Como declarar duas CTEs?', 'WITH a AS (...), b AS (...)', 'WITH a AS (...) WITH b AS (...)', 'WITH a, b AS (...)', 'CTE a; CTE b;', 'Um único WITH, com as CTEs separadas por vírgula.'],
      ['Por quanto tempo uma CTE existe?', 'Apenas durante a consulta', 'Até fechar o banco', 'Para sempre, como uma view', 'Até o próximo COMMIT', 'Ela não é salva no banco.'],
    ],
    view: [
      ['O que é uma view?', 'Uma consulta salva com nome', 'Uma cópia física da tabela', 'Um índice', 'Um backup', 'A view guarda a consulta, não os dados.'],
      ['Como consultar a view vw_vendas?', 'SELECT * FROM vw_vendas;', 'EXEC vw_vendas;', 'OPEN vw_vendas;', 'CALL vw_vendas;', 'Uma view é consultada como uma tabela.'],
      ['Quando os dados da tabela mudam, a view:', 'Reflete os dados atuais', 'Fica desatualizada', 'É apagada', 'Gera erro', 'A consulta da view roda de novo a cada uso.'],
    ],
    groupconcat: [
      ['O que GROUP_CONCAT faz?', 'Junta os textos de um grupo em uma única célula', 'Soma textos', 'Conta valores', 'Separa um texto em linhas', 'É o equivalente ao UNIRTEXTO por grupo.'],
      ['No PostgreSQL e no SQL Server, a função equivalente é:', 'STRING_AGG', 'CONCAT_WS', 'LISTAGG_ALL', 'JOIN_TEXT', 'STRING_AGG(coluna, separador).'],
      ['GROUP_CONCAT com valores NULL:', 'Ignora os nulos', 'Escreve "NULL"', 'Gera erro', 'Para a concatenação', 'Nulos são ignorados.'],
    ],
    correlated: [
      ['O que caracteriza uma subconsulta correlacionada?', 'Ela usa colunas da consulta externa', 'Ela fica no FROM', 'Ela não tem WHERE', 'Ela usa UNION', 'É avaliada para cada linha da consulta de fora.'],
      ['EXISTS retorna verdadeiro quando:', 'A subconsulta retorna ao menos uma linha', 'A subconsulta retorna NULL', 'A subconsulta retorna 1', 'Não há linhas', 'EXISTS só verifica se há linha.'],
      ['Para "não existe pedido", qual é a forma segura com nulos?', 'NOT EXISTS', 'NOT IN', '<> ALL', '!= NULL', 'NOT EXISTS lida bem com NULL; NOT IN pode falhar.'],
    ],
    kpis: [
      ['Como calcular a margem percentual corretamente?', '100.0 * (receita - custo) / receita', 'AVG(margem de cada item)', 'receita / custo', 'SUM(receita) - SUM(custo)', 'Calcule a razão sobre os totais, não a média dos percentuais.'],
      ['Ticket médio é:', 'A média do valor por pedido', 'O maior pedido', 'A soma dos pedidos', 'A quantidade de pedidos', 'Equivale a AVG(valor_total).'],
      ['Para metas sem vendas aparecerem com 0, use:', 'LEFT JOIN com COALESCE', 'INNER JOIN', 'UNION', 'DISTINCT', 'LEFT JOIN mantém a meta e COALESCE troca NULL por 0.'],
    ],
    rownumber: [
      ['O que ROW_NUMBER() OVER (PARTITION BY cliente ORDER BY data) faz?', 'Numera os pedidos de cada cliente por data', 'Conta os clientes', 'Soma os pedidos', 'Remove duplicatas', 'PARTITION BY reinicia a numeração por cliente.'],
      ['Window functions podem ser filtradas direto no WHERE?', 'Não, calcule numa CTE e filtre fora', 'Sim, sempre', 'Só com HAVING', 'Só no SQLite', 'O WHERE roda antes das window functions.'],
      ['Diferente do GROUP BY, uma window function:', 'Mantém todas as linhas', 'Agrupa as linhas', 'Remove nulos', 'Exige DISTINCT', 'Ela calcula sem reduzir o número de linhas.'],
    ],
    rank: [
      ['Valores 100, 100, 90 com RANK resultam em:', '1, 1, 3', '1, 2, 3', '1, 1, 2', '2, 2, 3', 'RANK pula posições depois do empate.'],
      ['E com DENSE_RANK?', '1, 1, 2', '1, 1, 3', '1, 2, 3', '1, 2, 2', 'DENSE_RANK não pula posições.'],
      ['Para o "Top 2 por categoria", usa-se:', 'DENSE_RANK numa CTE filtrando <= 2', 'LIMIT 2', 'GROUP BY categoria LIMIT 2', 'MAX(preco)', 'O ranking por partição seguido de filtro resolve o Top N por grupo.'],
    ],
    windowagg: [
      ['SUM(valor) OVER (ORDER BY data) calcula:', 'O acumulado ao longo das datas', 'O total geral', 'A média', 'O máximo', 'Com ORDER BY dentro do OVER, a soma vira acumulada.'],
      ['Qual frame gera média móvel de 3 linhas?', 'ROWS BETWEEN 2 PRECEDING AND CURRENT ROW', 'ROWS 3', 'RANGE 3 DAYS', 'LIMIT 3', 'Considera a linha atual e as duas anteriores.'],
      ['SUM(x) OVER () (vazio) representa:', 'O total de todas as linhas', 'O valor da linha', 'O acumulado', 'Zero', 'Útil para percentuais do total sem subconsulta.'],
    ],
    laglead: [
      ['LAG(valor) traz:', 'O valor da linha anterior', 'O valor da próxima linha', 'O primeiro valor', 'A média', 'LEAD traz a próxima linha.'],
      ['Qual o resultado do LAG na primeira linha de uma partição?', 'NULL', '0', 'O próprio valor', 'Erro', 'Não existe linha anterior.'],
      ['Crescimento percentual mês a mês é:', '100.0 * (atual - anterior) / anterior', 'atual - anterior', 'anterior / atual', 'atual * anterior', 'A variação é dividida pela base anterior.'],
    ],
    ntile: [
      ['NTILE(4) OVER (ORDER BY gasto DESC) divide os clientes em:', 'Quatro grupos de tamanho parecido', 'Grupos de quatro pessoas', 'Quatro colunas', 'Os 4 maiores', 'É a divisão em quartis.'],
      ['FIRST_VALUE(nome) OVER (PARTITION BY categoria ORDER BY preco DESC) retorna:', 'O produto mais caro de cada categoria', 'O primeiro produto cadastrado', 'O mais barato', 'O nome da categoria', 'Pega o primeiro valor da janela ordenada.'],
      ['CUME_DIST igual a 0,8 significa:', '80% dos valores são menores ou iguais', '80 linhas abaixo', 'Valor 80% maior que a média', 'Posição 8', 'É a distribuição acumulada relativa.'],
    ],
    recursive: [
      ['Uma CTE recursiva precisa de:', 'Uma âncora, um passo recursivo e uma condição de parada', 'Apenas um SELECT', 'Um índice', 'Um trigger', 'Sem condição de parada a recursão não termina.'],
      ['Qual operador une âncora e passo recursivo?', 'UNION ALL', 'JOIN', 'INTERSECT', 'EXCEPT', 'UNION ALL é o padrão em recursão.'],
      ['Um uso típico de CTE recursiva é:', 'Percorrer hierarquias como organogramas', 'Criar índices', 'Ordenar tabelas', 'Apagar duplicatas', 'Também serve para gerar sequências de datas.'],
    ],
    trigger: [
      ['O que é um trigger?', 'Uma ação executada automaticamente após um evento na tabela', 'Uma consulta salva', 'Um índice', 'Um tipo de JOIN', 'Dispara em INSERT, UPDATE ou DELETE.'],
      ['Dentro de um trigger de UPDATE, OLD e NEW representam:', 'A linha antes e depois da alteração', 'A primeira e a última linha', 'A tabela antiga e a nova', 'O usuário antigo e o novo', 'OLD tem os valores anteriores; NEW, os novos.'],
      ['Como cancelar uma operação inválida no SQLite?', "SELECT RAISE(ABORT, 'mensagem')", 'ROLLBACK TRIGGER', 'STOP', 'EXIT', 'RAISE(ABORT) interrompe a operação.'],
    ],
    procedure: [
      ['Uma stored procedure é:', 'Um bloco de SQL salvo, com nome e parâmetros', 'Uma tabela temporária', 'Um tipo de índice', 'Uma view materializada', 'É executada sob demanda.'],
      ['No estilo T-SQL, como executar sp_equipe com o parâmetro 3?', 'EXEC sp_equipe 3;', 'SELECT sp_equipe(3);', 'RUN sp_equipe 3;', 'CALL sp_equipe = 3;', 'No SQL Server usa-se EXEC.'],
      ['Uma vantagem das procedures é:', 'Centralizar rotinas e controlar permissões', 'Dispensar índices', 'Eliminar JOINs', 'Guardar dados duplicados', 'O usuário executa a rotina sem acessar a tabela diretamente.'],
    ],
    upsert: [
      ['O que um MERGE (ou UPSERT) faz?', 'Atualiza o que existe e insere o que é novo', 'Apaga duplicatas', 'Une duas tabelas em uma view', 'Cria uma tabela nova', 'Sincroniza destino com origem.'],
      ['No SQLite, o UPSERT é escrito com:', 'INSERT ... ON CONFLICT DO UPDATE', 'MERGE INTO', 'REPLACE JOIN', 'UPDATE OR INSERT', 'ON CONFLICT define o que fazer se a chave já existir.'],
      ['Em ON CONFLICT DO UPDATE SET valor = excluded.valor, "excluded" é:', 'A linha que tentou ser inserida', 'A linha apagada', 'A tabela de origem inteira', 'Um erro', 'excluded carrega os valores novos.'],
    ],
    customer: [
      ['Na análise RFM, R significa:', 'Recência', 'Receita', 'Retenção', 'Ranking', 'Recência, Frequência e Valor.'],
      ['Na recência, um valor menor indica:', 'Cliente que comprou mais recentemente (melhor)', 'Cliente inativo', 'Cliente que gastou menos', 'Erro de cálculo', 'Poucos dias desde a última compra é bom sinal.'],
      ['A taxa de retenção usa como denominador:', 'Os clientes do período inicial', 'Todos os clientes cadastrados', 'Os clientes do período final', 'O total de pedidos', 'Quantos dos clientes iniciais voltaram.'],
    ],
    abc: [
      ['Na curva ABC, os itens A costumam representar:', 'Cerca de 80% do resultado', '50% do resultado', 'Os itens mais baratos', 'Os itens sem venda', 'Segue o princípio de Pareto.'],
      ['Qual window function calcula o percentual acumulado?', 'SUM() OVER (ORDER BY receita DESC) / SUM() OVER ()', 'RANK()', 'LAG()', 'NTILE(3)', 'Acumulado dividido pelo total.'],
      ['Por que incluir um desempate no ORDER BY do acumulado?', 'Para o resultado ser estável quando há valores iguais', 'Para acelerar', 'Para remover nulos', 'Não faz diferença', 'Empates sem critério podem mudar a ordem entre execuções.'],
    ],
    basket: [
      ['Para achar produtos comprados juntos, faz-se:', 'SELF JOIN de itens pelo mesmo pedido', 'UNION de pedidos', 'GROUP BY produto', 'LEFT JOIN com clientes', 'Cada par de itens do mesmo pedido vira uma linha.'],
      ['Por que usar a.produto_id < b.produto_id?', 'Para não repetir pares nem parear um item com ele mesmo', 'Para ordenar', 'Para acelerar o JOIN', 'Para remover nulos', 'Com <, o par (A,B) aparece uma única vez.'],
      ['Como manter apenas pares frequentes?', 'HAVING COUNT(*) >= 2', 'WHERE COUNT(*) >= 2', 'LIMIT 2', 'DISTINCT', 'O filtro é sobre a contagem de cada grupo.'],
    ],
    index: [
      ['Um índice serve para:', 'Encontrar linhas sem ler a tabela inteira', 'Guardar backups', 'Validar e-mails', 'Ordenar o resultado sempre', 'É como o índice remissivo de um livro.'],
      ['Uma desvantagem de criar muitos índices é:', 'INSERT e UPDATE ficam mais lentos', 'As consultas ficam erradas', 'A tabela perde dados', 'Nenhuma', 'Cada índice precisa ser atualizado nas escritas.'],
      ['Como verificar se o índice está sendo usado no SQLite?', 'EXPLAIN QUERY PLAN', 'SHOW INDEX', 'DESCRIBE', 'ANALYZE TABLE', 'O plano mostra se há SEARCH ... USING INDEX.'],
    ],
    tuning: [
      ["Qual filtro aproveita um índice em data_pedido?", "data_pedido >= '2026-01-01' AND data_pedido < '2027-01-01'", "strftime('%Y', data_pedido) = '2026'", "data_pedido LIKE '%2026%'", "substr(data_pedido, 1, 4) = '2026'", 'Aplicar funções na coluna impede o uso do índice (filtro não SARGable).'],
      ['Uma boa prática de otimização é:', 'Trazer só as colunas necessárias', 'Usar sempre SELECT *', 'Repetir subconsultas', 'Evitar índices', 'Menos dados lidos significa consultas mais rápidas.'],
      ['Subconsultas correlacionadas lentas podem ser trocadas por:', 'CTE com JOIN', 'Mais subconsultas', 'UNION ALL', 'DISTINCT', 'Calcule uma vez e junte o resultado.'],
    ],
    dashboard: [
      ['Para montar um painel em SQL, a melhor organização é:', 'CTEs em etapas: base, métricas e ranking', 'Uma única subconsulta gigante', 'Várias views em cadeia sem nome', 'Tabelas temporárias sem índice', 'Etapas nomeadas facilitam validar cada parte.'],
      ['Qual combinação traz ranking e participação no mesmo SELECT?', 'DENSE_RANK() OVER e SUM() OVER ()', 'GROUP BY e LIMIT', 'UNION e EXCEPT', 'LIKE e IN', 'Window functions calculam as duas coisas sem perder linhas.'],
      ['Antes de publicar um painel, é importante:', 'Validar os totais com uma consulta simples', 'Remover o WHERE', 'Usar SELECT *', 'Apagar as CTEs', 'Conferir totais evita números errados no painel.'],
    ],
  };
  global.QUIZ_SQL = Q;
  if (global.Lessons && global.Lessons.LESSONS) Object.keys(Q).forEach(function (k) { if (global.Lessons.LESSONS[k]) global.Lessons.LESSONS[k].quiz = Q[k]; });
})(typeof window !== 'undefined' ? window : globalThis);
