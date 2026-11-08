/* =====================================================================
   dax-lang.js — Linguagem DAX no editor: cores, sugestões e dicas
   ---------------------------------------------------------------------
   • Realce: funções, tabelas, colunas, medidas, variáveis, textos,
     números, comentários e parênteses por nível.
   • Sugestões: funções, tabelas (ao escolher, abre as colunas),
     colunas depois de "Tabela[", medidas depois de "[".
   • Assinaturas em português para a dica de argumentos.
   ===================================================================== */
(function (global) {
  'use strict';
  const FE = global.FormulaEditor;
  const strip = FE.strip;
  const PAREN = ['#e8eaf6', '#a78bfa', '#38bdf8', '#fbbf24', '#34d399'];

  const SIG = {
    SUM: ['Coluna', 'Soma os valores de uma coluna no contexto de filtro.'],
    AVERAGE: ['Coluna', 'Média dos valores de uma coluna.'],
    MIN: ['Coluna | Valor1, Valor2', 'Menor valor de uma coluna (ou de dois valores).'],
    MAX: ['Coluna | Valor1, Valor2', 'Maior valor de uma coluna (ou de dois valores).'],
    COUNT: ['Coluna', 'Conta valores numéricos ou datas.'],
    COUNTA: ['Coluna', 'Conta valores não vazios.'],
    COUNTBLANK: ['Coluna', 'Conta valores vazios.'],
    COUNTROWS: ['Tabela', 'Conta as linhas de uma tabela.'],
    DISTINCTCOUNT: ['Coluna', 'Conta valores distintos.'],
    MEDIAN: ['Coluna', 'Mediana de uma coluna.'],
    SUMX: ['Tabela, Expressão', 'Calcula a expressão linha a linha e soma.'],
    AVERAGEX: ['Tabela, Expressão', 'Média da expressão calculada linha a linha.'],
    MINX: ['Tabela, Expressão', 'Menor resultado da expressão linha a linha.'],
    MAXX: ['Tabela, Expressão', 'Maior resultado da expressão linha a linha.'],
    COUNTX: ['Tabela, Expressão', 'Conta resultados não vazios da expressão.'],
    COUNTAX: ['Tabela, Expressão', 'Conta resultados não vazios (inclui texto).'],
    MEDIANX: ['Tabela, Expressão', 'Mediana da expressão linha a linha.'],
    PRODUCTX: ['Tabela, Expressão', 'Multiplica os resultados da expressão.'],
    CONCATENATEX: ['Tabela, Expressão, [Delimitador], [OrdenarPor], [ASC|DESC]', 'Junta os textos de uma tabela.'],
    RANKX: ['Tabela, Expressão, [Valor], [DESC|ASC], [SKIP|DENSE]', 'Posição no ranking (1 = maior).'],
    CALCULATE: ['Expressão, [Filtro1], …', 'Calcula a expressão num contexto de filtro modificado.'],
    CALCULATETABLE: ['Tabela, [Filtro1], …', 'Devolve uma tabela num contexto de filtro modificado.'],
    FILTER: ['Tabela, Condição', 'Linhas da tabela que atendem à condição.'],
    ALL: ['[Tabela | Coluna1], …', 'Remove filtros (no CALCULATE) ou devolve todas as linhas.'],
    ALLEXCEPT: ['Tabela, Coluna1, …', 'Remove os filtros da tabela, menos das colunas listadas.'],
    ALLSELECTED: ['[Tabela | Coluna]', 'Remove os filtros do visual e mantém os da página.'],
    REMOVEFILTERS: ['[Tabela | Coluna], …', 'Remove filtros dentro do CALCULATE.'],
    KEEPFILTERS: ['Filtro', 'Combina o filtro com o existente em vez de substituí-lo.'],
    VALUES: ['Tabela | Coluna', 'Valores distintos visíveis no contexto.'],
    DISTINCT: ['Coluna | Tabela', 'Valores distintos.'],
    SELECTEDVALUE: ['Coluna, [Alternativo]', 'O valor da coluna quando há só um no contexto.'],
    HASONEVALUE: ['Coluna', 'Verdadeiro se houver um único valor no contexto.'],
    ISFILTERED: ['Tabela | Coluna', 'Verdadeiro se a coluna estiver filtrada diretamente.'],
    ISCROSSFILTERED: ['Tabela | Coluna', 'Verdadeiro se houver filtro direto ou vindo de outra tabela.'],
    ISINSCOPE: ['Coluna', 'Verdadeiro se a coluna estiver no nível atual do visual.'],
    RELATED: ['Coluna', 'Busca um valor na tabela do lado 1 (dimensão).'],
    RELATEDTABLE: ['Tabela', 'Linhas relacionadas na tabela do lado N (fato).'],
    LOOKUPVALUE: ['ColunaResultado, ColunaBusca, Valor, …', 'Busca um valor numa tabela, sem relacionamento.'],
    USERELATIONSHIP: ['Coluna1, Coluna2', 'Ativa um relacionamento inativo dentro do CALCULATE.'],
    EARLIER: ['Coluna, [Número]', 'Valor da coluna no contexto de linha externo.'],
    DIVIDE: ['Numerador, Denominador, [Alternativo]', 'Divisão segura: devolve BLANK quando o denominador é zero.'],
    IF: ['Condição, ValorSeVerdadeiro, [ValorSeFalso]', 'Um valor se a condição for verdadeira, outro se for falsa.'],
    SWITCH: ['Expressão, Valor1, Resultado1, …, [Senão]', 'Compara a expressão com uma lista de valores.'],
    AND: ['Condição1, Condição2', 'Verdadeiro se as duas forem verdadeiras.'],
    OR: ['Condição1, Condição2', 'Verdadeiro se alguma for verdadeira.'],
    NOT: ['Condição', 'Inverte verdadeiro e falso.'],
    TRUE: ['', 'Valor lógico verdadeiro.'], FALSE: ['', 'Valor lógico falso.'], BLANK: ['', 'Valor vazio (BLANK).'],
    ISBLANK: ['Valor', 'Verdadeiro se o valor for BLANK.'],
    COALESCE: ['Valor1, Valor2, …', 'Primeiro valor que não é BLANK.'],
    IFERROR: ['Valor, ValorSeErro', 'Valor alternativo em caso de erro.'],
    ROUND: ['Número, Casas', 'Arredonda.'], ROUNDUP: ['Número, Casas', 'Arredonda para cima.'], ROUNDDOWN: ['Número, Casas', 'Arredonda para baixo.'],
    INT: ['Número', 'Parte inteira.'], TRUNC: ['Número', 'Corta as casas decimais.'], ABS: ['Número', 'Valor absoluto.'],
    MOD: ['Número, Divisor', 'Resto da divisão.'], POWER: ['Número, Potência', 'Potência.'], SQRT: ['Número', 'Raiz quadrada.'],
    FORMAT: ['Valor, "Formato"', 'Formata número ou data como texto ("0.0%", "R$ #,##0", "mmm/yyyy").'],
    CONCATENATE: ['Texto1, Texto2', 'Junta dois textos (o & faz o mesmo).'],
    LEFT: ['Texto, [Quantidade]', 'Caracteres do início.'], RIGHT: ['Texto, [Quantidade]', 'Caracteres do fim.'],
    MID: ['Texto, Início, Quantidade', 'Caracteres do meio.'], LEN: ['Texto', 'Quantidade de caracteres.'],
    UPPER: ['Texto', 'Maiúsculas.'], LOWER: ['Texto', 'Minúsculas.'], TRIM: ['Texto', 'Remove espaços extras.'],
    SUBSTITUTE: ['Texto, Antigo, Novo', 'Troca um trecho do texto.'],
    SEARCH: ['Procurar, NoTexto, [Início], [SeNãoAchar]', 'Posição de um texto (sem diferenciar maiúsculas).'],
    FIND: ['Procurar, NoTexto, [Início], [SeNãoAchar]', 'Posição de um texto (diferencia maiúsculas).'],
    CONTAINSSTRING: ['Texto, Procurar', 'Verdadeiro se o texto contém o trecho.'],
    VALUE: ['Texto', 'Converte texto em número.'], REPT: ['Texto, Vezes', 'Repete um texto.'], UNICHAR: ['Código', 'Caractere Unicode.'],
    DATE: ['Ano, Mês, Dia', 'Monta uma data.'], YEAR: ['Data', 'Ano.'], MONTH: ['Data', 'Mês (1 a 12).'], DAY: ['Data', 'Dia do mês.'],
    QUARTER: ['Data', 'Trimestre (1 a 4).'], WEEKDAY: ['Data, [Tipo]', 'Dia da semana.'], WEEKNUM: ['Data', 'Semana do ano.'],
    TODAY: ['', 'Data de hoje (aqui: 30/06/2026).'], NOW: ['', 'Data e hora atuais (aqui: 30/06/2026).'],
    EOMONTH: ['Data, Meses', 'Último dia do mês.'], EDATE: ['Data, Meses', 'Soma meses a uma data.'],
    DATEDIFF: ['DataInicial, DataFinal, DAY|MONTH|YEAR', 'Diferença entre datas.'],
    TOTALYTD: ['Expressão, Datas, [Filtro]', 'Acumulado do ano até a data do contexto.'],
    TOTALQTD: ['Expressão, Datas', 'Acumulado do trimestre.'], TOTALMTD: ['Expressão, Datas', 'Acumulado do mês.'],
    DATESYTD: ['Datas', 'Datas do início do ano até a data do contexto.'], DATESQTD: ['Datas', 'Datas do trimestre até agora.'], DATESMTD: ['Datas', 'Datas do mês até agora.'],
    SAMEPERIODLASTYEAR: ['Datas', 'As mesmas datas, um ano antes.'],
    DATEADD: ['Datas, Número, DAY|MONTH|QUARTER|YEAR', 'Desloca as datas do contexto.'],
    PARALLELPERIOD: ['Datas, Número, MONTH|QUARTER|YEAR', 'Período completo deslocado.'],
    PREVIOUSMONTH: ['Datas', 'Mês anterior completo.'], NEXTMONTH: ['Datas', 'Mês seguinte completo.'],
    PREVIOUSYEAR: ['Datas', 'Ano anterior completo.'], PREVIOUSQUARTER: ['Datas', 'Trimestre anterior completo.'],
    DATESINPERIOD: ['Datas, DataInicial, Número, DAY|MONTH|YEAR', 'Datas de um período móvel (ex.: últimos 3 meses).'],
    DATESBETWEEN: ['Datas, Início, Fim', 'Datas entre duas datas.'],
    FIRSTDATE: ['Datas', 'Primeira data do contexto.'], LASTDATE: ['Datas', 'Última data do contexto.'],
    STARTOFMONTH: ['Datas', '1º dia do mês.'], ENDOFMONTH: ['Datas', 'Último dia do mês.'], STARTOFYEAR: ['Datas', '1º dia do ano.'], ENDOFYEAR: ['Datas', 'Último dia do ano.'],
    TOPN: ['N, Tabela, Expressão, [DESC|ASC]', 'As N primeiras linhas pela expressão.'],
    SUMMARIZE: ['Tabela, Coluna1, …, ["Nome", Expressão]', 'Agrupa uma tabela por colunas.'],
    ADDCOLUMNS: ['Tabela, "Nome", Expressão, …', 'Acrescenta colunas calculadas a uma tabela.'],
    SELECTCOLUMNS: ['Tabela, "Nome", Expressão, …', 'Escolhe ou cria colunas.'],
    GENERATESERIES: ['Início, Fim, [Passo]', 'Lista de números.'],
  };
  const KEYWORDS = ['VAR', 'RETURN', 'TRUE', 'FALSE', 'IN', 'NOT', 'ASC', 'DESC', 'DAY', 'MONTH', 'QUARTER', 'YEAR', 'DENSE', 'SKIP', 'WEEK'];
  const POPULAR = ['CALCULATE', 'SUM', 'DIVIDE', 'COUNTROWS', 'DISTINCTCOUNT', 'FILTER', 'ALL', 'SUMX', 'IF', 'SWITCH', 'RELATED', 'VALUES', 'TOTALYTD', 'SAMEPERIODLASTYEAR', 'DATEADD', 'RANKX', 'AVERAGE', 'MAX', 'MIN', 'SELECTEDVALUE', 'FORMAT'];

  function model() { return global.DaxData; }
  function tables() { return Object.keys(model().TABLES); }
  function tableName(raw) { const k = String(raw).toLowerCase(); return tables().find(function (t) { return t.toLowerCase() === k; }); }
  function measures(extra) { return model().MEASURES.map(function (m) { return m.name; }).concat(extra || []); }

  /** Tokens para o realce. */
  function tokens(text) {
    const out = []; let i = 0, depth = 0;
    const vars = {}; (text.match(/\bVAR\s+([A-Za-zÀ-ÿ_][\wÀ-ÿ]*)/gi) || []).forEach(function (v) { vars[v.replace(/^VAR\s+/i, '').toLowerCase()] = 1; });
    const ms = {}; measures().forEach(function (m) { ms[m.toLowerCase()] = 1; });
    const push = function (type, s, extra) { out.push(Object.assign({ type: type, text: s }, extra || {})); };
    while (i < text.length) {
      const r = text.slice(i); let m;
      if ((m = r.match(/^(?:\/\/|--)[^\n]*/))) { push('comment', m[0]); i += m[0].length; continue; }
      if ((m = r.match(/^\/\*[\s\S]*?(?:\*\/|$)/))) { push('comment', m[0]); i += m[0].length; continue; }
      if ((m = r.match(/^"(?:[^"]|"")*"?/))) { push('str', m[0]); i += m[0].length; continue; }
      if ((m = r.match(/^('[^']*'?|[A-Za-zÀ-ÿ_][\wÀ-ÿ]*)(\[[^\]\n]*\]?)/))) { push('table', m[1]); push('col', m[2]); i += m[0].length; continue; }
      if ((m = r.match(/^'[^'\n]*'?/))) { push('table', m[0]); i += m[0].length; continue; }
      if ((m = r.match(/^\[[^\]\n]*\]?/))) { const nm = m[0].replace(/^\[|\]$/g, '').toLowerCase(); push(ms[nm] ? 'measure' : 'col', m[0]); i += m[0].length; continue; }
      if ((m = r.match(/^[A-Za-zÀ-ÿ_][\wÀ-ÿ.]*(?=\s*\()/))) { push(SIG[m[0].toUpperCase()] ? 'fn' : 'fnx', m[0]); i += m[0].length; continue; }
      if ((m = r.match(/^[A-Za-zÀ-ÿ_][\wÀ-ÿ.]*/))) {
        const w = m[0], up = w.toUpperCase();
        push(KEYWORDS.indexOf(up) >= 0 ? 'kw' : vars[w.toLowerCase()] ? 'var' : tableName(w) ? 'table' : 'name', w); i += w.length; continue;
      }
      if ((m = r.match(/^\d+(?:[.,]\d+)?/))) { push('num', m[0]); i += m[0].length; continue; }
      const ch = text[i];
      if (ch === '(') { push('paren', ch, { color: PAREN[depth % PAREN.length] }); depth++; i++; continue; }
      if (ch === ')') { depth = Math.max(0, depth - 1); push('paren', ch, { color: PAREN[depth % PAREN.length] }); i++; continue; }
      if ((m = r.match(/^(?:&&|\|\||<>|<=|>=|==|:=)/))) { push('op', m[0]); i += 2; continue; }
      if ('+-*/^&=<>'.indexOf(ch) >= 0) { push('op', ch); i++; continue; }
      if (ch === ',' || ch === ';') { push('sep', ch); i++; continue; }
      push('plain', ch); i++;
    }
    return out;
  }

  function quoteTable(t) { return /[^\wÀ-ÿ]/.test(t) ? "'" + t + "'" : t; }
  function suggest(before, ctx) {
    let m;
    // colunas depois de "Tabela["
    if ((m = before.match(/(?:'([^']+)'|([A-Za-zÀ-ÿ_][\wÀ-ÿ]*))\[([^\]\n]*)$/))) {
      const t = tableName(m[1] || m[2]); if (!t) return null;
      const pre = strip(m[3]);
      const types = model().TABLES[t].types || {};
      return { from: before.length - m[3].length, items: model().TABLES[t].cols.filter(function (c) { return strip(c).indexOf(pre) >= 0; })
        .map(function (c, i) { return { label: c, insert: c + ']', kind: 'col', detail: t + (types[c] ? ' · ' + ({ date: 'data', money: 'moeda', pct: 'percentual' }[types[c]] || '') : ''), rank: (strip(c).indexOf(pre) === 0 ? 0 : 100) + i }; }), limit: 14 };
    }
    // medidas depois de "["
    if ((m = before.match(/(^|[^\wÀ-ÿ'\]])\[([^\]\n]*)$/))) {
      const pre = strip(m[2]);
      const list = model().MEASURES.map(function (x) { return { label: x.name, insert: x.name + ']', kind: 'measure', detail: x.expr }; })
        .concat((ctx.measures || []).map(function (n) { return { label: n, insert: n + ']', kind: 'measure', detail: 'Coluna da tabela virtual' }; }));
      return { from: before.length - m[2].length, items: list.filter(function (x) { return strip(x.label).indexOf(pre) >= 0; }) };
    }
    // palavra: funções, tabelas, palavras-chave e variáveis
    if ((m = before.match(/[A-Za-zÀ-ÿ_][\wÀ-ÿ.]*$/))) {
      const w = m[0], pre = strip(w);
      if (/^\d/.test(w)) return null;
      const vars = []; (before.match(/\bVAR\s+([A-Za-zÀ-ÿ_][\wÀ-ÿ]*)/gi) || []).forEach(function (v) { const n = v.replace(/^VAR\s+/i, ''); if (n !== w && vars.indexOf(n) < 0) vars.push(n); });
      const items = Object.keys(SIG).map(function (f) { const p = POPULAR.indexOf(f); return { label: f, insert: f + '(', kind: 'fn', detail: SIG[f][1], rank: p >= 0 ? p - 100 : 0 }; })
        .concat(tables().map(function (t) { return { label: t, insert: quoteTable(t) + '[', kind: 'table', detail: 'Tabela · ' + model().TABLES[t].kind, chain: true, rank: -150 }; }))
        .concat(['VAR', 'RETURN', 'ASC', 'DESC', 'DAY', 'MONTH', 'YEAR', 'DENSE'].map(function (k) { return { label: k, insert: k + ' ', kind: 'kw', detail: 'Palavra-chave' }; }))
        .concat(vars.map(function (v) { return { label: v, insert: v, kind: 'kw', detail: 'Variável', rank: -200 }; }));
      return { from: before.length - w.length, items: items.filter(function (it) { return strip(it.label).indexOf(pre) === 0; }) };
    }
    return null;
  }
  function signature(name) {
    const s = SIG[String(name).toUpperCase()];
    return s ? { name: String(name).toUpperCase(), args: s[0] ? s[0].split(/,\s*/) : [], desc: s[1], sep: ',' } : null;
  }
  FE.register('dax', { tokens: tokens, suggest: suggest, signature: signature, sepChars: ',;' });

  /** HTML colorido de um trecho DAX (para aulas e gabaritos). */
  function highlight(src) { return FE.render(tokens(String(src))); }
  /** Quebra uma medida longa em linhas, como no editor do Power BI. */
  function pretty(src) {
    return String(src).replace(/\s+(VAR|RETURN)\s+/g, '\n$1 ').replace(/^(.+?=)\s*\n?(VAR)/, '$1\n$2').replace(/^\n/, '');
  }

  global.DaxLang = { SIG: SIG, tokens: tokens, suggest: suggest, signature: signature, highlight: highlight, pretty: pretty };
})(window);
