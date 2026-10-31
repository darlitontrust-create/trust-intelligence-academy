# Trust Intelligence Academy

Academia gamificada de dados, BI e IA. Trilhas disponíveis: **SQL Prático** e **Excel Prático**.
Em breve: Power BI & DAX, Python para Dados, IA para Dados e Estatística Aplicada.
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
- `index.html` — página única
- `assets/logo.png`, `assets/logo-256.png` — logo no estilo neon da plataforma
- `css/styles.css` — tema Dark Premium / glassmorphism
- `css/codemirror.css` — base e tema do editor
- `js/tracks.js` — catálogo de temas, com cor e símbolo de cada um (SQL azul, Excel verde, Power BI amarelo, Python amarelo-limão, Estatística cinza)
- `js/excel-engine.js` — motor de fórmulas do Excel em português (";" como separador, "," decimal, matrizes dinâmicas, PROCX, SOMASES, LET…)
- `js/excel-data.js` — planilhas da NexusMarket (Vendas, Produtos, Funcionários, Clientes, Notas, Metas…)
- `js/excel-exercises.js` — os 150 exercícios de Excel
- `js/excel-lessons.js` — as 37 aulas de Excel, com exemplo calculado ao vivo e 3 questões de prova por aula
- `js/excel-ui.js` — tela de prática do Excel: planilha, barra de fórmulas e correção célula a célula
- `js/quiz-sql.js` — 3 questões de prova para cada uma das 43 aulas de SQL
- `js/exams.js` — provas de 15 questões que liberam os certificados (mínimo 11 acertos, 70%)
- `js/profile.js` — perfil público: foto (reduzida para 256 px) ou avatar, bio de até 280 caracteres e até 5 hobbies
- `js/lessons.js` — as 43 aulas de SQL, o roteiro de narração de cada slide e o componente de carrossel
- `js/narrator.js` — narração: toca a voz gravada (assets/audio) quando existe; senão usa a melhor voz neural do navegador
- `js/sfx.js` — comemorações sonoras originais (fanfarra, torcida e buzina) sintetizadas com Web Audio
- `js/exercises.js` — os 150 exercícios de SQL
- `js/seed.js` — banco de exemplo da NexusMarket (gerado por `build/gen_seed.py`)
- `js/sql-engine.js` — execução, emulação de procedures e correção
- `js/storage.js` — LocalStorage com progresso separado por tema, salvamento automático, backup e migração da versão anterior
- `js/auth.js` — login e cadastro do nome de jornada
- `js/achievements.js` — XP, promoções, conquistas e ranking
- `js/dashboard.js` — painel de evolução
- `js/certificate.js` — 13 certificados por trilha, desenhados em canvas, com medalha, símbolo do tema e brasão (PDF, impressão, compartilhamento)
- `js/ui.js` / `js/app.js` — componentes e orquestração

## Adicionando um novo tema
1. Em `js/tracks.js`, mude o `status` do tema para `'ativo'` e defina `start` e `total`.
2. Crie os módulos de exercícios e aulas do tema (use `exercises.js` e `lessons.js` como modelo).
3. O progresso de cada tema fica salvo separado em `state.tracks[id]`.

## Login com Google de verdade
1. Crie um OAuth Client ID (tipo Web) no Google Cloud Console e autorize a origem do site.
2. Cole o Client ID em `AUTH_CONFIG.googleClientId`, no topo de `js/auth.js`.

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
