/* =====================================================================
   sfx.js — Som de vitória estilo "gol no estádio" (composição original)
   ---------------------------------------------------------------------
   Sintetizado ao vivo com Web Audio API (nenhum arquivo de áudio):
   fanfarra de metais + torcida + buzina de estádio + bateria.
   Três intensidades:
     'goal'      — acerto de exercício (~2,5 s)
     'promotion' — promoção de cargo (~4,5 s)
     'legend'    — promoção final Lenda SQL (~7 s)
   Preferência: state.settings.sound (true/false).
   ===================================================================== */
(function (global) {
  'use strict';

  const AC = global.AudioContext || global.webkitAudioContext;
  let ctx = null, master = null, noiseBuf = null;

  function enabled() {
    const st = global.AppStorage && global.AppStorage.state;
    return !st || st.settings.sound !== false;
  }
  function setEnabled(v) {
    const st = global.AppStorage && global.AppStorage.state;
    if (st) { st.settings.sound = !!v; global.AppStorage.save(); }
  }

  /** Cria o contexto de áudio na primeira vez (precisa de um clique antes). */
  function init() {
    if (!AC) return false;
    if (!ctx) {
      ctx = new AC();
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -16; comp.ratio.value = 6; comp.attack.value = 0.005; comp.release.value = 0.2;
      master = ctx.createGain(); master.gain.value = 0.34;
      master.connect(comp); comp.connect(ctx.destination);
      // ruído rosa aproximado (base da torcida e dos pratos)
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < d.length; i++) {
        const w = Math.random() * 2 - 1;
        b0 = 0.997 * b0 + w * 0.029; b1 = 0.985 * b1 + w * 0.032; b2 = 0.95 * b2 + w * 0.048;
        d[i] = (b0 + b1 + b2 + w * 0.05) * 0.9;
      }
    }
    if (ctx.state === 'suspended') ctx.resume();
    return true;
  }

  const midi = function (m) { return 440 * Math.pow(2, (m - 69) / 12); };

  /* ----------------------------- Instrumentos ----------------------------- */
  /** Nota de metal (trompete/trombone): serras desafinadas + filtro que "abre". */
  function brass(m, t, dur, vel, bright) {
    const out = ctx.createGain(); out.gain.value = 0;
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.Q.value = 2;
    const top = (bright || 3000) * vel;
    f.frequency.setValueAtTime(500, t);
    f.frequency.linearRampToValueAtTime(top, t + 0.05);
    f.frequency.exponentialRampToValueAtTime(Math.max(900, top * 0.6), t + Math.min(dur, 0.4));
    out.gain.setValueAtTime(0, t);
    out.gain.linearRampToValueAtTime(0.3 * vel, t + 0.03);
    out.gain.linearRampToValueAtTime(0.24 * vel, t + 0.12);
    out.gain.setValueAtTime(0.24 * vel, t + dur);
    out.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.18);
    f.connect(out); out.connect(master);
    const lfo = ctx.createOscillator(), lfoG = ctx.createGain();
    lfo.frequency.value = 5.6; lfoG.gain.setValueAtTime(0, t); lfoG.gain.linearRampToValueAtTime(dur > 0.4 ? 6 : 0, t + 0.35);
    lfo.connect(lfoG);
    [-8, 0, 7].forEach(function (cents) {
      const o = ctx.createOscillator(); o.type = 'sawtooth';
      o.frequency.value = midi(m); o.detune.value = cents;
      lfoG.connect(o.detune);
      o.connect(f); o.start(t); o.stop(t + dur + 0.25);
    });
    lfo.start(t); lfo.stop(t + dur + 0.25);
  }
  /** Acorde de metais. */
  function chord(notes, t, dur, vel) { notes.forEach(function (n) { brass(n, t, dur, vel * 0.75, 2400); }); }

  /** Torcida: ruído filtrado que cresce e "ondula". */
  function crowd(t, dur, peak) {
    const src = ctx.createBufferSource(); src.buffer = noiseBuf; src.loop = true;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 0.6;
    const bp2 = ctx.createBiquadFilter(); bp2.type = 'peaking'; bp2.frequency.value = 450; bp2.gain.value = 6;
    const g = ctx.createGain(); g.gain.value = 0;
    const wob = ctx.createOscillator(), wobG = ctx.createGain();
    wob.frequency.value = 0.9; wobG.gain.value = 0.08 * peak; wob.connect(wobG); wobG.connect(g.gain);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.85 * peak, t + Math.min(0.9, dur * 0.3));
    g.gain.setValueAtTime(0.85 * peak, t + dur * 0.6);
    g.gain.linearRampToValueAtTime(0.0001, t + dur);
    src.connect(bp); bp.connect(bp2); bp2.connect(g); g.connect(master);
    src.start(t, Math.random()); src.stop(t + dur + 0.1); wob.start(t); wob.stop(t + dur + 0.1);
  }
  /** Buzina de estádio: três ondas quadradas com leve "subida" no ataque. */
  function horn(t, dur, vel) {
    const g = ctx.createGain(); g.gain.value = 0;
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1300; f.Q.value = 0.8;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.09 * vel, t + 0.04);
    g.gain.setValueAtTime(0.09 * vel, t + dur); g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.12);
    f.connect(g); g.connect(master);
    [392, 494, 587].forEach(function (hz) {
      const o = ctx.createOscillator(); o.type = 'square';
      o.frequency.setValueAtTime(hz * 0.94, t); o.frequency.exponentialRampToValueAtTime(hz, t + 0.08);
      o.connect(f); o.start(t); o.stop(t + dur + 0.15);
    });
  }
  function kick(t, vel) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.18);
    g.gain.setValueAtTime(0.45 * (vel || 1), t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.4);
  }
  function snare(t, vel) {
    const s = ctx.createBufferSource(); s.buffer = noiseBuf;
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1400;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.5 * vel, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
    s.connect(hp); hp.connect(g); g.connect(master); s.start(t, Math.random()); s.stop(t + 0.16);
  }
  function crash(t, vel, len) {
    const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 5500;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.28 * vel, t); g.gain.exponentialRampToValueAtTime(0.0001, t + (len || 1.6));
    s.connect(hp); hp.connect(g); g.connect(master); s.start(t, Math.random()); s.stop(t + (len || 1.6) + 0.1);
  }
  function roll(t, dur, from, to) {
    const n = Math.floor(dur / 0.045);
    for (let i = 0; i < n; i++) snare(t + i * 0.045, from + (to - from) * (i / n));
  }

  /* ------------------------------- Frases ------------------------------- */
  // Fanfarra original em Ré maior (D5 = 74). Cada item: [nota MIDI, início em batidas, duração em batidas]
  const PHRASE = [[74, 0, 0.5], [74, 0.5, 0.5], [81, 1, 1], [78, 2, 0.5], [79, 2.5, 0.5], [81, 3, 0.75], [86, 3.75, 2.25]];
  function phrase(t, beat, shift, vel) {
    PHRASE.forEach(function (n) { brass(n[0] + shift, t + n[1] * beat, n[2] * beat * 0.92, vel, 3400); });
    const land = t + 3.75 * beat;
    chord([62 + shift, 66 + shift, 69 + shift, 74 + shift], land, 2.25 * beat, vel);
    brass(50 + shift, land, 2.25 * beat, vel * 0.9, 900);   // baixo
    kick(t, 0.8); kick(t + 1 * beat, 0.8); kick(land, 1); snare(t + 2 * beat, 0.4); crash(land, vel, 1.8);
    return land + 2.25 * beat;
  }

  /** Toca um nível de comemoração. */
  function play(level) {
    if (!enabled() || !init()) return;
    const t0 = ctx.currentTime + 0.05;
    if (level === 'legend') {
      crowd(t0, 7.2, 1.2);
      roll(t0, 0.9, 0.15, 0.6);
      let t = phrase(t0 + 0.9, 0.2, 0, 1);
      horn(t0 + 1.7, 0.5, 1);
      t = phrase(t - 0.25, 0.2, 2, 1.1);
      horn(t - 0.5, 0.35, 1); horn(t - 0.05, 0.9, 1);
      chord([64, 68, 71, 76, 80], t - 0.1, 1.6, 1.1); brass(52, t - 0.1, 1.6, 1, 900); crash(t - 0.1, 1.2, 2.4); kick(t - 0.1, 1);
    } else if (level === 'promotion') {
      crowd(t0, 4.8, 1);
      roll(t0, 0.6, 0.15, 0.5);
      const t = phrase(t0 + 0.6, 0.2, 0, 1);
      horn(t0 + 1.4, 0.45, 0.9); horn(t - 0.6, 0.7, 0.9);
    } else {
      crowd(t0, 2.8, 0.7);
      phrase(t0, 0.15, 0, 0.85);
      horn(t0 + 0.6, 0.4, 0.7);
    }
  }

  global.Sfx = { play: play, enabled: enabled, setEnabled: setEnabled, get supported() { return !!AC; } };
})(window);
