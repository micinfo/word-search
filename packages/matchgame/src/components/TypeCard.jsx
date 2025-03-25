import React from 'react';
import { useDrop } from 'react-dnd';

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

export default TypeCard;