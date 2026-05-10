// Finger zones mapping
const FINGER_ZONES = {
  lp: { name: '左小指 L-Pinky',  keys: ['a','q','z','1'], color: '#ff6b6b' },
  lr: { name: '左无名指 L-Ring',  keys: ['s','w','x','2'], color: '#ffa06b' },
  lm: { name: '左中指 L-Mid',    keys: ['d','e','c','3'], color: '#ffd93d' },
  li: { name: '左食指 L-Index',  keys: ['f','r','v','4','5','g','t','b'], color: '#53d769' },
  ri: { name: '右食指 R-Index',  keys: ['h','y','n','6','7','j','u','m'], color: '#4ecdc4' },
  rm: { name: '右中指 R-Mid',    keys: ['k','i',',','8'], color: '#45b7d1' },
  rr: { name: '右无名指 R-Ring',  keys: ['l','o','.','9'], color: '#9b59b6' },
  rp: { name: '右小指 R-Pinky',  keys: [';','p','/','0'], color: '#e84393' },
};

// Build reverse map: key → { zone, color, name }
const KEY_MAP = {};
for (const [zone, data] of Object.entries(FINGER_ZONES)) {
  for (const key of data.keys) {
    KEY_MAP[key] = { zone, color: data.color, name: data.name };
  }
}

// Lesson definitions
const LESSONS = [
  { id: 'home-row',   name: '基准键 Home Row',       keys: ['a','s','d','f','j','k','l',';'],              duration: 60, speed: 1.5, bg1: '#2d5a3d', bg2: '#3a7a4a', ground: '#53d769' },
  { id: 'home-top',   name: '基准+上排 Top+Home',     keys: ['a','s','d','f','j','k','l',';','e','i'],      duration: 60, speed: 1.6, bg1: '#3a2d5a', bg2: '#4a3a7a', ground: '#9b59b6' },
  { id: 'top-row',    name: '上排键 Top Row',          keys: ['q','w','e','r','t','y','u','i','o','p'],      duration: 60, speed: 1.7, bg1: '#5a3a2d', bg2: '#7a4a3a', ground: '#ffa06b' },
  { id: 'home-top-full', name: '基准+上排综合 Full',   keys: ['a','s','d','f','j','k','l',';','q','w','e','r','t','y','u','i','o','p'], duration: 70, speed: 1.8, bg1: '#2d4a5a', bg2: '#3a6a7a', ground: '#45b7d1' },
  { id: 'bottom-row', name: '下排键 Bottom Row',       keys: ['z','x','c','v','b','n','m',',','.','/'],     duration: 60, speed: 1.7, bg1: '#5a2d3a', bg2: '#7a3a4a', ground: '#e84393' },
  { id: 'all-rows',   name: '全键盘 Full Keyboard',    keys: ['a','s','d','f','j','k','l',';','q','w','e','r','t','y','u','i','o','p','z','x','c','v','b','n','m',',','.','/'], duration: 90, speed: 2.0, bg1: '#1a3a1a', bg2: '#2a5a2a', ground: '#00d2ff' },
];

module.exports = { FINGER_ZONES, KEY_MAP, LESSONS };