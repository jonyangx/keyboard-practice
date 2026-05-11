// Mock localStorage for tests
let mockStorage = {};

beforeEach(() => {
  mockStorage = {};
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      getItem: (key) => mockStorage[key] || null,
      setItem: (key, value) => { mockStorage[key] = value; },
      removeItem: (key) => { delete mockStorage[key]; },
      clear: () => { mockStorage = {}; },
    },
    writable: true,
    configurable: true,
  });
});
