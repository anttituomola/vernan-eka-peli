import React, { useState, useEffect, useMemo } from 'react';
import { useGame } from '../App';
import { CountingLevel } from '../types';
import BackButton from '../components/BackButton';
import GameButton from '../components/GameButton';

const CountingGame: React.FC = () => {
  const { state, dispatch } = useGame();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [objectPositions, setObjectPositions] = useState<{ x: number; y: number }[]>([]);

  // Available emojis for counting
  const emojiOptions = [
    { emoji: '🐱', name: 'kissaa' },
    { emoji: '🐶', name: 'koiraa' },
    { emoji: '🐰', name: 'jänistä' },
    { emoji: '🦊', name: 'kettua' },
    { emoji: '🐻', name: 'karhua' },
    { emoji: '🐼', name: 'pandaa' },
    { emoji: '🐨', name: 'koalaa' },
    { emoji: '🐯', name: 'tiikeriä' },
    { emoji: '🦁', name: 'leijonaa' },
    { emoji: '🐸', name: 'sammakkoa' },
    { emoji: '🐷', name: 'sikaa' },
    { emoji: '🐮', name: 'lehmää' },
    { emoji: '🐵', name: 'apinaa' },
    { emoji: '🐔', name: 'kanaa' },
    { emoji: '🐧', name: 'pingviiniä' },
    { emoji: '🦆', name: 'ankkaa' },
    { emoji: '🐝', name: 'mehiläistä' },
    { emoji: '🦋', name: 'perhosta' },
    { emoji: '🐛', name: 'hyönteistä' },
    { emoji: '🌸', name: 'kukkaa' },
    { emoji: '🌻', name: 'auringonkukkaa' },
    { emoji: '🌺', name: 'hibiskusta' },
    { emoji: '🍎', name: 'omenaa' },
    { emoji: '🍌', name: 'banaania' },
    { emoji: '🍓', name: 'mansikkaa' },
    { emoji: '🍇', name: 'viinirypälettä' },
    { emoji: '🍊', name: 'appelsiinia' },
    { emoji: '🥝', name: 'kiiviä' },
    { emoji: '🍉', name: 'vesimelonia' }
  ];

  // Generate levels with increasing difficulty
  const countingLevels: CountingLevel[] = useMemo(() => {
    const levels: CountingLevel[] = [];
    const levelCounts = [
      { min: 1, max: 3 },   // Level 1: 1-3 objects
      { min: 2, max: 4 },   // Level 2: 2-4 objects
      { min: 3, max: 5 },   // Level 3: 3-5 objects
      { min: 4, max: 7 },   // Level 4: 4-7 objects
      { min: 6, max: 10 },  // Level 5: 6-10 objects
      { min: 8, max: 12 },  // Level 6: 8-12 objects
      { min: 10, max: 15 }  // Level 7: 10-15 objects
    ];

    levelCounts.forEach((range, index) => {
      const randomEmoji = emojiOptions[Math.floor(Math.random() * emojiOptions.length)];
      const count = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      levels.push({
        id: index + 1,
        objectEmoji: randomEmoji.emoji,
        objectName: randomEmoji.name,
        count,
        minCount: range.min,
        maxCount: range.max
      });
    });

    return levels;
  }, []);

  const currentLevelData = countingLevels[currentLevel - 1] || countingLevels[0];

  // Generate random positions for objects
  useEffect(() => {
    if (!currentLevelData) return;

    const positions: { x: number; y: number }[] = [];
    // Account for emoji size (text-6xl is ~60px) and padding (32px total)
    const containerWidth = 600;
    const containerHeight = 400;
    const padding = 32;
    const emojiSize = 60;
    const margin = emojiSize / 2; // Half emoji size to keep it within bounds
    
    const usableWidth = containerWidth - padding * 2 - emojiSize;
    const usableHeight = containerHeight - padding * 2 - emojiSize;
    
    const gridCols = 5;
    const gridRows = 4;
    const cellWidth = usableWidth / gridCols;
    const cellHeight = usableHeight / gridRows;
    const usedPositions = new Set<string>();

    for (let i = 0; i < currentLevelData.count; i++) {
      let attempts = 0;
      let position: { x: number; y: number };
      
      do {
        const col = Math.floor(Math.random() * gridCols);
        const row = Math.floor(Math.random() * gridRows);
        const key = `${col},${row}`;
        
        if (!usedPositions.has(key) || attempts > 50) {
          usedPositions.add(key);
          // Position within cell, ensuring emoji stays within bounds
          const maxOffsetX = Math.min(30, cellWidth - emojiSize);
          const maxOffsetY = Math.min(30, cellHeight - emojiSize);
          position = {
            x: padding + margin + col * cellWidth + Math.random() * maxOffsetX,
            y: padding + margin + row * cellHeight + Math.random() * maxOffsetY
          };
          break;
        }
        attempts++;
      } while (attempts < 100);

      positions.push(position!);
    }

    setObjectPositions(positions);
  }, [currentLevel, currentLevelData]);

  // Generate answer options - always consecutive numbers in order
  const answerOptions = useMemo(() => {
    if (!currentLevelData) return [];

    const correctAnswer = currentLevelData.count;
    
    // Generate 4 consecutive numbers that include the correct answer
    // Try to center the correct answer when possible
    let startNumber = Math.max(1, correctAnswer - 2);
    
    // If correct answer is 1 or 2, start from 1
    if (correctAnswer <= 2) {
      startNumber = 1;
    }
    
    // Generate 4 consecutive numbers starting from startNumber
    const options: number[] = [];
    for (let i = 0; i < 4; i++) {
      options.push(startNumber + i);
    }
    
    return options;
  }, [currentLevelData]);

  const handleAnswerSelect = (answer: number) => {
    if (isCorrect !== null) return; // Already answered

    setSelectedAnswer(answer);
    const correct = answer === currentLevelData.count;
    setIsCorrect(correct);

    if (correct) {
      dispatch({ type: 'COMPLETE_COUNTING_LEVEL', level: currentLevel });
    }
  };

  const nextLevel = () => {
    if (currentLevel < countingLevels.length) {
      setCurrentLevel(currentLevel + 1);
    } else {
      setCurrentLevel(1); // Loop back to first level
    }
    resetLevel();
  };

  const resetLevel = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  useEffect(() => {
    resetLevel();
  }, [currentLevel]);

  return (
    <div className="w-full h-full p-4">
      <BackButton />
      
      <div className="flex flex-col items-center h-full">
        {/* Title */}
        <h1 className="text-4xl font-kid font-bold text-white mb-4 drop-shadow-lg">
          🔢 Laske esineet! 🔢
        </h1>

        <div className="text-2xl font-kid font-bold text-white mb-4">
          Taso {currentLevel}
        </div>

        {/* Question */}
        <div className="bg-white rounded-kid-lg p-6 mb-6 border-4 border-gray-300">
          <h2 className="text-3xl font-kid font-bold text-gray-800 text-center">
            Kuinka monta {currentLevelData.objectName} näet?
          </h2>
        </div>

        {/* Game Area - Objects Display */}
        <div className="bg-white rounded-kid-lg p-8 mb-6 border-4 border-gray-300 relative" style={{ width: '600px', height: '400px', overflow: 'hidden' }}>
          <div className="relative w-full h-full">
            {objectPositions.map((pos, index) => (
              <div
                key={index}
                className="absolute text-6xl animate-bounce-slow"
                style={{
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  transform: `rotate(${Math.random() * 20 - 10}deg)`,
                  pointerEvents: 'none'
                }}
              >
                {currentLevelData.objectEmoji}
              </div>
            ))}
          </div>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {answerOptions.map((option) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = option === currentLevelData.count;
            let buttonClass = 'bg-blue-400 hover:bg-blue-500 text-white';

            if (isSelected) {
              if (isCorrect) {
                buttonClass = 'bg-green-500 text-white animate-bounce';
              } else if (isCorrectOption) {
                buttonClass = 'bg-green-500 text-white animate-pulse';
              } else {
                buttonClass = 'bg-red-500 text-white';
              }
            }

            return (
              <button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                disabled={isCorrect !== null}
                className={`${buttonClass} rounded-kid-lg p-6 text-4xl font-kid font-bold border-4 border-gray-300 transition-all transform hover:scale-105 disabled:opacity-75`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Success Message */}
        {isCorrect && (
          <div className="bg-green-400 rounded-kid-lg p-6 mb-4 text-center animate-bounce">
            <div className="text-4xl mb-2">🎉</div>
            <div className="text-2xl font-kid font-bold text-white">
              Hienoa työtä! Laskit oikein! ⭐
            </div>
          </div>
        )}

        {/* Wrong Answer Message */}
        {isCorrect === false && (
          <div className="bg-red-400 rounded-kid-lg p-6 mb-4 text-center animate-pulse">
            <div className="text-4xl mb-2">😊</div>
            <div className="text-2xl font-kid font-bold text-white">
              Yritä uudelleen! Laske tarkasti! 💪
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-4">
          {isCorrect === false && (
            <GameButton
              onClick={resetLevel}
              icon="🔄"
              label="Yritä uudelleen"
              variant="warning"
              size="md"
            />
          )}
          {isCorrect && (
            <GameButton
              onClick={nextLevel}
              icon="➡️"
              label="Seuraava taso"
              variant="accent"
              size="md"
            />
          )}
        </div>

        {/* Instructions */}
        <div className="bg-white/90 rounded-kid-lg p-4 mt-6 max-w-md">
          <h3 className="text-lg font-kid font-bold text-gray-800 mb-2 text-center">
            Miten pelataan:
          </h3>
          <div className="text-sm text-gray-700 space-y-2 text-center">
            <div>👀 Katso kaikkia {currentLevelData.objectName}</div>
            <div>🔢 Laske ne tarkasti</div>
            <div>👆 Klikkaa oikeaa numeroa</div>
            <div>⭐ Vastaa oikein päästäksesi seuraavalle tasolle!</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountingGame;

