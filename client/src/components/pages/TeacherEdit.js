import React, { useState, useEffect, createContext } from "react";
import Navbar from "../modules/Navbar";
import Titlecard from "../modules/TeacherEditComponents/Titlecard";

import Image from "../modules/TeacherEditComponents/Image";
import Set from "../modules/TeacherEditComponents/Set";
import { get, post } from "../../utilities";

/**
 * Teacher Edit page for editing flashcards
 *
 * Proptypes
 * none for now
 */

export const flashCardContext = createContext();

const TeacherEdit = () => {
  const [flashCardSet, setFlashCardSet] = useState({ title: "", cards: [] });
  const [setId, setSetId] = useState(null);

  const handleSubmit = () => {
    if (setId === "new") {
      post("/api/newset", flashCardSet).then(
        console.log("new set created successfully from teacher edit")
      );
    } else {
      post("/api/setbyid", { ...flashCardSet, setid: setId }).then(
        console.log("set modified and saved successfully from teacher edit")
      );
    }

    //window.location.replace("/teacher");
  };

  return (
    <>
      <Navbar edit={true} />
      <flashCardContext.Provider value={[flashCardSet, setFlashCardSet]}>
        <div className="mt-[-8vh] flex-col">
          <div>{flashCardSet.title}</div>

          <div className="flex flex-1 justify-between">
            <div className="basis-1/3 border-solid text-6xl bg-green-50 m-5 p-5">
              <Titlecard />
            </div>
            <div className="basis-1/4 border-solid justify-center text-3xl m-5 h-32">
              <Image />
            </div>
          </div>
          <div className="flex-1 border-solid">
            <div className="flex border-solid border-black max-w-[80%] h-[25vw] m-10 mx-auto">
              <Set setSetId={setSetId} />
            </div>
          </div>
          <div className="flex-1 border-solid flex justify-center">
            <button
              onClick={handleSubmit}
              className="border-solid hover:bg-sky-300 cursor-pointer transition-all text-4xl m-5 p-2"
            >
              Save and Exit
            </button>
          </div>
        </div>
      </flashCardContext.Provider>
    </>
  );
};

export default TeacherEdit;
