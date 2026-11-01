/* =====================================================================
   py-engine.js — Python de verdade no navegador (Pyodide em um Worker)
   ---------------------------------------------------------------------
   • O Pyodide (CPython 3.12 em WebAssembly) é carregado sob demanda,
     dentro de um Web Worker: a página não trava e um laço infinito é
     interrompido pelo limite de tempo (o Worker é recriado).
   • pandas só é carregado nos exercícios que precisam dele.
   • run(código, pandas) → { out, err } com a saída de print() e o erro
     traduzido (tipo, mensagem, linha).
   ===================================================================== */
(function (global) {
  'use strict';
  const VERSION = '0.26.4';
  function base() {
    let b = null; try { b = global.localStorage && localStorage.getItem('tia_pybase'); } catch (e) { /* bloqueado */ }
    return b || 'https://cdn.jsdelivr.net/pyodide/v' + VERSION + '/full/';
  }
  const WORKER = [
    'let py = null, pandas = false;',
    'self.onmessage = async function (e) {',
    '  const m = e.data;',
    '  try {',
    '    if (m.type === "init") {',
    '      importScripts(m.base + "pyodide.js");',
    '      py = await loadPyodide({ indexURL: m.base, stdout: function () {}, stderr: function () {} });',
    '      const r = await fetch(m.runner); py.runPython(await r.text());',
    '      self.postMessage({ id: m.id, ok: true }); return;',
    '    }',
    '    if (m.type === "pandas") { if (!pandas) { await py.loadPackage(["pandas"], { messageCallback: function () {} }); pandas = true; } self.postMessage({ id: m.id, ok: true }); return; }',
    '    if (m.type === "run") {',
    '      py.globals.set("__src", m.code); py.globals.set("__pre", m.prelude);',
    '      const res = py.runPython("__tia_run(__src, __pre)");',
    '      self.postMessage({ id: m.id, ok: true, res: JSON.parse(res) }); return;',
    '    }',
    '  } catch (err) { self.postMessage({ id: m.id, ok: false, error: String((err && err.message) || err) }); }',
    '};',
  ].join('\n');

  let worker = null, ready = null, pandasReady = null, seq = 0;
  const pending = {};
  const listeners = [];
  function emit(s) { listeners.forEach(function (f) { try { f(s); } catch (e) { /* ignora */ } }); }
  function onStatus(f) { listeners.push(f); return function () { const i = listeners.indexOf(f); if (i >= 0) listeners.splice(i, 1); }; }

  function call(msg, timeout) {
    return new Promise(function (res, rej) {
      const id = ++seq; msg.id = id;
      let timer = null;
      if (timeout) timer = setTimeout(function () { delete pending[id]; reset(); rej({ timeout: true }); }, timeout);
      pending[id] = function (d) { clearTimeout(timer); delete pending[id]; if (d.ok) res(d); else rej({ error: d.error }); };
      worker.postMessage(msg);
    });
  }
  function reset() {
    if (worker) worker.terminate();
    worker = null; ready = null; pandasReady = null;
    Object.keys(pending).forEach(function (k) { delete pending[k]; });
  }
  function boot() {
    if (ready) return ready;
    emit({ phase: 'python', text: 'Carregando o Python… (só na primeira vez, cerca de 10 MB)' });
    const url = URL.createObjectURL(new Blob([WORKER], { type: 'text/javascript' }));
    worker = new Worker(url);
    worker.onmessage = function (e) { const f = pending[e.data.id]; if (f) f(e.data); };
    worker.onerror = function (e) { emit({ phase: 'error', text: 'Não foi possível carregar o Python. Confira a conexão com a internet.' }); };
    const runner = new URL('js/py-runner.py', global.location.href).href;
    ready = call({ type: 'init', base: base(), runner: runner }, 90000).then(function () { emit({ phase: 'ready', text: 'Python pronto.' }); }, function (e) {
      reset(); emit({ phase: 'error', text: 'Não foi possível carregar o Python. Confira a conexão com a internet e tente de novo.' });
      throw e;
    });
    return ready;
  }
  function withPandas() {
    return boot().then(function () {
      if (pandasReady) return pandasReady;
      emit({ phase: 'pandas', text: 'Carregando o pandas… (só na primeira vez, cerca de 35 MB)' });
      pandasReady = call({ type: 'pandas' }, 180000).then(function () { emit({ phase: 'ready', text: 'pandas pronto.' }); }, function (e) {
        pandasReady = null; emit({ phase: 'error', text: 'Não foi possível carregar o pandas. Confira a conexão e tente de novo.' }); throw e;
      });
      return pandasReady;
    });
  }
  /** Executa o código do aluno com os dados da NexusMarket já carregados. */
  function run(code, pandas, timeoutMs) {
    return (pandas ? withPandas() : boot()).then(function () {
      return call({ type: 'run', code: code, prelude: global.PyData.prelude(!!pandas) }, timeoutMs || 12000);
    }).then(function (d) { return d.res; }, function (e) {
      if (e && e.timeout) return { out: '', err: { type: 'Timeout', msg: 'O código demorou demais para terminar.', line: null } };
      return { out: '', err: { type: 'Carregamento', msg: (e && e.error) || 'Falha ao carregar o Python.', line: null } };
    });
  }
  function isReady(pandas) { return !!(ready && (!pandas || pandasReady)); }

  /* ----------------------- Mensagens de erro em português ----------------------- */
  const SYN = [
    [/invalid syntax\. Perhaps you forgot a comma\?/, 'sintaxe inválida: parece que faltou uma vírgula'],
    [/expected ':'/, 'faltou os dois-pontos ":" no fim da linha (if, for, while, def…)'],
    [/unterminated string literal/, 'texto (string) sem as aspas de fechamento'],
    [/unterminated triple-quoted string/, 'texto com três aspas sem fechamento'],
    [/'\(' was never closed/, 'um parêntese "(" foi aberto e não foi fechado'],
    [/'\[' was never closed/, 'um colchete "[" foi aberto e não foi fechado'],
    [/'\{' was never closed/, 'uma chave "{" foi aberta e não foi fechada'],
    [/unmatched '\)'/, 'há um ")" sobrando'], [/unmatched '\]'/, 'há um "]" sobrando'],
    [/expected an indented block/, 'faltou recuar (indentar) o bloco depois dos dois-pontos'],
    [/unexpected indent/, 'recuo (indentação) inesperado nesta linha'],
    [/unindent does not match any outer indentation level/, 'o recuo desta linha não combina com as linhas de cima'],
    [/cannot assign to/, 'não é possível atribuir valor aqui (confira = e ==)'],
    [/invalid syntax\. Maybe you meant '==' or ':=' instead of '='\?/, 'para comparar use == (dois iguais); = só atribui valor'],
    [/invalid syntax/, 'sintaxe inválida'],
    [/f-string/, 'erro dentro da f-string: confira as chaves { }'],
    [/invalid decimal literal/, 'número inválido (use ponto como separador decimal: 3.14)'],
  ];
  function explain(err) {
    if (!err) return null;
    const m = String(err.msg || '');
    let t, x;
    switch (err.type) {
      case 'SyntaxError': case 'IndentationError': case 'TabError':
        t = err.type === 'SyntaxError' ? 'Erro de sintaxe' : 'Erro de indentação';
        x = (SYN.find(function (p) { return p[0].test(m); }) || [null, m])[1];
        x = x.charAt(0).toUpperCase() + x.slice(1) + '.' + (err.text ? ' Trecho: ' + err.text.trim() : '');
        break;
      case 'NameError': {
        const n = (m.match(/name '([^']+)'/) || [])[1];
        t = 'Nome não encontrado'; x = 'O nome "' + (n || '?') + '" não existe. Confira a digitação (maiúsculas e minúsculas contam) ou se a variável foi criada antes de ser usada.';
        if (n === 'pd') x = 'O pandas não foi importado. Comece com: import pandas as pd';
        break;
      }
      case 'TypeError':
        t = 'Tipos incompatíveis';
        if (/can only concatenate str/.test(m) || /must be str, not/.test(m)) x = 'Não dá para juntar texto com número usando +. Converta com str(numero) ou use uma f-string: f"Total: {total}".';
        else if (/unsupported operand type/.test(m)) x = 'Operação entre tipos que não combinam (' + m.replace(/^unsupported operand type\(s\) for /, '') + '). Confira se algum valor é texto e converta com int() ou float().';
        else if (/not callable/.test(m)) x = 'Você chamou com () algo que não é função: ' + m + '. Talvez uma variável tenha o mesmo nome de uma função.';
        else if (/not subscriptable/.test(m)) x = 'Você usou [ ] em algo que não aceita índice: ' + m + '.';
        else if (/missing \d+ required positional argument/.test(m)) x = 'Faltou argumento na chamada da função: ' + m + '.';
        else if (/takes \d+ positional argument/.test(m)) x = 'Argumentos demais na chamada da função: ' + m + '.';
        else x = m;
        break;
      case 'KeyError': t = 'Chave não encontrada'; x = 'A chave ' + m + ' não existe no dicionário (ou a coluna não existe no DataFrame). Confira o nome exato, com acentos e maiúsculas.'; break;
      case 'IndexError': t = 'Índice fora do intervalo'; x = 'A posição pedida não existe na lista. Lembre que a contagem começa em 0 e o último item é [-1].'; break;
      case 'ZeroDivisionError': t = 'Divisão por zero'; x = 'Houve uma divisão por zero. Confira se o denominador pode ficar vazio ou zerado.'; break;
      case 'AttributeError': {
        const a = m.match(/'([^']+)' object has no attribute '([^']+)'/);
        t = 'Método ou atributo inexistente'; x = a ? 'Um objeto do tipo ' + a[1] + ' não tem o método/atributo "' + a[2] + '". Confira o nome (ex.: .append para listas, .upper() para textos).' : m;
        break;
      }
      case 'ValueError': t = 'Valor inválido'; x = /invalid literal for int/.test(m) ? 'Não foi possível converter o texto em número: ' + m.replace(/^.*: /, '') + '. Limpe o texto antes (strip, replace).' : m; break;
      case 'Timeout': t = 'Tempo esgotado'; x = 'O código demorou mais de 12 segundos. Confira se algum while nunca termina (a condição precisa mudar dentro do laço).'; break;
      case 'Carregamento': t = 'Python indisponível'; x = m + ' Confira a conexão e clique em Executar de novo.'; break;
      case 'RuntimeError': t = 'Erro na execução'; x = m; break;
      default: t = err.type; x = m;
    }
    return { title: t, explain: x, line: err.line || null, col: err.col || null };
  }

  global.PyEngine = { run: run, boot: boot, withPandas: withPandas, isReady: isReady, onStatus: onStatus, explain: explain, reset: reset, VERSION: VERSION };
})(window);
