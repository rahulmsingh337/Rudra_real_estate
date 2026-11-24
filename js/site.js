/* Renders client-controlled content from js/config.js */
(function () {
  const S = window.SITE || {}, q = s => document.querySelector(s);
  const esc = t => String(t == null ? '' : t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  if (Array.isArray(S.stats) && S.stats.length) {
    const st = q('.stats');
    if (st) st.innerHTML = S.stats.map(x => '<div><b>' + esc(x.value) + '</b><span>' + esc(x.label) + '</span></div>').join('');
  }

  if (S.rera && String(S.rera).trim()) {
    const r = esc(String(S.rera).trim());
    const t = q('.trust');
    if (t) t.insertAdjacentHTML('afterbegin', '<strong class="rera">RERA registration: ' + r + '.</strong> ');
    const lg = q('.legal');
    if (lg) lg.insertAdjacentHTML('afterbegin', '<span>RERA registration: ' + r + '</span>');
  }

  const P = (S.photos || []).filter(p => p && p.src);
  if (P.length >= 3) {
    const sec = document.createElement('section');
    sec.className = 'projects'; sec.id = 'projects'; sec.setAttribute('aria-label', 'Our projects');
    sec.innerHTML = '<div class="wrap"><h2>Properties we have worked on.</h2></div>' +
      '<div class="rail" tabindex="0" role="region" aria-label="Project photos, scroll sideways">' +
      P.map(p => '<figure class="ph"><img src="' + esc(p.src) + '" alt="' + esc(p.alt || p.title || 'Property photo') + '" loading="lazy" decoding="async">' +
        '<figcaption><b>' + esc(p.title || '') + '</b><span>' + esc(p.place || '') + '</span></figcaption></figure>').join('') + '</div>';
    const anchor = q('.rule') || q('.value');
    anchor.parentNode.insertBefore(sec, anchor);
    const panel = q('#panel'), svc = panel && panel.querySelector('a[href="#platform"]');
    if (svc) svc.insertAdjacentHTML('afterend', '<a href="#projects">Projects</a>');
    panel && panel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => document.getElementById('menu').click()));
  }
})();
