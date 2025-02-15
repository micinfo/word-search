import React, { useState, useEffect } from 'react';

interface Position {
  row: number;
  col: number;
}

interface Cell {
  letter: string;
  selected: boolean;
  isPartOfHint?: boolean;
}

interface WordGridProps {
  words: string[];
  onWordFound: (word: string) => void;
  hintedWord?: string;
}

const WordGrid: React.FC<WordGridProps> = ({ words, onWordFound, hintedWord }) => {
  const gridSize = 12;

  function createInitialGrid(): Cell[][] {
    return Array(gridSize).fill(null).map(() =>
      Array(gridSize).fill(null).map(() => ({
        letter: '',
        selected: false,
        isPartOfHint: false
      }))
    );
  }

  const [grid, setGrid] = useState<Cell[][]>(createInitialGrid());
  const [selection, setSelection] = useState<Position[]>([]);

  const directions = [
    [1, 0],    // horizontal right
    [0, 1],    // vertical down
    [1, 1],    // diagonal down-right
    [-1, 1],   // diagonal down-left
    [-1, 0],   // horizontal left
    [0, -1],   // vertical up
    [-1, -1],  // diagonal up-left
    [1, -1],   // diagonal up-right
  ];

  useEffect(() => {
    const newGrid = createInitialGrid();
    const sortedWords = [...words].sort((a, b) => b.length - a.length);
  
    sortedWords.forEach(word => {
      let placed = false;
      let attempts = 0;
      
      while (!placed && attempts < 100) {
        const directionIndex = Math.floor(Math.random() * directions.length);
        const [dx, dy] = directions[directionIndex];
        
        // Calculate valid boundaries for word placement
        let startX: number = 0;
        let startY: number = 0;
  
        if (dx > 0) {
          startX = Math.floor(Math.random() * (gridSize - word.length + 1));
        } else if (dx < 0) {
          startX = Math.floor(Math.random() * (gridSize - word.length + 1)) + (word.length - 1);
        } else {
          startX = Math.floor(Math.random() * gridSize);
        }
  
        if (dy > 0) {
          startY = Math.floor(Math.random() * (gridSize - word.length + 1));
        } else if (dy < 0) {
          startY = Math.floor(Math.random() * (gridSize - word.length + 1)) + (word.length - 1);
        } else {
          startY = Math.floor(Math.random() * gridSize);
        }
  
        // Check if word can be placed by verifying each position
        const canPlace = Array.from(word).every((letter, i) => {
          const x = startX + (dx * i);
          const y = startY + (dy * i);
          return x >= 0 && x < gridSize && y >= 0 && y < gridSize && 
                 (!newGrid[y][x].letter || newGrid[y][x].letter === letter.toUpperCase());
        });

        if (canPlace) {
          // Place the word in the grid
          Array.from(word).forEach((letter, i) => {
            const x = startX + (dx * i);
            const y = startY + (dy * i);
            newGrid[y][x].letter = letter.toUpperCase();
          });
          placed = true;
        }
        attempts++;
      }
    });

    // Fill remaining cells with random letters
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        if (!newGrid[y][x].letter) {
          newGrid[y][x].letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }
    
    setGrid(newGrid);
  }, [words]);

  const handleCellClick = (rowIndex: number, colIndex: number): void => {
    const newSelection = [...selection, { row: rowIndex, col: colIndex }];
    setSelection(newSelection);

    const selectedWord = newSelection
      .map(pos => grid[pos.row][pos.col].letter)
      .join('');

    if (words.includes(selectedWord)) {
      onWordFound(selectedWord);
      setSelection([]);
    } else if (newSelection.length >= 10) { // Reset if selection is too long
      setSelection([]);
    }
  };

  return (
    <div className="word-grid">
      <div className="grid-container">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`grid-cell ${
                  selection.some(pos => pos.row === rowIndex && pos.col === colIndex)
                    ? 'selected'
                    : ''
                } ${
                  hintedWord && cell.isPartOfHint ? 'hinted' : ''
                }`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell.letter}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordGrid;