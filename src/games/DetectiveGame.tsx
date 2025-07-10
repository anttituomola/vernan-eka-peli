import React, { useState, useEffect } from 'react';
import { useGame } from '../App';
import { DetectiveLevel } from '../types';
import BackButton from '../components/BackButton';
import GameButton from '../components/GameButton';

const DetectiveGame: React.FC = () => {
  const { state, dispatch } = useGame();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [foundObject, setFoundObject] = useState(false);
  const [clickedPositions, setClickedPositions] = useState<
    { x: number; y: number }[]
  >([]);

  const detectiveLevels: DetectiveLevel[] = [
    {
      id: 1,
      backgroundImage: 'bedroom',
      hiddenItem: {
        id: 'sunglasses',
        name: 'Aurinkolasit',
        icon: '🕶️',
        position: { x: 380, y: 180 },
        size: { width: 40, height: 20 },
      },
      decoyItems: [
        {
          id: 'book',
          name: 'Book',
          icon: '📖',
          position: { x: 150, y: 200 },
          size: { width: 30, height: 20 },
        },
        {
          id: 'ball',
          name: 'Ball',
          icon: '⚽',
          position: { x: 300, y: 250 },
          size: { width: 25, height: 25 },
        },
      ],
    },
    {
      id: 2,
      backgroundImage: 'kitchen',
      hiddenItem: {
        id: 'apple',
        name: 'Omena',
        icon: '🍎',
        position: { x: 320, y: 150 },
        size: { width: 30, height: 30 },
      },
      decoyItems: [
        {
          id: 'cup',
          name: 'Cup',
          icon: '☕',
          position: { x: 200, y: 120 },
          size: { width: 25, height: 30 },
        },
        {
          id: 'spoon',
          name: 'Spoon',
          icon: '🥄',
          position: { x: 100, y: 180 },
          size: { width: 20, height: 30 },
        },
      ],
    },
    {
      id: 3,
      backgroundImage: 'garden',
      hiddenItem: {
        id: 'butterfly',
        name: 'Perhonen',
        icon: '🦋',
        position: { x: 250, y: 80 },
        size: { width: 30, height: 25 },
      },
      decoyItems: [
        {
          id: 'flower',
          name: 'Flower',
          icon: '🌸',
          position: { x: 150, y: 200 },
          size: { width: 25, height: 30 },
        },
        {
          id: 'bee',
          name: 'Bee',
          icon: '🐝',
          position: { x: 350, y: 160 },
          size: { width: 25, height: 20 },
        },
      ],
    },
  ];

  const currentLevelData = detectiveLevels[currentLevel - 1];

  const renderBackground = (scene: string) => {
    const backgrounds = {
      bedroom: (
        <g>
          {/* Wall */}
          <rect x='0' y='0' width='500' height='300' fill='#E6E6FA' />

          {/* Bed */}
          <rect x='50' y='180' width='120' height='80' fill='#8B4513' rx='10' />
          <rect x='60' y='150' width='100' height='40' fill='#FFF8DC' rx='5' />

          {/* Window */}
          <rect
            x='300'
            y='50'
            width='80'
            height='60'
            fill='#87CEEB'
            stroke='#654321'
            strokeWidth='3'
          />
          <line
            x1='340'
            y1='50'
            x2='340'
            y2='110'
            stroke='#654321'
            strokeWidth='2'
          />

          {/* Dresser */}
          <rect x='350' y='180' width='100' height='80' fill='#8B4513' />
          <rect
            x='360'
            y='190'
            width='35'
            height='25'
            fill='#654321'
            stroke='#333'
            strokeWidth='1'
          />
          <rect
            x='405'
            y='190'
            width='35'
            height='25'
            fill='#654321'
            stroke='#333'
            strokeWidth='1'
          />

          {/* Lamp */}
          <rect x='180' y='200' width='8' height='40' fill='#8B4513' />
          <ellipse cx='184' cy='190' rx='15' ry='8' fill='#FFF8DC' />

          {/* Rug */}
          <ellipse cx='250' cy='250' rx='80' ry='30' fill='#DC143C' />
        </g>
      ),
      kitchen: (
        <g>
          {/* Wall */}
          <rect x='0' y='0' width='500' height='300' fill='#F5F5DC' />

          {/* Counter */}
          <rect x='0' y='200' width='500' height='100' fill='#8B4513' />
          <rect x='0' y='180' width='500' height='20' fill='#A0522D' />

          {/* Stove */}
          <rect x='100' y='150' width='80' height='50' fill='#C0C0C0' />
          <circle cx='120' cy='170' r='8' fill='#333' />
          <circle cx='160' cy='170' r='8' fill='#333' />

          {/* Sink */}
          <rect x='250' y='160' width='60' height='40' fill='#E6E6E6' rx='10' />

          {/* Refrigerator */}
          <rect x='400' y='50' width='80' height='150' fill='#F0F8FF' />
          <rect x='410' y='60' width='20' height='10' fill='#C0C0C0' />

          {/* Window */}
          <rect
            x='50'
            y='40'
            width='70'
            height='50'
            fill='#87CEEB'
            stroke='#654321'
            strokeWidth='3'
          />

          {/* Cabinets */}
          <rect x='0' y='50' width='400' height='100' fill='#8B4513' />
          <rect
            x='10'
            y='60'
            width='60'
            height='80'
            fill='#654321'
            stroke='#333'
            strokeWidth='1'
          />
          <rect
            x='80'
            y='60'
            width='60'
            height='80'
            fill='#654321'
            stroke='#333'
            strokeWidth='1'
          />
        </g>
      ),
      garden: (
        <g>
          {/* Sky */}
          <rect x='0' y='0' width='500' height='200' fill='#87CEEB' />

          {/* Ground */}
          <rect x='0' y='200' width='500' height='100' fill='#90EE90' />

          {/* Tree */}
          <rect x='80' y='120' width='20' height='80' fill='#8B4513' />
          <circle cx='90' cy='110' r='30' fill='#228B22' />

          {/* Flower bed */}
          <ellipse cx='200' cy='250' rx='50' ry='20' fill='#8B4513' />
          <circle cx='180' cy='240' r='8' fill='#FF69B4' />
          <circle cx='200' cy='245' r='8' fill='#FFD700' />
          <circle cx='220' cy='240' r='8' fill='#FF1493' />

          {/* Bush */}
          <ellipse cx='350' cy='220' rx='40' ry='30' fill='#32CD32' />

          {/* Path */}
          <ellipse cx='250' cy='260' rx='100' ry='20' fill='#D2B48C' />

          {/* Fence */}
          <rect x='450' y='180' width='8' height='40' fill='#8B4513' />
          <rect x='470' y='180' width='8' height='40' fill='#8B4513' />
          <rect x='445' y='190' width='40' height='8' fill='#8B4513' />
          <rect x='445' y='210' width='40' height='8' fill='#8B4513' />

          {/* Clouds */}
          <circle cx='100' cy='50' r='15' fill='white' />
          <circle cx='120' cy='50' r='20' fill='white' />
          <circle cx='140' cy='50' r='15' fill='white' />
        </g>
      ),
    };

    return (
      backgrounds[scene as keyof typeof backgrounds] || backgrounds.bedroom
    );
  };

  const handleSceneClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (foundObject) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Scale coordinates to match SVG viewBox
    const scaleX = 500 / rect.width;
    const scaleY = 300 / rect.height;
    const scaledX = x * scaleX;
    const scaledY = y * scaleY;

    // Add click position for visual feedback
    setClickedPositions((prev) => [...prev, { x: scaledX, y: scaledY }]);

    // Check if clicked on hidden item
    const item = currentLevelData.hiddenItem;
    if (
      scaledX >= item.position.x &&
      scaledX <= item.position.x + item.size.width &&
      scaledY >= item.position.y &&
      scaledY <= item.position.y + item.size.height
    ) {
      setFoundObject(true);
      dispatch({ type: 'COMPLETE_DETECTIVE_LEVEL', level: currentLevel });
    }
  };

  const nextLevel = () => {
    if (currentLevel < detectiveLevels.length) {
      setCurrentLevel(currentLevel + 1);
    } else {
      setCurrentLevel(1); // Loop back to first level
    }
    resetLevel();
  };

  const resetLevel = () => {
    setFoundObject(false);
    setClickedPositions([]);
  };

  useEffect(() => {
    resetLevel();
  }, [currentLevel]);

  return (
    <div className='w-full h-full p-4'>
      <BackButton />

      <div className='flex flex-col items-center h-full'>
        {/* Title */}
        <h1 className='text-4xl font-kid font-bold text-white mb-4 drop-shadow-lg'>
          🔍 Etsi piilotettu esine! 🔍
        </h1>

        <div className='text-2xl font-kid font-bold text-white mb-4'>
          Taso {currentLevel}
        </div>

        {/* Object to Find */}
        <div className='bg-white rounded-kid-lg p-4 mb-4 border-4 border-gray-300'>
          <h2 className='text-xl font-kid font-bold text-gray-800 text-center mb-2'>
            Etsi:
          </h2>
          <div className='text-center'>
            <div className='text-6xl mb-2'>
              {currentLevelData.hiddenItem.icon}
            </div>
            <div className='text-lg font-kid font-bold text-gray-700'>
              {currentLevelData.hiddenItem.name}
            </div>
          </div>
        </div>

        {/* Game Won Message */}
        {foundObject && (
          <div className='bg-green-400 rounded-kid-lg p-6 mb-4 text-center animate-bounce'>
            <div className='text-4xl mb-2'>🎉</div>
            <div className='text-2xl font-kid font-bold text-white'>
              Hyvin tehty! Löysit sen! ⭐
            </div>
          </div>
        )}

        <div className='flex gap-8 items-start'>
          {/* Game Scene */}
          <div className='bg-white rounded-kid-lg p-4 border-4 border-gray-300'>
            <svg
              width='500'
              height='300'
              viewBox='0 0 500 300'
              className='cursor-pointer'
              onClick={handleSceneClick}
            >
              {/* Background */}
              {renderBackground(currentLevelData.backgroundImage)}

              {/* Hidden Item (only show if found) */}
              {foundObject && (
                <g>
                  <rect
                    x={currentLevelData.hiddenItem.position.x}
                    y={currentLevelData.hiddenItem.position.y}
                    width={currentLevelData.hiddenItem.size.width}
                    height={currentLevelData.hiddenItem.size.height}
                    fill='gold'
                    stroke='orange'
                    strokeWidth='3'
                    rx='5'
                    className='animate-pulse'
                  />
                  <text
                    x={
                      currentLevelData.hiddenItem.position.x +
                      currentLevelData.hiddenItem.size.width / 2
                    }
                    y={
                      currentLevelData.hiddenItem.position.y +
                      currentLevelData.hiddenItem.size.height / 2 +
                      8
                    }
                    textAnchor='middle'
                    fontSize='20'
                  >
                    {currentLevelData.hiddenItem.icon}
                  </text>
                </g>
              )}

              {/* Click indicators */}
              {clickedPositions.map((pos, index) => (
                <circle
                  key={index}
                  cx={pos.x}
                  cy={pos.y}
                  r='8'
                  fill='rgba(255, 0, 0, 0.5)'
                  className='animate-ping'
                />
              ))}
            </svg>
          </div>

          {/* Controls */}
          <div className='flex flex-col gap-4'>
            {/* Action Buttons */}
            <div className='bg-white/90 rounded-kid-lg p-6'>
              <div className='flex flex-col gap-4'>
                <GameButton
                  onClick={resetLevel}
                  icon='🔄'
                  label='Yritä uudelleen'
                  variant='warning'
                  size='md'
                />
                {foundObject && (
                  <GameButton
                    onClick={nextLevel}
                    icon='➡️'
                    label='Seuraava taso'
                    variant='accent'
                    size='md'
                  />
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className='bg-white/90 rounded-kid-lg p-4 max-w-48'>
              <h3 className='text-lg font-kid font-bold text-gray-800 mb-2 text-center'>
                Kuinka pelata:
              </h3>
              <div className='text-sm text-gray-700 space-y-2'>
                <div>👀 Katso yllä olevaa kuvaa</div>
                <div>🔍 Etsi se esine kohtauksesta</div>
                <div>👆 Klikkaa sitä kun näet sen</div>
                <div>🎯 Punaiset pisteet näyttävät mihin klikkasit</div>
              </div>
            </div>

            {/* Hint */}
            <div className='bg-yellow-200 rounded-kid-lg p-4 max-w-48'>
              <h3 className='text-lg font-kid font-bold text-gray-800 mb-2 text-center'>
                💡 Vihje:
              </h3>
              <div className='text-sm text-gray-700 text-center'>
                {currentLevel === 1 && 'Katso lipaton läheltä!'}
                {currentLevel === 2 && 'Tarkasta tason alue!'}
                {currentLevel === 3 && 'Katso taivaalta!'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectiveGame;
