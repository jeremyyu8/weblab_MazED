import React, { useContext, useEffect, useState, useRef } from "react";

import { flashCardContext } from "../../pages/TeacherEdit";
const Titlecard = () => {
  const [flashCardSet, setFlashCardSet] = useContext(flashCardContext);

  const handleChange = (event) => {
    setFlashCardSet({ title: event.target.value, cards: flashCardSet.cards });
  };

  return (
    <>
      <div className="m-1 text-4xl text-blue-700 flex rounded-xl">
        <span className="mr-6 rounded-xl font-bold p-1">Title: </span>
        <input
          className="text-3xl rounded-xl p-1 border-blue-200 font-Ubuntu w-[75%]"
          onInput={handleChange}
          defaultValue={flashCardSet.title}
          placeholder={"Set title"}
        ></input>
      </div>
    </>
  );
};

export default Titlecard;
