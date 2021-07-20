import React from "react";
import Card from "./Card";

export default function CardList({ flashcard }) {
  return (
    <div className="card-grid">
      {flashcard.map((card) => {
        return <Card flashcard={card} key={card.id} />;
      })}
    </div>
  );
}
