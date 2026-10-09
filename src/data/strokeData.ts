export interface StrokeDef {
  strokeNumber: number;
  startPoint: { x: number; y: number }; // Percentage 0-100
  endPoint: { x: number; y: number };
  waypoints: Array<{ x: number; y: number }>;
  instruction: string;
}

export interface CharacterStrokeData {
  kana: string;
  romaji: string;
  totalStrokes: number;
  strokes: StrokeDef[];
}

export const HIRAGANA_STROKE_DATA: Record<string, CharacterStrokeData> = {
  // あ (a) - 3 strokes
  'あ': {
    kana: 'あ',
    romaji: 'a',
    totalStrokes: 3,
    strokes: [
      {
        strokeNumber: 1,
        startPoint: { x: 28, y: 30 },
        endPoint: { x: 74, y: 30 },
        waypoints: [{ x: 28, y: 30 }, { x: 50, y: 30 }, { x: 74, y: 30 }],
        instruction: 'Top horizontal line left to right',
      },
      {
        strokeNumber: 2,
        startPoint: { x: 50, y: 18 },
        endPoint: { x: 44, y: 76 },
        waypoints: [{ x: 50, y: 18 }, { x: 48, y: 46 }, { x: 44, y: 76 }],
        instruction: 'Vertical line downward with slight curve',
      },
      {
        strokeNumber: 3,
        startPoint: { x: 38, y: 44 },
        endPoint: { x: 68, y: 74 },
        waypoints: [{ x: 38, y: 44 }, { x: 32, y: 64 }, { x: 56, y: 82 }, { x: 78, y: 56 }, { x: 68, y: 74 }],
        instruction: 'Diagonal down, loop around rightwards',
      },
    ],
  },

  // い (i) - 2 strokes
  'い': {
    kana: 'い',
    romaji: 'i',
    totalStrokes: 2,
    strokes: [
      {
        strokeNumber: 1,
        startPoint: { x: 32, y: 26 },
        endPoint: { x: 36, y: 74 },
        waypoints: [{ x: 32, y: 26 }, { x: 28, y: 52 }, { x: 36, y: 74 }],
        instruction: 'Left stroke downward curving with a hook',
      },
      {
        strokeNumber: 2,
        startPoint: { x: 68, y: 34 },
        endPoint: { x: 70, y: 64 },
        waypoints: [{ x: 68, y: 34 }, { x: 70, y: 48 }, { x: 70, y: 64 }],
        instruction: 'Right shorter stroke downward',
      },
    ],
  },

  // う (u) - 2 strokes
  'う': {
    kana: 'う',
    romaji: 'u',
    totalStrokes: 2,
    strokes: [
      {
        strokeNumber: 1,
        startPoint: { x: 42, y: 22 },
        endPoint: { x: 58, y: 28 },
        waypoints: [{ x: 42, y: 22 }, { x: 50, y: 24 }, { x: 58, y: 28 }],
        instruction: 'Small top diagonal stroke',
      },
      {
        strokeNumber: 2,
        startPoint: { x: 34, y: 40 },
        endPoint: { x: 38, y: 80 },
        waypoints: [{ x: 34, y: 40 }, { x: 66, y: 46 }, { x: 72, y: 64 }, { x: 52, y: 82 }, { x: 38, y: 80 }],
        instruction: 'Large curve arching right and swooping down',
      },
    ],
  },

  // え (e) - 2 strokes
  'え': {
    kana: 'え',
    romaji: 'e',
    totalStrokes: 2,
    strokes: [
      {
        strokeNumber: 1,
        startPoint: { x: 44, y: 20 },
        endPoint: { x: 56, y: 26 },
        waypoints: [{ x: 44, y: 20 }, { x: 56, y: 26 }],
        instruction: 'Small top slanted dot',
      },
      {
        strokeNumber: 2,
        startPoint: { x: 32, y: 38 },
        endPoint: { x: 74, y: 78 },
        waypoints: [{ x: 32, y: 38 }, { x: 68, y: 38 }, { x: 36, y: 62 }, { x: 54, y: 62 }, { x: 74, y: 78 }],
        instruction: 'Horizontal, diagonal back, then wave to the right',
      },
    ],
  },

  // お (o) - 3 strokes
  'お': {
    kana: 'お',
    romaji: 'o',
    totalStrokes: 3,
    strokes: [
      {
        strokeNumber: 1,
        startPoint: { x: 26, y: 32 },
        endPoint: { x: 60, y: 32 },
        waypoints: [{ x: 26, y: 32 }, { x: 60, y: 32 }],
        instruction: 'Short top horizontal line',
      },
      {
        strokeNumber: 2,
        startPoint: { x: 46, y: 22 },
        endPoint: { x: 52, y: 76 },
        waypoints: [{ x: 46, y: 22 }, { x: 46, y: 56 }, { x: 34, y: 70 }, { x: 68, y: 62 }, { x: 52, y: 76 }],
        instruction: 'Vertical line down, loop left and circle right',
      },
      {
        strokeNumber: 3,
        startPoint: { x: 68, y: 36 },
        endPoint: { x: 78, y: 46 },
        waypoints: [{ x: 68, y: 36 }, { x: 78, y: 46 }],
        instruction: 'Top-right diagonal accent dot',
      },
    ],
  },

  // か (ka) - 3 strokes
  'か': {
    kana: 'か',
    romaji: 'ka',
    totalStrokes: 3,
    strokes: [
      {
        strokeNumber: 1,
        startPoint: { x: 28, y: 36 },
        endPoint: { x: 48, y: 76 },
        waypoints: [{ x: 28, y: 36 }, { x: 54, y: 34 }, { x: 54, y: 56 }, { x: 48, y: 76 }],
        instruction: 'Left curve down with a hook',
      },
      {
        strokeNumber: 2,
        startPoint: { x: 38, y: 22 },
        endPoint: { x: 34, y: 78 },
        waypoints: [{ x: 38, y: 22 }, { x: 36, y: 50 }, { x: 34, y: 78 }],
        instruction: 'Downward vertical stroke cutting through',
      },
      {
        strokeNumber: 3,
        startPoint: { x: 66, y: 32 },
        endPoint: { x: 76, y: 42 },
        waypoints: [{ x: 66, y: 32 }, { x: 76, y: 42 }],
        instruction: 'Top-right short tick mark',
      },
    ],
  },

  // き (ki) - 3 strokes (or 4 in print)
  'き': {
    kana: 'き',
    romaji: 'ki',
    totalStrokes: 3,
    strokes: [
      {
        strokeNumber: 1,
        startPoint: { x: 32, y: 34 },
        endPoint: { x: 68, y: 34 },
        waypoints: [{ x: 32, y: 34 }, { x: 68, y: 34 }],
        instruction: 'First horizontal bar',
      },
      {
        strokeNumber: 2,
        startPoint: { x: 30, y: 46 },
        endPoint: { x: 70, y: 46 },
        waypoints: [{ x: 30, y: 46 }, { x: 70, y: 46 }],
        instruction: 'Second horizontal bar',
      },
      {
        strokeNumber: 3,
        startPoint: { x: 56, y: 22 },
        endPoint: { x: 62, y: 76 },
        waypoints: [{ x: 56, y: 22 }, { x: 48, y: 64 }, { x: 38, y: 76 }, { x: 62, y: 76 }],
        instruction: 'Diagonal cut down and looping bottom curve',
      },
    ],
  },

  // く (ku) - 1 stroke
  'く': {
    kana: 'く',
    romaji: 'ku',
    totalStrokes: 1,
    strokes: [
      {
        strokeNumber: 1,
        startPoint: { x: 62, y: 24 },
        endPoint: { x: 64, y: 78 },
        waypoints: [{ x: 62, y: 24 }, { x: 34, y: 50 }, { x: 64, y: 78 }],
        instruction: 'Single angle stroke down-left then down-right',
      },
    ],
  },

  // け (ke) - 3 strokes
  'け': {
    kana: 'け',
    romaji: 'ke',
    totalStrokes: 3,
    strokes: [
      {
        strokeNumber: 1,
        startPoint: { x: 28, y: 24 },
        endPoint: { x: 26, y: 78 },
        waypoints: [{ x: 28, y: 24 }, { x: 26, y: 52 }, { x: 26, y: 78 }],
        instruction: 'Left vertical stroke with bottom hook',
      },
      {
        strokeNumber: 2,
        startPoint: { x: 44, y: 36 },
        endPoint: { x: 76, y: 36 },
        waypoints: [{ x: 44, y: 36 }, { x: 76, y: 36 }],
        instruction: 'Right horizontal bar',
      },
      {
        strokeNumber: 3,
        startPoint: { x: 62, y: 24 },
        endPoint: { x: 64, y: 80 },
        waypoints: [{ x: 62, y: 24 }, { x: 62, y: 54 }, { x: 64, y: 80 }],
        instruction: 'Right vertical line cutting down with curve',
      },
    ],
  },

  // こ (ko) - 2 strokes
  'こ': {
    kana: 'こ',
    romaji: 'ko',
    totalStrokes: 2,
    strokes: [
      {
        strokeNumber: 1,
        startPoint: { x: 30, y: 34 },
        endPoint: { x: 70, y: 34 },
        waypoints: [{ x: 30, y: 34 }, { x: 70, y: 34 }],
        instruction: 'Top horizontal stroke curving slightly down at end',
      },
      {
        strokeNumber: 2,
        startPoint: { x: 30, y: 66 },
        endPoint: { x: 70, y: 66 },
        waypoints: [{ x: 30, y: 66 }, { x: 50, y: 68 }, { x: 70, y: 66 }],
        instruction: 'Bottom horizontal curve',
      },
    ],
  },

  // さ (sa) - 3 strokes
  'さ': {
    kana: 'さ',
    romaji: 'sa',
    totalStrokes: 3,
    strokes: [
      {
        strokeNumber: 1,
        startPoint: { x: 30, y: 38 },
        endPoint: { x: 70, y: 34 },
        waypoints: [{ x: 30, y: 38 }, { x: 70, y: 34 }],
        instruction: 'Upward angled horizontal line',
      },
      {
        strokeNumber: 2,
        startPoint: { x: 56, y: 22 },
        endPoint: { x: 46, y: 66 },
        waypoints: [{ x: 56, y: 22 }, { x: 46, y: 66 }],
        instruction: 'Downward diagonal slash',
      },
      {
        strokeNumber: 3,
        startPoint: { x: 36, y: 64 },
        endPoint: { x: 66, y: 74 },
        waypoints: [{ x: 36, y: 64 }, { x: 38, y: 78 }, { x: 66, y: 74 }],
        instruction: 'Bottom curve left to right',
      },
    ],
  },

  // し (shi) - 1 stroke
  'し': {
    kana: 'し',
    romaji: 'shi',
    totalStrokes: 1,
    strokes: [
      {
        strokeNumber: 1,
        startPoint: { x: 38, y: 22 },
        endPoint: { x: 68, y: 58 },
        waypoints: [{ x: 38, y: 22 }, { x: 38, y: 66 }, { x: 52, y: 78 }, { x: 68, y: 58 }],
        instruction: 'Vertical line down sweeping upward like a fish hook',
      },
    ],
  },

  // す (su) - 2 strokes
  'す': {
    kana: 'す',
    romaji: 'su',
    totalStrokes: 2,
    strokes: [
      {
        strokeNumber: 1,
        startPoint: { x: 26, y: 32 },
        endPoint: { x: 76, y: 32 },
        waypoints: [{ x: 26, y: 32 }, { x: 76, y: 32 }],
        instruction: 'Horizontal line left to right',
      },
      {
        strokeNumber: 2,
        startPoint: { x: 52, y: 18 },
        endPoint: { x: 42, y: 84 },
        waypoints: [{ x: 52, y: 18 }, { x: 52, y: 48 }, { x: 38, y: 58 }, { x: 58, y: 58 }, { x: 42, y: 84 }],
        instruction: 'Vertical line down with a circular loop in the center',
      },
    ],
  },

  // せ (se) - 3 strokes
  'せ': {
    kana: 'せ',
    romaji: 'se',
    totalStrokes: 3,
    strokes: [
      {
        strokeNumber: 1,
        startPoint: { x: 24, y: 40 },
        endPoint: { x: 76, y: 36 },
        waypoints: [{ x: 24, y: 40 }, { x: 76, y: 36 }],
        instruction: 'Horizontal stroke',
      },
      {
        strokeNumber: 2,
        startPoint: { x: 64, y: 24 },
        endPoint: { x: 62, y: 74 },
        waypoints: [{ x: 64, y: 24 }, { x: 64, y: 54 }, { x: 62, y: 74 }],
        instruction: 'Right vertical line turning left at bottom',
      },
      {
        strokeNumber: 3,
        startPoint: { x: 38, y: 22 },
        endPoint: { x: 64, y: 76 },
        waypoints: [{ x: 38, y: 22 }, { x: 38, y: 74 }, { x: 64, y: 76 }],
        instruction: 'Left vertical line turning right along bottom',
      },
    ],
  },

  // そ (so) - 1 stroke
  'そ': {
    kana: 'そ',
    romaji: 'so',
    totalStrokes: 1,
    strokes: [
      {
        strokeNumber: 1,
        startPoint: { x: 32, y: 26 },
        endPoint: { x: 68, y: 74 },
        waypoints: [{ x: 32, y: 26 }, { x: 64, y: 26 }, { x: 32, y: 48 }, { x: 66, y: 48 }, { x: 36, y: 74 }, { x: 68, y: 74 }],
        instruction: 'Zigzag top then swoop down-right',
      },
    ],
  },

  // た (ta) - 4 strokes
  'た': {
    kana: 'た',
    romaji: 'ta',
    totalStrokes: 4,
    strokes: [
      {
        strokeNumber: 1,
        startPoint: { x: 22, y: 36 },
        endPoint: { x: 50, y: 34 },
        waypoints: [{ x: 22, y: 36 }, { x: 50, y: 34 }],
        instruction: 'Left horizontal bar',
      },
      {
        strokeNumber: 2,
        startPoint: { x: 36, y: 22 },
        endPoint: { x: 28, y: 74 },
        waypoints: [{ x: 36, y: 22 }, { x: 28, y: 74 }],
        instruction: 'Left diagonal slash',
      },
      {
        strokeNumber: 3,
        startPoint: { x: 52, y: 44 },
        endPoint: { x: 76, y: 42 },
        waypoints: [{ x: 52, y: 44 }, { x: 76, y: 42 }],
        instruction: 'Upper right short horizontal line',
      },
      {
        strokeNumber: 4,
        startPoint: { x: 48, y: 64 },
        endPoint: { x: 74, y: 62 },
        waypoints: [{ x: 48, y: 64 }, { x: 74, y: 62 }],
        instruction: 'Lower right short horizontal line',
      },
    ],
  },

  // ち (chi) - 2 strokes
  'ち': {
    kana: 'ち',
    romaji: 'chi',
    totalStrokes: 2,
    strokes: [
      {
        strokeNumber: 1,
        startPoint: { x: 30, y: 32 },
        endPoint: { x: 68, y: 30 },
        waypoints: [{ x: 30, y: 32 }, { x: 68, y: 30 }],
        instruction: 'Top horizontal stroke',
      },
      {
        strokeNumber: 2,
        startPoint: { x: 46, y: 20 },
        endPoint: { x: 54, y: 80 },
        waypoints: [{ x: 46, y: 20 }, { x: 40, y: 48 }, { x: 68, y: 56 }, { x: 54, y: 80 }],
        instruction: 'Vertical slash down with a large loop to the right',
      },
    ],
  },

  // つ (tsu) - 1 stroke
  'つ': {
    kana: 'つ',
    romaji: 'tsu',
    totalStrokes: 1,
    strokes: [
      {
        strokeNumber: 1,
        startPoint: { x: 30, y: 34 },
        endPoint: { x: 38, y: 76 },
        waypoints: [{ x: 30, y: 34 }, { x: 70, y: 34 }, { x: 72, y: 60 }, { x: 38, y: 76 }],
        instruction: 'Horizontal start then arch down like a tidal wave',
      },
    ],
  },

  // て (te) - 1 stroke
  'て': {
    kana: 'て',
    romaji: 'te',
    totalStrokes: 1,
    strokes: [
      {
        strokeNumber: 1,
        startPoint: { x: 28, y: 32 },
        endPoint: { x: 58, y: 76 },
        waypoints: [{ x: 28, y: 32 }, { x: 70, y: 32 }, { x: 44, y: 56 }, { x: 58, y: 76 }],
        instruction: 'Horizontal right, diagonal back, then curved tail',
      },
    ],
  },

  // と (to) - 2 strokes
  'と': {
    kana: 'と',
    romaji: 'to',
    totalStrokes: 2,
    strokes: [
      {
        strokeNumber: 1,
        startPoint: { x: 40, y: 24 },
        endPoint: { x: 46, y: 52 },
        waypoints: [{ x: 40, y: 24 }, { x: 46, y: 52 }],
        instruction: 'Short diagonal line down and right',
      },
      {
        strokeNumber: 2,
        startPoint: { x: 64, y: 34 },
        endPoint: { x: 64, y: 76 },
        waypoints: [{ x: 64, y: 34 }, { x: 38, y: 52 }, { x: 42, y: 74 }, { x: 64, y: 76 }],
        instruction: 'Right arch curving left then bottom round',
      },
    ],
  },

  // な (na) - 4 strokes
  'な': {
    kana: 'な',
    romaji: 'na',
    totalStrokes: 4,
    strokes: [
      {
        strokeNumber: 1,
        startPoint: { x: 24, y: 34 },
        endPoint: { x: 46, y: 34 },
        waypoints: [{ x: 24, y: 34 }, { x: 46, y: 34 }],
        instruction: 'Left horizontal bar',
      },
      {
        strokeNumber: 2,
        startPoint: { x: 38, y: 22 },
        endPoint: { x: 30, y: 74 },
        waypoints: [{ x: 38, y: 22 }, { x: 30, y: 74 }],
        instruction: 'Downward slash',
      },
      {
        strokeNumber: 3,
        startPoint: { x: 60, y: 30 },
        endPoint: { x: 70, y: 38 },
        waypoints: [{ x: 60, y: 30 }, { x: 70, y: 38 }],
        instruction: 'Upper-right accent tick',
      },
      {
        strokeNumber: 4,
        startPoint: { x: 56, y: 46 },
        endPoint: { x: 60, y: 78 },
        waypoints: [{ x: 56, y: 46 }, { x: 56, y: 64 }, { x: 44, y: 72 }, { x: 60, y: 78 }],
        instruction: 'Vertical line down with a loop at the bottom',
      },
    ],
  },

  // に (ni) - 3 strokes
  'に': {
    kana: 'に',
    romaji: 'ni',
    totalStrokes: 3,
    strokes: [
      {
        strokeNumber: 1,
        startPoint: { x: 30, y: 24 },
        endPoint: { x: 28, y: 76 },
        waypoints: [{ x: 30, y: 24 }, { x: 28, y: 76 }],
        instruction: 'Left vertical stroke with hook',
      },
      {
        strokeNumber: 2,
        startPoint: { x: 50, y: 38 },
        endPoint: { x: 74, y: 38 },
        waypoints: [{ x: 50, y: 38 }, { x: 74, y: 38 }],
        instruction: 'Upper right horizontal stroke',
      },
      {
        strokeNumber: 3,
        startPoint: { x: 48, y: 64 },
        endPoint: { x: 76, y: 64 },
        waypoints: [{ x: 48, y: 64 }, { x: 76, y: 64 }],
        instruction: 'Lower right horizontal stroke',
      },
    ],
  },

  // は (ha) - 3 strokes
  'は': {
    kana: 'は',
    romaji: 'ha',
    totalStrokes: 3,
    strokes: [
      {
        strokeNumber: 1,
        startPoint: { x: 28, y: 22 },
        endPoint: { x: 26, y: 78 },
        waypoints: [{ x: 28, y: 22 }, { x: 26, y: 78 }],
        instruction: 'Left vertical stroke with hook',
      },
      {
        strokeNumber: 2,
        startPoint: { x: 46, y: 36 },
        endPoint: { x: 74, y: 36 },
        waypoints: [{ x: 46, y: 36 }, { x: 74, y: 36 }],
        instruction: 'Right horizontal bar',
      },
      {
        strokeNumber: 3,
        startPoint: { x: 60, y: 24 },
        endPoint: { x: 62, y: 78 },
        waypoints: [{ x: 60, y: 24 }, { x: 60, y: 62 }, { x: 48, y: 72 }, { x: 68, y: 72 }],
        instruction: 'Vertical slash down with a bottom circular loop',
      },
    ],
  },

  // ま (ma) - 3 strokes
  'ま': {
    kana: 'ま',
    romaji: 'ma',
    totalStrokes: 3,
    strokes: [
      {
        strokeNumber: 1,
        startPoint: { x: 30, y: 32 },
        endPoint: { x: 70, y: 32 },
        waypoints: [{ x: 30, y: 32 }, { x: 70, y: 32 }],
        instruction: 'Top horizontal bar',
      },
      {
        strokeNumber: 2,
        startPoint: { x: 30, y: 48 },
        endPoint: { x: 70, y: 48 },
        waypoints: [{ x: 30, y: 48 }, { x: 70, y: 48 }],
        instruction: 'Middle horizontal bar',
      },
      {
        strokeNumber: 3,
        startPoint: { x: 50, y: 20 },
        endPoint: { x: 54, y: 80 },
        waypoints: [{ x: 50, y: 20 }, { x: 50, y: 64 }, { x: 38, y: 74 }, { x: 58, y: 74 }],
        instruction: 'Vertical stroke straight down with loop',
      },
    ],
  },

  // ん (n) - 1 stroke
  'ん': {
    kana: 'ん',
    romaji: 'n',
    totalStrokes: 1,
    strokes: [
      {
        strokeNumber: 1,
        startPoint: { x: 34, y: 24 },
        endPoint: { x: 76, y: 68 },
        waypoints: [{ x: 34, y: 24 }, { x: 30, y: 62 }, { x: 52, y: 38 }, { x: 64, y: 68 }, { x: 76, y: 68 }],
        instruction: 'Slash down, curve up like letter "n" with an upward tail',
      },
    ],
  },
};

export const STROKE_PRACTICE_CHARS = Object.keys(HIRAGANA_STROKE_DATA);
