import { parseConfig } from '@/tokens/parseConfig';
import type { DesignConfig } from '@/tokens/types';

/** The query parameter inside the hash: `#/review?c=<base64url>`. */
export const CONFIG_PARAM = 'c';

/** Well above any real config; stops a hostile link doing pointless work. */
const MAX_ENCODED_LENGTH = 32_000;

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

function fromBase64Url(encoded: string): Uint8Array {
  const binary = atob(encoded.replaceAll('-', '+').replaceAll('_', '/'));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

export function encodeConfig(config: DesignConfig): string {
  return toBase64Url(new TextEncoder().encode(JSON.stringify(config)));
}

/** Returns null for anything that isn't a complete, valid config. */
export function decodeConfig(encoded: string): DesignConfig | null {
  if (encoded.length === 0 || encoded.length > MAX_ENCODED_LENGTH) return null;
  try {
    const json = new TextDecoder('utf-8', { fatal: true }).decode(fromBase64Url(encoded));
    return parseConfig(JSON.parse(json));
  } catch {
    return null;
  }
}
