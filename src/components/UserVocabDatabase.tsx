import React, { useState, useMemo } from 'react';
import { 
  USER_VOCAB_DB, 
  USER_VOCAB_CATEGORIES, 
  UserVocabItem, 
  UserVocabCategoryFilter 
} from '../data/userVocabDb';
import { speakKana } from '../utils/audio';
import { 
  Search, 
  Volume2, 
  ShieldCheck, 
  BookOpen, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Play, 
  Hash,
  Database
} from 'lucide-react';
import { ExerciseType } from '../types';

interface UserVocabDatabaseProps {
  onStartExercise: (type: ExerciseType) => void;
  soundEnabled: boolean;
}

export const UserVocabDatabase: React.FC<UserVocabDatabaseProps> = ({ 
  onStartExercise, 
  soundEnabled 
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<UserVocabCategoryFilter>('All');
  const [selectedBatch, setSelectedBatch] = useState<'all' | 1 | 2 | 3 | 4 | 5 | 6 | 7>('all');
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handlePlayAudio = (item: UserVocabItem) => {
    if (!soundEnabled) return;
    setPlayingId(item.id);
    speakKana(item.hiragana);
    setTimeout(() => {
      setPlayingId(null);
    }, 1200);
  };

  // Filter items
  const filteredItems = useMemo(() => {
    return USER_VOCAB_DB.filter(item => {
      // Category match
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      // Batch match
      if (selectedBatch !== 'all' && item.batch !== selectedBatch) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesRomaji = item.romaji.toLowerCase().includes(query);
        const matchesEnglish = item.english.toLowerCase().includes(query);
        const matchesHiragana = item.hiragana.toLowerCase().includes(query);
        const matchesKanji = item.kanji ? item.kanji.toLowerCase().includes(query) : false;
        return matchesRomaji || matchesEnglish || matchesHiragana || matchesKanji;
      }
      return true;
    });
  }, [searchQuery, selectedCategory, selectedBatch]);

  // Aggregate stats
  const totalItems = USER_VOCAB_DB.length;
  const batch1Count = USER_VOCAB_DB.filter(i => i.batch === 1).length;
  const batch2Count = USER_VOCAB_DB.filter(i => i.batch === 2).length;
  const batch3Count = USER_VOCAB_DB.filter(i => i.batch === 3).length;
  const batch4Count = USER_VOCAB_DB.filter(i => i.batch === 4).length;
  const batch5Count = USER_VOCAB_DB.filter(i => i.batch === 5).length;
  const batch6Count = USER_VOCAB_DB.filter(i => i.batch === 6).length;
  const batch7Count = USER_VOCAB_DB.filter(i => i.batch === 7).length;
  const wordCount = USER_VOCAB_DB.filter(i => i.itemType === 'word').length;
  const phraseCount = USER_VOCAB_DB.filter(i => i.itemType !== 'word').length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#1A73E8] text-white flex items-center justify-center font-black">
              <Database className="w-4.5 h-4.5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1F2329] tracking-tight">
              My Vocab & Phrases Database
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {totalItems} Approved
            </span>
          </div>
          <p className="text-sm text-[#5F6368] mt-1.5 max-w-2xl">
            Central repository of all vocabulary and phrases provided directly by you. Every exercise strictly draws only from these approved items.
          </p>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onStartExercise('word-romaji-to-hiragana')}
            className="px-3 py-2 rounded-xl bg-white border border-[#CBD5E1] hover:border-[#1A73E8] text-[#1F2329] text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-[#1A73E8]" />
            <span>Ex [2] Words</span>
          </button>
          <button
            type="button"
            onClick={() => onStartExercise('exchange-romaji')}
            className="px-3 py-2 rounded-xl bg-[#1A73E8] hover:bg-[#1557B0] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Ex [5] Dialogue</span>
          </button>
        </div>
      </div>

      {/* Strict Guarantee Callout */}
      <div className="p-4 rounded-2xl bg-linear-to-r from-blue-50/70 via-indigo-50/50 to-emerald-50/60 border border-blue-200/80 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#1A73E8] text-white flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-xs space-y-1">
            <h3 className="font-extrabold text-sm text-[#1F2329] flex items-center gap-2">
              <span>Strict Mode Active</span>
              <span className="px-2 py-0.2 rounded-md bg-emerald-100 text-emerald-800 font-mono text-[11px] font-bold">
                100% User Provided
              </span>
            </h3>
            <p className="text-[#4B5563] leading-relaxed">
              Every single quiz question, multiple-choice prompt, and decoy distractor in Exercises 1 through 6 is constructed exclusively from words and phrases in this database. We will add new vocabulary every few days as you provide them, ensuring you practice what you've learned without unintroduced material.
            </p>
          </div>
        </div>
      </div>

      {/* Database Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        <div className="p-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
          <div className="flex items-center justify-between text-[#5F6368] text-xs font-semibold">
            <span>Total</span>
            <Database className="w-4 h-4 text-[#1A73E8]" />
          </div>
          <div className="mt-1.5 text-2xl font-black text-[#1F2329] font-mono">
            {totalItems}
          </div>
          <div className="text-[11px] text-[#5F6368] mt-0.5 font-medium">
            100% verified
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
          <div className="flex items-center justify-between text-[#5F6368] text-xs font-semibold">
            <span>Batch 1</span>
            <BookOpen className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-1.5 text-2xl font-black text-[#1F2329] font-mono">
            {batch1Count}
          </div>
          <div className="text-[11px] text-[#5F6368] mt-0.5 font-medium truncate">
            Essentials
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
          <div className="flex items-center justify-between text-[#5F6368] text-xs font-semibold">
            <span>Batch 2</span>
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-1.5 text-2xl font-black text-[#1F2329] font-mono">
            {batch2Count}
          </div>
          <div className="text-[11px] text-[#5F6368] mt-0.5 font-medium truncate">
            Roles &amp; Ages
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
          <div className="flex items-center justify-between text-[#5F6368] text-xs font-semibold">
            <span>Batch 3</span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-1.5 text-2xl font-black text-[#1F2329] font-mono">
            {batch3Count}
          </div>
          <div className="text-[11px] text-[#5F6368] mt-0.5 font-medium truncate">
            Objects &amp; Eric
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
          <div className="flex items-center justify-between text-[#5F6368] text-xs font-semibold">
            <span>Batch 4</span>
            <Sparkles className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-1.5 text-2xl font-black text-[#1F2329] font-mono">
            {batch4Count}
          </div>
          <div className="text-[11px] text-[#5F6368] mt-0.5 font-medium truncate">
            Time &amp; Days
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
          <div className="flex items-center justify-between text-[#5F6368] text-xs font-semibold">
            <span>Batch 5</span>
            <Sparkles className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-1.5 text-2xl font-black text-[#1F2329] font-mono">
            {batch5Count}
          </div>
          <div className="text-[11px] text-[#5F6368] mt-0.5 font-medium truncate">
            Family &amp; Places
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
          <div className="flex items-center justify-between text-[#5F6368] text-xs font-semibold">
            <span>Batch 6</span>
            <Sparkles className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-1.5 text-2xl font-black text-[#1F2329] font-mono">
            {batch6Count}
          </div>
          <div className="text-[11px] text-[#5F6368] mt-0.5 font-medium truncate">
            Food &amp; Dining
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
          <div className="flex items-center justify-between text-[#5F6368] text-xs font-semibold">
            <span>Batch 7</span>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-1.5 text-2xl font-black text-[#1F2329] font-mono">
            {batch7Count}
          </div>
          <div className="text-[11px] text-[#5F6368] mt-0.5 font-medium truncate">
            Verbs &amp; Places
          </div>
        </div>
      </div>

      {/* Useful Distinctions Callout */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 shadow-2xs">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
          <span>💡 Useful Distinctions &amp; Grammar Tips</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs text-amber-950">
          <div className="bg-white/80 p-2 rounded-xl border border-amber-200/60">
            <span className="font-bold text-amber-900">4 Verb Forms:</span>
            <div className="mt-0.5 text-[11px] leading-tight space-y-0.5">
              <div>&bull; ます (-masu): present / future affirmative</div>
              <div>&bull; ました (-mashita): past affirmative</div>
              <div>&bull; ません (-masen): present / future negative</div>
              <div>&bull; ませんでした (-masendeshita): past negative</div>
            </div>
          </div>
          <div className="bg-white/80 p-2 rounded-xl border border-amber-200/60">
            <span className="font-bold text-amber-900">Dictionary Forms:</span> 食べる (taberu = to eat), 飲む (nomu = to drink), 起きる (okiru = wake up), 寝る (neru = sleep), する (suru = do), 行く (iku = go).
          </div>
          <div className="bg-white/80 p-2 rounded-xl border border-amber-200/60">
            <span className="font-bold text-amber-900">Negative Adjectives:</span>
            <div className="mt-0.5 text-[11px] leading-tight space-y-0.5">
              <div>&bull; い-adjectives: drop い &rarr; + くないです (おいしくないです, たかくないです)</div>
              <div>&bull; な-adjective / noun: + じゃないです (好きじゃないです)</div>
            </div>
          </div>
          <div className="bg-white/80 p-2 rounded-xl border border-amber-200/60">
            <span className="font-bold text-amber-900">Place + に + 行きます:</span> 駅に行きます (I am going to the station), 新宿に行きます (I am going to Shinjuku).
          </div>
          <div className="bg-white/80 p-2 rounded-xl border border-amber-200/60">
            <span className="font-bold text-amber-900">Place + で + Action Verb:</span> 映画館で映画を見ます (I watch a movie at the cinema), 地下鉄で行きます (I go by subway).
          </div>
          <div className="bg-white/80 p-2 rounded-xl border border-amber-200/60">
            <span className="font-bold text-amber-900">Time + から + まで:</span> 病院は何時から何時までですか？ (From what time until what time is the hospital open?).
          </div>
          <div className="bg-white/80 p-2 rounded-xl border border-amber-200/60">
            <span className="font-bold text-amber-900">Noun + を + 食べます／飲みます:</span> を (o) marks what you consume (パンを食べます = eat bread; 水を飲みます = drink water).
          </div>
          <div className="bg-white/80 p-2 rounded-xl border border-amber-200/60">
            <span className="font-bold text-amber-900">お茶 (ocha) vs 紅茶 (kōcha):</span> お茶 = green tea / general tea; 紅茶 = black tea specifically.
          </div>
          <div className="bg-white/80 p-2 rounded-xl border border-amber-200/60">
            <span className="font-bold text-amber-900">Likes &amp; Dislikes:</span> 肉が好きです (I like meat); 魚は好きじゃないです / 好きじゃありません (I don't like fish).
          </div>
          <div className="bg-white/80 p-2 rounded-xl border border-amber-200/60">
            <span className="font-bold text-amber-900">Frequency + Negatives:</span> いつも (always) &amp; よく (often) take positive; あまり (not much) &amp; 全然 (not at all) always take negative verbs!
          </div>
          <div className="bg-white/80 p-2 rounded-xl border border-amber-200/60">
            <span className="font-bold text-amber-900">Place + に + 住んでいます:</span> 東京に住んでいます (I live in Tokyo), 大阪に住んでいます (I live in Osaka).
          </div>
          <div className="bg-white/80 p-2 rounded-xl border border-amber-200/60">
            <span className="font-bold text-amber-900">Curriculum Size:</span> {wordCount} words &bull; {phraseCount} phrases across all 7 batches ({totalItems} total).
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3 bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-2xs">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Romaji, English, Hiragana, or Kanji..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-[#F8FAFF] border border-[#CBD5E1] focus:border-[#1A73E8] focus:bg-white focus:outline-hidden transition-all text-[#1F2329]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#94A3B8] hover:text-[#1F2329]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Batch Filter Buttons */}
          <div className="flex items-center gap-1 bg-[#F8FAFF] p-1 rounded-xl border border-[#CBD5E1] self-start sm:self-auto shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => setSelectedBatch('all')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                selectedBatch === 'all' 
                  ? 'bg-white text-[#1F2329] shadow-xs' 
                  : 'text-[#5F6368] hover:text-[#1F2329]'
              }`}
            >
              All Batches
            </button>
            <button
              type="button"
              onClick={() => setSelectedBatch(1)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                selectedBatch === 1 
                  ? 'bg-white text-[#1F2329] shadow-xs' 
                  : 'text-[#5F6368] hover:text-[#1F2329]'
              }`}
            >
              Batch 1 ({batch1Count})
            </button>
            <button
              type="button"
              onClick={() => setSelectedBatch(2)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                selectedBatch === 2 
                  ? 'bg-white text-[#1F2329] shadow-xs' 
                  : 'text-[#5F6368] hover:text-[#1F2329]'
              }`}
            >
              Batch 2 ({batch2Count})
            </button>
            <button
              type="button"
              onClick={() => setSelectedBatch(3)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                selectedBatch === 3 
                  ? 'bg-white text-[#1F2329] shadow-xs' 
                  : 'text-[#5F6368] hover:text-[#1F2329]'
              }`}
            >
              Batch 3 ({batch3Count})
            </button>
            <button
              type="button"
              onClick={() => setSelectedBatch(4)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                selectedBatch === 4 
                  ? 'bg-white text-[#1F2329] shadow-xs' 
                  : 'text-[#5F6368] hover:text-[#1F2329]'
              }`}
            >
              Batch 4 ({batch4Count})
            </button>
            <button
              type="button"
              onClick={() => setSelectedBatch(5)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                selectedBatch === 5 
                  ? 'bg-white text-[#1F2329] shadow-xs' 
                  : 'text-[#5F6368] hover:text-[#1F2329]'
              }`}
            >
              Batch 5 ({batch5Count})
            </button>
            <button
              type="button"
              onClick={() => setSelectedBatch(6)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                selectedBatch === 6 
                  ? 'bg-white text-[#1F2329] shadow-xs' 
                  : 'text-[#5F6368] hover:text-[#1F2329]'
              }`}
            >
              Batch 6 ({batch6Count})
            </button>
            <button
              type="button"
              onClick={() => setSelectedBatch(7)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                selectedBatch === 7 
                  ? 'bg-white text-[#1F2329] shadow-xs' 
                  : 'text-[#5F6368] hover:text-[#1F2329]'
              }`}
            >
              Batch 7 ({batch7Count})
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
          {USER_VOCAB_CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat;
            const count = cat === 'All' 
              ? USER_VOCAB_DB.length 
              : USER_VOCAB_DB.filter(i => i.category === cat).length;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#1A73E8] text-white border-[#1A73E8] shadow-xs'
                    : 'bg-[#F8FAFF] text-[#5F6368] border-[#E2E8F0] hover:border-[#CBD5E1] hover:text-[#1F2329]'
                }`}
              >
                <span>{cat}</span>
                <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[#E2E8F0] text-[#5F6368]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Items List / Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[#5F6368] px-2 font-semibold">
          <span>Showing {filteredItems.length} of {totalItems} items</span>
          <span>Tap speaker icon to listen</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredItems.map((item) => {
            const isAudioPlaying = playingId === item.id;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-4 flex flex-col justify-between hover:border-[#1A73E8] hover:shadow-xs transition-all group"
              >
                {/* Header row: Category & Batch */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold text-[#1A73E8] bg-[#E8F0FE] px-2 py-0.5 rounded-md truncate max-w-[170px]">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#5F6368] bg-[#F1F5F9] px-1.5 py-0.5 rounded-md shrink-0">
                    B{item.batch} &bull; User
                  </span>
                </div>

                {/* Japanese script & English */}
                <div className="my-1">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    {item.kanji && (
                      <span className="font-extrabold text-base sm:text-lg text-[#1F2329]">
                        {item.kanji}
                      </span>
                    )}
                    <span className="font-bold text-sm sm:text-base text-[#1A73E8] font-japanese">
                      {item.hiragana}
                    </span>
                  </div>

                  <div className="text-xs font-mono font-semibold text-[#5F6368] mt-1">
                    {item.romaji}
                  </div>

                  <div className="text-xs font-medium text-[#1F2329] mt-1.5 bg-[#F8FAFF] px-2.5 py-1 rounded-lg border border-[#F1F5F9]">
                    {item.english}
                  </div>

                  {item.notes && (
                    <div className="text-[11px] text-amber-900 bg-amber-50 border border-amber-200/80 px-2 py-1 rounded-lg mt-2 leading-relaxed font-medium flex items-start gap-1">
                      <span className="shrink-0">💡</span>
                      <span>{item.notes}</span>
                    </div>
                  )}
                </div>

                {/* Footer action: Audio & Item Type */}
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#F1F5F9]">
                  <span className="text-[10px] font-mono font-bold text-[#94A3B8] uppercase">
                    {item.itemType}
                  </span>

                  <button
                    type="button"
                    onClick={() => handlePlayAudio(item)}
                    aria-label={`Listen to ${item.romaji}`}
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                      isAudioPlaying
                        ? 'bg-[#1A73E8] text-white border-[#1A73E8] scale-105'
                        : 'bg-[#F8FAFF] text-[#1F2329] border-[#E2E8F0] hover:border-[#1A73E8] hover:text-[#1A73E8]'
                    }`}
                    title="Play Japanese pronunciation"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="p-8 text-center bg-white rounded-2xl border border-[#E2E8F0]">
            <p className="text-sm font-bold text-[#1F2329]">No matching vocabulary found</p>
            <p className="text-xs text-[#5F6368] mt-1">
              Try adjusting your search terms or clearing the category filter.
            </p>
          </div>
        )}
      </div>

      {/* Information Box on How We Add Future Batches */}
      <div className="p-4 rounded-2xl bg-white border border-[#CBD5E1] shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
            <BookOpen className="w-4.5 h-4.5" />
          </div>
          <div className="text-xs space-y-1">
            <h4 className="font-extrabold text-sm text-[#1F2329]">
              How We Add New Vocabulary Every Few Days
            </h4>
            <p className="text-[#5F6368] leading-relaxed">
              Whenever you share new vocabulary or conversational phrases in your messages, they are immediately added to this database as <span className="font-semibold text-[#1F2329]">Batch 3, Batch 4, etc.</span>, and all exercises will instantly unlock practice modes for them. You are completely in charge of the curriculum!
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
