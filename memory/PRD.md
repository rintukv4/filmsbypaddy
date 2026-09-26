# FilmsByPaddy Product Notes

## Original problem statement
Build a premium, cinematic, responsive portfolio website and lead-generation platform for FilmsByPaddy, a concert photographer and cinematographer brand, with public portfolio routes, scalable content architecture, editable media placeholders, project case studies, services, artist/festival directories, and a functional booking enquiry flow.

## Architecture decisions
- React frontend with React Router for public portfolio routes and responsive layouts.
- FastAPI + MongoDB backend using the configured MONGO_URL and DB_NAME.
- Portfolio content is represented as scalable project data in the API response and mirrored with a frontend fallback for resilience.
- Enquiries are validated by Pydantic and stored privately in MongoDB; no public enquiry listing or admin UI is exposed yet.
- Media is represented with clearly labeled cinematic placeholders until owner media is supplied.

## Implemented
- Cinematic home page with hero, manifesto, selected work, showreel state, credits, BTS, Instagram-style grid, and booking CTAs.
- Work archive with filters, dynamic project pages, artist and festival directories, services page, about page, and responsive contact page.
- Enquiry API with basic validation, honeypot spam field, private database persistence, and success confirmation.
- Branded SEO title, description, Open Graph metadata, responsive mobile navigation, accessible route links, and descriptive test IDs.
- Verified desktop and mobile flows, project routing, showreel interaction, API behavior, and enquiry submission.

## Prioritized backlog
- P0: Replace placeholder media with owner-uploaded photography, BTS assets, and showreel URL.
- P1: Add protected owner admin for projects, artists, festivals, ordering, and enquiry review.
- P1: Add the owner’s real Instagram, email, and WhatsApp links.
- P2: Add privacy-friendly analytics event wiring and richer per-project galleries/video embeds.