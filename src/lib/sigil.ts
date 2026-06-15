import { WORD_COLOR_MAP } from '../data/switch-words';

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** Generate a unique geometric sigil SVG from a combo word sequence. */
export function generateSigilSvg(
  name: string,
  words: string[],
  size = 400,
): string {
  const seed = hashString(words.join('-') + name);
  const cx = size / 2;
  const cy = size / 2;
  const n = Math.max(words.length, 3);
  const primary = WORD_COLOR_MAP[words[0]] ?? '#E8784B';
  const gold = '#F2C44A';

  const rings: string[] = [];
  for (let i = 0; i < n; i++) {
    const r = 60 + i * 28 + (seed % 12);
    const rot = ((seed >> (i * 3)) % 360) + i * (360 / n);
    const dash = 4 + (seed % 6);
    rings.push(
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${primary}" stroke-width="1.5" stroke-opacity="${0.35 + i * 0.1}" stroke-dasharray="${dash} ${dash * 2}" transform="rotate(${rot} ${cx} ${cy})"/>`,
    );
  }

  const spokes: string[] = [];
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const inner = 40;
    const outer = 130 + (seed % 20);
    const x1 = cx + Math.cos(angle) * inner;
    const y1 = cy + Math.sin(angle) * inner;
    const x2 = cx + Math.cos(angle) * outer;
    const y2 = cy + Math.sin(angle) * outer;
    const color = WORD_COLOR_MAP[words[i % words.length]] ?? gold;
    spokes.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2" stroke-linecap="round" opacity="0.85"/>`);
    spokes.push(`<circle cx="${x2}" cy="${y2}" r="5" fill="${color}" opacity="0.9"/>`);
  }

  const glyphs = words.map((w, i) => {
    const angle = (i / words.length) * Math.PI * 2;
    const rx = cx + Math.cos(angle) * 95;
    const ry = cy + Math.sin(angle) * 95;
    return `<text x="${rx}" y="${ry}" text-anchor="middle" dominant-baseline="middle" font-family="Georgia,serif" font-size="11" font-style="italic" fill="${gold}" opacity="0.7">${w.slice(0, 3)}</text>`;
  }).join('');

  const innerPoly = Array.from({ length: n }, (_, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const r = 48 + (seed % 15);
    return `${cx + Math.cos(angle) * r},${cy + Math.sin(angle) * r}`;
  }).join(' ');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1E110A"/>
      <stop offset="100%" stop-color="#0F0905"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="40%">
      <stop offset="0%" stop-color="${primary}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="${primary}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#bg)" rx="24"/>
  <circle cx="${cx}" cy="${cy}" r="160" fill="url(#glow)"/>
  ${rings.join('')}
  <polygon points="${innerPoly}" fill="none" stroke="${gold}" stroke-width="1" stroke-opacity="0.35"/>
  ${spokes.join('')}
  <circle cx="${cx}" cy="${cy}" r="22" fill="${primary}" fill-opacity="0.2" stroke="${gold}" stroke-width="1.5"/>
  ${glyphs}
  <text x="${cx}" y="${size - 36}" text-anchor="middle" font-family="Georgia,serif" font-size="13" fill="${gold}" letter-spacing="3" opacity="0.5">LUMYN</text>
</svg>`;
}

export function downloadSvgAsPng(svg: string, filename: string): void {
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, 0, 0, 800, 800);
      canvas.toBlob((png) => {
        if (!png) return;
        const a = document.createElement('a');
        a.href = URL.createObjectURL(png);
        a.download = filename;
        a.click();
      }, 'image/png');
    }
    URL.revokeObjectURL(url);
  };
  img.src = url;
}

export function downloadSvgFile(svg: string, filename: string): void {
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}
