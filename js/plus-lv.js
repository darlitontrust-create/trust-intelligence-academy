/* =====================================================================
   plus-lv.js — Blocos extras das aulas da trilha Lovable
   ===================================================================== */
(function (global) {
  'use strict';
  global.Lessons.addPlus('lovable', {
    oque: {
      o: ['Explicar o que o Lovable faz e o que gera', 'Reconhecer bons usos e usos que pedem cuidado', 'Assumir a responsabilidade pelo app construído'],
      u: ['Protótipos para validar ideias', 'Ferramentas internas', 'Portais simples para parceiros'],
      e: { q: 'Com IA, ninguém precisa entender nada do app que publica.', y: 'A IA escreve o código, mas não decide o negócio nem garante segurança.', x: 'Você define o que construir, testa e cuida de dados e privacidade.' },
      r: 'Você descreve, o Lovable constrói; a responsabilidade continua sua.',
    },
    modos: {
      o: ['Diferenciar Plan e Build', 'Planejar mudanças grandes antes de construir', 'Investigar erros sem risco'],
      f: ['Ciclo de uma funcionalidade', 'Plan', 'ajustar o plano', '*aprovar', 'Build', '!testar'],
      v: { t: 'Plan × Build', s: 'Pensar ou executar?',
        a: { h: 'Plan', d: 'Discute, investiga e propõe um plano', u: ['Funcionalidades grandes', 'Investigar erros'], c: '“Proponha as tabelas dos chamados, sem mudar o código.”' },
        b: { h: 'Build', d: 'Escreve e altera o código, e verifica', u: ['Tarefas claras', 'Planos aprovados'], c: '“Implemente o plano aprovado.”' },
        r: 'Dúvida ou mudança grande? Comece no Plan.' },
      e: { q: 'É mais rápido pedir tudo direto no Build e ir corrigindo.', y: 'Desfazer código custa mais do que ajustar um plano.', x: 'Planeje no Plan e só aprove quando o plano estiver certo.' },
      r: 'Plan para decidir, Build para executar.',
    },
    publicar: {
      o: ['Diferenciar prévia e app publicado', 'Restaurar versões quando algo quebra', 'Testar o publicado antes de divulgar'],
      f: ['Antes de divulgar', 'testar na prévia', 'revisar', '*publicar', 'testar o publicado', '!divulgar'],
      e: { q: 'Mudei na prévia, então o lojista já está vendo.', y: 'O link público só muda quando você publica de novo.', x: 'Publique (ou atualize a publicação) e confira no link.' },
      r: 'A prévia é o ensaio; a publicação é a estreia.',
    },
    prompt: {
      o: ['Escrever prompts com contexto, conteúdo e comportamento', 'Definir critério de aceite', 'Dizer o que não deve mudar'],
      v: { t: 'Prompt vago × prompt claro', s: 'O mesmo pedido, dois resultados.',
        a: { h: 'Vago', d: 'A IA precisa adivinhar', u: ['Explorar ideias soltas', 'Quando qualquer resultado serve'], c: '“Faça uma tela de pedidos.”' },
        b: { h: 'Claro', d: 'Conteúdo, ações e aceite', u: ['Resultado previsível', 'Menos créditos'], c: '“Tabela com nº, data, valor e status; filtro por status; clique abre o detalhe.”' },
        r: 'Diga o resultado esperado, não só o assunto.' },
      e: { q: 'Prompt bom é prompt longo.', y: 'Tamanho só ajuda quando acrescenta informação útil.', x: 'Seja específico: contexto, conteúdo, comportamento, regras e aceite.' },
      r: 'Prompt claro = resultado previsível.',
    },
    incremental: {
      o: ['Construir em passos pequenos e testados', 'Definir a ordem do MVP', 'Reconhecer quando replanejar'],
      f: ['Ordem do MVP', 'páginas', '*login', 'pedidos', 'filtros', '!chamados'],
      e: { q: 'Um prompt gigante economiza mensagens.', y: 'Muitos requisitos juntos geram muitos erros juntos.', x: 'Um passo por vez, testando entre eles.' },
      r: 'Pequeno, testado, próximo.',
    },
    knowledge: {
      o: ['Usar imagens e referências para dar precisão', 'Registrar instruções persistentes na Knowledge', 'Separar knowledge do workspace e do projeto'],
      v: { t: 'Knowledge × mensagem', s: 'Onde colocar cada instrução?',
        a: { h: 'Knowledge', d: 'Vale em todos os pedidos', u: ['Contexto do produto', 'Padrões de design e texto'], c: 'Valores em R$ com 2 casas; datas dd/mm/aaaa.' },
        b: { h: 'Mensagem', d: 'Vale para este pedido', u: ['Ajuste pontual', 'Bug de hoje'], c: 'O filtro por status não mostra “Atrasado”.' },
        r: 'O que vale sempre vai para a Knowledge; segredos, nunca.' },
      r: 'Mostre com imagens; registre o que vale sempre.',
    },
    layout: {
      o: ['Organizar o mapa de páginas', 'Priorizar o topo da tela', 'Pedir os quatro estados de cada tela'],
      e: { q: 'Tela vazia é normal quando não há dados.', y: 'Sem explicação, parece defeito.', x: 'Peça um estado vazio com mensagem e próximo passo.' },
      r: 'Poucas páginas, menu igual e estados previstos.',
    },
    design: {
      o: ['Montar um design system', 'Escolher entre edição visual e prompt', 'Usar destaque com intenção'],
      v: { t: 'Edição visual × prompt', s: 'Onde fazer cada ajuste?',
        a: { h: 'Edição visual', d: 'Aparência pontual', u: ['Texto de botão', 'Espaçamento', 'Cor de ícone'], c: 'Trocar “Enviar” por “Abrir chamado”.' },
        b: { h: 'Prompt', d: 'Comportamento e dados', u: ['Filtros', 'Regras', 'Alertas'], c: 'Alerta quando o pedido atrasar.' },
        r: 'Aparência na edição visual; comportamento no prompt.' },
      r: 'Decisões visuais num lugar só; destaque só no que pede ação.',
    },
    responsivo: {
      o: ['Adaptar tabelas para o celular', 'Aplicar o checklist de acessibilidade', 'Não depender só de cor'],
      e: { q: 'Se coube na tela do computador, cabe no celular.', y: 'Tabelas largas e botões pequenos falham no toque.', x: 'Teste no tamanho de celular e num aparelho real.' },
      r: 'Celular primeiro e acessível para todos.',
    },
    banco: {
      o: ['Entender quando o app precisa de banco', 'Pedir tabelas com campos e valores', 'Conferir dados no painel do Cloud'],
      u: ['Pedidos e chamados', 'Cadastros de lojas', 'Histórico de mensagens'],
      e: { q: 'Posso deixar os dados de exemplo no código.', y: 'Eles não persistem nem são compartilhados.', x: 'Dados do negócio vão para o banco do Lovable Cloud.' },
      r: 'Dados que importam moram no banco.',
    },
    relacoes: {
      o: ['Modelar um para muitos', 'Criar tabelas de ligação', 'Restringir valores permitidos'],
      f: ['Modelagem', 'entidades', 'campos', '*ligações', 'revisar no Plan', '!criar'],
      e: { q: 'Repetir os dados da loja em cada pedido facilita.', y: 'Quando a loja muda, os dados ficam inconsistentes.', x: 'Guarde só o loja_id e ligue as tabelas.' },
      r: 'Guarde uma vez e ligue pela chave.',
    },
    crud: {
      o: ['Descrever as quatro operações de uma tela', 'Preferir arquivar a excluir', 'Pedir paginação em listas grandes'],
      e: { q: 'Excluir chamados antigos deixa o sistema limpo.', y: 'Perde-se o histórico para auditoria.', x: 'Arquive e esconda da lista principal.' },
      r: 'Criar, ler, atualizar e (com cuidado) excluir.',
    },
    login: {
      o: ['Escolher formas de autenticação', 'Controlar quem pode se cadastrar', 'Proteger as páginas internas'],
      f: ['Entrada de um lojista', 'convite', 'conta', 'e-mail confirmado', '*vínculo com a loja', '!dados da loja'],
      e: { q: 'Esconder o link já protege o portal.', y: 'Qualquer um que descobrir o link entra.', x: 'Cadastro por convite e páginas que exigem login.' },
      r: 'Saber quem é antes de mostrar qualquer dado.',
    },
    rls: {
      o: ['Entender por que filtro na tela não é segurança', 'Escrever regras de acesso por linha', 'Testar como atacante'],
      v: { t: 'Filtro na tela × RLS', s: 'Esconder ou proteger?',
        a: { h: 'Filtro na tela', d: 'Conveniência para o usuário', u: ['Mostrar só o relevante'], c: 'A lista mostra só a loja do usuário.' },
        b: { h: 'RLS no banco', d: 'Proteção para qualquer acesso', u: ['Isolar lojas', 'Papéis de admin'], c: 'O banco só devolve linhas da loja do usuário.' },
        r: 'A cortina esconde; a fechadura protege.' },
      r: 'Segurança mora no banco, não na tela.',
    },
    segredos: {
      o: ['Guardar chaves nos segredos', 'Usar funções no servidor', 'Reagir a uma chave vazada'],
      e: { c: 'const API_KEY = "sk_live_..."', m: 'Chave secreta escrita no código da página', y: 'Tudo o que roda no navegador pode ser visto.', x: 'Guarde nos segredos e use só numa função de servidor.' },
      r: 'Chave no servidor; no navegador, só o resultado.',
    },
    formularios: {
      o: ['Validar na tela e no servidor', 'Escrever mensagens de erro úteis', 'Coletar só o necessário'],
      e: { q: 'Validar na tela já garante os dados.', y: 'A tela pode ser burlada.', x: 'Valide também no servidor ou no banco.' },
      r: 'Orientar na tela, garantir no servidor.',
    },
    arquivos: {
      o: ['Separar arquivos (storage) e referências (banco)', 'Definir tipos, tamanho e retenção', 'Manter anexos privados'],
      e: { q: 'Anexos podem ficar públicos, ninguém adivinha o link.', y: 'Links vazam e são compartilhados.', x: 'Armazenamento privado com links temporários.' },
      r: 'Arquivo no storage, referência no banco.',
    },
    integracoes: {
      o: ['Disparar ações no servidor a partir de eventos', 'Integrar APIs com credenciais protegidas', 'Usar provedores de pagamento'],
      f: ['Integração', 'evento no app', '*função no servidor', 'serviço externo', '!resposta ao usuário'],
      e: { q: 'Posso guardar o cartão criptografado no meu banco.', y: 'Dados de cartão exigem padrões rígidos de segurança.', x: 'Use um provedor de pagamentos especializado.' },
      r: 'Evento → servidor → serviço, com segredos protegidos.',
    },
    erros: {
      o: ['Escrever um bom relato de bug', 'Encontrar mensagens no console e nos logs', 'Seguir o método de correção'],
      f: ['Correção com método', 'reproduzir', 'coletar', '*investigar no Plan', 'corrigir', '!retestar'],
      e: { q: '“Não funciona, conserte” é suficiente.', y: 'Sem evidência, a IA chuta a causa.', x: 'Passos, esperado, ocorrido, mensagem e dispositivo.' },
      r: 'Evidência leva à causa; a causa leva à correção.',
    },
    versoes: {
      o: ['Marcar versões estáveis', 'Experimentar em drafts', 'Separar ambientes de teste e produção'],
      e: { q: 'Restaurar a versão desfaz tudo, inclusive o banco.', y: 'Mudanças já aplicadas no banco continuam.', x: 'Planeje mudanças de estrutura com cuidado.' },
      r: 'Salve o jogo antes do chefão.',
    },
    loops: {
      o: ['Reconhecer um loop de correção', 'Mudar a abordagem com hipóteses e exemplos', 'Saber quando escalar'],
      e: { q: 'Se eu repetir o pedido, uma hora funciona.', y: 'Mesmo pedido, mesmo resultado.', x: 'Volte ao Plan, dê contexto novo e peça hipóteses.' },
      r: 'Pare, investigue, mude a abordagem.',
    },
    github: {
      o: ['Conectar o projeto ao GitHub', 'Combinar regras de edição em equipe', 'Usar a IA para explicar o código'],
      e: { q: 'Com o GitHub, não preciso mais testar.', y: 'Versionar não é validar.', x: 'Revisão e testes continuam obrigatórios.' },
      r: 'Código versionado, revisado e da empresa.',
    },
    equipe: {
      o: ['Manter a Knowledge como manual do projeto', 'Definir um responsável pelo produto', 'Rodar uma rotina curta de evolução'],
      r: 'Ferramenta rápida pede governança.',
    },
    creditos: {
      o: ['Medir o consumo por tipo de mensagem', 'Identificar desperdício', 'Reduzir retrabalho'],
      e: { q: 'Gastar menos créditos é mandar menos mensagens.', y: 'O que mais gasta é o retrabalho.', x: 'Planeje e escreva pedidos claros.' },
      r: 'O melhor desconto é o retrabalho evitado.',
    },
    dominio: {
      o: ['Conectar um domínio próprio', 'Configurar o compartilhamento de páginas públicas', 'Manter áreas internas fora da busca'],
      f: ['Lançamento', 'testar', 'publicar', '*conferir domínio e login', 'comunicar', '!monitorar'],
      r: 'Endereço próprio, vitrine pública, área interna protegida.',
    },
    qualidade: {
      o: ['Classificar problemas por gravidade', 'Manter testes de regressão', 'Monitorar e ter backup testado'],
      e: { q: 'O histórico de versões já é meu backup.', y: 'Ele guarda código, não dados.', x: 'Tenha cópias dos dados e teste a restauração.' },
      r: 'Checklist curto, sempre igual e inegociável.',
    },
    produto: {
      o: ['Calcular conversões de um funil', 'Atacar a etapa de maior perda', 'Aplicar a LGPD ao produto'],
      e: { q: 'Dados de representantes de empresas não são pessoais.', y: 'Nome, e-mail e telefone identificam uma pessoa.', x: 'Aplique finalidade, minimização, segurança e direitos do titular.' },
      r: 'Métricas guiam; privacidade faz parte do produto.',
    },
  });
})(window);
