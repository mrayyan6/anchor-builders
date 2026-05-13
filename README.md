# Anchor Associates & Builders — Website

A premium, multi-page React website for **Anchor Associates & Builders** — a C-2 PEC registered construction & contracting firm based in Islamabad.

Built with **Vite + React 18**. All pages, animations, hover states, the cinematic hero, and the context-aware project swiper are wired up and ready.

---

## What's inside

```
anchor-site/
├── package.json
├── vite.config.js
├── index.html
└── src/
    ├── main.jsx          ← entry point
    ├── App.jsx           ← top-level + hash router
    ├── data.js           ← projects, clients, services data
    ├── components.jsx    ← Nav, Footer, Hero, Swiper, etc.
    ├── animations.jsx    ← Cursor, Magnetic, Parallax, Marquee
    ├── pages.jsx         ← 10 page components
    ├── styles.css        ← design system + layouts
    └── animations.css    ← animation styles
```

### Pages included

| Route                         | Page                |
|-------------------------------|---------------------|
| `#/`                          | Home                |
| `#/about`                     | About               |
| `#/services`                  | Services overview   |
| `#/services/:id`              | Service detail (6 services) |
| `#/projects`                  | Projects index + filters |
| `#/projects/:id`              | Project detail (26 projects) |
| `#/clients`                   | Clients overview (16 clients) |
| `#/clients/:id`               | Client detail       |
| `#/contact`                   | Contact form        |

The project-detail page is **context-aware**: links from a category page → "More in this category" swiper. Links from a client page → "More from this client" swiper.

---

## Step-by-step setup (terminal)

### 1. Prerequisites

You need **Node.js 18+** and **npm**. Check with:

```bash
node --version    # should print v18.x or higher
npm --version
```

If you don't have Node, install it from [nodejs.org](https://nodejs.org) or use `nvm`.

### 2. Open the project folder

```bash
cd path/to/anchor-site
```

(If you downloaded a `.zip`, unzip it first.)

### 3. Install dependencies

```bash
npm install
```

This installs `react`, `react-dom`, `vite`, and the React plugin for Vite. Takes ~30 seconds.

### 4. Start the dev server

```bash
npm run dev
```

You'll see:

```
  VITE v5.x  ready in 400 ms
  ➜  Local:   http://localhost:5173/
```

Open **http://localhost:5173** — you'll see the exact same site I built.

### 5. Build for production

When you're ready to deploy:

```bash
npm run build      # creates /dist with optimized static files
npm run preview    # locally previews the production build
```

The `dist/` folder is a static site — deploy it to Vercel, Netlify, Cloudflare Pages, or any static host.

---

## Deployment cheat sheet

**Vercel** (easiest, free)
```bash
npx vercel
```
Follow the prompts. Vercel auto-detects Vite.

**Netlify**
- Drag `dist/` into [app.netlify.com/drop](https://app.netlify.com/drop), or
- Connect the repo and set build command to `npm run build`, publish dir to `dist`.

**Cloudflare Pages**
- Build command: `npm run build`
- Build output: `dist`

---

## Editing the site

### Change content (projects, clients, services)

Open `src/data.js`. Everything is in plain JavaScript objects:

```js
const PROJECTS = [
  { id: 'azri', name: 'PARC AZRI Office & Laboratory', ... },
  // ...
];
```

Add/remove/edit items here and the site updates automatically.

### Swap stock images for real photos

1. Drop your photos in `public/images/` (create the folder).
2. In `src/data.js`, replace the Unsplash URLs in the `IMG` block with `/images/your-photo.jpg`.

### Tweak the colors / typography

Open `src/styles.css`. The design tokens live at the top under `:root { ... }`:

```css
--bg: #f6f4ef;           /* warm off-white */
--ink: #14110d;          /* near-black */
--warm: #b8a888;         /* sand accent */
--warm-deep: #7d6f55;
--serif: 'Cormorant Garamond', serif;
--sans: 'Manrope', sans-serif;
```

Change these and the whole site re-themes.

### Change the hero images

In `src/pages.jsx`, find `HomePage()` and edit the `heroFrames` array — give each frame an `src` (image URL) and `caption`.

---

## Converting to Next.js (optional, later)

If you want SSR/SEO (good for a marketing site), Next.js is a straight port:

1. `npx create-next-app@latest anchor-next` (App Router, JavaScript, no Tailwind, no src/, yes ESLint)
2. Copy `src/components.jsx`, `src/animations.jsx`, `src/pages.jsx`, `src/data.js`, `src/styles.css`, `src/animations.css` into the new project's `app/` folder.
3. Add `'use client'` at the top of `components.jsx`, `animations.jsx`, and `pages.jsx` (they use browser APIs).
4. Replace the hash router with Next.js file routing — each page in `pages.jsx` becomes its own route folder under `app/`.

A good prompt for Claude Code:

> "Convert this Vite + React app to Next.js 14 with the App Router. Keep all components and styling. Replace the hash router in App.jsx with Next.js file-system routing — one route per page in pages.jsx. Each page component goes into app/<route>/page.jsx. Mark client components with 'use client'. Keep data.js as a shared file. Use next/image for the Unsplash photos."

---

## Troubleshooting

**`npm install` fails** — make sure Node is 18 or higher.

**Page is blank / hash routing not working** — make sure you're visiting `http://localhost:5173` (no trailing `#/` needed; the app handles it).

**Images don't load** — the site uses Unsplash CDN URLs by default. If your network blocks them, swap to local images (see "Swap stock images").

**Custom cursor doesn't show** — works only on devices with hover support (desktops/laptops). On mobile it's hidden by design.

---

## Credits

- Design + build: 1:1 prototype reference, Harper Construction-inspired
- Fonts: Cormorant Garamond, Manrope, JetBrains Mono (Google Fonts)
- Stock imagery: Unsplash (replace with your real project photos before going live)

— Built for Abdullah · Anchor Associates & Builders
