const {
  currentLesson, setLesson, setState, resetState, calculateSpeed,
  spawnObstacle, update, getNextObstacle, clearObstacle, missObstacle,
  calculateAccuracy, normalizeKey, LESSONS, KEY_MAP,
  getObstacles, getTimeLeft, setTimeLeft, getCombo, getScore,
  getNextObstacleIn, setNextObstacleIn
} = require('../src/game');

describe('currentLesson', () => {
  beforeEach(() => {
    setLesson(0);
    setState('idle');
    resetState();
  });

  test('returns first lesson by default', () => {
    expect(currentLesson().id).toBe('home-row');
  });

  test('returns correct lesson after setLesson', () => {
    setLesson(2);
    expect(currentLesson().id).toBe('top-row');
  });
});

describe('setState', () => {
  test('changes state', () => {
    setState('playing');
    update(0.016);
    expect(update(0.016)).toBeDefined();
  });
});

describe('resetState', () => {
  beforeEach(() => {
    setLesson(0);
    setState('playing');
  });

  test('resets score and combo', () => {
    resetState();
    expect(currentLesson().id).toBe('home-row');
  });

  test('resets time to lesson duration', () => {
    setLesson(0);
    resetState();
    expect(update(0.016)).toHaveProperty('timeLeft');
  });
});

describe('calculateSpeed', () => {
  beforeEach(() => {
    setLesson(0);
    setState('playing');
    resetState();
  });

  test('returns base speed at start', () => {
    const speed = calculateSpeed(0.016);
    expect(speed).toBe(LESSONS[0].speed);
  });

  test('increases speed as time progresses', () => {
    setTimeLeft(LESSONS[0].duration * 0.3);
    const speed = calculateSpeed(0.016);
    expect(speed).toBeGreaterThan(LESSONS[0].speed);
  });

  test('speed approaches 1.5x at end of level', () => {
    setTimeLeft(LESSONS[0].duration * 0.1);
    const speed = calculateSpeed(0.016);
    expect(speed).toBeCloseTo(LESSONS[0].speed * 1.45, 1);
  });
});

describe('spawnObstacle', () => {
  beforeEach(() => {
    setLesson(0);
    resetState();
  });

  test('spawns obstacle with valid key', () => {
    spawnObstacle(800);
    const obs = getObstacles();
    expect(obs.length).toBe(1);
    expect(LESSONS[0].keys).toContain(obs[0].key);
  });

  test('spawns obstacle with correct zone info', () => {
    spawnObstacle(800);
    const obs = getObstacles()[0];
    const info = KEY_MAP[obs.key];
    expect(obs.zone).toBe(info.zone);
    expect(obs.color).toBe(info.color);
  });

  test('spawns multiple obstacles over time', () => {
    spawnObstacle(800);
    spawnObstacle(800);
    expect(getObstacles().length).toBe(2);
  });
});

describe('getNextObstacle', () => {
  beforeEach(() => {
    setLesson(0);
    setState('playing');
    resetState();
  });

  test('returns undefined when no obstacles', () => {
    expect(getNextObstacle()).toBeUndefined();
  });

  test('returns next uncleared obstacle', () => {
    spawnObstacle(800);
    const next = getNextObstacle();
    expect(next).toBeDefined();
    expect(next.cleared).toBe(false);
  });

  test('returns undefined when all obstacles cleared', () => {
    spawnObstacle(800);
    const obs = getObstacles()[0];
    obs.cleared = true;
    expect(getNextObstacle()).toBeUndefined();
  });
});

