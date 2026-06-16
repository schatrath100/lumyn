#!/usr/bin/env python3
"""Generate Lumyn App Store icon (1024×1024)."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "Lumyn/Resources/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png"

BG = "#FFF8F2"
CORAL = "#E8784B"
GOLD = "#F2C44A"
INK = "#1E110A"
CARD = "#2A1810"


def hex_rgb(hex_color: str) -> tuple[int, int, int]:
    h = hex_color.lstrip("#")
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))


def main() -> None:
    size = 1024
    img = Image.new("RGB", (size, size), hex_rgb(BG))
    draw = ImageDraw.Draw(img)

    # Soft warm glow
    for radius, color, alpha in [
        (470, CORAL, 0.18),
        (380, GOLD, 0.22),
        (300, CORAL, 0.35),
    ]:
        layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        layer_draw = ImageDraw.Draw(layer)
        r, g, b = hex_rgb(color)
        bbox = [
            size // 2 - radius,
            size // 2 - radius,
            size // 2 + radius,
            size // 2 + radius,
        ]
        layer_draw.ellipse(bbox, fill=(r, g, b, int(255 * alpha)))
        img = Image.alpha_composite(img.convert("RGBA"), layer).convert("RGB")
        draw = ImageDraw.Draw(img)

    # Inner card circle
    inset = 220
    draw.ellipse(
        [inset, inset, size - inset, size - inset],
        fill=hex_rgb(CARD),
    )

    # Gold ring
    draw.ellipse(
        [inset + 18, inset + 18, size - inset - 18, size - inset - 18],
        outline=hex_rgb(GOLD),
        width=10,
    )

    # Four-point star (Golden Dawn motif)
    cx, cy = size // 2, size // 2
    points = []
    for i in range(8):
        angle = i * 45 - 90
        import math

        rad = math.radians(angle)
        dist = 120 if i % 2 == 0 else 46
        points.append((cx + dist * math.cos(rad), cy + dist * math.sin(rad)))
    draw.polygon(points, fill=hex_rgb(GOLD))

    # Center coral dot
    draw.ellipse([cx - 28, cy - 28, cx + 28, cy + 28], fill=hex_rgb(CORAL))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    img.save(OUT, "PNG")
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
