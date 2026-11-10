/* =====================================================================
   plus-ss.js — Blocos extras das aulas de Lean Six Sigma
   ===================================================================== */
(function (global) {
  'use strict';
  const DMAIC = ['DMAIC', 'Definir', 'Medir', 'Analisar', 'Melhorar', 'Controlar'];
  const mark = function (i, k) { return DMAIC.map(function (s, j) { return j === i ? (k || '*') + s : s; }); };
  global.Lessons.addPlus('sixsigma', {
    lss: {
      o: ['Entender o que o Lean e o Six Sigma trazem cada um', 'Ver como os dois se completam', 'Reconhecer quando usar Lean Six Sigma'],
      v: { t: 'Lean × Six Sigma', s: 'Velocidade e consistência.',
        a: { h: 'Lean', d: 'Elimina desperdícios e acelera o fluxo', u: ['Esperas, estoques, retrabalho'], c: 'Lead time de 9 para 4 dias' },
        b: { h: 'Six Sigma', d: 'Reduz a variação e os defeitos', u: ['Prazos imprevisíveis', 'Defeitos'], c: 'Atrasos de 12% para 2%' },
        r: 'Lean deixa o processo rápido; Six Sigma deixa o processo confiável.' },
      r: 'Lean Six Sigma: mais rápido e mais previsível.',
    },
    voc: {
      o: ['Definir valor pelo olhar do cliente', 'Coletar a voz do cliente em várias fontes', 'Transformar reclamações em necessidades'],
      f: ['Da voz ao valor', 'reclamações e pesquisas', '*necessidade', 'o que o cliente pagaria'],
      r: 'O projeto começa no que o cliente valoriza, não no que achamos.',
    },
    muda: {
      o: ['Reconhecer os 8 desperdícios (TIMWOODS)', 'Separar atividades que agregam valor', 'Priorizar desperdícios para atacar'],
      f: ['TIMWOODS', 'Transporte', 'Inventário', 'Movimentação', 'Espera', 'Superprodução', 'Superprocessamento', 'Defeitos', '*Talento'],
      r: 'Desperdício é o que consome recurso sem agregar valor ao cliente.',
    },
    variacao: {
      o: ['Entender por que a variação é o problema', 'Ler o sigma como medida de variação', 'Ligar variação a defeitos'],
      e: { q: 'O prazo médio é 4 dias, dentro da promessa de 5. Está tudo bem.', y: 'Com variação alta, muitos pedidos passam de 5 dias mesmo com média 4.', x: 'Olhe a variação e a fração acima do limite.' },
      r: 'O cliente sente a variação, não a média.',
    },
    dmaic: {
      o: ['Conhecer as fases do DMAIC', 'Saber a pergunta de cada fase', 'Avançar fase por fase com evidência'],
      f: DMAIC,
      v: { t: 'DMAIC × PDCA', s: 'Primos com focos diferentes.',
        a: { h: 'PDCA', d: 'Ciclo curto de melhoria do dia a dia', u: ['Problemas simples', 'Rotina'], c: 'Planejar → Executar → Checar → Agir' },
        b: { h: 'DMAIC', d: 'Projeto estruturado com dados', u: ['Causa desconhecida', 'Variação e defeitos'], c: 'Definir → Medir → Analisar → Melhorar → Controlar' },
        r: 'Causa desconhecida e problema relevante pedem DMAIC.' },
      r: 'Cada fase do DMAIC termina com uma entrega e uma revisão.',
    },
    papeis: {
      o: ['Conhecer os papéis das faixas', 'Entender o papel do Champion', 'Saber quem lidera cada tipo de projeto'],
      f: ['Faixas', 'White', 'Yellow', 'Green', '*Black', '!Master Black'],
      r: 'Champion apoia; Belts lideram e executam.',
    },
    charter: {
      o: ['Escrever a carta de projeto', 'Definir problema, meta e escopo', 'Montar o caso de negócio'],
      e: { q: 'Problema: o processo de entrega é ruim. Meta: melhorar.', y: 'Problema sem dado e meta sem número não orientam o projeto.', x: 'Problema: 12% dos pedidos atrasam (jan–jun). Meta: 4% até dezembro.' },
      r: 'Carta boa tem problema medido, meta numérica e escopo claro.',
    },
    sipoc: {
      o: ['Montar o SIPOC do projeto', 'Delimitar onde o processo começa e termina', 'Identificar clientes e saídas'],
      f: ['SIPOC', 'Fornecedores', 'Entradas', '*Processo', 'Saídas', 'Clientes'],
      r: 'O SIPOC define o escopo antes de qualquer análise.',
    },
    ctq: {
      o: ['Traduzir necessidades em CTQs', 'Montar a árvore CTQ', 'Definir especificações mensuráveis'],
      f: ['Árvore CTQ', 'necessidade', 'direcionador', '*CTQ mensurável', '!especificação'],
      r: '“Entrega rápida” vira “entrega em até 3 dias úteis”.',
    },
    dados: {
      o: ['Diferenciar dados contínuos e discretos', 'Montar uma folha de verificação', 'Preferir dados contínuos quando possível'],
      v: { t: 'Contínuo × discreto', s: 'Medir ou contar?',
        a: { h: 'Contínuo', d: 'Medido numa escala', u: ['Tempo, peso, valor', 'Precisa de menos dados'], c: 'Prazo de entrega: 3,6 dias' },
        b: { h: 'Discreto', d: 'Contado ou classificado', u: ['Defeituoso ou não', 'Número de reclamações'], c: 'Pedido atrasado: sim ou não' },
        r: 'Dado contínuo traz mais informação com menos amostras.' },
      r: 'Quanto mais informação o dado tem, menos dados você precisa.',
    },
    pareto: {
      o: ['Montar o Pareto das causas', 'Estratificar para achar o foco', 'Escolher onde o projeto vai atuar'],
      f: ['Pareto', 'contar', 'ordenar', '*% acumulado', '!poucos vitais'],
      r: 'Pareto e estratificação dizem onde está o problema.',
    },
    causas: {
      o: ['Levantar causas com o Ishikawa', 'Aprofundar com os 5 porquês', 'Separar causas possíveis de comprovadas'],
      f: ['Da hipótese à causa raiz', 'Ishikawa|possíveis', '5 porquês|aprofundar', '*dados|comprovar', '!causa raiz'],
      e: { q: 'A equipe concordou que a causa é o fornecedor.', y: 'Concordância não é prova.', x: 'Teste a hipótese com dados antes de agir.' },
      r: 'Causa raiz se comprova com dados.',
    },
    '5s': {
      o: ['Aplicar o 5S no local de trabalho', 'Usar gestão visual', 'Sustentar com auditorias'],
      f: ['5S', 'Utilização', 'Ordenação', 'Limpeza', 'Padronização', '*Disciplina'],
      r: 'Gestão visual mostra, num olhar, se está tudo certo.',
    },
    kaizen: {
      o: ['Organizar um evento kaizen', 'Padronizar a melhoria', 'Combinar kaizen e DMAIC'],
      v: { t: 'Kaizen × projeto DMAIC', s: 'Rápido e focado ou estruturado e profundo?',
        a: { h: 'Kaizen', d: 'Dias, com a equipe do processo', u: ['Causa conhecida', 'Solução óbvia'], c: 'Reorganizar a área de embalagem em 3 dias' },
        b: { h: 'DMAIC', d: 'Semanas ou meses, com análise de dados', u: ['Causa desconhecida', 'Variação'], c: 'Reduzir atrasos de 12% para 4%' },
        r: 'Sabe a causa? Kaizen. Não sabe? DMAIC.' },
      r: 'Melhoria sem padrão volta ao que era.',
    },
    coleta: {
      o: ['Montar um plano de coleta de dados', 'Escrever a definição operacional', 'Escolher o tipo de amostragem'],
      f: ['Plano de coleta', 'o quê', 'definição operacional', 'quem e quando', '*quantos', '!amostragem'],
      e: { q: 'Cada um mede o atraso do seu jeito.', y: 'Sem definição operacional, os números não são comparáveis.', x: 'Defina: atraso = data de entrega − data prometida, em dias úteis.' },
      r: 'Definição operacional faz todos medirem a mesma coisa.',
    },
    descritiva: {
      o: ['Resumir centro, dispersão e forma', 'Ler boxplot e histograma', 'Comparar grupos com estatística descritiva'],
      r: 'Antes do teste, descreva: centro, dispersão e forma.',
    },
    normal: {
      o: ['Reconhecer a curva normal', 'Usar a regra 68-95-99,7', 'Estimar a fração fora da especificação'],
      f: ['Regra empírica', '±1σ|68%', '*±2σ|95%', '!±3σ|99,7%'],
      r: 'Com média e desvio, a normal estima quantos ficam fora do limite.',
    },
    msa: {
      o: ['Avaliar o sistema de medição', 'Usar R&R para dados contínuos', 'Usar Kappa para dados de atributo'],
      v: { t: 'R&R × Kappa', s: 'Medição contínua ou classificação?',
        a: { h: 'R&R', d: 'Dados contínuos', u: ['Peso, tempo, medida'], c: '% R&R abaixo de 10%: aceitável' },
        b: { h: 'Kappa', d: 'Dados de atributo', u: ['Aprovado ou reprovado', 'Classificação de defeitos'], c: 'Kappa acima de 0,9: ótimo' },
        r: 'Sem medição confiável, não há análise confiável.' },
      r: 'Valide a régua antes de medir o processo.',
    },
    baseline: {
      o: ['Medir a linha de base', 'Calcular DPMO e rendimento', 'Converter em nível sigma'],
      f: ['Linha de base', 'defeitos', '*DPMO', 'rendimento', '!nível sigma'],
      r: 'Sem linha de base, não há como provar o ganho.',
    },
    vsm: {
      o: ['Desenhar o mapa do fluxo de valor', 'Calcular lead time e PCE', 'Comparar com o takt'],
      f: ['VSM', 'pedido', 'processo', '*espera', 'processo', '!entrega'],
      r: 'Lead time alto quase sempre é espera, não trabalho.',
    },
    fluxo: {
      o: ['Criar fluxo contínuo', 'Montar um sistema puxado', 'Usar kanban para limitar estoques'],
      v: { t: 'Lote × fluxo contínuo', s: 'Esperar juntar ou seguir um por vez?',
        a: { h: 'Lote', d: 'Junta vários antes de passar adiante', u: ['Gera filas e esperas'], c: 'Embalar 50 pedidos e depois despachar' },
        b: { h: 'Fluxo contínuo', d: 'Um item de cada vez', u: ['Lead time menor', 'Defeitos aparecem cedo'], c: 'Embalar e despachar pedido a pedido' },
        r: 'Lote menor, fila menor, entrega mais rápida.' },
      r: 'No sistema puxado, a demanda decide o que produzir.',
    },
    oee: {
      o: ['Calcular o OEE', 'Achar a maior perda', 'Reduzir o setup com SMED'],
      f: ['OEE', 'Disponibilidade', '× Performance', '× Qualidade', '!OEE'],
      r: 'OEE mostra quanto do tempo planejado vira produção boa.',
    },
    hipoteses: {
      o: ['Formular H0 e H1', 'Interpretar o valor-p', 'Escolher o teste pelo tipo de dado'],
      f: ['Teste de hipótese', 'H0 e H1', 'α', 'dados', '*valor-p', '!decisão'],
      e: { q: 'p = 0,30, então provamos que não há diferença.', y: 'O teste só não encontrou evidência suficiente.', x: 'Diga: não rejeitamos H0 com estes dados.' },
      r: 'p < 0,05: a diferença dificilmente é acaso.',
    },
    regressao: {
      o: ['Medir a relação com correlação', 'Ajustar a reta de regressão', 'Interpretar o R²'],
      e: { q: 'r = 0,85 prova que a temperatura causa o atraso.', y: 'Correlação forte não prova causa.', x: 'Confirme com experimento ou conhecimento do processo.' },
      r: 'R² diz quanto da variação de y a reta explica.',
    },
    solucoes: {
      o: ['Gerar soluções para as causas comprovadas', 'Priorizar com esforço × impacto', 'Testar com piloto antes de expandir'],
      f: ['Da causa à solução', 'gerar', 'priorizar', '*piloto', '!implantar'],
      r: 'Solução boa ataca a causa comprovada e passa por um piloto.',
    },
    fmea: {
      o: ['Montar o FMEA do processo', 'Calcular o NPR', 'Usar poka-yoke para reduzir ocorrência e melhorar detecção'],
      f: ['FMEA', 'modo de falha', 'efeito', 'causa', '*S × O × D', '!ação'],
      r: 'Poka-yoke é a ação que mais reduz o NPR.',
    },
    cep: {
      o: ['Escolher a carta de controle pelo tipo de dado', 'Calcular os limites de controle', 'Reagir só a causas especiais'],
      v: { t: 'Limite de controle × especificação', s: 'Dois limites que não se confundem.',
        a: { h: 'Limite de controle', d: 'Calculado do processo: a voz do processo', u: ['Detectar causas especiais'], c: 'LSC = média + 3σ' },
        b: { h: 'Especificação', d: 'Definida pelo cliente: a voz do cliente', u: ['Aceitar ou rejeitar o produto'], c: 'Entrega em até 5 dias' },
        r: 'Nunca desenhe a especificação na carta de controle no lugar dos limites.' },
      r: 'A carta diz quando agir; a especificação diz o que o cliente aceita.',
    },
    cpk: {
      o: ['Calcular Cp e Cpk', 'Interpretar a capabilidade', 'Saber quando centralizar ou reduzir a variação'],
      v: { t: 'Cp × Cpk', s: 'Potencial e realidade.',
        a: { h: 'Cp', d: 'A variação cabe na especificação?', u: ['Potencial'], c: 'Cp = (LSE − LIE) ÷ 6σ' },
        b: { h: 'Cpk', d: 'Cabe e está centrado?', u: ['Desempenho real'], c: 'Cpk = menor (LSE − x̄, x̄ − LIE) ÷ 3σ' },
        r: 'Cp alto e Cpk baixo: centralize o processo.' },
      r: 'Capabilidade só vale para processo estável.',
    },
    anova: {
      o: ['Comparar três ou mais médias', 'Ler a estatística F', 'Fazer comparações post hoc'],
      r: 'ANOVA diz se alguma média difere; o post hoc diz qual.',
    },
    quiquadrado: {
      o: ['Testar associação entre variáveis categóricas', 'Usar testes não paramétricos', 'Escolher o teste certo para dados assimétricos'],
      r: 'Dados de contagem? Qui-quadrado. Dados assimétricos? Não paramétricos.',
    },
    mreg: {
      o: ['Explicar y com várias variáveis', 'Interpretar coeficientes e valores-p', 'Evitar variáveis redundantes'],
      r: 'Cada coeficiente é o efeito da variável com as outras fixas.',
    },
    poder: {
      o: ['Entender erros tipo I e tipo II', 'Calcular o poder do teste', 'Dimensionar a amostra'],
      v: { t: 'Erro tipo I × tipo II', s: 'Falso alarme ou efeito perdido.',
        a: { h: 'Tipo I (α)', d: 'Achar diferença que não existe', u: ['Implantar mudança inútil'], c: 'α = 5%' },
        b: { h: 'Tipo II (β)', d: 'Não achar diferença real', u: ['Descartar melhoria verdadeira'], c: 'Poder = 1 − β, meta de 80%' },
        r: 'Amostra pequena = poder baixo = melhorias reais passam despercebidas.' },
      r: 'Dimensione a amostra antes de coletar.',
    },
    naonormal: {
      o: ['Reconhecer dados não normais', 'Escolher outra distribuição ou transformar', 'Calcular Ppk de forma adequada'],
      e: { q: 'Vou usar a fórmula normal no tempo de atendimento mesmo assim.', y: 'Dados assimétricos distorcem a fração fora do limite.', x: 'Ajuste outra distribuição (por exemplo, lognormal) ou transforme os dados.' },
      r: 'Antes do Cpk, confira se os dados são normais.',
    },
    doe: {
      o: ['Planejar um experimento fatorial 2ᵏ', 'Calcular efeitos principais', 'Testar vários fatores ao mesmo tempo'],
      v: { t: 'Um fator por vez × DOE', s: 'Mexer em um fator de cada vez ou em todos juntos?',
        a: { h: 'Um fator por vez', d: 'Muitos testes e interações escondidas', u: ['Evite'], c: 'Testar a temperatura, depois o tempo…' },
        b: { h: 'DOE', d: 'Todas as combinações, menos testes', u: ['Descobrir interações', 'Achar o ajuste ótimo'], c: 'Fatorial 2³ = 8 combinações' },
        r: 'O DOE mostra efeitos e interações com poucos ensaios.' },
      r: 'Experimento planejado comprova causa.',
    },
    fracionado: {
      o: ['Reconhecer interações entre fatores', 'Usar fatoriais fracionados', 'Entender o confundimento'],
      r: 'Linhas não paralelas no gráfico de interação indicam interação.',
    },
    dfss: {
      o: ['Saber quando usar DFSS', 'Seguir o DMADV', 'Projetar processos novos com qualidade desde o início'],
      f: ['DMADV', 'Definir', 'Medir', 'Analisar', '*Desenhar', '!Verificar'],
      r: 'DMAIC melhora o que existe; DMADV projeta o que ainda não existe.',
    },
    qfd: {
      o: ['Montar a casa da qualidade', 'Ligar requisitos do cliente a características técnicas', 'Priorizar características pelos pesos'],
      f: ['QFD', 'o quê|cliente', 'como|técnico', '*matriz de relações', '!prioridades'],
      r: 'QFD garante que o projeto técnico responda ao cliente.',
    },
    portfolio: {
      o: ['Selecionar projetos com critérios', 'Ligar projetos à estratégia', 'Equilibrar o portfólio'],
      e: { q: 'Vamos abrir um projeto DMAIC para trocar a impressora.', y: 'Solução já conhecida não precisa de DMAIC.', x: 'Faça direto (“just do it”) e reserve o DMAIC para causas desconhecidas.' },
      r: 'Projeto certo: estratégico, medido, com causa desconhecida e escopo viável.',
    },
    ganho: {
      o: ['Calcular o custo da má qualidade', 'Validar o ganho financeiro', 'Separar ganho hard e soft'],
      f: ['Ganho do projeto', 'linha de base', 'resultado depois', '*diferença', '!validação financeira'],
      r: 'Ganho só conta quando a área financeira valida.',
    },
    mudanca: {
      o: ['Aplicar o ADKAR', 'Mapear stakeholders', 'Orientar Green e Yellow Belts'],
      f: ['ADKAR', 'Consciência', 'Desejo', 'Conhecimento', 'Habilidade', '*Reforço'],
      r: 'Solução que as pessoas não adotam não gera resultado.',
    },
    hoshin: {
      o: ['Desdobrar a estratégia em projetos', 'Usar a matriz X', 'Gerir o programa como Master Black Belt'],
      f: ['Desdobramento', 'estratégia', 'metas', '*projetos', '!indicadores'],
      r: 'Programa forte liga cada projeto a um objetivo da empresa.',
    },
    final: {
      o: ['Conduzir um projeto DMAIC completo', 'Escolher as ferramentas certas em cada fase', 'Entregar o controle para o dono do processo'],
      f: mark(4, '!'),
      r: 'Projeto termina quando o dono do processo sustenta o resultado.',
    },
  });
})(typeof window !== 'undefined' ? window : globalThis);