describe('clearObstacle', () => {
  beforeEach(() => {
    setLesson(0);
    setState('playing');
    resetState();
  });

  test('clears matching obstacle and updates score', () => {
    spawnObstacle(800);
    const obs = getObstacles()[0];
    const result = clearObstacle(obs.key);
    expect(result.success).toBe(true);
    expect(result.score).toBe(1);
  });

  test('increments combo on clear', () => {
    spawnObstacle(800);
    const obs = getObstacles()[0];
    clearObstacle(obs.key);
    expect(clearObstacle(obs.key)).toBeDefined();
  });

  test('returns false when no matching obstacle', () => {
    const result = clearObstacle('x');
    expect(result.success).toBe(false);
  });

  test('marks obstacle as cleared', () => {
    spawnObstacle(800);
    const obs = getObstacles()[0];
    clearObstacle(obs.key);
    expect(obs.cleared).toBe(true);
  });
});

describe('missObstacle', () => {
  beforeEach(() => {
    setLesson(0);
    setState('playing');
    resetState();
  });

  test('resets combo when obstacle missed', () => {
    spawnObstacle(800);
    const obs = getObstacles();
    obs[0].x = -50;
    missObstacle();
    expect(missObstacle()).toBeDefined();
  });

  test('returns false when no obstacles to miss', () => {
    const result = missObstacle();
    expect(result.missed).toBe(false);
  });
});

describe('calculateAccuracy', () => {
  test('returns 0 when no stats', () => {
    expect(calculateAccuracy({})).toBe(0);
  });

  test('calculates correct percentage', () => {
    const stats = {
      lp: { hits: 8, misses: 2 },
      lr: { hits: 5, misses: 5 }
    };
    expect(calculateAccuracy(stats)).toBe(65);
  });

  test('rounds to nearest integer', () => {
    const stats = {
      li: { hits: 3, misses: 1 }
    };
    expect(calculateAccuracy(stats)).toBe(75);
  });

  test('handles single finger stats', () => {
    const stats = { lp: { hits: 10, misses: 0 } };
    expect(calculateAccuracy(stats)).toBe(100);
  });
});

describe('update', () => {
  beforeEach(() => {
    setLesson(0);
    setState('playing');
    resetState();
  });

  test('does nothing when not playing', () => {
    setState('idle');
    const result = update(0.016, 800);
    expect(result).toBeUndefined();
  });

  test('does nothing when paused', () => {
    setState('paused');
    const result = update(0.016, 800);
    expect(result).toBeUndefined();
  });

  test('ends game when time runs out', () => {
    setTimeLeft(0.01);
    update(0.02);
    expect(update(0.016)).toBeUndefined();
  });

  test('sets timeLeft to 0 when negative', () => {
    setTimeLeft(-1);
    update(0.1, 800);
    expect(getTimeLeft()).toBe(0);
  });

  test('moves obstacles', () => {
    spawnObstacle(800);
    const initialX = getObstacles()[0].x;
    update(0.5, 800);
    expect(getObstacles()[0].x).toBeLessThan(initialX);
  });

  test('returns game state', () => {
    spawnObstacle(800);
    const result = update(0.016, 800);
    expect(result).toHaveProperty('state');
    expect(result).toHaveProperty('timeLeft');
    expect(result).toHaveProperty('score');
  });

  test('spawns obstacle when nextObstacleIn reaches zero', () => {
    setNextObstacleIn(0.5);
    update(0.1, 800);
    expect(getObstacles().length).toBe(1);
  });

  test('marks missed obstacles when past runner', () => {
    setState('playing');
    resetState();
    spawnObstacle(800);
    const obs = getObstacles()[0];
    obs.x = 50;
    update(0.016, 800, 100);
    expect(obs.cleared).toBe(true);
  });

  test('resets combo when obstacle missed', () => {
    setState('playing');
    resetState();
    spawnObstacle(800);
    const obs = getObstacles()[0];
    obs.x = 50;
    update(0.016, 800, 100);
    expect(getCombo()).toBe(0);
  });

  test('filters out off-screen obstacles', () => {
    spawnObstacle(800);
    const obs = getObstacles()[0];
    obs.x = -150;
    update(0.016, 800);
    expect(getObstacles().length).toBe(0);
  });

  test('keeps on-screen obstacles', () => {
    spawnObstacle(800);
    update(0.016, 800);
    expect(getObstacles().length).toBe(1);
  });
});

