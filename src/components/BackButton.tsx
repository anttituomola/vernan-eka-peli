import React from 'react';
import { useGame } from '../App';

const BackButton: React.FC = () => {
  const { dispatch } = useGame();

  const handleBack = () => {
    dispatch({ type: 'NAVIGATE_TO', screen: 'menu' });
  };

  return (
    <button
      onClick={handleBack}
      className='
        fixed top-2 left-2 sm:top-4 sm:left-4 z-50
        kid-button kid-button-warning
        w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 
        text-lg sm:text-xl lg:text-3xl
        flex items-center justify-center
        hover:scale-110 active:scale-95
      '
      type='button'
    >
      ⬅️
    </button>
  );
};

export default BackButton;
