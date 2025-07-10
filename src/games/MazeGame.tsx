import React, { useState, useEffect, useCallback } from 'react';
import { Stage, Layer, Rect, Circle, Group } from 'react-konva';
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

  // Maze levels - now with 8 challenging levels!
  const mazeLevels: MazeLevel[] = [
    {
      id: 1,
      grid: generateSimpleMaze(1),
      playerStart: { x: 1, y: 1 },
      goal: { x: mazeWidth - 2, y: mazeHeight - 2 },
    },
    {
      id: 2,
      grid: generateSimpleMaze(2),
      playerStart: { x: 1, y: 1 },
      goal: { x: mazeWidth - 2, y: mazeHeight - 2 },
    },
    {
      id: 3,
      grid: generateSimpleMaze(3),
      playerStart: { x: 1, y: 1 },
      goal: { x: mazeWidth - 2, y: mazeHeight - 2 },
    },
    {
      id: 4,
      grid: generateSimpleMaze(4),
      playerStart: { x: 1, y: 1 },
      goal: { x: mazeWidth - 2, y: mazeHeight - 2 },
    },
    {
      id: 5,
      grid: generateSimpleMaze(5),
      playerStart: { x: 1, y: 1 },
      goal: { x: mazeWidth - 2, y: mazeHeight - 2 },
    },
    {
      id: 6,
      grid: generateSimpleMaze(6),
      playerStart: { x: 1, y: 1 },
      goal: { x: mazeWidth - 2, y: mazeHeight - 2 },
    },
    {
      id: 7,
      grid: generateSimpleMaze(7),
      playerStart: { x: 1, y: 1 },
      goal: { x: mazeWidth - 2, y: mazeHeight - 2 },
    },
    {
      id: 8,
      grid: generateSimpleMaze(8),
      playerStart: { x: 1, y: 1 },
      goal: { x: mazeWidth - 2, y: mazeHeight - 2 },
    },
  ];

  function generateSimpleMaze(level: number): MazeCell[][] {
    console.log(`Generating reliable solvable maze for level ${level}`);

    // Use a seed based on level for consistent maze generation
    const seed = level * 12345;
    Math.random = seedRandom(seed);

    // Use our own reliable maze generation that guarantees solvability
    return generateReliableMaze(level);
  }

  // Generate a maze using recursive backtracking that guarantees solvability
  function generateReliableMaze(level: number): MazeCell[][] {
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
    addLevelComplexity(grid, level);

    // Set start and goal
    grid[1][1] = { x: 1, y: 1, type: 'start' };
    grid[mazeHeight - 2][mazeWidth - 2] = {
      x: mazeWidth - 2,
      y: mazeHeight - 2,
      type: 'goal',
    };

    // Final verification - if not solvable, add emergency path
    if (!isPathSolvable(grid)) {
      console.warn(`Adding emergency path for level ${level}`);
      addEmergencyPath(grid);
    }

    return grid;
  }

  // Add level-specific complexity to the base maze
  function addLevelComplexity(grid: MazeCell[][], level: number) {
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
      const extraConnections = (level - 4) * 2;
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
  function addEmergencyPath(grid: MazeCell[][]) {
    // Create an L-shaped path along the edges as backup
    for (let x = 1; x < mazeWidth - 1; x++) {
      grid[mazeHeight - 2][x] = { x, y: mazeHeight - 2, type: 'path' };
    }
    for (let y = 1; y < mazeHeight - 1; y++) {
      grid[y][mazeWidth - 2] = { x: mazeWidth - 2, y, type: 'path' };
    }
  }

  // Check if the maze is solvable using a simple pathfinding
  function isPathSolvable(grid: MazeCell[][]): boolean {
    const start = [1, 1];
    const goal = [mazeHeight - 2, mazeWidth - 2];

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

      if (y === goal[0] && x === goal[1]) {
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

  // Generate custom solvable maze as fallback
  function generateCustomSolvableMaze(level: number): MazeCell[][] {
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      const grid = createCustomMaze(level);
      if (isPathSolvable(grid)) {
        return grid;
      }
      attempts++;
    }

    // If all attempts fail, create a very simple guaranteed solvable maze
    return createGuaranteedSolvableMaze(level);
  }

  function createCustomMaze(level: number): MazeCell[][] {
    const grid: MazeCell[][] = [];

    // Initialize all cells as walls first
    for (let y = 0; y < mazeHeight; y++) {
      grid[y] = [];
      for (let x = 0; x < mazeWidth; x++) {
        grid[y][x] = { x, y, type: 'wall' };
      }
    }

    // Create paths on odd coordinates
    for (let y = 1; y < mazeHeight - 1; y += 2) {
      for (let x = 1; x < mazeWidth - 1; x += 2) {
        grid[y][x] = { x, y, type: 'path' };
      }
    }

    // The recursive backtracking algorithm above already creates appropriate complexity

    // Set start and goal
    grid[1][1] = { x: 1, y: 1, type: 'start' };
    grid[mazeHeight - 2][mazeWidth - 2] = {
      x: mazeWidth - 2,
      y: mazeHeight - 2,
      type: 'goal',
    };

    return grid;
  }

  function createGuaranteedSolvableMaze(level: number): MazeCell[][] {
    const grid: MazeCell[][] = [];

    // Create challenging maze with traditional pattern but guaranteed solvable
    for (let y = 0; y < mazeHeight; y++) {
      grid[y] = [];
      for (let x = 0; x < mazeWidth; x++) {
        let cellType: 'wall' | 'path' | 'start' | 'goal' = 'wall';

        // Outer edges are walls
        if (x === 0 || y === 0 || x === mazeWidth - 1 || y === mazeHeight - 1) {
          cellType = 'wall';
        }
        // Traditional maze pattern: paths on odd coordinates
        else if ((x - 1) % 2 === 0 && (y - 1) % 2 === 0) {
          cellType = 'path'; // Room positions
        }
        // Corridor positions - randomly open some
        else if ((x - 1) % 2 === 1 && (y - 1) % 2 === 0) {
          // Horizontal corridors
          cellType = Math.random() < 0.4 ? 'path' : 'wall';
        } else if ((x - 1) % 2 === 0 && (y - 1) % 2 === 1) {
          // Vertical corridors
          cellType = Math.random() < 0.4 ? 'path' : 'wall';
        }
        // Corner positions stay as walls

        grid[y][x] = { x, y, type: cellType };
      }
    }

    // Ensure there's a guaranteed path from start to goal
    // Create an L-shaped path along the bottom and right edges
    for (let x = 1; x < mazeWidth - 1; x++) {
      grid[mazeHeight - 2][x] = { x, y: mazeHeight - 2, type: 'path' };
    }
    for (let y = 1; y < mazeHeight - 1; y++) {
      grid[y][mazeWidth - 2] = { x: mazeWidth - 2, y, type: 'path' };
    }

    // Set start and goal
    grid[1][1] = { x: 1, y: 1, type: 'start' };
    grid[mazeHeight - 2][mazeWidth - 2] = {
      x: mazeWidth - 2,
      y: mazeHeight - 2,
      type: 'goal',
    };

    return grid;
  }

  // Ensure there's always a basic path from start to goal
  function ensureBasicPath(grid: MazeCell[][]) {
    // Create a guaranteed path along the bottom and right edges
    // Horizontal path along bottom
    for (let x = 1; x < mazeWidth - 2; x++) {
      grid[mazeHeight - 2][x] = { x, y: mazeHeight - 2, type: 'path' };
    }

    // Vertical path along right
    for (let y = 1; y < mazeHeight - 2; y++) {
      grid[y][mazeWidth - 2] = { x: mazeWidth - 2, y, type: 'path' };
    }

    // Connect start area to the path
    grid[1][2] = { x: 2, y: 1, type: 'path' };
    grid[2][1] = { x: 1, y: 2, type: 'path' };
  }

  // Simple seeded random number generator for consistent maze generation
  function seedRandom(seed: number) {
    let state = seed;
    return function () {
      state = (state * 1664525 + 1013904223) % 4294967296;
      return state / 4294967296;
    };
  }

  // Convert algernon raw maze format to our MazeCell format
  function convertAlgernonToMazeCell(rawMaze: number[][]): MazeCell[][] {
    const grid: MazeCell[][] = [];

    console.log('Converting algernon maze to grid format');

    // Create a proper maze grid based on algernon's data
    // Algernon creates smaller grids, so we need to scale up properly
    for (let y = 0; y < mazeHeight; y++) {
      grid[y] = [];
      for (let x = 0; x < mazeWidth; x++) {
        let cellType: 'wall' | 'path' | 'start' | 'goal' = 'wall';

        // Outer edges are always walls
        if (x === 0 || y === 0 || x === mazeWidth - 1 || y === mazeHeight - 1) {
          cellType = 'wall';
        }
        // Interior cells - use algernon data for proper maze structure
        else {
          // Map our coordinates to algernon's smaller grid
          const algY = Math.floor((y - 1) / 2);
          const algX = Math.floor((x - 1) / 2);

          if (
            algY >= 0 &&
            algY < rawMaze.length &&
            algX >= 0 &&
            algX < rawMaze[0].length
          ) {
            const cell = rawMaze[algY][algX];

            // For odd coordinates, it's a room (path)
            if ((x - 1) % 2 === 0 && (y - 1) % 2 === 0) {
              cellType = 'path';
            }
            // For wall positions, check algernon's wall data
            else if ((x - 1) % 2 === 1 && (y - 1) % 2 === 0) {
              // Horizontal wall - check south wall of cell above
              const hasWall = (cell & 4) !== 0; // South wall bit
              cellType = hasWall ? 'wall' : 'path';
            } else if ((x - 1) % 2 === 0 && (y - 1) % 2 === 1) {
              // Vertical wall - check east wall of cell to left
              const hasWall = (cell & 2) !== 0; // East wall bit
              cellType = hasWall ? 'wall' : 'path';
            } else {
              // Corner positions - usually walls unless specifically opened
              cellType = 'wall';
            }
          }
        }

        grid[y][x] = { x, y, type: cellType };
      }
    }

    // Set start and goal positions
    grid[1][1] = { x: 1, y: 1, type: 'start' };
    grid[mazeHeight - 2][mazeWidth - 2] = {
      x: mazeWidth - 2,
      y: mazeHeight - 2,
      type: 'goal',
    };

    return grid;
  }

  // Ensure minimum wall coverage for a proper maze feel
  function addMinimumWalls(grid: MazeCell[][]) {
    // Add some strategic walls to ensure the maze has proper complexity
    const wallDensity = 0.3; // 30% walls
    let currentWalls = 0;
    let totalCells = 0;

    // Count current walls
    for (let y = 1; y < mazeHeight - 1; y++) {
      for (let x = 1; x < mazeWidth - 1; x++) {
        totalCells++;
        if (grid[y][x].type === 'wall') currentWalls++;
      }
    }

    const targetWalls = Math.floor(totalCells * wallDensity);
    const wallsToAdd = Math.max(0, targetWalls - currentWalls);

    // Add walls randomly but strategically
    for (let i = 0; i < wallsToAdd; i++) {
      const x = Math.floor(Math.random() * (mazeWidth - 2)) + 1;
      const y = Math.floor(Math.random() * (mazeHeight - 2)) + 1;

      // Don't modify start/goal or already walls
      if (
        (x === 1 && y === 1) ||
        (x === mazeWidth - 2 && y === mazeHeight - 2) ||
        grid[y][x].type === 'wall'
      ) {
        continue;
      }

      // Add wall if it doesn't completely block the path
      grid[y][x] = { x, y, type: 'wall' };
    }
  }

  // Convert our MazeCell format back to algernon format for verification
  function convertMazeCellToAlgernon(grid: MazeCell[][]): number[][] {
    const rawMaze: number[][] = [];

    for (let y = 0; y < mazeHeight; y++) {
      rawMaze[y] = [];
      for (let x = 0; x < mazeWidth; x++) {
        const cell = grid[y][x];
        // If it's a wall, block all directions (15 = 1111 in binary)
        // If it's a path, we'll determine walls based on neighboring cells
        if (cell.type === 'wall') {
          rawMaze[y][x] = 15; // All walls
        } else {
          let walls = 0;
          // Check each direction and add wall if neighbor is a wall
          if (y > 0 && grid[y - 1][x].type === 'wall') walls |= 1; // North
          if (x < mazeWidth - 1 && grid[y][x + 1].type === 'wall') walls |= 2; // East
          if (y < mazeHeight - 1 && grid[y + 1][x].type === 'wall') walls |= 4; // South
          if (x > 0 && grid[y][x - 1].type === 'wall') walls |= 8; // West
          rawMaze[y][x] = walls;
        }
      }
    }

    return rawMaze;
  }

  // Add complexity to higher level mazes
  function addComplexityToMaze(grid: MazeCell[][], level: number) {
    const complexity = Math.min(level - 3, 5); // Scale 1-5 for levels 4-8

    // Add some strategic path openings to create more interesting layouts
    for (let i = 0; i < complexity * 2; i++) {
      const x = Math.floor(Math.random() * (mazeWidth - 2)) + 1;
      const y = Math.floor(Math.random() * (mazeHeight - 2)) + 1;

      // Don't modify start/goal
      if (
        (x === 1 && y === 1) ||
        (x === mazeWidth - 2 && y === mazeHeight - 2)
      ) {
        continue;
      }

      // Occasionally remove walls to create more open areas
      if (Math.random() < 0.3 && grid[y][x].type === 'wall') {
        grid[y][x] = { x, y, type: 'path' };
      }
    }
  }

  // Fallback maze generator for when algernon fails
  function generateFallbackMaze(_level: number): MazeCell[][] {
    const grid: MazeCell[][] = [];

    // Create a simple guaranteed solvable maze
    for (let y = 0; y < mazeHeight; y++) {
      grid[y] = [];
      for (let x = 0; x < mazeWidth; x++) {
        let cellType: 'wall' | 'path' | 'start' | 'goal' = 'path';

        // Outer edges are walls
        if (x === 0 || y === 0 || x === mazeWidth - 1 || y === mazeHeight - 1) {
          cellType = 'wall';
        }
        // Create a simple path pattern that's guaranteed solvable
        else if (
          (x + y) % 3 === 0 &&
          x !== 1 &&
          y !== 1 &&
          x !== mazeWidth - 2 &&
          y !== mazeHeight - 2
        ) {
          cellType = Math.random() < 0.4 ? 'wall' : 'path';
        }

        grid[y][x] = { x, y, type: cellType };
      }
    }

    // Ensure there's always a clear path along the edges
    for (let x = 1; x < mazeWidth - 1; x++) {
      if (x % 2 === 1) grid[1][x] = { x, y: 1, type: 'path' };
    }
    for (let y = 1; y < mazeHeight - 1; y++) {
      if (y % 2 === 1)
        grid[y][mazeWidth - 2] = { x: mazeWidth - 2, y, type: 'path' };
    }

    // Set start and goal
    grid[1][1] = { x: 1, y: 1, type: 'start' };
    grid[mazeHeight - 2][mazeWidth - 2] = {
      x: mazeWidth - 2,
      y: mazeHeight - 2,
      type: 'goal',
    };

    return grid;
  }

  // Render simplified character for maze
  const renderMazeCharacter = (
    x: number,
    y: number,
    currentCellSize: number = cellSize
  ) => {
    const character = state.character;
    const size = currentCellSize * 0.6; // Make character smaller than cell
    const centerX = x * currentCellSize + currentCellSize / 2;
    const centerY = y * currentCellSize + currentCellSize / 2;

    // Character part colors - simplified version
    const headColor = '#3B82F6'; // blue
    const bodyColor = '#EF4444'; // red
    const eyeColor =
      character.eyes === 'blue_led'
        ? '#1E40AF'
        : character.eyes === 'red_laser'
        ? '#DC2626'
        : '#059669';

    return (
      <Group x={centerX} y={centerY}>
        {/* Body */}
        <Rect
          x={-size / 4}
          y={-size / 4}
          width={size / 2}
          height={size / 2}
          fill={bodyColor}
          stroke='#1E293B'
          strokeWidth={1}
          cornerRadius={character.torso === 'rounded' ? size / 8 : 0}
        />

        {/* Head */}
        {character.head === 'round' ? (
          <Circle
            x={0}
            y={-size / 2}
            radius={size / 4}
            fill={headColor}
            stroke='#1E293B'
            strokeWidth={1}
          />
        ) : (
          <Rect
            x={-size / 4}
            y={-size / 2 - size / 4}
            width={size / 2}
            height={size / 2}
            fill={headColor}
            stroke='#1E293B'
            strokeWidth={1}
            cornerRadius={character.head === 'hexagon' ? size / 16 : 0}
          />
        )}

        {/* Eyes */}
        <Circle
          x={-size / 8}
          y={-size / 2}
          radius={size / 16}
          fill={eyeColor}
        />
        <Circle x={size / 8} y={-size / 2} radius={size / 16} fill={eyeColor} />

        {/* Legs/Wheels indication */}
        {character.legs === 'wheels' ? (
          <>
            <Circle
              x={-size / 6}
              y={size / 3}
              radius={size / 8}
              fill='#111827'
              stroke='#374151'
              strokeWidth={1}
            />
            <Circle
              x={size / 6}
              y={size / 3}
              radius={size / 8}
              fill='#111827'
              stroke='#374151'
              strokeWidth={1}
            />
          </>
        ) : (
          <>
            <Rect
              x={-size / 6}
              y={size / 6}
              width={size / 12}
              height={size / 3}
              fill='#10B981'
              stroke='#1E293B'
              strokeWidth={1}
            />
            <Rect
              x={size / 12}
              y={size / 6}
              width={size / 12}
              height={size / 3}
              fill='#10B981'
              stroke='#1E293B'
              strokeWidth={1}
            />
          </>
        )}
      </Group>
    );
  };

  const movePlayer = useCallback(
    (direction: 'up' | 'down' | 'left' | 'right') => {
      if (gameWon) return;

      setPlayerPosition((prevPos) => {
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

  const resetLevel = () => {
    const maze = mazeLevels[currentLevel - 1];
    setPlayerPosition(maze.playerStart);
    setGameWon(false);
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
          Taso {currentLevel}
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
                <div className='text-lg sm:text-3xl mb-2'>🎉</div>
                <div className='text-sm sm:text-xl font-kid font-bold text-white mb-3 sm:mb-4'>
                  Hyvin tehty! Löysit kullan! ⭐
                </div>
                <div className='flex flex-col items-center gap-2'>
                  <GameButton
                    onClick={nextLevel}
                    icon='➡️'
                    label='Seuraava'
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
          <div className='flex flex-col gap-1 sm:gap-4 w-full max-w-xs order-2 lg:order-2 px-2'>
            {/* Arrow Controls */}
            <div className='bg-white/90 rounded-kid-lg p-2 sm:p-6'>
              <h3 className='text-sm sm:text-xl font-kid font-bold text-gray-800 mb-1 sm:mb-4 text-center'>
                Liiku:
              </h3>
              <div className='grid grid-cols-3 gap-1 sm:gap-2 w-32 sm:w-44 mx-auto'>
                <div></div>
                <GameButton
                  onClick={() => movePlayer('up')}
                  icon='⬆️'
                  label=''
                  size='sm'
                  className='aspect-square w-8 h-8 sm:w-auto sm:h-auto text-sm'
                />
                <div></div>
                <GameButton
                  onClick={() => movePlayer('left')}
                  icon='⬅️'
                  label=''
                  size='sm'
                  className='aspect-square w-8 h-8 sm:w-auto sm:h-auto text-sm'
                />
                <div></div>
                <GameButton
                  onClick={() => movePlayer('right')}
                  icon='➡️'
                  label=''
                  size='sm'
                  className='aspect-square w-8 h-8 sm:w-auto sm:h-auto text-sm'
                />
                <div></div>
                <GameButton
                  onClick={() => movePlayer('down')}
                  icon='⬇️'
                  label=''
                  size='sm'
                  className='aspect-square w-8 h-8 sm:w-auto sm:h-auto text-sm'
                />
                <div></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='bg-white/90 rounded-kid-lg p-2 sm:p-6'>
              <div className='flex flex-col gap-1 sm:gap-4 items-center'>
                <GameButton
                  onClick={resetLevel}
                  icon='🔄'
                  label='Uudestaan'
                  variant='warning'
                  size='sm'
                  className='text-xs sm:text-sm w-full max-w-32 sm:max-w-none'
                />
              </div>
            </div>

            {/* Instructions */}
            <div className='bg-white/90 rounded-kid-lg p-2 sm:p-4'>
              <h3 className='text-xs sm:text-lg font-kid font-bold text-gray-800 mb-1 sm:mb-2 text-center'>
                Kuinka pelata:
              </h3>
              <div className='text-xs sm:text-sm text-gray-700 space-y-0.5 sm:space-y-2'>
                <div>🤖 Sinä olet oma robottisi</div>
                <div>⭐ Pääse keltaiseen tähteen</div>
                <div>🚫 Älä osu ruskeisiin seiniin</div>
                <div>⌨️ Käytä nuolinäppäimiä tai painikkeita</div>
                <div>✨ Paina Enter siirtyäksesi seuraavaan tasoon</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MazeGame;
