import React, { useState, useEffect, useRef, useCallback } from 'react';
import { QuizResult, AnswerRecord } from '../types';
import { HIRAGANA_STROKE_DATA, CharacterStrokeData, STROKE_PRACTICE_CHARS } from '../data/strokeData';
import { shuffleArray } from '../data/hiraganaData';
import { speakKana, playSuccessChime, playErrorBuzz } from '../utils/audio';
import { 
  RotateCcw, 
  RotateCw, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Lightbulb, 
  Eye, 
  EyeOff, 
  Volume2, 
  Sparkles,
  Edit3
} from 'lucide-react';

interface DrawingTrainerProps {
  soundEnabled: boolean;
  onComplete: (result: QuizResult) => void;
  onCancel: () => void;
}

interface Point {
  x: number;
  y: number;
}

interface CompletedStroke {
  strokeNumber: number;
  points: Point[];
}

export const DrawingTrainer: React.FC<DrawingTrainerProps> = ({
  soundEnabled,
  onComplete,
  onCancel,
}) => {
  const [characterList, setCharacterList] = useState<CharacterStrokeData[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentStrokeIndex, setCurrentStrokeIndex] = useState<number>(0);
  const [completedStrokes, setCompletedStrokes] = useState<CompletedStroke[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentStrokePoints, setCurrentStrokePoints] = useState<Point[]>([]);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isCharacterCompleted, setIsCharacterCompleted] = useState<boolean>(false);
  const [showStrokeNumbers, setShowStrokeNumbers] = useState<boolean>(true);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [startTime] = useState<number>(Date.now());
  const [mistakeCountOnChar, setMistakeCountOnChar] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize 10 characters for the session
  const initSession = useCallback(() => {
    const shuffledKeys = shuffleArray(STROKE_PRACTICE_CHARS);
    const selectedKeys = shuffledKeys.slice(0, 10);
    const chars = selectedKeys.map(k => HIRAGANA_STROKE_DATA[k]);
    setCharacterList(chars);
    setCurrentIndex(0);
    setCurrentStrokeIndex(0);
    setCompletedStrokes([]);
    setIsCharacterCompleted(false);
    setFeedback(null);
    setAnswers([]);
    setMistakeCountOnChar(0);
  }, []);

  useEffect(() => {
    initSession();
  }, [initSession]);

  const currentChar = characterList[currentIndex];

  // Redraw canvas whenever completedStrokes or currentStrokePoints change
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw Japanese Kanji grid guidelines (dashed quadrant lines)
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);

    // Horizontal center line
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Vertical center line
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    // Diagonal lines
    ctx.strokeStyle = '#F1F5F9';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, height);
    ctx.moveTo(width, 0);
    ctx.lineTo(0, height);
    ctx.stroke();

    ctx.setLineDash([]); // Reset dashed

    // 2. Draw completed strokes in emerald green
    completedStrokes.forEach(stroke => {
      if (stroke.points.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = '#16A34A'; // emerald-600
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const first = stroke.points[0];
      ctx.moveTo((first.x / 100) * width, (first.y / 100) * height);
      for (let i = 1; i < stroke.points.length; i++) {
        const pt = stroke.points[i];
        ctx.lineTo((pt.x / 100) * width, (pt.y / 100) * height);
      }
      ctx.stroke();
    });

    // 3. Draw active stroke in progress
    if (currentStrokePoints.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = '#1A73E8'; // Accent Blue
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const first = currentStrokePoints[0];
      ctx.moveTo((first.x / 100) * width, (first.y / 100) * height);
      for (let i = 1; i < currentStrokePoints.length; i++) {
        const pt = currentStrokePoints[i];
        ctx.lineTo((pt.x / 100) * width, (pt.y / 100) * height);
      }
      ctx.stroke();
    }
  }, [completedStrokes, currentStrokePoints]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Euclidean distance between two points (in percentage 0-100)
  const dist = (p1: Point, p2: Point) => {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Convert client pointer event to normalized 0-100 coordinate
  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isCharacterCompleted || !currentChar) return;
    e.preventDefault();
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
    setIsDrawing(true);
    const pt = getCanvasCoords(e);
    setCurrentStrokePoints([pt]);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const pt = getCanvasCoords(e);
    setCurrentStrokePoints(prev => [...prev, pt]);
  };

  // VALIDATE STROKE ON POINTER UP
  const handlePointerUp = () => {
    if (!isDrawing || !currentChar) return;
    setIsDrawing(false);

    const points = currentStrokePoints;
    setCurrentStrokePoints([]);

    // Ignore tiny taps
    if (points.length < 5) {
      return;
    }

    const startPt = points[0];
    const endPt = points[points.length - 1];
    const totalDist = dist(startPt, endPt);
    if (totalDist < 5 && points.length < 10) {
      return;
    }

    const expectedStroke = currentChar.strokes[currentStrokeIndex];
    if (!expectedStroke) return;

    // 1. Check if user attempted a different stroke (WRONG STROKE ORDER CHECK)
    for (let sIdx = 0; sIdx < currentChar.strokes.length; sIdx++) {
      if (sIdx !== currentStrokeIndex) {
        const otherStroke = currentChar.strokes[sIdx];
        const distToOtherStart = dist(startPt, otherStroke.startPoint);
        const distToExpectedStart = dist(startPt, expectedStroke.startPoint);

        // If user start point is significantly closer to a later stroke
        if (sIdx > currentStrokeIndex && distToOtherStart < 14 && distToOtherStart < distToExpectedStart - 8) {
          if (soundEnabled) playErrorBuzz();
          setFeedback({
            message: `Incorrect stroke order! Please draw Stroke ${currentStrokeIndex + 1} first.`,
            type: 'error',
          });
          setMistakeCountOnChar(prev => prev + 1);
          return;
        }
      }
    }

    // 2. Check alignment with expected stroke
    const startDist = dist(startPt, expectedStroke.startPoint);
    const endDist = dist(endPt, expectedStroke.endPoint);

    // Check reverse direction
    const reverseStartDist = dist(startPt, expectedStroke.endPoint);
    const reverseEndDist = dist(endPt, expectedStroke.startPoint);
    if (reverseStartDist < 16 && reverseEndDist < 16 && startDist > 16) {
      if (soundEnabled) playErrorBuzz();
      setFeedback({
        message: 'Drawn in reverse direction! Follow the stroke from start to finish.',
        type: 'error',
      });
      setMistakeCountOnChar(prev => prev + 1);
      return;
    }

    // Trajectory proximity: check average distance to waypoints
    let maxWaypointDist = 0;
    expectedStroke.waypoints.forEach(wp => {
      // Find closest user point to this waypoint
      let minDistToWp = 999;
      points.forEach(up => {
        const d = dist(up, wp);
        if (d < minDistToWp) minDistToWp = d;
      });
      if (minDistToWp > maxWaypointDist) maxWaypointDist = minDistToWp;
    });

    // Tolerance threshold (percentage of canvas)
    const startTolerance = 25; // 25% tolerance for starting point
    const waypointTolerance = 24; // 24% tolerance for general path proximity

    const isStartAccurate = startDist <= startTolerance;
    const isPathAccurate = maxWaypointDist <= waypointTolerance;

    if (!isStartAccurate || !isPathAccurate) {
      if (soundEnabled) playErrorBuzz();
      setFeedback({
        message: 'Stroke does not line up with the faded outline. Stay within the guide lines!',
        type: 'error',
      });
      setMistakeCountOnChar(prev => prev + 1);
      return;
    }

    // SUCCESS! The stroke is valid and in the right order!
    if (soundEnabled) playSuccessChime();

    const newCompleted: CompletedStroke = {
      strokeNumber: currentStrokeIndex + 1,
      points,
    };
    const updatedStrokes = [...completedStrokes, newCompleted];
    setCompletedStrokes(updatedStrokes);

    const nextStrokeIdx = currentStrokeIndex + 1;

    if (nextStrokeIdx < currentChar.totalStrokes) {
      // Advance to next stroke
      setCurrentStrokeIndex(nextStrokeIdx);
      setFeedback({
        message: `Stroke ${currentStrokeIndex + 1} completed! Now draw Stroke ${nextStrokeIdx + 1}.`,
        type: 'success',
      });
    } else {
      // CHARACTER FULLY COMPLETED!
      setIsCharacterCompleted(true);
      setFeedback({
        message: 'Kanpeki! (Perfect!) Character completed with correct stroke order.',
        type: 'success',
      });

      // Play pronunciation of character AFTER completion!
      if (soundEnabled) {
        setTimeout(() => {
          speakKana(currentChar.kana);
        }, 150);
      }

      // Record answer
      const isCorrect = mistakeCountOnChar === 0;
      const newAnswer: AnswerRecord = {
        character: {
          kana: currentChar.kana,
          romaji: currentChar.romaji,
          row: 'vowel',
          rowName: 'Hiragana',
        },
        selectedOption: currentChar.kana,
        correctOption: currentChar.kana,
        isCorrect,
        timeTakenMs: 0,
      };

      const updatedAnswers = [...answers, newAnswer];
      setAnswers(updatedAnswers);

      // Auto-advance after 1.4s
      setTimeout(() => {
        handleAdvance(updatedAnswers);
      }, 1400);
    }
  };

  const handleClearCurrentStroke = () => {
    if (completedStrokes.length > 0 && !isCharacterCompleted) {
      setCompletedStrokes(prev => prev.slice(0, prev.length - 1));
      setCurrentStrokeIndex(prev => Math.max(0, prev - 1));
      setFeedback(null);
    }
  };

  const handleResetCharacter = () => {
    setCompletedStrokes([]);
    setCurrentStrokeIndex(0);
    setIsCharacterCompleted(false);
    setFeedback(null);
    setMistakeCountOnChar(0);
  };

  const handleAdvance = (currentAnswersList?: AnswerRecord[]) => {
    const answersToUse = currentAnswersList || answers;

    if (currentIndex < 9) {
      setCurrentIndex(prev => prev + 1);
      setCurrentStrokeIndex(0);
      setCompletedStrokes([]);
      setIsCharacterCompleted(false);
      setFeedback(null);
      setMistakeCountOnChar(0);
    } else {
      // Completed all 10 characters!
      const correctCount = answersToUse.filter(a => a.isCorrect).length;
      const totalTimeSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));
      const percentage = Math.round((correctCount / 10) * 100);

      const quizResult: QuizResult = {
        id: `draw_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        userId: 'local',
        exerciseType: 'hiragana-drawing',
        score: correctCount,
        totalQuestions: 10,
        percentage,
        timeSpentSeconds: totalTimeSeconds,
        createdAt: new Date().toISOString(),
        items: answersToUse.map(a => ({
          kana: a.character?.kana || '',
          romaji: a.character?.romaji || '',
          selected: a.selectedOption,
          correct: a.correctOption,
          isCorrect: a.isCorrect,
        })),
      };

      onComplete(quizResult);
    }
  };

  if (!currentChar) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentStroke = currentChar.strokes[currentStrokeIndex];
  const currentScore = answers.filter(a => a.isCorrect).length;

  return (
    <div className="h-full flex flex-col justify-between max-w-3xl sm:max-w-4xl mx-auto w-full px-3 sm:px-6 py-1.5 sm:py-3 overflow-hidden select-none">
      {/* Top Header */}
      <div className="shrink-0 mb-1">
        <div className="flex items-center justify-between text-xs sm:text-sm mb-1 px-0.5">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs sm:text-sm px-2.5 py-0.5 rounded-lg bg-[#F8FAFF] border border-[#CBD5E1] text-[#1F2329]">
              Card {currentIndex + 1} / 10
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold px-2 py-0.5 rounded-lg bg-[#E8F0FE] text-[#1A73E8] border border-[#BFDBFE]">
              Score: <strong>{currentScore}</strong> / {currentIndex + (isCharacterCompleted ? 1 : 0)}
            </span>
            <button
              type="button"
              onClick={initSession}
              title="Restart session"
              className="text-[#5F6368] hover:text-[#1F2329] p-1 rounded-md hover:bg-[#EDF2F7] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 10-Segment Progress Bar */}
        <div className="grid grid-cols-10 gap-1 sm:gap-1.5 h-2 w-full bg-[#E2E8F0] p-0.5 rounded-full">
          {Array.from({ length: 10 }).map((_, idx) => {
            const answer = answers[idx];
            let segmentClass = 'bg-[#CBD5E1]';
            if (idx === currentIndex && !isCharacterCompleted) {
              segmentClass = 'bg-[#1A73E8] ring-2 ring-[#93C5FD]';
            } else if (answer) {
              segmentClass = answer.isCorrect ? 'bg-[#16A34A]' : 'bg-[#E11D48]';
            }
            return (
              <div
                key={idx}
                className={`h-full rounded-full transition-all duration-200 ${segmentClass}`}
                title={`Character ${idx + 1}`}
              />
            );
          })}
        </div>
        <div className="flex justify-between items-center text-[10px] sm:text-xs text-[#5F6368] mt-0.5 px-0.5 font-medium">
          <span>Progress</span>
          <span>Trace over the 30% faded Hiragana outline</span>
        </div>
      </div>

      {/* DRAWING CARD - Stable, no moving box */}
      <div className="flex-1 min-h-0 flex flex-col justify-between bg-white border-2 border-[#CBD5E1] rounded-2xl sm:rounded-3xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-3 sm:p-5 overflow-hidden my-1">
        
        {/* Top: BIG, CENTRAL, HIGHLY VISIBLE ROMAJI */}
        <div className="shrink-0 mb-1 sm:mb-2 flex items-center justify-center relative w-full">
          {/* Centered Large Romaji Showcase */}
          <div className="flex items-center justify-center">
            <div className="px-8 py-2 sm:px-16 sm:py-3 rounded-2xl bg-[#1F2329] text-white shadow-md border border-[#333] flex items-center justify-center">
              <span className="text-5xl sm:text-7xl font-black font-mono tracking-widest leading-none select-none">
                {currentChar.romaji}
              </span>
            </div>
          </div>

          {/* Hear pronunciation button positioned cleanly on the right when completed */}
          {isCharacterCompleted && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <button
                type="button"
                onClick={() => speakKana(currentChar.kana)}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1A73E8] bg-[#E8F0FE] hover:bg-[#D2E3FC] px-3 py-1.5 rounded-xl border border-[#BFDBFE] transition-colors cursor-pointer shadow-xs"
                title="Hear pronunciation"
              >
                <Volume2 className="w-4 h-4" />
                <span className="hidden sm:inline">Hear</span>
              </button>
            </div>
          )}
        </div>

        {/* ================= DRAWING CANVAS CONTAINER (STABLE, CENTERED) ================= */}
        <div className="flex-1 min-h-0 w-full flex items-center justify-center p-1 sm:p-2 overflow-hidden">
          <div className="relative aspect-square h-full max-h-[min(48vh,360px)] w-auto border-2 border-[#CBD5E1] rounded-2xl bg-white shadow-inner overflow-hidden touch-none select-none flex items-center justify-center">
            
            {/* FADED HIRAGANA OUTLINE: FONT 200, 30% OPACITY */}
            <div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none font-['Noto_Sans_JP',_sans-serif] font-black text-[140px] sm:text-[220px] leading-none text-[#1F2329]"
              style={{ opacity: 0.30 }}
            >
              {currentChar.kana}
            </div>

            {/* Stroke Number Start Dots & Guides (Optional Overlay) */}
            {showStrokeNumbers && !isCharacterCompleted && (
              <div className="absolute inset-0 pointer-events-none select-none">
                {currentChar.strokes.map((st, idx) => {
                  if (idx < currentStrokeIndex) return null;
                  const isCurrent = idx === currentStrokeIndex;

                  return (
                    <div
                      key={idx}
                      style={{ left: `${st.startPoint.x}%`, top: `${st.startPoint.y}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shadow-xs transition-all ${
                        isCurrent
                          ? 'bg-[#1A73E8] text-white ring-3 ring-[#93C5FD] scale-110'
                          : 'bg-[#1F2329] text-white opacity-60'
                      }`}
                    >
                      {st.strokeNumber}
                    </div>
                  );
                })}
              </div>
            )}

            {/* HTML5 Interactive Drawing Canvas with touch-none */}
            <canvas
              ref={canvasRef}
              width={380}
              height={380}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              style={{ touchAction: 'none' }}
              className="w-full h-full cursor-crosshair relative z-10 touch-none select-none block"
            />
          </div>
        </div>

        {/* CONSTANT-HEIGHT STATUS & GUIDANCE BAR (Prevents layout jumping!) */}
        <div className="h-8 sm:h-9 shrink-0 flex items-center justify-center px-1 my-1">
          {feedback ? (
            <div className={`w-full py-1 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 animate-fade-in ${
              feedback.type === 'success'
                ? 'bg-[#DCFCE7] text-[#166534] border border-[#86EFAC]'
                : 'bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3]'
            }`}>
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-[#166534] shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-[#9F1239] shrink-0" />
              )}
              <span className="truncate">{feedback.message}</span>
            </div>
          ) : currentStroke && !isCharacterCompleted ? (
            <div className="w-full py-1 px-3 rounded-xl text-xs sm:text-sm bg-[#F8FAFF] border border-[#E2E8F0] text-[#1F2329] font-medium flex items-center justify-center gap-2 truncate">
              <Edit3 className="w-3.5 h-3.5 text-[#1A73E8] shrink-0" />
              <span className="truncate">{currentStroke.instruction}</span>
            </div>
          ) : (
            <div className="text-xs text-[#5F6368] font-medium">Trace over the faded outline in order</div>
          )}
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#E2E8F0] shrink-0 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={handleClearCurrentStroke}
              disabled={completedStrokes.length === 0 || isCharacterCompleted}
              className="px-3 py-1.5 rounded-xl border border-[#CBD5E1] text-[#1F2329] hover:bg-[#F8FAFF] hover:border-[#1A73E8] text-xs sm:text-sm font-bold disabled:opacity-30 cursor-pointer transition-colors"
            >
              Undo
            </button>
            <button
              type="button"
              onClick={handleResetCharacter}
              className="px-3 py-1.5 rounded-xl border border-[#CBD5E1] text-[#1F2329] hover:bg-[#F8FAFF] hover:border-[#1A73E8] text-xs sm:text-sm font-bold cursor-pointer transition-colors"
            >
              Clear
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowStrokeNumbers(prev => !prev)}
              className="p-1.5 text-[#5F6368] hover:text-[#1F2329] rounded-lg hover:bg-[#F8FAFF] border border-transparent hover:border-[#E2E8F0] transition-colors cursor-pointer"
              title={showStrokeNumbers ? 'Hide start numbers' : 'Show start numbers'}
            >
              {showStrokeNumbers ? <Eye className="w-4 h-4 text-[#1A73E8]" /> : <EyeOff className="w-4 h-4 text-[#94A3B8]" />}
            </button>

            {isCharacterCompleted && (
              <button
                type="button"
                onClick={() => handleAdvance()}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#1A73E8] text-white font-bold text-xs sm:text-sm hover:bg-[#1557B0] transition-all shadow-xs cursor-pointer"
              >
                <span>{currentIndex === 9 ? 'Finish' : 'Next'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
