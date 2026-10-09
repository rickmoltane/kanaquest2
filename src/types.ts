export type ExerciseType = 
  | 'hiragana-to-romaji' 
  | 'romaji-to-hiragana' 
  | 'word-romaji-to-hiragana' 
  | 'word-hiragana-to-romaji'
  | 'hiragana-drawing';

export interface HiraganaChar {
  kana: string;
  romaji: string;
  row: 'vowel' | 'k' | 's' | 't' | 'n' | 'h' | 'm' | 'y' | 'r' | 'w';
  rowName: string;
  hint?: string;
}

export interface EverydayWord {
  id: string;
  romaji: string;
  kana: string;
  english: string;
  category: string;
  iconName: string;
  isFromTextbook?: boolean;
}

export interface QuizQuestion {
  questionNumber: number; // 1 to 10
  character?: HiraganaChar;
  word?: EverydayWord;
  prompt: string;
  promptType: 'kana' | 'romaji';
  options: string[]; // exactly 3 options
  correctOption: string;
  secondaryPrompt?: string; // e.g. Romaji or Kana display when picture is shown
}

export interface AnswerRecord {
  character?: HiraganaChar;
  word?: EverydayWord;
  selectedOption: string;
  correctOption: string;
  isCorrect: boolean;
  timeTakenMs: number;
}

export interface QuizResult {
  id: string;
  userId: string;
  exerciseType: ExerciseType;
  score: number; // e.g. 8 out of 10
  totalQuestions: number; // 10
  percentage: number; // 80%
  timeSpentSeconds: number;
  createdAt: string;
  items?: {
    kana: string;
    romaji: string;
    selected: string;
    correct: string;
    isCorrect: boolean;
  }[];
}

export interface UserProfile {
  userId: string;
  email?: string;
  displayName?: string;
  totalQuizzes: number;
  totalAnswers: number;
  totalCorrect: number;
  streakDays: number;
  lastActiveAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CharacterMastery {
  [kana: string]: {
    attempts: number;
    correct: number;
    accuracy: number;
    lastPracticed: string;
  };
}
