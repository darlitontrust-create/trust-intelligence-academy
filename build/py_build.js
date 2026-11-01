/* Valida a trilha de Python e gera js/py-outputs.js (saídas reais dos exemplos das aulas).
   Uso: node build/py_build.js   (requer o Pyodide local: PYODIDE_DIR) */
const path = require('path'), fs = require('fs');
globalThis.window = globalThis;
const { run } = require('./pyrun.js');
require(path.join(__dirname, '..', 'js', 'py-exercises.js'));
require(path.join(__dirname, '..', 'js', 'py-lessons.js'));
(async () => {
  const E = PyBank.EXERCISES, L = PyLessons.LESSONS, MAP = PyLessons.MAP;
  const errs = [];
  console.log('exercícios', E.length, [1, 2, 3].map(l => E.filter(e => e.level === l).length).join('/'), '· aulas', Object.keys(L).length);
  E.forEach(e => { if (!MAP[e.t]) errs.push('sem aula: ' + e.id + ' ' + e.t); });
  const used = new Set(E.map(e => MAP[e.t])); Object.keys(L).forEach(k => { if (!used.has(k)) errs.push('aula sem exercício: ' + k); });
  const outs = {}, verbose = process.argv.includes('-v');
  for (const e of E) {
    const r = await run(e.q, e.pd);
    if (r.err) errs.push(e.id + ' ERRO ' + r.err.type + ': ' + r.err.msg);
    else if (!r.out.trim()) errs.push(e.id + ' sem saída');
    if (e.start) { const s = await run(e.start, e.pd); if (s.err) errs.push(e.id + ' código inicial com erro: ' + s.err.msg); else if (s.out.trim() && s.out === r.out) errs.push(e.id + ' código inicial já resolve'); }
    if (verbose) console.log('--- ' + e.id + ' ' + e.n + '\n' + r.out.trimEnd());
  }
  for (const k of Object.keys(L)) {
    const ex = L[k].exemplo; const r = await run(ex.c, !!ex.pd);
    if (r.err) errs.push('aula ' + k + ' ERRO ' + r.err.type + ': ' + r.err.msg); else outs[k] = r.out;
    const s = await run(L[k].sintaxe, true); if (s.err && s.err.type !== 'NameError') errs.push('sintaxe ' + k + ' ' + s.err.type + ': ' + s.err.msg);
  }
  fs.writeFileSync(path.join(__dirname, '..', 'js', 'py-outputs.js'), '/* Gerado por build/py_build.js: saída real dos exemplos das aulas de Python. */\nwindow.PyOutputs = ' + JSON.stringify(outs, null, 1) + ';\n');
  console.log(errs.length ? errs.join('\n') : 'tudo certo');
  process.exit(errs.length ? 1 : 0);
})();
