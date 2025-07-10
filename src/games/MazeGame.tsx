import React, { useState, useEffect, useCallback } from 'react';
import { Stage, Layer, Rect, Circle } from 'react-konva';
import { useGame } from '../App';
import { MazeLevel, MazeCell } from '../types';
import BackButton from '../components/BackButton';
import GameButton from '../components/GameButton';

const MazeGame: React.FC = () => {
  const { state, dispatch } = useGame();
  const [playerPosition, setPlayerPosition] = useState({ x: 1, y: 1 });
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameWon, setGameWon] = useState(false);

  const cellSize = 40;
  const mazeWidth = 15;
  const mazeHeight = 11;

  // Simple maze levels
  const mazeLevels: MazeLevel[] = [
    {
      id: 1,
      grid: generateSimpleMaze(1),
      playerStart: { x: 1, y: 1 },
      goal: { x: mazeWidth - 2, y: mazeHeight - 2 }
    },
    {
      id: 2,
      grid: generateSimpleMaze(2),
      playerStart: { x: 1, y: 1 },
      goal: { x: mazeWidth - 2, y: mazeHeight - 2 }
    },
    {
      id: 3,
      grid: generateSimpleMaze(3),
      playerStart: { x: 1, y: 1 },
      goal: { x: mazeWidth - 2, y: mazeHeight - 2 }
    }
  ];

  function generateSimpleMaze(level: number): MazeCell[][] {
    const grid: MazeCell[][] = [];
    
    // Initialize with walls
    for (let y = 0; y < mazeHeight; y++) {
      grid[y] = [];
      for (let x = 0; x < mazeWidth; x++) {
        grid[y][x] = {
          x,
          y,
          type: (x === 0 || y === 0 || x === mazeWidth - 1 || y === mazeHeight - 1) ? 'wall' : 'path'
        };
      }
    }

    // Add some strategic walls based on level
    if (level === 1) {
      // Simple path
      for (let x = 3; x < 7; x++) {
        grid[3][x] = { x, y: 3, type: 'wall' };
      }
      for (let y = 5; y < 8; y++) {
        grid[y][8] = { x: 8, y, type: 'wall' };
      }
    } else if (level === 2) {
      // More complex
      for (let x = 2; x < 6; x++) {
        grid[2][x] = { x, y: 2, type: 'wall' };
      }
      for (let y = 4; y < 7; y++) {
        grid[y][6] = { x: 6, y, type: 'wall' };
      }
      for (let x = 8; x < 12; x++) {
        grid[6][x] = { x, y: 6, type: 'wall' };
      }
    } else {
      // Most complex
      for (let x = 1; x < 5; x++) {
        grid[3][x] = { x, y: 3, type: 'wall' };
      }
      for (let y = 1; y < 4; y++) {
        grid[y][7] = { x: 7, y, type: 'wall' };
      }
      for (let x = 9; x < 13; x++) {
        grid[2][x] = { x, y: 2, type: 'wall' };
      }
      for (let y = 5; y < 9; y++) {
        grid[y][4] = { x: 4, y, type: 'wall' };
      }
    }

    // Set start and goal
    grid[1][1] = { x: 1, y: 1, type: 'start' };
    grid[mazeHeight - 2][mazeWidth - 2] = { x: mazeWidth - 2, y: mazeHeight - 2, type: 'goal' };

    return grid;
  }

  const movePlayer = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameWon) return;

    setPlayerPosition(prevPos => {
      const newPos = { ...prevPos };
      
      switch (direction) {
        case 'up':
          newPos.y = Math.max(0, prevPos.y - 1);
          break;
        case 'down':
          newPos.y = Math.min(mazeHeight - 1, prevPos.y + 1);
          break;
        case 'left':
          newPos.x = Math.max(0, prevPos.x - 1);
          break;
        case 'right':
          newPos.x = Math.min(mazeWidth - 1, prevPos.x + 1);
          break;
      }

      // Check if new position is valid (not a wall)
      const maze = mazeLevels[currentLevel - 1];
      const cell = maze.grid[newPos.y][newPos.x];
      
      if (cell.type === 'wall') {
        return prevPos; // Don't move if hitting a wall
      }

      // Check if reached goal
      if (cell.type === 'goal') {
        setGameWon(true);
        dispatch({ type: 'COMPLETE_MAZE_LEVEL', level: currentLevel });
      }

      return newPos;
    });
  }, [gameWon, currentLevel, dispatch]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          movePlayer('up');
          break;
        case 'ArrowDown':
          event.preventDefault();
          movePlayer('down');
          break;
        case 'ArrowLeft':
          event.preventDefault();
          movePlayer('left');
          break;
        case 'ArrowRight':
          event.preventDefault();
          movePlayer('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePlayer]);

  // Reset when level changes
  useEffect(() => {
    const maze = mazeLevels[currentLevel - 1];
    if (maze) {
      setPlayerPosition(maze.playerStart);
      setGameWon(false);
    }
  }, [currentLevel]);

  const nextLevel = () => {
    if (currentLevel < mazeLevels.length) {
      setCurrentLevel(currentLevel + 1);
    } else {
      setCurrentLevel(1); // Loop back to first level
    }
  };

  const resetLevel = () => {
    const maze = mazeLevels[currentLevel - 1];
    setPlayerPosition(maze.playerStart);
    setGameWon(false);
  };

  const renderMaze = () => {
    const maze = mazeLevels[currentLevel - 1];
    const stageWidth = mazeWidth * cellSize;
    const stageHeight = mazeHeight * cellSize;

    return (
      <Stage width={stageWidth} height={stageHeight}>
        <Layer>
          {/* Render maze cells */}
          {maze.grid.flat().map((cell, index) => {
            let fillColor = '#90EE90'; // Default path color
            
            if (cell.type === 'wall') fillColor = '#8B4513';
            else if (cell.type === 'start') fillColor = '#87CEEB';
            else if (cell.type === 'goal') fillColor = '#FFD700';

            return (
              <Rect
                key={index}
                x={cell.x * cellSize}
                y={cell.y * cellSize}
                width={cellSize}
                height={cellSize}
                fill={fillColor}
                stroke="#333"
                strokeWidth={1}
              />
            );
          })}

          {/* Player */}
          <Circle
            x={playerPosition.x * cellSize + cellSize / 2}
            y={playerPosition.y * cellSize + cellSize / 2}
            radius={cellSize / 3}
            fill="#FF6B6B"
            stroke="#FFF"
            strokeWidth={2}
          />
        </Layer>
      </Stage>
    );
  };

  return (
    <div className="w-full h-full p-4">
      <BackButton />
      
      <div className="flex flex-col items-center h-full">
        {/* Title */}
        <h1 className="text-4xl font-kid font-bold text-white mb-4 drop-shadow-lg">
          🌀 Maze Adventure! 🌀
        </h1>

        <div className="text-2xl font-kid font-bold text-white mb-4">
          Level {currentLevel}
        </div>

        {/* Game Won Message */}
        {gameWon && (
          <div className="bg-green-400 rounded-kid-lg p-6 mb-4 text-center animate-bounce">
            <div className="text-4xl mb-2">🎉</div>
            <div className="text-2xl font-kid font-bold text-white">
              Great Job! You found the gold! ⭐
            </div>
          </div>
        )}

        <div className="flex gap-8 items-start">
          {/* Maze */}
          <div className="bg-white rounded-kid-lg p-4 border-4 border-gray-300">
            {renderMaze()}
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-4">
            {/* Arrow Controls */}
            <div className="bg-white/90 rounded-kid-lg p-6">
              <h3 className="text-xl font-kid font-bold text-gray-800 mb-4 text-center">
                Move Around:
              </h3>
              <div className="grid grid-cols-3 gap-2 w-48">
                <div></div>
                <GameButton
                  onClick={() => movePlayer('up')}
                  icon="⬆️"
                  label=""
                  size="md"
                />
                <div></div>
                <GameButton
                  onClick={() => movePlayer('left')}
                  icon="⬅️"
                  label=""
                  size="md"
                />
                <div></div>
                <GameButton
                  onClick={() => movePlayer('right')}
                  icon="➡️"
                  label=""
                  size="md"
                />
                <div></div>
                <GameButton
                  onClick={() => movePlayer('down')}
                  icon="⬇️"
                  label=""
                  size="md"
                />
                <div></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white/90 rounded-kid-lg p-6">
              <div className="flex flex-col gap-4">
                <GameButton
                  onClick={resetLevel}
                  icon="🔄"
                  label="Try Again"
                  variant="warning"
                  size="md"
                />
                {gameWon && (
                  <GameButton
                    onClick={nextLevel}
                    icon="➡️"
                    label="Next Level"
                    variant="accent"
                    size="md"
                  />
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white/90 rounded-kid-lg p-4 max-w-48">
              <h3 className="text-lg font-kid font-bold text-gray-800 mb-2 text-center">
                How to Play:
              </h3>
              <div className="text-sm text-gray-700 space-y-2">
                <div>🔴 You are the red circle</div>
                <div>⭐ Get to the yellow star</div>
                <div>🚫 Don't hit brown walls</div>
                <div>⌨️ Use arrow keys or buttons</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MazeGame;