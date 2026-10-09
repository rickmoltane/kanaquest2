import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ExerciseType } from '../types';
import { 
  BarChart3, 
  Grid3X3, 
  Volume2, 
  VolumeX, 
  Cloud, 
  CloudCheck, 
  LogIn, 
  LogOut
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
}

export const EXERCISE_OPTIONS: ExerciseOption[] = [
  { id: 'exercise-1', exerciseType: 'hiragana-to-romaji', number: '1' },
  { id: 'exercise-2', exerciseType: 'romaji-to-hiragana', number: '2' },
  { id: 'exercise-3', exerciseType: 'word-romaji-to-hiragana', number: '3' },
  { id: 'exercise-4', exerciseType: 'word-hiragana-to-romaji', number: '4' },
  { id: 'exercise-5', exerciseType: 'hiragana-drawing', number: '5' },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  soundEnabled,
  setSoundEnabled,
  onStartExercise,
}) => {
  const { currentUser, loginWithGoogle, logout, isSyncing } = useAuth();

  const handleSelectTab = (tabId: ActiveTab, type?: ExerciseType) => {
    if (type) {
      onStartExercise(type);
    }
    setActiveTab(tabId);
  };

  return (
    <header className="shrink-0 z-40 w-full border-b border-[#E2E8F0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <div className="max-w-5xl mx-auto px-3 sm:px-6">
        {/* Top Bar: Brand, Large [1] [2] [3] [4] [5] Buttons, and Utilities */}
        <div className="flex items-center justify-between h-13 sm:h-14 gap-2">
          
          {/* Brand Logo & Title */}
          <button
            type="button"
            onClick={() => handleSelectTab('exercise-1', 'hiragana-to-romaji')}
            className="flex items-center gap-2 shrink-0 text-left cursor-pointer group"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#1A73E8] text-white flex items-center justify-center font-black text-sm sm:text-base shadow-xs group-hover:bg-[#1557B0] transition-colors">
              あ
            </div>
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#1F2329] hidden sm:inline">
              KanaQuest
            </span>
          </button>

          {/* Centered Easy-to-Click 1, 2, 3, 4, 5 Buttons (No exercise names on top row) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 justify-center flex-1 max-w-sm sm:max-w-md mx-auto">
            {EXERCISE_OPTIONS.map(opt => {
              const isSelected = activeTab === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectTab(opt.id, opt.exerciseType)}
                  aria-label={`Exercise ${opt.number}`}
                  className={`flex-1 h-10 sm:h-11 max-w-[58px] sm:max-w-[70px] rounded-xl font-mono text-base sm:text-lg font-black flex items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1A73E8] text-white shadow-md ring-2 ring-[#93C5FD] scale-105'
                      : 'bg-[#F8FAFF] text-[#1F2329] border-2 border-[#CBD5E1] hover:border-[#1A73E8] hover:bg-[#EDF2F7]'
                  }`}
                  title={`Exercise ${opt.number}`}
                >
                  {opt.number}
                </button>
              );
            })}
          </div>

          {/* Right Utilities: Progress, Chart, Sound, Cloud */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Quick Link: Progress Dashboard */}
            <button
              type="button"
              onClick={() => handleSelectTab('dashboard')}
              className={`p-2 rounded-xl transition-colors cursor-pointer border ${
                activeTab === 'dashboard' 
                  ? 'bg-[#1A73E8] text-white border-[#1A73E8]' 
                  : 'text-[#1F2329] hover:bg-[#F8FAFF] border-transparent hover:border-[#E2E8F0]'
              }`}
              title="Progress Dashboard"
            >
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Quick Link: Kana Reference Chart */}
            <button
              type="button"
              onClick={() => handleSelectTab('chart')}
              className={`p-2 rounded-xl transition-colors cursor-pointer border ${
                activeTab === 'chart' 
                  ? 'bg-[#1A73E8] text-white border-[#1A73E8]' 
                  : 'text-[#1F2329] hover:bg-[#F8FAFF] border-transparent hover:border-[#E2E8F0]'
              }`}
              title="Gojūon Kana Reference Chart"
            >
              <Grid3X3 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled(prev => !prev)}
              aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
              className="p-2 rounded-xl text-[#1F2329] hover:bg-[#F8FAFF] border border-transparent hover:border-[#E2E8F0] transition-colors cursor-pointer"
              title={soundEnabled ? 'Sound is ON' : 'Sound is OFF'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#1A73E8]" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-[#5F6368]" />}
            </button>

            {/* Cloud Sync Status */}
            {currentUser ? (
              <div className="flex items-center gap-1 pl-1 border-l border-[#E2E8F0]">
                <div 
                  className="flex items-center gap-1 text-xs text-[#1A73E8] font-bold px-2 py-1 rounded-xl bg-[#E8F0FE] border border-[#BFDBFE]"
                  title="Cloud Synced"
                >
                  {isSyncing ? (
                    <Cloud className="w-3.5 h-3.5 animate-pulse text-[#1A73E8]" />
                  ) : (
                    <CloudCheck className="w-3.5 h-3.5 text-[#1A73E8]" />
                  )}
                  <span className="hidden md:inline">Sync</span>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  aria-label="Sign out"
                  title="Sign out"
                  className="p-1 text-[#5F6368] hover:text-[#1F2329] rounded cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={loginWithGoogle}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl bg-[#1A73E8] text-white hover:bg-[#1557B0] transition-colors cursor-pointer shadow-xs"
                title="Sign in with Google"
              >
                <LogIn className="w-3 h-3" />
                <span>Sync</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
