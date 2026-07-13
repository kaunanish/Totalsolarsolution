# Total Solar Solution (TSS) — Landing Page

Marketing website for **Total Solar Solution**, a solar panel, inverter, and solar pump installation business operating across 6 locations in Odisha, India: Kantabanji, Balangir, Bhawanipatna, Titlagarh, Angul, and the corporate office in Badmal.

Live pages:
- `index.html` — main landing page (hero, gallery, PM Surya Ghar teaser, company profile, enquiry form, footer)
- `pm-surya-ghar.html` — dedicated animated explainer for the PM Surya Ghar Yojana government subsidy scheme, with a lead qualification form

## Tech stack

Plain HTML, CSS, and vanilla JavaScript — no build step, no framework, no dependencies. Everything runs directly in the browser.

```
tss-site/
├── index.html
├── pm-surya-ghar.html
├── css/
│   ├── style.css           # shared site-wide styles (navbar, hero, gallery, forms, footer, dark mode)
│   └── pm-suryaghar.css    # styles specific to the animated explainer page
├── js/
│   ├── script.js           # navbar, dark mode, slideshow, reveal animations, enquiry form
│   └── pm-suryaghar.js     # animation phase-cycling + lead form logic
└── images/                 # branch/product photos, logo, illustrations
```

## Features

- Responsive, mobile-first design with a working hamburger nav
- Dark mode toggle (persisted via `localStorage`)
- Auto-playing photo gallery / testimonial slideshow
- Animated SVG explainer showing how solar + inverter + grid net metering works, with 4 auto-cycling steps and manual navigation
- Forms submit via a WhatsApp deep link (`wa.me`) pre-filled with the entered details, with a background email copy sent via [Formsubmit](https://formsubmit.co) as a backup
- Count-up stats, scroll-reveal animations, floating WhatsApp/Call buttons

## Running locally

This is a static site — no build tools required. Don't just double-click `index.html`, though: modern browsers restrict some behavior (localStorage, navigation) on `file://` pages in ways that don't happen on a real server. Serve it locally instead:

```bash
cd "TSS landing page"
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Deployment

Static-host friendly — works as-is on Netlify, GitHub Pages, Vercel, or any basic web host. No environment variables or server-side code needed (yet — see below).

## Known placeholders / open items

- **Logo** (`images/logo.svg`) is a placeholder — swap in the real TSS logo.
- **Facebook link** in the footer currently points to `#` — update once the page exists.
- **Angul branch address** is missing a PIN code.
- **Lead form backend**: currently WhatsApp + Formsubmit email. Planned upgrade to insert directly into a Supabase table.
- **PM Surya Ghar "Learn More" flow**: now a full dedicated page (`pm-surya-ghar.html`) rather than a placeholder link.

## Contact

- WhatsApp / Call: +91 78559 39461
- Email: tssbalangir@gmail.com
