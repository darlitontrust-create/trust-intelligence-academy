/* =====================================================================
   ss-exercises.js — 150 casos da trilha de Lean Six Sigma (50 por nível)
   ---------------------------------------------------------------------
   Mesmos tipos da Gestão (a tela de prática é a mesma):
     choice (opts[0] é a correta) · multi (ok = índices) · order (itens na
     ordem certa) · classify (items: [texto, categoria]) · calc (a, unit,
     dec, tol). Campos: t tópico · n título · s cenário · g missão ·
     x explicação · h dica · d figura (GQCharts) · w motivos das erradas.
   Etapas (posições 1–17, 18–34 e 35–50 de cada nível):
     1.1 White Belt · 1.2 e 1.3 Yellow Belt · 2.1 Measure · 2.2 Analyze ·
     2.3 Improve e Control · 3.1 Estatística · 3.2 Experimentos · 3.3 Liderança
   As respostas de cálculo vêm dos dados (SSData) via GQCharts.calc.
   ===================================================================== */
(function (global) {
  'use strict';
  const D = global.SSData, C = global.GQCharts.calc, r = global.GQCharts.round, f = global.GQCharts.fmt;

  const Q = function (t, n, s, g, opts, x, o) { return Object.assign({ kind: 'choice', t: t, n: n, s: s, g: g, opts: opts, x: x }, o || {}); };
  const M = function (t, n, s, g, opts, ok, x, o) { return Object.assign({ kind: 'multi', t: t, n: n, s: s, g: g, opts: opts, ok: ok, x: x }, o || {}); };
  const O = function (t, n, s, g, items, x, o) { return Object.assign({ kind: 'order', t: t, n: n, s: s, g: g, items: items, x: x }, o || {}); };
  const K = function (t, n, s, g, cats, items, x, o) { return Object.assign({ kind: 'classify', t: t, n: n, s: s, g: g, cats: cats, items: items, x: x }, o || {}); };
  const N = function (t, n, s, g, a, x, o) { return Object.assign({ kind: 'calc', t: t, n: n, s: s, g: g, a: a, x: x }, o || {}); };

  const t2 = C.t2(D.turnoA, D.turnoB), tp = C.tpaired(D.antes, D.depois), an = C.anova(Object.values(D.cds)), ch = C.chi2(D.transp.tab);
  const rg = C.regress(D.distancia), mr = C.mreg(D.mreg.X, D.mreg.y), ef = C.effects(D.doe.runs, 3), pc = C.pchart(D.erros, 400), xb = C.xbarr(D.pesos);
  const capP = C.cap(501.5, 1.2, 495, 505), oee = C.oee(D.oee), vsm = C.vsm(D.vsm);
  const pv = function (p) { return p < 0.001 ? '< 0,001' : f(p, 3); };
  const ttab = function (title, rows) { return { type: 'table', title: title, cols: ['Item', 'Valor'], rows: rows }; };

  /* =================== NÍVEL 1 · WHITE E YELLOW BELT =================== */
  const iniciante = [
    // ---- 1.1 White Belt
    Q('Lean Six Sigma', 'Velocidade ou precisão?', 'O CD entrega 99,8% dos pedidos corretos, mas o pedido leva quase 9 horas para sair, e só 23 minutos são trabalho de fato.', 'Qual abordagem ataca melhor esse problema?',
      ['Lean: eliminar esperas e acelerar o fluxo', 'Six Sigma: reduzir a variação dos defeitos', 'Inspecionar 100% dos pedidos', 'Contratar mais conferentes'],
      'O problema é tempo parado (lead time), não defeito. Lean ataca esperas e desperdícios; Six Sigma ataca variação e defeitos.', { w: ['Os defeitos já são baixos; o problema é o tempo.', 'Inspeção não reduz espera.', 'Mais gente não elimina as filas entre etapas.'] }),
    Q('Lean Six Sigma', 'Decisão com dados', 'O gerente acha que os atrasos vêm da transportadora e quer trocá-la imediatamente. Ninguém mediu os atrasos por etapa.', 'O que o Lean Six Sigma recomenda primeiro?',
      ['Medir os atrasos por etapa antes de decidir', 'Trocar a transportadora hoje', 'Fazer uma reunião de votação', 'Aumentar o prazo prometido ao cliente'],
      'O método começa pelo problema medido. Sem dados, a troca pode não resolver nada e ainda custar caro.'),
    K('Lean Six Sigma', 'Lean ou Six Sigma?', 'A equipe listou iniciativas para o próximo trimestre.', 'Classifique cada iniciativa pelo foco principal.', ['Lean (velocidade)', 'Six Sigma (precisão)'],
      [['Reduzir a fila de pedidos antes da embalagem', 0], ['Reduzir a variação do peso das caixas', 1], ['Eliminar a segunda conferência', 0], ['Reduzir pedidos com item errado de 1,2% para 0,4%', 1], ['Diminuir o estoque parado no corredor', 0], ['Diminuir a variação do prazo de entrega', 1]],
      'Filas, etapas desnecessárias e estoque são desperdícios (Lean). Variação e defeitos são o foco do Six Sigma.'),
    Q('Lean Six Sigma', 'Quem conduz?', 'Uma analista do CD fez a formação e vai conduzir, em tempo parcial, o projeto de pedidos com problema na própria área.', 'Qual faixa corresponde a esse papel?',
      ['Green Belt', 'White Belt', 'Champion', 'Master Black Belt'],
      'Green Belt conduz projetos na própria área, dividindo o tempo com a rotina. White Belt conhece os conceitos; Champion patrocina; Master Black Belt forma e orienta o programa.'),
    // Voz do cliente
    Q('Voz do cliente', 'O que o cliente valoriza?', 'Uma pesquisa com 400 clientes perguntou o que mais importa na compra online. 71% citaram “receber no dia prometido”; 12%, “caixa bonita”.', 'Qual requisito deve guiar o projeto do CD?',
      ['Cumprir o prazo prometido', 'Deixar a caixa mais bonita', 'Reduzir o número de funcionários', 'Aumentar o catálogo'],
      'A VOC mostra claramente o que gera valor: o prazo. Investir no que o cliente pouco valoriza não melhora a experiência.'),
    K('Voz do cliente', 'Agrega valor?', 'Você está mapeando as atividades do pedido online.', 'Classifique cada atividade.', ['Agrega valor', 'Necessária sem valor', 'Desperdício'],
      [['Separar os itens do pedido', 0], ['Emitir a nota fiscal', 1], ['Conferir o pedido pela segunda vez porque a primeira falha', 2], ['Embalar o produto', 0], ['Pedido parado esperando coleta', 2], ['Registrar dados exigidos pela Receita', 1]],
      'Agrega valor o que transforma o produto como o cliente quer. Exigências legais são necessárias sem valor. Retrabalho e espera são desperdício.'),
    M('Voz do cliente', 'Fontes de VOC', 'O projeto precisa ouvir o cliente da entrega expressa.', 'Marque todas as fontes de voz do cliente.',
      ['Reclamações registradas no SAC', 'Avaliações no site e nas lojas de aplicativo', 'Entrevistas com clientes frequentes', 'O organograma da empresa', 'O plano de manutenção das empilhadeiras'], [0, 1, 2],
      'SAC, avaliações e entrevistas trazem o que o cliente diz. Organograma e plano de manutenção são informações internas.'),
    // Desperdícios
    K('Desperdícios', 'TIMWOODS no CD', 'Durante uma visita ao gemba, a equipe anotou o que viu.', 'Classifique cada situação no desperdício correspondente.', ['Transporte', 'Inventário', 'Movimentação', 'Espera', 'Superprodução', 'Defeitos'],
      [['Caixas levadas ao galpão B e trazidas de volta', 0], ['Três semanas de embalagens empilhadas no corredor', 1], ['Separador anda 40 m para buscar a fita', 2], ['Pedidos parados aguardando aprovação de crédito', 3], ['Etiquetas impressas para o dia seguinte inteiro', 4], ['Pedido reembalado porque a caixa rasgou', 5]],
      'Mover material = transporte; estoque parado = inventário; pessoas andando = movimentação; fila = espera; fazer antes da hora = superprodução; refazer = defeito.'),
    Q('Desperdícios', 'O maior desperdício', 'No pedido online, o tempo total é de 518 minutos. As etapas de trabalho somam 23 minutos.', 'Qual desperdício domina esse processo?',
      ['Espera entre as etapas', 'Movimentação dos separadores', 'Transporte interno', 'Talento não aproveitado'],
      'Com 495 de 518 minutos parados, a espera é o desperdício dominante. Atacar movimentação traria ganho pequeno perto disso.', { d: { type: 'vsm', steps: D.vsm } }),
    N('Desperdícios', 'Tempo sem valor', 'O VSM do pedido online mostra lead time de 518 min e 23 min de trabalho que agrega valor.', 'Qual % do lead time é tempo sem valor (1 casa decimal)?', r((vsm.lead - vsm.va) / vsm.lead * 100, 1),
      'Sem valor = (518 − 23) ÷ 518 = 95,6%. A eficiência do ciclo (PCE) é só 4,4%.', { unit: '%', dec: 1, d: { type: 'vsm', steps: D.vsm } }),
    Q('Desperdícios', 'A sigla do S', 'Os conferentes sugeriram várias vezes um gabarito de papelão para acelerar a conferência, mas ninguém deu atenção.', 'Qual desperdício é esse?',
      ['Talento não aproveitado (Skills)', 'Superprodução', 'Processamento excessivo', 'Transporte'],
      'Ideias da equipe ignoradas são o oitavo desperdício: talento (S de TIMWOODS).'),
    // Variação
    Q('Variação', 'Mesma média, clientes diferentes', 'Duas transportadoras têm prazo médio de 3 dias. Na Rápida, 95% das entregas ficam entre 2,5 e 3,5 dias; na Econômica, entre 1 e 6 dias.', 'Qual o cliente prefere?',
      ['A Rápida, porque varia menos', 'A Econômica, porque às vezes entrega em 1 dia', 'Tanto faz, a média é igual', 'Depende só do preço'],
      'Com a mesma média, a menor variação torna o prazo previsível. Entregas em 6 dias geram reclamação, mesmo que outras cheguem cedo.'),
    N('Variação', 'Quantos sigmas até o limite?', 'O prazo de entrega tem média de 30 h e desvio padrão de 4 h. O cliente aceita até 48 h.', 'Quantos desvios padrão cabem entre a média e o limite (Z, 1 casa)?', r((48 - 30) / 4, 1),
      'Z = (48 − 30) ÷ 4 = 4,5. Quanto maior o Z, menos entregas passam do limite.', { dec: 1 }),
    Q('Variação', 'Causa especial', 'O prazo médio de entrega varia entre 2,1 e 2,6 dias todos os dias. No dia 14, foi de 3,7 dias: houve greve na transportadora.', 'Como classificar o dia 14?',
      ['Causa especial: um evento fora do comportamento normal', 'Causa comum: variação natural', 'Erro de digitação, deve ser apagado', 'Melhoria do processo'],
      'Causa especial é um evento identificável que tira o processo do padrão. Deve ser investigada e registrada, não apagada.'),
    // DMAIC
    O('DMAIC', 'O roteiro do projeto', 'Você vai conduzir o projeto de pedidos com item errado.', 'Coloque as atividades na ordem do DMAIC.',
      ['Escrever a carta de projeto com a meta', 'Validar a medição e levantar a linha de base', 'Comprovar as causas raiz com dados', 'Testar a solução em piloto', 'Criar o plano de controle e entregar ao dono do processo'],
      'Definir (carta), Medir (MSA e linha de base), Analisar (causas), Melhorar (piloto) e Controlar (plano e entrega).'),
    K('DMAIC', 'Em que fase?', 'O Black Belt revisa o cronograma do projeto.', 'Classifique cada atividade na fase do DMAIC.', ['D', 'M', 'A', 'I', 'C'],
      [['Montar o SIPOC', 0], ['Estudo R&R da balança', 1], ['Teste de hipótese entre turnos', 2], ['Poka-yoke na bancada', 3], ['Carta de controle diária', 4], ['Calcular o DPMO atual', 1], ['Matriz de seleção de soluções', 3]],
      'Definir delimita; Medir valida e quantifica; Analisar comprova causas; Melhorar implanta soluções; Controlar sustenta.'),
    Q('DMAIC', 'Pulando a fase Medir', 'Depois de definir o problema, a equipe quer ir direto às soluções: “todo mundo sabe que a culpa é da etiqueta”.', 'Qual o principal risco?',
      ['Sem linha de base e sem causa comprovada, não há como provar o ganho nem garantir a solução certa', 'Nenhum: a experiência basta', 'Atrasar o projeto em uma semana', 'Gastar papel'],
      'Pular Medir e Analisar troca evidência por opinião. A solução pode atacar a causa errada e o ganho não pode ser demonstrado.'),

    // ---- 1.2 Yellow Belt · Definição de Projetos
    K('Papéis', 'Quem faz o quê?', 'A diretoria está montando o programa Lean Six Sigma.', 'Associe cada responsabilidade ao papel.', ['Champion', 'Black Belt', 'Green Belt', 'Yellow Belt'],
      [['Aprovar a carta e liberar recursos', 0], ['Mentorar Green Belts e liderar projetos complexos', 1], ['Conduzir o projeto na própria área', 2], ['Coletar dados e testar soluções no turno', 3], ['Remover barreiras entre áreas', 0], ['Aplicar DOE e regressão múltipla', 1]],
      'Champion patrocina e remove barreiras; Black Belt lidera e mentora; Green Belt conduz; Yellow Belt apoia a equipe.'),
    Q('Papéis', 'Projeto travado', 'O projeto precisa que a área de TI altere o sistema de etiquetas, mas a TI diz que não é prioridade.', 'Quem deve resolver esse impasse?',
      ['O Champion do projeto', 'O Yellow Belt', 'O cliente', 'Ninguém: o projeto deve esperar'],
      'Remover barreiras entre áreas é papel do Champion, que tem autoridade sobre recursos e prioridades.'),
    Q('Papéis', 'Dono do processo', 'O projeto terminou com ótimos resultados, mas três meses depois os erros voltaram. O supervisor do CD não participou do projeto.', 'O que faltou?',
      ['Envolver o dono do processo e entregar o controle a ele', 'Mais treinamento estatístico', 'Um novo projeto igual', 'Trocar o Green Belt'],
      'Quem mantém o processo no dia a dia precisa participar e assumir o plano de controle. Sem dono, o ganho se perde.'),
    // Carta de projeto
    Q('Carta de projeto', 'Declaração do problema', 'A equipe escreveu três versões da declaração do problema.', 'Qual está correta?',
      ['De janeiro a março, 1,2% dos pedidos do CD São Paulo foram entregues com item errado', 'Os conferentes não prestam atenção', 'Precisamos instalar leitores de código de barras', 'A qualidade dos pedidos está ruim'],
      'A declaração descreve o efeito com dados, local e período, sem culpar pessoas e sem propor solução.', { w: ['Culpa pessoas e supõe a causa.', 'Já é uma solução.', 'Vago, sem dado nem período.'] }),
    Q('Carta de projeto', 'Meta SMART', 'O Champion pediu uma meta para o projeto de pedidos com erro.', 'Qual meta é SMART?',
      ['Reduzir pedidos com item errado de 1,2% para 0,4% até setembro', 'Zerar os erros', 'Melhorar muito a qualidade', 'Reduzir os erros o máximo possível'],
      'Específica (pedidos com item errado), mensurável (de 1,2% para 0,4%), atingível, relevante e com prazo.'),
    K('Carta de projeto', 'Dentro ou fora do escopo?', 'O projeto trata dos erros de separação no CD São Paulo, do recebimento do pedido até a expedição.', 'Classifique cada item.', ['Dentro do escopo', 'Fora do escopo'],
      [['Conferência dos itens na bancada', 0], ['Atraso da transportadora na rota', 1], ['Etiquetagem do pedido', 0], ['Atendimento do SAC', 1], ['Separação nas prateleiras', 0], ['CD de Curitiba', 1]],
      'O escopo vai do recebimento à expedição no CD São Paulo. Transporte, SAC e outros CDs ficam fora.'),
    N('Carta de projeto', 'Caso de negócio', 'O CD expede 600 mil pedidos por ano; 1,2% têm item errado. Cada erro custa R$ 52 (reenvio, frete e atendimento). A meta é 0,4%.', 'Qual o ganho anual esperado (R$)?', (0.012 - 0.004) * 600000 * 52,
      'Ganho = (1,2% − 0,4%) × 600.000 × 52 = R$ 249.600 por ano. É o caso de negócio da carta.', { unit: 'R$', dec: 0, h: 'Diferença de taxa × volume × custo por erro.' }),
    // SIPOC
    K('SIPOC', 'SIPOC da devolução', 'O projeto vai mapear o processo de devolução de produtos.', 'Classifique cada elemento no SIPOC.', ['Fornecedor', 'Entrada', 'Processo', 'Saída', 'Cliente'],
      [['Cliente que devolve', 0], ['Solicitação de devolução', 1], ['Inspecionar o produto', 2], ['Reembolso aprovado', 3], ['Financeiro', 4], ['Transportadora reversa', 0], ['Registrar o motivo', 2]],
      'Quem fornece (cliente, transportadora), o que entra (solicitação), etapas com verbo, o que sai (reembolso) e quem recebe (financeiro).'),
    O('SIPOC', 'Montando o SIPOC', 'Você vai facilitar a montagem do SIPOC com a equipe.', 'Coloque os passos na ordem recomendada.',
      ['Definir onde o processo começa e termina', 'Listar de 4 a 7 macroetapas', 'Listar as saídas e os clientes', 'Listar as entradas e os fornecedores', 'Validar com quem executa'],
      'Comece pelo processo e seus limites, vá para a direita (saídas e clientes), depois para a esquerda (entradas e fornecedores) e valide.'),
    Q('SIPOC', 'Para que serve?', 'O Champion perguntou por que perder tempo com o SIPOC se todos conhecem o processo.', 'Qual a melhor resposta?',
      ['Alinhar o escopo e mostrar quem precisa participar do projeto', 'Calcular o sigma do processo', 'Substituir a coleta de dados', 'Definir a solução'],
      'O SIPOC delimita o processo e revela fornecedores e clientes que devem participar ou ser ouvidos.'),
    // CTQ
    Q('CTQ', 'Traduzindo a VOC', 'Clientes reclamam: “a entrega demora demais”.', 'Qual CTQ traduz melhor essa voz?',
      ['Prazo de entrega em horas, com limite de 48 h', 'Simpatia do entregador', 'Cor da embalagem', 'Número de caminhões'],
      'CTQ é mensurável e ligado à necessidade: prazo em horas, com limite claro.'),
    K('CTQ', 'Modelo de Kano', 'A equipe classificou os atributos do serviço de entrega.', 'Classifique cada atributo no modelo de Kano.', ['Básico', 'Desempenho', 'Encantamento'],
      [['O produto chegar inteiro', 0], ['Quanto mais rápido, melhor', 1], ['Bilhete escrito à mão com agradecimento', 2], ['Receber o item certo', 0], ['Frete mais barato', 1], ['Brinde surpresa no pedido', 2]],
      'Básicos irritam quando faltam; desempenho satisfaz na proporção; encantamento surpreende e não é esperado.'),
    M('CTQ', 'CTQ bem definido', 'O projeto listou candidatos a CTQ.', 'Marque todos os que estão bem definidos (mensuráveis e com limite).',
      ['Prazo de entrega até 48 h', 'Avarias até 5 por mil pedidos', 'Atendimento excelente', 'Tempo de espera no SAC até 3 min', 'Logística moderna'], [0, 1, 3],
      'Um CTQ precisa de medida e limite. “Excelente” e “moderna” não são mensuráveis.'),
    Q('CTQ', 'Da necessidade ao limite', 'A árvore CTQ começa em “quero o pedido certo”.', 'Qual é o próximo nível (motivador) da árvore?',
      ['Receber exatamente os itens comprados', '% de pedidos sem erro maior ou igual a 99,6%', 'Comprar leitores de código', 'Treinar os conferentes'],
      'A árvore desce: necessidade → motivador (itens corretos) → CTQ com limite (% sem erro ≥ 99,6%). Leitores e treinamento são soluções, não CTQ.'),
    // Tipos de dados
    K('Tipos de dados', 'Contínuo ou discreto?', 'O plano de coleta lista os dados do projeto.', 'Classifique cada dado.', ['Contínuo', 'Discreto'],
      [['Tempo de separação (min)', 0], ['Pedido com erro: sim ou não', 1], ['Peso da caixa (g)', 0], ['Número de itens faltantes', 1], ['Motivo da devolução', 1], ['Temperatura do galpão (°C)', 0]],
      'Contínuos são medidos em escala; discretos são contados ou classificados.'),
    Q('Tipos de dados', 'Mais informação', 'O projeto quer acompanhar atrasos. A opção A registra “atrasou: sim ou não”; a B registra “horas de atraso”.', 'Qual é melhor para a análise e por quê?',
      ['B: dado contínuo traz mais informação e exige amostras menores', 'A: é mais simples, então é melhor', 'Tanto faz', 'A: dados discretos são mais precisos'],
      'Horas de atraso mostram também quanto atrasou. Dados contínuos permitem análises mais poderosas com menos dados.'),
    N('Tipos de dados', 'Folha de verificação', 'A folha da semana registrou: etiqueta trocada 14, item faltando 9, endereço errado 4.', 'Qual % dos erros foi de etiqueta trocada (1 casa)?', r(14 / 27 * 100, 1),
      '14 ÷ (14 + 9 + 4) = 14 ÷ 27 = 51,9%.', { unit: '%', dec: 1, d: { type: 'table', cols: ['Erro', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Total'], rows: [['Etiqueta trocada', 3, 2, 4, 2, 3, 14], ['Item faltando', 2, 1, 2, 3, 1, 9], ['Endereço errado', 1, 0, 1, 1, 1, 4]] } }),

    // ---- 1.3 Yellow Belt · Ferramentas de Melhoria
    N('Pareto', 'Poucos vitais', 'O Pareto das reclamações do trimestre mostra os 7 motivos.', 'Que % do total os 3 primeiros motivos somam (1 casa)?', r(C.pareto(D.reclamacoes).rows[2].cum * 100, 1),
      '(142 + 88 + 61) ÷ 360 = 80,8%. Três motivos concentram a maior parte das reclamações.', { unit: '%', dec: 1, d: { type: 'pareto', items: D.reclamacoes, rot: true } }),
    Q('Pareto', 'Por onde começar', 'O Pareto mostra que atraso na entrega responde por 39% das reclamações, e “Outros” por 2,5%.', 'Onde focar primeiro?',
      ['Atraso na entrega', 'Outros', 'Todas as categorias ao mesmo tempo', 'Na categoria mais fácil'],
      'A maior barra concentra mais impacto. Atacar várias categorias ao mesmo tempo dispersa o esforço.', { d: { type: 'pareto', items: D.reclamacoes, rot: true } }),
    Q('Pareto', 'Estratificando', 'O índice geral de erros é 1,2%. Separando por turno: manhã 0,6%, tarde 0,7%, noite 2,9%.', 'Qual a conclusão?',
      ['O problema se concentra no turno da noite', 'Os três turnos são iguais', 'A média de 1,2% basta', 'O turno da manhã é o pior'],
      'A estratificação revela o foco que a média escondia: a noite tem quatro vezes mais erros.'),
    M('Pareto', 'Bom uso do Pareto', 'O analista vai montar um Pareto dos motivos de devolução.', 'Marque todos os cuidados corretos.',
      ['Usar o mesmo período para todas as categorias', 'Abrir a categoria “Outros” se ela for grande', 'Fazer também um Pareto por custo', 'Concluir a causa raiz só pelo Pareto', 'Misturar dados de anos diferentes sem identificar'], [0, 1, 2],
      'Período igual, “Outros” pequeno e Pareto por custo são boas práticas. O Pareto prioriza, mas não prova causa.'),
    // Causas
    K('Causas', 'Os 6M', 'A equipe listou causas possíveis para “caixa amassada na entrega”.', 'Classifique cada causa na categoria do Ishikawa.', ['Método', 'Máquina', 'Mão de obra', 'Material', 'Medida', 'Meio ambiente'],
      [['Empilhamento sem limite de altura', 0], ['Esteira com degrau na transferência', 1], ['Embalador novo sem treinamento', 2], ['Papelão de gramatura baixa', 3], ['Balança desregulada no lote', 4], ['Galpão úmido', 5]],
      'Método = como se faz; Máquina = equipamento; Mão de obra = pessoas; Material = insumo; Medida = medição; Meio ambiente = condições.'),
    O('Causas', 'Os 5 porquês', 'Problema: o pedido 4821 saiu com item errado.', 'Coloque os porquês na ordem, do efeito à causa raiz.',
      ['O conferente não percebeu o item errado', 'A conferência é visual, sem leitor', 'Os leitores foram retirados para outra área', 'Não existe padrão que defina a conferência por leitor'],
      'Cada resposta explica a anterior, até chegar a algo que o processo controla: a falta de padrão.'),
    Q('Causas', 'Culpa ou causa?', 'No 3º porquê, alguém respondeu: “porque o João é desatento”.', 'Como o facilitador deve conduzir?',
      ['Perguntar o que no processo permitiu que a desatenção virasse erro', 'Aceitar e encerrar a análise', 'Demitir o João', 'Pular para a solução'],
      'Culpar pessoas encerra a investigação cedo. O foco é o que no processo permite o erro (por exemplo, falta de poka-yoke).'),
    Q('Causas', 'Hipótese ou fato?', 'O Ishikawa listou 15 causas possíveis para atrasos.', 'O que fazer antes de propor soluções?',
      ['Comprovar com dados quais causas realmente explicam os atrasos', 'Atacar as 15 ao mesmo tempo', 'Escolher a causa mais citada na reunião', 'Descartar o diagrama'],
      'O Ishikawa organiza hipóteses. A comprovação com dados evita gastar esforço em causas que não pesam.', { d: { type: 'ishikawa', effect: 'Atraso na expedição', cats: { 'Método': ['Coleta em horário fixo'], 'Máquina': ['Impressora lenta'], 'Mão de obra': ['Falta no turno'], 'Material': ['Caixa em falta'], 'Medida': ['Sistema sem alerta'], 'Meio ambiente': ['Chuva na doca'] } } }),
    // 5S
    K('5S', 'Qual S?', 'A equipe aplicou o 5S na bancada de embalagem.', 'Classifique cada ação no S correspondente.', ['Utilização', 'Ordenação', 'Limpeza', 'Padronização', 'Disciplina'],
      [['Retirar fitas e caixas que não são usadas', 0], ['Desenhar o contorno das ferramentas no quadro', 1], ['Limpar a bancada e inspecionar a seladora', 2], ['Criar o padrão visual da bancada com fotos', 3], ['Auditoria semanal com pontuação', 4]],
      'Separar, ordenar, limpar, padronizar e manter com disciplina.'),
    N('5S', 'Tempo de procura', 'Antes do 5S, cada embalador gastava 18 min por turno procurando material. Depois, 5 min. São 12 embaladores e 22 turnos por mês.', 'Quantas horas por mês foram liberadas?', r((18 - 5) * 12 * 22 / 60, 1),
      '(18 − 5) × 12 × 22 = 3.432 min = 57,2 h por mês.', { dec: 1, unit: 'h' }),
    Q('5S', 'Voltou à bagunça', 'Três meses após o mutirão de 5S, a bancada está desorganizada de novo.', 'Quais S faltaram?',
      ['Padronização e disciplina', 'Utilização e ordenação', 'Só a limpeza', 'Nenhum: 5S é assim mesmo'],
      'Sem padrão e auditoria (4º e 5º S), o 5S vira evento e não sistema.'),
    M('5S', 'Gestão visual', 'O supervisor quer que os problemas apareçam à primeira vista.', 'Marque todas as práticas de gestão visual.',
      ['Marcação no piso das áreas de pallet', 'Quadro com o indicador do dia', 'Etiqueta com o lugar de cada ferramenta', 'Relatório mensal enviado por e-mail', 'Planilha guardada na rede'], [0, 1, 2],
      'Gestão visual fica no local de trabalho e é entendida em segundos. Relatórios e planilhas não são visuais no gemba.'),
    // Kaizen
    Q('Kaizen', 'Kaizen ou DMAIC?', 'A impressora de etiquetas fica a 25 m da bancada, e todos sabem que isso causa demora. A solução é mudá-la de lugar.', 'Qual abordagem usar?',
      ['Kaizen rápido: a causa é clara e a solução, simples', 'Projeto DMAIC de 4 meses', 'DOE com 3 fatores', 'Nenhuma'],
      'Causa óbvia e solução simples pedem ação rápida. DMAIC é para problemas com causa desconhecida.'),
    O('Kaizen', 'Evento kaizen', 'Você vai organizar um evento kaizen de 4 dias na conferência.', 'Coloque as etapas na ordem.',
      ['Definir o problema e a meta com dados', 'Observar o processo no gemba', 'Testar melhorias com a equipe', 'Padronizar o novo método', 'Apresentar os resultados e o plano de acompanhamento'],
      'Problema e meta, observação, testes, padrão e acompanhamento.'),
    N('Kaizen', 'Ganho do kaizen', 'A conferência caiu de 3,0 para 1,9 min por pedido. O CD confere 2.400 pedidos por dia.', 'Quantas horas por dia foram liberadas (1 casa)?', r((3.0 - 1.9) * 2400 / 60, 1),
      '(3,0 − 1,9) × 2.400 = 2.640 min = 44 h por dia.', { unit: 'h', dec: 1 }),
    Q('Kaizen', 'Base da próxima melhoria', 'O kaizen funcionou, mas cada turno executa a conferência de um jeito.', 'O que fazer primeiro?',
      ['Padronizar o melhor método e treinar todos os turnos', 'Começar outro kaizen', 'Deixar cada um como prefere', 'Voltar ao método antigo'],
      'O padrão consolida o ganho e vira a base da próxima melhoria (SDCA antes de girar outro PDCA).'),
  ];

  /* ========================== NÍVEL 2 · GREEN BELT ========================== */
  const intermediario = [
    // ---- 2.1 Measure
    N('Plano de coleta', 'Tamanho de amostra', 'Você quer estimar o tempo médio de separação com erro máximo de 0,5 min e 95% de confiança. O desvio estimado é 2 min.', 'Quantos pedidos medir? (n = (1,96 × σ ÷ E)², arredonde para cima)', C.nMean(2, 0.5),
      'n = (1,96 × 2 ÷ 0,5)² = 61,5 → 62 pedidos.', { dec: 0, unit: 'pedidos', h: 'Sempre arredonde para cima.' }),
    Q('Plano de coleta', 'Definição operacional', 'Dois supervisores medem o “tempo de separação”: um começa quando o pedido aparece no sistema; o outro, quando o separador pega o coletor.', 'O que está faltando?',
      ['Uma definição operacional única de início e fim da medição', 'Mais supervisores', 'Um cronômetro mais caro', 'Uma amostra maior'],
      'Sem definição operacional, os dados não são comparáveis. Defina exatamente onde a medição começa e termina.'),
    Q('Plano de coleta', 'Amostra representativa', 'O CD funciona em três turnos com volumes de 50%, 30% e 20%. O analista coletou 100 pedidos só no turno da manhã, “porque é mais tranquilo”.', 'Qual o problema?',
      ['A amostra não representa o processo: deveria ser estratificada por turno', 'Nenhum: 100 pedidos bastam', 'Deveria ter coletado só à noite', 'A amostra é grande demais'],
      'Amostra de conveniência gera viés. Estratifique proporcionalmente: 50 da manhã, 30 da tarde e 20 da noite.'),
    // Estatística descritiva
    N('Estatística descritiva', 'Média do turno A', 'Tempos de separação do turno A (min): ' + D.turnoA.join(' · ') + '.', 'Qual a média (2 casas)?', r(C.describe(D.turnoA).mean, 2),
      'Soma ' + f(C.describe(D.turnoA).mean * 10, 1) + ' ÷ 10 = ' + f(C.describe(D.turnoA).mean, 2) + ' min.', { dec: 2, unit: 'min' }),
    N('Estatística descritiva', 'Mediana do SAC', 'O SAC registrou 25 tempos de atendimento, com alguns muito longos.', 'Qual a mediana (1 casa)?', r(C.describe(D.sac).median, 1),
      'Ordenados, o 13º valor é ' + f(C.describe(D.sac).median, 1) + ' min. A média (' + f(C.describe(D.sac).mean, 2) + ') é puxada pelos valores altos.', { dec: 1, unit: 'min', d: { type: 'hist', values: D.sac, bin: 1, from: 2, xlab: 'Tempo de atendimento (min)' } }),
    Q('Estatística descritiva', 'Média ou mediana?', 'O histograma do tempo de atendimento tem cauda longa à direita: média ' + f(C.describe(D.sac).mean, 1) + ' min e mediana ' + f(C.describe(D.sac).median, 1) + ' min.', 'Qual medida descreve melhor o atendimento típico?',
      ['A mediana, porque resiste aos valores extremos', 'A média, sempre', 'O máximo', 'A amplitude'],
      'Em dados assimétricos, a mediana representa melhor o caso típico; a média é puxada pela cauda.', { d: { type: 'hist', values: D.sac, bin: 1, from: 2, xlab: 'Tempo de atendimento (min)' } }),
    Q('Estatística descritiva', 'Lendo o boxplot', 'O boxplot compara o tempo de separação dos dois turnos.', 'Qual a leitura correta?',
      ['O turno B tem mediana menor e menos variação que o turno A', 'Os turnos são iguais', 'O turno A é mais rápido', 'O turno B tem mais variação'],
      'A caixa do turno B está mais baixa (mediana ' + f(C.describe(D.turnoB).median, 1) + ' × ' + f(C.describe(D.turnoA).median, 1) + ') e mais estreita (menos variação).', { d: { type: 'box', groups: [{ n: 'Turno A', v: D.turnoA }, { n: 'Turno B', v: D.turnoB }], unit: 'min' } }),
    // Distribuição normal
    N('Distribuição normal', 'Valor Z', 'O peso da embalagem tem média 501,5 g e desvio 1,2 g. O limite superior é 505 g.', 'Qual o Z até o limite superior (2 casas)?', r((505 - 501.5) / 1.2, 2),
      'Z = (505 − 501,5) ÷ 1,2 = 2,92.', { dec: 2 }),
    Q('Distribuição normal', 'Regra 68-95-99,7', 'O prazo de entrega é aproximadamente normal, com média 30 h e desvio 4 h.', 'Cerca de 95% das entregas ficam entre:',
      ['22 h e 38 h', '26 h e 34 h', '18 h e 42 h', '30 h e 34 h'],
      '±2σ: 30 ± 8 = 22 a 38 h. ±1σ seria 26 a 34; ±3σ, 18 a 42.'),
    Q('Distribuição normal', 'Dois picos', 'O histograma do tempo de separação mostra dois picos: um em 7 min e outro em 11 min.', 'O que isso sugere?',
      ['Mistura de dois grupos (por exemplo, dois turnos ou tipos de pedido): estratifique', 'Distribuição normal perfeita', 'Erro do histograma', 'Processo capaz'],
      'Distribuição bimodal costuma indicar dois processos misturados. Separe os grupos antes de analisar.'),
    // MSA
    Q('MSA', 'Resultado do R&R', 'O estudo R&R da balança de expedição deu %R&R de 34%.', 'O que fazer?',
      ['Melhorar o sistema de medição antes de analisar os dados', 'Seguir a análise normalmente', 'Calcular o Cpk', 'Descartar o projeto'],
      'Acima de 30%, a medição é inaceitável: a variação medida pode ser da balança, não do processo.'),
    K('MSA', 'Repetibilidade ou reprodutibilidade?', 'O R&R mostrou de onde vem a variação da medição.', 'Classifique cada situação.', ['Repetibilidade', 'Reprodutibilidade'],
      [['A mesma conferente pesa a mesma caixa 3 vezes e obtém valores diferentes', 0], ['Conferentes diferentes obtêm médias diferentes para as mesmas caixas', 1], ['A balança oscila com vibração da esteira', 0], ['Cada turno posiciona a caixa de um jeito', 1]],
      'Repetibilidade = variação do instrumento (mesma pessoa). Reprodutibilidade = variação entre pessoas ou métodos.'),
    Q('MSA', 'Atributos', 'Três inspetores classificam caixas como “avariada” ou “ok”. O Kappa entre eles foi 0,55.', 'Qual a leitura?',
      ['Concordância ruim: padronizar o critério e treinar', 'Concordância excelente', 'O processo está capaz', 'Não há o que fazer'],
      'Kappa abaixo de 0,7 indica concordância fraca. Fotos de referência e critérios claros costumam resolver.'),
    N('MSA', 'R&R combinado', 'O estudo mostrou repetibilidade de 12% e reprodutibilidade de 13% da variação total.', 'Qual o %R&R total (√(12² + 13²), 1 casa)?', r(Math.sqrt(144 + 169), 1),
      '√(144 + 169) = √313 = 17,7%: aceitável com ressalvas.', { unit: '%', dec: 1 }),
    // Linha de base
    N('Linha de base', 'DPMO', 'Em março, 5.000 pedidos foram expedidos. Cada pedido tem 4 oportunidades de defeito; foram 60 defeitos.', 'Qual o DPMO?', r(C.dpmo(60, 5000, 4), 0),
      'DPMO = 60 ÷ (5.000 × 4) × 1.000.000 = 3.000.', { dec: 0, unit: 'DPMO' }),
    N('Linha de base', 'Nível sigma', 'A linha de base é de 3.000 DPMO.', 'Qual o nível sigma correspondente (1 casa, com deslocamento de 1,5σ)?', r(C.sigma(3000), 1),
      '3.000 DPMO ≈ 4,2σ. Para chegar a 6σ, seriam 3,4 DPMO.', { dec: 1, tol: 0.05 }),
    N('Linha de base', 'RTY', 'O pedido passa por 4 etapas com rendimento de primeira (FTY) de 98%, 95%, 97% e 99%.', 'Qual o RTY (1 casa)?', r(C.rty([0.98, 0.95, 0.97, 0.99]) * 100, 1),
      'RTY = 0,98 × 0,95 × 0,97 × 0,99 = 89,4%: só 89,4% dos pedidos passam por tudo sem retrabalho.', { unit: '%', dec: 1 }),

    // ---- 2.2 Analyze
    N('VSM', 'Lead time', 'O VSM do pedido online mostra cada etapa com tempo de ciclo e espera.', 'Qual o lead time total (min)?', vsm.lead,
      'Lead time = 23 min de trabalho + 495 min de espera = 518 min.', { dec: 0, unit: 'min', d: { type: 'vsm', steps: D.vsm, totals: false } }),
    N('VSM', 'Takt time', 'O CD trabalha 2 turnos de 450 min e precisa expedir 1.800 pedidos por dia.', 'Qual o takt time (min por pedido)?', C.takt(900, 1800),
      'Takt = 900 ÷ 1.800 = 0,5 min por pedido. Etapas acima disso viram gargalo.', { dec: 1, unit: 'min' }),
    Q('VSM', 'Onde atacar', 'O VSM mostra esperas de 30, 120, 45, 60 e 240 min entre as etapas.', 'Qual espera atacar primeiro?',
      ['A de 240 min antes da expedição (coleta)', 'A de 30 min no recebimento', 'Todas igualmente', 'Nenhuma: espera é normal'],
      'A maior espera tem o maior potencial de reduzir o lead time.', { d: { type: 'vsm', steps: D.vsm } }),
    Q('VSM', 'Gargalo', 'Com takt de 0,5 min, as etapas têm tempo de ciclo por pedido de: separar 0,45, conferir 0,62, embalar 0,40 e etiquetar 0,30 min.', 'Qual é o gargalo?',
      ['Conferir', 'Separar', 'Embalar', 'Etiquetar'],
      'Conferir (0,62 min) passa do takt de 0,5 min: forma fila e limita o fluxo inteiro.'),
    // Fluxo e kanban
    N('Fluxo e kanban', 'Lei de Little', 'Há 180 pedidos em processo no CD e a vazão é de 60 pedidos por hora.', 'Qual o lead time médio (h)?', 180 / 60,
      'Lead time = WIP ÷ vazão = 180 ÷ 60 = 3 h.', { dec: 1, unit: 'h' }),
    Q('Fluxo e kanban', 'Puxar ou empurrar', 'O CD embala caixas o dia todo “para adiantar”, e elas ficam paradas esperando a coleta, que só passa às 17h.', 'Qual mudança segue o sistema puxado?',
      ['Embalar conforme a janela de coleta e a demanda real, com limite de WIP', 'Embalar ainda mais cedo', 'Contratar mais embaladores', 'Construir um depósito maior'],
      'Puxar significa produzir pelo consumo real. Embalar antes da hora é superprodução e gera estoque parado.'),
    Q('Fluxo e kanban', 'Kanban de embalagens', 'A bancada tem dois cartões kanban de 200 caixas. Quando um lote acaba, o cartão vai para o almoxarifado.', 'O que o cartão representa?',
      ['A autorização para repor exatamente 200 caixas', 'Um pedido de compra anual', 'Um alarme de incêndio', 'A meta de produção'],
      'O kanban é o sinal de reposição: só se repõe o que foi consumido, na quantidade definida.'),
    // OEE e SMED
    N('OEE e SMED', 'OEE da linha', 'No turno, a linha de embalagem teve 480 min planejados, 72 min parada, ciclo ideal de 0,5 min, 720 caixas produzidas e 36 defeituosas.', 'Qual o OEE (1 casa)?', r(oee.oee * 100, 1),
      'D = 408 ÷ 480 = 85%; P = 0,5 × 720 ÷ 408 = 88,2%; Q = 684 ÷ 720 = 95%. OEE = ' + f(oee.oee * 100, 1) + '%.', { unit: '%', dec: 1, d: { type: 'oee', planned: D.oee.planned, down: D.oee.down, ideal: D.oee.ideal, produced: D.oee.produced, defects: D.oee.defects, show: false } }),
    K('OEE e SMED', 'Setup interno ou externo?', 'A troca de formato da seladora leva 40 min. A equipe analisou o filme do setup.', 'Classifique cada atividade.', ['Interna (máquina parada)', 'Externa (máquina rodando)'],
      [['Trocar o molde de selagem', 0], ['Buscar o molde novo no almoxarifado', 1], ['Ajustar a temperatura do molde instalado', 0], ['Separar as ferramentas da troca', 1], ['Preparar a bobina do próximo formato', 1]],
      'Tudo o que pode ser feito antes da parada (buscar, separar, preparar) deve ser externo.'),
    Q('OEE e SMED', 'Onde está a perda', 'Uma linha tem disponibilidade de 95%, performance de 62% e qualidade de 99%.', 'Onde agir primeiro?',
      ['Performance: pequenas paradas e velocidade reduzida', 'Qualidade', 'Disponibilidade', 'Em nenhum lugar'],
      'O fator mais baixo é a performance. Pequenas paradas e redução de velocidade costumam explicar.'),
    // Testes de hipótese
    Q('Testes de hipótese', 'Turno A × turno B', 'O teste t comparou o tempo de separação dos turnos: valor-p ' + pv(t2.p) + '.', 'Qual a conclusão com α = 0,05?',
      ['A diferença entre os turnos é estatisticamente significativa', 'Não há diferença entre os turnos', 'O teste está errado', 'É preciso aumentar o α'],
      'Valor-p menor que 0,05: rejeita-se H0. O turno B separa mais rápido de fato (' + f(t2.mb, 2) + ' × ' + f(t2.ma, 2) + ' min).', { d: ttab('Saída do teste t (2 amostras)', [['Média A (min)', r(t2.ma, 2)], ['Média B (min)', r(t2.mb, 2)], ['Diferença', r(t2.diff, 2)], ['t', r(t2.t, 2)], ['Valor-p', pv(t2.p)]]) }),
    Q('Testes de hipótese', 'Escolhendo o teste', 'Os mesmos 8 separadores foram cronometrados antes e depois do novo layout.', 'Qual teste usar?',
      ['t pareado', 't de 2 amostras independentes', 'Qui-quadrado', 'ANOVA'],
      'São as mesmas pessoas medidas duas vezes: o teste pareado compara as diferenças de cada uma.'),
    N('Testes de hipótese', 'Ganho do layout', 'Tempos (min) antes: ' + D.antes.join(' · ') + '. Depois: ' + D.depois.join(' · ') + '.', 'Qual a redução média por separador (min, 2 casas)?', r(tp.diff, 2),
      'Média das diferenças = ' + f(tp.diff, 2) + ' min; t pareado = ' + f(tp.t, 1) + ', valor-p ' + pv(tp.p) + ': ganho comprovado.', { dec: 2, unit: 'min' }),
    Q('Testes de hipótese', 'Sem diferença?', 'Um teste com 5 pedidos por grupo deu valor-p de 0,40 para a diferença entre duas embalagens.', 'Qual a conclusão correta?',
      ['Não há evidência de diferença, mas a amostra pode ser pequena demais para detectá-la', 'As embalagens são iguais', 'A embalagem A é melhor', 'O teste prova que não há diferença'],
      'Valor-p alto não prova igualdade. Com amostra pequena, o poder do teste é baixo.'),
    // Correlação e regressão
    Q('Correlação e regressão', 'Lendo a dispersão', 'O gráfico mostra a distância da entrega e o prazo em horas.', 'Qual a leitura?',
      ['Correlação forte e positiva: quanto mais longe, maior o prazo', 'Nenhuma relação', 'Correlação negativa', 'A distância causa todos os atrasos'],
      'r = ' + f(rg.r, 2) + ': relação forte e positiva. Ainda assim, correlação não prova causa por si só.', { d: { type: 'scatter', pairs: D.distancia, xlab: 'Distância (km)', ylab: 'Prazo (h)' } }),
    N('Correlação e regressão', 'Previsão pela reta', 'A regressão do prazo pela distância deu: prazo = ' + f(rg.a, 2) + ' + ' + f(rg.b, 3) + ' × distância.', 'Qual o prazo previsto para 100 km (h, 1 casa)?', r(rg.a + rg.b * 100, 1),
      f(rg.a, 2) + ' + ' + f(rg.b, 3) + ' × 100 = ' + f(rg.a + rg.b * 100, 1) + ' h.', { dec: 1, unit: 'h', d: { type: 'scatter', pairs: D.distancia, xlab: 'Distância (km)', ylab: 'Prazo (h)', eq: true } }),
    Q('Correlação e regressão', 'Sorvete e afogamentos', 'Os dados mostram correlação forte entre venda de ventiladores e avarias por calor no CD.', 'Qual a conclusão correta?',
      ['As duas sobem com a temperatura; vender ventiladores não causa avarias', 'Ventiladores causam avarias', 'Avarias causam vendas', 'A correlação está errada'],
      'Uma terceira variável (temperatura) explica as duas. Correlação não é causalidade.'),

    // ---- 2.3 Improve e Control
    Q('Seleção de soluções', 'Ganho rápido', 'Na matriz esforço × impacto, “mudar a impressora de lugar” tem baixo esforço e alto impacto; “trocar o WMS” tem alto esforço e alto impacto.', 'Qual fazer primeiro?',
      ['Mudar a impressora de lugar', 'Trocar o WMS', 'Nenhuma', 'As duas ao mesmo tempo, sem piloto'],
      'Baixo esforço e alto impacto são os ganhos rápidos. Soluções grandes entram no plano com análise própria.'),
    N('Seleção de soluções', 'Matriz de priorização', 'Critérios com pesos: impacto (5), custo (3), prazo (2). A solução “etiqueta impressa por pedido” teve notas 4, 5 e 5.', 'Qual a pontuação total?', 4 * 5 + 5 * 3 + 5 * 2,
      '4 × 5 + 5 × 3 + 5 × 2 = 20 + 15 + 10 = 45.', { dec: 0 }),
    O('Seleção de soluções', 'Do piloto à escala', 'A solução escolhida será testada antes de ir para todo o CD.', 'Coloque as etapas na ordem.',
      ['Definir como o piloto será medido', 'Rodar o piloto numa bancada', 'Comparar o resultado com a linha de base', 'Ajustar a solução e os efeitos colaterais', 'Expandir para todas as bancadas'],
      'Piloto com medição definida, comparação, ajuste e só então expansão.'),
    Q('Seleção de soluções', 'Solução sem causa', 'A equipe comprovou que a causa raiz dos erros é a etiqueta impressa em lote. Um gerente sugere “campanha motivacional”.', 'Qual o problema dessa sugestão?',
      ['Não ataca a causa raiz comprovada', 'É cara demais', 'É ilegal', 'Nenhum'],
      'Soluções devem estar ligadas às causas comprovadas. Motivação não muda o lote de etiquetas.'),
    // FMEA
    N('FMEA', 'NPR', 'Modo de falha: produto frágil sem proteção. Severidade 8, ocorrência 4, detecção 6.', 'Qual o NPR?', 8 * 4 * 6,
      'NPR = 8 × 4 × 6 = 192.', { dec: 0, d: { type: 'matrix', mode: 'fmea', rows: [['Etiqueta trocada no pedido', 7, 5, 4], ['Produto frágil sem proteção', 8, 4, 6], ['Atraso na coleta', 6, 6, 3], ['Endereço digitado errado', 7, 3, 7]], score: false, sort: false } }),
    Q('FMEA', 'Prioridade', 'O FMEA da expedição foi pontuado.', 'Qual modo de falha tem a maior prioridade de ação?',
      ['Produto frágil sem proteção', 'Etiqueta trocada no pedido', 'Atraso na coleta', 'Endereço digitado errado'],
      'Maior NPR: 8 × 4 × 6 = 192.', { d: { type: 'matrix', mode: 'fmea', rows: [['Etiqueta trocada no pedido', 7, 5, 4], ['Produto frágil sem proteção', 8, 4, 6], ['Atraso na coleta', 6, 6, 3], ['Endereço digitado errado', 7, 3, 7]], score: false, sort: false } }),
    K('FMEA', 'Poka-yoke', 'A equipe propôs dispositivos à prova de erro.', 'Classifique cada um.', ['Controle (impede o erro)', 'Aviso (alerta o erro)'],
      [['O sistema não imprime a etiqueta se o leitor não confirmar os itens', 0], ['Luz vermelha acende quando o peso difere do esperado', 1], ['Caixa com formato que só aceita o produto certo', 0], ['Alerta sonoro de item faltando', 1]],
      'Controle impede fisicamente ou por sistema; aviso deixa o erro visível para alguém agir.'),
    N('FMEA', 'Depois da ação', 'Após o poka-yoke, a etiqueta trocada (S 7, O 5, D 4) passou a ter ocorrência 2 e detecção 2.', 'Qual o novo NPR?', 7 * 2 * 2,
      'Novo NPR = 7 × 2 × 2 = 28, contra 140 antes. A severidade não muda: o efeito no cliente seria o mesmo.', { dec: 0 }),
    // Cartas de controle
    Q('Cartas de controle', 'Escolhendo a carta', 'O peso de 4 caixas é medido a cada hora.', 'Qual carta usar?',
      ['X̄-R (médias e amplitudes de subgrupos)', 'Carta p', 'Carta u', 'I-MR'],
      'Dados contínuos em subgrupos de 2 a 6 itens: carta X̄-R.'),
    Q('Cartas de controle', 'O dia 13', 'A carta p dos pedidos com erro mostra um ponto acima do limite superior no dia 13, quando houve troca de sistema.', 'O que fazer?',
      ['Investigar e registrar a causa especial (troca de sistema) e agir para evitar repetição', 'Recalcular os limites incluindo o ponto', 'Ignorar o ponto', 'Mudar o processo inteiro'],
      'Ponto fora do limite é causa especial: investigar, registrar e prevenir. Limites não se recalculam por causa de um evento.', { d: { type: 'pchart', defs: D.erros, n: 400 } }),
    N('Cartas de controle', 'Limite da carta p', 'Em 20 dias, com 400 pedidos por dia, houve ' + D.erros.reduce(function (a, b) { return a + b; }, 0) + ' pedidos com erro.', 'Qual o limite superior de controle (LSC, em %, 2 casas)?', r(pc.lsc * 100, 2),
      'p̄ = ' + D.erros.reduce(function (a, b) { return a + b; }, 0) + ' ÷ 8.000 = ' + f(pc.lc * 100, 2) + '%. LSC = p̄ + 3 × √(p̄(1 − p̄) ÷ 400) = ' + f(pc.lsc * 100, 2) + '%.', { unit: '%', dec: 2, tol: 0.02 }),
    Q('Cartas de controle', 'Subgrupo 11', 'A carta X̄ do peso mostra o subgrupo 11 bem acima do limite superior. Os demais estão dentro.', 'Qual a leitura?',
      ['Causa especial no subgrupo 11: investigar o que mudou naquela hora', 'Processo estável', 'Erro de cálculo dos limites', 'O processo é capaz'],
      'Média de ' + f(xb.means[10], 2) + ' g contra LSC de ' + f(xb.lsc, 2) + ' g: sinal claro de causa especial.', { d: { type: 'xbar', subgroups: D.pesos, unit: 'g', d: 2 } }),
    // Capabilidade
    N('Capabilidade', 'Cp', 'O peso da embalagem tem desvio de 1,2 g; a especificação é de 495 a 505 g.', 'Qual o Cp (2 casas)?', r(capP.cp, 2),
      'Cp = 10 ÷ (6 × 1,2) = 1,39.', { dec: 2 }),
    N('Capabilidade', 'Cpk', 'O peso tem média 501,5 g e desvio 1,2 g; a especificação é de 495 a 505 g.', 'Qual o Cpk (2 casas)?', r(capP.cpk, 2),
      'Cpk = min((505 − 501,5) ÷ 3,6; (501,5 − 495) ÷ 3,6) = min(0,97; 1,81) = 0,97.', { dec: 2, d: { type: 'normal', mean: 501.5, sd: 1.2, lie: 495, lse: 505, alvo: 500, show: false } }),
    Q('Capabilidade', 'Cp alto, Cpk baixo', 'O processo de peso tem Cp 1,39 e Cpk 0,97.', 'Qual a ação mais simples para melhorar?',
      ['Centralizar a média no alvo de 500 g', 'Reduzir a variação pela metade', 'Ampliar a especificação', 'Nada: o processo é capaz'],
      'A variação cabe na especificação (Cp 1,39), mas a média está deslocada. Centralizar leva o Cpk para perto do Cp.', { d: { type: 'normal', mean: 501.5, sd: 1.2, lie: 495, lse: 505, alvo: 500 } }),
    Q('Capabilidade', 'Antes de calcular', 'O analista quer calcular o Cpk com os dados do mês, mas a carta de controle mostra vários pontos fora dos limites.', 'O que fazer?',
      ['Primeiro estabilizar o processo (tratar as causas especiais)', 'Calcular o Cpk mesmo assim', 'Excluir os pontos fora', 'Usar só a média'],
      'Capabilidade só faz sentido em processo estável; com causas especiais, o número não prevê o futuro.'),
  ];

  /* ========================== NÍVEL 3 · BLACK BELT ========================== */
  const avancado = [
    // ---- 3.1 Estatística Avançada
    Q('ANOVA', 'Três CDs', 'A ANOVA comparou o prazo de entrega de três CDs.', 'Qual a conclusão?',
      ['Pelo menos um CD tem prazo médio diferente dos outros', 'Os três CDs são iguais', 'Todos os CDs são diferentes entre si', 'A ANOVA não se aplica'],
      'F = ' + f(an.F, 1) + ' e valor-p ' + pv(an.p) + '. A ANOVA indica diferença; um teste post-hoc mostra quais CDs diferem (aqui, BH se destaca com ' + f(an.means[1], 1) + ' h).', { d: { type: 'table', title: 'Saída da ANOVA', cols: ['Fonte', 'GL', 'SQ', 'QM', 'F', 'Valor-p'], rows: [['Entre CDs', an.dfb, r(an.ssb, 1), r(an.msb, 2), r(an.F, 2), pv(an.p)], ['Dentro', an.dfw, r(an.ssw, 1), r(an.msw, 2), '', ''], ['Total', an.dfb + an.dfw, r(an.sst, 1), '', '', '']] } }),
    N('ANOVA', 'Estatística F', 'Na ANOVA dos três CDs, QM entre = ' + f(an.msb, 2) + ' e QM dentro = ' + f(an.msw, 2) + '.', 'Qual o F (1 casa)?', r(an.F, 1),
      'F = ' + f(an.msb, 2) + ' ÷ ' + f(an.msw, 2) + ' = ' + f(an.F, 1) + '.', { dec: 1 }),
    Q('ANOVA', 'Vários testes t?', 'Um analista quer comparar 5 fornecedores fazendo um teste t para cada par (10 testes).', 'Qual o problema?',
      ['A chance de falso alarme cresce com tantos testes; use ANOVA', 'Nenhum', 'O teste t não existe para 2 grupos', 'É preciso usar qui-quadrado'],
      'Com 10 testes a 5%, a chance de ao menos um falso alarme passa de 40%. A ANOVA controla esse risco.'),
    N('ANOVA', 'Graus de liberdade', 'Uma ANOVA compara 4 equipes com 6 medições cada (24 no total).', 'Quantos graus de liberdade tem o resíduo (dentro)?', 24 - 4,
      'GL dentro = N − k = 24 − 4 = 20. GL entre = k − 1 = 3.', { dec: 0 }),
    // Qui-quadrado
    Q('Qui-quadrado', 'Atraso e transportadora', 'O qui-quadrado testou se o atraso depende da transportadora.', 'Qual a conclusão?',
      ['O atraso depende da transportadora (a Econômica atrasa mais)', 'Atraso e transportadora são independentes', 'O teste exige dados contínuos', 'Todas atrasam igual'],
      'χ² = ' + f(ch.chi2, 1) + ', GL = ' + ch.df + ', valor-p ' + pv(ch.p) + '. A Econômica tem 25% de atraso contra 10% da Rápida.', { d: { type: 'table', cols: ['Transportadora', 'No prazo', 'Atrasadas'], rows: D.transp.nomes.map(function (n, i) { return [n, D.transp.tab[i][0], D.transp.tab[i][1]]; }) } }),
    N('Qui-quadrado', 'Valor esperado', 'Na tabela, a Rápida tem 200 entregas e o total de atrasos é 100 em 600 entregas.', 'Quantos atrasos seriam esperados para a Rápida se o atraso fosse independente da transportadora (1 casa)?', r(200 * 100 / 600, 1),
      'E = total da linha × total da coluna ÷ total = 200 × 100 ÷ 600 = 33,3. Ela teve só 20.', { dec: 1 }),
    Q('Qui-quadrado', 'Sem normalidade', 'O tempo de atendimento de 3 equipes do SAC é muito assimétrico, com caudas longas.', 'Qual teste compara as equipes com mais segurança?',
      ['Kruskal-Wallis (não paramétrico, compara medianas)', 'ANOVA sem verificar nada', 'Teste t pareado', 'Kappa'],
      'Com dados fortemente não normais, o Kruskal-Wallis compara 3 ou mais grupos sem exigir normalidade.'),
    // Regressão múltipla
    Q('Regressão múltipla', 'Lendo os coeficientes', 'A regressão do tempo de separação deu: tempo = ' + f(mr.b[0], 2) + ' + ' + f(mr.b[1], 2) + '·itens + ' + f(mr.b[2], 2) + '·corredores.', 'Como ler o coeficiente de corredores?',
      ['Cada corredor a mais soma cerca de ' + f(mr.b[2], 2) + ' min, mantendo o número de itens fixo', 'Corredores explicam ' + f(mr.b[2] * 100, 0) + '% do tempo', 'O tempo base é ' + f(mr.b[2], 2) + ' min', 'Itens não importam'],
      'Na regressão múltipla, cada coeficiente é o efeito de uma variável com as demais constantes.'),
    N('Regressão múltipla', 'Previsão', 'Modelo: tempo = ' + f(mr.b[0], 2) + ' + ' + f(mr.b[1], 2) + '·itens + ' + f(mr.b[2], 2) + '·corredores.', 'Qual o tempo previsto para um pedido com 6 itens em 3 corredores (min, 1 casa)?', r(mr.b[0] + mr.b[1] * 6 + mr.b[2] * 3, 1),
      f(mr.b[0], 2) + ' + ' + f(mr.b[1], 2) + ' × 6 + ' + f(mr.b[2], 2) + ' × 3 = ' + f(mr.b[0] + mr.b[1] * 6 + mr.b[2] * 3, 1) + ' min.', { dec: 1, unit: 'min', tol: 0.1 }),
    Q('Regressão múltipla', 'R² ou R² ajustado?', 'Ao incluir a variável “cor do uniforme”, o R² subiu de 0,983 para 0,984, mas o R² ajustado caiu.', 'O que fazer?',
      ['Retirar a variável: ela não melhora o modelo', 'Manter, porque o R² subiu', 'Incluir mais variáveis', 'Ignorar o R² ajustado'],
      'O R² sempre sobe com mais variáveis. O R² ajustado penaliza as que não ajudam.'),
    Q('Regressão múltipla', 'Multicolinearidade', 'No modelo de prazo, “distância em km” e “tempo de viagem estimado” têm correlação de 0,98 entre si.', 'Qual o risco?',
      ['Multicolinearidade: coeficientes instáveis e difíceis de interpretar', 'Nenhum', 'O R² fica negativo', 'Os dados viram discretos'],
      'Variáveis explicativas quase iguais se confundem. Mantenha uma ou combine-as.'),
    // Poder do teste
    K('Poder do teste', 'Tipo I ou tipo II?', 'O Black Belt revisou decisões passadas.', 'Classifique cada erro.', ['Erro tipo I (falso alarme)', 'Erro tipo II (deixar passar)'],
      [['Concluiu que o novo layout reduziu o tempo, mas foi acaso', 0], ['O teste não detectou que a embalagem nova reduzia avarias de fato', 1], ['Parou a linha por um “sinal” que era variação comum', 0], ['A amostra pequena escondeu a diferença real entre turnos', 1]],
      'Tipo I: achar efeito que não existe (α). Tipo II: não achar efeito que existe (β).'),
    N('Poder do teste', 'Amostra para proporção', 'Você quer estimar o % de pedidos com avaria com margem de ±3 pontos e 95% de confiança, sem ideia prévia da proporção.', 'Quantos pedidos? (n = 1,96² × 0,5 × 0,5 ÷ 0,03², arredonde para cima)', C.nProp(0.5, 0.03),
      'n = 3,8416 × 0,25 ÷ 0,0009 = 1.067,1 → 1.068 pedidos.', { dec: 0, unit: 'pedidos' }),
    Q('Poder do teste', 'Aumentando o poder', 'O teste do novo método teve poder estimado de 45% para detectar a redução que importa.', 'Qual ação aumenta o poder?',
      ['Aumentar a amostra ou reduzir a variação da medição', 'Diminuir a amostra', 'Usar α = 0,001', 'Ignorar o poder'],
      'Mais dados e menos ruído aumentam a chance de detectar a diferença real.'),
    // Capabilidade não normal
    Q('Capabilidade não normal', 'Fórmula errada', 'O tempo de atendimento do SAC tem cauda longa à direita. O analista calculou o Cpk pela fórmula normal e obteve 1,5.', 'Qual o risco?',
      ['A fração real acima do limite pode ser bem maior do que a fórmula indica', 'Nenhum', 'O Cpk ficou baixo demais', 'Os dados viram normais'],
      'A cauda real de dados assimétricos é mais pesada que a da normal; a fórmula subestima a fração fora do limite.', { d: { type: 'hist', values: D.sac, bin: 1, from: 2, lse: 10, xlab: 'Tempo de atendimento (min)' } }),
    N('Capabilidade não normal', '% acima do limite', 'Dos 25 atendimentos medidos, os tempos acima do limite de 10 min foram contados no histograma.', 'Qual % dos atendimentos passou de 10 min?', r(D.sac.filter(function (v) { return v > 10; }).length / D.sac.length * 100, 1),
      '1 de 25 = 4%. Com dados não normais, a fração observada (ou um ajuste de distribuição) é mais honesta que a fórmula normal.', { unit: '%', dec: 1, d: { type: 'hist', values: D.sac, bin: 1, from: 2, lse: 10, xlab: 'Tempo de atendimento (min)' } }),
    O('Capabilidade não normal', 'Roteiro', 'Você vai avaliar a capabilidade do tempo de atendimento.', 'Coloque as etapas na ordem.',
      ['Verificar a estabilidade na carta de controle', 'Testar a normalidade', 'Escolher: transformar ou ajustar outra distribuição', 'Calcular a capabilidade e o % fora do limite', 'Comunicar na unidade original'],
      'Estabilidade, normalidade, abordagem, cálculo e comunicação em linguagem do negócio.'),

    // ---- 3.2 Experimentos e DFSS
    N('DOE fatorial', 'Corridas', 'O experimento da seladora testa temperatura, pressão e tempo em 2 níveis cada, com 2 réplicas.', 'Quantas corridas no total?', Math.pow(2, 3) * 2,
      '2³ = 8 combinações × 2 réplicas = 16 corridas.', { dec: 0 }),
    N('DOE fatorial', 'Efeito da temperatura', 'Resultados do DOE 2³ (resistência do selo, N). Temperatura alta: 27, 35, 28, 36. Temperatura baixa: 18, 20, 19, 21.', 'Qual o efeito principal da temperatura?', ef.main[0],
      'Média alta = 31,5; média baixa = 19,5; efeito = 12 N.', { dec: 1, unit: 'N', d: { type: 'effects', factors: D.doe.fatores, runs: D.doe.runs } }),
    Q('DOE fatorial', 'Fator dominante', 'O gráfico de efeitos principais da seladora foi gerado.', 'Qual fator mais influencia a resistência do selo?',
      ['Temperatura', 'Pressão', 'Tempo', 'Os três igualmente'],
      'Efeitos: temperatura ' + f(ef.main[0], 1) + ', pressão ' + f(ef.main[1], 1) + ' e tempo ' + f(ef.main[2], 1) + ' N.', { d: { type: 'effects', factors: D.doe.fatores, runs: D.doe.runs } }),
    Q('DOE fatorial', 'Um fator por vez', 'O supervisor prefere testar temperatura primeiro, fixar o melhor valor e só depois testar a pressão.', 'Qual a desvantagem?',
      ['Não revela interações e costuma exigir mais corridas', 'É mais rápido e completo', 'Elimina o ruído', 'Não há desvantagem'],
      'Variar um fator por vez esconde interações e pode levar a um ajuste que não é o melhor.'),
    O('DOE fatorial', 'Planejando o DOE', 'Você vai planejar um experimento na seladora.', 'Coloque as etapas na ordem.',
      ['Definir a resposta e como medi-la', 'Escolher fatores e níveis', 'Montar a matriz e aleatorizar a ordem', 'Rodar as corridas e analisar os efeitos', 'Confirmar o melhor ajuste com corridas de validação'],
      'Resposta, fatores, matriz aleatorizada, execução e análise, e confirmação.'),
    // Fatorial fracionado
    N('Fatorial fracionado', 'Interação', 'No DOE da seladora, as médias foram: temperatura e pressão ambas baixas 18,5; temperatura alta e pressão baixa 27,5; temperatura baixa e pressão alta 20,5; ambas altas 35,5.', 'Qual o efeito da interação temperatura × pressão?', ef.ab,
      'Interação = média(AB +) − média(AB −) = (18,5 + 35,5) ÷ 2 − (27,5 + 20,5) ÷ 2 = 27 − 24 = 3.', { dec: 1, d: { type: 'effects', mode: 'inter', factors: ['Temperatura', 'Pressão'], runs: D.doe.runs.map(function (x) { return [x[0], x[1], x[3]]; }) } }),
    Q('Fatorial fracionado', 'Lendo a interação', 'O gráfico de interação mostra que a pressão alta aumenta pouco a resistência com temperatura baixa e muito com temperatura alta.', 'Qual a conclusão?',
      ['Há interação: o efeito da pressão depende da temperatura', 'Não há interação', 'Pressão não tem efeito', 'O experimento falhou'],
      'Linhas não paralelas indicam interação. O melhor ajuste combina temperatura e pressão altas.', { d: { type: 'effects', mode: 'inter', factors: ['Temperatura', 'Pressão'], runs: D.doe.runs.map(function (x) { return [x[0], x[1], x[3]]; }) } }),
    N('Fatorial fracionado', 'Meia fração', 'O projeto quer triar 7 fatores. O fatorial completo exigiria 2⁷ corridas.', 'Quantas corridas tem um fatorial fracionado 2⁷⁻³?', Math.pow(2, 4),
      '2⁷⁻³ = 2⁴ = 16 corridas em vez de 128.', { dec: 0 }),
    Q('Fatorial fracionado', 'Triagem', 'Há 9 fatores possíveis para a variação do peso da embalagem e pouco tempo de máquina.', 'Qual estratégia?',
      ['Fatorial fracionado de triagem e depois experimento completo nos fatores importantes', 'Fatorial completo 2⁹ (512 corridas)', 'Testar um fator por dia', 'Escolher os fatores por votação'],
      'A triagem identifica os poucos fatores relevantes com poucas corridas; depois se aprofunda neles.'),
    // DFSS e DMADV
    Q('DFSS e DMADV', 'DMAIC ou DMADV?', 'A empresa vai lançar um serviço de entrega em 2 horas, que ainda não existe.', 'Qual roteiro usar?',
      ['DMADV (Design for Six Sigma)', 'DMAIC', 'Kaizen de 1 dia', '5S'],
      'Processo novo, projetado do zero: DMADV.'),
    O('DFSS e DMADV', 'Fases do DMADV', 'O projeto do novo serviço de entrega expressa vai começar.', 'Coloque as fases na ordem.',
      ['Definir o objetivo e o escopo do serviço', 'Medir as necessidades e definir os CTQs', 'Analisar conceitos alternativos', 'Desenhar e otimizar o processo escolhido', 'Verificar em piloto e entregar ao dono'],
      'Definir, Medir, Analisar, Desenhar e Verificar.'),
    Q('DFSS e DMADV', 'Quando migrar', 'Depois de dois ciclos de DMAIC, o processo antigo de expedição chegou a 3,8σ. A meta estratégica exige 5σ, e o processo tem limitações físicas do prédio.', 'O que fazer?',
      ['Redesenhar o processo com DMADV', 'Fazer um terceiro DMAIC igual', 'Baixar a meta sem análise', 'Inspecionar 100% dos pedidos'],
      'Quando melhorar o que existe não alcança a meta, o redesenho (DFSS) é o caminho.'),
    K('DFSS e DMADV', 'Ferramenta e fase', 'O Black Belt monta o plano do DMADV.', 'Associe cada ferramenta à fase.', ['Medir', 'Analisar', 'Desenhar', 'Verificar'],
      [['Pesquisa de VOC e CTQs', 0], ['Matriz de Pugh dos conceitos', 1], ['Simulação do novo fluxo', 2], ['Piloto com clientes reais', 3], ['FMEA de projeto', 2]],
      'VOC no Medir; comparação de conceitos no Analisar; simulação e FMEA no Desenhar; piloto no Verificar.'),
    // QFD
    N('QFD', 'Importância técnica', 'Na casa da qualidade, os requisitos têm pesos 5 (chegar rápido), 3 (saber onde está) e 4 (chegar inteiro). O “rastreio em tempo real” tem relações 3, 9 e 0 com eles.', 'Qual a importância do rastreio?', 5 * 3 + 3 * 9 + 4 * 0,
      '5 × 3 + 3 × 9 + 4 × 0 = 15 + 27 + 0 = 42.', { dec: 0 }),
    Q('QFD', 'O que vai nas colunas', 'A equipe montou a casa da qualidade do novo serviço.', 'O que vai nas colunas da matriz principal?',
      ['Características técnicas mensuráveis (os “comos”)', 'Os requisitos do cliente', 'Os concorrentes', 'Os custos'],
      'Linhas: requisitos do cliente (o quê). Colunas: características técnicas (como).'),
    Q('QFD', 'Telhado', 'No telhado da casa da qualidade, “janela de entrega mais curta” e “custo por entrega menor” estão marcados com conflito.', 'O que isso indica?',
      ['Melhorar uma característica tende a piorar a outra: é preciso equilibrar', 'As duas melhoram juntas', 'Não há relação', 'Erro de preenchimento'],
      'O telhado mostra correlações entre os “comos”, inclusive trade-offs.'),
    Q('QFD', 'Prioridade do projeto', 'A casa da qualidade terminou com importâncias: janela de entrega 58, rastreio 42, embalagem reforçada 36.', 'Onde concentrar o esforço de projeto?',
      ['Janela de entrega', 'Embalagem reforçada', 'Rastreio', 'Nos três igualmente'],
      'A maior importância técnica indica o que mais atende aos requisitos do cliente, ponderados.'),

    // ---- 3.3 Liderança de Programa
    Q('Portfólio de projetos', 'Bom candidato', 'Há quatro propostas de projeto.', 'Qual é o melhor candidato a projeto Black Belt?',
      ['Prazo de entrega no CD BH: problema medido, causa desconhecida, ligado à meta anual', 'Trocar as lâmpadas do galpão: solução já definida', 'Melhorar o clima da equipe, sem indicador', 'Comprar um software porque o concorrente comprou'],
      'Problema medido, causa desconhecida e ligação com a estratégia caracterizam um bom projeto.'),
    N('Portfólio de projetos', 'Matriz de seleção', 'Pesos: financeiro 3, cliente 3, estratégia 2, facilidade 2. O projeto “Prazo no CD BH” recebeu notas 4, 5, 5 e 3.', 'Qual a pontuação total?', 4 * 3 + 5 * 3 + 5 * 2 + 3 * 2,
      '4 × 3 + 5 × 3 + 5 × 2 + 3 × 2 = 12 + 15 + 10 + 6 = 43.', { dec: 0 }),
    K('Portfólio de projetos', 'Tipo de projeto', 'O comitê classifica as demandas pelo tipo de abordagem.', 'Classifique cada demanda.', ['Ação imediata', 'Kaizen', 'Projeto Green Belt', 'Projeto Black Belt'],
      [['Lâmpada queimada na doca', 0], ['Desorganização da bancada de embalagem', 1], ['Erros de etiqueta no CD SP, causa desconhecida', 2], ['Variação do prazo entre 5 CDs com muitos fatores', 3]],
      'O tamanho do método acompanha a complexidade: de ação imediata a projeto Black Belt.'),
    // Ganho financeiro
    N('Ganho financeiro', 'Ganho anual', 'O erro caiu de 1,2% para 0,4% em 600 mil pedidos por ano. Cada erro custa R$ 52. O projeto gastou R$ 40 mil.', 'Qual o ganho líquido no primeiro ano (R$)?', (0.012 - 0.004) * 600000 * 52 - 40000,
      'Ganho bruto = 0,008 × 600.000 × 52 = R$ 249.600; líquido = R$ 209.600.', { unit: 'R$', dec: 0 }),
    K('Ganho financeiro', 'Categoria do custo', 'A controladoria está montando o custo da má qualidade (COPQ).', 'Classifique cada custo.', ['Prevenção', 'Avaliação', 'Falha interna', 'Falha externa'],
      [['Treinamento de conferentes', 0], ['Inspeção por amostragem na expedição', 1], ['Reembalar caixas rasgadas antes do envio', 2], ['Frete de reenvio ao cliente', 3], ['Poka-yoke na impressora', 0], ['Multa por atraso contratual', 3]],
      'Prevenção evita; avaliação encontra; falha interna aparece antes do cliente; falha externa chega a ele.'),
    Q('Ganho financeiro', 'Ganho duro ou suave?', 'O projeto liberou 44 horas por dia de conferência, mas ninguém foi remanejado e não houve redução de custo.', 'Como classificar esse ganho?',
      ['Ganho suave (capacidade liberada), até ser convertido em caixa', 'Ganho duro já realizado', 'Prejuízo', 'Não é ganho'],
      'Capacidade liberada é ganho suave. Vira duro quando reduz custos ou absorve crescimento sem contratar.'),
    // Gestão da mudança
    Q('Gestão da mudança', 'Resistência', 'Os conferentes resistem ao leitor de código: “sempre fizemos no olho e funcionava”.', 'Qual o primeiro passo do ADKAR?',
      ['Gerar consciência: mostrar os dados de erro e o impacto no cliente', 'Obrigar o uso imediatamente', 'Trocar a equipe', 'Desistir da solução'],
      'Consciência (por que mudar) vem antes de desejo, conhecimento e habilidade.'),
    K('Gestão da mudança', 'Mapa de stakeholders', 'O Black Belt mapeou os envolvidos pelo poder e pelo interesse.', 'Classifique a estratégia para cada um.', ['Gerenciar de perto', 'Manter satisfeito', 'Manter informado', 'Monitorar'],
      [['Gerente do CD (alto poder, alto interesse)', 0], ['Diretor financeiro (alto poder, baixo interesse)', 1], ['Conferentes (baixo poder, alto interesse)', 2], ['Área de marketing (baixo poder, baixo interesse)', 3]],
      'Poder e interesse definem o nível de envolvimento de cada grupo.'),
    Q('Gestão da mudança', 'Mentoria', 'Um Green Belt mentorado pergunta ao Black Belt qual a causa raiz do problema dele.', 'Qual a melhor resposta de um mentor?',
      ['Perguntar quais dados ele já tem e quais hipóteses testou', 'Dizer a causa e encerrar', 'Fazer a análise por ele', 'Mandar estudar sozinho'],
      'Mentoria desenvolve o raciocínio com perguntas e revisão, sem tirar do mentorado a autoria do projeto.'),
    // Programa (Hoshin e visão MBB)
    Q('Programa', 'Indicador do programa', 'A diretoria quer acompanhar o sucesso do programa Lean Six Sigma.', 'Qual indicador é mais relevante?',
      ['Ganho anual validado pelos projetos concluídos', 'Número de pessoas que assistiram à palestra', 'Quantidade de cartazes nos corredores', 'Horas de reunião'],
      'O programa existe para gerar resultado; mede-se ganho validado e projetos concluídos.'),
    O('Programa', 'Desdobramento', 'O Master Black Belt vai desdobrar a estratégia em projetos.', 'Coloque os níveis na ordem, do mais amplo ao mais específico.',
      ['Visão de 3 a 5 anos', 'Objetivo anual da empresa', 'Meta da área de operações', 'Projeto DMAIC do CD', 'Indicador semanal do projeto'],
      'Do estratégico ao operacional: visão, objetivo anual, meta da área, projeto e indicador.'),
    Q('Programa', 'Prioridades demais', 'O plano anual tem 38 prioridades “críticas” para o CD.', 'Qual o princípio do Hoshin Kanri violado?',
      ['Foco em poucas prioridades', 'Catchball', 'Revisão mensal', 'Uso de indicadores'],
      'Se tudo é prioridade, nada é. O Hoshin concentra esforço em poucas frentes.'),
    // Desafio final
    O('Desafio final', 'O projeto completo', 'Desafio final: você vai liderar o projeto de pedidos com problema do início ao fim.', 'Coloque as etapas na ordem.',
      ['Carta de projeto com meta e caso de negócio', 'MSA e linha de base de 3.000 DPMO', 'Pareto, testes de hipótese e causas comprovadas', 'Solução em piloto, DOE de ajuste e poka-yoke', 'Carta p, plano de controle e ganho validado', 'Entrega ao dono do processo'],
      'É o DMAIC completo, com cada ferramenta no seu momento.'),
    N('Desafio final', 'Novo nível sigma', 'Desafio final: depois do projeto, 5.000 pedidos (4 oportunidades cada) tiveram 20 defeitos.', 'Qual o novo DPMO?', r(C.dpmo(20, 5000, 4), 0),
      'DPMO = 20 ÷ 20.000 × 1.000.000 = 1.000 (≈ 4,6σ), contra 3.000 na linha de base.', { dec: 0, unit: 'DPMO' }),
    M('Desafio final', 'Plano de controle', 'Desafio final: o projeto atingiu a meta e vai ser entregue.', 'Marque todos os itens que devem constar no plano de controle.',
      ['Indicador e frequência de medição', 'Limites de reação e o que fazer quando estourar', 'Responsável por cada controle', 'Lista de ideias rejeitadas na fase Analisar', 'Fotos da festa de encerramento'], [0, 1, 2],
      'O plano de controle diz o que medir, quando reagir, como reagir e quem é o responsável.'),
    Q('Desafio final', 'A carta do ano', 'Desafio final: a carta mostra o % de pedidos com problema mês a mês durante os ciclos de melhoria.', 'Qual a leitura correta?',
      ['O processo mudou de patamar; recalcule os limites com os dados do novo processo', 'O processo está piorando', 'Nada mudou', 'Os dados estão errados'],
      'Os meses iniciais acima da média e os finais abaixo mostram mudança de patamar causada pelas melhorias.', { d: { type: 'control', pts: [1.2, 1.15, 1.25, 1.18, 0.9, 0.85, 0.88, 0.82, 0.45, 0.42, 0.40, 0.38], lim: { lc: 0.8, lsc: 1.45, lic: 0.15 }, labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'], unit: '%', d: 2 } }),
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
        id: 's' + lv.id + '-' + String(pos).padStart(2, '0'), index: EXERCISES.length,
        level: lv.id, levelName: lv.nome, pos: pos, diff: difficulty(lv.id, pos), track: 'sixsigma',
      }));
    });
  });
  global.SSBank = { EXERCISES: EXERCISES, LEVELS: LEVELS.map(function (l) { return { id: l.id, key: l.key, nome: l.nome }; }) };
})(typeof window !== 'undefined' ? window : globalThis);
