import React, { useState } from 'react';
import './App.css';
import WordGrid from './components/WordGrid';
import WordList from './components/WordList';

const App: React.FC = () => {
  const words = [
    'LEVOPRONT',
    'FOREFRONT',
    'EFFECTIVERELIEF',
    'COUGH',
    'LICORICEFLAVOR'
  ];

  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [foundPatterns, setFoundPatterns] = useState<{[key: string]: string}>({});
  const [score, setScore] = useState<number>(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleWordFound = (word: string) => {
    if (!foundWords.includes(word)) {
      const newFoundWords = [...foundWords, word];
      setFoundWords(newFoundWords);
      setFoundPatterns(prev => ({ ...prev, [word]: "Found!" }));
      setScore(prevScore => prevScore + (word.length * 10));
      
      // Show celebration message
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 1500);
    
      // Check if all words are found
      if (newFoundWords.length === words.length) {
        setTimeout(() => {
          alert(`Congratulations! You've found all words!\nFinal Score: ${score + (word.length * 10)}`);
        }, 1600);
      }
    }
  };

  return (
    <div className="App">
      {showCelebration && (
        <div className="celebration-message">
          <h2>Word Found!</h2>
          <div className="remaining-words">
            {words.length - foundWords.length} words remaining
          </div>
        </div>
      )}
      <header>
        <h1 className="product-name">LEVODROPROPIZINE</h1>
        <h2 className="brand-name">LEVOPRONT®</h2>
        <h2 className="title">LEVOPRONT® ADVANTAGE WORD SEARCH</h2>
        <p className="subtitle">Search one word that defines the advantage of Levopront® over other cough suppressants</p>
      </header>
      
      <div className="game-stats">
        <div className="score-display">
          Score: {score}
        </div>
        <div className="progress">
          Found: {foundWords.length}/{words.length}
        </div>
      </div>

      <div className="game-container">
        <WordGrid words={words} onWordFound={handleWordFound} />
        <div className="word-list">
          <h3>Words to Find:</h3>
          <ul>
            {words.map((word, index) => (
              <li key={word} className={foundWords.includes(word) ? 'found' : ''}>
                {word === 'EFFECTIVERELIEF' ? (
                  <div className="word-wrap">
                    <span>EFFECTIVE</span>
                    <span>RELIEF</span>
                    {foundPatterns[word] && <div className="pattern">{foundPatterns[word]}</div>}
                  </div>
                ) : word === 'LICORICEFLAVOR' ? (
                  <div className="word-wrap">
                    <span>LICORICE</span>
                    <span>FLAVOR</span>
                    {foundPatterns[word] && <div className="pattern">{foundPatterns[word]}</div>}
                  </div>
                ) : (
                  <>
                    {word.split('').join(' ')}
                    {foundPatterns[word] && <div className="pattern">{foundPatterns[word]}</div>}
                  </>
                )}
                <span className="points">({word.length * 10} pts)</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="footer">
        <h3>At the <span className="highlight">FOREFRONT</span> of Effective Relief<br />of Non-Productive Cough</h3>
      </footer>
    </div>
  );
};

export default App;