"""Gera a narração gravada com vozes neurais da Microsoft (edge-tts).

Uso, na pasta build/:
    pip install edge-tts
    node export_narration.js          # atualiza narration.json (só se mudou conteúdo)
    python gen_audio.py               # voz padrão: Francisca
    python gen_audio.py --voice pt-BR-AntonioNeural --label "Antônio (neural)"

Vozes pt-BR boas: pt-BR-FranciscaNeural, pt-BR-ThalitaMultilingualNeural, pt-BR-AntonioNeural.
Liste todas com:  edge-tts --list-voices | grep pt-BR

Os MP3 vão para assets/audio/ junto com manifest.json. A plataforma detecta o
manifest automaticamente e passa a usar a voz gravada (com fallback para a voz
do navegador em qualquer trecho que falte). Arquivos já gerados são pulados,
então dá para interromper e continuar depois.

Observação: o edge-tts usa o serviço de leitura em voz alta do Microsoft Edge,
gratuito porém não oficial. Para uso comercial, gere os mesmos áudios pelo
Azure AI Speech (mesmas vozes, com licença).
"""
import argparse, asyncio, json, pathlib, sys

try:
    import edge_tts
except ImportError:
    sys.exit('Instale antes:  pip install edge-tts')

ROOT = pathlib.Path(__file__).resolve().parent
OUT = ROOT.parent / 'assets' / 'audio'

async def main(voice, label, rate, workers):
    data = json.loads((ROOT / 'narration.json').read_text(encoding='utf-8'))
    OUT.mkdir(parents=True, exist_ok=True)
    jobs, manifest = [], {'voice': voice, 'label': label, 'clips': {}}
    for clip in data:
        files = []
        for i, ch in enumerate(clip['chunks']):
            name = f"{clip['id']}-{i}.mp3"
            files.append(name)
            if not (OUT / name).exists():
                jobs.append((name, ch['say']))
        manifest['clips'][clip['id']] = files
    print(f'{len(jobs)} trechos para gerar ({sum(len(v) for v in manifest["clips"].values())} no total)')
    sem = asyncio.Semaphore(workers)
    done = 0
    async def gen(name, text):
        nonlocal done
        async with sem:
            for attempt in range(3):
                try:
                    await edge_tts.Communicate(text, voice, rate=rate).save(str(OUT / name))
                    break
                except Exception as e:
                    if attempt == 2: print('falhou', name, e)
                    await asyncio.sleep(2)
            done += 1
            if done % 25 == 0: print(f'  {done}/{len(jobs)}')
    await asyncio.gather(*(gen(n, t) for n, t in jobs))
    (OUT / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False), encoding='utf-8')
    print('pronto →', OUT / 'manifest.json')

if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--voice', default='pt-BR-FranciscaNeural')
    ap.add_argument('--label', default='Francisca (neural)')
    ap.add_argument('--rate', default='+0%', help='ex.: -5% para falar um pouco mais devagar')
    ap.add_argument('--workers', type=int, default=4)
    a = ap.parse_args()
    asyncio.run(main(a.voice, a.label, a.rate, a.workers))
