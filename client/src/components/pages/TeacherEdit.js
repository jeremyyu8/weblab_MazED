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
          <div className="background">
            <div className="sheerbox w-[70%] mt-[5%] mb-1">
              <flashCardContext.Provider value={[flashCardSet, setFlashCardSet]}>
                {/* <div className="text-red-600 text-center mt-[10vh] text-3xl">
                Error: please give your flashcard set a title{" "}
              </div> */}
                <div className="flex justify-evenly w-full">
                  <div className="text-xl bg-blue-50 bg-opacity-60 m-1 p-2">
                    <Titlecard />
                  </div>
                  <div className="basis-1/4 border-solid justify-center text-xl m-1">
                    <Image />
                  </div>
                </div>
                <div className="flex-2 w-full inline">
                  <div className="flex max-w-[90%] h-[30vw] m-8 mx-auto">
                    <Set setSetId={setSetId} />
                  </div>
                  <button
                    onClick={handleSubmit}
                    className="rounded-xl hover:bg-sky-300 cursor-pointer text-xl mt-1"
                  >
                    Save and Exit
                  </button>
                </div>
              </flashCardContext.Provider>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default TeacherEdit;
