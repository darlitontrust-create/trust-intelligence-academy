CREATE TABLE departamentos (
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL,
  orcamento REAL
);
CREATE TABLE funcionarios (
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL,
  cargo TEXT,
  departamento_id INTEGER REFERENCES departamentos(id),
  salario REAL,
  gerente_id INTEGER REFERENCES funcionarios(id),
  data_admissao TEXT
);
CREATE TABLE clientes (
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT,
  cidade TEXT,
  estado TEXT,
  segmento TEXT,
  data_cadastro TEXT
);
CREATE TABLE categorias (
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL
);
CREATE TABLE produtos (
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL,
  categoria_id INTEGER REFERENCES categorias(id),
  preco REAL,
  custo REAL,
  estoque INTEGER,
  ativo INTEGER
);
CREATE TABLE pedidos (
  id INTEGER PRIMARY KEY,
  cliente_id INTEGER REFERENCES clientes(id),
  vendedor_id INTEGER REFERENCES funcionarios(id),
  data_pedido TEXT,
  status TEXT,
  valor_total REAL
);
CREATE TABLE itens_pedido (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pedido_id INTEGER REFERENCES pedidos(id),
  produto_id INTEGER REFERENCES produtos(id),
  quantidade INTEGER,
  preco_unitario REAL
);
CREATE TABLE pagamentos (
  id INTEGER PRIMARY KEY,
  pedido_id INTEGER REFERENCES pedidos(id),
  metodo TEXT,
  valor REAL,
  data_pagamento TEXT
);
CREATE TABLE metas (
  vendedor_id INTEGER,
  mes TEXT,
  valor_meta REAL,
  PRIMARY KEY (vendedor_id, mes)
);
CREATE TABLE metas_staging (
  vendedor_id INTEGER,
  mes TEXT,
  valor_meta REAL
);
CREATE TABLE precos_fornecedor (
  produto_id INTEGER PRIMARY KEY,
  novo_preco REAL
);
CREATE TABLE log_precos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  produto_id INTEGER,
  preco_antigo REAL,
  preco_novo REAL,
  alterado_em TEXT
);
CREATE TABLE auditoria_pedidos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pedido_id INTEGER,
  status_antigo TEXT,
  status_novo TEXT,
  alterado_em TEXT
);;
INSERT INTO departamentos (id, nome, orcamento) VALUES
  (1, 'Vendas', 500000),
  (2, 'Marketing', 200000),
  (3, 'Tecnologia', 650000),
  (4, 'Financeiro', 300000),
  (5, 'Logística', 350000);
INSERT INTO funcionarios (id, nome, cargo, departamento_id, salario, gerente_id, data_admissao) VALUES
  (1, 'Helena Duarte', 'Diretora Comercial', 1, 28000, NULL, '2018-03-12'),
  (2, 'Marcos Vieira', 'Gerente de Vendas', 1, 16500, 1, '2019-07-01'),
  (3, 'Juliana Prado', 'Vendedora', 1, 6200, 2, '2021-02-15'),
  (4, 'Rafael Moura', 'Vendedor', 1, 5800, 2, '2022-05-03'),
  (5, 'Bianca Torres', 'Vendedora', 1, 6900, 2, '2020-09-21'),
  (6, 'Diego Ramos', 'Vendedor', 1, 5400, 2, '2023-01-10'),
  (7, 'Carla Mendes', 'Gerente de Marketing', 2, 15000, 1, '2019-11-04'),
  (8, 'Lucas Farias', 'Analista de Marketing', 2, 7200, 7, '2022-08-16'),
  (9, 'Fernanda Lima', 'CTO', 3, 32000, NULL, '2017-05-02'),
  (10, 'Thiago Nunes', 'Engenheiro de Dados', 3, 14500, 9, '2020-04-13'),
  (11, 'Patrícia Rocha', 'Analista de BI', 3, 9800, 10, '2021-10-25'),
  (12, 'André Costa', 'Desenvolvedor', 3, 11200, 9, '2022-03-07'),
  (13, 'Sônia Barros', 'Controller', 4, 17800, NULL, '2018-08-20'),
  (14, 'Paulo Henrique', 'Coordenador de Logística', 5, 10400, NULL, '2020-01-27');
