/* =====================================================================
   formula-editor.js — Editor de fórmulas com cores e autocompletar
   ---------------------------------------------------------------------
   Usado no Excel (fórmulas pt-BR) e no Power BI (DAX).
   • Realce de sintaxe em tempo real (funções, referências, textos,
     números, operadores, parênteses por nível). No Excel, cada
     referência ganha uma cor, como no próprio Excel.
   • Sugestões enquanto digita: funções, planilhas (Excel); funções,
     tabelas, colunas após "Tabela[" e medidas após "[" (DAX).
     ↑ ↓ escolhem, Enter ou Tab aceitam, Esc fecha.
   • Dica de argumentos da função em que o cursor está, com o
     argumento atual em destaque.
   Implementação: <textarea> transparente sobre um <pre> colorido.
   ===================================================================== */
(function (global) {
  'use strict';
  const esc = function (s) { return global.UI.esc(s); };
  const strip = function (s) { return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase(); };

  /* -------------------------- Assinaturas do Excel -------------------------- */
  const EXCEL_SIG = {
    'ABS': ['núm', 'Valor absoluto (sem sinal).'],
    'ANO': ['data', 'Ano de uma data.'],
    'ARRED': ['núm; núm_dígitos', 'Arredonda para o número de casas indicado.'],
    'ARREDONDAR.PARA.BAIXO': ['núm; núm_dígitos', 'Arredonda sempre para baixo.'],
    'ARREDONDAR.PARA.CIMA': ['núm; núm_dígitos', 'Arredonda sempre para cima.'],
    'ARRUMAR': ['texto', 'Remove espaços extras.'],
    'CLASSIFICAR': ['matriz; [índice_classificação]; [ordem]; [por_coluna]', 'Ordena uma matriz (1 crescente, -1 decrescente).'],
    'CLASSIFICARPOR': ['matriz; por_matriz1; [ordem1]; …', 'Ordena uma matriz usando outra como critério.'],
    'COL': ['[ref]', 'Número da coluna.'], 'COLS': ['matriz', 'Quantidade de colunas.'],
    'CONCAT': ['texto1; [texto2]; …', 'Junta textos e intervalos.'],
    'CONCATENAR': ['texto1; [texto2]; …', 'Junta textos (versão antiga).'],
    'CONT.NÚM': ['valor1; [valor2]; …', 'Conta células com números.'],
    'CONT.SE': ['intervalo; critério', 'Conta células que atendem a um critério.'],
    'CONT.SES': ['intervalo_critérios1; critérios1; [intervalo2; critérios2]; …', 'Conta linhas que atendem a vários critérios.'],
    'CONT.VALORES': ['valor1; [valor2]; …', 'Conta células preenchidas.'],
    'CONTAR.VAZIO': ['intervalo', 'Conta células vazias.'],
    'CORREL': ['matriz1; matriz2', 'Correlação entre duas séries (−1 a 1).'],
    'CORRESP': ['valor_procurado; matriz_procurada; [tipo_correspondência]', 'Posição de um valor numa lista (0 = exata).'],
    'CORRESPX': ['valor_procurado; matriz_pesquisa; [modo_correspondência]; [modo_pesquisa]', 'Posição de um valor (versão moderna).'],
    'DATA': ['ano; mês; dia', 'Monta uma data.'],
    'DATADIF': ['data_inicial; data_final; unidade', 'Diferença entre datas ("Y", "M", "D", "YM"…).'],
    'DATAM': ['data_inicial; meses', 'Soma meses a uma data.'],
    'DESVPAD': ['núm1; [núm2]; …', 'Desvio padrão da amostra (DESVPAD.A).'],
    'DESVPADP': ['núm1; [núm2]; …', 'Desvio padrão da população (DESVPAD.P).'],
    'DIA': ['data', 'Dia do mês.'], 'DIAS': ['data_final; data_inicial', 'Dias entre duas datas.'],
    'DIA.DA.SEMANA': ['data; [tipo_retorno]', 'Dia da semana (tipo 2: segunda = 1).'],
    'DIATRABALHO': ['data_inicial; dias; [feriados]', 'Data após N dias úteis.'],
    'DIATRABALHOTOTAL': ['data_inicial; data_final; [feriados]', 'Dias úteis entre duas datas.'],
    'DIREITA': ['texto; [núm_caract]', 'Caracteres do fim do texto.'],
    'E': ['lógico1; [lógico2]; …', 'VERDADEIRO se todas as condições forem verdadeiras.'],
    'ESCOLHER': ['núm_índice; valor1; [valor2]; …', 'Escolhe um valor pela posição.'],
    'ESQUERDA': ['texto; [núm_caract]', 'Caracteres do início do texto.'],
    'EXATO': ['texto1; texto2', 'Compara textos diferenciando maiúsculas.'],
    'EXT.TEXTO': ['texto; núm_inicial; núm_caract', 'Caracteres do meio do texto.'],
    'FALSO': ['', 'Valor lógico FALSO.'],
    'FILTRO': ['matriz; incluir; [se_vazia]', 'Filtra linhas por uma condição (matriz dinâmica).'],
    'FIMMÊS': ['data_inicial; meses', 'Último dia do mês.'],
    'HOJE': ['', 'Data de hoje (nesta plataforma: 30/06/2026).'],
    'INT': ['núm', 'Parte inteira (arredonda para baixo).'],
    'LET': ['nome1; valor1; [nome2; valor2]; …; cálculo', 'Dá nomes a resultados intermediários.'],
    'LIN': ['[ref]', 'Número da linha.'], 'LINS': ['matriz', 'Quantidade de linhas.'],
    'LOCALIZAR': ['texto_procurado; no_texto; [núm_inicial]', 'Posição de um texto (sem diferenciar maiúsculas).'],
    'MAIOR': ['matriz; k', 'O k-ésimo maior valor.'],
    'MAIÚSCULA': ['texto', 'Converte em maiúsculas.'],
    'MED': ['núm1; [núm2]; …', 'Mediana (valor do meio).'],
    'MENOR': ['matriz; k', 'O k-ésimo menor valor.'],
    'MINÚSCULA': ['texto', 'Converte em minúsculas.'],
    'MOD': ['núm; divisor', 'Resto da divisão.'],
    'MODO': ['núm1; [núm2]; …', 'Valor mais frequente.'],
    'MUDAR': ['texto_antigo; núm_inicial; núm_caract; novo_texto', 'Troca caracteres pela posição.'],
    'MÁXIMO': ['núm1; [núm2]; …', 'Maior valor.'],
    'MÁXIMOSES': ['intervalo_máximo; intervalo_critérios1; critérios1; …', 'Maior valor que atende a critérios.'],
    'MÉDIA': ['núm1; [núm2]; …', 'Média aritmética.'],
    'MÉDIASE': ['intervalo; critério; [intervalo_média]', 'Média de valores que atendem a um critério.'],
    'MÉDIASES': ['intervalo_média; intervalo_critérios1; critérios1; …', 'Média com vários critérios.'],
    'MÊS': ['data', 'Mês de uma data (1 a 12).'],
    'MÍNIMO': ['núm1; [núm2]; …', 'Menor valor.'],
    'MÍNIMOSES': ['intervalo_mínimo; intervalo_critérios1; critérios1; …', 'Menor valor que atende a critérios.'],
    'NÃO': ['lógico', 'Inverte VERDADEIRO e FALSO.'],
    'NÚM.CARACT': ['texto', 'Quantidade de caracteres.'],
    'NÚMSEMANA': ['núm_série; [tipo_retorno]', 'Número da semana no ano.'],
    'ORDEM': ['núm; ref; [ordem]', 'Posição de um valor numa lista (0 decrescente, 1 crescente).'],
    'OU': ['lógico1; [lógico2]; …', 'VERDADEIRO se alguma condição for verdadeira.'],
    'PARÂMETRO': ['expressão; valor1; resultado1; …; [padrão]', 'Compara um valor com uma lista de opções.'],
    'PERCENTIL': ['matriz; k', 'Percentil k (0 a 1).'],
    'PGTO': ['taxa; nper; vp; [vf]; [tipo]', 'Parcela de um financiamento.'],
    'POTÊNCIA': ['núm; potência', 'Eleva um número a uma potência.'],
    'PRI.MAIÚSCULA': ['texto', 'Primeira letra de cada palavra em maiúscula.'],
    'PROCH': ['valor_procurado; matriz_tabela; núm_índice_lin; [procurar_intervalo]', 'Busca na primeira linha da tabela.'],
    'PROCURAR': ['texto_procurado; no_texto; [núm_inicial]', 'Posição de um texto (diferencia maiúsculas).'],
    'PROCV': ['valor_procurado; matriz_tabela; núm_índice_coluna; [procurar_intervalo]', 'Busca na primeira coluna da tabela (FALSO = exata).'],
    'PROCX': ['pesquisa_valor; pesquisa_matriz; matriz_retorno; [se_não_encontrada]; [modo_correspondência]; [modo_pesquisa]', 'Busca em qualquer direção.'],
    'QUARTIL': ['matriz; quarto', 'Quartil (0 a 4).'],
    'RAIZ': ['núm', 'Raiz quadrada.'], 'REPT': ['texto; número_vezes', 'Repete um texto.'],
    'SE': ['teste_lógico; [valor_se_verdadeiro]; [valor_se_falso]', 'Um valor se a condição for verdadeira e outro se for falsa.'],
    'SEERRO': ['valor; valor_se_erro', 'Valor alternativo quando a fórmula dá erro.'],
    'SENÃODISP': ['valor; valor_se_nd', 'Valor alternativo para #N/D.'],
    'SEQUÊNCIA': ['linhas; [colunas]; [início]; [passo]', 'Lista de números.'],
    'SES': ['teste1; valor1; [teste2; valor2]; …', 'Primeira condição verdadeira define o resultado.'],
    'SOMA': ['núm1; [núm2]; …', 'Soma números e intervalos.'],
    'SOMARPRODUTO': ['matriz1; [matriz2]; …', 'Multiplica item a item e soma.'],
    'SOMASE': ['intervalo; critério; [intervalo_soma]', 'Soma valores que atendem a um critério.'],
    'SOMASES': ['intervalo_soma; intervalo_critérios1; critérios1; [intervalo2; critérios2]; …', 'Soma com vários critérios.'],
    'SUBSTITUIR': ['texto; texto_antigo; novo_texto; [núm_da_ocorrência]', 'Troca um trecho de texto.'],
    'TEXTO': ['valor; formato_texto', 'Formata um número ou data como texto.'],
    'TEXTOANTES': ['texto; delimitador; [núm_instância]', 'Texto antes do delimitador.'],
    'TEXTODEPOIS': ['texto; delimitador; [núm_instância]', 'Texto depois do delimitador.'],
    'TRANSPOR': ['matriz', 'Troca linhas por colunas.'],
    'UNIRTEXTO': ['delimitador; ignorar_vazio; texto1; …', 'Junta textos com um separador.'],
    'VALOR': ['texto', 'Converte texto em número.'],
    'VAR': ['núm1; [núm2]; …', 'Variância da amostra.'], 'VARP': ['núm1; [núm2]; …', 'Variância da população.'],
    'VERDADEIRO': ['', 'Valor lógico VERDADEIRO.'],
    'VF': ['taxa; nper; pgto; [vp]; [tipo]', 'Valor futuro de aportes.'],
    'VP': ['taxa; nper; pgto; [vf]; [tipo]', 'Valor presente de uma série de pagamentos.'],
    'ÉCÉL.VAZIA': ['valor', 'VERDADEIRO se a célula estiver vazia.'],
    'ÉERRO': ['valor', 'VERDADEIRO se for um erro.'],
    'ÉNÚM': ['valor', 'VERDADEIRO se for número.'],
    'ÉTEXTO': ['valor', 'VERDADEIRO se for texto.'],
    'ÍNDICE': ['matriz; núm_linha; [núm_coluna]', 'Valor de uma posição.'],
    'ÚNICO': ['matriz; [por_coluna]; [ocorre_apenas_uma_vez]', 'Lista sem repetições.'],
  };
  const REF_COLORS = ['#60a5fa', '#f87171', '#c084fc', '#34d399', '#fbbf24', '#f472b6', '#22d3ee'];
  const PAREN_COLORS = ['#e8eaf6', '#a78bfa', '#38bdf8', '#fbbf24', '#34d399'];

  /* ------------------------------ Linguagens ------------------------------ */
  /** Excel: tokens para o realce. */
  function excelTokens(text) {
    const out = []; let i = 0, depth = 0;
    const refColor = {}; let nRef = 0;
    const push = function (type, s, extra) { out.push(Object.assign({ type: type, text: s }, extra || {})); };
    while (i < text.length) {
      const r = text.slice(i);
      let m;
      if ((m = r.match(/^"(?:[^"]|"")*"?/))) { push('str', m[0]); i += m[0].length; continue; }
      if ((m = r.match(/^#(?:N\/D|NOME\?|VALOR!|REF!|DIV\/0!|NÚM!|NULO!|CALC!|DESPEJAR!)/i))) { push('err', m[0]); i += m[0].length; continue; }
      if ((m = r.match(/^(?:'[^']*'|[A-Za-zÀ-ÿ_][\wÀ-ÿ.]*)!/))) { push('sheet', m[0]); i += m[0].length; continue; }
      if ((m = r.match(/^\$?[A-Za-z]{1,3}\$?\d+(?::\$?[A-Za-z]{1,3}\$?\d+)?(?![\wÀ-ÿ(])/)) || (m = r.match(/^\$?[A-Za-z]{1,3}:\$?[A-Za-z]{1,3}(?![\wÀ-ÿ(])/))) {
        const key = m[0].replace(/\$/g, '').toUpperCase();
        if (!(key in refColor)) refColor[key] = REF_COLORS[nRef++ % REF_COLORS.length];
        push('ref', m[0], { color: refColor[key] }); i += m[0].length; continue;
      }
      if ((m = r.match(/^[A-Za-zÀ-ÿ_][\wÀ-ÿ.]*(?=\s*\()/))) { push(EXCEL_SIG[strip(m[0])] || EXCEL_SIG[m[0].toUpperCase()] || knownExcel(m[0]) ? 'fn' : 'fnx', m[0]); i += m[0].length; continue; }
      if ((m = r.match(/^(?:VERDADEIRO|FALSO|TRUE|FALSE)\b/i))) { push('kw', m[0]); i += m[0].length; continue; }
      if ((m = r.match(/^[A-Za-zÀ-ÿ_][\wÀ-ÿ.]*/))) { push('name', m[0]); i += m[0].length; continue; }
      if ((m = r.match(/^\d+(?:,\d+)?%?/))) { push('num', m[0]); i += m[0].length; continue; }
      const ch = text[i];
      if (ch === '(') { push('paren', ch, { color: PAREN_COLORS[depth % PAREN_COLORS.length] }); depth++; i++; continue; }
      if (ch === ')') { depth = Math.max(0, depth - 1); push('paren', ch, { color: PAREN_COLORS[depth % PAREN_COLORS.length] }); i++; continue; }
      if (/[+\-*/^&=<>%]/.test(ch)) { push('op', ch); i++; continue; }
      if (ch === ';' || ch === ',') { push('sep', ch); i++; continue; }
      push('plain', ch); i++;
    }
    return out;
  }
  let excelNamesCache = null;
  function knownExcel(name) {
    if (!excelNamesCache) { excelNamesCache = {}; (global.ExcelEngine ? global.ExcelEngine.FUNCTION_NAMES : []).forEach(function (n) { excelNamesCache[strip(n)] = n; }); }
    return excelNamesCache[strip(name)];
  }
  const EXCEL_POPULAR = ['SOMA', 'SE', 'PROCV', 'PROCX', 'MÉDIA', 'CONT.SE', 'SOMASE', 'SOMASES', 'CONT.SES', 'MÁXIMO', 'MÍNIMO', 'SEERRO', 'ÍNDICE', 'CORRESP', 'TEXTO', 'DATA', 'HOJE', 'FILTRO', 'ÚNICO', 'CLASSIFICAR', 'ARRED', 'E', 'OU', 'CONCAT', 'ESQUERDA', 'DIREITA'];
  function excelFunctions() {
    const names = global.ExcelEngine ? global.ExcelEngine.FUNCTION_NAMES : Object.keys(EXCEL_SIG);
    return names.filter(function (n) { return n !== 'VERDADEIRO' && n !== 'FALSO'; }).map(function (n) {
      const sig = EXCEL_SIG[n] || ['', ''];
      const pop = EXCEL_POPULAR.indexOf(n);
      return { label: n, insert: n + '(', kind: 'fn', detail: sig[1], args: sig[0], rank: pop >= 0 ? pop - 100 : 0 };
    });
  }
  function excelSignature(name) {
    const canon = knownExcel(name) || name.toUpperCase();
    const sig = EXCEL_SIG[canon];
    return sig ? { name: canon, args: sig[0] ? sig[0].split(/;\s*/) : [], desc: sig[1], sep: ';' } : null;
  }
  const LANGS = {
    excel: {
      tokens: excelTokens,
      wordRe: /[A-Za-zÀ-ÿ_][\wÀ-ÿ.]*$/,
      suggest: function (before, ctx) {
        const m = before.match(/[A-Za-zÀ-ÿ_][\wÀ-ÿ.]*$/);
        if (!m) return null;
        const w = m[0];
        if (/^[A-Za-z]{1,3}\d+$/.test(w)) return null;                 // é uma referência (G2)
        const pre = strip(w);
        const items = excelFunctions().concat((ctx.sheets || []).map(function (s) {
          const quoted = /[^\wÀ-ÿ]/.test(s) ? "'" + s + "'" : s;
          return { label: s + '!', insert: quoted + '!', kind: 'sheet', detail: 'Planilha' };
        })).filter(function (it) { return strip(it.label).indexOf(pre) === 0 && strip(it.label) !== pre + '('; });
        return { from: before.length - w.length, items: items };
      },
      signature: excelSignature,
      sepChars: ';',
    },
  };
  function register(name, lang) { LANGS[name] = lang; }

  /* ------------------------------ Utilidades ------------------------------ */
  /** Função em que o cursor está e o índice do argumento atual. */
  function callAt(before, sepChars) {
    let depth = 0, arg = 0, inStr = false;
    for (let i = before.length - 1; i >= 0; i--) {
      const ch = before[i];
      if (ch === '"') { inStr = !inStr; continue; }
      if (inStr) continue;
      if (ch === ')' || ch === '}') depth++;
      else if (ch === '(' || ch === '{') {
        if (depth === 0) {
          if (ch === '{') return null;
          const m = before.slice(0, i).match(/([A-Za-zÀ-ÿ_][\wÀ-ÿ.]*)\s*$/);
          return m ? { name: m[1], arg: arg } : null;
        }
        depth--;
      } else if (depth === 0 && sepChars.indexOf(ch) >= 0) arg++;
    }
    return null;
  }
  function inString(before) { let n = 0; for (let i = 0; i < before.length; i++) if (before[i] === '"') n++; return n % 2 === 1; }
  function inComment(before) { const line = before.split('\n').pop(); return /\/\/[^"]*$/.test(line) || (before.lastIndexOf('/*') > before.lastIndexOf('*/')); }

  function render(tokens) {
    return tokens.map(function (t) {
      const style = t.color ? ' style="color:' + t.color + '"' : '';
      return '<span class="fe-' + t.type + '"' + style + '>' + esc(t.text) + '</span>';
    }).join('');
  }

  /* -------------------------------- Editor -------------------------------- */
  /**
   * opts: { lang, value, multiline, placeholder, ariaLabel, ctx (dados para sugestões),
   *         onChange(v), onRun(), onSubmit(), rows }
   */
  function mount(host, opts) {
    const lang = LANGS[opts.lang];
    const multi = !!opts.multiline;
    host.classList.add('fe', multi ? 'fe-multi' : 'fe-single');
    host.innerHTML = '<pre class="fe-hl" aria-hidden="true"></pre>' +
      '<textarea class="fe-input" spellcheck="false" autocomplete="off" autocapitalize="off" autocorrect="off"' + (multi ? ' wrap="soft" rows="' + (opts.rows || 8) + '"' : ' wrap="off" rows="1"') +
      ' aria-label="' + esc(opts.ariaLabel || 'Editor de fórmulas') + '" aria-autocomplete="list" aria-expanded="false" placeholder="' + esc(opts.placeholder || '') + '"></textarea>' +
      '<ul class="fe-list" role="listbox" hidden></ul>';
    const hl = host.querySelector('.fe-hl'), ta = host.querySelector('.fe-input'), list = host.querySelector('.fe-list');
    const sigBox = document.createElement('div'); sigBox.className = 'fe-sig'; sigBox.setAttribute('aria-live', 'polite');
    if (opts.sigHost) opts.sigHost.appendChild(sigBox); else host.insertAdjacentElement('afterend', sigBox);
    ta.value = opts.value || '';
    let items = [], sel = 0, from = 0, open = false;

    function paint() {
      const v = ta.value;
      hl.innerHTML = render(lang.tokens(v)) + (v.endsWith('\n') || !v ? ' ' : '');
      hl.scrollTop = ta.scrollTop; hl.scrollLeft = ta.scrollLeft;
    }
    function caretBefore() { return ta.value.slice(0, ta.selectionStart); }
    function closeList() { open = false; list.hidden = true; ta.setAttribute('aria-expanded', 'false'); }
    function charWidth() {
      const s = document.createElement('span'); s.textContent = 'MMMMMMMMMM'; s.style.visibility = 'hidden'; s.style.position = 'absolute';
      hl.appendChild(s); const w = s.getBoundingClientRect().width / 10; s.remove(); return w || 8;
    }
    function placeList() {
      const before = ta.value.slice(0, from);
      let x, y;
      if (multi) {
        // espelho com a mesma tipografia: funciona também com quebra de linha
        const m = document.createElement('div'); const cs = getComputedStyle(ta);
        m.className = 'fe-hl'; m.style.visibility = 'hidden'; m.style.height = 'auto'; m.style.bottom = 'auto';
        m.style.width = ta.clientWidth + 'px';
        m.textContent = before; const mk = document.createElement('span'); mk.textContent = '\u200b'; m.appendChild(mk);
        host.appendChild(m);
        const r = mk.getBoundingClientRect(), hr = m.getBoundingClientRect();
        x = r.left - hr.left; y = r.top - hr.top + (parseFloat(cs.lineHeight) || 20) - ta.scrollTop + 4;
        m.remove();
      } else {
        const lines = before.split('\n'), col = lines[lines.length - 1].length, line = lines.length - 1;
        const cs = getComputedStyle(ta);
        const lh = parseFloat(cs.lineHeight) || 20, pl = parseFloat(cs.paddingLeft) || 0, pt = parseFloat(cs.paddingTop) || 0;
        x = pl + col * charWidth() - ta.scrollLeft;
        y = pt + (line + 1) * lh - ta.scrollTop + 4;
      }
      x = Math.max(4, Math.min(x, host.clientWidth - Math.min(320, host.clientWidth - 8) - 4));
      list.style.left = x + 'px'; list.style.top = y + 'px';
    }
    function showList() {
      list.innerHTML = items.map(function (it, i) {
        return '<li role="option" class="fe-opt k-' + it.kind + (i === sel ? ' on' : '') + '" data-i="' + i + '" aria-selected="' + (i === sel) + '">' +
          '<span class="fe-k">' + ({ fn: 'ƒx', sheet: '▦', table: '▦', col: '▸', measure: '∑', kw: 'k' }[it.kind] || '•') + '</span>' +
          '<span class="fe-l">' + esc(it.label) + '</span>' + (it.detail ? '<small>' + esc(it.detail) + '</small>' : '') + '</li>';
      }).join('');
      list.hidden = false; open = true; ta.setAttribute('aria-expanded', 'true');
      placeList();
      const on = list.querySelector('.on'); if (on && on.scrollIntoView) on.scrollIntoView({ block: 'nearest' });
    }
    function suggest() {
      const before = caretBefore();
      if (ta.selectionStart !== ta.selectionEnd || (lang.inString || inString)(before) || (lang.inComment || inComment)(before)) return closeList();
      const res = lang.suggest(before, opts.ctx || {});
      if (!res || !res.items.length) return closeList();
      from = res.from; items = res.items.sort(function (a, b) { return (a.rank || 0) - (b.rank || 0) || a.label.localeCompare(b.label); }).slice(0, res.limit || 9); sel = 0;
      showList();
    }
    function accept(i) {
      const it = items[i]; if (!it) return;
      const v = ta.value, end = ta.selectionStart;
      // não duplica "(" se já existir logo depois do cursor
      let ins = it.insert;
      if (ins.endsWith('(') && v[end] === '(') ins = ins.slice(0, -1);
      ta.value = v.slice(0, from) + ins + v.slice(end);
      const pos = from + ins.length;
      ta.setSelectionRange(pos, pos);
      closeList(); paint(); changed();
      if (it.chain) setTimeout(suggest, 0);      // ex.: tabela → abre a lista de colunas
      updateSig();
      ta.focus();
    }
    function updateSig() {
      const before = caretBefore();
      const c = !(lang.inString || inString)(before) && callAt(before, lang.sepChars || ';,');
      const sig = c && lang.signature(c.name, opts.ctx || {});
      if (!sig) { sigBox.innerHTML = ''; sigBox.classList.remove('on'); return; }
      const args = sig.args.map(function (a, i) { return '<span class="' + (i === Math.min(c.arg, sig.args.length - 1) || (i === sig.args.length - 1 && c.arg >= i && /…/.test(a)) ? 'cur' : '') + '">' + esc(a) + '</span>'; });
      sigBox.innerHTML = '<code><b>' + esc(sig.name) + '</b>(' + args.join(esc(sig.sep + ' ')) + ')</code>' + (sig.desc ? '<span>' + esc(sig.desc) + '</span>' : '');
      sigBox.classList.add('on');
    }
    function changed() { if (opts.onChange) opts.onChange(ta.value); }

    ta.addEventListener('input', function () { paint(); changed(); suggest(); updateSig(); });
    ta.addEventListener('scroll', function () { hl.scrollTop = ta.scrollTop; hl.scrollLeft = ta.scrollLeft; if (open) placeList(); });
    ta.addEventListener('click', function () { closeList(); updateSig(); });
    ta.addEventListener('keyup', function (e) { if (/^Arrow(Left|Right)$|^Home$|^End$/.test(e.key)) updateSig(); });
    ta.addEventListener('blur', function () { setTimeout(closeList, 150); });
    ta.addEventListener('keydown', function (e) {
      if (open) {
        if (e.key === 'ArrowDown') { e.preventDefault(); sel = (sel + 1) % items.length; showList(); return; }
        if (e.key === 'ArrowUp') { e.preventDefault(); sel = (sel - 1 + items.length) % items.length; showList(); return; }
        if ((e.key === 'Enter' && !e.ctrlKey && !e.metaKey && lang.enterAccepts !== false) || e.key === 'Tab') { e.preventDefault(); accept(sel); return; }
        if (e.key === 'Enter') closeList();
        if (e.key === 'Escape') { e.preventDefault(); closeList(); return; }
      }
      if (e.key === 'Enter') {
        if (e.ctrlKey || e.metaKey) { e.preventDefault(); (e.shiftKey || !multi ? opts.onSubmit : opts.onRun || opts.onSubmit)(); return; }
        if (!multi) { e.preventDefault(); if (opts.onRun) opts.onRun(); return; }
        // nova linha mantendo o recuo
        e.preventDefault();
        const s = ta.selectionStart, ls = ta.value.lastIndexOf('\n', s - 1) + 1;
        const ind = ta.value.slice(ls).match(/^[ \t]*/)[0] + ((lang.indentAfter || /[(\[{]\s*$/).test(ta.value.slice(ls, s)) ? '    ' : '');
        ta.setRangeText('\n' + ind, s, ta.selectionEnd, 'end'); paint(); changed(); return;
      }
      if (e.key === 'Tab' && multi) {
        e.preventDefault();
        if (e.shiftKey) {
          const s = ta.selectionStart, ls = ta.value.lastIndexOf('\n', s - 1) + 1;
          if (ta.value.substr(ls, 4) === '    ') { ta.setRangeText('', ls, ls + 4, 'preserve'); }
        } else ta.setRangeText('    ', ta.selectionStart, ta.selectionEnd, 'end');
        paint(); changed();
      }
    });
    list.addEventListener('mousedown', function (e) { const li = e.target.closest('[data-i]'); if (li) { e.preventDefault(); accept(+li.dataset.i); } });
    paint();

    return {
      el: ta,
      get: function () { return ta.value; },
      set: function (v) { ta.value = v; paint(); updateSig(); },
      focus: function (atEnd) { ta.focus(); if (atEnd !== false) { const n = ta.value.length; ta.setSelectionRange(n, n); } },
      /** Seleciona a posição (1-based) de um erro: col no texto todo. */
      select: function (pos, len) { ta.focus(); const s = Math.max(0, pos - 1); ta.setSelectionRange(s, s + (len || 1)); },
      setCtx: function (ctx) { opts.ctx = ctx; },
    };
  }

  global.FormulaEditor = { mount: mount, register: register, LANGS: LANGS, callAt: callAt, EXCEL_SIG: EXCEL_SIG, strip: strip, render: render };
})(window);
