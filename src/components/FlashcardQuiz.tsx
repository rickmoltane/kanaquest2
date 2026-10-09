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
import { WordIllustration } from './WordIllustration';
import { 
  Volume2, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  RotateCcw,
  HelpCircle,
  Keyboard
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
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
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
    if (exerciseType === 'word-romaji-to-hiragana' || exerciseType === 'word-hiragana-to-romaji') {
      newQuestions = generateWordQuiz(exerciseType, 10);
    } else {
      newQuestions = generateQuiz(exerciseType, 10);
    }

    setQuestions(newQuestions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setAnswers([]);
    setShowHint(false);
    questionStartTimeRef.current = Date.now();
  }, [exerciseType]);

  useEffect(() => {
    startNewQuiz();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [startNewQuiz]);

  const currentQuestion = questions[currentIndex];

  // Reset hint and timer on index change.
  // CRITICAL REQUIREMENT: Do NOT play audio when card loads; only after player selects answer!
  useEffect(() => {
    setShowHint(false);
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

  const handleSelectOption = useCallback((option: string) => {
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

    // Audio feedback:
    // 1. Play chime / buzz
    // 2. Play pronunciation sound ONLY AFTER answer selection!
    if (soundEnabled) {
      if (isCorrect) {
        playSuccessChime();
      } else {
        playErrorBuzz();
      }
      const speechTarget = currentQuestion.word?.kana || currentQuestion.character?.kana;
      if (speechTarget) {
        // slight offset so chime starts first
        setTimeout(() => {
          speakKana(speechTarget);
        }, 120);
      }
    }

    // Auto-advance after 1100ms
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      handleAdvance(nextAnswers);
    }, 1100);
  }, [isAnswered, currentQuestion, answers, soundEnabled]);

  const handleAdvance = useCallback((currentAnswersList?: AnswerRecord[]) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const answersToUse = currentAnswersList || answers;

    if (currentIndex < 9) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
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
          selected: a.selectedOption,
          correct: a.correctOption,
          isCorrect: a.isCorrect,
        })),
      };

      onComplete(quizResult);
    }
  }, [currentIndex, answers, startTime, exerciseType, onComplete]);

  // Keyboard shortcut support (1, 2, 3 for options, Space for speech ONLY AFTER answered)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) return;

      if (!isAnswered && currentQuestion) {
        if (e.key === '1' && currentQuestion.options[0]) {
          e.preventDefault();
          handleSelectOption(currentQuestion.options[0]);
        } else if (e.key === '2' && currentQuestion.options[1]) {
          e.preventDefault();
          handleSelectOption(currentQuestion.options[1]);
        } else if (e.key === '3' && currentQuestion.options[2]) {
          e.preventDefault();
          handleSelectOption(currentQuestion.options[2]);
        }
      }

      // Space only repeats pronunciation AFTER the user has answered
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
  }, [isAnswered, currentQuestion, handleSelectOption, handleAdvance, getTargetSpeechText]);

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentScore = answers.filter(a => a.isCorrect).length;

  const getExerciseTitle = () => {
    switch (exerciseType) {
      case 'hiragana-to-romaji':
        return { label: 'Exercise 1', desc: 'Hiragana → Romaji' };
      case 'romaji-to-hiragana':
        return { label: 'Exercise 2', desc: 'Romaji → Hiragana' };
      case 'word-romaji-to-hiragana':
        return { label: 'Exercise 3', desc: 'Picture + Romaji → Hiragana' };
      case 'word-hiragana-to-romaji':
        return { label: 'Exercise 4', desc: 'Picture + Hiragana → Romaji' };
      default:
        return { label: 'Exercise', desc: 'Practice' };
    }
  };

  const exerciseTitle = getExerciseTitle();

  return (
    <div className="h-full flex flex-col justify-between max-w-xl mx-auto px-2 sm:px-4 py-1 sm:py-2 overflow-hidden select-none">
      {/* Top Header & Compact Progress */}
      <div className="shrink-0 mb-0.5 sm:mb-1">
        <div className="flex items-center justify-between text-xs mb-0.5 px-0.5">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-neutral-900 text-xs">
              {exerciseTitle.label}
            </span>
            <span className="text-neutral-500 font-medium truncate text-[11px] hidden xs:inline">
              ({exerciseTitle.desc})
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-neutral-100 text-neutral-800">
              Score: <strong className="text-neutral-900">{currentScore}</strong> / {currentIndex + (isAnswered ? 1 : 0)}
            </span>
            <button
              type="button"
              onClick={startNewQuiz}
              title="Restart session"
              className="text-neutral-500 hover:text-neutral-900 p-0.5 rounded hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 10-Segment Progress Bar */}
        <div className="grid grid-cols-10 gap-0.5 sm:gap-1 h-1.5 w-full bg-neutral-100 p-0.5 rounded-full">
          {Array.from({ length: 10 }).map((_, idx) => {
            const answer = answers[idx];
            let segmentClass = 'bg-neutral-200';
            if (idx === currentIndex && !isAnswered) {
              segmentClass = 'bg-neutral-900 ring-1 ring-neutral-400';
            } else if (answer) {
              segmentClass = answer.isCorrect ? 'bg-emerald-600' : 'bg-rose-500';
            }
            return (
              <div
                key={idx}
                className={`h-full rounded-full transition-all duration-200 ${segmentClass}`}
                title={`Question ${idx + 1}`}
              />
            );
          })}
        </div>
        <div className="flex justify-between items-center text-[9px] sm:text-[10px] text-neutral-400 mt-0.5 px-0.5">
          <span>Card {currentIndex + 1} of 10</span>
          <span>10 succession cards</span>
        </div>
      </div>

      {/* FLASHCARD CONTAINER - Fills vertical viewport */}
      <div className="flex-1 min-h-0 flex flex-col bg-white border-2 border-neutral-900 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden my-0.5 sm:my-1">
        
        {/* ================= TOP PART OF FLASHCARD ================= */}
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-2 sm:p-5 bg-neutral-50/70 border-b-2 border-neutral-900 relative overflow-hidden text-center">
          
          {/* Audio button ONLY shown AFTER answered to avoid giveaway */}
          {isAnswered && (
            <div className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 flex items-center gap-1 animate-fade-in z-20">
              <button
                type="button"
                onClick={() => {
                  const speechTarget = getTargetSpeechText();
                  if (speechTarget) speakKana(speechTarget);
                }}
                aria-label="Replay pronunciation"
                title="Replay Japanese pronunciation"
                className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-neutral-300 text-neutral-800 hover:text-neutral-950 hover:border-neutral-900 shadow-xs transition-all text-[11px] font-semibold cursor-pointer"
              >
                <Volume2 className="w-3 h-3 text-neutral-700" />
                <span>Hear</span>
              </button>
            </div>
          )}

          {/* Prompt Display */}
          <div className="my-auto w-full flex flex-col items-center justify-center">
            
            {/* EXERCISE 1: Hiragana single char */}
            {exerciseType === 'hiragana-to-romaji' && currentQuestion.character && (
              <div className="flex flex-col items-center">
                <span className="block text-6xl sm:text-8xl md:text-9xl font-black text-neutral-950 tracking-wide select-none drop-shadow-xs font-['Noto_Sans_JP',_sans-serif] leading-none">
                  {currentQuestion.character.kana}
                </span>
                <p className="text-[10px] sm:text-xs text-neutral-500 font-medium mt-1 sm:mt-2">Choose correct Romaji</p>
              </div>
            )}

            {/* EXERCISE 2: Romaji single syllable */}
            {exerciseType === 'romaji-to-hiragana' && currentQuestion.character && (
              <div className="flex flex-col items-center">
                <div className="inline-block px-5 py-1.5 sm:px-7 sm:py-2 rounded-xl sm:rounded-2xl bg-neutral-900 text-white shadow-xs">
                  <span className="text-4xl sm:text-6xl font-extrabold tracking-wider font-mono">
                    {currentQuestion.character.romaji}
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-neutral-500 font-medium mt-1 sm:mt-2">Choose matching Hiragana</p>
              </div>
            )}

            {/* EXERCISE 3: Picture + Romaji -> Choose Hiragana */}
            {exerciseType === 'word-romaji-to-hiragana' && currentQuestion.word && (
              <div className="flex flex-col items-center space-y-1">
                <div className="p-1 sm:p-2 bg-white rounded-xl border border-neutral-200 shadow-xs flex items-center justify-center">
                  <WordIllustration name={currentQuestion.word.iconName} className="w-14 h-14 sm:w-20 sm:h-20" />
                </div>
                <div className="flex flex-col items-center">
                  <div className="inline-block px-3 py-0.5 sm:px-4 sm:py-1 rounded-lg bg-neutral-900 text-white font-mono text-xl sm:text-3xl font-extrabold">
                    {currentQuestion.word.romaji}
                  </div>
                  <span className="text-[10px] sm:text-xs text-neutral-500 font-semibold mt-0.5">
                    {currentQuestion.word.english}
                  </span>
                </div>
              </div>
            )}

            {/* EXERCISE 4: Picture + Hiragana -> Choose Romaji */}
            {exerciseType === 'word-hiragana-to-romaji' && currentQuestion.word && (
              <div className="flex flex-col items-center space-y-1">
                <div className="p-1 sm:p-2 bg-white rounded-xl border border-neutral-200 shadow-xs flex items-center justify-center">
                  <WordIllustration name={currentQuestion.word.iconName} className="w-14 h-14 sm:w-20 sm:h-20" />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl sm:text-4xl font-black text-neutral-950 font-['Noto_Sans_JP',_sans-serif] tracking-wider">
                    {currentQuestion.word.kana}
                  </span>
                  <span className="text-[10px] sm:text-xs text-neutral-500 font-semibold mt-0.5">
                    {currentQuestion.word.english}
                  </span>
                </div>
              </div>
            )}

          </div>

          {/* Hint for single char if available */}
          {currentQuestion.character?.hint && (
            <div className="mt-1">
              {showHint ? (
                <div className="text-[10px] sm:text-[11px] bg-amber-50 border border-amber-200 text-amber-900 px-2 py-0.5 rounded-md inline-flex items-center gap-1 max-w-xs animate-fade-in">
                  <Lightbulb className="w-3 h-3 text-amber-600 shrink-0" />
                  <span className="truncate"><strong>Hint:</strong> {currentQuestion.character.hint}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowHint(true)}
                  className="text-[10px] sm:text-[11px] text-neutral-500 hover:text-neutral-900 flex items-center gap-1 underline underline-offset-2 transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-3 h-3" />
                  Show mnemonic
                </button>
              )}
            </div>
          )}
        </div>

        {/* ================= BOTTOM HALF OF FLASHCARD: 3 OPTIONS ================= */}
        <div className="p-2 sm:p-3.5 bg-white shrink-0">
          <div className="text-center mb-1">
            <span className="text-[9px] sm:text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              Choose 1 of 3 options
            </span>
          </div>

          {/* Exactly 3 Options Grid - 3 columns fitting nicely on mobile */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              const isCorrectOption = option === currentQuestion.correctOption;

              let buttonStyle = 'bg-white border-2 border-neutral-300 text-neutral-900 hover:border-neutral-900 hover:bg-neutral-50';
              let badgeStyle = 'bg-neutral-100 text-neutral-600 border border-neutral-300';

              if (isAnswered) {
                if (isCorrectOption) {
                  buttonStyle = 'bg-emerald-600 border-2 border-emerald-700 text-white shadow-md ring-2 ring-emerald-300 scale-[1.02]';
                  badgeStyle = 'bg-emerald-700 text-emerald-100 border-emerald-800';
                } else if (isSelected && !isCorrectOption) {
                  buttonStyle = 'bg-rose-600 border-2 border-rose-700 text-white shadow-xs ring-2 ring-rose-300';
                  badgeStyle = 'bg-rose-700 text-rose-100 border-rose-800';
                } else {
                  buttonStyle = 'bg-neutral-100 border-2 border-neutral-200 text-neutral-400 opacity-60';
                  badgeStyle = 'bg-neutral-200 text-neutral-500 border-neutral-200';
                }
              }

              const isHiraganaOption = /[\u3040-\u309F]/.test(option);

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(option)}
                  className={`relative flex flex-col items-center justify-center p-2 sm:p-4 rounded-xl sm:rounded-2xl font-bold transition-all duration-150 cursor-pointer focus:outline-none min-h-[48px] sm:min-h-[66px] ${buttonStyle}`}
                >
                  {/* Keyboard Shortcut Indicator [1, 2, 3] */}
                  <span className={`absolute top-1 left-1 text-[9px] font-mono font-bold px-1 py-0.2 rounded ${badgeStyle}`}>
                    {idx + 1}
                  </span>

                  {/* Option Text */}
                  <span className={`tracking-wide select-none text-center truncate w-full px-1 ${
                    isHiraganaOption
                      ? "font-['Noto_Sans_JP',_sans-serif] text-lg sm:text-2xl my-0.5" 
                      : 'font-mono text-base sm:text-xl font-extrabold'
                  }`}>
                    {option}
                  </span>

                  {/* Answer Status Icon */}
                  {isAnswered && isCorrectOption && (
                    <span className="absolute bottom-1 right-1 text-white flex items-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                    </span>
                  )}
                  {isAnswered && isSelected && !isCorrectOption && (
                    <span className="absolute bottom-1 right-1 text-white flex items-center">
                      <XCircle className="w-3.5 h-3.5 text-rose-200" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Controls / Advancing */}
          <div className="mt-1.5 pt-1 flex items-center justify-between text-[10px] text-neutral-500 border-t border-neutral-100">
            <span className="hidden sm:inline">Press 1, 2, 3 to choose</span>
            <span className="sm:hidden text-[10px]">Tap to choose</span>

            {isAnswered ? (
              <button
                type="button"
                onClick={() => handleAdvance()}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 transition-all shadow-xs cursor-pointer"
              >
                <span>{currentIndex === 9 ? 'Finish' : 'Next'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            ) : (
              <span className="text-[10px] text-neutral-400 font-mono">10 cards</span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

