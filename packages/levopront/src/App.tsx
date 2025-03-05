import React, { useState } from "react";
import "./App.css";
import WordGrid from "./components/WordGrid";
import WordList from "./components/WordList";

const App: React.FC = () => {
  const words = [
    "LEVOPRONT",
    "FOREFRONT",
    "EFFECTIVERELIEF",
    "COUGH",
    "LICORICEFLAVOR",
  ];

  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [foundPatterns, setFoundPatterns] = useState<{ [key: string]: string }>(
    {}
  );
  const [score, setScore] = useState<number>(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showWordFound, setShowWordFound] = useState(false);
  const [foundWord, setFoundWord] = useState("");

  const handleWordFound = (word: string) => {
    if (!foundWords.includes(word)) {
      const newFoundWords = [...foundWords, word];
      setFoundWords(newFoundWords);
      setFoundPatterns((prev) => ({ ...prev, [word]: "Found!" }));
      setScore((prevScore) => prevScore + word.length * 10);

      // Check if all words are found
      if (newFoundWords.length === words.length) {
        setTimeout(() => {
          setShowCelebration(true);
        }, 500);
      }
    }
  };

  return (
    <div className="App">
      {showCelebration && (
        <div className="celebration-overlay">
          <div className="celebration-message">
            <h2>Congratulations!</h2>
            <p>You've found all words!</p>
            <p>Final Score: {score}</p>
            <button
              className="celebration-button"
              onClick={() => setShowCelebration(false)}
            >
              Continue
            </button>
          </div>
        </div>
      )}
      <header>
        <h1 className="product-name">
          <span className="product-name-span">LEVODROPROPIZINE</span>
        </h1>
        <h2 className="brand-name">LEVOPRONT®</h2>
        <h2 className="title">LEVOPRONT® ADVANTAGE WORD SEARCH</h2>
        <p className="subtitle">
          Search one word that defines the advantage of Levopront® over other
          cough suppressants
        </p>
      </header>

      <div className="game-stats">
        <div className="score-display">Score: {score}</div>
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
              <li
                key={word}
                className={foundWords.includes(word) ? "found" : ""}
              >
                {word === "EFFECTIVERELIEF" ? (
                  <div className="word-wrap">
                    <span>EFFECTIVE</span>
                    <span>RELIEF</span>
                    {foundPatterns[word] && (
                      <div className="pattern">{foundPatterns[word]}</div>
                    )}
                  </div>
                ) : word === "LICORICEFLAVOR" ? (
                  <div className="word-wrap">
                    <span>LICORICE</span>
                    <span>FLAVOR</span>
                    {foundPatterns[word] && (
                      <div className="pattern">{foundPatterns[word]}</div>
                    )}
                  </div>
                ) : (
                  <>
                    {word.split("").join(" ")}
                    {foundPatterns[word] && (
                      <div className="pattern">{foundPatterns[word]}</div>
                    )}
                  </>
                )}
                <span className="points">({word.length * 10} pts)</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="footer">
        <h3>
          At the <span className="highlight">FOREFRONT</span> of Effective
          Relief
          <br />
          of Non-Productive Cough
        </h3>
      </footer>
    </div>
  );
};

export default App;
