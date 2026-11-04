# Trust Intelligence Academy

Documentação completa da plataforma: https://claude.ai/artifact/A7jAk5ZxZDs4NBD22y4MUi

Academia gamificada de dados, BI e IA. Trilhas disponíveis: **SQL Prático**, **Excel Prático**, **Power BI & DAX**, **Gestão da Qualidade**, **Lean Six Sigma**, **Python para Dados**, **Inglês para o Dia a Dia** e **Estatística Aplicada**. Em breve: IA para Dados, Machine Learning Aplicado e Storytelling com Dados.
Em breve: IA para Dados e Estatística Aplicada.
Cada trilha tem 150 exercícios em 3 níveis, aulas em slides narradas, correção automática, carreira com 10 promoções,
conquistas, ranking, painel, provas e 13 certificados.

## Como rodar
    python -m http.server 8000
    # abra http://localhost:8000

## Fluxo
Login → nome da jornada → **Temas** (escolha do tema) → Painel/Trilha → para cada exercício novo,
um **carrossel de 5 slides** (Conceito, Sintaxe, Exemplo ao vivo, Cuidados, Seu desafio) → prática com correção.
Cada aula tem **narração por voz** (botão "Ouvir narração"), com legenda, velocidade, escolha de voz e avanço automático.
O conteúdo pode ser reaberto pelo botão "Conteúdo" e desligado em Perfil > Preferências de estudo.