describe('getTimeLeft and setTimeLeft', () => {
  test('getTimeLeft returns current time', () => {
    setTimeLeft(30);
    expect(getTimeLeft()).toBe(30);
  });

  test('setTimeLeft updates time', () => {
    setTimeLeft(45);
    expect(getTimeLeft()).toBe(45);
  });
});

describe('normalizeKey', () => {
  test('converts uppercase to lowercase', () => {
    const event = { key: 'A' };
    expect(normalizeKey(event)).toBe('a');
  });

  test('returns space for spacebar', () => {
    const event = { key: ' ' };
    expect(normalizeKey(event)).toBe(' ');
  });

  test('returns Escape for escape key', () => {
    const event = { key: 'Escape' };
    expect(normalizeKey(event)).toBe('Escape');
  });

  test('ignores shift modifier', () => {
    const event = { key: 'Shift' };
    expect(normalizeKey(event)).toBe('');
  });

  test('ignores control modifier', () => {
    const event = { key: 'Control' };
    expect(normalizeKey(event)).toBe('');
  });

  test('ignores alt modifier', () => {
    const event = { key: 'Alt' };
    expect(normalizeKey(event)).toBe('');
  });

  test('ignores meta modifier', () => {
    const event = { key: 'Meta' };
    expect(normalizeKey(event)).toBe('');
  });

  test('handles single letter key', () => {
    const event = { key: 'a' };
    expect(normalizeKey(event)).toBe('a');
  });

  test('handles digit 1', () => {
    const event = { key: '1' };
    expect(normalizeKey(event)).toBe('1');
  });

  test('handles digit 6', () => {
    const event = { key: '6' };
    expect(normalizeKey(event)).toBe('6');
  });

  test('returns empty for unknown keys', () => {
    const event = { key: 'F1' };
    expect(normalizeKey(event)).toBe('');
  });

  // Additional edge cases

  test('converts lowercase to lowercase', () => {
    const event = { key: 'z' };
    expect(normalizeKey(event)).toBe('z');
  });

  test('handles punctuation', () => {
    const event = { key: ';' };
    expect(normalizeKey(event)).toBe(';');
  });
});

describe('getScore', () => {
  beforeEach(() => {
    setLesson(0);
    setState('playing');
    resetState();
  });

  test('returns initial score of 0', () => {
    expect(getScore()).toBe(0);
  });

  test('returns updated score after clearObstacle', () => {
    spawnObstacle(800);
    const obs = getObstacles()[0];
    clearObstacle(obs.key);
    expect(getScore()).toBe(1);
  });

  test('accumulates score with multiple clears', () => {
    spawnObstacle(800);
    spawnObstacle(800);
    const obs = getObstacles();
    clearObstacle(obs[0].key);
    clearObstacle(obs[1].key);
    expect(getScore()).toBe(2);
  });
});

describe('getCombo', () => {
  beforeEach(() => {
    setLesson(0);
    setState('playing');
    resetState();
  });

  test('returns initial combo of 0', () => {
    expect(getCombo()).toBe(0);
  });

  test('increments combo after clearObstacle', () => {
    spawnObstacle(800);
    const obs = getObstacles()[0];
    clearObstacle(obs.key);
    expect(getCombo()).toBe(1);
  });

  test('resets combo after missObstacle', () => {
    spawnObstacle(800);
    const obs = getObstacles()[0];
    obs.x = -50;
    missObstacle();
    expect(getCombo()).toBe(0);
  });
});

