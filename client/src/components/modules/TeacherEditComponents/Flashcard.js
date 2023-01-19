import React from "react";

/*

props.question 
  props.choices 
  props.answers
*/
const Flashcard = (props) => {
  return (
    <div className="border-solid w-[50%] m-5 mx-auto">
      <div className="flex flex-col m-2">
        <div className="flex-1">Question</div>
        <input className="mt-1"></input>
        <div className="basis-3/4 flex flex-col">
          <div className="mt-2">Answers</div>
          <div className="flex mt-1 justify-between">
            <label className="flex-none">1.</label>
            <input className="flex-1 mx-2"></input>
            <button className="basis-1/8">click me</button>
          </div>
          <div className="flex mt-1 justify-between">
            <label className="flex-none">1.</label>
            <input className="flex-1 mx-2"></input>
            <button className="basis-1/8">click me</button>
          </div>
          <div className="flex mt-1 justify-between">
            <label className="flex-none">1.</label>
            <input className="flex-1 mx-2"></input>
            <button className="basis-1/8">click me</button>
          </div>
          <div className="flex mt-1 justify-between">
            <label className="flex-none">1.</label>
            <input className="flex-1 mx-2"></input>
            <button className="basis-1/8">click me</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