## Estrutura
- `index.html` — página única (com viewport para celular)
- `manifest.webmanifest` — permite "Adicionar à tela inicial" no celular
- `assets/logo.png`, `assets/logo-256.png` — logo no estilo neon da plataforma
- `css/styles.css` — tema Dark Premium / glassmorphism
- `css/codemirror.css` — base e tema do editor
- `js/tracks.js` — catálogo de temas, com cor e símbolo de cada um (SQL azul, Excel verde, Power BI amarelo, Python amarelo-limão, Estatística cinza)
- `js/excel-engine.js` — motor de fórmulas do Excel em português (";" como separador, "," decimal, matrizes dinâmicas, PROCX, SOMASES, LET…)
- `js/excel-data.js` — planilhas da NexusMarket (Vendas, Produtos, Funcionários, Clientes, Notas, Metas…)
- `js/excel-exercises.js` — os 150 exercícios de Excel
- `js/excel-lessons.js` — as 37 aulas de Excel, com exemplo calculado ao vivo e 3 questões de prova por aula
- `js/excel-ui.js` — tela de prática do Excel: planilha, barra de fórmulas e correção célula a célula
- `js/formula-editor.js` — editor de fórmulas compartilhado (Excel e DAX): realce de sintaxe por cores, sugestões ao digitar (↑↓ para navegar, Tab/Enter para aceitar) e dica de assinatura com o argumento atual destacado
- `js/dax-data.js` — modelo estrela da NexusMarket para Power BI (fVendas, fMetas, dProduto, dCliente, dLoja, dCalendario), relacionamentos e medidas base
- `js/dax-engine.js` — motor DAX: contexto de filtro e de linha, transição de contexto, CALCULATE e modificadores (ALL, ALLEXCEPT, REMOVEFILTERS, ALLSELECTED, KEEPFILTERS, USERELATIONSHIP), iteradores, inteligência de tempo, RANKX, TOPN e tabelas calculadas; aceita "," ou ";" como separador
- `js/dax-lang.js` — realce e sugestões do DAX: funções, tabelas, colunas após `Tabela[`, medidas após `[` e variáveis
- `js/dax-exercises.js` — os 150 exercícios de Power BI (medidas, colunas e tabelas calculadas)
- `js/dax-lessons.js` — as 36 aulas de DAX, com mini visual calculado ao vivo e 3 questões de prova por aula
- `js/dax-ui.js` — tela de prática do Power BI: explorador do modelo, editor DAX, visual de matriz/cartão e correção linha a linha
- `js/gq-data.js` — dados da operação da NexusMarket para a trilha de Gestão (SAC, CD, entregas, embalagem)
- `js/gq-charts.js` — gráficos e cálculos da qualidade em SVG, calculados na hora: Pareto, carta de controle (I-MR e regras de sinais), histograma, dispersão, Ishikawa, VSM, OEE, Cp/Cpk, matriz GUT/FMEA, DPMO e nível sigma
- `js/gq-exercises.js` — os 150 casos de Gestão: estudo de caso, múltipla escolha, ordenar, classificar e cálculo com dados reais
- `js/gq-lessons.js` — as 40 aulas de Gestão (PDCA, 7 ferramentas, MASP, 8D, A3, Lean, CEP, Seis Sigma, FMEA, ISO 9001, Hoshin), com 3 questões de prova por aula
- `js/gq-ui.js` — tela de prática da Gestão: dados do caso, resposta interativa, correção com explicação
- `js/py-engine.js` — Python 3.12 de verdade no navegador (Pyodide, carregado do CDN sob demanda) num Web Worker: executa o código, interrompe laços infinitos (12 s) e traduz os erros; o pandas é carregado só no nível Avançado
- `js/py-runner.py` — executor Python (dados da NexusMarket + código do aluno, captura do print e do erro com a linha)
- `js/py-data.js` — dados da trilha de Python (vendas, produtos, clientes, textos sujos, CSV e DataFrames)
- `js/py-lang.js` — Python no editor: cores, sugestões (funções, métodos, pandas, variáveis e campos), dica de argumentos e recuo automático
- `js/py-exercises.js` — os 150 exercícios de Python (fundamentos, biblioteca padrão e pandas)
- `js/py-lessons.js` e `js/py-outputs.js` — as 44 aulas de Python e a saída real dos exemplos (gerada por `build/py_build.js`)
- `js/py-ui.js` — tela de prática do Python: dados disponíveis, editor, saída e correção pela saída do print()
- `js/ss-data.js`, `js/ss-exercises.js`, `js/ss-lessons.js` — trilha de Lean Six Sigma: 150 casos e 42 aulas, do White ao Black Belt (usa a tela e os gráficos da Gestão; estatística em `gq-charts.js`)
- `js/es-data.js`, `js/es-exercises.js`, `js/es-lessons.js` — trilha de Estatística Aplicada: 150 exercícios e 37 aulas (descritiva, probabilidade, inferência, testes A/B, regressão e previsão; usa a tela e os gráficos da Gestão)
- `js/en-exercises.js` — os 150 exercícios de Inglês (escolher a resposta, completar, montar a frase, ouvir, ditado, ordenar o diálogo, classificar)
- `js/en-lessons.js` — as 39 aulas de Inglês (Situação, Frases-chave, Diálogo com áudio, Cuidados, Sua vez), com 3 questões de prova por aula
- `js/en-ui.js` — tela de prática do Inglês: áudio em inglês, montar frase, correção tolerante a contrações e prática de fala (reconhecimento de voz)
- `js/calculator.js` — calculadora dos exercícios de cálculo
- `js/quiz-sql.js` — 3 questões de prova para cada uma das 43 aulas de SQL
- `js/exams.js` — provas de 15 questões que liberam os certificados (mínimo 11 acertos, 70%)
- `js/profile.js` — perfil público: foto (reduzida para 256 px) ou avatar, bio de até 280 caracteres e até 5 hobbies
- `js/lessons.js` — as 43 aulas de SQL, o roteiro de narração de cada slide e o componente de carrossel
- `js/narrator.js` — narração bilíngue (português e inglês): toca a voz gravada (assets/audio, um MP3 por aula) quando existe; senão usa a melhor voz neural do navegador
- `js/sfx.js` — comemorações sonoras originais (fanfarra, torcida e buzina) sintetizadas com Web Audio
- `js/exercises.js` — os 150 exercícios de SQL
- `js/seed.js` — banco de exemplo da NexusMarket (gerado por `build/gen_seed.py`)
- `js/sql-engine.js` — execução, emulação de procedures e correção
- `js/storage.js` — LocalStorage com progresso separado por tema, salvamento automático, backup e migração da versão anterior
- `js/cloud.js` — login com Google (Firebase) e sincronização do progresso e do ranking no Firestore
- `js/auth.js` — login e cadastro do nome de jornada
- `js/achievements.js` — XP, promoções, conquistas e ranking
- `js/dashboard.js` — painel de evolução
- `js/certificate.js` — 13 certificados por trilha, desenhados em canvas, com medalha, símbolo do tema e brasão (PDF, impressão, compartilhamento)
- `js/overview.js` — Visão geral: consolida todas as trilhas em Painel, Trilha, Conquistas, Ranking e Certificados, com o seletor de tema no topo dessas páginas
- `js/ui.js` / `js/app.js` — componentes e orquestração

## Publicando uma atualização
Antes de cada upload, rode `python build/bump_version.py`. Ele coloca `?v=<data-hora>` nos arquivos js/css do
`index.html`, e assim os navegadores baixam a versão nova em vez de usar a do cache.

## Validando a trilha de Python
`node build/py_build.js` executa os 150 gabaritos e os exemplos das aulas no Pyodide local
(baixe o pyodide-core 0.26.4 e os wheels de numpy/pandas e aponte PYODIDE_DIR para a pasta)
e regrava `js/py-outputs.js`.

