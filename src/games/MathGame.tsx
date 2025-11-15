import React, { useState, useEffect, useMemo } from 'react';
import { useGame } from '../App';
import { MathLevel } from '../types';
import BackButton from '../components/BackButton';
import GameButton from '../components/GameButton';

const MathGame: React.FC = () => {
  const { dispatch } = useGame();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Generate math levels with increasing difficulty
  const mathLevels: MathLevel[] = useMemo(() => {
    const levels: MathLevel[] = [];
    
    // Level 1-3: Simple addition (1-5)
    for (let i = 1; i <= 3; i++) {
      const operand1 = Math.floor(Math.random() * 5) + 1;
      const operand2 = Math.floor(Math.random() * 5) + 1;
      const answer = operand1 + operand2;
      levels.push({
        id: i,
        type: 'addition',
        operand1,
        operand2,
        answer,
        minAnswer: 1,
        maxAnswer: 10
      });
    }

    // Level 4-5: Simple subtraction (1-5)
    for (let i = 4; i <= 5; i++) {
      const answer = Math.floor(Math.random() * 5) + 1;
      const operand2 = Math.floor(Math.random() * answer) + 1;
      const operand1 = answer + operand2;
      levels.push({
        id: i,
        type: 'subtraction',
        operand1,
        operand2,
        answer,
        minAnswer: 1,
        maxAnswer: 10
      });
    }

    // Level 6-7: Addition (1-10)
    for (let i = 6; i <= 7; i++) {
      const operand1 = Math.floor(Math.random() * 10) + 1;
      const operand2 = Math.floor(Math.random() * 10) + 1;
      const answer = operand1 + operand2;
      levels.push({
        id: i,
        type: 'addition',
        operand1,
        operand2,
        answer,
        minAnswer: 1,
        maxAnswer: 20
      });
    }

    // Level 8-9: Subtraction (1-10)
    for (let i = 8; i <= 9; i++) {
      const answer = Math.floor(Math.random() * 10) + 1;
      const operand2 = Math.floor(Math.random() * 10) + 1;
      const operand1 = answer + operand2;
      levels.push({
        id: i,
        type: 'subtraction',
        operand1,
        operand2,
        answer,
        minAnswer: 1,
        maxAnswer: 20
      });
    }

    // Level 10: Mixed
    const isAddition = Math.random() < 0.5;
    if (isAddition) {
      const operand1 = Math.floor(Math.random() * 10) + 1;
      const operand2 = Math.floor(Math.random() * 10) + 1;
      const answer = operand1 + operand2;
      levels.push({
        id: 10,
        type: 'addition',
        operand1,
        operand2,
        answer,
        minAnswer: 1,
        maxAnswer: 20
      });
    } else {
      const answer = Math.floor(Math.random() * 10) + 1;
      const operand2 = Math.floor(Math.random() * 10) + 1;
      const operand1 = answer + operand2;
      levels.push({
        id: 10,
        type: 'subtraction',
        operand1,
        operand2,
        answer,
        minAnswer: 1,
        maxAnswer: 20
      });
    }

    return levels;
  }, []);

  const currentLevelData = mathLevels[currentLevel - 1] || mathLevels[0];

  // Generate answer options - always consecutive numbers in order
  const answerOptions = useMemo(() => {
    if (!currentLevelData) return [];

    const correctAnswer = currentLevelData.answer;
    
    // Generate 4 consecutive numbers that include the correct answer
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
    const correct = answer === currentLevelData.answer;
    setIsCorrect(correct);

    if (correct) {
      dispatch({ type: 'COMPLETE_MATH_LEVEL', level: currentLevel });
    }
  };

  const nextLevel = () => {
    if (currentLevel < mathLevels.length) {
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

  const getOperationSymbol = () => {
    return currentLevelData.type === 'addition' ? '+' : '−';
  };

  const getOperationName = () => {
    return currentLevelData.type === 'addition' ? 'yhteenlasku' : 'vähennyslasku';
  };

  return (
    <div className="w-full h-full p-4">
      <BackButton />
      
      <div className="flex flex-col items-center h-full">
        {/* Title */}
        <h1 className="text-4xl font-kid font-bold text-white mb-4 drop-shadow-lg">
          ➕ Laske laskut! ➖
        </h1>

        <div className="text-2xl font-kid font-bold text-white mb-4">
          Taso {currentLevel}
        </div>

        {/* Question */}
        <div className="bg-white rounded-kid-lg p-8 mb-6 border-4 border-gray-300">
          <h2 className="text-5xl font-kid font-bold text-gray-800 text-center mb-4">
            {currentLevelData.operand1} {getOperationSymbol()} {currentLevelData.operand2} = ?
          </h2>
          <p className="text-xl font-kid text-gray-600 text-center">
            {getOperationName()}
          </p>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {answerOptions.map((option) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = option === currentLevelData.answer;
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
            <div>➕ Laske yhteenlaskut</div>
            <div>➖ Laske vähennyslaskut</div>
            <div>👆 Klikkaa oikeaa vastausta</div>
            <div>⭐ Vastaa oikein päästäksesi seuraavalle tasolle!</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MathGame;


