"""Gera css/theme-light.css a partir de css/styles.css (tema claro automático).

Como funciona:
  • O bloco BASE redefine as variáveis (--bg, --ink, --line…) para o tema claro.
  • Para cada regra de styles.css com cores fixas (fundos escuros, brilhos brancos,
    textos claros), cria a mesma regra sob html[data-theme=light] com a cor
    "espelhada": a luminosidade HSL é invertida e o matiz é mantido.
  • Cores de destaque saturadas (botões, medalhas) ficam iguais; o texto branco
    sobre elas também.
  • Áreas de código (KEEP_DARK) continuam escuras, como num editor.
  • O bloco TAIL tem os ajustes finos feitos à mão.
Rode:  python3 build/gen_light.py
"""
import re, colorsys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = (ROOT / 'css/styles.css').read_text() + '\n' + (ROOT / 'css/codemirror.css').read_text()
OUT = ROOT / 'css/theme-light.css'
P = 'html[data-theme="light"]'
PW = ':where(html[data-theme="light"])'   # sem especificidade extra: estados (.on, :hover) do original continuam valendo

KEEP_DARK = ['.code-block', '.ls-ed', '.ls-vs-ex', '.editor-host', '.CodeMirror', '.cm-', '.py-out', '.login-code',
             '.fe ', '.fe-', '.pbi-editor .fe', '.tech code', '.cert-thumb', '.cert-img', '.cv-img', '.calc-screen', '.ls-code',
             '.sheet-code', '.sum-code', '.pq-m', '.gq-code', '.chart-code', '.hl-', '.tok-', '.ls-mk', '.t-kw', '.t-str', '.t-num', '.t-com', '.t-ref', '#print-area']
COLOR_PROPS = ('background', 'background-color', 'background-image', 'color', 'border', 'border-color', 'border-top', 'border-bottom',
               'border-left', 'border-right', 'border-top-color', 'border-bottom-color', 'border-left-color', 'border-right-color',
               'outline-color', 'fill', 'stroke', 'caret-color', '-webkit-text-fill-color', 'text-decoration-color')

COLOR_RE = re.compile(r'rgba?\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*(?:,\s*[\d.]+\s*)?\)|#[0-9a-fA-F]{3,8}\b')

def parse(c):
    if c.startswith('#'):
        h = c[1:]
        if len(h) in (3, 4): h = ''.join(x * 2 for x in h)
        r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
        a = int(h[6:8], 16) / 255 if len(h) == 8 else 1
        return r, g, b, a
    n = [float(x) for x in re.findall(r'[\d.]+', c)]
    return n[0], n[1], n[2], (n[3] if len(n) > 3 else 1)

def fmt(r, g, b, a):
    r, g, b = (max(0, min(255, round(v))) for v in (r, g, b))
    return f'rgba({r},{g},{b},{a:.3g})' if a < 1 else f'#{r:02x}{g:02x}{b:02x}'

def hls(c):
    r, g, b, a = parse(c)
    h, l, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
    return h, l, s, a

def is_accent(c):
    h, l, s, a = hls(c)
    return s > .45 and .22 < l < .86

def flip(c, prop):
    h, l, s, a = hls(c)
    if is_accent(c):
        if prop in ('color', 'fill', '-webkit-text-fill-color', 'stroke') and l > .45:   # texto colorido claro: escurece para ler no branco
            r, g, b = colorsys.hls_to_rgb(h, max(.3, min(.4, l - .18)), min(1, s))
            return fmt(r * 255, g * 255, b * 255, a)
        return c
    if prop in ('color', 'fill', '-webkit-text-fill-color', 'stroke') and l < .2:
        return c   # texto escuro no tema escuro só existe sobre fundos coloridos: mantém
    nl = 1 - l
    if prop.startswith('background') and l < .2:      # fundos escuros viram superfícies claras levemente azuladas
        nl = min(.985, .93 + (.2 - l) * .3); s = min(s, .35)
    if prop in ('color', 'fill', '-webkit-text-fill-color', 'caret-color') and l > .55:
        nl = max(.08, min(.42, 1 - l + .02))         # texto claro vira texto escuro legível
    r, g, b = colorsys.hls_to_rgb(h, nl, s)
    return fmt(r * 255, g * 255, b * 255, a)

