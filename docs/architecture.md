# 键盘跑酷 — 架构文档

## 1. 系统概览

键盘跑酷是一款打字练习游戏，通过游戏化的方式帮助用户提升打字技能。游戏包含两个主要模式：**跑酷模式**（按键跳跃）和**单词模式**（边打字边记单词）。

### 技术栈

| 技术 | 用途 |
|------|------|
| 原生 JavaScript | 游戏逻辑和渲染 |
| Canvas API | 游戏画面渲染 |
| Web Audio API | 背景音乐和音效 |
| localStorage | 进度和成就持久化 |
| Jest | 单元测试 |

### 项目结构

```
keyboard-practice/
├── index.html          # 主游戏入口（UI + 游戏逻辑）
├── src/
│   ├── constants.js    # 常量定义
│   ├── game.js         # 游戏核心逻辑（模块化）
│   └── progress.js     # 进度和成就系统
├── data/
│   └── words.json     # 单词数据源
├── tests/              # Jest 单元测试
└── docs/
    └── architecture.md  # 本文档
```

---

## 2. 核心模块

### 2.1 constants.js — 常量定义

**职责**：定义游戏中使用的所有静态数据。

```javascript
// 指法区域映射
FINGER_ZONES: { zoneId → { name, keys[], color } }

// 键盘键反向映射
KEY_MAP: { key → { zone, color, name } }

// 关卡定义
LESSONS: [{ id, name, keys[], duration, speed, bg1, bg2, ground }]

// 单词列表
WORD_LISTS: { categoryId → { name, color, words[] } }
```

**导出**：`FINGER_ZONES`, `KEY_MAP`, `LESSONS`, `WORD_LISTS`

### 2.2 game.js — 游戏核心逻辑

**职责**：处理游戏状态、障碍物生成、物理计算。

```javascript
// 状态管理
state: 'idle' | 'playing' | 'ended'
currentLessonIndex: number
score: number
combo: number
maxCombo: number

// 核心函数
currentLesson() → LESSONS[index]
setLesson(index)
setState(newState)
resetState()

calculateSpeed(dt) → speed  // 根据时间进度计算速度
spawnObstacle(canvasWidth) → obstacle
update(dt, canvasWidth, runnerX, groundY) → gameState

// 连击倍数
getComboMultiplier(combo) → 1.0 | 1.2 | 1.5 | 2.0 | 2.5 | 3.0 | 4.0
```

**导出函数**：26个（用于单元测试）

### 2.3 progress.js — 进度和成就系统

**职责**：管理用户进度、成就解锁和 localStorage 持久化。

```javascript
// 存储结构
{
  unlocked: number,        // 已解锁关卡数
  bestAccuracy: {},      // 每关最佳准确率
  achievements: [],      // 已解锁成就ID列表
  maxCombo: number,      // 历史最大连击
  perfectCount: number, // 完美通关次数
  maxWPM: number,       // 历史最高WPM
  wordsTyped: number,    // 单词模式打字数
  totalKeys: number,    // 累计按键数
}

// 成就定义（9个）
const ACHIEVEMENTS = {
  firstWin: '完成第一个关卡',
  combo10: '达成10连击',
  combo20: '达成20连击',
  combo50: '达成50连击',
  perfect: '准确率100%通关',
  speedDemon: 'WPM超过40',
  wordMaster: '单词模式通关100词',
  marathon: '累计完成500个按键',
  allLessons: '通关所有练习关卡',
};
```

**导出函数**：`loadProgress`, `saveProgress`, `unlockNext`, `updateStats`, `checkAchievements`, `getStats`, `getUnlockedAchievements`, `resetProgress`

---

## 3. 数据流

### 3.1 游戏主循环

