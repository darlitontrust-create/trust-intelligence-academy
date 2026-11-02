/* =====================================================================
   narrator.js — Narração por voz dos conteúdos
   ---------------------------------------------------------------------
   Dois motores, escolhidos automaticamente:
   1. Voz gravada (neural): se existir assets/audio/manifest.json, toca
      os MP3 gerados por build/gen_audio.py (vozes neurais da Microsoft).
      Soa igual em qualquer aparelho. O manifest aceita dois formatos por
      trecho: "arquivo.mp3" (um arquivo por trecho, formato antigo) ou
      ["pacote.mp3", início, fim] (vários trechos num MP3 por aula, para
      caber no upload do GitHub).
   2. Voz do navegador (Web Speech API): fallback. Prioriza vozes
      neurais ("Natural", "Online", Google, "Premium/Aprimorada") e evita
      vozes sintéticas antigas.
   • Bilíngue: texto entre ⟦ e ⟧ é inglês. Esses trechos são falados por
     uma voz inglesa (en-US), o restante pela voz em português.
   • Cada slide é um "clipe" { id, chunks: [{ text, say, segs? }] }:
     text = legenda exibida · say = texto para a fala ·
     segs = [{ lang, say }] quando o trecho mistura português e inglês.
   • Preferências em state.settings.narration (on, rate, voice, auto).
   ===================================================================== */
(function (global) {
  'use strict';

  const synth = global.speechSynthesis;
  const supportedSynth = !!(synth && global.SpeechSynthesisUtterance);
  const AUDIO_ID = '__audio';
  const EN_OPEN = '⟦', EN_CLOSE = '⟧';
  let voices = [];          // vozes em português, da mais humana para a mais sintética
  let enVoices = [];        // vozes em inglês
  let manifest = null;      // { voice, clips: { id: [trechos] } }
  let audio = null;         // elemento <audio> em uso
  let token = 0;            // invalida falas antigas ao trocar de slide
  const listeners = [];

  /* ------------------------------- Vozes ------------------------------- */
  /** Nota de "naturalidade" da voz (maior = mais humana). */
  function score(v, lang) {
    let s = 0;
    const L = String(v.lang || '').replace('_', '-');
    if (lang === 'en') { if (/^en-US/i.test(L)) s += 20; else if (/^en-GB/i.test(L)) s += 14; else if (/^en/i.test(L)) s += 6; }
    else if (/^pt-BR/i.test(L)) s += 20;
    if (/natural|neural|online/i.test(v.name)) s += 30;                       // Edge: "Francisca Online (Natural)"
    if (/multilingual/i.test(v.name)) s += 4;
    if (/premium|enhanced|aprimorad|siri/i.test(v.name)) s += 25;              // Apple: vozes aprimoradas
    if (/google/i.test(v.name)) s += 15;                                       // Chrome: voz de rede do Google
    if (/network|rede/i.test(v.name + ' ' + v.voiceURI)) s += 12;              // Android: vozes de rede
    if (/francisca|thalita|antonio|jenny|aria|ava|andrew|emma|guy|samantha|luciana/i.test(v.name)) s += 4;
    if (!v.localService) s += 5;
    if (/espeak|desktop|compact|eloquence|novelty|bad news|bells|bubbles|whisper|zarvox|trinoids|jester|organ|cellos|boing|albert|fred|junior|ralph|kathy|superstar|wobble/i.test(v.name)) s -= 30;
    if (/maria|daniel|zira|david|mark|hazel/i.test(v.name) && !/natural|online/i.test(v.name)) s -= 8;   // vozes antigas do Windows
    return s;
  }
  function isNatural(v) { return !!v && (score(v, /^en/i.test(v.lang || '') ? 'en' : 'pt') >= 35 || v.voiceURI === AUDIO_ID); }
  function loadVoices() {
    if (!supportedSynth) return;
    const all = synth.getVoices();
    voices = all.filter(function (v) { return /^pt/i.test(v.lang); }).sort(function (a, b) { return score(b, 'pt') - score(a, 'pt'); });
    enVoices = all.filter(function (v) { return /^en/i.test(v.lang); }).sort(function (a, b) { return score(b, 'en') - score(a, 'en'); });
    emit({ type: 'voices' });
  }
  if (supportedSynth) {
    loadVoices();
    if (typeof synth.addEventListener === 'function') synth.addEventListener('voiceschanged', loadVoices);
    else synth.onvoiceschanged = loadVoices;
  }

  /** Procura o pacote de áudio gravado (opcional). */
  function loadManifest() {
    if (typeof fetch !== 'function') return;
    fetch('assets/audio/manifest.json', { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (m) { if (m && m.clips) { manifest = m; emit({ type: 'voices' }); } })
      .catch(function () { /* sem áudio gravado: usa a voz do navegador */ });
  }
  loadManifest();

  /** Lista para o seletor: voz gravada (se houver) + vozes do navegador. */
  function voiceOptions() {
    const list = [];
    if (manifest) list.push({ voiceURI: AUDIO_ID, name: 'Gravada · ' + (manifest.label || 'neural'), natural: true });
    voices.forEach(function (v) { list.push({ voiceURI: v.voiceURI, name: v.name, natural: isNatural(v) }); });
    return list;
  }

  /* --------------------------- Preferências --------------------------- */
  function prefs() {
    const st = global.AppStorage && global.AppStorage.state;
    const def = { on: false, rate: 1, voice: '', auto: true };
    if (!st) return def;
    st.settings.narration = Object.assign(def, st.settings.narration || {});
    return st.settings.narration;
  }
  function setPref(k, v) { prefs()[k] = v; if (global.AppStorage) global.AppStorage.save(); emit({ type: 'prefs' }); }
  /** Voz escolhida (ou a melhor disponível). */
  function currentVoice() {
    const p = prefs();
    if (p.voice === AUDIO_ID && manifest) return { voiceURI: AUDIO_ID, name: 'Gravada' };
    const chosen = voices.find(function (v) { return v.voiceURI === p.voice; });
    if (chosen) return chosen;
    if (manifest) return { voiceURI: AUDIO_ID, name: 'Gravada' };
    return voices[0] || null;
  }
  /** Melhor voz em inglês do aparelho (ou null). */
  function englishVoice() { return enVoices[0] || null; }

  /* ------------------------- Texto para fala ------------------------- */
  /** Remove as marcas de inglês (para legendas e textos simples). */
  function plain(t) { return String(t == null ? '' : t).replace(/[⟦⟧]/g, ''); }
  /** Troca símbolos e siglas por palavras que a voz lê bem. */
  function speakable(t) {
    return plain(t)
      .replace(/asterisco\s*\(\*\)/gi, 'asterisco')
      .replace(/SELECT\s+\*/gi, 'SELECT asterisco')
      .replace(/→/g, ', depois, ')
      .replace(/·/g, ', ')
      .replace(/>=/g, ' maior ou igual a ')
      .replace(/<=/g, ' menor ou igual a ')
      .replace(/<>|!=/g, ' diferente de ')
      .replace(/\s>\s/g, ' maior que ')
      .replace(/\s<\s/g, ' menor que ')
      .replace(/\s=\s/g, ' igual a ')
      .replace(/\(\*\)/g, ' asterisco ')
      .replace(/\s\*\s/g, ' vezes ')
      .replace(/\*/g, ' asterisco ')
      .replace(/(\d)\s?%/g, '$1 por cento')
      .replace(/%/g, ' sinal de porcentagem ')
      .replace(/_{2,}/g, ' lacuna ')
      .replace(/_/g, ' ')
      .replace(/\bSQL\b/g, 'ésse quê éle')
      .replace(/\bCTEs\b/g, 'cê tê ês').replace(/\bCTE\b/g, 'cê tê é')
      .replace(/[“”"]/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }
  /** Texto em inglês para a fala: só limpa símbolos que a voz leria em voz alta. */
  function speakableEn(t) {
    return String(t).replace(/[⟦⟧“”"]/g, '').replace(/_{2,}/g, ' blank ').replace(/\s*\/\s*/g, ', or ').replace(/\s{2,}/g, ' ').trim();
  }
  /** Divide em frases (ponto seguido de espaço e maiúscula), sem cortar dentro de ⟦…⟧. */
  function sentences(text) {
    const out = []; let cur = '', depth = 0;
    const t = String(text);
    for (let i = 0; i < t.length; i++) {
      const c = t[i];
      cur += c;
      if (c === EN_OPEN) depth++;
      else if (c === EN_CLOSE) depth = Math.max(0, depth - 1);
      else if (!depth && /[.!?]/.test(c) && /\s/.test(t[i + 1] || '') && /[A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9'"⟦]/.test(t[i + 2] || '')) { out.push(cur.trim()); cur = ''; }
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
  }
  /** Separa um trecho em segmentos de idioma: [{ lang: 'pt'|'en', say }]. */
  function segments(t) {
    const out = [];
    String(t).split(/(⟦[^⟧]*⟧)/).forEach(function (p) {
      if (!p) return;
      if (p[0] === EN_OPEN) { const s = speakableEn(p); if (s) out.push({ lang: 'en', say: s }); }
      else { const s = speakable(p.replace(/\s+\/\s+/g, ', ')).replace(/^[\s,.;:]+|[\s,;:]+$/g, ''); if (/[\p{L}\p{N}]/u.test(s)) out.push({ lang: 'pt', say: s }); }
    });
    return out;
  }
  /**
   * Agrupa frases em trechos de até ~200 caracteres: menos pausas
   * (fala mais natural) sem passar do limite em que o Chrome corta a voz.
   */
  function chunk(parts) {
    const out = []; let cur = '';
    parts.forEach(function (p) {
      sentences(p).forEach(function (s) {
        if (cur && (cur + ' ' + s).length > 200) { out.push(cur); cur = s; }
        else cur = cur ? cur + ' ' + s : s;
      });
    });
    if (cur) out.push(cur);
    return out.map(function (t) {
      const item = { text: plain(t), say: speakable(t) };
      if (t.indexOf(EN_OPEN) >= 0) item.segs = segments(t);
      return item;
    });
  }

  /* ------------------------- Áudio gravado ------------------------- */
  // Os pacotes (um MP3 por aula) são baixados inteiros uma vez e tocados a
  // partir da memória: assim o avanço para o trecho certo funciona em qualquer
  // servidor, e trocar de slide na mesma aula não baixa nada de novo.
  const blobs = new Map();
  function packUrl(file) {
    if (blobs.has(file)) return blobs.get(file);
    const p = fetch('assets/audio/' + file).then(function (r) { if (!r.ok) throw new Error('audio ' + r.status); return r.blob(); })
      .then(function (b) { return URL.createObjectURL(b); });
    blobs.set(file, p);
    p.catch(function () { blobs.delete(file); });
    if (blobs.size > 8) { const k = blobs.keys().next().value; const old = blobs.get(k); blobs.delete(k); old.then(function (u) { URL.revokeObjectURL(u); }, function () {}); }
    return p;
  }
  /** Toca um trecho gravado: "arquivo.mp3" ou ["pacote.mp3", início, fim]. */
  function playRecorded(entry, rate, my, onPlay, onEnd, onFail) {
    const packed = Array.isArray(entry);
    const file = packed ? entry[0] : entry;
    let ended = false;
    const fail = function () { if (my === token && !ended) { ended = true; onFail(); } };
    const start = function (src) {
      if (my !== token) return;
      const a = new Audio(src);
      audio = a;
      a.preload = 'auto';
      const finish = function () { if (ended || my !== token) return; ended = true; try { a.pause(); } catch (e) { /* ignora */ } onEnd(); };
      let begun = false;
      const go = function () {
        if (begun || my !== token) return; begun = true;
        a.playbackRate = rate;
        const p = a.play();
        if (p && p.catch) p.catch(function (e) { if (my !== token || ended) return; ended = true; if (e && e.name === 'NotAllowedError') emit({ type: 'error', error: 'not-allowed' }); else onFail(); });
      };
      if (packed) {
        const t0 = entry[1], t1 = entry[2];
        const check = function () { if (!ended && my === token && a.currentTime >= t1 - 0.03) finish(); };
        const watch = function () { if (my !== token || ended) return; check(); if (!ended) requestAnimationFrame(watch); };
        a.addEventListener('timeupdate', check);
        a.addEventListener('loadedmetadata', function () {
          try { a.currentTime = t0; } catch (e) { /* ignora */ }
          a.addEventListener('seeked', go, { once: true });
          setTimeout(go, 400);   // alguns navegadores não disparam "seeked" sem mudança
        }, { once: true });
        a.onplaying = function () { if (my === token) { onPlay(); requestAnimationFrame(watch); } };
      } else {
        a.onplaying = function () { if (my === token) onPlay(); };
        a.addEventListener('canplay', go, { once: true });
      }
      a.onended = finish;
      a.onerror = fail;
      a.load();
    };
    if (packed) packUrl(file).then(start, fail);
    else start('assets/audio/' + file);
  }
  /** Chave de uma frase avulsa em inglês no manifest (ouvir diálogos e exercícios). */
  function phraseKey(text) { let h = 5381; const s = speakableEn(text); for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return 'en:' + h.toString(36); }

  /* ------------------------------ Controle ------------------------------ */
  /** Fala um clipe { id, chunks }. onDone só roda se terminar sem interrupção. */
  function speak(clip, onDone) {
    stop(true);
    const my = ++token;
    const items = clip.chunks;
    const v = currentVoice();
    const useAudio = !!(v && v.voiceURI === AUDIO_ID && manifest && manifest.clips[clip.id]);
    const files = useAudio ? manifest.clips[clip.id] : null;
    let i = 0;
    const next = function () {
      if (my !== token) return;
      if (i >= items.length) { emit({ type: 'end' }); if (onDone) onDone(); return; }
      const item = items[i];
      const advance = function () { if (my !== token) return; i++; setTimeout(next, 180); };  // pausa curta, como respiração
      if (files && files[i]) playRecorded(files[i], prefs().rate, my, function () { emit({ type: 'caption', text: item.text }); }, advance, function () { speakSynth(item, my, advance); });
      else speakSynth(item, my, advance);
    };
    emit({ type: 'start' });
    setTimeout(next, 60);  // pequena pausa evita que o Chrome ignore a fala após cancel()
  }
  /** Fala um trecho na voz do navegador (em segmentos quando mistura idiomas). */
  function speakSynth(item, my, advance) {
    if (!supportedSynth) { emit({ type: 'error', error: 'unsupported' }); return; }
    const segs = item.segs && item.segs.length ? item.segs : [{ lang: 'pt', say: item.say }];
    let k = 0, captioned = false;
    const one = function () {
      if (my !== token) return;
      if (k >= segs.length) { advance(); return; }
      const sg = segs[k++];
      const u = utterance(sg.say, sg.lang, prefs().rate);
      u.onstart = function () { if (my === token && !captioned) { captioned = true; emit({ type: 'caption', text: item.text }); } };
      u.onend = function () { if (my !== token) return; if (k < segs.length) setTimeout(one, 90); else one(); };
      u.onerror = function (e) { if (my !== token) return; if (e.error === 'interrupted' || e.error === 'canceled') return; emit({ type: 'error', error: e.error }); if (e.error !== 'not-allowed') one(); };
      synth.speak(u);
    };
    one();
  }
  /** Cria a fala com a voz certa para o idioma. */
  function utterance(text, lang, rate) {
    const u = new SpeechSynthesisUtterance(text);
    if (lang === 'en') {
      const ev = englishVoice();
      if (ev) u.voice = ev;
      u.lang = ev && ev.lang ? ev.lang : 'en-US';
      u.rate = rate * 0.95;
    } else {
      const v = currentVoice();
      if (v && v.voiceURI !== AUDIO_ID) u.voice = v;
      u.lang = v && v.lang ? v.lang : 'pt-BR';
      u.rate = rate * 0.97;   // um pouco mais pausado soa menos mecânico
    }
    u.pitch = 1;
    return u;
  }
  /**
   * Fala uma frase em inglês (botões "ouvir" do diálogo e dos exercícios).
   * Usa o áudio gravado da frase quando existe. opts: { rate, onend, onstart }.
   */
  function sayEn(text, opts) {
    opts = opts || {};
    stop(true);
    const my = ++token;
    const rate = opts.rate || 1;
    const done = function () { if (my === token && opts.onend) opts.onend(); };
    const rec = manifest && manifest.clips[phraseKey(text)];
    const synthIt = function () {
      if (!supportedSynth) { if (opts.onend) opts.onend(); emit({ type: 'error', error: 'unsupported' }); return; }
      const u = utterance(speakableEn(text), 'en', rate);
      u.onstart = function () { if (opts.onstart) opts.onstart(); };
      u.onend = done; u.onerror = function (e) { if (e.error === 'interrupted' || e.error === 'canceled') return; done(); };
      setTimeout(function () { if (my === token) synth.speak(u); }, 40);
    };
    if (rec && rec[0]) playRecorded(rec[0], rate, my, function () { if (opts.onstart) opts.onstart(); }, done, synthIt);
    else synthIt();
    return my;
  }
  function stop(silent) {
    token++;
    if (audio) { try { audio.pause(); } catch (e) { /* ignora */ } audio = null; }
    if (supportedSynth) synth.cancel();
    if (!silent) emit({ type: 'stop' });
  }

  /* ------------------------------- Eventos ------------------------------- */
  function on(fn) { listeners.push(fn); return function () { const i = listeners.indexOf(fn); if (i >= 0) listeners.splice(i, 1); }; }
  function emit(e) { listeners.slice().forEach(function (fn) { try { fn(e); } catch (x) { /* ignora */ } }); }

  if (typeof document !== 'undefined') document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); });

  global.Narrator = {
    AUDIO_ID: AUDIO_ID,
    get supported() { return supportedSynth || !!manifest; },
    get hasRecorded() { return !!manifest; },
    get voices() { return voiceOptions(); },
    get hasEnglish() { return !!(manifest || enVoices.length); },
    prefs: prefs, setPref: setPref, currentVoice: currentVoice, englishVoice: englishVoice, isNatural: isNatural,
    speak: speak, sayEn: sayEn, stop: stop, on: on, speakable: speakable, speakableEn: speakableEn, plain: plain,
    chunk: chunk, segments: segments, phraseKey: phraseKey,
  };
})(typeof window !== 'undefined' ? window : globalThis);
