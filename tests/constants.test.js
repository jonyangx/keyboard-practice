const { FINGER_ZONES, KEY_MAP, LESSONS } = require('../src/constants');

describe('FINGER_ZONES', () => {
  test('has 8 finger zones', () => {
    expect(Object.keys(FINGER_ZONES).length).toBe(8);
  });

  test('each zone has name, keys, and color', () => {
    for (const [zone, data] of Object.entries(FINGER_ZONES)) {
      expect(data).toHaveProperty('name');
      expect(data).toHaveProperty('keys');
      expect(data).toHaveProperty('color');
      expect(Array.isArray(data.keys)).toBe(true);
    }
  });

  test('lp zone contains correct keys', () => {
    expect(FINGER_ZONES.lp.keys).toContain('a');
    expect(FINGER_ZONES.lp.keys).toContain('q');
  });
});

describe('KEY_MAP', () => {
  test('maps each key to zone, color, and name', () => {
    const mapping = KEY_MAP['a'];
    expect(mapping.zone).toBe('lp');
    expect(mapping.color).toBe('#ff6b6b');
    expect(mapping.name).toBeDefined();
  });

  test('covers all keys from all finger zones', () => {
    const allKeys = Object.values(FINGER_ZONES).flatMap(z => z.keys);
    allKeys.forEach(key => {
      expect(KEY_MAP[key]).toBeDefined();
    });
  });
});

describe('LESSONS', () => {
  test('has 6 lessons', () => {
    expect(LESSONS.length).toBe(6);
  });

  test('each lesson has required properties', () => {
    LESSONS.forEach(lesson => {
      expect(lesson).toHaveProperty('id');
      expect(lesson).toHaveProperty('name');
      expect(lesson).toHaveProperty('keys');
      expect(lesson).toHaveProperty('duration');
      expect(lesson).toHaveProperty('speed');
    });
  });

  test('lessons have speed values within valid range', () => {
    LESSONS.forEach(lesson => {
      expect(lesson.speed).toBeGreaterThan(1);
      expect(lesson.speed).toBeLessThanOrEqual(3);
    });
  });

  test('home-row contains home row keys', () => {
    const homeRow = LESSONS[0];
    expect(homeRow.keys).toContain('a');
    expect(homeRow.keys).toContain('f');
    expect(homeRow.keys).toContain('j');
  });

  test('all-rows contains all keyboard keys', () => {
    const allRows = LESSONS.find(l => l.id === 'all-rows');
    expect(allRows.keys.length).toBeGreaterThan(20);
  });
});