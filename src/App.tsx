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

function MainContent() {
  const { currentUser, refreshUserData } = useAuth();

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

    // Save to local storage and Firestore Cloud DB
    try {
      await saveQuizResult(
        currentUser ? currentUser.uid : null,
        result,
        currentUser ? { email: currentUser.email || undefined, displayName: currentUser.displayName || undefined } : undefined
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
    } bg-[#fafaf9] text-neutral-900 flex flex-col font-sans selection:bg-neutral-900 selection:text-white`}>
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
        <footer className="border-t border-neutral-200 py-4 px-4 bg-white text-xs text-neutral-600 text-center shrink-0">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-neutral-900">KanaQuest</span>
              <span>&bull;</span>
              <span>Minimalist Japanese Trainer</span>
            </div>
            <div className="flex items-center gap-3 text-neutral-500 text-[11px]">
              <span>Single-Screen Mobile Layout</span>
              <span>&bull;</span>
              <span>Cloud Sync Active</span>
            </div>
          </div>
        </footer>
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
