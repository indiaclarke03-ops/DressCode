import { useEffect } from 'react';
import { getPairing, type FontPairing, type FontRole } from '@/tokens/fontPairings';

const CSS2_URL = 'https://fonts.googleapis.com/css2';

function familyQuery(family: string, roles: FontRole[]): string {
  const weights = [...new Set(roles.filter((r) => r.family === family).map((r) => r.weight))];
  const sorted = weights.sort((a, b) => a - b).join(';');
  return `family=${family.replaceAll(' ', '+')}:wght@${sorted}`;
}

/** One stylesheet URL with exactly the families and weights a pairing uses. */
export function googleFontsUrl(pairing: FontPairing): string {
  const roles = [pairing.heading, pairing.body, pairing.mono];
  const families = [...new Set(roles.map((role) => role.family))];
  const query = families.map((family) => familyQuery(family, roles)).join('&');
  return `${CSS2_URL}?${query}&display=swap`;
}

function loadPairing(pairing: FontPairing): void {
  const id = `font-pairing-${pairing.id}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = googleFontsUrl(pairing);
  document.head.append(link);
}

/** Loads fonts on demand, so previews render in the real thing. */
export function usePairingFonts(ids: string[]): void {
  const key = ids.join(',');
  useEffect(() => {
    for (const id of key.split(',')) loadPairing(getPairing(id));
  }, [key]);
}
