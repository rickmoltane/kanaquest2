import { 
  HiraganaChar, 
  EverydayWord, 
  QuizQuestion, 
  ExerciseType, 
  CharacterMastery 
} from '../types';
import { HIRAGANA_CHARACTERS, shuffleArray } from '../data/hiraganaData';
import { EVERYDAY_WORDS } from '../data/everydayWordsData';
import { 
  getLocalMastery, 
  getRecentCharacters, 
  recordRecentCharacters, 
  getRecentWords, 
  recordRecentWords,
  getActiveMistakes
} from '../services/storageService';

/**
 * Categorizes an item based on user mastery:
 * - 'needs_practice': Currently in active mistakes queue, last answer incorrect, or accuracy < 75%.
 * - 'unseen': 0 attempts (completely unfamiliar / fresh).
 * - 'review': 1-2 attempts or moderate accuracy (needs retention check).
 * - 'proven': Answered correctly >= 2 times with high accuracy (mastered / easy).
 */
export function getAdaptiveWeight(key: string, mastery: CharacterMastery): {
  weight: number;
  status: 'unseen' | 'needs_practice' | 'proven' | 'review';
} {
  const stat = mastery[key];
  const activeMistakes = getActiveMistakes();
  const isMistake = activeMistakes.includes(key);

  // 1. EQUAL TOP PRIORITY TIER A: Active mistakes and items with recent errors
  if (isMistake || (stat && (!stat.lastAnswerCorrect || (stat.consecutiveMistakes ?? 0) > 0 || (stat.attempts >= 1 && stat.accuracy < 75)))) {
    const mistakeBonus = (stat?.mistakesCount ?? 1) * 50;
    const accuracyDeficit = stat ? (100 - stat.accuracy) * 2 : 100;
    return { 
      weight: 350 + mistakeBonus + accuracyDeficit, 
      status: 'needs_practice' 
    };
  }

  // 2. EQUAL TOP PRIORITY TIER B: Brand NEW items (0 attempts - Curriculum Discovery)
  // User explicitly requested: "more emphasis on 'new' words/phrases (create a new bucket for those) they should have the same high priority as Active Mistakes"
  if (!stat || stat.attempts === 0) {
    return { weight: 350, status: 'unseen' };
  }

  // 3. One attempt with clean correct answer -> Developing, needs cementing
  if (stat.attempts === 1 && stat.correct === 1) {
    return { weight: 90, status: 'review' };
  }

  // 4. SUPPRESSION OF EASY / MASTERED ITEMS:
  // If user has answered correctly 2+ times consecutively with high accuracy (>= 80%)
  const isMastered = (stat.consecutiveCorrect ?? 0) >= 2 && stat.accuracy >= 80;
  if (isMastered) {
    const lastPracticedMs = stat.lastPracticed ? new Date(stat.lastPracticed).getTime() : 0;
    const daysSince = !isNaN(lastPracticedMs) && lastPracticedMs > 0
      ? (Date.now() - lastPracticedMs) / (1000 * 60 * 60 * 24)
      : 0;

    // Put on 3-day spaced repetition cooldown! Suppress weight near zero so user sees unfamiliar & new items!
    if (daysSince < 3) {
      return { weight: 0.1, status: 'proven' };
    } else {
      // 3+ days elapsed: eligible for occasional retention check
      return { weight: 15, status: 'review' };
    }
  }

  // 5. Developing / moderate accuracy
  return { weight: 60, status: 'review' };
}

/**
 * Intelligent Quota-Based Item Selector:
 * Implements a balanced pedagogical mix:
 * 1. Brand NEW Items Bucket (Target: 4-5 slots, expanding up to 8 slots if mistakes are low!)
 * 2. Active Mistakes & Weak Items Bucket (Target: 4 slots, guaranteed immediate drill)
 * 3. Spaced Review & Developing Bucket (Target: 1-2 slots)
 * Easy/mastered items are suppressed on a 3-day cooldown and never appear unless all fresh & review items are exhausted.
 */
