const STORAGE_KEY = 'kb-runner-progress';

const ACHIEVEMENT_IDS = {
  firstWin: 'firstWin',
  combo10: 'combo10',
  combo20: 'combo20',
  combo50: 'combo50',
  perfect: 'perfect',
  speedDemon: 'speedDemon',
  wordMaster: 'wordMaster',
  marathon: 'marathon',
  allLessons: 'allLessons',
};

const ACHIEVEMENT_DEFINITIONS = {
  firstWin: { id: 'firstWin', name: '初露锋芒', nameEn: 'First Win', desc: '完成第一个关卡' },
  combo10: { id: 'combo10', name: '连击达人', nameEn: 'Combo Master', desc: '达成10连击' },
  combo20: { id: 'combo20', name: '连击王者', nameEn: 'Combo King', desc: '达成20连击' },
  combo50: { id: 'combo50', name: '连击传说', nameEn: 'Combo Legend', desc: '达成50连击' },
  perfect: { id: 'perfect', name: '完美通关', nameEn: 'Perfect', desc: '准确率100%通关' },
  speedDemon: { id: 'speedDemon', name: '速度恶魔', nameEn: 'Speed Demon', desc: 'WPM超过40' },
  wordMaster: { id: 'wordMaster', name: '词汇大师', nameEn: 'Word Master', desc: '单词模式通关100词' },
  marathon: { id: 'marathon', name: '马拉松', nameEn: 'Marathon', desc: '累计完成500个按键' },
  allLessons: { id: 'allLessons', name: '全关卡通关', nameEn: 'All Lessons', desc: '通关所有练习关卡' },
};

const LESSONS_COUNT = 6;

function loadProgress() {
  try {
    const data = JSON.parse(globalThis.localStorage?.getItem(STORAGE_KEY) || '{}');
    return {
      unlocked: data.unlocked || 1,
      bestAccuracy: data.bestAccuracy || {},
      achievements: data.achievements || [],
      maxCombo: data.maxCombo || 0,
      perfectCount: data.perfectCount || 0,
      maxWPM: data.maxWPM || 0,
      wordsTyped: data.wordsTyped || 0,
      totalKeys: data.totalKeys || 0,
    };
  } catch {
    return { unlocked: 1, bestAccuracy: {}, achievements: [], maxCombo: 0, perfectCount: 0, maxWPM: 0, wordsTyped: 0, totalKeys: 0 };
  }
}

function saveProgress(progress) {
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {}
}

function unlockNext(currentIndex, accuracy) {
  const progress = loadProgress();
  const nextLevel = currentIndex + 1;
  if (accuracy >= 60 && nextLevel >= progress.unlocked) {
    progress.unlocked = nextLevel + 1;
  }
  if (!progress.bestAccuracy[currentIndex] || accuracy > progress.bestAccuracy[currentIndex]) {
    progress.bestAccuracy[currentIndex] = accuracy;
  }
  if (accuracy === 100) {
    progress.perfectCount = (progress.perfectCount || 0) + 1;
  }
  saveProgress(progress);
  return progress;
}

function updateStats(stats) {
  const progress = loadProgress();
  if (stats.maxCombo > progress.maxCombo) {
    progress.maxCombo = stats.maxCombo;
  }
  if (stats.maxWPM > progress.maxWPM) {
    progress.maxWPM = stats.maxWPM;
  }
  progress.wordsTyped = (progress.wordsTyped || 0) + (stats.wordsTyped || 0);
  progress.totalKeys = (progress.totalKeys || 0) + (stats.totalKeys || 0);
  saveProgress(progress);
  return progress;
}

function checkAchievements(stats) {
  const progress = loadProgress();
  const unlocked = progress.achievements || [];
  const newUnlocks = [];

  const checks = [
    { id: 'firstWin', condition: () => stats.completedLessons >= 1 },
    { id: 'combo10', condition: () => stats.maxCombo >= 10 },
    { id: 'combo20', condition: () => stats.maxCombo >= 20 },
    { id: 'combo50', condition: () => stats.maxCombo >= 50 },
    { id: 'perfect', condition: () => stats.perfectCount >= 1 },
    { id: 'speedDemon', condition: () => stats.maxWPM >= 40 },
    { id: 'wordMaster', condition: () => stats.wordsTyped >= 100 },
    { id: 'marathon', condition: () => stats.totalKeys >= 500 },
    { id: 'allLessons', condition: () => stats.completedLessons >= LESSONS_COUNT },
  ];

  for (const check of checks) {
    if (!unlocked.includes(check.id) && check.condition()) {
      unlocked.push(check.id);
      newUnlocks.push(ACHIEVEMENT_DEFINITIONS[check.id]);
    }
  }

  if (newUnlocks.length > 0) {
    progress.achievements = unlocked;
    saveProgress(progress);
  }

  return newUnlocks;
}

function getStats() {
  return loadProgress();
}

function getUnlockedAchievements() {
  const progress = loadProgress();
  return progress.achievements || [];
}

function resetProgress() {
  try {
    globalThis.localStorage?.removeItem(STORAGE_KEY);
  } catch {}
}

module.exports = {
  loadProgress,
  saveProgress,
  unlockNext,
  updateStats,
  checkAchievements,
  getStats,
  getUnlockedAchievements,
  resetProgress,
  ACHIEVEMENT_DEFINITIONS,
  ACHIEVEMENT_IDS,
};
