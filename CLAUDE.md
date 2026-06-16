# Lumyn

**Words that shift your world** — a native iOS app for switch word practice, mood-matched affirmations, and daily rituals.

## Tech Stack

- **SwiftUI** + **Swift 5.9** + **XcodeGen** (`project.yml`)
- **StoreKit 2** for subscriptions (3-day trial)
- **UserDefaults** for offline persistence (primary cache)
- **Supabase** (optional, v1.1) for cloud backup, live community feed, feedback
- Golden Dawn design system (system serif/rounded fallbacks; Playfair Display + DM Sans planned)

## Features (v1.0 native)

| Feature | Status |
|---|---|
| Onboarding (8 steps) | ✅ |
| Mandatory paywall (3-day trial) | ✅ StoreKit |
| Home + Daily Word + Mood Tiles | ✅ |
| Switch Word Library (555) | ✅ |
| Word Detail + Session | ✅ |
| Mantra Mode | ✅ |
| Mood Check-in (16 colours) | ✅ |
| Combo Builder + Saved Combos | ✅ |
| Community Combo Exchange (bundled seed data) | ✅ |
| Journal + Synchronicity Log | ✅ |
| Numerology (onboarding) | ✅ |
| Moon-phase daily word | ✅ |
| Reminders (off/daily/weekly) | ✅ |
| Settings + delete all data | ✅ |
| Cloud backup / Supabase sync | 🔜 v1.1 |
| Analytics, Share card, Sigil, Widget | 🔜 v1.1 |

**Feature map:** see `plot.md` (update as native screens land).

## Data

- 541 switch words (`data/switch-words-source.csv` + `scripts/generate-switch-words.py`) + 14 canonical entries
- Bundled JSON in `Lumyn/Data/`
- 8 home mood tiles + 16 colour-grid moods
- Chaldean personal number profiles (1–9, 11, 22)

Regenerate bundled word JSON after editing the CSV:

```bash
python3 scripts/generate-switch-words.py
```

## Development

Requires **Xcode 16+** and **iOS 17+** deployment target.

```bash
# Generate Xcode project (after editing project.yml)
xcodegen generate

# Build for simulator
xcodebuild -scheme Lumyn -destination 'platform=iOS Simulator,name=iPhone 16' build
```

Open `Lumyn.xcodeproj` in Xcode. StoreKit testing uses `Lumyn/Config/Products.storekit` (Debug scheme only).

**Bundle ID:** `com.whyteboard.lumyn`  
**Product IDs:** `com.whyteboard.lumyn.premium.weekly`, `com.whyteboard.lumyn.premium.quarterly`

## Supabase (optional cloud backup — v1.1)

Migrations live in `supabase/migrations/`. Native sync not yet wired; schema preserved from web prototype.

## App Store compliance

| Requirement | Status |
|---|---|
| `ITSAppUsesNonExemptEncryption = NO` | ✅ `Lumyn/Info.plist` |
| Terms of Use → Apple EULA | ✅ Settings + Paywall |
| Privacy Policy | ✅ |
| Delete all user data | ✅ |
| Skip personal info in onboarding | ✅ |
| No forced login | ✅ |
| `userCancelled` on purchases | ✅ StoreKit |
| Paywall 4-item feature list | ✅ |
| Auto-renew legal copy | ✅ Paywall |
| Remove `.storekit` from Release scheme | ⚠️ Before App Store submit |

## Out of Scope (current)

- Email/password accounts
- Web / Capacitor shell (removed)
- Native lock screen widgets
- Gratitude journal / affirmation voice library

## Repo

`github.com/schatrath100/lumyn`
