# Lumyn

**Words that shift your world** — a mobile-first web app for switch word practice, mood-matched affirmations, and daily rituals.

Built by [Whyteboard](https://whyteboard.com).

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **React Router** for navigation
- **localStorage** for offline persistence (primary cache)
- **Supabase** (optional) for cloud backup + community combo feed
- Golden Dawn design system (Playfair Display + DM Sans)

## Features (v1)

| Feature | Route | Status |
|---|---|---|
| Onboarding (7 screens) | `/onboarding/*` | ✅ |
| Home + Daily Word + Mood Tiles | `/` | ✅ |
| Switch Word Library | `/library` | ✅ |
| Word Detail + Session | `/library/:id`, `/session/:id` | ✅ |
| Mantra Mode (voice + ambient) | `/mantra/:id` | ✅ |
| Mood Check-in (16 colours) | `/mood` | ✅ |
| Combo Builder | `/combo` | ✅ |
| Saved Combos + Share + Sigil | `/combos`, `/share/:id`, `/sigil/:id` | ✅ |
| Community Combo Exchange | `/discover` | ✅ |
| Journal + Synchronicity Log | `/journal` (Practice / Signs tabs) | ✅ |
| Analytics | `/analytics` | ✅ |
| Numerology (Chaldean + Pythagorean, life path) | `/profile/number` | ✅ |
| Moon-phase daily word personalization | Home daily card | ✅ |
| Daily Word Widget (PWA shortcut) | `/widget` | ✅ |
| Settings | `/settings` | ✅ |

## Data

- **541 switch words** (`src/data/switch-words-source.csv`) + 14 canonical mood/numerology entries; 22 source categories mapped to 9 library filters
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

## Supabase Setup (optional cloud backup)

1. Create a project at [supabase.com](https://supabase.com)
2. **Authentication → Providers** — enable **Anonymous** (preferred) and **Email** (fallback). Disable **Confirm email** on Email so silent device sign-up works.
3. Run migrations in **SQL Editor** (in order): `supabase/migrations/00001_lumyn_schema.sql`, then `00002_profile_moods.sql`
4. Copy `.env.example` → `.env` and set `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
5. Restart dev server. In **Settings → Cloud Backup**, tap **Enable**

**Tables:** `profiles` (incl. first_name, last_name, email, avatar_emoji), `saved_combos`, `journal_entries`, `synchronicity_entries`, `saved_words`, `mood_checkins`, `community_combos`, `community_upvotes`

**Sync model:** Offline-first. localStorage is always written; when cloud backup is on, changes debounce-push to Supabase. First enable uploads local data if no remote profile exists.

**Delete data:** Settings → Delete All Data calls `delete_my_data()` RPC when cloud is linked, then wipes local storage.

## Project Layout

```
src/
├── data/           # Switch words, moods, numerology, community combos
├── screens/        # Onboarding, app screens, legal pages
├── context/        # AppContext — global state + cloud sync
├── lib/            # Storage, Supabase, moon phase, sigils, numerology
├── components/     # NavBar, Guards, Toggle, StatusBar
└── layouts/        # App shell with bottom navigation
```

## Design Reference

Built from `Lumyn_prototype.html` and README design handoff (Golden Dawn direction). Open the prototype in a browser for pixel-level reference.

## App Store Compliance (pre-ship checklist)

Mirror fixes from prior Whyteboard submissions:

| Requirement | Lumyn status |
|---|---|
| `ITSAppUsesNonExemptEncryption = NO` in Info.plist | ✅ `ios/Info.plist` template |
| Terms of Use → Apple EULA URL in Settings | ✅ `LEGAL.termsOfUse` in Settings |
| Privacy Policy link | ✅ Settings → `/legal/privacy` + whyteboard.com |
| Delete account / all user data | ✅ Settings → Delete All Data (local + `delete_my_data` RPC) |
| Skip personal info during onboarding | ✅ Skip on splash, intentions, personal number |
| No forced name/email before core app | ✅ No login; profile fields optional |
| User-facing error copy (not raw errors) | ✅ `USER_ERROR_MESSAGE` in `src/lib/errors.ts` |
| `userCancelled` on purchases (no crash) | ✅ `src/lib/purchases.ts` stub for future IAP |
| Paywall 4-item feature list | ✅ `PAYWALL_FEATURES` in `src/data/paywall-features.ts` |
| StoreKit config removed from release scheme | ⚠️ When wrapping iOS — remove `.storekit` from Release scheme |

When adding Capacitor/native shell: copy `ios/Info.plist` keys into the Xcode target. Link EULA in App Store Connect app description too.

## Out of Scope (v1)

- Email/password accounts (anonymous cloud backup only)
- Real push notifications (UI only)
- Native iOS/Android lock screen widgets (web widget at `/widget` + PWA manifest shortcut)

## Repo

[github.com/whyteboard/lumyn](https://github.com/whyteboard/lumyn) (when published)
