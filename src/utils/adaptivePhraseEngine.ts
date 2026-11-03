import { 
  ExchangeItem, 
  ExchangeQuizQuestion, 
  ExchangeOption, 
  EXCHANGE_DATA,
  getQuestionDistractors 
} from '../data/exchangeData';
import { 
  getPhraseMastery, 
  getRecentPhrases, 
  recordRecentPhrases,
  getActiveMistakes
} from '../services/storageService';
import { getSpriteIdForItem } from '../data/spriteSheetData';
import { shuffleArray } from '../data/hiraganaData';

/**
 * Calculates adaptive weight and status for a phrase item.
 * User requirement:
 * - Brand NEW phrases (0 attempts) have EQUAL TOP PRIORITY (weight 350) alongside Active Mistakes.
 * - Mastered phrases (answered correctly 3+ times consecutively) are suppressed for 3-4 days on cooldown.
 */
export function getPhraseAdaptiveProfile(item: ExchangeItem): {
  weight: number;
  status: 'unseen' | 'needs_practice' | 'proven' | 'review';
} {
  const mastery = getPhraseMastery();
  const recent = getRecentPhrases();
  const activeMistakes = getActiveMistakes();
  const rec = mastery[item.id];
  const isMistake = activeMistakes.includes(item.id);

  // 1. EQUAL TOP PRIORITY TIER A: Active mistakes and phrases with recent errors
  if (isMistake || (rec && ((rec.consecutiveMistakes ?? 0) > 0 || rec.consecutiveCorrect === 0 || rec.accuracy < 70 || rec.lastAnswerCorrect === false))) {
    const mistakeBonus = (rec?.mistakesCount ?? 1) * 50;
    return {
      weight: 350 + mistakeBonus,
      status: 'needs_practice',
    };
  }

  // 2. EQUAL TOP PRIORITY TIER B: Brand NEW phrases (0 attempts - Curriculum Discovery)
  // Dedicated high-priority bucket: same priority as Active Mistakes
  if (!rec || rec.attempts === 0) {
    const isRecent = recent.includes(item.id);
    return {
      weight: isRecent ? 250 : 350,
      status: 'unseen',
    };
  }

  // 3. Mastered phrases: deferred on a 3-4 day spaced repetition cooldown
  if (rec.consecutiveCorrect >= 3 || (rec.correct >= 4 && rec.accuracy >= 80)) {
    const lastPracticedMs = new Date(rec.lastPracticed).getTime();
    const daysSince = !isNaN(lastPracticedMs) 
      ? (Date.now() - lastPracticedMs) / (1000 * 60 * 60 * 24)
      : 5;

    if (daysSince < 3) {
      // Defer for 3-4 days so learner focuses on fresh phrases and mistakes
      return {
        weight: 0.1,
        status: 'proven',
      };
    } else {
      // 3 to 4+ days have passed: re-enter review pool for occasional spaced retention check
      return {
        weight: 15,
        status: 'review',
      };
    }
  }

  // 4. Developing / 1-2 attempts
  const isRecent = recent.includes(item.id);
  return {
    weight: isRecent ? 25 : 60,
    status: 'review',
  };
}

/**
 * Weighted random pick from an array of items with weights
 */
function weightedSample<T>(candidates: { item: T; weight: number }[]): T {
  const totalWeight = candidates.reduce((sum, c) => sum + Math.max(0.1, c.weight), 0);
  let random = Math.random() * totalWeight;

  for (const c of candidates) {
    const w = Math.max(0.1, c.weight);
    if (random < w) {
      return c.item;
    }
    random -= w;
  }
  return candidates[0].item;
}

