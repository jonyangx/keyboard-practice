const { loadProgress, saveProgress, unlockNext } = require('../src/progress');

describe('loadProgress', () => {
  beforeEach(() => {
    delete globalThis.localStorage;
  });

  test('returns default progress when no storage', () => {
    globalThis.localStorage = { getItem: () => null };
    const progress = loadProgress();
    expect(progress.unlocked).toBe(1);
    expect(progress.bestAccuracy).toEqual({});
  });

  test('parses stored progress', () => {
    globalThis.localStorage = {
      getItem: () => JSON.stringify({ unlocked: 3, bestAccuracy: { 0: 80 } })
    };
    const progress = loadProgress();
    expect(progress.unlocked).toBe(3);
    expect(progress.bestAccuracy[0]).toBe(80);
  });

  test('handles corrupted data gracefully', () => {
    globalThis.localStorage = { getItem: () => 'invalid json' };
    const progress = loadProgress();
    expect(progress.unlocked).toBe(1);
  });
});

describe('saveProgress', () => {
  beforeEach(() => {
    delete globalThis.localStorage;
  });

  test('saves progress to storage', () => {
    const mockStorage = {};
    globalThis.localStorage = {
      setItem: (key, value) => { mockStorage[key] = value; }
    };
    const progress = { unlocked: 2, bestAccuracy: { 0: 90 } };
    saveProgress(progress);
    expect(JSON.parse(mockStorage['kb-runner-progress'])).toEqual(progress);
  });

  test('handles missing storage gracefully', () => {
    expect(() => saveProgress({})).not.toThrow();
  });
});

describe('unlockNext', () => {
  beforeEach(() => {
    delete globalThis.localStorage;
  });

  test('unlocks next level when accuracy >= 60%', () => {
    const storage = { getItem: jest.fn(() => null), setItem: jest.fn() };
    globalThis.localStorage = storage;
    const result = unlockNext(0, 80);
    expect(result.unlocked).toBe(2);
  });

  test('does not unlock when accuracy < 60%', () => {
    const storage = { getItem: jest.fn(() => JSON.stringify({ unlocked: 1, bestAccuracy: {} })), setItem: jest.fn() };
    globalThis.localStorage = storage;
    const result = unlockNext(0, 50);
    expect(result.unlocked).toBe(1);
  });

  test('updates best accuracy when higher', () => {
    const storage = { getItem: jest.fn(() => JSON.stringify({ unlocked: 1, bestAccuracy: { 0: 70 } })), setItem: jest.fn() };
    globalThis.localStorage = storage;
    const result = unlockNext(0, 85);
    expect(result.bestAccuracy[0]).toBe(85);
  });

  test('keeps best accuracy when new is lower', () => {
    const storage = { getItem: jest.fn(() => JSON.stringify({ unlocked: 1, bestAccuracy: { 0: 90 } })), setItem: jest.fn() };
    globalThis.localStorage = storage;
    const result = unlockNext(0, 75);
    expect(result.bestAccuracy[0]).toBe(90);
  });
});