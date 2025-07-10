import React from 'react';
import { useGame } from '../App';
import GameButton from './GameButton';

const MainMenu: React.FC = () => {
  const { dispatch } = useGame();

  const gameButtons = [
    {
      id: 'character-creator',
      icon: '👤',
      label: 'Make Character',
      variant: 'primary' as const
    },
    {
      id: 'maze',
      icon: '🌀',
      label: 'Maze Game',
      variant: 'secondary' as const
    },
    {
      id: 'coloring',
      icon: '🎨',
      label: 'Color Pictures',
      variant: 'accent' as const
    },
    {
      id: 'detective',
      icon: '🔍',
      label: 'Find Things',
      variant: 'warning' as const
    }
  ];

  const handleGameSelect = (gameId: string) => {
    dispatch({ 
      type: 'NAVIGATE_TO', 
      screen: gameId as any 
    });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-8">
      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-6xl font-kid font-bold text-white mb-4 drop-shadow-lg">
          🎮 Fun Games! 🎮
        </h1>
        <p className="text-2xl font-kid text-white drop-shadow-md">
          Pick a game to play!
        </p>
      </div>

      {/* Game Selection Grid */}
      <div className="grid grid-cols-2 gap-8 max-w-2xl">
        {gameButtons.map((game) => (
          <GameButton
            key={game.id}
            onClick={() => handleGameSelect(game.id)}
            icon={game.icon}
            label={game.label}
            variant={game.variant}
            size="xl"
            className="animate-pulse-slow hover:animate-bounce"
          />
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 text-6xl animate-bounce-slow">
        ⭐
      </div>
      <div className="absolute top-20 right-20 text-5xl animate-wiggle">
        🌈
      </div>
      <div className="absolute bottom-20 left-20 text-5xl animate-bounce-slow">
        🎪
      </div>
      <div className="absolute bottom-10 right-10 text-6xl animate-pulse-slow">
        🎁
      </div>
    </div>
  );
};

export default MainMenu;