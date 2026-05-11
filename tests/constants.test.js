const { FINGER_ZONES, KEY_MAP, LESSONS, WORD_LISTS } = require('../src/constants');

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

describe('WORD_LISTS', () => {
  test('has 6 vocabulary categories', () => {
    expect(Object.keys(WORD_LISTS).length).toBe(6);
  });

  test('each category has name, color, and words', () => {
    for (const [id, cat] of Object.entries(WORD_LISTS)) {
      expect(cat).toHaveProperty('name');
      expect(cat).toHaveProperty('color');
      expect(cat).toHaveProperty('words');
      expect(Array.isArray(cat.words)).toBe(true);
      expect(cat.words.length).toBeGreaterThan(0);
    }
  });

  test('all categories contain valid word strings', () => {
    for (const [id, cat] of Object.entries(WORD_LISTS)) {
      cat.words.forEach(word => {
        expect(typeof word).toBe('string');
        expect(word.length).toBeGreaterThan(0);
      });
    }
  });

  test('IELTS category has expected properties', () => {
    expect(WORD_LISTS.ielts.name).toBe('雅思 IELTS');
    expect(WORD_LISTS.ielts.color).toBe('#ff6b6b');
    expect(WORD_LISTS.ielts.words.length).toBeGreaterThan(100);
  });

  test('GRE category has expected properties', () => {
    expect(WORD_LISTS.gre.name).toBe('GRE');
    expect(WORD_LISTS.gre.color).toBe('#ffa06b');
    expect(WORD_LISTS.gre.words.length).toBeGreaterThan(50);
  });

  test('CET-4 category has expected properties', () => {
    expect(WORD_LISTS.cet4.name).toBe('大学英语四级 CET-4');
    expect(WORD_LISTS.cet4.color).toBe('#53d769');
    expect(WORD_LISTS.cet4.words.length).toBeGreaterThan(50);
  });

  test('CET-6 category has expected properties', () => {
    expect(WORD_LISTS.cet6.name).toBe('大学英语六级 CET-6');
    expect(WORD_LISTS.cet6.color).toBe('#4ecdc4');
    expect(WORD_LISTS.cet6.words.length).toBeGreaterThan(50);
  });

  test('FCE category has expected properties', () => {
    expect(WORD_LISTS.fce.name).toBe('FCE 剑桥英语');
    expect(WORD_LISTS.fce.color).toBe('#45b7d1');
    expect(WORD_LISTS.fce.words.length).toBeGreaterThan(0);
  });

  test('NCE category has expected properties', () => {
    expect(WORD_LISTS.nce.name).toBe('新概念英语 NCE');
    expect(WORD_LISTS.nce.color).toBe('#9b59b6');
    expect(WORD_LISTS.nce.words.length).toBeGreaterThan(50);
  });

  test('all categories have valid words', () => {
    for (const [id, cat] of Object.entries(WORD_LISTS)) {
      cat.words.forEach(word => {
        expect(typeof word).toBe('string');
        expect(word.length).toBeGreaterThan(0);
      });
    }
  });
});