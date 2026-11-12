/* =====================================================================
   theme.js — Alternância entre tema escuro (padrão) e claro
   ---------------------------------------------------------------------
   • A escolha fica em localStorage (trustacademy:theme) e é aplicada no
     <head> antes de a página desenhar (sem "piscar").
   • Theme.button(): botão de alternância (topo da plataforma e login).
   • O tema claro vem de css/theme-light.css (gerado por build/gen_light.py).
   ===================================================================== */
(function (global) {
  'use strict';
  const KEY = 'trustacademy:theme';
  function get() { return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; }
  function set(t) {
    const de = document.documentElement;
    if (t === 'light') de.setAttribute('data-theme', 'light'); else de.removeAttribute('data-theme');
    try { localStorage.setItem(KEY, t); } catch (e) { /* ignora */ }
    const m = document.querySelector('meta[name="theme-color"]'); if (m) m.content = t === 'light' ? '#f4f6fb' : '#06070c';
    const cs = document.querySelector('meta[name="color-scheme"]'); if (cs) cs.content = t;
    document.querySelectorAll('[data-theme-btn]').forEach(paint);
    global.dispatchEvent(new CustomEvent('themechange', { detail: t }));
  }
  function toggle() { set(get() === 'light' ? 'dark' : 'light'); }
  function paint(b) {
    const light = get() === 'light';
    b.innerHTML = global.UI.icon(light ? 'moon' : 'sun');
    b.title = light ? 'Mudar para o tema escuro' : 'Mudar para o tema claro';
    b.setAttribute('aria-label', b.title);
  }
  function button(cls) { return '<button type="button" class="icon-btn ' + (cls || 'sm') + ' theme-btn" data-theme-btn></button>'; }
  function mount(root) { (root || document).querySelectorAll('[data-theme-btn]').forEach(function (b) { paint(b); b.onclick = toggle; }); }
  set(get());
  global.Theme = { get: get, set: set, toggle: toggle, button: button, mount: mount };
})(window);
