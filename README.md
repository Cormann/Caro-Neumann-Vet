# Carolina Neumann MVSc — Veterinary Surgeon Website

Static HTML/CSS/JS website for Carolina Neumann, freelance veterinary surgeon.

## File Structure

```
/
├── index.html        — Home / Landing page
├── services.html     — Surgical services detail
├── references.html   — About, publications, testimonials, affiliations
├── contact.html      — Contact form and GDPR notice
├── style.css         — Shared stylesheet (all pages)
├── main.js           — Shared JavaScript (all pages)
└── README.md         — This file
```

## Deployment

### Netlify (Recommended — drag and drop)

1. Go to [app.netlify.com](https://app.netlify.com) and log in.
2. Click **"Add new site" → "Deploy manually"**.
3. Drag the entire project folder into the upload area.
4. Your site will be live in seconds at a `*.netlify.app` URL.
5. Go to **Site settings → Domain management** to add a custom domain.

### GitHub Pages

1. Push this folder to a GitHub repository.
2. Go to the repo → **Settings → Pages**.
3. Under **Source**, select **Deploy from a branch** → `main` → `/` (root).
4. Your site will be published at `https://<username>.github.io/<repo-name>/`.
5. Add a custom domain under **Settings → Pages → Custom domain**.

### Any Static Host (Vercel, Cloudflare Pages, etc.)

Upload the files as-is — no build step, no dependencies, no configuration needed.

## Custom Domains

- **Primary:** `neumannvet.es` → `www.neumannvet.es` (all canonical URLs and hreflang point here)
- **Secondary:** `endovet.es` → configure as a redirect to `https://www.neumannvet.es` at the DNS/host level

Point your DNS A record to your host's IP, or add a CNAME to the host-provided domain.
For the `endovet.es` redirect, most static hosts (Netlify, Cloudflare Pages) support
domain redirects in their dashboard without any code changes.

## Contact Form

The contact form is **client-side only** — on submission it displays a confirmation
message; no data is sent to a server. To make the form functional, consider connecting
it to one of the following services (free tiers available):

- [Formspree](https://formspree.io) — add `action="https://formspree.io/f/YOUR_ID"` to the `<form>` tag
- [Netlify Forms](https://docs.netlify.com/forms/setup/) — add `netlify` attribute to the `<form>` tag
- [EmailJS](https://www.emailjs.com) — sends email directly from browser JavaScript

## Updating Content

All content is in plain HTML — no CMS or build tool required. Open the relevant
`.html` file in any text editor and update the copy directly.

## Fonts

Fonts are loaded from Google Fonts via CDN. The site requires an internet connection
to load the Cormorant Garamond and DM Sans typefaces. For fully offline use, download
the fonts and update the `@import` in `style.css` to reference local files.
