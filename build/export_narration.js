/* Exporta o roteiro falado de todos os slides para build/narration.json.
   Uso (na pasta build/):  node export_narration.js
   Requer Python 3 (o SQLite do Python executa os exemplos ao vivo). */
const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process');
globalThis.window = globalThis;
// motor SQLite mínimo via Python, só para contar as linhas dos exemplos
const PY = `import sys,json,sqlite3,re
inp=json.load(sys.stdin);db=sqlite3.connect(':memory:')
def st(s):
  o=[];b=''
  for p in re.split(r'(;)',s):
    b+=p
    if p==';' and sqlite3.complete_statement(b): o.append(b); b=''
  if b.strip(): o.append(b)
  return [x for x in o if x.strip().strip(';').strip()]
try:
  for p in inp['prev']: db.executescript(p)
  r=[]
  for s in st(inp['sql']):
    c=db.execute(s)
    if c.description: r.append({'columns':[d[0] for d in c.description],'values':[list(x) for x in c.fetchall()]})
  print(json.dumps({'ok':r}))
except Exception as e: print(json.dumps({'err':str(e)}))`;
class Database { constructor() { this.prev = []; }
  exec(sql) { const o = JSON.parse(execFileSync('python3', ['-c', PY], { input: JSON.stringify({ prev: this.prev, sql }) }).toString());
    if (o.err) throw new Error(o.err); this.prev.push(sql); return o.ok; } close() {} }
globalThis.initSqlJs = async () => ({ Database });
globalThis.performance = globalThis.performance || require('perf_hooks').performance;
const js = (f) => eval(fs.readFileSync(path.join(__dirname, '..', 'js', f), 'utf8'));
globalThis.UI = globalThis.UI || { esc: (x) => String(x == null ? '' : x).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]) };
js('seed.js'); js('exercises.js'); js('excel-engine.js'); js('excel-data.js'); js('excel-exercises.js'); js('dax-data.js'); js('dax-engine.js'); js('dax-exercises.js'); js('gq-data.js'); js('gq-charts.js'); js('gq-exercises.js'); js('py-data.js'); js('py-exercises.js'); js('narrator.js'); js('sql-engine.js'); js('formula-editor.js'); js('dax-lang.js'); js('lessons.js'); js('excel-lessons.js'); js('dax-lessons.js'); js('gq-lessons.js'); js('py-outputs.js'); js('py-lessons.js');
(async () => {
  await SQLEngine.init();
  const seen = new Map();
  SQLBank.EXERCISES.concat(ExcelBank.EXERCISES, PBIBank.EXERCISES, GQBank.EXERCISES, PyBank.EXERCISES).forEach((ex) => Lessons.narration(ex).forEach((clip) => { if (!seen.has(clip.id)) seen.set(clip.id, clip); }));
  const out = [...seen.values()];
  fs.writeFileSync(path.join(__dirname, 'narration.json'), JSON.stringify(out, null, 1));
  console.log(out.length + ' clipes, ' + out.reduce((s, c) => s + c.chunks.length, 0) + ' trechos de fala → build/narration.json');
})();
