import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import "../styles/MatchingGame.css";
import matchGameLogo from "../images/matchgamelogo.jpg";

const ProductCard = ({ product, isMatched, onMatch }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "product",
    item: { id: product.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !isMatched,
  }));

  return (
    <div
      ref={drag}
      className={`product ${isMatched ? "matched" : ""} ${
        isDragging ? "dragging" : ""
      }`}
    >
      <img src={product.image} alt={product.name} />
    </div>
  );
};

const TypeCard = ({ type, isMatched, onMatch, matchedProduct }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "product",
    drop: (item) => onMatch(item.id, type.id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    canDrop: () => !isMatched,
  });

  return (
    <div
      ref={drop}
      className={`type ${isMatched ? "matched" : ""} ${
        isOver ? "droppable" : ""
      }`}
    >
      {matchedProduct && (
        <img src={matchedProduct.image} alt={matchedProduct.name} />
      )}
      {type.name}
    </div>
  );
};

const MatchingGame = () => {
  const isMobile = /mobile|android|ios/i.test(navigator.userAgent);
  console.log(isMobile);
  // Fix: Use TouchBackend directly without calling it as a function
  const backend = isMobile ? TouchBackend : HTML5Backend;
  const [matches, setMatches] = useState([]);
  const [showCongrats, setShowCongrats] = useState(false);

  const products = [
    { id: 1, name: "Carsitol", image: "/images/carsitol.jpg" },
    { id: 2, name: "Eveprim", image: "/images/eveprim.jpg" },
    { id: 3, name: "Natal Plus", image: "/images/natalplus.jpg" },
    { id: 4, name: "Lacta Flow", image: "/images/lactaflow.jpg" },
    { id: 5, name: "Treviron", image: "/images/treviron.png" },
  ].sort(() => Math.random() - 0.5); // Randomize products order

  const types = [
    {
      id: 1,
      name: "You got it All with the doctor-prescribed inositol for PCOS",
    },
    {
      id: 2,
      name: "Everything is on Priming from the first and only clinically-proven Primrose Oil",
    },
    { id: 3, name: "The Pre and Post Natal Vitamins with the PLUS Benefits" },
    { id: 4, name: "No more lack of flow for Breastfeeding Moms" },
    {
      id: 5,
      name: "Iron Up and Stay Fab with the Triple Combination Supplement for Anemia",
    },
  ].sort(() => Math.random() - 0.5); // Randomize types order

  const getMatchedProduct = (typeId) => {
    return matches.includes(typeId)
      ? products.find((p) => p.id === typeId)
      : null;
  };

  const handleMatch = (productId, typeId) => {
    if (productId === typeId && !matches.includes(productId)) {
      const newMatches = [...matches, productId];
      setMatches(newMatches);

      if (newMatches.length === products.length) {
        setShowCongrats(true);
      }
    }
  };

  return (
    <DndProvider backend={backend}>
      <div className="matching-game">
        <img src={matchGameLogo} alt="Game Logo" className="game-logo" />
        <h1>MATCH THE PRODUCT</h1>
        <h2>
          Metro Pharma Philippines Inc. empowers every woman in every journey of
          womanhood by nourishing them with the right supplements.
          <br />
          <br />
          Match the product with the corresponding benefits and indication.
        </h2>

        <div className="game-container">
          <div className="products-container">
            {products.map(
              (product) =>
                !matches.includes(product.id) && (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isMatched={matches.includes(product.id)}
                    onMatch={handleMatch}
                  />
                )
            )}
          </div>

          <div className="types-container">
            {types.map((type) => (
              <TypeCard
                key={type.id}
                type={type}
                isMatched={matches.includes(type.id)}
                onMatch={handleMatch}
                matchedProduct={getMatchedProduct(type.id)}
              />
            ))}
          </div>
        </div>

        {showCongrats && (
          <div className="congrats-overlay">
            <div className="congrats-modal">
              <h2>Congratulations! 🎉</h2>
              <p>You've successfully matched all the products!</p>
              <button onClick={() => window.location.reload()}>
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default MatchingGame;
