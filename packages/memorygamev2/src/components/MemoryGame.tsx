import React, { useState, useEffect, useRef } from "react";

interface Card {
  id: number;
  content: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [currentGame, setCurrentGame] = useState(1);
  const [showNextGamePrompt, setShowNextGamePrompt] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const level2Cards = [
    { name: "Cozin1mg", content: "/images/logos/Cozin1mg.png" },
    { name: "Cerkalin", content: "/images/logos/Cerkalin.png" },
    { name: "NovasLogo", content: "/images/logos/NovasLogo.png" },
    { name: "DefunginLogo", content: "/images/logos/DefunginLogo.png" },
    { name: "Cortizan2", content: "/images/logos/Cortizan2.png" },
  ];

  useEffect(() => {
    bgMusicRef.current = new Audio("/sounds/background-music.wav");
    if (bgMusicRef.current) {
      bgMusicRef.current.loop = true;
    }
    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current.currentTime = 0;
      }
    };
  }, []);

  const toggleSound = () => {
    if (!bgMusicRef.current) return;

    if (isSoundEnabled) {
      bgMusicRef.current.pause();
      bgMusicRef.current.currentTime = 0;
    } else {
      bgMusicRef.current.play().catch(() => {
        // Handle any autoplay errors silently
      });
    }
    setIsSoundEnabled(!isSoundEnabled);
  };

  const playSound = (soundFile: string) => {
    if (!isSoundEnabled) return;

    try {
      const audio = new Audio(soundFile);
      audio.play().catch(() => {
        // Handle any play errors silently
      });
    } catch (error) {
      // Handle any audio creation errors silently
    }
  };

  const initializeGame = () => {
    // const currentCards = currentGame === 1 ? level1Cards : level2Cards;
    const currentCards = level2Cards;
    const duplicatedCards = [...currentCards, ...currentCards]
      .map((content, index) => ({
        id: index,
        name: content.name,
        content: content.content,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5);
    setCards(duplicatedCards);
    setFlippedCards([]);
    setMoves(0);
    setShowNextGamePrompt(false);
  };

  const handleNextGame = () => {
    setCurrentGame(2);
    setShowNextGamePrompt(false);
  };

  const checkGameComplete = () => {
    const allMatched = cards.every((card) => card.isMatched);
    if (allMatched) {
      if (currentGame === 1) {
        setTimeout(() => {
          setShowNextGamePrompt(true);
        }, 500);
      } else {
        setTimeout(() => {
          alert("Congratulations! You've completed all games!");
          setCurrentGame(1);
        }, 500);
      }
    }
  };

  const handleCardClick = (id: number) => {
    if (
      flippedCards.length === 2 ||
      cards.find((card) => card.id === id)?.isMatched ||
      flippedCards.includes(id)
    ) {
      return;
    }
    playSound("/sounds/card-flip.wav");
    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);
    setMoves((prev) => prev + 1);

    if (flippedCards.length === 1) {
      const firstCard = cards.find((card) => card.id === flippedCards[0]);
      const secondCard = cards.find((card) => card.id === id);

      if (firstCard?.name === secondCard?.name) {
        const updatedCards = cards.map((card) =>
          card.id === firstCard?.id || card.id === secondCard?.id
            ? { ...card, isMatched: true }
            : card
        );
        // Update cards first
        setCards(updatedCards);
        // Then check if all cards are matched
        const allMatched = updatedCards.every((card) => card.isMatched);
        if (allMatched) {
          if (currentGame === 1) {
            setTimeout(() => {
              setShowNextGamePrompt(true);
            }, 500);
          } else {
            setTimeout(() => {
              alert("Congratulations! You've completed all games!");
              setCurrentGame(1);
            }, 500);
          }
        }
        // Clear flipped cards
        setTimeout(() => {
          setFlippedCards([]);
        }, 300);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="memory-game">
      <div className="game-header">
        <img
          src="/images/matchgamelogo.jpg"
          alt="Memory Game Logo"
          className="game-logo"
        />
        <h1>
          MATCH PAIRS of identical brand logos by remembering their positions.
        </h1>
        <h2>
          The Player with the most matched pairs at the required number moves
          wins.
        </h2>
        <p>Moves: {moves}</p>
        <button onClick={toggleSound} className="sound-button">
          {isSoundEnabled ? "Sound: On 🔊" : "Sound: Off 🔇"}
        </button>
        <button onClick={initializeGame}>New Game</button>
      </div>
      {showNextGamePrompt ? (
        <div
          className="next-game-prompt"
          style={{
            textAlign: "center",
            margin: "20px",
            padding: "20px",
            backgroundColor: "#f0f0f0",
            borderRadius: "8px",
          }}
        >
          <h2>Congratulations! You've completed Game!</h2>
          {/* <p>Are you ready for Game 2?</p> */}
          {/* <button onClick={handleNextGame} style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>Start Game 2</button> */}
        </div>
      ) : (
        <div className="game-grid">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`card ${
                card.isMatched || flippedCards.includes(card.id)
                  ? "flipped"
                  : ""
              } ${card.isMatched ? "matched" : ""}`}
              onClick={() => handleCardClick(card.id)}
            >
              <div className="card-inner">
                <div className="card-front" />
                <div className="card-back">
                  <img src={card.content} alt={card.name} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemoryGame;
