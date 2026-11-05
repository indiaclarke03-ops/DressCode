import { describe, expect, it } from 'vitest';
import { PROJECT_TYPES } from '@/tokens/types';
import { PROJECT_TYPE_GROUPS } from './projectTypes';
import { PROJECT_QUESTIONS } from './projectQuestions';

describe('project questions', () => {
  it.each(PROJECT_TYPES)('%s asks 2 to 4 multiple-choice questions', (type) => {
    const questions = PROJECT_QUESTIONS[type];
    expect(questions.length).toBeGreaterThanOrEqual(2);
    expect(questions.length).toBeLessThanOrEqual(4);
    expect(new Set(questions.map((q) => q.id)).size).toBe(questions.length);
    for (const question of questions) {
      expect(question.options.length).toBeGreaterThanOrEqual(2);
      expect(new Set(question.options.map((o) => o.id)).size).toBe(question.options.length);
      expect(question.options.every((o) => o.id.length > 0)).toBe(true);
    }
  });
});

describe('project type picker', () => {
  it('offers every project type exactly once', () => {
    const ids = PROJECT_TYPE_GROUPS.flatMap((group) => group.options.map((option) => option.id));
    expect([...ids].sort()).toEqual([...PROJECT_TYPES].sort());
  });
});
