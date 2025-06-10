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
    // { name: "Carsitol", content: "/images/carsitol.jpg" },
    // { name: "Eveprim", content: "/images/eveprim.jpg" },
    // { name: "Natal Plus", content: "/images/natalplus.jpg" },
    // { name: "Lacta Flow", content: "/images/lactaflow.jpg" },
    // { name: "Treviron", content: "/images/treviron.png" },
    { name: "Adrylex", content: "/images/logos/Adrylex.png" },
    { name: "Amzef", content: "/images/logos/Amzef.png" },
    { name: "Carsitol_logo", content: "/images/logos/Carsitol_logo.png" },
    { name: "Ceraklin_logo", content: "/images/logos/Ceraklin_logo.png" },
    { name: "Cerkalin", content: "/images/logos/Cerkalin.png" },
    { name: "Cipromet", content: "/images/logos/Cipromet.png" },
    { name: "Cortizan2", content: "/images/logos/Cortizan2.png" },
    { name: "Cozin1mg", content: "/images/logos/Cozin1mg.png" },
    { name: "Cozin3mg", content: "/images/logos/Cozin3mg.png" },
    { name: "DefunginLogo", content: "/images/logos/DefunginLogo.png" },
    { name: "ErasulLogo", content: "/images/logos/ErasulLogo.png" },
    { name: "Everprimlogo", content: "/images/logos/Everprimlogo.png" },
    { name: "FertyLogo", content: "/images/logos/FertylLogo.png" },
    { name: "FurifolLogo", content: "/images/logos/FurifolLogo.png" },
    { name: "KcabLogo", content: "/images/logos/KcabLogo.png" },
    { name: "LactaflowLogo", content: "/images/logos/LactaflowLogo.png" },
    { name: "Levoprontlogo", content: "/images/logos/Levoprontlogo.png" },
    { name: "Nadixa", content: "/images/logos/Nadixa.png" },
    { name: "NatalPlusLogo", content: "/images/logos/NatalPlusLogo.png" },
    { name: "NovasLogo", content: "/images/logos/NovasLogo.png" },
    { name: "SuganonLogo", content: "/images/logos/SuganonLogo.png" },
    { name: "TeranexLogo", content: "/images/logos/TeranexLogo.png" },
    { name: "TrevIronFABlogo", content: "/images/logos/TrevIronFABlogo.png" },
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
    // Only prevent clicking if:
    // 1. Two cards are currently flipped
    // 2. This specific card is already matched
    // 3. This specific card is already flipped
    if (
      flippedCards.length === 2 ||
      cards.find((card) => card.id === id)?.isMatched ||
      flippedCards.includes(id)
    ) {
      console.log("Preventing click", flippedCards.length); // Add this line for debugging purpose
      return;
    }

    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);
    setMoves((prev) => prev + 1);

    if (flippedCards.length === 1) {
      const firstCard = cards.find((card) => card.id === flippedCards[0]);
      const secondCard = cards.find((card) => card.id === id);

      if (firstCard?.name === secondCard?.name) {
        // Update matched cards
        const updatedCards = cards.map((card) =>
          card.id === firstCard?.id || card.id === secondCard?.id
            ? { ...card, isMatched: true }
            : card
        );
        setCards(updatedCards);
        // Clear flipped cards after a short delay
        setTimeout(() => {
          setFlippedCards([]);
        }, 300);
      } else {
        // For non-matching cards, flip them back after delay
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
        <h1>MPPI Memory Game</h1>
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
                <img src={card.content} alt={card.name} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemoryGame;
