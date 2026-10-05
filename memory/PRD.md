# FilmsByPaddy — PRD

## Original problem statement
Premium, cinematic, responsive portfolio + lead-generation website for concert photographer/cinematographer brand "FilmsByPaddy". Dark immersive theme (#080808), massive condensed typography, asymmetrical editorial layouts, full-bleed imagery, subtle grain, image reveal animations. Pages: Home, Work, Project Case Studies, Artists, Festivals, Services, About, Contact/Book. Enquiries stored securely in MongoDB. No fabricated content — placeholders clearly marked editable.

## User personas
- Concert organizers, festivals, college fests, artist managers, PR agencies, labels, brand sponsors (hiring intent)
- Fans/artists browsing the portfolio (credibility)

## Architecture
- Frontend: React 19 + Tailwind + framer-motion (masked line reveals, scroll reveals, parallax) + Lenis smooth scroll + react-fast-marquee. Pages split into `src/pages/*`, shared chrome in `src/components/Layout.js`, motion primitives in `src/components/motion.js`, content data in `src/data/site.js`.
- Backend: FastAPI + Motor (async MongoDB). Portfolio seeded to `portfolio` collection on first startup; enquiries in `enquiries` collection (honeypot spam protection, no public read endpoint).
- Design source of truth: `/app/design_guidelines.json` (Bebas Neue display, Inter body, #FF5500 accent, curated Unsplash pool).

## Implemented
- 2026-10-05: Admin "Content Studio" at /admin (JWT auth, single owner account from env, brute-force lockout). Tabs: Projects (add/edit/delete, all fields + image uploads), Instagram grid (thumbnail + post URL per tile), Site images (hero/showreel posters, BTS, festivals, about portrait), Enquiries viewer. Uploads via Emergent object storage, served at /api/files/{path}. Public pages read /api/site-content with static fallbacks.
- 2026-09-26 (V2 redesign): Awwwards-level cinematic editorial overhaul. Full-screen parallax hero with masked line-by-line reveal; asymmetrical overlapping project rows (no cards); slow editorial marquee; showreel player (poster + play/mute/fullscreen, video URL pluggable); cursor-follow image reveal on Artists directory; festivals archive; numbered services list; about with approach/kit/selected events; credits wall; Instagram grid; custom SVG logo mark + favicon; film grain overlay; Lenis; prefers-reduced-motion respected.
- Backend: portfolio served from MongoDB with startup seed, `GET /api/portfolio`, `GET /api/portfolio/{slug}`, `POST /api/enquiries` (validated, honeypot).
- Verified: 6 projects from DB; enquiry form E2E (filled + submitted + success screen); hero/work/project/artists pages at 375/768/1366px.

## Core requirements (static)
- Dark cinematic editorial theme, photography-first, mobile != compressed desktop, fast loading, clear BOOK CTA, SEO meta + OG, analytics-ready.

## Backlog
- P1: Protected admin/content-management UI (add/edit/delete projects, artists, festivals; view enquiries) — architecture ready, UI deferred per user choice
- P1: Real hero video loop + showreel video upload
- P1: Replace placeholder imagery with real project selects
- P2: Email notification on new enquiry (Resend managed integration available)
- P2: Live Instagram feed integration (currently static grid per V1 scope)
- P2: Analytics event wiring (posthog snippet present in index.html)

## Credentials
None — public site, no auth in V1. Enquiries visible only via DB.
