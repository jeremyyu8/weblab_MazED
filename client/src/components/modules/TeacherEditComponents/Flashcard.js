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
    <>
      <div className="border-solid border-4 bg-blue-600 bg-opacity-20 rounded-lg w-[80%] px-7 m-5 p-3 pb-5 mx-auto text-xl">
        <div className="flex flex-col">
          <div className="inline-flex w-full">
            <div className="w-[100%]">
              <div className="flex justify-between">
                <div className="">Question {idx + 1}.</div>
                <button
                  className="mt-0 ml-[75%] w-6 h-6 hover:bg-red-300 text-[1vw] rounded-full font-Ubuntu hover:cursor-pointer"
                  onClick={() => props.handleDelete(idx)}
                >
                  X
                </button>
              </div>
              <div className="w-[95%]">
                <input
                  onChange={handleQuestion}
                  className="input-box text-lg w-[97%] font-Ubuntu"
                  value={props.question}
                  placeholder={"Question Statement"}
                ></input>
                <div className="flex flex-col">
                  <div className="my-2">Answers</div>
                  <div className="flex justify-between">
                    <label className="flex-none">1.</label>
                    <input
                      onChange={handleChoice0}
                      className="flex-1 text-lg mx-2 input-box font-Ubuntu"
                      value={props.choices[0]}
                      placeholder={"Answer Choice 1"}
                    ></input>
                    <input
                      onChange={handleAnswer0}
                      type="checkbox"
                      className="basis-1/8 text-lg hover:cursor-pointer"
                      checked={props.answers.includes(0)}
                    ></input>
                  </div>
                  <div className="flex mt-1 justify-between">
                    <label className="flex-none mt-2">2.</label>
                    <input
                      onChange={handleChoice1}
                      className="flex-1 mx-2 text-lg input-box font-Ubuntu"
                      value={props.choices[1]}
                      placeholder={"Answer Choice 2"}
                    ></input>
                    <input
                      onChange={handleAnswer1}
                      type="checkbox"
                      className="basis-1/8 text-lg hover:cursor-pointer"
                      checked={props.answers.includes(1)}
                    ></input>
                  </div>
                  <div className="flex mt-1 justify-between">
                    <label className="flex-none mt-2">3.</label>
                    <input
                      onChange={handleChoice2}
                      className="flex-1 mx-2 text-lg input-box font-Ubuntu"
                      value={props.choices[2]}
                      placeholder={"Answer Choice 3"}
                    ></input>
                    <input
                      onChange={handleAnswer2}
                      type="checkbox"
                      className="basis-1/8 text-lg hover:cursor-pointer"
                      checked={props.answers.includes(2)}
                    ></input>
                  </div>
                  <div className="flex mt-1 justify-between">
                    <label className="flex-none mt-2">4.</label>
                    <input
                      onChange={handleChoice3}
                      className="flex-1 mx-2 input-box text-lg font-Ubuntu"
                      value={props.choices[3]}
                      placeholder={"Answer Choice 4"}
                    ></input>
                    <input
                      onChange={handleAnswer3}
                      type="checkbox"
                      className="basis-1/8 text-lg hover:cursor-pointer"
                      checked={props.answers.includes(3)}
                    ></input>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Flashcard;
