import { HiraganaChar, QuizQuestion, ExerciseType } from '../types';

export const HIRAGANA_CHARACTERS: HiraganaChar[] = [
  // Vowels (A-row)
  { kana: 'あ', romaji: 'a', row: 'vowel', rowName: 'A-row', hint: 'Looks like an Apple with a stem' },
  { kana: 'い', romaji: 'i', row: 'vowel', rowName: 'A-row', hint: 'Two Eels swimming side by side' },
  { kana: 'う', romaji: 'u', row: 'vowel', rowName: 'A-row', hint: 'An acrobat diving or person kicked' },
  { kana: 'え', romaji: 'e', row: 'vowel', rowName: 'A-row', hint: 'An Energetic ninja running' },
  { kana: 'お', romaji: 'o', row: 'vowel', rowName: 'A-row', hint: 'A golfer calling "fore!" on the green' },

  // K-row
  { kana: 'か', romaji: 'ka', row: 'k', rowName: 'Ka-row', hint: 'A person dancing the can-can' },
  { kana: 'き', romaji: 'ki', row: 'k', rowName: 'Ka-row', hint: 'A Key with two notches' },
  { kana: 'く', romaji: 'ku', row: 'k', rowName: 'Ka-row', hint: 'A cuckoo bird beak open wide' },
  { kana: 'け', romaji: 'ke', row: 'k', rowName: 'Ka-row', hint: 'A wooden Keg of juice' },
  { kana: 'こ', romaji: 'ko', row: 'k', rowName: 'Ka-row', hint: 'Two Koi fish swimming together' },

  // S-row
  { kana: 'さ', romaji: 'sa', row: 's', rowName: 'Sa-row', hint: 'A samurai sword slashing' },
  { kana: 'し', romaji: 'shi', row: 's', rowName: 'Sa-row', hint: 'A fishing hook dipping in the Sea' },
  { kana: 'す', romaji: 'su', row: 's', rowName: 'Sa-row', hint: 'A spiral Straw in a cup' },
  { kana: 'せ', romaji: 'se', row: 's', rowName: 'Sa-row', hint: 'Two people gossiping: "Say what?"' },
  { kana: 'そ', romaji: 'so', row: 's', rowName: 'Sa-row', hint: 'A zigzag needle Sewing thread' },

  // T-row
  { kana: 'た', romaji: 'ta', row: 't', rowName: 'Ta-row', hint: 'Looks like the letters "ta"' },
  { kana: 'ち', romaji: 'chi', row: 't', rowName: 'Ta-row', hint: 'A Cheerleader doing a jump' },
  { kana: 'つ', romaji: 'tsu', row: 't', rowName: 'Ta-row', hint: 'A Tsunami wave curling' },
  { kana: 'て', romaji: 'te', row: 't', rowName: 'Ta-row', hint: 'A dog wagging its tail' },
  { kana: 'と', romaji: 'to', row: 't', rowName: 'Ta-row', hint: 'A Tornado or thorn in a toe' },

  // N-row
  { kana: 'な', romaji: 'na', row: 'n', rowName: 'Na-row', hint: 'A Nun praying at an altar' },
  { kana: 'に', romaji: 'ni', row: 'n', rowName: 'Na-row', hint: 'A Needle and thread' },
  { kana: 'ぬ', romaji: 'nu', row: 'n', rowName: 'Na-row', hint: 'Chopsticks holding a long Noodle' },
  { kana: 'ね', romaji: 'ne', row: 'n', rowName: 'Na-row', hint: 'A cat curled in a Net' },
  { kana: 'の', romaji: 'no', row: 'n', rowName: 'Na-row', hint: 'A "No entry" circular sign' },

  // H-row
  { kana: 'は', romaji: 'ha', row: 'h', rowName: 'Ha-row', hint: 'A person laughing "Ha-ha!"' },
  { kana: 'ひ', romaji: 'hi', row: 'h', rowName: 'Ha-row', hint: 'A big smile saying "He-he"' },
  { kana: 'ふ', romaji: 'fu', row: 'h', rowName: 'Ha-row', hint: 'Mount Fuji peaking in the clouds' },
  { kana: 'へ', romaji: 'he', row: 'h', rowName: 'Ha-row', hint: 'A pointing arrow up the Hill' },
  { kana: 'ほ', romaji: 'ho', row: 'h', rowName: 'Ha-row', hint: 'A Santa chimney saying "Ho-ho-ho"' },

  // M-row
  { kana: 'ま', romaji: 'ma', row: 'm', rowName: 'Ma-row', hint: 'A smiling Mama with earrings' },
  { kana: 'み', romaji: 'mi', row: 'm', rowName: 'Ma-row', hint: 'Lucky number 21 or Music note' },
  { kana: 'む', romaji: 'mu', row: 'm', rowName: 'Ma-row', hint: 'A cow with horns saying "Moo"' },
  { kana: 'め', romaji: 'me', row: 'm', rowName: 'Ma-row', hint: 'A noodle without the curl (Me = eye)' },
  { kana: 'も', romaji: 'mo', row: 'm', rowName: 'Ma-row', hint: 'A fish hook catching More worms' },

  // Y-row
  { kana: 'や', romaji: 'ya', row: 'y', rowName: 'Ya-row', hint: 'A Yak with long horns' },
  { kana: 'ゆ', romaji: 'yu', row: 'y', rowName: 'Ya-row', hint: 'A unique unicycle wheel' },
  { kana: 'よ', romaji: 'yo', row: 'y', rowName: 'Ya-row', hint: 'A Yo-yo on a finger loop' },

  // R-row
  { kana: 'ら', romaji: 'ra', row: 'r', rowName: 'Ra-row', hint: 'A cheerful Rabbit sitting up' },
  { kana: 'り', romaji: 'ri', row: 'r', rowName: 'Ra-row', hint: 'Two river Reeds or a Ribbon' },
  { kana: 'る', romaji: 'ru', row: 'r', rowName: 'Ra-row', hint: 'A loop holding a Ruby gem' },
  { kana: 'れ', romaji: 're', row: 'r', rowName: 'Ra-row', hint: 'A runner sprinting to the Rest stop' },
  { kana: 'ろ', romaji: 'ro', row: 'r', rowName: 'Ra-row', hint: 'A loop robbed of its ruby (Empty road)' },

  // W-row & N
  { kana: 'わ', romaji: 'wa', row: 'w', rowName: 'Wa/N-row', hint: 'A peaceful swan on the Water' },
  { kana: 'を', romaji: 'wo', row: 'w', rowName: 'Wa/N-row', hint: 'A cheerleader leaping with excitement' },
  { kana: 'ん', romaji: 'n', row: 'w', rowName: 'Wa/N-row', hint: 'Looks like the lowercase letter "n"' },
];

