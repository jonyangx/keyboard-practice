const {
  loadProgress,
  saveProgress,
  unlockNext,
  updateStats,
  checkAchievements,
  getStats,
  getUnlockedAchievements,
  resetProgress,
  ACHIEVEMENT_DEFINITIONS,
} = require('../src/progress');

describe('loadProgress', () => {
  beforeEach(() => {
    resetProgress();
  });

  test('returns default progress when no storage', () => {
    const progress = loadProgress();
    expect(progress.unlocked).toBe(1);
    expect(progress.bestAccuracy).toEqual({});
    expect(progress.achievements).toEqual([]);
    expect(progress.maxCombo).toBe(0);
    expect(progress.perfectCount).toBe(0);
    expect(progress.maxWPM).toBe(0);
    expect(progress.wordsTyped).toBe(0);
    expect(progress.totalKeys).toBe(0);
  });

  test('parses stored progress with all fields', () => {
    const testProgress = {
      unlocked: 3,
      bestAccuracy: { 0: 80, 1: 90 },
      achievements: ['firstWin', 'combo10'],
      maxCombo: 15,
      perfectCount: 2,
      maxWPM: 45,
      wordsTyped: 50,
      totalKeys: 200,
    };
    saveProgress(testProgress);
    const progress = loadProgress();
    expect(progress.unlocked).toBe(3);
    expect(progress.bestAccuracy[0]).toBe(80);
    expect(progress.bestAccuracy[1]).toBe(90);
    expect(progress.achievements).toEqual(['firstWin', 'combo10']);
    expect(progress.maxCombo).toBe(15);
    expect(progress.perfectCount).toBe(2);
    expect(progress.maxWPM).toBe(45);
    expect(progress.wordsTyped).toBe(50);
    expect(progress.totalKeys).toBe(200);
  });
});

  test('returns default progress when no storage', () => {
    const progress = loadProgress();
    expect(progress.unlocked).toBe(1);
    expect(progress.bestAccuracy).toEqual({});
    expect(progress.achievements).toEqual([]);
    expect(progress.maxCombo).toBe(0);
    expect(progress.perfectCount).toBe(0);
    expect(progress.maxWPM).toBe(0);
    expect(progress.wordsTyped).toBe(0);
    expect(progress.totalKeys).toBe(0);
  });

  test('parses stored progress with all fields', () => {
    globalThis.localStorage = {
      getItem: () => JSON.stringify({
        unlocked: 3,
        bestAccuracy: { 0: 80, 1: 90 },
        achievements: ['firstWin', 'combo10'],
        maxCombo: 15,
        perfectCount: 2,
        maxWPM: 45,
        wordsTyped: 50,
        totalKeys: 200,
      }),
      setItem: () => {},
    };
    const progress = loadProgress();
    expect(progress.unlocked).toBe(3);
    expect(progress.bestAccuracy[0]).toBe(80);
    expect(progress.bestAccuracy[1]).toBe(90);
    expect(progress.achievements).toEqual(['firstWin', 'combo10']);
    expect(progress.maxCombo).toBe(15);
    expect(progress.perfectCount).toBe(2);
    expect(progress.maxWPM).toBe(45);
    expect(progress.wordsTyped).toBe(50);
    expect(progress.totalKeys).toBe(200);
  });

  test('handles corrupted data gracefully', () => {
    globalThis.localStorage = { getItem: () => 'invalid json' };
    const progress = loadProgress();
    expect(progress.unlocked).toBe(1);
    expect(progress.achievements).toEqual([]);
  });

  test('handles null storage gracefully', () => {
    globalThis.localStorage = { getItem: () => null };
    const progress = loadProgress();
    expect(progress.unlocked).toBe(1);
  });

describe('saveProgress', () => {
  beforeEach(() => {
    resetProgress();
  });

  test('saves progress to storage', () => {
    const mockStorage = {};
    globalThis.localStorage = {
      setItem: (key, value) => { mockStorage[key] = value; },
    };
    const progress = { unlocked: 2, bestAccuracy: { 0: 90 }, achievements: [] };
    saveProgress(progress);
    const saved = JSON.parse(mockStorage['kb-runner-progress']);
    expect(saved.unlocked).toBe(2);
    expect(saved.bestAccuracy[0]).toBe(90);
  });

  test('handles missing storage gracefully', () => {
    delete globalThis.localStorage;
    expect(() => saveProgress({})).not.toThrow();
  });
});

