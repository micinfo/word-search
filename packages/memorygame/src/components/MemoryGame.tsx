import React, { useState, useEffect } from "react";

interface Card {
  id: number;
  content: string;
  name: string; // Add this line to include the name property in the Card data type
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const cardContents = [
    { name: "Carsitol", content: "/images/carsitol.jpg" },
    { name: "Eveprim", content: "/images/eveprim.jpg" },
    { name: "Natal Plus", content: "/images/natalplus.jpg" },
    { name: "Lacta Flow", content: "/images/lactaflow.jpg" },
    { name: "Treviron", content: "/images/treviron.png" },
  ];

  useEffect(() => {
    initializeGame();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const initializeGame = () => {
    const duplicatedCards = [...cardContents, ...cardContents]
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
  };

  const handleCardClick = (id: number) => {
    if (
      flippedCards.length === 2 ||
      cards[id].isMatched ||
      flippedCards.includes(id)
    )
      return;
    console.log("Card clicked:", id);
    const newFlippedCards = [...flippedCards, id];
    console.log("New flipped cards:", newFlippedCards);
    setFlippedCards(newFlippedCards);
    setMoves((prev) => prev + 1);

    if (flippedCards.length === 1) {
      const firstCard = cards.find((card) => card.id === flippedCards[0]);
      const secondCard = cards.find((card) => card.id === id);

      // Debug log to see full card objects
      console.log("Comparing cards:", firstCard, secondCard);

      // Compare only by name since that's our unique identifier
      if (firstCard?.name === secondCard?.name) {
        const updatedCards = cards.map((card) =>
          card.id === firstCard?.id || card.id === secondCard?.id
            ? { ...card, isMatched: true }
            : card
        );
        setCards(updatedCards);
        setFlippedCards([]);
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
        <h1>Sweet Memory Game</h1>
        <p>Moves: {moves}</p>
        <button onClick={initializeGame}>New Game</button>
      </div>
      <div className="game-grid">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`card ${
              card.isMatched || flippedCards.includes(card.id) ? "flipped" : ""
            } ${card.isMatched ? "matched" : ""}`}
            onClick={() => handleCardClick(card.id)}
          >
            <div className="card-inner">
              <div className="card-front" />
              <div className="card-back">
                <img
                  src={card.content}
                  alt={card.name}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemoryGame;