export const HIRAGANA_ROWS = [
  { id: 'vowel', label: 'Vowels (あ い う え お)', chars: ['あ', 'い', 'う', 'え', 'お'] },
  { id: 'k', label: 'K-row (か き く け こ)', chars: ['か', 'き', 'く', 'け', 'こ'] },
  { id: 's', label: 'S-row (さ し す せ そ)', chars: ['さ', 'し', 'す', 'せ', 'そ'] },
  { id: 't', label: 'T-row (た ち つ て と)', chars: ['た', 'ち', 'つ', 'て', 'と'] },
  { id: 'n', label: 'N-row (な に ぬ ね の)', chars: ['な', 'に', 'ぬ', 'ね', 'の'] },
  { id: 'h', label: 'H-row (は ひ ふ へ ほ)', chars: ['は', 'ひ', 'ふ', 'へ', 'ほ'] },
  { id: 'm', label: 'M-row (ま み む め も)', chars: ['ま', 'み', 'む', 'め', 'も'] },
  { id: 'ya', label: 'Y-row (や ゆ よ)', chars: ['や', 'ゆ', 'よ'] },
  { id: 'ra', label: 'R-row (ら り る れ ろ)', chars: ['ら', 'り', 'る', 'れ', 'ろ'] },
  { id: 'wa', label: 'W/N-row (わ を ん)', chars: ['わ', 'を', 'ん'] },
];

/**
 * Fisher-Yates array shuffle helper
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generates a succession of 10 questions with 3 options each (1 correct + 2 distractors).
 */
export function generateQuiz(exerciseType: ExerciseType, count = 10, targetCharacters = HIRAGANA_CHARACTERS): QuizQuestion[] {
  const shuffledCandidates = shuffleArray(targetCharacters);
  // Pick `count` characters
  const selectedChars: HiraganaChar[] = [];
  for (let i = 0; i < count; i++) {
    selectedChars.push(shuffledCandidates[i % shuffledCandidates.length]);
  }

  return selectedChars.map((char, index) => {
    // Generate 2 distractors from pool that are NOT the correct one
    const pool = HIRAGANA_CHARACTERS.filter(c => c.kana !== char.kana);
    const shuffledPool = shuffleArray(pool);

    if (exerciseType === 'hiragana-to-romaji') {
      const correctOption = char.romaji;
      const distractor1 = shuffledPool[0].romaji;
      // ensure distractor 2 is different from distractor 1
      const distractor2 = shuffledPool.find(c => c.romaji !== distractor1 && c.romaji !== correctOption)?.romaji || shuffledPool[1].romaji;
      const options = shuffleArray([correctOption, distractor1, distractor2]);

      return {
        questionNumber: index + 1,
        character: char,
        prompt: char.kana,
        promptType: 'kana' as const,
        options,
        correctOption,
      };
    } else {
      // romaji-to-hiragana
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
      };
    }
  });
}
