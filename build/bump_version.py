"""Marca js/ e css/ no index.html com ?v=<data-hora> para forçar o navegador a baixar a versão nova.
Uso: python build/bump_version.py   (rode antes de cada upload)"""
import re, datetime, pathlib
p = pathlib.Path(__file__).resolve().parent.parent / 'index.html'
v = datetime.datetime.now().strftime('%Y%m%d%H%M')
s = p.read_text(encoding='utf-8')
s = re.sub(r'((?:src|href)="(?:js|css)/[^"?]+)(?:\?v=[^"]*)?"', r'\1?v=' + v + '"', s)
p.write_text(s, encoding='utf-8'); print('versão', v)
