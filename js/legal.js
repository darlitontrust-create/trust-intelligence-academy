/* =====================================================================
   legal.js — Política de privacidade (LGPD) e canal de contato
   ---------------------------------------------------------------------
   • Legal.openPrivacy(): abre a política num modal (funciona também na
     tela de login, antes de entrar).
   • Legal.CONTACT: e-mail do canal de atendimento ao titular.
   • Links com [data-privacy] em qualquer tela abrem o modal.
   ===================================================================== */
(function (global) {
  'use strict';

  const CONTACT = 'darlitontrust@gmail.com';
  const CONTROLLER = 'Trust Intelligence Academy';
  const UPDATED = '11 de novembro de 2026';

  function mail(subject) { return 'mailto:' + CONTACT + '?subject=' + encodeURIComponent(subject); }

  function policyHtml() {
    const sec = function (t, body) { return '<section><h3>' + t + '</h3>' + body + '</section>'; };
    return '<article class="legal">' +
      '<p class="eyebrow">Privacidade e proteção de dados</p><h2>Política de privacidade</h2>' +
      '<p class="muted sm">Atualizada em ' + UPDATED + '. Responsável pelos dados: <b>' + CONTROLLER + '</b>. Contato: <a href="' + mail('Privacidade - Trust Intelligence Academy') + '">' + CONTACT + '</a>.</p>' +
      '<p>Esta política explica, de forma direta, quais dados a ' + CONTROLLER + ' trata, para quê e como você controla esses dados, conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018, LGPD).</p>' +
      sec('1. Quais dados usamos',
        '<ul>' +
          '<li><b>Conta Google</b> (só se você entrar com Google): nome, e-mail e foto do perfil.</li>' +
          '<li><b>Perfil na plataforma</b>: nome, sobrenome e apelido. Opcionais: foto enviada por você, avatar, bio e hobbies.</li>' +
          '<li><b>Progresso de estudo</b>: exercícios resolvidos, XP, conquistas, provas, certificados e preferências.</li>' +
          '<li><b>Ranking</b>: apelido, avatar escolhido e XP por trilha.</li>' +
        '</ul><p>Não coletamos CPF, endereço, telefone, dados de pagamento ou dados sensíveis. Não usamos ferramentas de análise de comportamento nem publicidade.</p>') +
      sec('2. Para que usamos',
        '<ul><li>Salvar e sincronizar seu progresso entre aparelhos.</li><li>Mostrar seu nome nos certificados e seu apelido no ranking.</li><li>Personalizar a jornada (saudação, avatar, nível e cargo).</li></ul>' +
        '<p>Base legal: execução do serviço que você solicita ao usar a plataforma (art. 7º, V, da LGPD) e, para os campos opcionais do perfil, o seu consentimento (art. 7º, I), que você pode retirar apagando o campo ou a conta.</p>') +
      sec('3. Onde os dados ficam',
        '<ul><li><b>Sem login</b>: somente no armazenamento local (LocalStorage) deste navegador. Nada é enviado para a nuvem.</li>' +
        '<li><b>Com Google</b>: no Google Firebase (Authentication e Cloud Firestore), com cópia neste navegador. Os servidores do Google podem estar fora do Brasil; a transferência segue as garantias contratuais do Google Cloud (art. 33 da LGPD).</li></ul>' +
        '<p>As regras de acesso do banco permitem que cada pessoa leia e grave apenas os próprios dados. No ranking, alunos logados veem apenas apelido, avatar e XP; seu e-mail e sua foto não aparecem para outras pessoas.</p>') +
      sec('4. Compartilhamento',
        '<p>Não vendemos nem compartilhamos seus dados. Os únicos terceiros envolvidos são os provedores técnicos que fazem a plataforma funcionar: Google (login e banco de dados), GitHub Pages (hospedagem) e as redes de conteúdo que entregam fontes e bibliotecas (Google Fonts, cdnjs e jsDelivr), que recebem apenas dados técnicos da conexão, como o endereço IP.</p>') +
      sec('5. Por quanto tempo',
        '<p>Enquanto sua conta existir. Ao excluir a conta, os dados são apagados da nuvem e deste navegador imediatamente. Cópias que você mesmo fez (código de backup, certificados baixados) ficam sob seu controle.</p>') +
      sec('6. Seus direitos',
        '<p>Você pode, a qualquer momento: confirmar e acessar seus dados (em Perfil), corrigi-los (Editar dados), levá-los com você (código de backup), apagar o progresso (Recomeçar do zero) e <b>excluir a conta e todos os dados</b> (Perfil → Privacidade e dados). Para qualquer outro pedido, dúvida ou reclamação, escreva para <a href="' + mail('Direitos do titular - Trust Intelligence Academy') + '">' + CONTACT + '</a>; respondemos em até 15 dias. Você também pode recorrer à Autoridade Nacional de Proteção de Dados (ANPD).</p>') +
      sec('7. Segurança',
        '<p>O acesso usa a autenticação do Google e conexão criptografada (HTTPS). Nenhum sistema é totalmente imune a falhas; se ocorrer um incidente que possa causar risco relevante, avisaremos os afetados e a ANPD, como manda a lei.</p>') +
      sec('8. Certificados',
        '<p>Os certificados são de <b>curso livre</b>, sem reconhecimento do MEC, e atestam a conclusão das atividades na plataforma. A carga horária é estimada. O código impresso identifica o certificado; ele não é uma verificação oficial.</p>') +
      sec('9. Mudanças nesta política',
        '<p>Se a política mudar, a data no topo é atualizada e as mudanças relevantes são avisadas na plataforma.</p>') +
    '</article>';
  }

  function openPrivacy() {
    const m = global.UI.modal('<div class="legal-wrap">' + policyHtml() +
      '<div class="legal-act"><a class="btn btn-ghost sm" href="' + mail('Privacidade - Trust Intelligence Academy') + '">' + global.UI.icon('mail') + 'Falar com a gente</a></div></div>', { wide: true });
    return m;
  }

  /** Bloco "Privacidade e dados" usado no Perfil. */
  function contactLine() {
    return 'Dúvidas ou pedidos sobre seus dados: <a href="' + mail('Privacidade - Trust Intelligence Academy') + '">' + CONTACT + '</a>';
  }

  document.addEventListener('click', function (e) {
    const a = e.target.closest && e.target.closest('[data-privacy]');
    if (a) { e.preventDefault(); openPrivacy(); }
  });

  global.Legal = { CONTACT: CONTACT, openPrivacy: openPrivacy, policyHtml: policyHtml, contactLine: contactLine };
})(window);
