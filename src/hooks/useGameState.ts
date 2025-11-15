import { useReducer, useEffect } from 'react';
import { GameState, GameAction } from '../types';

const STORAGE_KEY = 'kids-mini-game-state';

const initialState: GameState = {
  currentScreen: 'menu',
  character: {
    parts: {
      head: 'round',
      eyes: 'green_scan',
      ears: 'satellite',
      torso: 'rectangular',
      arms: 'basic',
      legs: 'basic',
      feet: 'boots',
    },
    colors: {
      head: '#3B82F6', // blue-500
      torso: '#EF4444', // red-500
      arms: '#10B981', // emerald-500
      legs: '#F59E0B', // amber-500
      feet: '#8B5CF6', // violet-500
    },
  },
  mazeProgress: {
    currentLevel: 1,
    completedLevels: [],
  },
  coloringProgress: {},
  detectiveProgress: {
    currentLevel: 1,
    completedLevels: []
  },
  countingProgress: {
    currentLevel: 1,
    completedLevels: []
  },
  mathProgress: {
    currentLevel: 1,
    completedLevels: []
  }
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'NAVIGATE_TO':
      return { ...state, currentScreen: action.screen };

    case 'UPDATE_CHARACTER_PART':
      return {
        ...state,
        character: {
          ...state.character,
          parts: {
            ...state.character.parts,
            [action.part]: action.value,
          },
        },
      };

    case 'UPDATE_CHARACTER_COLOR':
      return {
        ...state,
        character: {
          ...state.character,
          colors: {
            ...state.character.colors,
            [action.part]: action.color,
          },
        },
      };

    case 'COMPLETE_MAZE_LEVEL':
      return {
        ...state,
        mazeProgress: {
          currentLevel: Math.max(
            state.mazeProgress.currentLevel,
            action.level + 1
          ),
          completedLevels: [
            ...new Set([...state.mazeProgress.completedLevels, action.level]),
          ],
        },
      };

    case 'UPDATE_COLORING':
      return {
        ...state,
        coloringProgress: {
          ...state.coloringProgress,
          [action.sceneId]: {
            ...state.coloringProgress[action.sceneId],
            [action.areaId]: action.color,
          },
        },
      };

    case 'COMPLETE_DETECTIVE_LEVEL':
      return {
        ...state,
        detectiveProgress: {
          currentLevel: Math.max(
            state.detectiveProgress.currentLevel,
            action.level + 1
          ),
          completedLevels: [
            ...new Set([
              ...state.detectiveProgress.completedLevels,
              action.level,
            ]),
          ],
        },
      };
    
    case 'COMPLETE_COUNTING_LEVEL':
      return {
        ...state,
        countingProgress: {
          currentLevel: Math.max(state.countingProgress.currentLevel, action.level + 1),
          completedLevels: [...new Set([...state.countingProgress.completedLevels, action.level])]
        }
      };
    
    case 'COMPLETE_MATH_LEVEL':
      return {
        ...state,
        mathProgress: {
          currentLevel: Math.max(state.mathProgress.currentLevel, action.level + 1),
          completedLevels: [...new Set([...state.mathProgress.completedLevels, action.level])]
        }
      };
    
    case 'LOAD_SAVED_STATE':
      return { ...state, ...action.state };

    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Load saved state on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);

        // Migration: Convert old character format to new format
        if (parsedState.character && !parsedState.character.parts) {
          // Old format detected, migrate to new format
          parsedState.character = {
            parts: {
              head: parsedState.character.head || 'round',
              eyes: parsedState.character.eyes || 'green_scan',
              ears: parsedState.character.ears || 'satellite',
              torso: parsedState.character.torso || 'rectangular',
              arms: parsedState.character.arms || 'basic',
              legs: parsedState.character.legs || 'basic',
              feet: parsedState.character.feet || 'boots',
            },
            colors: {
              head: '#3B82F6', // blue-500
              torso: '#EF4444', // red-500
              arms: '#10B981', // emerald-500
              legs: '#F59E0B', // amber-500
              feet: '#8B5CF6', // violet-500
            },
          };
        }

        dispatch({ type: 'LOAD_SAVED_STATE', state: parsedState });
      }
    } catch (error) {
      console.warn('Failed to load saved game state:', error);
    }
  }, []);

  // Save state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to save game state:', error);
    }
  }, [state]);

  return { state, dispatch };
}
