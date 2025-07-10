import { useReducer, useEffect } from 'react';
import { GameState, GameAction } from '../types';

const STORAGE_KEY = 'kids-mini-game-state';

const initialState: GameState = {
  currentScreen: 'menu',
  character: {
    head: 'round',
    eyes: 'normal',
    ears: 'medium',
    torso: 'shirt',
    arms: 'normal',
    legs: 'pants',
    feet: 'shoes'
  },
  mazeProgress: {
    currentLevel: 1,
    completedLevels: []
  },
  coloringProgress: {},
  detectiveProgress: {
    currentLevel: 1,
    completedLevels: []
  }
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'NAVIGATE_TO':
      return { ...state, currentScreen: action.screen };
    
    case 'UPDATE_CHARACTER':
      return {
        ...state,
        character: {
          ...state.character,
          [action.part]: action.value
        }
      };
    
    case 'COMPLETE_MAZE_LEVEL':
      return {
        ...state,
        mazeProgress: {
          currentLevel: Math.max(state.mazeProgress.currentLevel, action.level + 1),
          completedLevels: [...new Set([...state.mazeProgress.completedLevels, action.level])]
        }
      };
    
    case 'UPDATE_COLORING':
      return {
        ...state,
        coloringProgress: {
          ...state.coloringProgress,
          [action.sceneId]: {
            ...state.coloringProgress[action.sceneId],
            [action.areaId]: action.color
          }
        }
      };
    
    case 'COMPLETE_DETECTIVE_LEVEL':
      return {
        ...state,
        detectiveProgress: {
          currentLevel: Math.max(state.detectiveProgress.currentLevel, action.level + 1),
          completedLevels: [...new Set([...state.detectiveProgress.completedLevels, action.level])]
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