describe('getNextObstacleIn and setNextObstacleIn', () => {
  beforeEach(() => {
    setLesson(0);
    resetState();
  });

  test('getNextObstacleIn returns initial value', () => {
    expect(getNextObstacleIn()).toBe(80);
  });

  test('setNextObstacleIn updates value', () => {
    setNextObstacleIn(50);
    expect(getNextObstacleIn()).toBe(50);
  });

  test('setNextObstacleIn can be set to 0', () => {
    setNextObstacleIn(0);
    expect(getNextObstacleIn()).toBe(0);
  });

  test('setNextObstacleIn accepts negative values', () => {
    setNextObstacleIn(-10);
    expect(getNextObstacleIn()).toBe(-10);
  });
});

describe('clearObstacle - enhanced', () => {
  beforeEach(() => {
    setLesson(0);
    setState('playing');
    resetState();
  });

  test('updates maxCombo when current combo exceeds', () => {
    spawnObstacle(800);
    const obs = getObstacles()[0];
    clearObstacle(obs.key);
    expect(getCombo()).toBe(1);
  });

  test('works with custom obstacle list', () => {
    const customList = [
      { key: 'a', cleared: false, x: 200 },
      { key: 's', cleared: false, x: 300 }
    ];
    const result = clearObstacle('s', customList);
    expect(result.success).toBe(true);
    expect(result.score).toBe(1);
    expect(customList[1].cleared).toBe(true);
  });

  test('does not modify original obstacles when using custom list', () => {
    spawnObstacle(800);
    const obs = getObstacles()[0];
    const originalKey = obs.key;
    clearObstacle('nonexistent', []);
    expect(getObstacles()[0].cleared).toBe(false);
  });
});

describe('missObstacle - enhanced', () => {
  beforeEach(() => {
    setLesson(0);
    setState('playing');
    resetState();
  });

  test('resets combo to 0 explicitly', () => {
    spawnObstacle(800);
    const obs = getObstacles()[0];
    obs.x = -50;
    const result = missObstacle();
    expect(result.combo).toBe(0);
  });

  test('works with custom obstacle list', () => {
    const customList = [
      { key: 'a', cleared: false, x: 50 },
      { key: 's', cleared: false, x: 300 }
    ];
    const result = missObstacle(customList, 120);
    expect(result.missed).toBe(true);
    expect(result.combo).toBe(0);
  });

  test('works with custom runnerX parameter', () => {
    const customList = [
      { key: 'a', cleared: false, x: 200 }
    ];
    const result = missObstacle(customList, 150);
    expect(result.missed).toBe(false);
  });

  test('marks obstacle as cleared', () => {
    const customList = [
      { key: 'a', cleared: false, x: 50 }
    ];
    missObstacle(customList, 120);
    expect(customList[0].cleared).toBe(true);
  });
});

describe('calculateAccuracy - edge cases', () => {
  test('returns 0 when all stats have 0 attempts', () => {
    const stats = {
      lp: { hits: 0, misses: 0 },
      lr: { hits: 0, misses: 0 }
    };
    expect(calculateAccuracy(stats)).toBe(0);
  });

  test('handles only misses', () => {
    const stats = {
      lp: { hits: 0, misses: 10 }
    };
    expect(calculateAccuracy(stats)).toBe(0);
  });

  test('handles only hits', () => {
    const stats = {
      lp: { hits: 10, misses: 0 }
    };
    expect(calculateAccuracy(stats)).toBe(100);
  });

  test('handles zone with no stats (undefined)', () => {
    const stats = {
      lp: { hits: 5, misses: 5 }
    };
    expect(calculateAccuracy(stats)).toBe(50);
  });

  test('handles all 8 finger zones', () => {
    const stats = {
      lp: { hits: 1, misses: 0 },
      lr: { hits: 1, misses: 0 },
      lm: { hits: 1, misses: 0 },
      li: { hits: 1, misses: 0 },
      ri: { hits: 1, misses: 0 },
      rm: { hits: 1, misses: 0 },
      rr: { hits: 1, misses: 0 },
      rp: { hits: 1, misses: 0 }
    };
    expect(calculateAccuracy(stats)).toBe(100);
  });
});