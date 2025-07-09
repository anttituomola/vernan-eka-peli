import React, { createContext, useContext } from 'react';
import { useGameState } from './hooks/useGameState';
import { GameState, GameAction } from './types';
import MainMenu from './components/MainMenu';
import CharacterCreator from './games/CharacterCreator';
import MazeGame from './games/MazeGame';
import ColoringBook from './games/ColoringBook';
import DetectiveGame from './games/DetectiveGame';

// Create Game Context
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

function App() {
  const { state, dispatch } = useGameState();

  const renderCurrentScreen = () => {
    switch (state.currentScreen) {
      case 'menu':
        return <MainMenu />;
      case 'character-creator':
        return <CharacterCreator />;
      case 'maze':
        return <MazeGame />;
      case 'coloring':
        return <ColoringBook />;
      case 'detective':
        return <DetectiveGame />;
      default:
        return <MainMenu />;
    }
  };

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      <div className="game-container">
        {renderCurrentScreen()}
      </div>
    </GameContext.Provider>
  );
}

export default App;