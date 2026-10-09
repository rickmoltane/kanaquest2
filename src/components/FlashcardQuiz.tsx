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
          <span>Progress</span>
          <span>10 cards per round</span>
        </div>
      </div>

      {/* FLASHCARD CONTAINER - Fills vertical viewport and uses space efficiently */}
      <div className="flex-1 min-h-0 flex flex-col bg-white border-2 border-[#CBD5E1] rounded-2xl sm:rounded-3xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden my-1">
        
        {/* ================= TOP PART OF FLASHCARD ================= */}
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-3 sm:p-6 bg-white border-b-2 border-[#E2E8F0] relative overflow-hidden text-center">
          
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

          {/* Prompt Display - Large, well-proportioned with no dead space */}
          <div className="my-auto w-full flex flex-col items-center justify-center py-1 sm:py-2">
            
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

            {/* EXERCISE 3: Picture + Romaji -> Choose Hiragana */}
            {exerciseType === 'word-romaji-to-hiragana' && currentQuestion.word && (
              <div className="flex flex-col items-center space-y-1.5 sm:space-y-2">
                <div className="p-2 sm:p-3 bg-[#F8FAFF] rounded-2xl border border-[#CBD5E1] shadow-2xs flex items-center justify-center">
                  <WordIllustration name={currentQuestion.word.iconName} className="w-18 h-18 sm:w-26 sm:h-26" />
                </div>
                <div className="flex flex-col items-center">
                  <div className="inline-block px-5 py-1 sm:px-6 sm:py-1.5 rounded-xl bg-[#1F2329] text-white font-mono text-2xl sm:text-4xl font-extrabold shadow-xs">
                    {currentQuestion.word.romaji}
                  </div>
                  <span className="text-xs sm:text-sm text-[#5F6368] font-bold mt-1">
                    {currentQuestion.word.english}
                  </span>
                </div>
              </div>
            )}

            {/* EXERCISE 4: Picture + Hiragana -> Choose Romaji */}
            {exerciseType === 'word-hiragana-to-romaji' && currentQuestion.word && (
              <div className="flex flex-col items-center space-y-1.5 sm:space-y-2">
                <div className="p-2 sm:p-3 bg-[#F8FAFF] rounded-2xl border border-[#CBD5E1] shadow-2xs flex items-center justify-center">
                  <WordIllustration name={currentQuestion.word.iconName} className="w-18 h-18 sm:w-26 sm:h-26" />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl sm:text-5xl font-black text-[#1F2329] font-['Noto_Sans_JP',_sans-serif] tracking-wider">
                    {currentQuestion.word.kana}
                  </span>
                  <span className="text-xs sm:text-sm text-[#5F6368] font-bold mt-1">
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
                <div className="text-xs bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1 rounded-lg inline-flex items-center gap-1.5 max-w-sm animate-fade-in shadow-2xs">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="truncate"><strong>Hint:</strong> {currentQuestion.character.hint}</span>
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

        {/* ================= BOTTOM HALF OF FLASHCARD: 3 OPTIONS ================= */}
        <div className="p-3 sm:p-5 bg-[#F8FAFF] shrink-0">
          <div className="text-center mb-1.5">
            <span className="text-[11px] sm:text-xs font-bold text-[#5F6368] uppercase tracking-wider">
              Choose 1 of 3 options
            </span>
          </div>

          {/* Exactly 3 Options Grid - Spanning width comfortably */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              const isCorrectOption = option === currentQuestion.correctOption;

              let buttonStyle = 'bg-white border-2 border-[#CBD5E1] text-[#1F2329] hover:border-[#1A73E8] hover:bg-[#F8FAFF] shadow-xs';
              let badgeStyle = 'bg-[#F1F5F9] text-[#5F6368] border border-[#CBD5E1]';

              if (isAnswered) {
                if (isCorrectOption) {
                  buttonStyle = 'bg-[#16A34A] border-2 border-[#15803D] text-white shadow-md ring-2 ring-[#86EFAC] scale-[1.01]';
                  badgeStyle = 'bg-[#15803D] text-white border-transparent';
                } else if (isSelected && !isCorrectOption) {
                  buttonStyle = 'bg-[#E11D48] border-2 border-[#BE123C] text-white shadow-xs ring-2 ring-[#FDA4AF]';
                  badgeStyle = 'bg-[#BE123C] text-white border-transparent';
                } else {
                  buttonStyle = 'bg-[#F8FAFF] border-2 border-[#E2E8F0] text-[#94A3B8] opacity-50';
                  badgeStyle = 'bg-[#E2E8F0] text-[#94A3B8] border-transparent';
                }
              }

              const isHiraganaOption = /[\u3040-\u309F]/.test(option);

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(option)}
                  className={`relative flex flex-col items-center justify-center p-2.5 sm:p-5 rounded-2xl font-bold transition-all duration-150 cursor-pointer focus:outline-none min-h-[56px] sm:min-h-[76px] ${buttonStyle}`}
                >
                  {/* Keyboard Shortcut Indicator [1, 2, 3] */}
                  <span className={`absolute top-1.5 left-1.5 text-[10px] sm:text-xs font-mono font-bold px-1.5 py-0.2 rounded-md ${badgeStyle}`}>
                    {idx + 1}
                  </span>

                  {/* Option Text */}
                  <span className={`tracking-wide select-none text-center truncate w-full px-1 ${
                    isHiraganaOption
                      ? "font-['Noto_Sans_JP',_sans-serif] text-xl sm:text-3xl my-0.5 font-bold" 
                      : 'font-mono text-lg sm:text-2xl font-black'
                  }`}>
                    {option}
                  </span>

                  {/* Answer Status Icon */}
                  {isAnswered && isCorrectOption && (
                    <span className="absolute bottom-1.5 right-1.5 text-white flex items-center">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </span>
                  )}
                  {isAnswered && isSelected && !isCorrectOption && (
                    <span className="absolute bottom-1.5 right-1.5 text-white flex items-center">
                      <XCircle className="w-4 h-4 text-white" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Controls / Advancing */}
          <div className="mt-2 pt-1.5 flex items-center justify-between text-xs text-[#5F6368] border-t border-[#E2E8F0]">
            <span className="hidden sm:inline font-medium">Use keyboard keys 1, 2, 3 or click an option</span>
            <span className="sm:hidden text-[11px] font-medium">Tap option to choose</span>

            {isAnswered ? (
              <button
                type="button"
                onClick={() => handleAdvance()}
                className="flex items-center gap-1 px-3.5 py-1 rounded-xl bg-[#1A73E8] text-white font-bold text-xs sm:text-sm hover:bg-[#1557B0] transition-all shadow-xs cursor-pointer"
              >
                <span>{currentIndex === 9 ? 'Finish' : 'Next'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <span className="text-xs text-[#5F6368] font-mono font-medium">10 cards</span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

