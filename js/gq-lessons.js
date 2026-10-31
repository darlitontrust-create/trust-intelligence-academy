/* =====================================================================
   gq-lessons.js — Aulas e questões da trilha de Gestão da Qualidade
   ---------------------------------------------------------------------
   Mesmo formato das outras trilhas: carrossel de 5 slides + narração.
   O slide 3 mostra a ferramenta aplicada aos dados da NexusMarket, com o
   gráfico e os números calculados na hora pelo GQCharts.
   Questões de prova: [pergunta, correta, errada1, errada2, errada3, explicação]
   ===================================================================== */
(function (global) {
  'use strict';
  const L = {};
  const D = global.GQData;
  function lesson(key, kw, titulo, ideia, analogia, sintaxe, notas, exemplo, cuidados, quiz) {
    L[key] = { key: key, kw: kw, titulo: titulo, ideia: ideia, analogia: analogia, sintaxe: sintaxe, notas: notas, exemplo: exemplo, cuidados: cuidados, quiz: quiz };
  }

  /* =============================== NÍVEL 1 =============================== */
  lesson('qualidade', 'QUALIDADE', 'O que é qualidade',
    'Qualidade é atender (e, quando possível, superar) os requisitos do cliente de forma consistente. Juran a definiu como adequação ao uso; Crosby, como conformidade com os requisitos; Deming lembrou que a qualidade nasce do processo, não da inspeção no final.',
    'É como uma receita de bolo: o cliente julga pelo sabor, mas a qualidade foi decidida na escolha dos ingredientes, nas medidas e no forno — não na hora de provar.',
    'Cliente     → quem recebe o resultado (externo ou interno)\nRequisito   → o que ele precisa e espera\nConformidade → entregar o que foi combinado\nProcesso    → onde a qualidade é construída\nMelhoria    → reduzir variação e desperdício sempre',
    ['Cliente interno também conta: o setor seguinte é cliente do anterior.', 'Qualidade percebida combina produto, prazo, atendimento e preço.', 'Prevenir custa menos do que inspecionar e corrigir.'],
    { p: 'Os pilares da qualidade na NexusMarket:', c: '# Do que o cliente reclama hoje?\nProduto   → avarias, itens errados\nPrazo     → atrasos na entrega\nServiço   → cobrança indevida, SAC lento\n# A resposta está nos processos', fig: { type: 'cards', items: [['Deming', 'Qualidade vem do processo. 14 pontos e ciclo PDCA.'], ['Juran', 'Adequação ao uso. Trilogia: planejar, controlar, melhorar.'], ['Crosby', 'Conformidade com requisitos. Zero defeito.'], ['Ishikawa', 'Qualidade envolve todos. 7 ferramentas básicas.']], speech: 'Quatro referências ajudam a entender o tema: Deming, Juran, Crosby e Ishikawa.' } },
    ['Não confunda qualidade com luxo: um produto simples pode ter alta qualidade se atende o que promete.', 'Inspeção no final só separa o que já saiu errado; ela não melhora o processo.', 'Ouça o cliente com dados, não só com opiniões internas.'],
    [['Para Crosby, qualidade significa:', 'Conformidade com os requisitos', 'Produto de luxo', 'Inspeção de 100% dos itens', 'Menor preço do mercado', 'Crosby definiu qualidade como conformidade e defendeu o zero defeito.'],
      ['Quem é o cliente interno do setor de separação no CD?', 'O setor de conferência, que recebe os pedidos separados', 'O consumidor final apenas', 'O fornecedor de embalagens', 'A diretoria financeira', 'Cliente interno é a etapa seguinte do processo.'],
      ['Segundo Deming, onde a qualidade é construída?', 'No processo', 'Na inspeção final', 'No marketing', 'No SAC', 'Processos estáveis e capazes geram qualidade; inspeção só separa defeitos.']]);

  lesson('processos', 'SIPOC', 'Processos e SIPOC',
    'Todo trabalho é um processo: entradas viram saídas por meio de atividades. O SIPOC (Fornecedores, Entradas, Processo, Saídas, Clientes) mostra o processo numa página, com começo e fim definidos, antes de qualquer análise.',
    'É a planta baixa da casa: antes de reformar um cômodo, você precisa saber onde ele começa, onde termina e o que entra e sai por cada porta.',
    'S → Fornecedores (quem fornece)\nI → Entradas (o que é fornecido)\nP → Processo (4 a 7 macroetapas)\nO → Saídas (o que é entregue)\nC → Clientes (quem recebe)',
    ['Comece pelo P (processo) e defina o início e o fim.', 'Depois preencha saídas e clientes; por último, entradas e fornecedores.', 'Use verbos nas etapas do processo: receber, separar, conferir…'],
    { p: 'SIPOC do atendimento de um pedido online:', c: 'Início → pedido aprovado\nFim    → pedido entregue ao cliente\nEtapas → 5 macroetapas', fig: { type: 'sipoc', S: ['Cliente', 'Gateway de pagamento', 'Fornecedor de caixas'], I: ['Pedido', 'Pagamento aprovado', 'Embalagens'], P: ['Receber', 'Separar', 'Conferir', 'Embalar', 'Expedir'], O: ['Pedido entregue', 'Nota fiscal', 'Rastreio'], C: ['Consumidor', 'Financeiro', 'SAC'] } },
    ['SIPOC não é fluxograma detalhado: fique em 4 a 7 macroetapas.', 'Escopo vago gera projeto infinito; delimite início e fim.', 'Valide o SIPOC com quem executa o processo.'],
    [['O que significa o "C" do SIPOC?', 'Clientes', 'Custos', 'Controles', 'Causas', 'S-I-P-O-C: fornecedores, entradas, processo, saídas e clientes.'],
      ['Quantas macroetapas um SIPOC costuma ter?', 'Entre 4 e 7', 'Exatamente 2', 'Mais de 30', 'Apenas 1', 'É uma visão de alto nível do processo.'],
      ['Qual é o primeiro passo recomendado para montar um SIPOC?', 'Definir o processo, com início e fim', 'Listar os fornecedores', 'Calcular indicadores', 'Escolher a solução', 'O processo delimita todo o resto.']]);

  lesson('indicadores', 'KPI', 'Indicadores de desempenho',
    'Indicador é uma medida que mostra se o processo atinge o resultado esperado. Tem fórmula, unidade, meta, frequência e responsável. Eficácia mede se o resultado foi atingido; eficiência mede quanto recurso foi gasto para isso.',
    'É o painel do carro: velocímetro, combustível e temperatura não dirigem por você, mas dizem quando agir.',
    'Nome       → % de pedidos no prazo\nFórmula    = pedidos no prazo ÷ pedidos entregues × 100\nMeta       → ≥ 95%\nFrequência → semanal\nDono       → coordenador de expedição',
    ['Indicador sem meta não orienta decisão.', 'Indicador de resultado mostra o efeito; indicador de processo (tendência) antecipa o problema.', 'Prefira poucos indicadores bem definidos.'],
    { p: 'Pedidos no prazo por semana (meta 95%):', c: '% no prazo = no prazo ÷ entregues × 100\nSemana 1 = 1.180 ÷ 1.250 × 100\n# a meta é 95%', fig: { type: 'bars', labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'], series: [{ name: '% no prazo', values: [94.4, 96.1, 92.8, 95.5] }], speech: 'Calculado agora: a semana 1 ficou em 94,4%, abaixo da meta de 95%; a semana 3 foi a pior, com 92,8%.' } },
    ['Defina como medir antes de cobrar: duas áreas calculando diferente geram brigas, não melhoria.', 'Não crie metas impossíveis: elas desmotivam e estimulam maquiar dados.', 'Olhe a tendência, não só o último número.'],
    [['Qual a diferença entre eficácia e eficiência?', 'Eficácia é atingir o resultado; eficiência é usar bem os recursos', 'São sinônimos', 'Eficiência é atingir a meta; eficácia é gastar pouco', 'Eficácia só vale para produção', 'Dá para ser eficaz e ineficiente, por exemplo, batendo a meta com horas extras.'],
      ['O que um indicador precisa ter, além da fórmula?', 'Meta, frequência e responsável', 'Apenas um gráfico bonito', 'Um nome em inglês', 'Uma cor por setor', 'Sem meta e dono, o número não gera ação.'],
      ['Em uma semana, 1.180 de 1.250 pedidos chegaram no prazo. Qual o %?', '94,4%', '95,0%', '105,9%', '1,18%', '1.180 ÷ 1.250 = 0,944.']]);

  lesson('pdca', 'PDCA', 'Ciclo PDCA',
    'O PDCA é o método básico de melhoria contínua: Planejar (entender o problema, achar a causa e montar o plano), Executar (fazer o que foi planejado, treinando as pessoas), Checar (medir se o resultado veio) e Agir (padronizar o que funcionou ou corrigir o rumo e girar de novo).',
    'É como cozinhar uma receita nova: você planeja, cozinha, prova e ajusta. Se ficou bom, anota a receita; se não, muda e tenta de novo.',
    'P → Plan: problema, meta, causa raiz, plano de ação\nD → Do: executar o plano e treinar\nC → Check: comparar o resultado com a meta\nA → Act: padronizar ou corrigir e girar de novo',
    ['O P é a etapa mais longa: planejar bem evita retrabalho.', 'No C, compare com a meta usando o mesmo indicador do início.', 'No A, se deu certo, padronize; se não deu, volte ao P.'],
    { p: 'PDCA para reduzir atrasos na entrega:', c: 'P → atrasos = 39% das reclamações; meta: −30%\nD → nova janela de coleta com a transportadora\nC → atrasos caíram 34% em 8 semanas\nA → padronizar a janela em todas as lojas', fig: { type: 'cycle', center: 'PDCA', steps: [{ k: 'P', t: 'Planejar', d: 'Problema, meta, causas e plano' }, { k: 'D', t: 'Executar', d: 'Treinar e executar o plano' }, { k: 'C', t: 'Checar', d: 'Comparar o resultado com a meta' }, { k: 'A', t: 'Agir', d: 'Padronizar ou corrigir' }] } },
    ['Pular do P direto para a solução é o erro mais comum: primeiro a causa.', 'Sem o C, você não sabe se a ação funcionou.', 'Sem o A, a melhoria some com o tempo.'],
    [['Em qual etapa do PDCA se compara o resultado com a meta?', 'Check (Checar)', 'Plan (Planejar)', 'Do (Executar)', 'Act (Agir)', 'No Check você mede e compara.'],
      ['A ação funcionou e bateu a meta. O que fazer no Act?', 'Padronizar a nova forma de trabalho', 'Começar outro problema sem registrar nada', 'Voltar ao Plan com o mesmo problema', 'Descartar o indicador', 'Padronizar garante que o ganho permaneça.'],
      ['Em qual etapa se identifica a causa raiz?', 'Plan', 'Do', 'Check', 'Act', 'Análise de causas faz parte do planejamento.']]);

  lesson('5w2h', '5W2H', 'Plano de ação 5W2H',
    'O 5W2H transforma uma decisão em plano executável: o que (What), por que (Why), onde (Where), quando (When), quem (Who), como (How) e quanto custa (How much). Cada ação tem um responsável e um prazo.',
    'É a lista de uma viagem bem organizada: não basta "ir para a praia"; é preciso saber quem dirige, quando sai, por qual estrada e quanto vai gastar.',
    'What     → o que será feito\nWhy      → por que (ligação com a causa)\nWhere    → onde\nWhen     → quando (prazo)\nWho      → quem é o responsável\nHow      → como será feito\nHow much → quanto custa',
    ['Um responsável por ação: "todos" significa ninguém.', 'O Why liga a ação à causa raiz.', 'Prazo é uma data, não "o quanto antes".'],
    { p: 'Plano de ação contra itens errados nos pedidos:', c: '# ação 1 de 3\nWhat → instalar leitor de código de barras na conferência\nWho  → Carla (manutenção)\nWhen → 15/03\nHow much → R$ 4.800', fig: { type: 'table', cols: ['O quê', 'Por quê', 'Quem', 'Quando', 'Quanto'], rows: [['Leitor de código de barras na conferência', 'Conferência visual falha', 'Carla', '15/03', 'R$ 4.800'], ['Etiqueta com foto do produto', 'Itens parecidos confundem', 'Rui', '22/03', 'R$ 600'], ['Treinar separadores no novo layout', 'Endereços mudaram', 'Ana', '29/03', 'R$ 0']], speech: 'O plano tem três ações, cada uma com responsável, prazo e custo.' } },
    ['Não use o 5W2H antes de conhecer a causa: vira lista de desejos.', 'Acompanhe o plano em reuniões curtas e frequentes.', 'Ações vagas como "melhorar a comunicação" não são executáveis.'],
    [['O que o "Who" do 5W2H define?', 'O responsável pela ação', 'O cliente afetado', 'O custo da ação', 'O local da ação', 'Who = quem fará.'],
      ['Qual destes é um prazo bem definido?', '15/03', 'O quanto antes', 'Em breve', 'Quando der', 'Prazo é uma data verificável.'],
      ['O "Why" de cada ação deve ligar a ação a:', 'A causa raiz que ela ataca', 'O orçamento do ano', 'O cargo do responsável', 'A cor do relatório', 'Ação sem ligação com a causa é palpite.']]);

  lesson('brainstorm', 'BRAINSTORM', 'Brainstorming e priorização de ideias',
    'Brainstorming gera muitas ideias em pouco tempo, sem julgamento na hora. Depois, as ideias são agrupadas (diagrama de afinidade) e priorizadas, por exemplo com multivotação: cada pessoa distribui alguns votos entre as ideias.',
    'É abrir todas as gavetas antes de arrumar o armário: primeiro se tira tudo para fora, depois se organiza e se decide o que fica.',
    'Regra 1 → quantidade antes de qualidade\nRegra 2 → nenhuma crítica durante a geração\nRegra 3 → pegar carona nas ideias dos outros\nDepois   → agrupar por afinidade\nDepois   → priorizar (multivotação)',
    ['Defina bem a pergunta antes de começar.', 'Um facilitador garante a palavra para todos.', 'Ideias são hipóteses: valide com dados depois.'],
    { p: 'Multivotação de ideias contra avarias (8 pessoas, 3 votos cada):', c: 'Votos = 8 pessoas × 3 = 24\n# as ideias mais votadas seguem para validação', fig: { type: 'bars', labels: ['Caixa com divisória', 'Treino de empilhamento', 'Climatizar galpão', 'Novo fornecedor de caixa', 'Selo frágil'], series: [{ name: 'Votos', values: [8, 6, 5, 3, 2] }], speech: 'Calculado agora: as três ideias mais votadas somam 19 dos 24 votos.' } },
    ['Chefe falando primeiro inibe o grupo.', 'Brainstorming não substitui dados: use para gerar hipóteses.', 'Registre todas as ideias, inclusive as estranhas.'],
    [['Qual regra vale durante a geração de ideias?', 'Não criticar nenhuma ideia', 'Escolher só ideias baratas', 'O líder decide na hora', 'Votar a cada ideia', 'Crítica na geração reduz a quantidade e a criatividade.'],
      ['Que ferramenta agrupa ideias parecidas depois do brainstorming?', 'Diagrama de afinidade', 'Carta de controle', 'OEE', 'Histograma', 'O diagrama de afinidade organiza as ideias em grupos.'],
      ['Na multivotação, 8 pessoas com 3 votos cada distribuem quantos votos?', '24', '11', '8', '3', '8 × 3 = 24.']]);

  lesson('folha', 'FOLHA', 'Folha de verificação',
    'A folha de verificação é um formulário simples para coletar dados no local, do mesmo jeito por todos. Registra quantas vezes cada tipo de ocorrência acontece, onde e quando, e já deixa os dados prontos para Pareto e estratificação.',
    'É o placar do jogo: cada gol é anotado na hora, com o minuto e o autor, para ninguém discutir depois.',
    'Defina o objetivo → o que você quer descobrir\nDefina as categorias → tipos de defeito\nDefina o período → quando coletar\nDefina quem coleta → e como marca\nColete → um tracinho por ocorrência',
    ['Categorias claras e mutuamente exclusivas.', 'Inclua quando e onde (dia, turno, setor) para estratificar.', 'Teste a folha um dia antes de usar.'],
    { p: 'Defeitos de embalagem anotados por turno numa semana:', c: '# um tracinho por ocorrência\nAmassado  → manhã 12, tarde 9, noite 21\nRasgado   → manhã 4, tarde 5, noite 8\nSem lacre → manhã 3, tarde 2, noite 6', fig: { type: 'bars', labels: ['Amassado', 'Rasgado', 'Sem lacre'], series: [{ name: 'Manhã', values: [12, 4, 3] }, { name: 'Tarde', values: [9, 5, 2] }, { name: 'Noite', values: [21, 8, 6] }], speech: 'Calculado agora: o turno da noite concentra 35 dos 70 defeitos, a metade.' } },
    ['Folha complexa demais não é preenchida.', 'Categoria "outros" grande indica que faltam categorias.', 'Combine o critério de cada defeito com quem coleta.'],
    [['Para que serve a folha de verificação?', 'Coletar dados de forma padronizada no local', 'Calcular o Cpk', 'Definir metas da empresa', 'Desenhar o processo', 'É a base de dados para as outras ferramentas.'],
      ['Por que incluir turno e dia na folha?', 'Para depois estratificar os dados', 'Para deixar a folha mais bonita', 'Porque é obrigatório por lei', 'Para calcular o salário', 'Saber quando e onde ajuda a achar a causa.'],
      ['A categoria "outros" ficou com 40% das marcas. O que isso indica?', 'Faltam categorias na folha', 'O processo está ótimo', 'O coletor errou as contas', 'Deve-se ignorar esses dados', 'Revise as categorias para que os dados sejam úteis.']]);

  lesson('estrat', 'ESTRATIFICAR', 'Estratificação',
    'Estratificar é separar os dados por grupos (turno, loja, fornecedor, produto, dia) para ver onde o problema se concentra. Um total que parece uniforme pode esconder um grupo muito pior que os outros.',
    'É procurar a goteira separando o telhado em partes: olhar a casa inteira molhada não diz de onde vem a água.',
    'Problema   → avarias no CD\nEstratos   → turno | transportadora | categoria\nPergunta   → em qual grupo se concentra?\nResultado  → foco da análise de causas',
    ['Planeje os estratos antes de coletar.', 'Compare taxas, não só quantidades: grupos maiores têm mais ocorrências.', 'Combine com Pareto para ver o grupo dominante.'],
    { p: 'Avarias por transportadora (taxa por 1.000 entregas):', c: 'Taxa = avarias ÷ entregas × 1.000\nRápidaLog = 54 ÷ 6.000 × 1.000 = 9\nViaSul    = 48 ÷ 2.000 × 1.000 = 24', fig: { type: 'bars', labels: ['RápidaLog', 'ViaSul', 'Expressa Norte'], series: [{ name: 'Avarias por 1.000', values: [9, 24, 7.5] }], speech: 'Calculado agora: a ViaSul tem 24 avarias a cada mil entregas, quase três vezes a RápidaLog.' } },
    ['Quantidade absoluta engana: normalize pela base.', 'Estratos demais deixam grupos com poucos dados.', 'Estratificação mostra onde, não por quê.'],
    [['A loja A teve 30 devoluções em 3.000 vendas; a B, 20 em 500. Qual está pior?', 'A loja B (4% contra 1%)', 'A loja A, porque teve mais devoluções', 'As duas iguais', 'Não dá para saber', 'Compare taxas: 20 ÷ 500 = 4%; 30 ÷ 3.000 = 1%.'],
      ['O que a estratificação revela?', 'Onde o problema se concentra', 'A causa raiz com certeza', 'O custo da solução', 'O responsável pela falha', 'Ela aponta o foco; a causa vem da análise seguinte.'],
      ['Qual destes é um bom critério de estratificação?', 'Turno de trabalho', 'Cor do uniforme', 'Nome do analista', 'Fonte do relatório', 'Turno, local, fornecedor e produto são estratos comuns.']]);

  lesson('pareto', 'PARETO', 'Diagrama de Pareto',
    'O princípio de Pareto diz que poucas causas (os poucos vitais) concentram a maior parte dos efeitos — a famosa regra 80/20. O diagrama ordena as categorias da maior para a menor e mostra o percentual acumulado, para focar onde o ganho é maior.',
    'É arrumar a mochila pesada: tirar as duas pedras grandes alivia mais do que tirar vinte pedrinhas.',
    'Passo 1 → contar ocorrências por categoria\nPasso 2 → ordenar da maior para a menor\nPasso 3 → % de cada = categoria ÷ total\nPasso 4 → % acumulado = soma dos % até ali\nPasso 5 → poucos vitais = até ~80% acumulado',
    ['"Outros" vai sempre no fim, mesmo que seja maior que alguma categoria.', 'Pode ser feito por quantidade ou por custo: o Pareto por custo pode mudar a prioridade.', 'Um Pareto de segundo nível detalha a maior barra.'],
    { p: 'Pareto das reclamações do SAC no trimestre:', c: 'Total = 360 reclamações\nAtraso    = 142 → 39,4% → acumulado 39,4%\nAvariado  =  88 → 24,4% → acumulado 63,9%\nItem errado = 61 → 16,9% → acumulado 80,8%', fig: { type: 'pareto', items: D.reclamacoes } },
    ['Não aplique o 80/20 como lei exata: é uma tendência.', 'Pareto com dados de período curto pode enganar.', 'Depois de resolver a maior barra, refaça o Pareto: a ordem muda.'],
    [['O que o Pareto ajuda a definir?', 'Em quais categorias focar primeiro', 'A causa raiz de cada problema', 'O desvio padrão do processo', 'O cronograma do projeto', 'Ele prioriza pelo tamanho do impacto.'],
      ['Com 360 reclamações e 142 de atraso, qual o % de atraso?', '39,4%', '14,2%', '36,0%', '71,0%', '142 ÷ 360 = 0,394.'],
      ['Onde fica a categoria "Outros" no Pareto?', 'Sempre no final', 'Sempre no começo', 'No meio', 'Fora do gráfico', 'Outros agrupa itens pequenos e diversos; fica por último.']]);

  lesson('ishikawa', '6M', 'Diagrama de Ishikawa (causa e efeito)',
    'O diagrama de Ishikawa, ou espinha de peixe, organiza as causas possíveis de um efeito em categorias. As mais usadas são os 6M: Método, Máquina, Mão de obra, Material, Medida e Meio ambiente.',
    'É um mapa de investigação: em vez de suspeitar só do primeiro culpado, você vasculha todos os cômodos da casa.',
    'Cabeça     → o efeito (o problema, bem definido)\nEspinhas   → Método, Máquina, Mão de obra\n             Material, Medida, Meio ambiente\nEspinhas menores → causas e subcausas\nDepois     → votar e validar as causas mais prováveis',
    ['Escreva o efeito como um fato mensurável.', 'Cada causa é uma hipótese: valide com dados antes de agir.', 'Use os 5 porquês para aprofundar as causas escolhidas.'],
    { p: 'Causas possíveis de produtos avariados na entrega:', c: 'Efeito → 88 avarias no trimestre\nMétodo → empilhamento sem padrão\nMaterial → caixa de papelão fraca\nMeio ambiente → calor acima de 32 °C', fig: { type: 'ishikawa', effect: 'Produto avariado na entrega', cats: { 'Método': ['Empilhamento sem padrão', 'Sem calço na carga'], 'Máquina': ['Esteira com degrau', 'Empilhadeira brusca'], 'Mão de obra': ['Temporários sem treino', 'Pressa no pico'], 'Material': ['Caixa fraca', 'Falta de plástico bolha'], 'Medida': ['Sem teste de queda', 'Peso não conferido'], 'Meio ambiente': ['Calor no galpão', 'Umidade'] } } },
    ['Não transforme o diagrama em lista de culpados: o foco é o processo.', 'Causas muito genéricas ("falta de atenção") não ajudam: aprofunde.', 'Envolva quem conhece o processo de perto.'],
    [['O que vai na "cabeça" do peixe?', 'O efeito, ou problema, analisado', 'A solução escolhida', 'O nome do responsável', 'O indicador de custo', 'As espinhas apontam para o efeito.'],
      ['"Caixa de papelão fraca" pertence a qual M?', 'Material', 'Método', 'Máquina', 'Medida', 'Insumos e matérias-primas são Material.'],
      ['"Calor no galpão" pertence a qual M?', 'Meio ambiente', 'Mão de obra', 'Medida', 'Método', 'Condições do ambiente: temperatura, umidade, iluminação.']]);

  lesson('porques', '5 PORQUÊS', 'Os 5 Porquês',
    'Os 5 porquês aprofundam uma causa perguntando "por quê?" repetidas vezes, até chegar à causa raiz: aquela que, eliminada, impede o problema de voltar. Cinco é uma referência, não uma regra fixa.',
    'É a criança curiosa que não se contenta com a primeira resposta — e acaba descobrindo o motivo de verdade.',
    'Problema → item errado no pedido\nPor quê 1 → separador pegou o produto vizinho\nPor quê 2 → produtos parecidos em endereços lado a lado\nPor quê 3 → endereçamento não considera similaridade\nPor quê 4 → não há regra de layout para itens parecidos\nCausa raiz → falta padrão de endereçamento',
    ['A causa raiz costuma ser um processo ou padrão ausente, não uma pessoa.', 'Teste o caminho de volta: "portanto…" deve fazer sentido.', 'Cada resposta deve ser um fato verificável.'],
    { p: 'Cadeia dos porquês para itens errados:', c: '# teste de volta: sem padrão de layout\n# → itens parecidos ficam juntos\n# → separador confunde\n# → item errado', fig: { type: 'flow', steps: [{ t: 'start', label: 'Item errado no pedido' }, { t: 'proc', label: 'Por quê? Pegou o produto vizinho' }, { t: 'proc', label: 'Por quê? Produtos parecidos lado a lado' }, { t: 'proc', label: 'Por quê? Endereço ignora similaridade' }, { t: 'end', label: 'Causa raiz: falta padrão de layout' }] } },
    ['Parar em "erro humano" esconde a causa de processo.', 'Um efeito pode ter mais de uma cadeia de porquês.', 'Valide a causa raiz antes de investir na solução.'],
    [['Quando parar de perguntar "por quê"?', 'Quando chegar a uma causa que, eliminada, impede a volta do problema', 'Sempre exatamente na quinta pergunta', 'Quando achar um culpado', 'Na primeira resposta', 'Cinco é referência; o critério é a causa raiz.'],
      ['Qual resposta indica que a análise parou cedo demais?', '"Foi falta de atenção do funcionário"', '"Não existe padrão de endereçamento"', '"O procedimento não prevê conferência"', '"O sistema não bloqueia o erro"', 'Erro humano costuma ter uma causa de processo por trás.'],
      ['Como testar a cadeia dos porquês?', 'Lendo de trás para frente com "portanto"', 'Contando quantas perguntas foram feitas', 'Pedindo aprovação da diretoria', 'Calculando o OEE', 'A lógica deve funcionar nos dois sentidos.']]);

  lesson('histograma', 'HISTOGRAMA', 'Histograma',
    'O histograma mostra como os dados se distribuem: agrupa valores em faixas (classes) e conta quantos caem em cada uma. Revela o centro, a dispersão, a forma (simétrica, assimétrica, com dois picos) e quanto está fora da especificação.',
    'É empilhar as pessoas de uma sala por altura em colunas: de longe você já vê a altura mais comum e se há gente muito alta ou muito baixa.',
    'Passo 1 → coletar pelo menos 30 a 50 valores\nPasso 2 → definir a largura das classes\nPasso 3 → contar valores por classe\nPasso 4 → desenhar as barras coladas\nPasso 5 → marcar os limites de especificação',
    ['Dois picos sugerem dois processos misturados (dois turnos, duas máquinas).', 'Compare a largura da distribuição com a especificação.', 'Classes largas ou estreitas demais escondem a forma.'],
    { p: 'Tempo de separação de 40 pedidos (limite: 12 min):', c: 'Classes de 1 min a partir de 6 min\nLSE = 12 min\nFora = valores acima de 12', fig: { type: 'hist', values: D.separacao, bin: 1, from: 6, lse: 12, xlab: 'Tempo de separação (min)' } },
    ['Poucos dados geram histogramas enganosos.', 'Histograma não mostra a ordem no tempo: use também uma carta de controle.', 'Especificação vem do cliente; limite de controle vem do processo.'],
    [['O que um histograma com dois picos costuma indicar?', 'Mistura de dois processos ou grupos', 'Processo perfeito', 'Erro de digitação', 'Que a média é zero', 'Estratifique para separar os grupos.'],
      ['O que o histograma NÃO mostra?', 'A ordem dos dados no tempo', 'A dispersão', 'A forma da distribuição', 'Os valores fora da especificação', 'Para o tempo, use carta de controle ou gráfico de sequência.'],
      ['Quantos valores são recomendados, no mínimo, para um histograma?', 'Cerca de 30 a 50', '3', '5', '1', 'Com poucos dados a forma não é confiável.']]);

  lesson('dispersao', 'DISPERSÃO', 'Diagrama de dispersão',
    'O diagrama de dispersão mostra a relação entre duas variáveis, uma em cada eixo. Ajuda a testar hipóteses do Ishikawa: se a causa suspeita cresce junto com o efeito, há correlação. O coeficiente r vai de −1 a 1.',
    'É colocar a temperatura do dia ao lado das vendas de sorvete: os pontos sobem juntos e a relação aparece na hora.',
    'X → variável suspeita (causa)\nY → efeito\nr próximo de 1  → correlação positiva forte\nr próximo de −1 → correlação negativa forte\nr próximo de 0  → sem relação linear',
    ['Correlação não prova causalidade: confirme com teste ou experimento.', 'Um ponto muito fora pode distorcer o r.', 'Relações curvas podem ter r baixo e ainda assim existir.'],
    { p: 'Temperatura do galpão × avarias por dia:', c: 'X = temperatura (°C)\nY = avarias no dia\nr  = calculado agora', fig: { type: 'scatter', pairs: D.temperatura, xlab: 'Temperatura do galpão (°C)', ylab: 'Avarias/dia' } },
    ['Sorvete e afogamentos crescem juntos por causa do verão: cuidado com a terceira variável.', 'Use dados do mesmo período e da mesma unidade.', 'Ação só depois de entender o mecanismo.'],
    [['r = −0,9 indica:', 'Correlação negativa forte', 'Nenhuma relação', 'Correlação positiva fraca', 'Erro de cálculo', 'Quando X sobe, Y cai de forma consistente.'],
      ['Correlação forte entre X e Y prova que X causa Y?', 'Não, pode haver uma terceira variável', 'Sim, sempre', 'Só se r for positivo', 'Só com mais de 10 pontos', 'Correlação é indício, não prova.'],
      ['Em qual eixo se coloca a causa suspeita?', 'No eixo X', 'No eixo Y', 'Nos dois', 'Não tem eixo', 'Por convenção, X é a variável explicativa.']]);

  lesson('fluxograma', 'FLUXOGRAMA', 'Fluxograma',
    'O fluxograma desenha a sequência real das atividades, com início, fim, decisões e retornos. Mostra onde há esperas, retrabalho, aprovações desnecessárias e passagens de bastão entre áreas.',
    'É o mapa do metrô: você enxerga as estações, as baldeações e onde todo mundo se perde.',
    'Oval      → início e fim\nRetângulo → atividade\nLosango   → decisão (sim/não)\nSeta      → sentido do fluxo\n# desenhe o processo como ele é, não como deveria ser',
    ['Caminhe pelo processo (gemba) para desenhar o real.', 'Losangos em excesso sinalizam burocracia ou retrabalho.', 'Use raias para mostrar as áreas envolvidas.'],
    { p: 'Fluxo da conferência de pedidos:', c: 'Início → pedido separado\nDecisão → conferência ok?\nNão → volta para a separação (retrabalho)\nFim → pedido liberado para embalar', fig: { type: 'flow', steps: [{ t: 'start', label: 'Pedido separado' }, { t: 'proc', label: 'Conferir itens com a nota' }, { t: 'dec', label: 'Itens corretos?', no: 'Volta à separação' }, { t: 'proc', label: 'Liberar para embalagem' }, { t: 'end', label: 'Pedido pronto' }] } },
    ['Desenhar o processo ideal esconde os problemas.', 'Detalhe demais vira um mapa ilegível: ajuste o nível.', 'Valide com quem executa.'],
    [['Qual símbolo representa uma decisão?', 'Losango', 'Oval', 'Retângulo', 'Círculo pequeno', 'O losango tem saídas Sim e Não.'],
      ['O fluxograma deve mostrar o processo:', 'Como ele é realmente feito', 'Como o manual diz', 'Como a diretoria imagina', 'Como o concorrente faz', 'O processo real revela desperdícios.'],
      ['Um retorno "Não → volta à separação" indica:', 'Retrabalho', 'Agregação de valor', 'Inspeção desnecessária sempre', 'Fim do processo', 'Retornos são retrabalho, um desperdício.']]);

  lesson('5s', '5S', 'Programa 5S',
    'O 5S organiza o ambiente de trabalho: Seiri (utilização: separar o necessário), Seiton (ordenação: um lugar para cada coisa), Seisō (limpeza: limpar e inspecionar), Seiketsu (padronização: manter as regras visíveis) e Shitsuke (disciplina: tornar hábito).',
    'É organizar a cozinha: jogar fora o que não usa, deixar as panelas à mão, limpar enquanto cozinha, combinar as regras com a família e manter todo dia.',
    'Seiri    → separar e descartar o desnecessário\nSeiton   → definir lugar e identificar\nSeisō    → limpar e inspecionar\nSeiketsu → padronizar e controlar visualmente\nShitsuke → disciplina e auditoria',
    ['A ordem importa: não adianta organizar o que deveria ser descartado.', 'Etiqueta vermelha marca itens a avaliar no Seiri.', 'Auditorias periódicas sustentam o programa.'],
    { p: 'Auditoria 5S do CD (nota de 0 a 5 por senso):', c: '# meta: nota ≥ 4 em todos os sensos\nSeiri = 4,2 | Seiton = 3,1 | Seisō = 3,8\nSeiketsu = 2,6 | Shitsuke = 2,9', fig: { type: 'bars', labels: ['Seiri', 'Seiton', 'Seisō', 'Seiketsu', 'Shitsuke'], series: [{ name: 'Nota', values: [4.2, 3.1, 3.8, 2.6, 2.9] }], speech: 'Calculado agora: só o Seiri bate a meta de 4; o ponto mais fraco é o Seiketsu, a padronização.' } },
    ['5S não é mutirão de limpeza: é sistema de gestão.', 'Sem padronização e disciplina, tudo volta ao que era.', 'Fotos de antes e depois ajudam a engajar.'],
    [['Qual senso trata de "um lugar para cada coisa e cada coisa em seu lugar"?', 'Seiton (ordenação)', 'Seiri (utilização)', 'Seisō (limpeza)', 'Shitsuke (disciplina)', 'Seiton define endereços e identificação.'],
      ['Qual o primeiro senso a aplicar?', 'Seiri, separar o necessário', 'Seiton', 'Shitsuke', 'Seiketsu', 'Primeiro se descarta, depois se organiza.'],
      ['O que garante que o 5S não se perca com o tempo?', 'Padronização e disciplina com auditorias', 'Uma grande faxina anual', 'Comprar armários novos', 'Mudar o layout todo mês', 'Seiketsu e Shitsuke sustentam os três primeiros sensos.']]);

  lesson('gut', 'GUT', 'Matriz GUT',
    'A matriz GUT prioriza problemas dando notas de 1 a 5 para Gravidade (impacto), Urgência (prazo para agir) e Tendência (piora se nada for feito). A prioridade é o produto G × U × T, que vai de 1 a 125.',
    'É a triagem do pronto-socorro: quem está mais grave, precisa de atendimento imediato e piora rápido é atendido primeiro.',
    'G → gravidade: 1 sem gravidade … 5 extremamente grave\nU → urgência: 1 pode esperar … 5 ação imediata\nT → tendência: 1 não muda … 5 piora rápido\nPrioridade = G × U × T',
    ['Defina a escala com exemplos antes de pontuar.', 'Pontue em grupo para reduzir o viés.', 'Empates se resolvem pela gravidade.'],
    { p: 'Priorização dos problemas do CD:', c: 'Prioridade = G × U × T\nAtrasos = 5 × 5 × 4 = 100\nEtiquetagem = 4 × 4 × 3 = 48', fig: { type: 'matrix', mode: 'gut', rows: D.gut } },
    ['GUT é subjetiva: complemente com dados (Pareto, custos).', 'Não some as notas: multiplique.', 'Reavalie periodicamente: urgência muda.'],
    [['Como se calcula a prioridade na GUT?', 'G × U × T', 'G + U + T', '(G + U) × T', 'G × U ÷ T', 'O produto amplia as diferenças entre os problemas.'],
      ['Qual a pontuação máxima possível?', '125', '15', '25', '100', '5 × 5 × 5 = 125.'],
      ['O que a Tendência avalia?', 'Se o problema piora caso nada seja feito', 'O custo da solução', 'Quantas pessoas trabalham no setor', 'O prazo do projeto', 'Tendência mede a evolução sem ação.']]);

  /* =============================== NÍVEL 2 =============================== */
  lesson('masp', 'MASP', 'MASP: Método de Análise e Solução de Problemas',
    'O MASP detalha o PDCA em 8 etapas: Identificação do problema, Observação, Análise (causas), Plano de ação, Ação, Verificação, Padronização e Conclusão. É o método clássico das empresas brasileiras para resolver problemas crônicos com dados.',
    'É o roteiro de um detetive: descrever o crime, examinar a cena, levantar suspeitos, provar quem foi e só então prender — e depois mudar a fechadura.',
    '1 Identificação → problema, histórico, perdas, meta\n2 Observação   → características, estratificação, gemba\n3 Análise      → causas (Ishikawa, 5 porquês), validação\n4 Plano        → 5W2H\n5 Ação         → executar e treinar\n6 Verificação  → comparar antes × depois\n7 Padronização → POP, treino, controles\n8 Conclusão    → lições e próximos problemas',
    ['Etapas 1 a 4 = Plan; 5 = Do; 6 = Check; 7 e 8 = Act.', 'Na Verificação, se o resultado não veio, volte à Observação.', 'A Conclusão registra o que fica para o próximo ciclo.'],
    { p: 'As 8 etapas do MASP, ligadas ao PDCA:', c: 'P → 1, 2, 3, 4\nD → 5\nC → 6\nA → 7, 8', fig: { type: 'chevrons', steps: [{ k: '1', t: 'Identificação' }, { k: '2', t: 'Observação' }, { k: '3', t: 'Análise' }, { k: '4', t: 'Plano de ação' }, { k: '5', t: 'Ação' }, { k: '6', t: 'Verificação' }, { k: '7', t: 'Padronização' }, { k: '8', t: 'Conclusão' }] } },
    ['Problema mal definido contamina todas as etapas.', 'Não pule a validação das causas na Análise.', 'Sem padronização o problema volta.'],
    [['Quantas etapas tem o MASP?', '8', '4', '5', '10', 'Identificação, Observação, Análise, Plano, Ação, Verificação, Padronização e Conclusão.'],
      ['A etapa de Verificação do MASP corresponde a qual letra do PDCA?', 'C (Check)', 'P (Plan)', 'D (Do)', 'A (Act)', 'Verificar é checar o resultado.'],
      ['Se na Verificação o resultado não foi atingido, para onde voltar?', 'Para a Observação, revendo a análise', 'Para a Conclusão', 'Para a Padronização', 'Encerrar o projeto', 'O efeito não veio: as causas não foram bem identificadas.']]);

  lesson('8d', '8D', 'Método 8D',
    'O 8D é usado para resolver problemas com clientes e fornecedores, com foco em conter o efeito rápido e eliminar a causa. D1 equipe, D2 descrição do problema, D3 contenção, D4 causa raiz, D5 ações corretivas escolhidas, D6 implementação e validação, D7 prevenção da recorrência, D8 reconhecimento da equipe.',
    'É a resposta a um vazamento: primeiro um balde embaixo (contenção), depois achar o cano furado (causa), trocar o cano e revisar a instalação para não acontecer em outro lugar.',
    'D1 → formar a equipe\nD2 → descrever o problema (5W2H, É / Não é)\nD3 → ação de contenção imediata\nD4 → causa raiz (e por que não foi detectado)\nD5 → escolher ações corretivas\nD6 → implementar e validar\nD7 → prevenir recorrência\nD8 → reconhecer a equipe',
    ['A contenção (D3) protege o cliente enquanto a causa é investigada.', 'D4 busca a causa da ocorrência e a causa da não detecção.', 'D7 estende a solução a processos parecidos.'],
    { p: 'As 8 disciplinas do 8D:', c: 'D3 → separar o lote suspeito\nD4 → causa raiz\nD7 → aplicar nos outros CDs', fig: { type: 'chevrons', steps: [{ k: 'D1', t: 'Equipe' }, { k: 'D2', t: 'Problema' }, { k: 'D3', t: 'Contenção' }, { k: 'D4', t: 'Causa raiz' }, { k: 'D5', t: 'Ações' }, { k: 'D6', t: 'Implantar' }, { k: 'D7', t: 'Prevenir' }, { k: 'D8', t: 'Reconhecer' }] } },
    ['Contenção não é solução: ela não elimina a causa.', 'Não pule o D2: problema mal descrito gera causa errada.', 'Feche o 8D só com evidência de eficácia.'],
    [['Qual disciplina do 8D trata da ação imediata para proteger o cliente?', 'D3 (contenção)', 'D1', 'D5', 'D8', 'Contenção isola o problema enquanto a causa é estudada.'],
      ['O que o D7 busca?', 'Prevenir a recorrência, inclusive em processos similares', 'Reconhecer a equipe', 'Formar a equipe', 'Descrever o problema', 'D7 padroniza e expande a solução.'],
      ['No D4, além da causa da ocorrência, o que se investiga?', 'Por que o problema não foi detectado', 'O salário da equipe', 'O preço do produto', 'A cor da embalagem', 'Causa de ocorrência e causa de não detecção.']]);

  lesson('a3', 'A3', 'Relatório A3',
    'O A3 conta a história de um problema numa única folha (tamanho A3): contexto, situação atual, meta, análise de causas, contramedidas, plano e acompanhamento. Força a síntese e serve de conversa entre quem resolve e quem orienta.',
    'É o resumo do filme num cartaz: se não cabe numa página, provavelmente a história ainda não está clara.',
    'Lado esquerdo (Plan)\n  Contexto       → por que importa\n  Situação atual → dados e fatos\n  Meta           → o que, quanto, até quando\n  Análise        → causa raiz\nLado direito (Do-Check-Act)\n  Contramedidas  → ações sobre as causas\n  Plano          → quem, quando\n  Acompanhamento → resultado e próximos passos',
    ['Leia o A3 da esquerda para a direita, de cima para baixo.', 'Gráficos simples valem mais que parágrafos.', 'O A3 é revisado várias vezes com o orientador.'],
    { p: 'Os blocos de um A3 sobre itens errados:', c: '# uma página, uma história\nMeta → reduzir itens errados de 61 para 30 por trimestre', fig: { type: 'cards', items: [['1. Contexto', '61 reclamações de item errado por trimestre.'], ['2. Situação atual', '70% vêm de 8 produtos parecidos.'], ['3. Meta', 'Cair para 30 até junho.'], ['4. Análise', 'Endereço ignora similaridade.'], ['5. Contramedidas', 'Separar itens parecidos e usar leitor.'], ['6. Acompanhamento', 'Indicador semanal de item errado.']], speech: 'O A3 organiza a história em seis blocos, do contexto ao acompanhamento.' } },
    ['A3 não é formulário para preencher: é raciocínio.', 'Meta sem número e prazo não é meta.', 'Contramedida precisa atacar uma causa da análise.'],
    [['Qual o objetivo do formato de uma página do A3?', 'Forçar a síntese e o raciocínio claro', 'Economizar papel', 'Evitar gráficos', 'Esconder dados', 'Caber numa folha obriga a priorizar o essencial.'],
      ['Onde fica a análise de causa raiz no A3?', 'No lado esquerdo, depois da meta', 'No acompanhamento', 'Fora do A3', 'No título', 'O lado esquerdo é o Plan.'],
      ['"Melhorar o processo" é uma boa meta de A3?', 'Não, falta número e prazo', 'Sim, é clara', 'Sim, se tiver gráfico', 'Só no lado direito', 'Meta: o quê, quanto e até quando.']]);

  lesson('muda', 'MUDA', 'Os 8 desperdícios do Lean',
    'Desperdício (muda) é toda atividade que consome recurso e não agrega valor para o cliente. O Lean lista 8: Transporte, Inventário (estoque), Movimentação, Espera, Superprodução, Superprocessamento, Defeitos e Talento não aproveitado (TIMWOODS).',
    'É pagar por um passeio de táxi dando voltas: o destino é o mesmo, mas você pagou pelo caminho inútil.',
    'T → Transporte de materiais\nI → Inventário em excesso\nM → Movimentação de pessoas\nW → Waiting (espera)\nO → Overproduction (superprodução)\nO → Overprocessing (superprocessamento)\nD → Defeitos e retrabalho\nS → Skills (talento não aproveitado)',
    ['Superprodução é considerado o pior: gera vários outros.', 'Transporte é material andando; movimentação é a pessoa andando.', 'Valor é o que o cliente estaria disposto a pagar.'],
    { p: 'Tempo perdido por tipo de desperdício no CD (h/semana):', c: 'Total desperdiçado = soma das barras\n# espera e movimentação lideram', fig: { type: 'pareto', items: [['Espera', 46], ['Movimentação', 38], ['Defeitos', 22], ['Transporte', 15], ['Superprocessamento', 9], ['Inventário', 6]], rot: true } },
    ['Nem toda atividade sem valor pode ser eliminada (ex.: exigências legais): reduza-as.', 'Não confunda pessoas ocupadas com fluxo eficiente.', 'Procure desperdício no gemba, não na planilha.'],
    [['Separador anda 40 metros para buscar um item. Qual desperdício?', 'Movimentação', 'Transporte', 'Inventário', 'Superprodução', 'Pessoa se deslocando é movimentação.'],
      ['Imprimir 3 vias de uma nota que ninguém lê é:', 'Superprocessamento', 'Espera', 'Defeito', 'Transporte', 'Fazer mais do que o cliente precisa.'],
      ['Qual desperdício é considerado o "pior", por gerar os outros?', 'Superprodução', 'Talento não aproveitado', 'Espera', 'Movimentação', 'Produzir antes ou além gera estoque, transporte e defeitos escondidos.']]);

  lesson('vsm', 'VSM', 'Mapeamento do fluxo de valor (VSM)',
    'O VSM desenha o caminho do pedido do início ao fim com tempos de processamento (TC) e de espera. Lead time é o tempo total; tempo de agregação de valor é a soma dos processamentos; a eficiência do ciclo (PCE) é valor ÷ lead time.',
    'É acompanhar uma encomenda pelo rastreio: ela passa poucas horas sendo movimentada e dias parada em centros de distribuição.',
    'Lead time  = soma dos TC + soma das esperas\nValor      = soma dos TC\nPCE        = valor ÷ lead time\n# PCE abaixo de 10% é comum em processos não Lean',
    ['Mapeie o estado atual andando pelo processo.', 'O estado futuro elimina esperas e etapas sem valor.', 'Ataque a maior espera primeiro.'],
    { p: 'Fluxo do pedido online, do recebimento à expedição:', c: 'Valor = 2 + 9 + 3 + 5 + 4 = 23 min\nEspera = 30 + 120 + 45 + 60 + 240 = 495 min\nLead time = 518 min\nPCE = 23 ÷ 518', fig: { type: 'vsm', steps: D.vsm } },
    ['Use tempos medidos, não estimados.', 'Não melhore uma etapa isolada: olhe o fluxo inteiro.', 'Estoques entre etapas escondem problemas.'],
    [['Como se calcula a eficiência do ciclo (PCE)?', 'Tempo de valor ÷ lead time', 'Lead time ÷ tempo de valor', 'Espera ÷ processamento', 'TC × número de etapas', 'PCE = valor agregado sobre o tempo total.'],
      ['Um processo tem 20 min de valor e 380 min de espera. Qual o lead time?', '400 min', '360 min', '20 min', '19 min', '20 + 380 = 400.'],
      ['Onde costuma estar a maior parte do lead time?', 'Nas esperas entre etapas', 'No processamento', 'Na digitação', 'Na impressão', 'O produto passa a maior parte do tempo parado.']]);

  lesson('takt', 'TAKT', 'Takt time e balanceamento',
    'Takt time é o ritmo da demanda: tempo disponível ÷ demanda. Se o takt é 2 minutos, a cada 2 minutos um pedido precisa sair. Comparando o tempo de ciclo de cada posto com o takt, vê-se o gargalo e quantas pessoas são necessárias.',
    'É o metrônomo de uma banda: todos tocam no mesmo ritmo; quem fica mais lento atrasa a música inteira.',
    'Takt = tempo disponível ÷ demanda\nPessoas = soma dos tempos de ciclo ÷ takt\nGargalo = posto com tempo de ciclo > takt\n# tempo disponível já desconta pausas e refeições',
    ['Tempo disponível desconta pausas, almoço e reuniões.', 'Arredonde o número de pessoas para cima.', 'Balancear é redistribuir tarefas para que nenhum posto passe do takt.'],
    { p: 'Postos da embalagem contra o takt (turno de 440 min, 220 pedidos):', c: 'Takt = 440 ÷ 220 = 2,0 min por pedido\nPosto 3 = 2,6 min → acima do takt (gargalo)', fig: { type: 'bars', labels: ['Posto 1', 'Posto 2', 'Posto 3', 'Posto 4'], series: [{ name: 'Tempo de ciclo (min)', values: [1.6, 1.9, 2.6, 1.2] }, { name: 'Takt (min)', values: [2, 2, 2, 2] }], speech: 'Calculado agora: o takt é de 2 minutos; o posto 3, com 2,6 minutos, é o gargalo.' } },
    ['Takt não é tempo de ciclo: um vem da demanda, o outro do processo.', 'Demanda variável exige revisar o takt.', 'Posto muito abaixo do takt gera ociosidade.'],
    [['Turno com 480 min disponíveis e demanda de 240 pedidos. Qual o takt?', '2 min', '0,5 min', '240 min', '720 min', '480 ÷ 240 = 2.'],
      ['Um posto com tempo de ciclo maior que o takt é:', 'O gargalo', 'Ocioso', 'Balanceado', 'Desnecessário', 'Ele não acompanha o ritmo da demanda.'],
      ['Soma dos tempos de ciclo = 7,3 min e takt = 2 min. Quantas pessoas?', '4 (3,65 arredondado para cima)', '3', '7', '2', '7,3 ÷ 2 = 3,65 → 4.']]);

  lesson('kaizen', 'KAIZEN', 'Kaizen e gemba',
    'Kaizen significa melhoria contínua em pequenos passos, feita por quem faz o trabalho. Um evento kaizen reúne uma equipe por poucos dias para melhorar um processo específico. Gemba é o lugar real onde o trabalho acontece: é lá que se observa e se melhora.',
    'É a academia: ninguém fica forte em um dia, mas pequenos treinos diários mudam tudo em alguns meses.',
    'Gemba     → vá ao local, observe, pergunte\nKaizen    → pequena melhoria, rápida e barata\nEvento    → 3 a 5 dias, escopo fechado, meta clara\nSustentar → padrão + acompanhamento',
    ['Gemba walk: observar e perguntar, sem culpar.', 'Ideias pequenas e frequentes somam muito.', 'Kaizen sem padrão depois volta ao estado anterior.'],
    { p: 'Resultado de um evento kaizen na conferência (min por pedido):', c: 'Antes = 4,8 min\nDepois = 3,1 min\nRedução = (4,8 − 3,1) ÷ 4,8 = 35,4%', fig: { type: 'bars', labels: ['Antes', 'Dia 1', 'Dia 3', 'Depois'], series: [{ name: 'Min por pedido', values: [4.8, 4.2, 3.5, 3.1] }], speech: 'Calculado agora: o tempo caiu de 4,8 para 3,1 minutos, uma redução de 35,4%.' } },
    ['Kaizen não é só para engenheiros: todos participam.', 'Comece pelo que está ao alcance da equipe.', 'Comemore os ganhos para manter o engajamento.'],
    [['O que significa gemba?', 'O lugar real onde o trabalho acontece', 'Um tipo de desperdício', 'Uma ferramenta estatística', 'O relatório final', 'Melhoria começa observando o trabalho real.'],
      ['Qual a característica de um kaizen?', 'Melhorias pequenas, rápidas e contínuas', 'Grandes investimentos de uma vez', 'Mudanças só anuais', 'Decisões só da diretoria', 'Pequenos passos frequentes.'],
      ['Tempo caiu de 5,0 para 3,5 min. Qual a redução?', '30%', '15%', '1,5%', '43%', '(5,0 − 3,5) ÷ 5,0 = 0,3.']]);

  lesson('sdca', 'SDCA', 'Padronização e SDCA',
    'Padronizar é registrar a melhor forma conhecida de fazer o trabalho (procedimento operacional padrão, POP) e treinar todos nela. O ciclo SDCA (Padronizar, Executar, Checar, Agir) mantém o resultado; o PDCA melhora. Sem padrão, não há base para melhorar.',
    'É a receita da avó escrita no caderno: enquanto só ela sabe, o bolo depende dela; escrita, qualquer um da família reproduz.',
    'S → Standard: definir o padrão (POP)\nD → Do: treinar e executar conforme o padrão\nC → Check: verificar se o padrão é seguido e funciona\nA → Act: corrigir desvios ou melhorar via PDCA',
    ['Um bom POP é visual, curto e escrito com quem executa.', 'Padrão não é eterno: muda quando uma melhoria é comprovada.', 'Verifique aderência ao padrão antes de culpar o padrão.'],
    { p: 'Ciclos de manutenção e de melhoria:', c: '# SDCA mantém, PDCA melhora\nSDCA → seguir o POP de embalagem\nPDCA → testar uma embalagem nova', fig: { type: 'cycle', center: 'SDCA', steps: [{ k: 'S', t: 'Padronizar', d: 'Registrar a melhor forma (POP)' }, { k: 'D', t: 'Executar', d: 'Treinar e seguir o padrão' }, { k: 'C', t: 'Checar', d: 'Aderência e resultado' }, { k: 'A', t: 'Agir', d: 'Corrigir desvios ou iniciar PDCA' }] } },
    ['POP longo e técnico demais não é lido.', 'Treinamento sem verificação não garante aderência.', 'Padrão desatualizado vira papel na gaveta.'],
    [['Qual ciclo mantém um resultado já conquistado?', 'SDCA', 'PDCA', 'DMAIC', '8D', 'SDCA = rotina; PDCA = melhoria.'],
      ['O que é um POP?', 'Procedimento operacional padrão', 'Plano de orçamento do projeto', 'Ponto de observação de processo', 'Programa de otimização de pessoas', 'Documento que descreve como executar a tarefa.'],
      ['Uma falha ocorreu e o padrão não foi seguido. Primeira ação?', 'Entender por que o padrão não foi seguido', 'Reescrever o padrão inteiro', 'Demitir o operador', 'Ignorar', 'Verifique aderência antes de mudar o padrão.']]);

  lesson('poka', 'POKA-YOKE', 'Poka-yoke (à prova de erros)',
    'Poka-yoke são dispositivos ou regras que impedem o erro de acontecer ou o detectam na hora. Podem ser de controle (bloqueiam: o sistema não deixa avançar) ou de advertência (alertam: sinal sonoro, luz). Bloquear é mais forte que avisar.',
    'É o plugue que só encaixa de um jeito, ou o carro que apita se o cinto está solto.',
    'Prevenção → torna o erro impossível (bloqueio)\nDetecção  → percebe o erro na hora (alerta)\nMétodos   → contato (forma), valor fixo (contagem), sequência\n# melhor: impedir > detectar > inspecionar depois',
    ['Ataque a causa do erro, não a pessoa.', 'Soluções simples e baratas costumam funcionar melhor.', 'Teste o dispositivo regularmente.'],
    { p: 'Poka-yokes no fluxo do pedido:', c: 'Leitor de código → bloqueia item errado na conferência\nBalança         → alerta peso diferente do previsto\nCEP obrigatório → sistema não aceita endereço incompleto', fig: { type: 'cards', items: [['Bloqueio', 'Sistema não fecha o pedido se o código lido não bate com a nota.'], ['Alerta', 'Balança apita se o peso da caixa difere mais de 3% do previsto.'], ['Sequência', 'Etiqueta só imprime depois da conferência concluída.'], ['Forma', 'Caixa com divisórias que só aceitam o item certo.']], speech: 'Quatro tipos de poka-yoke protegem o pedido: bloqueio, alerta, sequência e forma.' } },
    ['Alerta ignorado não protege: prefira bloqueio quando possível.', 'Poka-yoke desligado "para ganhar tempo" anula o ganho.', 'Combine com padronização e treino.'],
    [['O que é mais eficaz contra erros?', 'Impedir que o erro aconteça', 'Inspecionar 100% no final', 'Treinar uma vez por ano', 'Punir quem erra', 'Prevenção é o nível mais alto de poka-yoke.'],
      ['O sistema não deixa fechar o pedido sem ler o código. É um poka-yoke de:', 'Controle (bloqueio)', 'Advertência', 'Inspeção final', 'Treinamento', 'Ele impede o avanço.'],
      ['Uma luz acende quando falta um item. É um poka-yoke de:', 'Advertência (alerta)', 'Bloqueio', 'Superprodução', 'Transporte', 'Alerta avisa, mas não impede.']]);

  lesson('kanban', 'KANBAN', 'Kanban e produção puxada',
    'Kanban é um sinal visual que autoriza repor ou produzir só o que foi consumido. Num sistema puxado, a etapa seguinte "puxa" da anterior; isso limita estoques e o trabalho em andamento (WIP). Em quadros de tarefas, o kanban limita quantos itens ficam em cada coluna.',
    'É a prateleira do supermercado: o repositor só traz mais leite quando abre espaço na gôndola.',
    'Sinal      → cartão, caixa vazia ou coluna do quadro\nEmpurrado  → produz pela previsão\nPuxado     → repõe pelo consumo real\nLimite WIP → máximo de itens em andamento\nCartões    = demanda × tempo de reposição × (1 + segurança) ÷ itens por caixa',
    ['Menos WIP = menor lead time (Lei de Little).', 'Cartões em excesso escondem problemas; reduza aos poucos.', 'Kanban exige demanda relativamente estável.'],
    { p: 'Quadro kanban da equipe de melhoria (limite WIP = 3):', c: 'Lei de Little → lead time = WIP ÷ vazão\nWIP = 12 itens; vazão = 4 por semana\nLead time = 3 semanas', fig: { type: 'bars', labels: ['A fazer', 'Fazendo', 'Validando', 'Feito'], series: [{ name: 'Itens', values: [7, 3, 2, 11] }, { name: 'Limite WIP', values: [0, 3, 3, 0] }], speech: 'O quadro respeita o limite: fazendo está com 3, no limite; validando, com 2.' } },
    ['Limite de WIP que nunca é atingido não limita nada.', 'Kanban não corrige processo instável.', 'Revise o número de cartões quando a demanda muda.'],
    [['O que caracteriza um sistema puxado?', 'Repor conforme o consumo real', 'Produzir pela previsão', 'Manter estoque máximo', 'Produzir em lotes grandes', 'A etapa seguinte dispara a reposição.'],
      ['Pela Lei de Little, com WIP de 20 e vazão de 5 por dia, qual o lead time?', '4 dias', '25 dias', '100 dias', '0,25 dia', 'Lead time = WIP ÷ vazão = 20 ÷ 5.'],
      ['Para que serve o limite de WIP?', 'Evitar acúmulo de trabalho em andamento', 'Aumentar o estoque', 'Esconder gargalos', 'Medir salários', 'Menos WIP, fluxo mais rápido e problemas visíveis.']]);

  lesson('oee', 'OEE', 'OEE: eficiência global do equipamento',
    'O OEE mede quanto do tempo planejado vira produção boa. É o produto de três fatores: Disponibilidade (tempo rodando ÷ tempo planejado), Performance (ciclo ideal × produzido ÷ tempo rodando) e Qualidade (peças boas ÷ produzidas).',
    'É o aproveitamento de um ônibus: ele pode quebrar (disponibilidade), andar devagar (performance) ou levar passageiros para o lugar errado (qualidade).',
    'Disponibilidade = (planejado − paradas) ÷ planejado\nPerformance     = ciclo ideal × produzido ÷ tempo rodando\nQualidade       = (produzido − defeitos) ÷ produzido\nOEE             = D × P × Q\n# referência: 85% é considerado classe mundial',
    ['Use o mesmo tempo planejado nos três fatores.', 'Performance acima de 100% indica ciclo ideal mal definido.', 'O fator mais baixo mostra onde atacar.'],
    { p: 'OEE da linha de embalagem num turno:', c: 'Planejado = 480 min; paradas = 60 min\nCiclo ideal = 0,5 min/caixa; produzidas = 760\nDefeitos = 38\nD = 420 ÷ 480 | P = 0,5 × 760 ÷ 420 | Q = 722 ÷ 760', fig: Object.assign({ type: 'oee' }, D.oee) },
    ['OEE não compara equipamentos diferentes de forma justa.', 'Paradas planejadas (ex.: almoço) saem do tempo planejado.', 'Olhe as perdas, não só o número final.'],
    [['O OEE é o produto de quais fatores?', 'Disponibilidade, performance e qualidade', 'Custo, prazo e qualidade', 'Lead time, takt e WIP', 'Cp, Cpk e sigma', 'D × P × Q.'],
      ['Planejado 400 min, paradas 40 min. Qual a disponibilidade?', '90%', '10%', '111%', '40%', '(400 − 40) ÷ 400 = 0,9.'],
      ['Qual OEE é considerado classe mundial?', 'Cerca de 85%', '100%', '50%', '30%', 'Referência clássica de Nakajima.']]);

  lesson('smed', 'SMED', 'SMED: troca rápida',
    'SMED (troca de ferramenta em um dígito de minuto) reduz o tempo de setup. A chave é separar atividades internas (só com a máquina parada) das externas (feitas com a máquina rodando), converter internas em externas e simplificar o resto.',
    'É o pit stop da Fórmula 1: tudo o que pode ser preparado antes fica pronto; com o carro parado, só o essencial, em segundos.',
    'Etapa 1 → filmar e listar as atividades do setup\nEtapa 2 → separar internas × externas\nEtapa 3 → converter internas em externas\nEtapa 4 → simplificar as internas restantes\nEtapa 5 → padronizar o novo setup',
    ['Buscar ferramenta com a máquina parada é o desperdício clássico.', 'Kits prontos e fixações rápidas reduzem o tempo interno.', 'Setup curto permite lotes menores.'],
    { p: 'Troca de formato da linha de embalagem (min):', c: 'Antes   → 42 min com a linha parada\nDepois  → 12 min (externas feitas antes)\nRedução = (42 − 12) ÷ 42 = 71,4%', fig: { type: 'bars', labels: ['Antes', 'Separar int./ext.', 'Converter', 'Simplificar'], series: [{ name: 'Setup com linha parada (min)', values: [42, 30, 19, 12] }], speech: 'Calculado agora: o setup caiu de 42 para 12 minutos, menos 71,4%.' } },
    ['Não comece comprando equipamento: organize primeiro.', 'Registre o novo padrão de setup.', 'Meça o setup do último item bom ao primeiro item bom.'],
    [['O que é uma atividade interna no setup?', 'Só pode ser feita com a máquina parada', 'Pode ser feita com a máquina rodando', 'É feita por terceiros', 'É opcional', 'Interna exige a máquina parada.'],
      ['Separar as ferramentas antes de parar a linha é:', 'Converter uma atividade em externa', 'Superprodução', 'Atividade interna', 'Inspeção', 'Fica pronta enquanto a linha roda.'],
      ['Qual o benefício de setups curtos?', 'Permitir lotes menores e mais flexibilidade', 'Aumentar o estoque', 'Eliminar a manutenção', 'Aumentar o lead time', 'Trocas baratas viabilizam lotes pequenos.']]);

  lesson('cep', 'CEP', 'Controle estatístico: carta de controle',
    'Todo processo varia. A carta de controle separa a variação comum (natural do processo) da variação especial (um evento fora do normal). Os limites de controle são calculados a partir do próprio processo, geralmente média ± 3 desvios; na carta de valores individuais, média ± 2,66 × amplitude móvel média.',
    'É o tempo de deslocamento até o trabalho: varia uns minutos todo dia (comum), mas um acidente na estrada gera um atraso fora do padrão (especial).',
    'LC  = média dos pontos\nMR  = |ponto − ponto anterior|\nLSC = LC + 2,66 × MR médio\nLIC = LC − 2,66 × MR médio\n# ponto fora dos limites → investigar causa especial',
    ['Limite de controle (voz do processo) é diferente de especificação (voz do cliente).', 'Causa especial pede investigação pontual; causa comum pede mudar o processo.', 'Reagir a cada ponto da variação comum piora o processo.'],
    { p: 'Prazo médio de entrega diário (dias):', c: 'LC = média dos 24 dias\nLSC = LC + 2,66 × MR médio\n# o dia 14 teve greve na transportadora', fig: { type: 'control', pts: D.prazo, unit: 'dias' } },
    ['Não use a meta como limite de controle.', 'Recalcule os limites após mudanças no processo.', 'Retire o ponto especial só depois de entender e eliminar a causa.'],
    [['O que um ponto acima do LSC indica?', 'Provável causa especial a investigar', 'Variação comum', 'Que a meta foi batida', 'Erro do gráfico', 'Pontos fora dos limites são sinais de causa especial.'],
      ['De onde vêm os limites de controle?', 'Dos próprios dados do processo', 'Da especificação do cliente', 'Da meta da diretoria', 'Do concorrente', 'Limites são a voz do processo.'],
      ['Ajustar o processo a cada pequena variação comum tende a:', 'Aumentar a variação', 'Eliminar defeitos', 'Não mudar nada', 'Reduzir o custo sempre', 'É o "ajuste excessivo" descrito por Deming.']]);

  lesson('regras', 'SINAIS', 'Lendo a carta: regras de sinais',
    'Além de pontos fora dos limites, padrões não aleatórios também indicam causa especial. As regras mais usadas: 1 ponto fora dos limites; 8 pontos seguidos do mesmo lado da linha central (deslocamento); 6 pontos seguidos subindo ou descendo (tendência).',
    'É um termômetro de febre: um pico isolado chama atenção, mas a temperatura subindo um pouco a cada hora também é um aviso.',
    'Regra 1 → 1 ponto acima do LSC ou abaixo do LIC\nRegra 2 → 8 pontos seguidos do mesmo lado da média\nRegra 3 → 6 pontos seguidos subindo (ou descendo)\n# qualquer regra violada → investigar',
    ['Deslocamento sugere mudança permanente (novo fornecedor, novo turno).', 'Tendência sugere desgaste ou aprendizado.', 'Anote os eventos na carta para facilitar a investigação.'],
    { p: 'Tempo de atendimento do SAC (min) depois de trocar o sistema:', c: '# os limites vêm das 10 primeiras semanas\nRegra 2 → 8 pontos seguidos acima da média', fig: { type: 'control', pts: [6.1, 5.8, 6.3, 5.9, 6.0, 6.2, 5.7, 6.1, 5.9, 6.0, 6.4, 6.5, 6.3, 6.6, 6.4, 6.5, 6.7, 6.4, 6.6, 6.5], lim: { lc: 6.0, lsc: 7.0, lic: 5.0 }, unit: 'min' } },
    ['Usar regras demais aumenta alarmes falsos.', 'Pontos dentro dos limites também podem esconder sinais.', 'Investigue o que mudou na data em que o padrão começou.'],
    [['8 pontos seguidos acima da média, mas dentro dos limites, indicam:', 'Causa especial (deslocamento do processo)', 'Processo sob controle', 'Erro de medição sempre', 'Que os limites estão errados', 'Padrão não aleatório é sinal.'],
      ['6 pontos seguidos subindo indicam:', 'Tendência', 'Variação comum', 'Processo capaz', 'Fim do processo', 'Pode ser desgaste ou mudança gradual.'],
      ['Um processo sem nenhum sinal está:', 'Sob controle estatístico (estável)', 'Necessariamente atendendo ao cliente', 'Sem variação', 'Com defeito zero', 'Estável não significa capaz.']]);

  /* =============================== NÍVEL 3 =============================== */
  lesson('dmaic', 'DMAIC', 'Seis Sigma e o DMAIC',
    'Seis Sigma busca reduzir a variação e os defeitos com dados e estatística. O DMAIC guia o projeto: Definir (problema, cliente, escopo, meta), Medir (situação atual e sistema de medição), Analisar (causas comprovadas), Melhorar (soluções testadas) e Controlar (manter o ganho).',
    'É a reforma de uma casa com engenheiro: medir antes de quebrar paredes, testar a solução e deixar o manual de manutenção no final.',
    'D → Define: project charter, SIPOC, VOC → CTQ\nM → Measure: baseline, MSA, capabilidade\nA → Analyze: causas e testes de hipótese\nI → Improve: soluções, piloto, FMEA\nC → Control: plano de controle, CEP, padrão',
    ['Papéis: Champion (patrocina), Black Belt (lidera), Green Belt (projetos menores).', 'O charter registra problema, meta, escopo e ganho esperado.', 'DMAIC melhora processos existentes; DMADV desenha novos.'],
    { p: 'As 5 fases de um projeto Seis Sigma:', c: 'Define  → charter e meta\nMeasure → linha de base\nAnalyze → causas comprovadas\nImprove → piloto\nControl → plano de controle', fig: { type: 'chevrons', steps: [{ k: 'D', t: 'Definir' }, { k: 'M', t: 'Medir' }, { k: 'A', t: 'Analisar' }, { k: 'I', t: 'Melhorar' }, { k: 'C', t: 'Controlar' }] } },
    ['Não pule o Measure: sem linha de base, não há como provar ganho.', 'Teste a solução em piloto antes de expandir.', 'O projeto só fecha com o controle passado ao dono do processo.'],
    [['Em qual fase do DMAIC se valida o sistema de medição?', 'Measure', 'Define', 'Improve', 'Control', 'MSA faz parte do Medir.'],
      ['Quem normalmente lidera projetos Seis Sigma complexos?', 'Black Belt', 'Champion', 'White Belt', 'Cliente', 'O Champion patrocina; o Black Belt lidera.'],
      ['O project charter é elaborado em qual fase?', 'Define', 'Analyze', 'Improve', 'Control', 'Definir problema, meta e escopo.']]);

  lesson('sigma', 'SIGMA', 'DPMO, rendimento e nível sigma',
    'Para comparar processos diferentes, o Seis Sigma mede defeitos por milhão de oportunidades (DPMO). DPMO = defeitos ÷ (unidades × oportunidades por unidade) × 1.000.000. O nível sigma converte o DPMO numa escala: 6 sigma equivalem a 3,4 DPMO.',
    'É a nota padronizada de uma prova: turmas com provas de tamanhos diferentes viram comparáveis quando se olha a taxa de erro por questão.',
    'DPU   = defeitos ÷ unidades\nDPMO  = defeitos ÷ (unidades × oportunidades) × 1.000.000\nRendimento = 1 − DPMO ÷ 1.000.000\nSigma ≈ z(rendimento) + 1,5\n# 3σ ≈ 66.807 DPMO | 4σ ≈ 6.210 | 6σ = 3,4',
    ['Oportunidade é cada ponto em que um defeito pode ocorrer.', 'Inflar oportunidades melhora o sigma artificialmente.', 'O deslocamento de 1,5σ representa a variação de longo prazo.'],
    { p: 'Pedidos com erro no CD:', c: 'Unidades = 5.000 pedidos\nOportunidades = 4 por pedido (item, quantidade, endereço, nota)\nDefeitos = 120\nDPMO = 120 ÷ (5.000 × 4) × 1.000.000 = 6.000', fig: { type: 'table', cols: ['Nível sigma', 'DPMO', 'Rendimento'], rows: [['2σ', '308.538', '69,1%'], ['3σ', '66.807', '93,3%'], ['4σ', '6.210', '99,38%'], ['CD hoje ≈ 4,0σ', '6.000', '99,40%'], ['5σ', '233', '99,977%'], ['6σ', '3,4', '99,99966%']], hl: [3], speech: 'Calculado agora: 6.000 defeitos por milhão de oportunidades, cerca de 4 sigma.' } },
    ['Defina oportunidades com critério e mantenha fixo.', 'DPMO baixo com poucas unidades é instável.', 'Sigma é meio, não fim: o foco é o cliente.'],
    [['200 defeitos em 1.000 unidades com 5 oportunidades cada. Qual o DPMO?', '40.000', '200.000', '1.000', '4.000', '200 ÷ 5.000 × 1.000.000.'],
      ['Seis sigma corresponde a quantos DPMO?', '3,4', '0', '233', '6.210', 'Com o deslocamento de 1,5σ.'],
      ['Aumentar artificialmente o número de oportunidades faz o quê?', 'Melhora o sigma sem melhorar o processo', 'Piora o sigma', 'Não muda nada', 'Zera os defeitos', 'Por isso as oportunidades devem ser definidas com critério.']]);

  lesson('cpk', 'CPK', 'Capabilidade: Cp e Cpk',
    'Capabilidade compara a variação do processo com a especificação do cliente. Cp = (LSE − LIE) ÷ 6σ mostra se a largura cabe; Cpk = menor entre (LSE − média) ÷ 3σ e (média − LIE) ÷ 3σ considera também a centralização. Cpk ≥ 1,33 é a referência usual.',
    'É estacionar um carro na vaga: Cp diz se o carro é estreito o bastante para a vaga; Cpk diz se, do jeito que está estacionado, ele não encosta em nenhum lado.',
    'Cp  = (LSE − LIE) ÷ (6 × σ)\nCpu = (LSE − média) ÷ (3 × σ)\nCpl = (média − LIE) ÷ (3 × σ)\nCpk = menor(Cpu, Cpl)\n# Cpk ≥ 1,33 → capaz | < 1 → não capaz',
    ['Só calcule capabilidade de processo estável (sem causas especiais).', 'Cp alto com Cpk baixo = processo descentralizado.', 'Centralizar é mais barato que reduzir variação.'],
    { p: 'Peso da embalagem padrão (500 ± 5 g):', c: 'LIE = 495 | LSE = 505 | média = 501,5 | σ = 1,2\nCp  = 10 ÷ 7,2\nCpu = 3,5 ÷ 3,6\nCpk = menor(Cpu, Cpl)', fig: Object.assign({ type: 'normal' }, D.peso) },
    ['Use σ do processo estável, com dados suficientes.', 'Especificação errada torna o índice inútil.', 'Cpk não substitui olhar o histograma.'],
    [['Cp alto e Cpk baixo indicam:', 'Processo descentralizado', 'Processo perfeito', 'Variação muito grande', 'Erro de cálculo', 'A largura cabe, mas a média está deslocada.'],
      ['LIE 10, LSE 16, σ = 0,5. Qual o Cp?', '2,0', '1,0', '6,0', '0,5', '(16 − 10) ÷ (6 × 0,5) = 2.'],
      ['Qual a referência usual de Cpk para um processo capaz?', '≥ 1,33', '≥ 0,5', '= 0', '≥ 10', '1,33 corresponde a 4σ entre a média e o limite mais próximo.']]);

  lesson('fmea', 'FMEA', 'FMEA: análise de modos de falha',
    'O FMEA antecipa falhas: para cada etapa, lista modos de falha, efeitos e causas, e dá notas de 1 a 10 para Severidade (S), Ocorrência (O) e Detecção (D — quanto maior, mais difícil detectar). O NPR (número de prioridade de risco) = S × O × D orienta as ações.',
    'É o check-list do piloto antes de decolar: pensar no que pode falhar, quão grave seria e se alguém perceberia a tempo.',
    'Modo de falha → o que pode dar errado\nEfeito        → consequência para o cliente\nS → severidade (1 a 10)\nO → ocorrência (1 a 10)\nD → detecção (10 = quase impossível detectar)\nNPR = S × O × D (1 a 1.000)',
    ['Severidade 9 ou 10 pede ação, mesmo com NPR baixo.', 'Ações reduzem O (prevenção) ou D (detecção); S só muda com reprojeto.', 'Reavalie o NPR depois das ações.'],
    { p: 'FMEA da expedição:', c: 'NPR = S × O × D\nFrágil sem proteção = 8 × 4 × 6 = 192\nEtiqueta trocada    = 7 × 5 × 4 = 140', fig: { type: 'matrix', mode: 'fmea', rows: D.fmea } },
    ['Notas sem critério tornam o NPR arbitrário: use tabelas de escala.', 'FMEA é documento vivo: atualize após incidentes.', 'Não confie só no NPR: olhe também a severidade.'],
    [['Como se calcula o NPR?', 'S × O × D', 'S + O + D', 'S × O', '(S + O) × D', 'Número de prioridade de risco.'],
      ['No FMEA, uma nota de detecção 10 significa:', 'Falha quase impossível de detectar', 'Falha sempre detectada', 'Falha muito grave', 'Falha muito frequente', 'Detecção alta = pior.'],
      ['Qual ação normalmente reduz a severidade?', 'Mudar o projeto do produto ou processo', 'Inspecionar mais', 'Treinar o inspetor', 'Aumentar a amostra', 'Inspeção melhora a detecção, não a severidade.']]);

  lesson('ctq', 'CTQ', 'Voz do cliente, CTQ e Kano',
    'A voz do cliente (VOC) traz necessidades em linguagem do cliente ("quero receber rápido"). A árvore CTQ traduz cada necessidade em requisitos mensuráveis, críticos para a qualidade ("entrega em até 2 dias úteis em 95% dos pedidos"). O modelo Kano classifica atributos em obrigatórios, de desempenho e atrativos.',
    'É traduzir "quero um café gostoso" em temperatura, dose e tempo de extração que a barista consegue medir.',
    'VOC       → "quero receber rápido"\nDriver    → prazo de entrega\nCTQ       → entrega em até 2 dias úteis\nLimite    → 95% dos pedidos\nKano      → obrigatório | desempenho | atrativo',
    ['Obrigatório: ausência gera insatisfação, presença não encanta.', 'Desempenho: quanto mais, mais satisfação.', 'Atrativo: encanta, mas não é esperado; com o tempo vira obrigatório.'],
    { p: 'Atributos da entrega segundo o modelo Kano:', c: '# classificação por pesquisa com clientes\nProduto sem avaria → obrigatório\nPrazo menor        → desempenho\nMimo na caixa      → atrativo', fig: { type: 'cards', items: [['Obrigatório', 'Produto sem avaria; nota fiscal correta. Faltou, irrita; tem, ninguém elogia.'], ['Desempenho', 'Prazo de entrega e preço do frete. Quanto melhor, mais satisfação.'], ['Atrativo', 'Mimo na caixa, rastreio em tempo real no mapa. Encanta quem não esperava.'], ['Indiferente', 'Cor da fita da embalagem. Não muda a satisfação.']], speech: 'O modelo Kano separa os atributos da entrega em obrigatórios, de desempenho, atrativos e indiferentes.' } },
    ['CTQ sem número não é mensurável.', 'Não presuma o que o cliente quer: pergunte e meça.', 'Atrativos de hoje são obrigatórios de amanhã.'],
    [['O que é um CTQ?', 'Um requisito mensurável crítico para o cliente', 'Uma reclamação do SAC', 'Um tipo de desperdício', 'Um indicador financeiro', 'Critical to Quality.'],
      ['"Nota fiscal correta" é, no Kano, um atributo:', 'Obrigatório', 'Atrativo', 'Indiferente', 'De desempenho', 'Sua falta gera insatisfação; sua presença não encanta.'],
      ['Qual é um CTQ bem escrito?', 'Entrega em até 2 dias úteis em 95% dos pedidos', 'Entrega rápida', 'Cliente feliz', 'Melhor prazo do mercado', 'Mensurável e com limite.']]);

  lesson('msa', 'R&R', 'Sistema de medição (MSA e R&R)',
    'Antes de confiar nos dados, avalie o sistema de medição. O estudo R&R mede a repetibilidade (o mesmo avaliador mede várias vezes) e a reprodutibilidade (avaliadores diferentes medem a mesma peça). Referência: %R&R abaixo de 10% é aceitável; de 10% a 30%, depende da aplicação; acima de 30%, inaceitável.',
    'É a balança da cozinha: se ela mostra um peso diferente cada vez que você coloca o mesmo pacote, nenhuma receita vai dar certo.',
    'Repetibilidade     → mesma pessoa, mesmo item, várias vezes\nReprodutibilidade  → pessoas diferentes, mesmo item\n%R&R = variação da medição ÷ variação total\n< 10%     → aceitável\n10% a 30% → depende da aplicação\n> 30%     → inaceitável',
    ['Para dados de atributo (ok/não ok), use estudo de concordância (Kappa).', 'Calibração garante exatidão, não precisão.', 'Mude o sistema de medição antes de mudar o processo.'],
    { p: 'Estudo R&R da balança de expedição:', c: '# 10 caixas, 3 operadores, 2 medições cada\n%R&R = 34% → inaceitável', fig: { type: 'bars', labels: ['Repetibilidade', 'Reprodutibilidade', 'Peça a peça'], series: [{ name: '% da variação', values: [22, 12, 66] }], speech: 'O estudo mostra 34% de variação vindo da medição, acima do limite de 30%.' } },
    ['Exatidão (viés) e precisão (variação) são coisas diferentes.', 'Use peças que representem a faixa real do processo.', 'Operadores não devem saber qual peça estão medindo.'],
    [['Mesmo operador mede a mesma peça e obtém valores diferentes. Isso é falta de:', 'Repetibilidade', 'Reprodutibilidade', 'Capabilidade', 'Estabilidade', 'Repetibilidade é a variação do equipamento.'],
      ['%R&R = 35% indica um sistema:', 'Inaceitável', 'Excelente', 'Aceitável', 'Calibrado', 'Acima de 30%, a medição não é confiável.'],
      ['Em que fase do DMAIC normalmente se faz o MSA?', 'Measure', 'Control', 'Define', 'Improve', 'Antes de medir a linha de base.']]);

  lesson('coq', 'COQ', 'Custo da qualidade',
    'O custo da qualidade soma quatro grupos: prevenção (treinamento, FMEA, padrões), avaliação (inspeção, auditoria, testes), falhas internas (retrabalho, refugo antes do cliente) e falhas externas (devolução, garantia, frete de troca, perda de cliente). Investir em prevenção reduz as falhas, que costumam ser as maiores.',
    'É a saúde: check-up e exercício (prevenção) custam pouco perto de uma cirurgia de emergência (falha externa).',
    'Prevenção      → evitar que o defeito aconteça\nAvaliação      → verificar se há defeito\nFalha interna  → defeito achado antes do cliente\nFalha externa  → defeito que chegou ao cliente\nCOQ = soma dos quatro',
    ['Falhas externas incluem custos ocultos: reputação e clientes perdidos.', 'Mudar o mix para prevenção reduz o total.', 'Registre o COQ como % do faturamento.'],
    { p: 'Custo da qualidade do CD no trimestre (R$ mil):', c: 'COQ = 18 + 42 + 65 + 135 = 260 mil\nFalha externa = 135 ÷ 260 = 51,9%', fig: { type: 'pareto', items: [['Falha externa', 135], ['Falha interna', 65], ['Avaliação', 42], ['Prevenção', 18]], cum: false } },
    ['Não corte prevenção para economizar no curto prazo.', 'Inspeção (avaliação) não elimina defeitos, só os encontra.', 'Comece medindo as falhas externas.'],
    [['Frete de devolução de um produto avariado é custo de:', 'Falha externa', 'Prevenção', 'Avaliação', 'Falha interna', 'O defeito chegou ao cliente.'],
      ['Treinamento de separadores é custo de:', 'Prevenção', 'Avaliação', 'Falha interna', 'Falha externa', 'Evita que o defeito aconteça.'],
      ['Retrabalho na conferência antes de enviar é custo de:', 'Falha interna', 'Falha externa', 'Prevenção', 'Avaliação', 'Defeito encontrado antes do cliente.']]);

  lesson('iso', 'ISO 9001', 'Sistema de gestão: ISO 9001',
    'A ISO 9001 é a norma de sistemas de gestão da qualidade. Baseia-se em princípios como foco no cliente, liderança, abordagem por processos, mentalidade de risco, decisão baseada em evidência e melhoria. Auditorias verificam se a empresa faz o que diz e se isso é eficaz; não conformidades geram ação corretiva.',
    'É o regulamento de um campeonato: define regras claras, árbitros (auditores) verificam se são cumpridas e o time corrige o que estiver fora.',
    'Não conformidade → requisito não atendido\nCorreção        → resolver o efeito imediato\nAção corretiva  → eliminar a causa para não repetir\nAuditoria       → interna (1ª parte), cliente (2ª), certificadora (3ª)\nPDCA            → estrutura da norma',
    ['Correção resolve o caso; ação corretiva elimina a causa.', 'Auditoria busca evidências objetivas.', 'Certificação não garante qualidade: o sistema precisa funcionar no dia a dia.'],
    { p: 'Tratamento de uma não conformidade:', c: 'Achado → 3 pedidos sem conferência registrada\nCorreção → conferir os pedidos pendentes\nAção corretiva → bloqueio no sistema sem conferência', fig: { type: 'flow', steps: [{ t: 'start', label: 'Não conformidade encontrada' }, { t: 'proc', label: 'Correção imediata (efeito)' }, { t: 'proc', label: 'Análise de causa raiz' }, { t: 'proc', label: 'Ação corretiva (causa)' }, { t: 'dec', label: 'Ação eficaz?', no: 'Nova análise' }, { t: 'end', label: 'Encerrar com evidência' }] } },
    ['Não encerre ação corretiva sem verificar eficácia.', 'Documentação excessiva não é exigência da norma.', 'Auditoria interna é ferramenta de melhoria, não de punição.'],
    [['Qual a diferença entre correção e ação corretiva?', 'Correção trata o efeito; ação corretiva elimina a causa', 'São a mesma coisa', 'Ação corretiva é mais barata', 'Correção é feita pela certificadora', 'Correção resolve o caso; ação corretiva evita a repetição.'],
      ['Auditoria feita pela empresa certificadora é de:', 'Terceira parte', 'Primeira parte', 'Segunda parte', 'Quarta parte', 'Organismo independente.'],
      ['Qual destes é um princípio da gestão da qualidade?', 'Decisão baseada em evidência', 'Decisão baseada em hierarquia', 'Foco no concorrente', 'Inspeção de 100%', 'Dados e fatos orientam as decisões.']]);

  lesson('hoshin', 'HOSHIN', 'Desdobramento de metas (Hoshin Kanri)',
    'O Hoshin Kanri desdobra os objetivos estratégicos em metas e projetos para cada nível da empresa, com conversas de ida e volta (catchball). A matriz X conecta objetivos de longo prazo, metas anuais, prioridades, indicadores e responsáveis.',
    'É o GPS de uma viagem em grupo: o destino é um só, e cada carro recebe o trecho que precisa percorrer para todos chegarem juntos.',
    'Visão (3 a 5 anos)  → ser referência em entrega\nObjetivo anual    → 97% de pedidos no prazo\nMeta da área (CD) → reduzir o lead time de 518 para 300 min\nProjeto           → VSM e kaizen na separação\nIndicador         → lead time semanal',
    ['Poucas prioridades: se tudo é prioridade, nada é.', 'Catchball: a meta desce, o plano sobe, ajustam-se juntos.', 'Revisões mensais mantêm o rumo.'],
    { p: 'Do objetivo da empresa ao indicador da equipe:', c: '# cada nível responde: "o que eu preciso fazer\n# para o nível de cima atingir a meta?"', fig: { type: 'chevrons', steps: [{ k: '1', t: 'Visão' }, { k: '2', t: 'Objetivo anual' }, { k: '3', t: 'Meta da área' }, { k: '4', t: 'Projeto' }, { k: '5', t: 'Indicador' }] } },
    ['Meta desdobrada sem recurso vira frustração.', 'Indicadores de cada nível devem somar para o de cima.', 'Não confunda rotina com prioridade estratégica.'],
    [['O que é catchball no Hoshin Kanri?', 'Negociação de ida e volta entre níveis sobre metas e planos', 'Um jogo de integração', 'Uma auditoria externa', 'Um tipo de desperdício', 'A meta é discutida até virar compromisso.'],
      ['Quantas prioridades estratégicas o Hoshin recomenda?', 'Poucas', 'O máximo possível', 'Uma por funcionário', 'Nenhuma', 'Foco é o princípio central.'],
      ['Para que serve a matriz X?', 'Conectar objetivos, metas, prioridades, indicadores e responsáveis', 'Calcular Cpk', 'Desenhar o fluxograma', 'Classificar desperdícios', 'É a visão integrada do desdobramento.']]);

  lesson('final', 'DESAFIO', 'Juntando tudo: o sistema de melhoria',
    'Ferramentas isoladas ajudam; um sistema de melhoria muda a empresa. O caminho típico: indicadores mostram o problema, Pareto e estratificação focam, Ishikawa e porquês acham a causa, dados validam, 5W2H executa, carta de controle verifica e padrão sustenta. Cada ferramenta tem seu momento.',
    'É uma caixa de ferramentas de marceneiro: o segredo não é ter todas, mas saber qual pegar em cada etapa do móvel.',
    'Ver o problema   → indicadores, folha de verificação\nFocar            → Pareto, estratificação, GUT\nEntender causas  → Ishikawa, 5 porquês, dispersão\nAgir             → 5W2H, kaizen, poka-yoke\nVerificar        → carta de controle, Cpk\nSustentar        → POP, SDCA, auditoria',
    ['Escolha o método pelo tamanho do problema: kaizen, MASP/A3 ou DMAIC.', 'Dados em todas as etapas, não só no começo.', 'Celebre e compartilhe os ganhos.'],
    { p: 'Resultado do ano no indicador de pedidos com problema (%):', c: '# cada queda corresponde a um ciclo de melhoria\nJan = 6,8% → Dez = 2,9%', fig: { type: 'control', pts: [6.8, 6.5, 6.9, 6.6, 5.1, 4.8, 5.0, 4.7, 3.4, 3.1, 3.2, 2.9], lim: { lc: 4.5, lsc: 7.4, lic: 1.6 }, labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'], unit: '%', mark: false } },
    ['Ferramenta sem método vira burocracia.', 'Envolva quem faz o trabalho em todas as etapas.', 'Recalcule limites depois de cada melhoria comprovada.'],
    [['Qual ferramenta ajuda a focar no problema mais relevante?', 'Pareto', 'POP', '5S', 'Kanban', 'O Pareto prioriza pelo impacto.'],
      ['Para um problema simples, de causa evidente, o mais adequado é:', 'Um kaizen rápido ou "ver e agir"', 'Um projeto DMAIC de 6 meses', 'Uma auditoria ISO', 'Um FMEA completo', 'O tamanho do método deve combinar com o problema.'],
      ['Qual ferramenta verifica se a melhoria se manteve ao longo do tempo?', 'Carta de controle', 'Brainstorming', 'SIPOC', 'Matriz GUT', 'A carta mostra a estabilidade do novo patamar.']]);

  /* ------------------------- Tópico → aula ------------------------- */
  const MAP = {
    'Conceitos de qualidade': 'qualidade', 'Gurus da qualidade': 'qualidade', 'Processos e SIPOC': 'processos', 'Indicadores': 'indicadores', 'PDCA': 'pdca', '5W2H': '5w2h',
    'Brainstorming': 'brainstorm', 'Folha de verificação': 'folha', 'Estratificação': 'estrat', 'Pareto': 'pareto', 'Ishikawa': 'ishikawa', '5 Porquês': 'porques',
    'Histograma': 'histograma', 'Dispersão': 'dispersao', 'Fluxograma': 'fluxograma', '5S': '5s', 'Matriz GUT': 'gut', 'Desafio do nível': 'final',
    'MASP': 'masp', '8D': '8d', 'A3': 'a3', 'Desperdícios': 'muda', 'VSM': 'vsm', 'Takt time': 'takt', 'Kaizen': 'kaizen', 'Padronização': 'sdca', 'Poka-yoke': 'poka',
    'Kanban': 'kanban', 'OEE': 'oee', 'SMED': 'smed', 'Carta de controle': 'cep', 'Regras da carta': 'regras',
    'DMAIC': 'dmaic', 'Nível sigma': 'sigma', 'Capabilidade': 'cpk', 'FMEA': 'fmea', 'VOC e CTQ': 'ctq', 'Kano': 'ctq', 'MSA': 'msa', 'Custo da qualidade': 'coq',
    'ISO 9001': 'iso', 'Desdobramento': 'hoshin', 'Escolha da ferramenta': 'final', 'Desafio final': 'final',
  };

  const COMPUTED = { pareto: 1, control: 1, hist: 1, scatter: 1, vsm: 1, matrix: 1, normal: 1, oee: 1, bars: 1, table: 1 };
  function register() {
    if (!global.Lessons || !global.Lessons.registerPack) return;
    global.Lessons.registerPack('gestao', {
      LESSONS: L, MAP: MAP, fallback: 'qualidade', goalLabel: 'Sua missão',
      syntaxTitle: 'Como se aplica', syntaxSpeech: 'Agora, o passo a passo. Repare na estrutura da ferramenta.', compareSpeech: 'Repare como os números viram uma decisão.',
      codeHtml: function (code) { return global.GQCharts.highlight(code); },
      example: function (les) {
        const r = global.GQCharts.render(les.exemplo.fig);
        return { code: les.exemplo.c, badge: COMPUTED[les.exemplo.fig.type] ? 'Calculado agora com dados da NexusMarket' : 'Aplicado à operação da NexusMarket', liveHtml: r.html, speech: r.speech };
      },
      tags: function (ex) {
        const K = { choice: ['target', 'Estudo de caso'], multi: ['check', 'Marque todas as corretas'], order: ['bars', 'Coloque em ordem'], classify: ['grid', 'Classifique os itens'], calc: ['code', 'Cálculo com dados reais'] }[ex.kind] || ['target', 'Caso'];
        return [{ icon: K[0], label: K[1] }].concat(ex.d ? [{ icon: 'bars', label: 'Com gráfico' }] : []);
      },
    });
  }
  register();
  global.GQLessons = { LESSONS: L, MAP: MAP };
})(typeof window !== 'undefined' ? window : globalThis);
