const STORAGE_KEY = 'kb-runner-progress';

function loadProgress() {
  try {
    const data = JSON.parse(globalThis.localStorage?.getItem(STORAGE_KEY) || '{}');
    return { unlocked: data.unlocked || 1, bestAccuracy: data.bestAccuracy || {} };
  } catch {
    return { unlocked: 1, bestAccuracy: {} };
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
  saveProgress(progress);
  return progress;
}

module.exports = { loadProgress, saveProgress, unlockNext };