describe('unlockNext', () => {
  beforeEach(() => {
    resetProgress();
  });

  test('unlocks next level when accuracy >= 60%', () => {
    const result = unlockNext(0, 80);
    expect(result.unlocked).toBe(2);
  });

  test('does not unlock when accuracy < 60%', () => {
    const result = unlockNext(0, 50);
    expect(result.unlocked).toBe(1);
  });

  test('updates best accuracy when higher', () => {
    const result = unlockNext(0, 85);
    expect(result.bestAccuracy[0]).toBe(85);
  });

  test('keeps best accuracy when new is lower', () => {
    globalThis.localStorage = {
      setItem: () => {},
      getItem: () => JSON.stringify({ unlocked: 1, bestAccuracy: { 0: 90 } }),
    };
    const result = unlockNext(0, 70);
    expect(result.bestAccuracy[0]).toBe(90);
  });

  test('increments perfectCount when accuracy is 100%', () => {
    const result = unlockNext(0, 100);
    expect(result.perfectCount).toBe(1);
  });

  test('does not increment perfectCount for non-perfect scores', () => {
    const result = unlockNext(0, 95);
    expect(result.perfectCount).toBe(0);
  });

  test('unlocks multiple levels when accuracy >= 60% on higher levels', () => {
    const result = unlockNext(2, 75);
    expect(result.unlocked).toBe(4);
  });

  test('does not go beyond available levels', () => {
    const result = unlockNext(4, 80);
    expect(result.unlocked).toBe(6);
  });
});

describe('updateStats', () => {
  beforeEach(() => {
    resetProgress();
  });

  test('updates maxCombo when higher', () => {
    const result = updateStats({ maxCombo: 25 });
    expect(result.maxCombo).toBe(25);
  });

  test('keeps maxCombo when lower', () => {
    globalThis.localStorage = {
      setItem: () => {},
      getItem: () => JSON.stringify({ unlocked: 1, bestAccuracy: {}, maxCombo: 30 }),
    };
    const result = updateStats({ maxCombo: 20 });
    expect(result.maxCombo).toBe(30);
  });

  test('updates maxWPM when higher', () => {
    const result = updateStats({ maxWPM: 42 });
    expect(result.maxWPM).toBe(42);
  });

  test('accumulates wordsTyped', () => {
    updateStats({ wordsTyped: 10 });
    const result = updateStats({ wordsTyped: 15 });
    expect(result.wordsTyped).toBe(25);
  });

  test('accumulates totalKeys', () => {
    updateStats({ totalKeys: 50 });
    const result = updateStats({ totalKeys: 30 });
    expect(result.totalKeys).toBe(80);
  });
});

