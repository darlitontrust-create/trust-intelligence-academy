require('./shim.js');
globalThis.window=globalThis;
eval(require('fs').readFileSync('../js/seed.js','utf8'));
require('../js/sql-engine.js');
const {EXERCISES}=require('../js/exercises.js');
(async()=>{
 await SQLEngine.init();
 let fail=0;
 const only=process.argv[2];
 for(const ex of EXERCISES){ if(only&&!ex.id.startsWith(only))continue;
   const r=SQLEngine.evaluate(ex,ex.q);
   if(r.status!=='correct'){fail++;console.log(ex.id,r.status,r.title,r.explain,r.message||'');}
 }
 console.log('gabaritos reprovados:',fail);
 // casos errados
 const E=id=>EXERCISES.find(e=>e.id===id);
 const tests=[['1-10',"SELECT * FROM clientes;"],['1-10',"SELECT * FROM clientes WHERE estado = \"MG\";"],['1-03',"SELECT nome, email, FROM clientes;"],
 ['1-03',"SELECT nome, emial FROM clientes;"],['1-20',"SELECT nome, preco FROM produtos ORDER BY preco;"],['1-40',"SELECT cliente_id, COUNT(*) FROM pedidos WHERE COUNT(*)>2 GROUP BY cliente_id;"],
 ['1-30',"SELECT estado, COUNT(*) FROM clientes\nORDER BY estado\nGROUP BY estado;"],['2-01',"SELECT p.id, c.nome, p.valor_total\nFROM pedidos p JOIN clientes c ON c.id = p.cliente_id"],
 ['2-31',"SELECT c.nome, GROUP_CONCAT(p.nome, ', ') FROM produtos p JOIN categorias c ON p.categoria_id=c.id GROUP BY c.nome ORDER BY c.nome;"],
 ['3-32',"CREATE PROCEDURE sp_pedidos_cliente (@cliente_id INTEGER) AS BEGIN\n  SELECT id, data_pedido, status, valor_total FROM pedidos WHERE cliente_id = @cliente_id ORDER BY data_pedido;\nEND;"],
 ['3-49',"SELECT id, valor_total FROM pedidos WHERE strftime('%Y', data_pedido) = '2026';"],['1-01',"SELEC * FROM clientes"],['2-01',"SELECT id FROM pedidos p JOIN clientes c ON c.id=p.cliente_id"],
 ['1-46',"SELECT nome, preco FROM produtos WHERE preco > 1076;"],['3-28',"CREATE TRIGGER t BEFORE INSERT ON itens_pedido WHEN NEW.quantidade <= 0 BEGIN SELECT RAISE(ABORT,'x'); END;"],
 ['1-13',"SELECT nome, preco\nFROM produtos\nWHERE categoria_id = 2 AND preco < 500\n-- comentário"]];
 for(const [id,sql] of tests){const r=SQLEngine.evaluate(E(id),sql);console.log('\n['+id+']',r.status,'|',r.title,'|',r.explain,'| L'+r.line+':C'+r.col);}
})();
