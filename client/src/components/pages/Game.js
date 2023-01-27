import React, { useEffect, useRef, useState } from "react";
import {
  socket,
  move,
  getMazes,
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
import RulesAndSettings from "../modules/GamePageComponents/RulesAndSettings.js";
import ActivePlayers from "../modules/GamePageComponents/ActivePlayers.js";

import "../../master.css";

const Game = () => {
  // metadata
  const [gamePin, setGamePin] = useState(undefined); // user game pin
  const [userData, setUserData] = useState(undefined); // user data
  const [status, setStatus] = useState("lobby");
  const [showRules, setShowRules] = useState(false);
  const [showActivePlayers, setShowActivePlayers] = useState(false);

  // redirect logic
  const [redirect, setRedirect] = useState(false);

  // flashcards
  const [questionShowing, setQuestionShowing] = useState(false);
  const [flashCardSet, setFlashCardSet] = useState(undefined);

  // game data
  const [mazes, setMazes] = useState(undefined);
  const [gameState, setGameState] = useState(undefined);
  const [level, setLevel] = useState(undefined);
  const [tokens, setTokens] = useState(undefined);
  const [speed, setSpeed] = useState(undefined);
  const [power, setPower] = useState(undefined);
  const [tagged, setTagged] = useState(false);
  const [taggedDisplay, setTaggedDisplay] = useState(false);
  const [taggedDisplayTimer, setTaggedDisplayTimer] = useState(undefined);
  const [promoted, setPromoted] = useState(false);
  const [inBorderRange, setInBorderRange] = useState(false);
  const [bordersToUnlock, setBordersToUnlock] = useState([]);
  const [level1CompletionTime, setLevel1CompletionTime] = useState(undefined);
  const [level2CompletionTime, setLevel2CompletionTime] = useState(undefined);
  const [level3CompletionTime, setLevel3CompletionTime] = useState(undefined);

  const [speedUpgradeFailed, setSpeedUpgradeFailed] = useState(false);
  const [powerUpgradeFailed, setPowerUpgradeFailed] = useState(false);
  const [borderUpgradeFailed, setBorderUpgradeFailed] = useState(false);

  // dimension of game window
  const [windowDimension, setWindowDimension] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // canvas reference
  const canvasRef = useRef(null);

  // frame counter
  let counter = 0;

  // convert to time
  const convertToTime = (seconds) => {
    let minutes = Math.floor(seconds / 60);
    let secs = seconds - 60 * minutes;
    if (minutes === 0) {
      minutes = minutes.toString() + "0";
    } else if (minutes < 10) {
      minutes = "0" + minutes.toString();
    }
    if (secs === 0) {
      secs = secs.toString() + "0";
    } else if (secs < 10) {
      secs = "0" + secs.toString();
    }
    return `${minutes}:${secs}`;
  };

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

  // get mazes
  useEffect(() => {
    if (gamePin) {
      getMazes(gamePin);
    }
  }, [gamePin]);

  // load sockets
  useEffect(() => {
    socket.on("receivePin", (data) => {
      setGamePin(data.pin);
      setFlashCardSet(data.cards);
    });

    // update is already parsed from pin
    socket.on("updateMazes", (update) => {
      setMazes(update);
    });

    socket.on("update", (update) => {
      if (userData && gamePin && mazes) {
        processUpdate(update[gamePin], userData._id);
      }
    });

    socket.on("upgradeSpeedResult", (data) => {
      console.log("received upgrade speed result");
      if (
        userData &&
        gamePin &&
        data.result == "failure" &&
        userData._id === data._id &&
        gamePin === data.pin
      ) {
        // alert("Need more tokens to upgrade speed");
        setSpeedUpgradeFailed(true);
        setTimeout(() => {
          setSpeedUpgradeFailed(false);
        }, 1000);
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
        // alert("Need more tokens to upgrade power");
        setPowerUpgradeFailed(true);
        setTimeout(() => {
          setPowerUpgradeFailed(false);
        }, 1000);
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
        setBorderUpgradeFailed(true);
        setTimeout(() => {
          setBorderUpgradeFailed(false);
        }, 1000);
      }
    });
  }, [gamePin, userData, mazes]);

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
  }, [userData, gamePin, questionShowing, promoted]);

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
    if (userData && gamePin) {
      console.log("handling resize");
      console.log("new", window.innerWidth, window.innerHeight);
      console.log("current", windowDimension.width, windowDimension.height);
      setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
      updateWindowSize({
        x: window.innerWidth,
        y: window.innerHeight,
        _id: userData._id,
        pin: gamePin,
      });
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
    if (userData && gamePin && !questionShowing && !promoted) {
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
    if (userData && gamePin && !questionShowing && !promoted) {
      move(pressed, userData._id, gamePin);
    }
  };

  const processUpdate = (update, _id) => {
    counter++;
    drawCanvas(update, canvasRef, _id, mazes);
    setStatus(update["status"]);
    setLevel(update["players"][_id]["level"]);
    setTokens(update["players"][_id]["tokens"]);
    setSpeed(update["players"][_id]["speed"]);
    setPower(update["players"][_id]["power"]);
    setTagged(update["players"][_id]["tagged"]);
    setLevel1CompletionTime(update["players"][_id]["level1completion"]);
    setLevel2CompletionTime(update["players"][_id]["level2completion"]);
    setLevel3CompletionTime(update["players"][_id]["level3completion"]);
    // setGameState(update);

    if (counter % 30 === 0) {
      setGameState(update);
      // handleResize();
    }

    //border distance checking
    let playerX = update["players"][_id].p.x;
    let playerY = update["players"][_id].p.y;

    let toOpen = [];
    let inRange = false;

    let leveltag = "level" + update["players"][_id]["level"];
    if (update["status"] !== "lobby" && update["status"] !== "end") {
      for (const border of update["players"][_id]["borders"][leveltag]) {
        const dist = Math.sqrt(
          (playerX - border.x) * (playerX - border.x) + (playerY - border.y) * (playerY - border.y)
        );
        // console.log(dist);

        if (dist < 1.2) {
          const mazeLength = Math.floor(Math.sqrt(mazes[leveltag].length));
          let nearby = [];
          for (let i = border.x - 3; i <= border.x + 3; i++) {
            for (let j = border.y - 3; j <= border.y + 3; j++) {
              nearby.push(mazes[leveltag][i + j * mazeLength]);
              if (mazes[leveltag][i + j * mazeLength] === 2) {
                toOpen.push({ x: i, y: j });
              }
            }
          }
          inRange = true;
          // break;
        }

        // if (counter % 15 === 0) {
        //   setBordersToUnlock(toOpen);
        //   setInBorderRange(inRange);
        // }
        if (counter % 15 === 0) {
          setBordersToUnlock(toOpen);
          setInBorderRange(inRange);
        }
        // console.log(inRange);
      }
    }
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

  const handleTagged = () => {
    setQuestionShowing(true);
    setTaggedDisplay(true);
    let time = 5;
    let timer = setInterval(() => {
      console.log(time);
      setTaggedDisplayTimer(time);
      time--;
    }, 1000);
    setTimeout(() => {
      setTaggedDisplay(false);
      clearInterval(timer);
    }, 6000);
    setTaggedDisplayTimer(5);
  };

  useEffect(() => {
    if (tagged !== false) {
      handleTagged();
    }
  }, [tagged]);

  useEffect(() => {
    if (level) {
      if (promoted === false) {
        console.log("level");
        console.log(level);
        setPromoted(true);
      }
    }
  }, [level]);

  useEffect(() => {
    if (status === "end") {
      setQuestionShowing(false);
    }
  }, [status]);

  const handleBorderUnlock = () => {
    console.log("clicking the button!");
    console.log(questionShowing);
    if (questionShowing) return;
    console.log("inside of handleborderunlock");
    console.log("toUnlock", bordersToUnlock);
    unlockBorder(userData._id, gamePin, bordersToUnlock);
  };

  return (
    <>
      {redirect ? (
        <Redirect from="/game" to="/login" />
      ) : (
        <div className="">
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
          {status === "lobby" && userData && userData.role === "student" && (
            <>
              <div className="bg-white bg-opacity-30 fixed z-10 w-[100%] h-auto bottom-0">
                <div className="flex justify-between text-3xl">
                  <div className="p-[3vh]">Welcome, {userData.name}</div>
                  <div
                    className="p-[3vh] hover:text-blue-500 cursor-pointer transition-all text-md"
                    onClick={() => {
                      setShowRules(true);
                    }}
                  >
                    Rules and settings
                  </div>
                </div>
              </div>
              {showRules && <RulesAndSettings setShowRules={setShowRules} />};
            </>
          )}
          {status === "lobby" && userData && userData.role === "teacher" && gamePin && (
            <>
              <div className="bg-white bg-opacity-30 fixed z-10 w-full h-auto p-[4vh]">
                <div className="text-center text-4xl">Join at mazed.herokuapp.com</div>
                <div className="text-center text-4xl">PIN: {gamePin}</div>
              </div>
              <div className="bg-white bg-opacity-30 fixed z-10 w-[100%] h-auto bottom-0">
                <div className="flex justify-between text-3xl">
                  <div
                    className="p-[3vh] hover:text-blue-500 cursor-pointer transition-all text-md"
                    onClick={() => {
                      if (!showRules) {
                        setShowActivePlayers(true);
                      } else {
                        setShowRules(false);
                        setShowActivePlayers(true);
                      }
                    }}
                  >
                    Active players
                  </div>
                  <div
                    className="p-[3vh] hover:text-blue-500 cursor-pointer transition-all text-md"
                    onClick={handleStartGame}
                  >
                    Start Game
                  </div>
                  <div
                    className="p-[3vh] hover:text-blue-500 cursor-pointer transition-all text-md"
                    onClick={() => {
                      if (!showActivePlayers) {
                        setShowRules(true);
                      } else {
                        setShowActivePlayers(false);
                        setShowRules(true);
                      }
                    }}
                  >
                    Rules and settings
                  </div>
                </div>
              </div>
              {showRules && <RulesAndSettings setShowRules={setShowRules} />}
              {showActivePlayers && gameState && gamePin && (
                <ActivePlayers
                  setShowActivePlayers={setShowActivePlayers}
                  activePlayers={gameState["players"]}
                  teacherId={gameState["teacher"]["_id"]}
                />
              )}
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
                  className={`text-2xl fixed top-[50%] left-[50%] z-20 ${
                    borderUpgradeFailed ? "animate-shake bg-red-300" : ""
                  }`}
                  onClick={handleBorderUnlock}
                >
                  500 tokens to unlock
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
                <div className="bg-white bg-opacity-30 fixed z-10 pb-5 top-[2vh] left-[2vh] border-solid">
                  <div className="text-center text-xl mt-[2vh]">Upgrades</div>
                  <div className="my-[1vh] mx-[2vw]">
                    <table className="table-auto text-md">
                      <tbody>
                        <tr>
                          <td>Tokens:</td> <td>{tokens}</td>
                        </tr>
                        <tr>
                          <td>Speed:</td> <td>{speed}</td>{" "}
                          <button
                            className={`ml-3 ${
                              speedUpgradeFailed ? "animate-shake bg-red-300" : ""
                            }`}
                            onClick={handleUpgradeSpeed}
                          >
                            {`${speed * 100 + 300} tokens to upgrade`}
                          </button>
                        </tr>
                        <tr>
                          <td>Power:</td> <td>{power}</td>{" "}
                          <button
                            className={`ml-3 ${
                              powerUpgradeFailed ? "animate-shake bg-red-300" : ""
                            }`}
                            onClick={handleUpgradePower}
                          >
                            {`${power * 100 + 500} tokens to upgrade`}
                          </button>
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
          {taggedDisplay !== false && (
            <div className="bg-red-600 bg-opacity-80 fixed w-[50vw] h-[30vh] left-[25vw] top-[35vh] border-solid z-50">
              <div className="text-4xl text-center mt-[10vh]">You just got tagged by {tagged}!</div>
              <div className="text-4xl text-center">{taggedDisplayTimer}</div>
            </div>
          )}
          {promoted && userData && userData.role === "student" && status === "game" && gamePin && (
            <>
              <div className="bg-white bg-opacity-80 fixed w-[50vw] h-[30vh] left-[25vw] top-[35vh] border-solid z-50">
                {level < 4 && <div className="text-4xl text-center mt-[10vh]">Level: {level}</div>}
                {level == 2 && (
                  <div className="text-xl text-center">
                    Time to complete level 1: {convertToTime(level1CompletionTime)}
                  </div>
                )}
                {level == 3 && (
                  <div className="text-xl text-center">
                    Time to complete level 2:{" "}
                    {convertToTime(level2CompletionTime - level1CompletionTime)}
                  </div>
                )}
                {level === 4 && (
                  <>
                    <div className="text-2xl text-center mt-[2vh]">
                      Congrats! You finished every maze. Feel free to keep answering questions and
                      tag other players as they finish!
                    </div>
                    <div className="text-xl text-center">
                      Final level completion time:{" "}
                      {convertToTime(level3CompletionTime - level2CompletionTime)}
                    </div>
                    <div className="text-xl text-center">
                      Game completion time: {convertToTime(level3CompletionTime)}
                    </div>
                  </>
                )}
                <div className="flex justify-center mt-[2vh]">
                  <button onClick={() => setPromoted(false)}>Close</button>
                </div>
              </div>
            </>
          )}
          {status !== "lobby" &&
            status !== "end" &&
            userData &&
            userData.role === "teacher" &&
            gamePin && (
              <>
                <TeacherGamePage gameState={gameState} pin={gamePin} mazes={mazes} />
              </>
            )}
          {questionShowing && (
            <Question
              flashCardSet={flashCardSet}
              setQuestionShowing={setQuestionShowing}
              userData={userData}
              gamePin={gamePin}
              tagged={tagged}
              taggedDisplay={taggedDisplay}
            />
          )}
          {status === "end" && userData && userData.role === "teacher" && (
            <TeacherEndPage _id={userData._id} gameState={gameState} />
          )}
          {status === "end" && userData && userData.role === "student" && (
            <StudentEndPage _id={userData._id} gameState={gameState} />
          )}
        </div>
      )}
    </>
  );
};

export default Game;