```
用户输入 → handleKeyPress()
    ↓
normalizeKey(e) → 标准化按键
    ↓
检查 expected key
    ├─ 正确 → combo++, score += 10 * multiplier
    │        showComboText(combo) if combo % 5 === 0
    │        playSound('key')
    │        updateHUD()
    │        检查是否完成单词/障碍 → nextObstacle()
    │
    └─ 错误 → combo = 0
             runner.stumbling = true
             spawnParticles('#ff4444')
             document.body.classList.add('shake')
             playSound('hit')
```

### 3.2 进度保存

```
游戏结束 → calculateAccuracy()
    ↓
unlockNext(currentIndex, accuracy)
    ↓
checkAchievements(stats)
    ↓
saveProgress(progress) → localStorage
    ↓
showAchievementUnlock() → 通知新解锁成就
```

### 3.3 单词模式数据流

```
selectWordCategory(categoryId)
    ↓
WORD_LISTS[categoryId] → 加载单词列表
    ↓
buildWordCategorySelect() → 显示关卡选择
    ↓
startGame() → 进入游戏循环
    ↓
handleWordInput(key) → 逐字验证
    ↓
currentWord 完成 → score += 50 * multiplier
                   nextWordObstacle()
```

---

## 4. 游戏机制详解

### 4.1 速度递增

```javascript
function calculateSpeed(dt) {
  const progress = 1 - (timeLeft / lesson.duration);
  speedMultiplier = 1 + (progress * 0.5);
  return lesson.speed * speedMultiplier;
}
```

- 开始：基础速度（1.0x）
- 结束：基础速度 × 1.5
- 曲线：线性递增

### 4.2 连击倍数系统

| 连击数 | 倍数 | 显示文本 |
|--------|------|----------|
| 0-4 | 1.0x | - |
| 5-9 | 1.0x | NICE! |
| 10-14 | 1.2x | GREAT! |
| 15-19 | 1.5x | AMAZING! |
| 20-24 | 2.0x | PERFECT! |
| 25-29 | 2.5x | LEGENDARY! |
| 30-49 | 3.0x | GODLIKE! |
| ≥50 | 4.0x | UNSTOPPABLE! |

**分数计算**：
- 每键：`10 × multiplier`
- 完成单词：`50 × multiplier`

### 4.3 障碍物系统

```javascript
obstacle = {
  x: number,      // 位置
  key: string,   // 要按的键
  zone: string,  // 指法区域
  color: string, // 显示颜色
  name: string,  // 区域名称
  cleared: boolean,
}
```

- 屏幕外生成（`x = canvasWidth + 40`）
- 以 `effectiveSpeed` 向左移动
- 错过（`x < runnerX - 30`）→ combo 重置

### 4.4 关卡解锁

```javascript
unlockNext(currentIndex, accuracy) {
  if (accuracy >= 60) {
    progress.unlocked = currentIndex + 2;
  }
}
```

- 准确率 ≥ 60% 解锁下一关
- 记录每关最佳准确率

---

## 5. 成就系统

### 5.1 解锁条件

| 成就ID | 条件 | 图标 |
|--------|------|------|
| firstWin | 完成1个关卡 | 🎯 |
| combo10 | maxCombo ≥ 10 | 🔥 |
| combo20 | maxCombo ≥ 20 | 👑 |
| combo50 | maxCombo ≥ 50 | 💎 |
| perfect | perfectCount ≥ 1 | ⭐ |
| speedDemon | maxWPM ≥ 40 | ⚡ |
| wordMaster | wordsTyped ≥ 100 | 📚 |
| marathon | totalKeys ≥ 500 | 🏃 |
| allLessons | completedLessons ≥ 6 | 🏆 |

### 5.2 通知机制

```javascript
showAchievementUnlock(ach) {
  创建 toast 元素
  添加 'show' 类触发动画
  3秒后移除
  播放 achievement 音效
}
```

---

## 6. 音频系统

### 6.1 Web Audio API

```javascript
function playSound(type) {
  // 生成指定频率和持续时间的音调
  oscillator.frequency.value = note;
  oscillator.connect(gainNode);
}
```

### 6.2 音效类型

