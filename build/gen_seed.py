"""Gera o banco de exemplo (seed) da plataforma e grava js/seed.js.
Os dados são determinísticos para que o gabarito dos exercícios seja estável."""
import random, json, datetime, sqlite3

random.seed(42)

schema = """
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
);
""".strip()

departamentos = [(1,'Vendas',500000),(2,'Marketing',200000),(3,'Tecnologia',650000),(4,'Financeiro',300000),(5,'Logística',350000)]
funcionarios = [
 (1,'Helena Duarte','Diretora Comercial',1,28000,None,'2018-03-12'),
 (2,'Marcos Vieira','Gerente de Vendas',1,16500,1,'2019-07-01'),
 (3,'Juliana Prado','Vendedora',1,6200,2,'2021-02-15'),
 (4,'Rafael Moura','Vendedor',1,5800,2,'2022-05-03'),
 (5,'Bianca Torres','Vendedora',1,6900,2,'2020-09-21'),
 (6,'Diego Ramos','Vendedor',1,5400,2,'2023-01-10'),
 (7,'Carla Mendes','Gerente de Marketing',2,15000,1,'2019-11-04'),
 (8,'Lucas Farias','Analista de Marketing',2,7200,7,'2022-08-16'),
 (9,'Fernanda Lima','CTO',3,32000,None,'2017-05-02'),
 (10,'Thiago Nunes','Engenheiro de Dados',3,14500,9,'2020-04-13'),
 (11,'Patrícia Rocha','Analista de BI',3,9800,10,'2021-10-25'),
 (12,'André Costa','Desenvolvedor',3,11200,9,'2022-03-07'),
 (13,'Sônia Barros','Controller',4,17800,None,'2018-08-20'),
 (14,'Paulo Henrique','Coordenador de Logística',5,10400,None,'2020-01-27'),
]
clientes = [
 (1,'Ana Souza','ana.souza@email.com','Belo Horizonte','MG','Varejo','2024-01-15'),
 (2,'Bruno Lima','bruno.lima@email.com','São Paulo','SP','Atacado','2024-02-20'),
 (3,'Camila Rocha','camila@email.com','Rio de Janeiro','RJ','Varejo','2024-03-05'),
 (4,'Daniel Alves',None,'Curitiba','PR','Varejo','2024-03-18'),
 (5,'Eduarda Melo','eduarda.melo@email.com','Belo Horizonte','MG','Corporativo','2024-04-02'),
 (6,'Felipe Castro','felipe.c@email.com','Porto Alegre','RS','Atacado','2024-05-11'),
 (7,'Gabriela Nunes','gabi.nunes@email.com','São Paulo','SP','Varejo','2024-06-23'),
 (8,'Henrique Dias',None,'Salvador','BA','Varejo','2024-07-30'),
 (9,'Isabela Freitas','isa.freitas@email.com','Recife','PE','Corporativo','2024-09-14'),
 (10,'João Pedro Reis','jp.reis@email.com','Belo Horizonte','MG','Varejo','2024-11-02'),
 (11,'Karen Oliveira','karen.o@email.com','Campinas','SP','Atacado','2025-01-19'),
 (12,'Leonardo Pires','leo.pires@email.com','Fortaleza','CE','Varejo','2025-03-08'),
 (13,'Mariana Teixeira','mari.t@email.com','Rio de Janeiro','RJ','Corporativo','2025-05-27'),
 (14,'Nicolas Barbosa','nicolas.b@email.com','Uberlândia','MG','Varejo','2025-08-12'),
 (15,'Olívia Martins',None,'Florianópolis','SC','Varejo','2026-02-03'),
]
categorias = [(1,'Eletrônicos'),(2,'Informática'),(3,'Casa'),(4,'Esportes'),(5,'Livros'),(6,'Brinquedos')]
produtos = [
 (1,'Smartphone Galaxy A55',1,2199.00,1500,35,1),
 (2,'Fone Bluetooth Pulse',1,349.90,180,120,1),
 (3,'Smart TV 50 4K',1,2899.00,2100,12,1),
 (4,'Caixa de Som Boom',1,499.00,260,0,1),
 (5,'Notebook Pro 14',2,5499.00,4100,8,1),
 (6,'Mouse Sem Fio',2,89.90,35,250,1),
 (7,'Teclado Mecânico',2,429.00,210,60,1),
 (8,'Monitor 27 IPS',2,1599.00,1080,18,1),
 (9,'Webcam Full HD',2,259.00,120,0,0),
 (10,'Air Fryer 5L',3,449.90,250,40,1),
 (11,'Cafeteira Expresso',3,899.00,540,22,1),
 (12,'Jogo de Panelas Inox',3,659.00,330,15,1),
 (13,'Aspirador Robô',3,1899.00,1200,5,1),
 (14,'Bicicleta Aro 29',4,2390.00,1600,7,1),
 (15,'Tênis de Corrida',4,599.90,280,45,1),
 (16,'Kit Halteres 20kg',4,319.00,150,30,1),
 (17,'Garrafa Térmica',4,129.90,45,90,1),
 (18,'SQL para Análise de Dados',5,119.00,48,70,1),
 (19,'Estatística Prática',5,98.50,40,55,1),
 (20,'Python do Zero',5,134.00,52,0,1),
]
pedidos_base = [
 (1,3,'2025-07-08','Entregue'),(2,5,'2025-07-21','Entregue'),(3,4,'2025-08-05','Entregue'),
 (5,3,'2025-08-19','Cancelado'),(1,6,'2025-09-02','Entregue'),(6,5,'2025-09-17','Entregue'),
 (7,4,'2025-10-03','Entregue'),(2,3,'2025-10-28','Entregue'),(9,5,'2025-11-11','Entregue'),
 (4,6,'2025-11-25','Cancelado'),(10,3,'2025-12-06','Entregue'),(1,5,'2025-12-19','Entregue'),
 (11,4,'2026-01-09','Entregue'),(3,3,'2026-01-23','Entregue'),(12,6,'2026-02-04','Entregue'),
 (5,5,'2026-02-18','Entregue'),(6,4,'2026-03-03','Cancelado'),(13,3,'2026-03-16','Entregue'),
 (2,5,'2026-03-30','Entregue'),(8,6,'2026-04-08','Entregue'),(1,4,'2026-04-22','Entregue'),
 (9,3,'2026-05-06','Entregue'),(7,5,'2026-05-19','Enviado'),(11,6,'2026-05-28','Entregue'),
 (10,4,'2026-06-03','Enviado'),(2,3,'2026-06-10','Enviado'),(13,5,'2026-06-15','Pendente'),
 (5,4,'2026-06-21','Pendente'),(1,3,'2026-06-26','Pendente'),(12,5,'2026-06-29','Pendente'),
]
preco = {p[0]: p[3] for p in produtos}
# produtos 9, 13 e 20 nunca são vendidos (úteis para LEFT JOIN / EXCEPT)
pool = [i for i in range(1,21) if i not in (9,13,20)]
forced = {1:[2,6], 8:[2,6], 21:[2,6], 5:[18,19], 12:[18,19], 19:[5,8], 26:[5,8]}
itens = []
pedidos = []
for pid,(cli,vend,data,status) in enumerate(pedidos_base, start=1):
    prods = list(forced.get(pid, []))
    target = len(prods) + (random.randint(0,1) if prods else random.randint(1,3))
    while len(prods) < target:
        c = random.choice(pool)
        if c not in prods: prods.append(c)
    total = 0
    for pr in prods:
        q = random.randint(1,5) if pr in (6,17,18,19) else random.randint(1,2)
        itens.append((pid, pr, q, preco[pr]))
        total += q * preco[pr]
    pedidos.append((pid, cli, vend, data, status, round(total,2)))

