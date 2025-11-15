// Game State Types
export type GameScreen = 'menu' | 'character-creator' | 'maze' | 'coloring' | 'detective' | 'counting' | 'math';

export interface CharacterParts {
  head: string;
  eyes: string;
  ears: string;
  torso: string;
  arms: string;
  legs: string;
  feet: string;
}

export interface GameState {
  currentScreen: GameScreen;
  character: CharacterParts;
  mazeProgress: {
    currentLevel: number;
    completedLevels: number[];
  };
  coloringProgress: {
    [sceneId: string]: {
      [areaId: string]: string;
    };
  };
  detectiveProgress: {
    currentLevel: number;
    completedLevels: number[];
  };
  countingProgress: {
    currentLevel: number;
    completedLevels: number[];
  };
  mathProgress: {
    currentLevel: number;
    completedLevels: number[];
  };
}

export type GameAction = 
  | { type: 'NAVIGATE_TO'; screen: GameScreen }
  | { type: 'UPDATE_CHARACTER'; part: keyof CharacterParts; value: string }
  | { type: 'COMPLETE_MAZE_LEVEL'; level: number }
  | { type: 'UPDATE_COLORING'; sceneId: string; areaId: string; color: string }
  | { type: 'COMPLETE_DETECTIVE_LEVEL'; level: number }
  | { type: 'COMPLETE_COUNTING_LEVEL'; level: number }
  | { type: 'COMPLETE_MATH_LEVEL'; level: number }
  | { type: 'LOAD_SAVED_STATE'; state: Partial<GameState> };

// Component Props
export interface GameButtonProps {
  onClick: () => void;
  icon: string;
  label: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'warning';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

// Maze Game Types
export interface MazeCell {
  x: number;
  y: number;
  type: 'wall' | 'path' | 'start' | 'goal';
}

export interface MazeLevel {
  id: number;
  grid: MazeCell[][];
  playerStart: { x: number; y: number };
  goal: { x: number; y: number };
}

// Coloring Game Types
export interface ColoringArea {
  id: string;
  number: number;
  color?: string;
  path: string;
}

export interface ColoringScene {
  id: string;
  name: string;
  areas: ColoringArea[];
  backgroundElements: string[];
}

// Detective Game Types
export interface DetectiveItem {
  id: string;
  name: string;
  icon: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface DetectiveLevel {
  id: number;
  backgroundImage: string;
  hiddenItem: DetectiveItem;
  decoyItems: DetectiveItem[];
}

// Counting Game Types
export interface CountingLevel {
  id: number;
  objectEmoji: string;
  objectName: string;
  count: number;
  minCount: number;
  maxCount: number;
}

// Math Game Types
export interface MathLevel {
  id: number;
  type: 'addition' | 'subtraction';
  operand1: number;
  operand2: number;
  answer: number;
  minAnswer: number;
  maxAnswer: number;
}