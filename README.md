# Rudra Real Estate

Marketing website for Rudra Real Estate, Noida. Static site (HTML, CSS, vanilla JS) with GSAP ScrollTrigger and two scroll-scrubbed WebP image sequences.

## Structure

```
index.html
css/styles.css
js/main.js        frame sequences, header, menu, scroll story
js/dynamics.js    cursor, parallax, magnetic buttons, marquee, scroll effects
assets/images/    logo
assets/sequence/  frames (66) and bridges (54) WebP sequences
vercel.json       caching and security headers
```

## Run locally

```bash
python3 -m http.server 3000
```

Open http://localhost:3000. Use a local server rather than opening the file directly.

## Deploy to Vercel

1. Import this repository at https://vercel.com/new.
2. Framework preset: **Other**. Leave build command and output directory empty (the repo root is served as-is).
3. Deploy. Every push to `main` redeploys automatically.

CLI alternative: `npx vercel --prod`.

## Before launch

- Confirm the stats (10+ years, 500+ deals, 98% satisfaction, 50+ agents) and RERA registration claim.
- Add the production URL and an `og:image` (absolute URL) to the head of `index.html`.
- Replace the abstract frame sequences with Rudra project imagery if available.