function selectAdaptiveItems<T>(
  allPool: T[],
  getKey: (item: T) => string,
  recentCooldownList: string[],
  count: number,
  mastery: CharacterMastery
): { items: T[]; statuses: Record<string, 'unseen' | 'needs_practice' | 'proven' | 'review'> } {
  const activeMistakes = getActiveMistakes();
  const statuses: Record<string, 'unseen' | 'needs_practice' | 'proven' | 'review'> = {};

  // Classify all items into distinct cognitive pools
  const mistakeWeakPool: T[] = [];
  const brandNewPool: T[] = [];
  const developingPool: T[] = [];
  const reviewPool: T[] = [];
  const masteredPool: T[] = [];

  for (const item of allPool) {
    const key = getKey(item);
    const profile = getAdaptiveWeight(key, mastery);
    statuses[key] = profile.status;

    if (profile.status === 'needs_practice') {
      mistakeWeakPool.push(item);
    } else if (profile.status === 'unseen') {
      brandNewPool.push(item);
    } else if (profile.status === 'proven') {
      masteredPool.push(item);
    } else {
      // Review
      const stat = mastery[key];
      if (stat && stat.attempts === 1) {
        developingPool.push(item);
      } else {
        reviewPool.push(item);
      }
    }
  }

  // Sort mistake pool: items with most mistakes and lowest accuracy first
  mistakeWeakPool.sort((a, b) => {
    const statA = mastery[getKey(a)];
    const statB = mastery[getKey(b)];
    const mistakesA = statA?.mistakesCount ?? (activeMistakes.includes(getKey(a)) ? 2 : 1);
    const mistakesB = statB?.mistakesCount ?? (activeMistakes.includes(getKey(b)) ? 2 : 1);
    if (mistakesB !== mistakesA) return mistakesB - mistakesA;
    return (statA?.accuracy ?? 50) - (statB?.accuracy ?? 50);
  });

  // Randomize brand new items so user continuously explores diverse parts of curriculum
  const shuffledBrandNew = shuffleArray([...brandNewPool]);
  // Filter brand new items against recent cooldown if plenty are available
  const nonRecentBrandNew = shuffledBrandNew.filter(item => !recentCooldownList.includes(getKey(item)));
  const usableBrandNew = nonRecentBrandNew.length >= 4 ? nonRecentBrandNew : shuffledBrandNew;

  // Filter review pool to exclude items in recent cooldown
  const combinedReview = [...shuffleArray(developingPool), ...shuffleArray(reviewPool)];
  const nonRecentReview = combinedReview.filter(item => !recentCooldownList.includes(getKey(item)));
  const usableReview = nonRecentReview.length > 0 ? nonRecentReview : combinedReview;

  const selected: T[] = [];
  const selectedKeys = new Set<string>();

  const tryAdd = (item: T) => {
    const key = getKey(item);
    if (!selectedKeys.has(key) && selected.length < count) {
      selected.push(item);
      selectedKeys.add(key);
      return true;
    }
    return false;
  };

  // --- TOP PRIORITY TIERS (EQUAL WEIGHT): BRAND NEW ITEMS & ACTIVE MISTAKES ---
  // Out of a 10-question quiz, up to 8 slots are dedicated to Brand New + Active Mistakes!
  // Allocate baseline 4 slots to mistakes and baseline 4 slots to brand new items.
  const targetMistakeCount = Math.min(4, mistakeWeakPool.length);
  // Dynamic spillover: If user has fewer mistakes (e.g. 0-2 mistakes), the remaining slots go to Brand NEW items!
  const targetBrandNewCount = Math.min(
    usableBrandNew.length,
    Math.max(4, count - 2 - targetMistakeCount)
  );

  // 1. Add Brand NEW items from dedicated bucket
  for (let i = 0; i < targetBrandNewCount && i < usableBrandNew.length; i++) {
    tryAdd(usableBrandNew[i]);
  }

  // 2. Add Active Mistakes & Weak items from dedicated bucket
  for (let i = 0; i < targetMistakeCount && i < mistakeWeakPool.length; i++) {
    tryAdd(mistakeWeakPool[i]);
  }

  // --- BUCKET 3: SPACED REVIEW & DEVELOPING ITEMS (Target: 1-2 questions) ---
  for (const item of usableReview) {
    if (selected.length >= count - 1) break;
    tryAdd(item);
  }

  // --- FILL ANY REMAINING SLOTS IF NEEDED (Spillover hierarchy) ---
  // Priority: More brand new items -> remaining mistakes -> remaining review -> lastly mastered
  if (selected.length < count) {
    for (const item of usableBrandNew) {
      if (selected.length >= count) break;
      tryAdd(item);
    }
  }
  if (selected.length < count) {
    for (const item of mistakeWeakPool) {
      if (selected.length >= count) break;
      tryAdd(item);
    }
  }
  if (selected.length < count) {
    for (const item of usableReview) {
      if (selected.length >= count) break;
      tryAdd(item);
    }
  }
  // Only as absolute last resort when curriculum has 0 unseen, 0 mistakes, and 0 review
  if (selected.length < count) {
    const nonRecentMastered = masteredPool.filter(item => !recentCooldownList.includes(getKey(item)));
    const usableMastered = nonRecentMastered.length > 0 ? shuffleArray(nonRecentMastered) : shuffleArray(masteredPool);
    for (const item of usableMastered) {
      if (selected.length >= count) break;
      tryAdd(item);
    }
  }

  // Interleave and randomize the selected questions so new items and mistakes are naturally distributed
  return { 
    items: shuffleArray(selected), 
    statuses 
  };
}

