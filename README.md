# Lumyn

**Words that shift your world** — a mobile-first web app for switch word practice, mood-matched affirmations, and daily rituals.

Built by [Whyteboard](https://whyteboard.com).

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **React Router** for navigation
- **localStorage** for offline persistence (primary cache)
- **Supabase** (optional) for cloud backup, community feed, feedback
- **Capacitor** local notifications (native shell ready)
- Golden Dawn design system (Playfair Display + DM Sans)

## Features

| Feature | Route | Status |
|---|---|---|
| Onboarding (8 steps + paywall) | `/onboarding/*`, `/onboarding/paywall` | ✅ |
| Mandatory paywall (3-day trial) | `/onboarding/paywall` | ✅ (web IAP stub) |
| Home + Daily Word + Mood Tiles | `/` | ✅ |
| Switch Word Library (541 words) | `/library` | ✅ |
| Word Detail + Session | `/library/:id`, `/session/:id` | ✅ |
| Mantra Mode (voice + ambient) | `/mantra/:id` | ✅ |
| Mood Check-in (16 colours) | `/mood` | ✅ |
| Combo Builder | `/combo` | ✅ |
| Saved Combos + Share + Sigil | `/combos`, `/share/:id`, `/sigil/:id` | ✅ |
| Publish combo to community | My Combos → ↑ | ✅ |
| Community Combo Exchange | `/discover` | ✅ |
| Journal + Synchronicity Log | `/journal` | ✅ |
| Analytics | `/analytics` | ✅ |
| Numerology (Chaldean + Pythagorean) | `/profile/number` | ✅ |
| Moon-phase daily word | Home daily card | ✅ |
| Practice reminders (off/daily/weekly) | Settings → Practice reminder | ✅ |
| Edit intentions in Settings | Settings → Your intentions | ✅ |
| In-app feedback | Settings → Feedback | ✅ |
| Profile + avatar | `/settings/profile` | ✅ |
| Daily Word Widget (PWA) | `/widget` | ✅ |
| Settings + cloud backup | `/settings` | ✅ |

See **[plot.md](./plot.md)** for the full feature-node map, guards flow, and migration list.

## Data

- **541 switch words** (`src/data/switch-words-source.csv`) + 14 canonical mood/numerology entries
- 8 home mood tiles + 16 colour-grid moods
- Chaldean personal number profiles (1–9, 11, 22)
- All content lives in `src/data/`

Regenerate the TypeScript word list after editing the CSV:

```bash
python3 scripts/generate-switch-words.py
```

## Getting Started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
npm run lint
```

## Web deployment (Vercel)

- **Production:** https://lumyn-rho.vercel.app (Vercel project `lumyn`)
- **Custom domain:** `lumyn.whyteboard.com` — add DNS `A` record → `76.76.21.21` at your registrar (Google Domains for whyteboard.com)
- **SEO / LLM files:** `public/robots.txt`, `public/sitemap.xml`, `public/llms.txt` (served at site root after build)
- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the Vercel project **Environment Variables** for cloud backup in production

```bash
vercel deploy --prod
```

## iOS Simulator (native shell)

Lumyn runs as a real iOS app via **Capacitor** — home-screen icon, native notifications, full-screen (not Safari).

```bash
npm run cap:ios          # build web + sync + launch Simulator
npm run cap:open         # open Xcode workspace
npm run cap:sync         # rebuild web assets into ios/App
```

**First-time setup** (already done if `ios/App` exists):

```bash
npm install
npm run build
npx cap add ios
cd ios/App && pod install
```

**Live reload while coding** (Simulator loads your dev server):

```bash
npm run dev -- --host          # terminal 1
npx cap run ios -l --external  # terminal 2
```

**StoreKit testing:** In Xcode, edit scheme **App → Run → Options → StoreKit Configuration** and select `Products.storekit` for subscription sandbox testing.

## Supabase Setup (optional cloud backup)

1. Create a project at [supabase.com](https://supabase.com)
2. **Authentication → Providers** — enable **Anonymous** (preferred) and **Email** (fallback). Disable **Confirm email** on Email so silent device sign-up works.
3. Run migrations in **SQL Editor** (in order):
   - `00001_lumyn_schema.sql`
   - `00002_profile_moods.sql`
   - `00003_subscription.sql`
   - `00004_community_publish.sql`
   - `00005_feedback_reminders.sql`
4. Copy `.env.example` → `.env` and set `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
5. Restart dev server. In **Settings → Cloud Backup**, tap **Enable**

**Tables:** `profiles`, `saved_combos`, `journal_entries`, `synchronicity_entries`, `saved_words`, `mood_checkins`, `community_combos`, `community_upvotes`, `feedback`

**Sync model:** Offline-first. localStorage is always written; when cloud backup is on, changes debounce-push to Supabase. Device-auth fallback signs in with a per-install email when anonymous auth is disabled.

**Delete data:** Settings → Delete Account calls `delete_my_data()` RPC (includes feedback), then wipes local storage.

### Supabase keepalive (free tier)

GitHub Actions workflow `.github/workflows/supabase-keepalive.yml` pings the database twice weekly. Add repo secret `SUPABASE_SERVICE_ROLE_KEY` (Settings → Secrets → Actions).

## Project Layout

```
src/
├── data/           # Switch words, moods, numerology, paywall, combos
├── screens/        # Onboarding, app, legal
├── context/        # AppContext — global state + cloud sync
├── lib/            # Storage, Supabase, reminders, purchases, sigils
├── components/     # NavBar, Guards, sheets (reminders, feedback, publish)
└── layouts/        # App shell with bottom navigation
supabase/migrations/  # Ordered SQL migrations
.github/workflows/    # Supabase keepalive cron
ios/                  # Info.plist, Products.storekit (IAP template)
```

## Design Reference

Built from `Lumyn_prototype.html` and README design handoff (Golden Dawn direction).

## App Store Compliance (pre-ship checklist)

| Requirement | Lumyn status |
|---|---|
| `ITSAppUsesNonExemptEncryption = NO` in Info.plist | ✅ `ios/Info.plist` |
| Terms of Use → Apple EULA URL in Settings | ✅ |
| Privacy Policy link | ✅ Settings + whyteboard.com |
| Delete account / all user data | ✅ local + `delete_my_data()` RPC |
| Skip personal info during onboarding | ✅ |
| No forced login before core app | ✅ |
| User-facing error copy | ✅ `USER_ERROR_MESSAGE` |
| `userCancelled` on purchases | ✅ `purchases.ts` |
| Paywall 4-item feature list | ✅ `PAYWALL_FEATURES` |
| Real StoreKit on iOS ship | ⚠️ Wire `purchases.ts` to native; use `ios/Products.storekit` for dev |
| StoreKit config removed from Release scheme | ⚠️ When wrapping iOS |

## Out of Scope (current)

- Email/password user accounts
- Server-side web push (VAPID) — reminders use in-app scheduler + Capacitor local notifications
- Native iOS/Android lock screen widgets (web widget at `/widget` + PWA manifest)
- Gratitude journal / affirmation TTS library (SHYNE-style — not yet in Lumyn)

## Repo

[github.com/schatrath100/lumyn](https://github.com/schatrath100/lumyn)
