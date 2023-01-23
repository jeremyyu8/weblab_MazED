import React, { useState, useEffect, createContext } from "react";
import { Redirect } from "@reach/router";
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
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    console.log(flashCardSet);
    if (flashCardSet.title.length === 0) {
      alert("please enter a title for your set!");
      return;
    }
    for (let card of flashCardSet.cards) {
      if (card.question.length === 0) {
        alert("questions cannot be empty");
        return;
      }
      for (let choice of card.choices) {
        if (choice.length === 0) {
          alert("answer choices cannot be empty");
          return;
        }
      }
      if (card.answers.length === 0) {
        alert("please select answers for your flashcards!");
        return;
      }
    }
    setLoading(true);
    if (setId === "new") {
      const newSet = async () => {
        await post("/api/newset", flashCardSet);
        console.log("new set created successfully from teacher edit");
        setLoading(false);
        setRedirect(true);
      };
      newSet();
    } else {
      const updateSet = async () => {
        await post("/api/setbyid", { ...flashCardSet, setid: setId });
        console.log("new set edited successfully from teacher edit");
        setLoading(false);
        setRedirect(true);
      };
      updateSet();
    }
  };

  // get teacher data
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const data = await get("/api/userbyid");
        if (data.role !== "teacher") {
          setRedirect(true);
        }
      } catch (error) {
        setRedirect(true);
      }
    };
    checkLoggedIn();
  }, []);

  return (
    <>
      {redirect ? (
        <Redirect noThrow from="/teacher" to="/login" />
      ) : loading === true ? (
        <div>saving flashcards...</div>
      ) : (
        <>
          <Navbar edit={true} />
          <div class="h-[75px]"></div>
          <flashCardContext.Provider value={[flashCardSet, setFlashCardSet]}>
            <div className="flex-col">
              {/* <div className="text-red-600 text-center mt-[10vh] text-3xl">
                Error: please give your flashcard set a title{" "}
              </div> */}
              <div className="flex flex-1 justify-between">
                <div className="basis-1/3 border-solid text-6xl bg-green-50 m-5 p-5">
                  <Titlecard />
                </div>
                <div className="basis-1/4 border-solid justify-center text-3xl m-5 h-32">
                  <Image />
                </div>
              </div>
              <div className="flex-2 border-solid">
                <div className="flex border-solid border-black max-w-[80%] h-[40vw] m-10 mx-auto">
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
      )}
    </>
  );
};

export default TeacherEdit;
