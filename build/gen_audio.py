"""Gera a narração gravada com vozes neurais da Microsoft (edge-tts).

Uso, na pasta build/ do projeto, no seu computador (precisa de internet):
    pip install edge-tts
    python gen_audio.py

Opções:
    --pt pt-BR-ThalitaMultilingualNeural   outra voz em português
    --en en-US-AndrewNeural                outra voz em inglês
    --rate -5%                             falar um pouco mais devagar

Resultado: assets/audio/ com um MP3 por aula (cerca de 260 arquivos) e o
manifest.json. A plataforma detecta o manifest sozinha e passa a usar a voz
gravada; qualquer trecho que faltar continua na voz do navegador.

Como funciona:
  • narration.json (gerado por `node export_narration.js`) traz cada slide
    dividido em trechos; trechos bilíngues vêm em segmentos pt/en.
  • Cada segmento é gerado uma vez e guardado em build/.tts-cache/ (rodar de
    novo só gera o que mudou; dá para interromper e continuar depois).
  • Os segmentos de cada aula são emendados num único MP3 (formato CBR
    48 kbps), e o manifest guarda início e fim de cada trecho em segundos.
    Assim são ~260 arquivos em vez de milhares, o que cabe no upload pelo
    site do GitHub (até 100 arquivos por envio).

Vozes sugeridas — pt: pt-BR-FranciscaNeural, pt-BR-ThalitaMultilingualNeural,
pt-BR-AntonioNeural · en: en-US-AvaNeural, en-US-AndrewNeural, en-US-EmmaNeural.
Liste todas com:  edge-tts --list-voices

Observação: o edge-tts usa o serviço de leitura em voz alta do Microsoft Edge,
gratuito porém não oficial. Para uso comercial, gere os mesmos áudios pelo
Azure AI Speech (mesmas vozes, com licença; o plano gratuito cobre 500 mil
caracteres por mês, o suficiente para a plataforma inteira).
"""
import argparse, asyncio, hashlib, json, pathlib, sys

try:
    import edge_tts
except ImportError:
    sys.exit('Instale antes:  pip install edge-tts')

ROOT = pathlib.Path(__file__).resolve().parent
OUT = ROOT.parent / 'assets' / 'audio'
CACHE = ROOT / '.tts-cache'
BYTES_PER_SEC = 48000 / 8      # saída padrão do edge-tts: MP3 24 kHz, 48 kbps CBR


def seg_key(voice, rate, text):
    return hashlib.sha1(f'{voice}|{rate}|{text}'.encode('utf-8')).hexdigest()[:20]


async def main(pt_voice, en_voice, rate, workers, label):
    data = json.loads((ROOT / 'narration.json').read_text(encoding='utf-8'))
    OUT.mkdir(parents=True, exist_ok=True)
    CACHE.mkdir(exist_ok=True)

    # 1) lista de segmentos únicos para gerar
    def segs_of(chunk):
        return chunk.get('segs') or [{'lang': 'pt', 'say': chunk['say']}]
    voice_of = {'pt': pt_voice, 'en': en_voice}
    todo = {}
    for clip in data:
        for ch in clip['chunks']:
            for sg in segs_of(ch):
                v = voice_of.get(sg['lang'], pt_voice)
                k = seg_key(v, rate, sg['say'])
                if not (CACHE / f'{k}.mp3').exists():
                    todo[k] = (v, sg['say'])
    total_chars = sum(len(t) for _, t in todo.values())
    print(f'{len(todo)} segmentos para gerar ({total_chars:,} caracteres)'.replace(',', '.'))

    sem = asyncio.Semaphore(workers)
    done = 0
    failed = []

    async def gen(k, voice, text):
        nonlocal done
        async with sem:
            tmp = CACHE / f'{k}.part'
            for attempt in range(4):
                try:
                    await edge_tts.Communicate(text, voice, rate=rate).save(str(tmp))
                    tmp.replace(CACHE / f'{k}.mp3')
                    break
                except Exception as e:  # rede instável: tenta de novo
                    if attempt == 3:
                        failed.append((k, str(e)))
                    await asyncio.sleep(2 + attempt * 2)
            done += 1
            if done % 50 == 0 or done == len(todo):
                print(f'  {done}/{len(todo)}')

    await asyncio.gather(*(gen(k, v, t) for k, (v, t) in todo.items()))
    if failed:
        print(f'{len(failed)} segmentos falharam; rode de novo para completar (os prontos ficam no cache).')

    # 2) emenda por grupo (um MP3 por aula) e monta o manifest
    groups = {}
    for clip in data:
        groups.setdefault(clip.get('group') or clip['id'], []).append(clip)
    manifest = {'voice': pt_voice, 'voices': {'pt': pt_voice, 'en': en_voice}, 'label': label, 'clips': {}}
    for g, clips in groups.items():
        buf = bytearray()
        for clip in clips:
            entries = []
            for ch in clip['chunks']:
                start = len(buf)
                ok = True
                for sg in segs_of(ch):
                    f = CACHE / f"{seg_key(voice_of.get(sg['lang'], pt_voice), rate, sg['say'])}.mp3"
                    if not f.exists():
                        ok = False
                        break
                    buf += f.read_bytes()
                if not ok:              # trecho incompleto: fica na voz do navegador
                    del buf[start:]
                    entries.append(None)
                    continue
                entries.append([f'{g}.mp3', round(start / BYTES_PER_SEC, 3), round(len(buf) / BYTES_PER_SEC, 3)])
            manifest['clips'][clip['id']] = entries
        if buf:
            (OUT / f'{g}.mp3').write_bytes(bytes(buf))
    (OUT / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    size = sum(p.stat().st_size for p in OUT.glob('*.mp3')) / 1e6
    print(f'pronto → {OUT} ({len(list(OUT.glob("*.mp3")))} arquivos, {size:.0f} MB)')
    print('Envie a pasta assets/audio para o GitHub (até 100 arquivos por envio).')


if __name__ == '__main__':
    ap = argparse.ArgumentParser(description='Gera a narração gravada da plataforma.')
    ap.add_argument('--pt', default='pt-BR-FranciscaNeural', help='voz em português')
    ap.add_argument('--en', default='en-US-AvaNeural', help='voz em inglês')
    ap.add_argument('--rate', default='+0%', help='ex.: -5%% para falar um pouco mais devagar')
    ap.add_argument('--workers', type=int, default=6)
    ap.add_argument('--label', default='neural')
    a = ap.parse_args()
    asyncio.run(main(a.pt, a.en, a.rate, a.workers, a.label))
