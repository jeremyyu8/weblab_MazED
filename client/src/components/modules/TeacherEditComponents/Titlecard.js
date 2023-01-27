import React, { useContext, useEffect, useState, useRef } from "react";

import { flashCardContext } from "../../pages/TeacherEdit";
const Titlecard = () => {
  const [flashCardSet, setFlashCardSet] = useContext(flashCardContext);

  const handleChange = (event) => {
    setFlashCardSet({ title: event.target.value, cards: flashCardSet.cards });
  };

  return (
    <>
      <div>Title</div>
      <input
        className="text-2xl font-Ubuntu"
        onInput={handleChange}
        defaultValue={flashCardSet.title}
        placeholder={"Set title"}
      ></input>
    </>
  );
};

export default Titlecard;
