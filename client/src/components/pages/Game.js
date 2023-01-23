import React, { useEffect, useRef, useState } from "react";
import { socket, move, updateWindowSize, startGame } from "../../client-socket.js";

import { drawCanvas } from "../../canvasManager";
import { Redirect } from "@reach/router";
import { get, post } from "../../utilities.js";

import Question from "../modules/GamePageComponents/Question.js";
import TeacherGamePage from "../modules/GamePageComponents/TeacherGamePage.js";

const Game = () => {
  // metadata
  const [gamePin, setGamePin] = useState(undefined); // user game pin
  const [userData, setUserData] = useState(undefined); // user data
  const [status, setStatus] = useState("lobby");

  // redirect logic
  const [redirect, setRedirect] = useState(false);

  // flashcards
  const [questionShowing, setQuestionShowing] = useState(false);
  const [flashCardSet, setFlashCardSet] = useState(undefined);
  const [curQuestion, setCurQuestion] = useState(undefined);
  const [newLevelCard, setNewLevelCard] = useState(false);

  // game data
  const [level, setLevel] = useState(undefined);
  const [tokens, setTokens] = useState(undefined);
  const [speed, setSpeed] = useState(undefined);
  const [power, setPower] = useState(undefined);

  // dimension of game window
  const [windowDimension, setWindowDimension] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const canvasRef = useRef(null); // canvas reference

  // authentication
  useEffect(() => {
    get("/api/userbyid")
      .then((data) => {
        console.log(data);
        setUserData(data);
        socket.emit("getPin", data._id);
      })
      .catch((err) => {
        console.log("error");
        console.log(err);
        setRedirect(true);
      });
  }, []);

  // load game pin
  useEffect(() => {
    socket.on("receivePin", (data) => {
      setGamePin(data.pin);
      setFlashCardSet(data.cards);
    });
  }, [gamePin, userData]);

  let pressed = { up: false, down: false, left: false, right: false };

  useEffect(() => {
    socket.on("update", (update) => {
      if (userData && gamePin) {
        processUpdate(update[gamePin], userData._id);
      }
    });
  }, [userData, gamePin]);

  // add event listener to user key inputs
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("resize", handleResize);
    };
  }, [userData, gamePin]);

  // set the window size when they log in
  useEffect(() => {
    if (userData && gamePin) {
      updateWindowSize({
        x: window.innerWidth,
        y: window.innerHeight,
        _id: userData._id,
        pin: gamePin,
      });
    }
  }, [userData, gamePin]);

  // update window size whenever it changes
  const handleResize = () => {
    console.log("handle resize");
    if (userData && gamePin) {
      updateWindowSize({
        x: window.innerWidth,
        y: window.innerHeight,
        _id: userData._id,
        pin: gamePin,
      });
      setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === "ArrowUp") {
      pressed["up"] = false;
    }
    if (e.key === "ArrowDown") {
      pressed["down"] = false;
    }
    if (e.key === "ArrowLeft") {
      pressed["left"] = false;
    }
    if (e.key === "ArrowRight") {
      pressed["right"] = false;
    }
    if (userData && gamePin) {
      move(pressed, userData._id, gamePin);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      pressed["up"] = true;
    }
    if (e.key === "ArrowDown") {
      pressed["down"] = true;
    }
    if (e.key === "ArrowLeft") {
      pressed["left"] = true;
    }
    if (e.key === "ArrowRight") {
      pressed["right"] = true;
    }
    if (userData && gamePin) {
      move(pressed, userData._id, gamePin);
    }
  };

  const processUpdate = (update, _id) => {
    drawCanvas(update, canvasRef, _id);
    if (update["status"] !== status) {
      setStatus(update["status"]);
    }
    if (update["players"][_id]["level"] !== level) {
      setLevel(update["players"][_id]["level"]);
    }
    if (update["players"][_id]["tokens"] !== tokens) {
      setTokens(update["players"][_id]["tokens"]);
    }
    if (update["players"][_id]["speed"] !== speed) {
      setSpeed(update["players"][_id]["speed"]);
    }
    if (update["players"][_id]["power"] !== power) {
      setPower(update["players"][_id]["power"]);
    }
  };

  const handleNewQuestion = () => {
    if (flashCardSet) {
      setCurQuestion(flashCardSet[Math.random() * flashCardSet.length]);
      setQuestionShowing(true);
    }
  };

  const handleStartGame = () => {
    console.log("handling start game");
    setStatus("game");
    startGame(gamePin);
  };

  return (
    <>
      {redirect ? (
        <Redirect from="/game" to="/login" />
      ) : (
        <>
          {userData &&
            ((userData.role === "teacher" && status === "lobby") ||
              userData.role === "student") && (
              <div className="fixed w-full h-full z-0">
                <canvas
                  ref={canvasRef}
                  width={windowDimension.width}
                  height={windowDimension.height}
                />
              </div>
            )}
          {status === "lobby" && userData && userData.role === "teacher" && gamePin && (
            <>
              <div className="bg-white bg-opacity-30 fixed z-10 w-full h-auto p-[4vh]">
                <div className="text-center text-4xl">Join at localhost:5050</div>
                <div className="text-center text-4xl">PIN: {gamePin}</div>
              </div>
              <div className="bg-white bg-opacity-30 fixed z-10 w-[100%] h-auto bottom-0">
                <div className="flex justify-between text-3xl">
                  <div className="p-[3vh] hover:text-blue-500 cursor-pointer transition-all text-md">
                    Active players
                  </div>
                  <div
                    className="p-[3vh] hover:text-blue-500 cursor-pointer transition-all text-md"
                    onClick={handleStartGame}
                  >
                    Start Game
                  </div>
                  <div className="p-[3vh] hover:text-blue-500 cursor-pointer transition-all text-md">
                    Rules and settings
                  </div>
                </div>
              </div>
            </>
          )}
          {status !== "lobby" && userData && userData.role === "student" && gamePin && (
            <>
              <button onClick={handleNewQuestion} className="">
                Answer Question
              </button>
              <div className="bg-white bg-opacity-30 fixed z-10 w-[20vh] h-[20vh] top-[2vh] border-solid">
                <div className="text-center text-xl mt-[2vh]">Upgrades</div>
                <div className="my-[1vh] mx-[2vw]">
                  <table className="table-auto text-md">
                    <tbody>
                      <tr>
                        <td>Tokens:</td> <td>{tokens}</td>
                      </tr>
                      <tr>
                        <td>Speed:</td> <td>{speed}</td>
                      </tr>
                      <tr>
                        <td>Power:</td> <td>{power}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="bg-white bg-opacity-30 fixed z-10 w-[25vh] h-[25vh] bottom-[2vh] right-0 border-solid">
                <div>Minimap</div>
                <div>Level: {level}</div>
              </div>
            </>
          )}
          {status !== "lobby" && userData && userData.role === "teacher" && gamePin && (
            <>
              <TeacherGamePage />
              <div>pin: {gamePin}</div>
            </>
          )}
          {questionShowing && (
            <Question
              question={curQuestion.question}
              choices={curQuestion.choices}
              answers={curQuestion.answers}
              setQuestionShowing={setQuestionShowing}
            />
          )}
        </>
      )}
    </>
  );
};

export default Game;
