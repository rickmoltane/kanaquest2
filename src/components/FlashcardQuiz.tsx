import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ExerciseType, 
  QuizQuestion, 
  QuizResult, 
  AnswerRecord 
} from '../types';
import { generateQuiz } from '../data/hiraganaData';
import { generateWordQuiz } from '../data/everydayWordsData';
import { speakKana, playSuccessChime, playErrorBuzz } from '../utils/audio';
import { recordImmediateAnswer } from '../services/storageService';
import { 
  Volume2, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  RotateCcw,
  HelpCircle,
  Target,
  Sparkles
} from 'lucide-react';

interface FlashcardQuizProps {
  exerciseType: ExerciseType;
  soundEnabled: boolean;
  onComplete: (result: QuizResult) => void;
  onCancel: () => void;
}

export const FlashcardQuiz: React.FC<FlashcardQuizProps> = ({
  exerciseType,
  soundEnabled,
  onComplete,
}) => {
  const isWordExercise = exerciseType === 'word-romaji-to-hiragana' || exerciseType === 'word-hiragana-to-romaji';

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedMeaning, setSelectedMeaning] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [startTime] = useState<number>(Date.now());
  const questionStartTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize or restart quiz with 10 questions
  const startNewQuiz = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    let newQuestions: QuizQuestion[] = [];
    if (isWordExercise) {
      newQuestions = generateWordQuiz(exerciseType as 'word-romaji-to-hiragana' | 'word-hiragana-to-romaji', 10);
    } else {
      newQuestions = generateQuiz(exerciseType, 10);
    }

    setQuestions(newQuestions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setSelectedMeaning(null);
    setIsAnswered(false);
    setAnswers([]);
    setShowHint(false);
    questionStartTimeRef.current = Date.now();
  }, [exerciseType, isWordExercise]);

  useEffect(() => {
    startNewQuiz();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [startNewQuiz]);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    setShowHint(false);
    setSelectedOption(null);
    setSelectedMeaning(null);
    setIsAnswered(false);
    questionStartTimeRef.current = Date.now();
  }, [currentIndex]);

  const getTargetSpeechText = useCallback(() => {
    if (!currentQuestion) return '';
    if (currentQuestion.word) {
      return currentQuestion.word.kana;
    }
    if (currentQuestion.character) {
      return currentQuestion.character.kana;
    }
    return '';
  }, [currentQuestion]);

  const handleAdvance = useCallback((currentAnswersList?: AnswerRecord[]) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const answersToUse = currentAnswersList || answers;

    if (currentIndex < 9) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setSelectedMeaning(null);
      setIsAnswered(false);
      setShowHint(false);
      questionStartTimeRef.current = Date.now();
    } else {
      // Quiz finished (10 questions completed)
      const correctCount = answersToUse.filter(a => a.isCorrect).length;
      const totalTimeSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));
      const percentage = Math.round((correctCount / 10) * 100);

      const quizResult: QuizResult = {
        id: `quiz_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        userId: 'local',
        exerciseType,
        score: correctCount,
        totalQuestions: 10,
        percentage,
        timeSpentSeconds: totalTimeSeconds,
        createdAt: new Date().toISOString(),
        items: answersToUse.map(a => ({
          kana: a.word ? a.word.kana : (a.character?.kana || ''),
          romaji: a.word ? a.word.romaji : (a.character?.romaji || ''),
          selected: a.selectedMeaning ? `${a.selectedOption} (${a.selectedMeaning})` : a.selectedOption,
          correct: a.correctMeaning ? `${a.correctOption} (${a.correctMeaning})` : a.correctOption,
          isCorrect: a.isCorrect,
        })),
      };

      onComplete(quizResult);
    }
  }, [currentIndex, answers, startTime, exerciseType, onComplete]);

  // Dual-selection evaluation for Exercises 3 & 4 (Word exercises)
  const evaluateDualAnswer = useCallback((writtenChoice: string, meaningChoice: string) => {
    if (isAnswered || !currentQuestion) return;

    const isWrittenCorrect = writtenChoice === currentQuestion.correctOption;
    const isMeaningCorrect = meaningChoice === currentQuestion.correctMeaning;
    const isOverallCorrect = isWrittenCorrect && isMeaningCorrect;

    setIsAnswered(true);

    const timeTakenMs = Date.now() - questionStartTimeRef.current;
    const newAnswer: AnswerRecord = {
      character: currentQuestion.character,
      word: currentQuestion.word,
      selectedOption: writtenChoice,
      correctOption: currentQuestion.correctOption,
      selectedMeaning: meaningChoice,
      correctMeaning: currentQuestion.correctMeaning,
      isCorrect: isOverallCorrect,
      timeTakenMs,
    };

    const nextAnswers = [...answers, newAnswer];
    setAnswers(nextAnswers);

    const speechTarget = currentQuestion.word?.kana || currentQuestion.character?.kana;
    if (speechTarget) {
      recordImmediateAnswer(speechTarget, isOverallCorrect);
      if (currentQuestion.word?.id) {
        recordImmediateAnswer(currentQuestion.word.id, isOverallCorrect);
      }
    }

    if (soundEnabled) {
      if (isOverallCorrect) {
        playSuccessChime();
      } else {
        playErrorBuzz();
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          try {
            navigator.vibrate([45, 60, 45]);
          } catch (e) {
            // ignore
          }
        }
      }
      if (speechTarget) {
        setTimeout(() => {
          speakKana(speechTarget);
        }, isOverallCorrect ? 180 : 360);
      }
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    if (isOverallCorrect) {
      timerRef.current = setTimeout(() => {
        handleAdvance(nextAnswers);
      }, 1300);
    }
  }, [isAnswered, currentQuestion, answers, soundEnabled, handleAdvance]);

  // Single-selection evaluation for Exercises 1 & 2 (Hiragana / Romaji single char)
  const evaluateSingleAnswer = useCallback((option: string) => {
    if (isAnswered || !currentQuestion) return;

    const isCorrect = option === currentQuestion.correctOption;
    setSelectedOption(option);
    setIsAnswered(true);

    const timeTakenMs = Date.now() - questionStartTimeRef.current;
    const newAnswer: AnswerRecord = {
      character: currentQuestion.character,
      word: currentQuestion.word,
      selectedOption: option,
      correctOption: currentQuestion.correctOption,
      isCorrect,
      timeTakenMs,
    };

    const nextAnswers = [...answers, newAnswer];
    setAnswers(nextAnswers);

    const speechTarget = currentQuestion.word?.kana || currentQuestion.character?.kana;
    if (speechTarget) {
      recordImmediateAnswer(speechTarget, isCorrect);
      if (currentQuestion.word?.id) {
        recordImmediateAnswer(currentQuestion.word.id, isCorrect);
      }
    }

    if (soundEnabled) {
      if (isCorrect) {
        playSuccessChime();
      } else {
        playErrorBuzz();
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          try {
            navigator.vibrate([45, 60, 45]);
          } catch (e) {
            // ignore
          }
        }
      }
      if (speechTarget) {
        setTimeout(() => {
          speakKana(speechTarget);
        }, isCorrect ? 180 : 360);
      }
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    if (isCorrect) {
      timerRef.current = setTimeout(() => {
        handleAdvance(nextAnswers);
      }, 1200);
    }
  }, [isAnswered, currentQuestion, answers, soundEnabled, handleAdvance]);

  // Selection handlers
  const handleSelectWrittenOption = useCallback((option: string) => {
    if (isAnswered || !currentQuestion) return;
    if (!isWordExercise) {
      evaluateSingleAnswer(option);
      return;
    }
    setSelectedOption(option);
    if (selectedMeaning) {
      evaluateDualAnswer(option, selectedMeaning);
    }
  }, [isAnswered, currentQuestion, isWordExercise, selectedMeaning, evaluateDualAnswer, evaluateSingleAnswer]);

  const handleSelectMeaningOption = useCallback((meaning: string) => {
    if (isAnswered || !currentQuestion || !isWordExercise) return;
    setSelectedMeaning(meaning);
    if (selectedOption) {
      evaluateDualAnswer(selectedOption, meaning);
    }
  }, [isAnswered, currentQuestion, isWordExercise, selectedOption, evaluateDualAnswer]);

  // Keyboard shortcut support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) return;

      if (!isAnswered && currentQuestion) {
        if (isWordExercise) {
          // 1, 2, 3 for Written Options
          if (e.key === '1' && currentQuestion.options[0]) {
            e.preventDefault();
            handleSelectWrittenOption(currentQuestion.options[0]);
          } else if (e.key === '2' && currentQuestion.options[1]) {
            e.preventDefault();
            handleSelectWrittenOption(currentQuestion.options[1]);
          } else if (e.key === '3' && currentQuestion.options[2]) {
            e.preventDefault();
            handleSelectWrittenOption(currentQuestion.options[2]);
          }
          // A, B, C for Meaning Options
          else if ((e.key === 'a' || e.key === 'A') && currentQuestion.meaningOptions?.[0]) {
            e.preventDefault();
            handleSelectMeaningOption(currentQuestion.meaningOptions[0]);
          } else if ((e.key === 'b' || e.key === 'B') && currentQuestion.meaningOptions?.[1]) {
            e.preventDefault();
            handleSelectMeaningOption(currentQuestion.meaningOptions[1]);
          } else if ((e.key === 'c' || e.key === 'C') && currentQuestion.meaningOptions?.[2]) {
            e.preventDefault();
            handleSelectMeaningOption(currentQuestion.meaningOptions[2]);
          }
        } else {
          // Exercise 1 (Keys 1 to 6)
          const keyNum = parseInt(e.key, 10);
          if (!isNaN(keyNum) && keyNum >= 1 && keyNum <= currentQuestion.options.length) {
            e.preventDefault();
            handleSelectWrittenOption(currentQuestion.options[keyNum - 1]);
          }
        }
      }

      // Space repeats pronunciation AFTER answered
      if (e.key === ' ' && isAnswered) {
        e.preventDefault();
        const speechTarget = getTargetSpeechText();
        if (speechTarget) speakKana(speechTarget);
      }

      if ((e.key === 'Enter' || e.key === 'ArrowRight') && isAnswered) {
        e.preventDefault();
        handleAdvance();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, currentQuestion, isWordExercise, handleSelectWrittenOption, handleSelectMeaningOption, getTargetSpeechText, handleAdvance]);

  if (!currentQuestion) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="p-8 bg-white rounded-2xl border-2 border-[#CBD5E1] shadow-xs max-w-md">
          <p className="font-extrabold text-[#1F2329] mb-4">Loading exercise...</p>
          <button
            type="button"
            onClick={startNewQuiz}
            className="px-5 py-2.5 rounded-xl bg-[#1A73E8] text-white font-bold cursor-pointer hover:bg-[#1557B0]"
          >
            Restart
          </button>
        </div>
      </div>
    );
  }

  const currentScore = answers.filter(a => a.isCorrect).length;

  const getExerciseTitle = () => {
    switch (exerciseType) {
      case 'hiragana-to-romaji':
        return { label: 'Exercise 1', desc: 'Hiragana → Romaji (6 Family Choices)' };
      case 'word-romaji-to-hiragana':
        return { label: 'Exercise 2', desc: 'Word Romaji → Hiragana + Meaning' };
      case 'word-hiragana-to-romaji':
        return { label: 'Exercise 3', desc: 'Word Hiragana → Romaji + Meaning' };
      default:
        return { label: 'Exercise', desc: 'Practice' };
    }
  };

  const exerciseTitle = getExerciseTitle();
  const lastAnswer = answers[answers.length - 1];

  return (
    <div className="h-full flex flex-col justify-between max-w-3xl sm:max-w-4xl mx-auto w-full px-3 sm:px-6 py-1.5 sm:py-3 overflow-hidden select-none">
      {/* Top Header & Compact Progress */}
      <div className="shrink-0 mb-1">
        <div className="flex items-center justify-between text-xs sm:text-sm mb-1 px-0.5">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs sm:text-sm px-2.5 py-0.5 rounded-lg bg-[#F8FAFF] border border-[#CBD5E1] text-[#1F2329]">
              Card {currentIndex + 1} / 10
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold px-2 py-0.5 rounded-lg bg-[#E8F0FE] text-[#1A73E8] border border-[#BFDBFE]">
              Score: <strong>{currentScore}</strong> / {currentIndex + (isAnswered ? 1 : 0)}
            </span>
            <button
              type="button"
              onClick={startNewQuiz}
              title="Restart session"
              className="text-[#5F6368] hover:text-[#1F2329] p-1 rounded-md hover:bg-[#EDF2F7] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 10-Segment Progress Bar */}
        <div className="grid grid-cols-10 gap-1 sm:gap-1.5 h-2 w-full bg-[#E2E8F0] p-0.5 rounded-full">
          {Array.from({ length: 10 }).map((_, idx) => {
            const answer = answers[idx];
            let segmentClass = 'bg-[#CBD5E1]';
            if (idx === currentIndex && !isAnswered) {
              segmentClass = 'bg-[#1A73E8] ring-2 ring-[#93C5FD]';
            } else if (answer) {
              segmentClass = answer.isCorrect ? 'bg-[#16A34A]' : 'bg-[#E11D48]';
            }
            return (
              <div
                key={idx}
                className={`h-full rounded-full transition-all duration-200 ${segmentClass}`}
                title={`Card ${idx + 1}`}
              />
            );
          })}
        </div>
        <div className="flex justify-between items-center text-[10px] sm:text-xs text-[#5F6368] mt-0.5 px-0.5 font-medium">
          <span>{exerciseTitle.label}: {exerciseTitle.desc}</span>
          <span>10 cards per round</span>
        </div>
      </div>

      {/* FLASHCARD CONTAINER - Fills vertical viewport and uses space efficiently */}
      <div className="flex-1 min-h-0 flex flex-col bg-white border-2 border-[#CBD5E1] rounded-2xl sm:rounded-3xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden my-1">
        
        {/* ================= TOP PART OF FLASHCARD: PROMPT WITH NO HINTS ================= */}
        <div className={`flex-1 min-h-0 flex flex-col items-center justify-center ${isWordExercise ? 'p-3 sm:p-5' : 'p-3 sm:p-6'} bg-white border-b-2 border-[#E2E8F0] relative overflow-hidden text-center`}>
          
          {/* Adaptive Focus Status Chip (Exercises 1 & 2 only; Exercises 3 & 4 have NO hints) */}
          {!isWordExercise && currentQuestion?.adaptiveStatus && (
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex items-center z-20">
              {currentQuestion.adaptiveStatus === 'needs_practice' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
                  <Target className="w-3 h-3 text-rose-500 animate-pulse" />
                  Needs Practice
                </span>
              )}
              {currentQuestion.adaptiveStatus === 'unseen' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
                  <Sparkles className="w-3 h-3 text-blue-500" />
                  {isWordExercise ? 'New Word' : 'New Syllable'}
                </span>
              )}
              {currentQuestion.adaptiveStatus === 'proven' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  Mastery Check
                </span>
              )}
            </div>
          )}

          {/* Audio button ONLY shown AFTER answered to avoid giveaway */}
          {isAnswered && (
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex items-center gap-1 animate-fade-in z-20">
              <button
                type="button"
                onClick={() => {
                  const speechTarget = getTargetSpeechText();
                  if (speechTarget) speakKana(speechTarget);
                }}
                aria-label="Replay pronunciation"
                title="Replay Japanese pronunciation"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F8FAFF] border border-[#CBD5E1] text-[#1F2329] hover:border-[#1A73E8] hover:text-[#1A73E8] shadow-2xs transition-all text-xs font-bold cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#1A73E8]" />
                <span>Hear</span>
              </button>
            </div>
          )}

          {/* Prompt Display - Large, distraction-free with NO icons, categories, or translation hints */}
          <div className="my-auto w-full flex flex-col items-center justify-center py-2 sm:py-3">
            
            {/* EXERCISE 1: Hiragana single char */}
            {exerciseType === 'hiragana-to-romaji' && currentQuestion.character && (
              <div className="flex flex-col items-center">
                <span className="block text-7xl sm:text-9xl md:text-[9.5rem] font-black text-[#1F2329] tracking-wide select-none font-['Noto_Sans_JP',_sans-serif] leading-none drop-shadow-2xs">
                  {currentQuestion.character.kana}
                </span>
                <p className="text-xs sm:text-sm text-[#5F6368] font-bold mt-2">Choose the correct Romaji reading</p>
              </div>
            )}

            {/* EXERCISE 2: Romaji single syllable */}
            {exerciseType === 'romaji-to-hiragana' && currentQuestion.character && (
              <div className="flex flex-col items-center">
                <div className="inline-block px-7 py-2.5 sm:px-12 sm:py-4 rounded-2xl bg-[#1F2329] text-white shadow-md">
                  <span className="text-5xl sm:text-7xl md:text-8xl font-black tracking-wider font-mono">
                    {currentQuestion.character.romaji}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#5F6368] font-bold mt-2 sm:mt-3">Choose the matching Hiragana character</p>
              </div>
            )}

            {/* EXERCISE 3: Prompt Romaji word at top (NO icons, NO context, NO hints) */}
            {exerciseType === 'word-romaji-to-hiragana' && currentQuestion.word && (
              <div className="flex flex-col items-center justify-center">
                <div className="px-7 py-3 sm:px-10 sm:py-4 rounded-2xl bg-[#1F2329] text-white shadow-md text-center">
                  <span className="font-mono text-2xl sm:text-4xl md:text-5xl font-black tracking-wider block">
                    {currentQuestion.word.romaji}
                  </span>
                </div>
              </div>
            )}

            {/* EXERCISE 4: Prompt Hiragana word at top (NO icons, NO context, NO hints) */}
            {exerciseType === 'word-hiragana-to-romaji' && currentQuestion.word && (
              <div className="flex flex-col items-center justify-center">
                <div className="px-7 py-2.5 sm:px-10 sm:py-3.5 rounded-2xl bg-white border-2 border-[#1F2329] shadow-sm text-center">
                  <span className="text-3xl sm:text-5xl md:text-6xl font-black text-[#1F2329] font-['Noto_Sans_JP',_sans-serif] tracking-widest block">
                    {currentQuestion.word.kana}
                  </span>
                </div>
              </div>
            )}

          </div>

          {/* Hint for single char if available (Exercises 1 & 2 only) */}
          {!isWordExercise && currentQuestion.character?.hint && (
            <div className="mt-1">
              {showHint ? (
                <div className="text-xs bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1 rounded-lg inline-flex items-center gap-1.5 max-w-sm animate-fade-in shadow-2xs">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span><strong>Hint:</strong> {currentQuestion.character.hint}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowHint(true)}
                  className="text-xs text-[#5F6368] hover:text-[#1A73E8] flex items-center gap-1 underline underline-offset-2 transition-colors cursor-pointer font-medium"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-[#1A73E8]" />
                  Show mnemonic hint
                </button>
              )}
            </div>
          )}
        </div>

        {/* ================= BOTTOM HALF OF FLASHCARD: DOUBLE ANSWER SPACE ================= */}
        <div className={`${isWordExercise ? 'p-2.5 sm:p-4' : 'p-3 sm:p-5'} bg-[#F8FAFF] shrink-0`}>
          
          {/* EXERCISES 3 & 4: DOUBLE ANSWER SPACE (WRITTEN + TRANSLATED MEANING) */}
          {isWordExercise ? (
            <div className="w-full flex flex-col gap-2.5 sm:gap-3">
              {/* Status / Instructions Header */}
              <div className="flex items-center justify-between px-1 text-xs">
                {!isAnswered ? (
                  <span className="text-[#5F6368] font-bold">
                    {!selectedOption && !selectedMeaning
                      ? 'Select BOTH the written answer and its English meaning'
                      : !selectedOption
                      ? '✓ Meaning selected. Now select matching written reading'
                      : '✓ Written selected. Now select matching English meaning'}
                  </span>
                ) : (
                  <div className="w-full flex items-center justify-between">
                    <span
                      className={`font-black text-xs sm:text-sm flex items-center gap-1.5 ${
                        lastAnswer?.isCorrect
                          ? 'text-emerald-700'
                          : 'text-rose-700'
                      }`}
                    >
                      {lastAnswer?.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Both answers correct!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>Both parts must be correct.</span>
                        </>
                      )}
                    </span>

                    {!lastAnswer?.isCorrect && (
                      <button
                        type="button"
                        onClick={() => handleAdvance()}
                        className="px-3.5 py-1 rounded-xl bg-[#1F2329] hover:bg-[#1A73E8] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                      >
                        <span>Next</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Two Sections: Side-by-side on sm+ and stacked on small mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
                {/* SECTION 1: Possible Written Answers */}
                <div className="flex flex-col gap-1.5 sm:gap-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#1F2329] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-md bg-[#1F2329] text-white text-[10px] flex items-center justify-center font-mono font-bold">1</span>
                      <span>Written {exerciseType === 'word-romaji-to-hiragana' ? 'Hiragana' : 'Romaji'}</span>
                    </span>
                    {selectedOption && (
                      <span className="text-[10px] font-bold text-[#1A73E8] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        Selected
                      </span>
                    )}
                  </div>

                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedOption === option;
                    const isCorrectOption = option === currentQuestion.correctOption;

                    let btnStyle = 'bg-white border-2 border-[#CBD5E1] text-[#1F2329] hover:border-[#1A73E8] hover:bg-[#F8FAFF] shadow-xs';
                    let badgeStyle = 'bg-[#F1F5F9] text-[#5F6368] border border-[#CBD5E1]';

                    if (isAnswered) {
                      if (isCorrectOption) {
                        btnStyle = 'bg-[#16A34A] border-2 border-[#15803D] text-white shadow-md ring-2 ring-[#86EFAC]';
                        badgeStyle = 'bg-white/20 text-white border-white/40';
                      } else if (isSelected && !isCorrectOption) {
                        btnStyle = 'bg-[#DC2626] border-2 border-[#B91C1C] text-white shadow-md ring-2 ring-[#FCA5A5] animate-shake-wrong';
                        badgeStyle = 'bg-white/20 text-white border-white/40';
                      } else {
                        btnStyle = 'bg-[#F8FAFF] border-2 border-[#E2E8F0] text-[#94A3B8] opacity-50';
                        badgeStyle = 'bg-[#E2E8F0] text-[#94A3B8] border-transparent';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-[#EBF3FE] border-2 border-[#1A73E8] text-[#1A73E8] font-bold shadow-xs ring-2 ring-[#BFDBFE]';
                      badgeStyle = 'bg-[#1A73E8] text-white border-[#1A73E8]';
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isAnswered}
                        onClick={() => handleSelectWrittenOption(option)}
                        className={`w-full py-2.5 sm:py-3 px-3.5 rounded-xl sm:rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer ${btnStyle}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`w-6 h-6 rounded-lg text-xs font-mono font-black flex items-center justify-center shrink-0 ${badgeStyle}`}>
                            {idx + 1}
                          </span>
                          <span className={`${exerciseType === 'word-romaji-to-hiragana' ? "font-['Noto_Sans_JP',_sans-serif] text-base sm:text-lg font-black" : "font-mono text-sm sm:text-base font-extrabold"}`}>
                            {option}
                          </span>
                        </div>
                        {isAnswered && isCorrectOption && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                        {isAnswered && isSelected && !isCorrectOption && <XCircle className="w-4 h-4 text-white shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* SECTION 2: Translated Meaning (English, Randomly Aligned) */}
                <div className="flex flex-col gap-1.5 sm:gap-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#1F2329] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-md bg-[#1A73E8] text-white text-[10px] flex items-center justify-center font-mono font-bold">2</span>
                      <span>English Meaning</span>
                    </span>
                    {selectedMeaning && (
                      <span className="text-[10px] font-bold text-[#1A73E8] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        Selected
                      </span>
                    )}
                  </div>

                  {(currentQuestion.meaningOptions || []).map((meaning, idx) => {
                    const letter = String.fromCharCode(65 + idx); // 'A', 'B', 'C'
                    const isSelected = selectedMeaning === meaning;
                    const isCorrectMeaning = meaning === currentQuestion.correctMeaning;

                    let btnStyle = 'bg-white border-2 border-[#CBD5E1] text-[#1F2329] hover:border-[#1A73E8] hover:bg-[#F8FAFF] shadow-xs';
                    let badgeStyle = 'bg-[#F1F5F9] text-[#5F6368] border border-[#CBD5E1]';

                    if (isAnswered) {
                      if (isCorrectMeaning) {
                        btnStyle = 'bg-[#16A34A] border-2 border-[#15803D] text-white shadow-md ring-2 ring-[#86EFAC]';
                        badgeStyle = 'bg-white/20 text-white border-white/40';
                      } else if (isSelected && !isCorrectMeaning) {
                        btnStyle = 'bg-[#DC2626] border-2 border-[#B91C1C] text-white shadow-md ring-2 ring-[#FCA5A5] animate-shake-wrong';
                        badgeStyle = 'bg-white/20 text-white border-white/40';
                      } else {
                        btnStyle = 'bg-[#F8FAFF] border-2 border-[#E2E8F0] text-[#94A3B8] opacity-50';
                        badgeStyle = 'bg-[#E2E8F0] text-[#94A3B8] border-transparent';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-[#EBF3FE] border-2 border-[#1A73E8] text-[#1A73E8] font-bold shadow-xs ring-2 ring-[#BFDBFE]';
                      badgeStyle = 'bg-[#1A73E8] text-white border-[#1A73E8]';
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isAnswered}
                        onClick={() => handleSelectMeaningOption(meaning)}
                        className={`w-full py-2.5 sm:py-3 px-3.5 rounded-xl sm:rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer ${btnStyle}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`w-6 h-6 rounded-lg text-xs font-mono font-black flex items-center justify-center shrink-0 ${badgeStyle}`}>
                            {letter}
                          </span>
                          <span className="font-sans text-xs sm:text-sm font-bold leading-snug">
                            {meaning}
                          </span>
                        </div>
                        {isAnswered && isCorrectMeaning && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                        {isAnswered && isSelected && !isCorrectMeaning && <XCircle className="w-4 h-4 text-white shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* EXERCISE 1: Single-selection options (6 Family-Matched Romaji Choices) */
            <div>
              <div className="text-center mb-1 sm:mb-1.5">
                <span className="text-[11px] sm:text-xs font-bold text-[#5F6368] uppercase tracking-wider">
                  Choose 1 of {currentQuestion.options.length} options ({currentQuestion.character?.rowName || 'Same Family'})
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5 w-full">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedOption === option;
                  const isCorrectOption = option === currentQuestion.correctOption;

                  let buttonStyle = 'bg-white border-2 border-[#CBD5E1] text-[#1F2329] hover:border-[#1A73E8] hover:bg-[#F8FAFF] shadow-xs';
                  let badgeStyle = 'bg-[#F1F5F9] text-[#5F6368] border border-[#CBD5E1]';

                  if (isAnswered) {
                    const wasWrong = selectedOption !== null && selectedOption !== currentQuestion.correctOption;
                    if (isCorrectOption) {
                      buttonStyle = wasWrong
                        ? 'bg-[#16A34A] border-2 border-[#15803D] text-white shadow-md ring-2 ring-[#86EFAC] animate-flash-green-delayed'
                        : 'bg-[#16A34A] border-2 border-[#15803D] text-white shadow-md ring-2 ring-[#86EFAC]';
                      badgeStyle = 'bg-white/20 text-white border-white/40';
                    } else if (isSelected && !isCorrectOption) {
                      buttonStyle = 'bg-[#DC2626] border-2 border-[#B91C1C] text-white shadow-md ring-2 ring-[#FCA5A5] animate-shake-wrong';
                      badgeStyle = 'bg-white/20 text-white border-white/40';
                    } else {
                      buttonStyle = 'bg-[#F8FAFF] border-2 border-[#E2E8F0] text-[#94A3B8] opacity-50';
                      badgeStyle = 'bg-[#E2E8F0] text-[#94A3B8] border-transparent';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => handleSelectWrittenOption(option)}
                      className={`h-11 sm:h-13 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all cursor-pointer font-bold relative group ${buttonStyle}`}
                    >
                      <span className={`absolute top-1 left-1 sm:top-1.5 sm:left-1.5 w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-md text-[10px] font-mono font-bold flex items-center justify-center transition-colors ${badgeStyle}`}>
                        {idx + 1}
                      </span>
                      <span className="font-mono text-base sm:text-lg font-black tracking-wide">
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
