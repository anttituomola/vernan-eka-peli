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
      className="
        fixed top-4 left-4 z-50
        kid-button kid-button-warning
        w-16 h-16 text-3xl
        flex items-center justify-center
        hover:scale-110 active:scale-95
      "
      type="button"
    >
      ⬅️
    </button>
  );
};

export default BackButton;