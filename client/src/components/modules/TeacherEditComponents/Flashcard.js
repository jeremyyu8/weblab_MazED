import React from "react";

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
  console.log(props);
  return (
    <div className="border-solid w-[50%] m-5 mx-auto">
      <div className="flex flex-col m-2">
        <div className="flex-1">Question</div>
        <input className="mt-1 input-box" defaultValue={props.cardid ? props.question : ""}></input>
        <div className="basis-3/4 flex flex-col">
          <div className="mt-2">Answers</div>
          <div className="flex mt-1 justify-between">
            <label className="flex-none">1.</label>
            <input
              className="flex-1 mx-2 input-box"
              defaultValue={props.cardid ? props.choices[0] : ""}
            ></input>
            <input
              type="checkbox"
              className="basis-1/8"
              defaultChecked={props.cardid ? props.answers.includes(0) : ""}
            ></input>
          </div>
          <div className="flex mt-1 justify-between">
            <label className="flex-none">2.</label>
            <input
              className="flex-1 mx-2 input-box"
              defaultValue={props.cardid ? props.choices[1] : ""}
            ></input>
            <input
              type="checkbox"
              className="basis-1/8"
              defaultChecked={props.cardid ? props.answers.includes(1) : ""}
            ></input>
          </div>
          <div className="flex mt-1 justify-between">
            <label className="flex-none">3.</label>
            <input
              className="flex-1 mx-2 input-box"
              defaultValue={props.cardid ? props.choices[2] : ""}
            ></input>
            <input
              type="checkbox"
              className="basis-1/8"
              defaultChecked={props.cardid ? props.answers.includes(2) : ""}
            ></input>
          </div>
          <div className="flex mt-1 justify-between">
            <label className="flex-none">4.</label>
            <input
              className="flex-1 mx-2 input-box"
              defaultValue={props.cardid ? props.choices[3] : ""}
            ></input>
            <input
              type="checkbox"
              className="basis-1/8"
              defaultChecked={props.cardid ? props.answers.includes(3) : ""}
            ></input>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
