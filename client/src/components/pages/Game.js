import React, { useEffect, useRef, useState } from "react";
import { socket, move, updateWindowSize } from "../../client-socket.js";

import { drawCanvas } from "../../canvasManager";
import { Redirect } from "@reach/router";
import { get, post } from "../../utilities.js";

import Question from "../modules/GamePageComponents/Question.js";

const Game = () => {
  const [gamePin, setGamePin] = useState(undefined); // user game pin
  const [userData, setUserData] = useState(undefined); // user data
  const [redirect, setRedirect] = useState(false);
  const [level, setLevel] = useState("lobby");
  const [questionShowing, setQuestionShowing] = useState(false);
  const [flashCardSet, setFlashCardSet] = useState(undefined);
  const [curQuestion, setCurQuestion] = useState(undefined);
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
      console.log(data);
      setGamePin(data.pin);
      setFlashCardSet(data.cards);
      console.log("gamepin", gamePin);
      console.log("pin", data.pin);
    });
  }, [gamePin, userData]);

  let pressed = { up: false, down: false, left: false, right: false };

  useEffect(() => {
    socket.on("update", (update) => {
      // console.log(update);
      if (userData && gamePin) {
        processUpdate(update[gamePin], userData._id);
      } else {
        // console.log("no user data?");
      }
    });
    // drawCanvas({ p: { x: 0, y: 0 } }, canvasRef);
  }, [userData, gamePin]);

  // add event listener to user key inputs
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
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

  const handleKeyUp = (e) => {
    console.log(userData);
    console.log(gamePin);
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
  };

  const handleNewQuestion = () => {
    if (flashCardSet) {
      setCurQuestion(flashCardSet[Math.random() * flashCardSet.length]);
      setQuestionShowing(true);
    }
  };

  return (
    <>
      {redirect ? (
        <Redirect from="/game" to="/login" />
      ) : (
        <>
          <div className="fixed w-full h-full z-0">
            <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} />
          </div>
          {level === "lobby" && userData && userData.role === "teacher" && gamePin && (
            <>
              <div className="bg-white bg-opacity-30 fixed z-10 w-full h-auto p-[4vh]">
                <div className="text-center text-4xl">Join at localhost:5050</div>
                <div className="text-center text-4xl">PIN: {gamePin}</div>
              </div>
              <div className="bg-white bg-opacity-30 fixed z-10 w-[100%] h-auto bottom-0">
                <div className="flex justify-between text-3xl">
                  <div className="p-[3vh]">Active players</div>
                  <div className="p-[3vh]">Start Game</div>
                  <div className="p-[3vh]">Rules and settings</div>
                </div>
              </div>
            </>
          )}
          {level !== "lobby" && userData && userData.role === "student" && gamePin && (
            <button onClick={handleNewQuestion} className="">
              Answer Question
            </button>
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