def tokens(css):
    """Divide em [(prelude, body)] respeitando @media (devolve blocos aninhados)."""
    out, i, n = [], 0, len(css)
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    n = len(css)
    while i < n:
        j = css.find('{', i)
        if j < 0: break
        pre = css[i:j].strip()
        depth, k = 1, j + 1
        while k < n and depth:
            if css[k] == '{': depth += 1
            elif css[k] == '}': depth -= 1
            k += 1
        out.append((pre, css[j + 1:k - 1]))
        i = k
    return out

def scope(sel):
    parts = []
    for s in sel.split(','):
        s = s.strip()
        if not s: continue
        if s.startswith(':root'): continue
        if s.startswith('html'): s = s[4:].strip() or ''
        parts.append(PW + ' ' + s)
    return ', '.join(parts)

def keep_dark(sel):
    return any(k in sel for k in KEEP_DARK)

def rules(blocks):
    res = []
    for pre, body in blocks:
        if pre.startswith('@keyframes') or pre.startswith('@font-face') or pre.startswith('@media print') or pre.startswith('@supports') and 'print' in pre:
            continue
        if pre.startswith('@media') or pre.startswith('@supports'):
            inner = rules(tokens(body))
            if inner: res.append(pre + ' {\n' + '\n'.join('  ' + r for r in inner) + '\n}')
            continue
        if keep_dark(pre) or ':root' in pre and len(pre) < 8: continue
        decls = [d.strip() for d in body.split(';') if ':' in d]
        accent_bg = any(d.split(':', 1)[0].strip().startswith('background') and any(is_accent(c) and parse(c)[3] >= .5 for c in COLOR_RE.findall(d)) for d in decls)
        accent_bg = accent_bg or any(d.split(':', 1)[0].strip().startswith('background') and ('var(--tc-' in d or 'var(--tk-' in d or ('gradient' in d and re.search(r'var\(--(blue|violet|cyan|ok|gold|warn|err)', d))) for d in decls)
        clip = [d for d in decls if 'background-clip' in d]
        new = []
        for d in decls:
            prop, val = d.split(':', 1); prop = prop.strip(); val = val.strip()
            if prop not in COLOR_PROPS or prop.startswith('--'): continue
            cols = COLOR_RE.findall(val)
            if not cols: continue
            if prop == 'color' and accent_bg: continue
            nv = COLOR_RE.sub(lambda m: flip(m.group(0), prop), val)
            if nv != val:
                new.append(f'{prop}: {nv}')
                if prop == 'background' and clip: new.extend(clip)
        if new:
            sc = scope(pre)
            if sc: res.append(sc + ' { ' + '; '.join(new) + '; }')
    return res

BASE = f'''/* =====================================================================
   theme-light.css — Tema claro (GERADO por build/gen_light.py; não editar à mão)
   ===================================================================== */
{P} {{
  color-scheme: light;
  --bg: #f4f6fb; --bg-2: #eaeef7;
  --glass: rgba(255,255,255,.78); --glass-2: rgba(255,255,255,.9);
  --line: rgba(40,52,110,.12); --line-2: rgba(40,52,110,.22);
  --ink: #141a2e; --ink-2: #34405e; --ink-3: #5b6584; --ink-4: #8a93b0;
  --blue: #3b66f0; --violet: #8a4cf0; --cyan: #0b93ad;
  --ok: #0f9a68; --warn: #b7800a; --err: #d63e3e; --gold: #a97a1c;
  --glow: 0 0 0 1px rgba(77,124,255,.35), 0 10px 28px -12px rgba(77,124,255,.55);
}}
/* áreas de código continuam escuras, como num editor */
{P} :is({', '.join(k.strip() for k in KEEP_DARK if k.startswith('.') and not k.endswith('-') and ' ' not in k.strip() and not k.startswith('.t-') and k != '.ls-mk')}) {{
  --ink: #e8eaf6; --ink-2: #c3c8de; --ink-3: #8e94b0; --ink-4: #5d6382; --line: rgba(150,165,255,.11); --line-2: rgba(150,165,255,.2);
  --cyan: #2fd8f0; --ok: #34d399; --warn: #fbbf24; --err: #f87171; --gold: #f5c86b; --blue: #4d7cff; --violet: #a46bff;
  color: var(--ink);
}}
'''

TAIL = (ROOT / 'build/theme-light-tail.css').read_text() if (ROOT / 'build/theme-light-tail.css').exists() else ''

out = BASE + '\n'.join(rules(tokens(SRC))) + '\n\n/* ---- ajustes manuais (build/theme-light-tail.css) ---- */\n' + TAIL
OUT.write_text(out)
print('ok', OUT, len(out.splitlines()), 'linhas')
