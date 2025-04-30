import React, { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import "./CardStack.css"; 

const CardStack = ({ cards }) => {
  const [deck, setDeck] = useState(cards);
  const [isFlipped, setIsFlipped] = useState(false);
  const controls = useAnimation();

  const handleFlip = () => setIsFlipped((prev) => !prev);

  const handleSwipe = async (direction) => {
    const [top, ...rest] = deck;
    setIsFlipped(false);

    await controls.start({
      x: direction === "left" ? -500 : 500,
      opacity: 0,
      transition: { duration: 0.3 },
    });

    const updatedDeck =
      direction === "left"
        ? [...rest, top] // move top to bottom
        : [deck.at(-1), ...deck.slice(0, -1)]; // move bottom to top

    setDeck(updatedDeck);
    controls.set({ x: 0, opacity: 1 });
  };

  return (
    <div className="card-stack-container">
      {deck.map((card, index) => {
        const isTop = index === 0;
        const offset = Math.min(index, 4); // only show top 5 stacked

        return (
          <div
            key={card.id}
            className="card-wrapper"
            style={{
              transform: `translateY(${offset * 15}px) scale(${1 - offset * 0.03})`,
              zIndex: deck.length - index,
            }}
          >
            {isTop ? (
              <motion.div
                className="card-drag-wrapper"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(e, info) => {
                  if (info.offset.x < -100) handleSwipe("left");
                  else if (info.offset.x > 100) handleSwipe("right");
                }}
                animate={controls}
              >
                <motion.div
                  className="card-inner"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6 }}
                  onClick={handleFlip}
                >
                  <div className="card-face card-front">
                    <span className="card-question">Question</span>
                    <p>{card.question}</p>
                    <span className="card-toggle">Tap to flip</span>
                  </div>
                  <div className="card-face card-back">
                    <span className="card-answer">Answer</span>
                    <p>{card.answer}</p>
                    <span className="card-toggle">Tap to flip</span>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <div className="card-inner">
                <div className="card-face card-front">
                  {/* <h3>{card.topic}</h3> */}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CardStack;