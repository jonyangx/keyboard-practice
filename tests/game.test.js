const {
  currentLesson,
  setLesson,
  setState,
  resetState,
  calculateSpeed,
  spawnObstacle,
  update,
  getNextObstacle,
  clearObstacle,
  missObstacle,
  calculateAccuracy,
  normalizeKey,
  LESSONS,
  KEY_MAP,
  getObstacles,
  getTimeLeft,
  setTimeLeft,
  getCombo,
  getScore,
  getMaxCombo,
  getNextObstacleIn,
  setNextObstacleIn,
  getComboMultiplier,
} = require('../src/game');

describe('getComboMultiplier', () => {
  test('returns 1.0 for combo < 5', () => {
    expect(getComboMultiplier(0)).toBe(1.0);
    expect(getComboMultiplier(1)).toBe(1.0);
    expect(getComboMultiplier(4)).toBe(1.0);
  });

  test('returns 1.0 for combo 5-9', () => {
    expect(getComboMultiplier(5)).toBe(1.0);
    expect(getComboMultiplier(9)).toBe(1.0);
  });

  test('returns 1.2 for combo 10-14', () => {
    expect(getComboMultiplier(10)).toBe(1.2);
    expect(getComboMultiplier(14)).toBe(1.2);
  });

  test('returns 1.5 for combo 15-19', () => {
    expect(getComboMultiplier(15)).toBe(1.5);
    expect(getComboMultiplier(19)).toBe(1.5);
  });

  test('returns 2.0 for combo 20-24', () => {
    expect(getComboMultiplier(20)).toBe(2.0);
    expect(getComboMultiplier(24)).toBe(2.0);
  });

  test('returns 2.5 for combo 25-29', () => {
    expect(getComboMultiplier(25)).toBe(2.5);
    expect(getComboMultiplier(29)).toBe(2.5);
  });

  test('returns 3.0 for combo 30-49', () => {
    expect(getComboMultiplier(30)).toBe(3.0);
    expect(getComboMultiplier(40)).toBe(3.0);
    expect(getComboMultiplier(49)).toBe(3.0);
  });

  test('returns 4.0 for combo >= 50', () => {
    expect(getComboMultiplier(50)).toBe(4.0);
    expect(getComboMultiplier(100)).toBe(4.0);
    expect(getComboMultiplier(999)).toBe(4.0);
  });
});

describe('getMaxCombo', () => {
  beforeEach(() => {
    setLesson(0);
    setState('idle');
    resetState();
  });

  test('returns 0 initially', () => {
    expect(getMaxCombo()).toBe(0);
  });

  test('returns max combo value', () => {
    const obs = spawnObstacle(800);
    update(0.016);
    expect(getMaxCombo()).toBeDefined();
  });
});

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

  test('returns correct lesson for all indices', () => {
    LESSONS.forEach((lesson, index) => {
      setLesson(index);
      expect(currentLesson().id).toBe(lesson.id);
    });
  });
});

