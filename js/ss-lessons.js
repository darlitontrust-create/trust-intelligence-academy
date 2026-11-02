/* =====================================================================
   ss-lessons.js — Aulas da trilha de Lean Six Sigma
   ---------------------------------------------------------------------
   42 aulas em 9 etapas: White Belt (1.1), Yellow Belt (1.2 e 1.3),
   Green Belt (2.1 Measure, 2.2 Analyze, 2.3 Improve e Control) e
   Black Belt (3.1 Estatística, 3.2 Experimentos, 3.3 Liderança).
   Mesmo carrossel da Gestão; gráficos e números calculados na hora.
   Questões de prova: [pergunta, correta, errada1, errada2, errada3, explicação]
   ===================================================================== */
(function (global) {
  'use strict';
  const L = {}, MAP = {};
  const D = global.SSData, C = global.GQCharts.calc, r = global.GQCharts.round, f = global.GQCharts.fmt;
  function lesson(key, topic, kw, titulo, ideia, analogia, sintaxe, notas, exemplo, cuidados, quiz) {
    L[key] = { key: key, kw: kw, titulo: titulo, ideia: ideia, analogia: analogia, sintaxe: sintaxe, notas: notas, exemplo: exemplo, cuidados: cuidados, quiz: quiz };
    MAP[topic] = key;
  }
  const an = C.anova(Object.values(D.cds)), t2 = C.t2(D.turnoA, D.turnoB), ch = C.chi2(D.transp.tab), rg = C.regress(D.distancia), mr = C.mreg(D.mreg.X, D.mreg.y), ef = C.effects(D.doe.runs, 3);
  const dp = C.dpmo(D.base.defeitos, D.base.pedidos, D.base.oport);

  /* ======================= NÍVEL 1 · WHITE E YELLOW BELT ======================= */
  // ---- Etapa 1.1 · White Belt
  lesson('lss', 'Lean Six Sigma', 'LSS', 'O que é Lean Six Sigma',
    'Lean Six Sigma junta dois métodos: o Lean, que elimina desperdícios e acelera o fluxo, e o Six Sigma, que reduz a variação para entregar sempre dentro do que o cliente espera. O resultado é um processo rápido e confiável, guiado por dados e por projetos com dono e meta.',
    'Pense numa estrada: o Lean tira os buracos e os semáforos desnecessários (anda mais rápido); o Six Sigma mantém o carro sempre na faixa certa (sem sair da pista).',
    'Lean        → velocidade: menos espera, menos desperdício\nSix Sigma   → precisão: menos variação, menos defeito\nMétodo      → DMAIC (Definir, Medir, Analisar, Melhorar, Controlar)\nBase        → dados, cliente e projetos com meta\nPessoas     → faixas: White, Yellow, Green, Black',
    ['O foco é o que o cliente valoriza, não a opinião interna.', 'Decisões se apoiam em dados medidos, não em palpites.', 'Melhorias viram projetos com escopo, meta, dono e prazo.'],
    { p: 'Os dois lados do método na NexusMarket:', c: '# Lean: o pedido leva 518 min, só 23 agregam valor\n# Six Sigma: 60 defeitos em 20.000 oportunidades\nLean      → cortar espera e retrabalho\nSix Sigma → reduzir pedidos com problema', fig: { type: 'cards', items: [['Lean', 'Velocidade: elimina os 8 desperdícios e faz o trabalho fluir.'], ['Six Sigma', 'Precisão: reduz a variação até poucos defeitos por milhão.'], ['DMAIC', 'O roteiro dos projetos: Definir, Medir, Analisar, Melhorar e Controlar.'], ['Faixas', 'White e Yellow apoiam; Green conduz projetos; Black lidera e ensina.']], speech: 'Quatro ideias resumem o método: Lean, Six Sigma, DMAIC e as faixas.' } },
    ['Lean Six Sigma não é só estatística: começa por entender o cliente e o processo.', 'Não comece pela solução; comece pelo problema medido.', 'Projeto sem dono e sem meta vira lista de desejos.'],
    [['O que o Lean busca, principalmente?', 'Eliminar desperdícios e acelerar o fluxo', 'Reduzir a variação estatística', 'Aumentar o estoque', 'Inspecionar 100% dos itens', 'Lean é velocidade e fluxo; Six Sigma é precisão.'],
      ['O que o Six Sigma busca, principalmente?', 'Reduzir a variação e os defeitos', 'Eliminar etapas sem valor', 'Contratar mais inspetores', 'Aumentar a produção a qualquer custo', 'Menos variação significa menos defeitos.'],
      ['Qual é o roteiro dos projetos Six Sigma?', 'DMAIC', 'PDCA de 3 fases', 'SWOT', '5W2H', 'Definir, Medir, Analisar, Melhorar e Controlar.']]);

  lesson('voc', 'Voz do cliente', 'VOC', 'Valor e voz do cliente (VOC)',
    'Valor é aquilo pelo qual o cliente pagaria. A voz do cliente (VOC) reúne o que ele diz em reclamações, pesquisas, avaliações e conversas. O primeiro passo de qualquer melhoria é traduzir essa voz em requisitos claros, sem supor o que ele quer.',
    'É como um alfaiate: ele mede o cliente antes de cortar o tecido. Fazer a roupa “no olho” e depois ajustar custa muito mais.',
    'Fontes      → reclamações, pesquisa, NPS, SAC, redes, entrevistas\nOrganizar   → agrupar comentários por tema\nTraduzir    → necessidade → requisito mensurável\nValor       → o cliente pagaria por isso?\nVerificar   → validar com o próprio cliente',
    ['Atividade que agrega valor muda o produto ou serviço como o cliente quer.', 'Atividade necessária sem valor (exigência legal, por exemplo) deve ser minimizada.', 'Atividade sem valor é desperdício: elimine.'],
    { p: 'Do que os clientes reclamam no trimestre:', c: '# 360 reclamações no SAC\nAtraso na entrega → 142\nProduto avariado  → 88\nItem errado       → 61', fig: { type: 'bars', labels: D.reclamacoes.slice(0, 5).map(function (x) { return x[0]; }), series: [{ name: 'Reclamações', values: D.reclamacoes.slice(0, 5).map(function (x) { return x[1]; }) }], speech: 'A voz do cliente mostra que atraso na entrega lidera, com 142 reclamações no trimestre.' } },
    ['Não confunda o que é fácil de medir com o que o cliente valoriza.', 'Clientes internos também têm voz: a etapa seguinte do processo.', 'Uma reclamação isolada é sinal; o padrão nos dados é evidência.'],
    [['O que é “valor” no Lean?', 'Aquilo pelo qual o cliente pagaria', 'O preço de custo', 'Tudo o que a empresa faz', 'O lucro da empresa', 'Valor é definido pelo cliente.'],
      ['Qual é uma fonte de VOC?', 'Reclamações do SAC', 'O organograma', 'O balanço contábil', 'O plano de férias', 'O SAC registra a voz do cliente.'],
      ['Conferir o pedido duas vezes porque a primeira falha é:', 'Atividade sem valor (retrabalho)', 'Atividade que agrega valor', 'Requisito do cliente', 'Inovação', 'O cliente não paga pela segunda conferência.']]);

  lesson('muda', 'Desperdícios', 'MUDA', 'Os 8 desperdícios',
    'Desperdício (muda) é tudo que consome tempo ou recurso sem agregar valor. O Lean lista 8 tipos, lembrados pela sigla TIMWOODS: Transporte, Inventário (estoque), Movimentação, Espera (Waiting), Superprodução (Overproduction), Processamento excessivo (Overprocessing), Defeitos e talentos não aproveitados (Skills).',
    'É como arrumar a cozinha: andar até a despensa toda hora (movimento), comprar comida que estraga (estoque) e lavar a louça duas vezes (retrabalho) não deixam a comida mais gostosa.',
    'T → Transporte: mover material sem necessidade\nI → Inventário: estoque além do necessário\nM → Movimentação: pessoas andando e procurando\nW → Espera: fila, aprovação, sistema lento\nO → Superprodução: fazer antes ou mais do que o pedido\nO → Processamento excessivo: etapas que o cliente não pede\nD → Defeitos: retrabalho, devolução\nS → Talentos: ideias da equipe não usadas',
    ['A espera costuma ser o maior desperdício em serviços e logística.', 'Superprodução gera vários outros desperdícios (estoque, transporte).', 'Defeito é o desperdício mais caro quando chega ao cliente.'],
    { p: 'Onde está o tempo do pedido online (min):', c: 'Lead time        = 518 min\nTempo de valor   = 23 min\n# o resto é espera entre as etapas', fig: { type: 'vsm', steps: D.vsm } },
    ['Não tente eliminar tudo de uma vez: comece pelo desperdício que mais afeta o cliente.', 'Desperdício é do processo, não da pessoa.', 'Use o gemba: vá ao local ver o trabalho acontecendo.'],
    [['Pedidos parados aguardando a coleta da transportadora são:', 'Espera', 'Transporte', 'Superprodução', 'Talento', 'Tempo parado sem agregar valor.'],
      ['Imprimir etiquetas para o dia seguinte inteiro, antes dos pedidos chegarem, é:', 'Superprodução', 'Defeito', 'Movimentação', 'Espera', 'Fazer antes do necessário.'],
      ['O que significa o S de TIMWOODS?', 'Talentos e ideias da equipe não aproveitados', 'Segurança', 'Sigma', 'Setup', 'Skills: capacidade das pessoas desperdiçada.']]);

  lesson('variacao', 'Variação', 'σ', 'Variação e o sigma',
    'Todo processo varia: nenhum pedido leva exatamente o mesmo tempo. O problema não é a média, é a variação que joga resultados para fora do que o cliente aceita. O desvio padrão (σ) mede essa variação; quanto mais “sigmas” cabem entre a média e o limite do cliente, menos defeitos.',
    'É o tiro ao alvo: acertar em média no centro, mas com tiros espalhados por todo lado, não ganha a competição. O Six Sigma junta os tiros perto do centro.',
    'Média          → onde o processo está centrado\nDesvio padrão  → quanto ele se espalha\nEspecificação  → o que o cliente aceita (LIE e LSE)\nDefeito        → resultado fora da especificação\nSeis sigma     → 3,4 defeitos por milhão de oportunidades',
    ['Duas operações com a mesma média podem ter qualidade muito diferente.', 'Reduzir a variação costuma ser mais eficaz do que mudar a média.', 'Causas comuns geram variação natural; causas especiais, saltos anormais.'],
    { p: 'Tempo de separação dos dois turnos (min):', c: 'Turno A → média ' + f(C.describe(D.turnoA).mean, 1) + ' · desvio ' + f(C.describe(D.turnoA).sd, 2) + '\nTurno B → média ' + f(C.describe(D.turnoB).mean, 1) + ' · desvio ' + f(C.describe(D.turnoB).sd, 2) + '\n# mesma meta, desempenhos diferentes', fig: { type: 'box', groups: [{ n: 'Turno A', v: D.turnoA }, { n: 'Turno B', v: D.turnoB }], unit: 'min' } },
    ['Não julgue o processo pela média de um mês só.', 'Variação de medição também conta: meça bem antes de concluir.', 'Ajustar o processo a cada ponto (mexer demais) aumenta a variação.'],
    [['O que o desvio padrão mede?', 'A dispersão dos dados em torno da média', 'O valor mais frequente', 'O total de defeitos', 'O valor máximo', 'σ mede o espalhamento.'],
      ['Um processo Seis Sigma tem cerca de:', '3,4 defeitos por milhão de oportunidades', '6 defeitos a cada 100', '6% de defeitos', 'Zero defeitos garantidos', 'Considerando o deslocamento de 1,5σ.'],
      ['Duas filiais têm a mesma média de prazo. Qual é melhor para o cliente?', 'A de menor variação', 'A de maior variação', 'Tanto faz', 'A que tem mais pedidos', 'Menos variação, mais previsibilidade.']]);

  lesson('dmaic', 'DMAIC', 'DMAIC', 'DMAIC em uma página',
    'DMAIC é o roteiro dos projetos Six Sigma: Definir o problema e a meta; Medir a situação atual com dados confiáveis; Analisar e comprovar as causas raiz; Melhorar com soluções testadas; Controlar para o ganho não se perder. Cada fase termina com uma revisão (tollgate) antes de seguir.',
    'É como uma consulta médica completa: queixa (Definir), exames (Medir), diagnóstico (Analisar), tratamento (Melhorar) e acompanhamento (Controlar). Pular os exames e ir direto ao remédio é arriscado.',
    'D → Definir: problema, meta, escopo, equipe (carta de projeto)\nM → Medir: indicador, linha de base, sistema de medição\nA → Analisar: causas raiz comprovadas com dados\nI → Melhorar: soluções testadas em piloto\nC → Controlar: padrão, plano de controle, dono do processo',
    ['O problema deve ser medido antes de ser resolvido.', 'Causa “provável” só vira causa raiz depois de comprovada.', 'O projeto só termina quando o processo é devolvido ao dono com controle.'],
    { p: 'O DMAIC aplicado aos pedidos com problema:', c: 'D → reduzir pedidos com problema de 1,2% para 0,4%\nM → linha de base: 3.000 DPMO (4,2σ)\nA → etiqueta trocada e conferência visual\nI → leitor de código + poka-yoke\nC → carta p diária e auditoria', fig: { type: 'chevrons', steps: [{ k: 'D', t: 'Definir' }, { k: 'M', t: 'Medir' }, { k: 'A', t: 'Analisar' }, { k: 'I', t: 'Melhorar' }, { k: 'C', t: 'Controlar' }] } },
    ['DMAIC é para problemas com causa desconhecida; causa óbvia se resolve na hora.', 'Não pule a fase Medir: sem linha de base, não há como provar o ganho.', 'Fase Controlar mal feita é a principal razão de ganhos sumirem.'],
    [['Em qual fase se comprovam as causas raiz?', 'Analisar', 'Definir', 'Melhorar', 'Controlar', 'Analisar = causas comprovadas com dados.'],
      ['A carta de projeto é elaborada em qual fase?', 'Definir', 'Medir', 'Analisar', 'Controlar', 'Ela formaliza problema, meta e escopo.'],
      ['Qual a última fase do DMAIC?', 'Controlar', 'Melhorar', 'Medir', 'Implantar', 'Controlar sustenta o ganho.']]);

  // ---- Etapa 1.2 · Yellow Belt · Definição de Projetos
  lesson('papeis', 'Papéis', 'BELTS', 'Papéis no programa',
    'Um programa Lean Six Sigma tem papéis claros. O Champion (patrocinador) escolhe e apoia os projetos e remove barreiras; o Master Black Belt treina e orienta os Black Belts; o Black Belt lidera projetos complexos e é mentor; o Green Belt conduz projetos na sua área; o Yellow Belt participa e coleta dados; o White Belt conhece os conceitos.',
    'É um time de futebol: o presidente (Champion) dá os recursos, o técnico (Master Black Belt) ensina, o capitão (Black Belt) lidera em campo e os jogadores (Green e Yellow) fazem as jogadas acontecer.',
    'Champion        → patrocina, prioriza, remove barreiras\nMaster BB       → estratégia do programa, forma Black Belts\nBlack Belt      → lidera projetos grandes, mentora Green Belts\nGreen Belt      → conduz projetos na sua área (tempo parcial)\nYellow Belt     → apoia, coleta dados, participa da equipe\nDono do processo → recebe o processo melhorado e mantém',
    ['O Champion é quem tem autoridade sobre o processo e os recursos.', 'O dono do processo precisa estar envolvido desde o Definir.', 'Faixa indica conhecimento e papel, não cargo hierárquico.'],
    { p: 'A estrutura do programa na NexusMarket:', c: '# 1 Champion por diretoria\n# 1 Black Belt para cada 4 a 6 Green Belts\n# Yellow Belts nas equipes de projeto', fig: { type: 'cards', items: [['Champion', 'Diretor de Operações: aprova a carta de projeto e libera recursos.'], ['Black Belt', 'Lidera o projeto de prazo de entrega e orienta 5 Green Belts.'], ['Green Belt', 'Analista do CD: conduz o projeto de pedidos com problema.'], ['Yellow Belt', 'Supervisores de turno: coletam dados e testam soluções.']], speech: 'Cada papel tem uma função: patrocinar, liderar, conduzir ou apoiar.' } },
    ['Projeto sem Champion ativo costuma parar na primeira barreira.', 'Não sobrecarregue o Green Belt com projetos demais.', 'O Black Belt orienta, mas a equipe precisa ser dona das soluções.'],
    [['Quem remove barreiras e libera recursos para o projeto?', 'Champion', 'Yellow Belt', 'White Belt', 'Cliente', 'O patrocinador tem autoridade sobre recursos.'],
      ['Quem conduz projetos na própria área, em tempo parcial?', 'Green Belt', 'Champion', 'Master Black Belt', 'Auditor', 'Green Belt divide o tempo com a rotina.'],
      ['Quem forma Black Belts e define a estratégia do programa?', 'Master Black Belt', 'Yellow Belt', 'Dono do processo', 'Fornecedor', 'É o nível mais alto de especialista.']]);

  lesson('charter', 'Carta de projeto', 'CHARTER', 'Carta de projeto',
    'A carta de projeto (project charter) é o contrato do projeto: descreve o problema com dados, a meta, o escopo, o caso de negócio (por que fazer), a equipe e o cronograma das fases. Ela é aprovada pelo Champion e pode ser revisada quando os dados mostrarem algo novo.',
    'É a planta de uma reforma: diz o que será feito, até onde vai, quanto custa e quando termina. Sem ela, cada um imagina uma obra diferente.',
    'Problema   → o quê, onde, quando e quanto (sem causa nem solução)\nMeta       → indicador, de X para Y, até quando (SMART)\nEscopo     → o que está dentro e fora\nNegócio    → impacto financeiro e no cliente\nEquipe     → Champion, líder, membros\nPrazo      → data de cada tollgate',
    ['A declaração do problema não cita causas nem soluções.', 'Meta SMART: específica, mensurável, atingível, relevante e com prazo.', 'Escopo pequeno e claro termina; escopo vago não.'],
    { p: 'Carta do projeto de pedidos com problema:', c: 'Problema → 1,2% dos pedidos de jan a mar tiveram erro\nMeta     → 0,4% até setembro\nEscopo   → CD de São Paulo, do recebimento à expedição\nNegócio  → R$ 380 mil/ano em reenvios e devoluções', fig: { type: 'table', cols: ['Campo', 'Conteúdo'], rows: [['Problema', '1,2% dos pedidos com erro (jan–mar)'], ['Meta', '0,4% até setembro'], ['Escopo', 'CD São Paulo: recebimento → expedição'], ['Fora do escopo', 'Transporte e SAC'], ['Caso de negócio', 'R$ 380 mil/ano em reenvios'], ['Champion', 'Diretor de Operações']], speech: 'A carta resume problema, meta, escopo e o ganho esperado em uma página.' } },
    ['“O problema é falta de treinamento” já é uma causa suposta; descreva só o efeito.', 'Meta sem prazo não é meta.', 'Revise a carta se a fase Medir mostrar outro cenário.'],
    [['Qual é uma boa declaração de problema?', '1,2% dos pedidos de jan a mar chegaram com item errado', 'Precisamos comprar leitores de código', 'A equipe é desatenta', 'Os pedidos estão ruins', 'Fato, dado e período, sem causa nem solução.'],
      ['O que torna a meta SMART?', 'Ser específica, mensurável, atingível, relevante e com prazo', 'Ser ambiciosa e sem prazo', 'Ser definida pela equipe sem dados', 'Ter muitos indicadores', 'SMART é o acrônimo.'],
      ['Quem aprova a carta de projeto?', 'O Champion', 'O cliente final', 'O fornecedor', 'O Yellow Belt', 'O patrocinador valida o projeto.']]);

  lesson('sipoc', 'SIPOC', 'SIPOC', 'SIPOC e escopo',
    'O SIPOC mostra o processo numa página: Fornecedores, Entradas, Processo (4 a 7 macroetapas), Saídas e Clientes. Na fase Definir ele delimita onde o projeto começa e termina e mostra quem precisa participar.',
    'É a planta baixa de um cômodo: antes de reformar, você precisa saber por onde as coisas entram, o que acontece lá dentro e por onde saem.',
    'S → Fornecedores\nI → Entradas\nP → Processo: 4 a 7 macroetapas, com verbos\nO → Saídas\nC → Clientes\n# defina primeiro o início e o fim do processo',
    ['Comece pelo P: início e fim do processo.', 'Depois saídas e clientes; por último entradas e fornecedores.', 'Use o SIPOC para escolher quem entra na equipe.'],
    { p: 'SIPOC do pedido online no CD:', c: 'Início → pedido aprovado\nFim    → pedido entregue à transportadora', fig: { type: 'sipoc', S: ['Cliente', 'Gateway de pagamento', 'Fornecedor de caixas'], I: ['Pedido', 'Pagamento aprovado', 'Embalagens'], P: ['Receber', 'Separar', 'Conferir', 'Embalar', 'Expedir'], O: ['Pedido expedido', 'Nota fiscal', 'Rastreio'], C: ['Consumidor', 'Transportadora', 'SAC'] } },
    ['SIPOC não é fluxograma detalhado.', 'Processo sem fim definido vira projeto infinito.', 'Valide o SIPOC com quem executa o trabalho.'],
    [['Quantas macroetapas um SIPOC costuma ter?', 'De 4 a 7', 'Exatamente 2', 'Mais de 30', 'Apenas 1', 'É uma visão de alto nível.'],
      ['Por onde se começa a montar o SIPOC?', 'Pelo processo (P), com início e fim', 'Pelos fornecedores', 'Pelas soluções', 'Pelos indicadores', 'O processo delimita o resto.'],
      ['“Pedido expedido” é, no SIPOC:', 'Uma saída', 'Uma entrada', 'Um fornecedor', 'Um cliente', 'É o resultado do processo.']]);

  lesson('ctq', 'CTQ', 'CTQ', 'Da VOC ao CTQ',
    'CTQ (crítico para a qualidade) é a característica mensurável que traduz uma necessidade do cliente. A árvore CTQ desce da necessidade genérica (“entrega rápida”) para o motivador (“chegar no prazo prometido”) e para o requisito medido (“entregar em até 48 h, com 95% de pedidos no prazo”).',
    'É um tradutor: o cliente fala “quero rápido” e você precisa transformar isso numa medida que a equipe consiga acompanhar todo dia.',
    'Necessidade → “quero receber rápido”\nMotivador   → chegar no prazo prometido\nCTQ         → prazo de entrega (h)\nLimite      → até 48 h (LSE)\nMeta        → 95% dos pedidos dentro do limite',
    ['Todo CTQ tem unidade, limite e forma de medir.', 'O modelo de Kano separa básicos, de desempenho e de encantamento.', 'Requisito básico não satisfaz quando atendido, mas irrita muito quando falha.'],
    { p: 'Árvore CTQ da entrega:', c: 'Entrega rápida → prazo de entrega ≤ 48 h\nPedido correto → itens conferidos = 100%\nBem embalado   → avarias ≤ 5 por mil', fig: { type: 'table', cols: ['Necessidade (VOC)', 'Motivador', 'CTQ', 'Limite'], rows: [['Receber rápido', 'Chegar no prazo', 'Prazo de entrega (h)', '≤ 48 h'], ['Pedido certo', 'Itens corretos', '% de pedidos sem erro', '≥ 99,6%'], ['Produto inteiro', 'Embalagem protege', 'Avarias por mil', '≤ 5']], speech: 'Cada necessidade vira uma medida com limite.' } },
    ['“Atendimento bom” não é CTQ; “tempo de espera no SAC até 3 minutos” é.', 'Valide os CTQs com clientes reais.', 'Poucos CTQs bem escolhidos valem mais que muitos.'],
    [['O que é um CTQ?', 'Uma característica mensurável crítica para o cliente', 'Uma causa raiz', 'Um tipo de desperdício', 'Uma ferramenta de sorteio', 'Crítico para a qualidade.'],
      ['Qual é um CTQ bem definido?', 'Prazo de entrega de até 48 h', 'Entrega boa', 'Cliente feliz', 'Logística eficiente', 'Tem medida e limite.'],
      ['No modelo de Kano, um requisito básico:', 'Irrita muito quando falta, mas não encanta quando presente', 'Sempre encanta', 'É indiferente', 'É sempre o mais caro', 'Ex.: produto chegar inteiro.']]);

  lesson('dados', 'Tipos de dados', 'DADOS', 'Tipos de dados e folha de verificação',
    'Dados contínuos são medidos numa escala (tempo, peso, valor) e trazem mais informação. Dados discretos são contados ou classificados (defeituoso ou não, número de erros, motivo). A folha de verificação é o formulário simples para coletar dados discretos no local, já organizados por categoria.',
    'Contínuo é a régua (mede 10,4 cm); discreto é a contagem de pessoas na sala. A régua diz mais sobre cada item, mas nem tudo se mede com régua.',
    'Contínuo → tempo (min), peso (g), valor (R$), temperatura\nDiscreto → aprovado/reprovado, nº de erros, motivo, turno\nAmostra  → contínuo pede menos itens para concluir\nFolha    → categorias × período, marcadas no momento',
    ['Prefira dados contínuos quando possível: precisam de amostras menores.', 'Uma variável discreta pode virar contínua (de “atrasou?” para “quantas horas?”).', 'Defina antes o que conta como defeito.'],
    { p: 'Folha de verificação de erros na expedição (semana):', c: '# marque um traço a cada erro, no momento em que ocorrer\nEtiqueta trocada → 14\nItem faltando    → 9\nEndereço errado  → 4', fig: { type: 'table', cols: ['Erro', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Total'], rows: [['Etiqueta trocada', 3, 2, 4, 2, 3, 14], ['Item faltando', 2, 1, 2, 3, 1, 9], ['Endereço errado', 1, 0, 1, 1, 1, 4]], hl: [0], speech: 'A folha mostra 14 etiquetas trocadas na semana, o erro mais frequente.' } },
    ['Folha de verificação mal definida gera contagens diferentes para o mesmo fato.', 'Registre no momento: memória falha.', 'Não misture turnos ou locais sem identificar a origem.'],
    [['Tempo de separação em minutos é um dado:', 'Contínuo', 'Discreto', 'Qualitativo nominal', 'Binário', 'É medido numa escala.'],
      ['“Pedido com erro: sim ou não” é um dado:', 'Discreto (atributo)', 'Contínuo', 'De tempo', 'Financeiro', 'Classificação em duas categorias.'],
      ['Por que preferir dados contínuos?', 'Trazem mais informação e exigem amostras menores', 'São mais fáceis de inventar', 'Não precisam de medição', 'Sempre são normais', 'Mais informação por item.']]);

  // ---- Etapa 1.3 · Yellow Belt · Ferramentas de Melhoria
  lesson('pareto', 'Pareto', 'PARETO', 'Pareto e estratificação',
    'O Pareto ordena as categorias da maior para a menor e mostra o acumulado: geralmente poucas causas respondem pela maior parte do problema (regra 80/20). A estratificação divide os dados por fatores (turno, CD, produto) para achar onde o problema se concentra.',
    'É arrumar a casa começando pelo cômodo mais bagunçado: o esforço rende muito mais.',
    'Ordenar    → categorias da maior para a menor\nAcumulado  → % somada da esquerda para a direita\nFoco       → poucos vitais que somam ~80%\nEstratificar → dividir por turno, local, produto, dia',
    ['Use o mesmo período e a mesma unidade para todas as barras.', 'Se “Outros” for grande, abra a categoria.', 'Estratifique antes de concluir: a média geral esconde focos.'],
    { p: 'Pareto das reclamações do trimestre:', c: '# 3 motivos somam quase 80%', fig: { type: 'pareto', items: D.reclamacoes, rot: true } },
    ['Frequência alta nem sempre é custo alto: faça um Pareto por custo também.', 'Pareto prioriza; não prova causa.', 'Refaça o Pareto depois da melhoria para ver o novo cenário.'],
    [['Qual a ideia central do Pareto?', 'Poucas categorias respondem pela maior parte do problema', 'Todas as causas pesam igual', 'O problema está sempre no final da lista', 'Só vale para custos', 'Regra 80/20.'],
      ['Para que serve a estratificação?', 'Separar os dados por fatores para achar onde o problema se concentra', 'Calcular a média', 'Desenhar o fluxograma', 'Treinar a equipe', 'Turno, local, produto…'],
      ['O Pareto prova a causa raiz?', 'Não, ele prioriza onde investigar', 'Sim, sempre', 'Só com dados contínuos', 'Só se tiver 80%', 'Causa se comprova na análise.']]);

  lesson('causas', 'Causas', 'POR QUÊ?', 'Ishikawa e 5 porquês',
    'O diagrama de Ishikawa (espinha de peixe) organiza as causas possíveis de um efeito em categorias, como os 6M: Método, Máquina, Mão de obra, Material, Medida e Meio ambiente. Os 5 porquês aprofundam uma causa perguntando “por quê?” até chegar a algo que o processo controla.',
    'É investigação de detetive: primeiro você lista todos os suspeitos (Ishikawa), depois interroga o principal até a história fechar (5 porquês).',
    'Efeito     → o problema medido (cabeça do peixe)\nCategorias → 6M\nCausas     → hipóteses da equipe em cada categoria\n5 porquês  → aprofundar a causa mais provável\nValidar    → comprovar com dados antes de agir',
    ['Ishikawa gera hipóteses; dados comprovam.', 'Pare os porquês quando chegar a uma causa que o processo controla.', 'Evite respostas que culpam pessoas: pergunte o que no processo permitiu o erro.'],
    { p: 'Causas possíveis de etiqueta trocada:', c: '# hipóteses da equipe, a comprovar na fase Analisar', fig: { type: 'ishikawa', effect: 'Etiqueta trocada no pedido', cats: { 'Método': ['Etiquetas impressas em lote', 'Sem conferência por leitor'], 'Máquina': ['Impressora longe da bancada'], 'Mão de obra': ['Rodízio de pessoas'], 'Material': ['Etiquetas sem código do pedido'], 'Medida': ['Erro só aparece no cliente'], 'Meio ambiente': ['Bancada com vários pedidos'] } } },
    ['Não confunda sintoma com causa.', 'Uma causa pode ter mais de um caminho de porquês.', 'Não pare no primeiro porquê.'],
    [['Quais são os 6M do Ishikawa?', 'Método, Máquina, Mão de obra, Material, Medida e Meio ambiente', 'Meta, Missão, Mercado, Moeda, Mídia e Marca', 'Média, Mediana, Moda, Máximo, Mínimo e Margem', 'Só Máquina e Mão de obra', 'As categorias clássicas.'],
      ['Quando parar os 5 porquês?', 'Ao chegar a uma causa que o processo pode controlar', 'Sempre na 5ª pergunta exatamente', 'Quando achar um culpado', 'Na 1ª resposta', '“5” é uma referência, não regra.'],
      ['O Ishikawa comprova a causa raiz?', 'Não, organiza hipóteses para testar', 'Sim', 'Só com 6 categorias', 'Só no Controlar', 'Hipóteses se comprovam com dados.']]);

  lesson('5s', '5S', '5S', '5S e gestão visual',
    'O 5S organiza o local de trabalho em cinco passos: Seiri (utilização: separar o necessário), Seiton (ordenação: um lugar para cada coisa), Seiso (limpeza), Seiketsu (padronização) e Shitsuke (disciplina). A gestão visual faz o padrão e os problemas aparecerem à primeira vista.',
    'É a caixa de ferramentas bem organizada: cada ferramenta tem o seu contorno desenhado, então você vê na hora o que está faltando.',
    'Seiri    → separar o necessário do desnecessário\nSeiton   → um lugar para cada coisa, identificado\nSeiso    → limpar e inspecionar\nSeiketsu → padronizar os 3 primeiros\nShitsuke → disciplina e auditoria',
    ['O 5S reduz movimentação e procura, dois desperdícios comuns.', 'Gestão visual: quadros, cores, marcações no piso, etiquetas.', 'Sem o 4º e o 5º S, o local volta à bagunça em semanas.'],
    { p: 'Auditoria 5S da bancada de embalagem (0 a 5):', c: 'Antes  → média 2,2\nDepois → média 4,4\n# tempo procurando material caiu 70%', fig: { type: 'bars', labels: ['Utilização', 'Ordenação', 'Limpeza', 'Padronização', 'Disciplina'], series: [{ name: 'Antes', values: [2, 3, 3, 2, 1] }, { name: 'Depois', values: [5, 5, 4, 4, 4] }], speech: 'A nota média da auditoria subiu de 2,2 para 4,4.' } },
    ['5S não é mutirão de limpeza: é um sistema mantido.', 'Envolva quem usa o espaço nas decisões.', 'Audite com frequência e mostre os resultados.'],
    [['Qual S trata de “um lugar para cada coisa”?', 'Seiton (ordenação)', 'Seiri', 'Seiso', 'Shitsuke', 'Ordenar e identificar.'],
      ['O que garante que o 5S se mantenha?', 'Padronização e disciplina (4º e 5º S)', 'Uma faxina anual', 'Comprar armários novos', 'Trocar a equipe', 'Sistema, não evento.'],
      ['O 5S reduz principalmente quais desperdícios?', 'Movimentação e procura', 'Superprodução', 'Transporte externo', 'Talento', 'Achar as coisas rápido.']]);

  lesson('kaizen', 'Kaizen', 'KAIZEN', 'Kaizen e padronização',
    'Kaizen é melhoria contínua em pequenos passos, feita por quem faz o trabalho. Um evento kaizen reúne a equipe por alguns dias para resolver um problema focado. O ganho só se mantém com o trabalho padronizado: o melhor jeito conhecido, documentado e treinado, que é a base da próxima melhoria (ciclo SDCA).',
    'É a escada: cada degrau (melhoria) só é seguro quando você firma o pé nele (padrão) antes de subir o próximo.',
    'Problema  → focado e medido\nEvento    → 3 a 5 dias com a equipe do processo\nPadrão    → instrução de trabalho com fotos\nSDCA      → padronizar, executar, checar, agir\nPDCA      → melhorar o padrão de novo',
    ['Problemas simples e de causa clara: kaizen. Complexos: projeto DMAIC.', 'Padrão bom é visual e escrito por quem executa.', 'O padrão é o ponto de partida, não o fim.'],
    { p: 'Kaizen da conferência de pedidos:', c: 'Antes  → 3,0 min por pedido\nDepois → 1,9 min por pedido\n# padrão com leitor e checklist de 4 pontos', fig: { type: 'cycle', center: 'SDCA → PDCA', steps: [{ k: 'S', t: 'Padronizar', d: 'Escrever o melhor jeito atual' }, { k: 'D', t: 'Executar', d: 'Treinar e seguir o padrão' }, { k: 'C', t: 'Checar', d: 'Verificar se o padrão funciona' }, { k: 'A', t: 'Agir', d: 'Corrigir ou girar o PDCA' }] } },
    ['Melhoria sem padrão desaparece.', 'Kaizen sem dados vira opinião.', 'Celebre os ganhos para manter o engajamento.'],
    [['Quem faz o kaizen?', 'Principalmente quem executa o trabalho', 'Só a diretoria', 'Uma consultoria externa', 'O cliente', 'Melhoria vem do gemba.'],
      ['Para que serve o ciclo SDCA?', 'Manter o padrão estável antes de melhorar de novo', 'Escolher fornecedores', 'Calcular o sigma', 'Planejar férias', 'Padronizar, executar, checar, agir.'],
      ['Um problema complexo, com causas desconhecidas, pede:', 'Um projeto DMAIC', 'Um kaizen de 1 hora', 'Nenhuma ação', 'Uma auditoria ISO', 'O método acompanha a complexidade.']]);

  /* ======================= NÍVEL 2 · GREEN BELT ======================= */
  // ---- Etapa 2.1 · Measure
  lesson('coleta', 'Plano de coleta', 'AMOSTRA', 'Plano de coleta e amostragem',
    'O plano de coleta define o que medir, como (definição operacional), quem mede, quando, onde e quantos dados. Amostragem é medir parte da população de forma representativa: aleatória, estratificada (proporcional a turnos ou CDs) ou sistemática (a cada n itens).',
    'É provar a sopa: uma colher bem mexida diz como está a panela toda; uma colher só da superfície engana.',
    'O quê     → indicador e unidade\nComo      → definição operacional (início e fim do tempo)\nQuem      → responsável pela coleta\nQuando    → período e frequência\nQuantos   → n = (z · σ / E)²\nComo amostrar → aleatória, estratificada ou sistemática',
    ['Definição operacional evita que duas pessoas meçam o mesmo fato de jeitos diferentes.', 'Para estimar uma média com 95% de confiança: n = (1,96 · σ / E)².', 'Amostra enviesada não se corrige com mais dados.'],
    { p: 'Quantos pedidos medir para estimar o tempo médio de separação?', c: 'σ estimado = 2 min · erro aceito E = 0,5 min\nn = (1,96 × 2 ÷ 0,5)² = ' + C.nMean(2, 0.5) + ' pedidos', fig: { type: 'table', cols: ['Erro aceito (min)', 'Pedidos necessários'], rows: [[1, C.nMean(2, 1)], [0.5, C.nMean(2, 0.5)], [0.25, C.nMean(2, 0.25)]], hl: [1], speech: 'Calculado agora: para errar no máximo meio minuto, são ' + C.nMean(2, 0.5) + ' pedidos; reduzir o erro pela metade quadruplica a amostra.' } },
    ['Não meça só no turno mais tranquilo.', 'Teste o formulário de coleta antes de começar.', 'Registre também os fatores de estratificação (turno, CD, produto).'],
    [['O que é definição operacional?', 'A descrição exata de como medir, para todos medirem igual', 'A meta do projeto', 'O nome do indicador', 'O orçamento', 'Evita medições diferentes do mesmo fato.'],
      ['Ao reduzir o erro aceito pela metade, a amostra:', 'Fica cerca de 4 vezes maior', 'Fica pela metade', 'Não muda', 'Dobra', 'n depende de 1/E².'],
      ['Amostrar proporcionalmente por turno é amostragem:', 'Estratificada', 'Aleatória simples', 'De conveniência', 'Sistemática', 'Cada estrato representado.']]);

  lesson('descritiva', 'Estatística descritiva', 'x̄ · s', 'Estatística descritiva',
    'A estatística descritiva resume os dados: centro (média e mediana), dispersão (desvio padrão, amplitude, quartis) e forma (simetria). Boxplot e histograma mostram a distribuição; a mediana resiste a valores extremos melhor que a média.',
    'A média de renda de uma sala muda muito se um bilionário entrar; a mediana quase não muda. Escolha o resumo certo para o tipo de dado.',
    'Média      → soma ÷ n\nMediana    → valor do meio (50%)\nDesvio     → s = √(Σ(x − x̄)² ÷ (n − 1))\nQuartis    → Q1 (25%) e Q3 (75%)\nAmplitude  → máximo − mínimo',
    ['Dados assimétricos: prefira mediana e quartis.', 'O boxplot mostra mediana, quartis e pontos atípicos.', 'Sempre olhe o gráfico antes dos números.'],
    { p: 'Tempo de atendimento do SAC (min):', c: 'Média   = ' + f(C.describe(D.sac).mean, 2) + '\nMediana = ' + f(C.describe(D.sac).median, 1) + '\n# média > mediana: cauda longa à direita', fig: { type: 'hist', values: D.sac, bin: 1, from: 2, xlab: 'Tempo de atendimento (min)' } },
    ['Média sozinha esconde a variação.', 'Ponto atípico merece investigação, não exclusão automática.', 'Compare grupos com o mesmo gráfico e a mesma escala.'],
    [['Qual medida resiste melhor a valores extremos?', 'Mediana', 'Média', 'Amplitude', 'Máximo', 'Ela é o valor do meio.'],
      ['Quando a média é bem maior que a mediana, a distribuição tem:', 'Cauda longa à direita', 'Cauda longa à esquerda', 'Forma simétrica', 'Variação zero', 'Poucos valores altos puxam a média.'],
      ['O que o boxplot mostra?', 'Mediana, quartis e pontos atípicos', 'Só a média', 'A tendência no tempo', 'O custo', 'Resumo visual da distribuição.']]);

  lesson('normal', 'Distribuição normal', 'NORMAL', 'Distribuição normal',
    'Muitos processos estáveis seguem a curva normal: simétrica em torno da média, com cerca de 68% dos dados a ±1σ, 95% a ±2σ e 99,7% a ±3σ. Com média e desvio, o valor Z = (limite − média) ÷ σ diz quantos sigmas cabem até o limite e permite estimar a fração fora da especificação.',
    'É a altura das pessoas: a maioria fica perto da média e poucos são muito altos ou muito baixos, de forma equilibrada dos dois lados.',
    'Z        = (x − média) ÷ σ\n±1σ      → 68%\n±2σ      → 95%\n±3σ      → 99,7%\nFora     → área da curva além do limite',
    ['Verifique a normalidade (histograma, teste) antes de usar fórmulas normais.', 'Tempos de atendimento costumam ser assimétricos, não normais.', 'Z maior significa menos itens fora do limite.'],
    { p: 'Peso da embalagem: média 501,5 g, σ 1,2 g, limites 495 a 505:', c: 'Z superior = (505 − 501,5) ÷ 1,2 = ' + f((505 - 501.5) / 1.2, 2) + '\nFora acima ≈ ' + f(C.ppm(501.5, 1.2, null, 505), 0) + ' por milhão', fig: { type: 'normal', mean: 501.5, sd: 1.2, lie: 495, lse: 505, alvo: 500 } },
    ['Não aplique a normal a dados com dois picos (misturas de turnos, por exemplo).', 'Z alto não garante nada se o processo não for estável.', 'Arredonde só no final.'],
    [['Na curva normal, cerca de quantos % dos dados ficam a ±2σ da média?', '95%', '68%', '99,7%', '50%', 'Regra 68-95-99,7.'],
      ['O que o valor Z indica?', 'Quantos desvios padrão separam um valor da média', 'A mediana', 'O número de defeitos', 'A amplitude', 'Z = (x − média) ÷ σ.'],
      ['Média 10, σ 2, limite 16. Qual é o Z?', '3', '2', '6', '8', '(16 − 10) ÷ 2 = 3.']]);

  lesson('msa', 'MSA', 'R&R', 'MSA: R&R e Kappa',
    'Antes de confiar nos dados, avalie o sistema de medição (MSA). Para dados contínuos, o estudo R&R mede repetibilidade (o mesmo avaliador repetindo) e reprodutibilidade (avaliadores diferentes). Para atributos (aprovado/reprovado), o Kappa mede a concordância além do acaso.',
    'É a balança do mercado: se ela mostra pesos diferentes para o mesmo saco, nenhuma análise de vendas por peso faz sentido.',
    '%R&R < 10%   → sistema aceitável\n%R&R 10–30%  → aceitável com ressalvas\n%R&R > 30%   → inaceitável: melhorar a medição\nKappa ≥ 0,9  → excelente · 0,7 a 0,9 → aceitável · < 0,7 → ruim\nCategorias distintas (ndc) ≥ 5',
    ['Repetibilidade: variação do instrumento (mesma pessoa, mesma peça).', 'Reprodutibilidade: variação entre pessoas.', 'Use peças que cubram toda a faixa do processo.'],
    { p: 'Estudo R&R da balança de expedição:', c: '# 10 caixas × 3 conferentes × 2 repetições\n%R&R = 18% → aceitável com ressalvas\nndc   = 6', fig: { type: 'table', cols: ['Fonte', '% da variação'], rows: [['Repetibilidade', '12%'], ['Reprodutibilidade', '13%'], ['R&R total', '18%'], ['Peça a peça', '98%']], hl: [2], note: 'R&R total combina os dois componentes (√(12² + 13²) ≈ 18).', speech: 'O R&R total de 18% fica na faixa aceitável com ressalvas.' } },
    ['Não comece a fase Analisar com medição reprovada.', 'Kappa alto exige padrões claros de aprovado e reprovado.', 'Treinar avaliadores reduz a reprodutibilidade.'],
    [['Um %R&R de 35% indica:', 'Sistema de medição inaceitável', 'Sistema excelente', 'Processo capaz', 'Nada', 'Acima de 30% é inaceitável.'],
      ['Repetibilidade avalia:', 'A variação do mesmo avaliador medindo a mesma peça várias vezes', 'A diferença entre avaliadores', 'A variação entre peças', 'O custo da medição', 'É a variação do instrumento.'],
      ['Para dados de aprovado/reprovado, qual medida usar?', 'Kappa', 'Cpk', 'R²', 'Takt time', 'Concordância de atributos.']]);

  lesson('baseline', 'Linha de base', 'DPMO', 'Linha de base, DPMO e nível sigma',
    'A linha de base é o desempenho atual medido, ponto de partida para a meta. Para dados de defeito, use DPMO (defeitos por milhão de oportunidades) = defeitos ÷ (unidades × oportunidades) × 1.000.000, e converta para nível sigma. O rendimento de primeira (FTY) e o rendimento acumulado (RTY) mostram quanto sai certo de primeira.',
    'É a foto do “antes” no regime: sem ela, você não consegue provar quanto emagreceu.',
    'DPU   = defeitos ÷ unidades\nDPMO  = defeitos ÷ (unidades × oportunidades) × 1.000.000\nSigma → tabela (com deslocamento de 1,5σ)\nRTY   = FTY₁ × FTY₂ × … × FTYₙ',
    ['Oportunidade é cada chance de erro que o cliente percebe.', 'Defina as oportunidades uma vez e não mude durante o projeto.', '3.000 DPMO ≈ 4,2σ; 3,4 DPMO = 6σ.'],
    { p: 'Linha de base do projeto de pedidos:', c: 'Pedidos = 5.000 · oportunidades = 4 · defeitos = 60\nDPMO  = 60 ÷ 20.000 × 1.000.000 = ' + f(dp, 0) + '\nSigma = ' + f(C.sigma(dp), 1), fig: { type: 'table', cols: ['DPMO', 'Nível sigma'], rows: [[308537, '2,0σ'], [66807, '3,0σ'], [6210, '4,0σ'], [f(dp, 0), f(C.sigma(dp), 1) + 'σ'], [233, '5,0σ'], [3.4, '6,0σ']], hl: [3], speech: 'Calculado agora: ' + f(dp, 0) + ' DPMO, cerca de ' + f(C.sigma(dp), 1) + ' sigma.' } },
    ['Mais oportunidades “artificiais” baixam o DPMO sem melhorar nada.', 'RTY revela fábricas ocultas de retrabalho entre etapas.', 'Registre a linha de base com período e fonte.'],
    [['Qual a fórmula do DPMO?', 'Defeitos ÷ (unidades × oportunidades) × 1.000.000', 'Defeitos × unidades', 'Unidades ÷ defeitos', 'Defeitos ÷ 100', 'Defeitos por milhão de oportunidades.'],
      ['Três etapas com FTY de 90% cada têm RTY de:', '72,9%', '90%', '270%', '30%', '0,9 × 0,9 × 0,9.'],
      ['Para que serve a linha de base?', 'Comparar o antes e o depois e provar o ganho', 'Escolher a equipe', 'Definir o Champion', 'Calcular o salário', 'Ponto de partida medido.']]);

  // ---- Etapa 2.2 · Analyze
  lesson('vsm', 'VSM', 'VSM', 'VSM, lead time e takt',
    'O mapa do fluxo de valor (VSM) desenha o caminho do pedido com tempos de ciclo e esperas. Lead time é o tempo total de ponta a ponta; a eficiência do ciclo (PCE) é o tempo de valor ÷ lead time. O takt time = tempo disponível ÷ demanda dá o ritmo que o cliente pede.',
    'É acompanhar uma encomenda pelo rastreio: ela fica muito mais tempo parada nos centros de distribuição do que viajando.',
    'Lead time = Σ tempos de ciclo + Σ esperas\nPCE       = tempo de valor ÷ lead time\nTakt      = tempo disponível ÷ demanda\nGargalo   → etapa com tempo de ciclo acima do takt',
    ['Mapeie o estado atual no gemba, não na sala de reunião.', 'Em serviços, PCE abaixo de 10% é comum.', 'Se uma etapa passa do takt, ela atrasa o fluxo inteiro.'],
    { p: 'VSM do pedido online:', c: 'Lead time = 518 min · tempo de valor = 23 min\nPCE       = ' + f(C.vsm(D.vsm).pce * 100, 1) + '%', fig: { type: 'vsm', steps: D.vsm } },
    ['Não confunda tempo de ciclo com lead time.', 'Ataque primeiro as maiores esperas.', 'Takt é ritmo de demanda, não meta de velocidade máxima.'],
    [['O que é lead time?', 'O tempo total do pedido, de ponta a ponta', 'O tempo de uma etapa', 'O ritmo da demanda', 'O tempo de setup', 'Inclui as esperas.'],
      ['Turno de 420 min e demanda de 840 pedidos. Qual o takt?', '0,5 min por pedido', '2 min', '420 min', '840 min', '420 ÷ 840.'],
      ['PCE de 4% indica que:', 'O pedido passa 96% do tempo sem agregar valor', 'O processo é ótimo', 'A demanda é baixa', 'Não há esperas', 'Eficiência do ciclo.']]);

  lesson('fluxo', 'Fluxo e kanban', 'PULL', 'Fluxo contínuo, puxado e kanban',
    'Fluxo contínuo move o trabalho uma peça (ou um pedido) por vez, sem formar lotes e filas. Sistema puxado só produz quando a etapa seguinte pede, evitando superprodução. O kanban é o sinal visual que autoriza a reposição ou o início de um trabalho, com limite de quantidade em processo (WIP).',
    'É o supermercado: a prateleira só é reposta quando o cliente leva o produto; ninguém enche o corredor por precaução.',
    'Empurrado → produz por previsão, forma estoque\nPuxado    → produz por consumo real\nKanban    → cartão ou sinal que autoriza produzir/repor\nWIP       → limite de trabalho em andamento\nLei de Little: lead time = WIP ÷ vazão',
    ['Lotes grandes aumentam o lead time de todos os pedidos.', 'Limitar o WIP reduz o lead time sem acelerar ninguém.', 'Lei de Little: com 120 pedidos em processo e vazão de 60/h, o lead time é 2 h.'],
    { p: 'Lei de Little no CD:', c: 'WIP = 120 pedidos · vazão = 60 pedidos/h\nLead time = 120 ÷ 60 = 2 h\n# limitar o WIP a 60 → lead time de 1 h', fig: { type: 'bars', labels: ['WIP 120', 'WIP 90', 'WIP 60'], series: [{ name: 'Lead time (h)', values: [2, 1.5, 1] }], speech: 'Com a mesma vazão, reduzir o trabalho em processo reduz o lead time na mesma proporção.' } },
    ['Kanban sem limite de WIP vira só um quadro bonito.', 'Fluxo puxado exige processo estável.', 'Comece pelo trecho com mais estoque intermediário.'],
    [['O que caracteriza o sistema puxado?', 'Produzir apenas quando há consumo real', 'Produzir pela previsão máxima', 'Formar lotes grandes', 'Estocar por precaução', 'Consumo dispara a reposição.'],
      ['WIP 200 pedidos e vazão de 50 por hora. Lead time pela Lei de Little:', '4 h', '250 h', '0,25 h', '10.000 h', '200 ÷ 50.'],
      ['Para que serve o limite de WIP?', 'Reduzir filas e lead time', 'Aumentar o estoque', 'Esconder problemas', 'Medir o sigma', 'Menos trabalho parado.']]);

  lesson('oee', 'OEE e SMED', 'OEE', 'OEE e SMED',
    'O OEE mede a eficácia de um equipamento: Disponibilidade × Performance × Qualidade. O SMED (troca rápida de ferramenta) reduz o tempo de setup separando atividades internas (com a máquina parada) de externas (feitas com ela rodando) e convertendo internas em externas.',
    'É o pit stop da Fórmula 1: tudo o que pode ser preparado antes do carro parar é preparado antes; parado, só o essencial.',
    'Disponibilidade = tempo rodando ÷ tempo planejado\nPerformance     = (ciclo ideal × produzido) ÷ tempo rodando\nQualidade       = boas ÷ produzidas\nOEE             = D × P × Q\nSMED            → separar, converter, simplificar o setup',
    ['OEE de classe mundial é cerca de 85%.', 'Olhe os três fatores: o OEE sozinho não diz onde agir.', 'Setup menor permite lotes menores e mais fluxo.'],
    { p: 'OEE da linha de embalagem no turno:', c: 'Planejado 480 min · paradas 72 min · ciclo ideal 0,5 min\nProduzidas 720 · defeituosas 36', fig: { type: 'oee', planned: D.oee.planned, down: D.oee.down, ideal: D.oee.ideal, produced: D.oee.produced, defects: D.oee.defects } },
    ['Não esconda paradas “pequenas”: elas pesam na performance.', 'Cada equipamento tem seu ciclo ideal; não use média de máquinas diferentes.', 'No SMED, filme o setup e analise passo a passo.'],
    [['Como se calcula o OEE?', 'Disponibilidade × Performance × Qualidade', 'Disponibilidade + Qualidade', 'Produzido ÷ planejado', 'Qualidade − Paradas', 'Produto dos três fatores.'],
      ['No SMED, atividade externa é:', 'A que pode ser feita com o equipamento funcionando', 'A feita por terceiros', 'A feita fora da empresa', 'A que exige parar a máquina', 'Prepara antes da parada.'],
      ['D = 90%, P = 90%, Q = 90%. Qual o OEE?', '72,9%', '90%', '270%', '81%', '0,9³.']]);

  lesson('hipoteses', 'Testes de hipótese', 'p < 0,05', 'Testes de hipótese',
    'Um teste de hipótese verifica se uma diferença observada é real ou pode ser acaso. H0 (hipótese nula) diz “não há diferença”; H1 diz “há diferença”. Se o valor-p for menor que o nível de significância (geralmente 0,05), rejeita-se H0. O teste t compara médias; o teste de proporções compara percentuais.',
    'É um julgamento: o réu é inocente (H0) até que as provas (os dados) tornem muito improvável essa inocência. Valor-p pequeno é prova forte.',
    'H0       → não há diferença\nH1       → há diferença\nValor-p  → chance de ver essa diferença se H0 fosse verdade\np < 0,05 → rejeitar H0 (diferença significativa)\nTeste t  → 1 amostra, 2 amostras ou pareado',
    ['Valor-p alto não prova que os grupos são iguais; só que não há evidência de diferença.', 'Significância estatística não é o mesmo que relevância prática.', 'Use o teste pareado quando as mesmas unidades são medidas antes e depois.'],
    { p: 'Turno A × turno B no tempo de separação (min):', c: 'Média A = ' + f(t2.ma, 2) + ' · média B = ' + f(t2.mb, 2) + '\nt = ' + f(t2.t, 2) + ' · valor-p = ' + (t2.p < 0.001 ? '< 0,001' : f(t2.p, 3)) + '\n# p < 0,05 → a diferença é real', fig: { type: 'box', groups: [{ n: 'Turno A', v: D.turnoA }, { n: 'Turno B', v: D.turnoB }], unit: 'min' } },
    ['Defina o teste e o nível de significância antes de olhar os dados.', 'Verifique as premissas (normalidade aproximada, independência).', 'Amostra muito pequena pode esconder diferenças reais.'],
    [['O valor-p foi 0,02 com α = 0,05. A conclusão é:', 'Rejeitar H0: a diferença é significativa', 'Aceitar H0', 'Os dados estão errados', 'Aumentar α', '0,02 < 0,05.'],
      ['O que diz a hipótese nula?', 'Que não há diferença ou efeito', 'Que há diferença', 'Que o processo é capaz', 'Que a amostra é grande', 'H0 é o “status quo”.'],
      ['Mesmos separadores medidos antes e depois do novo layout pedem o teste:', 't pareado', 't de 2 amostras independentes', 'Qui-quadrado', 'Kappa', 'Mesmas unidades, duas medições.']]);

  lesson('regressao', 'Correlação e regressão', 'R²', 'Correlação e regressão simples',
    'A correlação (r, de −1 a 1) mede a força da relação linear entre duas variáveis. A regressão simples ajusta a reta y = a + b·x, que permite prever y a partir de x. O R² diz quanto da variação de y a reta explica.',
    'É a relação entre distância e tempo de viagem: quanto mais longe, mais demora. A reta transforma esse “mais longe, mais demora” em números.',
    'Correlação r → −1 (negativa) a 1 (positiva)\nReta        → y = a + b·x\nb           → quanto y muda a cada 1 de x\nR²          → % da variação de y explicada por x\nValor-p     → a inclinação é diferente de zero?',
    ['Correlação não é causalidade.', 'Não extrapole a reta muito além dos dados observados.', 'Olhe sempre o gráfico de dispersão.'],
    { p: 'Distância (km) × prazo de entrega (h):', c: 'Prazo = ' + f(rg.a, 2) + ' + ' + f(rg.b, 3) + ' × distância\nR² = ' + f(rg.r2, 3) + '\n# cada 10 km a mais ≈ ' + f(rg.b * 10, 1) + ' h', fig: { type: 'scatter', pairs: D.distancia, xlab: 'Distância (km)', ylab: 'Prazo (h)', eq: true } },
    ['Duas variáveis podem andar juntas por causa de uma terceira.', 'Ponto atípico pode distorcer a reta.', 'R² alto não garante que a relação seja útil para decisão.'],
    [['Uma correlação de −0,9 indica:', 'Relação forte e negativa', 'Nenhuma relação', 'Relação fraca e positiva', 'Erro de cálculo', 'Perto de −1 é forte e negativa.'],
      ['Na reta y = 4 + 0,2x, quanto y aumenta quando x aumenta 10?', '2', '0,2', '4', '10', '0,2 × 10.'],
      ['R² = 0,81 significa que:', 'A reta explica 81% da variação de y', 'Há 81% de defeitos', 'A correlação é 0,81', 'x causa y', 'R² é a variação explicada.']]);

  // ---- Etapa 2.3 · Improve e Control
  lesson('solucoes', 'Seleção de soluções', 'SOLUÇÕES', 'Geração e seleção de soluções',
    'Com as causas comprovadas, a equipe gera soluções (brainstorming, benchmarking) e escolhe as melhores com critérios: matriz esforço × impacto, matriz de priorização com pesos ou matriz de Pugh (comparação com uma referência). A solução escolhida é testada em piloto antes de ser expandida.',
    'É comprar um carro: você lista opções, dá nota pelos critérios que importam (preço, consumo, espaço) e faz um test drive antes de fechar.',
    'Gerar     → muitas ideias por causa raiz\nFiltrar   → esforço × impacto\nPriorizar → matriz com critérios e pesos\nTestar    → piloto pequeno, com medição\nExpandir  → só depois de comprovar o ganho',
    ['Cada solução deve atacar uma causa comprovada.', 'Ganhos rápidos (baixo esforço, alto impacto) primeiro.', 'Piloto mostra efeitos colaterais antes de expandir.'],
    { p: 'Matriz de priorização das soluções (notas 1 a 5 × pesos):', c: 'Critérios: impacto (peso 5), custo (3), prazo (2)\nPontuação = Σ nota × peso', fig: { type: 'table', cols: ['Solução', 'Impacto (5)', 'Custo (3)', 'Prazo (2)', 'Total'], rows: [['Leitor de código na conferência', 5, 3, 4, 42], ['Etiqueta impressa por pedido', 4, 5, 5, 45], ['Treinamento geral', 2, 4, 4, 30], ['Sistema novo de WMS', 5, 1, 1, 30]], hl: [1], speech: 'A etiqueta impressa por pedido teve a maior pontuação, 45.' } },
    ['Não escolha a solução favorita do chefe sem critérios.', 'Envolva quem executa na escolha.', 'Defina antes como o piloto será avaliado.'],
    [['Qual é o “ganho rápido” na matriz esforço × impacto?', 'Baixo esforço e alto impacto', 'Alto esforço e baixo impacto', 'Alto esforço e alto impacto', 'Baixo esforço e baixo impacto', 'Faça primeiro.'],
      ['Por que fazer um piloto?', 'Comprovar o ganho e ver efeitos colaterais antes de expandir', 'Gastar o orçamento', 'Evitar medir', 'Substituir a fase Medir', 'Teste em pequena escala.'],
      ['Uma solução deve estar ligada a:', 'Uma causa raiz comprovada', 'Uma opinião', 'Um fornecedor', 'Um prêmio', 'Senão, não resolve o problema.']]);

  lesson('fmea', 'FMEA', 'NPR', 'Poka-yoke e FMEA',
    'O FMEA lista modos de falha do processo e pontua Severidade, Ocorrência e Detecção (1 a 10); o NPR = S × O × D prioriza as ações. O poka-yoke é o dispositivo à prova de erros: impede o erro (controle) ou o torna óbvio na hora (aviso).',
    'É o carregador de celular que só encaixa de um jeito: o erro simplesmente não é possível.',
    'S   → gravidade do efeito para o cliente\nO   → frequência da causa\nD   → chance de NÃO detectar (10 = não detecta)\nNPR = S × O × D\nPoka-yoke → impedir (controle) ou alertar (aviso)',
    ['Severidade alta (9 ou 10) merece ação mesmo com NPR baixo.', 'Poka-yoke de controle é mais forte que o de aviso.', 'Recalcule o NPR depois das ações.'],
    { p: 'FMEA da expedição:', c: 'NPR = S × O × D\n# a maior prioridade aparece no topo', fig: { type: 'matrix', mode: 'fmea', rows: [['Etiqueta trocada no pedido', 7, 5, 4], ['Produto frágil sem proteção', 8, 4, 6], ['Atraso na coleta', 6, 6, 3], ['Endereço digitado errado', 7, 3, 7], ['Leitor de código falha', 5, 3, 2]] } },
    ['Notas sem critério escrito viram opinião.', 'Inspeção visual raramente reduz bem a detecção.', 'FMEA é documento vivo: revise após mudanças.'],
    [['Como se calcula o NPR?', 'Severidade × Ocorrência × Detecção', 'S + O + D', 'S × O', 'O ÷ D', 'Número de prioridade de risco.'],
      ['No FMEA, detecção 10 significa:', 'Quase impossível detectar a falha antes do cliente', 'Detecção certa', 'Falha muito frequente', 'Efeito leve', 'Escala invertida.'],
      ['Um conector que só encaixa de um jeito é poka-yoke de:', 'Controle (impede o erro)', 'Aviso', 'Inspeção final', 'Treinamento', 'O erro não acontece.']]);

  lesson('cep', 'Cartas de controle', 'LSC', 'Cartas de controle (I-MR, X̄-R, p, u)',
    'A carta de controle separa causas comuns (variação natural) de causas especiais (sinais anormais). Para dados contínuos: I-MR (valores individuais) ou X̄-R (médias de subgrupos). Para atributos: p (proporção de defeituosos) e u (defeitos por unidade). Limites vêm do próprio processo, não da especificação.',
    'É o termômetro do processo: variações pequenas são normais; um pico fora da faixa avisa que algo diferente aconteceu.',
    'I-MR  → valores individuais (1 por vez)\nX̄-R   → subgrupos de 2 a 6 itens\np     → proporção de defeituosos: p̄ ± 3·√(p̄(1 − p̄) ÷ n)\nu     → defeitos por unidade\nSinais → ponto fora, 8 do mesmo lado, 6 subindo/descendo',
    ['Limite de controle (voz do processo) ≠ limite de especificação (voz do cliente).', 'Investigue cada sinal de causa especial e registre o motivo.', 'Recalcule os limites depois de uma melhoria comprovada.'],
    { p: 'Carta p dos pedidos com erro (400 pedidos por dia):', c: 'p̄  = ' + f(C.pchart(D.erros, 400).lc * 100, 2) + '%\nLSC = ' + f(C.pchart(D.erros, 400).lsc * 100, 2) + '%\n# o dia 13 teve troca de sistema', fig: { type: 'pchart', defs: D.erros, n: 400 } },
    ['Não ajuste o processo a cada ponto dentro dos limites.', 'Escolha a carta pelo tipo de dado.', 'Carta sem reação aos sinais não controla nada.'],
    [['Qual carta usar para a proporção de pedidos com erro?', 'Carta p', 'Carta X̄-R', 'Carta I-MR', 'Histograma', 'Atributo: defeituoso ou não.'],
      ['Os limites de controle vêm de onde?', 'Dos dados do próprio processo', 'Da especificação do cliente', 'Da meta da diretoria', 'De uma tabela fixa', 'Voz do processo.'],
      ['Oito pontos seguidos acima da média indicam:', 'Causa especial (mudança no processo)', 'Variação comum', 'Erro de medição certo', 'Nada', 'Regra das sequências.']]);

  lesson('cpk', 'Capabilidade', 'Cpk', 'Capabilidade Cp e Cpk',
    'Capabilidade compara a variação do processo com a especificação. Cp = (LSE − LIE) ÷ 6σ mede o potencial; Cpk = menor de (LSE − média) ÷ 3σ e (média − LIE) ÷ 3σ considera também a centralização. Cpk ≥ 1,33 costuma ser o mínimo aceitável; 2,0 corresponde a seis sigma.',
    'É estacionar na garagem: Cp diz se o carro cabe na vaga; Cpk diz se você estacionou no meio ou raspando numa parede.',
    'Cp  = (LSE − LIE) ÷ 6σ\nCpu = (LSE − média) ÷ 3σ\nCpl = (média − LIE) ÷ 3σ\nCpk = menor entre Cpu e Cpl\nCpk ≥ 1,33 → capaz · < 1 → não capaz',
    ['Só calcule capabilidade com o processo estável (carta de controle).', 'Cp alto e Cpk baixo: o processo está descentralizado.', 'Use o desvio do processo, não o da especificação.'],
    { p: 'Peso da embalagem (especificação 495 a 505 g):', c: 'Média 501,5 · σ 1,2\nCp  = 10 ÷ 7,2 = ' + f(C.cap(501.5, 1.2, 495, 505).cp, 2) + '\nCpk = (505 − 501,5) ÷ 3,6 = ' + f(C.cap(501.5, 1.2, 495, 505).cpk, 2), fig: { type: 'normal', mean: 501.5, sd: 1.2, lie: 495, lse: 505, alvo: 500 } },
    ['Capabilidade com dados não normais exige outra abordagem.', 'Amostra pequena gera Cpk enganoso.', 'Centralizar é mais barato que reduzir a variação.'],
    [['Cp = 1,8 e Cpk = 0,9 indicam:', 'Processo com variação boa, mas descentralizado', 'Processo perfeito', 'Processo instável', 'Erro de cálculo', 'Centralize na média.'],
      ['Qual o Cpk mínimo usual para um processo capaz?', '1,33', '0,5', '0,1', '3,0', 'Referência comum de mercado.'],
      ['LIE 10, LSE 20, média 16, σ 1. Qual o Cpk?', '1,33', '1,67', '2,0', '0,67', 'min((20−16)/3, (16−10)/3) = 4/3.']]);

  /* ======================= NÍVEL 3 · BLACK BELT ======================= */
  // ---- Etapa 3.1 · Estatística Avançada
  lesson('anova', 'ANOVA', 'ANOVA', 'ANOVA: comparando várias médias',
    'A ANOVA (análise de variância) testa se três ou mais grupos têm a mesma média, comparando a variação entre os grupos com a variação dentro deles: F = QM entre ÷ QM dentro. Se o valor-p for menor que 0,05, ao menos uma média é diferente; testes post-hoc (Tukey) dizem quais.',
    'É comparar três padarias pelo tempo de fila: se a diferença entre elas é muito maior que a variação normal de um dia para o outro numa mesma padaria, elas são realmente diferentes.',
    'SQ entre  = Σ nᵢ (x̄ᵢ − x̄)²\nSQ dentro = Σ Σ (x − x̄ᵢ)²\nQM        = SQ ÷ graus de liberdade\nF         = QM entre ÷ QM dentro\np < 0,05  → pelo menos uma média difere',
    ['ANOVA evita fazer vários testes t, que inflam o erro.', 'Premissas: normalidade aproximada e variâncias parecidas.', 'Use o boxplot para ver quais grupos se destacam.'],
    { p: 'Prazo de entrega (h) em três CDs:', c: 'F = ' + f(an.F, 1) + ' · valor-p < 0,001\nMédias: SP ' + f(an.means[0], 1) + ' · BH ' + f(an.means[1], 1) + ' · CWB ' + f(an.means[2], 1), fig: { type: 'table', title: 'Saída da ANOVA', cols: ['Fonte', 'GL', 'SQ', 'QM', 'F', 'Valor-p'], rows: [['Entre CDs', an.dfb, r(an.ssb, 1), r(an.msb, 2), r(an.F, 2), '< 0,001'], ['Dentro', an.dfw, r(an.ssw, 1), r(an.msw, 2), '', ''], ['Total', an.dfb + an.dfw, r(an.sst, 1), '', '', '']], hl: [0], speech: 'Calculado agora: F igual a ' + f(an.F, 1) + ', valor-p menor que 0,001. Pelo menos um CD tem prazo médio diferente.' } },
    ['ANOVA diz “há diferença”, não “qual é diferente”.', 'Grupos de tamanhos muito diferentes exigem cuidado.', 'Diferença significativa pode ser pequena demais para importar.'],
    [['Para comparar a média de 4 fornecedores, o teste indicado é:', 'ANOVA', 'Teste t simples', 'Qui-quadrado', 'Kappa', 'Três ou mais médias.'],
      ['Como se calcula o F da ANOVA?', 'QM entre ÷ QM dentro', 'SQ total ÷ n', 'Média ÷ desvio', 'Entre − dentro', 'Razão de variâncias.'],
      ['ANOVA com p = 0,30 indica:', 'Não há evidência de diferença entre as médias', 'Todas as médias diferem', 'Uma média é o dobro', 'O teste está errado', 'p > 0,05.']]);

  lesson('quiquadrado', 'Qui-quadrado', 'χ²', 'Qui-quadrado e testes não paramétricos',
    'O teste qui-quadrado verifica se duas variáveis categóricas são independentes, comparando contagens observadas com as esperadas: χ² = Σ (O − E)² ÷ E. Testes não paramétricos (Mann-Whitney, Kruskal-Wallis) comparam medianas quando os dados não são normais.',
    'É verificar se o atraso “escolhe” transportadora: se fosse acaso, cada uma teria a mesma fatia de atrasos que de entregas.',
    'Esperado E   = total da linha × total da coluna ÷ total geral\nχ²           = Σ (O − E)² ÷ E\nGL           = (linhas − 1) × (colunas − 1)\nMann-Whitney → 2 grupos, sem normalidade\nKruskal-Wallis → 3+ grupos, sem normalidade',
    ['Cada célula deve ter contagem esperada de pelo menos 5.', 'Qui-quadrado usa contagens, não percentuais.', 'Não paramétrico é mais robusto, mas um pouco menos sensível.'],
    { p: 'Entregas no prazo × atrasadas por transportadora:', c: 'χ² = ' + f(ch.chi2, 1) + ' · GL = ' + ch.df + ' · valor-p < 0,001\n# atraso depende da transportadora', fig: { type: 'table', cols: ['Transportadora', 'No prazo', 'Atrasadas', '% atraso'], rows: D.transp.nomes.map(function (n, i) { const tt = D.transp.tab[i]; return [n, tt[0], tt[1], f(tt[1] / (tt[0] + tt[1]) * 100, 0) + '%']; }), hl: [2], speech: 'Calculado agora: qui-quadrado de ' + f(ch.chi2, 1) + ', valor-p menor que 0,001. O atraso depende da transportadora.' } },
    ['Não aplique qui-quadrado a percentuais.', 'Dados assimétricos: prefira medianas e testes não paramétricos.', 'Associação não prova causa.'],
    [['Para testar se o tipo de defeito depende do turno, use:', 'Qui-quadrado', 'Teste t pareado', 'Regressão linear', 'Cpk', 'Duas variáveis categóricas.'],
      ['Tabela 3 × 2: quantos graus de liberdade?', '2', '6', '5', '1', '(3 − 1) × (2 − 1).'],
      ['Comparar o tempo de 3 equipes com dados bem assimétricos pede:', 'Kruskal-Wallis', 'ANOVA sem verificar nada', 'Kappa', 'Carta p', 'Não paramétrico para 3+ grupos.']]);

  lesson('mreg', 'Regressão múltipla', 'β', 'Regressão múltipla',
    'A regressão múltipla explica y com várias variáveis ao mesmo tempo: y = b₀ + b₁·x₁ + b₂·x₂ + … Cada coeficiente mostra o efeito de uma variável mantendo as outras fixas. O R² ajustado penaliza variáveis que não ajudam, e a multicolinearidade (x muito correlacionados entre si) distorce os coeficientes.',
    'É explicar o valor de um imóvel: área, bairro e vagas juntos explicam muito mais do que só a área, e cada um tem seu peso.',
    'Modelo      → y = b₀ + b₁·x₁ + b₂·x₂\nbᵢ          → efeito de xᵢ com as demais fixas\nR² ajustado → compara modelos com nº de variáveis diferente\nValor-p     → cada coeficiente importa?\nVIF > 5     → sinal de multicolinearidade',
    ['Mais variáveis sempre aumentam o R², mas não o R² ajustado.', 'Analise os resíduos: devem ser aleatórios.', 'Prefira o modelo mais simples que explica bem.'],
    { p: 'Tempo de separação explicado por itens e corredores:', c: 'Tempo = ' + f(mr.b[0], 2) + ' + ' + f(mr.b[1], 2) + '·itens + ' + f(mr.b[2], 2) + '·corredores\nR² ajustado = ' + f(mr.r2adj, 3), fig: { type: 'table', title: 'Coeficientes', cols: ['Termo', 'Coeficiente', 'Leitura'], rows: [['Constante', r(mr.b[0], 2), 'tempo base (min)'], ['Itens', r(mr.b[1], 2), 'min por item a mais'], ['Corredores', r(mr.b[2], 2), 'min por corredor a mais']], speech: 'Calculado agora: cada item a mais soma ' + f(mr.b[1], 2) + ' minuto, e cada corredor a mais, ' + f(mr.b[2], 2) + '.' } },
    ['Coeficiente não é causa sem um bom raciocínio de processo.', 'Variáveis muito correlacionadas devem ser combinadas ou retiradas.', 'Não use o modelo fora da faixa dos dados.'],
    [['O que o R² ajustado faz?', 'Penaliza variáveis que não melhoram o modelo', 'Sempre aumenta com mais variáveis', 'Mede a normalidade', 'Calcula o NPR', 'Compara modelos de tamanhos diferentes.'],
      ['O que é multicolinearidade?', 'Variáveis explicativas muito correlacionadas entre si', 'Muitos dados', 'Resíduos aleatórios', 'R² igual a 1', 'Distorce os coeficientes.'],
      ['No modelo y = 2 + 1,1·x₁ + 0,8·x₂, o que significa 1,1?', 'y aumenta 1,1 a cada 1 de x₁, com x₂ fixo', 'y é 1,1 vezes x₂', 'R² de 1,1', 'Erro de 1,1', 'Efeito parcial de x₁.']]);

  lesson('poder', 'Poder do teste', 'β · n', 'Poder do teste e tamanho de amostra',
    'Todo teste tem dois riscos: erro tipo I (α, achar diferença que não existe) e erro tipo II (β, não achar uma diferença real). O poder = 1 − β é a chance de detectar a diferença que importa. Ele aumenta com amostras maiores, menor variação e diferenças maiores.',
    'É a lanterna: para achar uma moeda pequena (diferença pequena) num quarto escuro (muita variação), você precisa de uma lanterna forte (amostra grande).',
    'α (tipo I)   → falso alarme (geralmente 5%)\nβ (tipo II)  → deixar passar (geralmente 10% a 20%)\nPoder        → 1 − β (meta: 80% a 90%)\nn média      ≈ (z · σ ÷ E)²\nn proporção  ≈ z² · p(1 − p) ÷ E²',
    ['Planeje n antes de coletar, com base na menor diferença que importa.', 'Teste com amostra pequena pode dar “sem diferença” por falta de poder.', 'Reduzir a variação aumenta o poder sem coletar mais.'],
    { p: 'Amostra para estimar o % de pedidos com erro:', c: 'p esperado = 50% (pior caso) · margem ±5 pontos\nn = 1,96² × 0,5 × 0,5 ÷ 0,05² = ' + C.nProp(0.5, 0.05), fig: { type: 'table', cols: ['Margem de erro', 'Amostra (p = 50%)', 'Amostra (p = 10%)'], rows: [['±5 pontos', C.nProp(0.5, 0.05), C.nProp(0.1, 0.05)], ['±3 pontos', C.nProp(0.5, 0.03), C.nProp(0.1, 0.03)], ['±2 pontos', C.nProp(0.5, 0.02), C.nProp(0.1, 0.02)]], speech: 'Calculado agora: com margem de 5 pontos e o pior caso, são ' + C.nProp(0.5, 0.05) + ' pedidos.' } },
    ['“Sem diferença significativa” com pouco poder não é prova de igualdade.', 'Não aumente α para “achar” resultado.', 'Use p = 50% quando não souber a proporção: é o caso mais exigente.'],
    [['O que é erro tipo II?', 'Não detectar uma diferença que existe', 'Detectar uma diferença que não existe', 'Errar a conta', 'Medir errado', 'β: deixar passar.'],
      ['Como aumentar o poder de um teste?', 'Aumentar a amostra ou reduzir a variação', 'Diminuir a amostra', 'Ignorar outliers', 'Usar α = 0', 'Mais informação, mais poder.'],
      ['Poder de 80% significa:', '80% de chance de detectar a diferença que importa, se ela existir', '80% de defeitos', 'α de 80%', 'R² de 80%', 'Poder = 1 − β.']]);

  lesson('naonormal', 'Capabilidade não normal', 'Ppk', 'Capabilidade com dados não normais',
    'Tempos de atendimento, de entrega e de espera costumam ser assimétricos. Aplicar a fórmula normal subestima ou superestima a fração fora do limite. As saídas: usar percentis (Cpk por percentil), transformar os dados (Box-Cox, logaritmo) ou ajustar outra distribuição (lognormal, Weibull).',
    'Usar a curva normal num dado assimétrico é como medir uma rua torta com uma régua reta: os números saem, mas não representam a realidade.',
    'Verificar   → histograma e teste de normalidade (p < 0,05 → não normal)\nPercentil   → Cpk = (LSE − mediana) ÷ (P99,865 − mediana)\nTransformar → Box-Cox ou log, calcular e voltar\nAjustar     → lognormal, Weibull, exponencial',
    ['Primeiro confirme que o processo é estável.', 'Assimetria pode vir da mistura de grupos: estratifique antes.', 'Comunique a capabilidade em % fora do limite, que todos entendem.'],
    { p: 'Tempo de atendimento do SAC, limite de 10 min:', c: 'Média ' + f(C.describe(D.sac).mean, 1) + ' · mediana ' + f(C.describe(D.sac).median, 1) + ' · cauda à direita\n# fórmula normal: estimativa enganosa\n# percentil observado: 1 de 25 acima de 10 min', fig: { type: 'hist', values: D.sac, bin: 1, from: 2, lse: 10, xlab: 'Tempo de atendimento (min)' } },
    ['Não “normalize” os dados retirando os valores altos.', 'A transformação muda a escala: volte à unidade original para comunicar.', 'Amostras pequenas não definem bem a cauda.'],
    [['Por que não usar a fórmula normal em dados muito assimétricos?', 'Ela estima mal a fração fora da especificação', 'Ela é proibida por lei', 'Ela sempre dá zero', 'Ela exige dados discretos', 'A cauda real é diferente.'],
      ['Qual transformação é comum para dados assimétricos?', 'Box-Cox (ou logaritmo)', 'Multiplicar por 100', 'Somar a média', 'Arredondar', 'Aproxima da normal.'],
      ['Antes de calcular a capabilidade, é preciso:', 'Confirmar que o processo é estável', 'Excluir os valores altos', 'Trocar a especificação', 'Usar só a média', 'Estabilidade primeiro.']]);

  // ---- Etapa 3.2 · Experimentos e DFSS
  lesson('doe', 'DOE fatorial', 'DOE', 'DOE: experimento fatorial completo',
    'O DOE (planejamento de experimentos) testa vários fatores ao mesmo tempo em níveis definidos (baixo −, alto +). No fatorial completo 2ᵏ, todas as combinações são testadas. O efeito principal de um fator = média da resposta no nível alto − média no nível baixo.',
    'É acertar a receita de bolo testando temperatura e tempo juntos, num plano organizado, em vez de mudar uma coisa por vez no chute.',
    'Fatores   → variáveis controláveis (temperatura, pressão, tempo)\nNíveis    → baixo (−) e alto (+)\nCorridas  → 2ᵏ combinações (2³ = 8)\nEfeito    = média(+) − média(−)\nAleatorizar e replicar → proteger contra ruído',
    ['Mudar um fator por vez esconde interações e gasta mais corridas.', 'Aleatorize a ordem das corridas.', 'Réplicas permitem estimar o erro experimental.'],
    { p: 'DOE 2³ da seladora (resistência do selo, N):', c: 'Efeitos: temperatura ' + f(ef.main[0], 1) + ' · pressão ' + f(ef.main[1], 1) + ' · tempo ' + f(ef.main[2], 1) + '\n# temperatura é o fator dominante', fig: { type: 'effects', factors: D.doe.fatores, runs: D.doe.runs } },
    ['Escolha níveis bem afastados, mas seguros.', 'Meça a resposta sempre do mesmo jeito.', 'Confirme o melhor ajuste com corridas de validação.'],
    [['Quantas corridas tem um fatorial completo com 4 fatores em 2 níveis?', '16', '8', '4', '32', '2⁴ = 16.'],
      ['Como se calcula o efeito principal de um fator?', 'Média no nível alto − média no nível baixo', 'Soma de todas as corridas', 'Maior valor − menor valor', 'Média geral', 'Diferença entre níveis.'],
      ['Por que aleatorizar a ordem das corridas?', 'Para que fatores não controlados não se confundam com os testados', 'Para acabar mais rápido', 'Para aumentar o efeito', 'Não é necessário', 'Protege contra ruído sistemático.']]);

  lesson('fracionado', 'Fatorial fracionado', 'AB', 'Fatorial fracionado e interações',
    'Interação acontece quando o efeito de um fator depende do nível de outro: no gráfico de interação, as linhas não são paralelas. Com muitos fatores, o fatorial fracionado (2ᵏ⁻ᵖ) testa só uma fração das combinações, aceitando confundir interações de ordem alta; é ideal para triagem.',
    'Sal e açúcar no tempero: cada um muda o sabor, mas a combinação dos dois muda de um jeito que nenhum sozinho explica.',
    'Interação AB = média(AB = +) − média(AB = −)\nLinhas paralelas   → sem interação\nLinhas não paralelas → interação\n2⁵⁻¹ = 16 corridas em vez de 32\nResolução V → efeitos principais e 2-fatores limpos',
    ['Interações fortes mudam a melhor configuração.', 'Em triagem, primeiro descubra quais fatores importam.', 'Quanto maior a resolução, menos confusão entre efeitos.'],
    { p: 'Interação temperatura × pressão na seladora:', c: 'Efeito AB = ' + f(ef.ab, 1) + '\n# pressão alta ajuda mais quando a temperatura é alta', fig: { type: 'effects', mode: 'inter', factors: ['Temperatura', 'Pressão'], runs: D.doe.runs.map(function (x) { return [x[0], x[1], x[3]]; }) } },
    ['Não interprete efeitos principais isolados quando há interação forte.', 'Fração muito pequena pode confundir o que importa.', 'Siga a triagem com um experimento mais completo.'],
    [['No gráfico de interação, linhas paralelas indicam:', 'Ausência de interação', 'Interação forte', 'Erro de medição', 'Efeito zero dos fatores', 'O efeito de A não depende de B.'],
      ['Para que serve o fatorial fracionado?', 'Triar muitos fatores com menos corridas', 'Substituir o piloto', 'Calcular o Cpk', 'Eliminar a aleatorização', 'Economia na triagem.'],
      ['Um 2⁶⁻² tem quantas corridas?', '16', '64', '12', '32', '2⁴ = 16.']]);

  lesson('dfss', 'DFSS e DMADV', 'DMADV', 'DFSS e DMADV',
    'Quando o processo não existe ou precisa ser redesenhado do zero, usa-se o DFSS (Design for Six Sigma). O roteiro mais comum é o DMADV: Definir, Medir (as necessidades e CTQs), Analisar (alternativas de conceito), Desenhar (detalhar e otimizar) e Verificar (piloto e implantação).',
    'DMAIC é reformar uma casa existente; DMADV é projetar uma casa nova já pensando em todos os moradores.',
    'D → Definir: objetivo e escopo do novo processo/produto\nM → Medir: VOC e CTQs com metas\nA → Analisar: conceitos alternativos\nD → Desenhar: detalhar, simular, otimizar\nV → Verificar: piloto e entrega ao dono',
    ['Use DMADV quando melhorar o atual não alcança a meta.', 'Projetar certo custa menos do que corrigir depois.', 'Ferramentas típicas: QFD, FMEA de projeto, simulação.'],
    { p: 'DMAIC ou DMADV?', c: '# processo existe e o problema é desempenho → DMAIC\n# processo novo ou redesenho total → DMADV', fig: { type: 'chevrons', steps: [{ k: 'D', t: 'Definir' }, { k: 'M', t: 'Medir CTQs' }, { k: 'A', t: 'Analisar conceitos' }, { k: 'D', t: 'Desenhar' }, { k: 'V', t: 'Verificar' }] } },
    ['Não use DMADV para problemas de um processo que já funciona razoavelmente.', 'Envolva o cliente desde a definição dos CTQs.', 'Verifique em piloto antes da escala total.'],
    [['Quando usar DMADV?', 'Para criar ou redesenhar totalmente um processo ou produto', 'Para todo problema simples', 'Só na fase Controlar', 'Para calcular o sigma', 'Design for Six Sigma.'],
      ['O que significa o V do DMADV?', 'Verificar', 'Validar a meta financeira apenas', 'Variar', 'Vender', 'Piloto e implantação.'],
      ['Qual a diferença central entre DMAIC e DMADV?', 'DMAIC melhora o que existe; DMADV projeta algo novo', 'Não há diferença', 'DMADV não usa dados', 'DMAIC é só para fábricas', 'Melhorar × projetar.']]);

  lesson('qfd', 'QFD', 'QFD', 'QFD: a casa da qualidade',
    'O QFD (desdobramento da função qualidade) liga os requisitos do cliente (os “o quês”, com pesos) às características técnicas (os “comos”) numa matriz de relações (forte 9, média 3, fraca 1). A importância de cada característica = Σ peso do requisito × força da relação.',
    'É traduzir uma lista de desejos de viagem (barato, rápido, confortável) em decisões concretas (voo, horário, assento) e ver qual decisão atende mais desejos.',
    'Linhas   → requisitos do cliente com pesos (1 a 5)\nColunas  → características técnicas mensuráveis\nRelação  → 9 forte · 3 média · 1 fraca\nImportância = Σ peso × relação\nTelhado  → conflitos entre características',
    ['Comece pela VOC real, não pelo que a engenharia acha.', 'Poucos requisitos e características bem escolhidos.', 'Use a importância para priorizar o projeto.'],
    { p: 'Casa da qualidade do novo serviço de entrega expressa:', c: 'Importância = Σ peso × relação\nJanela de entrega → 5×9 + 3×3 + 4×1 = 58', fig: { type: 'table', cols: ['Requisito (peso)', 'Janela de entrega', 'Rastreio em tempo real', 'Embalagem reforçada'], rows: [['Chegar rápido (5)', 9, 3, 0], ['Saber onde está (3)', 3, 9, 0], ['Chegar inteiro (4)', 1, 0, 9], ['Importância', 58, 42, 36]], tot: true, speech: 'Calculado: a janela de entrega tem a maior importância, 58.' } },
    ['Matriz grande demais vira burocracia.', 'Relações devem ser discutidas com dados, não por votação.', 'Revise o QFD quando a VOC mudar.'],
    [['No QFD, o que vai nas linhas da matriz principal?', 'Os requisitos do cliente', 'Os fornecedores', 'Os custos', 'As causas', 'Os “o quês”.'],
      ['Peso 5 e relação forte (9) contribuem com:', '45 pontos', '14 pontos', '5 pontos', '9 pontos', '5 × 9.'],
      ['O “telhado” da casa da qualidade mostra:', 'Conflitos e sinergias entre características técnicas', 'O preço', 'A equipe', 'O cronograma', 'Correlações entre os “comos”.']]);

  // ---- Etapa 3.3 · Liderança de Programa
  lesson('portfolio', 'Portfólio de projetos', 'PORTFÓLIO', 'Seleção e portfólio de projetos',
    'O Black Belt ajuda a escolher os projetos certos: ligados à estratégia, com problema medido, causa desconhecida e escopo viável. Uma matriz de seleção pontua impacto financeiro, impacto no cliente, alinhamento estratégico, esforço e risco. O portfólio equilibra ganhos rápidos e projetos estruturantes.',
    'É montar a carteira de investimentos: não basta escolher bons ativos, é preciso equilibrar retorno, risco e prazo.',
    'Critérios → financeiro, cliente, estratégia, esforço, risco\nFiltro    → problema medido? causa desconhecida? dono?\nTipo      → kaizen · Green Belt · Black Belt · DMADV\nPortfólio → equilíbrio de prazo e risco\nRevisão   → mensal, com o Champion',
    ['Projeto sem ligação com a estratégia perde apoio no meio do caminho.', 'Se a solução já é conhecida, é tarefa, não projeto Six Sigma.', 'Capacidade limitada: menos projetos, bem concluídos.'],
    { p: 'Matriz de seleção (notas 1 a 5 × pesos):', c: 'Pesos: financeiro 3 · cliente 3 · estratégia 2 · esforço (inverso) 2\nTotal = Σ nota × peso', fig: { type: 'table', cols: ['Projeto', 'Financeiro', 'Cliente', 'Estratégia', 'Facilidade', 'Total'], rows: [['Prazo de entrega no CD BH', 4, 5, 5, 3, 43], ['Pedidos com erro', 4, 4, 4, 4, 40], ['Avarias no transporte', 3, 4, 3, 3, 33], ['Layout do estoque', 2, 2, 3, 4, 26]], hl: [0], speech: 'O projeto de prazo de entrega no CD de Belo Horizonte lidera a seleção.' } },
    ['Não escolha pelo entusiasmo de quem propôs.', 'Defina o tipo de projeto pela complexidade.', 'Revise o portfólio: cancelar projeto ruim também é decisão.'],
    [['Qual é um bom candidato a projeto Six Sigma?', 'Problema medido, com causa desconhecida e ligado à estratégia', 'Tarefa com solução já definida', 'Ideia sem dado nenhum', 'Projeto sem dono', 'Critérios de seleção.'],
      ['Se a solução já é conhecida e simples, o melhor é:', 'Executar como tarefa ou kaizen rápido', 'Abrir um projeto Black Belt de 6 meses', 'Fazer um DOE', 'Ignorar', 'Método proporcional ao problema.'],
      ['Quem revisa o portfólio com o Black Belt?', 'O Champion', 'O cliente', 'O fornecedor', 'O auditor externo', 'Patrocínio e prioridades.']]);

  lesson('ganho', 'Ganho financeiro', 'R$', 'Ganho financeiro e custo da má qualidade',
    'O custo da má qualidade (COPQ) soma falhas internas (retrabalho, refugo), falhas externas (devoluções, reenvio, multas), avaliação (inspeção) e prevenção. O ganho do projeto compara a linha de base com o resultado, em base anual, validado com o financeiro: ganho “duro” (no caixa) e “suave” (capacidade liberada, satisfação).',
    'É a conta de luz: não basta dizer que trocou as lâmpadas; você mostra a fatura de antes e de depois.',
    'COPQ      = falha interna + falha externa + avaliação + prevenção\nGanho     = (linha de base − resultado) × volume × custo unitário\nDuro      → aparece no caixa (menos reenvios)\nSuave     → horas liberadas, satisfação\nValidação → controladoria assina',
    ['Use a mesma base de volume antes e depois.', 'Desconte custos do projeto (equipamentos, horas).', 'Ganho não validado pelo financeiro perde credibilidade.'],
    { p: 'Ganho do projeto de pedidos com erro:', c: 'Antes 1,2% · depois 0,4% · 600 mil pedidos/ano\nCusto por pedido com erro = R$ 52\nGanho = (0,012 − 0,004) × 600.000 × 52 = R$ ' + f((0.012 - 0.004) * 600000 * 52, 0), fig: { type: 'pareto', items: [['Falha externa', 210], ['Falha interna', 95], ['Avaliação', 48], ['Prevenção', 22]], cum: false, title: 'COPQ do CD (R$ mil/ano)' } },
    ['Não some ganhos suaves ao caixa.', 'Projete o ganho por 12 meses, não para sempre.', 'Acompanhe se o ganho se mantém depois da entrega.'],
    [['Frete de reenvio de um pedido errado é custo de:', 'Falha externa', 'Prevenção', 'Avaliação', 'Falha interna', 'O erro chegou ao cliente.'],
      ['Erro caiu de 1,0% para 0,5% em 400 mil pedidos/ano, a R$ 50 cada. Ganho anual?', 'R$ 100 mil', 'R$ 200 mil', 'R$ 20 mil', 'R$ 1 milhão', '0,005 × 400.000 × 50.'],
      ['Quem deve validar o ganho financeiro?', 'A área financeira (controladoria)', 'Só o Green Belt', 'O fornecedor', 'O cliente', 'Credibilidade dos números.']]);

  lesson('mudanca', 'Gestão da mudança', 'ADKAR', 'Gestão da mudança e mentoria',
    'A melhor solução falha se as pessoas não a adotam. Modelos como o ADKAR (Consciência, Desejo, Conhecimento, Habilidade, Reforço) e a análise de stakeholders ajudam a planejar a adoção. O Black Belt também é mentor: orienta Green Belts com perguntas, revisões de tollgate e feedback, sem fazer o projeto por eles.',
    'É ensinar alguém a andar de bicicleta: você segura no começo, solta aos poucos e deixa a pessoa pedalar sozinha.',
    'A → Consciência: por que mudar?\nD → Desejo: o que eu ganho?\nK → Conhecimento: como fazer?\nA → Habilidade: consigo fazer?\nR → Reforço: o que mantém?\nStakeholders → poder × interesse',
    ['Resistência é informação: entenda a causa antes de combater.', 'Comunique cedo, com dados e com o porquê.', 'Mentoria boa faz perguntas, não dá respostas prontas.'],
    { p: 'Mapa de stakeholders do projeto:', c: '# alto poder e alto interesse → gerenciar de perto\n# alto poder e baixo interesse → manter satisfeito', fig: { type: 'cards', items: [['Gerenciar de perto', 'Diretor de Operações e gerente do CD.'], ['Manter satisfeito', 'Diretoria financeira.'], ['Manter informado', 'Supervisores e conferentes.'], ['Monitorar', 'Áreas de apoio.']], speech: 'O mapa de stakeholders define como envolver cada grupo.' } },
    ['Não confunda treinamento (conhecimento) com habilidade.', 'Sem reforço, o comportamento antigo volta.', 'Mentor que resolve pelo mentorado não forma ninguém.'],
    [['No ADKAR, o “R” significa:', 'Reforço', 'Resultado', 'Revisão', 'Risco', 'O que sustenta a mudança.'],
      ['Stakeholder com alto poder e alto interesse deve ser:', 'Gerenciado de perto', 'Ignorado', 'Só monitorado', 'Informado no fim', 'Quadrante principal.'],
      ['Um bom mentor de Green Belt:', 'Faz perguntas e revisa, sem fazer o projeto por ele', 'Faz o projeto sozinho', 'Só cobra prazos', 'Evita feedback', 'Desenvolve autonomia.']]);

  lesson('hoshin', 'Programa', 'MBB', 'Hoshin Kanri e o programa (visão Master Black Belt)',
    'O Master Black Belt olha o programa inteiro: desdobra a estratégia em metas e projetos (Hoshin Kanri e matriz X), define a trilha de formação das faixas, padroniza o método e mede os resultados do programa (ganhos, projetos concluídos, pessoas certificadas internamente).',
    'É o maestro: não toca todos os instrumentos, mas garante que a orquestra inteira toque a mesma música no mesmo ritmo.',
    'Estratégia → objetivos de 3 a 5 anos\nHoshin     → metas anuais desdobradas por área\nMatriz X   → objetivos × metas × projetos × indicadores × donos\nFormação   → trilha White → Black\nIndicadores → ganho anual, projetos, prazo médio, adoção',
    ['Poucas prioridades: se tudo é prioridade, nada é.', 'Catchball: metas descem, planos sobem, ajustam-se juntos.', 'O programa precisa de governança e revisões mensais.'],
    { p: 'Do objetivo da empresa ao projeto:', c: '# cada nível responde: o que preciso fazer\n# para o nível de cima atingir a meta?', fig: { type: 'chevrons', steps: [{ k: '1', t: 'Visão' }, { k: '2', t: 'Objetivo anual' }, { k: '3', t: 'Meta da área' }, { k: '4', t: 'Projeto DMAIC' }, { k: '5', t: 'Indicador' }] } },
    ['Programa medido só por número de pessoas treinadas não gera resultado.', 'Projetos devem nascer da estratégia, não da vontade de usar ferramentas.', 'Celebre e divulgue os resultados.'],
    [['O que é catchball no Hoshin Kanri?', 'Negociação de ida e volta das metas entre os níveis', 'Um jogo de integração', 'Uma auditoria', 'Um desperdício', 'Metas viram compromisso.'],
      ['Qual é um bom indicador de um programa Lean Six Sigma?', 'Ganho anual validado pelos projetos', 'Número de slides', 'Horas de reunião', 'Quantidade de cartazes', 'Resultado, não atividade.'],
      ['Qual papel cuida da estratégia e da formação do programa?', 'Master Black Belt', 'Yellow Belt', 'White Belt', 'Cliente', 'Visão de programa.']]);

  lesson('final', 'Desafio final', 'DMAIC', 'Desafio final: projeto DMAIC completo',
    'Um projeto completo junta tudo: carta de projeto e CTQ (Definir), linha de base e MSA (Medir), Pareto, testes e regressão (Analisar), soluções, DOE, poka-yoke e FMEA (Melhorar), carta de controle, Cpk e plano de controle (Controlar), com ganho validado e o processo devolvido ao dono.',
    'É a final do campeonato: todas as jogadas treinadas aparecem na mesma partida, e o placar (o ganho) é o que conta.',
    'Definir   → carta, CTQ, SIPOC\nMedir     → MSA, linha de base, DPMO\nAnalisar  → Pareto, hipóteses, regressão\nMelhorar  → soluções, DOE, poka-yoke, FMEA\nControlar → carta, Cpk, plano de controle, ganho',
    ['Cada fase fecha com um tollgate e evidências.', 'Ferramenta certa no momento certo.', 'O projeto termina com o dono do processo assumindo o controle.'],
    { p: 'Resultado do ano no indicador de pedidos com problema (%):', c: '# cada queda corresponde a um ciclo de melhoria\nJan = 1,2% → Dez = 0,4%', fig: { type: 'control', pts: [1.2, 1.15, 1.25, 1.18, 0.9, 0.85, 0.88, 0.82, 0.45, 0.42, 0.40, 0.38], lim: { lc: 0.8, lsc: 1.45, lic: 0.15 }, labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'], unit: '%', d: 2, mark: false } },
    ['Ferramenta sem método vira burocracia.', 'Recalcule limites depois de cada melhoria comprovada.', 'Documente as lições aprendidas para os próximos projetos.'],
    [['Em que fase se valida o sistema de medição?', 'Medir', 'Definir', 'Melhorar', 'Controlar', 'MSA antes da análise.'],
      ['O plano de controle é entregue em qual fase?', 'Controlar', 'Definir', 'Medir', 'Analisar', 'Sustenta o ganho.'],
      ['O projeto termina quando:', 'O dono do processo assume o controle com o ganho validado', 'A apresentação final é feita', 'O DOE é concluído', 'O Green Belt é promovido', 'Entrega ao dono.']]);

  /* ------------------------------ Pacote ------------------------------ */
  const COMPUTED = { pareto: 1, control: 1, hist: 1, scatter: 1, vsm: 1, matrix: 1, normal: 1, oee: 1, box: 1, effects: 1, pchart: 1, xbar: 1 };
  function register() {
    if (!global.Lessons || !global.Lessons.registerPack) return;
    global.Lessons.registerPack('sixsigma', {
      LESSONS: L, MAP: MAP, fallback: 'lss', goalLabel: 'Sua missão',
      steps: ['Conceito', 'Passo a passo', 'Exemplo aplicado', 'Cuidados', 'Seu desafio'],
      syntaxTitle: 'Como se aplica',
      solution: function (ex) {
        const esc = global.UI.esc; let html = '';
        if (ex.kind === 'choice') html = '<p class="ls-ans">' + esc(ex.opts[0]) + '</p>';
        else if (ex.kind === 'multi') html = '<ul class="ls-anslist">' + ex.ok.map(function (i) { return '<li>' + esc(ex.opts[i]) + '</li>'; }).join('') + '</ul>';
        else if (ex.kind === 'order') html = '<ol class="ls-anslist num">' + ex.items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ol>';
        else if (ex.kind === 'classify') html = '<ul class="ls-anslist">' + ex.items.map(function (it) { return '<li><span>' + esc(it[0]) + '</span><b>' + esc(ex.cats[it[1]]) + '</b></li>'; }).join('') + '</ul>';
        else html = '<p class="ls-ans">' + esc((ex.unit === 'R$' ? 'R$ ' : '') + global.GQCharts.fmt(ex.a, ex.dec == null ? 2 : ex.dec) + (ex.unit && ex.unit !== 'R$' ? (ex.unit === '%' ? '%' : ' ' + ex.unit) : '')) + '</p>';
        return { label: 'Resposta', html: html, note: ex.x, speech: ex.x };
      }, syntaxSpeech: 'Agora, o passo a passo. Repare em como a ferramenta é aplicada.', compareSpeech: 'Repare como os números viram uma decisão.',
      codeHtml: function (code) { return global.GQCharts.highlight(code); },
      example: function (les) {
        const out = global.GQCharts.render(Object.assign({ theme: 'sixsigma' }, les.exemplo.fig));
        return { code: les.exemplo.c, badge: COMPUTED[les.exemplo.fig.type] ? 'Calculado agora com dados da NexusMarket' : 'Aplicado à operação da NexusMarket', liveHtml: out.html, speech: out.speech };
      },
      tags: function (ex) {
        const K = { choice: ['target', 'Estudo de caso'], multi: ['check', 'Marque todas as corretas'], order: ['bars', 'Coloque em ordem'], classify: ['grid', 'Classifique os itens'], calc: ['code', 'Cálculo com dados reais'] }[ex.kind] || ['target', 'Caso'];
        return [{ icon: K[0], label: K[1] }].concat(ex.d ? [{ icon: 'bars', label: 'Com gráfico' }] : []);
      },
    });
  }
  register();
  global.SSLessons = { LESSONS: L, MAP: MAP };
})(typeof window !== 'undefined' ? window : globalThis);