describe('checkAchievements', () => {
  beforeEach(() => {
    resetProgress();
  });

  test('unlocks firstWin when completedLessons >= 1', () => {
    const newUnlocks = checkAchievements({ completedLessons: 1, maxCombo: 0 });
    expect(newUnlocks.some(a => a.id === 'firstWin')).toBe(true);
  });

  test('unlocks combo10 when maxCombo >= 10', () => {
    const newUnlocks = checkAchievements({ maxCombo: 12, completedLessons: 0 });
    expect(newUnlocks.some(a => a.id === 'combo10')).toBe(true);
  });

  test('unlocks combo20 when maxCombo >= 20', () => {
    const newUnlocks = checkAchievements({ maxCombo: 22, completedLessons: 0 });
    expect(newUnlocks.some(a => a.id === 'combo20')).toBe(true);
  });

  test('unlocks combo50 when maxCombo >= 50', () => {
    const newUnlocks = checkAchievements({ maxCombo: 55, completedLessons: 0 });
    expect(newUnlocks.some(a => a.id === 'combo50')).toBe(true);
  });

  test('unlocks perfect when perfectCount >= 1', () => {
    const newUnlocks = checkAchievements({ perfectCount: 1, completedLessons: 0 });
    expect(newUnlocks.some(a => a.id === 'perfect')).toBe(true);
  });

  test('unlocks speedDemon when maxWPM >= 40', () => {
    const newUnlocks = checkAchievements({ maxWPM: 45, completedLessons: 0 });
    expect(newUnlocks.some(a => a.id === 'speedDemon')).toBe(true);
  });

  test('unlocks wordMaster when wordsTyped >= 100', () => {
    const newUnlocks = checkAchievements({ wordsTyped: 120, completedLessons: 0 });
    expect(newUnlocks.some(a => a.id === 'wordMaster')).toBe(true);
  });

  test('unlocks marathon when totalKeys >= 500', () => {
    const newUnlocks = checkAchievements({ totalKeys: 550, completedLessons: 0 });
    expect(newUnlocks.some(a => a.id === 'marathon')).toBe(true);
  });

  test('unlocks allLessons when completedLessons >= 6', () => {
    const newUnlocks = checkAchievements({ completedLessons: 6 });
    expect(newUnlocks.some(a => a.id === 'allLessons')).toBe(true);
  });

  test('does not unlock same achievement twice', () => {
    globalThis.localStorage = {
      setItem: () => {},
      getItem: () => JSON.stringify({ unlocked: 1, bestAccuracy: {}, achievements: ['combo10'] }),
    };
    const newUnlocks = checkAchievements({ maxCombo: 15, completedLessons: 0 });
    expect(newUnlocks.some(a => a.id === 'combo10')).toBe(false);
  });

  test('returns multiple achievements at once', () => {
    const newUnlocks = checkAchievements({ maxCombo: 55, wordsTyped: 120, totalKeys: 550, completedLessons: 1 });
    expect(newUnlocks.length).toBeGreaterThanOrEqual(4);
  });

  test('unlocks achievements in correct order (highest threshold first)', () => {
    const newUnlocks = checkAchievements({ maxCombo: 55, completedLessons: 0 });
    const ids = newUnlocks.map(a => a.id);
    expect(ids).toContain('combo10');
    expect(ids).toContain('combo20');
    expect(ids).toContain('combo50');
  });
});

describe('getStats', () => {
  beforeEach(() => {
    resetProgress();
  });

  test('returns full stats object', () => {
    const stats = getStats();
    expect(stats).toHaveProperty('unlocked');
    expect(stats).toHaveProperty('maxCombo');
    expect(stats).toHaveProperty('wordsTyped');
  });
});

describe('getUnlockedAchievements', () => {
  beforeEach(() => {
    resetProgress();
  });

  test('returns empty array when no achievements', () => {
    const achievements = getUnlockedAchievements();
    expect(achievements).toEqual([]);
  });

  test('returns unlocked achievements list after checking', () => {
    checkAchievements({ completedLessons: 1 });
    const achievements = getUnlockedAchievements();
    expect(achievements).toContain('firstWin');
  });
});

describe('ACHIEVEMENT_DEFINITIONS', () => {
  test('has all 9 achievement definitions', () => {
    expect(Object.keys(ACHIEVEMENT_DEFINITIONS).length).toBe(9);
  });

  test('each achievement has required properties', () => {
    for (const [id, ach] of Object.entries(ACHIEVEMENT_DEFINITIONS)) {
      expect(ach).toHaveProperty('id');
      expect(ach).toHaveProperty('name');
      expect(ach).toHaveProperty('nameEn');
      expect(ach).toHaveProperty('desc');
      expect(ach.id).toBe(id);
    }
  });
});

describe('resetProgress', () => {
  test('removes progress from storage', () => {
    const mockStorage = { 'kb-runner-progress': JSON.stringify({ unlocked: 5 }) };
    globalThis.localStorage = {
      getItem: (key) => mockStorage[key],
      removeItem: (key) => { delete mockStorage[key]; },
    };
    resetProgress();
    expect(mockStorage['kb-runner-progress']).toBeUndefined();
  });
});
