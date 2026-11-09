/* =====================================================================
   dv-lessons.js — Aulas da trilha de Storytelling com Dados
   ---------------------------------------------------------------------
   36 aulas em 9 etapas:
     Nível 1 · Fundamentos da visualização → 1.1 Contexto e mensagem ·
       1.2 Escolha do gráfico · 1.3 Clareza visual
     Nível 2 · Design e narrativa → 2.1 Design com intenção ·
       2.2 Estrutura da narrativa · 2.3 Comparações e contexto
     Nível 3 · Apresentação e decisão → 3.1 Dashboards ·
       3.2 Apresentações · 3.3 Decisão e impacto
   Mesmo carrossel da Gestão e da Estatística.
   Questões de prova: [pergunta, correta, errada1, errada2, errada3, explicação]
   ===================================================================== */
(function (global) {
  'use strict';
  const L = {}, MAP = {};
  const D = global.DVData, f = global.GQCharts.fmt;
  function lesson(key, topic, kw, titulo, ideia, analogia, sintaxe, notas, exemplo, cuidados, quiz) {
    L[key] = { key: key, kw: kw, titulo: titulo, ideia: ideia, analogia: analogia, sintaxe: sintaxe, notas: notas, exemplo: exemplo, cuidados: cuidados, quiz: quiz };
    MAP[topic] = key;
  }
  const npsFig = { type: 'line', values: D.nps, labels: D.meses, name: 'NPS' };
  const churnFig = { type: 'line', values: D.churn, labels: D.meses, name: 'Cancelamento (% ao mês)' };

  /* ================== NÍVEL 1 · FUNDAMENTOS DA VISUALIZAÇÃO ================== */
  // ---- Etapa 1.1 · Contexto e mensagem
  lesson('contexto', 'Contexto', 'CONTEXTO', 'Contexto: quem, o quê e como',
    'Antes de abrir qualquer ferramenta, responda três perguntas. Quem vai receber a comunicação? O que você quer que essa pessoa saiba ou faça? E como vai mostrar: ao vivo, por e-mail, num painel? Esse contexto define tudo o que vem depois: os dados escolhidos, o gráfico, o nível de detalhe e o tom.',
    'É como um médico que pergunta os sintomas antes de receitar. Gráfico escolhido sem contexto é remédio receitado sem consulta.',
    'Quem    → público, o que ele já sabe, o que ele decide\nO quê   → a ação ou o entendimento esperado\nComo    → formato: ao vivo, e-mail, painel, documento\nTempo   → quanto tempo o público tem\nMaterial → só depois: dados, gráficos e visual',
    ['Ao vivo, você é a narração; por e-mail, o material precisa se explicar sozinho.', 'O contexto muda o nível de detalhe, não a verdade dos dados.', 'Se não sabe a decisão em jogo, pergunte antes de começar.'],
    { p: 'Pedido: “um material sobre vendas por região”:', c: 'Quem   → diretora comercial, decide a verba de mídia\nO quê  → aprovar mais verba para o Norte\nComo   → 1 slide na reunião + versão por e-mail\nTempo  → 5 minutos na pauta', fig: { type: 'cards', items: [['Quem', 'Diretora comercial: decide a verba de mídia do semestre.'], ['O quê', 'Aprovar +20% de mídia no Norte, que cresce 40% ao ano.'], ['Como', 'Um slide ao vivo e uma versão completa por e-mail.']], speech: 'Quem, o quê e como: o contexto da comunicação vem antes do gráfico.' } },
    ['Não comece pelo software.', 'Não confunda o pedido (“um material”) com o objetivo (uma decisão).', 'Não use o mesmo material para todos os formatos sem adaptar.'],
    [['A primeira etapa de uma comunicação com dados é:', 'Entender o público e a decisão em jogo', 'Escolher o tipo de gráfico', 'Definir a paleta de cores', 'Montar o painel no Power BI', 'O contexto orienta todas as escolhas.'],
      ['Um material enviado por e-mail, sem apresentador, precisa:', 'Se explicar sozinho, com títulos e conclusões escritas', 'Ter menos texto que o slide ao vivo', 'Ser igual ao da apresentação', 'Conter só a planilha bruta', 'Ninguém estará lá para narrar.'],
      ['As três perguntas do contexto são:', 'Quem, o quê e como', 'Quando, onde e quanto', 'Qual cor, qual fonte e qual gráfico', 'Quem fez, quanto custou e quanto tempo levou', 'Público, ação esperada e formato.']]);

  lesson('publico', 'Público e objetivo', 'PÚBLICO', 'Público e objetivo da comunicação',
    'Cada público precisa de uma coisa diferente. A diretoria quer a conclusão, o impacto e o pedido de decisão. O gerente quer saber o que muda na área dele. O analista quer o detalhe para investigar. E toda comunicação explicativa tem um objetivo concreto: aprovar, mudar, priorizar, alertar. “Informar” raramente basta.',
    'Você explica uma viagem de um jeito para o chefe (custo e resultado), de outro para a família (datas e passeios) e de outro para o agente de viagens (voos e hotéis). A viagem é a mesma; a conversa, não.',
    'Diretoria → conclusão, impacto, decisão (1 página)\nGerência  → o que muda na área, plano e prazos\nAnalistas → detalhe, filtros, metodologia\nObjetivo  → verbo de ação: aprovar, priorizar, mudar\nPúblico misto → síntese primeiro, detalhe no apêndice',
    ['Descubra o vocabulário do público: sigla desconhecida é ruído.', 'Com público misto, sirva primeiro a quem decide.', 'Defina o objetivo com um verbo de ação.'],
    { p: 'A mesma análise de devoluções para três públicos:', c: 'Diretoria → “Aprovar R$ 80 mil para a tabela de medidas”\nLogística → “Novo fluxo de troca a partir de março”\nAnalistas → “Base por SKU com motivos e filtros”', fig: { type: 'table', cols: ['Público', 'Precisa ver primeiro', 'Formato'], rows: [['Diretoria', 'Recomendação e impacto', '1 slide'], ['Gerente de operações', 'Ações por área e prazos', '3 a 5 slides'], ['Analistas', 'Dados detalhados', 'Painel com filtros']], speech: 'A mesma análise, três públicos, três níveis de detalhe.' } },
    ['Não tente agradar a todos com o máximo de detalhe.', 'Não termine sem pedir a decisão.', 'Não presuma que o público conhece seus termos técnicos.'],
    [['Para a diretoria, o material deve começar por:', 'A conclusão e o impacto', 'A metodologia', 'A base de dados completa', 'O histórico do projeto', 'Quem decide tem pouco tempo.'],
      ['Um bom objetivo de comunicação é:', 'Conseguir a aprovação para mudar a regra do frete', 'Mostrar os dados de frete', 'Falar sobre frete', 'Apresentar o painel', 'Tem uma ação clara.'],
      ['Com público misto (diretor e técnicos), o ideal é:', 'Síntese primeiro e detalhe no apêndice', 'Só o detalhe técnico', 'Três apresentações seguidas', 'Nenhuma conclusão', 'Atende a quem decide sem perder os técnicos.']]);

  lesson('ideia', 'A grande ideia', 'GRANDE IDEIA', 'A grande ideia: a mensagem em uma frase',
    'A grande ideia é a mensagem central em uma frase completa. Ela tem três partes: o seu ponto de vista, o que está em jogo e o que fazer. Se você não consegue dizer a mensagem em uma frase, ainda não sabe o que quer comunicar. Teste: conseguiria explicar em 30 segundos, no elevador?',
    'É a sinopse do filme no catálogo do streaming: em duas linhas, você sabe se vale a pena assistir.',
    'Ponto de vista → o que você conclui (não o tema)\nO que está em jogo → impacto, risco ou oportunidade\nAção → o que o público deve fazer\nFrase completa → sujeito, verbo e consequência\nTeste → cabe em 30 segundos?',
    ['Tema (“Vendas por região”) não é mensagem.', 'A grande ideia guia o que entra e o que sai do material.', 'Escreva a frase antes de montar os slides.'],
    { p: 'Do tema à grande ideia:', c: 'Tema       → Devoluções 2025\nAchado     → Metade é por tamanho errado\nGrande ideia → A tabela de medidas corta metade das devoluções\n               e economiza R$ 300 mil por ano: aprovem o piloto', fig: { type: 'hbars', labels: D.devol, values: D.devolN, hl: 0, d: 0, title: 'Motivos de devolução', speech: 'O tamanho errado é, de longe, o maior motivo de devolução.' } },
    ['Não confunda assunto com mensagem.', 'Não esconda a conclusão para o final por suspense.', 'Não escreva uma grande ideia sem consequência.'],
    [['Qual destas é uma “grande ideia”?', 'O Norte cresce 40% ao ano e merece um CD próprio', 'Vendas por região', 'Análise do Norte', 'Indicadores regionais', 'Tem ponto de vista e consequência.'],
      ['O teste do elevador verifica se:', 'Você consegue resumir a mensagem em 30 segundos', 'O gráfico cabe no slide', 'A apresentação dura 30 minutos', 'O público gosta de elevadores', 'Mensagem clara é curta.'],
      ['As três partes da grande ideia são:', 'Ponto de vista, o que está em jogo e a ação', 'Título, gráfico e fonte', 'Começo, meio e fim', 'Dados, cores e fonte', 'Uma frase completa e acionável.']]);

  lesson('explora', 'Exploratória × explicativa', 'EXPLICAR', 'Análise exploratória × explicativa',
    'Na análise exploratória, você investiga: testa cruzamentos, cria dezenas de gráficos rápidos e procura o que é interessante. Na explicativa, você comunica ao público só o que importa, com a mensagem pronta. O erro mais comum é apresentar a exploração inteira: mostrar o esforço em vez da conclusão.',
    'Para achar duas pérolas, você abre cem ostras. Na apresentação, mostre as duas pérolas, não as cem ostras.',
    'Exploratória → para você: muitos gráficos, hipóteses, filtros\nExplicativa → para o público: poucos gráficos, mensagem clara\nTransição   → escolher os 2 ou 3 achados que sustentam a ideia\nSinais      → título com conclusão, destaque, ação\nApêndice    → guarda o que pode ser perguntado',
    ['A maior parte da exploração não vai para a apresentação, e tudo bem.', 'Painéis de exploração não substituem a conclusão.', 'Guarde análises de apoio no apêndice.'],
    { p: 'Do caderno de exploração ao slide:', c: 'Exploração → 24 gráficos, 30 cruzamentos\nAchados    → frete e atraso explicam o cancelamento\nSlide      → 1 gráfico + título com a conclusão\nApêndice   → 4 gráficos de apoio', fig: { type: 'cards', items: [['Exploratória', '24 gráficos, hipóteses, filtros. Para você entender.'], ['Explicativa', '1 a 3 gráficos com a mensagem. Para o público decidir.']], speech: 'Explorar é para você; explicar é para o público.' } },
    ['Não mostre todos os gráficos que você fez.', 'Não entregue um painel de 24 visuais como conclusão.', 'Não deixe a conclusão para o público tirar sozinho.'],
    [['Na apresentação para a diretoria, deve-se mostrar:', 'Só os achados que sustentam a mensagem', 'Todos os gráficos da exploração', 'Os cruzamentos que não deram em nada', 'A planilha bruta', 'Pérolas, não ostras.'],
      ['Testar dezenas de cruzamentos para achar padrões é análise:', 'Exploratória', 'Explicativa', 'Executiva', 'Preditiva', 'Investigação para você.'],
      ['Um sinal de comunicação explicativa é:', 'Título com a conclusão e destaque no ponto principal', 'Todas as séries com o mesmo peso', 'Legenda com 12 categorias', 'Nenhuma recomendação', 'Explicar é escolher.']]);

  // ---- Etapa 1.2 · Escolha do gráfico
  lesson('barras', 'Comparação com barras', 'BARRAS', 'Comparar categorias com barras',
    'Para comparar categorias, as barras são a escolha mais segura: o olho compara comprimentos com uma base comum com muita precisão. Ordene do maior para o menor (a não ser que a ordem natural importe), comece o eixo no zero e use barras horizontais quando os nomes forem longos.',
    'É a fila do pódio: basta olhar a altura de cada degrau para saber quem ficou em primeiro.',
    'Barras verticais → poucas categorias, nomes curtos\nBarras horizontais → nomes longos, rankings\nOrdenar → do maior para o menor (salvo ordem natural)\nEixo → sempre começa em zero\nRótulos → direto nas barras quando poucas',
    ['Barras são lidas pelo comprimento: eixo cortado distorce.', 'Ordenar transforma o gráfico em ranking.', 'Uma cor só, com destaque onde importa.'],
    { p: 'Vendas por região em 2025 (R$ mi):', c: 'Sudeste → ' + f(D.vendasReg[0], 1) + '\nSul → ' + f(D.vendasReg[1], 1) + '\nNordeste → ' + f(D.vendasReg[2], 1) + '\nCentro-Oeste → ' + f(D.vendasReg[3], 1) + '\nNorte → ' + f(D.vendasReg[4], 1), fig: { type: 'hbars', labels: D.regioes, values: D.vendasReg, d: 1, title: 'Vendas por região (R$ mi)', speech: 'O Sudeste vende mais que o dobro do Sul, a segunda região.' } },
    ['Não corte o eixo de barras.', 'Não use uma cor diferente para cada barra sem motivo.', 'Não gire rótulos a 45°: prefira barras horizontais.'],
    [['Para comparar vendas de 5 regiões, o melhor gráfico é:', 'Barras ordenadas', 'Pizza', 'Linha', 'Radar', 'Comprimentos com base comum.'],
      ['Em gráficos de barras, o eixo deve:', 'Começar no zero', 'Começar no menor valor', 'Ser logarítmico', 'Ser omitido sempre', 'O comprimento precisa ser proporcional.'],
      ['Com nomes de categorias longos, prefira:', 'Barras horizontais', 'Barras verticais com rótulos inclinados', 'Pizza', 'Gráfico de área', 'Rótulos legíveis sem girar o texto.']]);

  lesson('tempo', 'Evolução no tempo', 'LINHA', 'Mostrar a evolução no tempo',
    'Quando o eixo é o tempo, a linha é a escolha natural: ela mostra tendência, sazonalidade, picos e quedas. O tempo vai no eixo horizontal, da esquerda para a direita, com intervalos regulares. Com muitas séries, destaque a que importa e deixe as outras em cinza, ou use pequenos múltiplos. Para comparar só dois momentos, use o slopegraph.',
    'É o eletrocardiograma: ninguém lê um batimento isolado, mas o desenho ao longo do tempo diz se está tudo bem.',
    'Linha → tendência e mudanças no tempo\nEixo X → tempo, em intervalos regulares\nMuitas séries → destaque 1, o resto em cinza\nPequenos múltiplos → um gráfico por série, mesma escala\nSlopegraph → dois momentos (antes × depois)',
    ['Em linhas, o eixo Y pode não começar no zero, desde que fique claro.', 'Barras também servem para tempo com poucos períodos.', 'Evite o “espaguete” de muitas linhas coloridas.'],
    { p: 'NPS mensal da NexusMarket em 2025:', c: 'jan a jun → estável, entre 49 e 56\njul e ago → queda para 38 (atrasos)\nset a dez → recuperação até 50', fig: Object.assign({ speech: 'O NPS cai em julho e agosto e se recupera até dezembro.' }, npsFig) },
    ['Não use pizza para mostrar evolução.', 'Não pule períodos sem avisar.', 'Não use 9 cores para 9 linhas.'],
    [['Para mostrar o NPS mês a mês, o melhor gráfico é:', 'Linha', 'Pizza', 'Barras horizontais', 'Mapa de calor sem números', 'Linhas mostram tendência no tempo.'],
      ['Para comparar só 2024 e 2025 em 4 canais, uma boa opção é:', 'Slopegraph', 'Histograma', 'Pizza', 'Dispersão', 'Linhas ligando os dois momentos.'],
      ['Com 9 linhas que se cruzam, o ideal é:', 'Destacar a principal e deixar as outras em cinza', 'Usar 9 cores fortes', 'Trocar por pizza', 'Aumentar a legenda', 'Evite o gráfico espaguete.']]);

  lesson('composicao', 'Composição', 'PARTE DO TODO', 'Composição: partes de um todo',
    'Para mostrar como um todo se divide, a pizza (ou rosca) funciona apenas com poucas partes e mensagem simples, como “o App já é quase metade”. Com mais partes, prefira barras ordenadas. Para composição ao longo do tempo, use barras empilhadas 100%. Evite 3D: ele distorce as fatias.',
    'Dividir uma pizza em 3 pedaços é fácil de enxergar; em 12, ninguém sabe qual pedaço é maior.',
    'Pizza/rosca → até 3 ou 4 partes, “parte de um todo”\nBarras ordenadas → muitas partes, comparação precisa\nEmpilhada 100% → composição em vários períodos\nWaterfall → como o total se forma (somas e subtrações)\n3D → nunca',
    ['A soma das partes deve fechar 100%.', 'Destaque a parte que importa e agrupe as pequenas em “Outros”.', 'Comparar ângulos é difícil; comprimentos, fácil.'],
    { p: 'Participação dos canais nos pedidos do mês:', c: 'App → 42%\nSite → 31%\nMarketplace → 19%\nLoja física → 8%', fig: { type: 'pie', labels: D.canais, values: D.pedidos, donut: true, hl: 0, center: '42%', speech: 'O App já responde por 42% dos pedidos do mês.' } },
    ['Não use pizza com muitas fatias.', 'Não use uma pizza por período para comparar.', 'Não use efeitos 3D.'],
    [['A pizza é aceitável quando:', 'Há poucas partes e a mensagem é parte de um todo', 'Há 12 categorias', 'O eixo é o tempo', 'Os valores não somam 100%', 'Poucas fatias, mensagem simples.'],
      ['Para composição em vários trimestres, use:', 'Barras empilhadas 100%', 'Várias pizzas', 'Uma linha única', 'Dispersão', 'Mesma base para cada período.'],
      ['O principal problema da pizza 3D é:', 'Distorcer o tamanho das fatias', 'Ter poucas cores', 'Ser pesada no arquivo', 'Não ter legenda', 'As fatias da frente parecem maiores.']]);

  lesson('numeros', 'Números e tabelas', 'TABELA', 'Números em destaque e tabelas',
    'Nem tudo precisa de gráfico. Quando a mensagem é um ou dois números, escreva-os em destaque com uma frase de apoio. Quando o público vai consultar valores exatos, use uma tabela limpa: números alinhados à direita, bordas leves e destaque só no que importa. O mapa de calor une os dois mundos: mantém os números e mostra o padrão com cor.',
    'O placar do jogo não precisa de gráfico: 2 a 1 diz tudo. Já a tabela do campeonato é para consultar a posição de cada time.',
    'Número em destaque → 1 ou 2 valores, grandes, com frase\nTabela → consulta de valores exatos\nAlinhamento → números à direita, mesmas casas decimais\nBordas → leves ou nenhuma\nMapa de calor → tabela + escala de cor',
    ['Um gráfico com uma barra só é um número disfarçado.', 'Tabela é para ler; gráfico é para ver padrão.', 'Destaque com cor só as células relevantes.'],
    { p: 'Número em destaque para o comitê:', c: '38%  → taxa de recompra do trimestre\n+6 p.p. → contra o mesmo trimestre de 2024\nMeta → 35% (atingida)', fig: { type: 'cards', items: [['38%', 'dos clientes voltaram a comprar no trimestre.'], ['+6 p.p.', 'em relação ao 3º trimestre de 2024.'], ['Meta 35%', 'atingida pelo segundo trimestre seguido.']], speech: 'Às vezes, um número grande e uma frase comunicam mais que qualquer gráfico.' } },
    ['Não crie gráfico para um único número.', 'Não use bordas grossas em todas as células.', 'Não centralize números em tabelas.'],
    [['Para mostrar “91% recomendariam o app”, o melhor é:', 'O número em destaque com uma frase', 'Pizza de 91% e 9%', 'Barra única', 'Tabela de uma linha', 'Texto simples comunica melhor.'],
      ['Tabelas são indicadas quando o público:', 'Precisa consultar valores exatos', 'Precisa ver tendência', 'Tem pouco tempo', 'Está numa apresentação ao vivo', 'Tabela é para consulta.'],
      ['Em tabelas, os números devem ser:', 'Alinhados à direita, com as mesmas casas decimais', 'Centralizados', 'Em negrito', 'Coloridos todos de vermelho', 'Facilita comparar dígitos.']]);

  // ---- Etapa 1.3 · Clareza visual
  lesson('poluicao', 'Poluição visual', 'MENOS É MAIS', 'Eliminar a poluição visual',
    'Todo elemento em um gráfico cobra atenção do leitor. Grades fortes, bordas, fundos, sombras, legendas desnecessárias e rótulos duplicados aumentam o esforço sem acrescentar informação. Edward Tufte chamou isso de razão dados-tinta: quanto mais tinta vai para os dados, e menos para a decoração, melhor.',
    'É arrumar a mesa antes de servir o prato principal: tirando o que não é usado, o que importa aparece.',
    '1. Tirar borda, fundo e sombra\n2. Grade → apagar ou deixar bem clara\n3. Legenda → trocar por rótulo direto\n4. Eixo ou rótulos → um dos dois\n5. Casas decimais → só as necessárias\n6. Cor → só onde há intenção',
    ['Pergunte de cada elemento: se eu tirar, o leitor perde algo?', 'Remover é diferente de esconder informação.', 'O padrão do software quase sempre precisa de limpeza.'],
    { p: 'Antes e depois da limpeza:', c: 'Antes → 20 elementos, 6 com dados (30%)\nDepois → 8 elementos, 6 com dados (75%)\nRetirados → grade, borda, fundo, legenda, sombras', fig: { type: 'bars', labels: ['Antes', 'Depois'], series: [{ name: 'Elementos com dados (%)', values: [30, 75] }], hl: 1, speech: 'Depois da limpeza, três quartos dos elementos mostram dados.' } },
    ['Não retire informação necessária (unidade, período, fonte).', 'Não troque poluição por enfeite de outro tipo.', 'Não mantenha o padrão do software sem revisar.'],
    [['A razão dados-tinta de Tufte recomenda:', 'Aumentar a proporção de tinta usada para mostrar dados', 'Usar mais cores', 'Adicionar grades fortes', 'Usar 3D', 'Menos decoração, mais dado.'],
      ['Se as barras já têm rótulos com os valores, o eixo Y:', 'Pode ser retirado', 'Deve ser duplicado', 'Deve ganhar grade forte', 'Deve virar logarítmico', 'Seria repetição.'],
      ['Qual destes elementos geralmente pode sair?', 'Legenda de uma única série', 'As barras', 'O título', 'A unidade de medida', 'Não acrescenta informação.']]);

  lesson('gestalt', 'Gestalt', 'GESTALT', 'Princípios de Gestalt na visualização',
    'A Gestalt explica como o cérebro organiza o que vê. Proximidade: o que está perto parece um grupo. Similaridade: o que tem a mesma cor ou forma parece relacionado. Cercamento: uma área sombreada agrupa elementos. Fechamento: completamos formas incompletas. Continuidade e conexão: linhas guiam o olhar. Use esses princípios para organizar sem acrescentar ruído.',
    'Numa festa, você percebe quem está junto pela proximidade das pessoas, sem precisar de cordas separando os grupos.',
    'Proximidade → rótulos junto dos dados\nSimilaridade → mesma cor = mesmo significado\nCercamento → fundo suave para agrupar\nFechamento → gráfico sem borda continua sendo um bloco\nContinuidade → alinhamentos guiam o olhar\nConexão → linha liga pontos de uma série',
    ['Espaço em branco agrupa melhor que bordas.', 'Rótulo direto aplica proximidade e similaridade ao mesmo tempo.', 'Mesma cor deve significar a mesma coisa.'],
    { p: 'Painel de logística organizado com Gestalt:', c: 'Proximidade → KPIs de prazo lado a lado\nSimilaridade → custos sempre em cinza-azulado\nFechamento → sem bordas entre os blocos\nConexão → linha do prazo ao longo dos meses', fig: { type: 'cards', items: [['Proximidade', 'O que está junto parece um grupo.'], ['Similaridade', 'Mesma cor ou forma, mesma família.'], ['Cercamento', 'Um fundo suave agrupa sem bordas.'], ['Fechamento', 'O olho completa a forma sozinho.']], speech: 'Os princípios de Gestalt organizam o visual sem acrescentar ruído.' } },
    ['Não separe tudo com bordas grossas.', 'Não use a mesma cor para coisas diferentes.', 'Não deixe rótulos longe dos dados.'],
    [['Colocar o rótulo logo acima da barra aplica o princípio da:', 'Proximidade', 'Simetria', 'Figura e fundo', 'Destino comum', 'O que está perto é agrupado.'],
      ['Usar a mesma cor para todas as métricas de custo aplica:', 'Similaridade', 'Fechamento', 'Proximidade', 'Continuidade', 'Mesma aparência, mesmo grupo.'],
      ['Uma alternativa limpa às bordas grossas para separar seções é:', 'Espaço em branco', 'Bordas tracejadas', 'Cores diferentes em cada gráfico', 'Sombras', 'Proximidade separa grupos.']]);

  lesson('preatento', 'Atributos pré-atentivos', 'DESTAQUE', 'Atributos pré-atentivos: guiar o olhar',
    'Alguns atributos visuais são percebidos antes de pensarmos: cor, intensidade, tamanho, posição, peso e orientação. São os atributos pré-atentivos. Use-os para dizer ao leitor onde olhar: pinte de cinza o que é contexto e dê a cor de destaque só ao que importa. Se tudo é destaque, nada é destaque.',
    'Num campo de flores amarelas, uma vermelha salta aos olhos sem esforço. Num campo de flores de todas as cores, nenhuma se destaca.',
    'Cor → cinza para o contexto, uma cor para o foco\nTamanho → maior = mais importante\nPosição → topo à esquerda é visto primeiro\nPeso → negrito no ponto-chave\nTexto → destaque a conclusão, apague o apoio\nRegra → no máximo 1 ou 2 destaques por visual',
    ['Defina a mensagem antes de escolher o destaque.', 'Cinza é seu melhor amigo.', 'Destaque vale também para texto e tabelas.'],
    { p: 'Margem por categoria, com destaque na pior:', c: 'Mensagem → Eletrônicos tem a pior margem (8%)\nDestaque → Eletrônicos na cor da trilha\nContexto → demais categorias em cinza', fig: { type: 'hbars', labels: D.categorias, values: D.margem, sort: true, hl: 0, unit: '%', d: 0, title: 'Margem por categoria', speech: 'Com as outras barras em cinza, Eletrônicos salta aos olhos.' } },
    ['Não use cores fortes em tudo.', 'Não destaque algo que não é a mensagem.', 'Não use vários tipos de destaque ao mesmo tempo.'],
    [['Para destacar uma categoria entre sete, o melhor é:', 'Pintar só ela e deixar as outras em cinza', 'Usar sete cores', 'Pôr todas em negrito', 'Adicionar sombra em todas', 'Contraste guia o olhar.'],
      ['São atributos pré-atentivos:', 'Cor, tamanho e posição', 'Notas de rodapé', 'Fonte dos dados', 'Número da página', 'Percebidos antes de pensar.'],
      ['Usar vermelho em 9 de 12 indicadores faz com que:', 'O destaque perca força', 'Tudo fique mais urgente', 'O leitor foque no principal', 'O painel fique mais claro', 'Destaque é relativo.']]);

  lesson('cor', 'Uso de cor', 'COR', 'Cor com intenção',
    'Cor é a ferramenta de destaque mais forte, por isso deve ser usada com intenção. Comece em cinza e acrescente uma cor de destaque. Mantenha o significado: a mesma cor para a mesma coisa em todo o material. Escolha o tipo de paleta pelo dado: categórica para categorias, sequencial para baixo-alto e divergente para desvios de um ponto central. Pense também nos daltônicos.',
    'Semáforo funciona porque todo mundo sabe o que cada cor significa. Se cada cruzamento trocasse as cores, seria um caos.',
    'Base → cinza + 1 cor de destaque\nCategórica → cores distintas para categorias sem ordem\nSequencial → claro → escuro (baixo → alto)\nDivergente → duas cores a partir de um centro (meta, zero)\nDaltonismo → evitar só vermelho × verde; usar rótulos\nContraste → texto legível sobre o fundo',
    ['Use a cor da marca para o dado principal.', 'Azul e laranja funcionam para a maioria dos daltônicos.', 'Teste no projetor ou no celular.'],
    { p: 'Escolhendo a paleta pelo tipo de dado:', c: 'Canais (App, Site, Loja) → categórica\nPedidos por hora → sequencial\nDesvio da meta (−/0/+) → divergente\nDestaque → cor da marca só no ponto da mensagem', fig: { type: 'cards', items: [['Categórica', 'Categorias sem ordem: cores bem distintas.'], ['Sequencial', 'Do claro ao escuro: valores de baixo a alto.'], ['Divergente', 'Duas cores a partir de um centro, como a meta.']], speech: 'O tipo de dado define o tipo de paleta.' } },
    ['Não use arco-íris sem motivo.', 'Não troque o significado de uma cor no meio do material.', 'Não dependa só de vermelho e verde.'],
    [['Para mostrar desvios abaixo e acima da meta, use paleta:', 'Divergente', 'Categórica', 'Sequencial', 'Arco-íris', 'Duas cores a partir de um centro.'],
      ['Para que daltônicos distingam duas categorias, prefira:', 'Azul e laranja', 'Vermelho e verde', 'Verde e marrom', 'Rosa e vermelho', 'Combinação segura.'],
      ['Um bom ponto de partida para as cores é:', 'Cinza como base e uma cor de destaque', 'Uma cor diferente por barra', 'Todas as cores da marca', 'Fundo colorido', 'Cor com intenção.']]);

  /* ===================== NÍVEL 2 · DESIGN E NARRATIVA ===================== */
  // ---- Etapa 2.1 · Design com intenção
  lesson('hierarquia', 'Hierarquia visual', 'HIERARQUIA', 'Hierarquia visual, alinhamento e espaço',
    'Hierarquia visual define a ordem em que o leitor percebe as coisas. Lemos do topo à esquerda para baixo à direita, em Z ou em F. Por isso, a conclusão e o número-chave vão no topo; o gráfico sustenta; rótulos e fontes apoiam. Alinhamento a uma grade dá ordem e o espaço em branco dá foco. Espaço vazio não é desperdício.',
    'Na capa do jornal, a manchete é maior que a notícia, que é maior que a legenda da foto. Você sabe por onde começar sem ninguém dizer.',
    'Topo à esquerda → conclusão ou KPI principal\nTamanho e peso → definem a importância\nGrade → margens e colunas comuns\nEspaço em branco → foco e respiro\nOrdem → título > número > gráfico > rótulos > fonte',
    ['Defina 3 ou 4 níveis de texto e mantenha-os.', 'Alinhe tudo à esquerda quando possível.', 'Detalhes extras vão para o apêndice, não para o espaço vazio.'],
    { p: 'Hierarquia de um slide:', c: '1. Título → O NPS voltou a 50 com o novo SLA\n2. Número → +12 pontos desde agosto\n3. Gráfico → NPS mensal com a virada anotada\n4. Rótulos → meses e valores-chave\n5. Fonte → Pesquisa NPS, n = 4.200/mês', fig: { type: 'chevrons', steps: [{ k: '1', t: 'Título com a conclusão' }, { k: '2', t: 'Número-chave' }, { k: '3', t: 'Gráfico' }, { k: '4', t: 'Rótulos' }, { k: '5', t: 'Fonte e notas' }], speech: 'Do mais importante ao apoio: a hierarquia guia a leitura.' } },
    ['Não centralize tudo de forma solta.', 'Não preencha todos os espaços vazios.', 'Não use mais de três tamanhos de fonte por slide.'],
    [['A informação mais importante deve ficar:', 'No canto superior esquerdo', 'No canto inferior direito', 'Na nota de rodapé', 'No centro, pequena', 'É onde a leitura começa.'],
      ['O espaço em branco em um slide serve para:', 'Dar foco à mensagem', 'Ser preenchido com mais gráficos', 'Indicar que o slide está incompleto', 'Nada', 'Respiro direciona a atenção.'],
      ['Usar uma grade para posicionar os elementos ajuda a:', 'Criar ordem e facilitar a leitura', 'Deixar o slide mais colorido', 'Aumentar o número de gráficos', 'Esconder dados', 'Alinhamento organiza.']]);

  lesson('titulos', 'Títulos que concluem', 'TÍTULO-AÇÃO', 'Títulos que contam a conclusão',
    'O título do slide ou do gráfico é o espaço mais valioso que você tem. Em vez de um título descritivo (“Cancelamento por mês”), escreva a conclusão (“O cancelamento quase dobrou até agosto, puxado pelos atrasos”). O subtítulo informa o que está sendo medido, a unidade e o período. Se o leitor ler só o título, deve levar a mensagem.',
    'É a manchete do jornal: “Chuva alaga o centro” diz o que aconteceu. “Notícias sobre o clima” não diz nada.',
    'Título → frase com a conclusão (sujeito + verbo + número)\nSubtítulo → o que é medido, unidade e período\nTamanho → uma ou duas linhas\nVerificável → o gráfico prova o título\nLeitura horizontal → os títulos em sequência contam a história',
    ['Use números no título quando possível.', 'Verbos dão vida: caiu, dobrou, passou, recuperou.', 'O título e o destaque visual devem falar da mesma coisa.'],
    { p: 'De título descritivo a título de conclusão:', c: 'Antes  → Taxa de cancelamento 2025\nDepois → O cancelamento quase dobrou até agosto,\n         puxado pelos atrasos de julho\nSubtítulo → Cancelamento mensal (%), jan a dez/2025', fig: Object.assign({ speech: 'O cancelamento sobe de 2,1% para 3,9% entre janeiro e agosto.' }, churnFig) },
    ['Não use títulos genéricos como “Visão geral”.', 'Não escreva um título que o gráfico não sustenta.', 'Não deixe a unidade e o período de fora.'],
    [['Qual título conta a conclusão?', 'O App passou o Site e já faz 42% dos pedidos', 'Vendas por canal', 'Pedidos (%)', 'Gráfico 3', 'Afirma algo verificável.'],
      ['O subtítulo do gráfico deve trazer:', 'O que é medido, a unidade e o período', 'A conclusão repetida', 'Uma piada', 'O nome do analista', 'Contexto da medida.'],
      ['Ler só os títulos dos slides em sequência serve para:', 'Ver se a história se sustenta', 'Conferir a fonte', 'Contar os slides', 'Escolher as cores', 'Leitura horizontal.']]);

  lesson('anotacoes', 'Anotações', 'ANOTAÇÕES', 'Anotações, rótulos e linhas de referência',
    'Anotações ligam o dado à explicação exatamente onde o olho está: “Novo frete (+R$ 8)” ao lado do pico de julho. Rótulos diretos substituem a legenda. Linhas de referência (meta, média, ano anterior) mostram de imediato se um valor é bom ou ruim. Anote só o que importa para a mensagem.',
    'É o post-it que o colega deixa no relatório, apontando a linha que você precisa ler.',
    'Anotação → texto curto junto do ponto que explica\nRótulo direto → nome da série no fim da linha\nReferência → linha discreta de meta ou média\nCor → igual à do elemento anotado\nSeleção → só eventos que sustentam a mensagem',
    ['Anotar a causa transforma o gráfico em explicação.', 'Linhas de referência devem ser discretas.', 'Menos anotações, mais impacto.'],
    { p: 'Gráfico de cancelamento anotado:', c: 'jul → anotação: “Novo frete (+R$ 8)”\nago → anotação: “Pico: 3,9%”\nReferência → linha “Meta: 2,5%”\nRótulo → “Cancelamento” no fim da linha', fig: Object.assign({ speech: 'A anotação no pico de julho explica a causa sem o leitor precisar perguntar.' }, churnFig) },
    ['Não anote todos os pontos.', 'Não use setas grandes e coloridas por toda parte.', 'Não deixe a explicação só para a fala.'],
    [['Para explicar um pico em julho, o melhor é:', 'Anotar o motivo no próprio ponto', 'Explicar só na fala', 'Colocar no rodapé do último slide', 'Mudar a cor do gráfico todo', 'Explicação onde o olho está.'],
      ['Uma linha de referência de meta serve para:', 'Mostrar quem está acima ou abaixo da meta', 'Decorar o gráfico', 'Substituir o eixo', 'Esconder dados', 'Contexto imediato.'],
      ['Rotular as linhas diretamente evita:', 'Que o leitor vá e volte à legenda', 'O uso de cores', 'Os títulos', 'As anotações', 'Menos esforço de leitura.']]);

  lesson('eixos', 'Eixos e escalas', 'ESCALA', 'Eixos e escalas honestas',
    'A escala muda a percepção. Em barras, o eixo começa no zero, porque lemos o comprimento. Em linhas, podemos focar a faixa dos dados, porque lemos a inclinação. O tempo exige intervalos regulares. Gráficos lado a lado precisam da mesma escala. Eixo Y duplo deve ser evitado: o cruzamento das linhas depende das escalas escolhidas.',
    'É como uma régua: se você corta o começo dela, um objeto de 2 cm parece do mesmo tamanho que um de 10 cm.',
    'Barras → eixo no zero\nLinhas → faixa dos dados é aceitável\nTempo → intervalos regulares\nPequenos múltiplos → mesma escala\nEixo duplo → prefira dois gráficos alinhados\nLog → só com aviso e público preparado',
    ['Sempre informe a unidade no eixo ou no subtítulo.', 'Ao mudar a escala, avise o leitor.', 'Compare sempre com a mesma régua.'],
    { p: 'Barras de 92 e 96 com eixos diferentes:', c: 'Eixo em 0  → alturas 92 e 96 (diferença real: 4%)\nEixo em 90 → alturas 2 e 6 (parece 3 vezes maior)\nRegra → barras começam no zero', fig: { type: 'bars', labels: ['Loja A', 'Loja B'], series: [{ name: 'Nota de atendimento', values: [92, 96] }], speech: 'Com o eixo no zero, a diferença entre 92 e 96 aparece do tamanho real.' } },
    ['Não corte o eixo de barras.', 'Não use dois eixos Y para “provar” relação.', 'Não use escalas diferentes em gráficos que serão comparados.'],
    [['Em gráficos de linha, começar o eixo Y acima de zero é:', 'Aceitável, se ficar claro', 'Sempre proibido', 'Obrigatório', 'Igual a cortar barras', 'Lemos a inclinação.'],
      ['O problema do eixo Y duplo é que:', 'O cruzamento das linhas depende das escalas escolhidas', 'Ele usa poucas cores', 'Ele não tem título', 'Ele começa no zero', 'Relação ilusória.'],
      ['Pequenos múltiplos que serão comparados devem ter:', 'A mesma escala', 'Escalas diferentes', 'Cores diferentes', 'Eixos ocultos', 'Mesma régua.']]);

  // ---- Etapa 2.2 · Estrutura da narrativa
  lesson('arco', 'Arco narrativo', 'NARRATIVA', 'O arco narrativo',
    'Boas histórias têm começo, meio e fim. No começo, você apresenta a situação e o contexto. No meio, surge o conflito: algo mudou, um problema ou uma oportunidade, com as evidências. A tensão cresce até o ponto de virada. No fim, vem a resolução e a chamada para ação. O herói da história é o público, não o analista.',
    'Todo filme de super-herói segue o mesmo arco: a vida normal, a ameaça, a virada e a vitória. Sua apresentação também pode seguir.',
    'Começo → situação: como as coisas estavam\nConflito → o que mudou (problema ou oportunidade)\nTensão → evidências e o que está em jogo\nVirada → a descoberta ou a solução\nFim → resolução e chamada para ação',
    ['Sem conflito, não há motivo para agir.', 'Coloque o público no centro da história.', 'Termine sempre com uma ação clara.'],
    { p: 'O arco da recuperação do NPS:', c: 'Situação → NPS estável em torno de 54\nConflito → atrasos de julho: NPS cai para 38\nVirada → novo SLA com as transportadoras\nResolução → NPS volta a 50 em dezembro\nAção → estender o SLA para Norte e Nordeste', fig: Object.assign({ speech: 'Situação, conflito, virada e resolução: o NPS conta uma história completa.' }, npsFig) },
    ['Não conte a análise em ordem cronológica de trabalho.', 'Não esconda o conflito para parecer positivo.', 'Não termine sem chamada para ação.'],
    [['O motor de uma história com dados é:', 'O conflito (problema ou oportunidade)', 'A quantidade de gráficos', 'As cores', 'A duração', 'Sem tensão, não há ação.'],
      ['O herói da história deve ser:', 'O público que vai decidir', 'O analista', 'A ferramenta de BI', 'O fornecedor de dados', 'Público no centro.'],
      ['O fim do arco narrativo traz:', 'A resolução e a chamada para ação', 'A metodologia', 'Os dados brutos', 'O contexto inicial', 'Fechamento acionável.']]);

  lesson('scr', 'Situação, complicação e resolução', 'SCR', 'Situação, complicação, resolução e a pirâmide',
    'O modelo SCR resume uma história em três frases: Situação (o que todos sabem), Complicação (o que mudou e cria o problema) e Resolução (o que fazer). Para públicos executivos, use a pirâmide de Barbara Minto: a resposta vem primeiro, sustentada por poucos argumentos, cada um com suas evidências.',
    'É como um bom médico: “Você está bem de saúde (situação), mas a pressão subiu (complicação); vamos ajustar o remédio (resolução)”.',
    'Situação → contexto conhecido e aceito\nComplicação → o que mudou, a tensão\nResolução → a recomendação\nPirâmide → resposta no topo\n            → 2 a 4 argumentos\n            → evidências de cada argumento',
    ['Executivos com pouco tempo preferem a resposta primeiro.', 'Cada argumento responde “por quê?” à recomendação.', 'SCR também funciona para e-mails.'],
    { p: 'SCR para o frete grátis:', c: 'Situação → frete grátis acima de R$ 99 impulsionou 2024\nComplicação → em 2025, consome 3 p.p. da margem\nResolução → subir o mínimo para R$ 149', fig: { type: 'flow', steps: [{ t: 'start', label: 'Recomendação: subir o frete grátis para R$ 149' }, { t: 'proc', label: 'Argumento 1: mantém 90% das vendas' }, { t: 'proc', label: 'Argumento 2: recupera 3 p.p. de margem' }, { t: 'end', label: 'Argumento 3: concorrentes já usam R$ 149' }], speech: 'Na pirâmide, a recomendação vem primeiro e os argumentos a sustentam.' } },
    ['Não comece pela metodologia.', 'Não use argumentos sem evidência.', 'Não confunda complicação com detalhe irrelevante.'],
    [['No modelo SCR, a complicação é:', 'O que mudou e cria o problema', 'A recomendação', 'O contexto conhecido', 'A lista de dados', 'A tensão da história.'],
      ['Na pirâmide de Minto, a recomendação aparece:', 'No começo', 'No fim', 'No apêndice', 'Só se perguntarem', 'Resposta primeiro.'],
      ['Um bom argumento da pirâmide:', 'Responde “por quê?” com evidência', 'Fala da cor do slide', 'Repete a recomendação', 'Descreve a ferramenta', 'Sustenta a recomendação.']]);

  lesson('edai', 'Tensão e o “e daí?”', 'E DAÍ?', 'O “e daí?”: do fato à ação',
    'Um número sozinho não convence ninguém. Pergunte “e daí?” várias vezes: o ticket do App é R$ 182; e daí? É R$ 40 a mais que o Site; e daí? Migrar clientes rende R$ 2 milhões por ano; e daí? Proponho um cupom de primeira compra no App. Cada “e daí?” sobe um degrau até a ação. Mostrar o custo de não agir aumenta a tensão.',
    'Criança pequena perguntando “por quê?” sem parar: chata para os pais, ótima para quem quer chegar à causa e à consequência.',
    'Fato → o que o dado mostra\nComparação → contra meta, período, outro grupo\nCausa → por que aconteceu\nImpacto → em reais, clientes ou tempo\nAção → o que fazer\nCusto de não agir → o que se perde se nada mudar',
    ['Converta diferenças em impacto (R$, clientes, horas).', 'O custo da inação cria urgência legítima.', 'Pare quando chegar a uma ação concreta.'],
    { p: 'A escada do “e daí?”:', c: 'Fato → ticket do App = R$ 182\nComparação → R$ 40 a mais que o Site\nImpacto → 50 mil pedidos × R$ 40 = R$ 2 mi/ano\nAção → cupom de primeira compra no App', fig: { type: 'chevrons', steps: [{ k: '1', t: 'Fato' }, { k: '2', t: 'Comparação' }, { k: '3', t: 'Causa' }, { k: '4', t: 'Impacto' }, { k: '5', t: 'Ação' }], speech: 'Cada “e daí?” leva o fato um degrau mais perto da ação.' } },
    ['Não pare no fato.', 'Não exagere o impacto para criar urgência.', 'Não esqueça de dizer a ação.'],
    [['O slide diz só “Ticket do App: R$ 182”. Falta:', 'O “e daí?”: comparação e ação', 'Mais casas decimais', 'Uma pizza', 'Um ícone', 'Número precisa de sentido.'],
      ['Mostrar quanto a empresa perdeu na ruptura de 2024 é usar:', 'O custo de não agir', 'Um gráfico enganoso', 'Uma métrica de vaidade', 'Um apêndice', 'Tensão legítima.'],
      ['A ordem do “e daí?” é:', 'Fato, comparação, causa, impacto e ação', 'Ação, fato, causa', 'Cores, gráfico, título', 'Impacto, fato, cor', 'Degrau por degrau.']]);

  lesson('storyboard', 'Storyboard', 'STORYBOARD', 'Storyboard: planejar antes de produzir',
    'O storyboard é o roteiro da apresentação em cartões ou post-its, um por slide, antes de abrir o software. Ele permite mover, cortar e reorganizar ideias sem apego à formatação. Comece pela grande ideia, situe, mostre a evidência, apresente a solução e termine com o pedido. Depois, leia só os títulos: eles devem contar a história.',
    'Diretores de cinema desenham as cenas antes de filmar. Refazer um desenho custa minutos; refazer uma cena, dias.',
    'Cartão 1 → grande ideia\nCartão 2 → contexto\nCartões 3–4 → evidências\nCartão 5 → solução\nCartão 6 → pedido e próximos passos\nTeste → ler só os títulos em sequência\nTempo → cerca de 2 minutos por slide',
    ['Faça o storyboard com alguém e ouça as dúvidas.', 'Corte o que não sustenta a grande ideia.', 'Reserve tempo para perguntas.'],
    { p: 'Storyboard da apresentação de devoluções:', c: '1 → A tabela de medidas corta metade das devoluções\n2 → Devoluções de moda dobraram em 2025\n3 → Motivos de devolução por categoria\n4 → Piloto de 3 meses com a tabela de medidas\n5 → Pedido: R$ 80 mil, decisão até 15/11', fig: { type: 'chevrons', steps: [{ k: '1', t: 'Grande ideia' }, { k: '2', t: 'Contexto' }, { k: '3', t: 'Evidência' }, { k: '4', t: 'Solução' }, { k: '5', t: 'Pedido' }], speech: 'Cinco cartões, uma história: ideia, contexto, evidência, solução e pedido.' } },
    ['Não comece formatando slides.', 'Não planeje mais slides do que o tempo permite.', 'Não deixe o pedido para “se der tempo”.'],
    [['A vantagem do storyboard em papel é:', 'Organizar a história sem se apegar à formatação', 'Economizar papel', 'Evitar gráficos', 'Deixar a apresentação mais longa', 'Mover ideias é fácil.'],
      ['Ler só os títulos em sequência serve para:', 'Verificar se a história faz sentido', 'Contar as palavras', 'Escolher as cores', 'Definir a fonte', 'Leitura horizontal.'],
      ['Numa reunião de 20 minutos com 8 de perguntas e 2 minutos por slide, cabem:', '6 slides', '10 slides', '4 slides', '20 slides', '(20 − 8) ÷ 2 = 6.']]);

  // ---- Etapa 2.3 · Comparações e contexto
  lesson('referencia', 'Comparações e referência', 'REFERÊNCIA', 'Comparações que dão sentido aos números',
    'Um número sozinho não diz se é bom ou ruim. R$ 7,2 milhões em vendas é ótimo ou péssimo? Depende da referência. Compare com a meta (estamos no plano?), com o mesmo período do ano anterior (descontando a sazonalidade), com o período anterior (mudanças recentes) ou com o mercado (estamos ganhando participação?).',
    'A temperatura de 38 °C só assusta porque você sabe que o normal é 36,5. Sem a referência, é só um número.',
    'Meta → atingimento = realizado ÷ meta\nAno anterior → mesmo período, elimina sazonalidade\nPeríodo anterior → mudanças recentes\nMercado → benchmark e participação\nMédia → o grupo está acima ou abaixo do típico',
    ['Escolha a referência pela pergunta de negócio.', 'Em negócios sazonais, compare com o mesmo período do ano anterior.', 'Mostre o valor e a comparação juntos.'],
    { p: 'Vendas de novembro com referências:', c: 'Realizado → R$ 7,2 mi\nMeta → R$ 8,0 mi (90% de atingimento)\nNov/2024 → R$ 6,2 mi (+16%)\nOut/2025 → R$ 5,9 mi (+22%, efeito Black Friday)', fig: { type: 'bars', labels: ['Nov/24', 'Out/25', 'Nov/25', 'Meta nov/25'], series: [{ name: 'Vendas (R$ mi)', values: [6.2, 5.9, 7.2, 8.0] }], hl: 2, speech: 'Novembro cresceu sobre o ano anterior, mas ficou em 90% da meta.' } },
    ['Não compare dezembro com janeiro em negócios sazonais.', 'Não mostre o número sem referência.', 'Não troque a referência para favorecer a mensagem.'],
    [['Para descontar a sazonalidade, compare com:', 'O mesmo período do ano anterior', 'O mês anterior', 'O melhor mês', 'A média dos últimos 3 dias', 'Mesma época, mesmo efeito sazonal.'],
      ['Realizado de R$ 7,2 mi com meta de R$ 8 mi é atingimento de:', '90%', '80%', '111%', '72%', '7,2 ÷ 8.'],
      ['“Estamos ganhando participação?” pede comparação com:', 'O mercado', 'A meta', 'O mês anterior', 'O orçamento', 'Benchmark externo.']]);

  lesson('kpis', 'KPIs', 'KPI', 'KPIs: os números que importam',
    'KPI (indicador-chave de desempenho) é um número ligado a um objetivo, com meta, dono e frequência de acompanhamento. Indicadores de resultado (faturamento, NPS) mostram o efeito; indicadores de processo (pedidos separados em 2 horas) antecipam o resultado e permitem agir antes. Fuja das métricas de vaidade, que sobem fácil e não mudam decisões.',
    'O painel do carro mostra poucos indicadores: velocidade, combustível, temperatura. Se mostrasse cem, você não veria o alerta do óleo.',
    'Objetivo → por que medimos\nMeta → qual valor é bom\nDono → quem responde pelo número\nFrequência → compatível com a decisão\nResultado (lagging) → mostra o efeito\nProcesso (leading) → antecipa o resultado\nCartão → valor + meta + tendência',
    ['Menos KPIs, mais foco.', 'Combine indicadores de processo e de resultado.', 'Revise KPIs que ninguém usa para decidir.'],
    { p: 'Cartão de KPI completo:', c: 'Prazo médio de entrega → 4,6 dias\nMeta → 4,0 dias\nTendência → −0,4 dia no mês\nDono → gerente de logística', fig: { type: 'cards', items: [['4,6 dias', 'Prazo médio de entrega em novembro.'], ['Meta 4,0', 'Ainda 0,6 dia acima da meta.'], ['−0,4 dia', 'Melhora em relação a outubro.']], speech: 'Valor, meta e tendência: o cartão de KPI completo.' } },
    ['Não meça só porque o dado existe.', 'Não use métricas de vaidade como sucesso.', 'Não mostre KPI sem meta.'],
    [['Um bom KPI tem:', 'Objetivo, meta, dono e frequência', 'Muitas casas decimais', 'Cores fortes', 'Fonte grande', 'Indicador para decidir.'],
      ['% de pedidos separados em até 2 horas é um indicador de:', 'Processo (antecipa o resultado)', 'Resultado', 'Vaidade', 'Mercado', 'Leading indicator.'],
      ['Visualizações de um vídeo, sozinhas, são exemplo de:', 'Métrica de vaidade', 'KPI estratégico', 'Indicador de processo', 'Meta', 'Sobe fácil e não garante resultado.']]);

  lesson('variacoes', 'Variações e bases', 'VARIAÇÃO', 'Variações, pontos percentuais e bases',
    'Variações podem confundir. Quando uma taxa vai de 2,5% para 3,0%, ela subiu 0,5 ponto percentual (p.p.) ou 20% em termos relativos: os dois estão certos, mas dizem coisas diferentes. Bases pequenas geram porcentagens enormes (de 2 para 10 é +400%). E nunca tire média simples de porcentagens de grupos de tamanhos diferentes: pondere.',
    'Dizer que o preço do cafezinho “subiu 100%” assusta; dizer que subiu de R$ 1 para R$ 2 coloca em perspectiva.',
    'Pontos percentuais → 3,0% − 2,5% = 0,5 p.p.\nVariação relativa → (3,0 − 2,5) ÷ 2,5 = 20%\nBase pequena → mostre o absoluto junto\nTaxa geral → some numeradores ÷ some denominadores\nComunicar → “subiu 0,5 p.p. (20%)”',
    ['Taxas se comparam em p.p.; valores, em %.', 'Mostre sempre a base quando ela for pequena.', 'Média de porcentagens precisa de ponderação.'],
    { p: 'Conversão geral ponderada:', c: 'App → 4% de 10.000 visitas = 400 compras\nSite → 2% de 90.000 visitas = 1.800 compras\nGeral → 2.200 ÷ 100.000 = 2,2%\nErrado → (4% + 2%) ÷ 2 = 3%', fig: { type: 'table', cols: ['Canal', 'Visitas', 'Compras', 'Conversão'], rows: [['App', 10000, 400, '4,0%'], ['Site', 90000, 1800, '2,0%'], ['Total', 100000, 2200, '2,2%']], tot: true, speech: 'A conversão geral é 2,2%, não 3%: o Site tem muito mais visitas.' } },
    ['Não confunda p.p. com %.', 'Não destaque percentuais sobre bases minúsculas.', 'Não faça média simples de taxas.'],
    [['A conversão foi de 2,5% para 3,0%. A variação é de:', '0,5 p.p. ou 20%', '0,5%', '20 p.p.', '5%', 'Absoluta em p.p., relativa em %.'],
      ['De 2 para 10 unidades é +400%. O cuidado é:', 'Mostrar também os valores absolutos', 'Arredondar para 500%', 'Esconder a base', 'Usar pizza', 'Base pequena exagera.'],
      ['A taxa geral de dois grupos de tamanhos diferentes é:', 'A soma dos casos dividida pela soma das bases', 'A média simples das taxas', 'A maior taxa', 'A menor taxa', 'Ponderar pelo tamanho.']]);

  lesson('enganosos', 'Gráficos enganosos', 'HONESTIDADE', 'Gráficos enganosos e como evitá-los',
    'Alguns truques distorcem a mensagem, às vezes sem intenção: eixo de barras cortado, período escolhido a dedo, ícones ampliados em duas dimensões (a área cresce ao quadrado), 3D, eixo duplo e conclusões causais a partir de correlações. Conhecer esses truques serve para não cair neles e para não usá-los.',
    'É como uma foto com lente grande-angular: a pessoa é a mesma, mas o nariz parece enorme. A lente distorce.',
    'Eixo cortado → barras começam no zero\nCherry picking → mostre o período completo\nÁrea → dobrar altura e largura = 4 vezes a área\n3D → distorce tamanhos\nEixo duplo → cruzamentos artificiais\nCorrelação → não prova causa',
    ['Pergunte: alguém de fora tiraria a mesma conclusão?', 'Mostre o contexto completo e destaque a parte de interesse.', 'Prefira barras a ícones proporcionais.'],
    { p: 'O mesmo NPS, dois recortes:', c: 'Recorte set–dez → “o NPS só sobe”\nAno completo → queda em jul/ago e recuperação\nHonesto → mostrar o ano e destacar a recuperação', fig: Object.assign({ speech: 'Com o ano completo, a recuperação aparece junto da queda que a motivou.' }, npsFig) },
    ['Não escolha o período que favorece a tese.', 'Não use ícones proporcionais em duas dimensões.', 'Não afirme causa com base em correlação.'],
    [['Ampliar um ícone 2 vezes na altura e 2 na largura aumenta a área em:', '4 vezes', '2 vezes', '8 vezes', '3 vezes', '2 × 2.'],
      ['Mostrar só os meses favoráveis é chamado de:', 'Cherry picking', 'Benchmark', 'Drill down', 'Storyboard', 'Recorte conveniente.'],
      ['“Quem usa o app gasta mais, logo o app faz gastar mais” confunde:', 'Correlação com causa', 'Média com mediana', 'p.p. com %', 'Barra com linha', 'Correlação não prova causa.']]);

  /* ===================== NÍVEL 3 · APRESENTAÇÃO E DECISÃO ===================== */
  // ---- Etapa 3.1 · Dashboards
  lesson('dashboard', 'Dashboards executivos', 'DASHBOARD', 'Dashboards executivos',
    'Um painel executivo responde em segundos: estamos no rumo? Onde preciso agir? Para isso, mostra poucos KPIs (3 a 6), cada um com meta e tendência, destaca os desvios relevantes e informa a data da atualização. Painéis estratégicos olham o longo prazo; táticos acompanham planos; operacionais mostram o agora para agir no dia.',
    'É o painel do avião na cabine do comandante: poucos instrumentos, sempre no mesmo lugar, e alarmes só quando algo sai do normal.',
    'Estratégico → poucos KPIs, visão trimestral ou anual\nTático → planos e metas mensais por área\nOperacional → tempo real, ação no dia\nPrimeira tela → 3 a 6 KPIs com meta e tendência\nDesvios → em destaque\nRodapé → fonte e última atualização',
    ['Comece pelas perguntas que o painel responde.', 'Detalhes vão para páginas de apoio.', 'Atualização visível gera confiança.'],
    { p: 'Primeira tela do painel executivo de vendas:', c: 'Faturamento → R$ 7,2 mi (90% da meta) ▼\nMargem → 24% (meta 25%) ▲\nNPS → 50 (meta 50) ▲\nCancelamento → 2,4% (meta 2,5%) ▼\nAtualizado em → 01/12, 7h', fig: { type: 'cards', items: [['R$ 7,2 mi', 'Faturamento · 90% da meta'], ['24%', 'Margem · meta 25%'], ['NPS 50', 'Meta atingida'], ['2,4%', 'Cancelamento · abaixo da meta de 2,5%']], speech: 'Quatro KPIs, cada um com sua meta: em segundos se vê onde agir.' } },
    ['Não coloque 18 indicadores na primeira tela.', 'Não esconda a data de atualização.', 'Não misture estratégico e operacional na mesma tela.'],
    [['O objetivo de um painel executivo é:', 'Mostrar em segundos se o negócio está no rumo', 'Reunir todos os dados', 'Substituir reuniões', 'Ter o máximo de gráficos', 'Monitoramento rápido.'],
      ['Pedidos atrasados agora, atualizados a cada 15 minutos, é um painel:', 'Operacional', 'Estratégico', 'Tático', 'Explicativo', 'Tempo real para agir no dia.'],
      ['A primeira tela de um painel executivo deve ter cerca de:', '3 a 6 KPIs', '20 KPIs', '1 tabela com 2 mil linhas', '15 filtros', 'Foco no essencial.']]);

  lesson('layout', 'Layout e leitura', 'LAYOUT', 'Layout e fluxo de leitura do painel',
    'O layout do painel segue a leitura: do topo à esquerda para baixo à direita, do geral ao específico. KPIs no topo, tendências no meio, detalhes embaixo. Uma grade com colunas e margens iguais alinha os visuais. Consistência de unidades, cores e nomes entre páginas evita que o leitor precise reaprender o painel. Rascunhe no papel antes de construir.',
    'Um bom supermercado tem corredores organizados e placas no alto. Você acha o que precisa sem pedir ajuda.',
    'Topo → KPIs principais\nMeio → tendências e comparações\nBase → detalhe e tabelas\nGrade → colunas e margens iguais\nConsistência → mesma unidade, cor e nome em todas as páginas\nProcesso → perguntas → KPIs → rascunho → construção → teste',
    ['Teste o painel com usuários reais.', 'Mantenha os filtros sempre no mesmo lugar.', 'Use a mesma unidade em todo o painel.'],
    { p: 'Esqueleto do painel de vendas:', c: 'Linha 1 → 4 cartões de KPI\nLinha 2 → vendas mensais × meta | vendas por canal\nLinha 3 → tabela de lojas com mapa de calor\nRodapé → fonte e atualização', fig: { type: 'chevrons', steps: [{ k: '1', t: 'Perguntas' }, { k: '2', t: 'KPIs' }, { k: '3', t: 'Rascunho' }, { k: '4', t: 'Construção' }, { k: '5', t: 'Teste' }], speech: 'Do papel ao painel: perguntas, indicadores, rascunho, construção e teste.' } },
    ['Não comece pelo software.', 'Não varie tamanhos e alinhamentos sem motivo.', 'Não mude unidades e cores entre páginas.'],
    [['Num painel, os KPIs principais devem ficar:', 'No topo', 'No rodapé', 'Escondidos em um filtro', 'No meio da tabela', 'Do geral ao específico.'],
      ['A grade no layout serve para:', 'Alinhar os visuais e dar ordem', 'Colorir o fundo', 'Aumentar o número de visuais', 'Esconder dados', 'Organização visual.'],
      ['Mudar a cor de “App” entre as páginas do painel causa:', 'Confusão: o leitor precisa reaprender', 'Mais clareza', 'Melhor desempenho', 'Nada', 'Consistência importa.']]);

  lesson('interatividade', 'Interatividade', 'INTERATIVIDADE', 'Interatividade com propósito',
    'Filtros, detalhamento (drill) e dicas de ferramenta (tooltip) permitem que cada usuário explore o painel sem duplicar páginas. Mas a mensagem principal não pode depender de cliques. Mostre quais filtros estão ativos, ofereça um botão para limpar e guarde detalhes no tooltip. Para convencer numa reunião, use slides explicativos; o painel fica para consulta.',
    'É o cardápio com fotos: quem quer saber os ingredientes vira a página, mas o prato principal já está na capa.',
    'Filtro → uma estrutura para todos (região, período)\nDrill → do total ao detalhe\nTooltip → detalhe sob demanda\nEstado → mostrar filtros ativos e permitir limpar\nReunião → slide com a mensagem; painel para consulta',
    ['Padrão do filtro deve ser “Todos”.', 'Menos cliques até a resposta principal.', 'Tooltip não substitui o rótulo essencial.'],
    { p: 'Interatividade no painel de vendas:', c: 'Filtro → Região (padrão: Todas)\nDrill → Região → Estado → Loja\nTooltip → margem e ticket da barra\nBotão → Limpar filtros', fig: { type: 'flow', steps: [{ t: 'start', label: 'Visão total do Brasil' }, { t: 'proc', label: 'Drill: região Nordeste' }, { t: 'proc', label: 'Drill: estado de Pernambuco' }, { t: 'end', label: 'Detalhe: lojas de Recife' }], speech: 'O detalhamento leva do total do país até as lojas de uma cidade.' } },
    ['Não crie uma página por região.', 'Não esconda a mensagem atrás de cliques.', 'Não deixe o usuário sem saber o que está filtrado.'],
    [['Para que cada gerente veja sua região, o mais simples é:', 'Um filtro de região', 'Uma página por região', 'Um painel por gerente', 'Uma tabela sem filtro', 'Uma estrutura, vários olhares.'],
      ['Detalhes que poluem o gráfico podem ir para:', 'A dica de ferramenta (tooltip)', 'O título', 'O eixo', 'A legenda', 'Detalhe sob demanda.'],
      ['Para convencer a diretoria numa reunião, prefira:', 'Um slide explicativo com a conclusão', 'Clicar nos filtros ao vivo', 'Mandar o link sem comentário', 'Imprimir todas as páginas', 'Painel é para consulta.']]);

  lesson('acessibilidade', 'Acessibilidade', 'ACESSÍVEL', 'Acessibilidade na visualização',
    'Um material acessível alcança mais pessoas: quem tem daltonismo, baixa visão, usa leitor de tela ou lê no celular. Garanta contraste entre texto e fundo, não dependa só de cor (use rótulos, ícones e estilos de linha), escreva texto alternativo que transmita a mensagem do gráfico e use fontes de tamanho confortável. Cerca de 8% dos homens têm algum tipo de daltonismo.',
    'Rampas de acesso ajudam cadeirantes, mas também quem empurra carrinho de bebê ou de compras. Acessibilidade beneficia todos.',
    'Contraste → texto escuro em fundo claro (ou o inverso)\nAlém da cor → rótulos, ícones, tracejados\nPaleta segura → azul e laranja\nTexto alternativo → a mensagem, não “gráfico 1”\nFonte → tamanho confortável na tela real\nImpressão → teste em preto e branco',
    ['Simule daltonismo antes de publicar.', 'Texto alternativo resume a conclusão.', 'Teste no projetor e no celular.'],
    { p: 'Texto alternativo do gráfico de NPS:', c: 'Ruim → “Gráfico de linha”\nBom → “NPS mensal de 2025: estável em torno de 54\n        até junho, queda para 38 em agosto e\n        recuperação para 50 em dezembro”', fig: { type: 'cards', items: [['Contraste', 'Texto legível sobre o fundo, também no projetor.'], ['Além da cor', 'Rótulos, ícones e estilos de linha.'], ['Texto alternativo', 'A mensagem do gráfico em uma frase.']], speech: 'Contraste, mais de um sinal além da cor e texto alternativo tornam o material acessível.' } },
    ['Não use só vermelho e verde.', 'Não use fontes minúsculas.', 'Não escreva “imagem” como texto alternativo.'],
    [['Uma combinação de cores segura para daltônicos é:', 'Azul e laranja', 'Vermelho e verde', 'Verde e marrom', 'Rosa e vermelho', 'Distinguível pela maioria.'],
      ['Um bom texto alternativo de gráfico:', 'Descreve a mensagem e os pontos principais', 'Diz apenas “gráfico”', 'Lista as cores', 'Repete o nome do arquivo', 'Transmite a conclusão.'],
      ['Para um gráfico impresso em preto e branco, diferencie as séries com:', 'Rótulos diretos e estilos de linha', 'Cores mais vivas', 'Legenda maior', 'Pizza', 'Cor não pode ser o único sinal.']]);

  // ---- Etapa 3.2 · Apresentações
  lesson('slides', 'Slides', 'SLIDES', 'Slides que apoiam a fala',
    'Slide apoia a fala; não é teleprompter nem documento. Uma ideia por slide, título com a conclusão, pouco texto e o gráfico como protagonista. Para explicar algo em etapas, revele aos poucos (primeiro o contexto, depois a queda, depois a recuperação). Se o material vai ser lido sem você, prepare uma versão de leitura com texto completo.',
    'O slide é a placa da estrada, não o mapa inteiro. Ele diz para onde ir enquanto o motorista (você) conduz.',
    'Uma ideia → um slide\nTítulo → a conclusão\nTexto → mínimo; a fala completa\nRevelação progressiva → construir o gráfico em etapas\nVersão de leitura → texto completo para enviar depois\nApêndice → detalhes e respostas',
    ['Se precisa de muito texto, talvez seja um documento.', 'Revelar aos poucos mantém o público com você.', 'Animações só quando ajudam a explicar.'],
    { p: 'Revelação progressiva do NPS em 3 slides:', c: 'Slide 1 → jan a jun: estável em torno de 54\nSlide 2 → jul e ago: queda para 38 (atrasos)\nSlide 3 → set a dez: recuperação para 50 (novo SLA)', fig: Object.assign({ speech: 'Mostrar o gráfico em três etapas mantém o público no ponto que você está explicando.' }, npsFig) },
    ['Não leia o slide em voz alta.', 'Não coloque três gráficos e seis tópicos no mesmo slide.', 'Não envie os slides de palco como material de leitura sem adaptar.'],
    [['O princípio para um slide com 3 gráficos e 6 tópicos é:', 'Uma ideia por slide', 'Diminuir a fonte', 'Adicionar animações', 'Duas colunas', 'Separe as mensagens.'],
      ['Revelar o gráfico em etapas serve para:', 'Manter a atenção no ponto que está sendo explicado', 'Deixar a apresentação mais longa', 'Esconder dados', 'Usar mais animações', 'Guiar o público.'],
      ['Para quem vai ler depois, sem apresentador, prepare:', 'Uma versão de leitura com texto completo', 'Os mesmos slides sem mudanças', 'Só a gravação', 'Só os gráficos', 'O material precisa se explicar.']]);

  lesson('resumo', 'Resumo executivo', 'BLUF', 'Resumo executivo: a resposta primeiro',
    'O resumo executivo é a página que a diretoria lê de verdade. Ele começa pela resposta (bottom line up front): a recomendação e o impacto. Depois, a evidência principal, os riscos com a mitigação e o próximo passo com prazo. Cabe em uma página ou um slide. O corpo traz as evidências e o apêndice, os detalhes para quem quiser conferir.',
    'É o trailer do filme: em dois minutos, você sabe o essencial e decide se quer ver o resto.',
    '1. Recomendação → o que fazer\n2. Impacto → quanto ganha ou economiza\n3. Evidência → o principal achado\n4. Riscos → e como mitigar\n5. Próximo passo → pedido e prazo\nCorpo → evidências | Apêndice → detalhes',
    ['Escreva o resumo por último, mas coloque-o primeiro.', 'Uma página é o limite.', 'Use números concretos.'],
    { p: 'Resumo executivo do frete:', c: 'Recomendação → frete grátis a partir de R$ 149\nImpacto → +3 p.p. de margem (R$ 4,1 mi/ano)\nEvidência → teste em 2 regiões manteve 90% das vendas\nRisco → cancelamento; monitorar semanalmente\nPedido → aprovar até 15/11, antes da Black Friday', fig: { type: 'chevrons', steps: [{ k: '1', t: 'Recomendação' }, { k: '2', t: 'Impacto' }, { k: '3', t: 'Evidência' }, { k: '4', t: 'Riscos' }, { k: '5', t: 'Pedido' }], speech: 'O resumo executivo começa pela resposta e termina com o pedido.' } },
    ['Não comece com “conforme solicitado, segue a análise…”.', 'Não passe de uma página.', 'Não esqueça o prazo da decisão.'],
    [['O resumo executivo começa por:', 'A recomendação e o impacto', 'A metodologia', 'Os agradecimentos', 'O histórico do projeto', 'Bottom line up front.'],
      ['O tamanho ideal do resumo executivo é:', 'Uma página ou um slide', 'Quatro páginas', 'Igual ao relatório', 'Uma frase sem números', 'Para quem tem pouco tempo.'],
      ['A tabela de custos das 14 transportadoras deve ir para:', 'O apêndice', 'O resumo executivo', 'O título', 'A primeira página', 'Detalhe para conferência.']]);

  lesson('aovivo', 'Apresentação ao vivo', 'AO VIVO', 'Apresentando ao vivo',
    'Ao vivo, você é a narração. Ensaie em voz alta e cronometre, teste o material no equipamento da sala e tenha a versão de 1 minuto pronta caso o tempo seja cortado. Para cada gráfico, siga um roteiro: oriente o público (o que é o gráfico), aponte o ponto principal, explique a causa e diga o que fazer. Menos texto no slide, mais conteúdo na fala.',
    'Um guia de museu não lê a placa ao lado do quadro: ele aponta o detalhe que você não tinha visto e conta a história por trás.',
    'Antes → ensaiar, cronometrar, testar a sala\nGráfico → 1. o que é (eixos e unidade)\n          2. o ponto principal\n          3. por que aconteceu\n          4. o que fazer\nTempo cortado → recomendação, impacto e pedido',
    ['Fale com o público, não com o slide.', 'Pausas dão tempo para o público absorver.', 'Tenha sempre a versão curta pronta.'],
    { p: 'Roteiro de fala de um gráfico:', c: 'Orientar → “Este é o cancelamento mensal de 2025”\nFocar → “Repare no salto em julho”\nExplicar → “Foi quando o frete subiu R$ 8”\nAgir → “Proponho voltar à regra antiga”', fig: { type: 'chevrons', steps: [{ k: '1', t: 'O que é' }, { k: '2', t: 'O ponto' }, { k: '3', t: 'A causa' }, { k: '4', t: 'A ação' }], speech: 'Oriente, foque, explique e proponha a ação.' } },
    ['Não decore o texto palavra por palavra.', 'Não fale enquanto o público lê um parágrafo no slide.', 'Não acrescente slides de última hora sem revisar.'],
    [['Se a reunião atrasou e restam 5 dos 20 minutos, você deve:', 'Ir direto à recomendação, ao impacto e ao pedido', 'Falar mais rápido', 'Remarcar sem apresentar', 'Mostrar a metodologia', 'Versão curta pronta.'],
      ['Mostrar um slide com muito texto enquanto fala faz o público:', 'Ler e deixar de ouvir', 'Absorver tudo duas vezes', 'Prestar mais atenção', 'Nada muda', 'A atenção se divide.'],
      ['O primeiro passo ao apresentar um gráfico é:', 'Dizer o que ele mostra (eixos e unidade)', 'Dizer a ação', 'Ler a fonte', 'Mostrar o apêndice', 'Oriente o público.']]);

  lesson('objecoes', 'Perguntas e objeções', 'OBJEÇÕES', 'Perguntas e objeções',
    'Perguntas são sinal de interesse. Antecipe as objeções que podem travar a decisão (“vamos perder clientes?”) e prepare slides de apoio no apêndice. Quando não souber a resposta, admita, diga o que sabe e se comprometa com um prazo. Diante de opiniões, respeite a experiência e traga o dado. Se a discussão sair do tema, registre e volte à decisão.',
    'Um bom advogado ensaia as perguntas da outra parte antes do julgamento. Ele não é pego de surpresa.',
    'Antecipar → liste as 5 objeções mais prováveis\nApêndice → um slide de apoio para cada\nNão sei → admitir, dizer o que sabe, prazo para responder\nOpinião → reconhecer a experiência e mostrar o dado\nFora do tema → registrar e voltar à decisão',
    ['Credibilidade vale mais que uma resposta improvisada.', 'Peça a um colega para fazer as perguntas difíceis no ensaio.', 'Responda curto e volte à mensagem.'],
    { p: 'Objeções da proposta de frete:', c: '“Vamos perder clientes?” → teste: 90% das vendas mantidas\n“E a concorrência?” → 3 dos 4 maiores usam R$ 149\n“E a Black Friday?” → regra especial de 20 a 30/11\n“Não sei” → enviar o dado das lojas até sexta', fig: { type: 'table', cols: ['Objeção provável', 'Resposta com dado'], rows: [['Vamos perder clientes?', 'Teste manteve 90% das vendas'], ['O concorrente faz diferente?', '3 dos 4 maiores usam R$ 149'], ['E a Black Friday?', 'Regra especial de 20 a 30/11']], speech: 'Cada objeção provável tem uma resposta com dado pronta no apêndice.' } },
    ['Não invente números para responder.', 'Não trate a objeção como ataque pessoal.', 'Não deixe a reunião sair do objetivo.'],
    [['Quando não tem o dado pedido, o melhor é:', 'Admitir, dizer o que sabe e prometer a resposta com prazo', 'Inventar uma estimativa', 'Mudar de assunto', 'Dizer que a pergunta é irrelevante', 'Credibilidade em primeiro lugar.'],
      ['Diante de “na minha experiência, cliente não liga para frete”, você deve:', 'Reconhecer a experiência e mostrar a evidência', 'Dizer que ele está errado', 'Ignorar', 'Concordar para evitar conflito', 'Do “eu acho” ao dado.'],
      ['Slides para responder perguntas sobre a metodologia ficam:', 'No apêndice', 'No começo', 'No título', 'Em lugar nenhum', 'Prontos se perguntarem.']]);

  // ---- Etapa 3.3 · Decisão e impacto
  lesson('recomendacao', 'Recomendação', 'RECOMENDAÇÃO', 'Recomendações acionáveis',
    'Uma recomendação acionável diz o quê fazer, quem faz, até quando e qual resultado esperar, com o custo e o retorno. “Melhorar a logística do Norte” não é acionável; “contratar uma transportadora regional em Manaus até março, com meta de 6 dias de prazo, sob responsabilidade da logística” é. Quando houver alternativas, compare-as em critérios claros e indique a sua.',
    'Receita de bolo boa diz ingredientes, quantidades, forno e tempo. “Faça um bolo gostoso” não ajuda ninguém.',
    'O quê → a ação concreta\nQuem → o responsável\nQuando → o prazo\nResultado → a meta esperada\nCusto e retorno → investimento, ganho, payback\nAlternativas → critérios (custo, impacto, prazo, risco)',
    ['Payback = investimento ÷ ganho por período.', 'Mostre que você considerou alternativas.', 'Recomende com convicção, sem esconder os riscos.'],
    { p: 'Comparação de alternativas para reduzir devoluções:', c: 'Tabela de medidas → R$ 80 mil, −50% devoluções, payback 3,2 meses\nProvador virtual → R$ 600 mil, −60%, payback 18 meses\nFrete reverso pago → R$ 0, −20%, risco ao NPS\nRecomendação → tabela de medidas', fig: { type: 'table', cols: ['Opção', 'Custo', 'Redução', 'Prazo', 'Risco'], rows: [['Tabela de medidas', 'R$ 80 mil', '50%', '2 meses', 'Baixo'], ['Provador virtual', 'R$ 600 mil', '60%', '9 meses', 'Médio'], ['Cobrar frete reverso', 'R$ 0', '20%', '1 mês', 'Alto (NPS)']], hl: [0], speech: 'A tabela de medidas tem o melhor equilíbrio entre custo, impacto e risco.' } },
    ['Não recomende “estudar mais” sem prazo.', 'Não apresente opções sem indicar a sua.', 'Não omita custo e risco.'],
    [['Qual recomendação é acionável?', 'Contratar transportadora em Manaus até março, meta de 6 dias, responsável: logística', 'Melhorar a logística do Norte', 'Ficar atento ao prazo', 'Estudar mais o problema', 'O quê, quem, quando e meta.'],
      ['Um projeto de R$ 80 mil que economiza R$ 25 mil por mês se paga em:', '3,2 meses', '2 meses', '5 meses', '12 meses', '80 ÷ 25.'],
      ['Ao apresentar três alternativas, você deve:', 'Compará-las em critérios claros e indicar a recomendada', 'Mostrar só a sua preferida', 'Não opinar', 'Adiar a decisão', 'Facilita decidir.']]);

  lesson('incerteza', 'Incerteza', 'INCERTEZA', 'Comunicar incerteza',
    'Toda previsão e estimativa tem incerteza, e comunicá-la bem aumenta a confiança. Use faixas (“entre R$ 8,2 e 9,8 mi”), áreas sombreadas no gráfico, cenários (pessimista, base, otimista) com suas premissas ou probabilidades (“80% de chance de passar a meta”). Evite a precisão falsa: “R$ 1.237.482,19” passa uma certeza que a estimativa não tem.',
    'A previsão do tempo diz “70% de chance de chuva”, não “vai chover às 15h12”. E você leva o guarda-chuva mesmo assim.',
    'Faixa → valor central + intervalo provável\nGráfico → área sombreada em volta da previsão\nCenários → pessimista, base, otimista + premissas\nProbabilidade → chance de atingir a meta\nArredondar → “cerca de R$ 1,2 mi”\nPremissas → sempre explícitas',
    ['Incerteza não é desculpa para não recomendar.', 'Mostre o que mudaria a conclusão.', 'Arredonde estimativas.'],
    { p: 'Previsão de vendas com faixa:', c: 'Dezembro → R$ 9,0 mi\nFaixa provável → R$ 8,2 a 9,8 mi\nMeta → R$ 8,5 mi\nChance de atingir a meta → cerca de 80%', fig: { type: 'line', values: [6.1, 6.4, 7.2], fc: [9.0], labels: ['set', 'out', 'nov', 'dez (prev.)'], name: 'Vendas (R$ mi)', speech: 'A previsão de dezembro é de 9 milhões, com faixa provável de 8,2 a 9,8.' } },
    ['Não mostre previsão como certeza.', 'Não use casas decimais demais em estimativas.', 'Não esconda as premissas.'],
    [['Uma forma clara de mostrar incerteza em um gráfico de previsão é:', 'Uma faixa sombreada em volta da linha', 'Mais casas decimais', 'Tirar a previsão', 'Usar pizza', 'Mostra a faixa provável.'],
      ['“Economia de R$ 1.237.482,19 por ano” é um exemplo de:', 'Precisão falsa', 'Boa prática', 'Cenário otimista', 'Benchmark', 'Arredonde estimativas.'],
      ['Apresentar três cenários com premissas serve para:', 'Mostrar como a decisão depende das premissas', 'Confundir o público', 'Esconder o risco', 'Evitar recomendar', 'Sensibilidade da decisão.']]);

  lesson('etica', 'Ética', 'ÉTICA', 'Ética e honestidade com dados',
    'Credibilidade é o principal ativo de quem trabalha com dados. Seja transparente: informe fonte, período, tamanho da amostra e limitações. Mostre também os resultados que contrariam a hipótese. Proteja dados pessoais (LGPD): agregue ou anonimize. E resista à pressão por “ajustar” gráficos: há sempre uma forma honesta de destacar o que funcionou.',
    'Um analista é como um juiz de futebol: se roubar uma vez a favor do time da casa, ninguém confia mais em nenhuma marcação dele.',
    'Transparência → fonte, período, amostra, limitações\nResultados contrários → também aparecem\nLGPD → agregar ou anonimizar dados pessoais\nPressão → propor um destaque honesto\nDefinições → não mudar métrica para melhorar o número\nMás notícias → fatos, sem culpados, foco no aprendizado',
    ['Pergunte: eu mostraria isso a quem discorda de mim?', 'Registre as definições das métricas.', 'Dados pessoais exigem cuidado mesmo internamente.'],
    { p: 'Checklist ético do relatório:', c: 'Fonte → Pesquisa NPS, n = 4.200/mês, jan a dez/2025\nLimitação → só clientes que responderam (cerca de 12%)\nContrário → região Sul piorou no 2º semestre\nPrivacidade → nenhum dado pessoal exposto', fig: { type: 'cards', items: [['Transparência', 'Fonte, período, amostra e limitações sempre visíveis.'], ['Privacidade', 'Dados pessoais agregados ou anonimizados.'], ['Integridade', 'Resultados contrários também aparecem.']], speech: 'Transparência, privacidade e integridade sustentam a credibilidade.' } },
    ['Não corte eixos nem escolha períodos para agradar.', 'Não exponha nome, telefone ou endereço de clientes.', 'Não redefina métricas para melhorar o resultado.'],
    [['Diante do pedido de cortar o eixo para a campanha parecer melhor, você deve:', 'Manter o gráfico honesto e propor outro destaque legítimo', 'Cortar o eixo', 'Apagar a campanha', 'Trocar os números', 'Credibilidade em primeiro lugar.'],
      ['Mostrar nome e telefone de clientes num slide fere:', 'A privacidade e a LGPD', 'A Gestalt', 'A hierarquia visual', 'O arco narrativo', 'Agregue ou anonimize.'],
      ['Reforça a transparência:', 'Informar fonte, período e tamanho da amostra', 'Omitir regiões com resultado ruim', 'Mudar a definição da métrica', 'Mostrar só o que confirma a hipótese', 'Deixe a análise verificável.']]);

  lesson('final', 'Desafio final', 'DO DADO À DECISÃO', 'Desafio final: do dado à decisão',
    'O método completo de storytelling com dados: entenda o contexto (público, decisão e formato), explore os dados, defina a grande ideia em uma frase, monte o storyboard, escolha e refine os gráficos (cor com intenção, títulos que concluem, anotações), prepare a recomendação acionável e ensaie, antecipando as objeções. Se o público precisar perguntar “o que você quer que eu faça?”, a mensagem não chegou.',
    'É como preparar uma viagem: destino (mensagem), roteiro (storyboard), bagagem (gráficos) e ensaio (checklist) antes de sair de casa.',
    '1. Contexto → quem, o quê, como\n2. Exploração → achados que importam\n3. Grande ideia → uma frase\n4. Storyboard → sequência da história\n5. Visuais → gráfico certo, destaque, título-ação\n6. Recomendação → o quê, quem, quando, impacto\n7. Ensaio → tempo, sala e objeções',
    ['Diga a ação no início e repita no fim.', 'Revise com alguém que não participou da análise.', 'Menos, porém melhor.'],
    { p: 'Checklist final antes de enviar:', c: 'Títulos → cada slide com a conclusão\nDestaque → aponta para a mensagem\nRecomendação → ação, impacto, dono e prazo\nHonestidade → eixos, períodos e fontes corretos\nEnsaio → feito, com objeções preparadas', fig: { type: 'chevrons', steps: [{ k: '1', t: 'Contexto' }, { k: '2', t: 'Exploração' }, { k: '3', t: 'Grande ideia' }, { k: '4', t: 'Storyboard' }, { k: '5', t: 'Visuais' }, { k: '6', t: 'Recomendação' }, { k: '7', t: 'Ensaio' }], speech: 'Sete passos levam do dado à decisão.' } },
    ['Não pule o contexto.', 'Não confunda volume de dados com qualidade da história.', 'Não termine sem a ação.'],
    [['Se o CEO pergunta “o que você quer que eu faça?” ao fim da apresentação:', 'A recomendação não ficou clara', 'O CEO não prestou atenção', 'Faltaram gráficos', 'A apresentação foi curta demais', 'Diga a ação no início e no fim.'],
      ['Para mostrar o ranking de 8 categorias por margem, use:', 'Barras ordenadas', 'Pizza', 'Linha', 'Slopegraph', 'Ranking pede barras ordenadas.'],
      ['A etapa que vem logo depois de explorar os dados é:', 'Definir a grande ideia', 'Escolher as cores', 'Ensaiar', 'Enviar o painel', 'Mensagem antes dos visuais.']]);

  /* ------------------------------ Pacote ------------------------------ */
  const COMPUTED = { hbars: 1, bars: 1, line: 1, pie: 1 };
  function register() {
    if (!global.Lessons || !global.Lessons.registerPack) return;
    global.Lessons.registerPack('storytelling', {
      LESSONS: L, MAP: MAP, fallback: 'contexto', goalLabel: 'Sua missão',
      steps: ['Conceito', 'Como fazer', 'Exemplo aplicado', 'Cuidados', 'Seu desafio'],
      syntaxTitle: 'Como fazer',
      solution: function (ex) {
        const esc = global.UI.esc; let html = '';
        if (ex.kind === 'choice') html = '<p class="ls-ans">' + esc(ex.opts[0]) + '</p>';
        else if (ex.kind === 'multi') html = '<ul class="ls-anslist">' + ex.ok.map(function (i) { return '<li>' + esc(ex.opts[i]) + '</li>'; }).join('') + '</ul>';
        else if (ex.kind === 'order') html = '<ol class="ls-anslist num">' + ex.items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ol>';
        else if (ex.kind === 'classify') html = '<ul class="ls-anslist">' + ex.items.map(function (it) { return '<li><span>' + esc(it[0]) + '</span><b>' + esc(ex.cats[it[1]]) + '</b></li>'; }).join('') + '</ul>';
        else html = '<p class="ls-ans">' + esc((ex.unit === 'R$' ? 'R$ ' : '') + global.GQCharts.fmt(ex.a, ex.dec == null ? 2 : ex.dec) + (ex.unit && ex.unit !== 'R$' ? (ex.unit === '%' ? '%' : ' ' + ex.unit) : '')) + '</p>';
        return { label: 'Resposta', html: html, note: ex.x, speech: ex.x };
      }, syntaxSpeech: 'Agora, o passo a passo. Repare em como cada escolha serve à mensagem.', compareSpeech: 'Repare como os dados viram uma história.',
      codeHtml: function (code) { return global.GQCharts.highlight(code); },
      example: function (les) {
        const out = global.GQCharts.render(Object.assign({ theme: 'storytelling' }, les.exemplo.fig));
        return { code: les.exemplo.c, badge: COMPUTED[les.exemplo.fig.type] ? 'Desenhado agora com dados da NexusMarket' : 'Aplicado aos dados da NexusMarket', liveHtml: out.html, speech: out.speech };
      },
      tags: function (ex) {
        const K = { choice: ['target', 'Estudo de caso'], multi: ['check', 'Marque todas as corretas'], order: ['bars', 'Coloque em ordem'], classify: ['grid', 'Classifique os itens'], calc: ['code', 'Cálculo com dados reais'] }[ex.kind] || ['target', 'Caso'];
        return [{ icon: K[0], label: K[1] }].concat(ex.d ? [{ icon: 'bars', label: 'Com gráfico' }] : []);
      },
    });
  }
  register();
  global.DVLessons = { LESSONS: L, MAP: MAP };
})(typeof window !== 'undefined' ? window : globalThis);
