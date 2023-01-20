import React, { useState, useEffect } from "react";
import Navbar from "../modules/Navbar";
import Titlecard from "../modules/TeacherEditComponents/Titlecard";

import Image from "../modules/TeacherEditComponents/Image";
import Set from "../modules/TeacherEditComponents/Set";

/**
 * Teacher Edit page for editing flashcards
 *
 * Proptypes
 * none for now
 */
const TeacherEdit = () => {
  const [flashCardSet, setFlashCardSet] = useState({ title: "fash", cards: [] });

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/api/newset", flashCardSet).then(
      console.log("new set created successfully from teacher edit")
    );
  };

  return (
    <>
      <Navbar edit={true} />
      <div className="mt-[-8vh] flex-col">
        <div>{flashCardSet.title}</div>

        <div className="flex flex-1 justify-between">
          <div className="basis-1/3 border-solid text-6xl bg-green-50 m-5 p-5">
            <Titlecard setFlashCardSet={setFlashCardSet} />
          </div>
          <div className="basis-1/4 border-solid justify-center text-3xl m-5 h-32">
            <Image />
          </div>
        </div>
        <div className="flex-1 border-solid">
          <div className="flex border-solid border-black max-w-[80%] h-[25vw] m-10 mx-auto">
            <Set />
          </div>
        </div>
        <div className="flex-1 border-solid flex justify-center">
          <button className="border-solid hover:bg-sky-300 cursor-pointer transition-all text-4xl m-5 p-2">
            Save and Exit
          </button>
        </div>
      </div>
    </>
  );
};

export default TeacherEdit;