INSERT INTO clientes (id, nome, email, cidade, estado, segmento, data_cadastro) VALUES
  (1, 'Ana Souza', 'ana.souza@email.com', 'Belo Horizonte', 'MG', 'Varejo', '2024-01-15'),
  (2, 'Bruno Lima', 'bruno.lima@email.com', 'São Paulo', 'SP', 'Atacado', '2024-02-20'),
  (3, 'Camila Rocha', 'camila@email.com', 'Rio de Janeiro', 'RJ', 'Varejo', '2024-03-05'),
  (4, 'Daniel Alves', NULL, 'Curitiba', 'PR', 'Varejo', '2024-03-18'),
  (5, 'Eduarda Melo', 'eduarda.melo@email.com', 'Belo Horizonte', 'MG', 'Corporativo', '2024-04-02'),
  (6, 'Felipe Castro', 'felipe.c@email.com', 'Porto Alegre', 'RS', 'Atacado', '2024-05-11'),
  (7, 'Gabriela Nunes', 'gabi.nunes@email.com', 'São Paulo', 'SP', 'Varejo', '2024-06-23'),
  (8, 'Henrique Dias', NULL, 'Salvador', 'BA', 'Varejo', '2024-07-30'),
  (9, 'Isabela Freitas', 'isa.freitas@email.com', 'Recife', 'PE', 'Corporativo', '2024-09-14'),
  (10, 'João Pedro Reis', 'jp.reis@email.com', 'Belo Horizonte', 'MG', 'Varejo', '2024-11-02'),
  (11, 'Karen Oliveira', 'karen.o@email.com', 'Campinas', 'SP', 'Atacado', '2025-01-19'),
  (12, 'Leonardo Pires', 'leo.pires@email.com', 'Fortaleza', 'CE', 'Varejo', '2025-03-08'),
  (13, 'Mariana Teixeira', 'mari.t@email.com', 'Rio de Janeiro', 'RJ', 'Corporativo', '2025-05-27'),
  (14, 'Nicolas Barbosa', 'nicolas.b@email.com', 'Uberlândia', 'MG', 'Varejo', '2025-08-12'),
  (15, 'Olívia Martins', NULL, 'Florianópolis', 'SC', 'Varejo', '2026-02-03');
INSERT INTO categorias (id, nome) VALUES
  (1, 'Eletrônicos'),
  (2, 'Informática'),
  (3, 'Casa'),
  (4, 'Esportes'),
  (5, 'Livros'),
  (6, 'Brinquedos');
INSERT INTO produtos (id, nome, categoria_id, preco, custo, estoque, ativo) VALUES
  (1, 'Smartphone Galaxy A55', 1, 2199.0, 1500, 35, 1),
  (2, 'Fone Bluetooth Pulse', 1, 349.9, 180, 120, 1),
  (3, 'Smart TV 50 4K', 1, 2899.0, 2100, 12, 1),
  (4, 'Caixa de Som Boom', 1, 499.0, 260, 0, 1),
  (5, 'Notebook Pro 14', 2, 5499.0, 4100, 8, 1),
  (6, 'Mouse Sem Fio', 2, 89.9, 35, 250, 1),
  (7, 'Teclado Mecânico', 2, 429.0, 210, 60, 1),
  (8, 'Monitor 27 IPS', 2, 1599.0, 1080, 18, 1),
  (9, 'Webcam Full HD', 2, 259.0, 120, 0, 0),
  (10, 'Air Fryer 5L', 3, 449.9, 250, 40, 1),
  (11, 'Cafeteira Expresso', 3, 899.0, 540, 22, 1),
  (12, 'Jogo de Panelas Inox', 3, 659.0, 330, 15, 1),
  (13, 'Aspirador Robô', 3, 1899.0, 1200, 5, 1),
  (14, 'Bicicleta Aro 29', 4, 2390.0, 1600, 7, 1),
  (15, 'Tênis de Corrida', 4, 599.9, 280, 45, 1),
  (16, 'Kit Halteres 20kg', 4, 319.0, 150, 30, 1),
  (17, 'Garrafa Térmica', 4, 129.9, 45, 90, 1),
  (18, 'SQL para Análise de Dados', 5, 119.0, 48, 70, 1),
  (19, 'Estatística Prática', 5, 98.5, 40, 55, 1),
  (20, 'Python do Zero', 5, 134.0, 52, 0, 1);
