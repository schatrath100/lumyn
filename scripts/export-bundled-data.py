#!/usr/bin/env python3
"""Regenerate bundled JSON for the native Lumyn iOS app."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    script = ROOT / "scripts" / "generate-switch-words.py"
    subprocess.run([sys.executable, str(script)], check=True, cwd=ROOT)
    print("Bundled data updated in Lumyn/Data/ (other JSON files are edited in place).")


if __name__ == "__main__":
    main()
