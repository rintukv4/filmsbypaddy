# FilmsByPaddy — Architecture & Data Flow

A complete technical map of how the frontend, backend, database and storage connect.

---

## 1. Stack

| Layer | Tech | Where it runs |
|---|---|---|
| Frontend | React 19 (CRA/craco), Tailwind CSS 3, framer-motion 11, Lenis, react-fast-marquee, react-router-dom 7, axios | Port 3000 (supervisor `frontend`) |
| Backend | FastAPI + Motor (async MongoDB driver), PyJWT, bcrypt, requests | Port 8001 (supervisor `backend`) |
| Database | MongoDB (local instance) | `mongodb://localhost:27017` |
| Media | Emergent Object Storage (S3-like, via integration proxy) + static files in `frontend/public/media/` | External service |

**Ingress rule (Kubernetes):** any request path starting with `/api` is routed to the backend (8001). Everything else goes to the React dev server / built frontend (3000). This is why every backend route is prefixed `/api` and why relative media URLs like `/api/files/...` work from the browser without a host.

---

## 2. Directory structure

```
/app
├── backend/
│   ├── server.py            # Entire API: routes, auth, seeding, storage helpers
│   ├── requirements.txt
│   └── .env                 # MONGO_URL, DB_NAME, JWT_SECRET, ADMIN_EMAIL/PASSWORD, EMERGENT_LLM_KEY
├── frontend/
│   ├── public/
│   │   ├── index.html       # SEO meta, OG tags, favicon, PostHog snippet
│   │   ├── favicon.svg      # Logo mark (frame + play triangle)
│   │   └── media/           # Static media shipped with the app:
│   │   │                    #   hero-loop.mp4/.webm, showreel.mp4/.webm, ig-post-*.jpg/webp
│   ├── src/
│   │   ├── index.js         # React root
│   │   ├── index.css        # Fonts (Bebas Neue, Inter), CSS vars, base styles
│   │   ├── App.css          # .font-display, .text-outline, honeypot, marquee mask
│   │   ├── App.js           # Router + Lenis + data bootstrap + SiteContent provider
│   │   ├── data/site.js     # STATIC FALLBACK content (projects, credits, services, IMG pool)
│   │   ├── components/
│   │   │   ├── Layout.js    # Header, Footer, Marquee, buttons, Eyebrow, PlaceholderTag
│   │   │   ├── motion.js    # MaskedLine, Reveal, ImageReveal, ParallaxImage (framer-motion)
│   │   │   ├── ArtistIndex.js  # Giant artist list + cursor-follow image (home + /artists share this)
│   │   │   └── content.js   # SiteContentContext, useSiteContent(), fullUrl()
│   │   └── pages/
│   │       ├── Home.js      # Hero(video) → Manifesto → SelectedWork → Marquee → Artists → Showreel → Credits → BTS → Instagram
│   │       ├── Work.js      # Archive + filters
│   │       ├── ProjectDetail.js  # Case study: hero, The Night, gallery sections, video, BTS, details
│   │       ├── Artists.js / Festivals.js / Services.js / About.js / Contact.js
│   │       └── Admin.js     # /admin — login + Content Studio (projects, IG grid, site images, enquiries)
│   └── .env                 # REACT_APP_BACKEND_URL
└── memory/                  # PRD.md, test_credentials.md
```

---

## 3. Content resolution order (key concept)

Almost everything visual resolves with a **fallback chain**, so the site never breaks if the API is down:

```
Project data:    MongoDB `portfolio` collection  →  src/data/site.js `fallbackProjects`
Site content:    MongoDB `site_content` doc      →  src/data/site.js `IMG` / `instagramPosts`
```

- `App.js` fetches `GET /api/portfolio` and `GET /api/site-content` once on load.
- Projects are passed as props into pages.
- Site content is provided via `SiteContentContext`; pages read it with `useSiteContent().get(key, fallback)` — e.g. `get("bts.1", IMG.bts[1])`.
- Images stored via the admin uploader are saved as relative paths (`/api/files/<path>`); `fullUrl()` prefixes `REACT_APP_BACKEND_URL` so they render cross-origin.

---

## 4. Backend API map (server.py)

