import { describe, expect, it } from 'vitest';
import { FLOWS, firstStepPath, stepPath } from './steps';

const ids = (mode: 'fresh' | 'restyle') => FLOWS[mode].steps.map((step) => step.id);

describe('flow steps', () => {
  it('gives Start fresh the seven steps A1 to A7', () => {
    expect(ids('fresh')).toEqual([
      'project',
      'this-or-that',
      'colour',
      'typography',
      'details',
      'avoid',
      'review',
    ]);
  });

  it('gives Restyle three steps of its own, then A2 to A7', () => {
    expect(ids('restyle')).toEqual([
      'current',
      'keep',
      'size',
      ...ids('fresh').slice(1),
    ]);
  });

  it('has no duplicate step ids within a flow', () => {
    for (const mode of ['fresh', 'restyle'] as const) {
      expect(new Set(ids(mode)).size).toBe(ids(mode).length);
    }
  });

  it('builds hash-router paths', () => {
    expect(stepPath('fresh', 'colour')).toBe('/fresh/colour');
    expect(firstStepPath('fresh')).toBe('/fresh/project');
    expect(firstStepPath('restyle')).toBe('/restyle/current');
  });
});
