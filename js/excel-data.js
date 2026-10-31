/* =====================================================================
   excel-data.js — Planilhas da trilha de Excel (empresa NexusMarket)
   ---------------------------------------------------------------------
   Dados fixos para que cada exercício tenha um gabarito estável.
   Datas em número serial (formato de exibição dd/mm/aaaa).
   HOJE() na plataforma = 30/06/2026.
   ===================================================================== */
(function (global) {
  'use strict';
  const S = function (d) { const p = d.split('-'); return Math.round((Date.UTC(+p[0], +p[1] - 1, +p[2]) - Date.UTC(1899, 11, 30)) / 86400000); };

  const produtos = [
    ['P001', 'Smartphone Galaxy A55', 'Eletrônicos', 2199, 1500, 35, 'TecnoMax'],
    ['P002', 'Fone Bluetooth Pulse', 'Eletrônicos', 349.9, 180, 120, 'SoundCo'],
    ['P003', 'Smart TV 50 4K', 'Eletrônicos', 2899, 2100, 12, 'TecnoMax'],
    ['P004', 'Notebook Pro 14', 'Informática', 5499, 4100, 8, 'CompuBR'],
    ['P005', 'Mouse Sem Fio', 'Informática', 89.9, 35, 250, 'CompuBR'],
    ['P006', 'Teclado Mecânico', 'Informática', 429, 210, 60, 'CompuBR'],
    ['P007', 'Monitor 27 IPS', 'Informática', 1599, 1080, 18, 'TecnoMax'],
    ['P008', 'Air Fryer 5L', 'Casa', 449.9, 250, 40, 'LarFácil'],
    ['P009', 'Cafeteira Expresso', 'Casa', 899, 540, 22, 'LarFácil'],
    ['P010', 'Aspirador Robô', 'Casa', 1899, 1200, 5, 'LarFácil'],
    ['P011', 'Bicicleta Aro 29', 'Esportes', 2390, 1600, 7, 'MoveOn'],
    ['P012', 'Tênis de Corrida', 'Esportes', 599.9, 280, 45, 'MoveOn'],
    ['P013', 'Kit Halteres 20kg', 'Esportes', 319, 150, 0, 'MoveOn'],
    ['P014', 'SQL para Análise de Dados', 'Livros', 119, 48, 70, 'Editora Dados'],
    ['P015', 'Excel do Zero ao Avançado', 'Livros', 129, 52, 0, 'Editora Dados'],
  ];
  const preco = {}; const cat = {};
  produtos.forEach(function (p) { preco[p[0]] = p[3]; cat[p[0]] = p[2]; });

  // [pedido, data, vendedor, região, código, qtd, desconto, status]
  const vbase = [
    [1001, '2026-01-05', 'Juliana', 'Sudeste', 'P001', 1, 0, 'Entregue'],
    [1002, '2026-01-09', 'Rafael', 'Sul', 'P005', 4, 0, 'Entregue'],
    [1003, '2026-01-14', 'Bianca', 'Nordeste', 'P008', 2, 0.05, 'Entregue'],
    [1004, '2026-01-20', 'Diego', 'Sudeste', 'P004', 1, 0.1, 'Cancelado'],
    [1005, '2026-01-27', 'Juliana', 'Centro-Oeste', 'P012', 2, 0, 'Entregue'],
    [1006, '2026-02-03', 'Rafael', 'Sudeste', 'P007', 1, 0.05, 'Entregue'],
    [1007, '2026-02-10', 'Bianca', 'Sul', 'P002', 3, 0, 'Entregue'],
    [1008, '2026-02-16', 'Juliana', 'Norte', 'P014', 5, 0, 'Entregue'],
    [1009, '2026-02-23', 'Diego', 'Nordeste', 'P009', 1, 0, 'Entregue'],
    [1010, '2026-03-02', 'Bianca', 'Sudeste', 'P003', 1, 0.1, 'Entregue'],
    [1011, '2026-03-09', 'Rafael', 'Centro-Oeste', 'P006', 2, 0, 'Cancelado'],
    [1012, '2026-03-13', 'Juliana', 'Sudeste', 'P011', 1, 0.05, 'Entregue'],
    [1013, '2026-03-20', 'Diego', 'Sul', 'P005', 6, 0, 'Entregue'],
    [1014, '2026-03-27', 'Bianca', 'Nordeste', 'P001', 2, 0.05, 'Entregue'],
    [1015, '2026-04-03', 'Juliana', 'Sudeste', 'P010', 1, 0, 'Entregue'],
    [1016, '2026-04-08', 'Rafael', 'Norte', 'P013', 2, 0, 'Entregue'],
    [1017, '2026-04-15', 'Diego', 'Sudeste', 'P004', 1, 0.05, 'Entregue'],
    [1018, '2026-04-22', 'Bianca', 'Centro-Oeste', 'P008', 1, 0, 'Entregue'],
    [1019, '2026-04-29', 'Juliana', 'Sul', 'P002', 2, 0, 'Cancelado'],
    [1020, '2026-05-05', 'Rafael', 'Sudeste', 'P001', 1, 0, 'Entregue'],
    [1021, '2026-05-12', 'Diego', 'Nordeste', 'P012', 3, 0.1, 'Entregue'],
    [1022, '2026-05-18', 'Bianca', 'Sudeste', 'P007', 2, 0.05, 'Enviado'],
    [1023, '2026-05-25', 'Juliana', 'Sudeste', 'P006', 1, 0, 'Entregue'],
    [1024, '2026-05-29', 'Rafael', 'Sul', 'P009', 2, 0.05, 'Entregue'],
    [1025, '2026-06-03', 'Diego', 'Centro-Oeste', 'P003', 1, 0, 'Enviado'],
    [1026, '2026-06-09', 'Bianca', 'Norte', 'P015', 4, 0, 'Enviado'],
    [1027, '2026-06-15', 'Juliana', 'Nordeste', 'P004', 1, 0.1, 'Pendente'],
    [1028, '2026-06-19', 'Rafael', 'Sudeste', 'P011', 1, 0, 'Pendente'],
    [1029, '2026-06-24', 'Diego', 'Sudeste', 'P002', 5, 0.05, 'Pendente'],
    [1030, '2026-06-29', 'Bianca', 'Sul', 'P010', 1, 0.05, 'Pendente'],
  ];
  const vendas = vbase.map(function (v) { return [v[0], S(v[1]), v[2], v[3], v[4], cat[v[4]], v[5], preco[v[4]], v[6], v[7]]; });

  const funcionarios = [
    ['F01', 'Helena Duarte', 'Vendas', 'Diretora Comercial', 28000, S('2018-03-12'), S('1979-08-21'), 'HELENA.DUARTE@nexus.com', '  Belo Horizonte'],
    ['F02', 'Marcos Vieira', 'Vendas', 'Gerente de Vendas', 16500, S('2019-07-01'), S('1985-02-14'), 'marcos.vieira@NEXUS.com', 'São Paulo'],
    ['F03', 'Juliana Prado', 'Vendas', 'Vendedora', 6200, S('2021-02-15'), S('1994-11-03'), 'juliana.prado@nexus.com', 'Belo  Horizonte '],
    ['F04', 'Rafael Moura', 'Vendas', 'Vendedor', 5800, S('2022-05-03'), S('1997-06-30'), 'rafael.moura@nexus.com', 'Curitiba'],
    ['F05', 'Bianca Torres', 'Vendas', 'Vendedora', 6900, S('2020-09-21'), S('1992-01-17'), 'Bianca.Torres@nexus.com', ' Recife'],
    ['F06', 'Diego Ramos', 'Vendas', 'Vendedor', 5400, S('2023-01-10'), S('1999-09-09'), 'diego.ramos@nexus.com', 'Salvador'],
    ['F07', 'Carla Mendes', 'Marketing', 'Gerente de Marketing', 15000, S('2019-11-04'), S('1986-04-25'), 'carla.mendes@nexus.com', 'São Paulo'],
    ['F08', 'Lucas Farias', 'Marketing', 'Analista de Marketing', 7200, S('2022-08-16'), S('1996-12-12'), 'lucas.farias@nexus.com', 'Rio de Janeiro'],
    ['F09', 'Fernanda Lima', 'Tecnologia', 'CTO', 32000, S('2017-05-02'), S('1981-03-08'), 'fernanda.lima@nexus.com', 'São Paulo'],
    ['F10', 'Thiago Nunes', 'Tecnologia', 'Engenheiro de Dados', 14500, S('2020-04-13'), S('1990-07-19'), 'thiago.nunes@nexus.com', 'Campinas'],
    ['F11', 'Patrícia Rocha', 'Tecnologia', 'Analista de BI', 9800, S('2021-10-25'), S('1995-05-28'), 'patricia.rocha@nexus.com', 'Belo Horizonte'],
    ['F12', 'André Costa', 'Tecnologia', 'Desenvolvedor', 11200, S('2022-03-07'), S('1993-10-02'), 'andre.costa@nexus.com', 'Florianópolis'],
    ['F13', 'Sônia Barros', 'Financeiro', 'Controller', 17800, S('2018-08-20'), S('1983-12-01'), 'sonia.barros@nexus.com', 'São Paulo'],
    ['F14', 'Paulo Henrique', 'Logística', 'Coordenador de Logística', 10400, S('2020-01-27'), S('1988-06-15'), 'paulo.henrique@nexus.com', 'Contagem'],
  ];

  const clientes = [
    ['C001', 'ana souza', 'ana.souza@email.com', '(31) 99876-5432', 'Belo Horizonte', 'MG', 'Varejo', S('2024-01-15')],
    ['C002', 'BRUNO LIMA', 'bruno.lima@email.com', '(11) 98765-4321', 'São Paulo', 'SP', 'Atacado', S('2024-02-20')],
    ['C003', 'Camila Rocha', 'camila@email.com', '(21) 97654-3210', 'Rio de Janeiro', 'RJ', 'Varejo', S('2024-03-05')],
    ['C004', 'daniel alves', 'daniel.alves@email.com', '(41) 96543-2109', 'Curitiba', 'PR', 'Varejo', S('2024-03-18')],
    ['C005', 'Eduarda Melo', 'eduarda.melo@email.com', '(31) 95432-1098', 'Belo Horizonte', 'MG', 'Corporativo', S('2024-04-02')],
    ['C006', 'felipe castro', 'felipe.c@email.com', '(51) 94321-0987', 'Porto Alegre', 'RS', 'Atacado', S('2024-05-11')],
    ['C007', 'Gabriela Nunes', 'gabi.nunes@email.com', '(11) 93210-9876', 'São Paulo', 'SP', 'Varejo', S('2024-06-23')],
    ['C008', 'HENRIQUE DIAS', 'henrique.dias@email.com', '(71) 92109-8765', 'Salvador', 'BA', 'Varejo', S('2024-07-30')],
    ['C009', 'Isabela Freitas', 'isa.freitas@email.com', '(81) 91098-7654', 'Recife', 'PE', 'Corporativo', S('2024-09-14')],
    ['C010', 'joão pedro reis', 'jp.reis@email.com', '(31) 90987-6543', 'Belo Horizonte', 'MG', 'Varejo', S('2024-11-02')],
    ['C011', 'Karen Oliveira', 'karen.o@empresa.com.br', '(19) 98876-5432', 'Campinas', 'SP', 'Atacado', S('2025-01-19')],
    ['C012', 'leonardo pires', 'leo.pires@email.com', '(85) 97765-4321', 'Fortaleza', 'CE', 'Varejo', S('2025-03-08')],
    ['C013', 'Mariana Teixeira', 'mari.t@empresa.com.br', '(21) 96654-3210', 'Rio de Janeiro', 'RJ', 'Corporativo', S('2025-05-27')],
    ['C014', 'NICOLAS BARBOSA', 'nicolas.b@email.com', '(34) 95543-2109', 'Uberlândia', 'MG', 'Varejo', S('2025-08-12')],
    ['C015', 'olívia martins', 'olivia.m@email.com', '(48) 94432-1098', 'Florianópolis', 'SC', 'Varejo', S('2026-02-03')],
  ];

  const notas = [
    ['Alice', 8.5, 7, 9, 2, 'A'], ['Bruno', 5, 6.5, 7, 6, 'A'], ['Carla', 9.5, 9, 10, 0, 'B'], ['Davi', 4, 5.5, 6, 12, 'B'],
    ['Elisa', 7, 8, 7.5, 3, 'A'], ['Fábio', 6, 5, 8, 4, 'B'], ['Gisele', 3.5, 4, 5, 9, 'A'], ['Heitor', 7.5, 6.5, 8, 1, 'B'],
    ['Íris', 10, 9.5, 9, 0, 'A'], ['Jonas', 6.5, 7, 6, 11, 'B'], ['Kátia', 8, 8.5, 9.5, 2, 'A'], ['Leo', 5.5, 6, 4, 5, 'B'],
    ['Marta', 9, 7.5, 8.5, 1, 'A'], ['Nina', 4.5, 6, 7, 3, 'B'], ['Otto', 7, 7, 7, 8, 'A'],
  ];

  const metas = [
    ['Juliana', S('2026-04-01'), 7000, 2391.3], ['Rafael', S('2026-04-01'), 4000, 638], ['Bianca', S('2026-04-01'), 3000, 449.9], ['Diego', S('2026-04-01'), 6000, 5224.05],
    ['Juliana', S('2026-05-01'), 6000, 429], ['Rafael', S('2026-05-01'), 5000, 3906.1], ['Bianca', S('2026-05-01'), 5000, 3038.1], ['Diego', S('2026-05-01'), 2000, 1619.73],
    ['Juliana', S('2026-06-01'), 8000, 4949.1], ['Rafael', S('2026-06-01'), 3000, 2390], ['Bianca', S('2026-06-01'), 3000, 2320.05], ['Diego', S('2026-06-01'), 5000, 4560.6],
  ];

  const faixas = [[0, 0.02, 'Bronze'], [3000, 0.03, 'Prata'], [6000, 0.05, 'Ouro'], [10000, 0.07, 'Diamante']];
  const regioes = [['Sudeste', 25, 'Marcos Vieira'], ['Sul', 35, 'Marcos Vieira'], ['Nordeste', 45, 'Helena Duarte'], ['Centro-Oeste', 40, 'Helena Duarte'], ['Norte', 60, 'Helena Duarte']];
  const feriados = [[S('2026-01-01'), 'Confraternização Universal'], [S('2026-02-16'), 'Carnaval'], [S('2026-02-17'), 'Carnaval'], [S('2026-04-03'), 'Sexta-feira Santa'], [S('2026-04-21'), 'Tiradentes'], [S('2026-05-01'), 'Dia do Trabalho'], [S('2026-06-04'), 'Corpus Christi']];
  const simulacao = [['Valor financiado', 30000], ['Taxa mensal', 0.015], ['Prazo (meses)', 24], ['Aporte mensal', 500], ['Rentabilidade mensal', 0.008], ['Meses de aplicação', 36]];

  const DATA = {
    Vendas: { cols: ['Pedido', 'Data', 'Vendedor', 'Região', 'Código', 'Categoria', 'Qtd', 'Preço Unit.', 'Desconto', 'Status'], rows: vendas, formats: { B: 'date', H: 'money', I: 'pct' } },
    Produtos: { cols: ['Código', 'Produto', 'Categoria', 'Preço', 'Custo', 'Estoque', 'Fornecedor'], rows: produtos, formats: { D: 'money', E: 'money' } },
    'Funcionários': { cols: ['Matrícula', 'Nome', 'Departamento', 'Cargo', 'Salário', 'Admissão', 'Nascimento', 'E-mail', 'Cidade'], rows: funcionarios, formats: { E: 'money', F: 'date', G: 'date' } },
    Clientes: { cols: ['Código', 'Nome', 'E-mail', 'Telefone', 'Cidade', 'UF', 'Segmento', 'Cadastro'], rows: clientes, formats: { H: 'date' } },
    Notas: { cols: ['Aluno', 'Prova 1', 'Prova 2', 'Trabalho', 'Faltas', 'Turma'], rows: notas },
    Metas: { cols: ['Vendedor', 'Mês', 'Meta', 'Realizado'], rows: metas, formats: { B: 'date', C: 'money', D: 'money' } },
    Faixas: { cols: ['Vendas a partir de', 'Comissão', 'Nível'], rows: faixas, formats: { A: 'money', B: 'pct' } },
    'Regiões': { cols: ['Região', 'Frete', 'Gerente'], rows: regioes, formats: { B: 'money' } },
    Feriados: { cols: ['Data', 'Feriado'], rows: feriados, formats: { A: 'date' } },
    'Simulação': { cols: ['Parâmetro', 'Valor'], rows: simulacao },
  };

  global.ExcelData = DATA;
})(typeof window !== 'undefined' ? window : globalThis);