const KANA_ROW_FAMILIES: Record<string, string[]> = {
  vowel: ['a', 'i', 'u', 'e', 'o', 'aa', 'ai', 'ou'],
  k: ['ka', 'ki', 'ku', 'ke', 'ko', 'kya', 'kyu', 'kyo'],
  s: ['sa', 'shi', 'su', 'se', 'so', 'sha', 'shu', 'sho'],
  t: ['ta', 'chi', 'tsu', 'te', 'to', 'cha', 'chu', 'cho'],
  n: ['na', 'ni', 'nu', 'ne', 'no', 'nya', 'nyu', 'nyo'],
  h: ['ha', 'hi', 'fu', 'he', 'ho', 'hya', 'hyu', 'hyo'],
  m: ['ma', 'mi', 'mu', 'me', 'mo', 'mya', 'myu', 'myo'],
  y: ['ya', 'yu', 'yo', 'yaa', 'yuu', 'yoo', 'wa', 'wo'],
  r: ['ra', 'ri', 'ru', 're', 'ro', 'rya', 'ryu', 'ryo'],
  w: ['wa', 'wo', 'n', 'waa', 'wi', 'we', 'ya', 'yu'],
};

/**
 * Generates an adaptive, non-repeating Hiragana quiz for Exercise 1:
 * - 6 Options all from the SAME phonetic family (e.g., K-family: ka, ki, ku, ke, ko, kya)
 * - Dedicated Mistake Bucket: Characters missed are immediately reinforced in subsequent quizzes.
 * - Dedicated Discovery Bucket: Unfamiliar / unseen characters are actively prioritized.
 * - Easy / Mastered Characters are suppressed into a 3-day cooldown.
 */
export function generateAdaptiveKanaQuiz(
  exerciseType: 'hiragana-to-romaji' | 'romaji-to-hiragana',
  count = 10,
  targetCharacters = HIRAGANA_CHARACTERS
): QuizQuestion[] {
  const mastery = getLocalMastery();
  const recentKanaList = getRecentCharacters();

  // Select 10 items adaptively using multi-bucket quota architecture
  const { items: selectedChars, statuses } = selectAdaptiveItems(
    targetCharacters,
    c => c.kana,
    recentKanaList,
    count,
    mastery
  );

  // Record selected characters in recent history (intelligent cooldown excludes mistakes)
  recordRecentCharacters(selectedChars.map(c => c.kana));

  // Build quiz questions with 6 family-matched options for Exercise 1
  return selectedChars.map((char, index) => {
    const adaptiveStatus = statuses[char.kana] || 'unseen';

    if (exerciseType === 'hiragana-to-romaji') {
      const correctOption = char.romaji;
      // Get all candidate syllables from the exact same family (all start with same consonant K, S, etc.)
      const familyPool = KANA_ROW_FAMILIES[char.row] || KANA_ROW_FAMILIES.k;
      const distractorCandidates = shuffleArray(familyPool.filter(opt => opt !== correctOption));
      // Select 5 distractors to form exactly 6 options
      const distractors = distractorCandidates.slice(0, 5);
      const options = shuffleArray([correctOption, ...distractors]);

      return {
        questionNumber: index + 1,
        character: char,
        prompt: char.kana,
        promptType: 'kana' as const,
        options,
        correctOption,
        adaptiveStatus,
      };
    } else {
      // Legacy fallback for romaji-to-hiragana
      const pool = HIRAGANA_CHARACTERS.filter(c => c.kana !== char.kana);
      const shuffledPool = shuffleArray(pool);
      const correctOption = char.kana;
      const distractor1 = shuffledPool[0].kana;
      const distractor2 = shuffledPool.find(c => c.kana !== distractor1 && c.kana !== correctOption)?.kana || shuffledPool[1].kana;
      const options = shuffleArray([correctOption, distractor1, distractor2]);

      return {
        questionNumber: index + 1,
        character: char,
        prompt: char.romaji,
        promptType: 'romaji' as const,
        options,
        correctOption,
        adaptiveStatus,
      };
    }
  });
}

