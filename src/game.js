const { LESSONS, KEY_MAP } = require('./constants');

let state = 'idle';
let currentLessonIndex = 0;
let score = 0;
let combo = 0;
let maxCombo = 0;
let nextObstacleIn = 80;
let speedMultiplier = 1;

function currentLesson() {
  return LESSONS[currentLessonIndex];
}

function setLesson(index) {
  currentLessonIndex = index;
}

function setState(newState) {
  state = newState;
}

function resetState() {
  score = 0; combo = 0; maxCombo = 0;
  timeLeft = currentLesson().duration;
  obstacles = [];
  nextObstacleIn = 80;
  speedMultiplier = 1;
}

function getObstacles() {
  return obstacles;
}

function getTimeLeft() {
  return timeLeft;
}

function setTimeLeft(value) {
  timeLeft = value;
}

function getCombo() {
  return combo;
}

function getScore() {
  return score;
}

function getMaxCombo() {
  return maxCombo;
}

function getNextObstacleIn() {
  return nextObstacleIn;
}

function setNextObstacleIn(value) {
  nextObstacleIn = value;
}

function calculateSpeed(dt) {
  const lesson = currentLesson();
  const progress = 1 - (timeLeft / lesson.duration);
  speedMultiplier = 1 + (progress * 0.5);
  return lesson.speed * speedMultiplier;
}

function spawnObstacle(canvasWidth = 800) {
  const key = currentLesson().keys[Math.floor(Math.random() * currentLesson().keys.length)];
  const info = KEY_MAP[key];
  const obstacle = {
    x: canvasWidth + 40,
    key,
    zone: info.zone,
    color: info.color,
    name: info.name,
    width: 50,
    height: 60,
    cleared: false,
  };
  obstacles.push(obstacle);
  nextObstacleIn = 60 + Math.floor(Math.random() * 40);
  return obstacle;
}

function update(dt, canvasWidth = 800, runnerX = 120, groundY = 500) {
  if (state !== 'playing') return;

  timeLeft -= dt;
  if (timeLeft <= 0) {
    timeLeft = 0;
    state = 'ended';
    return;
  }

  const effectiveSpeed = calculateSpeed(dt);

  nextObstacleIn -= speedMultiplier;
  if (nextObstacleIn <= 0) {
    spawnObstacle(canvasWidth);
  }

  for (const obs of obstacles) {
    obs.x -= effectiveSpeed;
  }

  for (const obs of obstacles) {
    if (!obs.cleared && obs.x < runnerX - 30) {
      obs.cleared = true;
      combo = 0;
    }
  }

  obstacles = obstacles.filter(o => o.x > -100);

  return { state, timeLeft, score, combo, obstacles, speedMultiplier };
}

function getNextObstacle() {
  return obstacles.find(o => !o.cleared && o.x > 100);
}

function clearObstacle(obsKey, obstacleList = obstacles) {
  const obs = obstacleList.find(o => !o.cleared && o.key === obsKey);
  if (obs) {
    obs.cleared = true;
    score++;
    combo++;
    if (combo > maxCombo) maxCombo = combo;
    return { success: true, score, combo };
  }
  return { success: false };
}

function missObstacle(obstacleList = obstacles, runnerX = 120) {
  const obs = obstacleList.find(o => !o.cleared && o.x < runnerX - 30);
  if (obs) {
    obs.cleared = true;
    combo = 0;
    return { missed: true, combo };
  }
  return { missed: false };
}

function calculateAccuracy(fingerStats) {
  let totalHits = 0, totalAttempts = 0;
  for (const stats of Object.values(fingerStats)) {
    totalHits += stats.hits;
    totalAttempts += stats.hits + stats.misses;
  }
  return totalAttempts > 0 ? Math.round((totalHits / totalAttempts) * 100) : 0;
}

function normalizeKey(e) {
  let key = e.key.toLowerCase();
  if (key === 'shift' || key === 'control' || key === 'alt' || key === 'meta') return '';
  if (key === ' ') return ' ';
  if (key === 'escape') return 'Escape';
  if (key.length === 1) return key;
  if (key >= 'digit1' && key <= 'digit6') return key.slice(-1);
  return '';
}

function getComboMultiplier(combo) {
  if (combo >= 50) return 4.0;
  if (combo >= 30) return 3.0;
  if (combo >= 25) return 2.5;
  if (combo >= 20) return 2.0;
  if (combo >= 15) return 1.5;
  if (combo >= 10) return 1.2;
  if (combo >= 5) return 1.0;
  return 1.0;
}

module.exports = {
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
};