/* =====================================================================
   plus-gq.js — Blocos extras das aulas de Gestão da Qualidade
   ===================================================================== */
(function (global) {
  'use strict';
  global.Lessons.addPlus('gestao', {
    qualidade: {
      o: ['Definir qualidade pelo olhar do cliente', 'Conhecer as visões de Juran, Crosby e Deming', 'Diferenciar qualidade do produto e do processo'],
      e: { q: 'Qualidade é ter o produto mais caro e sofisticado.', y: 'Qualidade é atender aos requisitos do cliente com consistência.', x: 'Pergunte o que o cliente valoriza e meça se você entrega isso sempre.' },
      r: 'Qualidade é atender ao que o cliente precisa, sempre do mesmo jeito.',
    },
    processos: {
      o: ['Enxergar o trabalho como processo', 'Montar um SIPOC', 'Definir o início e o fim do processo'],
      f: ['SIPOC', 'Fornecedores', 'Entradas', '*Processo', 'Saídas', 'Clientes'],
      r: 'O SIPOC mostra o processo inteiro numa página.',
    },
    indicadores: {
      o: ['Montar indicadores com fórmula, meta e dono', 'Diferenciar eficácia e eficiência', 'Combinar indicadores de resultado e de processo'],
      v: { t: 'Eficácia × eficiência', s: 'Fazer a coisa certa ou fazer certo a coisa?',
        a: { h: 'Eficácia', d: 'Atingiu o resultado?', u: ['Metas, prazos, satisfação'], c: '% de pedidos entregues no prazo' },
        b: { h: 'Eficiência', d: 'Usou bem os recursos?', u: ['Custo, tempo, produtividade'], c: 'Custo de frete por pedido' },
        r: 'O ideal é ser eficaz e eficiente ao mesmo tempo.' },
      r: 'Indicador sem meta e sem dono não muda nada.',
    },
    pdca: {
      o: ['Seguir as quatro etapas do PDCA', 'Ligar o PDCA a dados e metas', 'Girar o ciclo até padronizar'],
      f: ['Ciclo PDCA', 'P|planejar', 'D|executar', '*C|checar', '!A|agir'],
      e: { q: 'Planejamos e executamos; pronto, o problema está resolvido.', y: 'Sem checar, ninguém sabe se a ação funcionou; sem agir, nada vira padrão.', x: 'Meça o resultado (C) e padronize ou corrija (A).' },
      r: 'PDCA é um ciclo: termina num padrão e recomeça na próxima melhoria.',
    },
    '5w2h': {
      o: ['Transformar decisões em plano executável', 'Responder às 7 perguntas do 5W2H', 'Acompanhar o plano com prazos e responsáveis'],
      f: ['5W2H', 'O quê', 'Por quê', 'Onde', 'Quando', '*Quem', 'Como', '!Quanto'],
      e: { q: 'Ação: melhorar o atendimento. Responsável: a equipe.', y: 'Ação vaga e responsável coletivo não são acompanháveis.', x: 'Ação concreta, uma pessoa responsável e uma data.' },
      r: 'Toda ação precisa de um nome e de uma data.',
    },
    brainstorm: {
      o: ['Gerar muitas ideias sem julgamento', 'Agrupar ideias por afinidade', 'Priorizar com critérios claros'],
      f: ['Brainstorming', 'gerar|sem julgar', 'agrupar|afinidade', '*priorizar', '!plano'],
      r: 'Primeiro quantidade, depois qualidade.',
    },
    folha: {
      o: ['Coletar dados no local de forma padronizada', 'Montar uma folha de verificação', 'Usar os dados no Pareto'],
      e: { q: 'Cada um anota as ocorrências do seu jeito.', y: 'Categorias diferentes impedem somar e comparar.', x: 'Uma folha única, com categorias e período definidos.' },
      r: 'Dado bom começa numa coleta padronizada.',
    },
    estrat: {
      o: ['Separar os dados por grupos', 'Descobrir onde o problema se concentra', 'Escolher bons critérios de estratificação'],
      e: { q: 'O índice geral de atrasos está estável, então não há problema.', y: 'O total pode esconder uma loja ou turno muito pior que os outros.', x: 'Estratifique por loja, turno, transportadora e dia.' },
      r: 'Média geral esconde; estratificação revela.',
    },
    pareto: {
      o: ['Montar o diagrama de Pareto', 'Achar os poucos vitais', 'Escolher onde atacar primeiro'],
      f: ['Diagrama de Pareto', 'contar por categoria', 'ordenar', '*% acumulado', '!poucos vitais'],
      e: { q: 'Vamos atacar todos os motivos de devolução ao mesmo tempo.', y: 'O esforço se dilui e os maiores motivos continuam.', x: 'Ataque primeiro as 2 ou 3 causas que somam cerca de 80%.' },
      r: 'Poucas causas explicam a maior parte do problema.',
    },
    ishikawa: {
      o: ['Organizar causas possíveis nos 6M', 'Montar a espinha de peixe com a equipe', 'Transformar causas em hipóteses a verificar'],
      f: ['Os 6M', 'Método', 'Máquina', 'Mão de obra', 'Material', 'Medida', '*Meio ambiente'],
      e: { q: 'Está no Ishikawa, então é causa.', y: 'O diagrama lista causas possíveis, não comprovadas.', x: 'Verifique cada hipótese com dados antes de agir.' },
      r: 'Ishikawa organiza hipóteses; os dados confirmam.',
    },
    porques: {
      o: ['Chegar à causa raiz com os 5 porquês', 'Parar quando a causa puder ser eliminada', 'Evitar culpar pessoas'],
      f: ['5 porquês', 'problema', 'por quê?', 'por quê?', 'por quê?', '!causa raiz'],
      e: { q: 'Por que atrasou? Porque o funcionário errou. Fim.', y: 'Parar na pessoa não impede que o erro volte.', x: 'Pergunte por que o processo permitiu o erro.' },
      r: 'A causa raiz é a que, eliminada, impede o problema de voltar.',
    },
    histograma: {
      o: ['Montar um histograma com faixas', 'Ler centro, dispersão e forma', 'Comparar com a especificação'],
      r: 'O histograma mostra se o processo cabe dentro da especificação.',
    },
    dispersao: {
      o: ['Testar a relação entre duas variáveis', 'Ler o padrão do gráfico de dispersão', 'Lembrar que relação não é causa'],
      e: { q: 'Os pontos sobem juntos, então uma variável causa a outra.', y: 'As duas podem depender de uma terceira causa.', x: 'Use a dispersão para confirmar hipóteses e teste a causa com um experimento.' },
      r: 'Dispersão mostra se duas variáveis andam juntas.',
    },
    fluxograma: {
      o: ['Desenhar o processo como ele é', 'Usar os símbolos de início, atividade e decisão', 'Achar esperas e retrabalho'],
      f: ['Símbolos', 'início', 'atividade', '*decisão', 'fim'],
      e: { q: 'Vou desenhar o fluxo como está no procedimento.', y: 'O procedimento mostra como deveria ser, não como é feito.', x: 'Desenhe o processo real, observando no local.' },
      r: 'Fluxograma bom mostra o processo real, com os desvios.',
    },
    '5s': {
      o: ['Aplicar os cinco sensos', 'Organizar o ambiente de trabalho', 'Manter o 5S com disciplina'],
      f: ['5S', 'Seiri|utilização', 'Seiton|ordenação', 'Seisō|limpeza', 'Seiketsu|padronização', '*Shitsuke|disciplina'],
      e: { q: 'Fizemos o dia do 5S e o depósito ficou ótimo.', y: 'Sem padrão e disciplina, a bagunça volta em semanas.', x: 'Defina padrões visuais e auditorias periódicas.' },
      r: 'O 5S só funciona se virar hábito.',
    },
    gut: {
      o: ['Priorizar problemas com Gravidade, Urgência e Tendência', 'Calcular G × U × T', 'Justificar a ordem de ataque'],
      f: ['Matriz GUT', 'Gravidade', 'Urgência', 'Tendência', '*G × U × T', '!prioridade'],
      r: 'Maior G × U × T, maior prioridade.',
    },
    masp: {
      o: ['Seguir as 8 etapas do MASP', 'Ligar cada etapa a uma ferramenta', 'Ver o MASP como PDCA detalhado'],
      f: ['MASP', 'identificar', 'observar', 'analisar', 'plano', 'ação', 'verificar', '*padronizar', '!concluir'],
      r: 'MASP é o PDCA em 8 passos, com ferramenta para cada um.',
    },
    '8d': {
      o: ['Resolver reclamações com o 8D', 'Conter o problema antes de achar a causa', 'Prevenir a reincidência'],
      v: { t: 'Contenção × ação corretiva', s: 'Estancar agora ou resolver de vez?',
        a: { h: 'Contenção (D3)', d: 'Protege o cliente imediatamente', u: ['Separar lotes', 'Inspeção extra'], c: 'Revisar todos os pedidos da semana' },
        b: { h: 'Ação corretiva (D5–D6)', d: 'Elimina a causa raiz', u: ['Mudar o processo'], c: 'Trocar a etiqueta que gera troca de endereço' },
        r: 'Contenção é temporária; a ação corretiva é definitiva.' },
      r: 'Primeiro proteja o cliente, depois elimine a causa.',
    },
    a3: {
      o: ['Contar a história do problema numa folha', 'Seguir a lógica do lado esquerdo ao direito', 'Usar o A3 para alinhar a equipe'],
      f: ['A3', 'contexto', 'situação atual', 'meta', '*causas', 'contramedidas', '!acompanhamento'],
      r: 'O A3 obriga a síntese: uma folha, uma história.',
    },
    muda: {
      o: ['Reconhecer os 8 desperdícios', 'Separar o que agrega valor do que não agrega', 'Atacar esperas e retrabalho'],
      e: { q: 'Estoque alto é segurança, não desperdício.', y: 'Estoque parado consome dinheiro e esconde problemas.', x: 'Dimensione o estoque pela demanda e reduza o excesso.' },
      r: 'Desperdício é tudo o que o cliente não pagaria para ter.',
    },
    vsm: {
      o: ['Mapear o fluxo de valor do pedido', 'Calcular lead time e tempo de agregação de valor', 'Achar onde o pedido espera'],
      f: ['Fluxo de valor', 'pedido', 'processo', '*espera', 'processo', '!entrega'],
      r: 'Na maioria dos processos, o pedido passa mais tempo esperando do que sendo trabalhado.',
    },
    takt: {
      o: ['Calcular o takt time', 'Comparar com o tempo de ciclo de cada etapa', 'Balancear o trabalho'],
      v: { t: 'Takt time × tempo de ciclo', s: 'O ritmo pedido e o ritmo real.',
        a: { h: 'Takt time', d: 'Ritmo da demanda', u: ['Tempo disponível ÷ demanda'], c: '480 min ÷ 240 pedidos = 2 min' },
        b: { h: 'Tempo de ciclo', d: 'Tempo real de cada etapa', u: ['Medido no processo'], c: 'Embalagem: 2,5 min por pedido' },
        r: 'Etapa com ciclo maior que o takt é o gargalo.' },
      r: 'Takt = tempo disponível ÷ demanda.',
    },
    kaizen: {
      o: ['Melhorar em pequenos passos com kaizen', 'Ir ao gemba para ver o trabalho real', 'Organizar um evento kaizen'],
      r: 'Melhoria contínua é feita por quem faz o trabalho, no lugar onde ele acontece.',
    },
    sdca: {
      o: ['Padronizar a melhor forma de trabalhar', 'Girar o SDCA para manter o resultado', 'Ligar SDCA e PDCA'],
      v: { t: 'SDCA × PDCA', s: 'Manter ou melhorar?',
        a: { h: 'SDCA', d: 'Mantém o padrão funcionando', u: ['Rotina do dia a dia'], c: 'Padronizar → Executar → Checar → Agir' },
        b: { h: 'PDCA', d: 'Melhora o padrão', u: ['Problemas e metas novas'], c: 'Planejar → Executar → Checar → Agir' },
        r: 'PDCA sobe o nível; SDCA segura o nível.' },
      r: 'Sem padrão, a melhoria escorrega de volta.',
    },
    poka: {
      o: ['Prevenir erros com poka-yoke', 'Diferenciar dispositivos de controle e de advertência', 'Projetar processos à prova de erros'],
      e: { q: 'O erro foi falta de atenção: vamos pedir mais cuidado.', y: 'Pedir atenção não impede o erro de voltar.', x: 'Mude o processo para o erro não ser possível.' },
      r: 'Poka-yoke tira o erro do alcance de quem trabalha.',
    },
    kanban: {
      o: ['Puxar a produção pela demanda', 'Usar sinais visuais para repor', 'Limitar o trabalho em andamento'],
      v: { t: 'Empurrado × puxado', s: 'Quem decide o que produzir?',
        a: { h: 'Empurrado', d: 'Produz pela previsão', u: ['Estoque alto', 'Risco de sobra'], c: 'Produzir 500 porque está no plano' },
        b: { h: 'Puxado (kanban)', d: 'Repõe só o consumido', u: ['Estoque controlado', 'Fluxo contínuo'], c: 'Repor quando o cartão chega' },
        r: 'No sistema puxado, a demanda manda.' },
      r: 'Kanban limita estoques e mostra os gargalos.',
    },
    oee: {
      o: ['Calcular o OEE', 'Separar disponibilidade, performance e qualidade', 'Achar onde está a maior perda'],
      f: ['OEE', 'Disponibilidade', '× Performance', '× Qualidade', '!OEE'],
      r: 'OEE é quanto do tempo planejado vira produção boa.',
    },
    smed: {
      o: ['Reduzir o tempo de setup', 'Separar atividades internas e externas', 'Converter atividades internas em externas'],
      f: ['SMED', 'observar o setup', '*separar internas e externas', 'converter', '!simplificar'],
      r: 'Tudo o que pode ser feito com a máquina rodando sai do setup.',
    },
    cep: {
      o: ['Separar variação comum de variação especial', 'Ler a carta de controle', 'Não reagir a cada ponto'],
      v: { t: 'Causa comum × causa especial', s: 'Duas variações, duas reações.',
        a: { h: 'Causa comum', d: 'Variação natural do processo', u: ['Muda só mudando o processo'], c: 'Pontos dentro dos limites, sem padrão' },
        b: { h: 'Causa especial', d: 'Evento fora do normal', u: ['Investigar e corrigir na hora'], c: 'Ponto fora dos limites' },
        r: 'Mexer no processo por causa comum aumenta a variação.' },
      r: 'A carta mostra quando agir e quando deixar o processo em paz.',
    },
    regras: {
      o: ['Aplicar as regras de sinais', 'Reconhecer tendências e sequências', 'Investigar só quando houver sinal'],
      e: { q: 'Todos os pontos estão dentro dos limites, então está tudo sob controle.', y: '8 pontos seguidos acima da média também indicam causa especial.', x: 'Confira as regras de padrão além dos limites.' },
      r: 'Padrões não aleatórios também são sinais.',
    },
    dmaic: {
      o: ['Conhecer as cinco fases do DMAIC', 'Saber o que entregar em cada fase', 'Diferenciar DMAIC e PDCA'],
      f: ['DMAIC', 'Definir', 'Medir', '*Analisar', 'Melhorar', '!Controlar'],
      r: 'DMAIC é a melhoria com dados, do problema ao controle.',
    },
    sigma: {
      o: ['Calcular DPMO e rendimento', 'Converter em nível sigma', 'Comparar processos diferentes'],
      r: 'DPMO = defeitos ÷ (unidades × oportunidades) × 1.000.000.',
    },
    cpk: {
      o: ['Calcular Cp e Cpk', 'Interpretar a capabilidade', 'Diferenciar processo centrado e descentrado'],
      v: { t: 'Cp × Cpk', s: 'Cabe na especificação e está no lugar certo?',
        a: { h: 'Cp', d: 'Só a largura: a variação cabe?', u: ['Potencial do processo'], c: 'Cp = (LSE − LIE) ÷ 6σ' },
        b: { h: 'Cpk', d: 'Largura e posição', u: ['Desempenho real'], c: 'Cpk = menor (LSE − x̄, x̄ − LIE) ÷ 3σ' },
        r: 'Cp alto e Cpk baixo: o processo está fora do centro.' },
      r: 'Cpk ≥ 1,33 costuma ser a meta mínima.',
    },
    fmea: {
      o: ['Antecipar modos de falha', 'Pontuar Severidade, Ocorrência e Detecção', 'Priorizar com o RPN e a severidade'],
      f: ['FMEA', 'modo de falha', 'efeito', 'causa', '*S × O × D', '!ação'],
      e: { q: 'RPN baixo, então podemos ignorar.', y: 'Uma falha com severidade 10 merece ação mesmo com RPN baixo.', x: 'Olhe primeiro a severidade alta, depois o RPN.' },
      r: 'FMEA trata a falha antes de ela acontecer.',
    },
    ctq: {
      o: ['Traduzir a voz do cliente em requisitos', 'Montar a árvore CTQ', 'Classificar requisitos com o modelo Kano'],
      f: ['Da voz do cliente ao CTQ', 'voz do cliente', 'necessidade', '*requisito mensurável', '!especificação'],
      r: '“Quero receber rápido” vira “entrega em até 3 dias úteis”.',
    },
    msa: {
      o: ['Avaliar o sistema de medição', 'Separar repetibilidade e reprodutibilidade', 'Saber quando confiar nos dados'],
      e: { q: 'Os números estão no sistema, então estão certos.', y: 'Se a medição varia muito, a análise inteira fica comprometida.', x: 'Faça o estudo R&R antes de analisar.' },
      r: 'Antes de analisar o processo, confie na régua.',
    },
    coq: {
      o: ['Somar os quatro grupos do custo da qualidade', 'Comparar prevenção e falhas', 'Argumentar investimentos em prevenção'],
      v: { t: 'Prevenção × falhas', s: 'Gastar antes ou pagar depois?',
        a: { h: 'Prevenção', d: 'Evita o defeito', u: ['Treinamento, FMEA, padrões'], c: 'R$ 80 mil na tabela de medidas' },
        b: { h: 'Falhas', d: 'Custo do defeito que aconteceu', u: ['Retrabalho, devoluções, multas'], c: 'R$ 300 mil por ano em devoluções' },
        r: 'Cada real em prevenção economiza vários em falhas.' },
      r: 'Qualidade barata é a que previne.',
    },
    iso: {
      o: ['Conhecer a ISO 9001 e seus princípios', 'Entender a abordagem por processos', 'Preparar-se para auditorias'],
      r: 'A ISO 9001 organiza a gestão; o resultado depende de quem a pratica.',
    },
    hoshin: {
      o: ['Desdobrar objetivos estratégicos em metas', 'Usar o catchball entre níveis', 'Conectar metas e projetos na matriz X'],
      f: ['Desdobramento', 'objetivo estratégico', 'meta anual', '*projetos', '!indicadores'],
      r: 'Cada meta local deve se ligar a um objetivo da empresa.',
    },
    final: {
      o: ['Juntar ferramentas num sistema de melhoria', 'Escolher a ferramenta certa para cada etapa', 'Sustentar os resultados'],
      f: ['Sistema de melhoria', 'indicadores', 'Pareto', 'causas', 'ações', '*verificação', '!padrão'],
      r: 'Ferramentas resolvem problemas; o sistema mantém os resultados.',
    },
  });
})(typeof window !== 'undefined' ? window : globalThis);