/**
 * Generates an adaptive Everyday Words quiz for Exercises 3 & 4:
 * - Dedicated Mistake Bucket: Words user struggled with or missed are drilled immediately.
 * - Dedicated Discovery Bucket: Unseen / unfamiliar words from the 147-word curriculum are actively pulled in.
 * - Common/easy words already mastered are suppressed into cooldown.
 * - Decoupled meaning options for dual-selection mode.
 */
export function generateAdaptiveWordQuiz(
  exerciseType: 'word-romaji-to-hiragana' | 'word-hiragana-to-romaji',
  count = 10,
  targetWords = EVERYDAY_WORDS
): QuizQuestion[] {
  const mastery = getLocalMastery();
  const recentWordsList = getRecentWords();

  // Select 10 items adaptively using multi-bucket quota architecture
  const { items: selectedWords, statuses } = selectAdaptiveItems(
    targetWords,
    w => w.kana,
    recentWordsList,
    count,
    mastery
  );

  // Record selected words in recent history
  recordRecentWords(selectedWords.flatMap(w => [w.id, w.kana]));

  // Build quiz questions with length-matched distractors and decoupled meaning options
  return selectedWords.map((word, index) => {
    const sameLengthPool = targetWords.filter(w => w.id !== word.id && w.kana.length === word.kana.length);
    const candidateDistractors = sameLengthPool.length >= 2 ? sameLengthPool : targetWords.filter(w => w.id !== word.id);
    const shuffledPool = shuffleArray(candidateDistractors);
    const adaptiveStatus = statuses[word.kana] || 'unseen';

    const distractorWord1 = shuffledPool[0];
    const distractorWord2 = shuffledPool.find(
      w => w.id !== distractorWord1.id && w.kana !== distractorWord1.kana && w.kana !== word.kana && w.english !== distractorWord1.english && w.english !== word.english
    ) || (shuffledPool[1]?.id !== distractorWord1.id ? shuffledPool[1] : targetWords.find(w => w.id !== word.id && w.id !== distractorWord1.id)!);

    const correctMeaning = word.english;
    // Shuffle the 3 English meanings independently from the written options!
    let meaningOptions = shuffleArray([word.english, distractorWord1.english, distractorWord2.english]);

    if (exerciseType === 'word-romaji-to-hiragana') {
      const correctOption = word.kana;
      const options = shuffleArray([word.kana, distractorWord1.kana, distractorWord2.kana]);

      // Rotate if accidentally aligned at identical index
      if (options.indexOf(correctOption) === meaningOptions.indexOf(correctMeaning) && meaningOptions.length > 1) {
        meaningOptions = [meaningOptions[1], meaningOptions[2], meaningOptions[0]];
      }

      return {
        questionNumber: index + 1,
        word,
        prompt: word.romaji,
        promptType: 'romaji',
        options,
        correctOption,
        meaningOptions,
        correctMeaning,
        adaptiveStatus,
      };
    } else {
      // word-hiragana-to-romaji
      const correctOption = word.romaji;
      const options = shuffleArray([word.romaji, distractorWord1.romaji, distractorWord2.romaji]);

      // Ensure decoupled alignment
      if (options.indexOf(correctOption) === meaningOptions.indexOf(correctMeaning) && meaningOptions.length > 1) {
        meaningOptions = [meaningOptions[1], meaningOptions[2], meaningOptions[0]];
      }

      return {
        questionNumber: index + 1,
        word,
        prompt: word.kana,
        promptType: 'kana',
        options,
        correctOption,
        meaningOptions,
        correctMeaning,
        adaptiveStatus,
      };
    }
  });
}
