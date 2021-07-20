import React, { useState, useEffect, useRef, forwardRef } from "react";

const Card = forwardRef(({ flashcard }, ref) => {
  const [flip, setflip] = useState(false);
  const [height, setheight] = useState("initial");

  const frontEl = useRef();
  const backEl = useRef();

  const setMaxHeight = () => {
    const frontHeight = frontEl.current.getBoundingClientRect().height;
    const backHeight = backEl.current.getBoundingClientRect().height;

    setheight(Math.max(frontHeight, backHeight, 100));
  };

  useEffect(setMaxHeight, [
    flashcard.question,
    flashcard.answer,
    flashcard.options,
  ]);

  useEffect(() => {
    window.addEventListener("resize", setMaxHeight);
    return () => window.removeEventListener("resize", setMaxHeight);
  }, []);

  return (
    <div
      className={`card ${flip ? "flip" : ""}`}
      style={{ height: height }}
      ref={ref}
      onClick={() => {
        setflip(!flip);
      }}>
      <div className="front" ref={frontEl}>
        {flashcard.question}
        <div className="options">
          {flashcard.options.map((option) => {
            return (
              <div className="option" key={option}>
                {option}
              </div>
            );
          })}
        </div>
      </div>
      <div className="back" ref={backEl}>
        <p> {flashcard.answer}</p>
      </div>
    </div>
  );
});

export default Card;
