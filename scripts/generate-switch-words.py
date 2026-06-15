#!/usr/bin/env python3
"""Generate src/data/switch-words.ts from src/data/switch-words-source.csv."""

from __future__ import annotations

import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "src/data/switch-words-source.csv"
OUT_PATH = ROOT / "src/data/switch-words.ts"

# Map 22 CSV categories → 9 Lumyn library categories + color
CATEGORY_MAP: dict[str, tuple[str, str]] = {
    "Money & Abundance": ("Abundance", "#E8784B"),
    "Love & Relationships": ("Heart", "#E84B7A"),
    "Healing & Health": ("Healing", "#4BE89B"),
    "Protection & Safety": ("Spiritual", "#7A6CF0"),
    "Confidence & Self-Esteem": ("Growth", "#82C84B"),
    "Sleep & Rest": ("Healing", "#4BE89B"),
    "Focus & Productivity": ("Clarity", "#4B9BE8"),
    "Forgiveness & Letting Go": ("Heart", "#E84B7A"),
    "Communication & Expression": ("Clarity", "#4B9BE8"),
    "Luck & Opportunity": ("Abundance", "#E8784B"),
    "Career & Success": ("Growth", "#82C84B"),
    "Spiritual Connection & Meditation": ("Spiritual", "#7A6CF0"),
    "Weight Loss & Body Image": ("Healing", "#4BE89B"),
    "Creativity & Inspiration": ("Joy", "#E8C84B"),
    "Gratitude & Joy": ("Joy", "#E8C84B"),
    "Calm & Anxiety Relief": ("Healing", "#4BE89B"),
    "Family & Children": ("Heart", "#E84B7A"),
    "Travel & Daily Ease": ("Growth", "#82C84B"),
    "Habits & Recovery": ("Growth", "#82C84B"),
    "Crystals as Switchwords": ("Spiritual", "#7A6CF0"),
    "Bach Flower Remedies as Switchwords": ("Healing", "#4BE89B"),
    "Archangels as Switchwords": ("Spiritual", "#7A6CF0"),
}

# Legacy words used by moods, numerology, and seed combos — not all appear in the CSV.
LEGACY_CANONICAL = [
    {
        "word": "FIND",
        "category": "Clarity",
        "color": "#4B9BE8",
        "intention": "Locate & discover",
        "description": "Opens the seeker energy within you. Use when you feel lost, confused, or are searching for answers or objects.",
        "reps": 18,
        "how": "Close your eyes. Hold your question silently, then begin chanting FIND with open curiosity.",
    },
    {
        "word": "CLEAR",
        "category": "Clarity",
        "color": "#4B9BE8",
        "intention": "Remove blocks",
        "description": "Clears energetic blocks, mental fog, and obstacles standing between you and your desires.",
        "reps": 9,
        "how": "Take a full breath before each repetition. On the exhale, feel the fog dissolving completely.",
    },
    {
        "word": "CHANGE",
        "category": "Growth",
        "color": "#82C84B",
        "intention": "Initiate change",
        "description": "Initiates transformation at a deep cellular level. Use when you feel stuck in old patterns.",
        "reps": 18,
        "how": "Say it with conviction. Feel each old pattern dissolving as you speak.",
    },
    {
        "word": "OPEN",
        "category": "Growth",
        "color": "#82C84B",
        "intention": "Open doors",
        "description": "Opens doors, hearts, and possibilities. Works beautifully for new opportunities and fresh beginnings.",
        "reps": 28,
        "how": "Use before important meetings, difficult conversations, or entering any new venture.",
    },
    {
        "word": "ELATE",
        "category": "Joy",
        "color": "#E8C84B",
        "intention": "Raise vibration",
        "description": "Instantly elevates your emotional frequency. Use any time you need a genuine mood shift and cannot afford to stay low.",
        "reps": 18,
        "how": "Let a small smile surface as you chant. Allow joy to become physical — feel it rising in your body.",
    },
    {
        "word": "CRYSTAL",
        "category": "Clarity",
        "color": "#4B9BE8",
        "intention": "Gain clarity",
        "description": "Brings crystal-clear clarity to any confusion or fogginess. Also purifies intentions before any session.",
        "reps": 21,
        "how": "Visualise a clear quartz crystal as you chant. See perfectly through it into clear possibility.",
    },
    {
        "word": "CHARM",
        "category": "Attraction",
        "color": "#E84BB8",
        "intention": "Attract & magnetise",
        "description": "Activates your natural magnetism and charisma. Use before any social interaction or important meeting.",
        "reps": 28,
        "how": "Stand tall, shoulders back. Feel yourself becoming magnetic as each word leaves your lips.",
    },
    {
        "word": "SHIFT",
        "category": "Growth",
        "color": "#82C84B",
        "intention": "Change perspective",
        "description": "Shifts your perception instantly. Use when you need to see a situation from a completely new angle.",
        "reps": 9,
        "how": "Use in a moment of being stuck. Say it three times quickly, then pause and breathe fully.",
    },
    {
        "word": "ALLOW",
        "category": "Heart",
        "color": "#E84B7A",
        "intention": "Release resistance",
        "description": "One of the most powerful words for those who struggle to receive. Gently and persistently dissolves resistance.",
        "reps": 21,
        "how": "Soften your body with each repetition. Notice where you feel tight — consciously release that grip.",
    },
    {
        "word": "WAFT",
        "category": "Spiritual",
        "color": "#7A6CF0",
        "intention": "Elevate & float",
        "description": "Lifts energy upward past obstacles and limitations. Creates a feeling of effortless, natural flow.",
        "reps": 18,
        "how": "Breathe deeply. On each exhale, feel your energy rising like smoke, floating above the noise.",
    },
    {
        "word": "GLORIFY",
        "category": "Joy",
        "color": "#E8C84B",
        "intention": "Enhance & magnify",
        "description": "Magnifies the positive in any situation. Use to enhance and amplify what is already working in your life.",
        "reps": 33,
        "how": "Focus on something you are genuinely grateful for. Let it expand and radiate outward as you chant.",
    },
    {
        "word": "MOVE",
        "category": "Growth",
        "color": "#82C84B",
        "intention": "Unstick & progress",
        "description": "Unsticks stagnant energy and frozen situations. Use when you feel unable to progress or take action.",
        "reps": 18,
        "how": "Gently sway as you chant. Embody movement in your body to activate this word fully.",
    },
    {
        "word": "REACH",
        "category": "Abundance",
        "color": "#E8784B",
        "intention": "Extend boundaries",
        "description": "Extends your reach beyond perceived limitations. Works powerfully for ambitious goal-setting and expansion.",
        "reps": 28,
        "how": "Literally reach your arms wide as you chant. Physically embody expansion — the body knows.",
    },
    {
        "word": "BETWEEN",
        "category": "Spiritual",
        "color": "#7A6CF0",
        "intention": "Access the gap",
        "description": "Accesses the fertile space between worlds where all possibilities exist simultaneously. An advanced practitioner's word.",
        "reps": 21,
        "how": "Use in deep meditation. Enter the silence between thoughts — that space is where this word lives.",
    },
]


