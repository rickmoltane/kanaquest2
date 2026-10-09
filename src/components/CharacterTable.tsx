import React, { useState } from 'react';
import { HIRAGANA_CHARACTERS, HIRAGANA_ROWS } from '../data/hiraganaData';
import { speakKana } from '../utils/audio';
import { Volume2, Lightbulb, Play, BookOpen } from 'lucide-react';
import { ExerciseType } from '../types';

interface CharacterTableProps {
  onStartExercise: (type: ExerciseType) => void;
}

export const CharacterTable: React.FC<CharacterTableProps> = ({ onStartExercise }) => {
  const [activeKana, setActiveKana] = useState<string | null>(null);

  const activeChar = HIRAGANA_CHARACTERS.find(c => c.kana === activeKana);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
            Gojūon Hiragana Chart (五十音)
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            The fundamental 46 Japanese Hiragana syllabary characters. Click any tile to listen to clear native pronunciation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onStartExercise('hiragana-to-romaji')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1A73E8] text-white text-xs font-bold hover:bg-[#1557B0] transition-colors shadow-xs cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Practice in Ex 1</span>
          </button>
        </div>
      </div>

      {/* Grid of Rows */}
      <div className="space-y-4">
        {HIRAGANA_ROWS.map(row => (
          <div
            key={row.id}
            className="bg-white border-2 border-neutral-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center gap-4"
          >
            <div className="sm:w-36 shrink-0">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 block">
                {row.label.split(' ')[0]}
              </span>
              <span className="text-xs text-neutral-600">
                {row.chars.length} characters
              </span>
            </div>

            <div className="flex flex-wrap gap-2.5 sm:gap-3 flex-1">
              {row.chars.map(kana => {
                const char = HIRAGANA_CHARACTERS.find(c => c.kana === kana);
                if (!char) return null;
                const isSelected = activeKana === kana;

                return (
                  <button
                    key={kana}
                    type="button"
                    onClick={() => {
                      setActiveKana(kana);
                      speakKana(kana);
                    }}
                    className={`flex flex-col items-center justify-center w-14 h-16 sm:w-16 sm:h-20 rounded-xl border-2 transition-all cursor-pointer group ${
                      isSelected
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-md scale-105'
                        : 'border-neutral-200 bg-neutral-50/50 hover:border-neutral-900 hover:bg-white text-neutral-900'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl font-black font-['Noto_Sans_JP',_sans-serif]">
                      {kana}
                    </span>
                    <span className={`text-xs font-mono font-bold mt-1 ${isSelected ? 'text-neutral-200' : 'text-neutral-600'}`}>
                      {char.romaji}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Detail drawer when a character is clicked */}
      {activeChar && (
        <div className="fixed bottom-6 right-6 z-30 max-w-sm bg-white border-2 border-neutral-900 rounded-3xl p-5 shadow-2xl animate-fade-in">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <span className="text-5xl font-black text-neutral-950 font-['Noto_Sans_JP',_sans-serif]">
                {activeChar.kana}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-mono font-black uppercase text-neutral-900">
                    {activeChar.romaji}
                  </span>
                  <button
                    type="button"
                    onClick={() => speakKana(activeChar.kana)}
                    className="p-1 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-800"
                    title="Replay pronunciation"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-neutral-600 font-medium">{activeChar.rowName}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveKana(null)}
              className="text-neutral-600 hover:text-neutral-900 text-xs font-bold p-1"
            >
              ✕
            </button>
          </div>

          {activeChar.hint && (
            <div className="mt-3 pt-3 border-t border-neutral-200 text-xs text-neutral-700 flex items-start gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span><strong>Mnemonic:</strong> {activeChar.hint}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
