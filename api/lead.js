/* POST /api/lead : validates an enquiry and forwards it.
   Env vars (Vercel > Settings > Environment Variables):
     RESEND_API_KEY  + LEAD_TO_EMAIL   send the lead by email via Resend
     LEAD_FROM       optional sender, e.g. "Rudra Leads <leads@yourdomain.com>"
     LEAD_WEBHOOK_URL  optional: also POST the lead as JSON (Google Sheets script, Zapier, etc.)
   If neither is configured the endpoint answers 501 and the page falls back to WhatsApp. */
const INTENTS = ['Buy a property', 'Sell a property', 'Rent a property', 'Invest in property', 'Something else'];

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method' });
  const origin = req.headers.origin;
  if (origin && new URL(origin).host !== req.headers.host) return res.status(403).json({ ok: false, error: 'origin' });

  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch { b = {}; } }
  b = b || {};
  if (b.company) return res.status(200).json({ ok: true });            /* honeypot: pretend success */

  const name = String(b.name || '').trim().slice(0, 80);
  const phone = String(b.phone || '').replace(/[^\d+]/g, '');
  const intent = INTENTS.includes(b.intent) ? b.intent : 'Something else';
  const message = String(b.message || '').trim().slice(0, 500);
  const digits = phone.replace(/\D/g, '');
  if (name.length < 2 || digits.length < 10 || digits.length > 13) return res.status(400).json({ ok: false, error: 'invalid' });

  const lead = { name, phone, intent, message, at: new Date().toISOString(), ua: String(req.headers['user-agent'] || '').slice(0, 120) };
  const jobs = [];

  if (process.env.RESEND_API_KEY && process.env.LEAD_TO_EMAIL) {
    jobs.push(fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.LEAD_FROM || 'Rudra Leads <onboarding@resend.dev>',
        to: process.env.LEAD_TO_EMAIL.split(',').map(s => s.trim()),
        subject: 'New enquiry: ' + intent + ' (' + name + ')',
        text: ['Name: ' + name, 'Phone: ' + phone, 'Interested in: ' + intent, 'Message: ' + (message || '-'), 'Received: ' + lead.at].join('\n')
      })
    }).then(r => r.ok));
  }
  if (process.env.LEAD_WEBHOOK_URL) {
    jobs.push(fetch(process.env.LEAD_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead) }).then(r => r.ok));
  }
  if (!jobs.length) return res.status(501).json({ ok: false, error: 'not_configured' });

  const results = await Promise.allSettled(jobs);
  const ok = results.some(r => r.status === 'fulfilled' && r.value === true);
  return res.status(ok ? 200 : 502).json({ ok });
};
