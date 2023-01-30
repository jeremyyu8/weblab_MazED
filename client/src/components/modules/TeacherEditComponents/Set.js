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

  // scroll behavior
  // (scroll to bottom when user adds new card)

  useEffect(() => {
    if (setContainerRef.current) {
      setContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }, [flashCardSet.cards.length]);

  const handleNewCard = () => {
    setFlashCardSet({
      title: flashCardSet.title,
      cards: flashCardSet.cards.concat({
        question: "",
        choices: ["", "", "", ""],
        answers: [],
      }),
    });
  };

  const handleDelete = (idx) => {
    // console.log("deleting");
    // console.log(idx);
    // let newcards = [];
    // for (let i = 0; i < flashCardSet.cards.length; i++) {
    //   console.log("i", i, "idx", idx);
    //   if (i !== idx) {
    //     console.log("pushing");
    //     newcards.push(flashCardSet.cards[i]);
    //   }
    // }
    // console.log(newcards);
    setFlashCardSet({
      title: flashCardSet.title,
      cards: flashCardSet.cards.slice(0, idx).concat(flashCardSet.cards.slice(idx + 1)),
    });
    // setFlashCardSet({
    //   title: flashCardSet.title,
    //   cards: newcards,
    // });
  };

  return (
    <>
      {redirect ? (
        <Redirect noThrow from="/teacher/edit" to="/teacher" />
      ) : loading === true ? (
        <>
          <div>loading...</div>
          <div>{"(if this screen persists for a while, try refreshing the page!)"}</div>
        </>
      ) : (
        <>
          <div className="flex flex-col justify-center grow-0 mx-auto w-[100%]">
            <div className="flex-col overflow-auto">
              {flashCardSet.cards.map((card, i) => {
                return (
                  <Flashcard
                    key={i}
                    idx={i}
                    question={card.question}
                    choices={card.choices}
                    answers={card.answers}
                    handleDelete={handleDelete}
                  />
                );
              })}
              <div ref={setContainerRef}></div>
            </div>

            <button
              onClick={handleNewCard}
              className="flex-col rounded-xl hover:bg-sky-300 cursor-pointer transition-all text-xl m-2 p-1 w-auto mx-auto font-Ubuntu"
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
