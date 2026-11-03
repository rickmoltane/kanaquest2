import React, { useState, useEffect, useCallback, useRef } from 'react';
import { QuizResult } from '../types';
import { 
  ExchangeQuizQuestion, 
  ExchangeOption 
} from '../data/exchangeData';
import { generateAdaptiveExchangeQuiz as generateExchangeQuiz } from '../utils/adaptivePhraseEngine';
import { speakKana, playSuccessChime, playErrorBuzz } from '../utils/audio';
import { recordImmediatePhraseAnswer } from '../services/storageService';
import { 
  Volume2, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Flame,
  Lightbulb
} from 'lucide-react';

interface ExchangeQuizProps {
  exerciseType: 'exchange-romaji' | 'exchange-hiragana';
  soundEnabled: boolean;
  onComplete: (result: QuizResult) => void;
  onCancel: () => void;
}

interface AnswerRecord {
  questionNumber: number;
  prompt: string;
  selectedText: string;
  correctText: string;
  isCorrect: boolean;
  timeTakenMs: number;
  hiraganaKana: string;
  romajiText: string;
}

export const ExchangeQuiz: React.FC<ExchangeQuizProps> = ({
  exerciseType,
  soundEnabled,
  onComplete,
  onCancel,
}) => {
  const isHiragana = exerciseType === 'exchange-hiragana';
  const exerciseNumber = isHiragana ? 6 : 5;
  const exerciseTitle = isHiragana ? 'Exercise 6' : 'Exercise 5';

  const [questions, setQuestions] = useState<ExchangeQuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [selectedMeaning, setSelectedMeaning] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [streak, setStreak] = useState<number>(0);
  const [playingAudioKey, setPlayingAudioKey] = useState<string | null>(null);

  const startTimeRef = useRef<number>(Date.now());
  const questionStartTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize or restart round of 10 questions (both exercises use romaji answer options)
  const startNewQuiz = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const newQuestions = generateExchangeQuiz('romaji', 10);
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setSelectedOptionIndex(null);
    setSelectedMeaning(null);
    setIsAnswered(false);
    setShowHint(false);
    setAnswers([]);
    setStreak(0);
    startTimeRef.current = Date.now();
    questionStartTimeRef.current = Date.now();
  }, []);

  useEffect(() => {
    startNewQuiz();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [startNewQuiz]);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    setSelectedOptionIndex(null);
    setSelectedMeaning(null);
    setIsAnswered(false);
    setShowHint(false);
    questionStartTimeRef.current = Date.now();
  }, [currentIndex]);

  // Audio helper
  const handlePlayAudio = useCallback((textToSpeak: string, keyId: string) => {
    if (!textToSpeak) return;
    setPlayingAudioKey(keyId);
    speakKana(textToSpeak);
    setTimeout(() => {
      setPlayingAudioKey(null);
    }, 2000);
  }, []);

  // In Exercise 6 (Audio-Only Prompt), auto-play spoken phrase on question load
  useEffect(() => {
    if (isHiragana && soundEnabled && currentQuestion?.promptAudio) {
      const timer = setTimeout(() => {
        handlePlayAudio(currentQuestion.promptAudio, 'prompt');
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isHiragana, soundEnabled, currentQuestion?.promptAudio, handlePlayAudio]);

  // Advance to next question or complete quiz
  const handleAdvance = useCallback((currentAnswersList?: AnswerRecord[]) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const answersToUse = currentAnswersList || answers;

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOptionIndex(null);
      setSelectedMeaning(null);
      setIsAnswered(false);
      setShowHint(false);
    } else {
      // Complete quiz and prepare QuizResult
      const totalQuestions = answersToUse.length;
      const score = answersToUse.filter(a => a.isCorrect).length;
      const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
      const timeSpentSeconds = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));

      const quizResult: QuizResult = {
        id: `quiz_${Date.now()}`,
        userId: 'local',
        exerciseType,
        score,
        totalQuestions,
        percentage,
        timeSpentSeconds,
        createdAt: new Date().toISOString(),
        items: answersToUse.map(a => ({
          kana: a.hiraganaKana,
          romaji: a.romajiText,
          selected: a.selectedText,
          correct: a.correctText,
          isCorrect: a.isCorrect,
        })),
      };

      onComplete(quizResult);
    }
  }, [currentIndex, questions.length, answers, exerciseType, onComplete]);

  // Dual-selection evaluation for Exercise 6 (Written Romaji + English Meaning)
  const evaluateDualAnswer = useCallback((writtenIdx: number, meaningChoice: string) => {
    if (isAnswered || !currentQuestion) return;

    const chosenOption = currentQuestion.options[writtenIdx];
    const isWrittenCorrect = chosenOption.isCorrect;
    const isMeaningCorrect = meaningChoice === currentQuestion.correctMeaning;
    const isOverallCorrect = isWrittenCorrect && isMeaningCorrect;

    setSelectedOptionIndex(writtenIdx);
    setSelectedMeaning(meaningChoice);
    setIsAnswered(true);

    const timeTakenMs = Date.now() - questionStartTimeRef.current;
    const correctOpt = currentQuestion.options.find(o => o.isCorrect) || currentQuestion.options[0];

    const newAnswer: AnswerRecord = {
      questionNumber: currentQuestion.questionNumber,
      prompt: currentQuestion.prompt,
      selectedText: `${chosenOption.text} [${meaningChoice}]`,
      correctText: `${correctOpt.text} [${currentQuestion.correctMeaning || ''}]`,
      isCorrect: isOverallCorrect,
      timeTakenMs,
      hiraganaKana: currentQuestion.direction === 'reply-to-question' 
        ? currentQuestion.item.correctHiragana 
        : currentQuestion.item.promptHiragana,
      romajiText: currentQuestion.direction === 'reply-to-question' 
        ? currentQuestion.item.correctRomaji 
        : currentQuestion.item.promptRomaji,
    };

    const nextAnswers = [...answers, newAnswer];
    setAnswers(nextAnswers);

    recordImmediatePhraseAnswer(currentQuestion.item.id, isOverallCorrect);

    if (isOverallCorrect) {
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    if (soundEnabled) {
      if (isOverallCorrect) {
        playSuccessChime();
        if (correctOpt.hiraganaAudio) {
          setTimeout(() => {
            speakKana(correctOpt.hiraganaAudio);
          }, 180);
        }
      } else {
        playErrorBuzz();
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          try {
            navigator.vibrate([45, 60, 45]);
          } catch (e) {
            // ignore
          }
        }
        if (correctOpt.hiraganaAudio) {
          setTimeout(() => {
            speakKana(correctOpt.hiraganaAudio);
          }, 360);
        }
      }
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    if (isOverallCorrect) {
      timerRef.current = setTimeout(() => {
        handleAdvance(nextAnswers);
      }, 2000);
    }
  }, [isAnswered, currentQuestion, answers, soundEnabled, handleAdvance]);

  // Click handlers for Exercise 6
  const handleSelectWrittenOption = useCallback((idx: number) => {
    if (isAnswered || !currentQuestion) return;
    setSelectedOptionIndex(idx);
    if (selectedMeaning) {
      evaluateDualAnswer(idx, selectedMeaning);
    }
  }, [isAnswered, currentQuestion, selectedMeaning, evaluateDualAnswer]);

  const handleSelectMeaningOption = useCallback((meaning: string) => {
    if (isAnswered || !currentQuestion) return;
    setSelectedMeaning(meaning);
    if (selectedOptionIndex !== null) {
      evaluateDualAnswer(selectedOptionIndex, meaning);
    }
  }, [isAnswered, currentQuestion, selectedOptionIndex, evaluateDualAnswer]);

  // Single-selection evaluation for Exercise 7 (Hiragana with visual scene)
  const handleSelectSingleOption = useCallback((option: ExchangeOption, index: number) => {
    if (isAnswered || !currentQuestion) return;

    const isCorrect = option.isCorrect;
    setSelectedOptionIndex(index);
    setIsAnswered(true);

    const timeTakenMs = Date.now() - questionStartTimeRef.current;
    const correctOpt = currentQuestion.options.find(o => o.isCorrect) || currentQuestion.options[0];

    const newAnswer: AnswerRecord = {
      questionNumber: currentQuestion.questionNumber,
      prompt: currentQuestion.prompt,
      selectedText: option.text,
      correctText: correctOpt.text,
      isCorrect,
      timeTakenMs,
      hiraganaKana: currentQuestion.direction === 'reply-to-question' 
        ? currentQuestion.item.correctHiragana 
        : currentQuestion.item.promptHiragana,
      romajiText: currentQuestion.direction === 'reply-to-question' 
        ? currentQuestion.item.correctRomaji 
        : currentQuestion.item.promptRomaji,
    };

    const nextAnswers = [...answers, newAnswer];
    setAnswers(nextAnswers);

    recordImmediatePhraseAnswer(currentQuestion.item.id, isCorrect);

    if (isCorrect) {
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    if (soundEnabled) {
      if (isCorrect) {
        playSuccessChime();
        if (correctOpt.hiraganaAudio) {
          setTimeout(() => {
            speakKana(correctOpt.hiraganaAudio);
          }, 180);
        }
      } else {
        playErrorBuzz();
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          try {
            navigator.vibrate([45, 60, 45]);
          } catch (e) {
            // ignore
          }
        }
        if (correctOpt.hiraganaAudio) {
          setTimeout(() => {
            speakKana(correctOpt.hiraganaAudio);
          }, 360);
        }
      }
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    if (isCorrect) {
      timerRef.current = setTimeout(() => {
        handleAdvance(nextAnswers);
      }, 2400);
    }
  }, [isAnswered, currentQuestion, answers, soundEnabled, handleAdvance]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if ((e.key === 'h' || e.key === 'H') && !e.ctrlKey && !e.metaKey && isHiragana) {
        setShowHint(prev => !prev);
        return;
      }

      if ((e.key === 'p' || e.key === 'P') && !e.ctrlKey && !e.metaKey && currentQuestion) {
        handlePlayAudio(currentQuestion.promptAudio, 'prompt');
        return;
      }

      if (isAnswered) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
          e.preventDefault();
          handleAdvance();
        }
        return;
      }

      if (!currentQuestion) return;

      if (!isHiragana) {
        // Exercise 6: Dual answers [1, 2, 3] for Written, [A, B, C] for Meaning
        if (e.key === '1' && currentQuestion.options[0]) {
          handleSelectWrittenOption(0);
        } else if (e.key === '2' && currentQuestion.options[1]) {
          handleSelectWrittenOption(1);
        } else if (e.key === '3' && currentQuestion.options[2]) {
          handleSelectWrittenOption(2);
        } else if ((e.key === 'a' || e.key === 'A') && currentQuestion.meaningOptions?.[0]) {
          handleSelectMeaningOption(currentQuestion.meaningOptions[0]);
        } else if ((e.key === 'b' || e.key === 'B') && currentQuestion.meaningOptions?.[1]) {
          handleSelectMeaningOption(currentQuestion.meaningOptions[1]);
        } else if ((e.key === 'c' || e.key === 'C') && currentQuestion.meaningOptions?.[2]) {
          handleSelectMeaningOption(currentQuestion.meaningOptions[2]);
        }
      } else {
        // Exercise 7: Single option [1, 2, 3]
        if (e.key === '1' && currentQuestion.options[0]) {
          handleSelectSingleOption(currentQuestion.options[0], 0);
        } else if (e.key === '2' && currentQuestion.options[1]) {
          handleSelectSingleOption(currentQuestion.options[1], 1);
        } else if (e.key === '3' && currentQuestion.options[2]) {
          handleSelectSingleOption(currentQuestion.options[2], 2);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, isHiragana, currentQuestion, handleSelectWrittenOption, handleSelectMeaningOption, handleSelectSingleOption, handlePlayAudio, handleAdvance]);

  if (!currentQuestion) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="p-8 bg-white rounded-2xl border-2 border-[#CBD5E1] shadow-xs max-w-md">
          <p className="font-extrabold text-[#1F2329] mb-4">Loading conversation scenario...</p>
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

  const progressPercent = ((currentIndex + (isAnswered ? 1 : 0)) / questions.length) * 100;
  const lastAnswer = answers[answers.length - 1];

  return (
    <div className="h-full flex flex-col justify-between max-w-3xl sm:max-w-4xl mx-auto w-full px-2.5 sm:px-4 py-1.5 sm:py-2 select-none overflow-hidden">
      {/* TOP HEADER: Clean, uncrowded bar */}
      <div className="bg-white border-b border-[#E2E8F0] px-3 sm:px-6 py-2 shrink-0 shadow-2xs rounded-xl">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-2">
          {/* Left: Badge & Question Count */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-[#1F2329] text-white shrink-0">
              [{exerciseNumber}]
            </span>
            <div className="min-w-0">
              <span className="text-xs sm:text-sm font-black text-[#1F2329] tracking-tight truncate block">
                {exerciseTitle}: {isHiragana ? 'Listening Dialogue (Audio-Only Prompt → Romaji)' : 'Dialogue Exchanges (Romaji + Meaning)'}
              </span>
              <p className="text-[11px] text-[#5F6368] font-medium">
                {currentIndex + 1} / {questions.length}
              </p>
            </div>
          </div>

          {/* Right: Streak & Exit */}
          <div className="flex items-center gap-2 shrink-0">
            {streak > 1 && (
              <div className="flex items-center gap-1 text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{streak}</span>
              </div>
            )}
            <button
              type="button"
              onClick={onCancel}
              className="text-xs font-bold text-[#5F6368] hover:text-[#1F2329] px-2.5 py-1 rounded-lg border border-[#CBD5E1] hover:bg-[#F8FAFF] cursor-pointer"
            >
              Exit
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="max-w-3xl mx-auto w-full bg-[#E2E8F0] h-1.5 rounded-full mt-2 overflow-hidden">
          <div
            className="bg-[#1A73E8] h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EXERCISE 6: NO ICONS/IMAGES, PROMPT AT TOP WITH NO HINTS, DOUBLE ANSWER SPACE */}
      {/* ========================================================================= */}
      {!isHiragana ? (
        <div className="flex-1 min-h-0 flex flex-col justify-between py-2 sm:py-3 px-1 sm:px-3 max-w-2xl mx-auto w-full gap-2 sm:gap-3 overflow-y-auto">
          
          {/* PROMPT AT TOP: Pure prompt phrase with NO OTHER HINTS */}
          <div className="w-full flex flex-col items-center justify-center shrink-0 my-auto py-2">
            <div className="w-full px-6 py-4 sm:px-8 sm:py-5 rounded-2xl sm:rounded-3xl bg-[#1F2329] text-white shadow-md text-center border-2 border-[#1F2329]">
              <span className="font-mono text-xl sm:text-2xl md:text-3xl font-black tracking-wide block leading-snug select-text">
                {currentQuestion.prompt}
              </span>
            </div>
          </div>

          {/* DOUBLE ANSWER SPACE: Section 1 (Romaji) + Section 2 (English Meaning) */}
          <div className="w-full flex flex-col gap-2.5 sm:gap-3 shrink-0">
            {/* Status / Instructions Header */}
            <div className="flex items-center justify-between px-1 text-xs">
              {!isAnswered ? (
                <span className="text-[#5F6368] font-bold">
                  {selectedOptionIndex === null && !selectedMeaning
                    ? 'Select BOTH the Romaji reply and its English meaning'
                    : selectedOptionIndex === null
                    ? '✓ Meaning selected. Now select matching Romaji reply'
                    : '✓ Romaji selected. Now select matching English meaning'}
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
              {/* SECTION 1: Possible Answers in Romaji */}
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#1F2329] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-[#1F2329] text-white text-[10px] flex items-center justify-center font-mono font-bold">1</span>
                    <span>Written Romaji Reply</span>
                  </span>
                  {selectedOptionIndex !== null && (
                    <span className="text-[10px] font-bold text-[#1A73E8] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      Selected
                    </span>
                  )}
                </div>

                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedOptionIndex === idx;
                  const isCorrectOption = option.isCorrect;

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
                      onClick={() => handleSelectWrittenOption(idx)}
                      className={`w-full py-2.5 sm:py-3 px-3.5 rounded-xl sm:rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer font-mono ${btnStyle}`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <span className={`w-6 h-6 rounded-lg text-xs font-mono font-black flex items-center justify-center shrink-0 ${badgeStyle}`}>
                          {idx + 1}
                        </span>
                        <span className="text-xs sm:text-sm font-bold break-words">
                          {option.text}
                        </span>
                      </div>
                      {isAnswered && isCorrectOption && <CheckCircle2 className="w-4 h-4 text-white shrink-0 ml-1.5" />}
                      {isAnswered && isSelected && !isCorrectOption && <XCircle className="w-4 h-4 text-white shrink-0 ml-1.5" />}
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
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <span className={`w-6 h-6 rounded-lg text-xs font-mono font-black flex items-center justify-center shrink-0 ${badgeStyle}`}>
                          {letter}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-inherit break-words">
                          {meaning}
                        </span>
                      </div>
                      {isAnswered && isCorrectMeaning && <CheckCircle2 className="w-4 h-4 text-white shrink-0 ml-1.5" />}
                      {isAnswered && isSelected && !isCorrectMeaning && <XCircle className="w-4 h-4 text-white shrink-0 ml-1.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* AUDIO REPLAY AFTER ANSWERED */}
          {isAnswered && (
            <div className="flex items-center justify-center gap-2 py-1 shrink-0 animate-fade-in">
              <button
                type="button"
                onClick={() => {
                  const correctOpt = currentQuestion.options.find(o => o.isCorrect);
                  if (correctOpt?.hiraganaAudio) {
                    speakKana(correctOpt.hiraganaAudio);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#BFDBFE] bg-white text-[#1A73E8] hover:bg-[#F8FAFF] text-xs font-bold shadow-2xs cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Hear Pronunciation</span>
              </button>
            </div>
          )}

          {/* BOTTOM ACTION BAR */}
          <div className="w-full bg-white border border-[#CBD5E1] rounded-2xl px-3.5 sm:px-4 py-2.5 shadow-2xs flex items-center justify-between text-xs shrink-0 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {isAnswered ? (
                lastAnswer?.isCorrect ? (
                  <div className="flex items-center gap-1.5 text-emerald-700 font-extrabold truncate">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>正解 (Both Correct!)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-rose-700 font-bold truncate">
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span className="font-extrabold">不正解</span>
                    <span className="text-[11px] text-neutral-600 font-normal hidden sm:inline">
                      — Both the Romaji reading and meaning must match!
                    </span>
                  </div>
                )
              ) : (
                <span className="text-[#5F6368] font-semibold truncate flex items-center gap-1">
                  <span>Keys</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-300 font-mono text-[10px]">1</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-300 font-mono text-[10px]">2</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-300 font-mono text-[10px]">3</kbd>
                  <span className="text-neutral-400 mx-1">&bull;</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-300 font-mono text-[10px]">A</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-300 font-mono text-[10px]">B</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-300 font-mono text-[10px]">C</kbd>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isAnswered && (
                <button
                  type="button"
                  onClick={() => handleAdvance()}
                  className={`inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-xl font-bold cursor-pointer shrink-0 transition-all shadow-xs ${
                    lastAnswer?.isCorrect
                      ? 'bg-[#1A73E8] hover:bg-[#1557B0] text-white'
                      : 'bg-rose-600 hover:bg-rose-700 text-white ring-2 ring-rose-200'
                  }`}
                >
                  <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'Finish'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* EXERCISE 6: AUDIO-ONLY PROMPT WITH ROMAJI ANSWER OPTIONS (NO IMAGES) */
        /* ========================================================================= */
        <div className="flex-1 min-h-0 flex flex-col items-center justify-between p-2 sm:p-3 max-w-xl mx-auto w-full gap-2 sm:gap-2.5 overflow-y-auto">
          
          {/* UPPER QUESTION SPACE: Pure audio-only prompt card (NO text, NO images) */}
          <div className="w-full flex flex-col items-center justify-center shrink-0 my-auto py-2">
            <div className="w-full max-w-md p-5 sm:p-7 rounded-3xl bg-white border-2 border-[#CBD5E1] shadow-xs text-center flex flex-col items-center gap-3.5">
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1A73E8] text-xs font-bold">
                <Volume2 className="w-3.5 h-3.5" />
                <span>Audio-Only Prompt</span>
              </div>

              <div className="text-xs sm:text-sm text-[#5F6368] font-medium max-w-xs">
                Listen to the spoken Japanese dialogue, then select the appropriate Romaji response:
              </div>

              {/* Central Audio Play / Replay Button */}
              <button
                type="button"
                onClick={() => handlePlayAudio(currentQuestion.promptAudio, 'prompt')}
                aria-label="Replay audio prompt"
                className={`w-full max-w-xs py-3.5 sm:py-4 px-6 rounded-2xl flex items-center justify-center gap-2.5 transition-all cursor-pointer font-black text-sm sm:text-base shadow-md ${
                  playingAudioKey === 'prompt'
                    ? 'bg-[#1557B0] text-white ring-4 ring-[#93C5FD] scale-102'
                    : 'bg-[#1A73E8] hover:bg-[#1557B0] text-white hover:scale-102 active:scale-98'
                }`}
              >
                <Volume2 className={`w-5 h-5 ${playingAudioKey === 'prompt' ? 'animate-bounce' : ''}`} />
                <span>{playingAudioKey === 'prompt' ? 'Playing Audio...' : 'Play / Replay Audio (P)'}</span>
              </button>

              {/* Transcript revealed only AFTER answered */}
              {isAnswered && (
                <div className="w-full pt-3 mt-1 border-t border-[#E2E8F0] animate-fade-in space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">
                    Spoken Japanese Transcript:
                  </span>
                  <p className="font-mono text-base sm:text-lg font-black text-[#1F2329]">
                    {currentQuestion.prompt}
                  </p>
                  <p className="text-xs text-[#5F6368] italic">
                    "{currentQuestion.promptEnglish}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* BOTTOM OPTIONS AREA: Exactly 3 Possible Replies in Romaji */}
          <div className="w-full flex flex-col gap-2 sm:gap-2.5 shrink-0 max-w-lg mb-1">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOptionIndex === idx;
              const isCorrect = option.isCorrect;
              const showFeedback = isAnswered;
              const wasWrongChoiceMade = selectedOptionIndex !== null && !currentQuestion.options[selectedOptionIndex]?.isCorrect;

              let buttonStyle = 'bg-white text-[#1F2329] border-2 border-[#CBD5E1] hover:border-[#1A73E8] hover:bg-[#F8FAFF]';

              if (showFeedback) {
                if (isCorrect) {
                  buttonStyle = wasWrongChoiceMade
                    ? 'bg-emerald-50 text-emerald-900 border-2 border-emerald-500 ring-2 ring-emerald-300 animate-flash-green-delayed'
                    : 'bg-emerald-50 text-emerald-900 border-2 border-emerald-500 ring-2 ring-emerald-200';
                } else if (isSelected && !isCorrect) {
                  buttonStyle = 'bg-rose-50 text-rose-900 border-2 border-rose-500 ring-2 ring-rose-300 animate-shake-wrong';
                } else {
                  buttonStyle = 'bg-[#F8FAFF] text-[#5F6368] border-2 border-[#E2E8F0] opacity-50';
                }
              }

              return (
                <div
                  key={idx}
                  className="flex items-stretch gap-2 w-full"
                >
                  {/* Main Option Select Button */}
                  <button
                    type="button"
                    onClick={() => handleSelectSingleOption(option, idx)}
                    disabled={isAnswered}
                    className={`flex-1 min-h-[50px] sm:min-h-[54px] py-2.5 sm:py-3 px-3.5 sm:px-4 rounded-xl sm:rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer font-sans shadow-xs gap-3 ${buttonStyle}`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
                      {/* Number key shortcut badge */}
                      <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#F0F4F8] text-[#1F2329] border border-[#CBD5E1] flex items-center justify-center font-mono text-xs sm:text-sm font-black shrink-0">
                        {idx + 1}
                      </span>

                      {/* Option Text (Romaji text, wraps cleanly) */}
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="font-mono text-sm sm:text-base font-extrabold tracking-wide break-words text-left leading-snug">
                          {option.text}
                        </span>
                        {/* English translation shown after answer is revealed */}
                        {showFeedback && (
                          <span className="text-[11px] sm:text-xs text-[#5F6368] font-normal italic mt-0.5 break-words">
                            {option.englishMeaning}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Feedback Status Icon */}
                    {showFeedback && (
                      <div className="shrink-0 ml-1">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        ) : isSelected ? (
                          <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        ) : null}
                      </div>
                    )}
                  </button>

                  {/* Sibling Audio Button - Independent flex item, never overlapping */}
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(option.hiraganaAudio, `opt_${idx}`)}
                    aria-label={`Play option ${idx + 1} audio`}
                    className={`px-3 sm:px-3.5 rounded-xl sm:rounded-2xl border transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-xs ${
                      playingAudioKey === `opt_${idx}`
                        ? 'bg-[#1A73E8] text-white border-[#1A73E8] scale-105'
                        : 'bg-white text-[#5F6368] hover:text-[#1A73E8] border-[#CBD5E1] hover:border-[#1A73E8] hover:bg-[#F8FAFF]'
                    }`}
                    title="Play Japanese pronunciation"
                  >
                    <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* BOTTOM ACTION BAR: Clean Status, Shortcuts, and Advance Button */}
          <div className="w-full bg-white border border-[#CBD5E1] rounded-2xl px-3.5 sm:px-4 py-2.5 shadow-2xs flex items-center justify-between text-xs shrink-0 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {isAnswered ? (
                selectedOptionIndex !== null && currentQuestion.options[selectedOptionIndex]?.isCorrect ? (
                  <div className="flex items-center gap-1.5 text-emerald-700 font-extrabold truncate">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>正解 (Correct!)</span>
                    {showHint && (
                      <span className="text-[11px] font-normal text-emerald-800 hidden sm:inline ml-1 truncate">
                        — {currentQuestion.item.correctEnglish}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-rose-700 font-bold truncate">
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span className="font-extrabold">不正解</span>
                    <span className="text-[11px] text-neutral-600 font-normal hidden sm:inline">
                      — Take your time to review, then click Next or press [Enter]
                    </span>
                  </div>
                )
              ) : (
                <span className="text-[#5F6368] font-semibold truncate flex items-center gap-1">
                  <span>Keys</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-300 font-mono text-[10px]">1</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-300 font-mono text-[10px]">2</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-300 font-mono text-[10px]">3</kbd>
                  <span className="text-neutral-400 mx-1">&bull;</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-300 font-mono text-[10px]">H</kbd>
                  <span className="text-[11px] text-neutral-500">Hint</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {!isAnswered && (
                <button
                  type="button"
                  onClick={() => setShowHint(prev => !prev)}
                  className={`text-[11px] font-bold px-2 py-1 rounded-lg border transition-colors cursor-pointer sm:hidden ${
                    showHint ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-white text-neutral-600 border-neutral-300'
                  }`}
                >
                  {showHint ? 'Hide (hint)' : '(hint)'}
                </button>
              )}

              {isAnswered && (
                <button
                  type="button"
                  onClick={() => handleAdvance()}
                  className={`inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-xl font-bold cursor-pointer shrink-0 transition-all shadow-xs ${
                    selectedOptionIndex !== null && !currentQuestion.options[selectedOptionIndex]?.isCorrect
                      ? 'bg-rose-600 hover:bg-rose-700 text-white ring-2 ring-rose-200'
                      : 'bg-[#1A73E8] hover:bg-[#1557B0] text-white'
                  }`}
                >
                  <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'Finish'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
