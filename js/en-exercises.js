/* =====================================================================
   en-exercises.js — 150 exercícios da trilha de Inglês (50 por nível)
   ---------------------------------------------------------------------
   Tipos (kind):
     choice    → escolha a melhor resposta/frase (opts[0] é a correta)
     fill      → complete a lacuna ___ (a = respostas aceitas)
     build     → monte a frase com as palavras (a = frase; alt = outras
                 ordens aceitas; xw = palavras extras que não entram)
     listen    → ouça (say) e escolha (opts[0] é a correta)
     dictation → ouça (say) e escreva o que ouviu (alt = variações)
     order     → coloque as falas do diálogo em ordem (items na ordem certa)
     classify  → classifique cada frase (items: [texto, categoria])
   Campos: t tópico · n título · s cenário · g missão · x explicação ·
           h dica · w motivo de cada opção errada · sp frase para praticar
           em voz alta. Texto entre ⟦ ⟧ é inglês.
   A correção ignora maiúsculas, pontuação e contrações (I'm = I am).
   ===================================================================== */
(function (global) {
  'use strict';
  const C = function (t, n, s, g, opts, x, o) { return Object.assign({ kind: 'choice', t: t, n: n, s: s, g: g, opts: opts, x: x }, o || {}); };
  const F = function (t, n, s, g, q, a, x, o) { return Object.assign({ kind: 'fill', t: t, n: n, s: s, g: g, q: q, a: [].concat(a), x: x }, o || {}); };
  const B = function (t, n, s, g, a, x, o) { return Object.assign({ kind: 'build', t: t, n: n, s: s, g: g, a: a, x: x }, o || {}); };
  const H = function (t, n, s, g, say, opts, x, o) { return Object.assign({ kind: 'listen', t: t, n: n, s: s, g: g, say: say, opts: opts, x: x }, o || {}); };
  const D = function (t, n, s, g, say, x, o) { return Object.assign({ kind: 'dictation', t: t, n: n, s: s, g: g, say: say, x: x }, o || {}); };
  const O = function (t, n, s, g, items, x, o) { return Object.assign({ kind: 'order', t: t, n: n, s: s, g: g, items: items, x: x }, o || {}); };
  const K = function (t, n, s, g, cats, items, x, o) { return Object.assign({ kind: 'classify', t: t, n: n, s: s, g: g, cats: cats, items: items, x: x }, o || {}); };

  /* ======================= NÍVEL 1 · DIA A DIA ======================= */
  const iniciante = [
    // Cumprimentos
    C("Cumprimentos", "Primeiro dia no curso", "Uma colega nova se aproxima e diz: ⟦Hi! I'm Emma.⟧", "Escolha a melhor resposta.",
      ["⟦Hi, Emma! I'm Lucas. Nice to meet you.⟧", "⟦Good night, Emma.⟧", "⟦I have Lucas.⟧", "⟦Nice to see you again, Emma.⟧"],
      "Responda o cumprimento, diga seu nome e use ⟦Nice to meet you⟧, que é para o primeiro encontro.", { w: ["⟦Good night⟧ é despedida.", "Para dizer o nome, use ⟦I'm⟧, não ⟦I have⟧.", "⟦Nice to see you again⟧ é para quem você já conhece."], sp: "Hi, Emma! I'm Lucas. Nice to meet you." }),
    H("Cumprimentos", "Ouça o cumprimento", "Você entra numa loja às 10 da manhã e o atendente fala com você.", "Ouça e escolha o que ele disse.", "Good morning! How are you today?",
      ["Bom dia! Como você está hoje?", "Boa noite! Como foi o seu dia?", "Boa tarde! Posso ajudar?", "Bom dia! Você é novo aqui?"],
      "⟦Good morning⟧ = bom dia; ⟦How are you today?⟧ = como você está hoje?", { h: "Preste atenção na primeira palavra depois de ⟦Good⟧." }),
    B("Cumprimentos", "Devolvendo a pergunta", "Alguém pergunta ⟦How are you?⟧. Você quer dizer que está bem e devolver a pergunta.", "Monte a resposta: “Estou bem, obrigado. E você?”", "I'm fine, thanks. And you?",
      "A resposta padrão tem três partes: como você está, agradecimento e a pergunta de volta.", { alt: ["I'm fine thanks and you"], xw: ["have"] }),
    O("Cumprimentos", "Conversa na recepção", "Você conhece um colega na recepção de um evento.", "Coloque as falas na ordem natural da conversa.",
      ["⟦Hi! I'm Tom.⟧", "⟦Hi, Tom. I'm Bia. Nice to meet you.⟧", "⟦Nice to meet you too. Where are you from?⟧", "⟦I'm from Brazil. And you?⟧", "⟦I'm from Canada.⟧"],
      "Cumprimento → apresentação → ⟦Nice to meet you too⟧ → pergunta → resposta."),
    // Verbo to be
    F("Verbo to be", "Apresentando a colega", "Você apresenta sua colega de trabalho para um cliente.", "Complete com a forma certa do verbo ⟦to be⟧.", "This is Carla. She ___ our sales manager.", ["is", "'s"],
      "Com ⟦she⟧, o verbo ⟦to be⟧ é ⟦is⟧.", { h: "Ele/ela → ⟦is⟧." }),
    C("Verbo to be", "Quantos anos?", "Um colega estrangeiro pergunta a sua idade.", "Qual frase está correta?",
      ["⟦I'm 28 years old.⟧", "⟦I have 28 years.⟧", "⟦I have 28 years old.⟧", "⟦I'm have 28.⟧"],
      "Idade em inglês usa o verbo ⟦to be⟧: ⟦I'm 28⟧ ou ⟦I'm 28 years old⟧.", { w: ["Tradução literal do português.", "Mistura dois erros: ⟦have⟧ e ⟦old⟧.", "Não se usa ⟦I'm⟧ junto com ⟦have⟧."] }),
    B("Verbo to be", "De onde você é?", "Você quer perguntar a origem de uma pessoa que acabou de conhecer.", "Monte a pergunta: “De onde você é?”", "Where are you from?",
      "Pergunta com ⟦to be⟧: palavra interrogativa + verbo + sujeito. A preposição ⟦from⟧ fica no final.", { xw: ["do", "is"] }),
    F("Verbo to be", "Negando com educação", "Perguntam se você é o gerente. Você não é.", "Complete a resposta curta negativa.", "Are you the manager? — No, I'm ___.", ["not"],
      "Negativa com ⟦I'm⟧: ⟦I'm not⟧. Não existe “I amn't”."),
    // Números e preços
    H("Números e preços", "Quanto custa?", "Na feira, você pergunta o preço das maçãs.", "Ouça a resposta do vendedor e escolha o preço.", "They're three fifty a pound.",
      ["US$ 3,50 a libra", "US$ 3,15 a libra", "US$ 3,50 o quilo", "US$ 350 a libra"],
      "⟦three fifty⟧ = 3,50. ⟦a pound⟧ = por libra (medida de peso nos EUA).", { h: "Preços são falados em dois blocos." }),
    C("Números e preços", "Perguntando o preço", "Você quer saber o preço de um boné.", "Qual pergunta está correta?",
      ["⟦How much is this cap?⟧", "⟦How many is this cap?⟧", "⟦How much costs this cap?⟧", "⟦What price have this cap?⟧"],
      "Preço: ⟦How much is…?⟧ (uma coisa) ou ⟦How much are…?⟧ (várias).", { w: ["⟦How many⟧ conta quantidades.", "Com ⟦cost⟧: ⟦How much does it cost?⟧", "Estrutura do português traduzida."], sp: "How much is this cap?" }),
    D("Números e preços", "Anotando o telefone", "Um fornecedor dita o número de telefone dele.", "Ouça e escreva o número só com algarismos (sem traços).", "five five five, oh one nine two",
      "O zero é dito como ⟦oh⟧ em números de telefone: 555-0192.", { alt: ["5550192", "555 0192", "555-0192"], digits: "5550192", h: "⟦oh⟧ = zero." }),
    F("Números e preços", "Quantos?", "Você pergunta quantos ingressos ainda restam.", "Complete com ⟦much⟧ ou ⟦many⟧.", "How ___ tickets are left?", ["many"],
      "⟦tickets⟧ são contáveis: ⟦How many⟧."),
    // Horas e datas
    H("Horas e datas", "Que horas são?", "Você pergunta as horas para alguém na estação.", "Ouça e escolha o horário.", "It's a quarter past six.",
      ["6h15", "5h45", "6h45", "6h30"],
      "⟦a quarter past six⟧ = seis e quinze. ⟦a quarter to six⟧ seria 5h45.", { h: "⟦past⟧ = depois da hora; ⟦to⟧ = antes." }),
    F("Horas e datas", "Marcando a reunião", "Você confirma o dia da reunião com um cliente.", "Complete com a preposição correta.", "The meeting is ___ Thursday.", ["on"],
      "Dias da semana usam ⟦on⟧."),
    F("Horas e datas", "Horário do voo", "Você avisa o horário do seu voo.", "Complete com a preposição correta.", "My flight leaves ___ 7:40 p.m.", ["at"],
      "Horário exato usa ⟦at⟧."),
    K("Horas e datas", "in, on ou at?", "Você está organizando a agenda do mês.", "Classifique cada expressão pela preposição que ela usa.", ["in", "on", "at"],
      [["July", 0], ["Monday", 1], ["9 o'clock", 2], ["2026", 0], ["my birthday", 1], ["noon", 2], ["the morning", 0], ["the weekend (EUA)", 1]],
      "⟦in⟧: meses, anos, partes do dia. ⟦on⟧: dias e datas. ⟦at⟧: horários e pontos exatos. Nos EUA se diz ⟦on the weekend⟧; no Reino Unido, ⟦at the weekend⟧."),
    // Rotina
    F("Rotina", "A rotina da sua chefe", "Você conta a rotina da sua chefe para um colega.", "Complete com o verbo ⟦work⟧ na forma certa.", "She ___ from home on Fridays.", ["works"],
      "Terceira pessoa do singular (⟦she⟧) leva ⟦-s⟧ no presente simples."),
    C("Rotina", "Perguntando o hábito", "Você quer saber se o colega toma café de manhã.", "Qual pergunta está correta?",
      ["⟦Do you have breakfast every day?⟧", "⟦You have breakfast every day?⟧", "⟦Are you have breakfast every day?⟧", "⟦Does you have breakfast every day?⟧"],
      "Perguntas no presente simples usam ⟦do⟧ (I/you/we/they) ou ⟦does⟧ (he/she/it).", { sp: "Do you have breakfast every day?" }),
    B("Rotina", "Sempre às sete", "Você conta a que horas costuma acordar.", "Monte a frase: “Eu geralmente acordo às sete.”", "I usually wake up at seven.",
      "Advérbios de frequência (⟦usually⟧, ⟦always⟧, ⟦never⟧) vêm antes do verbo principal.", { alt: ["Usually I wake up at seven", "I usually wake up at 7"], xw: ["in"] }),
    D("Rotina", "Ditado da rotina", "Uma amiga conta um hábito dela por áudio.", "Ouça e escreva a frase.", "I go to the gym three times a week.",
      "⟦three times a week⟧ = três vezes por semana."),
    // Café e restaurante
    C("Café e restaurante", "No balcão", "O atendente pergunta: ⟦What can I get you?⟧", "Escolha o pedido mais natural e educado.",
      ["⟦Can I have a cappuccino, please?⟧", "⟦Give me a cappuccino.⟧", "⟦I want cappuccino.⟧", "⟦A cappuccino for me now.⟧"],
      "⟦Can I have…, please?⟧ ou ⟦I'd like…⟧ são as formas educadas de pedir.", { w: ["Ordem direta soa rude.", "Falta o artigo e soa ríspido.", "Soa como uma ordem."], sp: "Can I have a cappuccino, please?" }),
    H("Café e restaurante", "Para viagem?", "Você acabou de pedir um café.", "Ouça a pergunta do atendente e escolha a melhor resposta.", "Is that for here or to go?",
      ["⟦To go, please.⟧", "⟦Yes, I go.⟧", "⟦Here is my card.⟧", "⟦I'm from here.⟧"],
      "⟦For here or to go?⟧ = para consumir aqui ou levar. Resposta: ⟦For here⟧ ou ⟦To go, please⟧."),
    B("Café e restaurante", "Pedindo a conta", "No fim do jantar em Nova York, você quer a conta.", "Monte a frase: “Pode trazer a conta, por favor?”", "Could we have the check, please?",
      "Nos EUA, a conta do restaurante é ⟦the check⟧; no Reino Unido, ⟦the bill⟧.", { alt: ["Could we have the bill, please?", "Can we have the check, please?"], xw: ["account"] }),
    O("Café e restaurante", "Do pedido ao pagamento", "Você está numa cafeteria em Boston.", "Coloque o diálogo em ordem.",
      ["⟦Hi! What can I get you?⟧", "⟦I'd like a latte, please.⟧", "⟦Sure. For here or to go?⟧", "⟦To go, please.⟧", "⟦That's five dollars.⟧", "⟦Here you are.⟧"],
      "Pedido → pergunta do local → resposta → preço → pagamento."),
    // Compras
    C("Compras", "Só olhando", "Na loja, a vendedora pergunta ⟦Can I help you?⟧, mas você só quer olhar.", "Escolha a melhor resposta.",
      ["⟦I'm just looking, thanks.⟧", "⟦No help.⟧", "⟦I see only.⟧", "⟦Go away, please.⟧"],
      "⟦I'm just looking, thanks⟧ recusa a ajuda com educação.", { sp: "I'm just looking, thanks." }),
    F("Compras", "Outro tamanho", "A camiseta ficou pequena.", "Complete a pergunta para pedir o tamanho M.", "Do you have this in a ___?", ["medium", "M"],
      "Tamanhos: ⟦small⟧ (P), ⟦medium⟧ (M), ⟦large⟧ (G)."),
    B("Compras", "Experimentando", "Você gostou de uma jaqueta e quer prová-la.", "Monte a pergunta: “Posso experimentar?”", "Can I try it on?",
      "⟦try on⟧ = experimentar roupa. Com pronome, ele fica no meio: ⟦try it on⟧.", { alt: ["Could I try it on?"], xw: ["experiment"] }),
    H("Compras", "Formas de pagamento", "No caixa, você pergunta se aceitam cartão.", "Ouça a resposta e escolha o que ela significa.", "Sorry, we only take cash.",
      ["Desculpe, só aceitamos dinheiro.", "Desculpe, o cartão foi recusado.", "Desculpe, não aceitamos dinheiro.", "Desculpe, a máquina está quebrada."],
      "⟦cash⟧ = dinheiro vivo. ⟦take⟧ aqui = aceitar."),
    // Direções
    C("Direções", "Abordando alguém", "Você está perdido e quer pedir ajuda a uma pessoa na rua.", "Qual a melhor forma de começar?",
      ["⟦Excuse me, how do I get to the station?⟧", "⟦Sorry, station where?⟧", "⟦Hey! Station!⟧", "⟦Tell me the station.⟧"],
      "⟦Excuse me⟧ chama a atenção com educação; ⟦How do I get to…?⟧ pede o caminho.", { sp: "Excuse me, how do I get to the station?" }),
    H("Direções", "Seguindo instruções", "Você perguntou onde fica o banco.", "Ouça e escolha o caminho correto.", "Go straight and take the second left. It's next to the post office.",
      ["Siga reto, pegue a segunda à esquerda; fica ao lado do correio.", "Siga reto, pegue a segunda à direita; fica em frente ao correio.", "Vire à esquerda duas vezes; fica atrás do correio.", "Siga reto até o correio e vire à esquerda."],
      "⟦take the second left⟧ = pegue a segunda rua à esquerda. ⟦next to⟧ = ao lado de."),
    F("Direções", "Em frente ao parque", "Você explica onde fica o seu hotel.", "Complete: o hotel fica do outro lado da rua, em frente ao parque.", "The hotel is ___ from the park.", ["across"],
      "⟦across from⟧ = do outro lado da rua, em frente."),
    O("Direções", "Pedindo informação", "Você procura um caixa eletrônico.", "Coloque o diálogo em ordem.",
      ["⟦Excuse me, is there an ATM near here?⟧", "⟦Yes, there's one on Main Street.⟧", "⟦How do I get there?⟧", "⟦Go straight and turn right at the bank.⟧", "⟦Thank you so much!⟧"],
      "Abertura educada → pergunta → resposta → pedido de caminho → instrução → agradecimento."),
    // There is / there are
    F("There is / there are", "O que tem no quarto", "Você descreve o quarto do hotel para um amigo.", "Complete com ⟦is⟧ ou ⟦are⟧.", "There ___ two beds and a small desk.", ["are"],
      "O primeiro item é plural (⟦two beds⟧): ⟦there are⟧."),
    C("There is / there are", "Farmácia por perto", "Você quer saber se existe uma farmácia perto do hotel.", "Qual pergunta está correta?",
      ["⟦Is there a pharmacy near here?⟧", "⟦Have a pharmacy near here?⟧", "⟦There is a pharmacy near here?⟧", "⟦Has a pharmacy near here?⟧"],
      "“Tem…?” no sentido de existir é ⟦Is there…?⟧, nunca ⟦have⟧.", { sp: "Is there a pharmacy near here?" }),
    B("There is / there are", "Sem leite", "A geladeira está sem leite.", "Monte a frase: “Não tem leite.”", "There isn't any milk.",
      "Negativa com incontável: ⟦There isn't any…⟧", { alt: ["There is not any milk", "There's no milk"], xw: ["have"] }),
    // Pedidos com can
    C("Pedidos com can", "Fale mais devagar", "O atendente fala rápido demais e você não entende.", "Escolha o pedido mais educado.",
      ["⟦Could you speak more slowly, please?⟧", "⟦Speak slow!⟧", "⟦You talk very fast.⟧", "⟦Can you to speak slowly?⟧"],
      "⟦Could you…, please?⟧ é o pedido mais educado. Depois de ⟦can⟧/⟦could⟧ não vai ⟦to⟧.", { sp: "Could you speak more slowly, please?" }),
    F("Pedidos com can", "Habilidades", "Num formulário de voluntariado, perguntam o que você sabe fazer.", "Complete: eu sei dirigir, mas não sei nadar.", "I can drive, but I ___ swim.", ["can't", "cannot", "can not"],
      "Negativa de ⟦can⟧: ⟦can't⟧ ou ⟦cannot⟧."),
    D("Pedidos com can", "Pedido no avião", "O passageiro ao lado faz um pedido para você.", "Ouça e escreva o que ele pediu.", "Could you help me with my bag?",
      "⟦Could you help me with…?⟧ = pode me ajudar com…?"),
    // Passado simples
    C("Passado simples", "Segunda-feira", "Um colega pergunta: ⟦What did you do last weekend?⟧", "Escolha a resposta correta.",
      ["⟦I went to the beach with my family.⟧", "⟦I go to the beach with my family.⟧", "⟦I did go to the beach yesterday tomorrow.⟧", "⟦I goed to the beach.⟧"],
      "No passado, ⟦go⟧ vira ⟦went⟧ (irregular).", { sp: "I went to the beach with my family." }),
    F("Passado simples", "Pergunta no passado", "Você quer saber se a amiga assistiu ao jogo.", "Complete a pergunta.", "___ you watch the game last night?", ["Did"],
      "Perguntas no passado simples usam ⟦did⟧ + verbo base."),
    B("Passado simples", "Não saí", "Você conta que ficou em casa ontem.", "Monte a frase: “Eu não saí ontem à noite.”", "I didn't go out last night.",
      "Negativa no passado: ⟦didn't⟧ + verbo base (⟦go⟧, não ⟦went⟧).", { alt: ["I did not go out last night"], xw: ["went"] }),
    H("Passado simples", "Como foi?", "Você pergunta a uma amiga como foi a viagem dela.", "Ouça e escolha o que ela disse.", "It was amazing! We visited three cities and ate a lot.",
      ["Foi incrível! Visitamos três cidades e comemos muito.", "Vai ser incrível! Vamos visitar três cidades.", "Foi cansativa. Visitamos só uma cidade.", "Foi incrível, mas não comemos bem."],
      "⟦was⟧, ⟦visited⟧ e ⟦ate⟧ estão no passado: ela já fez a viagem."),
    // Planos
    F("Planos", "Plano do fim de semana", "Você conta o seu plano já decidido.", "Complete com a forma correta.", "I'm ___ to visit my grandmother on Sunday.", ["going"],
      "Plano decidido: ⟦be going to⟧ + verbo."),
    C("Planos", "Perguntando planos", "Você quer saber o que o colega vai fazer nas férias.", "Qual pergunta está correta?",
      ["⟦What are you going to do on vacation?⟧", "⟦What you going to do on vacation?⟧", "⟦What do you going to do on vacation?⟧", "⟦What are you go to do on vacation?⟧"],
      "Estrutura: ⟦What are you going to…?⟧", { sp: "What are you going to do on vacation?" }),
    D("Planos", "Mensagem da amiga", "Uma amiga manda um áudio sobre os planos dela.", "Ouça e escreva a frase.", "We're going to travel in July.",
      "⟦We're going to⟧ = vamos (plano decidido).", { alt: ["We are going to travel in July"] }),
    // Ao telefone
    C("Ao telefone", "Quem fala?", "A recepcionista pergunta ⟦Who's calling, please?⟧", "Escolha a resposta adequada ao telefone.",
      ["⟦This is Ana from NexusMarket.⟧", "⟦I'm calling me Ana.⟧", "⟦Here speaks Ana.⟧", "⟦My name calls Ana.⟧"],
      "Ao telefone, identifique-se com ⟦This is…⟧.", { sp: "This is Ana from NexusMarket." }),
    O("Ao telefone", "Deixando recado", "Você liga para falar com o Sr. Brown, mas ele não está.", "Coloque a ligação em ordem.",
      ["⟦Good morning, Atlas Supplies.⟧", "⟦Hi, this is Ana. Can I speak to Mr. Brown?⟧", "⟦I'm sorry, he's in a meeting. Can I take a message?⟧", "⟦Yes, could you ask him to call me back?⟧", "⟦Sure. What's your number?⟧"],
      "Atendimento → identificação → indisponível → recado → número."),
    H("Ao telefone", "Aguarde na linha", "Você ligou para um hotel.", "Ouça e escolha o que você deve fazer.", "Please hold on. I'll transfer your call.",
      ["Aguardar: a ligação será transferida.", "Desligar e ligar mais tarde.", "Deixar um recado na secretária.", "Soletrar o seu nome."],
      "⟦Hold on⟧ = aguarde. ⟦transfer your call⟧ = transferir a ligação."),
    // Desafio do nível 1
    O("Desafio do nível 1", "Um dia em Nova York", "Desafio do nível: você passa o dia em Nova York.", "Coloque as situações na ordem em que fariam sentido.",
      ["⟦Good morning! Can I have a coffee, please?⟧", "⟦Excuse me, how do I get to Central Park?⟧", "⟦How much are these T-shirts?⟧", "⟦Could we have the check, please?⟧", "⟦Hello, this is Lucas. I'm calling to confirm my reservation for tomorrow.⟧"],
      "Café da manhã → direções → compras → jantar → ligação confirmando o dia seguinte."),
    C("Desafio do nível 1", "Recepção do hotel", "Desafio do nível: na recepção, perguntam ⟦Can I help you?⟧. Você quer saber se há um restaurante no hotel e a que horas ele abre.", "Escolha a melhor pergunta.",
      ["⟦Is there a restaurant in the hotel? What time does it open?⟧", "⟦Have restaurant in hotel? What time open?⟧", "⟦There are a restaurant? When it opens?⟧", "⟦Is a restaurant? What hour does it opens?⟧"],
      "Junta ⟦Is there…?⟧ (existência) com pergunta no presente simples: ⟦What time does it open?⟧", { sp: "Is there a restaurant in the hotel? What time does it open?" }),
  ];

  /* ================== NÍVEL 2 · VIAGENS E VIDA SOCIAL ================== */
  const intermediario = [
    // Aeroporto
    H("Aeroporto", "Na imigração", "Você chega ao aeroporto de Miami.", "Ouça a pergunta do oficial e escolha a melhor resposta.", "What's the purpose of your visit?",
      ["⟦Tourism. I'm visiting friends.⟧", "⟦Ten days.⟧", "⟦By plane.⟧", "⟦I'm purpose.⟧"],
      "⟦purpose of your visit⟧ = motivo da viagem. Resposta curta: turismo, trabalho, estudo."),
    C("Aeroporto", "Janela ou corredor?", "No check-in, perguntam ⟦Window or aisle?⟧. Você prefere o corredor.", "Escolha a resposta.",
      ["⟦Aisle, please.⟧", "⟦Window, please.⟧", "⟦Middle, please.⟧", "⟦Corridor, please.⟧"],
      "⟦aisle⟧ (lê-se “ail”) = corredor do avião.", { sp: "Aisle, please." }),
    F("Aeroporto", "Voo atrasado", "Você avisa a família que o voo vai atrasar.", "Complete com a palavra que significa “atrasado”.", "My flight is ___ by two hours.", ["delayed"],
      "⟦delayed⟧ = atrasado; ⟦canceled⟧ = cancelado."),
    O("Aeroporto", "Do check-in ao avião", "Você vai embarcar num voo internacional.", "Coloque as etapas na ordem.",
      ["⟦Check in and drop off your bag.⟧", "⟦Go through security.⟧", "⟦Go through passport control.⟧", "⟦Wait at the gate.⟧", "⟦Show your boarding pass and board the plane.⟧"],
      "Check-in → segurança → controle de passaporte → portão → embarque."),
    // Hotel
    B("Hotel", "Check-in", "Você chega ao hotel em Londres. A reserva está no nome Costa.", "Monte a frase: “Tenho uma reserva no nome Costa.”", "I have a reservation under the name Costa.",
      "⟦under the name…⟧ = no nome de…", { alt: ["I have a reservation under Costa"], xw: ["in"] }),
    C("Hotel", "Ar-condicionado quebrado", "O ar-condicionado do quarto não funciona. Você liga para a recepção.", "Escolha a frase mais adequada.",
      ["⟦Hi, the air conditioning in room 304 isn't working. Could you send someone?⟧", "⟦Your air is bad. Fix now.⟧", "⟦The air conditioning don't work.⟧", "⟦I'm hot. Come.⟧"],
      "Descreva o problema com ⟦isn't working⟧ e peça ajuda com ⟦Could you…?⟧", { sp: "The air conditioning in room 304 isn't working. Could you send someone?" }),
    H("Hotel", "Café da manhã", "Você pergunta sobre o café da manhã.", "Ouça a resposta e escolha a informação certa.", "Breakfast is served from six thirty to ten in the main restaurant.",
      ["Das 6h30 às 10h, no restaurante principal", "Das 6h às 10h30, no quarto", "Das 7h às 10h, no térreo", "Das 6h30 às 11h, no restaurante principal"],
      "⟦six thirty⟧ = 6h30; ⟦main restaurant⟧ = restaurante principal."),
    F("Hotel", "Check-out mais tarde", "Seu voo é à noite e você quer ficar mais no quarto.", "Complete o pedido.", "Could I have a ___ check-out?", ["late"],
      "⟦late check-out⟧ = sair do quarto depois do horário padrão."),
    // Transporte
    C("Transporte", "Ida e volta", "Você vai a Boston e volta no mesmo dia, de trem.", "O que pedir na bilheteria?",
      ["⟦A round-trip ticket to Boston, please.⟧", "⟦A one-way ticket to Boston, please.⟧", "⟦A go-and-come ticket to Boston.⟧", "⟦Two tickets one way to Boston.⟧"],
      "⟦round-trip⟧ (EUA) = ida e volta; ⟦one-way⟧ = só ida.", { sp: "A round-trip ticket to Boston, please." }),
    F("Transporte", "Descendo do ônibus", "Você pergunta ao motorista onde descer para o museu.", "Complete com a partícula certa.", "Where do I get ___ for the museum?", ["off"],
      "⟦get on⟧ = subir/entrar; ⟦get off⟧ = descer."),
    H("Transporte", "Aviso na estação", "Você está na plataforma esperando o trem.", "Ouça o aviso e escolha o que aconteceu.", "The 9:15 train to Philadelphia will depart from platform seven.",
      ["O trem das 9h15 sai da plataforma 7.", "O trem das 9h50 foi cancelado.", "O trem das 9h15 sai da plataforma 11.", "O trem está atrasado sete minutos."],
      "⟦depart from platform seven⟧ = sai da plataforma sete."),
    B("Transporte", "Quanto tempo leva?", "Você quer saber a duração da viagem de ônibus.", "Monte a pergunta: “Quanto tempo leva?”", "How long does it take?",
      "Pergunta padrão de duração de trajeto.", { xw: ["much", "is"] }),
    // Saúde e farmácia
    C("Saúde e farmácia", "Dor de cabeça", "Na farmácia, você quer dizer que está com dor de cabeça.", "Escolha a frase correta.",
      ["⟦I have a headache.⟧", "⟦I'm with headache.⟧", "⟦I have pain of head.⟧", "⟦My head is aching me.⟧"],
      "Sintomas: ⟦I have a headache / a fever / a cold⟧.", { sp: "I have a headache." }),
    F("Saúde e farmácia", "Alergia", "Você precisa avisar o médico de uma alergia.", "Complete com a preposição certa.", "I'm allergic ___ penicillin.", ["to"],
      "⟦allergic to⟧ = alérgico a."),
    H("Saúde e farmácia", "Como tomar o remédio", "A farmacêutica explica como tomar o remédio.", "Ouça e escolha a instrução.", "Take one tablet every eight hours, with food.",
      ["Um comprimido a cada 8 horas, junto com comida", "Oito comprimidos por dia, em jejum", "Um comprimido a cada 6 horas, antes de comer", "Dois comprimidos de 8 em 8 horas"],
      "⟦every eight hours⟧ = de 8 em 8 horas; ⟦with food⟧ = com comida."),
    K("Saúde e farmácia", "Onde dói?", "Você monta uma lista de frases úteis para a viagem.", "Classifique cada frase.", ["Sintoma", "Pedido"],
      [["⟦I have a sore throat.⟧", 0], ["⟦Do you have something for a cough?⟧", 1], ["⟦I have a fever.⟧", 0], ["⟦I need to see a doctor.⟧", 1], ["⟦My back hurts.⟧", 0], ["⟦Could you call an ambulance?⟧", 1]],
      "Sintomas descrevem o que você sente; pedidos pedem algo ou ajuda."),
    // Present perfect
    C("Present perfect", "Já foi a Londres?", "Você quer saber se o colega já esteve em Londres alguma vez.", "Qual pergunta está correta?",
      ["⟦Have you ever been to London?⟧", "⟦Did you ever went to London?⟧", "⟦Have you ever go to London?⟧", "⟦Are you ever been to London?⟧"],
      "Experiência de vida sem data: ⟦Have you ever been to…?⟧", { sp: "Have you ever been to London?" }),
    F("Present perfect", "Nunca comi", "Num jantar, oferecem ostras. Você nunca provou.", "Complete com o particípio de ⟦eat⟧.", "I've never ___ oysters.", ["eaten"],
      "⟦eat / ate / eaten⟧: present perfect usa o particípio."),
    C("Present perfect", "Com data", "Você conta quando foi a Orlando.", "Qual frase está correta?",
      ["⟦I went to Orlando in 2019.⟧", "⟦I've been to Orlando in 2019.⟧", "⟦I've gone to Orlando in 2019.⟧", "⟦I have go to Orlando in 2019.⟧"],
      "Com data definida (⟦in 2019⟧), use o passado simples."),
    D("Present perfect", "Acabou de chegar", "A recepcionista avisa sobre o seu colega.", "Ouça e escreva a frase.", "He has just arrived.",
      "⟦has just arrived⟧ = acabou de chegar.", { alt: ["He's just arrived"] }),
    // Comparativos
    F("Comparativos", "Mais barato", "Você compara dois hotéis.", "Complete com o comparativo de ⟦cheap⟧.", "This hotel is ___ than the other one.", ["cheaper"],
      "Adjetivo curto: ⟦-er⟧ + ⟦than⟧."),
    C("Comparativos", "O melhor da cidade", "Você recomenda um restaurante a um turista.", "Escolha a frase correta.",
      ["⟦It's the best restaurant in town.⟧", "⟦It's the better restaurant in town.⟧", "⟦It's the most good restaurant in town.⟧", "⟦It's the goodest restaurant in town.⟧"],
      "⟦good / better / best⟧ é irregular."),
    B("Comparativos", "Mais confortável", "Você explica por que prefere o trem.", "Monte a frase: “O trem é mais confortável que o ônibus.”", "The train is more comfortable than the bus.",
      "Adjetivo longo: ⟦more⟧ + adjetivo + ⟦than⟧.", { xw: ["most", "then"] }),
    H("Comparativos", "Escolhendo o voo", "O atendente compara dois voos.", "Ouça e escolha a conclusão correta.", "The morning flight is cheaper, but the afternoon flight is faster.",
      ["O voo da manhã é mais barato; o da tarde é mais rápido.", "O voo da manhã é mais caro e mais rápido.", "Os dois voos custam o mesmo.", "O voo da tarde é mais barato e mais lento."],
      "⟦cheaper⟧ = mais barato; ⟦faster⟧ = mais rápido."),
    // Futuro com will
    C("Futuro com will", "Decisão na hora", "O garçom pergunta o que você quer. Você decide na hora.", "Escolha a resposta mais natural.",
      ["⟦I'll have the fish, please.⟧", "⟦I'm going to have the fish yesterday.⟧", "⟦I will to have the fish.⟧", "⟦I have the fish tomorrow.⟧"],
      "Decisão tomada na hora: ⟦I'll…⟧. Em restaurante, ⟦I'll have…⟧ é muito comum.", { sp: "I'll have the fish, please." }),
    F("Futuro com will", "Promessa", "Você promete mandar o arquivo amanhã.", "Complete com o auxiliar do futuro (forma completa ou contraída).", "Don't worry. I ___ send you the file tomorrow.", ["will", "'ll"],
      "⟦I'll⟧ = ⟦I will⟧: promessas e ofertas.", { h: "A forma curta de ⟦I will⟧." }),
    B("Futuro com will", "Não vou contar", "Um amigo conta um segredo.", "Monte a frase: “Não vou contar a ninguém.”", "I won't tell anyone.",
      "⟦won't⟧ = ⟦will not⟧.", { alt: ["I will not tell anyone"], xw: ["nobody"] }),
    // Conselhos e regras
    C("Conselhos e regras", "Dica de viagem", "Um amigo vai a Londres pela primeira vez e pede uma dica.", "Escolha o conselho correto.",
      ["⟦You should get a travel card for the subway.⟧", "⟦You should to get a travel card.⟧", "⟦You must to get a travel card.⟧", "⟦You should getting a travel card.⟧"],
      "Conselho: ⟦should⟧ + verbo base, sem ⟦to⟧.", { sp: "You should get a travel card for the subway." }),
    K("Conselhos e regras", "Obrigatório, proibido ou opcional?", "Você lê as regras do museu.", "Classifique cada frase.", ["Obrigatório", "Proibido", "Não é necessário"],
      [["⟦You must show your ticket.⟧", 0], ["⟦You mustn't take photos with flash.⟧", 1], ["⟦You don't have to book in advance.⟧", 2], ["⟦You have to leave your bag at the entrance.⟧", 0], ["⟦You mustn't touch the paintings.⟧", 1], ["⟦You don't have to pay on Sundays.⟧", 2]],
      "⟦must⟧ / ⟦have to⟧ = obrigatório; ⟦mustn't⟧ = proibido; ⟦don't have to⟧ = não é necessário."),
    F("Conselhos e regras", "Não precisa", "O ingresso é gratuito.", "Complete: você não precisa pagar.", "You don't ___ to pay. It's free.", ["have"],
      "⟦don't have to⟧ = não precisa."),
    // Small talk
    C("Small talk", "Como foi o fim de semana?", "Um colega pergunta: ⟦How was your weekend?⟧", "Escolha a resposta que mantém a conversa viva.",
      ["⟦Pretty good! I went hiking. How about yours?⟧", "⟦Yes.⟧", "⟦Weekend.⟧", "⟦It was. Bye.⟧"],
      "Responda, dê um detalhe e devolva a pergunta.", { sp: "Pretty good! I went hiking. How about yours?" }),
    K("Small talk", "Assunto seguro?", "Você vai a um evento de networking.", "Classifique os assuntos para um primeiro contato.", ["Seguro", "Evitar"],
      [["o clima", 0], ["salário", 1], ["viagens", 0], ["religião", 1], ["o fim de semana", 0], ["política", 1], ["comida local", 0]],
      "No small talk, fique em temas neutros: clima, viagens, comida, fim de semana."),
    H("Small talk", "Reagindo", "Uma colega conta uma novidade.", "Ouça e escolha a melhor reação.", "I just got back from Japan. It was my first time there!",
      ["⟦Wow, that's amazing! How was it?⟧", "⟦OK.⟧", "⟦I don't like Japan.⟧", "⟦Why you go?⟧"],
      "Reaja com interesse e faça uma pergunta: isso mantém a conversa."),
    D("Small talk", "Encerrando a conversa", "No fim do evento, um contato se despede de você.", "Ouça e escreva a frase.", "It was nice talking to you.",
      "Encerramento cordial de uma conversa.", { alt: ["It was nice to talk to you"] }),
    // Convites
    C("Convites", "Recusando com educação", "Um colega convida para um jantar na sexta, mas você tem compromisso.", "Escolha a melhor resposta.",
      ["⟦Thanks for asking! I'm afraid I can't on Friday. How about Saturday?⟧", "⟦No.⟧", "⟦I don't want.⟧", "⟦Friday is bad for you.⟧"],
      "Agradeça, dê o motivo de forma suave (⟦I'm afraid I can't⟧) e sugira outra data.", { sp: "Thanks for asking! I'm afraid I can't on Friday. How about Saturday?" }),
    B("Convites", "Fazendo o convite", "Você quer convidar uma cliente para almoçar, de forma educada.", "Monte a pergunta: “Você gostaria de almoçar conosco?”", "Would you like to have lunch with us?",
      "⟦Would you like to…?⟧ é o convite educado padrão.", { alt: ["Would you like to join us for lunch?"], xw: ["want"] }),
    F("Convites", "Aceitando", "Seu amigo convida para um show. Você adora a ideia.", "Complete a resposta entusiasmada.", "I'd ___ to!", ["love"],
      "⟦I'd love to!⟧ = adoraria!"),
    // Reclamações
    C("Reclamações", "Pedido errado", "O garçom trouxe frango, mas você pediu peixe.", "Escolha a forma mais educada de reclamar.",
      ["⟦Excuse me, I'm afraid this isn't what I ordered. I ordered the fish.⟧", "⟦You did it wrong!⟧", "⟦This is not mine, take it.⟧", "⟦Bad service.⟧"],
      "Suavize com ⟦I'm afraid…⟧, explique e diga o que você pediu.", { sp: "Excuse me, I'm afraid this isn't what I ordered." }),
    F("Reclamações", "Dinheiro de volta", "O produto chegou quebrado e você quer o reembolso.", "Complete o pedido.", "Could I get a ___, please?", ["refund"],
      "⟦refund⟧ = reembolso."),
    H("Reclamações", "Resposta do SAC", "Você reclamou de uma entrega por telefone.", "Ouça a resposta e escolha o que vai acontecer.", "I'm sorry about that. We'll send you a replacement free of charge.",
      ["Eles vão enviar outro produto sem custo.", "Eles vão devolver o dinheiro.", "Você precisa pagar o frete.", "Eles não podem fazer nada."],
      "⟦replacement⟧ = produto substituto; ⟦free of charge⟧ = sem custo."),
    B("Reclamações", "Pedindo a troca", "O fone de ouvido parou de funcionar depois de dois dias.", "Monte o pedido: “Vocês poderiam trocá-lo, por favor?”", "Could you replace it, please?",
      "⟦replace⟧ = trocar por outro igual. ⟦Could you…⟧ deixa o pedido educado.", { alt: ["Could you exchange it, please?", "Can you replace it, please?"], xw: ["change"] }),
    // Phrasal verbs do dia a dia
    F("Phrasal verbs do dia a dia", "Me busca?", "Você pede uma carona até o aeroporto.", "Complete com a partícula certa.", "Can you pick me ___ at seven?", ["up"],
      "⟦pick up⟧ = buscar alguém."),
    C("Phrasal verbs do dia a dia", "Desligue a luz", "Você pede para o filho apagar a luz.", "Qual frase está correta?",
      ["⟦Please turn it off.⟧", "⟦Please turn off it.⟧", "⟦Please off it turn.⟧", "⟦Please turn it of.⟧"],
      "Com pronome, a partícula vai depois: ⟦turn it off⟧."),
    K("Phrasal verbs do dia a dia", "O que significa?", "Você revisa os ⟦phrasal verbs⟧ da semana.", "Classifique cada um pelo significado.", ["procurar", "descobrir", "desistir", "acordar"],
      [["⟦look for⟧", 0], ["⟦find out⟧", 1], ["⟦give up⟧", 2], ["⟦wake up⟧", 3]],
      "⟦look for⟧ = procurar; ⟦find out⟧ = descobrir; ⟦give up⟧ = desistir; ⟦wake up⟧ = acordar."),
    // Contando histórias
    F("Contando histórias", "Quando o telefone tocou", "Você conta o que estava fazendo quando alguém ligou.", "Complete com o ⟦past continuous⟧ de ⟦cook⟧.", "I was ___ dinner when you called.", ["cooking"],
      "Cenário: ⟦was⟧ + verbo com ⟦-ing⟧."),
    B("Contando histórias", "O carro quebrou", "Você explica por que se atrasou.", "Monte a frase: “Eu estava dirigindo quando o carro quebrou.”", "I was driving when the car broke down.",
      "Ação longa (⟦was driving⟧) interrompida por ação curta (⟦broke down⟧).", { xw: ["drove"] }),
    D("Contando histórias", "Enquanto esperava", "Um amigo conta como passou o tempo no aeroporto.", "Ouça e escreva a frase.", "While I was waiting, I read a book.",
      "⟦while⟧ + ação longa; ação curta no passado simples."),
    // Desafio do nível 2
    O("Desafio do nível 2", "Problema no hotel", "Desafio do nível: você chega ao hotel e há um problema com a reserva.", "Coloque o diálogo em ordem.",
      ["⟦Hi, I have a reservation under the name Silva.⟧", "⟦I'm sorry, I can't find it. When did you book?⟧", "⟦Two weeks ago. Here's my confirmation email.⟧", "⟦Oh, I see. There was a mistake. We'll give you a room with a view, at no extra cost.⟧", "⟦That's great, thank you!⟧"],
      "Check-in → problema → evidência → solução → agradecimento."),
    C("Desafio do nível 2", "Conselho de viagem", "Desafio do nível: uma amiga vai a Nova York pela primeira vez e pergunta o que você achou da cidade.", "Escolha a resposta mais completa e correta.",
      ["⟦I've been there twice. It's more expensive than London, but you should definitely go!⟧", "⟦I've been there in 2019. It's expensiver than London.⟧", "⟦I go there twice. You must to go.⟧", "⟦I was been there. It's the more expensive.⟧"],
      "Combina ⟦present perfect⟧ (experiência), comparativo e conselho com ⟦should⟧.", { sp: "I've been there twice. It's more expensive than London, but you should definitely go!" }),
    H("Desafio do nível 2", "Mensagem do guia", "Desafio do nível: o guia deixa um recado sobre o passeio de amanhã.", "Ouça e escolha o que você precisa fazer.", "Tomorrow we'll meet in the lobby at eight. You should bring comfortable shoes, but you don't have to bring lunch.",
      ["Encontrar no saguão às 8h, levar sapatos confortáveis, sem precisar levar almoço.", "Encontrar no saguão às 8h e levar almoço.", "Encontrar na estação às 8h e levar sapatos confortáveis.", "Encontrar no saguão às 9h e não levar nada."],
      "⟦should bring⟧ = conselho; ⟦don't have to bring⟧ = não precisa levar."),
  ];

  /* ================== NÍVEL 3 · TRABALHO E CARREIRA ================== */
  const avancado = [
    // Reuniões
    C("Reuniões", "Discordando com educação", "Na reunião, um colega diz que o painel está pronto para lançar. Você acha que ainda há números inconsistentes.", "Escolha a melhor forma de discordar.",
      ["⟦I see your point, but some numbers are still inconsistent.⟧", "⟦You're wrong. It's not ready.⟧", "⟦I'm disagree with you.⟧", "⟦No, no, no.⟧"],
      "Reconheça o ponto do outro (⟦I see your point⟧) e então apresente o seu.", { sp: "I see your point, but some numbers are still inconsistent." }),
    K("Reuniões", "Função de cada frase", "Você monta um guia de frases para reuniões.", "Classifique cada frase pela função.", ["Dar opinião", "Concordar", "Discordar", "Conduzir"],
      [["⟦In my opinion, we should wait.⟧", 0], ["⟦I completely agree.⟧", 1], ["⟦I'm not sure I agree.⟧", 2], ["⟦Let's move on to the next item.⟧", 3], ["⟦From my point of view, it's risky.⟧", 0], ["⟦That's exactly what I think.⟧", 1], ["⟦I see it differently.⟧", 2], ["⟦So, to sum up…⟧", 3]],
      "Ter frases prontas para cada função deixa você mais seguro nas reuniões."),
    B("Reuniões", "Pedindo esclarecimento", "A diretora usou uma sigla que você não conhece.", "Monte a pergunta: “Você poderia esclarecer isso?”", "Could you clarify that?",
      "⟦clarify⟧ = esclarecer. Perguntar é sinal de atenção, não de fraqueza.", { alt: ["Could you clarify that, please?"], xw: ["explain"] }),
    H("Reuniões", "O que ficou decidido?", "No fim da reunião, a gerente resume as decisões.", "Ouça e escolha o resumo correto.", "So, to sum up, we'll postpone the launch to next month and Ana will fix the sales data.",
      ["O lançamento foi adiado para o mês que vem e a Ana vai corrigir os dados de vendas.", "O lançamento acontece amanhã e a Ana vai apresentar.", "O lançamento foi cancelado e a Ana sai do projeto.", "O lançamento foi antecipado e os dados estão corretos."],
      "⟦postpone⟧ = adiar; ⟦fix⟧ = corrigir."),
    // E-mails
    C("E-mails", "Anexando o relatório", "Você escreve para um parceiro enviando o relatório.", "Escolha a frase adequada para o e-mail.",
      ["⟦Please find attached the monthly report.⟧", "⟦Follows attached the monthly report.⟧", "⟦The report goes attached in this email.⟧", "⟦Look the attach.⟧"],
      "⟦Please find attached…⟧ (formal) ou ⟦I've attached…⟧ (neutro).", { w: ["Tradução literal de “segue anexo”.", "Estrutura não natural.", "⟦attach⟧ é verbo; e falta ⟦at⟧."] }),
    O("E-mails", "Montando o e-mail", "Você vai escrever um e-mail para confirmar uma reunião.", "Coloque as partes do e-mail na ordem.",
      ["⟦Hi Jennifer,⟧", "⟦I hope you're doing well.⟧", "⟦I'm writing to confirm our meeting on Tuesday at 10 a.m.⟧", "⟦Could you please let me know if the time still works for you?⟧", "⟦Looking forward to hearing from you.⟧", "⟦Best regards, Ana⟧"],
      "Saudação → cordialidade → motivo → pedido → expectativa de retorno → assinatura."),
    F("E-mails", "Aguardo o retorno", "Você encerra um e-mail para um cliente.", "Complete a frase de encerramento.", "Looking forward to ___ from you.", ["hearing"],
      "Depois de ⟦looking forward to⟧ vem verbo com ⟦-ing⟧."),
    K("E-mails", "Formal ou informal?", "Você revisa e-mails para clientes e colegas.", "Classifique cada expressão.", ["Formal", "Informal"],
      [["⟦Dear Mr. Lee,⟧", 0], ["⟦Hey guys!⟧", 1], ["⟦I am writing to inform you…⟧", 0], ["⟦Just a quick note…⟧", 1], ["⟦Kind regards,⟧", 0], ["⟦Cheers,⟧", 1]],
      "Clientes e pessoas que você não conhece: formal. Colegas próximos: informal."),
    // Apresentando dados
    H("Apresentando dados", "Leitura do gráfico", "Na reunião com a matriz, o colega apresenta os resultados.", "Ouça e escolha o que aconteceu com as vendas.", "Sales rose by fifteen percent in the first quarter and peaked in March.",
      ["Subiram 15% no 1º trimestre, com pico em março.", "Caíram 15% no 1º trimestre, com pico em março.", "Chegaram a 15% no 1º trimestre e caíram em março.", "Subiram 50% no 1º trimestre, com pico em maio."],
      "⟦rose by 15%⟧ = subiram 15%; ⟦peaked in March⟧ = atingiram o pico em março."),
    F("Apresentando dados", "by ou to?", "As devoluções foram de 6% para 5%.", "Complete com a preposição que indica o ponto de chegada.", "Return rates dropped from 6% ___ 5%.", ["to"],
      "⟦from … to …⟧ = de … para …; ⟦by⟧ indicaria o tamanho da variação."),
    C("Apresentando dados", "A variação", "A receita foi de US$ 10 milhões para US$ 12 milhões.", "Qual frase descreve corretamente?",
      ["⟦Revenue increased by 20%.⟧", "⟦Revenue increased to 20%.⟧", "⟦Revenue decreased by 20%.⟧", "⟦Revenue remained stable at 20%.⟧"],
      "De 10 para 12 é uma alta de 20%: ⟦increased by 20%⟧. ⟦to 20%⟧ diria que a receita virou 20%."),
    B("Apresentando dados", "Abrindo o gráfico", "Você começa a explicar o gráfico na apresentação.", "Monte a frase: “Como vocês podem ver neste gráfico, as vendas ficaram estáveis.”", "As you can see on this chart, sales remained stable.",
      "⟦As you can see…⟧ chama a atenção para o visual; ⟦remained stable⟧ = ficaram estáveis.", { alt: ["As you can see in this chart, sales remained stable."], xw: ["stayed"] }),
    // Entrevista de emprego
    C("Entrevista de emprego", "Fale sobre você", "A recrutadora pede: ⟦Tell me about yourself.⟧", "Escolha a abertura mais adequada.",
      ["⟦I'm a data analyst. I've worked with Power BI and SQL for five years.⟧", "⟦I was born in 1990 and I like pizza.⟧", "⟦I work as analyst since five years.⟧", "⟦What do you want to know?⟧"],
      "Comece pelo profissional e use ⟦present perfect⟧ + ⟦for⟧ para experiência até hoje.", { sp: "I'm a data analyst. I've worked with Power BI and SQL for five years." }),
    F("Entrevista de emprego", "Há quanto tempo", "Você trabalha na empresa atual desde 2021.", "Complete com a preposição certa.", "I've worked here ___ 2021.", ["since"],
      "⟦since⟧ + ponto de início (2021); ⟦for⟧ + duração (5 anos)."),
    D("Entrevista de emprego", "Sua conquista", "Você treina a resposta sobre a sua maior conquista.", "Ouça o modelo e escreva a frase.", "I automated our monthly reports and saved twenty hours a month.",
      "Conquista com resultado concreto: ação + impacto em números.", { alt: ["I automated our monthly reports and saved 20 hours a month"] }),
    H("Entrevista de emprego", "Pergunta final", "No fim da entrevista, o recrutador fala com você.", "Ouça e escolha a melhor resposta.", "Do you have any questions for us?",
      ["⟦Yes. What would a typical day look like in this role?⟧", "⟦No.⟧", "⟦When can I take vacation?⟧", "⟦Do you have questions?⟧"],
      "Sempre tenha uma pergunta pronta sobre o trabalho em si."),
    // Negociação
    C("Negociação", "Pedindo desconto", "O fornecedor cobra US$ 12 por unidade. Você quer pagar menos.", "Escolha a forma mais diplomática.",
      ["⟦Would you be willing to lower the price to ten dollars?⟧", "⟦Give me a discount now.⟧", "⟦Twelve is crazy.⟧", "⟦You must make it ten.⟧"],
      "⟦Would you be willing to…?⟧ propõe sem impor.", { sp: "Would you be willing to lower the price to ten dollars?" }),
    B("Negociação", "Troca condicional", "Você oferece aceitar o preço se o frete for grátis.", "Monte a frase: “Podemos aceitar onze se vocês incluírem o frete grátis.”", "We could accept eleven if you include free shipping.",
      "Proposta condicional: dou algo ⟦if⟧ você der algo.", { xw: ["will", "included"] }),
    F("Negociação", "Meio-termo", "Você propõe que cada lado ceda um pouco.", "Complete a expressão.", "Let's meet ___.", ["halfway"],
      "⟦meet halfway⟧ = chegar a um meio-termo."),
    O("Negociação", "A negociação", "Você negocia um contrato com um fornecedor.", "Coloque as falas na ordem.",
      ["⟦Our price is twelve dollars per unit.⟧", "⟦Would you be willing to lower it to ten?⟧", "⟦Ten is too low. What if we say eleven?⟧", "⟦We could accept eleven if you include free shipping.⟧", "⟦Deal. I'll send you the contract today.⟧"],
      "Proposta → contraproposta → nova proposta → condição → acordo."),
    // Condicionais
    F("Condicionais", "Se chover", "Você combina um plano B para o evento ao ar livre.", "Complete com o verbo ⟦rain⟧.", "If it ___, we'll move the event indoors.", ["rains"],
      "Condição real: ⟦if⟧ + presente; resultado com ⟦will⟧."),
    C("Condicionais", "Se eu fosse você", "Um amigo pergunta se deve aceitar uma oferta de emprego ótima.", "Escolha o conselho correto.",
      ["⟦If I were you, I'd accept it.⟧", "⟦If I am you, I accept it.⟧", "⟦If I was you, I will accept it.⟧", "⟦If I were you, I will accepted it.⟧"],
      "Conselho clássico: ⟦If I were you, I'd…⟧", { sp: "If I were you, I'd accept it." }),
    B("Condicionais", "Hipótese", "Você imagina o que faria com mais tempo.", "Monte a frase: “Se eu tivesse mais tempo, aprenderia espanhol.”", "If I had more time, I would learn Spanish.",
      "Hipótese: ⟦if⟧ + passado; resultado com ⟦would⟧.", { alt: ["If I had more time, I'd learn Spanish", "I would learn Spanish if I had more time"], xw: ["will"] }),
    H("Condicionais", "A menos que…", "Seu colega avisa sobre o prazo.", "Ouça e escolha o que ele quis dizer.", "Unless we finish the tests today, we won't launch on Monday.",
      ["Se não terminarmos os testes hoje, não lançaremos na segunda.", "Vamos lançar na segunda de qualquer jeito.", "Terminamos os testes, então lançaremos hoje.", "Só lançaremos se os testes falharem."],
      "⟦unless⟧ = a menos que (⟦if…not⟧)."),
    // Voz passiva
    F("Voz passiva", "Atualização diária", "Você explica o processo do painel.", "Complete com a voz passiva.", "The dashboard is ___ every morning.", ["updated"],
      "Passiva no presente: ⟦is⟧ + particípio."),
    C("Voz passiva", "Relatório de status", "Você informa que o problema foi corrigido.", "Qual frase está correta?",
      ["⟦The issue has been fixed.⟧", "⟦The issue has fixed.⟧", "⟦The issue was fix.⟧", "⟦The issue is been fixed.⟧"],
      "⟦present perfect⟧ passivo: ⟦has been⟧ + particípio."),
    B("Voz passiva", "Enviado ontem", "O gerente pergunta pelo relatório.", "Monte a frase: “O relatório foi enviado ontem.”", "The report was sent yesterday.",
      "Passiva no passado: ⟦was⟧ + particípio (⟦sent⟧).", { xw: ["sended", "is"] }),
    K("Voz passiva", "Ativa ou passiva?", "Você revisa um relatório.", "Classifique cada frase.", ["Voz ativa", "Voz passiva"],
      [["⟦We sent the report.⟧", 0], ["⟦The report was sent.⟧", 1], ["⟦The board approved the budget.⟧", 0], ["⟦The budget was approved by the board.⟧", 1], ["⟦Orders are shipped daily.⟧", 1], ["⟦Ana updates the data.⟧", 0]],
      "Passiva: ⟦be⟧ + particípio; o foco é a ação, não quem faz."),
    // Discurso indireto
    C("Discurso indireto", "Repassando o recado", "O cliente disse: ⟦The delivery is late.⟧ Você conta para a gerente.", "Escolha a frase correta.",
      ["⟦He said the delivery was late.⟧", "⟦He said me the delivery is late.⟧", "⟦He told that the delivery was late.⟧", "⟦He said the delivery late.⟧"],
      "⟦said⟧ sem objeto; o tempo verbal recua (⟦is⟧ → ⟦was⟧)."),
    F("Discurso indireto", "told ou said?", "Você conta o que o chefe pediu.", "Complete com ⟦told⟧ ou ⟦said⟧.", "My boss ___ me to send the file.", ["told"],
      "⟦told⟧ + pessoa + ⟦to⟧ + verbo."),
    B("Discurso indireto", "A pergunta dela", "A diretora perguntou: ⟦Can we meet on Monday?⟧", "Monte a frase em discurso indireto: “Ela perguntou se poderíamos nos reunir na segunda.”", "She asked if we could meet on Monday.",
      "Pergunta de sim/não → ⟦asked if⟧; ⟦can⟧ → ⟦could⟧.", { alt: ["She asked whether we could meet on Monday"], xw: ["can"] }),
    H("Discurso indireto", "O que ela disse?", "Você pergunta ao colega o que a cliente falou na ligação.", "Ouça e escolha o que a cliente disse.", "She said she would send the signed contract on Monday.",
      ["Que enviaria o contrato assinado na segunda.", "Que já tinha enviado o contrato na segunda.", "Que queria que você enviasse o contrato.", "Que não assinaria o contrato."],
      "⟦would send⟧ = enviaria (o ⟦will⟧ da fala original recua para ⟦would⟧)."),
    // Falsos cognatos
    C("Falsos cognatos", "Atualmente", "Você quer dizer “Atualmente, trabalho com BI”.", "Escolha a frase correta.",
      ["⟦Currently, I work with BI.⟧", "⟦Actually, I work with BI.⟧", "⟦Actual, I work with BI.⟧", "⟦Nowaday I work with BI.⟧"],
      "atualmente = ⟦currently⟧; ⟦actually⟧ = na verdade.", { sp: "Currently, I work with BI." }),
    K("Falsos cognatos", "Parece, mas não é", "Você revisa palavras que enganam.", "Classifique cada palavra pelo significado real.", ["fingir", "na verdade", "perceber", "biblioteca", "parentes"],
      [["⟦pretend⟧", 0], ["⟦actually⟧", 1], ["⟦realize⟧", 2], ["⟦library⟧", 3], ["⟦relatives⟧", 4]],
      "⟦pretend⟧ = fingir; ⟦actually⟧ = na verdade; ⟦realize⟧ = perceber; ⟦library⟧ = biblioteca; ⟦relatives⟧ = parentes."),
    C("Falsos cognatos", "Pretendo", "Você quer dizer “Pretendo fazer um MBA no ano que vem”.", "Escolha a frase correta.",
      ["⟦I intend to do an MBA next year.⟧", "⟦I pretend to do an MBA next year.⟧", "⟦I pretend do an MBA next year.⟧", "⟦I'm pretending an MBA next year.⟧"],
      "pretender = ⟦intend⟧ ou ⟦plan⟧; ⟦pretend⟧ = fingir."),
    H("Falsos cognatos", "No fim das contas", "Uma colega conta como terminou o projeto.", "Ouça e escolha o que ela quis dizer.", "It was hard, but we eventually found a solution.",
      ["Foi difícil, mas no fim encontramos uma solução.", "Foi difícil, e às vezes encontramos soluções.", "Foi difícil e nunca encontramos solução.", "Foi fácil e encontramos a solução na hora."],
      "⟦eventually⟧ = no fim das contas; não é “eventualmente”."),
    // Phrasal verbs de negócios
    F("Phrasal verbs de negócios", "Dando retorno", "O cliente ainda não aprovou o cronograma.", "Complete: vou cobrar/acompanhar com eles hoje.", "I'll follow ___ with them today.", ["up"],
      "⟦follow up⟧ = acompanhar, dar retorno."),
    C("Phrasal verbs de negócios", "Adiaram", "A diretoria mudou o lançamento para o mês que vem.", "Qual frase descreve isso?",
      ["⟦They put off the launch.⟧", "⟦They turned off the launch.⟧", "⟦They set up the launch.⟧", "⟦They carried out the launch.⟧"],
      "⟦put off⟧ = adiar."),
    K("Phrasal verbs de negócios", "Sinônimos formais", "Você precisa deixar um e-mail mais formal.", "Associe cada ⟦phrasal verb⟧ ao sinônimo formal.", ["postpone", "conduct", "organize", "understand"],
      [["⟦put off⟧", 0], ["⟦carry out⟧", 1], ["⟦set up⟧", 2], ["⟦figure out⟧", 3]],
      "⟦put off⟧ = ⟦postpone⟧; ⟦carry out⟧ = ⟦conduct⟧; ⟦set up⟧ = ⟦organize⟧; ⟦figure out⟧ = ⟦understand⟧."),
    D("Phrasal verbs de negócios", "Sem tempo", "A gerente explica por que não falaram de tudo.", "Ouça e escreva a frase.", "We ran out of time, so let's continue tomorrow.",
      "⟦run out of⟧ = ficar sem."),
    // Videochamadas
    C("Videochamadas", "No mudo", "Na call, o colega fala, mas ninguém ouve.", "O que você diz?",
      ["⟦I think you're on mute.⟧", "⟦You are in mute.⟧", "⟦Your sound is closed.⟧", "⟦You are silence.⟧"],
      "⟦on mute⟧ = no mudo.", { sp: "I think you're on mute." }),
    H("Videochamadas", "Conexão ruim", "Durante a apresentação, alguém fala com você.", "Ouça e escolha o que você deve fazer.", "Sorry, you broke up for a second. Could you repeat the last part?",
      ["Repetir a última parte: sua voz cortou.", "Compartilhar a tela de novo.", "Desligar a câmera.", "Encerrar a reunião."],
      "⟦you broke up⟧ = sua voz cortou."),
    B("Videochamadas", "Compartilhando a tela", "Você vai mostrar o painel na call.", "Monte a frase: “Deixa eu compartilhar a minha tela.”", "Let me share my screen.",
      "⟦Let me…⟧ anuncia o que você vai fazer.", { alt: ["Let me share my screen now"], xw: ["divide"] }),
    F("Videochamadas", "Testando o áudio", "Você abre a reunião online e quer checar se todos ouvem você.", "Complete a pergunta.", "Can everyone ___ me?", ["hear"],
      "⟦hear⟧ = ouvir (perceber o som). ⟦listen to⟧ é prestar atenção."),
    // Feedback e diplomacia
    C("Feedback e diplomacia", "Sugestão suave", "O relatório do analista está bom, mas o resumo está longo.", "Escolha o feedback mais construtivo.",
      ["⟦Great work! One thing that could be improved is the summary. It's a bit long.⟧", "⟦Your summary is bad.⟧", "⟦Too long. Do it again.⟧", "⟦I don't like it.⟧"],
      "Ponto positivo + melhoria específica com linguagem suave.", { sp: "Great work! One thing that could be improved is the summary." }),
    F("Feedback e diplomacia", "Já pensou?", "Você sugere incluir um gráfico.", "Complete a pergunta sugestiva.", "Have you ___ adding a chart here?", ["considered"],
      "⟦Have you considered…?⟧ sugere sem impor; depois vem ⟦-ing⟧."),
    O("Feedback e diplomacia", "Conversa de feedback", "Você dá feedback a um analista do time.", "Coloque a conversa na ordem.",
      ["⟦Thanks for the report. The analysis is really solid.⟧", "⟦Thanks! Is there anything I could improve?⟧", "⟦One thing that could be improved is the summary.⟧", "⟦Could you give me an example?⟧", "⟦Sure. Start with the three main findings.⟧"],
      "Elogio → abertura → sugestão → pedido de exemplo → exemplo concreto."),
    // Desafio final
    O("Desafio final", "Reunião com a matriz", "Desafio final: reunião online com a matriz nos EUA.", "Coloque as etapas na ordem natural.",
      ["⟦Hi everyone! How's everything going?⟧", "⟦Let me share my screen.⟧", "⟦As you can see, online sales rose by 18% this quarter.⟧", "⟦In my opinion, we should test the new campaign in one region first.⟧", "⟦I'll follow up by email with the proposal tomorrow.⟧"],
      "Small talk → compartilhar a tela → dados → opinião → próximo passo."),
    C("Desafio final", "E-mail de acompanhamento", "Desafio final: depois da reunião, você escreve à diretora.", "Escolha o melhor e-mail.",
      ["⟦Hi Laura, thanks for the meeting today. Please find attached the proposal we discussed. Looking forward to hearing from you. Best regards, Ana⟧", "⟦Laura, the proposal. Bye.⟧", "⟦Dear Laura, follows attached proposal. Kisses.⟧", "⟦Hey! Proposal attached lol⟧"],
      "Saudação, agradecimento, anexo com ⟦Please find attached⟧, expectativa de retorno e assinatura profissional."),
    H("Desafio final", "A decisão da diretora", "Desafio final: a diretora responde na call.", "Ouça e escolha o que ela decidiu.", "If the test works, we'll roll it out nationwide. Could you send me the numbers by Friday?",
      ["Se o teste funcionar, vão expandir para o país inteiro; você deve enviar os números até sexta.", "O teste já funcionou e a campanha começa sexta.", "O teste foi cancelado; você não precisa enviar nada.", "Ela vai enviar os números para você na sexta."],
      "⟦If the test works, we'll…⟧ = condição real; ⟦by Friday⟧ = até sexta."),
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
        id: 'e' + lv.id + '-' + String(pos).padStart(2, '0'), index: EXERCISES.length,
        level: lv.id, levelName: lv.nome, pos: pos, diff: difficulty(lv.id, pos), track: 'ingles',
      }));
    });
  });
  global.EnBank = { EXERCISES: EXERCISES, LEVELS: LEVELS.map(function (l) { return { id: l.id, key: l.key, nome: l.nome }; }) };
})(typeof window !== 'undefined' ? window : globalThis);
