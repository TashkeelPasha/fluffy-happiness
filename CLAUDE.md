# aamir-portfolio

Personal portfolio site.

## Stack
- Vite 5 (vanilla JS, ESM)
- GSAP for animation, Lenis for smooth scroll
- Sharp (build-time image processing)
- Deployed on Vercel

## Run / build
```
npm run dev      # local dev server
npm run build    # production build to dist/
npm run preview  # preview built output
```

## Layout
- `src/` — site source
- `public/` — static assets
- `posts/` — content
- `dist/` — build output (gitignored)
- `vercel.json` — deployment config

## Conventions
- ESM only (`"type": "module"`)
- Keep GSAP timelines colocated with the component/section they animate