## Adicionando um novo tema
1. Em `js/tracks.js`, mude o `status` do tema para `'ativo'` e defina `start` e `total`.
2. Crie os módulos de exercícios e aulas do tema (use `exercises.js` e `lessons.js` como modelo).
3. O progresso de cada tema fica salvo separado em `state.tracks[id]`.

## Login com Google e progresso na nuvem (Firebase)
O projeto já vem ligado ao Firebase `trust-intelligence-academy` (configuração em `js/cloud.js`).
- Login: Firebase Authentication com Google. O domínio do site precisa estar em
  Authentication → Configurações → Domínios autorizados (ex.: `darlitontrust-create.github.io`).
- Progresso: documento `users/{uid}` no Firestore, gravado ~2,5 s após cada salvamento por uma transação
  que UNE o progresso do aparelho com o que já está na nuvem (exercícios, provas, promoções e conquistas
  dos dois aparelhos são somados; nada é sobrescrito). O LocalStorage continua como cópia local; sem
  internet, o envio é refeito sozinho quando a conexão volta. Um ouvinte em tempo real traz para a tela
  o que outro aparelho gravou.
- Ranking: `leaderboard/{uid}` com apelido e XP por trilha (a liga fica real para quem está logado).
- No primeiro login com Google, o progresso feito sem login naquele navegador é levado para a conta.
- Regras do Firestore (cada aluno lê e grava só o próprio progresso):

      rules_version = '2';
      service cloud.firestore {
        match /databases/{database}/documents {
          match /users/{uid} { allow read, write: if request.auth != null && request.auth.uid == uid; }
          match /leaderboard/{uid} {
            allow read: if request.auth != null;
            allow write: if request.auth != null && request.auth.uid == uid;
          }
        }
      }

Dentro de visualizadores em iframe a nuvem fica desligada e o app usa só o LocalStorage.

## Narração com voz neural gravada (recomendado)
A voz do navegador varia de aparelho para aparelho. Para todos ouvirem a mesma voz humana:

    cd build
    pip install edge-tts
    python gen_audio.py                      # Francisca (padrão)
    # ou: python gen_audio.py --voice pt-BR-AntonioNeural --label "Antônio (neural)"

São 620 slides de SQL e Excel (1.101 trechos), cerca de 25 a 40 MB de MP3 em assets/audio/. A plataforma detecta
`assets/audio/manifest.json` sozinha. Se alterar textos de aulas ou exercícios, rode antes
`node export_narration.js` para atualizar `narration.json` e apague os MP3 dos slides alterados.
O edge-tts é gratuito, mas não oficial; para uso comercial, gere com o Azure AI Speech (mesmas vozes).

## Sons
Acerto = comemoração curta · promoção e prova aprovada = fanfarra maior · cargo final e prova final = comemoração completa.
O ícone de alto-falante no topo liga e desliga os sons; em Perfil dá para ouvir os três.

## Certificados e provas
- Etapa (9): a prova é liberada a cada promoção (17, 34 e 50 exercícios do nível). Faixa lateral colorida com o hexágono do tema, 1, 2 ou 3 estrelas conforme a etapa dentro do nível, a medalha e o progresso no nível.
- Nível (3): a prova é liberada ao concluir os 50 exercícios do nível. Faixa lateral com o tema, a medalha e as 3 etapas cumpridas (cargo de cada uma); brasão com louros à direita.
- Final (1): a prova é liberada aos 150 exercícios. Dourado + neon; faixa lateral com os 3 níveis concluídos e suas medalhas; brasão com coroa à direita.
- Medalhas hexagonais lapidadas: Bronze (Iniciante), Prata (Intermediário), Ouro (Avançado e final), com fitas na cor do tema.
- Prova: 15 questões sorteadas das aulas do escopo, alternativas embaralhadas. O certificado é liberado com 11 acertos (70%).
  Abaixo disso, a revisão mostra os erros com explicação e o botão "Refazer prova" sorteia uma prova nova.
Carga horária = exercícios × 20 min (etapa ≈ 5h40, nível 16h40, final 50 horas).

## Narração gravada (opcional, voz neural)
No seu computador, com internet:
    pip install edge-tts
    cd build
    python gen_audio.py            # Francisca (pt-BR) + Ava (en-US)
Envie a pasta `assets/audio` (≈350 MP3 + manifest.json) para o GitHub em até 4 envios (o site aceita 100 arquivos por vez).
Depois de mudar o texto das aulas: `node export_narration.js` e `python gen_audio.py` de novo (só o que mudou é regerado).
