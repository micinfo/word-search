import React, { useState } from 'react';
import './App.css';
import WordGrid from './components/WordGrid';
import WordList from './components/WordList';

function App() {
  const [score, setScore] = useState<number>(0);
  const [words] = useState<string[]>([
    'REACT',
    'JAVASCRIPT',
    'HTML',
    'CSS',
    'NODE'
  ]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [hintsLeft, setHintsLeft] = useState<number>(4);
  const [hintedWord, setHintedWord] = useState<string>('');

  const handleWordFound = (word: string): void => {
    if (!foundWords.includes(word)) {
      setFoundWords([...foundWords, word]);
      setScore(score + (word.length * 10));
      if (word === hintedWord) {
        setHintedWord(''); // Clear the hint when the word is found
      }
    }
  };

  const getHint = () => {
    if (hintsLeft > 0) {
      const remainingWords = words.filter(word => !foundWords.includes(word));
      if (remainingWords.length > 0) {
        const randomWord = remainingWords[Math.floor(Math.random() * remainingWords.length)];
        setHintedWord(randomWord);
        setHintsLeft(hintsLeft - 1);
      }
    }
  };

  return (
    <div className="App">
      <h1>Word Search Game</h1>
      <div className="game-stats">
        <h2>Score: {score}</h2>
        <h3>Found Words: {foundWords.length}/{words.length}</h3>
        <div className="hint-section">
          <button 
            onClick={getHint} 
            disabled={hintsLeft === 0}
            className="hint-button"
          >
            Get Hint ({hintsLeft} left)
          </button>
        </div>
      </div>
      <div className="game-container">
        <WordGrid 
          words={words} 
          onWordFound={handleWordFound} 
          hintedWord={hintedWord}
        />
        <WordList words={words} foundWords={foundWords} />
      </div>
    </div>
  );
}

export default App;