def esc(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)


def default_how(reps: int) -> str:
    return (
        f"Repeat {reps}× with steady breath and focused intention. "
        "Let each repetition land fully before you begin the next."
    )


def main() -> None:
    with CSV_PATH.open(newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    if len(rows) != 541:
        raise SystemExit(f"Expected 541 rows, got {len(rows)}")

    unknown = {r["category"] for r in rows} - set(CATEGORY_MAP)
    if unknown:
        raise SystemExit(f"Unmapped categories: {unknown}")

    entries: list[dict] = []
    for idx, row in enumerate(rows, start=1):
        csv_cat = row["category"]
        category, color = CATEGORY_MAP[csv_cat]
        reps = int(row["suggested_repetitions"] or 9)
        entries.append(
            {
                "id": idx,
                "word": row["word"].strip(),
                "category": category,
                "color": color,
                "intention": csv_cat,
                "description": row["description"].strip(),
                "reps": reps,
                "how": default_how(reps),
            }
        )

    legacy_start = len(entries) + 1
    legacy_entries = [
        {"id": legacy_start + i, **item} for i, item in enumerate(LEGACY_CANONICAL)
    ]

    def fmt_word(w: dict) -> str:
        return (
            f"  {{ id: {w['id']}, word: {esc(w['word'])}, category: {esc(w['category'])}, "
            f"intention: {esc(w['intention'])}, description: {esc(w['description'])}, "
            f"reps: {w['reps']}, how: {esc(w['how'])}, color: {esc(w['color'])} }}"
        )

    lines = [
        "import type { SwitchWord } from '../types';",
        "",
        f"/** {len(entries)} words from switch-words-source.csv + {len(legacy_entries)} canonical mood/numerology entries. */",
        "export const SWITCH_WORDS: SwitchWord[] = [",
        *[fmt_word(w) + "," for w in entries],
        "];",
        "",
        "/** Preferred definitions for mood matching and numerology (when CSV has alternate meanings). */",
        "export const CANONICAL_WORDS: SwitchWord[] = [",
        *[fmt_word(w) + "," for w in legacy_entries],
        "];",
        "",
        "export const CATEGORIES = ['All', 'Abundance', 'Spiritual', 'Clarity', 'Heart', 'Healing', 'Growth', 'Joy', 'Attraction'] as const;",
        "",
        "export const WORD_COLOR_MAP = Object.fromEntries(",
        "  [...SWITCH_WORDS, ...CANONICAL_WORDS].map((w) => [w.word, w.color]),",
        ") as Record<string, string>;",
        "",
        "export function getWordByName(name: string): SwitchWord | undefined {",
        "  const upper = name.toUpperCase();",
        "  return (",
        "    CANONICAL_WORDS.find((w) => w.word === upper) ??",
        "    SWITCH_WORDS.find((w) => w.word === upper)",
        "  );",
        "}",
        "",
        "export function getWordById(id: number): SwitchWord | undefined {",
        "  return (",
        "    CANONICAL_WORDS.find((w) => w.id === id) ??",
        "    SWITCH_WORDS.find((w) => w.id === id)",
        "  );",
        "}",
        "",
    ]

    OUT_PATH.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {len(entries)} + {len(legacy_entries)} words to {OUT_PATH}")


if __name__ == "__main__":
    main()
