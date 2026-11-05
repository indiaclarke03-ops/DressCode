import { describe, expect, it } from 'vitest';
import { createDefaultConfig } from '@/tokens/defaults';
import {
  createStyle,
  exportStyles,
  findByName,
  mergeImported,
  parseImport,
  readStyles,
  uniqueName,
  upsertStyle,
  writeStyles,
  type StyleStorage,
} from './styleLibrary';

function memoryStorage(initial?: string): StyleStorage & { value: string | null } {
  return {
    value: initial ?? null,
    getItem() {
      return this.value;
    },
    setItem(_key, value) {
      this.value = value;
    },
  };
}

const now = new Date('2026-11-05T10:00:00Z');
const acme = createStyle('Acme brand', createDefaultConfig(), now, 'one');

describe('style library', () => {
  it('saves and restores a style exactly', () => {
    const storage = memoryStorage();
    expect(writeStyles(storage, [acme])).toBe(true);
    expect(readStyles(storage)).toEqual([acme]);
  });

  it('copes with empty, corrupt and partly bad storage', () => {
    expect(readStyles(memoryStorage())).toEqual([]);
    expect(readStyles(memoryStorage('{nope'))).toEqual([]);
    expect(readStyles(memoryStorage(JSON.stringify([acme, { id: 'bad' }, null])))).toEqual([acme]);
  });

  it('reports blocked or full storage instead of throwing', () => {
    const full: StyleStorage = {
      getItem: () => null,
      setItem: () => {
        throw new DOMException('full', 'QuotaExceededError');
      },
    };
    expect(writeStyles(full, [acme])).toBe(false);
  });

  it('reads as empty when storage itself throws', () => {
    const blocked: StyleStorage = {
      getItem: () => {
        throw new DOMException('denied', 'SecurityError');
      },
      setItem: () => undefined,
    };
    expect(readStyles(blocked)).toEqual([]);
  });

  it('finds names regardless of case', () => {
    expect(findByName([acme], ' acme BRAND ')).toBe(acme);
  });

  it('updates in place, and adds new styles first', () => {
    const updated = { ...acme, savedAt: 'later' };
    expect(upsertStyle([acme], updated)).toEqual([updated]);
    const other = createStyle('Other', createDefaultConfig(), now, 'two');
    expect(upsertStyle([acme], other).map((s) => s.id)).toEqual(['two', 'one']);
  });

  it('numbers a name when both are kept', () => {
    const second = createStyle('Acme brand 2', createDefaultConfig(), now, 'two');
    expect(uniqueName([acme], 'Acme brand')).toBe('Acme brand 2');
    expect(uniqueName([acme, second], 'Acme brand')).toBe('Acme brand 3');
  });
});

describe('export and import', () => {
  it('round-trips through a file', () => {
    expect(parseImport(exportStyles([acme]))).toEqual([acme]);
  });

  it('rejects files that are not ours', () => {
    expect(parseImport('not json')).toBeNull();
    expect(parseImport('{"app":"other","styles":[]}')).toBeNull();
    expect(parseImport('{"app":"dress-code","styles":[]}')).toBeNull();
    expect(parseImport('[]')).toBeNull();
  });

  it('validates imported configs', () => {
    const tampered = JSON.parse(exportStyles([acme]));
    tampered.styles[0].config.accent = 'url(//evil)';
    expect(parseImport(JSON.stringify(tampered))).toBeNull();
  });

  it('merges without duplicating the same style', () => {
    const other = createStyle('Other', createDefaultConfig(), now, 'two');
    expect(mergeImported([acme], [acme, other]).map((s) => s.id).sort()).toEqual(['one', 'two']);
  });
});
