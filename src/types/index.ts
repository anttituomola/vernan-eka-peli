// Game State Types
export type GameScreen =
  | 'menu'
  | 'character-creator'
  | 'maze'
  | 'coloring'
  | 'detective';

export interface CharacterParts {
  head: string;
  eyes: string;
  ears: string;
  torso: string;
  arms: string;
  legs: string;
  feet: string;
}

export interface CharacterColors {
  head: string;
  torso: string;
  arms: string;
  legs: string;
  feet: string;
}

export interface Character {
  parts: CharacterParts;
  colors: CharacterColors;
}

export interface GameState {
  currentScreen: GameScreen;
  character: Character;
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
}

export type GameAction =
  | { type: 'NAVIGATE_TO'; screen: GameScreen }
  | { type: 'UPDATE_CHARACTER_PART'; part: keyof CharacterParts; value: string }
  | {
      type: 'UPDATE_CHARACTER_COLOR';
      part: keyof CharacterColors;
      color: string;
    }
  | { type: 'COMPLETE_MAZE_LEVEL'; level: number }
  | { type: 'UPDATE_COLORING'; sceneId: string; areaId: string; color: string }
  | { type: 'COMPLETE_DETECTIVE_LEVEL'; level: number }
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
