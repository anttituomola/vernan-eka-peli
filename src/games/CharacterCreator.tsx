import React from 'react';
import { Stage, Layer, Rect, Group } from 'react-konva';
import { useGame } from '../App';
import { CharacterParts } from '../types';
import BackButton from '../components/BackButton';
import GameButton from '../components/GameButton';

const CharacterCreator: React.FC = () => {
  const { state, dispatch } = useGame();

  const partOptions: Record<keyof CharacterParts, { name: string; options: { id: string; icon: string; color: string }[] }> = {
    head: {
      name: 'Pää',
      options: [
        { id: 'round', icon: '⭕', color: '#FFE4B5' },
        { id: 'square', icon: '⬜', color: '#DEB887' },
        { id: 'oval', icon: '🥚', color: '#F5DEB3' }
      ]
    },
    eyes: {
      name: 'Silmät',
      options: [
        { id: 'normal', icon: '👀', color: '#87CEEB' },
        { id: 'wink', icon: '😉', color: '#90EE90' },
        { id: 'star', icon: '⭐', color: '#FFD700' }
      ]
    },
    ears: {
      name: 'Korvat',
      options: [
        { id: 'small', icon: '👂', color: '#FFE4B5' },
        { id: 'big', icon: '🐘', color: '#DEB887' },
        { id: 'pointy', icon: '🧝', color: '#F5DEB3' }
      ]
    },
    torso: {
      name: 'Vartalo',
      options: [
        { id: 'shirt', icon: '👕', color: '#FF6B6B' },
        { id: 'dress', icon: '👗', color: '#FF9EC7' },
        { id: 'jacket', icon: '🧥', color: '#4ECDC4' }
      ]
    },
    arms: {
      name: 'Kädet',
      options: [
        { id: 'normal', icon: '💪', color: '#FFE4B5' },
        { id: 'strong', icon: '🦾', color: '#DEB887' },
        { id: 'thin', icon: '🖐️', color: '#F5DEB3' }
      ]
    },
    legs: {
      name: 'Jalat',
      options: [
        { id: 'pants', icon: '👖', color: '#4169E1' },
        { id: 'skirt', icon: '🩱', color: '#FF69B4' },
        { id: 'shorts', icon: '🩳', color: '#32CD32' }
      ]
    },
    feet: {
      name: 'Kengät',
      options: [
        { id: 'shoes', icon: '👟', color: '#8B4513' },
        { id: 'boots', icon: '🥾', color: '#654321' },
        { id: 'sandals', icon: '👡', color: '#D2691E' }
      ]
    }
  };

  const handlePartChange = (part: keyof CharacterParts, value: string) => {
    dispatch({ type: 'UPDATE_CHARACTER', part, value });
  };

  const getSelectedOption = (part: keyof CharacterParts) => {
    const selectedId = state.character[part];
    return partOptions[part].options.find(option => option.id === selectedId) || partOptions[part].options[0];
  };

  const renderCharacterPreview = () => {
    const canvasWidth = 300;
    const canvasHeight = 400;
    
    return (
      <div className="bg-white rounded-kid-lg border-4 border-gray-300 p-4">
        <Stage width={canvasWidth} height={canvasHeight}>
          <Layer>
            <Group x={canvasWidth / 2} y={50}>
              {/* Head */}
              <Group x={-30} y={0}>
                <Rect
                  width={60}
                  height={60}
                  fill={getSelectedOption('head').color}
                  cornerRadius={getSelectedOption('head').id === 'round' ? 30 : 5}
                />
              </Group>
              
              {/* Eyes */}
              <Group x={-20} y={15}>
                <Rect
                  width={40}
                  height={20}
                  fill={getSelectedOption('eyes').color}
                  cornerRadius={10}
                />
              </Group>

              {/* Ears */}
              <Group x={-40} y={10}>
                <Rect
                  width={20}
                  height={30}
                  fill={getSelectedOption('ears').color}
                  cornerRadius={10}
                />
              </Group>
              <Group x={20} y={10}>
                <Rect
                  width={20}
                  height={30}
                  fill={getSelectedOption('ears').color}
                  cornerRadius={10}
                />
              </Group>

              {/* Torso */}
              <Group x={-40} y={60}>
                <Rect
                  width={80}
                  height={100}
                  fill={getSelectedOption('torso').color}
                  cornerRadius={10}
                />
              </Group>

              {/* Arms */}
              <Group x={-60} y={80}>
                <Rect
                  width={20}
                  height={80}
                  fill={getSelectedOption('arms').color}
                  cornerRadius={10}
                />
              </Group>
              <Group x={40} y={80}>
                <Rect
                  width={20}
                  height={80}
                  fill={getSelectedOption('arms').color}
                  cornerRadius={10}
                />
              </Group>

              {/* Legs */}
              <Group x={-30} y={160}>
                <Rect
                  width={60}
                  height={100}
                  fill={getSelectedOption('legs').color}
                  cornerRadius={10}
                />
              </Group>

              {/* Feet */}
              <Group x={-35} y={250}>
                <Rect
                  width={30}
                  height={20}
                  fill={getSelectedOption('feet').color}
                  cornerRadius={5}
                />
              </Group>
              <Group x={5} y={250}>
                <Rect
                  width={30}
                  height={20}
                  fill={getSelectedOption('feet').color}
                  cornerRadius={5}
                />
              </Group>
            </Group>
          </Layer>
        </Stage>
      </div>
    );
  };

  return (
    <div className="w-full h-full p-4">
      <BackButton />
      
      <div className="flex flex-col items-center h-full">
        {/* Title */}
        <h1 className="text-4xl font-kid font-bold text-white mb-6 drop-shadow-lg">
          👤 Tee oma hahmosi! 👤
        </h1>

        <div className="flex gap-8 w-full max-w-6xl">
          {/* Character Preview */}
          <div className="flex-shrink-0">
            <h2 className="text-2xl font-kid font-bold text-white mb-4 text-center">
              Hahmosi:
            </h2>
            {renderCharacterPreview()}
          </div>

          {/* Part Selection */}
          <div className="flex-1 bg-white/90 rounded-kid-lg p-6 max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-kid font-bold text-gray-800 mb-4 text-center">
              Valitse osat:
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
              {Object.entries(partOptions).map(([partKey, partData]) => (
                <div key={partKey} className="bg-gray-100 rounded-kid p-4">
                  <h3 className="text-lg font-kid font-bold text-gray-700 mb-2 text-center">
                    {partData.name}
                  </h3>
                  <div className="flex gap-2 justify-center flex-wrap">
                    {partData.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handlePartChange(partKey as keyof CharacterParts, option.id)}
                        className={`
                          w-16 h-16 rounded-kid border-4 text-2xl
                          flex items-center justify-center
                          transition-all duration-200 transform hover:scale-105
                          ${state.character[partKey as keyof CharacterParts] === option.id
                            ? 'border-blue-500 bg-blue-100 scale-110' 
                            : 'border-gray-300 bg-white'
                          }
                        `}
                        style={{ backgroundColor: option.color }}
                      >
                        {option.icon}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCreator;