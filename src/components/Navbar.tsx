import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ExerciseType } from '../types';
import { 
  BookOpen, 
  RotateCw, 
  Image as ImageIcon,
  Layers,
  Edit3,
  BarChart3, 
  Grid3X3, 
  Volume2, 
  VolumeX, 
  Cloud, 
  CloudCheck, 
  LogIn, 
  LogOut, 
  ChevronDown,
  Check,
  X
} from 'lucide-react';

export type ActiveTab = 'exercise-1' | 'exercise-2' | 'exercise-3' | 'exercise-4' | 'exercise-5' | 'dashboard' | 'chart';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  soundEnabled: boolean;
  setSoundEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  onStartExercise: (type: ExerciseType) => void;
}

export interface ExerciseOption {
  id: ActiveTab;
  exerciseType: ExerciseType;
  number: string;
  shortLabel: string;
  pillTitle: string;
  fullTitle: string;
  description: string;
  icon: React.ElementType;
}

export const EXERCISE_OPTIONS: ExerciseOption[] = [
  {
    id: 'exercise-1',
    exerciseType: 'hiragana-to-romaji',
    number: '1',
    shortLabel: 'Kana',
    pillTitle: '1 · Kana',
    fullTitle: 'Exercise 1: Kana → Romaji',
    description: 'Read Hiragana character & choose Romaji (10 cards)',
    icon: BookOpen,
  },
  {
    id: 'exercise-2',
    exerciseType: 'romaji-to-hiragana',
    number: '2',
    shortLabel: 'Romaji',
    pillTitle: '2 · Romaji',
    fullTitle: 'Exercise 2: Romaji → Kana',
    description: 'Read Romaji sound & choose matching Hiragana (10 cards)',
    icon: RotateCw,
  },
  {
    id: 'exercise-3',
    exerciseType: 'word-romaji-to-hiragana',
    number: '3',
    shortLabel: 'Pic→Kana',
    pillTitle: '3 · Pic→Kana',
    fullTitle: 'Exercise 3: Pic+Romaji → Kana',
    description: 'See everyday picture + Romaji, pick Hiragana word (10 cards)',
    icon: ImageIcon,
  },
  {
    id: 'exercise-4',
    exerciseType: 'word-hiragana-to-romaji',
    number: '4',
    shortLabel: 'Pic→Rom',
    pillTitle: '4 · Pic→Rom',
    fullTitle: 'Exercise 4: Pic+Kana → Romaji',
    description: 'See everyday picture + Hiragana, pick Romaji word (10 cards)',
    icon: Layers,
  },
  {
    id: 'exercise-5',
    exerciseType: 'hiragana-drawing',
    number: '5',
    shortLabel: 'Trace',
    pillTitle: '5 · Trace',
    fullTitle: 'Exercise 5: Stroke Tracing',
    description: 'Trace 10 Hiragana in correct stroke order over outline',
    icon: Edit3,
  },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  soundEnabled,
  setSoundEnabled,
  onStartExercise,
}) => {
  const { currentUser, loginWithGoogle, logout, isSyncing } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  const currentExercise = EXERCISE_OPTIONS.find(opt => opt.id === activeTab);

  const handleSelectTab = (tabId: ActiveTab, type?: ExerciseType) => {
    setModalOpen(false);
    if (type) {
      onStartExercise(type);
    }
    setActiveTab(tabId);
  };

  return (
    <header className="shrink-0 z-40 w-full border-b border-neutral-200 bg-white shadow-xs">
      {/* ROW 1: Brand & Top Utilities (Height 38px on mobile, 44px on desktop) */}
      <div className="max-w-4xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-9 sm:h-11 gap-1">
          
          {/* Brand Logo & Title */}
          <button
            type="button"
            onClick={() => handleSelectTab('exercise-1', 'hiragana-to-romaji')}
            className="flex items-center gap-1.5 shrink-0 text-left cursor-pointer group"
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-black text-xs sm:text-sm group-hover:bg-neutral-800 transition-colors">
              あ
            </div>
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-neutral-900">
              KanaQuest
            </span>
          </button>

          {/* Current Exercise Pill (Tappable to open full exercise menu) */}
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-900 text-xs font-bold transition-all truncate cursor-pointer max-w-[170px] sm:max-w-xs"
            title="Click to view all exercises"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
            <span className="truncate">
              {currentExercise ? currentExercise.fullTitle : activeTab === 'dashboard' ? '📊 Progress' : '🈁 Kana Chart'}
            </span>
            <ChevronDown className="w-3 h-3 text-neutral-500 shrink-0" />
          </button>

          {/* Right Utilities: Sound, Progress, Chart, Cloud */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Sound Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled(prev => !prev)}
              aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
              className="p-1 rounded-md text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 transition-colors cursor-pointer"
              title={soundEnabled ? 'Sound is ON' : 'Sound is OFF'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-neutral-800" /> : <VolumeX className="w-4 h-4 text-neutral-400" />}
            </button>

            {/* Quick Link: Progress */}
            <button
              type="button"
              onClick={() => handleSelectTab('dashboard')}
              className={`p-1 rounded-md transition-colors cursor-pointer ${
                activeTab === 'dashboard' ? 'bg-neutral-900 text-white' : 'text-neutral-700 hover:bg-neutral-100'
              }`}
              title="Progress Dashboard"
            >
              <BarChart3 className="w-4 h-4" />
            </button>

            {/* Quick Link: Kana Chart */}
            <button
              type="button"
              onClick={() => handleSelectTab('chart')}
              className={`p-1 rounded-md transition-colors cursor-pointer ${
                activeTab === 'chart' ? 'bg-neutral-900 text-white' : 'text-neutral-700 hover:bg-neutral-100'
              }`}
              title="Gojūon Kana Chart"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>

            {/* Cloud Sync Status */}
            {currentUser ? (
              <div className="flex items-center gap-1 pl-1 border-l border-neutral-200">
                <div 
                  className="flex items-center gap-0.5 text-[10px] text-emerald-800 font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200"
                  title="Cloud Synced"
                >
                  {isSyncing ? (
                    <Cloud className="w-3 h-3 animate-pulse text-emerald-600" />
                  ) : (
                    <CloudCheck className="w-3 h-3 text-emerald-600" />
                  )}
                  <span className="hidden md:inline">Sync</span>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  aria-label="Sign out"
                  title="Sign out"
                  className="p-0.5 text-neutral-500 hover:text-neutral-900 rounded cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={loginWithGoogle}
                className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold rounded bg-neutral-900 text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                title="Sign in with Google"
              >
                <LogIn className="w-2.5 h-2.5" />
                <span>Sync</span>
              </button>
            )}
          </div>
        </div>

        {/* ROW 2: Exercise Switcher Tabs (All 5 exercises in 1 clean line) */}
        <div className="flex items-center justify-between gap-1 py-1 border-t border-neutral-100 text-xs">
          <div className="grid grid-cols-5 gap-1 w-full max-w-2xl mx-auto">
            {EXERCISE_OPTIONS.map(opt => {
              const isSelected = activeTab === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectTab(opt.id, opt.exerciseType)}
                  className={`flex items-center justify-center gap-1 px-1 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer truncate ${
                    isSelected
                      ? 'bg-neutral-900 text-white shadow-xs ring-2 ring-neutral-900'
                      : 'bg-neutral-100 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-200'
                  }`}
                  title={opt.fullTitle}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center font-mono text-[10px] shrink-0 ${
                    isSelected ? 'bg-white text-neutral-900 font-black' : 'bg-neutral-300 text-neutral-800'
                  }`}>
                    {opt.number}
                  </span>
                  <span className="truncate text-[11px] sm:text-xs">
                    {opt.shortLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* EXERCISE PICKER MODAL (Full explanation & instant switch) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-neutral-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border-2 border-neutral-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 bg-neutral-50">
              <div>
                <h3 className="font-extrabold text-sm text-neutral-900">Choose Exercise</h3>
                <p className="text-[11px] text-neutral-500 font-medium">Select any mode to practice</p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Options List */}
            <div className="p-2 space-y-1.5 max-h-[70vh] overflow-y-auto">
              {EXERCISE_OPTIONS.map(opt => {
                const isSelected = activeTab === opt.id;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectTab(opt.id, opt.exerciseType)}
                    className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                        : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-800'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-black mt-0.5 ${
                      isSelected ? 'bg-white text-neutral-900' : 'bg-neutral-100 text-neutral-800'
                    }`}>
                      {opt.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-extrabold text-xs sm:text-sm truncate">
                          {opt.fullTitle}
                        </span>
                        {isSelected && (
                          <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500 text-white flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Active
                          </span>
                        )}
                      </div>
                      <p className={`text-[11px] mt-0.5 ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        {opt.description}
                      </p>
                    </div>
                  </button>
                );
              })}

              {/* Additional Pages */}
              <div className="pt-2 border-t border-neutral-200 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectTab('dashboard')}
                  className={`flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    activeTab === 'dashboard'
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Progress History</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectTab('chart')}
                  className={`flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    activeTab === 'chart'
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                  }`}
                >
                  <Grid3X3 className="w-3.5 h-3.5" />
                  <span>46 Kana Chart</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </header>
  );
};
