# Anchor Associates & Builders — Website

A premium, multi-page website for **Anchor Associates & Builders** — a C-2 PEC registered construction & contracting firm based in Islamabad.

Built with **Next.js 14 (App Router) + React 18**. All pages, animations, hover states, the cinematic hero, and the context-aware project swiper are wired up and ready.

---

## What's inside

```
anchor-site/
├── next.config.mjs       ← Next.js config (Unsplash image domain)
├── jsconfig.json
├── package.json
├── app/
│   ├── layout.jsx        ← root layout (fonts, CSS, AppShell)
│   ├── AppShell.jsx      ← Nav, Footer, PageTransition wrapper
│   ├── globals.css       ← imports design system + animation styles
│   ├── not-found.jsx     ← 404 page
│   ├── page.jsx          ← Home
│   ├── about/page.jsx
│   ├── services/
│   │   ├── page.jsx
│   │   └── [id]/page.jsx
│   ├── projects/
│   │   ├── page.jsx
│   │   └── [id]/page.jsx
│   ├── clients/
│   │   ├── page.jsx
│   │   └── [id]/page.jsx
│   └── contact/page.jsx
└── src/
    ├── data.js           ← projects, clients, services, testimonials
    ├── components.jsx    ← Nav, Footer, Hero, Swiper, ImgBox, etc.
    ├── animations.jsx    ← Magnetic, Parallax, VelocityMarquee, PageTransition
    ├── styles.css        ← design system + layouts
    └── animations.css    ← animation styles
```

### Pages

| Route | Page |
|---|---|
| `/` | Home |
| `/about` | About |
| `/services` | Services overview |
| `/services/:id` | Service detail (6 services) |
| `/projects` | Projects index + category filter |
| `/projects/:id` | Project detail (26 projects) |
| `/clients` | Clients overview (16 clients) |
| `/clients/:id` | Client detail |
| `/contact` | Contact form |

The project-detail page is **context-aware**: arriving from a category → "More in this category" swiper. Arriving from a client page → "More from this client" swiper.

---

## Setup

### Prerequisites

**Node.js 18+** and **npm**:

```bash
node --version    # v18.x or higher
npm --version
```

If Node isn't installed, get it at [nodejs.org](https://nodejs.org).

### Install

```bash
cd path/to/anchor-site
npm install
```

### Dev server

```bash
npm run dev
```

Opens at **http://localhost:3000**.

### Production build

```bash
npm run build     # outputs to .next/
npm run start     # serves the production build locally
```

---

## Deployment

**Vercel** (recommended — detects Next.js automatically):
```bash
npx vercel
```

**Netlify / Cloudflare Pages** — connect the repo and set:
- Build command: `npm run build`
- Output directory: `.next`

---

## Editing content

### Projects, clients, services

Everything lives in `src/data.js` as plain JavaScript objects:

```js
const PROJECTS = [
  { id: 'azri', name: 'PARC AZRI Office & Laboratory', ... },
];
```

Edit, add, or remove entries here and the site updates everywhere.

### Swap stock photos for real ones

1. Place photos in `public/images/`.
2. In `src/data.js`, replace Unsplash URLs in the `IMG` block:
   ```js
   archA: '/images/parc-azri.jpg',
   ```

### Colours & typography

Design tokens are at the top of `src/styles.css`:

```css
:root {
  --bg: #f6f4ef;        /* warm off-white */
  --ink: #14110d;       /* near-black */
  --warm: #b8a888;      /* sand accent */
  --warm-deep: #7d6f55;
  --serif: 'Cormorant Garamond', serif;
  --sans: 'Manrope', sans-serif;
}
```

### Hero images & captions

In `app/page.jsx`, edit the `heroFrames` array at the top of `HomePage`:

```js
const heroFrames = [
  { src: 'https://...', caption: 'PROJECT NAME · LOCATION' },
];
```

### Client card hover style

Controlled by `data-hover-style` on `<body>` in `app/AppShell.jsx`. Options: `invert`, `slide`, `lift`, `highlight`, `expand`, `underline`. Currently set to `slide` (black block sweeps in).

---

## Troubleshooting

**Images don't load** — the site uses Unsplash CDN by default. `next/image` proxies them through `/_next/image`. If blocked, swap to local images (see above).

**Nav stays transparent** — by design on the home page and individual project pages; it turns solid after scrolling 60px.

**Animations don't fire** — reveal-on-scroll uses `IntersectionObserver`. Disable browser extensions that block JS if you see static content.

---

## Credits

- Fonts: Cormorant Garamond, Manrope, JetBrains Mono (Google Fonts)
- Stock imagery: Unsplash — replace with real project photos before going live

— Built for Abdullah · Anchor Associates & Builders