### Public
| Method | Route | Purpose |
|---|---|---|
| GET | `/api/` | Health check |
| GET | `/api/portfolio` | All projects, sorted by `sortOrder` |
| GET | `/api/portfolio/{slug}` | One project (404 if missing) |
| GET | `/api/site-content` | `{ instagramPosts, images }` doc |
| POST | `/api/enquiries` | Booking form. Honeypot field silently discards bots. Stores in `enquiries` |
| GET | `/api/files/{path}` | Streams an object-storage file (public; path must start with `filmsbypaddy/`) |

### Auth
| Method | Route | Purpose |
|---|---|---|
| POST | `/api/auth/login` | `{email, password}` → `{token}` (JWT, 7-day, HS256). 5 failures = 15-min lockout per IP+email (`login_attempts` collection) |
| GET | `/api/auth/me` | Validates Bearer token, returns admin user |

### Admin (all require `Authorization: Bearer <token>`, enforced by `get_admin` dependency)
| Method | Route | Purpose |
|---|---|---|
| PUT | `/api/admin/site-content` | Replace the whole site-content doc |
| POST | `/api/admin/portfolio` | Create project (409 on duplicate slug) |
| PUT | `/api/admin/portfolio/{slug}` | Full replace of a project |
| DELETE | `/api/admin/portfolio/{slug}` | Delete |
| GET | `/api/admin/enquiries` | All enquiries, newest first |
| POST | `/api/admin/upload` | Multipart image upload → object storage → returns `{url: "/api/files/<path>"}` |

### Startup sequence (`@app.on_event("startup")`)
1. `init_storage()` — exchanges `EMERGENT_LLM_KEY` for a session `storage_key` at the integration proxy.
2. Create Mongo indexes (`users.email` unique, `login_attempts.identifier`).
3. Seed admin user from `ADMIN_EMAIL`/`ADMIN_PASSWORD` if missing (bcrypt hash).
4. Seed `portfolio` collection from `SEED_PROJECTS` **only if empty**.
5. Seed `site_content` doc from `DEFAULT_SITE_CONTENT` **only if missing**.

> Note: seeds are "only if empty" — after you've edited content in the admin, restarts never overwrite your changes.

---

## 5. MongoDB collections

```
portfolio     { slug, title, artist, event, venue, city, year, services, description,
                heroImage, artistImage, crowdImage, lightImage, motionImage,
                btsImages: [str, str], videoUrl, featured: bool, sortOrder: int }

site_content  { id: "main",
                instagramPosts: [{ url, img }],
                images: { heroPoster, showreelPoster, texture, aboutPortrait,
                          bts: [6 str], festivals: [4 str] } }

enquiries     { id, name, organization, email, phone, event_artist, event_date,
                event_location, coverage: [str], deliverables, budget, website,
                message, created_at (ISO str) }

users         { id, email, password_hash (bcrypt), name, role: "admin", created_at }
login_attempts{ identifier: "<ip>:<email>", count, locked_at }
```

Mongo `_id` is never serialized to the client — every read uses projection `{"_id": 0}`.

---

## 6. Key flows

### 6.1 Public page load
```
Browser → GET / (React app)
React mounts → App.js fires in parallel:
    GET /api/portfolio      ─┐
    GET /api/site-content   ─┴→ FastAPI → MongoDB → JSON
Pages render with DB data; if fetch fails, fallbackProjects / IMG from site.js render instead.
Videos: data/site.js pickVideo() checks canPlayType('avc1') → H.264 MP4 for real browsers,
WebM/VP9 fallback. Hero = autoplay muted loop; Showreel = useInView(0.45) → play() / pause().
```

### 6.2 Booking enquiry
```
/contact form → POST /api/enquiries (with hidden honeypot)
    → pydantic validation → insert into enquiries → {id, status:"received"}
    → React shows THANK YOU screen
Owner reads them at /admin → Enquiries tab → GET /api/admin/enquiries (Bearer)
```

