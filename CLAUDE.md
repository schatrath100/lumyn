# Lumyn

**Words that shift your world** — a mobile-first web app for switch word practice, mood-matched affirmations, and daily rituals.

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **React Router** for navigation
- **localStorage** for offline persistence (primary cache)
- **Supabase** (optional) for cloud backup + community combo feed
- Golden Dawn design system (Playfair Display + DM Sans)

## Features (v1)

| Feature | Route | Status |
|---|---|---|
| Onboarding (6 screens) | `/onboarding/*` | ✅ |
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

- 20 switch words with categories, reps, guidance
- 8 home mood tiles + 16 colour-grid moods
- Chaldean personal number profiles (1–9, 11, 22)
- All content lives in `src/data/`

## Supabase setup (optional cloud backup)

1. Create a project at [supabase.com](https://supabase.com)
2. **Authentication → Providers → Anonymous** — enable anonymous sign-in
3. Run the migration in **SQL Editor**: `supabase/migrations/00001_lumyn_schema.sql`
4. Copy `.env.example` → `.env` and set `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
5. Restart dev server. In **Settings → Cloud Backup**, tap **Enable**

**Tables:** `profiles`, `saved_combos`, `journal_entries`, `synchronicity_entries`, `saved_words`, `community_combos`, `community_upvotes`

**Sync model:** Offline-first. localStorage is always written; when cloud backup is on, changes debounce-push to Supabase. First enable uploads local data if no remote profile exists.

**Delete data:** Settings → Delete All Data calls `delete_my_data()` RPC when cloud is linked, then wipes local storage.

## Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

## Design Reference

Built from `Lumyn_prototype.html` and README design handoff (Golden Dawn direction). Open the prototype in a browser for pixel-level reference.

## App Store compliance (pre-ship checklist)

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

`github.com/whyteboard/lumyn` (when published)
