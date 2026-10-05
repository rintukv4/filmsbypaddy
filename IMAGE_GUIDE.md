# FilmsByPaddy — Image Size & Resolution Guide

Recommended upload specs for every image slot. All images render with `object-fit: cover`
(the slot fills completely and edges crop), so keep the subject near the center.

## Slot specs

| Slot | Where it shows | Shape on screen | Recommended size | Notes |
|---|---|---|---|---|
| Hero poster | Homepage hero (only while video loads) | Full screen, 16:9 | **1920×1080** | JPG/WebP, under 500KB |
| Project hero image | Work cards, case-study hero | 16:10 desktop, 4:3 mobile | **2400×1500** | Most important images — mobile crops the sides, keep artist centered |
| Artist image | Case study "The Artist" + hover preview | 21:9 strip + portrait card | **2000×1333** (3:2) | Landscape with centered subject works in both |
| Crowd image | Case study "The Crowd" | 16:9 | **1920×1080** | |
| Light image | Case study "The Light" | 16:9 | **1920×1080** | |
| Motion poster | Case study "The Motion" (before video plays) | 21:9 ultrawide | **2100×900** | Also the video's loading frame |
| BTS images (project) | Case study "Behind the Camera" | 4:5 portrait | **1200×1500** | Portrait works best here |
| Festival archive (4 slots) | Festivals page rows + bottom banner | 16:10 and 21:9 | **1920×1200** | |
| BTS site images (6 slots) | Homepage + About "Behind the Frame" | Square + 16:9 mix | **1600×1600** square, or 1920×1080 | Squares are the safest |
| About portrait | About page | 4:5 portrait | **1200×1500** | |
| Instagram tiles (8) | Homepage grid | 1:1 square | **1080×1080** | Native Instagram size — export straight from IG |
| Light-beam strip | Homepage divider band | 21:9 ultrawide | **2100×900** | |
| Showreel poster | Behind showreel before play | 21:9 | **1920×820** | |

## File format & weight rules

- **JPG** (quality 80–85) or **WebP** for all photos — never PNG for photos (too heavy)
- Target **under 800KB** per image; the admin uploader accepts up to 25MB, but heavy files slow the site
- **Videos**: MP4 (H.264), 1920×1080, 30fps — hero loops ~7–15s, showreel any length

## Quick cheat

One safe rule for everything: **1920px on the long edge, JPG quality 82** — every slot will look sharp.

## Where to upload

All slots are editable in the admin Content Studio (`/admin`):
- Project slots (hero, artist, crowd, light, motion poster, BTS 1–2) → **Projects** tab → Edit
- Instagram tiles → **Instagram grid** tab
- Hero poster, showreel poster, light-beam strip, About portrait, BTS (6), Festivals (4) → **Site images** tab
