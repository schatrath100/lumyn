const CHALDEAN: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 8, G: 3, H: 5, I: 1,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 7, P: 8, Q: 1, R: 2,
  S: 3, T: 4, U: 6, V: 6, W: 6, X: 5, Y: 1, Z: 7,
};

const PYTHAGOREAN: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
};

function reduceNumber(n: number): number {
  let sum = n;
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = String(sum).split('').reduce((a, b) => a + parseInt(b, 10), 0);
  }
  return sum || 1;
}

export function calcChaldeanNumber(name: string): number {
  let sum = 0;
  for (const char of name.toUpperCase()) {
    if (CHALDEAN[char]) sum += CHALDEAN[char];
  }
  return reduceNumber(sum);
}

export function calcPythagoreanNumber(name: string): number {
  let sum = 0;
  for (const char of name.toUpperCase()) {
    if (PYTHAGOREAN[char]) sum += PYTHAGOREAN[char];
  }
  return reduceNumber(sum);
}

/** Life path from YYYY-MM-DD birth date (Pythagorean). */
export function calcLifePathNumber(birthDate: string): number | null {
  const digits = birthDate.replace(/\D/g, '');
  if (digits.length < 8) return null;
  const sum = digits.split('').reduce((a, b) => a + parseInt(b, 10), 0);
  return reduceNumber(sum);
}

export function calcPersonalNumber(
  name: string,
  system: 'chaldean' | 'pythagorean' = 'chaldean',
): number {
  return system === 'pythagorean' ? calcPythagoreanNumber(name) : calcChaldeanNumber(name);
}

/** Primary resonance number: life path if set, else name number. */
export function getResonanceNumber(
  personalNumber: number | null,
  lifePathNumber: number | null,
): number | null {
  return lifePathNumber ?? personalNumber;
}
