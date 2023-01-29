import React, { useState, useEffect } from "react";
import { get, post } from "../../../utilities";

//props are gamestate and game
const Game = (props) => {
  const [insideData, setInsideData] = useState("flashcard"); //flashcard or player

  let cardMap = {};
  for (const card of props.gameState.cards) {
    cardMap[card._id] = { question: card.question, choices: card.choices, answers: card.answers };
  }

  const make_human_readable = (iso) => {
    let date = new Date(iso);
    let now = new Date();

    console.log("iso: ");
    console.log(iso);

    const utc1 = Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    );
    const utc2 = Date.UTC(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds()
    );

    let dif = Math.floor((utc2 - utc1) / 1000); // dif in seconds
    if (dif < 60) {
      return `Played: ${dif} seconds ago`;
    } else if (dif < 3600) {
      const m = Math.floor(dif / 60);
      const s = dif - m * 60;
      const mtag = m == 1 ? "minute" : "minutes";
      return `Played: ${m} ${mtag} ${s} seconds ago`;
    } else if (dif < 86400) {
      dif = Math.floor(dif / 60); // dif in minutes
      const h = Math.floor(dif / 60);
      const m = dif - h * 60;
      const htag = h == 1 ? "hour" : "hours";
      return `Played: ${h} ${htag} ${m} minutes ago`;
    } else if (dif < 31557600) {
      dif = Math.floor(dif / 3600); // dif in hours
      const d = Math.floor(dif / 24);
      const h = dif - d * 24;
      const dtag = d == 1 ? "day" : "days";
      return `Played: ${d} ${dtag} ${h} hours ago`;
    } else {
      dif = Math.floor(dif / 86400); // dif in days
      const y = Math.floor(dif / 365.25);
      const d = Math.floor(dif - y * 365.25);
      const ytag = y == 1 ? "year" : "years";
      return `Played: ${y} ${ytag} ${d} days ago`;
    }
  };

  let playerDivs = [];
  for (const _id in props.gameState.players) {
    const curPlayer = props.gameState.players[_id];
    if (curPlayer.name === "teacher") continue;
    playerDivs.push(
      <>
        <div className="flex text-2xl justify-between border-solid bg-blue-300 border-blue-500 m-5 p-2">
          <div className="flex-1 mx-2">Name: {curPlayer.name}</div>
          <div className="flex-1 mx-2">
            Questions answered correctly: {curPlayer.flashcards_correct}
          </div>
          <div className="flex-1 mx-2 ">Questions answered total: {curPlayer.flashcards_total}</div>
        </div>
      </>
    );
  }

  let flashcardDivs = [];

  for (const _id in props.gameState.questionStats) {
    const card = cardMap[_id];
    flashcardDivs.push(
      <>
        <div className="flex text-2xl justify-between border-solid bg-blue-300 border-blue-500 m-5 p-2">
          <div className="flex-1 mx-2">Question:{card.question}</div>
          <div className="flex-1 mx-2 ">
            Answered correctly:{props.gameState.questionStats[_id].correct}
          </div>
          <div className="flex-1 mx-2 ">
            Total attempts:{props.gameState.questionStats[_id].attempts}
          </div>
        </div>
      </>
    );
  }

  flashcardDivs.push(<></>);

  const [showing, setShowing] = useState(false);
  console.log(props.gameState);
  return (
    <>
      <div className="flex border-solid border-blue-700 p-5 w-[50vw] m-3 justify-between bg-transparent rounded-xl">
        <div className="flex-1">
          <div className="text-blue-400 text-3xl">Game: {props.gameState.settitle} </div>
          <div className="mt-3">{props.datePlayed} </div>
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
        <div className="fixed top-[15%] left-0 w-full h-[calc(100vh_-_80px)] mt-[-15vh] bg-white opacity-90 text-black z-50 border-solid flex flex-col">
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
                  <div className="mx-auto text-3xl text-blue-600">
                    Flashcard data for set: {props.gameState.settitle}
                  </div>
                </div>

                <div className="border-solid w-[80%] mt-10 h-[65vh] mx-auto overflow-y-auto">
                  {flashcardDivs}
                </div>
              </>
            )}

            {insideData === "player" && (
              <>
                <div className="flex">
                  <div className="mx-auto text-3xl text-blue-600">Player data</div>
                </div>

                <div className="border-solid w-[80%] mt-10 h-[65vh] mx-auto overflow-y-auto">
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
