import React, { useState, useEffect } from "react";
import Flashcard from "./Flashcard";

const Set = () => {
  const [cards, setCards] = useState([
    { question: "hi", choices: ["1", "2", "3", "4"], answers: [1, 2] },
    { question: "bye", choices: ["1", "2", "3", "4"], answers: [1, 2] },
  ]);

  return (
    <>
      <div className="flex flex-col justify-center border-solid border-red-600 grow-0 mx-auto w-[100%]">
        <div className="flex-col overflow-scroll border-solid border-green-300">
          {cards.map((card) => {
            return (
              <Flashcard question={card.question} choices={card.choices} answers={card.answers} />
            );
          })}
        </div>

        <button
          onClick={() => {
            setCards([...cards, { question: "cringe" }]);
          }}
          className="basis-1/6 border-solid hover:bg-sky-300 cursor-pointer transition-all text-4xl m-5 p-2 w-auto mx-auto"
        >
          Add New Card
        </button>
      </div>
    </>
  );
};

export default Set;
