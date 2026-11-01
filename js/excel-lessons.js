/* =====================================================================
   excel-lessons.js — Aulas e questões da trilha de Excel
   ---------------------------------------------------------------------
   Mesmo formato das aulas de SQL (carrossel de 5 slides + narração).
   O exemplo do slide 3 é calculado ao vivo pelo ExcelEngine.
   Cada aula tem 3 questões para as provas dos certificados:
     [pergunta, correta, errada 1, errada 2, errada 3, explicação]
   ===================================================================== */
(function (global) {
  'use strict';
  const L = {};
  function lesson(key, kw, titulo, ideia, analogia, sintaxe, notas, exemplo, cuidados, quiz) {
    L[key] = { key: key, kw: kw, titulo: titulo, ideia: ideia, analogia: analogia, sintaxe: sintaxe, notas: notas, exemplo: exemplo, cuidados: cuidados, quiz: quiz };
  }
  // exemplo: { p, sh (planilha), c (célula), fill (última linha), f (fórmula), cols (colunas exibidas), fmt, hdr }

  lesson('refs', '=', 'Fórmulas, operadores e referências',
    'Toda fórmula começa com =. Ela pode usar números, operadores (+ − * / ^) e referências a outras células, como G2. Quando os dados mudam, o resultado se atualiza sozinho.',
    'É uma calculadora que lê os números direto das células, em vez de você digitá-los.',
    '=G2*H2          multiplica\n=(D2-E2)/D2     parênteses primeiro\n=G2*H2*(1-I2)   com desconto\n=D2*10%         porcentagem',
    ['Referências relativas (G2) mudam de linha ao arrastar a fórmula para baixo.', 'A ordem de cálculo é: parênteses, potência, multiplicação/divisão, soma/subtração.'],
    { p: 'Valor bruto de cada pedido, arrastado para baixo:', sh: 'Vendas', c: 'K2', fill: 6, f: '=G2*H2', cols: ['E', 'G', 'H'], fmt: 'money', hdr: 'Valor' },
    ['Esquecer o = faz o Excel tratar a fórmula como texto.', 'Sem parênteses, =A1+B1/2 divide só B1.', 'Prefira referenciar células a digitar números: a planilha fica atualizável.'],
    [['Como começa toda fórmula no Excel?', 'Com o sinal de igual (=)', 'Com um apóstrofo', 'Com o nome da função', 'Com um parêntese', 'Sem o =, o Excel trata o conteúdo como texto.'],
      ['Em =10+20/2, qual o resultado?', '20', '15', '30', '25', 'A divisão vem antes da soma: 20/2 = 10, e 10 + 10 = 20.'],
      ['Ao arrastar =G2*H2 da linha 2 para a linha 3, a fórmula vira:', '=G3*H3', '=G2*H2', '=H2*I2', '=G3*H2', 'Referências relativas acompanham a linha.']]);

  lesson('absref', '$', 'Referências absolutas ($)',
    'O cifrão trava parte da referência. $B$3 não muda quando a fórmula é copiada; B3 muda. Use quando todas as linhas precisam apontar para a mesma célula, como uma taxa ou um intervalo de busca.',
    'É um alfinete: a célula travada fica presa no lugar enquanto o resto da fórmula se move.',
    '$B$3   trava coluna e linha\nB$3    trava só a linha\n$B3    trava só a coluna\nF4     alterna os modos ao editar',
    ['Intervalos de PROCV, CONT.SE e SOMASE costumam ser travados.', 'Em SOMA($G$2:G2), só o início fica travado e o fim acompanha a linha: isso gera um acumulado.'],
    { p: 'Reajuste usando a taxa fixa da planilha Simulação:', sh: 'Produtos', c: 'H2', fill: 6, f: '=D2*(1+Simulação!$B$3)', cols: ['B', 'D'], fmt: 'money', hdr: 'Reajustado' },
    ['Sem $, a referência da taxa desce junto e aponta para células vazias.', 'Trave só o necessário: às vezes basta travar a linha (B$3).', 'Referência a outra planilha usa o formato Planilha!Célula.'],
    [['O que $B$3 significa?', 'A referência não muda ao copiar a fórmula', 'A célula está formatada como moeda', 'A célula é protegida contra edição', 'B3 é somada duas vezes', 'O $ trava coluna e linha.'],
      ['Qual fórmula gera um acumulado ao ser arrastada?', '=SOMA($G$2:G2)', '=SOMA(G2:G2)', '=SOMA($G2:$G2)', '=SOMA(G$2:G$2)', 'O início fixo e o fim relativo fazem o intervalo crescer.'],
      ['Qual tecla alterna os tipos de referência ao editar uma fórmula?', 'F4', 'F2', 'Ctrl+$', 'F9', 'F4 alterna entre A1, $A$1, A$1 e $A1.']]);

  lesson('basicfn', 'SOMA', 'SOMA, MÉDIA, MÁXIMO, MÍNIMO e contagens',
    'As funções básicas resumem um intervalo em um único número: SOMA adiciona, MÉDIA calcula a média, MÁXIMO e MÍNIMO acham os extremos, CONT.NÚM conta números e CONT.VALORES conta células preenchidas.',
    'É a linha de totais no rodapé de um relatório.',
    '=SOMA(G2:G31)\n=MÉDIA(D2:D16)\n=MÁXIMO(E2:E15)\n=MÍNIMO(B2:B16)\n=CONT.NÚM(A2:A31)\n=CONT.VALORES(C2:C16)',
    ['Intervalos usam dois-pontos: G2:G31.', 'Vários argumentos são separados por ponto e vírgula: =SOMA(A2:A5;C2:C5).'],
    { p: 'Total de unidades em estoque:', sh: 'Produtos', c: 'I2', f: '=SOMA(F2:F16)' },
    ['MÉDIA ignora células vazias, mas conta zeros.', 'CONT.NÚM não conta textos; para contar qualquer conteúdo use CONT.VALORES.', 'No Excel em português o separador é ";" e não ",".'],
    [['Qual função conta apenas células com números?', 'CONT.NÚM', 'CONT.VALORES', 'CONTAR.VAZIO', 'SOMA', 'CONT.VALORES conta qualquer célula preenchida.'],
      ['Qual o separador de argumentos no Excel em português?', 'Ponto e vírgula (;)', 'Vírgula (,)', 'Dois-pontos (:)', 'Barra (/)', 'A vírgula é o separador decimal no Brasil.'],
      ['=MÉDIA(2;4;0) resulta em:', '2', '3', '6', '0', 'O zero entra no cálculo: 6 ÷ 3 = 2.']]);

  lesson('round', 'ARRED', 'Arredondamento, INT e MOD',
    'ARRED arredonda pelo critério matemático. ARREDONDAR.PARA.CIMA e PARA.BAIXO forçam a direção. INT pega a parte inteira e MOD devolve o resto de uma divisão.',
    'É decidir quantas caixas fechadas cabem num pedido (INT) e quantas unidades sobram (MOD).',
    '=ARRED(valor;2)\n=ARREDONDAR.PARA.CIMA(G2/4;0)\n=ARREDONDAR.PARA.BAIXO(D2*0,9;0)\n=INT(G2/4)\n=MOD(G2;4)',
    ['O 2º argumento é o número de casas decimais.', 'Formatar a célula só muda a aparência; ARRED muda o valor.'],
    { p: 'Média das três avaliações com 1 casa decimal:', sh: 'Notas', c: 'G2', fill: 6, f: '=ARRED(MÉDIA(B2:D2);1)', cols: ['A', 'B', 'C', 'D'], hdr: 'Média' },
    ['Arredondar no meio do cálculo pode acumular diferenças; prefira no final.', 'MOD(x;0) gera #DIV/0!.', 'Para "quantas caixas preciso", use ARREDONDAR.PARA.CIMA, não ARRED.'],
    [['=ARREDONDAR.PARA.CIMA(9/4;0) resulta em:', '3', '2', '2,25', '4', '2,25 arredondado para cima vira 3.'],
      ['=MOD(10;4) resulta em:', '2', '2,5', '0', '4', 'Dez dividido por quatro dá 2 e sobra 2.'],
      ['Qual a diferença entre ARRED e o formato de casas decimais?', 'ARRED altera o valor; o formato só altera a exibição', 'Não há diferença', 'O formato altera o valor', 'ARRED só funciona com moedas', 'Cálculos seguintes usam o valor real da célula.']]);

  lesson('se', 'SE', 'Função SE',
    'SE testa uma condição e devolve um valor quando ela é verdadeira e outro quando é falsa. Dá para colocar um SE dentro do outro para criar várias faixas.',
    'É um semáforo: se a condição bate, siga por um caminho; se não, pelo outro.',
    '=SE(teste; valor_se_verdadeiro; valor_se_falso)\n=SE(F2=0;"Repor";"OK")\n=SE(x>=3000;"Grande";SE(x>=1000;"Médio";"Pequeno"))',
    ['Textos no resultado vão entre aspas.', 'Comparações: = <> > < >= <='],
    { p: 'Alerta de reposição de estoque:', sh: 'Produtos', c: 'H2', fill: 6, f: '=SE(F2<20;"Repor";"OK")', cols: ['B', 'F'], hdr: 'Alerta' },
    ['Em SE aninhado, teste primeiro a faixa mais alta.', 'Muitos SE aninhados ficam difíceis de ler; SES é uma alternativa.', 'Esquecer as aspas em textos gera #NOME?.'],
    [['=SE(5>3;"Sim";"Não") resulta em:', 'Sim', 'Não', 'VERDADEIRO', '5', 'A condição 5 > 3 é verdadeira.'],
      ['Em um SE aninhado por faixas de valor, o ideal é testar primeiro:', 'A faixa mais alta', 'A faixa mais baixa', 'Qualquer ordem', 'Os textos', 'Senão, valores altos caem na primeira faixa baixa que atendem.'],
      ['Qual erro aparece se você escreve =SE(A1>5;Sim;Não) sem aspas?', '#NOME?', '#DIV/0!', '#N/D', '#REF!', 'Sem aspas, o Excel procura nomes chamados Sim e Não.']]);

  lesson('logic', 'E / OU', 'E, OU e NÃO',
    'E é verdadeiro só quando todas as condições são verdadeiras. OU basta uma. NÃO inverte o resultado. Normalmente elas aparecem dentro de um SE.',
    'E é uma porta com duas fechaduras; OU é uma porta com duas chaves possíveis.',
    '=E(cond1; cond2)\n=OU(cond1; cond2)\n=NÃO(cond)\n=SE(E(C2="Vendas";E2<7000);"Elegível";"Não")',
    ['E e OU aceitam várias condições separadas por ;.', 'NÃO(J2="Cancelado") equivale a J2<>"Cancelado".'],
    { p: 'Aprovado com média ≥ 7 e até 10 faltas:', sh: 'Notas', c: 'G2', fill: 6, f: '=SE(E(MÉDIA(B2:D2)>=7;E2<=10);"Aprovado";"Reprovado")', cols: ['A', 'E'], hdr: 'Resultado' },
    ['E com muitas condições: uma falsa já torna tudo falso.', 'Não confunda OU com somar condições: em matrizes dinâmicas, + funciona como OU.', 'NÃO vazio dá erro; sempre passe uma condição.'],
    [['=E(VERDADEIRO;FALSO) resulta em:', 'FALSO', 'VERDADEIRO', '#VALOR!', '1', 'E exige que todas sejam verdadeiras.'],
      ['=OU(FALSO;VERDADEIRO) resulta em:', 'VERDADEIRO', 'FALSO', '0', '#N/D', 'Basta uma condição verdadeira.'],
      ['NÃO(A1>10) é equivalente a:', 'A1<=10', 'A1<10', 'A1>=10', 'A1<>10', 'O contrário de "maior que 10" é "menor ou igual a 10".']]);

  lesson('contse', 'CONT.SE', 'CONT.SE',
    'CONT.SE conta quantas células de um intervalo atendem a um critério. O critério pode ser um texto, um número, uma comparação entre aspas (">=2") ou um curinga ("S*").',
    'É contar quantas pessoas na fila estão de camisa azul.',
    '=CONT.SE(intervalo; critério)\n=CONT.SE(J2:J31;"Cancelado")\n=CONT.SE(G2:G31;">=2")\n=CONT.SE(B2:B16;"S*")\n=CONT.SE($C$2:$C$31;C2)',
    ['* representa qualquer sequência; ? representa um caractere.', 'O texto do critério não diferencia maiúsculas.'],
    { p: 'Quantos pedidos cada vendedor tem:', sh: 'Vendas', c: 'K2', fill: 6, f: '=CONT.SE($C$2:$C$31;C2)', cols: ['A', 'C'], hdr: 'Pedidos' },
    ['Operadores no critério vão entre aspas: ">=2".', 'Para comparar com uma célula, junte: ">="&L1.', 'Trave o intervalo com $ antes de arrastar.'],
    [['Qual critério conta valores maiores que 100?', '">100"', '>100', '"100>"', 'MAIOR(100)', 'Critérios com operador vão entre aspas.'],
      ['=CONT.SE(B2:B10;"A*") conta:', 'Textos que começam com A', 'Textos que terminam com A', 'Células com o texto "A*" literal', 'Células vazias', 'O asterisco é um curinga.'],
      ['Como usar uma célula L1 como limite mínimo no critério?', '">="&L1', '">=L1"', '>=L1', '"L1>="', 'O & junta o operador ao valor da célula.']]);

  lesson('somase', 'SOMASE', 'SOMASE e MÉDIASE',
    'SOMASE soma os valores de um intervalo nas linhas em que outro intervalo atende a um critério. MÉDIASE faz o mesmo calculando a média.',
    'É uma tabela dinâmica de uma linha só: "quanto vendeu a Juliana?".',
    '=SOMASE(intervalo_critério; critério; intervalo_soma)\n=SOMASE(C2:C31;"Juliana";G2:G31)\n=MÉDIASE(C2:C15;"Tecnologia";E2:E15)',
    ['O intervalo do critério e o da soma precisam ter o mesmo tamanho.', 'Sem o 3º argumento, SOMASE soma o próprio intervalo do critério.'],
    { p: 'Unidades vendidas de cada produto:', sh: 'Produtos', c: 'H2', fill: 6, f: '=SOMASE(Vendas!$E$2:$E$31;A2;Vendas!$G$2:$G$31)', cols: ['A', 'B'], hdr: 'Unidades' },
    ['A ordem dos argumentos é diferente da SOMASES: aqui o intervalo da soma vem por último.', 'MÉDIASE sem nenhuma linha atendida gera #DIV/0!.', 'Trave os intervalos com $ para arrastar.'],
    [['Em =SOMASE(C2:C31;"Juliana";G2:G31), o que é somado?', 'Os valores de G nas linhas em que C é "Juliana"', 'Os valores de C', 'A quantidade de "Juliana"', 'Todos os valores de G', 'O 3º argumento é o intervalo somado.'],
      ['O que acontece se o 3º argumento for omitido?', 'Soma o próprio intervalo do critério', 'Dá erro', 'Conta as linhas', 'Soma tudo', 'Útil quando o critério é numérico, como ">100".'],
      ['MÉDIASE sem nenhuma linha que atenda ao critério retorna:', '#DIV/0!', '0', '#N/D', 'Vazio', 'Não há valores para calcular a média.']]);

  lesson('concat', '&', 'Juntando textos: & e CONCAT',
    'O operador & e a função CONCAT juntam textos, números e resultados de outras fórmulas em uma única célula.',
    'É montar uma etiqueta juntando peças: nome, traço, número.',
    '="#"&A2&" - "&C2\n=CONCAT(B2;" (";F2;")")\n="Pedido "&A2&": "&TEXTO(G2*H2;"R$ #.##0,00")',
    ['Espaços e símbolos também precisam estar entre aspas.', 'Para números formatados, combine com TEXTO.'],
    { p: 'Rótulo do pedido:', sh: 'Vendas', c: 'K2', fill: 6, f: '="#"&A2&" - "&C2', cols: ['A', 'C'], hdr: 'Rótulo' },
    ['Datas viram números ao concatenar; use TEXTO(data;"dd/mm/aaaa").', 'Esquecer o espaço entre as partes gera "AnaSouza".', 'CONCATENAR é a versão antiga; CONCAT também aceita intervalos.'],
    [['="Ana"&" "&"Lima" resulta em:', 'Ana Lima', 'AnaLima', 'Ana & Lima', '#VALOR!', 'O " " adiciona o espaço.'],
      ['Ao concatenar uma data diretamente, o Excel mostra:', 'O número serial da data', 'A data formatada', 'Um erro', 'O nome do mês', 'Use TEXTO para formatar.'],
      ['Qual função junta textos e também aceita intervalos inteiros?', 'CONCAT', 'SOMA', 'ESQUERDA', 'LOCALIZAR', 'CONCAT(A2:C2) junta as três células.']]);

  lesson('extract', 'EXT.TEXTO', 'Extraindo partes do texto',
    'ESQUERDA pega caracteres do início, DIREITA do fim e EXT.TEXTO do meio. NÚM.CARACT conta caracteres e LOCALIZAR diz em que posição algo aparece.',
    'É recortar um pedaço de uma frase com a tesoura no lugar certo.',
    '=ESQUERDA(D2;4)\n=DIREITA(D2;4)\n=EXT.TEXTO(D2;2;2)\n=NÚM.CARACT(B2)\n=ESQUERDA(B2;LOCALIZAR(" ";B2)-1)',
    ['EXT.TEXTO(texto; início; quantidade).', 'LOCALIZAR não diferencia maiúsculas; PROCURAR diferencia.'],
    { p: 'DDD sem parênteses:', sh: 'Clientes', c: 'I2', fill: 6, f: '=EXT.TEXTO(D2;2;2)', cols: ['B', 'D'], hdr: 'DDD' },
    ['O resultado é texto, mesmo que pareça número; use VALOR para converter.', 'LOCALIZAR gera #VALOR! quando não encontra.', 'Espaços extras mudam as posições; limpe com ARRUMAR.'],
    [['=ESQUERDA("Excel";2) resulta em:', 'Ex', 'el', 'xc', 'Exc', 'Pega 2 caracteres do início.'],
      ['=EXT.TEXTO("(31) 9999";2;2) resulta em:', '31', '(3', '1)', '99', 'Começa na posição 2 e pega 2 caracteres.'],
      ['Qual função retorna a posição de um texto dentro de outro?', 'LOCALIZAR', 'NÚM.CARACT', 'SUBSTITUIR', 'MUDAR', 'LOCALIZAR(" ";B2) devolve a posição do espaço.']]);

  lesson('clean', 'ARRUMAR', 'Limpando e padronizando textos',
    'MAIÚSCULA, MINÚSCULA e PRI.MAIÚSCULA padronizam letras. ARRUMAR remove espaços extras e SUBSTITUIR troca um trecho por outro.',
    'É passar a limpo um cadastro que cada pessoa preencheu de um jeito.',
    '=MAIÚSCULA(E2)\n=MINÚSCULA(H2)\n=PRI.MAIÚSCULA(B2)\n=ARRUMAR(I2)\n=SUBSTITUIR(H2;"nexus.com";"nexusmarket.com.br")',
    ['As funções podem ser combinadas: =PRI.MAIÚSCULA(ARRUMAR(B2)).', 'SUBSTITUIR diferencia maiúsculas de minúsculas.'],
    { p: 'Nome com a primeira letra de cada palavra em maiúscula:', sh: 'Clientes', c: 'I2', fill: 6, f: '=PRI.MAIÚSCULA(B2)', cols: ['B'], hdr: 'Nome' },
    ['Espaços invisíveis no início fazem PROCV falhar; ARRUMAR resolve.', 'PRI.MAIÚSCULA deixa "Da" e "De" em maiúscula também.', 'Mantenha a coluna original e crie a limpa ao lado.'],
    [['Qual função remove espaços duplicados e das pontas?', 'ARRUMAR', 'LIMPAR.ESPAÇO', 'SUBSTITUIR', 'MINÚSCULA', 'ARRUMAR (TRIM) deixa um espaço entre as palavras.'],
      ['=PRI.MAIÚSCULA("ANA SOUZA") resulta em:', 'Ana Souza', 'ANA SOUZA', 'ana souza', 'Ana souza', 'Primeira letra de cada palavra em maiúscula.'],
      ['SUBSTITUIR diferencia maiúsculas?', 'Sim', 'Não', 'Só com números', 'Só em datas', 'Por isso, combine com MINÚSCULA quando os dados estiverem misturados.']]);

  lesson('dates', 'DATA', 'Datas no Excel',
    'Para o Excel, uma data é um número: a quantidade de dias desde 01/01/1900. Por isso dá para subtrair datas e somar dias. HOJE, ANO, MÊS, DIA, DATA e FIMMÊS trabalham com esses números.',
    'É um contador de dias que começou em 1900; o formato só muda a aparência.',
    '=HOJE()\n=ANO(B2)   =MÊS(B2)   =DIA(B2)\n=DATA(2026;7;10)\n=DIA.DA.SEMANA(B2;2)\n=FIMMÊS(B2;0)',
    ['Subtrair datas dá o número de dias.', 'Nesta plataforma, HOJE() é fixo em 30/06/2026 para que os resultados sejam estáveis.'],
    { p: 'Vencimento no dia 10 do mês seguinte:', sh: 'Vendas', c: 'K2', fill: 6, f: '=DATA(ANO(B2);MÊS(B2)+1;10)', cols: ['A', 'B'], fmt: 'date', hdr: 'Vencimento' },
    ['Se o resultado aparecer como número, formate a célula como data.', 'DATA corrige estouros sozinha: o mês 13 vira janeiro do ano seguinte.', 'DIA.DA.SEMANA com tipo 2 faz a segunda-feira valer 1.'],
    [['Para o Excel, uma data é:', 'Um número de dias contados a partir de 1900', 'Um texto', 'Uma fórmula', 'Uma imagem', 'Por isso dá para somar e subtrair datas.'],
      ['=DATA(2026;13;1) resulta em:', '01/01/2027', 'Erro', '13/01/2026', '01/12/2026', 'O mês 13 passa para janeiro do ano seguinte.'],
      ['Qual função retorna o último dia do mês?', 'FIMMÊS', 'DATAM', 'DIA', 'HOJE', 'FIMMÊS(data;0) devolve o último dia do mesmo mês.']]);

  lesson('datadif', 'DATADIF', 'Diferenças entre datas',
    'DATADIF calcula anos, meses ou dias entre duas datas. DATAM soma meses a uma data e NÚMSEMANA diz a semana do ano.',
    'É a calculadora de "quanto tempo faz" e de "quando vence".',
    '=DATADIF(início; fim; "Y")   anos completos\n=DATADIF(início; fim; "M")   meses\n=DATADIF(início; fim; "YM")  meses além dos anos\n=DATAM(B2;12)\n=NÚMSEMANA(B2)',
    ['A data inicial precisa ser menor que a final.', 'DATADIF não aparece no assistente do Excel, mas funciona.'],
    { p: 'Idade dos funcionários:', sh: 'Funcionários', c: 'J2', fill: 6, f: '=DATADIF(G2;HOJE();"Y")', cols: ['B', 'G'], hdr: 'Idade' },
    ['Inverter as datas gera #NÚM!.', 'Para "X anos e Y meses", junte DATADIF "Y" e "YM" com &.', 'DATAM ajusta o fim do mês: 31/01 + 1 mês vira 28/02.'],
    [['Qual unidade de DATADIF retorna anos completos?', '"Y"', '"A"', '"D"', '"YM"', 'Y = years (anos).'],
      ['=DATAM(DATA(2026;1;31);1) resulta em:', '28/02/2026', '31/02/2026', '01/03/2026', '#NÚM!', 'Fevereiro não tem dia 31; o Excel usa o último dia.'],
      ['O que acontece se a data inicial for maior que a final em DATADIF?', 'Erro #NÚM!', 'Resultado negativo', 'Zero', 'Inverte sozinho', 'A ordem importa.']]);

  lesson('seerro', 'SEERRO', 'Tratando erros com SEERRO',
    'SEERRO calcula uma expressão e, se der qualquer erro, devolve um valor alternativo. É muito usado com PROCV e divisões.',
    'É uma rede de proteção: se a fórmula cair, você escolhe onde ela aterrissa.',
    '=SEERRO(fórmula; valor_se_erro)\n=SEERRO(F2/G2;0)\n=SEERRO(PROCV(A2;tabela;2;0);"Não encontrado")',
    ['Erros comuns: #DIV/0!, #N/D, #VALOR!, #NOME?, #REF!.', 'SENÃODISP trata só o #N/D.'],
    { p: 'Cobertura de estoque sem erro de divisão:', sh: 'Produtos', c: 'H2', fill: 6, f: '=SEERRO(F2/SOMASE(Vendas!$E$2:$E$31;A2;Vendas!$G$2:$G$31);"Sem vendas")', cols: ['B', 'F'], hdr: 'Cobertura' },
    ['SEERRO esconde também erros de digitação; teste a fórmula antes.', 'Prefira um valor alternativo que faça sentido no relatório.', 'Não use SEERRO para mascarar dados errados na origem.'],
    [['O que =SEERRO(10/0;"x") retorna?', 'x', '#DIV/0!', '0', '10', 'A divisão por zero gera erro e SEERRO devolve o alternativo.'],
      ['Qual erro indica valor não encontrado em uma busca?', '#N/D', '#NOME?', '#REF!', '#VALOR!', 'PROCV e CORRESP retornam #N/D quando não acham.'],
      ['Qual o risco de usar SEERRO em tudo?', 'Esconder erros de fórmula que deveriam ser corrigidos', 'Deixar a planilha mais lenta', 'Apagar dados', 'Nenhum', 'Use para casos esperados, não para mascarar erros.']]);

  lesson('procv', 'PROCV', 'PROCV',
    'PROCV procura um valor na primeira coluna de uma tabela e devolve o conteúdo de outra coluna da mesma linha. Com FALSO no último argumento, a busca é exata.',
    'É procurar um nome na lista telefônica e ler o número ao lado.',
    '=PROCV(valor; tabela; nº_coluna; FALSO)\n=PROCV(E2;Produtos!$A$2:$G$16;2;FALSO)',
    ['A coluna de busca precisa ser a primeira da tabela.', 'O nº da coluna conta a partir da primeira coluna da tabela, não da planilha.'],
    { p: 'Nome do produto de cada pedido:', sh: 'Vendas', c: 'K2', fill: 6, f: '=PROCV(E2;Produtos!$A$2:$B$16;2;FALSO)', cols: ['A', 'E'], hdr: 'Produto' },
    ['Esquecer o FALSO faz uma busca aproximada e pode trazer o valor errado.', 'Trave a tabela com $ antes de arrastar.', 'PROCV não busca à esquerda; para isso use PROCX ou ÍNDICE + CORRESP.'],
    [['Em PROCV, a coluna onde o valor é procurado precisa ser:', 'A primeira da tabela', 'A última da tabela', 'Qualquer uma', 'A coluna A da planilha', 'PROCV só procura na primeira coluna.'],
      ['O que o argumento FALSO faz em PROCV?', 'Exige correspondência exata', 'Ignora maiúsculas', 'Retorna o último valor', 'Ordena a tabela', 'Sem ele, a busca é aproximada.'],
      ['Se o valor não existe na tabela, PROCV retorna:', '#N/D', '0', 'Vazio', '#REF!', 'Combine com SEERRO para tratar.']]);

  lesson('procvaprox', 'FAIXAS', 'PROCV por faixas (aproximado)',
    'Com VERDADEIRO (ou omitindo o último argumento), PROCV encontra a maior faixa menor ou igual ao valor. É assim que se aplicam tabelas de comissão, frete e impostos.',
    'É a tabela do imposto de renda: você encontra a faixa em que seu salário cai.',
    '=PROCV(valor; tabela_de_faixas; coluna; VERDADEIRO)\n=PROCV(G2*H2;Faixas!$A$2:$C$5;3;VERDADEIRO)',
    ['A primeira coluna das faixas precisa estar em ordem crescente.', 'Cada linha indica "a partir de" quanto a faixa vale.'],
    { p: 'Nível de comissão pelo valor bruto:', sh: 'Vendas', c: 'K2', fill: 6, f: '=PROCV(G2*H2;Faixas!$A$2:$C$5;3;VERDADEIRO)', cols: ['G', 'H'], hdr: 'Nível' },
    ['Faixas fora de ordem geram resultados errados sem aviso.', 'Valores menores que a primeira faixa retornam #N/D; comece em 0.', 'Documente na planilha o que cada faixa significa.'],
    [['Para PROCV aproximado funcionar, a 1ª coluna da tabela deve estar:', 'Em ordem crescente', 'Em ordem decrescente', 'Sem números', 'Em branco', 'A busca aproximada pressupõe a ordem.'],
      ['Com faixas 0, 3000 e 6000, o valor 4500 cai na faixa:', '3000', '6000', '0', 'Nenhuma', 'É a maior faixa menor ou igual a 4500.'],
      ['Qual último argumento ativa a busca aproximada?', 'VERDADEIRO', 'FALSO', '0', '"aprox"', 'VERDADEIRO (ou omitido) faz a busca por faixa.']]);

  lesson('procx', 'PROCX', 'PROCX',
    'PROCX é a evolução do PROCV: você indica onde procurar e o que devolver, em qualquer direção. Tem argumento para "não encontrado", busca com curinga e busca de baixo para cima.',
    'É um PROCV sem regras: procura em qualquer coluna e traz qualquer outra.',
    '=PROCX(valor; onde_procurar; o_que_devolver; [se_não_achar]; [modo]; [direção])\nmodo 0 exato · -1 exato ou menor · 1 exato ou maior · 2 curinga\ndireção 1 do primeiro · -1 do último',
    ['A busca é exata por padrão.', 'As matrizes de busca e retorno precisam ter o mesmo tamanho.'],
    { p: 'Frete da região do pedido:', sh: 'Vendas', c: 'K2', fill: 6, f: '=PROCX(D2;Regiões!$A$2:$A$6;Regiões!$B$2:$B$6)', cols: ['A', 'D'], fmt: 'money', hdr: 'Frete' },
    ['Use o 4º argumento em vez de envolver tudo com SEERRO.', 'Com direção −1 você pega a última ocorrência.', 'Disponível no Excel 365 e 2021 em diante.'],
    [['Qual vantagem do PROCX sobre o PROCV?', 'Busca em qualquer coluna e devolve qualquer outra, até à esquerda', 'É mais antigo', 'Não precisa de argumentos', 'Só funciona com números', 'Você aponta separadamente onde procurar e o que devolver.'],
      ['Qual argumento define o que mostrar quando nada é encontrado?', 'O 4º (se_não_encontrado)', 'O 2º', 'O 5º', 'O 1º', 'Evita o #N/D.'],
      ['Como buscar a última ocorrência com PROCX?', 'Modo de pesquisa −1', 'Modo de correspondência 2', 'Usando FALSO', 'Ordenando a planilha', 'A direção −1 procura de baixo para cima.']]);

  lesson('indexmatch', 'ÍNDICE', 'ÍNDICE e CORRESP',
    'CORRESP devolve a posição de um valor em uma lista. ÍNDICE devolve o valor de uma posição. Juntos fazem buscas flexíveis em qualquer direção, inclusive por linha e coluna.',
    'CORRESP diz "é o 7º da fila"; ÍNDICE vai até o 7º e pega o que ele tem na mão.',
    '=CORRESP(valor; lista; 0)\n=ÍNDICE(intervalo; linha; [coluna])\n=ÍNDICE(Produtos!$F$2:$F$16;CORRESP(E2;Produtos!$A$2:$A$16;0))',
    ['O 0 em CORRESP pede correspondência exata.', 'Com dois CORRESP você busca na linha e na coluna ao mesmo tempo.'],
    { p: 'Estoque do produto de cada pedido:', sh: 'Vendas', c: 'K2', fill: 6, f: '=ÍNDICE(Produtos!$F$2:$F$16;CORRESP(E2;Produtos!$A$2:$A$16;0))', cols: ['A', 'E'], hdr: 'Estoque' },
    ['Os intervalos de ÍNDICE e CORRESP devem começar na mesma linha.', 'CORRESP sem o 0 faz busca aproximada.', 'É compatível com versões antigas do Excel.'],
    [['O que =CORRESP("C";{"A";"B";"C"};0) retorna?', '3', 'C', '2', '#N/D', 'C está na 3ª posição.'],
      ['ÍNDICE(intervalo; 4) em uma coluna retorna:', 'O 4º valor do intervalo', 'A soma dos 4 primeiros', 'A posição 4 da planilha', 'O 4º maior valor', 'ÍNDICE pega o valor pela posição.'],
      ['Por que ÍNDICE + CORRESP é usado no lugar do PROCV?', 'Permite buscar à esquerda e em duas dimensões', 'É mais curto de escrever', 'Não precisa de dados', 'Ignora erros', 'A coluna de busca não precisa ser a primeira.']]);

  lesson('contses', 'CONT.SES', 'CONT.SES',
    'CONT.SES conta as linhas que atendem a vários critérios ao mesmo tempo, cada um em seu intervalo. Todos os critérios precisam ser verdadeiros (lógica E).',
    'É contar quantas pessoas estão de camisa azul E de tênis branco.',
    '=CONT.SES(intervalo1; critério1; intervalo2; critério2; ...)\n=CONT.SES(D2:D31;"Sudeste";J2:J31;"Entregue")\n=CONT.SES(B2:B31;">="&DATA(2026;1;1);B2:B31;"<="&DATA(2026;3;31))',
    ['O mesmo intervalo pode aparecer duas vezes, para criar um período entre datas.', 'Para lógica OU, some dois CONT.SES.'],
    { p: 'Pedidos entregues no Sudeste:', sh: 'Vendas', c: 'M2', f: '=CONT.SES(D2:D31;"Sudeste";J2:J31;"Entregue")' },
    ['Todos os intervalos precisam ter o mesmo tamanho.', 'Datas no critério: ">="&DATA(...) ou ">="&célula.', 'CONT.SES aceita até 127 pares de critérios.'],
    [['CONT.SES aplica os critérios com lógica:', 'E (todos verdadeiros)', 'OU', 'NÃO', 'XOR', 'Cada linha precisa atender a todos os critérios.'],
      ['Como contar pedidos de um período entre duas datas?', 'Repetindo o intervalo de datas com ">=" e "<="', 'Usando PROCV', 'Com SOMA', 'Com DATADIF', 'Dois critérios no mesmo intervalo criam o período.'],
      ['Como fazer "Sul OU Norte" com CONT.SES?', 'Somando dois CONT.SES', 'Colocando os dois critérios no mesmo CONT.SES', 'Usando ";" no critério', 'Não é possível', 'Os critérios de um CONT.SES são sempre E.']]);

  lesson('somases', 'SOMASES', 'SOMASES e família',
    'SOMASES soma com vários critérios. MÉDIASES, MÁXIMOSES e MÍNIMOSES seguem a mesma estrutura, com o intervalo do resultado vindo primeiro.',
    'É a tabela dinâmica em uma célula: "unidades de Eletrônicos entregues".',
    '=SOMASES(soma; crit_int1; crit1; crit_int2; crit2)\n=SOMASES(G2:G31;F2:F31;"Eletrônicos";J2:J31;"Entregue")\n=MÁXIMOSES(H2:H31;D2:D31;"Sul")',
    ['Atenção: em SOMASES o intervalo da soma vem primeiro; em SOMASE, por último.', 'Critérios aceitam curingas e comparações.'],
    { p: 'Unidades de Eletrônicos entregues:', sh: 'Vendas', c: 'M2', f: '=SOMASES(G2:G31;F2:F31;"Eletrônicos";J2:J31;"Entregue")' },
    ['Trocar a ordem dos argumentos é o erro mais comum.', 'MÉDIASES sem linhas atendidas gera #DIV/0!.', 'Com um critério em forma de lista (ÚNICO), SOMASES devolve vários totais.'],
    [['Em SOMASES, qual é o primeiro argumento?', 'O intervalo a ser somado', 'O primeiro critério', 'O intervalo do critério', 'O nome da planilha', 'É o contrário do SOMASE.'],
      ['Qual função retorna o maior valor que atende a critérios?', 'MÁXIMOSES', 'MAIOR', 'MÁXIMO', 'PROCX', 'MÁXIMOSES(intervalo_max; critérios...).'],
      ['=SOMASES(G:G;C:C;"Ana";D:D;"Sul") soma G quando:', 'C é "Ana" e D é "Sul"', 'C é "Ana" ou D é "Sul"', 'C é "Sul"', 'Sempre', 'Os critérios são combinados com E.']]);

  lesson('ses', 'SES', 'SES, PARÂMETRO e ESCOLHER',
    'SES testa várias condições em ordem e devolve o resultado da primeira verdadeira. PARÂMETRO compara um valor com uma lista de opções. ESCOLHER pega o item de uma lista pela posição.',
    'SES é uma escada de "se"; PARÂMETRO é um cardápio; ESCOLHER é um número de senha.',
    '=SES(cond1; res1; cond2; res2; VERDADEIRO; senão)\n=PARÂMETRO(D2;"Sudeste";"SE";"Sul";"S";"N")\n=ESCOLHER(n; "1º"; "2º"; "3º")',
    ['VERDADEIRO como última condição de SES funciona como "senão".', 'O último argumento ímpar de PARÂMETRO é o valor padrão.'],
    { p: 'Conceito do aluno com SES:', sh: 'Notas', c: 'G2', fill: 6, f: '=SES(MÉDIA(B2:D2)>=9;"A";MÉDIA(B2:D2)>=7;"B";MÉDIA(B2:D2)>=5;"C";VERDADEIRO;"D")', cols: ['A', 'B', 'C', 'D'], hdr: 'Conceito' },
    ['Sem condição verdadeira, SES retorna #N/D.', 'PARÂMETRO compara igualdade; para faixas use SES.', 'ESCOLHER com índice fora da lista gera #VALOR!.'],
    [['Como criar o "senão" em SES?', 'Usando VERDADEIRO como última condição', 'Deixando o último argumento vazio', 'Usando FALSO', 'Não é possível', 'VERDADEIRO sempre é atendido.'],
      ['=ESCOLHER(2;"A";"B";"C") resulta em:', 'B', 'A', 'C', '2', 'Pega o 2º item da lista.'],
      ['Quando PARÂMETRO é melhor que SES?', 'Quando você compara um valor com opções exatas', 'Para faixas de valores', 'Para somar', 'Para buscar em tabelas', 'PARÂMETRO testa igualdade com cada opção.']]);

  lesson('texto', 'TEXTO', 'Formatando com TEXTO',
    'TEXTO transforma um número ou data em texto com o formato que você quiser: moeda, porcentagem, zeros à esquerda, dia, mês e ano.',
    'É imprimir o número com a máscara certa antes de colar numa frase.',
    '=TEXTO(B2;"dd/mm/aaaa")\n=TEXTO(B2;"mmm/aaaa")\n=TEXTO(G2*H2;"R$ #.##0,00")\n=TEXTO(0,153;"0,0%")\n=TEXTO(7;"000")',
    ['dd dia · mm mês · mmm mês abreviado · mmmm mês por extenso · aaaa ano.', '0 obriga um dígito; # mostra se existir.'],
    { p: 'Mês e ano do pedido:', sh: 'Vendas', c: 'K2', fill: 6, f: '=TEXTO(B2;"mmm/aaaa")', cols: ['A', 'B'], hdr: 'Mês/ano' },
    ['O resultado é texto: não dá mais para somar.', 'Use TEXTO só na apresentação, mantendo o número original.', 'Em Excel em inglês, ano é "yyyy"; em português, "aaaa".'],
    [['=TEXTO(DATA(2026;3;5);"dd/mm") resulta em:', '05/03', '5/3', '03/05', '2026-03', 'dd e mm usam dois dígitos.'],
      ['Qual formato mostra 1234,5 como "R$ 1.234,50"?', '"R$ #.##0,00"', '"R$ 0"', '"#,##0.00"', '"moeda"', 'Ponto para milhar e vírgula para decimais.'],
      ['Depois de usar TEXTO, o resultado pode ser somado com SOMA?', 'Não, ele vira texto', 'Sim, normalmente', 'Só se for moeda', 'Só se for data', 'SOMA ignora textos.']]);

  lesson('textjoin', 'UNIRTEXTO', 'UNIRTEXTO, TEXTOANTES, TEXTODEPOIS e VALOR',
    'UNIRTEXTO junta vários valores com um separador e pode ignorar vazios. TEXTOANTES e TEXTODEPOIS cortam o texto em um delimitador. VALOR converte texto numérico em número.',
    'É montar uma lista separada por vírgulas e, no sentido inverso, partir um e-mail no @.',
    '=UNIRTEXTO(", "; VERDADEIRO; intervalo)\n=TEXTOANTES(C2;"@")\n=TEXTODEPOIS(C2;"@")\n=VALOR("31")',
    ['O 2º argumento de UNIRTEXTO decide se ignora células vazias.', 'TEXTOANTES aceita a ocorrência: TEXTOANTES(t;" ";2).'],
    { p: 'Domínio do e-mail de cada cliente:', sh: 'Clientes', c: 'I2', fill: 6, f: '=TEXTODEPOIS(C2;"@")', cols: ['B', 'C'], hdr: 'Domínio' },
    ['TEXTOANTES sem o delimitador no texto gera #N/D.', 'VALOR de um texto não numérico gera #VALOR!.', 'UNIRTEXTO com SE monta listas condicionais.'],
    [['=TEXTOANTES("ana@email.com";"@") resulta em:', 'ana', 'email.com', '@', 'ana@', 'Tudo antes do delimitador.'],
      ['Para que serve o VERDADEIRO em UNIRTEXTO(", ";VERDADEIRO;A1:A5)?', 'Ignorar células vazias', 'Ordenar a lista', 'Remover duplicatas', 'Converter em maiúsculas', 'Evita separadores sobrando.'],
      ['Qual função converte o texto "42" em número?', 'VALOR', 'TEXTO', 'NÚM.CARACT', 'INT', 'VALOR transforma texto numérico em número.']]);

  lesson('workdays', 'DIA ÚTIL', 'Dias úteis',
    'DIATRABALHOTOTAL conta dias úteis entre duas datas, descontando fins de semana e feriados. DIATRABALHO calcula a data após N dias úteis.',
    'É o prazo de entrega que "não conta" sábado, domingo e feriado.',
    '=DIATRABALHOTOTAL(início; fim; [feriados])\n=DIATRABALHO(início; dias; [feriados])\n=DIATRABALHO(B2;5;Feriados!$A$2:$A$8)',
    ['A lista de feriados é um intervalo de datas.', 'DIATRABALHOTOTAL conta as duas pontas, se forem úteis.'],
    { p: 'Previsão de entrega em 5 dias úteis:', sh: 'Vendas', c: 'K2', fill: 6, f: '=DIATRABALHO(B2;5;Feriados!$A$2:$A$8)', cols: ['A', 'B'], fmt: 'date', hdr: 'Entrega' },
    ['Esquecer os feriados superestima o prazo.', 'Trave o intervalo de feriados com $.', 'Para fins de semana diferentes existe DIATRABALHOTOTAL.INTL.'],
    [['DIATRABALHOTOTAL desconta:', 'Sábados, domingos e os feriados informados', 'Só domingos', 'Só feriados', 'Nada', 'Os feriados entram como 3º argumento.'],
      ['Qual função devolve uma data futura contando só dias úteis?', 'DIATRABALHO', 'DATAM', 'HOJE', 'FIMMÊS', 'DIATRABALHO(início; nº de dias; feriados).'],
      ['Como informar os feriados?', 'Em um intervalo de células com datas', 'Digitando os nomes', 'Não é possível', 'Com a função FERIADO', 'Ex.: Feriados!$A$2:$A$8.']]);

  lesson('kpi', 'KPI', 'Indicadores na planilha',
    'Atingimento de meta, participação no total e ticket médio são divisões simples, mas pedem cuidado com a base certa e com o formato de porcentagem.',
    'É a mesma lógica das medidas do Power BI, feita célula a célula.',
    '=Realizado/Meta             atingimento\n=G2/SOMA($G$2:$G$31)        participação\n=faturamento/nº_de_pedidos  ticket médio',
    ['Formate o resultado como % (o valor 0,85 aparece como 85%).', 'Trave o total com $ na participação.'],
    { p: 'Atingimento da meta mensal:', sh: 'Metas', c: 'E2', fill: 6, f: '=D2/C2', cols: ['A', 'C', 'D'], fmt: 'pct', hdr: 'Atingimento' },
    ['Média de percentuais é diferente do percentual total.', 'Divisões por meta zero geram #DIV/0!.', 'Deixe claro no relatório quais pedidos entram no total.'],
    [['Realizado 900 e meta 1.200 dão atingimento de:', '75%', '133%', '25%', '90%', '900 ÷ 1200 = 0,75.'],
      ['Na participação =G2/SOMA($G$2:$G$31), por que travar o total?', 'Para o denominador não mudar ao arrastar', 'Para somar mais rápido', 'Para formatar como %', 'Não precisa travar', 'Todas as linhas dividem pelo mesmo total.'],
      ['Ticket médio é:', 'Faturamento ÷ número de pedidos', 'Maior pedido', 'Faturamento × pedidos', 'Número de clientes', 'É o valor médio por pedido.']]);

  lesson('filtro', 'FILTRO', 'FILTRO (matriz dinâmica)',
    'FILTRO devolve todas as linhas que atendem a uma condição, e o resultado "despeja" sozinho nas células ao redor. Multiplicar condições faz E; somar faz OU.',
    'É um filtro automático que nunca fica desatualizado.',
    '=FILTRO(matriz; condição; [se_vazio])\n=FILTRO(A2:C31;D2:D31="Sul")\n=FILTRO(A2:C31;(D2:D31="Sudeste")*(J2:J31="Entregue"))\n=FILTRO(A2:D31;(D2:D31="Norte")+(D2:D31="Nordeste"))',
    ['As células de destino precisam estar vazias; senão aparece #DESPEJAR!.', 'O 3º argumento evita o #CALC! quando nada é encontrado.'],
    { p: 'Pedidos da região Sul:', sh: 'Vendas', c: 'M2', f: '=FILTRO(A2:C31;D2:D31="Sul")', sf: ['', 'date', ''] },
    ['Não use E() e OU() dentro de FILTRO; use * e +.', 'A condição precisa ter o mesmo número de linhas da matriz.', 'Disponível no Excel 365 e 2021.'],
    [['Em FILTRO, como combinar duas condições com E?', 'Multiplicando: (cond1)*(cond2)', 'Usando E(cond1;cond2)', 'Somando: (cond1)+(cond2)', 'Separando por ;', 'O produto só é 1 quando as duas são verdadeiras.'],
      ['O que o 3º argumento de FILTRO faz?', 'Define o que mostrar se nada for encontrado', 'Ordena o resultado', 'Limita as linhas', 'Escolhe as colunas', 'Evita o erro #CALC!.'],
      ['Qual erro aparece se houver dados no caminho do resultado?', '#DESPEJAR!', '#N/D', '#REF!', '#NOME?', 'A matriz dinâmica precisa de espaço livre.']]);

  lesson('sort', 'CLASSIFICAR', 'CLASSIFICAR e CLASSIFICARPOR',
    'CLASSIFICAR ordena uma matriz por uma de suas colunas. CLASSIFICARPOR ordena uma matriz usando outra matriz como critério, mesmo que ela não apareça no resultado.',
    'É a classificação do Excel, mas viva: muda sozinha quando os dados mudam.',
    '=CLASSIFICAR(matriz; [coluna]; [1 cresc. / -1 decresc.])\n=CLASSIFICAR(B2:D16;3;-1)\n=CLASSIFICARPOR(B2:B15;E2:E15;-1)\n=CLASSIFICAR(FILTRO(...);4;-1)',
    ['O índice da coluna é relativo à matriz, não à planilha.', 'Funções dinâmicas podem ser aninhadas: CLASSIFICAR(FILTRO(...)).'],
    { p: 'Produtos do mais caro para o mais barato:', sh: 'Produtos', c: 'I2', f: '=CLASSIFICAR(B2:D16;3;-1)', sf: ['', '', 'money'] },
    ['Esquecer o −1 deixa a ordem crescente.', 'CLASSIFICARPOR exige que a matriz de critério tenha o mesmo número de linhas.', 'Os dados originais não são alterados.'],
    [['=CLASSIFICAR(B2:D16;3;-1) ordena por:', 'A 3ª coluna do intervalo, em ordem decrescente', 'A coluna C da planilha, crescente', 'A linha 3', 'A coluna D, crescente', 'O índice conta dentro da matriz.'],
      ['Qual a diferença de CLASSIFICARPOR?', 'O critério pode ser outra matriz que não aparece no resultado', 'Só ordena textos', 'Remove duplicatas', 'Não aceita ordem decrescente', 'Ordena nomes pelo salário, por exemplo.'],
      ['Os dados originais mudam de ordem ao usar CLASSIFICAR?', 'Não, o resultado é uma cópia ordenada', 'Sim', 'Só se houver filtro', 'Só em tabelas', 'A fórmula gera uma nova matriz.']]);

  lesson('unique', 'ÚNICO', 'ÚNICO',
    'ÚNICO devolve a lista de valores sem repetição. Combinado com CLASSIFICAR cria listas ordenadas; com CONT.VALORES conta itens distintos; com SOMASES gera totais por item.',
    'É o "Remover duplicatas" que se atualiza sozinho.',
    '=ÚNICO(D2:D31)\n=CLASSIFICAR(ÚNICO(C2:C31))\n=CONT.VALORES(ÚNICO(F2:F31))\n=SOMASES(G2:G31;D2:D31;ÚNICO(D2:D31))',
    ['O 3º argumento VERDADEIRO traz só os que aparecem uma única vez.', 'Funciona com várias colunas: combinações únicas.'],
    { p: 'Regiões atendidas, sem repetição:', sh: 'Vendas', c: 'M2', f: '=ÚNICO(D2:D31)' },
    ['ÚNICO não diferencia maiúsculas.', 'Espaços extras criam "duplicatas" diferentes; limpe com ARRUMAR antes.', 'A ordem é a da primeira aparição; use CLASSIFICAR para ordenar.'],
    [['O que =ÚNICO(D2:D31) retorna?', 'A lista de valores sem repetição', 'O número de valores', 'Os valores repetidos', 'O primeiro valor', 'Cada valor aparece uma vez.'],
      ['Como contar quantos valores distintos há em uma coluna?', '=CONT.VALORES(ÚNICO(coluna))', '=ÚNICO(CONT(coluna))', '=CONT.SE(coluna;"único")', '=SOMA(ÚNICO(coluna))', 'Conte os itens da lista única.'],
      ['Em que ordem ÚNICO devolve os valores?', 'Na ordem da primeira aparição', 'Alfabética', 'Decrescente', 'Aleatória', 'Para ordenar, use CLASSIFICAR(ÚNICO(...)).']]);

  lesson('sequence', 'SEQUÊNCIA', 'SEQUÊNCIA',
    'SEQUÊNCIA gera uma lista de números em linhas e colunas, com início e passo definidos. Como datas são números, também gera calendários.',
    'É o preenchimento automático (arrastar 1, 2, 3...) em forma de fórmula.',
    '=SEQUÊNCIA(linhas; [colunas]; [início]; [passo])\n=SEQUÊNCIA(12)\n=SEQUÊNCIA(7;1;DATA(2026;7;1))\n=SEQUÊNCIA(5;1;0;10)',
    ['Formate como data quando gerar datas.', 'Combine com outras funções para criar listas dinâmicas.'],
    { p: 'Os 7 primeiros dias de julho:', sh: 'Vendas', c: 'M2', f: '=SEQUÊNCIA(7;1;DATA(2026;7;1))', fmt: 'date' },
    ['O resultado ocupa várias células; deixe espaço livre.', 'O passo pode ser negativo para contagem regressiva.', 'SEQUÊNCIA(3;4) gera 3 linhas e 4 colunas.'],
    [['=SEQUÊNCIA(3) gera:', '1, 2 e 3 em linhas', 'O número 3', '3, 2 e 1', 'Três colunas vazias', 'Por padrão começa em 1 com passo 1.'],
      ['Como gerar 0, 10, 20, 30, 40?', '=SEQUÊNCIA(5;1;0;10)', '=SEQUÊNCIA(40;10)', '=SEQUÊNCIA(0;40;10)', '=SEQUÊNCIA(10;5)', 'Linhas = 5, colunas = 1, início = 0, passo = 10.'],
      ['Por que SEQUÊNCIA consegue gerar datas?', 'Porque datas são números no Excel', 'Porque tem um modo de calendário', 'Não consegue', 'Só com TEXTO', 'Cada passo de 1 é um dia.']]);

  lesson('let', 'LET', 'LET: variáveis na fórmula',
    'LET dá nome a resultados intermediários dentro de uma fórmula. Você calcula uma vez e reutiliza, o que deixa a fórmula mais legível e mais rápida.',
    'É escrever as contas de rascunho com nomes antes de dar a resposta final.',
    '=LET(nome1; valor1; nome2; valor2; cálculo_final)\n=LET(lucro;D2-E2;lucro/D2)\n=LET(m;MÉDIA(B2:D2);SE(m>=7;"Aprovado";"Reprovado"))',
    ['Os nomes não vão entre aspas.', 'O último argumento é sempre o cálculo que será exibido.'],
    { p: 'Margem do produto com LET:', sh: 'Produtos', c: 'H2', fill: 6, f: '=LET(lucro;D2-E2;lucro/D2)', cols: ['B', 'D', 'E'], fmt: 'pct', hdr: 'Margem' },
    ['Não use nomes que pareçam referências de célula (como AB1).', 'O número de argumentos é sempre ímpar.', 'Ótimo para fórmulas que repetem o mesmo cálculo várias vezes.'],
    [['Em =LET(x;10;x*2), o resultado é:', '20', '10', 'x*2', '#NOME?', 'x vale 10 e o cálculo final é x*2.'],
      ['Qual é o último argumento de LET?', 'O cálculo final que será exibido', 'O primeiro nome', 'Um valor padrão', 'O formato', 'Os pares nome; valor vêm antes.'],
      ['Uma vantagem de LET é:', 'Calcular uma vez e reutilizar o resultado', 'Formatar datas', 'Proteger a planilha', 'Criar gráficos', 'Evita repetir a mesma expressão.']]);

  lesson('sumproduct', 'SOMARPRODUTO', 'SOMARPRODUTO',
    'SOMARPRODUTO multiplica matrizes item a item e soma o resultado. Com condições multiplicadas, vira uma soma condicional com qualquer cálculo.',
    'É calcular o valor de cada linha e somar tudo, sem coluna auxiliar.',
    '=SOMARPRODUTO(G2:G31;H2:H31)\n=SOMARPRODUTO(G2:G31;H2:H31;1-I2:I31)\n=SOMARPRODUTO((J2:J31="Entregue")*G2:G31*H2:H31)',
    ['As matrizes precisam ter o mesmo tamanho.', 'Uma condição (VERDADEIRO/FALSO) multiplicada vira 1 ou 0.'],
    { p: 'Valor total do estoque (preço × estoque):', sh: 'Produtos', c: 'I2', f: '=SOMARPRODUTO(D2:D16;F2:F16)', fmt: 'money' },
    ['Tamanhos diferentes geram #VALOR!.', 'Uma condição sozinha como argumento separado não vira número; multiplique.', 'Útil para médias ponderadas.'],
    [['=SOMARPRODUTO({1;2};{3;4}) resulta em:', '11', '10', '24', '7', '1×3 + 2×4 = 11.'],
      ['Como somar só os pedidos entregues com SOMARPRODUTO?', 'Multiplicando por (J2:J31="Entregue")', 'Usando SE fora da função', 'Usando ÚNICO', 'Não é possível', 'A condição vira 1 ou 0.'],
      ['Se as matrizes tiverem tamanhos diferentes:', 'Gera #VALOR!', 'Ignora as sobras', 'Retorna 0', 'Repete a menor', 'Os tamanhos precisam bater.']]);

  lesson('stats', 'MED', 'Estatística descritiva',
    'Além da média, a mediana (MED) mostra o valor do meio, a moda (MODO) o mais frequente, DESVPAD e VAR medem a dispersão, PERCENTIL e QUARTIL cortam a distribuição e CORREL mede a relação entre duas variáveis.',
    'É descrever uma turma: nota típica, nota mais comum, quão espalhadas estão e se faltar tem a ver com a nota.',
    '=MED(E2:E15)\n=MODO(G2:G31)\n=DESVPAD.A(B2:B16)\n=PERCENTIL(E2:E15;0,9)\n=QUARTIL(D2:D16;3)\n=CORREL(E2:E16;B2:B16)',
    ['.A indica amostra; .P indica população inteira.', 'CORREL vai de −1 a 1.'],
    { p: 'Mediana dos salários:', sh: 'Funcionários', c: 'K2', f: '=MED(E2:E15)', fmt: 'money' },
    ['A média é sensível a valores extremos; a mediana não.', 'MODO sem valores repetidos gera #N/D.', 'Correlação não prova causa.'],
    [['Qual medida é menos afetada por salários muito altos?', 'Mediana (MED)', 'Média', 'Máximo', 'Soma', 'A mediana é o valor central.'],
      ['CORREL próximo de −1 indica:', 'Relação inversa forte', 'Nenhuma relação', 'Relação direta forte', 'Erro', 'Quando uma sobe, a outra desce.'],
      ['QUARTIL(intervalo;3) equivale a:', 'Percentil 75', 'Percentil 30', 'Mediana', 'Máximo', 'O 3º quartil corta 75% dos dados.']]);

  lesson('rank', 'ORDEM', 'Rankings: ORDEM, MAIOR e MENOR',
    'ORDEM devolve a posição de um valor em uma lista. MAIOR e MENOR trazem o k-ésimo maior ou menor valor. Com CONT.SE dá para desempatar posições.',
    'É o pódio: quem está em 1º, 2º, 3º.',
    '=ORDEM(E2;$E$2:$E$15)        1 = maior\n=ORDEM(E2;$E$2:$E$15;1)      1 = menor\n=MAIOR(D2:D16;2)\n=MENOR(D2:D16;3)\n=ORDEM(...)+CONT.SE($E$2:E2;E2)-1',
    ['Valores iguais recebem a mesma posição em ORDEM.', 'MAIOR(intervalo;1) é o mesmo que MÁXIMO.'],
    { p: 'Posição de cada salário:', sh: 'Funcionários', c: 'J2', fill: 6, f: '=ORDEM(E2;$E$2:$E$15)', cols: ['B', 'E'], hdr: 'Posição' },
    ['Trave o intervalo do ranking com $.', 'k maior que a quantidade de valores gera #NÚM!.', 'O desempate com CONT.SE usa um intervalo que cresce.'],
    [['=MAIOR({5;9;7};2) resulta em:', '7', '9', '5', '2', 'O 2º maior é 7.'],
      ['ORDEM com o 3º argumento igual a 1 classifica:', 'Do menor para o maior', 'Do maior para o menor', 'Em ordem alfabética', 'Aleatoriamente', '1 é ordem crescente.'],
      ['Valores iguais em ORDEM recebem:', 'A mesma posição', 'Posições consecutivas', 'Erro', 'Zero', 'Por isso existe o desempate com CONT.SE.']]);

  lesson('finance', 'PGTO', 'Matemática financeira',
    'PGTO calcula a parcela de um financiamento, VF o valor futuro de aportes e VP quanto vale hoje uma série de pagamentos. A taxa e o prazo precisam estar na mesma unidade (mensal com mensal).',
    'É o simulador do banco dentro da planilha.',
    '=PGTO(taxa; nper; vp)\n=VF(taxa; nper; pgto)\n=VP(taxa; nper; pgto)\n=VP0*(1+taxa)^n     juros compostos',
    ['Saídas de dinheiro são negativas: use −B2 para a parcela sair positiva.', 'Taxa de 1,5% ao mês = 0,015.'],
    { p: 'Parcela de R$ 30.000 a 1,5% ao mês em 24 meses:', sh: 'Simulação', c: 'D2', f: '=PGTO(B3;B4;-B2)', fmt: 'money' },
    ['Misturar taxa anual com prazo mensal dá resultados errados.', 'Sinais trocados geram parcelas negativas.', 'Juros totais = parcela × prazo − valor financiado.'],
    [['Qual função calcula a parcela de um financiamento?', 'PGTO', 'VF', 'VP', 'TAXA', 'PGTO = pagamento periódico.'],
      ['Com taxa mensal, o prazo deve estar em:', 'Meses', 'Anos', 'Dias', 'Tanto faz', 'Unidades precisam combinar.'],
      ['Por que se usa −B2 em =PGTO(B3;B4;-B2)?', 'Para a parcela sair como valor positivo', 'Para dar desconto', 'Para converter em porcentagem', 'É obrigatório no Excel', 'O Excel trata entradas e saídas com sinais opostos.']]);

  lesson('analysis', 'ABC', 'Acumulados, médias móveis e curva ABC',
    'Análises de negócio combinam funções simples: SOMA com início travado gera acumulado, MÉDIA de uma janela que desliza gera média móvel e comparar com o k-ésimo maior valor classifica a curva ABC.',
    'É transformar uma lista de números em uma história: crescimento, tendência e prioridades.',
    '=SOMA($G$2:G2)          acumulado\n=MÉDIA(G2:G4)           média móvel (arrastada)\n=SE(v>=MAIOR(lista;3);"A";...)   classe ABC',
    ['A média móvel começa na 3ª linha quando a janela é de 3.', 'Na curva ABC, os poucos itens A concentram a maior parte do valor.'],
    { p: 'Unidades acumuladas ao longo dos pedidos:', sh: 'Vendas', c: 'K2', fill: 6, f: '=SOMA($G$2:G2)', cols: ['A', 'G'], hdr: 'Acumulado' },
    ['Travar o início errado gera somas que não crescem.', 'Ordene os dados por data antes de acumular.', 'Documente o critério da curva ABC usado.'],
    [['Ao arrastar =SOMA($G$2:G2) até a linha 5, a fórmula na linha 5 é:', '=SOMA($G$2:G5)', '=SOMA($G$5:G5)', '=SOMA(G2:G5)', '=SOMA($G$2:G2)', 'Só o fim do intervalo acompanha.'],
      ['Uma média móvel de 3 períodos na linha 10 usa:', 'As linhas 8, 9 e 10', 'As linhas 1 a 10', 'Só a linha 10', 'As linhas 10, 11 e 12', 'A janela termina na linha atual.'],
      ['Na curva ABC, os itens A são:', 'Os poucos itens de maior valor', 'Os itens mais baratos', 'Os itens sem estoque', 'Todos os itens', 'Concentram a maior parte do valor.']]);

  lesson('multilookup', '2 CRITÉRIOS', 'Busca com dois critérios',
    'Para buscar por duas condições, multiplique as comparações: o resultado é uma lista de 1 e 0, e você procura o número 1 com PROCX ou CORRESP.',
    'É procurar na lista alguém que seja, ao mesmo tempo, da cidade X e do cargo Y.',
    '=PROCX(1;(A2:A13="Diego")*(B2:B13=DATA(2026;6;1));D2:D13)\n=ÍNDICE(C2:C13;CORRESP(1;(A2:A13="Bianca")*(B2:B13=mês);0))',
    ['A multiplicação de VERDADEIRO × VERDADEIRO dá 1.', 'Funciona com quantas condições forem necessárias.'],
    { p: 'Realizado do Diego em junho:', sh: 'Metas', c: 'F2', f: '=PROCX(1;(A2:A13="Diego")*(B2:B13=DATA(2026;6;1));D2:D13)', fmt: 'money' },
    ['Os intervalos de todas as condições precisam ter o mesmo tamanho.', 'Se nenhuma linha atende, o resultado é #N/D.', 'Em versões antigas, a fórmula com CORRESP precisa de Ctrl+Shift+Enter.'],
    [['Em (A2:A13="Diego")*(B2:B13=X), uma linha que atende às duas condições vale:', '1', '0', 'VERDADEIRO', '2', 'VERDADEIRO × VERDADEIRO = 1.'],
      ['Nessa técnica, o PROCX procura qual valor?', '1', '0', 'VERDADEIRO', 'O nome', 'A linha que atende tem valor 1.'],
      ['Se nenhuma linha atender às duas condições:', 'Retorna #N/D', 'Retorna 0', 'Retorna a primeira linha', 'Retorna vazio', 'Use o argumento "se não encontrado" para tratar.']]);

  lesson('final', 'DESAFIO', 'Fórmulas que respondem perguntas de negócio',
    'Perguntas como "quem vendeu mais?" combinam várias funções: ÚNICO lista os candidatos, SOMASES calcula os totais, MÁXIMO acha o maior e ÍNDICE + CORRESP traz o nome. LET organiza tudo em etapas.',
    'É um mini relatório inteiro em uma única célula.',
    '=LET(v; ÚNICO(nomes);\n     t; SOMASES(valores; nomes; v);\n     ÍNDICE(v; CORRESP(MÁXIMO(t); t; 0)))',
    ['Monte a fórmula por partes e teste cada uma antes de juntar.', 'Nomeie as etapas de forma clara.'],
    { p: 'Unidades por região, numa só fórmula:', sh: 'Vendas', c: 'M2', f: '=SOMASES(G2:G31;D2:D31;ÚNICO(D2:D31))' },
    ['Fórmulas longas sem LET ficam difíceis de manter.', 'Valide o resultado com um filtro manual.', 'Matrizes dinâmicas exigem Excel 365 ou 2021.'],
    [['Para descobrir o vendedor com maior total, a sequência é:', 'ÚNICO, SOMASES, MÁXIMO, ÍNDICE + CORRESP', 'PROCV, SOMA, SE', 'CONT.SE, TEXTO, FILTRO', 'ARRED, MOD, INT', 'Lista, totaliza, acha o maior e devolve o nome.'],
      ['Qual função organiza etapas com nomes dentro da fórmula?', 'LET', 'SES', 'TEXTO', 'ESCOLHER', 'LET cria variáveis.'],
      ['Uma boa prática ao montar fórmulas complexas é:', 'Testar cada parte separadamente antes de juntar', 'Escrever tudo de uma vez', 'Usar SEERRO em tudo', 'Evitar referências', 'Assim fica fácil achar o erro.']]);

  /* ------------------------- Tópico → aula ------------------------- */
  const MAP = {
    'Operações': 'refs', 'Parênteses': 'refs', 'Porcentagem': 'refs', 'Referência absoluta': 'absref',
    'SOMA': 'basicfn', 'MÉDIA': 'basicfn', 'MÁXIMO e MÍNIMO': 'basicfn', 'CONT.NÚM': 'basicfn', 'CONT.VALORES': 'basicfn',
    'ARRED': 'round', 'MOD': 'round', 'INT': 'round', 'ARREDONDAR.PARA.CIMA': 'round', 'ARREDONDAR.PARA.BAIXO': 'round',
    'SE': 'se', 'SE com cálculo': 'se', 'SE aninhado': 'se', 'SE com datas': 'se',
    'E': 'logic', 'OU': 'logic', 'NÃO': 'logic', 'SE + E': 'logic',
    'CONT.SE': 'contse', 'CONT.SE curinga': 'contse', 'CONT.SE com critério dinâmico': 'contse',
    'SOMASE': 'somase', 'MÉDIASE': 'somase', 'SOMASE com critério dinâmico': 'somase', 'SOMASE por linha': 'somase',
    '& (concatenar)': 'concat', 'CONCAT': 'concat', 'TEXTO + &': 'concat',
    'ESQUERDA': 'extract', 'DIREITA': 'extract', 'EXT.TEXTO': 'extract', 'NÚM.CARACT': 'extract', 'LOCALIZAR + ESQUERDA': 'extract', 'Validação de texto': 'extract',
    'MAIÚSCULA': 'clean', 'MINÚSCULA': 'clean', 'PRI.MAIÚSCULA': 'clean', 'ARRUMAR': 'clean', 'SUBSTITUIR': 'clean',
    'HOJE': 'dates', 'ANO': 'dates', 'MÊS': 'dates', 'DATA': 'dates', 'DIA.DA.SEMANA': 'dates', 'FIMMÊS': 'dates',
    'DATADIF': 'datadif', 'DATAM': 'datadif', 'NÚMSEMANA': 'datadif',
    'SEERRO': 'seerro', 'SEERRO + PROCV': 'seerro',
    'PROCV': 'procv', 'PROCV + cálculo': 'procv', 'PROCV aproximado': 'procvaprox', 'Desafio do nível': 'procvaprox',
    'PROCX': 'procx', 'PROCX com curinga': 'procx', 'PROCX não encontrado': 'procx', 'PROCX de baixo para cima': 'procx',
    'CORRESP': 'indexmatch', 'ÍNDICE + CORRESP': 'indexmatch', 'ÍNDICE 2D': 'indexmatch',
    'CONT.SES': 'contses', 'CONT.SES com datas': 'contses',
    'SOMASES': 'somases', 'SOMASES com datas': 'somases', 'MÉDIASES': 'somases', 'MÁXIMOSES': 'somases', 'MÍNIMOSES': 'somases',
    'SES': 'ses', 'PARÂMETRO': 'ses', 'ESCOLHER': 'ses',
    'TEXTO': 'texto', 'UNIRTEXTO': 'textjoin', 'TEXTOANTES': 'textjoin', 'TEXTODEPOIS': 'textjoin', 'VALOR': 'textjoin',
    'DIATRABALHOTOTAL': 'workdays', 'DIATRABALHO': 'workdays',
    'Percentual da meta': 'kpi', 'Atingimento': 'kpi', 'Participação %': 'kpi', 'Ticket médio': 'kpi',
    'FILTRO': 'filtro', 'FILTRO com E': 'filtro', 'FILTRO com OU': 'filtro', 'FILTRO vazio': 'filtro', 'FILTRO + MAIOR': 'filtro',
    'CLASSIFICAR': 'sort', 'CLASSIFICARPOR': 'sort', 'CLASSIFICAR + FILTRO': 'sort', 'Relatório dinâmico': 'sort',
    'ÚNICO': 'unique', 'ÚNICO + CLASSIFICAR': 'unique', 'Contagem distinta': 'unique', 'ÚNICO + SOMASES': 'unique',
    'SEQUÊNCIA': 'sequence', 'SEQUÊNCIA de datas': 'sequence',
    'LET': 'let', 'LET + SE': 'let', 'Datas com LET': 'let',
    'SOMARPRODUTO': 'sumproduct', 'SOMARPRODUTO condicional': 'sumproduct',
    'MED': 'stats', 'MODO': 'stats', 'DESVPAD': 'stats', 'VAR': 'stats', 'PERCENTIL': 'stats', 'QUARTIL': 'stats', 'CORREL': 'stats',
    'ORDEM': 'rank', 'MAIOR': 'rank', 'MENOR': 'rank', 'Ranking com desempate': 'rank',
    'PGTO': 'finance', 'VF': 'finance', 'VP': 'finance', 'Juros compostos': 'finance',
    'Acumulado': 'analysis', 'Média móvel': 'analysis', 'Curva ABC': 'analysis',
    'PROCX com dois critérios': 'multilookup', 'ÍNDICE + CORRESP com dois critérios': 'multilookup',
    'Desafio final': 'final',
  };

  /* ---------------------- Realce e mini planilha ---------------------- */
  function highlightFormula(code) {
    const esc = global.UI ? global.UI.esc : function (s) { return s; };
    return String(code).split(/("(?:[^"]|"")*")/g).map(function (part, i) {
      if (i % 2) return '<span class="t-str">' + esc(part) + '</span>';
      return esc(part)
        .replace(/((?:'[^']+'|[A-Za-zÀ-ÿ_]+)!)?\$?[A-Z]{1,3}\$?\d+(?::\$?[A-Z]{1,3}\$?\d+)?|(?:[A-Za-zÀ-ÿ_]+!)?\$?[A-Z]{1,3}:\$?[A-Z]{1,3}(?![\wÀ-ÿ(])/g, '<span class="t-ref">$&</span>')
        .replace(/([A-Za-zÀ-ÿ.]{2,})(?=\()/g, '<span class="t-kw">$1</span>')
        .replace(/(^|[^\w$>])(\d+(?:,\d+)?)(?![\w<])/g, '$1<span class="t-num">$2</span>');
    }).join('');
  }
  /** Renderiza o resultado do exemplo como mini planilha. */
  function sheetPreview(ex) {
    const X = global.ExcelEngine, D = global.ExcelData, esc = global.UI.esc;
    let r;
    try { r = X.run(D, ex.sh, ex.c, ex.f, ex.fill || 0); }
    catch (e) { return { html: '<p class="muted">' + esc(e.msg || 'Erro') + '</p>', speech: '' }; }
    const sheet = D[ex.sh], fmts = sheet.formats || {};
    const at = ex.c.match(/^([A-Z]+)(\d+)$/), startRow = +at[2];
    if (ex.fill) {
      const cols = ex.cols || [];
      const head = '<tr><th class="plain rn">#</th>' + cols.map(function (c) { return '<th class="plain">' + esc(sheet.cols[X.colNum(c) - 1]) + '</th>'; }).join('') + '<th class="plain res">' + esc(at[1] + ' · ' + (ex.hdr || 'Resultado')) + '</th></tr>';
      const rows = r.values.slice(0, 5).map(function (v, i) {
        const row = startRow + i, data = sheet.rows[row - 2];
        return '<tr><td class="rn">' + row + '</td>' + cols.map(function (c) { return '<td>' + esc(X.display(data[X.colNum(c) - 1], fmts[c])) + '</td>'; }).join('') + '<td class="res">' + esc(X.display(v[0], ex.fmt)) + '</td></tr>';
      }).join('');
      return { html: '<div class="dt"><div class="dt-scroll"><table class="xl-mini"><thead>' + head + '</thead><tbody>' + rows + '</tbody></table></div></div><p class="muted sm">Fórmula arrastada até a linha ' + ex.fill + '. Mostrando as 5 primeiras.</p>',
        speech: 'A fórmula foi calculada agora mesmo na planilha ' + ex.sh + ' e arrastada para baixo.' };
    }
    if (r.values.length === 1 && r.values[0].length === 1) {
      return { html: '<div class="xl-single"><span class="xl-cell">' + esc(ex.c) + '</span><b>' + esc(X.display(r.values[0][0], ex.fmt)) + '</b></div>',
        speech: 'O resultado calculado agora mesmo na planilha é ' + X.display(r.values[0][0], ex.fmt) + '.' };
    }
    const sf = ex.sf || [];
    const rows = r.values.slice(0, 6).map(function (row) { return '<tr>' + row.map(function (v, j) { return '<td>' + esc(X.display(v, sf[j] || ex.fmt)) + '</td>'; }).join('') + '</tr>'; }).join('');
    return { html: '<div class="dt"><div class="dt-scroll"><table class="xl-mini"><tbody>' + rows + '</tbody></table></div></div><p class="muted sm">A matriz se espalhou em ' + r.values.length + ' linha(s) a partir de ' + esc(ex.c) + '.</p>',
      speech: 'O resultado se espalhou em ' + r.values.length + ' linhas a partir da célula ' + ex.c + '.' };
  }

  function register() {
    if (!global.Lessons || !global.Lessons.registerPack) return;
    global.Lessons.registerPack('excel', {
      LESSONS: L, MAP: MAP, fallback: 'refs', goalLabel: 'Objetivo da fórmula',
      codeHtml: highlightFormula,
      solution: function (ex) { return { label: 'Fórmula em ' + ex.sh + '!' + ex.c + (ex.fill ? ', arrastada até a linha ' + ex.fill : ''), code: ex.q, speech: 'A fórmula foi digitada na célula ' + ex.c + ' da planilha ' + ex.sh + '. Repare na estrutura no código.' }; },
      example: function (les) {
        const pv = sheetPreview(les.exemplo);
        return { code: les.exemplo.f, badge: 'Calculado agora na planilha ' + les.exemplo.sh, liveHtml: pv.html, speech: pv.speech };
      },
      tags: function (ex) { return [{ icon: 'table', label: ex.sh }, { icon: 'code', label: ex.fill ? ex.c + ' até ' + ex.c.replace(/\d+/, '') + ex.fill : ex.c }]; },
    });
  }
  register();
  global.ExcelLessons = { LESSONS: L, MAP: MAP, highlightFormula: highlightFormula, sheetPreview: sheetPreview };
})(typeof window !== 'undefined' ? window : globalThis);
