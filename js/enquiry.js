/* Lead form: posts to /api/lead, falls back to a pre-filled WhatsApp message */
(function () {
  const f = document.getElementById('enq'); if (!f) return;
  const st = f.querySelector('.status'), btn = f.querySelector('button[type=submit]');
  const WA = '919574416374';
  const msg = d => 'Hi, I am ' + d.name + ' (' + d.phone + '). I would like to ' + d.intent.toLowerCase() + '.' + (d.message ? ' ' + d.message : '');
  const say = (t, kind, html) => { st.className = 'status ' + (kind || ''); html ? st.innerHTML = t : st.textContent = t; };
  const bad = (el, t) => { el.setAttribute('aria-invalid', 'true'); say(t, 'err'); el.focus(); };
  f.addEventListener('input', e => e.target.removeAttribute && e.target.removeAttribute('aria-invalid'));
  f.addEventListener('submit', async e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(f).entries()); d.name = (d.name || '').trim(); d.phone = (d.phone || '').trim();
    const digits = d.phone.replace(/\D/g, '');
    if (d.name.length < 2) return bad(f.name, 'Please enter your name.');
    if (digits.length < 10 || digits.length > 13) return bad(f.phone, 'Please enter a valid mobile number.');
    btn.disabled = true; btn.textContent = 'Sending...'; say('');
    try {
      const r = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.ok) { f.reset(); say('Thank you. We will call you shortly.', 'ok'); btn.textContent = 'Sent'; setTimeout(() => { btn.disabled = false; btn.textContent = 'Request a call back'; }, 4000); return; }
      throw new Error('fail');
    } catch (_) {
      say('We could not send this automatically. <a class="lnk" href="https://wa.me/' + WA + '?text=' + encodeURIComponent(msg(d)) + '">Continue on WhatsApp &rarr;</a>', 'err', true);
      btn.disabled = false; btn.textContent = 'Request a call back';
    }
  });
})();
