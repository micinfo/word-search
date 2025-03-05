import React, { useState } from "react";
import "./App.css";
import { WordGrid, WordList, GameConfig } from "@word-search/shared";
// @ts-ignore
import logo from './assets/kcab-logo.png';

const gameConfig: GameConfig = {
  productName: "K-CAB®",
  brandName: "K-CAB®",
  title: "K-CAB® ADVANTAGE WORD SEARCH",
  subtitle: "Search one word that defines the advantage of KCAB® over other PPIs",
  words: [
    "FASTACTING",
    "SUSTAINED",
    "EFFECTS",
    "KCAB"
  ],
  theme: {
    primary: '#6BA5B8',
    secondary: '#FFFFFF',
    accent: '#1B365D'
  }
};

const App: React.FC = () => {
  const { words, productName, brandName, title, subtitle, theme } = gameConfig;

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
      <header>
        <img src={logo} alt="K-CAB 30 Minutes" className="header-logo" />
        <h1 className="product-name">{title}</h1>
        <p className="subtitle">{subtitle}</p>
      </header>

      <div className="game-stats">
        <div className="score-display">Score: {score}</div>
        <div className="progress">Found: {foundWords.length}/4</div>
      </div>

      <div className="game-container">
        <WordGrid words={words} onWordFound={handleWordFound} />
        <div className="word-list">
          <h3>Words to Find:</h3>
          <ul>
            {words.map((word) => (
              <li key={word} className={foundWords.includes(word) ? "found" : ""}>
                {word}
                <span className="points">{`(${word.length * 10} pts)`}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="footer">
        <h3>
          The <span className="highlight">K</span>ey to a Better{" "}
          <span className="highlight">C</span>hoice of{" "}
          <span className="highlight">A</span>cid{" "}
          <span className="highlight">B</span>locker
        </h3>
      </footer>
    </div>
  );
};

export default App;
