/* Executa código Python com o Pyodide local (validação dos gabaritos e saídas das aulas).
   Uso: node pyrun.js  (exporta run(code, pandas) quando importado) */
const path = require('path'), fs = require('fs');
globalThis.window = globalThis;
require(path.join(__dirname, '..', 'js', 'py-data.js'));
const PYO = process.env.PYODIDE_DIR || '/home/claude/pyo/pyodide/';
let py = null, pandasLoaded = false;
const RUNNER = fs.readFileSync(path.join(__dirname, '..', 'js', 'py-runner.py'), 'utf8');
async function init() {
  if (py) return py;
  const { loadPyodide } = require(path.join(PYO, 'pyodide.js'));
  py = await loadPyodide({ indexURL: PYO, stdout: () => {}, stderr: () => {} });
  py.runPython(RUNNER);
  return py;
}
async function run(code, pandas) {
  await init();
  if (pandas && !pandasLoaded) { await py.loadPackage(['pandas'], { messageCallback: () => {} }); pandasLoaded = true; }
  py.globals.set('__src', code); py.globals.set('__pre', globalThis.PyData.prelude(!!pandas));
  return JSON.parse(py.runPython('__tia_run(__src, __pre)'));
}
module.exports = { run, init };
if (require.main === module) (async () => {
  const r = await run(process.argv[2] || 'print(len(vendas))', process.argv[3] === 'pd');
  console.log(r.out); if (r.err) console.log('ERR', r.err);
})();
