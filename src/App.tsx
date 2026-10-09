/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar, ActiveTab } from './components/Navbar';
import { FlashcardQuiz } from './components/FlashcardQuiz';
import { DrawingTrainer } from './components/DrawingTrainer';
import { QuizSummary } from './components/QuizSummary';
import { ProgressDashboard } from './components/ProgressDashboard';
import { CharacterTable } from './components/CharacterTable';
import { ExerciseType, QuizResult } from './types';
import { saveQuizResult } from './services/storageService';
import { Cookie, X } from 'lucide-react';

function MainContent() {
  const { 
    currentUser, 
    guestUser, 
    profile, 
    refreshUserData, 
    showWelcomeBack, 
    dismissWelcomeBack 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<ActiveTab>('exercise-1');
  const [currentQuizType, setCurrentQuizType] = useState<ExerciseType>('hiragana-to-romaji');
  const [activeResult, setActiveResult] = useState<QuizResult | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('kanaquest_sound_enabled');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('kanaquest_sound_enabled', JSON.stringify(soundEnabled));
    } catch {}
  }, [soundEnabled]);

  const handleStartExercise = (type: ExerciseType) => {
    setCurrentQuizType(type);
    setActiveResult(null);
    if (type === 'hiragana-to-romaji') {
      setActiveTab('exercise-1');
    } else if (type === 'romaji-to-hiragana') {
      setActiveTab('exercise-2');
    } else if (type === 'word-romaji-to-hiragana') {
      setActiveTab('exercise-3');
    } else if (type === 'word-hiragana-to-romaji') {
      setActiveTab('exercise-4');
    } else {
      setActiveTab('exercise-5');
    }
  };

  const handleQuizComplete = async (result: QuizResult) => {
    setActiveResult(result);

    // Save to local storage and Cloud under guest account
    try {
      const effectiveUserId = currentUser ? currentUser.uid : guestUser.guestId;
      await saveQuizResult(
        effectiveUserId,
        result,
        { displayName: profile?.displayName || guestUser.displayName }
      );
      // Refresh Auth context stats
      await refreshUserData();
    } catch (err) {
      console.warn('Save result warning', err);
    }
  };

  const isExerciseView = !activeResult && ['exercise-1', 'exercise-2', 'exercise-3', 'exercise-4', 'exercise-5'].includes(activeTab);

  return (
    <div className={`${
      isExerciseView ? 'h-[100dvh] max-h-[100dvh] overflow-hidden' : 'min-h-[100dvh]'
    } bg-[#F8FAFF] text-[#1F2329] flex flex-col font-sans selection:bg-[#1A73E8] selection:text-white`}>
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'exercise-1') {
            setCurrentQuizType('hiragana-to-romaji');
            setActiveResult(null);
          } else if (tab === 'exercise-2') {
            setCurrentQuizType('romaji-to-hiragana');
            setActiveResult(null);
          } else if (tab === 'exercise-3') {
            setCurrentQuizType('word-romaji-to-hiragana');
            setActiveResult(null);
          } else if (tab === 'exercise-4') {
            setCurrentQuizType('word-hiragana-to-romaji');
            setActiveResult(null);
          } else if (tab === 'exercise-5') {
            setCurrentQuizType('hiragana-drawing');
            setActiveResult(null);
          }
        }}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onStartExercise={handleStartExercise}
      />

      {/* Main Body */}
      <main className={`flex-1 w-full ${isExerciseView ? 'min-h-0 overflow-hidden flex flex-col' : 'overflow-y-auto pb-10'}`}>
        {activeResult ? (
          <QuizSummary
            result={activeResult}
            onRetake={() => {
              setActiveResult(null);
            }}
            onSwitchExercise={(newType) => {
              handleStartExercise(newType);
            }}
            onOpenDashboard={() => {
              setActiveResult(null);
              setActiveTab('dashboard');
            }}
          />
        ) : activeTab === 'exercise-1' ? (
          <FlashcardQuiz
            key={`ex1_${currentQuizType}`}
            exerciseType="hiragana-to-romaji"
            soundEnabled={soundEnabled}
            onComplete={handleQuizComplete}
            onCancel={() => setActiveTab('dashboard')}
          />
        ) : activeTab === 'exercise-2' ? (
          <FlashcardQuiz
            key={`ex2_${currentQuizType}`}
            exerciseType="romaji-to-hiragana"
            soundEnabled={soundEnabled}
            onComplete={handleQuizComplete}
            onCancel={() => setActiveTab('dashboard')}
          />
        ) : activeTab === 'exercise-3' ? (
          <FlashcardQuiz
            key={`ex3_${currentQuizType}`}
            exerciseType="word-romaji-to-hiragana"
            soundEnabled={soundEnabled}
            onComplete={handleQuizComplete}
            onCancel={() => setActiveTab('dashboard')}
          />
        ) : activeTab === 'exercise-4' ? (
          <FlashcardQuiz
            key={`ex4_${currentQuizType}`}
            exerciseType="word-hiragana-to-romaji"
            soundEnabled={soundEnabled}
            onComplete={handleQuizComplete}
            onCancel={() => setActiveTab('dashboard')}
          />
        ) : activeTab === 'exercise-5' ? (
          <DrawingTrainer
            key={`ex5_${currentQuizType}`}
            soundEnabled={soundEnabled}
            onComplete={handleQuizComplete}
            onCancel={() => setActiveTab('dashboard')}
          />
        ) : activeTab === 'dashboard' ? (
          <ProgressDashboard onStartExercise={handleStartExercise} />
        ) : (
          <CharacterTable onStartExercise={handleStartExercise} />
        )}
      </main>

      {/* Minimal Footer (only shown when not in active 1-screen exercise) */}
      {!isExerciseView && (
        <footer className="border-t border-[#E2E8F0] py-4 px-4 bg-white text-xs text-[#5F6368] text-center shrink-0">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#1F2329]">KanaQuest</span>
              <span>&bull;</span>
              <span>Minimalist Japanese Trainer</span>
            </div>
            <div className="flex items-center gap-3 text-[#5F6368] text-[11px]">
              <span>Single-Screen Mobile Layout</span>
              <span>&bull;</span>
              <span className="flex items-center gap-1 text-[#1A73E8] font-semibold">
                <Cookie className="w-3 h-3" />
                <span>Guest Account Saved via Cookie</span>
              </span>
            </div>
          </div>
        </footer>
      )}

      {/* Floating Welcome Back Banner for Returning Guests */}
      {showWelcomeBack && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="flex items-center gap-3 bg-[#1F2329] text-white px-4 py-3 rounded-2xl shadow-xl border border-neutral-700 max-w-sm">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Cookie className="w-4.5 h-4.5" />
            </div>
            <div className="text-xs">
              <p className="font-bold text-white">
                Welcome back, {profile?.displayName || guestUser.displayName}!
              </p>
              <p className="text-neutral-300 text-[11px] mt-0.5">
                Recognized via cookie &bull; Progress & streak loaded
              </p>
            </div>
            <button
              type="button"
              onClick={dismissWelcomeBack}
              className="p-1 text-neutral-400 hover:text-white rounded-lg transition-colors ml-auto cursor-pointer"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
