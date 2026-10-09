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
    <div className="max-w-3xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
      {/* SCORE CARD */}
      <div className="bg-white border-2 border-[#CBD5E1] rounded-2xl sm:rounded-3xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden p-5 sm:p-8 text-center">
        
        {/* Top Trophy Icon */}
        <div className="inline-flex items-center justify-center w-14 h-14 sm:w-18 sm:h-18 rounded-2xl bg-[#E8F0FE] text-[#1A73E8] mb-3 sm:mb-4 shadow-2xs border border-[#BFDBFE]">
          <Trophy className="w-7 h-7 sm:w-9 sm:h-9" />
        </div>

        {/* Title */}
        <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#5F6368] mb-0.5">
          {headerInfo.title}
        </h2>
        <p className="text-xs sm:text-sm text-[#1F2329] mb-2 font-bold">({headerInfo.sub})</p>

        {/* Percentage Score & Fraction */}
        <div className="my-2 sm:my-3">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-6xl sm:text-8xl font-black text-[#1F2329] tracking-tight font-mono">
              {result.percentage}
            </span>
            <span className="text-3xl sm:text-5xl font-black text-[#1A73E8] font-mono">%</span>
          </div>
          <p className="text-sm sm:text-base font-bold text-[#1F2329] mt-0.5">
            {result.score} of {result.totalQuestions} Questions Correct
          </p>
        </div>

        {/* Japanese Praise Callout */}
        <div className={`mt-2 mb-3 sm:mt-4 sm:mb-6 p-3 sm:p-4 rounded-2xl border ${praise.badgeColor} max-w-md mx-auto text-center shadow-2xs`}>
          <div className="flex items-center justify-center gap-2 mb-0.5">
            <span className="text-xl sm:text-2xl font-black tracking-wide font-['Noto_Sans_JP',_sans-serif]">{praise.ja}</span>
            <span className="text-xs font-semibold font-mono">({praise.romaji})</span>
          </div>
          <p className="text-xs sm:text-sm text-[#1F2329] font-medium">{praise.en}</p>
        </div>

        {/* Cloud Sync Status */}
        <div className="mb-4 sm:mb-6">
          {currentUser ? (
            <div className="inline-flex items-center gap-1.5 text-xs text-[#1A73E8] bg-[#E8F0FE] border border-[#BFDBFE] px-3 py-1.5 rounded-xl font-semibold">
              <CloudCheck className="w-4 h-4 text-[#1A73E8]" />
              <span>Result saved to your cloud profile &bull; Synced across devices</span>
            </div>
          ) : (
            <div className="inline-flex flex-col sm:flex-row items-center gap-2 text-xs text-[#5F6368] bg-[#F8FAFF] border border-[#E2E8F0] px-4 py-2 rounded-xl">
              <div className="flex items-center gap-1.5">
                <CloudAlert className="w-4 h-4 text-[#5F6368]" />
                <span>Result saved locally on this device.</span>
              </div>
              <button
                type="button"
                onClick={loginWithGoogle}
                className="font-bold text-[#1A73E8] underline hover:text-[#1557B0] flex items-center gap-1 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign in to sync across devices
              </button>
            </div>
          )}
        </div>

        {/* Main Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-6 sm:mb-8">
          <button
            type="button"
            onClick={onRetake}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#1F2329] text-white font-bold text-xs sm:text-sm hover:bg-[#111317] transition-all shadow-xs cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Practice Again</span>
          </button>

          <button
            type="button"
            onClick={() => onSwitchExercise(headerInfo.next)}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#1A73E8] text-white font-bold text-xs sm:text-sm hover:bg-[#1557B0] transition-all shadow-xs cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>{headerInfo.nextLabel}</span>
          </button>

          <button
            type="button"
            onClick={onOpenDashboard}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#F8FAFF] border border-[#CBD5E1] text-[#1F2329] font-bold text-xs sm:text-sm hover:bg-[#EDF2F7] transition-all cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 text-[#1A73E8]" />
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