| 类型 | 频率 | 用途 |
|------|------|------|
| key | 880Hz | 正确按键 |
| hit | 220Hz | 错误按键 |
| combo | 1760Hz | 连击里程碑 |
| achievement | 1320Hz | 解锁成就 |

### 6.3 背景音乐

```javascript
const MELODY = [
  { note: 523, dur: 0.3 },  // C5
  { note: 659, dur: 0.3 },  // E5
  // ...
];
// 每0.3秒切换音符循环播放
```

---

## 7. 数据持久化

### 7.1 localStorage 结构

```javascript
const STORAGE_KEY = 'kb-runner-progress';

// 读取
JSON.parse(localStorage.getItem(STORAGE_KEY))

// 写入
localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
```

### 7.2 进度重置

```javascript
function resetProgress() {
  localStorage.removeItem(STORAGE_KEY);
}
```

---

## 8. 测试覆盖

### 8.1 测试文件

| 文件 | 测试数 | 覆盖范围 |
|------|--------|----------|
| constants.test.js | 19 | FINGER_ZONES, KEY_MAP, LESSONS, WORD_LISTS |
| game.test.js | 51 | 游戏逻辑、速度计算、障碍物管理 |
| progress.test.js | 42 | 进度管理、成就系统 |

### 8.2 运行测试

```bash
npm test
# 输出：Tests: 112 passed, 112 total
```

---

## 9. API 接口

### 9.1 game.js 导出

```javascript
module.exports = {
  currentLesson, setLesson, setState, resetState,
  calculateSpeed, spawnObstacle, update,
  getNextObstacle, clearObstacle, missObstacle,
  calculateAccuracy, normalizeKey,
  LESSONS, KEY_MAP,
  getObstacles, getTimeLeft, setTimeLeft,
  getCombo, getScore, getMaxCombo,
  getNextObstacleIn, setNextObstacleIn,
  getComboMultiplier,
};
```

### 9.2 progress.js 导出

```javascript
module.exports = {
  loadProgress, saveProgress, unlockNext,
  updateStats, checkAchievements,
  getStats, getUnlockedAchievements, resetProgress,
  ACHIEVEMENT_DEFINITIONS,
};
```

---

## 10. 配置常量

### 10.1 键盘指法区

| 区域ID | 名称 | 按键 | 颜色 |
|--------|------|------|------|
| lp | 左小指 | a, q, z, 1 | #ff6b6b |
| lr | 左无名指 | s, w, x, 2 | #ffa06b |
| lm | 左中指 | d, e, c, 3 | #ffd93d |
| li | 左食指 | f, r, v, 4, 5, g, t, b | #53d769 |
| ri | 右食指 | h, y, n, 6, 7, j, u, m | #4ecdc4 |
| rm | 右中指 | k, i, ,, 8 | #45b7d1 |
| rr | 右无名指 | l, o, ., 9 | #9b59b6 |
| rp | 右小指 | ;, p, /, 0 | #e84393 |

### 10.2 关卡配置

| ID | 名称 | 持续时间 | 基础速度 |
|----|------|----------|----------|
| home-row | 基准键 | 60s | 1.5 |
| home-top | 基准+上排 | 60s | 1.6 |
| top-row | 上排键 | 60s | 1.7 |
| home-top-full | 综合 | 70s | 1.8 |
| bottom-row | 下排键 | 60s | 1.7 |
| all-rows | 全键盘 | 90s | 2.0 |

---

## 11. 版本历史

| 版本 | 变更 |
|------|------|
| v1.0 | 初始版本，跑酷模式 |
| v1.1 | 添加单词模式，6种词汇分类 |
| v1.2 | 提取单词数据到 data/words.json |
| v1.3 | 添加连击倍数系统 |
| v1.4 | 添加成就系统（9个成就） |
| v1.5 | 提升测试覆盖率至112个测试 |

---

*文档版本: 1.5.0*
*最后更新: 2026-05-11*
