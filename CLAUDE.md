# Lumyn

**Words that shift your world** — a mobile-first web app for switch word practice, mood-matched affirmations, and daily rituals.

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **React Router** for navigation
- **localStorage** for offline persistence (primary cache)
- **Supabase** (optional) for cloud backup, community feed, feedback
- **Capacitor** `@capacitor/local-notifications` for native reminders
- Golden Dawn design system (Playfair Display + DM Sans)

## Features (v1.1)

| Feature | Route | Status |
|---|---|---|
| Onboarding (8 steps) | `/onboarding/*` | ✅ |
| Mandatory paywall (3-day trial) | `/onboarding/paywall` | ✅ (IAP stub on web) |
| Home + Daily Word + Mood Tiles | `/` | ✅ |
| Switch Word Library (541) | `/library` | ✅ |
| Word Detail + Session | `/library/:id`, `/session/:id` | ✅ |
| Mantra Mode | `/mantra/:id` | ✅ |
| Mood Check-in (16 colours) | `/mood` | ✅ |
| Combo Builder | `/combo` | ✅ |
| Saved Combos + Share + Sigil | `/combos`, `/share/:id`, `/sigil/:id` | ✅ |
| Publish combo to community | Saved Combos → ↑ | ✅ |
| Community Combo Exchange | `/discover` | ✅ |
| Journal + Synchronicity Log | `/journal` | ✅ |
| Analytics | `/analytics` | ✅ |
| Numerology | `/profile/number` | ✅ |
| Moon-phase daily word | Home | ✅ |
| Reminders (off/daily/weekly) | Settings sheet | ✅ |
| Edit intentions | Settings sheet | ✅ |
| In-app feedback | Settings sheet | ✅ |
| Profile + avatar | `/settings/profile` | ✅ |
| Daily Word Widget | `/widget` | ✅ |
| Settings + cloud backup | `/settings` | ✅ |

**Feature map:** see `plot.md` for all nodes, guards, and migration order.

## Data

- 541 switch words (CSV + `scripts/generate-switch-words.py`) + 14 canonical entries
- 8 home mood tiles + 16 colour-grid moods
- Chaldean personal number profiles (1–9, 11, 22)
- Content in `src/data/`

## Supabase setup (optional cloud backup)

1. Create a project at [supabase.com](https://supabase.com)
2. **Authentication → Providers** — enable **Anonymous** + **Email**; disable **Confirm email** on Email
3. Run migrations **in order**: `00001` → `00005` in `supabase/migrations/`
4. Copy `.env.example` → `.env` with `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
5. Restart dev server; **Settings → Cloud Backup → Enable**

**Tables:** `profiles`, `saved_combos`, `journal_entries`, `synchronicity_entries`, `saved_words`, `mood_checkins`, `community_combos`, `community_upvotes`, `feedback`

**Auth:** `ensureSupabaseSession()` tries anonymous auth, then per-device email/password (`device-auth.ts`).

**Sync:** Offline-first; debounced push when cloud backup on.

**Delete:** `delete_my_data()` RPC + local wipe.

**Keepalive:** `.github/workflows/supabase-keepalive.yml` + `SUPABASE_SERVICE_ROLE_KEY` GitHub secret.

## Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

## Design Reference

`Lumyn_prototype.html` — Golden Dawn direction.

## App Store compliance (pre-ship checklist)

| Requirement | Lumyn status |
|---|---|
| `ITSAppUsesNonExemptEncryption = NO` | ✅ `ios/Info.plist` |
| Terms of Use → Apple EULA | ✅ Settings |
| Privacy Policy | ✅ |
| Delete account / all user data | ✅ |
| Skip personal info in onboarding | ✅ |
| No forced login | ✅ |
| User-facing errors | ✅ `USER_ERROR_MESSAGE` |
| `userCancelled` on purchases | ✅ `purchases.ts` |
| Paywall 4-item feature list | ✅ `PAYWALL_FEATURES` |
| Native StoreKit on ship | ⚠️ Replace web stub in `purchases.ts` |
| Remove `.storekit` from Release scheme | ⚠️ When wrapping iOS |

## Out of Scope (current)

- Email/password accounts
- Server-side web push (VAPID)
- Native lock screen widgets
- Gratitude journal / affirmation voice library

## Repo

`github.com/schatrath100/lumyn`
