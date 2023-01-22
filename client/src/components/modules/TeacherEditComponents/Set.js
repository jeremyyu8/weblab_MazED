import React, { useState, useEffect, useRef, useContext } from "react";
import { Redirect } from "@reach/router";
import Flashcard from "./Flashcard";

import { flashCardContext } from "../../pages/TeacherEdit";
import { get, post } from "../../../utilities";

//only prop is setSetId function
const Set = (props) => {
  const [redirect, setRedirect] = useState(undefined);
  const [loading, setLoading] = useState(true);

  const [flashCardSet, setFlashCardSet] = useContext(flashCardContext);

  const setContainerRef = useRef(null);

  // load the set
  useEffect(() => {
    const loadSet = async () => {
      const _id = window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1);
      props.setSetId(_id);

      if (_id == "new") {
        setFlashCardSet({ title: "", cards: [] });
        setLoading(false);
      } else {
        try {
          const setData = await get("/api/setbyid", { _id: _id });
          setFlashCardSet({ title: setData.title, cards: setData.cards });

          if (setData.err) {
            setRedirect(true); // TODO why is this like this?
          }
          setLoading(false);
        } catch {
          setRedirect(true);
          setLoading(false);
        }
      }
    };
    loadSet();
  }, []);

  //fix?
  // useEffect(() => {
  //   console.log("length change to these cards", flashCardSet.cards);

  //   setFlashCardSet({ title: flashCardSet.title, cards: flashCardSet.cards });
  // }, [flashCardSet.cards.length]);

  // scroll behavior
  // (scroll to bottom when user adds new card)

  const handleAutoScroll = () => {
    if (setContainerRef.current) {
      setContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  };
  const handleNewCard = async () => {
    await setFlashCardSet({
      title: flashCardSet.title,
      cards: flashCardSet.cards.concat({
        question: "",
        choices: ["", "", "", ""],
        answers: [],
      }),
    });
    handleAutoScroll();
  };

  return (
    <>
      {redirect ? (
        <Redirect noThrow from="/teacher/edit" to="/teacher" />
      ) : loading === true ? (
        <div>loading...</div>
      ) : (
        <>
          <div className="flex flex-col justify-center border-solid border-red-600 grow-0 mx-auto w-[100%]">
            <div className="flex-col overflow-scroll border-solid border-green-300">
              {flashCardSet.cards.map((card, i) => {
                return <Flashcard idx={i} />;
              })}
              <div ref={setContainerRef}></div>
            </div>

            <button
              onClick={handleNewCard}
              className="basis-1/6 border-solid hover:bg-sky-300 cursor-pointer transition-all text-4xl m-5 p-2 w-auto mx-auto"
            >
              Add New Card
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default Set;
