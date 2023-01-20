import React, { useState, useEffect, useRef } from "react";
import { Redirect } from "@reach/router";
import Flashcard from "./Flashcard";

import { get, post } from "../../../utilities";

const Set = () => {
  const [redirect, setRedirect] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([
    {
      _id: "_id1",
      question: "hi",
      choices: ["choice 1", "choice 2", "choice 3", "choice 4"],
      answers: [0, 1],
    },
    {
      _id: "_id2",
      question: "cringecringecringecringecringecringe",
      choices: ["1", "2", "3", "4"],
      answers: [2, 3],
    },
  ]);

  const setContainerRef = useRef(null);

  // load the set
  useEffect(() => {
    const loadSet = async () => {
      const _id = window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1);
      try {
        const set = await get("/api/setbyid", { _id: _id });
        setCards(set);
        if (set.err) {
          setRedirect(true); // TODO why is this like this?
        }
        setLoading(false);
      } catch {
        setRedirect(true);
        setLoading(false);
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
        block: "end",
        inline: "nearest",
      });
    }
  }, [cards]);

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
              {cards.map((card, i) => {
                return (
                  <Flashcard
                    key={i}
                    cardid={card._id}
                    question={card.question}
                    choices={card.choices}
                    answers={card.answers}
                  />
                );
              })}
              <div ref={setContainerRef}></div>
            </div>

            <button
              onClick={() => {
                setCards([...cards, { question: "cringe" }]);
              }}
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
