import React from 'react';
import { useDrag } from 'react-dnd';

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

export default ProductCard;