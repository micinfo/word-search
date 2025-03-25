import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "../styles/MatchingGame.css";

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
  const [matches, setMatches] = useState([]);
  const [showCongrats, setShowCongrats] = useState(false);

  const products = [
    { id: 1, name: "Carsitol", image: "/images/carsitol.jpg" },
    { id: 2, name: "Eveprim", image: "/images/eveprim.jpg" },
    { id: 3, name: "Natal Plus", image: "/images/natalplus.jpg" },
    { id: 4, name: "Lacta Flow", image: "/images/lactaflow.jpg" },
    { id: 5, name: "Treviron", image: "/images/treviron.jpg" },
  ].sort(() => Math.random() - 0.5); // Randomize products order

  const types = [
    {
      id: 1,
      name: "You got it all with the doctor-prescribed inositol for PCOS",
    },
    {
      id: 2,
      name: "Everything is on Priming from the first and only clinically-proven Prom Rose Oil",
    },
    { id: 3, name: "The Pre and Post Natal Vitamins with the plus Benefits" },
    { id: 4, name: "No more lack of flow fro Breastfeeding Moms" },
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
    <DndProvider backend={HTML5Backend}>
      <div className="matching-game">
        <h1>CONNECT THE PRODUCT</h1>
        <h2>Match Bawat Pinay products with its corresponding types!</h2>

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
              <button onClick={() => window.location.reload()}>Play Again</button>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default MatchingGame;
