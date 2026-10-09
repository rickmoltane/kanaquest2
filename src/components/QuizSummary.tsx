import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { QuizResult, ExerciseType } from '../types';
import { useAuth } from '../context/AuthContext';
import { speakKana } from '../utils/audio';
import { 
  Trophy, 
  RotateCcw, 
  ArrowRight, 
  BarChart3, 
  Volume2, 
  CheckCircle2, 
  XCircle, 
  CloudCheck, 
  CloudAlert,
  Sparkles,
  LogIn
} from 'lucide-react';

interface QuizSummaryProps {
  result: QuizResult;
  onRetake: () => void;
  onSwitchExercise: (type: ExerciseType) => void;
  onOpenDashboard: () => void;
}

export const QuizSummary: React.FC<QuizSummaryProps> = ({
  result,
  onRetake,
  onSwitchExercise,
  onOpenDashboard,
}) => {
  const { currentUser, loginWithGoogle } = useAuth();

  useEffect(() => {
    if (result.percentage >= 80) {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.debug('Confetti error', e);
      }
    }
  }, [result.percentage]);

  const getPraise = (pct: number) => {
    if (pct === 100) {
      return {
        ja: '完璧！',
        romaji: 'Kanpeki!',
        en: 'Flawless Mastery! You nailed every single card.',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      };
    }
    if (pct >= 80) {
      return {
        ja: '素晴らしい！',
        romaji: 'Subarashii!',
        en: 'Outstanding work! Your recognition is sharp.',
        badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      };
    }
    if (pct >= 60) {
      return {
        ja: 'よく出来ました！',
        romaji: 'Yoku Dekimashita!',
        en: 'Good job! A few more rounds will cement these characters.',
        badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      };
    }
    return {
      ja: '頑張って！',
      romaji: 'Ganbatte!',
      en: 'Keep going! Regular repetition creates rapid retention.',
      badgeColor: 'bg-neutral-100 text-neutral-800 border-neutral-300',
    };
  };

  const praise = getPraise(result.percentage);

  const getExerciseHeader = (type: ExerciseType) => {
    switch (type) {
      case 'hiragana-to-romaji': return { title: 'Exercise 1 Complete', sub: 'Hiragana → Romaji', next: 'romaji-to-hiragana' as ExerciseType, nextLabel: 'Try Exercise 2 (Romaji→Kana)' };
      case 'romaji-to-hiragana': return { title: 'Exercise 2 Complete', sub: 'Romaji → Hiragana', next: 'word-romaji-to-hiragana' as ExerciseType, nextLabel: 'Try Exercise 3 (Words & Pictures)' };
      case 'word-romaji-to-hiragana': return { title: 'Exercise 3 Complete', sub: 'Words: Pic + Romaji → Kana', next: 'word-hiragana-to-romaji' as ExerciseType, nextLabel: 'Try Exercise 4 (Reverse Word Quiz)' };
      case 'word-hiragana-to-romaji': return { title: 'Exercise 4 Complete', sub: 'Words: Pic + Kana → Romaji', next: 'hiragana-drawing' as ExerciseType, nextLabel: 'Try Exercise 5 (Stroke Tracing)' };
      case 'hiragana-drawing': return { title: 'Exercise 5 Complete', sub: 'Stroke Order Tracing', next: 'hiragana-to-romaji' as ExerciseType, nextLabel: 'Try Exercise 1 (Kana Training)' };
    }
  };

  const headerInfo = getExerciseHeader(result.exerciseType);

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 py-3 sm:py-8">
      {/* SCORE CARD */}
      <div className="bg-white border-2 border-neutral-900 rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden p-4 sm:p-8 text-center">
        
        {/* Top Trophy Icon */}
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-neutral-900 text-white mb-2 sm:mb-4 shadow-xs">
          <Trophy className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>

        {/* Title */}
        <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-neutral-600 mb-0.5">
          {headerInfo.title}
        </h2>
        <p className="text-[11px] sm:text-xs text-neutral-600 mb-1 sm:mb-2 font-medium">({headerInfo.sub})</p>

        {/* Percentage Score & Fraction */}
        <div className="my-1 sm:my-3">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-6xl sm:text-8xl font-black text-neutral-950 tracking-tight font-mono">
              {result.percentage}
            </span>
            <span className="text-3xl sm:text-5xl font-black text-neutral-500 font-mono">%</span>
          </div>
          <p className="text-sm sm:text-base font-semibold text-neutral-700 mt-0.5">
            {result.score} of {result.totalQuestions} Questions Correct
          </p>
        </div>

        {/* Japanese Praise Callout */}
        <div className={`mt-2 mb-3 sm:mt-4 sm:mb-6 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border ${praise.badgeColor} max-w-md mx-auto text-center`}>
          <div className="flex items-center justify-center gap-2 mb-0.5">
            <span className="text-lg sm:text-xl font-black tracking-wide font-['Noto_Sans_JP',_sans-serif]">{praise.ja}</span>
            <span className="text-xs font-semibold font-mono">({praise.romaji})</span>
          </div>
          <p className="text-[11px] sm:text-xs text-neutral-700">{praise.en}</p>
        </div>

        {/* Cloud Sync Status */}
        <div className="mb-4 sm:mb-6">
          {currentUser ? (
            <div className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
              <CloudCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Saved to cloud &bull; Synced across devices</span>
            </div>
          ) : (
            <div className="inline-flex flex-col sm:flex-row items-center gap-1.5 text-[11px] text-neutral-600 bg-neutral-50 border border-neutral-200 px-3 py-1.5 rounded-xl">
              <div className="flex items-center gap-1">
                <CloudAlert className="w-3.5 h-3.5 text-neutral-500" />
                <span>Saved locally.</span>
              </div>
              <button
                type="button"
                onClick={loginWithGoogle}
                className="font-bold text-neutral-900 underline hover:text-black flex items-center gap-1 cursor-pointer"
              >
                <LogIn className="w-3 h-3" />
                Sign in to sync across devices
              </button>
            </div>
          )}
        </div>

        {/* Main Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
          <button
            type="button"
            onClick={onRetake}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-neutral-900 text-white font-bold text-xs sm:text-sm hover:bg-neutral-800 transition-all shadow-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Practice Again</span>
          </button>

          <button
            type="button"
            onClick={() => onSwitchExercise(headerInfo.next)}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white border-2 border-neutral-900 text-neutral-900 font-bold text-xs sm:text-sm hover:bg-neutral-50 transition-all shadow-xs cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>{headerInfo.nextLabel}</span>
          </button>

          <button
            type="button"
            onClick={onOpenDashboard}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-neutral-100 text-neutral-800 font-bold text-xs sm:text-sm hover:bg-neutral-200 transition-all cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Progress History</span>
          </button>
        </div>

        {/* ================= REVIEW OF 10 CARDS ================= */}
        <div className="border-t border-neutral-200 pt-6 text-left">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-600 mb-3">
            Card-by-Card Review (10 Items)
          </h3>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {result.items?.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-3 rounded-xl border text-sm transition-colors ${
                  item.isCorrect
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50/60 border-rose-200 text-rose-950'
                }`}
              >
                {/* Character & Sound */}
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-neutral-600 font-bold w-4">
                    #{idx + 1}
                  </span>
                  <span className="text-2xl font-black font-['Noto_Sans_JP',_sans-serif]">
                    {item.kana}
                  </span>
                  <button
                    type="button"
                    onClick={() => speakKana(item.kana)}
                    title="Play pronunciation"
                    className="p-1 rounded hover:bg-black/5 text-neutral-700"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-mono font-bold text-neutral-700 bg-white/70 px-2 py-0.5 rounded border border-black/10">
                    {item.romaji}
                  </span>
                </div>

                {/* Answers and Status */}
                <div className="flex items-center gap-3">
                  <div className="text-right text-xs">
                    {item.isCorrect ? (
                      <span className="font-semibold text-emerald-700">Correct: {item.correct}</span>
                    ) : (
                      <div className="flex flex-col items-end">
                        <span className="line-through text-rose-700">You: {item.selected}</span>
                        <span className="font-bold text-emerald-800">Answer: {item.correct}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    {item.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
