import React from 'react';
import { useGame } from '../App';
import GameButton from './GameButton';

const MainMenu: React.FC = () => {
  const { dispatch } = useGame();

  const gameButtons = [
    {
      id: 'character-creator',
      icon: '👤',
      label: 'Luo hahmo',
      variant: 'primary' as const,
      disabled: false,
    },
    {
      id: 'maze',
      icon: '🌀',
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
    <div className='flex flex-col items-center justify-center w-full min-h-screen p-4 sm:p-8'>
      {/* Title */}
      <div className='text-center mb-8 sm:mb-12'>
        <h1 className='text-4xl sm:text-6xl font-kid font-bold text-white mb-2 sm:mb-4 drop-shadow-lg'>
          Vernan eka peli
        </h1>
        <p className='text-lg sm:text-2xl font-kid text-white drop-shadow-md'>
          Valitse peli!
        </p>
      </div>

      {/* Game Selection Grid - Single column on mobile, 2 columns on larger screens */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 w-full max-w-2xl px-4'>
        {gameButtons.map((game) => (
          <div key={game.id} className='relative'>
            <GameButton
              onClick={() => handleGameSelect(game.id, game.disabled)}
              icon={game.icon}
              label={game.label}
              variant={game.variant}
              size='xl'
              className={`${
                game.disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'animate-pulse-slow hover:animate-bounce'
              }`}
            />
            {game.comingSoon && (
              <div className='absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full transform rotate-12 shadow-lg'>
                Tulossa pian
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom padding to ensure content doesn't touch bottom edge on mobile */}
      <div className='h-8 sm:h-0'></div>
    </div>
  );
};

export default MainMenu;
