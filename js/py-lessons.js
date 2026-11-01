/* =====================================================================
   py-lessons.js — Aulas e questões da trilha de Python para Dados
   ---------------------------------------------------------------------
   Mesmo formato das outras trilhas: carrossel de 5 slides + narração.
   O exemplo do slide 3 é código Python de verdade; a saída mostrada foi
   gerada executando o código no Python (Pyodide) — ver build/py_build.js,
   que grava js/py-outputs.js.
   Questões de prova: [pergunta, correta, errada1, errada2, errada3, explicação]
   ===================================================================== */
(function (global) {
  'use strict';
  const L = {};
  function lesson(key, kw, titulo, ideia, analogia, sintaxe, notas, exemplo, cuidados, quiz) {
    L[key] = { key: key, kw: kw, titulo: titulo, ideia: ideia, analogia: analogia, sintaxe: sintaxe, notas: notas, exemplo: exemplo, cuidados: cuidados, quiz: quiz };
  }

  /* =============================== NÍVEL 1 =============================== */
  lesson('print', 'PRINT', 'print() e comentários',
    'Todo programa precisa mostrar resultados. A função print() escreve valores na saída, separados por espaço. Linhas que começam com # são comentários: o Python ignora, mas quem lê o código agradece.',
    'É o painel de mensagens do carro: o motor faz o trabalho, mas é o painel que conta o que está acontecendo.',
    '# isto é um comentário\nprint("Olá, NexusMarket!")\nprint("Pedidos:", 40)\nprint("A", "B", sep=" | ")',
    ['Textos vão entre aspas simples ou duplas.', 'Vários valores no mesmo print() saem separados por espaço; sep= troca o separador.', 'Cada print() termina com uma quebra de linha.'],
    { p: 'Mensagem de boas-vindas do relatório:', c: '# relatório do semestre\nprint("Relatório NexusMarket")\nprint("Pedidos no semestre:", len(vendas))\nprint("Lojas", "Online", sep=" | ")' },
    ['Python diferencia maiúsculas: Print() não existe.', 'Feche sempre as aspas e os parênteses.', 'Comentários explicam o porquê, não repetem o código.'],
    [['O que print("A", "B") mostra?', 'A B', 'AB', 'A,B', '"A" "B"', 'Por padrão os valores são separados por um espaço.'],
      ['Como se escreve um comentário em Python?', '# texto', '// texto', '-- texto', '<!-- texto -->', 'Tudo depois de # na linha é ignorado.'],
      ['Qual parâmetro troca o separador do print()?', 'sep', 'end', 'split', 'join', 'sep=" | " troca o espaço por " | ".']]);

  lesson('variaveis', 'VARIÁVEIS', 'Variáveis e tipos',
    'Variável é um nome que guarda um valor: total = 150. Os tipos básicos são int (inteiro), float (decimal), str (texto) e bool (True ou False). O Python descobre o tipo sozinho, e type() mostra qual é.',
    'É uma etiqueta numa caixa: o nome fica na etiqueta, o valor fica dentro, e você pode trocar o conteúdo depois.',
    'produto = "Monitor 27"   # str\npreco = 1600.0            # float\nestoque = 12              # int\nativo = True              # bool\nprint(type(preco))',
    ['Nomes usam letras, números e _, sem espaço e sem começar por número.', 'Use nomes claros: preco_unitario em vez de p.', '= atribui; == compara.'],
    { p: 'Guardando dados de um produto:', c: 'produto = "Monitor 27"\npreco = 1600.0\nestoque = 12\nprint(produto, preco, estoque)\nprint(type(produto), type(preco), type(estoque))' },
    ['Use ponto para decimais: 1600.50, nunca 1600,50.', 'Uma variável pode mudar de valor (e até de tipo).', 'Evite nomes de funções como variável (sum, list, str).'],
    [['Qual o tipo de 12.5?', 'float', 'int', 'str', 'bool', 'Números com ponto decimal são float.'],
      ['Qual nome de variável é válido?', 'preco_total', '2preco', 'preco total', 'preco-total', 'Sem espaços, hífens ou número no início.'],
      ['O que faz preco = 99?', 'Guarda 99 na variável preco', 'Compara preco com 99', 'Imprime 99', 'Cria uma lista', '= é atribuição.']]);

  lesson('operadores', 'OPERADORES', 'Operadores e contas',
    'Python faz contas com + − * / e também // (divisão inteira), % (resto) e ** (potência). A ordem segue a matemática: parênteses primeiro, depois potência, multiplicação e divisão, e por fim soma e subtração. round() arredonda.',
    'É uma calculadora científica que nunca esquece a ordem das operações.',
    'total = 3 * 420          # 1260\nmedia = total / 4        # 315.0\ncaixas = 25 // 6         # 4 caixas cheias\nsobra = 25 % 6           # 1 item sobrando\nround(2.675, 1)          # 2.7',
    ['/ sempre devolve float; // devolve a parte inteira.', '% (resto) é útil para saber se um número é par (n % 2 == 0).', '+= soma ao valor atual: total += 10.'],
    { p: 'Faturamento e margem de uma venda:', c: 'qtd = 3\npreco = 420\ncusto = 260\nfaturamento = qtd * preco\nlucro = qtd * (preco - custo)\nmargem = lucro / faturamento * 100\nprint(faturamento, lucro, round(margem, 1))' },
    ['Sem parênteses, 1 + 2 * 3 é 7, não 9.', 'round(x, 2) arredonda; para mostrar com 2 casas, use f-string.', 'Divisão por zero gera erro.'],
    [['Quanto vale 17 // 5?', '3', '3.4', '2', '5', '// é a divisão inteira.'],
      ['Quanto vale 17 % 5?', '2', '3', '3.4', '0', '% é o resto da divisão.'],
      ['Quanto vale (2 + 3) * 4?', '20', '14', '24', '9', 'Os parênteses são calculados primeiro.']]);

  lesson('texto', 'TEXTO', 'Textos (strings)',
    'Textos podem ser somados (concatenados) com +, repetidos com *, e têm métodos: upper(), lower(), title(), strip(), replace(). len() conta os caracteres. Strings são imutáveis: os métodos devolvem um texto novo.',
    'É massinha de modelar: você não muda a peça original, molda uma cópia no formato que quiser.',
    'nome = "  cafeteira elétrica "\nlimpo = nome.strip()            # tira espaços das pontas\nprint(limpo.title())            # Cafeteira Elétrica\nprint(limpo.upper(), len(limpo))\nprint(limpo.replace("elétrica", "italiana"))',
    ['Os métodos são chamados com ponto e parênteses: texto.upper().', 'Para juntar texto com número use str(numero) ou f-string.', '"in" verifica se um trecho existe: "café" in texto.'],
    { p: 'Padronizando o nome de um produto:', c: 'nome = "  garrafa TÉRMICA  "\nprint("[" + nome + "]")\nlimpo = nome.strip().title()\nprint("[" + limpo + "]", len(limpo))\nprint("Térmica" in limpo)' },
    ['"Total: " + 10 dá erro: converta o número.', 'strip() não remove espaços do meio.', 'Lembre de guardar o resultado: nome = nome.strip().'],
    [['O que " oi ".strip() devolve?', '"oi"', '" oi "', '"OI"', '"oi "', 'strip remove espaços do início e do fim.'],
      ['Qual método deixa tudo maiúsculo?', 'upper()', 'title()', 'capitalize()', 'big()', 'upper converte todas as letras.'],
      ['Quanto vale len("Casa")?', '4', '3', '5', '1', 'Quatro caracteres.']]);

  lesson('fstring', 'F-STRING', 'f-strings: textos com valores',
    'A f-string monta textos com valores dentro de chaves: f"Total: {total}". Dentro das chaves vale qualquer expressão, e a formatação vem depois de dois-pontos: {valor:.2f} (2 casas), {valor:,.2f} (milhar), {pct:.1%} (porcentagem).',
    'É um formulário com espaços em branco: o Python preenche cada lacuna com o valor certo.',
    'total = 64520.5\npct = 0.175\nprint(f"Faturamento: R$ {total:,.2f}")\nprint(f"Cancelados: {pct:.1%}")\nprint(f"{\'Produto\':<12}|{\'Qtd\':>5}")',
    ['O f vem antes das aspas: f"…".', ':.2f fixa 2 casas; :, separa milhar com vírgula (padrão americano).', ':<10 alinha à esquerda em 10 espaços; :>10 à direita.'],
    { p: 'Resumo do semestre com valores formatados:', c: 'pedidos = len(vendas)\nfaturamento = sum(v["qtd"] * v["preco"] for v in vendas if v["status"] != "Cancelado")\nprint(f"Pedidos: {pedidos}")\nprint(f"Faturamento: R$ {faturamento:,.2f}")\nprint(f"Ticket médio: R$ {faturamento / pedidos:.2f}")' },
    ['Sem o f na frente, as chaves aparecem literalmente.', 'Aspas dentro da f-string precisam ser diferentes das de fora.', 'O padrão :, usa vírgula para milhar; para o formato brasileiro, troque depois com replace.'],
    [['O que f"{3.14159:.2f}" mostra?', '3.14', '3.1416', '3', '3.14159', ':.2f arredonda para 2 casas.'],
      ['Como mostrar 0.25 como 25.0%?', 'f"{0.25:.1%}"', 'f"{0.25}%"', 'f"{25:%}"', 'str(0.25) + "%"', 'O formato % multiplica por 100.'],
      ['O que acontece com "Total: {x}" sem o f?', 'Mostra {x} literalmente', 'Mostra o valor de x', 'Dá erro de sintaxe', 'Mostra vazio', 'Só a f-string substitui as chaves.']]);

  lesson('conversao', 'CONVERSÃO', 'Convertendo tipos',
    'Dados chegam como texto com frequência. int() e float() convertem texto em número; str() converte número em texto. Antes de converter, o texto precisa estar limpo: "1.234,50" precisa virar "1234.50".',
    'É trocar dinheiro de moeda: o valor é o mesmo, mas precisa estar no formato que a loja aceita.',
    'qtd = int("3")\npreco = float("89.90")\ntexto = "R$ 1.234,50"\nvalor = float(texto.replace("R$", "").replace(".", "").replace(",", ".").strip())\nprint(qtd * preco, valor)',
    ['int("3.5") dá erro; use float() para decimais.', 'int(3.9) corta para 3 (não arredonda).', 'bool("") é False; qualquer texto não vazio é True.'],
    { p: 'Convertendo preços em texto para números:', c: 'for t in precos_texto:\n    valor = float(t.replace("R$", "").replace(".", "").replace(",", ".").strip())\n    print(t, "->", valor)' },
    ['A ordem dos replace importa: primeiro tire o ponto de milhar, depois troque a vírgula.', 'Texto com espaço extra pode falhar: use strip().', 'Converta uma vez e guarde o número.'],
    [['O que int("42") devolve?', '42 (inteiro)', '"42"', '42.0', 'Erro', 'Converte texto em inteiro.'],
      ['O que int(7.9) devolve?', '7', '8', '7.9', 'Erro', 'int corta a parte decimal.'],
      ['Para converter "89,90" em número, primeiro:', 'Troque a vírgula por ponto', 'Use int()', 'Use str()', 'Some 0', 'float só entende ponto decimal.']]);

  lesson('listas', 'LISTAS', 'Listas',
    'Lista guarda vários valores em ordem: precos = [350, 420, 150]. Cada item tem uma posição (índice) que começa em 0. append() adiciona no fim, len() conta, e listas podem misturar tipos.',
    'É uma fila numerada de prateleiras: a primeira é a de número 0.',
    'precos = [350, 420, 150]\nprecos.append(90)\nprint(precos[0], precos[-1])   # primeiro e último\nprint(len(precos))\nprecos[1] = 400                # altera um item',
    ['O índice -1 é o último item; -2, o penúltimo.', '"x in lista" verifica se o valor está na lista.', 'remove(valor) apaga a primeira ocorrência; pop() remove o último.'],
    { p: 'Montando a lista de categorias:', c: 'categorias = ["Eletrônicos", "Informática", "Casa"]\ncategorias.append("Esportes")\nprint(categorias)\nprint(len(categorias), categorias[0], categorias[-1])\nprint("Casa" in categorias)' },
    ['Índice fora do tamanho gera IndexError.', 'lista = lista.append(x) apaga a lista: append não devolve nada.', 'Listas são mutáveis: alterar uma cópia "por referência" altera a original.'],
    [['Qual o índice do primeiro item?', '0', '1', '-1', 'Depende', 'A contagem começa em zero.'],
      ['O que lista[-1] devolve?', 'O último item', 'O primeiro item', 'Um erro', 'Uma lista vazia', 'Índices negativos contam do fim.'],
      ['Qual método adiciona no fim?', 'append', 'add', 'push', 'insert_end', 'append adiciona um item ao final.']]);

  lesson('fatias', 'FATIAS', 'Fatias (slicing)',
    'Fatias pegam um pedaço de lista ou texto: lista[início:fim], em que o fim não entra. Omitir o início começa do zero; omitir o fim vai até o final. Com passo: lista[::2] pega de dois em dois; lista[::-1] inverte.',
    'É cortar um trecho de uma fita métrica: você marca onde começa e onde para antes.',
    'meses = ["jan", "fev", "mar", "abr", "mai", "jun"]\nprint(meses[:3])     # 1º trimestre\nprint(meses[3:])     # 2º trimestre\nprint(meses[-2:])    # os dois últimos\ndata = "2026-03-15"\nprint(data[:4], data[5:7])   # ano e mês',
    ['O fim da fatia é exclusivo: [0:3] pega 0, 1 e 2.', 'Fatias funcionam igual em textos.', 'Fatia fora do tamanho não dá erro: devolve o que existir.'],
    { p: 'Ano e mês a partir da data do pedido:', c: 'for v in vendas[:4]:\n    print(v["pedido"], v["data"], "ano:", v["data"][:4], "mês:", v["data"][5:7])' },
    ['[1:3] tem 2 itens, não 3.', 'Use fatias para datas no formato AAAA-MM-DD.', 'lista[::-1] cria uma cópia invertida; a original não muda.'],
    [['Quais itens [10, 20, 30, 40][1:3] devolve?', '[20, 30]', '[10, 20, 30]', '[20, 30, 40]', '[10, 20]', 'Do índice 1 até antes do 3.'],
      ['Como pegar os 3 primeiros itens?', 'lista[:3]', 'lista[3:]', 'lista[0:2]', 'lista[-3:]', 'Do começo até antes do 3.'],
      ['O que "2026-03-15"[5:7] devolve?', '"03"', '"2026"', '"15"', '"-03"', 'Posições 5 e 6.']]);

  lesson('if', 'IF', 'Decisões com if, elif e else',
    'if executa um bloco só quando a condição é verdadeira; elif testa outra condição; else cobre o resto. Os blocos são definidos pelo recuo (4 espaços) depois dos dois-pontos. Comparações: ==, !=, >, <, >=, <=.',
    'É a placa de bifurcação na estrada: dependendo do destino, você segue por um caminho ou outro.',
    'valor = 1300\nif valor >= 2000:\n    faixa = "Alta"\nelif valor >= 500:\n    faixa = "Média"\nelse:\n    faixa = "Baixa"\nprint(faixa)',
    ['Os dois-pontos e o recuo são obrigatórios.', 'As condições são testadas em ordem; a primeira verdadeira vence.', '== compara; = atribui.'],
    { p: 'Classificando pedidos pela faixa de valor:', c: 'for v in vendas[:6]:\n    valor = v["qtd"] * v["preco"]\n    if valor >= 2000:\n        faixa = "Alta"\n    elif valor >= 500:\n        faixa = "Média"\n    else:\n        faixa = "Baixa"\n    print(v["pedido"], valor, faixa)' },
    ['Ordem importa: teste a faixa mais alta primeiro.', 'Recuo misturado (tab e espaço) gera erro.', 'Textos são comparados com diferença de maiúsculas: "Casa" != "casa".'],
    [['O que delimita o bloco do if?', 'O recuo (indentação)', 'Chaves { }', 'A palavra end', 'Ponto e vírgula', 'Python usa recuo para blocos.'],
      ['Com x = 5, qual bloco roda em "if x > 10 … elif x > 3 … else"?', 'O elif', 'O if', 'O else', 'Nenhum', '5 não é > 10, mas é > 3.'],
      ['Qual operador testa "diferente de"?', '!=', '<>', '=!', 'not=', '!= significa diferente.']]);

  lesson('logicos', 'AND / OR', 'Condições combinadas',
    'and exige que as duas condições sejam verdadeiras; or exige ao menos uma; not inverte. "in" verifica pertencimento: status in ["Entregue", "Em trânsito"]. Combinadas, permitem filtros como "online e acima de R$ 1.000".',
    'É o porteiro com duas regras: para entrar precisa de crachá E estar na lista; ou basta ser VIP.',
    'canal = "Online"\nvalor = 1600\nif canal == "Online" and valor > 1000:\n    print("Frete grátis")\nif canal == "Loja" or valor > 3000:\n    print("Brinde")\nprint(not (valor > 1000))',
    ['and e or são palavras, não símbolos (&& não existe).', 'Use parênteses para deixar claro: (a and b) or c.', '"x in [..]" é mais limpo do que vários or.'],
    { p: 'Pedidos online acima de R$ 1.000 e não cancelados:', c: 'for v in vendas[:12]:\n    valor = v["qtd"] * v["preco"]\n    if v["canal"] == "Online" and valor > 1000 and v["status"] != "Cancelado":\n        print(v["pedido"], v["canal"], valor)' },
    ['Comparar com várias opções exige repetir a variável: x == "a" or x == "b" (não x == "a" or "b").', 'not tem precedência alta: use parênteses.', 'Teste os casos de borda (>= ou >?).'],
    [['True and False resulta em:', 'False', 'True', 'None', 'Erro', 'and exige as duas verdadeiras.'],
      ['Qual expressão testa se status é "Entregue" ou "Em trânsito"?', 'status in ["Entregue", "Em trânsito"]', 'status == "Entregue" or "Em trânsito"', 'status == ["Entregue", "Em trânsito"]', 'status and ["Entregue"]', 'in compara com cada item da lista.'],
      ['not (5 > 3) resulta em:', 'False', 'True', '5', 'Erro', '5 > 3 é True; not inverte.']]);

  lesson('for', 'FOR', 'Laço for',
    'for repete um bloco para cada item de uma sequência: for v in vendas. range(n) gera os números de 0 a n−1, e range(início, fim, passo) dá mais controle. É a ferramenta para percorrer dados linha a linha.',
    'É a fila do caixa: cada cliente é atendido, um de cada vez, pelo mesmo procedimento.',
    'for categoria in ["Casa", "Esportes"]:\n    print(categoria)\n\nfor i in range(1, 4):\n    print("Mês", i)',
    ['O nome depois de for recebe cada item, um por vez.', 'range(1, 4) gera 1, 2, 3 (o 4 não entra).', 'break interrompe o laço; continue pula para o próximo item.'],
    { p: 'Percorrendo o catálogo de produtos:', c: 'for p in produtos[:5]:\n    print(p["codigo"], p["nome"], p["preco"])' },
    ['Não altere a lista enquanto percorre: crie uma nova.', 'Nomeie a variável do laço no singular: for produto in produtos.', 'Cuidado com o recuo: o que está fora do recuo roda uma vez só.'],
    [['Quais números range(3) gera?', '0, 1, 2', '1, 2, 3', '0, 1, 2, 3', '3', 'De 0 até antes do 3.'],
      ['Para que serve o break?', 'Interromper o laço', 'Pular um item', 'Reiniciar o laço', 'Criar uma lista', 'break sai do laço imediatamente.'],
      ['Quantas vezes "for x in [5, 6, 7]" repete?', '3', '7', '5', '18', 'Uma vez por item.']]);

  lesson('acumulador', 'ACUMULADOR', 'Acumuladores: somar e contar no laço',
    'Para totalizar dados, crie uma variável antes do laço (total = 0) e atualize dentro dele (total += valor). O mesmo vale para contar (contador += 1) e para guardar o maior valor encontrado. É o padrão por trás de quase todo relatório.',
    'É o contador de pessoas na porta da loja: começa em zero e soma um a cada cliente que passa.',
    'total = 0\nentregues = 0\nfor v in vendas:\n    if v["status"] == "Entregue":\n        total += v["qtd"] * v["preco"]\n        entregues += 1\nprint(total, entregues)',
    ['Inicialize o acumulador fora do laço.', 'total += x é o mesmo que total = total + x.', 'Para o maior valor, comece com o primeiro item ou com float("-inf").'],
    { p: 'Unidades vendidas e pedidos cancelados:', c: 'unidades = 0\ncancelados = 0\nfor v in vendas:\n    unidades += v["qtd"]\n    if v["status"] == "Cancelado":\n        cancelados += 1\nprint("Unidades:", unidades)\nprint("Cancelados:", cancelados)' },
    ['Zerar o acumulador dentro do laço apaga a soma a cada volta.', 'Confira o recuo do print final: dentro do laço ele imprime várias vezes.', 'Média = soma ÷ contagem; cuidado com contagem zero.'],
    [['Onde se inicializa o acumulador?', 'Antes do laço', 'Dentro do laço', 'Depois do laço', 'Em qualquer lugar', 'Senão ele é zerado a cada volta.'],
      ['O que total += 5 faz?', 'Soma 5 ao total', 'Atribui 5 ao total', 'Compara total com 5', 'Multiplica por 5', '+= é atualização.'],
      ['Para calcular a média num laço você precisa de:', 'Soma e contagem', 'Só a soma', 'Só a contagem', 'O maior valor', 'Média = soma ÷ quantidade.']]);

  lesson('nativas', 'SUM / MAX', 'Funções nativas para dados',
    'Python já traz funções prontas para listas: sum() soma, min() e max() acham extremos, len() conta, sorted() ordena (devolvendo uma lista nova) e round() arredonda. Com uma expressão geradora, dá para somar direto dos dados: sum(v["qtd"] for v in vendas).',
    'São as teclas de atalho da calculadora: em vez de digitar a conta toda, aperta-se um botão.',
    'precos = [p["preco"] for p in produtos]\nprint(sum(precos), min(precos), max(precos))\nprint(sorted(precos)[:3])\nprint(round(sum(precos) / len(precos), 2))',
    ['sorted(lista, reverse=True) ordena do maior para o menor.', 'max(dados, key=…) acha o item com o maior valor de um campo.', 'sum() só funciona com números.'],
    { p: 'Estatísticas rápidas do estoque:', c: 'estoques = [p["estoque"] for p in produtos]\nprint("Total em estoque:", sum(estoques))\nprint("Menor e maior:", min(estoques), max(estoques))\nprint("Média:", round(sum(estoques) / len(estoques), 1))' },
    ['sorted() não altera a lista original; lista.sort() altera.', 'max de lista vazia dá erro.', 'Arredonde só na apresentação, não no meio das contas.'],
    [['O que sorted([3, 1, 2]) devolve?', '[1, 2, 3]', '[3, 2, 1]', 'None', '[3, 1, 2]', 'Uma nova lista ordenada.'],
      ['Como achar o produto mais caro (o dicionário inteiro)?', 'max(produtos, key=lambda p: p["preco"])', 'max(produtos)', 'max(p["preco"])', 'sorted(produtos)[0]', 'key diz qual campo comparar.'],
      ['Qual a diferença entre sorted(x) e x.sort()?', 'sorted devolve nova lista; sort altera a original', 'Nenhuma', 'sort devolve nova lista', 'sorted só funciona com textos', 'x.sort() devolve None.']]);

  lesson('while', 'WHILE', 'Laço while',
    'while repete enquanto a condição for verdadeira. Serve quando não se sabe quantas repetições serão necessárias: simular até atingir uma meta, por exemplo. A condição precisa mudar dentro do laço, senão ele nunca termina.',
    'É encher um copo com a torneira aberta: você para quando o copo enche, não depois de um número fixo de segundos.',
    'estoque = 20\ndias = 0\nwhile estoque > 0:\n    estoque -= 3      # venda diária\n    dias += 1\nprint("Acaba em", dias, "dias")',
    ['Garanta que algo dentro do laço muda a condição.', 'Use for quando souber o número de repetições.', 'break também funciona no while.'],
    { p: 'Meses até a meta com crescimento de 8% ao mês:', c: 'faturamento = 10000\nmeta = 15000\nmeses = 0\nwhile faturamento < meta:\n    faturamento *= 1.08\n    meses += 1\nprint(meses, round(faturamento, 2))' },
    ['Laço infinito trava o programa: aqui ele é interrompido em 12 segundos.', 'Teste a condição de parada com um caso simples.', 'Prefira condições com >= e <= para não "passar direto".'],
    [['Quando o while para?', 'Quando a condição fica falsa', 'Depois de 10 voltas', 'Quando acha um erro', 'Nunca', 'Ele repete enquanto a condição é verdadeira.'],
      ['Qual o risco de "while True:" sem break?', 'Laço infinito', 'Erro de sintaxe', 'Não executa nenhuma vez', 'Executa uma vez', 'A condição nunca fica falsa.'],
      ['Quando preferir for em vez de while?', 'Quando se percorre uma lista ou sabe o número de repetições', 'Sempre', 'Nunca', 'Só com textos', 'for é mais simples e seguro nesses casos.']]);

  lesson('dict', 'DICT', 'Dicionários',
    'Dicionário guarda pares chave: valor, como um cadastro: produto = {"nome": "Cafeteira", "preco": 520}. Acesse com produto["nome"]; get("chave", padrão) evita erro quando a chave não existe. items() percorre chaves e valores juntos.',
    'É uma agenda: você procura pelo nome (a chave) e encontra o telefone (o valor).',
    'produto = {"nome": "Cafeteira", "preco": 520, "estoque": 14}\nprint(produto["nome"])\nproduto["estoque"] = 10          # altera\nproduto["categoria"] = "Casa"    # cria nova chave\nprint(produto.get("cor", "sem cor"))\nfor chave, valor in produto.items():\n    print(chave, "=", valor)',
    ['As chaves são únicas: atribuir de novo substitui o valor.', 'd["x"] com chave inexistente dá KeyError; d.get("x") devolve None.', '"chave in d" verifica se a chave existe.'],
    { p: 'Preço por código de produto:', c: 'preco_por_codigo = {}\nfor p in produtos:\n    preco_por_codigo[p["codigo"]] = p["preco"]\nprint(preco_por_codigo["P04"], preco_por_codigo.get("P99", "não existe"))\nprint(len(preco_por_codigo), "produtos")' },
    ['Acentos e maiúsculas fazem parte da chave.', 'Dicionários mantêm a ordem de inserção.', 'Use dicionários para buscar rápido por um código.'],
    [['Como acessar o valor da chave "preco"?', 'd["preco"]', 'd.preco', 'd(preco)', 'd[preco] sem aspas', 'Chaves de texto vão entre aspas.'],
      ['O que d.get("x", 0) devolve se "x" não existe?', '0', 'Erro', 'None', '"x"', 'O segundo argumento é o padrão.'],
      ['O que items() devolve?', 'Pares (chave, valor)', 'Só as chaves', 'Só os valores', 'O tamanho', 'Útil no for chave, valor in d.items().']]);

  lesson('registros', 'REGISTROS', 'Listas de dicionários: dados em tabela',
    'Uma lista de dicionários é uma tabela: cada dicionário é uma linha e as chaves são as colunas. É assim que vêm dados de APIs e planilhas. Percorra com for e acesse os campos pelo nome: v["preco"].',
    'É um fichário: cada ficha (dicionário) tem os mesmos campos preenchidos para um cliente diferente.',
    'vendas = [\n    {"pedido": 1, "produto": "P03", "qtd": 2},\n    {"pedido": 2, "produto": "P06", "qtd": 1},\n]\nfor v in vendas:\n    print(v["pedido"], v["qtd"])',
    ['vendas[0] é a primeira linha; vendas[0]["qtd"] é um campo dela.', 'Filtrar = montar uma nova lista com as linhas que interessam.', 'Os dados da NexusMarket estão nas variáveis vendas, produtos e clientes.'],
    { p: 'Clientes de São Paulo:', c: 'for c in clientes:\n    if c["estado"] == "SP":\n        print(c["id"], c["nome"], "-", c["cidade"])' },
    ['Confira o nome exato do campo (acentos, maiúsculas).', 'Ao filtrar, não remova itens da lista que está percorrendo.', 'Imprimir a primeira linha (print(vendas[0])) ajuda a conhecer os campos.'],
    [['Numa lista de dicionários, cada dicionário representa:', 'Uma linha', 'Uma coluna', 'A tabela inteira', 'Um tipo', 'As chaves são as colunas.'],
      ['Como pegar a quantidade do primeiro pedido?', 'vendas[0]["qtd"]', 'vendas["qtd"][0]', 'vendas.qtd[0]', 'vendas[qtd]', 'Primeiro a linha, depois o campo.'],
      ['Como descobrir quais campos existem?', 'print(vendas[0].keys())', 'len(vendas)', 'type(vendas)', 'vendas.columns', 'As chaves do primeiro registro são os campos.']]);

  lesson('funcoes', 'DEF', 'Funções',
    'Função é um bloco reutilizável com nome: def faixa(valor): … return resultado. Recebe parâmetros, devolve um valor com return e pode ter parâmetros com valor padrão. Funções deixam o código organizado e evitam repetição.',
    'É uma receita: você escreve uma vez e usa sempre que precisar, trocando só os ingredientes.',
    'def valor_pedido(qtd, preco, desconto=0):\n    """Valor do pedido com desconto (0 a 1)."""\n    return qtd * preco * (1 - desconto)\n\nprint(valor_pedido(2, 350))\nprint(valor_pedido(2, 350, desconto=0.1))',
    ['Sem return, a função devolve None.', 'Parâmetros com padrão vêm depois dos obrigatórios.', 'Variáveis criadas dentro da função não existem fora dela.'],
    { p: 'Função que classifica a margem de um produto:', c: 'def classe_margem(preco, custo):\n    margem = (preco - custo) / preco\n    if margem >= 0.4:\n        return "Alta"\n    elif margem >= 0.3:\n        return "Média"\n    return "Baixa"\n\nfor p in produtos[:6]:\n    print(p["nome"], classe_margem(p["preco"], p["custo"]))' },
    ['print dentro da função não é o mesmo que return.', 'Dê nomes que descrevam a ação: calcular_total, formatar_moeda.', 'Uma função deve fazer uma coisa bem feita.'],
    [['O que uma função sem return devolve?', 'None', '0', 'Erro', 'O último valor calculado', 'return é necessário para devolver um valor.'],
      ['Qual palavra cria uma função?', 'def', 'function', 'func', 'lambda only', 'def nome(parametros):'],
      ['Em def f(a, b=2), f(5) usa b igual a:', '2', '5', 'None', 'Erro', 'b tem valor padrão 2.']]);

  /* =============================== NÍVEL 2 =============================== */
  lesson('compreensao', 'COMPREENSÃO', 'List comprehension',
    'A compreensão de lista cria uma lista nova numa linha: [expressão for item in dados if condição]. Substitui o padrão "lista vazia + for + append" e é muito usada em análise de dados. Também existe para dicionários: {chave: valor for …}.',
    'É uma linha de montagem com controle de qualidade: cada item passa, é transformado, e só entra na caixa se aprovado.',
    'valores = [v["qtd"] * v["preco"] for v in vendas]\nonline = [v["pedido"] for v in vendas if v["canal"] == "Online"]\nprecos = {p["codigo"]: p["preco"] for p in produtos}',
    ['A ordem é: expressão, for, if.', 'Use quando couber de forma legível numa linha.', 'Com parênteses no lugar de colchetes vira um gerador (bom dentro de sum()).'],
    { p: 'Valores dos pedidos entregues acima de R$ 2.000:', c: 'grandes = [v["qtd"] * v["preco"] for v in vendas if v["status"] == "Entregue" and v["qtd"] * v["preco"] > 2000]\nprint(grandes)\nprint(len(grandes), sum(grandes))' },
    ['Compreensões muito longas ficam difíceis de ler: quebre em for normal.', 'O if no final filtra; um if/else antes do for transforma.', 'Não use compreensão só para executar ações (como print).'],
    [['O que [x * 2 for x in [1, 2, 3]] devolve?', '[2, 4, 6]', '[1, 2, 3, 1, 2, 3]', '6', '[1, 4, 9]', 'Cada item é multiplicado por 2.'],
      ['Onde fica o filtro na compreensão?', 'Depois do for: [x for x in d if cond]', 'Antes do for', 'Dentro do x', 'Não é possível filtrar', 'O if no final filtra os itens.'],
      ['Como criar um dicionário por compreensão?', '{k: v for k, v in pares}', '[k: v for k, v in pares]', 'dict[k for k in pares]', '(k: v for k in pares)', 'Chaves com dois-pontos.']]);

  lesson('ordenacao', 'LAMBDA', 'Ordenar com key e lambda',
    'sorted(dados, key=…) ordena listas de dicionários por um campo. lambda cria uma função curta na hora: key=lambda v: v["preco"]. reverse=True inverte a ordem. Com uma tupla na key, ordena por dois critérios.',
    'É organizar a estante: você escolhe o critério (altura, cor, autor) e a ordem.',
    'mais_caros = sorted(produtos, key=lambda p: p["preco"], reverse=True)\nfor p in mais_caros[:3]:\n    print(p["nome"], p["preco"])\n\n# dois critérios: categoria A→Z e preço maior→menor\nsorted(produtos, key=lambda p: (p["categoria"], -p["preco"]))',
    ['lambda x: expressão equivale a uma função de uma linha.', 'Top N = ordenar e fatiar: sorted(...)[:N].', 'min/max também aceitam key.'],
    { p: 'Os 5 pedidos de maior valor:', c: 'top = sorted(vendas, key=lambda v: v["qtd"] * v["preco"], reverse=True)[:5]\nfor v in top:\n    print(v["pedido"], v["produto"], v["qtd"] * v["preco"])' },
    ['Sem key, ordenar dicionários dá erro.', 'Para ordem decrescente de número, reverse=True ou o sinal negativo.', 'Empates mantêm a ordem original (ordenação estável).'],
    [['O que key=lambda p: p["preco"] faz no sorted?', 'Ordena pelo preço', 'Filtra por preço', 'Soma os preços', 'Cria a coluna preço', 'key define o critério.'],
      ['Como ordenar do maior para o menor?', 'reverse=True', 'order="desc"', 'sorted(-lista)', 'ascending=False', 'No sorted nativo, reverse=True.'],
      ['Como pegar os 3 maiores após ordenar decrescente?', 'lista[:3]', 'lista[-3:]', 'lista[3]', 'lista[:-3]', 'Os três primeiros.']]);

  lesson('agrupar', 'AGRUPAR', 'Agrupar com dicionários',
    'Para somar por categoria sem pandas, use um dicionário como acumulador: total[categoria] = total.get(categoria, 0) + valor. Cada chave é um grupo. É o equivalente ao GROUP BY do SQL ou à tabela dinâmica do Excel.',
    'É separar as notas fiscais em envelopes por categoria e somar cada envelope.',
    'por_categoria = {}\nfor v in vendas:\n    cat = v["categoria"]\n    por_categoria[cat] = por_categoria.get(cat, 0) + v["qtd"]\nprint(por_categoria)',
    ['get(chave, 0) devolve 0 na primeira vez que o grupo aparece.', 'Para contar, some 1 em vez do valor.', 'Ordene o resultado com sorted(d.items(), key=…).'],
    { p: 'Faturamento por canal (pedidos não cancelados):', c: 'por_canal = {}\nfor v in vendas:\n    if v["status"] != "Cancelado":\n        por_canal[v["canal"]] = por_canal.get(v["canal"], 0) + v["qtd"] * v["preco"]\nfor canal, total in por_canal.items():\n    print(canal, total)' },
    ['Esquecer o get gera KeyError no primeiro item do grupo.', 'Para média por grupo, guarde soma e contagem.', 'Grupos com acentos diferentes viram grupos diferentes: limpe antes.'],
    [['O que d.get(k, 0) + 1 faz num agrupamento?', 'Conta mais um no grupo k', 'Apaga o grupo k', 'Cria uma lista', 'Ordena o dicionário', 'Começa do 0 se o grupo é novo.'],
      ['Agrupar por categoria com dicionário equivale a:', 'GROUP BY do SQL', 'ORDER BY', 'JOIN', 'WHERE', 'Uma linha por grupo com a agregação.'],
      ['Para média por grupo você precisa guardar:', 'Soma e contagem por grupo', 'Só a soma', 'Só o maior valor', 'Só a contagem', 'Média = soma ÷ contagem.']]);

  lesson('counter', 'COUNTER', 'Counter: contagens prontas',
    'collections.Counter conta ocorrências automaticamente: Counter(v["categoria"] for v in vendas). most_common(n) devolve os n mais frequentes. Counter também soma valores quando você usa c[chave] += quantidade.',
    'É o placar eletrônico: cada vez que alguém pontua, o número sobe sozinho.',
    'from collections import Counter\nstatus = Counter(v["status"] for v in vendas)\nprint(status)\nprint(status.most_common(1))\nprint(status["Cancelado"])',
    ['Chave inexistente no Counter devolve 0 (sem erro).', 'most_common() sem número devolve todos, do maior para o menor.', 'Para somar quantidades: c[chave] += valor.'],
    { p: 'Produtos mais vendidos em unidades:', c: 'from collections import Counter\nunidades = Counter()\nfor v in vendas:\n    unidades[v["produto"]] += v["qtd"]\nfor codigo, qtd in unidades.most_common(3):\n    print(codigo, qtd)' },
    ['Lembre do import: from collections import Counter.', 'Counter ordena por frequência, não alfabeticamente.', 'Empates em most_common seguem a ordem de chegada.'],
    [['De qual módulo vem o Counter?', 'collections', 'math', 'statistics', 'itertools', 'from collections import Counter.'],
      ['O que most_common(2) devolve?', 'Os 2 itens mais frequentes com suas contagens', 'Os 2 primeiros inseridos', 'Os 2 menos frequentes', 'A soma dos 2', 'Lista de pares (item, contagem).'],
      ['Counter()["x"] com "x" inexistente devolve:', '0', 'KeyError', 'None', '"x"', 'Counter assume zero.']]);

  lesson('tuplas', 'TUPLAS', 'Tuplas, enumerate e zip',
    'Tupla é uma sequência que não muda: (2026, 3). Desempacotar distribui os valores: ano, mes = (2026, 3). enumerate() dá a posição junto com o item (ótimo para rankings) e zip() caminha por duas listas ao mesmo tempo.',
    'É um envelope lacrado com dois documentos: você abre e cada documento vai para a sua pasta.',
    'ano, mes = (2026, 3)\nfor posicao, nome in enumerate(["Ana", "Bruno"], start=1):\n    print(posicao, nome)\nmeses = ["jan", "fev"]\nmetas = [9000, 9500]\nfor m, meta in zip(meses, metas):\n    print(m, meta)',
    ['enumerate(lista, start=1) começa a contagem em 1.', 'zip para no fim da lista mais curta.', 'items() de dicionário devolve tuplas (chave, valor).'],
    { p: 'Ranking das 3 categorias com mais unidades:', c: 'from collections import Counter\nunid = Counter()\nfor v in vendas:\n    unid[v["categoria"]] += v["qtd"]\nfor pos, (cat, qtd) in enumerate(unid.most_common(3), start=1):\n    print(f"{pos}º {cat}: {qtd}")' },
    ['Tuplas não aceitam alteração: t[0] = 1 dá erro.', 'O número de variáveis no desempacotamento deve bater com os itens.', 'Use parênteses para desempacotar pares dentro do enumerate.'],
    [['O que enumerate devolve a cada volta?', '(posição, item)', 'Só a posição', 'Só o item', 'O tamanho', 'Pares com o índice.'],
      ['zip([1, 2, 3], ["a", "b"]) gera quantos pares?', '2', '3', '5', '6', 'Para na lista mais curta.'],
      ['O que "a, b = (1, 2)" faz?', 'a recebe 1 e b recebe 2', 'Dá erro', 'a recebe (1, 2)', 'Compara as tuplas', 'Desempacotamento.']]);

  lesson('conjuntos', 'SET', 'Conjuntos (set)',
    'set guarda valores únicos, sem ordem. set(lista) remove repetidos num passo. Operações de conjunto respondem perguntas de negócio: & (interseção: em ambos), | (união), − (diferença: em um e não no outro).',
    'É a lista de convidados: cada pessoa aparece uma vez, não importa quantas vezes foi convidada.',
    'compradores = {v["cliente"] for v in vendas}\nprint(len(compradores))\ntodos = {c["id"] for c in clientes}\nprint(sorted(todos - compradores))   # nunca compraram',
    ['{} vazio é dicionário; conjunto vazio é set().', 'Para mostrar em ordem, use sorted(conjunto).', '"in" é muito rápido em conjuntos.'],
    { p: 'Clientes que compraram online e na loja:', c: 'online = {v["cliente"] for v in vendas if v["canal"] == "Online"}\nloja = {v["cliente"] for v in vendas if v["canal"] == "Loja"}\nprint("Nos dois canais:", sorted(online & loja))\nprint("Só online:", sorted(online - loja))' },
    ['Conjuntos não têm índice: s[0] dá erro.', 'A ordem de impressão de um set pode variar: ordene antes de mostrar.', 'Só valores imutáveis entram num set (listas não).'],
    [['O que set([1, 1, 2]) devolve?', '{1, 2}', '[1, 2]', '{1, 1, 2}', '3', 'Repetidos são removidos.'],
      ['Qual operador dá os elementos presentes nos dois conjuntos?', '&', '|', '-', '+', '& é a interseção.'],
      ['Como criar um conjunto vazio?', 'set()', '{}', '[]', 'set[]', '{} cria um dicionário.']]);

  lesson('datas', 'DATETIME', 'Datas com datetime',
    'O módulo datetime transforma texto em data com strptime ("%Y-%m-%d") e data em texto com strftime ("%d/%m/%Y"). Com datas de verdade dá para extrair mês e dia da semana e calcular diferenças (timedelta).',
    'É trocar uma data escrita à mão por uma data no calendário: só no calendário dá para contar quantos dias faltam.',
    'from datetime import datetime\nd = datetime.strptime("2026-03-15", "%Y-%m-%d")\nprint(d.year, d.month, d.day, d.weekday())   # weekday: segunda = 0\nprint(d.strftime("%d/%m/%Y"))\nhoje = datetime(2026, 6, 30)\nprint((hoje - d).days, "dias")',
    ['%Y ano, %m mês, %d dia, %H hora, %M minuto.', 'weekday() vai de 0 (segunda) a 6 (domingo).', 'A diferença entre datas é um timedelta: use .days.'],
    { p: 'Pedidos de março com data em formato brasileiro:', c: 'from datetime import datetime\nfor v in vendas:\n    d = datetime.strptime(v["data"], "%Y-%m-%d")\n    if d.month == 3:\n        print(v["pedido"], d.strftime("%d/%m/%Y"))' },
    ['Formato errado no strptime gera ValueError.', 'Compare datas, não textos de datas em formatos diferentes.', 'Neste curso, "hoje" é 30/06/2026.'],
    [['Qual formato lê "2026-03-15"?', '"%Y-%m-%d"', '"%d/%m/%Y"', '"%m-%d-%Y"', '"%Y/%d/%m"', 'Ano-mês-dia.'],
      ['O que strftime faz?', 'Formata uma data como texto', 'Lê texto como data', 'Soma dias', 'Compara datas', 'f de format.'],
      ['Como obter o número de dias entre duas datas?', '(d2 - d1).days', 'd2.days - d1', 'days(d1, d2)', 'd2 // d1', 'A diferença é um timedelta.']]);

  lesson('erros', 'TRY', 'Tratando erros com try/except',
    'Dados reais têm problemas. try executa um bloco; se ocorrer um erro do tipo indicado no except, o programa trata em vez de parar. Assim, uma linha ruim não derruba o relatório inteiro, e ela pode ser registrada para revisão.',
    'É o airbag do carro: a viagem segue normal, mas se algo der errado, ele amortece o impacto.',
    'valores = ["120", "abc", "75.5", ""]\ntotal = 0\nfor t in valores:\n    try:\n        total += float(t)\n    except ValueError:\n        print("Valor inválido:", repr(t))\nprint(total)',
    ['Capture o erro específico (ValueError, KeyError), não tudo.', 'else roda quando não há erro; finally roda sempre.', 'Registre o que falhou para corrigir a origem dos dados.'],
    { p: 'Lendo quantidades digitadas no app de inventário:', c: 'contagens = {"P01": "8", "P02": "quinze", "P03": "40", "P04": ""}\nok = {}\nfor codigo, texto in contagens.items():\n    try:\n        ok[codigo] = int(texto)\n    except ValueError:\n        print(f"{codigo}: valor inválido {texto!r}")\nprint(ok)' },
    ['except vazio esconde erros de programação: evite.', 'Não use try para controlar fluxo normal quando um if resolve.', 'Mensagens de erro devem dizer o que corrigir.'],
    [['Para que serve o except?', 'Tratar um erro sem parar o programa', 'Gerar um erro', 'Repetir o bloco', 'Encerrar o programa', 'Ele captura o erro do bloco try.'],
      ['int("abc") gera qual erro?', 'ValueError', 'KeyError', 'TypeError', 'IndexError', 'Texto que não é número.'],
      ['Quando o bloco finally roda?', 'Sempre, com ou sem erro', 'Só se houver erro', 'Só se não houver erro', 'Nunca', 'Útil para liberar recursos.']]);

  lesson('limpeza', 'LIMPEZA', 'Limpeza de texto',
    'Dados digitados à mão chegam com espaços, maiúsculas misturadas e formatos diferentes. Encadeie métodos para padronizar: texto.strip().title(), " ".join(texto.split()) remove espaços duplos, replace troca trechos. Limpe antes de agrupar ou comparar.',
    'É lavar e cortar os ingredientes antes de cozinhar: sem isso, nenhuma receita fica boa.',
    'nome = "  carla  MENDES "\nlimpo = " ".join(nome.split()).title()\nprint(repr(nome), "->", repr(limpo))\ncodigo = " p03"\nprint(codigo.strip().upper())',
    ['split() sem argumento quebra em qualquer quantidade de espaços.', 'title() deixa "Da" e "De" maiúsculos: ajuste se precisar.', 'repr() mostra os espaços invisíveis.'],
    { p: 'Padronizando o cadastro digitado na loja:', c: 'for nome in cadastro_bruto:\n    limpo = " ".join(nome.split()).title()\n    print(f"{nome!r:22} -> {limpo}")' },
    ['Guarde o texto original para auditoria.', 'Padronize antes de comparar: "SP" e "sp " são iguais para o negócio.', 'Cuidado com nomes próprios (d\'Ávila, McDonald).'],
    [['O que " ".join("a   b".split()) devolve?', '"a b"', '"a   b"', '"ab"', '["a", "b"]', 'split quebra; join junta com um espaço.'],
      ['Qual método deixa cada palavra com inicial maiúscula?', 'title()', 'upper()', 'capitalize()', 'lower()', 'title capitaliza cada palavra.'],
      ['Por que limpar antes de agrupar?', 'Para que variações do mesmo valor fiquem no mesmo grupo', 'Para deixar mais lento', 'Porque é obrigatório no Python', 'Para remover linhas', '"Casa " e "casa" viram grupos diferentes.']]);

  lesson('estatistica', 'STATISTICS', 'Estatística com o módulo statistics',
    'O módulo statistics traz mean (média), median (mediana), mode (moda) e stdev (desvio padrão). A mediana é mais robusta a valores extremos do que a média, e o desvio padrão mostra o quanto os valores variam.',
    'É o termômetro do negócio: a média diz a temperatura, o desvio padrão diz se o clima está estável ou cheio de picos.',
    'from statistics import mean, median, stdev\nvalores = [v["qtd"] * v["preco"] for v in vendas]\nprint(round(mean(valores), 2), median(valores), round(stdev(valores), 2))',
    ['stdev é amostral; pstdev é populacional.', 'Média muito maior que a mediana indica valores altos puxando a média.', 'Arredonde só para exibir.'],
    { p: 'Média x mediana do valor dos pedidos:', c: 'from statistics import mean, median\nvalores = [v["qtd"] * v["preco"] for v in vendas if v["status"] != "Cancelado"]\nprint("Pedidos:", len(valores))\nprint("Média:", round(mean(valores), 2))\nprint("Mediana:", median(valores))' },
    ['Listas vazias geram erro em mean e median.', 'Mediana de quantidade par de valores é a média dos dois do meio.', 'Valores extremos podem ser erros de digitação: investigue.'],
    [['Qual medida é mais robusta a valores extremos?', 'Mediana', 'Média', 'Soma', 'Máximo', 'Ela não é puxada pelos extremos.'],
      ['O que stdev mede?', 'A dispersão dos valores', 'O valor do meio', 'O mais frequente', 'O total', 'Desvio padrão.'],
      ['Mediana de [1, 3, 10, 20]?', '6.5', '3', '8.5', '10', 'Média dos dois do meio: (3 + 10) / 2.']]);

  lesson('csv', 'CSV', 'Lendo CSV com o módulo csv',
    'CSV é o formato mais comum de troca de dados. csv.DictReader lê cada linha como dicionário, usando o cabeçalho como chaves. Os valores chegam como texto: converta para número antes de calcular. io.StringIO permite ler um texto como se fosse arquivo.',
    'É abrir uma planilha simples num bloco de notas: as vírgulas separam as colunas.',
    'import csv, io\nleitor = csv.DictReader(io.StringIO(VENDAS_CSV))\nfor linha in leitor:\n    print(linha["pedido"], int(linha["qtd"]) * int(linha["preco"]))',
    ['Num arquivo real: open("vendas.csv", encoding="utf-8").', 'Todos os campos chegam como str.', 'delimiter=";" lê arquivos exportados pelo Excel brasileiro.'],
    { p: 'Total por canal lendo o CSV:', c: 'import csv, io\ntotais = {}\nfor linha in csv.DictReader(io.StringIO(VENDAS_CSV)):\n    valor = int(linha["qtd"]) * int(linha["preco"])\n    totais[linha["canal"]] = totais.get(linha["canal"], 0) + valor\nprint(totais)' },
    ['Esquecer de converter soma textos ("2" + "3" = "23").', 'Confira o separador e a codificação do arquivo.', 'Linhas vazias no fim do arquivo podem virar registros vazios.'],
    [['Como o DictReader entrega cada linha?', 'Como dicionário', 'Como lista de números', 'Como DataFrame', 'Como texto único', 'Chaves = cabeçalho.'],
      ['Qual o tipo dos valores lidos de um CSV?', 'str', 'int', 'float', 'Depende da coluna', 'Precisa converter.'],
      ['Arquivo do Excel brasileiro costuma usar qual separador?', 'Ponto e vírgula', 'Vírgula', 'Tab sempre', 'Espaço', 'delimiter=";".']]);

  lesson('relatorio', 'RELATÓRIO', 'Relatórios alinhados com f-string',
    'Um relatório em texto fica legível com colunas alinhadas: {nome:<20} alinha à esquerda em 20 caracteres, {valor:>10,.2f} à direita com milhar e 2 casas. Uma linha de "-" * 30 separa cabeçalho e total.',
    'É diagramar uma nota fiscal: cada informação na sua coluna, com o total destacado no fim.',
    'linhas = [("Casa", 6720), ("Esportes", 12840)]\nprint(f"{\'Categoria\':<12}{\'Valor\':>12}")\nprint("-" * 24)\nfor cat, val in linhas:\n    print(f"{cat:<12}{val:>12,.2f}")',
    ['< esquerda, > direita, ^ centro.', 'O número depois do alinhamento é a largura total.', 'Monte os dados primeiro, formate só na impressão.'],
    { p: 'Relatório de unidades por categoria:', c: 'tot = {}\nfor v in vendas:\n    tot[v["categoria"]] = tot.get(v["categoria"], 0) + v["qtd"]\nprint(f"{\'Categoria\':<14}{\'Unid.\':>6}")\nprint("-" * 20)\nfor cat, q in sorted(tot.items()):\n    print(f"{cat:<14}{q:>6}")\nprint("-" * 20)\nprint(f"{\'Total\':<14}{sum(tot.values()):>6}")' },
    ['Textos maiores que a largura empurram as colunas.', 'Use a mesma largura no cabeçalho e nas linhas.', 'Para exportar, prefira CSV em vez de texto alinhado.'],
    [['O que {x:>8} faz?', 'Alinha x à direita em 8 caracteres', 'Alinha à esquerda', 'Mostra 8 casas decimais', 'Repete x 8 vezes', '> é à direita.'],
      ['O que "-" * 5 produz?', '"-----"', '"-5"', 'Erro', '-5', 'Repetição de texto.'],
      ['Qual formato mostra 1234.5 como 1,234.50?', '{:,.2f}', '{:.2f}', '{:,}', '{:2f}', 'Milhar e 2 casas.']]);

  /* =============================== NÍVEL 3 =============================== */
  lesson('dataframe', 'DATAFRAME', 'pandas: o DataFrame',
    'O pandas é a biblioteca de análise de dados do Python. O DataFrame é uma tabela com colunas nomeadas e um índice. head() mostra as primeiras linhas, shape o tamanho, columns os nomes e dtypes os tipos. Aqui os dados já estão prontos em vendas_df, produtos_df e clientes_df.',
    'É o Excel dentro do Python: a mesma ideia de tabela, mas com fórmulas que funcionam em milhões de linhas.',
    'import pandas as pd\nprint(vendas_df.shape)          # (linhas, colunas)\nprint(vendas_df.columns.tolist())\nprint(vendas_df.head(3))\nprint(vendas_df.dtypes)',
    ['import pandas as pd é a convenção universal.', 'pd.DataFrame(lista_de_dicionarios) cria a tabela.', 'len(df) é o número de linhas.'],
    { p: 'Conhecendo a tabela de produtos:', c: 'import pandas as pd\nprint(produtos_df.shape)\nprint(produtos_df.head(4))', pd: true },
    ['Sempre olhe os dados antes de analisar (head, shape, dtypes).', 'Colunas com tipo object costumam ser texto.', 'Não use df como nome de tudo: nomeie por conteúdo.'],
    [['O que df.shape devolve?', '(linhas, colunas)', 'Só o número de linhas', 'Os nomes das colunas', 'Os tipos', 'Uma tupla com o tamanho.'],
      ['Qual a forma comum de importar o pandas?', 'import pandas as pd', 'import pd', 'from pandas import *', 'include pandas', 'Convenção da comunidade.'],
      ['Para que serve head()?', 'Ver as primeiras linhas', 'Ordenar', 'Remover colunas', 'Somar', 'Padrão: 5 linhas.']]);

  lesson('selecao', 'LOC', 'Selecionar colunas e linhas',
    'df["coluna"] devolve uma coluna (Series); df[["a", "b"]] devolve várias. loc seleciona por rótulo (df.loc[linhas, colunas]) e iloc por posição (df.iloc[0:3]). Com loc dá para filtrar e escolher colunas ao mesmo tempo.',
    'É usar o zoom da planilha: escolher exatamente quais linhas e colunas aparecem na tela.',
    'import pandas as pd\nprint(vendas_df["produto"].head(3))\nprint(vendas_df[["pedido", "qtd", "preco"]].head(3))\nprint(vendas_df.iloc[0])          # primeira linha\nprint(vendas_df.loc[0:2, ["pedido", "status"]])',
    ['Dois colchetes [[ ]] devolvem DataFrame; um devolve Series.', 'loc inclui o fim do intervalo; iloc não inclui.', 'df.loc[cond, "coluna"] filtra e escolhe a coluna.'],
    { p: 'Pedido, cliente e canal dos 5 primeiros pedidos:', c: 'import pandas as pd\nprint(vendas_df[["pedido", "cliente", "canal"]].head(5))', pd: true },
    ['Nome de coluna errado gera KeyError.', 'iloc usa posições: cuidado depois de ordenar ou filtrar.', 'Prefira loc com nomes: o código fica mais claro.'],
    [['Qual a diferença entre loc e iloc?', 'loc usa rótulos; iloc usa posições', 'São iguais', 'iloc usa rótulos', 'loc só funciona com colunas', 'i de integer.'],
      ['df[["a", "b"]] devolve:', 'Um DataFrame com as colunas a e b', 'Uma Series', 'Uma lista', 'Um erro', 'Lista de colunas → DataFrame.'],
      ['Como pegar a primeira linha por posição?', 'df.iloc[0]', 'df.loc["0"]', 'df[0]', 'df.first', 'iloc[0].']]);

  lesson('filtros', 'FILTRO', 'Filtrar linhas',
    'Filtros usam condições sobre colunas: df[df["canal"] == "Online"]. Combine com & (e) e | (ou), sempre com parênteses em cada condição. isin() testa uma lista de valores, between() um intervalo, e ~ inverte.',
    'É o filtro da planilha, só que escrito: qualquer pessoa entende e repete a análise.',
    'import pandas as pd\nonline = vendas_df[vendas_df["canal"] == "Online"]\ncaros = vendas_df[(vendas_df["preco"] > 1000) & (vendas_df["status"] == "Entregue")]\ncasa_esp = vendas_df[vendas_df["categoria"].isin(["Casa", "Esportes"])]\nprint(len(online), len(caros), len(casa_esp))',
    ['Use & e |, não and e or.', 'Cada condição entre parênteses.', '~df["x"].isin(lista) = não está na lista.'],
    { p: 'Pedidos cancelados acima de R$ 1.000:', c: 'import pandas as pd\nvalor = vendas_df["qtd"] * vendas_df["preco"]\nfiltro = (vendas_df["status"] == "Cancelado") & (valor > 1000)\nprint(vendas_df.loc[filtro, ["pedido", "produto", "qtd", "preco"]])', pd: true },
    ['Sem parênteses, & tem prioridade sobre ==: dá erro ou resultado errado.', 'O filtro devolve uma cópia: guarde em uma variável.', 'Conte as linhas do resultado para conferir.'],
    [['Qual operador combina condições com "e" no pandas?', '&', 'and', '&&', '+', 'Operadores elemento a elemento.'],
      ['Como filtrar categoria em ["Casa", "Esportes"]?', 'df[df["categoria"].isin(["Casa", "Esportes"])]', 'df[df["categoria"] == ["Casa", "Esportes"]]', 'df.categoria in [...]', 'df.filter("Casa", "Esportes")', 'isin testa a lista.'],
      ['Por que usar parênteses em cada condição?', 'Por causa da precedência do & e do |', 'É só estilo', 'Para ficar mais rápido', 'Para criar colunas', 'Sem eles a conta sai errada.']]);

  lesson('colunas', 'NOVA COLUNA', 'Criar colunas calculadas',
    'Novas colunas são criadas com operações vetorizadas: df["valor"] = df["qtd"] * df["preco"]. A conta vale para todas as linhas de uma vez, sem for. Para regras com if, use df["col"].where(), apply() ou uma função com map.',
    'É a coluna calculada da planilha: escreve a fórmula uma vez e ela vale para todas as linhas.',
    'import pandas as pd\nvendas_df["valor"] = vendas_df["qtd"] * vendas_df["preco"]\nvendas_df["online"] = vendas_df["canal"] == "Online"\nvendas_df["mes"] = vendas_df["data"].str[5:7]\nprint(vendas_df[["pedido", "valor", "online", "mes"]].head())',
    ['Operações entre colunas acontecem linha a linha.', 'assign() cria colunas devolvendo um novo DataFrame.', 'Arredonde com .round(2).'],
    { p: 'Margem de cada produto do catálogo:', c: 'import pandas as pd\nprodutos_df["margem"] = (produtos_df["preco"] - produtos_df["custo"]) / produtos_df["preco"]\nprint(produtos_df[["nome", "preco", "custo", "margem"]].round(2).head(6))', pd: true },
    ['Evite for em DataFrame: use operações vetorizadas.', 'Criar coluna num DataFrame filtrado gera aviso: use .copy() antes.', 'Nomeie colunas sem espaços para facilitar.'],
    [['Como criar a coluna valor = qtd × preço?', 'df["valor"] = df["qtd"] * df["preco"]', 'for linha in df: valor = ...', 'df.valor(qtd * preco)', 'df.add("valor")', 'Conta vetorizada.'],
      ['Uma conta entre colunas acontece:', 'Linha a linha, para todas as linhas', 'Só na primeira linha', 'Só no total', 'Só com for', 'Operações vetorizadas.'],
      ['Como pegar os caracteres 5 a 7 de uma coluna de texto?', 'df["data"].str[5:7]', 'df["data"][5:7]', 'df.str["data"]', 'df["data"].slice', '.str aplica a cada valor.']]);

  lesson('ordenar', 'SORT', 'Ordenar e Top N',
    'sort_values("coluna", ascending=False) ordena do maior para o menor; com uma lista, ordena por várias colunas. nlargest(n, "col") e nsmallest(n, "col") dão o Top N direto. head(n) depois de ordenar faz o mesmo.',
    'É o ranking da competição: quem fez mais pontos aparece primeiro.',
    'import pandas as pd\nprint(produtos_df.sort_values("preco", ascending=False).head(3))\nprint(produtos_df.nlargest(3, "estoque")[["nome", "estoque"]])\nprint(produtos_df.sort_values(["categoria", "preco"]).head(4))',
    ['ascending=False = decrescente.', 'sort_values devolve uma cópia ordenada.', 'reset_index(drop=True) renumera depois de ordenar.'],
    { p: 'Os 5 pedidos de maior quantidade:', c: 'import pandas as pd\nprint(vendas_df.nlargest(5, "qtd")[["pedido", "produto", "qtd"]])', pd: true },
    ['O índice original continua depois de ordenar.', 'Empates mantêm a ordem anterior.', 'Ordene antes de fatiar o Top N.'],
    [['Como ordenar do maior para o menor?', 'sort_values("col", ascending=False)', 'sort_values("col", reverse=True)', 'sort("col", desc)', 'order_by("col")', 'ascending=False.'],
      ['O que nlargest(3, "preco") devolve?', 'As 3 linhas de maior preço', 'Os 3 menores preços', 'A soma dos 3', 'As 3 primeiras linhas', 'Top 3 por preço.'],
      ['Como renumerar o índice após ordenar?', 'reset_index(drop=True)', 'reindex()', 'sort_index()', 'index = 0', 'drop=True descarta o índice antigo.']]);

  lesson('agregacao', 'AGREGAR', 'Agregações e contagens',
    'Colunas têm agregações prontas: sum(), mean(), median(), min(), max(), count(). value_counts() conta cada valor (com normalize=True dá a proporção) e describe() resume tudo de uma vez. nunique() conta valores distintos.',
    'É o rodapé da planilha que mostra soma, média e contagem da coluna selecionada.',
    'import pandas as pd\nprint(vendas_df["qtd"].sum(), vendas_df["preco"].mean().round(2))\nprint(vendas_df["status"].value_counts())\nprint(vendas_df["cliente"].nunique())',
    ['value_counts ordena do mais frequente para o menos.', 'mean() ignora valores ausentes (NaN).', 'normalize=True devolve proporções (0 a 1).'],
    { p: 'Participação de cada canal nos pedidos:', c: 'import pandas as pd\nprint(vendas_df["canal"].value_counts())\nprint(vendas_df["canal"].value_counts(normalize=True).round(3))', pd: true },
    ['count() não conta ausentes; len() conta todas as linhas.', 'Confira o tipo da coluna antes de somar.', 'Arredonde no final.'],
    [['O que value_counts() faz?', 'Conta quantas vezes cada valor aparece', 'Soma a coluna', 'Remove duplicados', 'Ordena alfabeticamente', 'Frequência de cada valor.'],
      ['Qual função conta valores distintos?', 'nunique()', 'count()', 'unique()', 'value_counts()', 'unique() lista; nunique() conta.'],
      ['mean() com valores ausentes:', 'Ignora os ausentes', 'Dá erro', 'Conta como zero', 'Devolve NaN sempre', 'skipna=True por padrão.']]);

  lesson('groupby', 'GROUPBY', 'groupby: agrupar e resumir',
    'groupby separa as linhas em grupos e aplica uma agregação a cada um: df.groupby("categoria")["valor"].sum(). É o GROUP BY do SQL e a tabela dinâmica do Excel. Com várias colunas no groupby, os grupos são combinações.',
    'É distribuir as vendas em pilhas por categoria e somar cada pilha.',
    'import pandas as pd\nvendas_df["valor"] = vendas_df["qtd"] * vendas_df["preco"]\nprint(vendas_df.groupby("categoria")["valor"].sum())\nprint(vendas_df.groupby(["canal", "status"])["pedido"].count())',
    ['O resultado tem os grupos no índice.', 'Ordene o resultado com sort_values(ascending=False).', 'reset_index() transforma o grupo em coluna.'],
    { p: 'Unidades vendidas por categoria, da maior para a menor:', c: 'import pandas as pd\nunid = vendas_df.groupby("categoria")["qtd"].sum().sort_values(ascending=False)\nprint(unid)', pd: true },
    ['Filtre antes de agrupar (ex.: tirar cancelados).', 'Agrupar por texto sem limpeza cria grupos duplicados.', 'size() conta linhas por grupo, inclusive com ausentes.'],
    [['O groupby do pandas equivale a:', 'GROUP BY do SQL', 'WHERE', 'JOIN', 'ORDER BY', 'Agrupar e agregar.'],
      ['Como somar o valor por categoria?', 'df.groupby("categoria")["valor"].sum()', 'df.sum("categoria")', 'df["valor"].groupby()', 'df.group("valor")', 'Agrupa, escolhe a coluna, agrega.'],
      ['Onde ficam os grupos no resultado?', 'No índice', 'Numa coluna nova chamada grupo', 'Na última linha', 'Não aparecem', 'reset_index() os traz para coluna.']]);

  lesson('agg', 'AGG', 'Várias agregações com agg',
    'agg() aplica várias agregações de uma vez, com nomes claros: df.groupby("canal").agg(pedidos=("pedido", "count"), unidades=("qtd", "sum")). O resultado é um DataFrame pronto para relatório.',
    'É o resumo da reunião: para cada área, o número de projetos, o orçamento e o prazo médio, tudo numa tabela.',
    'import pandas as pd\nresumo = vendas_df.groupby("canal").agg(\n    pedidos=("pedido", "count"),\n    unidades=("qtd", "sum"),\n    preco_medio=("preco", "mean"),\n)\nprint(resumo.round(1))',
    ['Formato: nome_novo=("coluna", "função").', 'Funções comuns: "sum", "mean", "count", "min", "max", "nunique".', 'Encadeie .sort_values() e .reset_index() no fim.'],
    { p: 'Resumo por categoria:', c: 'import pandas as pd\nvendas_df["valor"] = vendas_df["qtd"] * vendas_df["preco"]\nresumo = vendas_df.groupby("categoria").agg(pedidos=("pedido", "count"), faturamento=("valor", "sum"), ticket=("valor", "mean"))\nprint(resumo.round(2))', pd: true },
    ['Os nomes das agregações viram nomes de colunas.', 'count conta valores não ausentes.', 'Para porcentagem, divida pelo total depois.'],
    [['Como contar pedidos por canal com agg?', 'agg(pedidos=("pedido", "count"))', 'agg("count")', 'count(pedidos)', 'agg(pedido.count)', 'Nome novo = (coluna, função).'],
      ['agg devolve:', 'Um DataFrame com uma coluna por agregação', 'Uma lista', 'Um número', 'Um texto', 'Pronto para relatório.'],
      ['Qual função conta valores distintos dentro do agg?', '"nunique"', '"unique"', '"distinct"', '"count"', 'nunique.']]);

  lesson('merge', 'MERGE', 'Juntar tabelas com merge',
    'merge junta dois DataFrames por uma chave, como o PROCV do Excel ou o JOIN do SQL: vendas_df.merge(produtos_df, left_on="produto", right_on="codigo"). how="left" mantém todas as linhas da esquerda, mesmo sem correspondência.',
    'É grampear a ficha do produto em cada nota fiscal que tem o mesmo código.',
    'import pandas as pd\nm = vendas_df.merge(produtos_df[["codigo", "nome", "custo"]], left_on="produto", right_on="codigo", how="left")\nprint(m[["pedido", "produto", "nome", "custo"]].head())',
    ['on="chave" quando o nome da coluna é igual nas duas tabelas.', 'how: "inner" (só correspondências), "left", "right", "outer".', 'Selecione só as colunas necessárias antes de juntar.'],
    { p: 'Pedidos com o nome do cliente e o estado:', c: 'import pandas as pd\nm = vendas_df.merge(clientes_df[["id", "nome", "estado"]], left_on="cliente", right_on="id")\nprint(m[["pedido", "nome", "estado"]].head(6))', pd: true },
    ['Chaves duplicadas na direita multiplicam linhas.', 'Colunas com o mesmo nome ganham sufixos _x e _y.', 'Confira o número de linhas antes e depois do merge.'],
    [['merge do pandas equivale a:', 'JOIN do SQL / PROCV do Excel', 'GROUP BY', 'ORDER BY', 'UNION', 'Junta pela chave.'],
      ['how="left" faz o quê?', 'Mantém todas as linhas da tabela da esquerda', 'Só as correspondências', 'Só a direita', 'Remove duplicados', 'Como LEFT JOIN.'],
      ['Quando usar left_on e right_on?', 'Quando a chave tem nomes diferentes nas tabelas', 'Sempre', 'Nunca', 'Só com datas', 'produto × codigo.']]);

  lesson('pivot', 'PIVOT', 'Tabela dinâmica com pivot_table',
    'pivot_table cria a tabela dinâmica do Excel: index nas linhas, columns nas colunas, values com aggfunc. fill_value=0 preenche combinações sem dados, e margins=True acrescenta os totais.',
    'É a tabela dinâmica de sempre, agora escrita em uma linha e reproduzível.',
    'import pandas as pd\nvendas_df["mes"] = vendas_df["data"].str[5:7]\ntab = vendas_df.pivot_table(index="mes", columns="canal", values="qtd", aggfunc="sum", fill_value=0)\nprint(tab)',
    ['aggfunc pode ser "sum", "mean", "count"…', 'margins=True cria a linha e a coluna "All".', 'O resultado é um DataFrame comum.'],
    { p: 'Unidades por categoria e canal:', c: 'import pandas as pd\nprint(vendas_df.pivot_table(index="categoria", columns="canal", values="qtd", aggfunc="sum", fill_value=0, margins=True))', pd: true },
    ['Sem aggfunc, o padrão é a média.', 'Muitas categorias em columns deixam a tabela ilegível.', 'Use fill_value para não ter NaN.'],
    [['Qual parâmetro define as linhas da pivot_table?', 'index', 'rows', 'columns', 'values', 'index = linhas.'],
      ['Qual é o aggfunc padrão?', 'mean (média)', 'sum', 'count', 'max', 'Por isso informe "sum" quando quiser somar.'],
      ['O que margins=True acrescenta?', 'Totais de linhas e colunas', 'Bordas na tabela', 'Uma coluna de porcentagem', 'Linhas vazias', 'A linha e a coluna All.']]);

  lesson('datas_pd', 'DATAS', 'Datas no pandas',
    'pd.to_datetime converte textos em datas. Com o acessor .dt extraem-se partes: .dt.month, .dt.year, .dt.day_name(). Datas permitem filtrar períodos e agrupar por mês. dt.to_period("M") agrupa por ano-mês.',
    'É trocar a coluna de datas digitadas por um calendário inteligente, que sabe que março vem depois de fevereiro.',
    'import pandas as pd\nvendas_df["data"] = pd.to_datetime(vendas_df["data"])\nvendas_df["mes"] = vendas_df["data"].dt.month\nprint(vendas_df.groupby("mes")["qtd"].sum())\nprint(vendas_df[vendas_df["data"] >= "2026-05-01"].shape[0])',
    ['Compare datas com textos no formato "AAAA-MM-DD".', '.dt só funciona em colunas do tipo data.', 'dt.to_period("M") gera 2026-01, 2026-02…'],
    { p: 'Pedidos por mês:', c: 'import pandas as pd\nvendas_df["data"] = pd.to_datetime(vendas_df["data"])\nprint(vendas_df.groupby(vendas_df["data"].dt.to_period("M"))["pedido"].count())', pd: true },
    ['Converta uma vez, logo depois de ler os dados.', 'Datas em formato brasileiro precisam de format="%d/%m/%Y".', 'Fuso horário e hora podem atrapalhar comparações.'],
    [['Como converter uma coluna de texto em data?', 'pd.to_datetime(df["data"])', 'df["data"].date()', 'datetime(df["data"])', 'df.to_date("data")', 'to_datetime.'],
      ['Como extrair o mês de uma coluna de datas?', 'df["data"].dt.month', 'df["data"].month', 'df.month("data")', 'df["data"][5:7]', 'Acessor .dt.'],
      ['dt.to_period("M") serve para:', 'Agrupar por ano-mês', 'Somar meses', 'Converter em texto', 'Remover datas', 'Período mensal.']]);

  lesson('nulos', 'NULOS', 'Valores ausentes',
    'Dados reais têm buracos (NaN ou None). isna() mostra onde faltam valores e isna().sum() conta por coluna. fillna() preenche (com zero, média ou um texto) e dropna() remove linhas incompletas. A escolha depende do negócio.',
    'É revisar um formulário: alguns campos podem ficar "não informado", outros tornam a ficha inválida.',
    'import pandas as pd\nprint(pedidos_incompletos.isna().sum())\nprint(pedidos_incompletos.dropna(subset=["valor"]))\nprint(pedidos_incompletos["canal"].fillna("Não informado"))',
    ['subset= limita a verificação a algumas colunas.', 'fillna(df["col"].mean()) preenche com a média.', 'Conte os ausentes antes e depois de tratar.'],
    { p: 'Preenchendo quantidade ausente com 1 e somando:', c: 'import pandas as pd\np = pedidos_incompletos.copy()\nprint("Ausentes em qtd:", p["qtd"].isna().sum())\np["qtd"] = p["qtd"].fillna(1)\nprint(p[["pedido", "qtd"]])\nprint("Total:", p["qtd"].sum())', pd: true },
    ['Remover linhas pode distorcer a análise: registre quantas saíram.', 'Zero não é o mesmo que ausente.', 'Colunas inteiras com ausentes viram float.'],
    [['Como contar ausentes por coluna?', 'df.isna().sum()', 'df.count()', 'df.null()', 'len(df.dropna())', 'True conta como 1.'],
      ['O que dropna(subset=["valor"]) faz?', 'Remove linhas sem valor', 'Remove a coluna valor', 'Preenche valor', 'Conta os ausentes', 'Só olha a coluna valor.'],
      ['Como preencher ausentes com um texto?', 'fillna("Não informado")', 'dropna("Não informado")', 'isna("Não informado")', 'replace(None)', 'fillna preenche.']]);

  lesson('texto_pd', 'STR', 'Texto no pandas (.str)',
    'O acessor .str aplica métodos de texto a uma coluna inteira: .str.strip(), .str.title(), .str.upper(), .str.contains("x"), .str.replace(). É a limpeza do nível 2, agora para todas as linhas de uma vez.',
    'É aplicar o "Localizar e substituir" na coluna inteira, com regras bem definidas.',
    'import pandas as pd\nnomes = pd.Series(cadastro_bruto)\nlimpos = nomes.str.split().str.join(" ").str.title()\nprint(limpos)\nprint(produtos_df[produtos_df["nome"].str.contains("Fone|Mouse")]["nome"])',
    ['contains aceita expressões regulares ("A|B" = A ou B).', 'case=False ignora maiúsculas no contains.', '.str.len() conta caracteres.'],
    { p: 'Produtos com "Pro" ou "X" no nome, em maiúsculas:', c: 'import pandas as pd\nsel = produtos_df[produtos_df["nome"].str.contains("Pro|X")]\nprint(sel["nome"].str.upper())', pd: true },
    ['Valores ausentes passam pelo .str como NaN.', 'Caracteres especiais em regex precisam de escape (\\.).', 'Limpe antes de agrupar ou juntar.'],
    [['Como deixar a coluna nome em maiúsculas?', 'df["nome"].str.upper()', 'df["nome"].upper()', 'upper(df["nome"])', 'df.str.upper("nome")', 'Acessor .str.'],
      ['O que .str.contains("Fone|Mouse") procura?', 'Textos com Fone ou Mouse', 'Textos iguais a "Fone|Mouse"', 'Só Fone', 'Textos sem Fone', '| é "ou" na regex.'],
      ['Como ignorar maiúsculas no contains?', 'case=False', 'upper=True', 'ignore=True', 'lower()', 'Parâmetro case.']]);

  lesson('acumulado', 'CUMSUM', 'Acumulados, variação e ranking',
    'Para análises de tendência: cumsum() acumula, pct_change() calcula a variação percentual em relação à linha anterior, shift() desloca valores (mês anterior) e rank() dá a posição no ranking. São os equivalentes das medidas de inteligência de tempo.',
    'É o extrato bancário: além de cada lançamento, você vê o saldo acumulado e quanto variou em relação ao mês passado.',
    'import pandas as pd\nmensal = vendas_df.groupby(vendas_df["data"].str[:7])["qtd"].sum()\nprint(pd.DataFrame({"qtd": mensal, "acumulado": mensal.cumsum(), "var_%": (mensal.pct_change() * 100).round(1)}))',
    ['Ordene por data antes de acumular.', 'O primeiro pct_change é NaN (não há anterior).', 'rank(ascending=False) dá 1 ao maior.'],
    { p: 'Ranking dos clientes por unidades compradas:', c: 'import pandas as pd\nunid = vendas_df.groupby("cliente")["qtd"].sum()\nrk = pd.DataFrame({"unidades": unid, "posicao": unid.rank(ascending=False, method="min").astype(int)})\nprint(rk.sort_values("posicao").head(5))', pd: true },
    ['Acumulado sem ordenar mistura os períodos.', 'method="min" dá a mesma posição aos empatados.', 'Variação com base zero gera infinito.'],
    [['O que cumsum() calcula?', 'A soma acumulada', 'A média', 'A variação', 'A contagem', 'Soma linha a linha.'],
      ['O primeiro valor de pct_change() é:', 'NaN', '0', '100%', 'Erro', 'Não existe linha anterior.'],
      ['Como dar a posição 1 ao maior valor com rank?', 'rank(ascending=False)', 'rank()', 'rank(top=1)', 'sort_values()', 'Decrescente.']]);

  lesson('final', 'DESAFIO', 'Juntando tudo: um relatório de dados',
    'Uma análise completa segue um fluxo: carregar e conhecer os dados, limpar, criar colunas, filtrar, juntar com outras tabelas, agrupar e apresentar. Cada passo é uma linha de pandas, e o resultado pode ser refeito a qualquer momento com dados novos.',
    'É uma receita de bolo bem escrita: qualquer pessoa da equipe consegue repetir e chegar ao mesmo resultado.',
    '# 1. conhecer: head, shape, dtypes\n# 2. limpar: strip, fillna, to_datetime\n# 3. criar colunas: valor = qtd * preco\n# 4. filtrar: status != "Cancelado"\n# 5. juntar: merge com produtos/clientes\n# 6. resumir: groupby + agg\n# 7. apresentar: sort_values, round, print',
    ['Escreva o fluxo como uma sequência de passos pequenos.', 'Confira o resultado de cada passo com print.', 'Guarde o código: ele é a documentação da análise.'],
    { p: 'Lucro por categoria dos pedidos entregues:', c: 'import pandas as pd\nm = vendas_df[vendas_df["status"] == "Entregue"].merge(produtos_df[["codigo", "custo"]], left_on="produto", right_on="codigo")\nm["lucro"] = m["qtd"] * (m["preco"] - m["custo"])\nprint(m.groupby("categoria")["lucro"].sum().sort_values(ascending=False))', pd: true },
    ['Filtre cancelados antes de somar faturamento ou lucro.', 'Valide totais com uma conta simples.', 'Nomeie variáveis intermediárias de forma clara.'],
    [['Qual a ordem lógica de uma análise?', 'Conhecer, limpar, transformar, resumir e apresentar', 'Apresentar, depois limpar', 'Resumir sem olhar os dados', 'Juntar tudo e depois conhecer', 'Fluxo de análise de dados.'],
      ['Para calcular lucro por pedido você precisa juntar vendas com:', 'produtos (custo)', 'clientes', 'pedidos_incompletos', 'nada', 'O custo está no catálogo.'],
      ['Por que filtrar os cancelados antes de somar?', 'Eles não geram receita', 'Porque o pandas exige', 'Para ficar mais rápido', 'Não é necessário', 'Regra de negócio.']]);

  /* ------------------------- Tópico → aula ------------------------- */
  const MAP = {
    'print()': 'print', 'Variáveis': 'variaveis', 'Operadores': 'operadores', 'Textos': 'texto', 'f-string': 'fstring', 'Conversão': 'conversao',
    'Listas': 'listas', 'Fatias': 'fatias', 'if/elif/else': 'if', 'and/or': 'logicos', 'for': 'for', 'Acumuladores': 'acumulador', 'Funções nativas': 'nativas',
    'while': 'while', 'Dicionários': 'dict', 'Lista de dicionários': 'registros', 'Funções': 'funcoes', 'Desafio do nível': 'funcoes',
    'Compreensão de lista': 'compreensao', 'sorted + lambda': 'ordenacao', 'Agrupar com dict': 'agrupar', 'Counter': 'counter', 'Tuplas e zip': 'tuplas',
    'Conjuntos': 'conjuntos', 'datetime': 'datas', 'try/except': 'erros', 'Limpeza de texto': 'limpeza', 'statistics': 'estatistica', 'csv': 'csv', 'Relatório': 'relatorio',
    'DataFrame': 'dataframe', 'Seleção': 'selecao', 'Filtros': 'filtros', 'Colunas calculadas': 'colunas', 'Ordenação': 'ordenar', 'Agregações': 'agregacao',
    'groupby': 'groupby', 'agg': 'agg', 'merge': 'merge', 'pivot_table': 'pivot', 'Datas no pandas': 'datas_pd', 'Valores ausentes': 'nulos', 'Texto no pandas': 'texto_pd',
    'Acumulados e ranking': 'acumulado', 'Desafio final': 'final',
  };

  function outputOf(les) { return (global.PyOutputs && global.PyOutputs[les.key]) || null; }
  function register() {
    if (!global.Lessons || !global.Lessons.registerPack) return;
    global.Lessons.registerPack('python', {
      LESSONS: L, MAP: MAP, fallback: 'print', goalLabel: 'Objetivo do código',
      codeHtml: function (code) { return global.PyLang.highlight(code); },
      solution: function (ex) { return { label: 'Código da solução', code: ex.q, speech: 'Repare na solução no código e na saída que ela gera.' }; },
      example: function (les) {
        const out = outputOf(les), esc = global.UI.esc;
        const n = out == null ? 0 : out.replace(/\n$/, '').split('\n').length;
        return {
          code: les.exemplo.c, badge: 'Saída gerada pelo Python' + (les.exemplo.pd ? ' com pandas' : ''),
          liveHtml: '<pre class="py-out">' + esc(out == null ? '(execute no exercício para ver a saída)' : out.replace(/\n$/, '')) + '</pre>',
          speech: out == null ? 'Execute o código para ver o resultado.' : 'O código foi executado no Python e imprimiu ' + n + (n === 1 ? ' linha.' : ' linhas.'),
        };
      },
      tags: function (ex) { return [{ icon: 'code', label: ex.level === 3 ? 'Python + pandas' : 'Python' }].concat((ex.k || []).slice(0, 3).map(function (k) { return { icon: 'check', label: k }; })); },
    });
  }
  register();
  global.PyLessons = { LESSONS: L, MAP: MAP };
})(typeof window !== 'undefined' ? window : globalThis);
