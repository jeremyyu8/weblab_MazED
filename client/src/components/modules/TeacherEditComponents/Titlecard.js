import React, { useContext, useEffect, useState, useRef } from "react";

import { flashCardContext } from "../../pages/TeacherEdit";
const Titlecard = () => {
  const [flashCardSet, setFlashCardSet] = useContext(flashCardContext);

  const handleChange = (event) => {
    setFlashCardSet({ title: event.target.value, cards: flashCardSet.cards });
  };

  return (
    <>
      <div className="m-1 text-4xl text-blue-500 flex">
        <span className="mr-6">Title: </span>
        <input
          className="text-3xl font-Ubuntu w-[70%]"
          onInput={handleChange}
          defaultValue={flashCardSet.title}
          placeholder={"Set title"}
        ></input>
      </div>
    </>
  );
};

export default Titlecard;
