/* =====================================================================
   auth.js — Login e cadastro do nome de jornada (Trust Intelligence Academy)
   ---------------------------------------------------------------------
   • Tela de login com "Entrar com Google" em destaque.
   • Login Google REAL via Google Identity Services quando um Client ID
     for configurado em AUTH_CONFIG.googleClientId e o app rodar em um
     domínio autorizado no Google Cloud Console.
   • Sem Client ID (ou com o script do Google bloqueado), o botão cria um
     perfil local identificado pelo e-mail informado — o progresso fica
     salvo neste navegador do mesmo jeito. Nenhuma senha é pedida.
   • Após o primeiro acesso, um modal obrigatório pede nome, sobrenome
     e como a pessoa quer ser chamada.
   ===================================================================== */
(function (global) {
  'use strict';

  /** Configuração do login social. Preencha para ativar o Google de verdade. */
  const AUTH_CONFIG = {
    googleClientId: '', // ex.: '1234567890-abc.apps.googleusercontent.com'
  };

  const { icon, esc, modal, toast } = global.UI;

  /** Decodifica o payload do JWT retornado pelo Google (nome, e-mail, foto). */
  function decodeJwt(token) {
    const part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(decodeURIComponent(escape(atob(part))));
  }

  /** Carrega o script do Google Identity Services (só quando há Client ID). */
  function loadGoogle() {
    return new Promise(function (resolve, reject) {
      if (global.google && global.google.accounts) return resolve();
      const s = document.createElement('script');
      s.src = 'https://accounts.google.com/gsi/client'; s.async = true;
      s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
      setTimeout(function () { reject(new Error('timeout')); }, 6000);
    });
  }

  /* ------------------------------ Tela de login ------------------------------ */
  function renderLogin(root, onLogin) {
    root.innerHTML =
      '<main class="login">' +
        '<section class="login-hero">' +
          '<div class="brand-lg">' + global.UI.logo('lg') + '<span>Trust Intelligence <b>Academy</b></span></div>' +
          '<h1>Do primeiro <code class="rot" id="rot" aria-hidden="true">SELECT</code> à <span class="grad">decisão inteligente</span>.</h1>' +
          '<p class="sr-only">Do primeiro comando à decisão inteligente.</p>' +
          '<p class="lead">Uma academia de dados, BI e inteligência artificial para aprender fazendo: aulas narradas em slides, exercícios com correção automática, carreira gamificada e certificados a cada conquista.</p>' +
          '<ul class="login-facts">' +
            '<li><b>' + global.Tracks.TRACKS.length + '</b><span>trilhas de conhecimento</span></li><li><b>150+</b><span>exercícios práticos</span></li><li><b>43</b><span>aulas narradas</span></li><li><b>13</b><span>certificados por trilha</span></li>' +
          '</ul>' +
          '<div class="login-tracks glass"><p class="eyebrow">Trilhas da academia</p><ul>' +
            global.Tracks.TRACKS.map(function (t) {
              const on = t.status === 'ativo';
              return '<li class="' + (on ? 'on' : '') + '"><span class="lt-ic">' + icon(t.icon) + '</span><span class="lt-name"><b>' + esc(t.nome) + '</b><small>' + esc(t.tag) + '</small></span>' +
                '<span class="lt-pill">' + (on ? 'Disponível' : 'Em breve') + '</span></li>';
            }).join('') +
          '</ul></div>' +
        '</section>' +
        '<section class="login-card glass">' +
          '<h2>Entre na sua jornada</h2>' +
          '<p class="hint-box">' + icon('shield') + '<span>' + (global.Cloud && global.Cloud.enabled() ? 'Entre com Google para salvar sua evolução na nuvem e continuar de qualquer computador ou celular.' : 'Recomendamos utilizar Login Social para salvar sua evolução.') + '</span></p>' +
          '<button class="btn btn-google" id="btn-google">' + icon('google') + 'Entrar com Google</button>' +
          '<div id="gsi-slot"></div>' +
          '<div class="or"><span>ou</span></div>' +
          '<button class="btn btn-ghost" id="btn-guest">Continuar sem login</button>' +
          '<p class="fine">Sem login, o progresso fica salvo só neste navegador. Em Perfil você pode gerar um código de backup para levar a evolução para outro dispositivo.</p>' +
        '</section>' +
      '</main>';

    // palavra do título alterna entre as linguagens das trilhas
    const words = ['SELECT', 'CALCULATE', 'import pandas', 'PROCX', 'prompt', 'x̄ = Σx/n'];
    const rot = root.querySelector('#rot');
    const reduce = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (rot && !reduce) {
      let wi = 0;
      const timer = setInterval(function () {
        if (!document.body.contains(rot)) { clearInterval(timer); return; }
        rot.classList.add('out');
        setTimeout(function () { wi = (wi + 1) % words.length; rot.textContent = words[wi]; rot.classList.remove('out'); }, 260);
      }, 2300);
    }

    root.querySelector('#btn-guest').onclick = function () {
      onLogin({ id: 'guest', profile: { provider: 'guest' } });
    };
    root.querySelector('#btn-google').onclick = function () {
      const C = global.Cloud;
      if (C && C.enabled()) {
        const btn = root.querySelector('#btn-google');
        btn.disabled = true; btn.innerHTML = icon('google') + 'Conectando ao Google…';
        C.signIn().then(function (u) {
          if (!u) return;   // seguiu por redirect; a página volta logada
          onLogin({ id: 'fb:' + u.uid, profile: C.profileFrom(u), cloud: true });
        }).catch(function (e) {
          btn.disabled = false; btn.innerHTML = icon('google') + 'Entrar com Google';
          if (e.message !== 'Login cancelado.') toast(esc(e.message), 'error', 6000);
        });
        return;
      }
      if (AUTH_CONFIG.googleClientId) {
        loadGoogle().then(function () {
          global.google.accounts.id.initialize({
            client_id: AUTH_CONFIG.googleClientId,
            callback: function (resp) {
              const p = decodeJwt(resp.credential);
              onLogin({ id: 'google:' + p.sub, profile: { provider: 'google', email: p.email, picture: p.picture || '', nome: p.given_name || '', sobrenome: p.family_name || '' } });
            },
          });
          global.google.accounts.id.prompt();
        }).catch(function () { localGoogleModal(onLogin, true); });
      } else {
        localGoogleModal(onLogin, false);
      }
    };
  }

  /** Modal do modo local: identifica o perfil pelo e-mail, sem senha. */
  function localGoogleModal(onLogin, failed) {
    const m = modal(
      '<h3>Salvar evolução com sua conta</h3>' +
      '<p class="muted">' + (failed ? 'Não foi possível conectar ao Google neste ambiente. ' : 'O login Google ainda não foi configurado nesta instalação. ') +
      'Informe seu e-mail do Google para criar um perfil local vinculado a ele. Nenhuma senha é solicitada e os dados ficam apenas neste navegador.</p>' +
      '<form id="local-form" class="form" novalidate>' +
        '<label class="field"><span>E-mail</span><input id="local-email" type="email" autocomplete="email" placeholder="voce@gmail.com" required></label>' +
        '<p class="field-err" id="local-err" hidden></p>' +
        '<button class="btn btn-primary" type="submit">Continuar</button>' +
      '</form>');
    m.el.querySelector('#local-form').addEventListener('submit', function (e) {
      e.preventDefault();
      const email = m.el.querySelector('#local-email').value.trim().toLowerCase();
      const err = m.el.querySelector('#local-err');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = 'Digite um e-mail válido, como voce@gmail.com.'; err.hidden = false; return; }
      m.close();
      onLogin({ id: 'local:' + email, profile: { provider: 'local', email: email } });
    });
  }

  /* -------------------- Modal obrigatório de nome da jornada -------------------- */
  function ensureProfile(state, onDone, editing) {
    const p = state.profile;
    if (!editing && p.nome && p.sobrenome && p.apelido) return onDone();
    const m = modal(
      '<div class="onboard-badge">' + icon('sparkle') + '</div>' +
      '<h3>' + (editing ? 'Editar seus dados' : 'Antes de começar') + '</h3>' +
      '<p class="muted">Seu nome completo aparece no certificado. O nome de jornada aparece no dashboard e nas promoções.</p>' +
      '<form id="profile-form" class="form" novalidate>' +
        '<div class="row2">' +
          '<label class="field"><span>Nome</span><input id="pf-nome" autocomplete="given-name" value="' + esc(p.nome) + '" required></label>' +
          '<label class="field"><span>Sobrenome</span><input id="pf-sobrenome" autocomplete="family-name" value="' + esc(p.sobrenome) + '" required></label>' +
        '</div>' +
        '<label class="field"><span>Como você gostaria de ser chamado durante sua jornada?</span><input id="pf-apelido" placeholder="Ex.: Dani, Professor X, Rafa" value="' + esc(p.apelido) + '" required></label>' +
        '<p class="field-err" id="pf-err" hidden></p>' +
        '<button class="btn btn-primary" type="submit">' + (editing ? 'Salvar alterações' : 'Começar a jornada') + '</button>' +
      '</form>', { closable: !!editing });
    m.el.querySelector('#profile-form').addEventListener('submit', function (e) {
      e.preventDefault();
      const nome = m.el.querySelector('#pf-nome').value.trim();
      const sobrenome = m.el.querySelector('#pf-sobrenome').value.trim();
      const apelido = m.el.querySelector('#pf-apelido').value.trim();
      const err = m.el.querySelector('#pf-err');
      if (!nome || !sobrenome || !apelido) { err.textContent = 'Preencha os três campos para continuar.'; err.hidden = false; return; }
      Object.assign(p, { nome: nome, sobrenome: sobrenome, apelido: apelido });
      global.AppStorage.saveNow();
      m.close();
      toast(editing ? 'Dados atualizados.' : 'Bem-vindo(a), ' + esc(apelido) + '! Sua jornada começou.', 'success');
      onDone();
    });
  }

  global.Auth = { AUTH_CONFIG: AUTH_CONFIG, renderLogin: renderLogin, ensureProfile: ensureProfile };
})(window);
