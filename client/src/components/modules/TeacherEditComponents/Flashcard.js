import React, { useContext, useEffect, useState } from "react";

import { flashCardContext } from "../../pages/TeacherEdit";
/**
 * flashcard inside of teacher edit page
 *
 * Proptypes
 * @param {cardid} cardid unique id of the card
 * @param {question} question to display
 * @param {choices} choices to display
 * @param {answers} answers to display
 */
const Flashcard = (props) => {
  const [flashCardSet, setFlashCardSet] = useContext(flashCardContext);

  // defaultValue={flashCardSet.cards[idx].choices[0]}
  // ></input>
  // <input
  //   onChange={handleAnswer0}
  //   type="checkbox"
  //   className="basis-1/8"
  //   defaultChecked={flashCardSet.cards[idx].answers.includes(0)}

  // useEffect(() => {}, []);
  const idx = props.idx;

  //idx is idx in flashCardSet
  const handleNewCard = (newCard) => {
    console.log(
      flashCardSet.cards.slice(0, idx).concat([newCard].concat(flashCardSet.cards.slice(idx + 1)))
    );
    setFlashCardSet({
      title: flashCardSet.title,
      cards: flashCardSet.cards
        .slice(0, idx)
        .concat([newCard].concat(flashCardSet.cards.slice(idx + 1))),
    });
  };

  const handleQuestion = (event) => {
    let newCard = flashCardSet.cards[idx];
    newCard.question = event.target.value;
    handleNewCard(newCard);
  };

  const handleChoice0 = (event) => {
    let newCard = flashCardSet.cards[idx];
    newCard.choices[0] = event.target.value;
    handleNewCard(newCard);
  };
  const handleAnswer0 = (event) => {
    let newCard = flashCardSet.cards[idx];
    if (event.target.checked) {
      if (!newCard.answers.includes(0)) newCard.answers.push(0);
    } else {
      if (newCard.answers.includes(0)) newCard.answers = newCard.answers.filter((val) => val != 0);
    }
    handleNewCard(newCard);
  };

  const handleChoice1 = (event) => {
    let newCard = flashCardSet.cards[idx];
    newCard.choices[1] = event.target.value;
    handleNewCard(newCard);
  };
  const handleAnswer1 = (event) => {
    let newCard = flashCardSet.cards[idx];
    if (event.target.checked) {
      if (!newCard.answers.includes(1)) newCard.answers.push(1);
    } else {
      if (newCard.answers.includes(1)) newCard.answers = newCard.answers.filter((val) => val != 1);
    }
    handleNewCard(newCard);
  };

  const handleChoice2 = (event) => {
    let newCard = flashCardSet.cards[idx];
    newCard.choices[2] = event.target.value;
    handleNewCard(newCard);
  };
  const handleAnswer2 = (event) => {
    let newCard = flashCardSet.cards[idx];
    if (event.target.checked) {
      if (!newCard.answers.includes(2)) newCard.answers.push(2);
    } else {
      if (newCard.answers.includes(2)) newCard.answers = newCard.answers.filter((val) => val != 2);
    }
    handleNewCard(newCard);
  };

  const handleChoice3 = (event) => {
    let newCard = flashCardSet.cards[idx];
    newCard.choices[3] = event.target.value;
    handleNewCard(newCard);
  };
  const handleAnswer3 = (event) => {
    let newCard = flashCardSet.cards[idx];
    if (event.target.checked) {
      if (!newCard.answers.includes(3)) newCard.answers.push(3);
    } else {
      if (newCard.answers.includes(3)) newCard.answers = newCard.answers.filter((val) => val != 3);
    }
    handleNewCard(newCard);
  };

  // const handleDelete = () => {
  //   console.log("deletion");
  //   console.log(idx);
  //   setFlashCardSet({
  //     title: flashCardSet.title,
  //     cards: flashCardSet.cards.slice(0, idx).concat(flashCardSet.cards.slice(idx + 1)),
  //   });
  //   console.log(flashCardSet);
  // };

  return (
    <div className="border-solid w-[50%] m-5 mx-auto">
      <div className="flex flex-col m-2">
        <div className="flex-1">Question</div>
        <input onChange={handleQuestion} className="mt-1 input-box" value={props.question}></input>
        <div className="basis-3/4 flex flex-col">
          <div className="mt-2">Answers</div>
          <div className="flex mt-1 justify-between">
            <label className="flex-none">1.</label>
            <input
              onChange={handleChoice0}
              className="flex-1 mx-2 input-box"
              value={props.choices[0]}
            ></input>
            <input
              onChange={handleAnswer0}
              type="checkbox"
              className="basis-1/8"
              checked={props.answers.includes(0)}
            ></input>
          </div>
          <div className="flex mt-1 justify-between">
            <label className="flex-none">2.</label>
            <input
              onChange={handleChoice1}
              className="flex-1 mx-2 input-box"
              value={props.choices[1]}
            ></input>
            <input
              onChange={handleAnswer1}
              type="checkbox"
              className="basis-1/8"
              checked={props.answers.includes(1)}
            ></input>
          </div>
          <div className="flex mt-1 justify-between">
            <label className="flex-none">3.</label>
            <input
              onChange={handleChoice2}
              className="flex-1 mx-2 input-box"
              value={props.choices[2]}
            ></input>
            <input
              onChange={handleAnswer2}
              type="checkbox"
              className="basis-1/8"
              checked={props.answers.includes(2)}
            ></input>
          </div>
          <div className="flex mt-1 justify-between">
            <label className="flex-none">4.</label>
            <input
              onChange={handleChoice3}
              className="flex-1 mx-2 input-box"
              value={props.choices[3]}
            ></input>
            <input
              onChange={handleAnswer3}
              type="checkbox"
              className="basis-1/8"
              checked={props.answers.includes(3)}
            ></input>
          </div>
          <button className="w-[10%] mx-auto mt-2" onClick={() => props.handleDelete(idx)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
