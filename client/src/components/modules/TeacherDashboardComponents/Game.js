import React, { useState, useEffect } from "react";
import { get, post } from "../../../utilities";

//props are gamestate and game
const Game = (props) => {
  const [insideData, setInsideData] = useState("player"); //flashcard or player
  const [playerDivs, setPlayerDivs] = useState([]);
  const [flashcardDivs, setFlashcardDivs] = useState([]);
  const [studentsRanked, setStudentsRanked] = useState(false);
  const [classStats, setClassStats] = useState({ correct: 0, answered: 0, accuracy: "n/a" });
  const [studentSorting, setStudentSorting] = useState("Rank"); //Rank, Accuracy (ascending), Accuracy (descending)
  const [flashcardSorting, setFlashcardSorting] = useState("Default"); //Default, Difficulty (ascending), Difficulty (descending)
  const [mostMissed, setMostMissed] = useState({
    question: "",
    correct: 0,
    answered: 0,
    accuracy: 1.1,
  });

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
    let p = (correct / total) * 100;

    if (isNaN(p)) {
      return "N/A";
    } else {
      if (correct === total) return "100.0%";
      if (Number.isInteger(p)) return String(p) + ".00%";
      return String(p).slice(0, 5) + "%";
    }
  };

  useEffect(() => {
    let cards = [];
    for (const _id in props.gameState.questionStats) {
      const card = cardMap[_id];
      cards.push({
        question: card.question,
        correct: props.gameState.questionStats[_id].correct,
        attempts: props.gameState.questionStats[_id].attempts,
      });
    }

    if (flashcardSorting === "Default") {
    } else if (flashcardSorting === "Difficulty (ascending)") {
      cards.sort((p1, p2) => {
        if (p1.correct / p1.attempts < p2.correct / p2.attempts) return -1;
        else return 1;
      });
    } else if (flashcardSorting === "Difficulty (descending)") {
      cards.sort((p1, p2) => {
        if (p1.correct / p1.attempts < p2.correct / p2.attempts) return 1;
        else return -1;
      });
    }

    setFlashcardDivs(
      cards.map((card, idx) => (
        <div key={idx}>
          <div className="text-2xl border-solid bg-blue-200 border-blue-500 m-5 p-2 hover:shadow-[0_0_5px_5px_rgba(29,78,216,0.15)] transition-all ease-in">
            <div className="flex-1 mx-2">
              Question: <span className="text-blue-700">{card.question}</span>
            </div>
            <div className="flex-1 mx-2 ">Correct: {card.correct}</div>
            <div className="flex-1 mx-2 ">Attempts: {card.attempts}</div>
          </div>
        </div>
      ))
    );
  }, [flashcardSorting]);

  useEffect(() => {
    let players = [];
    for (let playerid in props.gameState["players"]) {
      if (playerid !== props.gameState["teacher"]["_id"]) {
        players.push([
          playerid,
          props.gameState["players"][playerid]["rank"],
          props.gameState["players"][playerid].flashcards_correct /
            props.gameState["players"][playerid].flashcards_total,
        ]);
      }
    }

    if (studentSorting === "Rank") {
      players.sort((p1, p2) => {
        if (p1[1] < p2[1]) return -1;
        else return 1;
      });
    } else if (studentSorting === "Accuracy (ascending)") {
      players.sort((p1, p2) => {
        if (p1[2] < p2[2]) return -1;
        else return 1;
      });
    } else if (studentSorting === "Accuracy (descending)") {
      players.sort((p1, p2) => {
        if (p1[2] < p2[2]) return 1;
        else return -1;
      });
    }

    setPlayerDivs(
      players.map((player, idx) => {
        let curPlayer = props.gameState["players"][player[0]];
        return (
          <>
            <div
              key={idx}
              className="text-2xl border-solid bg-blue-200 border-blue-500 m-5 p-2 hover:shadow-[0_0_5px_5px_rgba(29,78,216,0.15)] transition-all ease-in"
            >
              <div className="mx-3">
                Student: <span className="text-blue-800">{curPlayer.name}</span>
              </div>
              <div className="flex justify-between">
                <div className="basis-1/8 ml-3">Rank: {curPlayer.rank}</div>
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
  }, [studentSorting]);

  useEffect(() => {
    let players = [];
    let total_correct = 0;
    let total_answered = 0;
    for (let playerid in props.gameState["players"]) {
      if (playerid !== props.gameState["teacher"]["_id"]) {
        players.push([playerid, props.gameState["players"][playerid]["rank"]]);
        total_correct += props.gameState["players"][playerid].flashcards_correct;
        total_answered += props.gameState["players"][playerid].flashcards_total;
      }
    }
    setClassStats({
      correct: total_correct,
      answered: total_answered,
      accuracy: percentage(total_correct, total_answered),
    });
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
              <div className="mx-3">
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

    let cards = [];
    for (const _id in props.gameState.questionStats) {
      const card = cardMap[_id];
      if (
        props.gameState.questionStats[_id].correct / props.gameState.questionStats[_id].attempts <
        mostMissed.accuracy
      ) {
        setMostMissed({
          question: card.question,
          correct: props.gameState.questionStats[_id].correct,
          answered: props.gameState.questionStats[_id].attempts,
          accuracy:
            props.gameState.questionStats[_id].correct /
            props.gameState.questionStats[_id].attempts,
        });
      }

      cards.push({
        question: card.question,
        correct: props.gameState.questionStats[_id].correct,
        attempts: props.gameState.questionStats[_id].attempts,
      });
    }

    setFlashcardDivs(
      cards.map((card, idx) => (
        <div key={idx}>
          <div className="text-2xl border-solid bg-blue-200 border-blue-500 m-5 p-2 hover:shadow-[0_0_5px_5px_rgba(29,78,216,0.15)] transition-all ease-in">
            <div className="flex-1 mx-2">
              Question: <span className="text-blue-700">{card.question}</span>
            </div>
            <div className="flex-1 mx-2 ">Correct: {card.correct}</div>
            <div className="flex-1 mx-2 ">Attempts: {card.attempts}</div>
          </div>
        </div>
      ))
    );
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
                className="editfbuttons"
                onClick={() => {
                  setInsideData("player");
                }}
              >
                Player results
              </button>
              <button
                className="editfbuttons mx-4"
                onClick={() => {
                  setInsideData("flashcard");
                }}
              >
                Flashcard data
              </button>
            </div>
          </div>
          <div>
            {insideData === "flashcard" && (
              <>
                <div className="flex">
                  <div className="mx-auto text-3xl text-black">
                    Flashcard data for set:
                    <span className="text-blue-600">{" " + props.gameState.settitle}</span>
                  </div>
                </div>

                <div className="border-solid w-[80%] mt-8 h-[60vh] mx-auto overflow-y-auto relative text-xl">
                  <div className="flex absolute top-4 right-8">
                    <div> Flashcards sorted by:</div>
                    <button
                      className="font-Ubuntu mx-2 w-[10vw] text-center text-md"
                      onClick={() => {
                        if (flashcardSorting === "Default")
                          setFlashcardSorting("Difficulty (ascending)");
                        if (flashcardSorting === "Difficulty (ascending)")
                          setFlashcardSorting("Difficulty (descending)");
                        if (flashcardSorting === "Difficulty (descending)")
                          setFlashcardSorting("Default");
                      }}
                    >
                      {flashcardSorting}
                    </button>
                  </div>
                  <div className="w-[100%] h-[20vh] flex flex-col border-solid border-t-0 border-r-0 border-l-0 text-3xl">
                    <div className="mx-auto text-blue-700 my-auto">Most Missed Question</div>
                    <div className="mx-auto my-auto">{mostMissed.question}</div>
                    <div className="flex justify-between my-auto">
                      <div className="flex flex-1">
                        <div className="mx-auto">Correct: {mostMissed.correct}</div>
                      </div>
                      <div className="flex flex-1">
                        <div className="mx-auto">Answered: {mostMissed.answered}</div>
                      </div>
                      <div className="flex flex-1">
                        <div className="mx-auto">
                          Accuracy: {percentage(mostMissed.correct, mostMissed.answered)}
                        </div>
                      </div>
                    </div>
                  </div>
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

                <div className="border-solid w-[80%] mt-8 h-[60vh] mx-auto overflow-y-auto relative text-xl">
                  <div className="flex absolute top-4 right-8">
                    <div> Students sorted by:</div>
                    <button
                      className="font-Ubuntu mx-2 w-[10vw] text-center text-md"
                      onClick={() => {
                        if (studentSorting === "Rank") setStudentSorting("Accuracy (ascending)");
                        if (studentSorting === "Accuracy (ascending)")
                          setStudentSorting("Accuracy (descending)");
                        if (studentSorting === "Accuracy (descending)") setStudentSorting("Rank");
                      }}
                    >
                      {studentSorting}
                    </button>
                  </div>
                  <div className="w-[100%] h-[15vh] flex flex-col border-solid border-t-0 border-r-0 border-l-0 text-3xl">
                    <div className="mx-auto text-blue-700 my-auto">Class Statistics</div>
                    <div className="flex justify-between my-auto">
                      <div className="flex flex-1">
                        <div className="mx-auto">Correct: {classStats.correct}</div>
                      </div>
                      <div className="flex flex-1">
                        <div className="mx-auto">Answered: {classStats.answered}</div>
                      </div>
                      <div className="flex flex-1">
                        <div className="mx-auto">Accuracy: {classStats.accuracy}</div>
                      </div>
                    </div>
                  </div>

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