describe('setState', () => {
  test('changes state to playing', () => {
    setState('playing');
    const result = update(0.016);
    expect(result).toHaveProperty('state');
  });

  test('changes state to ended', () => {
    setState('ended');
    const result = update(0.016);
    expect(result).toBeUndefined();
  });

  test('changes state to idle returns undefined', () => {
    setState('idle');
    const result = update(0.016);
    expect(result).toBeUndefined();
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

  test('speed increases with lesson duration progress', () => {
    setTimeLeft(LESSONS[0].duration * 0.5);
    const speed1 = calculateSpeed(0.016);
    setTimeLeft(LESSONS[0].duration * 0.8);
    const speed2 = calculateSpeed(0.016);
    expect(speed1).toBeGreaterThan(speed2);
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

  test('obstacle has correct properties', () => {
    const obs = spawnObstacle(800);
    expect(obs).toHaveProperty('x');
    expect(obs).toHaveProperty('key');
    expect(obs).toHaveProperty('zone');
    expect(obs).toHaveProperty('color');
    expect(obs).toHaveProperty('name');
    expect(obs).toHaveProperty('width');
    expect(obs).toHaveProperty('height');
    expect(obs.cleared).toBe(false);
  });

  test('obstacle spawns at canvas width + offset', () => {
    const obs = spawnObstacle(800);
    expect(obs.x).toBe(840);
  });

  test('updates nextObstacleIn after spawning', () => {
    const initialNextIn = getNextObstacleIn();
    spawnObstacle(800);
    expect(getNextObstacleIn()).not.toBe(initialNextIn);
    expect(getNextObstacleIn()).toBeGreaterThanOrEqual(60);
    expect(getNextObstacleIn()).toBeLessThanOrEqual(100);
  });
});

describe('update', () => {
  beforeEach(() => {
    setLesson(0);
    setState('playing');
    resetState();
  });

  test('returns game state when playing', () => {
    const result = update(0.016);
    expect(result).toHaveProperty('state');
    expect(result).toHaveProperty('timeLeft');
  });

  test('ends game when timeLeft reaches 0', () => {
    setTimeLeft(0);
    const result = update(0.016);
    expect(result).toBeUndefined();
  });

  test('decreases timeLeft', () => {
    const initialTime = getTimeLeft();
    update(0.016);
    expect(getTimeLeft()).toBeLessThan(initialTime);
  });

  test('spawns obstacles as nextObstacleIn decreases', () => {
    setLesson(0);
    setState('playing');
    setTimeLeft(LESSONS[0].duration);
    setNextObstacleIn(5);
    for (let i = 0; i < 100; i++) {
      update(0.016);
    }
    expect(getObstacles().length).toBeGreaterThan(0);
  });

  test('moves obstacles left', () => {
    spawnObstacle(800);
    const initialX = getObstacles()[0].x;
    update(0.016);
    expect(getObstacles()[0].x).toBeLessThan(initialX);
  });

  test('misses obstacle when it passes runner', () => {
    setLesson(0);
    setState('playing');
    resetState();
    spawnObstacle(800);
    const nextObs = getNextObstacle();
    expect(nextObs).toBeDefined();
  });
});

describe('getNextObstacle', () => {
  beforeEach(() => {
    setLesson(0);
    resetState();
  });

  test('returns first uncleared obstacle', () => {
    spawnObstacle(800);
    const next = getNextObstacle();
    expect(next).toBeDefined();
    expect(next.cleared).toBe(false);
  });

  test('returns undefined when no obstacles', () => {
    const next = getNextObstacle();
    expect(next).toBeUndefined();
  });
});

describe('clearObstacle', () => {
  beforeEach(() => {
    setLesson(0);
    resetState();
  });

  test('marks obstacle as cleared', () => {
    const obs = spawnObstacle(800);
    clearObstacle(obs.key);
    const cleared = getObstacles().find(o => o.key === obs.key);
    expect(cleared.cleared).toBe(true);
  });

  test('only clears matching key', () => {
    spawnObstacle(800);
    clearObstacle('wrong-key');
    const hasUncleared = getObstacles().some(o => !o.cleared);
    expect(hasUncleared).toBe(true);
  });
});

describe('missObstacle', () => {
  beforeEach(() => {
    setLesson(0);
    resetState();
  });

  test('marks obstacle as cleared when missed', () => {
    setState('playing');
    setTimeLeft(LESSONS[0].duration);
    spawnObstacle(800);
    const initialObstacles = getObstacles();
    if (initialObstacles.length > 0) {
      const firstObs = initialObstacles[0];
      firstObs.x = -50;
      const result = missObstacle();
      expect(result).toHaveProperty('missed');
    }
  });

  test('returns missed:false when no obstacle to miss', () => {
    const result = missObstacle();
    expect(result.missed).toBe(false);
  });
});

describe('calculateAccuracy', () => {
  beforeEach(() => {
    setLesson(0);
    resetState();
  });

  test('returns 100 when no misses', () => {
    const fingerStats = {
      lp: { hits: 10, misses: 0 },
      lr: { hits: 5, misses: 0 },
    };
    const accuracy = calculateAccuracy(fingerStats);
    expect(accuracy).toBe(100);
  });

  test('calculates correct percentage', () => {
    const fingerStats = {
      lp: { hits: 8, misses: 2 },
      lr: { hits: 4, misses: 1 },
    };
    const accuracy = calculateAccuracy(fingerStats);
    expect(accuracy).toBe(80);
  });

  test('returns 0 when all misses', () => {
    const fingerStats = {
      lp: { hits: 0, misses: 10 },
    };
    const accuracy = calculateAccuracy(fingerStats);
    expect(accuracy).toBe(0);
  });
});

describe('normalizeKey', () => {
  test('converts KeyA to a', () => {
    expect(normalizeKey({ code: 'KeyA', key: 'a' })).toBe('a');
  });

  test('converts semicolon correctly', () => {
    expect(normalizeKey({ code: 'Semicolon', key: ';' })).toBe(';');
  });

  test('converts digits correctly', () => {
    expect(normalizeKey({ code: 'Digit1', key: '1' })).toBe('1');
    expect(normalizeKey({ code: 'Digit0', key: '0' })).toBe('0');
  });

  test('converts comma and period', () => {
    expect(normalizeKey({ code: 'Comma', key: ',' })).toBe(',');
    expect(normalizeKey({ code: 'Period', key: '.' })).toBe('.');
  });

  test('converts slash', () => {
    expect(normalizeKey({ code: 'Slash', key: '/' })).toBe('/');
  });

  test('converts space', () => {
    expect(normalizeKey({ code: 'Space', key: ' ' })).toBe(' ');
  });

  test('handles lowercase letters', () => {
    expect(normalizeKey({ code: 'KeyB', key: 'b' })).toBe('b');
  });
});

describe('game state management', () => {
  beforeEach(() => {
    setLesson(0);
    setState('idle');
    resetState();
  });

  test('setTimeLeft updates timeLeft', () => {
    setTimeLeft(30);
    expect(getTimeLeft()).toBe(30);
  });

  test('getScore returns current score', () => {
    expect(getScore()).toBe(0);
  });

  test('getCombo returns current combo', () => {
    expect(getCombo()).toBe(0);
  });

  test('setNextObstacleIn updates value', () => {
    setNextObstacleIn(50);
    expect(getNextObstacleIn()).toBe(50);
  });

  test('resetState resets all values', () => {
    setTimeLeft(10);
    setNextObstacleIn(5);
    resetState();
    expect(getTimeLeft()).toBe(LESSONS[0].duration);
    expect(getNextObstacleIn()).toBe(80);
    expect(getScore()).toBe(0);
    expect(getCombo()).toBe(0);
  });
});