pagamentos = []
metodos = ['Pix','Cartão','Boleto']
pg = 1
for p in pedidos:
    if p[4] in ('Entregue','Enviado'):
        d = datetime.date.fromisoformat(p[3]) + datetime.timedelta(days=random.choice([0,0,1,2,3]))
        pagamentos.append((pg, p[0], random.choice(metodos), p[5], d.isoformat()))
        pg += 1

metas = [(3,'2026-05',6000),(4,'2026-05',5000),(5,'2026-05',7000),(6,'2026-05',4000),
         (3,'2026-06',9000),(4,'2026-06',6000),(5,'2026-06',7500),(6,'2026-06',4500)]
metas_staging = [(3,'2026-06',9500),(5,'2026-06',8000),(3,'2026-07',8500),(4,'2026-07',6500),(5,'2026-07',8000),(6,'2026-07',5000)]
precos_fornecedor = [(2,329.90),(6,79.90),(10,429.90),(15,579.90),(18,109.00)]

def lit(v):
    if v is None: return 'NULL'
    if isinstance(v,(int,float)): return repr(v)
    return "'" + str(v).replace("'","''") + "'"
def ins(table, cols, rows):
    return f"INSERT INTO {table} ({', '.join(cols)}) VALUES\n" + ",\n".join("  (" + ", ".join(lit(x) for x in r) + ")" for r in rows) + ";"

data_sql = "\n".join([
 ins('departamentos',['id','nome','orcamento'],departamentos),
 ins('funcionarios',['id','nome','cargo','departamento_id','salario','gerente_id','data_admissao'],funcionarios),
 ins('clientes',['id','nome','email','cidade','estado','segmento','data_cadastro'],clientes),
 ins('categorias',['id','nome'],categorias),
 ins('produtos',['id','nome','categoria_id','preco','custo','estoque','ativo'],produtos),
 ins('pedidos',['id','cliente_id','vendedor_id','data_pedido','status','valor_total'],pedidos),
 ins('itens_pedido',['pedido_id','produto_id','quantidade','preco_unitario'],itens),
 ins('pagamentos',['id','pedido_id','metodo','valor','data_pagamento'],pagamentos),
 ins('metas',['vendedor_id','mes','valor_meta'],metas),
 ins('metas_staging',['vendedor_id','mes','valor_meta'],metas_staging),
 ins('precos_fornecedor',['produto_id','novo_preco'],precos_fornecedor),
])

# separa o CREATE TABLE de cada tabela para exibir só o necessário em cada exercício
creates = {}
for block in schema.split(';'):
    b = block.strip()
    if b:
        name = b.split()[2]
        creates[name] = b + ';'

db = sqlite3.connect(':memory:'); db.executescript(schema + ';\n' + data_sql)
open('../js/seed.js','w').write(
 "/* seed.js — banco de exemplo da empresa fictícia NexusMarket (gerado por build/gen_seed.py).\n"
 "   Cada execução cria um banco novo a partir daqui, então nenhum exercício contamina o outro. */\n"
 "window.SEED = " + json.dumps({"schema": schema, "data": data_sql, "creates": creates}, ensure_ascii=False, indent=1) + ";\n")
open('seed.sql','w').write(schema + ';\n' + data_sql)
print(len(pedidos), len(itens), len(pagamentos))
for r in db.execute("select id,cliente_id,vendedor_id,data_pedido,status,valor_total from pedidos"): print(r)
