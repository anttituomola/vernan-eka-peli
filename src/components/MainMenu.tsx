import React from 'react';
import { useGame } from '../App';
import GameButton from './GameButton';

const MainMenu: React.FC = () => {
  const { dispatch } = useGame();

  const gameButtons = [
    {
      id: 'character-creator',
      icon: '👤',
<<<<<<< HEAD
      label: 'Luo hahmo',
      variant: 'primary' as const,
      disabled: false,
=======
      label: 'Tee hahmo',
      variant: 'primary' as const
>>>>>>> cursor/create-kid-friendly-mini-game-web-app-66dd
    },
    {
      id: 'maze',
      icon: '🌀',
<<<<<<< HEAD
      label: 'Labyrintti-peli',
      variant: 'secondary' as const,
      disabled: false,
    },
    {
      id: 'coloring',
      icon: '🎨',
      label: 'Väritä kuvia',
      variant: 'accent' as const,
      disabled: true,
      comingSoon: true,
    },
    {
      id: 'detective',
      icon: '🔍',
      label: 'Etsi esineitä',
      variant: 'warning' as const,
      disabled: true,
      comingSoon: true,
    },
=======
      label: 'Labyrinttipeli',
      variant: 'secondary' as const
    },
    {
      id: 'counting',
      icon: '🔢',
      label: 'Laske numerot',
      variant: 'accent' as const
    },
    {
      id: 'math',
      icon: '➕',
      label: 'Laske laskut',
      variant: 'primary' as const
    }
>>>>>>> cursor/create-kid-friendly-mini-game-web-app-66dd
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
<<<<<<< HEAD
    <div className='flex flex-col items-center justify-between w-full h-screen p-3 sm:p-8'>
      {/* Title - More compact on mobile */}
      <div className='text-center mb-4 sm:mb-8 lg:mb-12 flex-shrink-0'>
        <h1 className='text-3xl sm:text-4xl lg:text-6xl font-kid font-bold text-white mb-1 sm:mb-2 lg:mb-4 drop-shadow-lg'>
          Vernan eka peli
        </h1>
        <p className='text-base sm:text-lg lg:text-2xl font-kid text-white drop-shadow-md'>
=======
    <div className="flex flex-col items-center justify-center w-full h-full p-8">
      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-6xl font-kid font-bold text-white mb-4 drop-shadow-lg">
          🎮 Hauskat pelit! 🎮
        </h1>
        <p className="text-2xl font-kid text-white drop-shadow-md">
>>>>>>> cursor/create-kid-friendly-mini-game-web-app-66dd
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