### 6.3 Admin login
```
/admin → POST /api/auth/login {email, password}
    → users lookup → bcrypt.checkpw → JWT {sub, email, exp: 7d}
    → token stored in localStorage ("fbp_admin_token")
Every admin call sends  Authorization: Bearer <token>
    → get_admin dependency: jwt.decode → user must exist with role "admin" → else 401
On /admin mount: GET /api/auth/me validates a stored token; 401 → back to login form.
```

### 6.4 Changing a thumbnail end-to-end (the flow you asked about)
```
/admin → Instagram grid tab → Upload button → <input type=file>
    → POST /api/admin/upload (multipart, Bearer)
        → backend reads bytes → put_object() → Emergent object storage
          (path: filmsbypaddy/uploads/admin/<uuid>.<ext>)
        → returns { url: "/api/files/filmsbypaddy/uploads/admin/<uuid>.jpg" }
    → React sets that url into the tile's img field
    → "Save Instagram grid" → PUT /api/admin/site-content (whole doc) → MongoDB
Public site:
    next load → GET /api/site-content → tile renders <img src="/api/files/...">
    → ingress routes /api/* → backend → GET /api/files/{path}
    → get_object() pulls bytes from storage → streamed with correct Content-Type
```

### 6.5 Editing a project
```
/admin → Projects → Edit → change fields/images → Save
    → PUT /api/admin/portfolio/{slug} (full-document replace) → MongoDB
Public site picks it up on next page load via GET /api/portfolio.
Add project: POST /api/admin/portfolio with a unique slug (slug = URL: /work/<slug>).
Delete: DELETE → removed everywhere immediately (artists/festivals pages derive from projects).
```

---

## 7. Frontend mechanics worth knowing

- **Lenis** (`App.js useLenis`): momentum scrolling via a rAF loop; skipped entirely under `prefers-reduced-motion`. Cleanup cancels rAF and calls `lenis.destroy()`.
- **framer-motion**: `MaskedLine` (overflow-hidden line reveal on load), `Reveal`/`ImageReveal` (whileInView), `ParallaxImage` + hero (`useScroll` + `useTransform`).
- **ArtistIndex**: shared by Home and /artists. Tracks mouse position with `useMotionValue` + `useSpring`; the hovered artist's image is a fixed-position `motion.img` following the cursor (desktop only).
- **Showreel player**: real `<video>` with custom controls — play/pause (click video too), mute, fullscreen (`requestFullscreen` on the frame), seek bar (`onTimeUpdate` → progress %). Autoplay is scroll-triggered (`useInView`) and muted per browser policy.
- **Project pages derive from one source**: Artists page groups `projects` by `artist`; Festivals groups by `event`. Adding a project in admin automatically creates its artist/festival rows.
- **data-testid** attributes on all interactive elements (used by automated screenshot/curl verification).

---

## 8. Environment variables

**backend/.env**
```
MONGO_URL, DB_NAME            # database connection (never hardcode)
JWT_SECRET                    # 64-char hex, signs admin tokens
ADMIN_EMAIL, ADMIN_PASSWORD   # owner login (seeded once at startup)
EMERGENT_LLM_KEY              # authenticates object storage init
```

**frontend/.env**
```
REACT_APP_BACKEND_URL         # e.g. https://<app>.preview.emergentagent.com
```

---

## 9. Preview vs production (important)

- The **preview** URL and a **deployed live site** are separate deployments with **separate databases**.
- The first Deploy copies preview DB content once; later deploys ship code only.
- So: content edits made in preview's /admin do NOT appear on the live site — make live edits on the live site's own /admin.
- Static files in `frontend/public/media/` (videos, IG photos) DO ship with every deploy since they're part of the code.
- Object-storage uploads made in preview point to the preview environment's storage; re-upload on the live site's /admin after deploying.

## 10. Extending it

- **New project field**: add to the dicts in admin ProjectEditor (`TEXT_FIELDS` or an ImageSlot) → it's stored as-is (admin endpoints accept free-form JSON) → read it in the page component.
- **New page**: create `src/pages/X.js`, add a `<Route>` in `App.js`, add a nav entry in `Layout.js` `NAV_LINKS`.
- **New site-image slot**: add a key to `DEFAULT_SITE_CONTENT.images` + an `ImageSlot` in the admin "Site images" tab + read with `get("yourKey", fallback)`.