/**
 * Generates an adaptive, highly varied 10-question quiz for Exercise 6 & 7:
 * 1. DEDICATED BRAND NEW PHRASES BUCKET:
 *    Shares equal top priority alongside Active Mistakes (up to 8 slots combined!).
 *    If user has 0 mistakes, up to 8 brand new dialogue phrases are presented.
 * 2. DEDICATED ACTIVE MISTAKES BUCKET:
 *    Any phrase missed is drilled immediately.
 * 3. STRICT SEMANTIC PATTERN DIVERSITY:
 *    Ensures NO two questions in the same session share the same pattern.
 * 4. SUBJECT & SCENE DIVERSITY:
 *    Varies subjects and visual sprite scenes.
 * 5. ADAPTIVE SPACED REPETITION:
 *    Suppresses mastered phrases (3+ correct answers) for 3-4 days.
 * 6. BIDIRECTIONAL PRACTICE:
 *    Alternates ~50% Question -> Reply and ~50% Statement/Reply -> Question.
 */
export function generateAdaptiveExchangeQuiz(
  mode: 'romaji' | 'hiragana',
  count = 10
): ExchangeQuizQuestion[] {
  const isRomaji = mode === 'romaji';
  const recentPhrases = getRecentPhrases();

  // Profile all items in the exchange curriculum
  const allProfiles = EXCHANGE_DATA.map((item) => ({
    item,
    profile: getPhraseAdaptiveProfile(item),
    pattern: item.semanticPattern || item.category,
    sprite: getSpriteIdForItem(item),
    subject: item.subjectEntity || 'general',
  }));

  // Partition into distinct pedagogical pools
  const mistakePool = allProfiles.filter((p) => p.profile.status === 'needs_practice');
  const brandNewPool = allProfiles.filter((p) => p.profile.status === 'unseen');
  const reviewPool = allProfiles.filter((p) => p.profile.status === 'review');
  const masteredPool = allProfiles.filter((p) => p.profile.status === 'proven');

  const selectedItems: { item: ExchangeItem; status: 'unseen' | 'needs_practice' | 'proven' | 'review' }[] = [];
  const usedPatterns = new Set<string>();
  const usedSprites = new Set<string>();
  const usedIds = new Set<string>();
  const subjectCounts: Record<string, number> = {};

  const tryAddItem = (entry: typeof allProfiles[0], enforcePattern = true): boolean => {
    if (usedIds.has(entry.item.id) || selectedItems.length >= count) return false;
    if (enforcePattern && usedPatterns.has(entry.pattern)) return false;

    usedIds.add(entry.item.id);
    usedPatterns.add(entry.pattern);
    usedSprites.add(entry.sprite);
    if (entry.subject) {
      subjectCounts[entry.subject] = (subjectCounts[entry.subject] || 0) + 1;
    }

    selectedItems.push({
      item: entry.item,
      status: entry.profile.status,
    });
    return true;
  };

  // Helper to pick candidates with diversity weighting
  const pickDiverseCandidates = (pool: typeof allProfiles, targetQuota: number) => {
    // Shuffle pool to explore different areas
    const poolCopy = shuffleArray([...pool]);
    for (const entry of poolCopy) {
      if (selectedItems.length >= count) break;
      if (pool === brandNewPool && selectedItems.filter(s => s.status === 'unseen').length >= targetQuota) break;
      if (pool === mistakePool && selectedItems.filter(s => s.status === 'needs_practice').length >= targetQuota) break;

      // Penalize overused subjects or repeated visual sprites
      if ((subjectCounts[entry.subject] || 0) >= 2) continue;
      tryAddItem(entry, true);
    }
  };

  // --- EQUAL TOP PRIORITY TIERS: BRAND NEW PHRASES & ACTIVE MISTAKES ---
  const targetMistakeCount = Math.min(4, mistakePool.length);
  // Dynamic spillover: If fewer mistakes, remaining top-priority slots go directly to brand new phrases!
  const targetBrandNewCount = Math.min(
    brandNewPool.length,
    Math.max(4, count - 2 - targetMistakeCount)
  );

  // 1. Pick from Brand NEW Phrases bucket
  pickDiverseCandidates(brandNewPool, targetBrandNewCount);

  // 2. Pick from Active Mistakes bucket
  pickDiverseCandidates(mistakePool, targetMistakeCount);

  // 3. Pick from Spaced Review bucket (1-2 slots)
  pickDiverseCandidates(reviewPool, 2);

  // --- FILL REMAINING SLOTS (Strict pattern diversity first, then relax if pool exhausted) ---
  if (selectedItems.length < count) {
    // More brand new phrases
    for (const entry of shuffleArray(brandNewPool)) {
      if (selectedItems.length >= count) break;
      tryAddItem(entry, true);
    }
  }
  if (selectedItems.length < count) {
    // More mistakes
    for (const entry of shuffleArray(mistakePool)) {
      if (selectedItems.length >= count) break;
      tryAddItem(entry, true);
    }
  }
  if (selectedItems.length < count) {
    // More review
    for (const entry of shuffleArray(reviewPool)) {
      if (selectedItems.length >= count) break;
      tryAddItem(entry, true);
    }
  }

  // Relax pattern constraint only if needed to fulfill count
  if (selectedItems.length < count) {
    for (const entry of shuffleArray([...brandNewPool, ...mistakePool, ...reviewPool])) {
      if (selectedItems.length >= count) break;
      tryAddItem(entry, false);
    }
  }

  // Absolute last resort: non-recent mastered items
  if (selectedItems.length < count) {
    const nonRecentMastered = masteredPool.filter((p) => !recentPhrases.includes(p.item.id));
    const usableMastered = nonRecentMastered.length > 0 ? nonRecentMastered : masteredPool;
    for (const entry of shuffleArray(usableMastered)) {
      if (selectedItems.length >= count) break;
      tryAddItem(entry, false);
    }
  }

  // Record selected IDs into recent memory (mistakes are exempted from cooldown in recordRecentPhrases)
  recordRecentPhrases(selectedItems.map((s) => s.item.id));

  // 3. Transform to ExchangeQuizQuestion with Bidirectional balancing
  return selectedItems.map((entry, index) => {
    const item = entry.item;

    // Reverse eligibility: question inquiry or standard daily dialogue
    const isEligibleForReverse = 
      item.promptRomaji.endsWith('ka?') || 
      item.promptRomaji.endsWith('ka') || 
      item.promptHiragana.endsWith('か？') || 
      item.promptHiragana.endsWith('か') ||
      item.category === 'age-numbers' ||
      item.category === 'countries-origin' ||
      item.category === 'languages' ||
      item.category === 'places-work' ||
      item.category === 'occupations' ||
      item.category === 'time-days' ||
      item.category === 'demonstratives' ||
      item.category === 'daily-inquiry' ||
      item.category === 'food-drinks' ||
      item.category === 'dining-preferences';

    // Mix bidirectional practice: indices 1, 3, 5, 7, 9 test Answer -> Question
    const isReverse = isEligibleForReverse && (index % 2 === 1);

    if (isReverse) {
      // REVERSE DIRECTION: Prompt is THE ANSWER TO A QUESTION -> user chooses THE QUESTION
      const correctOption: ExchangeOption = {
        text: isRomaji ? item.promptRomaji : item.promptHiragana,
        hiraganaAudio: item.promptHiragana,
        isCorrect: true,
        englishMeaning: item.englishMeaning,
      };

      const qDistractors = getQuestionDistractors(item);
      const distractorOptions: ExchangeOption[] = qDistractors.map((d) => ({
        text: isRomaji ? d.romaji : d.hiragana,
        hiraganaAudio: d.hiragana,
        isCorrect: false,
        englishMeaning: d.english,
      }));

      const allOptions = [correctOption, ...distractorOptions].sort(() => 0.5 - Math.random());
      const correctIndex = allOptions.findIndex((opt) => opt.isCorrect);

      // Build meaningful English translated meanings for Section 2 (Meaning answer buttons)
      const correctMeaning = item.englishMeaning;
      const otherItems = EXCHANGE_DATA.filter((it) => it.id !== item.id);
      const candidateMeanings = otherItems
        .map((it) => it.englishMeaning)
        .filter((m): m is string => Boolean(m) && m.trim() !== '' && m !== correctMeaning);
      const uniqueCandidateMeanings = Array.from(new Set(candidateMeanings));
      const shuffledMeanings = shuffleArray(uniqueCandidateMeanings);
      const mDistractor1 = shuffledMeanings[0] || 'Where do you work?';
      const mDistractor2 = shuffledMeanings[1] || 'Are you a teacher?';

      let meaningOptions = shuffleArray([correctMeaning, mDistractor1, mDistractor2]);
      if (meaningOptions.indexOf(correctMeaning) === correctIndex && meaningOptions.length > 1) {
        meaningOptions = [meaningOptions[1], meaningOptions[2], meaningOptions[0]];
      }

      return {
        questionNumber: index + 1,
        item,
        direction: 'reply-to-question',
        directionBadge: 'Statement / Reply → Which question was asked?',
        directionInstruction: 'Select the Japanese question that leads to this reply',
        prompt: isRomaji ? item.correctRomaji : item.correctHiragana,
        promptAudio: item.correctHiragana,
        promptEnglish: item.correctEnglish,
        secondaryPrompt: item.correctEnglish,
        categoryLabel: item.categoryLabel,
        situationTitle: item.situationTitle,
        options: allOptions,
        correctOptionIndex: correctIndex,
        meaningOptions,
        correctMeaning,
        adaptiveStatus: entry.status,
        spriteId: getSpriteIdForItem(item),
      };
    } else {
      // STANDARD DIRECTION: Prompt is THE QUESTION -> user chooses THE REPLY
      const correctOption: ExchangeOption = {
        text: isRomaji ? item.correctRomaji : item.correctHiragana,
        hiraganaAudio: item.correctHiragana,
        isCorrect: true,
        englishMeaning: item.correctEnglish,
      };

      const distractorOptions: ExchangeOption[] = item.distractors.map((d) => ({
        text: isRomaji ? d.romaji : d.hiragana,
        hiraganaAudio: d.hiragana,
        isCorrect: false,
        englishMeaning: d.english,
      }));

      const allOptions = [correctOption, ...distractorOptions].sort(() => 0.5 - Math.random());
      const correctIndex = allOptions.findIndex((opt) => opt.isCorrect);

      // Build meaningful English translated meanings for Section 2 (Meaning answer buttons)
      const correctMeaning = item.correctEnglish;
      const otherItems = EXCHANGE_DATA.filter((it) => it.id !== item.id);
      const candidateMeanings = otherItems
        .map((it) => it.correctEnglish)
        .filter((m): m is string => Boolean(m) && m.trim() !== '' && m !== correctMeaning);
      const uniqueCandidateMeanings = Array.from(new Set(candidateMeanings));
      const shuffledMeanings = shuffleArray(uniqueCandidateMeanings);
      const mDistractor1 = shuffledMeanings[0] || 'I work at a company.';
      const mDistractor2 = shuffledMeanings[1] || 'Yes, I am a student.';

      let meaningOptions = shuffleArray([correctMeaning, mDistractor1, mDistractor2]);
      if (meaningOptions.indexOf(correctMeaning) === correctIndex && meaningOptions.length > 1) {
        meaningOptions = [meaningOptions[1], meaningOptions[2], meaningOptions[0]];
      }

      return {
        questionNumber: index + 1,
        item,
        direction: 'question-to-reply',
        directionBadge: 'Question asked → Choose the correct reply',
        directionInstruction: 'Select the appropriate Japanese reply to this question',
        prompt: isRomaji ? item.promptRomaji : item.promptHiragana,
        promptAudio: item.promptHiragana,
        promptEnglish: item.englishMeaning,
        secondaryPrompt: item.englishMeaning,
        categoryLabel: item.categoryLabel,
        situationTitle: item.situationTitle,
        options: allOptions,
        correctOptionIndex: correctIndex,
        meaningOptions,
        correctMeaning,
        adaptiveStatus: entry.status,
        spriteId: getSpriteIdForItem(item),
      };
    }
  });
}
