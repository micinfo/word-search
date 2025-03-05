import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Position {
  row: number;
  col: number;
}

interface Cell {
  letter: string;
  selected: boolean;
  isPartOfHint: boolean;
  wordIndex: number | undefined; // Updated type to allow both number and undefined
}

interface WordGridProps {
  words: string[];
  onWordFound: (word: string) => void;
  hintedWord?: string;
}

// Increase grid size to accommodate longer words
interface Timer {
  minutes: number;
  seconds: number;
}

// Add new state variables in the component
const WordGrid: React.FC<WordGridProps> = ({
  words,
  onWordFound,
  hintedWord,
}) => {
  const gridSize = 15;
  const [grid, setGrid] = useState<Cell[][]>(createEmptyGrid());
  const [selection, setSelection] = useState<Position[]>([]);
  const [foundPositions, setFoundPositions] = useState<Position[][]>([]);
  const [placedWords, setPlacedWords] = useState<string[]>([]);
  // Add state to preserve the initial grid
  const [initializedGrid, setInitializedGrid] = useState<Cell[][]>([]);

  function createEmptyGrid(): Cell[][] {
    return Array(gridSize)
      .fill(null)
      .map(() =>
        Array(gridSize)
          .fill(null)
          .map(() => ({
            letter: "",
            selected: false,
            isPartOfHint: false,
            wordIndex: undefined,
          }))
      );
  }

  const directions = [
    [1, 0],
    [0, 1],
    [1, 1],
    [-1, 1],
    [-1, 0],
    [0, -1],
    [-1, -1],
    [1, -1],
  ];

  // Update useEffect for grid initialization
  useEffect(() => {
    const createGrid = () => {
      let attempts = 0;
      const maxAttempts = 1000;

      while (attempts < maxAttempts) {
        const newGrid = createEmptyGrid();
        const placedWords: string[] = [];

        // Process and shuffle words
        const processedWords = [...words]
          .map((word) => ({
            original: word,
            processed: word.replace(/[^A-Za-z]/g, "").toUpperCase(),
          }))
          .sort(() => Math.random() - 0.5)
          .sort((a, b) => b.processed.length - a.processed.length);

        let allWordsPlaced = true;

        // Try to place each word
        for (
          let wordIndex = 0;
          wordIndex < processedWords.length;
          wordIndex++
        ) {
          const { processed: word, original } = processedWords[wordIndex];
          let isPlaced = false;

          // Shuffle directions for each word
          const shuffledDirections = [...directions].sort(
            () => Math.random() - 0.5
          );

          // Try each direction
          for (const [dx, dy] of shuffledDirections) {
            if (isPlaced) break;

            // Calculate valid range for this word
            const maxX =
              dx === 0 ? gridSize : dx > 0 ? gridSize - word.length : gridSize;
            const maxY =
              dy === 0 ? gridSize : dy > 0 ? gridSize - word.length : gridSize;
            const minX = dx < 0 ? word.length - 1 : 0;
            const minY = dy < 0 ? word.length - 1 : 0;

            // Try each position
            for (let y = minY; y < maxY && !isPlaced; y++) {
              for (let x = minX; x < maxX && !isPlaced; x++) {
                let canPlace = true;
                const positions: [number, number][] = [];

                // Check if word fits
                for (let i = 0; i < word.length && canPlace; i++) {
                  const newX = x + dx * i;
                  const newY = y + dy * i;

                  if (
                    newX < 0 ||
                    newX >= gridSize ||
                    newY < 0 ||
                    newY >= gridSize
                  ) {
                    canPlace = false;
                    break;
                  }

                  const currentCell = newGrid[newY][newX];
                  if (currentCell.letter && currentCell.letter !== word[i]) {
                    canPlace = false;
                    break;
                  }

                  positions.push([newX, newY]);
                }

                if (canPlace && positions.length === word.length) {
                  positions.forEach(([posX, posY], i) => {
                    newGrid[posY][posX] = {
                      letter: word[i],
                      selected: false,
                      isPartOfHint: false,
                      wordIndex: wordIndex,
                    };
                  });
                  isPlaced = true;
                  placedWords.push(original);
                }
              }
            }
          }

          if (!isPlaced) {
            allWordsPlaced = false;
            break;
          }
        }

        if (allWordsPlaced) {
          // Fill remaining cells
          for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
              if (!newGrid[y][x].letter) {
                newGrid[y][x].letter = String.fromCharCode(
                  65 + Math.floor(Math.random() * 26)
                );
              }
            }
          }
          setPlacedWords(placedWords);
          // Store the initial grid state
          setInitializedGrid(JSON.parse(JSON.stringify(newGrid)));
          return newGrid;
        }

        attempts++;
      }

      return createEmptyGrid();
    };

    const newGrid = createGrid();
    setGrid(newGrid);
  }, [words]);

  // Add this new useEffect to handle found words
  useEffect(() => {
    if (initializedGrid.length > 0) {
      const updatedGrid = JSON.parse(JSON.stringify(initializedGrid));
      foundPositions.forEach((positions) => {
        positions.forEach((pos) => {
          if (updatedGrid[pos.row] && updatedGrid[pos.row][pos.col]) {
            updatedGrid[pos.row][pos.col].found = true;
            updatedGrid[pos.row][pos.col].selected = true;
          }
        });
      });
      setGrid(updatedGrid);
    }
  }, [foundPositions, initializedGrid]);

  // Add state for celebration
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFinalCelebration, setShowFinalCelebration] = useState(false);

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    const isAlreadySelected = selection.some(
      (pos) => pos.row === rowIndex && pos.col === colIndex
    );

    if (isAlreadySelected) {
      setSelection([]);
      return;
    }

    const newSelection = [...selection, { row: rowIndex, col: colIndex }];
    setSelection(newSelection);

    const selectedWord = newSelection
      .map((pos) => grid[pos.row][pos.col].letter)
      .join("");

    const foundWord = words.find(
      (word) => word.replace(/[^A-Za-z]/g, "").toUpperCase() === selectedWord
    );

    if (foundWord) {
      toast.success(`Congratulations! You found "${foundWord}"!`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      onWordFound(foundWord);
      setFoundPositions((prev) => [...prev, newSelection]);
      setSelection([]);

      // Check if all words are found
      if (foundPositions.length + 1 === words.length) {
        setShowFinalCelebration(true);
        setTimeout(() => setShowFinalCelebration(false), 5000);
      }
    }
  };

  return (
    <div className="word-grid">
      <ToastContainer />
      {showFinalCelebration && (
        <div className="final-celebration-overlay">
          <div className="final-celebration-content">
            <h2>🎉 Congratulations! 🎉</h2>
            <p>You've found all the words!</p>
            <div className="final-score">Final Score: {words.length * 100}</div>
            <button onClick={() => setShowFinalCelebration(false)}>Close</button>
          </div>
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
              }}
            />
          ))}
        </div>
      )}
      {showCelebration && (
        <div className="celebration-overlay">
          <div className="celebration-text">
            Congratulations!
            <br />
            You found all words!
          </div>
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}
      <div className="grid-container">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`grid-cell ${
                  selection.some(
                    (pos) => pos.row === rowIndex && pos.col === colIndex
                  )
                    ? "selected"
                    : ""
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
