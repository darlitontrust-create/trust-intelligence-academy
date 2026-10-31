/* =====================================================================
   narrator.js — Narração por voz dos conteúdos
   ---------------------------------------------------------------------
   Dois motores, escolhidos automaticamente:
   1. Voz gravada (neural): se existir assets/audio/manifest.json, toca
      os MP3 gerados por build/gen_audio.py (vozes neurais da Microsoft).
      Soa igual em qualquer aparelho.
   2. Voz do navegador (Web Speech API): fallback. Prioriza vozes
      neurais ("Natural", "Online", Google, "Premium/Aprimorada") e evita
      vozes sintéticas antigas.
   • Cada slide é um "clipe" { id, chunks: [{ text, say }] }:
     text = legenda exibida · say = texto adaptado para a fala.
   • Preferências em state.settings.narration
     (on, rate, voice, auto).
   ===================================================================== */
(function (global) {
  'use strict';

  const synth = global.speechSynthesis;
  const supportedSynth = !!(synth && global.SpeechSynthesisUtterance);
  const AUDIO_ID = '__audio';
  let voices = [];
  let manifest = null;      // { voice, clips: { id: [arquivos] } }
  let audio = null;         // elemento <audio> em uso
  let token = 0;            // invalida falas antigas ao trocar de slide
  const listeners = [];

  /* ------------------------------- Vozes ------------------------------- */
  /** Nota de "naturalidade" da voz (maior = mais humana). */
  function score(v) {
    let s = 0;
    if (/pt[-_]BR/i.test(v.lang)) s += 20;
    if (/natural|neural|online/i.test(v.name)) s += 30;            // Edge: "Francisca Online (Natural)"
    if (/premium|enhanced|aprimorad|siri/i.test(v.name)) s += 25;   // Apple: vozes aprimoradas
    if (/google/i.test(v.name)) s += 15;                            // Chrome: voz de rede do Google
    if (!v.localService) s += 5;
    if (/espeak|desktop|compact/i.test(v.name)) s -= 25;            // vozes sintéticas antigas
    return s;
  }
  function isNatural(v) { return !!v && (score(v) >= 35 || v.voiceURI === AUDIO_ID); }
  function loadVoices() {
    if (!supportedSynth) return;
    voices = synth.getVoices().filter(function (v) { return /^pt/i.test(v.lang); });
    voices.sort(function (a, b) { return score(b) - score(a); });
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

  /* ------------------------- Texto para fala ------------------------- */
  /** Troca símbolos e siglas por palavras que a voz lê bem. */
  function speakable(t) {
    return String(t)
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
      .replace(/_/g, ' ')
      .replace(/\bSQL\b/g, 'ésse quê éle')
      .replace(/\bCTEs\b/g, 'cê tê ês').replace(/\bCTE\b/g, 'cê tê é')
      .replace(/[“”"]/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }
  /** Divide em frases (ponto seguido de espaço e maiúscula). */
  function sentences(text) {
    const out = []; let cur = '';
    const t = String(text);
    for (let i = 0; i < t.length; i++) {
      cur += t[i];
      if (/[.!?]/.test(t[i]) && /\s/.test(t[i + 1] || '') && /[A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9'"]/.test(t[i + 2] || '')) { out.push(cur.trim()); cur = ''; }
    }
    if (cur.trim()) out.push(cur.trim());
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
    return out.map(function (t) { return { text: t, say: speakable(t) }; });
  }

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
      if (files && files[i]) {
        audio = new Audio('assets/audio/' + files[i]);
        audio.playbackRate = prefs().rate;
        audio.onplaying = function () { if (my === token) emit({ type: 'caption', text: item.text }); };
        audio.onended = advance;
        audio.onerror = function () { speakSynth(item, my, advance); };
        const p = audio.play();
        if (p && p.catch) p.catch(function (e) { if (my !== token) return; if (e && e.name === 'NotAllowedError') emit({ type: 'error', error: 'not-allowed' }); else speakSynth(item, my, advance); });
      } else speakSynth(item, my, advance);
    };
    emit({ type: 'start' });
    setTimeout(next, 60);  // pequena pausa evita que o Chrome ignore a fala após cancel()
  }
  function speakSynth(item, my, advance) {
    if (!supportedSynth) { emit({ type: 'error', error: 'unsupported' }); return; }
    const u = new SpeechSynthesisUtterance(item.say);
    const v = currentVoice();
    if (v && v.voiceURI !== AUDIO_ID) u.voice = v;
    u.lang = v && v.lang ? v.lang : 'pt-BR';
    u.rate = prefs().rate * 0.97;   // um pouco mais pausado soa menos mecânico
    u.pitch = 1;
    u.onstart = function () { if (my === token) emit({ type: 'caption', text: item.text }); };
    u.onend = advance;
    u.onerror = function (e) { if (my !== token) return; if (e.error === 'interrupted' || e.error === 'canceled') return; emit({ type: 'error', error: e.error }); if (e.error !== 'not-allowed') advance(); };
    synth.speak(u);
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
    prefs: prefs, setPref: setPref, currentVoice: currentVoice, isNatural: isNatural,
    speak: speak, stop: stop, on: on, speakable: speakable, chunk: chunk,
  };
})(typeof window !== 'undefined' ? window : globalThis);
