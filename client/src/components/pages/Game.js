import React, { useEffect, useRef, useState } from "react";
import {
  socket,
  move,
  updateWindowSize,
  startGame,
  upgradeSpeed,
  upgradePower,
  unlockBorder,
} from "../../client-socket.js";

import { drawCanvas } from "../../canvasManager";
import { Redirect } from "@reach/router";
import { get, post } from "../../utilities.js";

import Question from "../modules/GamePageComponents/Question.js";
import TeacherGamePage from "../modules/GamePageComponents/TeacherGamePage.js";

import TeacherEndPage from "../modules/GamePageComponents/TeacherEndPage.js";
import StudentEndPage from "../modules/GamePageComponents/StudentEndPage.js";

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

  // game data
  const [gameState, setGameState] = useState(undefined);
  const [level, setLevel] = useState(undefined);
  const [tokens, setTokens] = useState(undefined);
  const [speed, setSpeed] = useState(undefined);
  const [power, setPower] = useState(undefined);
  const [inBorderRange, setInBorderRange] = useState(false);
  const [bordersToUnlock, setBordersToUnlock] = useState([]);

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

  // load sockets
  useEffect(() => {
    socket.on("receivePin", (data) => {
      setGamePin(data.pin);
      setFlashCardSet(data.cards);
    });

    socket.on("update", (update) => {
      if (userData && gamePin) {
        processUpdate(update[gamePin], userData._id);
      }
    });

    socket.on("upgradeSpeedResult", (data) => {
      if (
        userData &&
        gamePin &&
        data.result == "failure" &&
        userData._id === data._id &&
        gamePin === data.pin
      ) {
        alert("Need more tokens to upgrade speed");
      }
    });

    socket.on("upgradePowerResult", (data) => {
      if (
        userData &&
        gamePin &&
        data.result == "failure" &&
        userData._id === data._id &&
        gamePin === data.pin
      ) {
        alert("Need more tokens to upgrade power");
      }
    });

    socket.on("unlockBorderResult", (data) => {
      if (
        userData &&
        gamePin &&
        data.result == "failure" &&
        userData._id === data._id &&
        gamePin === data.pin
      ) {
        alert("Need more tokens to unlock border");
      }
    });
  }, [gamePin, userData]);

  let pressed = { up: false, down: false, left: false, right: false };

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
    setGameState(update);

    //border distance checking
    let playerX = update["players"][_id].p.x;
    let playerY = update["players"][_id].p.y;

    let toOpen = [];
    let inRange = false;

    for (const border of update["players"][_id]["borders"]["level1"]) {
      const dist = Math.sqrt(
        (playerX - border.x) * (playerX - border.x) + (playerY - border.y) * (playerY - border.y)
      );

      if (dist < 1.2) {
        const mazeLength = Math.floor(Math.sqrt(update["mazes"]["level1"].length));

        let nearby = [];
        for (let i = border.x - 3; i <= border.x + 3; i++) {
          for (let j = border.y - 3; j <= border.y + 3; j++) {
            nearby.push(update["mazes"]["level1"][i + j * mazeLength]);
            if (update["mazes"]["level1"][i + j * mazeLength] === 2) {
              toOpen.push({ x: i, y: j });
            }
          }
        }
        inRange = true;
        break;
      }
    }
    setBordersToUnlock(toOpen);
    setInBorderRange(inRange);
  };

  const handleStartGame = () => {
    console.log("handling start game");
    setStatus("game");
    startGame(gamePin);
  };

  const handleUpgradeSpeed = () => {
    upgradeSpeed(userData._id, gamePin);
  };

  const handleUpgradePower = () => {
    upgradePower(userData._id, gamePin);
  };

  const handleBorderUnlock = () => {
    console.log("toUnlock", bordersToUnlock);
    unlockBorder(userData._id, gamePin, bordersToUnlock);
  };
  return (
    <>
      {redirect ? (
        <Redirect from="/game" to="/login" />
      ) : (
        <>
          {userData &&
            ((userData.role === "teacher" && status === "lobby") ||
              (userData.role === "student" && status !== "end")) && (
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

          {status !== "lobby" &&
            status !== "end" &&
            userData &&
            userData.role === "student" &&
            gamePin &&
            inBorderRange && (
              <>
                <button
                  className="text-3xl fixed top-[47%] left-[46%] z-50"
                  onClick={handleBorderUnlock}
                >
                  Press to unlock border
                </button>
              </>
            )}
          {status !== "lobby" &&
            status !== "end" &&
            userData &&
            userData.role === "student" &&
            gamePin && (
              <>
                <button
                  onClick={() => setQuestionShowing(true)}
                  className="bg-opacity-50 bg-blue-400 fixed z-10 left-[2vh] bottom-[2vh] text-2xl p-5 hover:bg-opacity-70"
                >
                  Answer Question
                </button>
                <div className="bg-white bg-opacity-30 fixed z-10 w-[20vh] h-[20vh] top-[2vh] left-[2vh] border-solid">
                  <div className="text-center text-xl mt-[2vh]">Upgrades</div>
                  <div className="my-[1vh] mx-[2vw]">
                    <table className="table-auto text-md">
                      <tbody>
                        <tr>
                          <td>Tokens:</td> <td>{tokens}</td>
                        </tr>
                        <tr>
                          <td>Speed:</td> <td>{speed}</td>{" "}
                          <button onClick={handleUpgradeSpeed}>upgrade</button>
                        </tr>
                        <tr>
                          <td>Power:</td> <td>{power}</td>{" "}
                          <button onClick={handleUpgradePower}>upgrade</button>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="bg-white bg-opacity-30 fixed z-10 w-[25vh] h-[25vh] bottom-[2vh] right-[2vh] border-solid">
                  <div>Minimap</div>
                  <div>Level: {level}</div>
                </div>
              </>
            )}
          {status !== "lobby" &&
            status !== "end" &&
            userData &&
            userData.role === "teacher" &&
            gamePin && (
              <>
                <TeacherGamePage gameState={gameState} pin={gamePin} />
              </>
            )}
          {questionShowing && (
            <Question
              flashCardSet={flashCardSet}
              setQuestionShowing={setQuestionShowing}
              userData={userData}
              gamePin={gamePin}
            />
          )}
          {status === "end" && userData && userData.role === "teacher" && <TeacherEndPage />}
          {status === "end" && userData && userData.role === "student" && <StudentEndPage />}
        </>
      )}
    </>
  );
};

export default Game;
