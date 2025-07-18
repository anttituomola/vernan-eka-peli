import React, { useState, useEffect, useCallback } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import { useGame } from '../App';
import { MazeLevel, MazeCell } from '../types';
import BackButton from '../components/BackButton';
import GameButton from '../components/GameButton';
import CharacterIcon from '../components/CharacterIcon';

const MazeGame: React.FC = () => {
  const { state, dispatch } = useGame();
  const [playerPosition, setPlayerPosition] = useState({ x: 1, y: 1 });
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameWon, setGameWon] = useState(false);

  const cellSize = 40;

  // Get maze dimensions based on level - bigger mazes for higher levels
  const getMazeDimensions = (level: number) => {
    if (level <= 8) {
      return { width: 15, height: 11 }; // Original size for levels 1-8
    } else if (level <= 12) {
      return { width: 19, height: 15 }; // Medium size for levels 9-12
    } else {
      return { width: 23, height: 17 }; // Large size for levels 13-16
    }
  };

  // Maze levels - now with 16 challenging levels!
  const mazeLevels: MazeLevel[] = [];

  // Generate all 16 levels
  for (let level = 1; level <= 16; level++) {
    const dimensions = getMazeDimensions(level);

    // For advanced levels, randomize start and goal positions (but keep them solvable)
    let playerStart = { x: 1, y: 1 };
    let goal = { x: dimensions.width - 2, y: dimensions.height - 2 };

    if (level > 8) {
      // Use level as seed for consistent random positions
      const seed = level * 9876;
      const startRandom = (seed % 4) + 1;

      switch (startRandom) {
        case 1: // Top-left (default)
          playerStart = { x: 1, y: 1 };
          goal = { x: dimensions.width - 2, y: dimensions.height - 2 };
          break;
        case 2: // Top-right
          playerStart = { x: dimensions.width - 2, y: 1 };
          goal = { x: 1, y: dimensions.height - 2 };
          break;
        case 3: // Bottom-left
          playerStart = { x: 1, y: dimensions.height - 2 };
          goal = { x: dimensions.width - 2, y: 1 };
          break;
        case 4: // Bottom-right
          playerStart = { x: dimensions.width - 2, y: dimensions.height - 2 };
          goal = { x: 1, y: 1 };
          break;
      }
    }

    mazeLevels.push({
      id: level,
      grid: generateAdvancedMaze(
        level,
        dimensions.width,
        dimensions.height,
        playerStart,
        goal
      ),
      playerStart,
      goal,
    });
  }

  function generateAdvancedMaze(
    level: number,
    mazeWidth: number,
    mazeHeight: number,
    playerStart: { x: number; y: number },
    goal: { x: number; y: number }
  ): MazeCell[][] {
    console.log(
      `Generating reliable solvable maze for level ${level}, size: ${mazeWidth}x${mazeHeight}`
    );

    // Use a seed based on level for consistent maze generation
    const seed = level * 12345;
    Math.random = seedRandom(seed);

    // Use our own reliable maze generation that guarantees solvability
    return generateReliableMaze(
      level,
      mazeWidth,
      mazeHeight,
      playerStart,
      goal
    );
  }

  // Generate a maze using recursive backtracking that guarantees solvability
  function generateReliableMaze(
    level: number,
    mazeWidth: number,
    mazeHeight: number,
    playerStart: { x: number; y: number },
    goal: { x: number; y: number }
  ): MazeCell[][] {
    const grid: MazeCell[][] = [];

    // Initialize all cells as walls
    for (let y = 0; y < mazeHeight; y++) {
      grid[y] = [];
      for (let x = 0; x < mazeWidth; x++) {
        grid[y][x] = { x, y, type: 'wall' };
      }
    }

    // Create rooms on odd coordinates (this ensures we have a grid pattern)
    for (let y = 1; y < mazeHeight - 1; y += 2) {
      for (let x = 1; x < mazeWidth - 1; x += 2) {
        grid[y][x] = { x, y, type: 'path' };
      }
    }

    // Now connect rooms using a guaranteed solvable algorithm
    const visited = new Set<string>();
    const stack: [number, number][] = [];

    // Start from the top-left room (1,1)
    const startX = 1,
      startY = 1;
    visited.add(`${startY},${startX}`);
    stack.push([startY, startX]);

    while (stack.length > 0) {
      const [currentY, currentX] = stack[stack.length - 1];

      // Get unvisited neighbors (only on odd coordinates)
      const neighbors: [number, number][] = [];
      const directions = [
        [-2, 0],
        [2, 0],
        [0, -2],
        [0, 2], // North, South, West, East
      ];

      for (const [dy, dx] of directions) {
        const newY = currentY + dy;
        const newX = currentX + dx;

        if (
          newY > 0 &&
          newY < mazeHeight - 1 &&
          newX > 0 &&
          newX < mazeWidth - 1 &&
          !visited.has(`${newY},${newX}`)
        ) {
          neighbors.push([newY, newX]);
        }
      }

      if (neighbors.length > 0) {
        // Choose a random neighbor
        const [nextY, nextX] =
          neighbors[Math.floor(Math.random() * neighbors.length)];

        // Mark neighbor as visited
        visited.add(`${nextY},${nextX}`);

        // Remove wall between current and neighbor
        const wallY = (currentY + nextY) / 2;
        const wallX = (currentX + nextX) / 2;
        grid[wallY][wallX] = { x: wallX, y: wallY, type: 'path' };

        // Add neighbor to stack
        stack.push([nextY, nextX]);
      } else {
        // Backtrack
        stack.pop();
      }
    }

    // Apply level-specific complexity
    addLevelComplexity(grid, level, mazeWidth, mazeHeight);

    // Set start and goal
    grid[playerStart.y][playerStart.x] = {
      x: playerStart.x,
      y: playerStart.y,
      type: 'start',
    };
    grid[goal.y][goal.x] = {
      x: goal.x,
      y: goal.y,
      type: 'goal',
    };

    // Final verification - if not solvable, add emergency path
    if (!isPathSolvable(grid, mazeWidth, mazeHeight, playerStart, goal)) {
      console.warn(`Adding emergency path for level ${level}`);
      addEmergencyPath(grid, mazeWidth, mazeHeight);
    }

    return grid;
  }

  // Add level-specific complexity to the base maze
  function addLevelComplexity(
    grid: MazeCell[][],
    level: number,
    mazeWidth: number,
    mazeHeight: number
  ) {
    if (level === 1) {
      // Level 1: Remove some walls to make it easier
      for (let i = 0; i < 3; i++) {
        const x = 2 + Math.floor(Math.random() * (mazeWidth - 4));
        const y = 2 + Math.floor(Math.random() * (mazeHeight - 4));
        if (grid[y][x].type === 'wall' && (x % 2 === 0 || y % 2 === 0)) {
          grid[y][x] = { x, y, type: 'path' };
        }
      }
    } else if (level >= 5) {
      // Higher levels: Add some extra connections for multiple paths
      const baseConnections = level <= 8 ? (level - 4) * 2 : (level - 4) * 3;
      const extraConnections =
        level > 12 ? baseConnections + 5 : baseConnections;

      for (let i = 0; i < extraConnections; i++) {
        const x = 2 + Math.floor(Math.random() * (mazeWidth - 4));
        const y = 2 + Math.floor(Math.random() * (mazeHeight - 4));
        if (grid[y][x].type === 'wall' && (x % 2 === 0 || y % 2 === 0)) {
          grid[y][x] = { x, y, type: 'path' };
        }
      }
    }
    // Levels 2-4 keep the base maze without modifications
  }

  // Add an emergency guaranteed path if maze becomes unsolvable
  function addEmergencyPath(
    grid: MazeCell[][],
    mazeWidth: number,
    mazeHeight: number
  ) {
    // Create an L-shaped path along the edges as backup
    for (let x = 1; x < mazeWidth - 1; x++) {
      grid[mazeHeight - 2][x] = { x, y: mazeHeight - 2, type: 'path' };
    }
    for (let y = 1; y < mazeHeight - 1; y++) {
      grid[y][mazeWidth - 2] = { x: mazeWidth - 2, y, type: 'path' };
    }
  }

  // Check if the maze is solvable using a simple pathfinding
  function isPathSolvable(
    grid: MazeCell[][],
    mazeWidth: number,
    mazeHeight: number,
    playerStart: { x: number; y: number },
    goal: { x: number; y: number }
  ): boolean {
    const start = [playerStart.y, playerStart.x];
    const goalPos = [goal.y, goal.x];

    // Simple BFS pathfinding
    const queue = [start];
    const visited = new Set<string>();
    visited.add(`${start[0]},${start[1]}`);

    const directions = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];

    while (queue.length > 0) {
      const [y, x] = queue.shift()!;

      if (y === goalPos[0] && x === goalPos[1]) {
        return true; // Found path to goal
      }

      for (const [dy, dx] of directions) {
        const newY = y + dy;
        const newX = x + dx;
        const key = `${newY},${newX}`;

        if (
          newY >= 0 &&
          newY < mazeHeight &&
          newX >= 0 &&
          newX < mazeWidth &&
          !visited.has(key) &&
          grid[newY][newX].type !== 'wall'
        ) {
          visited.add(key);
          queue.push([newY, newX]);
        }
      }
    }

    return false; // No path found
  }

  // Simple seeded random number generator for consistent maze generation
  function seedRandom(seed: number) {
    let state = seed;
    return function () {
      state = (state * 1664525 + 1013904223) % 4294967296;
      return state / 4294967296;
    };
  }

  // Render character for maze using CharacterIcon component
  const renderMazeCharacter = (
    x: number,
    y: number,
    currentCellSize: number = cellSize
  ) => {
    const characterSize = currentCellSize * 0.6; // Make character smaller than cell
    const centerX = x * currentCellSize + currentCellSize / 2;
    const centerY = y * currentCellSize + currentCellSize / 2;

    return (
      <CharacterIcon
        character={state.character}
        size={characterSize}
        x={centerX}
        y={centerY}
      />
    );
  };

  const movePlayer = useCallback(
    (direction: 'up' | 'down' | 'left' | 'right') => {
      if (gameWon) return;

      setPlayerPosition((prevPos) => {
        const newPos = { ...prevPos };
        const currentDimensions = getMazeDimensions(currentLevel);
        const mazeWidth = currentDimensions.width;
        const mazeHeight = currentDimensions.height;

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
    },
    [gameWon, currentLevel, dispatch]
  );

  const nextLevel = () => {
    if (currentLevel < mazeLevels.length) {
      setCurrentLevel(currentLevel + 1);
    } else {
      setCurrentLevel(1); // Loop back to first level
    }
  };

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
        case 'Enter':
          if (gameWon) {
            event.preventDefault();
            nextLevel();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePlayer, gameWon, nextLevel]);

  // Reset when level changes
  useEffect(() => {
    const maze = mazeLevels[currentLevel - 1];
    if (maze) {
      setPlayerPosition(maze.playerStart);
      setGameWon(false);
    }
  }, [currentLevel]);

  const renderMaze = () => {
    const maze = mazeLevels[currentLevel - 1];
    const currentDimensions = getMazeDimensions(currentLevel);
    const mazeWidth = currentDimensions.width;
    const mazeHeight = currentDimensions.height;

    // Responsive cell size based on screen
    const responsiveCellSize = Math.min(
      cellSize,
      Math.floor((window.innerWidth * 0.8) / mazeWidth),
      Math.floor((window.innerHeight * 0.6) / mazeHeight)
    );
    const stageWidth = mazeWidth * responsiveCellSize;
    const stageHeight = mazeHeight * responsiveCellSize;

    return (
      <Stage
        width={stageWidth}
        height={stageHeight}
        style={{ maxWidth: '100%', height: 'auto' }}
      >
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
                x={cell.x * responsiveCellSize}
                y={cell.y * responsiveCellSize}
                width={responsiveCellSize}
                height={responsiveCellSize}
                fill={fillColor}
                stroke='#333'
                strokeWidth={1}
              />
            );
          })}

          {/* Player */}
          {renderMazeCharacter(
            playerPosition.x,
            playerPosition.y,
            responsiveCellSize
          )}
        </Layer>
      </Stage>
    );
  };

  return (
    <div className='w-full min-h-screen p-1 sm:p-4 flex flex-col'>
      <BackButton />

      <div className='flex flex-col items-center flex-1 pt-12 sm:pt-4 pb-4 overflow-y-auto'>
        {/* Title */}
        <h1 className='text-xl sm:text-3xl lg:text-4xl font-kid font-bold text-white mb-1 sm:mb-4 drop-shadow-lg text-center px-2'>
          🌀 Labyrinttiseikkailu! 🌀
        </h1>

        <div className='text-sm sm:text-xl lg:text-2xl font-kid font-bold text-white mb-1 sm:mb-4'>
          Taso {currentLevel}/16
          {currentLevel <= 8 && <span className='text-green-300'>⭐</span>}
          {currentLevel > 8 && currentLevel <= 12 && (
            <span className='text-yellow-300'>⭐⭐</span>
          )}
          {currentLevel > 12 && <span className='text-red-300'>⭐⭐⭐</span>}
        </div>

        <div className='flex flex-col lg:flex-row gap-2 lg:gap-8 items-center lg:items-start w-full max-w-7xl justify-center'>
          {/* Maze */}
          <div className='bg-white rounded-kid-lg p-1 sm:p-4 border-2 sm:border-4 border-gray-300 order-1 lg:order-1 flex-shrink-0 max-w-full relative'>
            <div className='overflow-auto max-h-[60vh] lg:max-h-none'>
              {renderMaze()}
            </div>
            {/* Game Won Message - Overlaid on top of maze */}
            {gameWon && (
              <div
                className='absolute top-4 left-0 right-0 mx-auto w-fit z-10 bg-green-400 rounded-kid-lg p-3 sm:p-6 text-center shadow-lg max-w-xs animate-bounce'
                style={{ animationIterationCount: '2' }}
              >
                <div className='text-lg sm:text-3xl mb-2'>
                  {currentLevel === 16 ? '🏆' : '🎉'}
                </div>
                <div className='text-sm sm:text-xl font-kid font-bold text-white mb-3 sm:mb-4'>
                  {currentLevel === 16
                    ? 'Onnittelut! Läpäisit kaikki tasot! 🏆🌟'
                    : 'Hyvin tehty! Löysit kullan! ⭐'}
                </div>
                <div className='flex flex-col items-center gap-2'>
                  <GameButton
                    onClick={nextLevel}
                    icon={currentLevel === 16 ? '🔄' : '➡️'}
                    label={currentLevel === 16 ? 'Aloita alusta' : 'Seuraava'}
                    variant='accent'
                    size='sm'
                    className='text-xs sm:text-sm bg-blue-500 hover:bg-blue-600 text-white border-blue-600 px-4 py-2'
                  />
                  <div className='text-xs text-white opacity-75'>
                    (tai paina Enter)
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className='flex justify-center order-2 lg:order-2'>
            {/* Arrow Controls */}
            <div className='bg-white/90 rounded-kid-lg p-2 sm:p-4'>
              <h3 className='text-sm sm:text-lg font-kid font-bold text-gray-800 mb-2 sm:mb-3 text-center'>
                Liiku:
              </h3>
              <div className='grid grid-cols-3 gap-1 w-40 sm:w-52 mx-auto'>
                <div></div>
                <button
                  onClick={() => movePlayer('up')}
                  className='kid-button kid-button-primary w-16 h-16 sm:w-20 sm:h-20 text-xl sm:text-2xl flex items-center justify-center'
                  type='button'
                >
                  ⬆️
                </button>
                <div></div>
                <button
                  onClick={() => movePlayer('left')}
                  className='kid-button kid-button-primary w-16 h-16 sm:w-20 sm:h-20 text-xl sm:text-2xl flex items-center justify-center'
                  type='button'
                >
                  ⬅️
                </button>
                <div></div>
                <button
                  onClick={() => movePlayer('right')}
                  className='kid-button kid-button-primary w-16 h-16 sm:w-20 sm:h-20 text-xl sm:text-2xl flex items-center justify-center'
                  type='button'
                >
                  ➡️
                </button>
                <div></div>
                <button
                  onClick={() => movePlayer('down')}
                  className='kid-button kid-button-primary w-16 h-16 sm:w-20 sm:h-20 text-xl sm:text-2xl flex items-center justify-center'
                  type='button'
                >
                  ⬇️
                </button>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MazeGame;
