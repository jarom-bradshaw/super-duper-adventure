import { useEffect, useRef, useState } from 'react';
import GameResult from '../GameResult';

type Direction = 'up' | 'down' | 'left' | 'right';

type AnimatingTile = {
  value: number;
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
  progress: number;
  isMerging: boolean;
};

export default function Game2048Mini() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);
  const lastMoveRef = useRef<number>(0);
  const scoreRef = useRef<number>(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const gameWonRef = useRef<boolean>(false);
  const [gameWon, setGameWon] = useState(false);
  const gridRef = useRef<number[][]>([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const animatingTilesRef = useRef<AnimatingTile[]>([]);
  const animationStartTimeRef = useRef<number>(0);
  const isAnimatingRef = useRef<boolean>(false);
  const oldGridRef = useRef<number[][] | null>(null);

  const GRID_SIZE = 4;
  const CELL_SIZE = 100;
  const PADDING = 10;
  const CANVAS_SIZE = GRID_SIZE * CELL_SIZE + (GRID_SIZE + 1) * PADDING;
  const ANIMATION_DURATION = 200; // milliseconds

  // Initialize game with 2 random tiles
  const initGame = () => {
    gridRef.current = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    scoreRef.current = 0;
    setScore(0);
    gameWonRef.current = false;
    setGameWon(false);
    addRandomTile();
    addRandomTile();
  };

  // Add a random tile (2 or 4) to an empty cell
  const addRandomTile = () => {
    const emptyCells: { row: number; col: number }[] = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (gridRef.current[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }
    if (emptyCells.length > 0) {
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      gridRef.current[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  // Calculate tile positions after move (returns new grid and animation data)
  const calculateMove = (direction: Direction): { newGrid: number[][]; animations: AnimatingTile[]; moved: boolean; newScore: number } => {
    const grid = gridRef.current.map(row => [...row]);
    const newGrid: number[][] = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    let moved = false;
    let newScore = scoreRef.current;
    const animations: AnimatingTile[] = [];

    // Process movement based on direction
    if (direction === 'left') {
      for (let row = 0; row < GRID_SIZE; row++) {
        const tiles: { value: number; col: number }[] = [];
        for (let col = 0; col < GRID_SIZE; col++) {
          if (grid[row][col] !== 0) {
            tiles.push({ value: grid[row][col], col });
          }
        }

        let targetCol = 0;
        let i = 0;
        while (i < tiles.length) {
          if (i < tiles.length - 1 && tiles[i].value === tiles[i + 1].value) {
            const mergedValue = tiles[i].value * 2;
            newScore += mergedValue;
            if (mergedValue === 2048 && !gameWonRef.current) {
              gameWonRef.current = true;
              setGameWon(true);
            }

            animations.push({
              value: mergedValue,
              fromRow: row,
              fromCol: tiles[i].col,
              toRow: row,
              toCol: targetCol,
              progress: 0,
              isMerging: false,
            });

            if (tiles[i + 1].col !== tiles[i].col) {
              animations.push({
                value: tiles[i].value,
                fromRow: row,
                fromCol: tiles[i + 1].col,
                toRow: row,
                toCol: targetCol,
                progress: 0,
                isMerging: true,
              });
            }

            newGrid[row][targetCol] = mergedValue;
            targetCol++;
            i += 2;
          } else {
            if (tiles[i].col !== targetCol) {
              animations.push({
                value: tiles[i].value,
                fromRow: row,
                fromCol: tiles[i].col,
                toRow: row,
                toCol: targetCol,
                progress: 0,
                isMerging: false,
              });
              moved = true;
            }
            newGrid[row][targetCol] = tiles[i].value;
            targetCol++;
            i++;
          }
        }
      }
    } else if (direction === 'right') {
      for (let row = 0; row < GRID_SIZE; row++) {
        const tiles: { value: number; col: number }[] = [];
        for (let col = GRID_SIZE - 1; col >= 0; col--) {
          if (grid[row][col] !== 0) {
            tiles.push({ value: grid[row][col], col });
          }
        }

        let targetCol = GRID_SIZE - 1;
        let i = 0;
        while (i < tiles.length) {
          if (i < tiles.length - 1 && tiles[i].value === tiles[i + 1].value) {
            const mergedValue = tiles[i].value * 2;
            newScore += mergedValue;
            if (mergedValue === 2048 && !gameWonRef.current) {
              gameWonRef.current = true;
              setGameWon(true);
            }

            animations.push({
              value: mergedValue,
              fromRow: row,
              fromCol: tiles[i].col,
              toRow: row,
              toCol: targetCol,
              progress: 0,
              isMerging: false,
            });

            if (tiles[i + 1].col !== tiles[i].col) {
              animations.push({
                value: tiles[i].value,
                fromRow: row,
                fromCol: tiles[i + 1].col,
                toRow: row,
                toCol: targetCol,
                progress: 0,
                isMerging: true,
              });
            }

            newGrid[row][targetCol] = mergedValue;
            targetCol--;
            i += 2;
          } else {
            if (tiles[i].col !== targetCol) {
              animations.push({
                value: tiles[i].value,
                fromRow: row,
                fromCol: tiles[i].col,
                toRow: row,
                toCol: targetCol,
                progress: 0,
                isMerging: false,
              });
              moved = true;
            }
            newGrid[row][targetCol] = tiles[i].value;
            targetCol--;
            i++;
          }
        }
      }
    } else if (direction === 'up') {
      for (let col = 0; col < GRID_SIZE; col++) {
        const tiles: { value: number; row: number }[] = [];
        for (let row = 0; row < GRID_SIZE; row++) {
          if (grid[row][col] !== 0) {
            tiles.push({ value: grid[row][col], row });
          }
        }

        let targetRow = 0;
        let i = 0;
        while (i < tiles.length) {
          if (i < tiles.length - 1 && tiles[i].value === tiles[i + 1].value) {
            const mergedValue = tiles[i].value * 2;
            newScore += mergedValue;
            if (mergedValue === 2048 && !gameWonRef.current) {
              gameWonRef.current = true;
              setGameWon(true);
            }

            animations.push({
              value: mergedValue,
              fromRow: tiles[i].row,
              fromCol: col,
              toRow: targetRow,
              toCol: col,
              progress: 0,
              isMerging: false,
            });

            if (tiles[i + 1].row !== tiles[i].row) {
              animations.push({
                value: tiles[i].value,
                fromRow: tiles[i + 1].row,
                fromCol: col,
                toRow: targetRow,
                toCol: col,
                progress: 0,
                isMerging: true,
              });
            }

            newGrid[targetRow][col] = mergedValue;
            targetRow++;
            i += 2;
          } else {
            if (tiles[i].row !== targetRow) {
              animations.push({
                value: tiles[i].value,
                fromRow: tiles[i].row,
                fromCol: col,
                toRow: targetRow,
                toCol: col,
                progress: 0,
                isMerging: false,
              });
              moved = true;
            }
            newGrid[targetRow][col] = tiles[i].value;
            targetRow++;
            i++;
          }
        }
      }
    } else if (direction === 'down') {
      for (let col = 0; col < GRID_SIZE; col++) {
        const tiles: { value: number; row: number }[] = [];
        for (let row = GRID_SIZE - 1; row >= 0; row--) {
          if (grid[row][col] !== 0) {
            tiles.push({ value: grid[row][col], row });
          }
        }

        let targetRow = GRID_SIZE - 1;
        let i = 0;
        while (i < tiles.length) {
          if (i < tiles.length - 1 && tiles[i].value === tiles[i + 1].value) {
            const mergedValue = tiles[i].value * 2;
            newScore += mergedValue;
            if (mergedValue === 2048 && !gameWonRef.current) {
              gameWonRef.current = true;
              setGameWon(true);
            }

            animations.push({
              value: mergedValue,
              fromRow: tiles[i].row,
              fromCol: col,
              toRow: targetRow,
              toCol: col,
              progress: 0,
              isMerging: false,
            });

            if (tiles[i + 1].row !== tiles[i].row) {
              animations.push({
                value: tiles[i].value,
                fromRow: tiles[i + 1].row,
                fromCol: col,
                toRow: targetRow,
                toCol: col,
                progress: 0,
                isMerging: true,
              });
            }

            newGrid[targetRow][col] = mergedValue;
            targetRow--;
            i += 2;
          } else {
            if (tiles[i].row !== targetRow) {
              animations.push({
                value: tiles[i].value,
                fromRow: tiles[i].row,
                fromCol: col,
                toRow: targetRow,
                toCol: col,
                progress: 0,
                isMerging: false,
              });
              moved = true;
            }
            newGrid[targetRow][col] = tiles[i].value;
            targetRow--;
            i++;
          }
        }
      }
    }

    // Check if any tile moved
    if (!moved) {
      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          if (grid[row][col] !== newGrid[row][col]) {
            moved = true;
            break;
          }
        }
        if (moved) break;
      }
    }

    return { newGrid, animations, moved, newScore };
  };

  // Move tiles in a direction (triggers animation)
  const move = (direction: Direction): boolean => {
    if (isAnimatingRef.current) return false;

    // Save the old grid state BEFORE calculating the move
    const oldGrid = gridRef.current.map(row => [...row]);
    
    const { newGrid, animations, moved, newScore } = calculateMove(direction);
    
    if (moved) {
      // Start animation
      isAnimatingRef.current = true;
      animatingTilesRef.current = animations;
      animationStartTimeRef.current = performance.now();
      oldGridRef.current = oldGrid; // Store old grid for rendering during animation
      
      // Update grid to new state (but we'll use oldGridRef for static tiles during animation)
      gridRef.current = newGrid;
      scoreRef.current = newScore;
      setScore(newScore);

      // After animation completes, add new tile and clear old grid
      setTimeout(() => {
        addRandomTile();
        isAnimatingRef.current = false;
        animatingTilesRef.current = [];
        oldGridRef.current = null;
      }, ANIMATION_DURATION);
    }

    return moved;
  };

  // Check if game is over
  const isGameOver = (): boolean => {
    // Check for empty cells
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (gridRef.current[row][col] === 0) {
          return false;
        }
      }
    }
    // Check for possible merges
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const current = gridRef.current[row][col];
        if (
          (row < GRID_SIZE - 1 && gridRef.current[row + 1][col] === current) ||
          (col < GRID_SIZE - 1 && gridRef.current[row][col + 1] === current)
        ) {
          return false;
        }
      }
    }
    return true;
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const now = Date.now();
      if (now - lastMoveRef.current < 100) return; // Throttle moves
      
      let direction: Direction | null = null;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') direction = 'up';
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') direction = 'down';
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') direction = 'left';
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') direction = 'right';

      if (direction) {
        e.preventDefault();
        lastMoveRef.current = now;
        const moved = move(direction);
        if (!moved && isGameOver()) {
          setShowResult(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initialize game on mount
  useEffect(() => {
    initGame();
  }, []);

  // Render game with animations
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const draw = (currentTime: number) => {
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      
      // Draw background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Draw grid cells
      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          const x = col * CELL_SIZE + (col + 1) * PADDING;
          const y = row * CELL_SIZE + (row + 1) * PADDING;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
        }
      }

      // Update animation progress
      if (isAnimatingRef.current && animatingTilesRef.current.length > 0) {
        const elapsed = currentTime - animationStartTimeRef.current;
        const progress = Math.min(1, elapsed / ANIMATION_DURATION);
        
        animatingTilesRef.current.forEach(tile => {
          tile.progress = progress;
        });

        if (progress >= 1) {
          isAnimatingRef.current = false;
        }
      }

      // Draw animating tiles
      const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text') || '#fff';
      const linkColor = getComputedStyle(document.documentElement).getPropertyValue('--link') || '#22d3ee';
      
      // Track which cells are animating (from and to positions)
      const animatingFromCells = new Set<string>();
      const animatingToCells = new Set<string>();
      animatingTilesRef.current.forEach(tile => {
        animatingFromCells.add(`${tile.fromRow},${tile.fromCol}`);
        if (!tile.isMerging) {
          animatingToCells.add(`${tile.toRow},${tile.toCol}`);
        }
      });

      // Draw non-merging animating tiles
      animatingTilesRef.current.forEach(tile => {
        if (!tile.isMerging) {
          // Ease function for smooth animation
          const easeProgress = tile.progress < 0.5 
            ? 2 * tile.progress * tile.progress 
            : 1 - Math.pow(-2 * tile.progress + 2, 2) / 2;

          const fromX = tile.fromCol * CELL_SIZE + (tile.fromCol + 1) * PADDING;
          const fromY = tile.fromRow * CELL_SIZE + (tile.fromRow + 1) * PADDING;
          const toX = tile.toCol * CELL_SIZE + (tile.toCol + 1) * PADDING;
          const toY = tile.toRow * CELL_SIZE + (tile.toRow + 1) * PADDING;

          const x = fromX + (toX - fromX) * easeProgress;
          const y = fromY + (toY - fromY) * easeProgress;

          // Draw tile background
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);

          // Draw number
          ctx.font = tile.value >= 1000 ? 'bold 32px sans-serif' : tile.value >= 100 ? 'bold 36px sans-serif' : 'bold 40px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          // Color based on value
          if (tile.value >= 2048) {
            ctx.fillStyle = linkColor;
          } else if (tile.value >= 512) {
            ctx.fillStyle = '#f59e0b';
          } else if (tile.value >= 128) {
            ctx.fillStyle = '#ef4444';
          } else {
            ctx.fillStyle = textColor;
          }
          
          ctx.fillText(tile.value.toString(), x + CELL_SIZE / 2, y + CELL_SIZE / 2);
        }
      });

      // Draw merging tiles (fade out as they merge)
      animatingTilesRef.current.forEach(tile => {
        if (tile.isMerging) {
          const easeProgress = tile.progress < 0.5 
            ? 2 * tile.progress * tile.progress 
            : 1 - Math.pow(-2 * tile.progress + 2, 2) / 2;

          const fromX = tile.fromCol * CELL_SIZE + (tile.fromCol + 1) * PADDING;
          const fromY = tile.fromRow * CELL_SIZE + (tile.fromRow + 1) * PADDING;
          const toX = tile.toCol * CELL_SIZE + (tile.toCol + 1) * PADDING;
          const toY = tile.toRow * CELL_SIZE + (tile.toRow + 1) * PADDING;

          const x = fromX + (toX - fromX) * easeProgress;
          const y = fromY + (toY - fromY) * easeProgress;
          const alpha = 1 - easeProgress; // Fade out

          // Draw tile background with fading
          ctx.fillStyle = `rgba(255, 255, 255, ${0.2 * alpha})`;
          ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);

          // Draw number with fading
          ctx.font = tile.value >= 1000 ? 'bold 32px sans-serif' : tile.value >= 100 ? 'bold 36px sans-serif' : 'bold 40px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          // Color based on value with alpha
          let colorWithAlpha: string;
          if (tile.value >= 2048) {
            // Handle hex color or rgb color
            if (linkColor.startsWith('#')) {
              const r = parseInt(linkColor.slice(1, 3), 16);
              const g = parseInt(linkColor.slice(3, 5), 16);
              const b = parseInt(linkColor.slice(5, 7), 16);
              colorWithAlpha = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            } else {
              colorWithAlpha = linkColor.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
            }
          } else if (tile.value >= 512) {
            colorWithAlpha = `rgba(245, 158, 11, ${alpha})`;
          } else if (tile.value >= 128) {
            colorWithAlpha = `rgba(239, 68, 68, ${alpha})`;
          } else {
            if (textColor.startsWith('#')) {
              const r = parseInt(textColor.slice(1, 3), 16);
              const g = parseInt(textColor.slice(3, 5), 16);
              const b = parseInt(textColor.slice(5, 7), 16);
              colorWithAlpha = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            } else {
              colorWithAlpha = textColor.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
            }
          }
          ctx.fillStyle = colorWithAlpha;
          
          ctx.fillText(tile.value.toString(), x + CELL_SIZE / 2, y + CELL_SIZE / 2);
        }
      });

      // Draw static tiles (not animating)
      // During animation, use old grid state. After animation, use current grid.
      const gridToUse = (isAnimatingRef.current && oldGridRef.current) ? oldGridRef.current : gridRef.current;
      
      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          const cellKey = `${row},${col}`;
          // Skip cells that are animating from or to this position
          if (animatingFromCells.has(cellKey) || animatingToCells.has(cellKey)) {
            continue;
          }
          
          const value = gridToUse[row][col];
          if (value > 0) {
            const x = col * CELL_SIZE + (col + 1) * PADDING;
            const y = row * CELL_SIZE + (row + 1) * PADDING;

            // Draw tile background
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);

            // Draw number
            ctx.font = value >= 1000 ? 'bold 32px sans-serif' : value >= 100 ? 'bold 36px sans-serif' : 'bold 40px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Color based on value
            if (value >= 2048) {
              ctx.fillStyle = linkColor;
            } else if (value >= 512) {
              ctx.fillStyle = '#f59e0b';
            } else if (value >= 128) {
              ctx.fillStyle = '#ef4444';
            } else {
              ctx.fillStyle = textColor;
            }
            
            ctx.fillText(value.toString(), x + CELL_SIZE / 2, y + CELL_SIZE / 2);
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, []);

  const result = gameWon ? 'win' : 'loss';

  return (
    <div className="mx-auto relative">
      {showResult && (
        <GameResult
          result={result}
          playerScore={score}
          opponentScore={0}
          onClose={() => { setShowResult(false); initGame(); }}
        />
      )}
      <div className="mb-2 text-sm text-[color:var(--muted-foreground)]">
        2048 — Use Arrow Keys or WASD to move tiles
      </div>
      <div className="mb-2 text-sm text-[color:var(--muted-foreground)]">
        Score: {score} {gameWon && '— You reached 2048!'}
      </div>
      <canvas 
        ref={canvasRef} 
        width={CANVAS_SIZE} 
        height={CANVAS_SIZE} 
        className="rounded border border-[color:var(--glass-border)]" 
      />
    </div>
  );
}

