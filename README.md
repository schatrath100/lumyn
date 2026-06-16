# Lumyn

**Words that shift your world** — a native iOS app for switch word practice, mood-matched affirmations, and daily rituals.

Built by [Whyteboard](https://whyteboard.com).

## Tech Stack

- **SwiftUI** + **Swift 5.9**
- **XcodeGen** for project generation (`project.yml`)
- **StoreKit 2** subscriptions with 3-day free trial
- **UserDefaults** offline-first persistence
- Golden Dawn design system (cream, coral, gold, ink) with adaptive dark mode
- **Playfair Display** + **DM Sans** bundled in `Lumyn/Fonts/`

## Features

| Feature | Status |
|---|---|
| Onboarding (8 steps + paywall) | ✅ |
| Home + Daily Word + Mood Tiles | ✅ |
| Switch Word Library (555 words) | ✅ |
| Word Detail + Session + Mantra | ✅ |
| Mood Check-in (16 colours) | ✅ |
| Combo Builder + Saved Combos | ✅ |
| Community Combo Exchange | ✅ (bundled seed data) |
| Journal + Synchronicity Log | ✅ |
| Practice reminders | ✅ |
| Settings + delete all data | ✅ |
| Cloud backup (Supabase) | 🔜 v1.1 |
| Analytics, Share, Sigil, Widget | 🔜 v1.1 |

See **[plot.md](./plot.md)** for the full feature map.

## Data

- **541 switch words** (`data/switch-words-source.csv`) + 14 canonical mood/numerology entries
- Bundled as JSON in `Lumyn/Data/`

Regenerate after editing the CSV:

```bash
python3 scripts/generate-switch-words.py
```

## Getting Started

1. Install [XcodeGen](https://github.com/yonaskolb/XcodeGen): `brew install xcodegen`
2. Generate the Xcode project:

```bash
xcodegen generate
open Lumyn.xcodeproj
```

3. Select the **Lumyn** scheme and run on an iOS 17+ simulator or device.

### CLI build

```bash
xcodebuild -scheme Lumyn -destination 'platform=iOS Simulator,name=iPhone 16' build
```

### StoreKit testing

The Debug scheme uses `Lumyn/Config/Products.storekit`. Remove it from the Release scheme before App Store submission.

## Project layout

```
Lumyn/
├── project.yml              # XcodeGen config
├── Lumyn.xcodeproj/
├── Lumyn/
│   ├── LumynApp.swift
│   ├── Models/              # AppState, domain types
│   ├── Managers/            # StoreKit, persistence, notifications
│   ├── Views/               # SwiftUI screens
│   ├── Data/                # Bundled JSON content
│   └── Config/              # StoreKit + optional Secrets.plist
├── data/                    # switch-words-source.csv
├── scripts/                 # generate-switch-words.py
└── supabase/                # Cloud schema (v1.1)
```

## App Store

- **Bundle ID:** `com.whyteboard.lumyn`
- **Subscriptions:** weekly + quarterly with 3-day trial
- Privacy policy: https://lumyn.app/privacy

## Repo

`github.com/schatrath100/lumyn`
