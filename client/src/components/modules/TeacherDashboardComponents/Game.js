import React, { useState, useEffect } from "react";
import { get, post } from "../../../utilities";

//props are gamestate and game
const Game = (props) => {
  const [insideData, setInsideData] = useState("flashcard"); //flashcard or player
  const [playerDivs, setPlayerDivs] = useState([]);
  const [flashcardDivs, setFlashcardDivs] = useState([]);
  const [studentsRanked, setStudentsRanked] = useState(false);

  let cardMap = {};
  for (const card of props.gameState.cards) {
    cardMap[card._id] = { question: card.question, choices: card.choices, answers: card.answers };
  }

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const make_human_readable = (iso) => {
    let date = new Date(iso);

    return `Played on: ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  // compute flashcard percentage
  const percentage = (correct, total) => {
    let p = correct / total;
    let d = Math.round(100 * (p - Math.floor(p)));
    if (isNaN(p)) {
      return "N/A";
    } else {
      return String(Math.floor(p) + "." + String(d));
    }
  };

  useEffect(() => {
    let players = [];
    for (let playerid in props.gameState["players"]) {
      if (playerid !== props.gameState["teacher"]["_id"]) {
        players.push([playerid, props.gameState["players"][playerid]["rank"]]);
      }
    }
    players.sort((p1, p2) => {
      if (p1[1] < p2[1]) return -1;
      else return 1;
    });

    setPlayerDivs(
      players.map((player, idx) => {
        let curPlayer = props.gameState["players"][player[0]];
        return (
          <>
            <div
              key={idx}
              className="text-2xl border-solid bg-blue-200 border-blue-500 m-5 p-2 hover:shadow-[0_0_5px_5px_rgba(29,78,216,0.15)] transition-all ease-in"
            >
              <div className="mx-2">
                Student: <span className="text-blue-800">{curPlayer.name}</span>
              </div>
              <div className="flex justify-between">
                <div className="basis-1/8 ml-3">Rank: {idx + 1}</div>
                <div className="flex-1 ml-[8vw]">Correct: {curPlayer.flashcards_correct}</div>
                <div className="flex-1 ml-3">Attempted: {curPlayer.flashcards_total}</div>
                <div className="flex-1 ml-3">
                  Accuracy: {percentage(curPlayer.flashcards_correct, curPlayer.flashcards_total)}
                </div>
              </div>
            </div>
          </>
        );
      })
    );

    let tempFlashcardDivs = [];
    for (const _id in props.gameState.questionStats) {
      const card = cardMap[_id];
      tempFlashcardDivs.push(
        <>
          <div className="text-2xl border-solid bg-blue-200 border-blue-500 m-5 p-2 hover:shadow-[0_0_5px_5px_rgba(29,78,216,0.15)] transition-all ease-in">
            <div className="flex-1 mx-2">
              Question: <span className="text-blue-700">{card.question}</span>
            </div>
            <div className="flex-1 mx-2 ">
              Correct: {props.gameState.questionStats[_id].correct}
            </div>
            <div className="flex-1 mx-2 ">
              Attempts: {props.gameState.questionStats[_id].attempts}
            </div>
          </div>
        </>
      );
    }
    setFlashcardDivs(tempFlashcardDivs);
  }, []);

  const [showing, setShowing] = useState(false);
  return (
    <>
      <div className="flex border-solid border-blue-700 p-5 w-[50vw] m-3 justify-between bg-transparent rounded-xl">
        <div className="flex-1">
          <div className="text-blue-400 text-3xl">{props.gameState.settitle} </div>
          <div className="mt-3">{make_human_readable(props.datePlayed)} </div>
        </div>
        <div className="basis-1/8 flex flex-col">
          <button
            className="editfbuttons my-auto"
            onClick={() => {
              setShowing(true);
            }}
          >
            Show details
          </button>
        </div>
      </div>

      {showing && (
        //fixed top-[15%] left-0 w-full h-[calc(100vh_-_80px)] mt-[-15vh] bg-white opacity-90 text-black z-50 border-solid
        <div className="fixed top-[15%] left-0 w-full h-[calc(100vh_-_80px)] mt-[-15vh] bg-white opacity-95 text-black z-50 border-solid flex flex-col">
          <div>
            <div className="m-4">
              <button
                className="editfbuttons mx-4"
                onClick={() => {
                  setInsideData("flashcard");
                }}
              >
                Flashcard data
              </button>
              <button
                className="editfbuttons"
                onClick={() => {
                  setInsideData("player");
                }}
              >
                Player results
              </button>
            </div>
          </div>
          <div>
            {insideData === "flashcard" && (
              <>
                <div className="flex">
                  <div className="mx-auto text-3xl text-black">
                    Flashcard data for set:{" "}
                    <span className="text-blue-600">{props.gameState.settitle}</span>
                  </div>
                </div>

                <div className="border-solid w-[80%] mt-8 h-[60vh] mx-auto overflow-y-auto">
                  {flashcardDivs}
                </div>
              </>
            )}

            {insideData === "player" && (
              <>
                <button
                  className="editfbuttons w-[15vw] absolute top-[3vh] right-[4vw]"
                  onClick={() => {
                    setStudentsRanked(true);
                  }}
                >
                  How are students ranked?
                </button>
                {studentsRanked && (
                  <div className="fixed w-[30%] h-auto top-[10%] left-[60%] bg-gray-200 opacity-100 p-8 z-50">
                    The listed ranks are based on how quickly each student completed each maze
                    during this particular game. Based on the different strategies that each
                    students might have used to progress, the shown ranks may not accurately reflect
                    accuracy percentages.
                    <div className="flex justify-center">
                      <button
                        className="font-Ubuntu w-[50%] mt-4"
                        onClick={() => {
                          setStudentsRanked(false);
                        }}
                      >
                        close
                      </button>
                    </div>
                  </div>
                )}
                <div className="flex">
                  <div className="mx-auto text-3xl text-black">Student data</div>
                </div>

                <div className="border-solid w-[80%] mt-8 h-[60vh] mx-auto overflow-y-auto">
                  {playerDivs}
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => {
              setShowing(false);
            }}
            className="editfbuttons absolute left-[50%] transform translate-x-[-50%] bottom-3 mx-auto"
          >
            Close
          </button>
        </div>
      )}
    </>
  );
};

export default Game;
