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
    ctx.strokeStyle = '#e4e4e7'; // zinc-200
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
    ctx.strokeStyle = '#f4f4f5';
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
      ctx.strokeStyle = '#059669'; // emerald-600
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
      ctx.strokeStyle = '#18181b'; // zinc-900 sumi ink
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
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDrawing(true);
    const pt = getCanvasCoords(e);
    setCurrentStrokePoints([pt]);
    setFeedback(null);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
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
    <div className="h-full flex flex-col justify-between max-w-lg mx-auto px-2 sm:px-4 py-1 sm:py-2 overflow-hidden select-none">
      {/* Top Header */}
      <div className="shrink-0 mb-0.5 sm:mb-1">
        <div className="flex items-center justify-between text-xs mb-0.5 px-0.5">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-neutral-900 text-xs">Exercise 5</span>
            <span className="text-neutral-500 font-medium text-[11px] hidden xs:inline">
              (Stroke Tracing)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-neutral-100 text-neutral-800">
              Score: <strong className="text-neutral-900">{currentScore}</strong> / {currentIndex + (isCharacterCompleted ? 1 : 0)}
            </span>
            <button
              type="button"
              onClick={initSession}
              title="Restart session"
              className="text-neutral-500 hover:text-neutral-900 p-0.5 rounded hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 10-Segment Progress Bar */}
        <div className="grid grid-cols-10 gap-0.5 sm:gap-1 h-1.5 w-full bg-neutral-100 p-0.5 rounded-full">
          {Array.from({ length: 10 }).map((_, idx) => {
            const answer = answers[idx];
            let segmentClass = 'bg-neutral-200';
            if (idx === currentIndex && !isCharacterCompleted) {
              segmentClass = 'bg-neutral-900 ring-1 ring-neutral-400';
            } else if (answer) {
              segmentClass = answer.isCorrect ? 'bg-emerald-600' : 'bg-rose-500';
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
        <div className="flex justify-between items-center text-[9px] sm:text-[10px] text-neutral-400 mt-0.5 px-0.5">
          <span>Card {currentIndex + 1} of 10</span>
          <span>Trace over the 30% faded outline</span>
        </div>
      </div>

      {/* DRAWING CARD - Fills vertical viewport without scrolling */}
      <div className="flex-1 min-h-0 flex flex-col justify-between bg-white border-2 border-neutral-900 rounded-2xl sm:rounded-3xl shadow-sm p-2 sm:p-4 overflow-hidden my-0.5 sm:my-1">
        
        {/* Top Info Bar */}
        <div className="shrink-0 mb-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="px-2.5 py-0.5 rounded-lg bg-neutral-900 text-white font-mono text-lg sm:text-2xl font-black">
                {currentChar.romaji}
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                  Trace in Stroke Order
                </p>
                <p className="text-[10px] sm:text-[11px] text-neutral-800 font-semibold">
                  {currentChar.totalStrokes} Stroke{currentChar.totalStrokes > 1 ? 's' : ''} total
                </p>
              </div>
            </div>

            {/* Pronounce Button */}
            {isCharacterCompleted && (
              <button
                type="button"
                onClick={() => speakKana(currentChar.kana)}
                className="flex items-center gap-1 text-[11px] font-bold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
              >
                <Volume2 className="w-3 h-3" />
                <span>Hear</span>
              </button>
            )}
          </div>

          {/* Stroke Step Indicator Chips */}
          <div className="flex items-center gap-1 mt-1 overflow-x-auto pb-0.5 scrollbar-none">
            {currentChar.strokes.map((st, idx) => {
              const isDone = idx < currentStrokeIndex || isCharacterCompleted;
              const isCurrent = idx === currentStrokeIndex && !isCharacterCompleted;

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold transition-all whitespace-nowrap ${
                    isDone
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : isCurrent
                      ? 'bg-neutral-900 text-white shadow-xs ring-1 ring-neutral-400'
                      : 'bg-neutral-100 text-neutral-500 border border-neutral-200'
                  }`}
                >
                  <span>Stroke {idx + 1}</span>
                  {isDone && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-700" />}
                </div>
              );
            })}
          </div>

          {/* Current Stroke Guidance */}
          {currentStroke && !isCharacterCompleted && (
            <div className="text-[10px] bg-neutral-50 border border-neutral-200 rounded px-2 py-0.5 mt-0.5 text-neutral-800 flex items-center justify-between">
              <span className="flex items-center gap-1 truncate font-medium">
                <Edit3 className="w-2.5 h-2.5 text-neutral-700 shrink-0" />
                <span className="truncate"><strong>Stroke {currentStroke.strokeNumber}:</strong> {currentStroke.instruction}</span>
              </span>
            </div>
          )}
        </div>

        {/* ================= DRAWING CANVAS CONTAINER ================= */}
        <div className="flex-1 min-h-0 w-full flex items-center justify-center p-0.5 sm:p-2 overflow-hidden my-auto">
          <div className="relative aspect-square h-full max-h-[min(38vh,260px)] sm:max-h-[310px] w-auto border-2 border-neutral-900 rounded-xl sm:rounded-2xl bg-white shadow-inner overflow-hidden touch-none flex items-center justify-center">
            
            {/* FADED HIRAGANA OUTLINE: FONT 200, 30% OPACITY */}
            <div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none font-['Noto_Sans_JP',_sans-serif] font-black text-[120px] sm:text-[190px] leading-none text-black"
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
                      className={`absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[9px] font-mono font-bold shadow-xs transition-all ${
                        isCurrent
                          ? 'bg-rose-600 text-white ring-2 ring-rose-200 scale-110 animate-pulse'
                          : 'bg-neutral-800 text-white opacity-60'
                      }`}
                    >
                      {st.strokeNumber}
                    </div>
                  );
                })}
              </div>
            )}

            {/* HTML5 Interactive Drawing Canvas */}
            <canvas
              ref={canvasRef}
              width={340}
              height={340}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="w-full h-full cursor-crosshair relative z-10"
            />
          </div>
        </div>

        {/* Bottom Feedback Banner */}
        {feedback && (
          <div className={`mt-0.5 py-0.5 px-2 rounded-md text-[10px] sm:text-[11px] font-semibold flex items-center gap-1.5 animate-fade-in shrink-0 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-rose-50 text-rose-900 border border-rose-200'
          }`}>
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="w-3 h-3 text-rose-600 shrink-0" />
            )}
            <span className="truncate">{feedback.message}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-0.5 pt-1 flex items-center justify-between gap-1 border-t border-neutral-100 shrink-0 text-xs">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleClearCurrentStroke}
              disabled={completedStrokes.length === 0 || isCharacterCompleted}
              className="px-2 py-0.5 rounded-md border border-neutral-300 text-neutral-700 hover:text-neutral-900 text-[10px] sm:text-[11px] font-bold disabled:opacity-30 cursor-pointer"
            >
              Undo
            </button>
            <button
              type="button"
              onClick={handleResetCharacter}
              className="px-2 py-0.5 rounded-md border border-neutral-300 text-neutral-700 hover:text-neutral-900 text-[10px] sm:text-[11px] font-bold cursor-pointer"
            >
              Clear
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowStrokeNumbers(prev => !prev)}
              className="p-1 text-neutral-500 hover:text-neutral-900 rounded hover:bg-neutral-100 cursor-pointer"
              title={showStrokeNumbers ? 'Hide start numbers' : 'Show start numbers'}
            >
              {showStrokeNumbers ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-neutral-400" />}
            </button>

            {isCharacterCompleted && (
              <button
                type="button"
                onClick={() => handleAdvance()}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 transition-all shadow-xs cursor-pointer"
              >
                <span>{currentIndex === 9 ? 'Finish' : 'Next'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