INSERT INTO pedidos (id, cliente_id, vendedor_id, data_pedido, status, valor_total) VALUES
  (1, 1, 3, '2025-07-08', 'Entregue', 619.6),
  (2, 2, 5, '2025-07-21', 'Entregue', 1599.0),
  (3, 3, 4, '2025-08-05', 'Entregue', 3717.0),
  (4, 5, 3, '2025-08-19', 'Cancelado', 1599.0),
  (5, 1, 6, '2025-09-02', 'Entregue', 989.0),
  (6, 6, 5, '2025-09-17', 'Entregue', 649.5),
  (7, 7, 4, '2025-10-03', 'Entregue', 4667.7),
  (8, 2, 3, '2025-10-28', 'Entregue', 6118.6),
  (9, 9, 5, '2025-11-11', 'Entregue', 599.9),
  (10, 4, 6, '2025-11-25', 'Cancelado', 3289.8),
  (11, 10, 3, '2025-12-06', 'Entregue', 5096.8),
  (12, 1, 5, '2025-12-19', 'Entregue', 316.0),
  (13, 11, 4, '2026-01-09', 'Entregue', 6097.0),
  (14, 3, 3, '2026-01-23', 'Entregue', 5039.8),
  (15, 12, 6, '2026-02-04', 'Entregue', 878.9),
  (16, 5, 5, '2026-02-18', 'Entregue', 4117.2),
  (17, 6, 4, '2026-03-03', 'Cancelado', 659.0),
  (18, 13, 3, '2026-03-16', 'Entregue', 699.8),
  (19, 2, 5, '2026-03-30', 'Entregue', 7997.8),
  (20, 8, 6, '2026-04-08', 'Entregue', 476.0),
  (21, 1, 4, '2026-04-22', 'Entregue', 6378.6),
  (22, 9, 3, '2026-05-06', 'Entregue', 1818.7),
  (23, 7, 5, '2026-05-19', 'Enviado', 3367.9),
  (24, 11, 6, '2026-05-28', 'Entregue', 7635.8),
  (25, 10, 4, '2026-06-03', 'Enviado', 5796.8),
  (26, 2, 3, '2026-06-10', 'Enviado', 12866.7),
  (27, 13, 5, '2026-06-15', 'Pendente', 1261.2),
  (28, 5, 4, '2026-06-21', 'Pendente', 2390.0),
  (29, 1, 3, '2026-06-26', 'Pendente', 3252.0),
  (30, 12, 5, '2026-06-29', 'Pendente', 2498.0);
INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES
  (1, 2, 1, 349.9),
  (1, 6, 3, 89.9),
  (2, 8, 1, 1599.0),
  (3, 4, 1, 499.0),
  (3, 3, 1, 2899.0),
  (3, 16, 1, 319.0),
  (4, 8, 1, 1599.0),
  (5, 18, 5, 119.0),
  (5, 19, 4, 98.5),
  (6, 17, 5, 129.9),
  (7, 1, 2, 2199.0),
  (7, 6, 3, 89.9),
  (8, 2, 1, 349.9),
  (8, 6, 3, 89.9),
  (8, 5, 1, 5499.0),
  (9, 15, 1, 599.9),
  (10, 14, 1, 2390.0),
  (10, 10, 2, 449.9),
  (11, 4, 2, 499.0),
  (11, 15, 2, 599.9),
  (11, 3, 1, 2899.0),
  (12, 18, 1, 119.0),
  (12, 19, 2, 98.5),
  (13, 3, 1, 2899.0),
  (13, 8, 2, 1599.0),
  (14, 17, 2, 129.9),
  (14, 14, 2, 2390.0),
  (15, 7, 1, 429.0),
  (15, 10, 1, 449.9),
  (16, 8, 2, 1599.0),
  (16, 6, 3, 89.9),
  (16, 17, 5, 129.9),
  (17, 12, 1, 659.0),
  (18, 2, 2, 349.9),
  (19, 5, 1, 5499.0),
  (19, 8, 1, 1599.0),
  (19, 10, 2, 449.9),
  (20, 18, 4, 119.0),
  (21, 2, 2, 349.9),
  (21, 6, 2, 89.9),
  (21, 5, 1, 5499.0),
  (22, 10, 2, 449.9),
  (22, 16, 1, 319.0),
  (22, 15, 1, 599.9),
  (23, 18, 1, 119.0),
  (23, 3, 1, 2899.0),
  (23, 2, 1, 349.9),
  (24, 16, 2, 319.0),
  (24, 3, 2, 2899.0),
  (24, 15, 2, 599.9),
  (25, 1, 2, 2199.0),
  (25, 4, 1, 499.0),
  (25, 10, 2, 449.9),
  (26, 5, 2, 5499.0),
  (26, 8, 1, 1599.0),
  (26, 6, 3, 89.9),
  (27, 6, 3, 89.9),
  (27, 19, 5, 98.5),
  (27, 4, 1, 499.0),
  (28, 14, 1, 2390.0),
  (29, 19, 4, 98.5),
  (29, 1, 1, 2199.0),
  (29, 12, 1, 659.0),
  (30, 11, 1, 899.0),
  (30, 8, 1, 1599.0);
INSERT INTO pagamentos (id, pedido_id, metodo, valor, data_pagamento) VALUES
  (1, 1, 'Pix', 619.6, '2025-07-11'),
  (2, 2, 'Boleto', 1599.0, '2025-07-21'),
  (3, 3, 'Pix', 3717.0, '2025-08-07'),
  (4, 5, 'Pix', 989.0, '2025-09-05'),
  (5, 6, 'Boleto', 649.5, '2025-09-17'),
  (6, 7, 'Boleto', 4667.7, '2025-10-05'),
  (7, 8, 'Cartão', 6118.6, '2025-10-28'),
  (8, 9, 'Boleto', 599.9, '2025-11-14'),
  (9, 11, 'Pix', 5096.8, '2025-12-08'),
  (10, 12, 'Boleto', 316.0, '2025-12-22'),
  (11, 13, 'Boleto', 6097.0, '2026-01-09'),
  (12, 14, 'Cartão', 5039.8, '2026-01-24'),
  (13, 15, 'Cartão', 878.9, '2026-02-05'),
  (14, 16, 'Cartão', 4117.2, '2026-02-21'),
  (15, 18, 'Pix', 699.8, '2026-03-16'),
  (16, 19, 'Pix', 7997.8, '2026-03-30'),
  (17, 20, 'Pix', 476.0, '2026-04-09'),
  (18, 21, 'Boleto', 6378.6, '2026-04-25'),
  (19, 22, 'Boleto', 1818.7, '2026-05-06'),
  (20, 23, 'Pix', 3367.9, '2026-05-19'),
  (21, 24, 'Boleto', 7635.8, '2026-05-28'),
  (22, 25, 'Pix', 5796.8, '2026-06-03'),
  (23, 26, 'Pix', 12866.7, '2026-06-10');
INSERT INTO metas (vendedor_id, mes, valor_meta) VALUES
  (3, '2026-05', 6000),
  (4, '2026-05', 5000),
  (5, '2026-05', 7000),
  (6, '2026-05', 4000),
  (3, '2026-06', 9000),
  (4, '2026-06', 6000),
  (5, '2026-06', 7500),
  (6, '2026-06', 4500);
INSERT INTO metas_staging (vendedor_id, mes, valor_meta) VALUES
  (3, '2026-06', 9500),
  (5, '2026-06', 8000),
  (3, '2026-07', 8500),
  (4, '2026-07', 6500),
  (5, '2026-07', 8000),
  (6, '2026-07', 5000);
INSERT INTO precos_fornecedor (produto_id, novo_preco) VALUES
  (2, 329.9),
  (6, 79.9),
  (10, 429.9),
  (15, 579.9),
  (18, 109.0);