/* =====================================================================
   py-lang.js — Python no editor da plataforma
   ---------------------------------------------------------------------
   • Cores: palavras-chave, funções e métodos, textos (inclusive
     f-strings), números, comentários, variáveis de dados da NexusMarket
     e parênteses por nível.
   • Sugestões: palavras-chave, funções nativas, nomes criados no código,
     variáveis de dados, métodos depois do ponto (texto, lista,
     dicionário e pandas) e campos dentro de ['…'].
   • Dica de argumentos em português. Tab recua; Enter mantém o recuo e
     recua mais depois de ":".
   ===================================================================== */
(function (global) {
  'use strict';
  const FE = global.FormulaEditor;
  const PAREN = ['#c4b5fd', '#7dd3fc', '#fcd34d', '#f9a8d4'];
  const KW = ['False', 'None', 'True', 'and', 'as', 'assert', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield'];
  const SIG = {
    print: ['*valores, sep=" ", end="\\n"', 'Mostra valores na saída.'], len: ['objeto', 'Quantidade de itens (ou de caracteres).'],
    range: ['início, fim, passo', 'Sequência de inteiros (o fim não entra).'], sum: ['iterável, start=0', 'Soma os itens.'],
    min: ['iterável, key=None', 'Menor valor.'], max: ['iterável, key=None', 'Maior valor.'], sorted: ['iterável, key=None, reverse=False', 'Nova lista ordenada.'],
    round: ['número, casas=0', 'Arredonda.'], abs: ['número', 'Valor absoluto.'], int: ['valor', 'Converte para inteiro.'], float: ['valor', 'Converte para decimal.'],
    str: ['valor', 'Converte para texto.'], bool: ['valor', 'Converte para verdadeiro/falso.'], list: ['iterável', 'Cria uma lista.'], dict: ['pares', 'Cria um dicionário.'],
    set: ['iterável', 'Conjunto sem repetidos.'], tuple: ['iterável', 'Cria uma tupla.'], enumerate: ['iterável, start=0', 'Pares (posição, item).'],
    zip: ['iterável1, iterável2, …', 'Junta listas item a item.'], map: ['função, iterável', 'Aplica a função a cada item.'], filter: ['função, iterável', 'Mantém os itens em que a função é verdadeira.'],
    any: ['iterável', 'Verdadeiro se algum item for verdadeiro.'], all: ['iterável', 'Verdadeiro se todos forem verdadeiros.'], isinstance: ['objeto, tipo', 'Confere o tipo.'], type: ['objeto', 'Tipo do objeto.'],
    // métodos de texto
    upper: ['', 'Texto em maiúsculas.'], lower: ['', 'Texto em minúsculas.'], title: ['', 'Primeira letra de cada palavra maiúscula.'], strip: ['caracteres=None', 'Remove espaços do início e do fim.'],
    split: ['separador=None, maxsplit=-1', 'Quebra o texto em lista.'], join: ['iterável', 'Junta textos usando o texto como separador.'], replace: ['antigo, novo, vezes=-1', 'Troca trechos do texto.'],
    startswith: ['prefixo', 'Começa com o trecho?'], endswith: ['sufixo', 'Termina com o trecho?'], find: ['trecho', 'Posição do trecho (-1 se não achar).'], count: ['valor', 'Quantas vezes aparece.'],
    format: ['*valores', 'Formata o texto.'], zfill: ['largura', 'Completa com zeros à esquerda.'], capitalize: ['', 'Primeira letra maiúscula.'], isdigit: ['', 'Só tem dígitos?'],
    // listas e dicionários
    append: ['item', 'Adiciona no fim da lista.'], extend: ['iterável', 'Adiciona vários itens.'], insert: ['posição, item', 'Insere numa posição.'], pop: ['posição=-1', 'Remove e devolve um item.'],
    remove: ['valor', 'Remove a primeira ocorrência.'], sort: ['key=None, reverse=False', 'Ordena a própria lista.'], index: ['valor', 'Posição do valor.'],
    get: ['chave, padrão=None', 'Valor da chave (ou o padrão se não existir).'], items: ['', 'Pares (chave, valor).'], keys: ['', 'Chaves.'], values: ['', 'Valores.'],
    setdefault: ['chave, padrão', 'Valor da chave, criando com o padrão se faltar.'], update: ['outro', 'Atualiza com outro dicionário.'],
    // módulos
    Counter: ['iterável', 'Conta ocorrências (collections).'], most_common: ['n', 'Os n mais frequentes.'], defaultdict: ['fábrica', 'Dicionário com valor padrão (collections).'],
    strptime: ['texto, formato', 'Converte texto em data ("%Y-%m-%d").'], strftime: ['formato', 'Formata a data como texto ("%d/%m/%Y").'],
    mean: ['dados', 'Média (statistics).'], median: ['dados', 'Mediana (statistics).'], stdev: ['dados', 'Desvio padrão amostral (statistics).'], mode: ['dados', 'Moda (statistics).'],
    DictReader: ['arquivo', 'Lê CSV como dicionários (csv).'], StringIO: ['texto', 'Trata um texto como arquivo (io).'],
    // pandas
    DataFrame: ['dados, columns=None', 'Cria uma tabela do pandas.'], read_csv: ['arquivo, sep=","', 'Lê um CSV.'], to_datetime: ['coluna, format=None', 'Converte para data.'],
    merge: ['outro, on=None, how="inner"', 'Junta duas tabelas por uma chave.'], concat: ['[df1, df2]', 'Empilha tabelas.'], pivot_table: ['values, index, columns, aggfunc="mean"', 'Tabela dinâmica.'],
    head: ['n=5', 'Primeiras linhas.'], tail: ['n=5', 'Últimas linhas.'], groupby: ['coluna', 'Agrupa as linhas.'], agg: ['funções', 'Várias agregações.'],
    sort_values: ['by, ascending=True', 'Ordena por coluna.'], nlargest: ['n, coluna', 'As n maiores linhas.'], nsmallest: ['n, coluna', 'As n menores linhas.'],
    value_counts: ['normalize=False', 'Contagem de cada valor.'], reset_index: ['drop=False', 'Transforma o índice em coluna.'], rename: ['columns={…}', 'Renomeia colunas.'],
    fillna: ['valor', 'Preenche valores ausentes.'], dropna: ['subset=None', 'Remove linhas com ausentes.'], isna: ['', 'Verdadeiro onde falta valor.'], notna: ['', 'Verdadeiro onde há valor.'],
    apply: ['função', 'Aplica a função.'], query: ['"expressão"', 'Filtra com uma expressão em texto.'], describe: ['', 'Resumo estatístico.'], unique: ['', 'Valores distintos.'],
    nunique: ['', 'Quantidade de valores distintos.'], cumsum: ['', 'Soma acumulada.'], pct_change: ['', 'Variação percentual.'], shift: ['periods=1', 'Desloca valores.'], rank: ['ascending=True', 'Posição no ranking.'],
    astype: ['tipo', 'Converte o tipo.'], assign: ['nova=…', 'Cria colunas.'], drop: ['columns=…', 'Remove colunas ou linhas.'], isin: ['valores', 'Verdadeiro se está na lista.'],
    mean_: ['', ''], idxmax: ['', 'Índice do maior valor.'], idxmin: ['', 'Índice do menor valor.'], between: ['esq, dir', 'Entre dois valores (inclusive).'], round_: ['', ''],
  };
  const STR_M = ['upper', 'lower', 'title', 'strip', 'split', 'replace', 'join', 'startswith', 'endswith', 'find', 'count', 'format', 'zfill', 'capitalize', 'isdigit'];
  const LIST_M = ['append', 'extend', 'insert', 'pop', 'remove', 'sort', 'index', 'count'];
  const DICT_M = ['get', 'items', 'keys', 'values', 'setdefault', 'update', 'pop'];
  const PD_DF = ['head', 'tail', 'groupby', 'agg', 'sum', 'mean', 'count', 'max', 'min', 'sort_values', 'nlargest', 'nsmallest', 'value_counts', 'reset_index', 'rename', 'fillna', 'dropna', 'isna', 'notna', 'apply', 'query', 'describe', 'unique', 'nunique', 'cumsum', 'pct_change', 'shift', 'rank', 'astype', 'assign', 'drop', 'merge', 'pivot_table', 'isin', 'round', 'idxmax', 'idxmin', 'between', 'loc', 'iloc', 'shape', 'columns', 'dtypes', 'str', 'dt', 'size', 'median', 'std'];
  const PD_MOD = ['DataFrame', 'Series', 'read_csv', 'to_datetime', 'merge', 'concat', 'pivot_table', 'isna'];
  const BUILTINS = ['print', 'len', 'range', 'sum', 'min', 'max', 'sorted', 'round', 'abs', 'int', 'float', 'str', 'bool', 'list', 'dict', 'set', 'tuple', 'enumerate', 'zip', 'map', 'filter', 'any', 'all', 'isinstance', 'type'];
  const POPULAR = ['print', 'for', 'if', 'len', 'sum', 'range', 'def', 'return', 'round', 'sorted'];
  const MODULES = { collections: ['Counter', 'defaultdict'], statistics: ['mean', 'median', 'stdev', 'mode'], datetime: ['datetime', 'date', 'timedelta'], csv: ['DictReader', 'reader'], io: ['StringIO'], json: ['dumps', 'loads'] };

  function dataVars() { return Object.keys(global.PyData ? global.PyData.VARS : {}); }
  function fieldNames() {
    const D = global.PyData; if (!D) return [];
    const s = {}; [D.vendas[0], D.produtos[0], D.clientes[0]].forEach(function (r) { Object.keys(r).forEach(function (k) { s[k] = 1; }); });
    ['valor', 'faturamento', 'total', 'mes'].forEach(function (k) { s[k] = 1; });
    return Object.keys(s);
  }
  function definedNames(code) {
    const s = {};
    (code.match(/^[ \t]*([A-Za-z_]\w*)\s*(?:,\s*[A-Za-z_]\w*\s*)*=(?!=)/gm) || []).forEach(function (m) { m.replace(/=$/, '').split(',').forEach(function (n) { n = n.trim(); if (n) s[n] = 'var'; }); });
    (code.match(/\bfor\s+([A-Za-z_]\w*(?:\s*,\s*[A-Za-z_]\w*)*)\s+in\b/g) || []).forEach(function (m) { m.replace(/^for\s+|\s+in$/g, '').split(',').forEach(function (n) { s[n.trim()] = 'var'; }); });
    (code.match(/\bdef\s+([A-Za-z_]\w*)/g) || []).forEach(function (m) { s[m.slice(4).trim()] = 'def'; });
    (code.match(/\bimport\s+[\w.]+\s+as\s+(\w+)/g) || []).forEach(function (m) { s[m.split(/\s+as\s+/)[1]] = 'mod'; });
    (code.match(/\bfrom\s+\w+\s+import\s+([\w, ]+)/g) || []).forEach(function (m) { m.split(/import\s+/)[1].split(',').forEach(function (n) { s[n.trim()] = 'def'; }); });
    return s;
  }

  /* ------------------------------ Realce ------------------------------ */
  function tokens(text) {
    const out = []; let i = 0, depth = 0;
    const dv = {}; dataVars().forEach(function (v) { dv[v] = 1; });
    const defs = definedNames(text);
    const push = function (type, s, extra) { out.push(Object.assign({ type: type, text: s }, extra || {})); };
    let prevDot = false, prevDef = false;
    while (i < text.length) {
      const r = text.slice(i); let m;
      if ((m = r.match(/^#[^\n]*/))) { push('comment', m[0]); i += m[0].length; continue; }
      if ((m = r.match(/^[rRbBfF]{0,2}("""[\s\S]*?(?:"""|$)|'''[\s\S]*?(?:'''|$)|"(?:[^"\\\n]|\\.)*"?|'(?:[^'\\\n]|\\.)*'?)/))) {
        const pre = m[0].match(/^[rRbBfF]*/)[0];
        if (/f/i.test(pre)) {   // f-string: realça as expressões entre chaves
          const body = m[0]; let j = 0, buf = '';
          while (j < body.length) {
            if (body[j] === '{' && body[j + 1] !== '{') { if (buf) push('str', buf); buf = ''; let k = j, d = 0; do { if (body[k] === '{') d++; if (body[k] === '}') d--; k++; } while (k < body.length && d > 0); push('var', body.slice(j, k)); j = k; continue; }
            buf += body[j]; j++;
          }
          if (buf) push('str', buf);
        } else push('str', m[0]);
        i += m[0].length; prevDot = false; continue;
      }
      if ((m = r.match(/^@[A-Za-z_][\w.]*/))) { push('kw', m[0]); i += m[0].length; continue; }
      if ((m = r.match(/^[A-Za-z_À-ÿ][\wÀ-ÿ]*/))) {
        const w = m[0], call = /^\s*\(/.test(r.slice(w.length));
        let type = 'name';
        if (prevDef) type = 'measure';
        else if (KW.indexOf(w) >= 0) type = 'kw';
        else if (prevDot) type = call ? 'fn' : 'col';
        else if (call && (BUILTINS.indexOf(w) >= 0 || SIG[w] || defs[w] === 'def')) type = 'fn';
        else if (dv[w]) type = 'table';
        else if (w === 'self' || w === 'pd' || defs[w] === 'mod' || MODULES[w]) type = 'sheet';
        push(type, w); i += w.length; prevDef = (w === 'def' || w === 'class'); prevDot = false; continue;
      }
      if ((m = r.match(/^(?:0[xX][\da-fA-F_]+|\d[\d_]*(?:\.\d*)?(?:[eE][+-]?\d+)?|\.\d+)/))) { push('num', m[0]); i += m[0].length; prevDot = false; continue; }
      const ch = text[i];
      if ('([{'.indexOf(ch) >= 0) { push('paren', ch, { color: PAREN[depth % PAREN.length] }); depth++; i++; prevDot = false; continue; }
      if (')]}'.indexOf(ch) >= 0) { depth = Math.max(0, depth - 1); push('paren', ch, { color: PAREN[depth % PAREN.length] }); i++; prevDot = false; continue; }
      if (ch === '.') { push('sep', ch); i++; prevDot = true; continue; }
      if ((m = r.match(/^(?:\*\*=?|\/\/=?|==|!=|<=|>=|->|[+\-*\/%<>=!&|^~]=?)/))) { push('op', m[0]); i += m[0].length; prevDot = false; continue; }
      if (ch === ',' || ch === ':') { push('sep', ch); i++; prevDot = false; continue; }
      push('plain', ch); i++; if (ch !== ' ') prevDot = false;
    }
    return out;
  }

  /* ----------------------------- Sugestões ----------------------------- */
  function inString(before) {
    const line = before.split('\n').pop();
    let q = null;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (q) { if (c === '\\') { i++; continue; } if (c === q) q = null; }
      else if (c === '#') return false;
      else if (c === '"' || c === "'") q = c;
    }
    return !!q;
  }
  function inComment(before) {
    const line = before.split('\n').pop(); let q = null;
    for (let i = 0; i < line.length; i++) { const c = line[i]; if (q) { if (c === '\\') { i++; continue; } if (c === q) q = null; } else if (c === '"' || c === "'") q = c; else if (c === '#') return true; }
    return false;
  }
  function item(label, kind, detail, rank, insert) { return { label: label, insert: insert || label, kind: kind, detail: detail || '', rank: rank || 0 }; }
  function suggest(before, ctx) {
    let m;
    // campos dentro de ['…'] (chaves dos dicionários e colunas)
    if ((m = before.match(/\[\s*(['"])([\wÀ-ÿ]*)$/))) {
      const pre = m[2].toLowerCase(), q = m[1];
      return { from: before.length - m[2].length, items: fieldNames().filter(function (f) { return f.toLowerCase().indexOf(pre) === 0 && f.toLowerCase() !== pre; }).map(function (f, i) { return item(f, 'col', 'Campo dos dados da NexusMarket', i, f + q + ']'); }), limit: 12 };
    }
    // métodos depois do ponto
    if ((m = before.match(/([A-Za-z_][\w]*|\)|\])\s*\.\s*([A-Za-z_]\w*)?$/))) {
      const obj = m[1], pre = (m[2] || '').toLowerCase();
      let names;
      if (obj === 'pd') names = PD_MOD.map(function (n) { return [n, 'pandas']; });
      else if (MODULES[obj]) names = MODULES[obj].map(function (n) { return [n, obj]; });
      else if (/_df$|^df\b|^df_|grupo|serie/.test(obj) || (ctx.pandas && obj !== 'str')) names = PD_DF.map(function (n) { return [n, 'pandas']; }).concat(STR_M.map(function (n) { return [n, 'texto']; }));
      else if (obj === 'str') names = STR_M.concat(['contains', 'len', 'slice']).map(function (n) { return [n, '.str do pandas']; });
      else names = STR_M.map(function (n) { return [n, 'texto']; }).concat(LIST_M.map(function (n) { return [n, 'lista']; }), DICT_M.map(function (n) { return [n, 'dicionário']; }));
      const seen = {};
      return { from: before.length - (m[2] || '').length, limit: 10, items: names.filter(function (n) { if (seen[n[0]]) return false; seen[n[0]] = 1; return n[0].toLowerCase().indexOf(pre) === 0 && n[0].toLowerCase() !== pre; })
        .map(function (n, i) { const sig = SIG[n[0]]; const noCall = ['loc', 'iloc', 'shape', 'columns', 'dtypes', 'str', 'dt', 'size'].indexOf(n[0]) >= 0; return item(n[0], 'fn', (sig ? sig[1] + ' · ' : '') + n[1], i, n[0] + (noCall ? '' : '(')); }) };
    }
    // palavras
    if ((m = before.match(/[A-Za-z_À-ÿ][\wÀ-ÿ]*$/))) {
      const w = m[0], pre = w.toLowerCase();
      if (/^\d/.test(w)) return null;
      const defs = definedNames(before.slice(0, before.length - w.length));
      const its = KW.map(function (k) { return item(k, 'kw', 'Palavra-chave', POPULAR.indexOf(k) >= 0 ? -50 : 20, k + (['True', 'False', 'None', 'pass', 'break', 'continue', 'else', 'try', 'finally'].indexOf(k) >= 0 ? (k === 'else' || k === 'try' || k === 'finally' ? ':' : '') : ' ')); })
        .concat(BUILTINS.map(function (f) { const p = POPULAR.indexOf(f); return item(f, 'fn', SIG[f] ? SIG[f][1] : 'Função nativa', p >= 0 ? p - 100 : 0, f + '('); }))
        .concat(dataVars().map(function (v) { return item(v, 'table', global.PyData.VARS[v].desc, -60); }))
        .concat(Object.keys(defs).filter(function (n) { return n !== w; }).map(function (n) { return item(n, defs[n] === 'def' ? 'fn' : 'measure', defs[n] === 'def' ? 'Função/nome importado' : 'Variável do seu código', -120, n + (defs[n] === 'def' && SIG[n] ? '(' : '')); }))
        .concat(Object.keys(MODULES).map(function (mo) { return item(mo, 'sheet', 'Módulo: ' + MODULES[mo].join(', '), 30); }))
        .concat([item('pandas', 'sheet', 'import pandas as pd', 25)]);
      const seen = {};
      return { from: before.length - w.length, items: its.filter(function (x) { if (seen[x.label]) return false; seen[x.label] = 1; return x.label.toLowerCase().indexOf(pre) === 0 && x.label.toLowerCase() !== pre; }) };
    }
    return null;
  }
  function signature(name) {
    const n = String(name).split('.').pop();
    const s = SIG[n]; if (!s || !s[1]) return null;
    return { name: n, args: s[0] ? s[0].split(/,\s*/) : [], desc: s[1], sep: ',' };
  }
  FE.register('python', { tokens: tokens, suggest: suggest, signature: signature, sepChars: ',', enterAccepts: false, indentAfter: /:\s*(#.*)?$|[(\[{]\s*$/, inString: inString, inComment: inComment });

  function highlight(src) { return FE.render(tokens(String(src))); }
  global.PyLang = { tokens: tokens, suggest: suggest, signature: signature, highlight: highlight, SIG: SIG };
})(window);
