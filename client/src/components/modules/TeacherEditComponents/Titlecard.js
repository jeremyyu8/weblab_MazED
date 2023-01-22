import React, { useContext, useEffect, useState, useRef } from "react";

import { flashCardContext } from "../../pages/TeacherEdit";
const Titlecard = () => {
  const [flashCardSet, setFlashCardSet] = useContext(flashCardContext);

  const handleChange = (event) => {
    console.log(event.target.value);
    setFlashCardSet({ title: event.target.value, cards: flashCardSet.cards });
  };

  return <input onInput={handleChange} defaultValue={flashCardSet.title}></input>;
};

export default Titlecard;
