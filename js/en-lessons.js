/* =====================================================================
   en-lessons.js — Aulas da trilha de Inglês para o Dia a Dia
   ---------------------------------------------------------------------
   Mesmo carrossel das outras trilhas, adaptado para idioma:
     1 Situação      → quando usar e a ideia central
     2 Frases-chave  → frases prontas com tradução (botão ouvir)
     3 Diálogo       → conversa real com áudio em inglês e tradução
     4 Cuidados      → erros comuns de quem fala português
     5 Sua vez       → o exercício
   Texto entre ⟦ ⟧ é inglês: aparece destacado e é narrado por voz inglesa.
   frases: "inglês | português" (uma por linha)
   dialogo: [quem, inglês, português]
   Questões de prova: [pergunta, correta, errada1, errada2, errada3, explicação]
   ===================================================================== */
(function (global) {
  'use strict';
  const L = {}, MAP = {};
  function lesson(key, topic, kw, titulo, ideia, dica, frases, notas, exemplo, cuidados, quiz) {
    L[key] = { key: key, kw: kw, titulo: titulo, ideia: ideia, analogia: dica, sintaxe: frases, notas: notas, exemplo: exemplo, cuidados: cuidados, quiz: quiz };
    MAP[topic] = key;
  }

  /* ======================= NÍVEL 1 · DIA A DIA ======================= */
  lesson("hello", "Cumprimentos", "HELLO", "Cumprimentos e apresentações",
    "Toda conversa começa com um cumprimento e uma apresentação curta. Com meia dúzia de frases você já consegue abrir uma conversa: ⟦Hi⟧, ⟦Good morning⟧, ⟦I'm Ana⟧, ⟦Nice to meet you⟧ e ⟦How are you?⟧.",
    "Pense no inglês como um jogo de ping-pong: alguém diz ⟦How are you?⟧ e espera a bola de volta. Responda e devolva: ⟦I'm fine, thanks. And you?⟧",
    "Hi! / Hello! | Oi! / Olá!\nGood morning / afternoon / evening | Bom dia / boa tarde / boa noite\nI'm Ana. What's your name? | Eu sou a Ana. Qual é o seu nome?\nNice to meet you. | Prazer em conhecer você.\nHow are you? — I'm fine, thanks. And you? | Como vai? — Bem, obrigado. E você?\nSee you later! / Bye! | Até mais! / Tchau!",
    ["⟦Good night⟧ é despedida, não cumprimento: para chegar à noite, use ⟦Good evening⟧.", "⟦Nice to meet you⟧ só vale no primeiro encontro; depois, use ⟦Nice to see you⟧.", "Responda ⟦How are you?⟧ de forma curta e devolva a pergunta: ⟦Good, thanks. And you?⟧"],
    { p: "Diálogo: primeiro dia no curso", c: "Onde: recepção de um curso\nQuem: você e uma colega nova\nObjetivo: cumprimentar e se apresentar", dialog: [["Emma", "Hi! I'm Emma. What's your name?", "Oi! Eu sou a Emma. Qual é o seu nome?"], ["Você", "Hi, Emma. I'm Lucas. Nice to meet you.", "Oi, Emma. Eu sou o Lucas. Prazer."], ["Emma", "Nice to meet you too. How are you?", "O prazer é meu. Como vai?"], ["Você", "I'm good, thanks. And you?", "Estou bem, obrigado. E você?"], ["Emma", "Great! See you in class.", "Ótima! Te vejo na aula."]] },
    ["Não traduza ao pé da letra “eu tenho 30 anos”: em inglês é ⟦I'm 30⟧, com o verbo ser.", "Evite ⟦Good night⟧ ao chegar: soa como “vou dormir”.", "⟦How do you do?⟧ é formal e antigo; no dia a dia use ⟦How are you?⟧"],
    [["Qual a resposta mais natural para ⟦How are you?⟧", "⟦I'm fine, thanks. And you?⟧", "⟦I have fine.⟧", "⟦Yes, I am.⟧", "⟦Nice to meet you.⟧", "Responda como está e devolva a pergunta."],
      ["Você chega a uma reunião às 19h. Como cumprimentar?", "⟦Good evening.⟧", "⟦Good night.⟧", "⟦Good morning.⟧", "⟦See you later.⟧", "⟦Good night⟧ é usado para se despedir ou ir dormir."],
      ["O que significa ⟦Nice to meet you⟧?", "Prazer em conhecer você", "Até logo", "Como você está?", "Bom te ver de novo", "Usado no primeiro encontro."]]);

  lesson("tobe", "Verbo to be", "TO BE", "Verbo to be: quem, como e de onde",
    "O verbo ⟦to be⟧ é o “ser” e o “estar” do inglês. Ele aparece em apresentações, profissões, sentimentos e origem: ⟦I am⟧, ⟦you are⟧, ⟦he is⟧, ⟦she is⟧, ⟦we are⟧, ⟦they are⟧.",
    "Na fala, quase sempre se usa a forma curta: ⟦I'm⟧, ⟦you're⟧, ⟦she's⟧. Ela soa mais natural do que ⟦I am⟧ completo.",
    "I'm from Brazil. | Eu sou do Brasil.\nShe's a nurse. | Ela é enfermeira.\nWe're tired. | Nós estamos cansados.\nAre you married? — Yes, I am. | Você é casado? — Sim.\nHe isn't here. | Ele não está aqui.\nWhere are you from? | De onde você é?",
    ["Pergunta: inverta o verbo e o sujeito: ⟦You are⟧ vira ⟦Are you…?⟧", "Negativa: ⟦not⟧ depois do verbo: ⟦isn't⟧, ⟦aren't⟧, ⟦I'm not⟧.", "Profissão leva ⟦a⟧ ou ⟦an⟧: ⟦She's a doctor⟧, ⟦He's an engineer⟧."],
    { p: "Diálogo: conhecendo um colega", c: "Onde: café da empresa\nQuem: você e um colega estrangeiro\nObjetivo: falar de origem e profissão", dialog: [["Tom", "Where are you from?", "De onde você é?"], ["Você", "I'm from Brazil. I'm from Recife.", "Sou do Brasil. Sou de Recife."], ["Tom", "Cool! Are you a developer?", "Legal! Você é desenvolvedor?"], ["Você", "No, I'm not. I'm a data analyst.", "Não. Sou analista de dados."], ["Tom", "Oh, nice. My wife is an analyst too.", "Ah, que bom. Minha esposa também é analista."]] },
    ["Não esqueça o artigo na profissão: “I'm engineer” está errado; diga ⟦I'm an engineer⟧.", "Idade usa ⟦to be⟧: ⟦I'm 25⟧, nunca “I have 25”.", "⟦I'm agree⟧ está errado: ⟦agree⟧ já é verbo, diga ⟦I agree⟧."],
    [["Complete: ⟦She ___ a teacher.⟧", "⟦is⟧", "⟦are⟧", "⟦am⟧", "⟦be⟧", "Ela (she) usa ⟦is⟧."],
      ["Como dizer “Eu tenho 30 anos”?", "⟦I'm 30 years old.⟧", "⟦I have 30 years.⟧", "⟦I have 30 years old.⟧", "⟦I'm have 30.⟧", "Idade usa o verbo ⟦to be⟧."],
      ["Qual é a pergunta correta?", "⟦Are you from Brazil?⟧", "⟦Are from Brazil you?⟧", "⟦Is you from Brazil?⟧", "⟦Do you are from Brazil?⟧", "Pergunta com ⟦to be⟧: verbo antes do sujeito."]]);

  lesson("numbers", "Números e preços", "$12.50", "Números, preços e soletrar",
    "Números aparecem o tempo todo: preços, telefone, endereço, quantidades. Saber dizer e entender ⟦fifteen⟧ e ⟦fifty⟧, ⟦How much is it?⟧ e soletrar o seu nome evita muita confusão.",
    "Em preços, os nativos encurtam: ⟦$12.50⟧ é ⟦twelve fifty⟧. Telefones são ditos dígito por dígito, e o zero vira ⟦oh⟧.",
    "How much is it? — It's $25. | Quanto custa? — Custa 25 dólares.\nHow much are these? | Quanto custam estes?\nThat's twelve fifty. | Dá doze e cinquenta.\nMy number is 555-0192. | Meu número é 555-0192.\nCould you spell that? | Pode soletrar?\nIt's L-U-C-A-S. | É L-U-C-A-S.",
    ["⟦thirteen⟧ (13) tem a força no final; ⟦thirty⟧ (30), no começo. O mesmo vale para 14/40, 15/50…", "⟦How much⟧ é para preço e quantidade incontável; ⟦How many⟧ é para coisas contáveis.", "No inglês, o ponto separa os centavos: ⟦$4.99⟧ = quatro dólares e noventa e nove."],
    { p: "Diálogo: na banca de frutas", c: "Onde: feira em Londres\nQuem: você e o vendedor\nObjetivo: perguntar o preço e pagar", dialog: [["Você", "Excuse me, how much are the apples?", "Com licença, quanto custam as maçãs?"], ["Seller", "They're two pounds a kilo.", "Duas libras o quilo."], ["Você", "Can I have two kilos, please?", "Pode me dar dois quilos, por favor?"], ["Seller", "Sure. That's four pounds.", "Claro. Dá quatro libras."], ["Você", "Here you are. Thanks!", "Aqui está. Obrigado!"]] },
    ["Cuidado com ⟦fifteen⟧ e ⟦fifty⟧: se não entender, peça ⟦One five or five zero?⟧", "Em inglês, a vírgula separa milhares: ⟦1,500⟧ é mil e quinhentos.", "As letras E e I confundem brasileiros: E soa “í” e I soa “ai”."],
    [["Como se pergunta o preço de um item?", "⟦How much is it?⟧", "⟦How many is it?⟧", "⟦What cost it?⟧", "⟦How price is it?⟧", "⟦How much⟧ pergunta o preço."],
      ["Como os nativos costumam falar ⟦$12.50⟧?", "⟦twelve fifty⟧", "⟦twelve comma fifty⟧", "⟦one two five zero⟧", "⟦twelve and half⟧", "Preço falado em dois blocos."],
      ["⟦1,500⟧ em inglês significa:", "mil e quinhentos", "um vírgula cinco", "quinze", "cento e cinquenta", "Vírgula separa milhares no inglês."]]);

  lesson("time", "Horas e datas", "TIME", "Horas, dias e datas",
    "Para marcar compromissos você precisa de horas e datas: ⟦What time is it?⟧, ⟦at 9 a.m.⟧, ⟦on Monday⟧, ⟦in July⟧. A preposição muda conforme o tamanho do tempo.",
    "Pense numa pirâmide: ⟦in⟧ para o maior (mês, ano), ⟦on⟧ para o dia, ⟦at⟧ para o ponto exato (horário).",
    "What time is it? — It's half past seven. | Que horas são? — Sete e meia.\nIt's a quarter to nine. | São quinze para as nove.\nThe meeting is at 10 a.m. | A reunião é às 10h.\nI work on Saturdays. | Trabalho aos sábados.\nMy birthday is in May. | Meu aniversário é em maio.\nSee you on Friday! | Te vejo na sexta!",
    ["⟦at⟧ + horário: ⟦at 3 p.m.⟧, ⟦at noon⟧, ⟦at night⟧.", "⟦on⟧ + dia ou data: ⟦on Monday⟧, ⟦on May 5th⟧.", "⟦in⟧ + mês, ano, estação ou parte do dia: ⟦in June⟧, ⟦in 2026⟧, ⟦in the morning⟧."],
    { p: "Diálogo: marcando um café", c: "Onde: mensagem de voz\nQuem: você e um amigo\nObjetivo: combinar dia e hora", dialog: [["Mike", "Are you free on Friday?", "Você está livre na sexta?"], ["Você", "Yes, I am. What time?", "Estou. Que horas?"], ["Mike", "How about at four thirty?", "Que tal às quatro e meia?"], ["Você", "Perfect. Where?", "Perfeito. Onde?"], ["Mike", "At the café on Main Street. See you on Friday!", "No café da Main Street. Te vejo na sexta!"]] },
    ["Os dias da semana e os meses começam com letra maiúscula: ⟦Monday⟧, ⟦July⟧.", "⟦a.m.⟧ é da meia-noite ao meio-dia; ⟦p.m.⟧, do meio-dia à meia-noite.", "Não use preposição com ⟦today⟧, ⟦tomorrow⟧ e ⟦next week⟧: “on tomorrow” está errado."],
    [["Complete: ⟦The class starts ___ 8 o'clock.⟧", "⟦at⟧", "⟦on⟧", "⟦in⟧", "⟦to⟧", "Horário exato usa ⟦at⟧."],
      ["Como dizer “Trabalho às segundas”?", "⟦I work on Mondays.⟧", "⟦I work in Mondays.⟧", "⟦I work at Mondays.⟧", "⟦I work Monday's.⟧", "Dia da semana usa ⟦on⟧."],
      ["⟦It's a quarter to nine⟧ significa:", "8h45", "9h15", "9h25", "8h15", "⟦a quarter to⟧ = quinze minutos para."]]);

  lesson("routine", "Rotina", "EVERY DAY", "Rotina: presente simples",
    "Para falar do que você faz sempre, use o presente simples: ⟦I work⟧, ⟦I wake up at 7⟧. Com ⟦he⟧, ⟦she⟧ e ⟦it⟧, o verbo ganha ⟦-s⟧: ⟦She works⟧. Perguntas e negativas usam ⟦do⟧ e ⟦does⟧.",
    "O ⟦-s⟧ da terceira pessoa é como um crachá: só ele, ela e “isso” usam. Quando aparece ⟦does⟧, o crachá passa para ele, e o verbo volta ao normal: ⟦Does she work?⟧",
    "I get up at 6:30. | Eu me levanto às 6h30.\nShe works from home. | Ela trabalha de casa.\nDo you drink coffee? — Yes, I do. | Você toma café? — Sim.\nHe doesn't drive. | Ele não dirige.\nI usually have lunch at noon. | Geralmente almoço ao meio-dia.\nWhat do you do on weekends? | O que você faz nos fins de semana?",
    ["Advérbios de frequência vêm antes do verbo principal: ⟦I always…⟧, ⟦She never…⟧.", "Com ⟦does⟧ e ⟦doesn't⟧, o verbo fica sem ⟦-s⟧: ⟦Does he play?⟧, ⟦He doesn't play⟧.", "⟦What do you do?⟧ pergunta a profissão."],
    { p: "Diálogo: como é o seu dia?", c: "Onde: pausa para o café\nQuem: você e uma colega\nObjetivo: descrever a rotina", dialog: [["Sarah", "What time do you start work?", "Que horas você começa a trabalhar?"], ["Você", "I usually start at eight. And you?", "Geralmente começo às oito. E você?"], ["Sarah", "I start at nine, but I wake up very early.", "Começo às nove, mas acordo bem cedo."], ["Você", "Do you go to the gym?", "Você vai à academia?"], ["Sarah", "Yes, three times a week. My husband doesn't go.", "Vou, três vezes por semana. Meu marido não vai."]] },
    ["Não esqueça o ⟦-s⟧: “She work here” está errado; o certo é ⟦She works here⟧.", "Não use ⟦does⟧ com o verbo flexionado: “Does she works?” está errado.", "⟦I'm working⟧ é algo deste momento; para rotina, use ⟦I work⟧."],
    [["Complete: ⟦He ___ in a bank.⟧", "⟦works⟧", "⟦work⟧", "⟦working⟧", "⟦is work⟧", "Terceira pessoa (he) leva ⟦-s⟧."],
      ["Qual frase está correta?", "⟦Does she like pizza?⟧", "⟦Does she likes pizza?⟧", "⟦Do she like pizza?⟧", "⟦She does likes pizza?⟧", "Com ⟦does⟧, o verbo fica sem ⟦-s⟧."],
      ["⟦What do you do?⟧ pergunta:", "a profissão da pessoa", "o que ela está fazendo agora", "o que ela fez ontem", "o que ela vai fazer", "É a forma comum de perguntar a profissão."]]);

  lesson("cafe", "Café e restaurante", "MENU", "No café e no restaurante",
    "Pedir comida é uma das situações mais comuns de viagem. As frases mágicas são ⟦I'd like…⟧ e ⟦Can I have…?⟧, sempre com ⟦please⟧. No final, peça ⟦the check⟧ (EUA) ou ⟦the bill⟧ (Reino Unido).",
    "⟦I want⟧ soa direto demais, como uma criança pedindo. ⟦I'd like⟧ é o “eu gostaria”: educado e natural.",
    "Can I have a latte, please? | Pode me ver um latte, por favor?\nI'd like the chicken salad. | Eu gostaria da salada de frango.\nFor here or to go? — To go, please. | Para comer aqui ou levar? — Para levar.\nCould we have the check, please? | Pode trazer a conta, por favor?\nIs service included? | O serviço está incluído?\nI'm allergic to nuts. | Sou alérgico a nozes.",
    ["⟦I'd like⟧ = ⟦I would like⟧, a forma educada de pedir.", "⟦Anything else?⟧ (“Mais alguma coisa?”) responde-se com ⟦That's all, thanks⟧.", "Nos EUA, a gorjeta (⟦tip⟧) é esperada e costuma ser de 15% a 20%."],
    { p: "Diálogo: no balcão da cafeteria", c: "Onde: cafeteria em Nova York\nQuem: você e o atendente\nObjetivo: pedir e pagar", dialog: [["Barista", "Hi! What can I get you?", "Oi! O que vai ser?"], ["Você", "Can I have a medium cappuccino, please?", "Pode me ver um cappuccino médio, por favor?"], ["Barista", "Sure. For here or to go?", "Claro. Para tomar aqui ou levar?"], ["Você", "To go, please. And a blueberry muffin.", "Para levar, por favor. E um muffin de mirtilo."], ["Barista", "That's seven fifty. Anything else?", "Dá sete e cinquenta. Mais alguma coisa?"], ["Você", "No, that's all. Thanks!", "Não, só isso. Obrigado!"]] },
    ["⟦I want a coffee⟧ não é errado, mas soa ríspido; prefira ⟦I'd like⟧ ou ⟦Can I have⟧.", "“Push” na porta significa empurrar, e não puxar.", "⟦Check, please⟧ é a conta; ⟦the account⟧ é conta bancária ou de usuário."],
    [["Qual o pedido mais educado?", "⟦I'd like a sandwich, please.⟧", "⟦Give me a sandwich.⟧", "⟦I want sandwich.⟧", "⟦Sandwich now.⟧", "⟦I'd like⟧ com ⟦please⟧ é o padrão educado."],
      ["Como pedir a conta num restaurante nos EUA?", "⟦Could we have the check, please?⟧", "⟦Could we have the account, please?⟧", "⟦Give the count.⟧", "⟦How much is the bill of me?⟧", "Nos EUA, a conta é ⟦the check⟧."],
      ["⟦For here or to go?⟧ pergunta se você vai:", "comer no local ou levar", "pagar agora ou depois", "querer gelo ou não", "sentar dentro ou fora", "⟦to go⟧ = para viagem."]]);

  lesson("shopping", "Compras", "SALE", "Compras e tamanhos",
    "Numa loja, você vai olhar, experimentar, pedir outro tamanho e pagar. ⟦I'm just looking⟧, ⟦Can I try it on?⟧, ⟦Do you have this in a medium?⟧ e ⟦Can I pay by card?⟧ resolvem quase tudo.",
    "⟦this⟧ e ⟦that⟧ são para uma coisa (perto e longe); ⟦these⟧ e ⟦those⟧, para várias. Aponte com a frase certa.",
    "I'm just looking, thanks. | Só estou olhando, obrigado.\nCan I try this on? | Posso experimentar isto?\nDo you have it in a large? | Tem no tamanho G?\nWhere are the fitting rooms? | Onde ficam os provadores?\nI'll take these. | Vou levar estes.\nCan I pay by card? | Posso pagar com cartão?",
    ["⟦try on⟧ é experimentar roupa; ⟦try⟧ sozinho é experimentar comida ou tentar.", "Tamanhos: ⟦small⟧ (P), ⟦medium⟧ (M), ⟦large⟧ (G).", "⟦on sale⟧ = em promoção; ⟦for sale⟧ = à venda."],
    { p: "Diálogo: na loja de roupas", c: "Onde: loja de departamentos\nQuem: você e a vendedora\nObjetivo: trocar o tamanho e pagar", dialog: [["Clerk", "Hi there! Can I help you?", "Olá! Posso ajudar?"], ["Você", "Yes, do you have this jacket in a medium?", "Sim, tem esta jaqueta no M?"], ["Clerk", "Let me check… Here you go.", "Deixa eu ver… Aqui está."], ["Você", "Thanks. Can I try it on?", "Obrigado. Posso experimentar?"], ["Clerk", "Of course. The fitting rooms are over there.", "Claro. Os provadores ficam ali."], ["Você", "It fits! I'll take it. Can I pay by card?", "Serviu! Vou levar. Posso pagar com cartão?"]] },
    ["⟦It fits⟧ fala do tamanho; ⟦It suits you⟧ fala se combina com a pessoa.", "Roupas no plural usam ⟦these⟧: ⟦these jeans⟧, ⟦these shoes⟧.", "Nos EUA, o preço da etiqueta costuma vir sem imposto (⟦tax⟧); o total sai maior no caixa."],
    [["Como dizer que só está olhando?", "⟦I'm just looking, thanks.⟧", "⟦I'm only watching.⟧", "⟦I see only.⟧", "⟦I'm looking just.⟧", "Frase pronta para recusar ajuda na loja."],
      ["⟦Can I try it on?⟧ pede para:", "experimentar a roupa", "devolver o produto", "pagar com cartão", "pegar outra cor", "⟦try on⟧ = experimentar roupa."],
      ["Complete: ⟦I'll take ___ shoes.⟧", "⟦these⟧", "⟦this⟧", "⟦it⟧", "⟦a⟧", "Plural perto de você: ⟦these⟧."]]);

  lesson("directions", "Direções", "MAP", "Pedindo e dando direções",
    "Perdido na rua? Comece com ⟦Excuse me⟧ e pergunte ⟦How do I get to…?⟧ ou ⟦Is there a … near here?⟧. As respostas usam imperativo (⟦go straight⟧, ⟦turn left⟧) e preposições de lugar (⟦next to⟧, ⟦across from⟧).",
    "Imperativo é a forma mais simples do inglês: o verbo puro, sem sujeito. ⟦Turn right⟧, ⟦Take the second left⟧.",
    "Excuse me, how do I get to the station? | Com licença, como chego à estação?\nGo straight for two blocks. | Siga reto por dois quarteirões.\nTurn left at the traffic light. | Vire à esquerda no semáforo.\nIt's next to the bank. | Fica ao lado do banco.\nIt's across from the park. | Fica em frente ao parque.\nIs it far? — No, it's a five-minute walk. | É longe? — Não, são cinco minutos a pé.",
    ["⟦on the left/right⟧ diz onde está; ⟦turn left/right⟧ diz para onde virar.", "⟦across from⟧ = do outro lado da rua, em frente.", "⟦block⟧ = quarteirão (EUA)."],
    { p: "Diálogo: procurando a farmácia", c: "Onde: rua em Chicago\nQuem: você e uma moradora\nObjetivo: chegar à farmácia", dialog: [["Você", "Excuse me, is there a pharmacy near here?", "Com licença, tem uma farmácia aqui perto?"], ["Woman", "Yes. Go straight and turn right at the corner.", "Tem. Siga reto e vire à direita na esquina."], ["Você", "Turn right at the corner. OK.", "Virar à direita na esquina. Certo."], ["Woman", "It's on the left, next to the supermarket.", "Fica à esquerda, ao lado do supermercado."], ["Você", "Is it far?", "É longe?"], ["Woman", "No, it's about a five-minute walk.", "Não, uns cinco minutos a pé."]] },
    ["Comece com ⟦Excuse me⟧, não com ⟦Sorry⟧: ⟦Sorry⟧ é para pedir desculpas.", "Repita a instrução para confirmar: ⟦So, turn right at the corner?⟧", "⟦in front of⟧ é colado na frente; do outro lado da rua é ⟦across from⟧."],
    [["Como iniciar o pedido de ajuda a um desconhecido?", "⟦Excuse me…⟧", "⟦Hey you!⟧", "⟦Sorry me…⟧", "⟦Attention!⟧", "⟦Excuse me⟧ chama a atenção com educação."],
      ["⟦Turn left at the traffic light⟧ significa:", "Vire à esquerda no semáforo", "Siga reto até o semáforo", "Fica à esquerda do semáforo", "Volte no semáforo", "⟦turn⟧ = virar."],
      ["“Fica em frente ao parque, do outro lado da rua” em inglês:", "⟦It's across from the park.⟧", "⟦It's next the park.⟧", "⟦It's in the park front.⟧", "⟦It's behind of the park.⟧", "⟦across from⟧ = do outro lado, em frente."]]);

  lesson("thereis", "There is / there are", "THERE IS", "There is / there are: o que existe por aí",
    "⟦There is⟧ e ⟦there are⟧ são o “tem” e o “há” do inglês, para dizer que algo existe num lugar: ⟦There's a pharmacy on the corner⟧, ⟦There are two hotels near here⟧.",
    "Em português dizemos “tem uma farmácia ali”. Em inglês, “tem” nesse sentido nunca é ⟦have⟧: é sempre ⟦there is⟧.",
    "There's a bakery near my house. | Tem uma padaria perto de casa.\nThere are three bedrooms. | Há três quartos.\nIs there a bus to the airport? | Tem ônibus para o aeroporto?\nAre there any good restaurants here? | Tem bons restaurantes aqui?\nThere isn't any milk. | Não tem leite.\nThere aren't many people today. | Não tem muita gente hoje.",
    ["Singular: ⟦there is⟧ (⟦there's⟧). Plural: ⟦there are⟧.", "Perguntas: ⟦Is there…?⟧ e ⟦Are there…?⟧", "⟦any⟧ aparece em perguntas e negativas: ⟦Are there any…?⟧, ⟦There aren't any…⟧."],
    { p: "Diálogo: procurando apartamento", c: "Onde: visita a um apartamento\nQuem: você e o corretor\nObjetivo: saber o que tem no prédio", dialog: [["Agent", "This is the living room. There are two bedrooms upstairs.", "Esta é a sala. Há dois quartos em cima."], ["Você", "Is there a washing machine?", "Tem máquina de lavar?"], ["Agent", "Yes, there's one in the kitchen.", "Tem, uma na cozinha."], ["Você", "Are there any supermarkets near here?", "Tem supermercados aqui perto?"], ["Agent", "There's a big one across the street.", "Tem um grande do outro lado da rua."]] },
    ["“Have a bakery near here” está errado; diga ⟦There's a bakery near here⟧.", "Com plural, não use ⟦there is⟧: ⟦There are two cars⟧.", "Na resposta curta: ⟦Yes, there is⟧ (sem contrair no final)."],
    [["Complete: ⟦___ a good hotel near the beach.⟧", "⟦There's⟧", "⟦It has⟧", "⟦Have⟧", "⟦There are⟧", "Singular: ⟦there is⟧."],
      ["Qual pergunta está correta?", "⟦Are there any taxis here?⟧", "⟦Have taxis here?⟧", "⟦Is there any taxis here?⟧", "⟦There are taxis here?⟧", "Plural: ⟦Are there…?⟧"],
      ["Como dizer “Não tem leite”?", "⟦There isn't any milk.⟧", "⟦No have milk.⟧", "⟦There aren't milk.⟧", "⟦It hasn't milk.⟧", "⟦milk⟧ é incontável: ⟦there isn't any⟧."]]);

  lesson("can", "Pedidos com can", "CAN", "Pedidos e habilidades com can e could",
    "⟦can⟧ serve para habilidade (⟦I can swim⟧), permissão (⟦Can I sit here?⟧) e pedidos (⟦Can you help me?⟧). ⟦Could⟧ deixa o pedido mais educado: ⟦Could you speak more slowly?⟧",
    "⟦can⟧ é um verbo preguiçoso: não muda com ⟦he⟧ ou ⟦she⟧ e não aceita ⟦to⟧ depois. ⟦She can drive⟧, nunca “she cans to drive”.",
    "Can you help me, please? | Você pode me ajudar, por favor?\nCould you speak more slowly? | Poderia falar mais devagar?\nCan I sit here? | Posso sentar aqui?\nI can't hear you. | Não consigo te ouvir.\nCan you swim? — Yes, I can. | Você sabe nadar? — Sei.\nCould you repeat that, please? | Poderia repetir, por favor?",
    ["Negativa: ⟦can't⟧ (ou ⟦cannot⟧).", "⟦Could you…?⟧ é mais educado que ⟦Can you…?⟧, ótimo com desconhecidos.", "Para responder a um pedido: ⟦Sure!⟧, ⟦Of course⟧, ⟦No problem⟧."],
    { p: "Diálogo: pedindo ajuda no balcão", c: "Onde: balcão de informações\nQuem: você e o atendente\nObjetivo: entender uma explicação", dialog: [["Você", "Excuse me, could you help me?", "Com licença, poderia me ajudar?"], ["Clerk", "Sure. What do you need?", "Claro. Do que precisa?"], ["Você", "Can I buy a museum pass here?", "Posso comprar o passe do museu aqui?"], ["Clerk", "Yes, you can. It's valid for three days, and it includes…", "Pode, sim. Vale três dias e inclui…"], ["Você", "Sorry, could you speak more slowly, please?", "Desculpe, poderia falar mais devagar?"], ["Clerk", "Of course. It's valid for three days.", "Claro. Vale por três dias."]] },
    ["Não use ⟦to⟧ depois de ⟦can⟧: “I can to go” está errado.", "Pedir para repetir é normal: ⟦Sorry, could you say that again?⟧", "⟦Can I…?⟧ pede permissão; ⟦Can you…?⟧ pede um favor."],
    [["Qual o pedido mais educado?", "⟦Could you open the window, please?⟧", "⟦Open the window.⟧", "⟦You open the window.⟧", "⟦Can you to open the window?⟧", "⟦Could you…, please?⟧ é o mais educado."],
      ["Complete: ⟦She ___ speak three languages.⟧", "⟦can⟧", "⟦cans⟧", "⟦can to⟧", "⟦is can⟧", "⟦can⟧ não muda com ⟦she⟧."],
      ["Como pedir para a pessoa repetir?", "⟦Could you repeat that, please?⟧", "⟦Repeat now.⟧", "⟦What you say?⟧", "⟦Again you talk?⟧", "Educado e natural."]]);

  lesson("past", "Passado simples", "YESTERDAY", "Contando o fim de semana: passado simples",
    "Para contar o que aconteceu (ontem, no fim de semana, nas férias), use o passado simples. Verbos regulares ganham ⟦-ed⟧ (⟦worked⟧, ⟦watched⟧); os irregulares mudam (⟦go → went⟧, ⟦have → had⟧). Perguntas e negativas usam ⟦did⟧.",
    "Com ⟦did⟧, o passado já está garantido; o verbo volta ao normal: ⟦Did you go?⟧, ⟦I didn't go⟧.",
    "What did you do last weekend? | O que você fez no fim de semana?\nI went to the beach. | Fui à praia.\nWe watched a movie. | Assistimos a um filme.\nDid you have a good time? | Você se divertiu?\nI didn't go out. | Não saí.\nIt was great! | Foi ótimo!",
    ["Irregulares comuns: ⟦go/went⟧, ⟦have/had⟧, ⟦see/saw⟧, ⟦eat/ate⟧, ⟦buy/bought⟧, ⟦make/made⟧.", "⟦was⟧ e ⟦were⟧ são o passado de ⟦to be⟧: ⟦It was fun⟧.", "Marcadores: ⟦yesterday⟧, ⟦last night⟧, ⟦last week⟧, ⟦two days ago⟧."],
    { p: "Diálogo: segunda-feira no escritório", c: "Onde: copa do escritório\nQuem: você e um colega\nObjetivo: contar o fim de semana", dialog: [["Jake", "Hey! How was your weekend?", "E aí! Como foi o fim de semana?"], ["Você", "It was great! I went to a concert on Saturday.", "Foi ótimo! Fui a um show no sábado."], ["Jake", "Nice! Who did you see?", "Legal! Quem você viu?"], ["Você", "A local band. And you? What did you do?", "Uma banda local. E você? O que fez?"], ["Jake", "Nothing special. I stayed home and cooked.", "Nada de especial. Fiquei em casa e cozinhei."]] },
    ["Não use o verbo no passado depois de ⟦did⟧: “Did you went?” está errado.", "⟦-ed⟧ geralmente não vira sílaba extra: ⟦worked⟧ soa “uórkt”, não “uórked”.", "⟦last⟧ já indica o passado: ⟦last Sunday⟧, sem ⟦in⟧ ou ⟦on⟧."],
    [["Qual frase está correta?", "⟦Did you see the game?⟧", "⟦Did you saw the game?⟧", "⟦Do you saw the game?⟧", "⟦You did see the game?⟧", "Com ⟦did⟧, verbo na forma base."],
      ["Passado de ⟦go⟧:", "⟦went⟧", "⟦goed⟧", "⟦gone⟧", "⟦was go⟧", "⟦go⟧ é irregular: ⟦went⟧."],
      ["Como dizer “Não saí ontem à noite”?", "⟦I didn't go out last night.⟧", "⟦I don't went out last night.⟧", "⟦I didn't went out last night.⟧", "⟦I not go out last night.⟧", "⟦didn't⟧ + verbo base."]]);

  lesson("plans", "Planos", "GOING TO", "Fazendo planos: going to",
    "Para planos já decididos, use ⟦be going to⟧ + verbo: ⟦I'm going to visit my parents⟧. Para perguntar sobre planos: ⟦What are you going to do this weekend?⟧",
    "Na fala rápida, ⟦going to⟧ costuma soar como ⟦gonna⟧. Entender isso ajuda muito em filmes e conversas.",
    "What are you going to do tonight? | O que você vai fazer hoje à noite?\nI'm going to stay home. | Vou ficar em casa.\nWe're going to travel in July. | Vamos viajar em julho.\nShe isn't going to come. | Ela não vai vir.\nAre you going to take the job? | Você vai aceitar o emprego?\nIt's going to rain. | Vai chover.",
    ["Estrutura: ⟦am/is/are⟧ + ⟦going to⟧ + verbo base.", "Também serve para previsões com evidência: nuvens escuras → ⟦It's going to rain⟧.", "Marcadores: ⟦tonight⟧, ⟦tomorrow⟧, ⟦next week⟧, ⟦this weekend⟧."],
    { p: "Diálogo: planos para o feriado", c: "Onde: chat com uma amiga\nQuem: você e Lisa\nObjetivo: contar e perguntar planos", dialog: [["Lisa", "What are you going to do on the holiday?", "O que você vai fazer no feriado?"], ["Você", "I'm going to visit my family in Minas.", "Vou visitar minha família em Minas."], ["Lisa", "Are you going to drive?", "Vai de carro?"], ["Você", "No, I'm going to take the bus. And you?", "Não, vou de ônibus. E você?"], ["Lisa", "I'm going to rest. I'm so tired!", "Vou descansar. Estou muito cansada!"]] },
    ["Não esqueça o verbo ⟦to be⟧: “I going to travel” está errado.", "Depois de ⟦going to⟧, verbo base: ⟦going to travel⟧, nunca “going to traveling”.", "⟦gonna⟧ é informal: use na fala, evite em e-mails."],
    [["Complete: ⟦We ___ going to buy a car.⟧", "⟦are⟧", "⟦is⟧", "⟦am⟧", "⟦be⟧", "⟦we⟧ usa ⟦are⟧."],
      ["Qual frase expressa um plano?", "⟦I'm going to study English next year.⟧", "⟦I study English yesterday.⟧", "⟦I studied English next year.⟧", "⟦I going study English.⟧", "⟦be going to⟧ para planos."],
      ["Você vê nuvens escuras. O que dizer?", "⟦It's going to rain.⟧", "⟦It rained.⟧", "⟦It's rain.⟧", "⟦It going to rain.⟧", "Previsão com evidência: ⟦going to⟧."]]);

  lesson("phone", "Ao telefone", "CALL", "Ao telefone e por mensagem",
    "Falar ao telefone é difícil porque não há gestos. Use frases prontas: ⟦Hello, this is Ana⟧, ⟦Can I speak to…?⟧, ⟦Hold on, please⟧, ⟦Could you say that again?⟧ e ⟦I'll call you back⟧.",
    "Ao telefone, ⟦This is…⟧ substitui ⟦I'm…⟧: é assim que você se identifica.",
    "Hello, this is Ana from NexusMarket. | Alô, aqui é a Ana, da NexusMarket.\nCan I speak to Mr. Smith, please? | Posso falar com o Sr. Smith?\nHold on, please. | Um momento, por favor.\nHe's not available right now. | Ele não está disponível agora.\nCan I leave a message? | Posso deixar um recado?\nI'll call you back later. | Te ligo mais tarde.",
    ["⟦Who's calling?⟧ = “Quem fala?”; responda ⟦This is…⟧.", "Para anotar um nome ou número, peça: ⟦Could you spell that?⟧", "⟦call back⟧ = retornar a ligação."],
    { p: "Diálogo: ligando para um fornecedor", c: "Onde: ligação para os EUA\nQuem: você e a recepcionista\nObjetivo: falar com o gerente ou deixar recado", dialog: [["Receptionist", "Good morning, Atlas Supplies. How can I help you?", "Bom dia, Atlas Supplies. Como posso ajudar?"], ["Você", "Hello, this is Ana from NexusMarket. Can I speak to Mr. Brown?", "Alô, aqui é a Ana, da NexusMarket. Posso falar com o Sr. Brown?"], ["Receptionist", "I'm sorry, he's in a meeting. Can I take a message?", "Sinto muito, ele está em reunião. Quer deixar recado?"], ["Você", "Yes, please. Could you ask him to call me back?", "Sim. Pode pedir para ele me retornar?"], ["Receptionist", "Sure. What's your number?", "Claro. Qual é o seu número?"]] },
    ["Não diga “I'm Ana” para se identificar ao telefone; use ⟦This is Ana⟧.", "Se não entendeu, peça de novo: é melhor que adivinhar números.", "⟦I'll call you back⟧ promete retorno; cumpra."],
    [["Como se identificar ao telefone?", "⟦Hello, this is Ana.⟧", "⟦Hello, here is Ana.⟧", "⟦Hello, I'm calling Ana.⟧", "⟦Hello, Ana speaking you.⟧", "Ao telefone: ⟦This is…⟧"],
      ["⟦Hold on, please⟧ significa:", "Um momento, por favor", "Desligue, por favor", "Fale mais alto", "Ligue depois", "Pedido para aguardar na linha."],
      ["Como pedir para deixar um recado?", "⟦Can I leave a message?⟧", "⟦Can I let a message?⟧", "⟦Can I give a recado?⟧", "⟦Can I left a message?⟧", "⟦leave a message⟧ = deixar recado."]]);

  /* ================== NÍVEL 2 · VIAGENS E VIDA SOCIAL ================== */
  lesson("airport", "Aeroporto", "BOARDING", "No aeroporto e na imigração",
    "No aeroporto, as perguntas são previsíveis: no check-in (⟦window or aisle?⟧), na segurança e na imigração (⟦What's the purpose of your visit?⟧, ⟦How long are you staying?⟧). Respostas curtas e claras funcionam melhor.",
    "Na imigração, responda só o que perguntaram, com frases curtas e verdadeiras. Não é hora de contar a história da viagem.",
    "I'd like a window seat, please. | Quero um assento na janela, por favor.\nHow many bags are you checking? — Just one. | Quantas malas vai despachar? — Só uma.\nWhat's the purpose of your visit? — Tourism. | Qual o motivo da viagem? — Turismo.\nHow long are you staying? — Ten days. | Quanto tempo vai ficar? — Dez dias.\nWhere is gate 22? | Onde fica o portão 22?\nMy flight was delayed. | Meu voo atrasou.",
    ["⟦boarding pass⟧ = cartão de embarque; ⟦gate⟧ = portão.", "⟦check in⟧ (verbo) e ⟦carry-on⟧ (mala de mão).", "⟦delayed⟧ = atrasado; ⟦canceled⟧ = cancelado; ⟦on time⟧ = no horário."],
    { p: "Diálogo: na imigração", c: "Onde: aeroporto de Miami\nQuem: você e o oficial\nObjetivo: passar pela imigração", dialog: [["Officer", "Good afternoon. Passport, please.", "Boa tarde. Passaporte, por favor."], ["Você", "Here you are.", "Aqui está."], ["Officer", "What's the purpose of your visit?", "Qual o motivo da viagem?"], ["Você", "Tourism. I'm visiting friends.", "Turismo. Vou visitar amigos."], ["Officer", "How long are you staying?", "Quanto tempo vai ficar?"], ["Você", "Two weeks. I have my return ticket here.", "Duas semanas. Tenho a passagem de volta aqui."]] },
    ["⟦Purpose⟧ não é “propósito” filosófico: é o motivo da viagem.", "Não brinque na imigração: respostas objetivas.", "⟦aisle⟧ (corredor) se pronuncia “ail”; o S é mudo."],
    [["⟦Window or aisle?⟧ pergunta sobre:", "o assento (janela ou corredor)", "a refeição", "a mala", "o portão", "Escolha de assento."],
      ["Resposta adequada para ⟦How long are you staying?⟧", "⟦Ten days.⟧", "⟦By plane.⟧", "⟦Tourism.⟧", "⟦In a hotel.⟧", "Pergunta sobre duração."],
      ["⟦My flight was delayed⟧ significa:", "Meu voo atrasou", "Meu voo foi cancelado", "Perdi meu voo", "Meu voo chegou cedo", "⟦delayed⟧ = atrasado."]]);

  lesson("hotel", "Hotel", "CHECK-IN", "No hotel: check-in e problemas",
    "No hotel você faz o check-in, tira dúvidas e, às vezes, resolve problemas. Comece com ⟦I have a reservation under the name…⟧ e use ⟦Is breakfast included?⟧, ⟦What time is check-out?⟧ e ⟦The air conditioning isn't working⟧.",
    "Para reclamar de algo no quarto, descreva o problema e peça ajuda: ⟦The shower isn't working. Could you send someone?⟧",
    "I have a reservation under the name Silva. | Tenho uma reserva no nome Silva.\nIs breakfast included? | O café da manhã está incluído?\nWhat time is check-out? | Que horas é o check-out?\nCould I have a late check-out? | Posso fazer o check-out mais tarde?\nThe air conditioning isn't working. | O ar-condicionado não está funcionando.\nCould I have some extra towels? | Pode me trazer toalhas extras?",
    ["⟦under the name…⟧ = em nome de…", "Problema + ⟦isn't working⟧ / ⟦doesn't work⟧.", "⟦front desk⟧ = recepção."],
    { p: "Diálogo: chegando ao hotel", c: "Onde: recepção de um hotel em Londres\nQuem: você e o recepcionista\nObjetivo: fazer o check-in e tirar dúvidas", dialog: [["Receptionist", "Good evening. How can I help you?", "Boa noite. Como posso ajudar?"], ["Você", "Hi, I have a reservation under the name Costa.", "Olá, tenho uma reserva no nome Costa."], ["Receptionist", "Yes, three nights. Can I see your passport?", "Sim, três noites. Posso ver o seu passaporte?"], ["Você", "Sure. Is breakfast included?", "Claro. O café da manhã está incluído?"], ["Receptionist", "Yes, it's served from seven to ten.", "Sim, é servido das sete às dez."], ["Você", "Great. And what time is check-out?", "Ótimo. E que horas é o check-out?"]] },
    ["⟦book⟧ também é verbo: ⟦I booked a room⟧ = reservei um quarto.", "Use ⟦isn't working⟧ para defeitos; “is broken” soa mais grave.", "Peça com ⟦Could I have…?⟧, não com “I want”."],
    [["Como iniciar o check-in?", "⟦I have a reservation under the name Lima.⟧", "⟦I have a reserve in name Lima.⟧", "⟦I booked to Lima.⟧", "⟦My name reservation is Lima.⟧", "Frase padrão do check-in."],
      ["Como avisar que o chuveiro não funciona?", "⟦The shower isn't working.⟧", "⟦The shower is not function.⟧", "⟦The shower don't work.⟧", "⟦The shower no working.⟧", "⟦isn't working⟧ para defeitos."],
      ["⟦Is breakfast included?⟧ pergunta se:", "o café da manhã está incluído", "o café é servido no quarto", "o café é cobrado à parte", "tem café no quarto", "⟦included⟧ = incluído."]]);

  lesson("transport", "Transporte", "TICKET", "Transporte: passagens e trajetos",
    "Ônibus, metrô e trem têm um vocabulário próprio: ⟦a single/one-way ticket⟧, ⟦a return/round-trip ticket⟧, ⟦Which platform?⟧, ⟦Does this train stop at…?⟧ e ⟦How long does it take?⟧.",
    "No transporte, ⟦get on⟧ é entrar e ⟦get off⟧ é descer: ⟦Get off at the next stop⟧.",
    "A round-trip ticket to Boston, please. | Uma passagem de ida e volta para Boston.\nWhich platform does it leave from? | De qual plataforma ele sai?\nDoes this bus go downtown? | Este ônibus vai para o centro?\nHow long does it take? | Quanto tempo leva?\nWhere do I get off? | Onde eu desço?\nI missed my stop. | Perdi o meu ponto.",
    ["⟦one-way⟧ (EUA) = ⟦single⟧ (Reino Unido): só ida.", "⟦round-trip⟧ (EUA) = ⟦return⟧ (Reino Unido): ida e volta.", "⟦How long does it take?⟧ pergunta a duração do trajeto."],
    { p: "Diálogo: na estação de trem", c: "Onde: bilheteria em Nova York\nQuem: você e o atendente\nObjetivo: comprar a passagem e saber a plataforma", dialog: [["Você", "Hi, a round-trip ticket to Philadelphia, please.", "Oi, uma passagem de ida e volta para a Filadélfia."], ["Agent", "Coming back today?", "Volta hoje?"], ["Você", "Yes, this evening. How long does it take?", "Sim, à noite. Quanto tempo leva?"], ["Agent", "About an hour and a half. That's sixty dollars.", "Cerca de uma hora e meia. São sessenta dólares."], ["Você", "Which platform does it leave from?", "De qual plataforma sai?"], ["Agent", "Platform 7, at 9:15.", "Plataforma 7, às 9h15."]] },
    ["⟦Take⟧ é o verbo do transporte: ⟦take the bus⟧, ⟦take a taxi⟧.", "⟦Miss⟧ = perder o ônibus, voo ou ponto: ⟦I missed the train⟧.", "Não confunda ⟦ticket⟧ (passagem) com ⟦fine⟧ (multa)."],
    [["Passagem de ida e volta nos EUA:", "⟦round-trip ticket⟧", "⟦one-way ticket⟧", "⟦single ticket⟧", "⟦go-back ticket⟧", "⟦round-trip⟧ = ida e volta."],
      ["⟦Where do I get off?⟧ pergunta:", "onde descer", "onde comprar a passagem", "onde embarcar", "onde fica a plataforma", "⟦get off⟧ = descer."],
      ["Como perguntar quanto tempo dura o trajeto?", "⟦How long does it take?⟧", "⟦How much time it take?⟧", "⟦How many time?⟧", "⟦How long it is taking?⟧", "Pergunta padrão de duração."]]);

  lesson("health", "Saúde e farmácia", "PHARMACY", "Saúde: na farmácia e no médico",
    "Passar mal fora do país assusta, mas poucas frases resolvem: ⟦I have a headache⟧, ⟦I don't feel well⟧, ⟦I need something for a sore throat⟧, ⟦I'm allergic to…⟧ e ⟦I need to see a doctor⟧.",
    "Sintomas usam ⟦I have a…⟧: ⟦a headache⟧, ⟦a fever⟧, ⟦a cold⟧, ⟦a stomachache⟧. Dor em geral é ⟦It hurts⟧.",
    "I don't feel well. | Não estou me sentindo bem.\nI have a headache and a fever. | Estou com dor de cabeça e febre.\nDo you have something for a cough? | Tem algo para tosse?\nI'm allergic to penicillin. | Sou alérgico a penicilina.\nMy back hurts. | Minhas costas doem.\nHow often should I take it? | De quanto em quanto tempo devo tomar?",
    ["⟦ache⟧ = dor contínua: ⟦headache⟧, ⟦toothache⟧, ⟦stomachache⟧.", "⟦sore throat⟧ = dor de garganta.", "⟦prescription⟧ = receita médica; ⟦over the counter⟧ = sem receita."],
    { p: "Diálogo: na farmácia", c: "Onde: farmácia em Toronto\nQuem: você e a farmacêutica\nObjetivo: comprar um remédio", dialog: [["Pharmacist", "Hi. How can I help you?", "Olá. Como posso ajudar?"], ["Você", "I have a sore throat and a cough. Do you have something for that?", "Estou com dor de garganta e tosse. Tem algo para isso?"], ["Pharmacist", "Do you have a fever?", "Está com febre?"], ["Você", "No, I don't. But I'm allergic to aspirin.", "Não. Mas sou alérgico a aspirina."], ["Pharmacist", "OK. Try this syrup. Take it every six hours.", "Certo. Experimente este xarope. Tome a cada seis horas."]] },
    ["Não diga “I'm with headache”; o certo é ⟦I have a headache⟧.", "Avise alergias sempre: ⟦I'm allergic to…⟧", "⟦Drugstore⟧ (EUA) e ⟦chemist's⟧ (Reino Unido) também são farmácia."],
    [["Como dizer “Estou com dor de cabeça”?", "⟦I have a headache.⟧", "⟦I'm with headache.⟧", "⟦I have head pain.⟧", "⟦My head is ache.⟧", "Sintomas: ⟦I have a…⟧"],
      ["⟦sore throat⟧ significa:", "dor de garganta", "dor nas costas", "febre", "resfriado", "⟦throat⟧ = garganta."],
      ["Como avisar uma alergia?", "⟦I'm allergic to nuts.⟧", "⟦I have allergic of nuts.⟧", "⟦I'm allergy nuts.⟧", "⟦Nuts make me allergy.⟧", "⟦allergic to⟧."]]);

  lesson("experiences", "Present perfect", "EVER", "Experiências: present perfect",
    "O ⟦present perfect⟧ (⟦have/has⟧ + particípio) fala de experiências e de coisas que conectam o passado ao presente, sem dizer quando: ⟦Have you ever been to London?⟧, ⟦I've never tried sushi⟧, ⟦I've already finished⟧.",
    "Pergunta sem data → ⟦present perfect⟧. Com data ou momento definido (⟦yesterday⟧, ⟦in 2019⟧) → passado simples.",
    "Have you ever been to Canada? | Você já foi ao Canadá?\nI've been there twice. | Já fui lá duas vezes.\nI've never eaten sushi. | Nunca comi sushi.\nShe has just arrived. | Ela acabou de chegar.\nHave you finished yet? | Você já terminou?\nI went there in 2022. | Fui lá em 2022.",
    ["⟦ever⟧ (alguma vez) em perguntas; ⟦never⟧ (nunca) em afirmações.", "⟦just⟧ = acabou de; ⟦already⟧ = já; ⟦yet⟧ = ainda (no fim de perguntas e negativas).", "⟦been to⟧ = foi e voltou; ⟦gone to⟧ = foi e ainda está lá."],
    { p: "Diálogo: conversa sobre viagens", c: "Onde: jantar com colegas estrangeiros\nQuem: você e Chris\nObjetivo: falar de experiências", dialog: [["Chris", "Have you ever been to the United States?", "Você já foi aos Estados Unidos?"], ["Você", "Yes, I have. I went to Orlando in 2019.", "Já. Fui a Orlando em 2019."], ["Chris", "Have you ever tried real Texas barbecue?", "Já experimentou churrasco texano de verdade?"], ["Você", "No, I've never been to Texas. Have you been to Brazil?", "Não, nunca fui ao Texas. Você já foi ao Brasil?"], ["Chris", "Not yet, but I've always wanted to go!", "Ainda não, mas sempre quis ir!"]] },
    ["Não use data com ⟦present perfect⟧: “I have been there in 2019” está errado.", "Particípios irregulares: ⟦be/been⟧, ⟦see/seen⟧, ⟦eat/eaten⟧, ⟦do/done⟧.", "⟦yet⟧ vai no final: ⟦Have you eaten yet?⟧"],
    [["Qual frase está correta?", "⟦I've visited Paris twice.⟧", "⟦I've visited Paris in 2020.⟧", "⟦I visited Paris ever.⟧", "⟦I have visit Paris.⟧", "Experiência sem data: ⟦present perfect⟧."],
      ["Como perguntar se a pessoa já foi ao Japão?", "⟦Have you ever been to Japan?⟧", "⟦Did you ever went to Japan?⟧", "⟦Have you ever go to Japan?⟧", "⟦Are you ever been to Japan?⟧", "⟦Have you ever been to…?⟧"],
      ["⟦She has just left⟧ significa:", "Ela acabou de sair", "Ela só saiu", "Ela já tinha saído", "Ela vai sair", "⟦just⟧ = acabou de."]]);

  lesson("compare", "Comparativos", "BETTER", "Comparando opções",
    "Para escolher hotel, voo ou produto, você compara: ⟦cheaper than⟧, ⟦more comfortable than⟧, ⟦the best⟧, ⟦as good as⟧. Palavras curtas ganham ⟦-er⟧ e ⟦-est⟧; as longas usam ⟦more⟧ e ⟦the most⟧.",
    "Conte as sílabas: ⟦cheap⟧ (1) → ⟦cheaper⟧; ⟦expensive⟧ (3) → ⟦more expensive⟧. E decore os rebeldes: ⟦good/better/best⟧ e ⟦bad/worse/worst⟧.",
    "This hotel is cheaper than that one. | Este hotel é mais barato que aquele.\nThe train is more comfortable than the bus. | O trem é mais confortável que o ônibus.\nIt's the best restaurant in town. | É o melhor restaurante da cidade.\nToday is worse than yesterday. | Hoje está pior que ontem.\nIt's not as expensive as I thought. | Não é tão caro quanto pensei.\nWhich one is faster? | Qual é mais rápido?",
    ["Comparativo + ⟦than⟧: ⟦bigger than⟧.", "Superlativo com ⟦the⟧: ⟦the biggest⟧, ⟦the most popular⟧.", "Igualdade: ⟦as … as⟧: ⟦as fast as⟧."],
    { p: "Diálogo: escolhendo o voo", c: "Onde: agência de viagens online (chat)\nQuem: você e o atendente\nObjetivo: comparar duas opções", dialog: [["Agent", "We have two flights: one at 8 a.m. and one at 2 p.m.", "Temos dois voos: um às 8h e outro às 14h."], ["Você", "Which one is cheaper?", "Qual é mais barato?"], ["Agent", "The morning flight is cheaper, but it has a stop.", "O da manhã é mais barato, mas tem escala."], ["Você", "Is the afternoon flight faster?", "O da tarde é mais rápido?"], ["Agent", "Yes, it's direct. It's the fastest option.", "Sim, é direto. É a opção mais rápida."], ["Você", "I'll take the faster one, then.", "Então vou ficar com o mais rápido."]] },
    ["Não use ⟦more⟧ com ⟦-er⟧: “more cheaper” está errado.", "⟦than⟧ (do que) é diferente de ⟦then⟧ (então).", "⟦the most⟧ é superlativo; não diga “the more expensive of all”."],
    [["Complete: ⟦This phone is ___ than mine.⟧", "⟦better⟧", "⟦more good⟧", "⟦gooder⟧", "⟦best⟧", "⟦good → better⟧."],
      ["Qual está correto?", "⟦It's the most beautiful city I know.⟧", "⟦It's the beautifulest city I know.⟧", "⟦It's most beautiful than all.⟧", "⟦It's the more beautiful city.⟧", "Adjetivo longo: ⟦the most⟧."],
      ["⟦not as expensive as⟧ significa:", "não tão caro quanto", "mais caro que", "o mais caro", "muito caro", "Comparação de igualdade negativa."]]);

  lesson("future", "Futuro com will", "WILL", "Ofertas, promessas e decisões: will",
    "⟦will⟧ aparece em decisões na hora (⟦I'll have the soup⟧), ofertas (⟦I'll help you⟧), promessas (⟦I'll call you⟧) e previsões de opinião (⟦I think it will be fine⟧).",
    "Se o plano já estava decidido, use ⟦going to⟧. Se você decidiu agora, enquanto fala, use ⟦will⟧.",
    "I'll have the steak, please. | Vou querer o filé, por favor.\nDon't worry, I'll help you. | Não se preocupe, eu te ajudo.\nI'll send you the file today. | Te mando o arquivo hoje.\nI think it will rain tomorrow. | Acho que vai chover amanhã.\nI won't tell anyone. | Não vou contar a ninguém.\nWill you be at the party? | Você vai estar na festa?",
    ["Forma curta: ⟦I'll⟧, ⟦you'll⟧, ⟦she'll⟧; negativa: ⟦won't⟧.", "⟦will⟧ + verbo base, sem ⟦to⟧: ⟦I'll go⟧.", "Com ⟦I think⟧ / ⟦probably⟧ para previsões."],
    { p: "Diálogo: oferecendo ajuda", c: "Onde: escritório\nQuem: você e uma colega atarefada\nObjetivo: oferecer ajuda e prometer prazos", dialog: [["Kate", "I'm so busy. I still have to finish the report.", "Estou muito ocupada. Ainda tenho que terminar o relatório."], ["Você", "I'll help you. I'll check the numbers.", "Eu te ajudo. Eu confiro os números."], ["Kate", "Really? Thanks! Will it take long?", "Sério? Obrigada! Vai demorar?"], ["Você", "No, I'll send them to you in an hour.", "Não, te mando em uma hora."], ["Kate", "You're a lifesaver!", "Você salvou o meu dia!"]] },
    ["Não use ⟦to⟧ depois de ⟦will⟧: “I will to call” está errado.", "⟦won't⟧ = ⟦will not⟧; não confunda com ⟦want⟧.", "Em pedidos de restaurante, ⟦I'll have…⟧ é muito natural."],
    [["O telefone toca. Você decide atender:", "⟦I'll get it.⟧", "⟦I getting it.⟧", "⟦I get it yesterday.⟧", "⟦I will to get it.⟧", "Decisão na hora: ⟦will⟧."],
      ["Negativa de ⟦will⟧:", "⟦won't⟧", "⟦willn't⟧", "⟦don't will⟧", "⟦not will⟧", "⟦will not⟧ = ⟦won't⟧."],
      ["⟦I'll call you tonight⟧ expressa:", "uma promessa", "um hábito", "algo no passado", "uma obrigação", "⟦will⟧ para promessas."]]);

  lesson("advice", "Conselhos e regras", "SHOULD", "Conselhos e regras: should, must, have to",
    "Para dar conselhos, use ⟦should⟧ (⟦You should see a doctor⟧). Para regras e obrigações, ⟦must⟧ e ⟦have to⟧ (⟦You must wear a seatbelt⟧). Para dizer que algo não é necessário, ⟦don't have to⟧.",
    "Cuidado com a armadilha: ⟦mustn't⟧ é “proibido”; ⟦don't have to⟧ é “não precisa”.",
    "You should try the local food. | Você deveria provar a comida local.\nYou shouldn't walk alone at night. | Você não deveria andar sozinho à noite.\nYou must show your ID. | Você deve mostrar o documento.\nYou mustn't smoke here. | É proibido fumar aqui.\nI have to work tomorrow. | Tenho que trabalhar amanhã.\nYou don't have to pay. It's free. | Você não precisa pagar. É grátis.",
    ["⟦should⟧ = conselho; ⟦must⟧ = regra forte; ⟦have to⟧ = obrigação externa.", "⟦don't have to⟧ = não é necessário.", "⟦mustn't⟧ = proibido."],
    { p: "Diálogo: dicas para a viagem", c: "Onde: conversa com uma amiga que mora em Londres\nQuem: você e Amy\nObjetivo: pedir conselhos", dialog: [["Você", "I'm going to London next month. Any tips?", "Vou a Londres no mês que vem. Alguma dica?"], ["Amy", "You should get an Oyster card for the subway.", "Você deveria comprar um cartão Oyster para o metrô."], ["Você", "Do I have to buy it in advance?", "Tenho que comprar com antecedência?"], ["Amy", "No, you don't have to. You can buy it at the station.", "Não precisa. Dá para comprar na estação."], ["Amy", "And you shouldn't stand on the left side of the escalator!", "E não fique do lado esquerdo da escada rolante!"]] },
    ["Não use ⟦to⟧ depois de ⟦should⟧ e ⟦must⟧: “You should to go” está errado.", "⟦must⟧ é forte; em conselhos do dia a dia, prefira ⟦should⟧.", "⟦have to⟧ muda com ⟦he/she⟧: ⟦She has to work⟧."],
    [["Conselho a um amigo cansado:", "⟦You should rest.⟧", "⟦You must to rest.⟧", "⟦You don't have to rest.⟧", "⟦You should resting.⟧", "Conselho: ⟦should⟧ + verbo base."],
      ["⟦You don't have to come⟧ significa:", "Você não precisa vir", "Você está proibido de vir", "Você deve vir", "Você deveria vir", "⟦don't have to⟧ = não é necessário."],
      ["Placa de proibição:", "⟦You mustn't park here.⟧", "⟦You don't have to park here.⟧", "⟦You should park here.⟧", "⟦You have to park here.⟧", "⟦mustn't⟧ = proibido."]]);

  lesson("smalltalk", "Small talk", "SMALL TALK", "Small talk: conversa leve",
    "O ⟦small talk⟧ é a conversa leve que abre portas: clima, fim de semana, trabalho, viagem. Ele cria conexão antes de assuntos sérios. O segredo é responder e devolver uma pergunta.",
    "Use a regra do “responde + detalhe + pergunta”: ⟦It was good! I went hiking. How about you?⟧",
    "Lovely weather today, isn't it? | Que tempo bom hoje, não?\nHow was your weekend? | Como foi seu fim de semana?\nWhat do you do? | Com o que você trabalha?\nHow long have you been here? | Há quanto tempo você está aqui?\nThat sounds great! | Parece ótimo!\nIt was nice talking to you. | Foi bom conversar com você.",
    ["Assuntos seguros: clima, viagens, comida, fim de semana, trabalho em geral.", "Evite no começo: salário, religião, política, idade.", "Reações curtas mantêm a conversa viva: ⟦Really?⟧, ⟦That's interesting!⟧, ⟦No way!⟧"],
    { p: "Diálogo: antes da reunião começar", c: "Onde: sala de reunião, esperando os outros\nQuem: você e um parceiro de negócios\nObjetivo: quebrar o gelo", dialog: [["Daniel", "So, how was your flight?", "E aí, como foi o voo?"], ["Você", "It was long, but fine. I watched two movies!", "Foi longo, mas tranquilo. Assisti a dois filmes!"], ["Daniel", "Ha! Is this your first time in Chicago?", "Ha! É sua primeira vez em Chicago?"], ["Você", "Yes, it is. It's colder than I expected. Do you live here?", "É. Está mais frio do que eu esperava. Você mora aqui?"], ["Daniel", "Yes, for ten years. You get used to it!", "Moro, há dez anos. A gente se acostuma!"]] },
    ["Respostas de uma palavra matam a conversa: complete com um detalhe.", "⟦How do you do?⟧ não é ⟦How are you doing?⟧; a segunda é bem mais comum.", "Para encerrar com educação: ⟦Well, it was nice talking to you⟧."],
    [["Melhor resposta para ⟦How was your weekend?⟧", "⟦Pretty good! I went to the beach. How about yours?⟧", "⟦Yes.⟧", "⟦I have weekend.⟧", "⟦Fine. Bye.⟧", "Responder, dar detalhe e devolver."],
      ["Qual assunto é mais seguro no small talk?", "o clima", "salário", "religião", "política", "Clima é neutro e universal."],
      ["Como encerrar uma conversa com educação?", "⟦It was nice talking to you.⟧", "⟦Stop talking now.⟧", "⟦I go.⟧", "⟦Finish conversation.⟧", "Encerramento cordial."]]);

  lesson("invites", "Convites", "INVITE", "Convites: aceitar e recusar com educação",
    "Convidar e responder bem é social e profissional. Convite: ⟦Would you like to…?⟧ ou ⟦Do you want to…?⟧. Aceitar: ⟦I'd love to!⟧. Recusar sem ofender: ⟦I'm afraid I can't. I have…⟧ e, se possível, uma alternativa.",
    "Uma boa recusa tem três partes: agradeça, dê o motivo e sugira outra data. ⟦Thanks! I'm afraid I can't on Friday. How about Saturday?⟧",
    "Would you like to have dinner with us? | Você gostaria de jantar com a gente?\nDo you want to grab a coffee? | Quer tomar um café?\nI'd love to! | Adoraria!\nSounds great. What time? | Parece ótimo. Que horas?\nI'm afraid I can't. I have a meeting. | Infelizmente não posso. Tenho uma reunião.\nMaybe another time? | Quem sabe outro dia?",
    ["⟦Would you like…?⟧ é mais formal que ⟦Do you want…?⟧", "⟦I'm afraid…⟧ suaviza más notícias: “infelizmente”.", "⟦grab a coffee/a bite⟧ = tomar um café, comer algo rápido."],
    { p: "Diálogo: convite para um happy hour", c: "Onde: escritório, sexta-feira\nQuem: você e um colega\nObjetivo: recusar e sugerir outra data", dialog: [["Ryan", "We're going for drinks after work. Would you like to come?", "Vamos sair para beber depois do trabalho. Quer vir?"], ["Você", "Thanks for asking! I'm afraid I can't today.", "Obrigado pelo convite! Infelizmente hoje não posso."], ["Ryan", "No worries. Busy weekend?", "Sem problemas. Fim de semana corrido?"], ["Você", "My parents are visiting. Maybe next Friday?", "Meus pais vão me visitar. Quem sabe na próxima sexta?"], ["Ryan", "Sure, next Friday it is!", "Fechado, próxima sexta!"]] },
    ["Na resposta curta, ⟦I'd love to⟧ termina em ⟦to⟧: não precisa repetir o verbo.", "Um ⟦No⟧ seco soa rude; use ⟦I'm afraid I can't⟧.", "⟦I'm afraid⟧ aqui não é “estou com medo”."],
    [["Como aceitar um convite com entusiasmo?", "⟦I'd love to!⟧", "⟦I loved.⟧", "⟦I'm love it.⟧", "⟦Yes, I would loving.⟧", "Resposta natural e calorosa."],
      ["⟦I'm afraid I can't⟧ significa:", "Infelizmente não posso", "Estou com medo de ir", "Não quero", "Talvez eu vá", "⟦I'm afraid⟧ suaviza a recusa."],
      ["Qual é um convite formal?", "⟦Would you like to join us for lunch?⟧", "⟦You come lunch?⟧", "⟦Lunch, yes?⟧", "⟦Want lunch with we?⟧", "⟦Would you like to…?⟧"]]);

  lesson("complaints", "Reclamações", "REFUND", "Reclamações educadas",
    "Reclamar em inglês é diferente: ser educado e direto resolve mais do que ser agressivo. Estrutura: abra com ⟦I'm afraid there's a problem with…⟧, explique e diga o que você quer: ⟦Could I get a refund?⟧ ou ⟦Could you replace it?⟧.",
    "Pense em três passos: problema, fato e pedido. ⟦There's a problem with my order. It arrived damaged. Could you send a new one?⟧",
    "I'm afraid there's a problem with my room. | Infelizmente há um problema com o meu quarto.\nThis isn't what I ordered. | Isto não é o que eu pedi.\nIt arrived damaged. | Chegou danificado.\nCould I get a refund? | Posso ter o dinheiro de volta?\nCould you replace it, please? | Pode trocar, por favor?\nI'd like to speak to the manager. | Gostaria de falar com o gerente.",
    ["⟦refund⟧ = reembolso; ⟦replace⟧ = trocar por outro; ⟦exchange⟧ = trocar.", "⟦receipt⟧ = nota/recibo (o P é mudo).", "Agradeça a solução: ⟦Thanks for sorting this out⟧."],
    { p: "Diálogo: pedido errado no restaurante", c: "Onde: restaurante\nQuem: você e o garçom\nObjetivo: resolver o pedido errado com educação", dialog: [["Você", "Excuse me, I'm afraid this isn't what I ordered.", "Com licença, acho que este não é o meu pedido."], ["Waiter", "Oh, I'm sorry. What did you order?", "Ah, desculpe. O que o senhor pediu?"], ["Você", "I ordered the grilled fish, not the chicken.", "Pedi o peixe grelhado, não o frango."], ["Waiter", "I'm so sorry. I'll bring it right away.", "Mil desculpas. Trago agora mesmo."], ["Você", "Thank you. No problem.", "Obrigado. Sem problemas."]] },
    ["“I want my money back” funciona, mas soa agressivo; prefira ⟦Could I get a refund?⟧", "Mantenha a calma: ⟦I understand, but…⟧ funciona melhor que levantar a voz.", "Guarde o ⟦receipt⟧: ele é pedido para trocas."],
    [["Abertura educada para uma reclamação:", "⟦I'm afraid there's a problem with my order.⟧", "⟦Your service is terrible!⟧", "⟦Problem! Problem!⟧", "⟦You did wrong my order.⟧", "Comece suavizando."],
      ["⟦refund⟧ significa:", "reembolso", "troca por outro produto", "desconto", "recibo", "Dinheiro de volta."],
      ["⟦It arrived damaged⟧ significa:", "Chegou danificado", "Chegou atrasado", "Chegou incompleto", "Não chegou", "⟦damaged⟧ = danificado."]]);

  lesson("phrasal1", "Phrasal verbs do dia a dia", "PICK UP", "Phrasal verbs do dia a dia",
    "⟦Phrasal verbs⟧ são verbos com uma partícula (⟦up⟧, ⟦off⟧, ⟦out⟧…) que muda o sentido. Nativos usam o tempo todo: ⟦wake up⟧, ⟦turn off⟧, ⟦look for⟧, ⟦pick up⟧, ⟦find out⟧, ⟦give up⟧.",
    "Aprenda cada ⟦phrasal verb⟧ como uma palavra nova, sempre dentro de uma frase. ⟦Turn off the lights⟧ vale mais do que “turn off = desligar”.",
    "I wake up at 6. | Eu acordo às 6.\nCould you turn off the TV? | Pode desligar a TV?\nI'm looking for my keys. | Estou procurando minhas chaves.\nI'll pick you up at 8. | Te busco às 8.\nI found out the truth. | Descobri a verdade.\nDon't give up! | Não desista!",
    ["⟦turn on/off⟧ = ligar/desligar aparelhos.", "⟦pick up⟧ = buscar alguém, pegar algo, atender o telefone.", "Com pronome, ele fica no meio: ⟦turn it off⟧, ⟦pick me up⟧."],
    { p: "Diálogo: combinando a carona", c: "Onde: mensagem de áudio\nQuem: você e um amigo\nObjetivo: combinar a carona para o aeroporto", dialog: [["Sam", "What time does your flight take off?", "Que horas o seu voo decola?"], ["Você", "At ten. Can you pick me up at seven?", "Às dez. Você pode me buscar às sete?"], ["Sam", "Sure. Don't forget to turn off the gas!", "Claro. Não esqueça de desligar o gás!"], ["Você", "Ha, I won't. I'm looking for my passport now.", "Ha, não vou. Estou procurando meu passaporte agora."], ["Sam", "Good luck! See you at seven.", "Boa sorte! Te vejo às sete."]] },
    ["“Turn off it” está errado: com pronome, ⟦turn it off⟧.", "⟦look for⟧ (procurar) é diferente de ⟦look at⟧ (olhar para).", "⟦take off⟧ = decolar ou tirar (roupa)."],
    [["⟦I'm looking for my phone⟧ significa:", "Estou procurando meu celular", "Estou olhando para meu celular", "Estou cuidando do meu celular", "Estou desligando meu celular", "⟦look for⟧ = procurar."],
      ["Qual está correta?", "⟦Please turn it off.⟧", "⟦Please turn off it.⟧", "⟦Please off turn it.⟧", "⟦Please turn it of.⟧", "Pronome entre o verbo e a partícula."],
      ["⟦I'll pick you up at 8⟧ significa:", "Te busco às 8", "Te ligo às 8", "Te acordo às 8", "Te espero às 8", "⟦pick up⟧ = buscar."]]);

  lesson("stories", "Contando histórias", "WAS -ING", "Contando histórias: past continuous",
    "Para contar uma história, você precisa do cenário e do acontecimento. O ⟦past continuous⟧ (⟦was/were⟧ + ⟦-ing⟧) monta o cenário; o passado simples traz a ação que interrompe: ⟦I was walking home when it started to rain⟧.",
    "Imagine um filme: o ⟦past continuous⟧ é a câmera rodando (⟦I was driving⟧) e o passado simples é o susto (⟦when a dog crossed the street⟧).",
    "I was having dinner when you called. | Eu estava jantando quando você ligou.\nWhat were you doing at 8? | O que você estava fazendo às 8?\nIt was raining all day. | Choveu o dia todo.\nWhile I was waiting, I read a book. | Enquanto esperava, li um livro.\nWe were talking when the lights went out. | Estávamos conversando quando a luz acabou.\nThey weren't listening. | Eles não estavam ouvindo.",
    ["⟦when⟧ costuma introduzir a ação curta (passado simples).", "⟦while⟧ costuma introduzir a ação longa (past continuous).", "⟦was⟧ com ⟦I/he/she/it⟧; ⟦were⟧ com ⟦you/we/they⟧."],
    { p: "Diálogo: o dia do apagão", c: "Onde: almoço com colegas\nQuem: você e Olivia\nObjetivo: contar o que aconteceu", dialog: [["Olivia", "What happened yesterday? You were late!", "O que aconteceu ontem? Você se atrasou!"], ["Você", "I was driving to work when my car broke down.", "Eu estava dirigindo para o trabalho quando meu carro quebrou."], ["Olivia", "Oh no! What did you do?", "Ah, não! E o que você fez?"], ["Você", "While I was waiting for help, I called my boss.", "Enquanto esperava ajuda, liguei para o meu chefe."], ["Olivia", "At least it wasn't raining!", "Pelo menos não estava chovendo!"]] },
    ["Verbos de estado (⟦know⟧, ⟦like⟧, ⟦want⟧) raramente vão para ⟦-ing⟧: ⟦I knew⟧, não “I was knowing”.", "Não confunda ⟦was⟧ e ⟦were⟧: ⟦They were⟧, ⟦She was⟧.", "Uma história boa tem cenário, ação e reação."],
    [["Complete: ⟦I ___ TV when the phone rang.⟧", "⟦was watching⟧", "⟦watched⟧", "⟦were watching⟧", "⟦am watching⟧", "Cenário: ⟦was⟧ + ⟦-ing⟧."],
      ["Qual frase mistura corretamente os tempos?", "⟦She was cooking when I arrived.⟧", "⟦She cooked when I was arrive.⟧", "⟦She was cook when I arrived.⟧", "⟦She cooking when I arrived.⟧", "Ação longa + ação curta."],
      ["Complete: ⟦They ___ playing soccer.⟧", "⟦were⟧", "⟦was⟧", "⟦are been⟧", "⟦did⟧", "⟦they⟧ usa ⟦were⟧."]]);

  /* ================== NÍVEL 3 · TRABALHO E CARREIRA ================== */
  lesson("meetings", "Reuniões", "MEETING", "Reuniões: opinar, concordar e discordar",
    "Em reuniões, você precisa dar opinião, concordar, discordar com educação e conduzir a conversa. Expressões como ⟦In my opinion…⟧, ⟦I see your point, but…⟧ e ⟦Let's move on to…⟧ fazem você soar profissional.",
    "Discordar em inglês é uma arte de amortecer: primeiro reconheça o ponto do outro e depois apresente o seu. ⟦That's a good point, but have we considered…?⟧",
    "In my opinion, we should wait. | Na minha opinião, devemos esperar.\nI completely agree. | Concordo totalmente.\nI see your point, but… | Entendo o seu ponto, mas…\nI'm not sure I agree. | Não sei se concordo.\nCould you clarify that? | Pode esclarecer isso?\nLet's move on to the next item. | Vamos para o próximo item.",
    ["Para interromper com educação: ⟦Sorry to interrupt, but…⟧", "Para pedir a vez: ⟦Can I add something?⟧", "Para resumir: ⟦So, to sum up…⟧"],
    { p: "Diálogo: reunião sobre o painel de vendas", c: "Onde: reunião de time\nQuem: você, a gerente e um colega\nObjetivo: dar opinião e propor um caminho", dialog: [["Manager", "So, should we launch the new dashboard next week?", "E então, devemos lançar o novo painel na semana que vem?"], ["Mark", "I think we're ready. The data looks good.", "Acho que estamos prontos. Os dados parecem bons."], ["Você", "I see your point, but some numbers are still inconsistent.", "Entendo seu ponto, mas alguns números ainda estão inconsistentes."], ["Manager", "Could you clarify that?", "Pode esclarecer?"], ["Você", "Sales in March don't match the finance report. In my opinion, we should fix that first.", "As vendas de março não batem com o relatório financeiro. Na minha opinião, devemos corrigir isso antes."], ["Manager", "Fair enough. Let's move on to the timeline.", "Justo. Vamos para o cronograma."]] },
    ["⟦I disagree⟧ seco soa duro; prefira ⟦I'm not sure I agree⟧ ou ⟦I see it differently⟧.", "“I'm agree” está errado: diga ⟦I agree⟧.", "Não traduza “na minha opinião, eu acho”: escolha um só."],
    [["Forma educada de discordar:", "⟦I see your point, but I think we need more data.⟧", "⟦You're wrong.⟧", "⟦No. Bad idea.⟧", "⟦I'm disagree.⟧", "Reconheça e depois apresente seu ponto."],
      ["Como pedir para alguém explicar melhor?", "⟦Could you clarify that?⟧", "⟦Explain again you.⟧", "⟦What you mean?⟧", "⟦Repeat better.⟧", "Pedido profissional de esclarecimento."],
      ["⟦Let's move on⟧ serve para:", "passar para o próximo assunto", "encerrar a empresa", "mudar de sala", "voltar ao item anterior", "Conduz a pauta."]]);

  lesson("emails", "E-mails", "EMAIL", "E-mails profissionais",
    "Um bom e-mail em inglês é curto, educado e tem estrutura previsível: saudação (⟦Hi John,⟧ / ⟦Dear Ms. Lee,⟧), motivo (⟦I'm writing to…⟧), pedido ou informação, encerramento (⟦Looking forward to hearing from you.⟧) e assinatura (⟦Best regards,⟧).",
    "Pense em blocos de LEGO: cada parte do e-mail tem frases prontas que se encaixam. Você só troca o miolo.",
    "Hi Sarah, / Dear Mr. Lee, | Oi Sarah, / Prezado Sr. Lee,\nI'm writing to follow up on our meeting. | Escrevo para dar continuidade à nossa reunião.\nPlease find attached the report. | Segue anexo o relatório.\nCould you please confirm by Friday? | Poderia confirmar até sexta?\nLooking forward to hearing from you. | Aguardo seu retorno.\nBest regards, | Atenciosamente,",
    ["⟦Dear⟧ é formal; ⟦Hi⟧ é o padrão entre colegas.", "⟦Please find attached⟧ (formal) ou ⟦I've attached⟧ (neutro).", "⟦ASAP⟧ (o quanto antes) soa urgente; use com moderação."],
    { p: "E-mail: enviando o relatório mensal", c: "Para: gerente de um parceiro\nTom: profissional e cordial\nObjetivo: enviar o relatório e pedir confirmação", dialog: [["Assunto", "Monthly sales report – March", "Relatório mensal de vendas – março"], ["Abertura", "Hi Jennifer,", "Oi Jennifer,"], ["Motivo", "I'm writing to send you the sales report for March.", "Escrevo para enviar o relatório de vendas de março."], ["Detalhe", "Please find it attached. Sales grew 12% compared to February.", "Segue em anexo. As vendas cresceram 12% em relação a fevereiro."], ["Pedido", "Could you please confirm the figures by Friday?", "Poderia confirmar os números até sexta?"], ["Fecho", "Looking forward to hearing from you. Best regards, Ana", "Aguardo seu retorno. Atenciosamente, Ana"]] },
    ["“Attached follows the report” é tradução literal; use ⟦Please find attached the report⟧.", "Evite ⟦Dear Sir⟧ quando souber o nome da pessoa.", "Releia antes de enviar: ⟦its⟧ (dele) e ⟦it's⟧ (é) confundem."],
    [["Como dizer “Segue anexo o relatório”?", "⟦Please find attached the report.⟧", "⟦Follows attached the report.⟧", "⟦The report goes in attach.⟧", "⟦Attach follow report.⟧", "Expressão padrão de e-mail."],
      ["Encerramento profissional comum:", "⟦Best regards,⟧", "⟦Kisses,⟧", "⟦Bye bye,⟧", "⟦See ya,⟧", "Neutro e profissional."],
      ["⟦I'm writing to follow up on…⟧ serve para:", "dar continuidade a um assunto", "reclamar de um produto", "pedir demissão", "agradecer um presente", "⟦follow up⟧ = acompanhar."]]);

  lesson("data", "Apresentando dados", "+12%", "Apresentando dados e gráficos",
    "Como analista, você vai apresentar números em inglês. Os verbos-chave são ⟦increase⟧ / ⟦rise⟧ (subir), ⟦decrease⟧ / ⟦drop⟧ (cair), ⟦peak⟧ (atingir o pico) e ⟦remain stable⟧ (manter-se estável). As preposições mudam o sentido: ⟦rose by 10%⟧ (subiu 10%) e ⟦rose to 10%⟧ (chegou a 10%).",
    "⟦by⟧ é a variação; ⟦to⟧ é o ponto de chegada. ⟦Sales rose by 2 million to 12 million⟧.",
    "Sales increased by 12% in March. | As vendas aumentaram 12% em março.\nCosts dropped to $40,000. | Os custos caíram para 40 mil dólares.\nRevenue peaked in December. | A receita atingiu o pico em dezembro.\nThe churn rate remained stable. | A taxa de cancelamento ficou estável.\nCompared to last year, we grew 8%. | Em comparação com o ano passado, crescemos 8%.\nAs you can see on this chart… | Como vocês podem ver neste gráfico…",
    ["Substantivos também funcionam: ⟦a sharp increase⟧, ⟦a slight drop⟧.", "Intensidade: ⟦slightly⟧ (levemente), ⟦significantly⟧ (bastante), ⟦sharply⟧ (bruscamente).", "Em inglês, 1.5 é “um ponto cinco” e 1,500 é mil e quinhentos."],
    { p: "Apresentação: resultados do trimestre", c: "Onde: reunião com a matriz\nQuem: você apresentando\nObjetivo: explicar o gráfico de vendas", dialog: [["Você", "As you can see on this chart, sales increased by 15% in the first quarter.", "Como vocês podem ver neste gráfico, as vendas aumentaram 15% no primeiro trimestre."], ["Você", "They peaked in March, mainly because of the online campaign.", "Atingiram o pico em março, principalmente por causa da campanha online."], ["Você", "Return rates dropped slightly, from 6% to 5%.", "As devoluções caíram levemente, de 6% para 5%."], ["Director", "What about the stores?", "E as lojas?"], ["Você", "Store sales remained stable compared to last year.", "As vendas das lojas ficaram estáveis em relação ao ano passado."]] },
    ["⟦rose by 5%⟧ ≠ ⟦rose to 5%⟧: preposição errada muda o número.", "Passado irregular: ⟦rise/rose/risen⟧, ⟦fall/fell/fallen⟧.", "Diga ⟦percentage points⟧ quando a diferença é entre duas porcentagens."],
    [["Vendas foram de 100 para 120. Qual frase está certa?", "⟦Sales rose by 20%.⟧", "⟦Sales rose to 20%.⟧", "⟦Sales dropped by 20%.⟧", "⟦Sales remained stable.⟧", "Variação de 20%: ⟦by⟧."],
      ["⟦Revenue peaked in July⟧ significa:", "A receita atingiu o pico em julho", "A receita caiu em julho", "A receita começou em julho", "A receita ficou estável em julho", "⟦peak⟧ = ponto mais alto."],
      ["⟦a slight decrease⟧ é:", "uma leve queda", "uma queda forte", "um leve aumento", "estabilidade", "⟦slight⟧ = pequeno."]]);

  lesson("interview", "Entrevista de emprego", "HIRED", "Entrevista de emprego em inglês",
    "Entrevistas em inglês seguem roteiros conhecidos: ⟦Tell me about yourself⟧, ⟦What are your strengths?⟧, ⟦Why do you want this job?⟧ e ⟦Do you have any questions?⟧. Prepare respostas curtas com exemplos concretos.",
    "Use o método STAR para contar conquistas: Situação, Tarefa, Ação e Resultado. ⟦I reduced report time by 40% by automating…⟧",
    "Tell me about yourself. | Fale sobre você.\nI've worked as a data analyst for five years. | Trabalho como analista de dados há cinco anos.\nI'm responsible for the sales dashboards. | Sou responsável pelos painéis de vendas.\nOne of my strengths is problem-solving. | Um dos meus pontos fortes é resolver problemas.\nI'm looking for new challenges. | Busco novos desafios.\nWhat would a typical day look like? | Como seria um dia típico?",
    ["Experiência até hoje: ⟦I've worked…for…⟧ (present perfect).", "⟦I'm in charge of…⟧ / ⟦I'm responsible for…⟧ para responsabilidades.", "Sempre tenha uma pergunta pronta para o final."],
    { p: "Diálogo: entrevista por vídeo", c: "Onde: entrevista online\nQuem: você e a recrutadora\nObjetivo: apresentar sua experiência", dialog: [["Recruiter", "So, tell me about yourself.", "Então, fale sobre você."], ["Você", "I'm a data analyst. I've worked with Power BI and SQL for five years.", "Sou analista de dados. Trabalho com Power BI e SQL há cinco anos."], ["Recruiter", "What was your biggest achievement?", "Qual foi sua maior conquista?"], ["Você", "I automated our monthly reports, and that saved twenty hours a month.", "Automatizei nossos relatórios mensais, o que economizou vinte horas por mês."], ["Recruiter", "Impressive. Do you have any questions for us?", "Impressionante. Tem alguma pergunta para nós?"], ["Você", "Yes. What would a typical day look like?", "Sim. Como seria um dia típico?"]] },
    ["“I work here since 2020” está errado; diga ⟦I've worked here since 2020⟧.", "Não decore um texto longo: fale em blocos curtos e naturais.", "⟦Actually⟧ significa “na verdade”, não “atualmente” (⟦currently⟧)."],
    [["Como dizer “Trabalho como analista há 5 anos”?", "⟦I've worked as an analyst for five years.⟧", "⟦I work as analyst since five years.⟧", "⟦I'm working analyst five years ago.⟧", "⟦I worked as an analyst since 5 years.⟧", "Duração até hoje: ⟦present perfect⟧ + ⟦for⟧."],
      ["⟦Currently⟧ significa:", "atualmente", "na verdade", "correntemente", "rapidamente", "⟦Actually⟧ = na verdade."],
      ["Boa pergunta para o fim da entrevista:", "⟦What would a typical day look like?⟧", "⟦How much vacation do I have now?⟧", "⟦Can I start tomorrow?⟧", "⟦Do you have questions?⟧", "Mostra interesse real pela vaga."]]);

  lesson("negotiation", "Negociação", "DEAL", "Negociação: propostas e concessões",
    "Negociar em inglês exige frases que propõem sem impor: ⟦Would you be willing to…?⟧, ⟦What if we…?⟧, ⟦We could offer…if you…⟧ e ⟦Let's meet halfway⟧. Elas mantêm a conversa aberta.",
    "Proposta condicional é a ferramenta principal: dou algo se você der algo. ⟦We could offer a 5% discount if you sign for two years.⟧",
    "Would you be willing to lower the price? | Vocês estariam dispostos a baixar o preço?\nWhat if we increase the volume? | E se aumentarmos o volume?\nWe could offer free shipping if you order 500 units. | Podemos oferecer frete grátis se pedirem 500 unidades.\nThat's the best we can do. | É o melhor que podemos fazer.\nLet's meet halfway. | Vamos chegar a um meio-termo.\nI need to check with my manager. | Preciso confirmar com o meu gerente.",
    ["Condicionais suavizam: ⟦could⟧, ⟦would⟧, ⟦might⟧.", "Ganhe tempo: ⟦Let me think about it⟧.", "Confirme o acordo por escrito: ⟦I'll send you an email to confirm⟧."],
    { p: "Diálogo: negociando com um fornecedor", c: "Onde: videochamada com fornecedor\nQuem: você e o representante\nObjetivo: conseguir desconto", dialog: [["Supplier", "Our price is twelve dollars per unit.", "Nosso preço é doze dólares por unidade."], ["Você", "Would you be willing to lower it to ten?", "Vocês estariam dispostos a baixar para dez?"], ["Supplier", "Ten is too low. What if we say eleven?", "Dez é muito baixo. E se dissermos onze?"], ["Você", "We could accept eleven if you include free shipping.", "Podemos aceitar onze se incluírem o frete grátis."], ["Supplier", "Let's meet halfway: eleven, and shipping at half price.", "Vamos chegar a um meio-termo: onze, com frete pela metade."], ["Você", "That works. I'll send you an email to confirm.", "Funciona. Vou te mandar um e-mail para confirmar."]] },
    ["“Give me a discount” é direto demais; prefira ⟦Would you be willing to…?⟧", "⟦Push⟧ e ⟦pressure⟧ excessivos quebram a negociação.", "⟦Eventually⟧ é “no fim das contas”, não “eventualmente”."],
    [["Forma diplomática de pedir desconto:", "⟦Would you be willing to offer a discount?⟧", "⟦Give discount now.⟧", "⟦You must discount.⟧", "⟦I want cheaper.⟧", "Pergunta condicional."],
      ["⟦Let's meet halfway⟧ significa:", "Vamos chegar a um meio-termo", "Vamos nos encontrar no meio do caminho de carro", "Vamos parar a negociação", "Vamos marcar outra reunião", "Concessão dos dois lados."],
      ["⟦Eventually⟧ significa:", "no fim das contas", "eventualmente", "de vez em quando", "imediatamente", "Falso cognato."]]);

  lesson("conditionals", "Condicionais", "IF", "Condicionais: possibilidades e hipóteses",
    "Condicionais ligam uma condição a um resultado. Real: ⟦If it rains, we'll stay home⟧ (⟦if⟧ + presente, ⟦will⟧). Hipotético: ⟦If I had more time, I would learn Spanish⟧ (⟦if⟧ + passado, ⟦would⟧).",
    "Teste rápido: a situação é provável? Use o primeiro tipo. É imaginária ou improvável? Use o segundo.",
    "If you need help, call me. | Se precisar de ajuda, me ligue.\nIf we finish early, we'll go out. | Se terminarmos cedo, vamos sair.\nIf I had more time, I would travel more. | Se eu tivesse mais tempo, viajaria mais.\nIf I were you, I'd accept the offer. | Se eu fosse você, aceitaria a oferta.\nWhat would you do if you lost your job? | O que você faria se perdesse o emprego?\nUnless you hurry, we'll miss the train. | A menos que você se apresse, vamos perder o trem.",
    ["Nunca use ⟦will⟧ logo depois de ⟦if⟧: ⟦If it rains⟧, não “if it will rain”.", "⟦If I were you⟧ é a forma clássica de conselho.", "⟦unless⟧ = a menos que (⟦if…not⟧)."],
    { p: "Diálogo: decidindo sobre uma proposta", c: "Onde: almoço com um mentor\nQuem: você e Paul\nObjetivo: pedir conselho sobre uma oferta", dialog: [["Você", "I got a job offer from a company in Canada.", "Recebi uma proposta de uma empresa no Canadá."], ["Paul", "Wow! What would you do if they offered relocation?", "Uau! O que você faria se oferecessem mudança?"], ["Você", "If they paid for it, I would probably go.", "Se eles pagassem, eu provavelmente iria."], ["Paul", "If I were you, I'd ask about it in the next interview.", "Se eu fosse você, perguntaria na próxima entrevista."], ["Você", "Good idea. If they say yes, I'll accept.", "Boa ideia. Se disserem sim, eu aceito."]] },
    ["“If I will have time” está errado: ⟦If I have time⟧.", "No hipotético, ⟦were⟧ serve para todos: ⟦If she were here⟧.", "⟦would⟧ fica no resultado, não na condição."],
    [["Complete: ⟦If it ___ tomorrow, we'll cancel the trip.⟧", "⟦rains⟧", "⟦will rain⟧", "⟦rained⟧", "⟦would rain⟧", "Condição real: presente depois de ⟦if⟧."],
      ["Conselho clássico:", "⟦If I were you, I'd take the job.⟧", "⟦If I am you, I take the job.⟧", "⟦If I was you, I will take the job.⟧", "⟦If I were you, I will took the job.⟧", "⟦If I were you, I'd…⟧"],
      ["⟦Unless⟧ significa:", "a menos que", "se", "porque", "embora", "⟦unless⟧ = ⟦if not⟧."]]);

  lesson("passive", "Voz passiva", "WAS DONE", "Voz passiva em relatórios",
    "Em relatórios e processos, o foco é o que foi feito, não quem fez. A voz passiva usa ⟦be⟧ + particípio: ⟦The data is updated daily⟧, ⟦The report was sent yesterday⟧, ⟦The orders will be shipped tomorrow⟧.",
    "Pergunte: o importante é a ação ou a pessoa? Se for a ação, passiva. Para citar quem fez, use ⟦by⟧: ⟦The report was approved by the director⟧.",
    "The dashboard is updated every morning. | O painel é atualizado toda manhã.\nThe report was sent on Monday. | O relatório foi enviado na segunda.\nThe orders will be shipped tomorrow. | Os pedidos serão enviados amanhã.\nThe issue has been fixed. | O problema foi corrigido.\nMistakes were made. | Erros foram cometidos.\nThe budget was approved by the board. | O orçamento foi aprovado pela diretoria.",
    ["Presente: ⟦is/are⟧ + particípio; passado: ⟦was/were⟧ + particípio.", "Futuro: ⟦will be⟧ + particípio; present perfect: ⟦has/have been⟧ + particípio.", "Muito usada em procedimentos e e-mails formais."],
    { p: "Atualização de status do projeto", c: "Onde: e-mail de status semanal\nQuem: você para o time\nObjetivo: informar o que foi feito", dialog: [["Status", "The new data model has been tested.", "O novo modelo de dados foi testado."], ["Status", "Two bugs were found and fixed on Tuesday.", "Dois erros foram encontrados e corrigidos na terça."], ["Status", "The dashboard is updated every morning at 7.", "O painel é atualizado toda manhã às 7h."], ["Status", "The final version will be presented on Friday.", "A versão final será apresentada na sexta."]] },
    ["Não esqueça o ⟦be⟧: “The report sent yesterday” muda o sentido.", "Use particípio, não passado: ⟦was written⟧, não “was wrote”.", "Excesso de passiva deixa o texto pesado: alterne com voz ativa."],
    [["Complete: ⟦The files ___ sent yesterday.⟧", "⟦were⟧", "⟦was⟧", "⟦are⟧", "⟦have⟧", "Plural no passado: ⟦were⟧."],
      ["Passiva correta:", "⟦The email was written by Ana.⟧", "⟦The email was wrote by Ana.⟧", "⟦The email written by Ana was.⟧", "⟦The email is wrote by Ana.⟧", "⟦be⟧ + particípio (⟦written⟧)."],
      ["⟦The issue has been fixed⟧ significa:", "O problema foi corrigido", "O problema vai ser corrigido", "O problema está sendo corrigido", "O problema não foi corrigido", "Present perfect passivo."]]);

  lesson("reported", "Discurso indireto", "SHE SAID", "Discurso indireto: contando o que foi dito",
    "Para repassar o que alguém disse numa reunião ou ligação, use o discurso indireto: ⟦She said (that) the report was ready⟧, ⟦He asked if we could meet on Monday⟧, ⟦They told me to wait⟧.",
    "Ao repassar, o verbo geralmente “volta” um passo no tempo: ⟦is⟧ → ⟦was⟧, ⟦will⟧ → ⟦would⟧, ⟦can⟧ → ⟦could⟧.",
    "“I'm busy.” → She said she was busy. | “Estou ocupada.” → Ela disse que estava ocupada.\n“We will call you.” → They said they would call me. | “Vamos te ligar.” → Disseram que me ligariam.\nHe asked if I could help. | Ele perguntou se eu podia ajudar.\nShe asked where the office was. | Ela perguntou onde ficava o escritório.\nMy boss told me to send the file. | Meu chefe me pediu para enviar o arquivo.\nHe said he had finished. | Ele disse que tinha terminado.",
    ["⟦said⟧ sem objeto; ⟦told⟧ com objeto: ⟦told me⟧, ⟦told her⟧.", "Pergunta de sim/não vira ⟦asked if…⟧.", "Na pergunta indireta, a ordem é de afirmação: ⟦asked where the office was⟧."],
    { p: "Diálogo: repassando a ligação do cliente", c: "Onde: escritório\nQuem: você e o seu gerente\nObjetivo: contar o que o cliente disse", dialog: [["Manager", "Did the client call?", "O cliente ligou?"], ["Você", "Yes. He said the delivery was late again.", "Ligou. Disse que a entrega atrasou de novo."], ["Manager", "Did he ask for a discount?", "Ele pediu desconto?"], ["Você", "He asked if we could send the next order for free.", "Perguntou se poderíamos mandar o próximo pedido de graça."], ["Manager", "What did you tell him?", "E o que você disse?"], ["Você", "I told him I would check with you.", "Disse que ia confirmar com você."]] },
    ["“He said me” está errado: ⟦He told me⟧ ou ⟦He said to me⟧.", "“She asked where was the office” está errado: ⟦where the office was⟧.", "Se a informação ainda é verdade, pode manter o presente: ⟦She said she lives in Rio⟧."],
    [["“I'm tired”, disse Tom. Em discurso indireto:", "⟦Tom said he was tired.⟧", "⟦Tom said he is tired me.⟧", "⟦Tom told he was tired.⟧", "⟦Tom said I was tired.⟧", "⟦is⟧ → ⟦was⟧; ⟦said⟧ sem objeto."],
      ["Qual está correta?", "⟦She told me to wait.⟧", "⟦She said me to wait.⟧", "⟦She told to me wait.⟧", "⟦She said me wait.⟧", "⟦told⟧ + pessoa + ⟦to⟧ + verbo."],
      ["Pergunta indireta correta:", "⟦He asked where the station was.⟧", "⟦He asked where was the station.⟧", "⟦He asked where is the station?⟧", "⟦He asked the station where.⟧", "Ordem de afirmação."]]);

  lesson("falsefriends", "Falsos cognatos", "ACTUALLY", "Falsos cognatos: palavras que enganam",
    "Falsos cognatos parecem português, mas significam outra coisa. Os mais perigosos no trabalho: ⟦actually⟧ (na verdade), ⟦pretend⟧ (fingir), ⟦push⟧ (empurrar), ⟦library⟧ (biblioteca), ⟦eventually⟧ (no fim das contas), ⟦realize⟧ (perceber), ⟦assist⟧ (ajudar) e ⟦exquisite⟧ (requintado).",
    "Quando uma palavra parecer fácil demais, desconfie e confira o contexto. O erro com falso cognato muda o sentido inteiro da frase.",
    "Actually, the meeting is at 3. | Na verdade, a reunião é às 3.\nCurrently, I work in Recife. | Atualmente, trabalho em Recife.\nI didn't realize it was late. | Não percebi que era tarde.\nI intend to study abroad. | Pretendo estudar fora.\nWe eventually found a solution. | No fim, encontramos uma solução.\nThe library opens at 9. | A biblioteca abre às 9.",
    ["atualmente = ⟦currently⟧ / ⟦nowadays⟧; ⟦actually⟧ = na verdade.", "pretender = ⟦intend⟧ / ⟦plan⟧; ⟦pretend⟧ = fingir.", "livraria = ⟦bookstore⟧; ⟦library⟧ = biblioteca."],
    { p: "Diálogo: o mal-entendido", c: "Onde: conversa com uma colega estrangeira\nQuem: você e Megan\nObjetivo: usar as palavras certas", dialog: [["Megan", "So, do you work in São Paulo?", "Então, você trabalha em São Paulo?"], ["Você", "Actually, I work in Campinas. Currently, I'm on a project in Rio.", "Na verdade, trabalho em Campinas. Atualmente, estou num projeto no Rio."], ["Megan", "Oh, I didn't realize you traveled so much!", "Ah, não percebi que você viajava tanto!"], ["Você", "Yes, and I intend to move to Rio next year.", "Sim, e pretendo me mudar para o Rio no ano que vem."], ["Megan", "Nice! You'll love it, eventually.", "Que legal! No fim, você vai adorar."]] },
    ["⟦Assist⟧ é ajudar; assistir a um filme é ⟦watch⟧.", "⟦Exquisite⟧ é elogio (requintado); esquisito é ⟦weird⟧ ou ⟦strange⟧.", "⟦Parents⟧ são os pais; parentes são ⟦relatives⟧."],
    [["“Atualmente trabalho com BI” em inglês:", "⟦Currently, I work with BI.⟧", "⟦Actually, I work with BI.⟧", "⟦Actual, I work with BI.⟧", "⟦Nowaday I work with BI.⟧", "atualmente = ⟦currently⟧."],
      ["⟦I pretended to be sick⟧ significa:", "Fingi estar doente", "Pretendi ficar doente", "Planejei ficar doente", "Fiquei doente de verdade", "⟦pretend⟧ = fingir."],
      ["⟦relatives⟧ significa:", "parentes", "pais", "relatórios", "relativos", "⟦parents⟧ = pais."]]);

  lesson("bizphrasal", "Phrasal verbs de negócios", "FOLLOW UP", "Phrasal verbs do trabalho",
    "No ambiente corporativo, alguns ⟦phrasal verbs⟧ aparecem toda hora: ⟦follow up⟧ (acompanhar), ⟦set up⟧ (configurar, marcar), ⟦carry out⟧ (executar), ⟦put off⟧ (adiar), ⟦figure out⟧ (descobrir, entender), ⟦run out of⟧ (ficar sem) e ⟦back up⟧ (fazer cópia, apoiar).",
    "Muitos têm um equivalente formal: ⟦put off⟧ = ⟦postpone⟧, ⟦carry out⟧ = ⟦execute⟧. Na fala, os ⟦phrasal verbs⟧ soam mais naturais.",
    "I'll follow up with the client tomorrow. | Vou dar retorno ao cliente amanhã.\nCan we set up a call for Monday? | Podemos marcar uma call na segunda?\nWe carried out a survey. | Realizamos uma pesquisa.\nThey put off the launch. | Eles adiaram o lançamento.\nI can't figure out this error. | Não consigo entender esse erro.\nWe ran out of time. | Ficamos sem tempo.",
    ["⟦follow-up⟧ (com hífen) é substantivo: ⟦a quick follow-up⟧.", "⟦set up⟧ serve para reunião, conta, sistema e ambiente.", "⟦back up⟧ = fazer backup ou apoiar alguém."],
    { p: "Diálogo: alinhando o projeto", c: "Onde: chamada rápida\nQuem: você e o líder do projeto\nObjetivo: combinar próximos passos", dialog: [["Leader", "Did the client approve the timeline?", "O cliente aprovou o cronograma?"], ["Você", "Not yet. I'll follow up with them today.", "Ainda não. Vou cobrar um retorno hoje."], ["Leader", "OK. Can you set up a meeting with the finance team?", "Ok. Pode marcar uma reunião com o financeiro?"], ["Você", "Sure. And we need to figure out the data issue.", "Claro. E precisamos entender o problema dos dados."], ["Leader", "Right. Let's not put it off any longer.", "Certo. Não vamos mais adiar isso."]] },
    ["⟦Put off⟧ (adiar) é diferente de ⟦turn off⟧ (desligar).", "⟦Run out of⟧ precisa do ⟦of⟧ antes do que acabou: ⟦run out of paper⟧.", "Em e-mails formais, alterne com sinônimos: ⟦postpone⟧, ⟦conduct⟧."],
    [["⟦They put off the meeting⟧ significa:", "Eles adiaram a reunião", "Eles cancelaram a reunião", "Eles marcaram a reunião", "Eles desligaram a reunião", "⟦put off⟧ = adiar."],
      ["⟦I'll follow up on this⟧ significa:", "Vou acompanhar/dar retorno sobre isso", "Vou seguir esta pessoa", "Vou recusar isso", "Vou terminar isso agora", "⟦follow up⟧ = acompanhar."],
      ["Como dizer “Ficamos sem tempo”?", "⟦We ran out of time.⟧", "⟦We ran out time.⟧", "⟦We finished of time.⟧", "⟦We ran of time out.⟧", "⟦run out of⟧."]]);

  lesson("calls", "Videochamadas", "ON MUTE", "Videochamadas e problemas técnicos",
    "Reuniões online trazem frases próprias: ⟦Can you hear me?⟧, ⟦You're on mute⟧, ⟦You broke up⟧, ⟦Can you see my screen?⟧ e ⟦Let me share my screen⟧. Saber lidar com falhas mostra fluência.",
    "Quando a conexão falha, descreva e peça ação: ⟦Sorry, you're breaking up. Could you repeat the last part?⟧",
    "Can everyone hear me? | Todos conseguem me ouvir?\nI think you're on mute. | Acho que você está no mudo.\nSorry, you broke up. Could you repeat that? | Desculpe, sua voz cortou. Pode repetir?\nLet me share my screen. | Deixa eu compartilhar a tela.\nCan you see my screen? | Vocês veem minha tela?\nMy connection is unstable. | Minha conexão está instável.",
    ["⟦mute/unmute⟧ = desligar/ligar o microfone.", "⟦You're breaking up⟧ = sua voz está cortando.", "⟦Let's wait a minute for everyone to join⟧ abre a reunião."],
    { p: "Diálogo: começo de uma call", c: "Onde: chamada de vídeo com o time global\nQuem: você, Lisa e Raj\nObjetivo: resolver o áudio e apresentar", dialog: [["Lisa", "Hi everyone! Can you hear me?", "Oi, pessoal! Estão me ouvindo?"], ["Você", "Yes, loud and clear. Raj, I think you're on mute.", "Sim, alto e claro. Raj, acho que você está no mudo."], ["Raj", "Sorry about that! Can you hear me now?", "Desculpe! E agora, me ouvem?"], ["Você", "Yes. Let me share my screen. Can you see the dashboard?", "Sim. Deixa eu compartilhar a tela. Vocês veem o painel?"], ["Lisa", "Sorry, you broke up for a second. Could you repeat?", "Desculpe, sua voz cortou por um segundo. Pode repetir?"]] },
    ["Não diga “Can you listen to me?”; o certo é ⟦Can you hear me?⟧", "⟦on mute⟧ (no mudo) usa ⟦on⟧.", "Avise antes de compartilhar: ⟦I'll share my screen now⟧."],
    [["Alguém fala mas ninguém ouve. Você diz:", "⟦I think you're on mute.⟧", "⟦You are in mute.⟧", "⟦Your sound is closed.⟧", "⟦You are silence.⟧", "⟦on mute⟧."],
      ["⟦You broke up⟧ numa chamada significa:", "Sua voz cortou", "Você terminou o namoro", "Você saiu da reunião", "Você está sem vídeo", "Falha de conexão."],
      ["Como perguntar se todos ouvem você?", "⟦Can everyone hear me?⟧", "⟦Can everyone listen me?⟧", "⟦Everyone is hearing?⟧", "⟦Do you listen me?⟧", "⟦hear⟧ = ouvir (perceber o som)."]]);

  lesson("feedback", "Feedback e diplomacia", "FEEDBACK", "Feedback e conversas difíceis",
    "Dar e receber ⟦feedback⟧ em inglês exige suavizadores: ⟦It might be better to…⟧, ⟦Have you considered…?⟧, ⟦I'd suggest…⟧, ⟦One thing that could be improved is…⟧. Para receber: ⟦Thanks for the feedback. That's helpful⟧.",
    "Pense no sanduíche: um ponto positivo, a sugestão de melhoria e um fechamento encorajador.",
    "Great job on the presentation! | Ótimo trabalho na apresentação!\nOne thing that could be improved is the timing. | Algo que pode melhorar é o tempo.\nHave you considered using a chart here? | Já pensou em usar um gráfico aqui?\nI'd suggest focusing on the key numbers. | Sugiro focar nos números principais.\nThanks for the feedback. That's really helpful. | Obrigado pelo feedback. Ajuda muito.\nCould you give me an example? | Pode me dar um exemplo?",
    ["⟦might⟧, ⟦could⟧ e ⟦would⟧ suavizam críticas.", "Foque no trabalho, não na pessoa: ⟦The report needs…⟧, não “You are…”.", "Peça exemplos para entender o feedback recebido."],
    { p: "Diálogo: feedback sobre um relatório", c: "Onde: conversa 1:1\nQuem: você (líder) e um analista\nObjetivo: dar feedback construtivo", dialog: [["Você", "Thanks for the report, Leo. The analysis is really solid.", "Obrigado pelo relatório, Leo. A análise está muito sólida."], ["Leo", "Thanks! Is there anything I could improve?", "Obrigado! Tem algo que eu possa melhorar?"], ["Você", "One thing that could be improved is the summary. It's a bit long.", "Algo que pode melhorar é o resumo. Está um pouco longo."], ["Você", "Have you considered starting with the three main findings?", "Já pensou em começar pelas três principais conclusões?"], ["Leo", "Good idea. Could you give me an example?", "Boa ideia. Pode me dar um exemplo?"]] },
    ["“You did it wrong” soa agressivo; prefira ⟦This part could be clearer⟧.", "Não exagere nos suavizadores: a mensagem precisa ficar clara.", "Ao receber crítica, agradeça antes de explicar."],
    [["Forma diplomática de sugerir uma mudança:", "⟦Have you considered adding a chart?⟧", "⟦Your report is bad.⟧", "⟦Add a chart now.⟧", "⟦You forgot chart, wrong.⟧", "Pergunta sugestiva suaviza."],
      ["Resposta profissional a um feedback:", "⟦Thanks for the feedback. That's helpful.⟧", "⟦I don't care.⟧", "⟦You are wrong.⟧", "⟦OK, bye.⟧", "Agradeça e mostre abertura."],
      ["⟦It might be better to…⟧ serve para:", "suavizar uma sugestão", "dar uma ordem", "elogiar", "encerrar a conversa", "⟦might⟧ suaviza."]]);

  lesson("final", "Desafio final", "FLUENT", "Juntando tudo: um dia de trabalho em inglês",
    "Fluência é encadear situações: ⟦small talk⟧ antes da reunião, opinião durante, números na apresentação, ⟦follow-up⟧ por e-mail. Você já tem as frases de cada etapa; o desafio é escolher a certa para cada momento.",
    "Fluência não é falar sem erro, é se comunicar sem travar. Use frases prontas como apoio e peça esclarecimentos sem medo.",
    "How was your weekend? | Como foi seu fim de semana?\nIn my opinion, we should… | Na minha opinião, devemos…\nAs you can see on this chart… | Como vocês podem ver neste gráfico…\nSorry, could you repeat that? | Desculpe, pode repetir?\nI'll follow up by email. | Vou dar retorno por e-mail.\nLooking forward to hearing from you. | Aguardo seu retorno.",
    ["Cada situação tem um registro: informal com colegas, formal com clientes.", "Prepare frases-âncora para começar, discordar, pedir repetição e encerrar.", "Pratique em voz alta: falar é uma habilidade física."],
    { p: "Diálogo: reunião com a matriz", c: "Onde: reunião online com a matriz nos EUA\nQuem: você, a diretora e um colega\nObjetivo: apresentar, defender uma ideia e combinar o retorno", dialog: [["Director", "Hi! Before we start, how's everything in Brazil?", "Oi! Antes de começar, como estão as coisas no Brasil?"], ["Você", "Great, thanks! It's a sunny day here. Let me share my screen.", "Ótimas, obrigado! O dia está ensolarado. Deixa eu compartilhar a tela."], ["Você", "As you can see, online sales rose by 18% this quarter.", "Como vocês podem ver, as vendas online subiram 18% neste trimestre."], ["Director", "Impressive. Should we invest more in online ads?", "Impressionante. Devemos investir mais em anúncios online?"], ["Você", "In my opinion, yes, but we should test it in one region first.", "Na minha opinião, sim, mas devemos testar numa região primeiro."], ["Director", "Makes sense. Could you send me a proposal?", "Faz sentido. Pode me mandar uma proposta?"], ["Você", "Sure. I'll follow up by email tomorrow.", "Claro. Vou dar retorno por e-mail amanhã."]] },
    ["Não traduza do português palavra por palavra: pense em frases prontas.", "Mude o registro conforme a pessoa e o canal.", "Encerre sempre com o próximo passo: quem faz o quê e quando."],
    [["Qual frase abre uma reunião com small talk?", "⟦How's everything going?⟧", "⟦Let's move on to item 3.⟧", "⟦Best regards.⟧", "⟦Sales rose by 10%.⟧", "Conversa leve antes do assunto."],
      ["Como encerrar combinando o próximo passo?", "⟦I'll send you the proposal by Friday.⟧", "⟦OK, bye.⟧", "⟦Maybe something.⟧", "⟦We see.⟧", "Ação, responsável e prazo."],
      ["O que é ser fluente, segundo a aula?", "Comunicar-se sem travar, mesmo com pequenos erros", "Nunca errar a gramática", "Ter sotaque nativo", "Saber todas as palavras", "Comunicação acima da perfeição."]]);

  /* ------------------------- Tópico → aula (extras) ------------------------- */
  MAP["Desafio do nível 1"] = "phone"; MAP["Desafio do nível 2"] = "stories";

  /* ------------------------------ Pacote ------------------------------ */
  function enc(s) { return global.UI.esc(s); }
  /** Frases-chave: "inglês | português" → linhas com botão de ouvir. */
  function phrasesHtml(code) {
    return '<span class="en-lines">' + String(code).split('\n').map(function (l) {
      const p = l.split(' | '), en = p[0], pt = p[1] || '';
      return '<span class="en-line"><button type="button" class="en-say" data-say="' + enc(en) + '" aria-label="Ouvir: ' + enc(en) + '">' + global.UI.icon('volume') + '</button>' +
        '<span><b lang="en">' + enc(en) + '</b>' + (pt ? '<small>' + enc(pt) + '</small>' : '') + '</span></span>';
    }).join('') + '</span>';
  }
  /** Contexto do diálogo: "Rótulo: valor". */
  function contextHtml(code) {
    return '<span class="en-ctx">' + String(code).split('\n').map(function (l) {
      const i = l.indexOf(':');
      return i > 0 ? '<span><i>' + enc(l.slice(0, i)) + '</i>' + enc(l.slice(i + 1).trim()) + '</span>' : '<span>' + enc(l) + '</span>';
    }).join('') + '</span>';
  }
  function dialogHtml(ex) {
    const who = {}; let n = 0;
    ex.dialog.forEach(function (d) { if (who[d[0]] == null) who[d[0]] = d[0] === 'Você' ? 'me' : 'p' + (n++ % 3); });
    return '<div class="en-dialog">' +
      '<div class="en-dlg-tools"><button type="button" class="btn btn-ghost sm" data-say-all>' + global.UI.icon('play') + 'Ouvir diálogo</button><label class="en-tr-t"><input type="checkbox" data-tr-toggle> Mostrar tradução</label></div>' +
      ex.dialog.map(function (d) {
        return '<div class="en-msg ' + who[d[0]] + '"><span class="en-who">' + enc(d[0]) + '</span><div class="en-bubble"><button type="button" class="en-say" data-say="' + enc(d[1]) + '" aria-label="Ouvir: ' + enc(d[1]) + '">' + global.UI.icon('volume') + '</button>' +
          '<p lang="en">' + enc(d[1]) + '</p><small class="en-tr" hidden>' + enc(d[2] || '') + '</small></div></div>';
      }).join('') + '</div>';
  }
  const KIND = { choice: ['chat', 'Escolha a resposta'], fill: ['code', 'Complete a frase'], build: ['grid', 'Monte a frase'], listen: ['headphones', 'Ouça e responda'], dictation: ['headphones', 'Ditado'], order: ['bars', 'Ordene o diálogo'], classify: ['grid', 'Classifique'] };
  function register() {
    if (!global.Lessons || !global.Lessons.registerPack) return;
    global.Lessons.registerPack('ingles', {
      LESSONS: L, MAP: MAP, fallback: 'hello', goalLabel: 'Sua missão',
      steps: ['Situação', 'Frases-chave', 'Diálogo', 'Cuidados', 'Sua vez'],
      syntaxTitle: 'Frases-chave (toque para ouvir)',
      syntaxSpeech: function (les) {
        const lines = String(les.sintaxe).split('\n').slice(0, 3).map(function (l) { const p = l.split(' | '); return '⟦' + p[0] + '⟧, ' + (p[1] ? 'que significa: ' + p[1].replace(/[.!?]?$/, '.') : ''); });
        return 'Agora, as frases-chave. ' + lines.join(' ') + ' Toque nas frases para ouvir e repetir.';
      },
      compareSpeech: 'Toque em cada fala para ouvir de novo e repita em voz alta.',
      codeHtml: function (code) { return /\|/.test(code) ? phrasesHtml(code) : contextHtml(code); },
      example: function (les) {
        const ex = les.exemplo;
        const speech = 'Ouça. ' + ex.dialog.map(function (d) { return '⟦' + d[1] + '⟧'; }).join(' ');
        return { code: ex.c, badge: 'Áudio em inglês · toque em cada fala', liveHtml: dialogHtml(ex), speech: speech };
      },
      solution: function (ex) {
        const R = global.UI.rich, E = global.EnPractice;
        const ans = E ? E.answerText(ex) : '';
        let html;
        if (ex.kind === 'order') html = '<ol class="ls-anslist num">' + ex.items.map(function (t) { return '<li>' + R(t) + '</li>'; }).join('') + '</ol>';
        else if (ex.kind === 'classify') html = '<ul class="ls-anslist">' + ex.items.map(function (it) { return '<li><span>' + R(it[0]) + '</span><b>' + enc(ex.cats[it[1]]) + '</b></li>'; }).join('') + '</ul>';
        else html = '<p class="ls-ans" lang="en">' + R(ans) + '</p>';
        return { label: 'Resposta', html: html, note: ex.x, speech: ex.x };
      },
      tags: function (ex) { const k = KIND[ex.kind] || KIND.choice; return [{ icon: k[0], label: k[1] }]; },
    });
  }
  register();

  /* ---- Botões de ouvir (frases, diálogos e exercícios), por delegação ---- */
  if (typeof document !== 'undefined') {
    let playing = null;
    const mark = function (el, on) { if (el) el.classList.toggle('playing', on); };
    document.addEventListener('click', function (e) {
      const N = global.Narrator; if (!N) return;
      const b = e.target.closest && e.target.closest('[data-say]');
      if (b) {
        e.preventDefault();
        mark(playing, false); playing = b; mark(b, true);
        N.sayEn(b.getAttribute('data-say'), { rate: b.hasAttribute('data-slow') ? 0.7 : 1, onend: function () { mark(b, false); } });
        return;
      }
      const all = e.target.closest && e.target.closest('[data-say-all]');
      if (all) {
        e.preventDefault();
        const lines = Array.prototype.slice.call(all.closest('.en-dialog').querySelectorAll('.en-msg [data-say]'));
        let i = 0;
        const next = function () {
          mark(playing, false);
          if (i >= lines.length) return;
          const el = lines[i++]; playing = el; mark(el, true);
          N.sayEn(el.getAttribute('data-say'), { onend: function () { setTimeout(next, 350); } });
        };
        next();
      }
    });
    document.addEventListener('change', function (e) {
      if (e.target.matches && e.target.matches('[data-tr-toggle]')) {
        const box = e.target.closest('.en-dialog');
        box.querySelectorAll('.en-tr').forEach(function (t) { t.hidden = !e.target.checked; });
        const vp = box.closest('.ls-viewport'), sl = box.closest('.ls-slide');
        if (vp && sl) vp.style.height = sl.offsetHeight + 'px';
      }
    });
  }
  global.EnLessons = { LESSONS: L, MAP: MAP };
})(typeof window !== 'undefined' ? window : globalThis);
