import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ExerciseType, QuizResult } from '../types';
import { HIRAGANA_CHARACTERS, HIRAGANA_ROWS } from '../data/hiraganaData';
import { getLocalMastery } from '../services/storageService';
import { speakKana } from '../utils/audio';
import { 
  BarChart3, 
  Flame, 
  Target, 
  Calendar, 
  CheckCircle2, 
  RefreshCw, 
  Clock, 
  Volume2, 
  Cloud, 
  CloudCheck, 
  AlertCircle,
  Filter,
  Trophy,
  ArrowUpRight,
  Sparkles,
  LogIn
} from 'lucide-react';

interface ProgressDashboardProps {
  onStartExercise: (type: ExerciseType) => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ onStartExercise }) => {
  const { currentUser, profile, history, isSyncing, refreshUserData, loginWithGoogle } = useAuth();
  const [filterType, setFilterType] = useState<'all' | ExerciseType>('all');
  const [selectedKana, setSelectedKana] = useState<string | null>(null);

  const masteryData = getLocalMastery();

  // Filter history
  const filteredHistory = history.filter(item => {
    if (filterType === 'all') return true;
    return item.exerciseType === filterType;
  });

  // Calculate aggregated stats
  const totalQuizzes = profile?.totalQuizzes || history.length;
  const totalQuestions = profile?.totalAnswers || history.reduce((sum, h) => sum + h.totalQuestions, 0);
  const totalCorrect = profile?.totalCorrect || history.reduce((sum, h) => sum + h.score, 0);
  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const streakDays = profile?.streakDays || 1;

  // Count mastered characters (at least 3 attempts and >= 75% accuracy)
  const masteredCount = HIRAGANA_CHARACTERS.filter(char => {
    const record = masteryData[char.kana];
    return record && record.attempts >= 2 && record.accuracy >= 75;
  }).length;

  const inProgressCount = HIRAGANA_CHARACTERS.filter(char => {
    const record = masteryData[char.kana];
    return record && record.attempts > 0 && !(record.attempts >= 2 && record.accuracy >= 75);
  }).length;

  // Identify weak characters (missed in attempts)
  const weakCharacters = HIRAGANA_CHARACTERS.filter(char => {
    const record = masteryData[char.kana];
    return record && record.attempts > 0 && record.accuracy < 70;
  }).sort((a, b) => {
    const aAcc = masteryData[a.kana]?.accuracy ?? 100;
    const bAcc = masteryData[b.kana]?.accuracy ?? 100;
    return aAcc - bAcc;
  }).slice(0, 6);

  // Recent 10 quizzes for the visual trend chart
  const recentQuizzes = [...filteredHistory].slice(0, 10).reverse();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-10 space-y-8">
      {/* Top Header & Cloud Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              Learning Progress Dashboard
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
              Hiragana 46
            </span>
          </div>
          <p className="text-sm text-neutral-600 mt-1">
            Track quiz scores, accuracy history over time, and character mastery across all devices.
          </p>
        </div>

        {/* Sync Controls */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 px-3 py-1.5 rounded-xl">
              <CloudCheck className="w-4 h-4 text-emerald-600" />
              <div className="text-xs">
                <span className="font-semibold text-neutral-800">Cloud Sync Active</span>
                <span className="text-neutral-600 block text-[11px] truncate max-w-[140px]">{currentUser.email}</span>
              </div>
              <button
                type="button"
                onClick={refreshUserData}
                disabled={isSyncing}
                title="Sync latest data with cloud"
                className="p-1 hover:bg-neutral-200 rounded text-neutral-600 ml-1 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={loginWithGoogle}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-all shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign in for Cloud Sync</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI METRICS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Quizzes */}
        <div className="bg-white border-2 border-neutral-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-600 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Quizzes Completed</span>
            <BarChart3 className="w-4 h-4 text-neutral-700" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-neutral-900 font-mono">
            {totalQuizzes}
          </div>
          <p className="text-xs text-neutral-600 mt-1">10 questions per session</p>
        </div>

        {/* Overall Accuracy */}
        <div className="bg-white border-2 border-neutral-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-600 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Overall Accuracy</span>
            <Target className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-black text-neutral-900 font-mono">
              {overallAccuracy}
            </span>
            <span className="text-lg font-bold text-neutral-600">%</span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            {totalCorrect} of {totalQuestions} answered correctly
          </p>
        </div>

        {/* Mastery Count */}
        <div className="bg-white border-2 border-neutral-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-600 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Mastered Kana</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-black text-neutral-900 font-mono">
              {masteredCount}
            </span>
            <span className="text-sm font-semibold text-neutral-600">/ 46</span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            {inProgressCount} currently learning
          </p>
        </div>

        {/* Streak */}
        <div className="bg-white border-2 border-neutral-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-600 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Practice Streak</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-black text-neutral-900 font-mono">
              {streakDays}
            </span>
            <span className="text-sm font-semibold text-neutral-600">day{streakDays > 1 ? 's' : ''}</span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">Consistency builds fluency</p>
        </div>
      </div>

      {/* VISUAL LEARNING HISTORY OVER TIME CHART */}
      <div className="bg-white border-2 border-neutral-200 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Score History Over Time</h2>
            <p className="text-xs text-neutral-600">Scores from your completed 10-question exercises</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-neutral-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                filterType === 'all' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilterType('hiragana-to-romaji')}
              className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                filterType === 'hiragana-to-romaji' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Ex 1 (Kana→Romaji)
            </button>
            <button
              type="button"
              onClick={() => setFilterType('romaji-to-hiragana')}
              className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                filterType === 'romaji-to-hiragana' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Ex 2 (Romaji→Kana)
            </button>
            <button
              type="button"
              onClick={() => setFilterType('word-romaji-to-hiragana')}
              className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                filterType === 'word-romaji-to-hiragana' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Ex 3 (Pic→Kana)
            </button>
            <button
              type="button"
              onClick={() => setFilterType('word-hiragana-to-romaji')}
              className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                filterType === 'word-hiragana-to-romaji' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Ex 4 (Pic→Romaji)
            </button>
            <button
              type="button"
              onClick={() => setFilterType('hiragana-drawing')}
              className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                filterType === 'hiragana-drawing' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Ex 5 (Stroke Tracing)
            </button>
          </div>
        </div>

        {recentQuizzes.length === 0 ? (
          <div className="py-12 text-center text-neutral-600 bg-neutral-50 rounded-2xl border border-dashed border-neutral-300">
            <Calendar className="w-8 h-8 mx-auto text-neutral-600 mb-2" />
            <p className="text-sm font-semibold text-neutral-700">No exercise sessions recorded yet</p>
            <p className="text-xs text-neutral-600 mt-1 mb-4">Complete a 10-card exercise to start seeing your trend line.</p>
            <button
              type="button"
              onClick={() => onStartExercise('hiragana-to-romaji')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-colors"
            >
              <span>Start Exercise 1</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div>
            {/* Visual Bar Chart */}
            <div className="h-48 sm:h-56 flex items-end gap-2 sm:gap-4 pt-6 pb-2 px-2 border-b border-neutral-200">
              {recentQuizzes.map((quiz, idx) => {
                const heightPercent = Math.max(10, quiz.percentage);
                const isPerfect = quiz.percentage === 100;
                const isGood = quiz.percentage >= 80;
                
                return (
                  <div key={quiz.id || idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    {/* Tooltip on Hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 z-20 bg-neutral-900 text-white text-[11px] rounded-lg px-2.5 py-1 pointer-events-none whitespace-nowrap shadow-md">
                      <div>Score: {quiz.score}/10 ({quiz.percentage}%)</div>
                      <div className="text-[10px] text-neutral-300">{new Date(quiz.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>

                    {/* Percentage text above bar */}
                    <span className="text-[10px] font-mono font-bold text-neutral-600 mb-1">
                      {quiz.percentage}%
                    </span>

                    {/* Bar */}
                    <div 
                      style={{ height: `${heightPercent}%` }} 
                      className={`w-full max-w-[42px] rounded-t-lg transition-all duration-300 group-hover:opacity-85 ${
                        isPerfect
                          ? 'bg-emerald-600'
                          : isGood
                          ? 'bg-emerald-500'
                          : quiz.percentage >= 60
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                    />

                    {/* Bottom Label (Session #) */}
                    <span className="text-[10px] text-neutral-600 mt-2 font-mono">
                      #{idx + 1}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-600 mt-3 pt-1">
              <span>Showing last {recentQuizzes.length} sessions (Chronological order)</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                  &ge;80%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                  60-79%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                  &lt;60%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* WEAK CHARACTERS / FOCUS LIST (if any exist) */}
      {weakCharacters.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-amber-950">Characters Needing Review</h3>
          </div>
          <p className="text-xs text-amber-900 mb-4">
            These characters had lower accuracy in your recent sessions. Click to hear pronunciation:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {weakCharacters.map(char => {
              const rec = masteryData[char.kana];
              return (
                <button
                  key={char.kana}
                  type="button"
                  onClick={() => speakKana(char.kana)}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-amber-200 hover:border-amber-400 shadow-xs transition-all text-center cursor-pointer group"
                >
                  <span className="text-3xl font-black text-neutral-900 group-hover:scale-110 transition-transform font-['Noto_Sans_JP',_sans-serif]">
                    {char.kana}
                  </span>
                  <span className="text-xs font-mono font-bold text-neutral-700 mt-1">
                    {char.romaji}
                  </span>
                  <span className="text-[10px] font-semibold text-rose-600 mt-1">
                    {rec ? `${rec.accuracy}% acc` : ''}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 46 HIRAGANA MASTERY MATRIX */}
      <div className="bg-white border-2 border-neutral-200 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Hiragana Mastery Grid (46 Gojūon)</h2>
            <p className="text-xs text-neutral-600">Visual breakdown of all 46 characters. Click any card to inspect stats & hear audio.</p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500 border border-emerald-600 inline-block" />
              <span>Mastered (&ge;75%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-400 border border-amber-500 inline-block" />
              <span>Learning</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-neutral-100 border border-neutral-300 inline-block" />
              <span>Unseen</span>
            </div>
          </div>
        </div>

        {/* Character Rows Grid */}
        <div className="space-y-4">
          {HIRAGANA_ROWS.map(row => (
            <div key={row.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-2.5 rounded-2xl bg-neutral-50/60 border border-neutral-200">
              <span className="text-xs font-bold text-neutral-700 sm:w-28 shrink-0">
                {row.label.split(' ')[0]}
              </span>

              <div className="flex flex-wrap gap-2">
                {row.chars.map(kana => {
                  const charInfo = HIRAGANA_CHARACTERS.find(c => c.kana === kana);
                  if (!charInfo) return null;
                  const rec = masteryData[kana];

                  let statusBg = 'bg-white border-neutral-300 text-neutral-800 hover:border-neutral-900';
                  if (rec && rec.attempts > 0) {
                    if (rec.attempts >= 2 && rec.accuracy >= 75) {
                      statusBg = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                    } else {
                      statusBg = 'bg-amber-100 border-amber-400 text-amber-950 font-bold';
                    }
                  }

                  return (
                    <button
                      key={kana}
                      type="button"
                      onClick={() => {
                        setSelectedKana(kana);
                        speakKana(kana);
                      }}
                      className={`flex flex-col items-center justify-center w-12 h-14 rounded-xl border-2 transition-all cursor-pointer hover:scale-105 active:scale-95 ${statusBg}`}
                    >
                      <span className="text-lg font-black font-['Noto_Sans_JP',_sans-serif]">
                        {kana}
                      </span>
                      <span className="text-[10px] font-mono font-medium opacity-75">
                        {charInfo.romaji}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SELECTED CHARACTER DETAIL MODAL / DRAWER */}
      {selectedKana && (() => {
        const char = HIRAGANA_CHARACTERS.find(c => c.kana === selectedKana);
        const rec = masteryData[selectedKana];
        if (!char) return null;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white border-2 border-neutral-900 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative">
              <button
                type="button"
                onClick={() => setSelectedKana(null)}
                className="absolute top-4 right-4 text-neutral-600 hover:text-neutral-900 font-bold text-sm p-1 rounded-lg"
              >
                ✕
              </button>

              <div className="text-center">
                <span className="text-7xl font-black text-neutral-950 font-['Noto_Sans_JP',_sans-serif] block mb-2">
                  {char.kana}
                </span>

                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-2xl font-mono font-extrabold text-neutral-800 uppercase">
                    {char.romaji}
                  </span>
                  <button
                    type="button"
                    onClick={() => speakKana(char.kana)}
                    className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800"
                    title="Play pronunciation"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 text-left text-xs space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Row:</span>
                    <span className="font-semibold text-neutral-900">{char.rowName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Practiced:</span>
                    <span className="font-semibold text-neutral-900">{rec?.attempts || 0} times</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Accuracy:</span>
                    <span className="font-semibold text-neutral-900">{rec ? `${rec.accuracy}%` : 'Not yet'}</span>
                  </div>
                  {char.hint && (
                    <div className="pt-2 border-t border-neutral-200 text-neutral-700">
                      <strong>Mnemonic:</strong> {char.hint}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedKana(null)}
                  className="w-full py-2.5 rounded-xl bg-neutral-900 text-white font-semibold text-sm hover:bg-neutral-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* QUIZ HISTORY TABLE */}
      <div className="bg-white border-2 border-neutral-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Detailed Session Logs</h2>
            <p className="text-xs text-neutral-600">Recorded history of all 10-card runs</p>
          </div>
          <span className="text-xs font-mono font-semibold text-neutral-600">
            {filteredHistory.length} total entries
          </span>
        </div>

        {filteredHistory.length === 0 ? (
          <p className="text-xs text-neutral-600 text-center py-6">No sessions matching this filter.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">Date & Time</th>
                  <th className="py-3 px-3">Exercise</th>
                  <th className="py-3 px-3">Score</th>
                  <th className="py-3 px-3">Accuracy</th>
                  <th className="py-3 px-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredHistory.slice(0, 15).map(item => (
                  <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-3 px-3 text-neutral-800 font-medium">
                      {new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      <span className="text-neutral-600 text-[11px] block">
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {item.exerciseType === 'hiragana-to-romaji' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md font-semibold text-[11px] bg-blue-50 text-blue-800 border border-blue-200">
                          Ex 1: Kana→Romaji
                        </span>
                      )}
                      {item.exerciseType === 'romaji-to-hiragana' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md font-semibold text-[11px] bg-purple-50 text-purple-800 border border-purple-200">
                          Ex 2: Romaji→Kana
                        </span>
                      )}
                      {item.exerciseType === 'word-romaji-to-hiragana' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md font-semibold text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Ex 3: Words (Pic→Kana)
                        </span>
                      )}
                      {item.exerciseType === 'word-hiragana-to-romaji' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md font-semibold text-[11px] bg-amber-50 text-amber-800 border border-amber-200">
                          Ex 4: Words (Pic→Romaji)
                        </span>
                      )}
                      {item.exerciseType === 'hiragana-drawing' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md font-semibold text-[11px] bg-rose-50 text-rose-800 border border-rose-200">
                          Ex 5: Stroke Tracing
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-neutral-900">
                      {item.score} / {item.totalQuestions}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`font-mono font-bold px-2 py-0.5 rounded-md text-[11px] ${
                        item.percentage >= 80
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.percentage >= 60
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {item.percentage}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-neutral-600 font-mono">
                      {item.timeSpentSeconds ? `${item.timeSpentSeconds}s` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
