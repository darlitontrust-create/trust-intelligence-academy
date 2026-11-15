/* =====================================================================
   plus-cl.js — Blocos extras das aulas da trilha Claude
   ===================================================================== */
(function (global) {
  'use strict';
  global.Lessons.addPlus('claude', {
    llm: {
      o: ['Explicar como um modelo de linguagem gera respostas', 'Reconhecer pontos fortes e limites', 'Assumir a responsabilidade pelo uso'],
      u: ['Escrever e revisar', 'Resumir e explicar', 'Analisar e programar'],
      e: { q: 'Se o Claude respondeu com segurança, está certo.', y: 'Confiança no texto não é garantia de precisão.', x: 'Confira fatos, números e citações na fonte.' },
      r: 'Ótimo parceiro de trabalho; a revisão continua sendo sua.',
    },
    modelos: {
      o: ['Distinguir as famílias Opus, Sonnet e Haiku', 'Escolher pelo que a tarefa exige', 'Testar em amostra antes de escalar'],
      v: { t: 'Modelo maior × modelo rápido', s: 'Capacidade ou volume?',
        a: { h: 'Mais capaz', d: 'Raciocínio complexo', u: ['Arquitetura de dados', 'Contratos longos'], c: 'Analisar cláusulas interligadas.' },
        b: { h: 'Mais rápido', d: 'Volume e tarefas simples', u: ['Classificação em massa', 'Extração'], c: 'Classificar 50 mil comentários.' },
        r: 'Teste o menor; suba só se a qualidade pedir.' },
      r: 'O melhor modelo é o adequado à tarefa.',
    },
    contexto: {
      o: ['Entender a janela de contexto e os tokens', 'Fornecer contexto focado', 'Saber quando recomeçar a conversa'],
      e: { q: 'Quanto mais contexto, melhor.', y: 'Contexto demais dilui o que importa.', x: 'Selecione o relevante e organize com clareza.' },
      r: 'Contexto relevante vale mais que contexto máximo.',
    },
    clareza: {
      o: ['Escrever para um colega que não conhece o contexto', 'Usar instruções positivas e limites concretos', 'Explicar o porquê das regras'],
      f: ['Estrutura do pedido', 'contexto', 'material', '*tarefa', 'formato', '!critérios'],
      v: { t: 'Pedido vago × pedido claro', s: 'O mesmo e-mail, dois resultados.',
        a: { h: 'Vago', d: 'O modelo adivinha', u: ['Brainstorm sem compromisso', 'Primeiras ideias'], c: '“Escreva um e-mail sobre outubro.”' },
        b: { h: 'Claro', d: 'Público, dados, tamanho e tom', u: ['Pronto para usar', 'Menos retrabalho'], c: '“Para a diretora, 120 palavras, com vendas e recomendação.”' },
        r: 'Diga o que um colega novo precisaria saber.' },
      r: 'Clareza é dar o contexto que só você tem.',
    },
    exemplos: {
      o: ['Usar exemplos variados (few-shot)', 'Definir o formato da saída', 'Escolher o formato pelo uso'],
      e: { q: 'Descrever o estilo basta.', y: 'Descrições são interpretadas de vários jeitos.', x: 'Mostre 2 ou 3 exemplos variados.' },
      r: 'Mostre, não só descreva.',
    },
    xml: {
      o: ['Separar partes do prompt com tags', 'Nomear tags com consistência', 'Atribuir papéis específicos'],
      e: { q: 'Existem tags oficiais obrigatórias.', y: 'Não há nomes obrigatórios.', x: 'Use nomes claros, consistentes e cite-os nas instruções.' },
      r: 'Cada parte na sua seção; cada pedido com o seu papel.',
    },
    escrita: {
      o: ['Transformar anotações em textos organizados', 'Revisar mantendo a própria voz', 'Adaptar o texto ao público'],
      f: ['Do rascunho ao envio', 'objetivo', 'rascunho', '*conferir fatos', 'ajustar tom', '!ler e enviar'],
      r: 'O Claude edita; você assina.',
    },
    documentos: {
      o: ['Pedir resumos com público e foco', 'Exigir citações dos trechos', 'Respeitar a confidencialidade'],
      e: { q: 'Basta pedir “resuma” para um relatório de 40 páginas.', y: 'Sem foco, o resumo não serve a ninguém.', x: 'Diga para quem é, quantos pontos e peça a página de cada um.' },
      r: 'Resumo útil é focado e rastreável.',
    },
    verificacao: {
      o: ['Reconhecer alucinações', 'Aplicar práticas que as reduzem', 'Calibrar a conferência pelo impacto'],
      f: ['Resposta confiável', 'fonte', 'permitir “não sei”', '*citar trechos', '!conferir o que tem impacto'],
      e: { q: 'Pedir para o modelo ter mais certeza reduz erros.', y: 'Confiança no tom não aumenta a precisão.', x: 'Dê a fonte, permita “não sei” e confira.' },
      r: 'Plausível não é verdadeiro: confira o que importa.',
    },
    projetos: {
      o: ['Criar Projetos com instruções e conhecimento', 'Manter um Projeto por tema', 'Atualizar e compartilhar com cuidado'],
      u: ['Relatórios recorrentes', 'Base de políticas internas', 'Planejamento de um tema'],
      r: 'Contexto que permanece entre conversas.',
    },
    artefatos: {
      o: ['Reconhecer o que deve virar artefato', 'Iterar com pedidos específicos', 'Testar antes de compartilhar'],
      v: { t: 'Artefato × resposta', s: 'Entrega ou explicação?',
        a: { h: 'Artefato', d: 'Será reutilizado ou compartilhado', u: ['Calculadoras', 'Painéis', 'Documentos'], c: 'Calculadora de margem para 30 vendedores.' },
        b: { h: 'Resposta', d: 'Dúvida pontual', u: ['Explicações', 'Perguntas rápidas'], c: 'Diferença entre média e mediana.' },
        r: 'O que vai ser usado de novo vira artefato.' },
      r: 'Artefatos são entregas; teste antes de entregar.',
    },
    memoria: {
      o: ['Configurar preferências e estilos', 'Controlar a memória', 'Registrar cada informação no lugar certo'],
      e: { q: 'Posso guardar dados de colegas na memória para análises futuras.', y: 'Dados sensíveis de pessoas exigem cuidado redobrado.', x: 'Use dados anonimizados e siga a política da empresa.' },
      r: 'Preferências para você, Projeto para o tema, conversa para hoje.',
    },
    analise: {
      o: ['Pedir análises executadas com código', 'Diagnosticar a qualidade dos dados', 'Definir métricas explicitamente'],
      f: ['Roteiro de análise', 'objetivo', 'diagnóstico', '*definições', 'execução', '!conferência'],
      e: { q: 'Para arquivos grandes, uma estimativa basta.', y: 'Estimativas erram e não são auditáveis.', x: 'Peça análise com código executado sobre o arquivo.' },
      r: 'Números calculados, definidos e conferidos.',
    },
    sqldax: {
      o: ['Informar o esquema real ao pedir código', 'Testar com números conhecidos', 'Usar o Claude como tutor'],
      e: { c: 'Vendas LY = CALCULATE([Vendas], SAMEPERIODLASTYEAR(Calendario[Data]))', m: 'Tabela Calendario não existe no modelo (o nome é dCalendario)', y: 'O Claude não conhecia o seu modelo.', x: 'Informe tabelas, colunas e relacionamentos.' },
      r: 'Código bom começa pelo esquema certo.',
    },
    graficos: {
      o: ['Pedir gráficos com tipo, mensagem e destaque', 'Conferir variações percentuais', 'Padronizar relatórios recorrentes'],
      r: 'Gráfico com mensagem; relatório com conclusão.',
    },
    pesquisa: {
      o: ['Usar pesquisa para informação atual', 'Escrever perguntas de pesquisa com recorte', 'Avaliar e registrar fontes'],
      f: ['Pesquisa de mercado', 'pergunta', 'buscar', '*conferir fontes', 'sintetizar', '!registrar'],
      r: 'Pergunta precisa, fontes conferidas.',
    },
    conectores: {
      o: ['Entender conectores e MCP', 'Aplicar o mínimo privilégio', 'Proteger-se de injeção de instruções'],
      e: { q: 'Se o documento diz para enviar os arquivos, o assistente deve obedecer.', y: 'Conteúdo externo pode conter instruções maliciosas.', x: 'Trate conteúdo de terceiros como dado e revise ações sensíveis.' },
      r: 'Acesso mínimo, ações revisadas.',
    },
    skills: {
      o: ['Empacotar procedimentos em skills', 'Escrever descrições que acionam a skill', 'Escolher entre skill, Projeto e prompt'],
      v: { t: 'Skill × Projeto', s: 'Procedimento ou conhecimento?',
        a: { h: 'Skill', d: 'Como fazer uma tarefa', u: ['Relatório padrão', 'Checagem de qualidade'], c: 'Passos do relatório semanal.' },
        b: { h: 'Projeto', d: 'Conhecimento sobre um tema', u: ['Política comercial', 'Documentos de planejamento'], c: 'Glossário e modelos da área.' },
        r: 'Skill ensina a fazer; Projeto dá o contexto.' },
      r: 'Procedimento repetido vira skill.',
    },
    raciocinio: {
      o: ['Saber quando pedir raciocínio passo a passo', 'Separar análise e resposta', 'Auditar premissas'],
      e: { q: 'Roteiros rígidos de raciocínio sempre funcionam melhor.', y: 'Instruções gerais muitas vezes rendem mais.', x: 'Teste as duas formas e compare.' },
      r: 'Mostre a conta, confira as premissas.',
    },
    encadear: {
      o: ['Dividir tarefas em etapas', 'Passar saídas estruturadas entre etapas', 'Isolar a etapa com problema'],
      f: ['Cadeia', 'extrair', 'classificar', '*resumir', 'recomendar', '!revisar'],
      r: 'Uma etapa, um foco.',
    },
    avaliacao: {
      o: ['Montar conjuntos de teste com gabarito', 'Medir a taxa de acerto', 'Comparar versões e modelos'],
      e: { q: 'Testei com 3 exemplos e funcionou.', y: 'Poucos casos fáceis escondem os erros reais.', x: 'Use um conjunto variado com casos difíceis e de borda.' },
      r: 'O que não se mede não se melhora.',
    },
    claudecode: {
      o: ['Entender o que o Claude Code faz', 'Escrever pedidos com escopo e verificação', 'Revisar o diff antes de aceitar'],
      f: ['Fluxo de uma tarefa', 'explicar', 'explorar', '*planejar', 'editar e testar', '!revisar o diff'],
      r: 'O agente faz; os testes provam; você aprova.',
    },
    claudemd: {
      o: ['Escrever um bom CLAUDE.md', 'Escolher o modo de permissão adequado', 'Usar o plan mode em mudanças grandes'],
      e: { q: 'Pular confirmações no computador de trabalho só acelera.', y: 'Um erro pode apagar arquivos ou rodar comandos indevidos.', x: 'Use regras de permissão específicas; sem confirmações só em ambiente isolado.' },
      r: 'Contexto no CLAUDE.md, controle nas permissões.',
    },
    extensoes: {
      o: ['Escolher entre skill, hook, subagente, MCP e plugin', 'Garantir regras obrigatórias com hooks', 'Instalar extensões confiáveis'],
      v: { t: 'Instrução × hook', s: 'Pedir ou garantir?',
        a: { h: 'Instrução (CLAUDE.md)', d: 'Orienta o agente', u: ['Convenções', 'Preferências'], c: '“Rode o linter depois de editar.”' },
        b: { h: 'Hook', d: 'Executa sempre, automaticamente', u: ['Formatação', 'Verificações obrigatórias'], c: 'Linter roda a cada edição, sem exceção.' },
        r: 'O que precisa acontecer sempre vira hook.' },
      r: 'Cada extensão resolve um tipo de necessidade.',
    },
    api: {
      o: ['Montar uma chamada à Messages API', 'Separar system prompt e mensagens', 'Proteger a chave e tratar falhas'],
      e: { c: 'client = anthropic.Anthropic(api_key="sk-ant-...")', m: 'Chave da API escrita no código do repositório', y: 'Qualquer pessoa com acesso ao código pode usá-la.', x: 'Revogue a chave e use variável de ambiente ou cofre.' },
      r: 'System para as regras; mensagens para o caso.',
    },
    ferramentas: {
      o: ['Explicar o ciclo de tool use', 'Escrever boas descrições de ferramentas', 'Aplicar segurança a agentes'],
      f: ['Ciclo da ferramenta', 'definir', 'modelo pede', '*seu código executa', 'devolve o resultado', '!resposta final'],
      r: 'O modelo pede, o seu código executa.',
    },
    custos: {
      o: ['Calcular custos por tokens', 'Usar cache de prompt e lotes', 'Reduzir dados enviados'],
      e: { q: 'Só os tokens de entrada são cobrados.', y: 'A saída também é cobrada, geralmente a um preço maior.', x: 'Some entrada e saída, cada uma pelo seu preço.' },
      r: 'Medir tokens, cachear o que repete, agrupar o que espera.',
    },
  });
})(window);
