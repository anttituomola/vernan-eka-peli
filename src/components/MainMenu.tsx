import React from 'react';
import { useGame } from '../App';
import GameButton from './GameButton';

const MainMenu: React.FC = () => {
  const { dispatch } = useGame();

  const gameButtons = [
    {
      id: 'character-creator',
      icon: '👤',
      label: 'Tee hahmo',
      variant: 'primary' as const,
      disabled: false,
      comingSoon: false
    },
    {
      id: 'maze',
      icon: '🌀',
      label: 'Labyrinttipeli',
      variant: 'secondary' as const,
      disabled: false,
      comingSoon: false
    },
    {
      id: 'counting',
      icon: '🔢',
      label: 'Laske numerot',
      variant: 'accent' as const,
      disabled: false,
      comingSoon: false
    },
    {
      id: 'math',
      icon: '➕',
      label: 'Laske laskut',
      variant: 'primary' as const,
      disabled: false,
      comingSoon: false
    }
  ];

  const handleGameSelect = (gameId: string, disabled: boolean) => {
    if (!disabled) {
      dispatch({
        type: 'NAVIGATE_TO',
        screen: gameId as any,
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-8">
      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-6xl font-kid font-bold text-white mb-4 drop-shadow-lg">
          🎮 Vernan omat pelit! 🎮
        </h1>
        <p className="text-2xl font-kid text-white drop-shadow-md">
          Valitse peli!
        </p>
      </div>

      {/* Game Selection Grid - Optimized for small screens */}
      <div className='grid grid-cols-2 gap-3 sm:gap-4 lg:gap-8 w-full max-w-sm sm:max-w-2xl px-2 sm:px-4 flex-1 content-center'>
        {gameButtons.map((game) => (
          <div key={game.id} className='relative'>
            <GameButton
              onClick={() => handleGameSelect(game.id, game.disabled)}
              icon={game.icon}
              label={game.label}
              variant={game.variant}
              size='md' // Changed from 'xl' to 'md' for mobile (96x96px)
              className={`w-full h-20 sm:h-24 lg:h-32 text-sm sm:text-base lg:text-xl ${
                game.disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'animate-pulse-slow hover:animate-bounce'
              }`}
            />
            {game.comingSoon && (
              <div className='absolute top-1 right-1 sm:top-2 sm:right-2 bg-orange-500 text-white text-xs font-bold px-1 py-0.5 sm:px-2 sm:py-1 rounded-full transform rotate-12 shadow-lg'>
                Tulossa pian
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Small bottom spacer */}
      <div className='h-2 sm:h-4 flex-shrink-0'></div>
    </div>
  );
};

export default MainMenu;
