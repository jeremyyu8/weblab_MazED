import React, { useState, useEffect, useRef } from "react";
import { endGame, extendGame } from "../../../client-socket";
import { drawTeacherCanvas } from "../../../canvasManagerTeacher";

/**
 * teacher game page to display during the game
 *
 * Proptypes
 * @param {object} gameState holds all game data to parse and render on the teacher page
 * @param {string} pin the game pin
 * @param {object} mazes has mazes to render
 */
const TeacherGamePage = (props) => {
  const windowRatio = 1 / 4;
  const [players, setPlayers] = useState(undefined);
  const [timeRemaining, setTimeRemaining] = useState(undefined);
  const [teacherCanvasDivs, setTeacherCanvasDivs] = useState([]);

  // dimension of teacher game page window
  const [windowDimension, setWindowDimension] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // on window change
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleResize = () => {
    setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
  };

  // canvas reference
  const teacherCanvasRef0 = useRef(null);
  const teacherCanvasRef1 = useRef(null);
  const teacherCanvasRef2 = useRef(null);
  const teacherCanvasRef3 = useRef(null);
  const teacherCanvasRef4 = useRef(null);
  const teacherCanvasRef5 = useRef(null);
  const teacherCanvasRef6 = useRef(null);
  const teacherCanvasRef7 = useRef(null);
  const teacherCanvasRef8 = useRef(null);
  const teacherCanvasRef9 = useRef(null);
  let teacherCanvasRefMap = {};
  teacherCanvasRefMap[0] = teacherCanvasRef0;
  teacherCanvasRefMap[1] = teacherCanvasRef1;
  teacherCanvasRefMap[2] = teacherCanvasRef2;
  teacherCanvasRefMap[3] = teacherCanvasRef3;
  teacherCanvasRefMap[4] = teacherCanvasRef4;
  teacherCanvasRefMap[5] = teacherCanvasRef5;
  teacherCanvasRefMap[6] = teacherCanvasRef6;
  teacherCanvasRefMap[7] = teacherCanvasRef7;
  teacherCanvasRefMap[8] = teacherCanvasRef8;
  teacherCanvasRefMap[9] = teacherCanvasRef9;

  // set teacher canvas divs
  useEffect(() => {
    let canvasDivs = [];
    for (let idx = 0; idx < Object.keys(props.mazes).length - 2; idx++) {
      canvasDivs.push(
        <div>
          <div className="pt-4 text-[1vw]">Level {idx}</div>
          <canvas
            className="p-4"
            ref={teacherCanvasRefMap[idx]}
            width={windowDimension.width * 1 * windowRatio}
            height={windowDimension.width * 1 * windowRatio}
          />
        </div>
      );
    }
    setTeacherCanvasDivs(canvasDivs);
  }, []);

  useEffect(() => {
    if (props.gameState) {
      // first order player ids according to ranks
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

      let playerData = [];
      players.forEach((player) => {
        let playerid = player[0];
        let curPlayer = (
          <div key={playerData.length}>
            <div className="text-[1.5vw]">
              {props.gameState["players"][playerid]["name"]} (
              {props.gameState["players"][playerid]["displayname"]})
            </div>
            <div>Rank: {props.gameState["players"][playerid]["rank"]}</div>
            <div>
              Level:{" "}
              {props.gameState["players"][playerid]["level"] === 4
                ? "Finished"
                : props.gameState["players"][playerid]["level"]}
            </div>
            {/* <div>x: {Math.round(props.gameState["players"][playerid].p.x * 100) / 100}</div>
            <div>y: {Math.round(props.gameState["players"][playerid].p.y * 100) / 100}</div> */}
            <div>
              questions answered: {props.gameState["players"][playerid]["flashcards_total"]}
            </div>
            <div>tags: {props.gameState["players"][playerid]["tags"]}</div>
            <div>active: {props.gameState["players"][playerid]["active"] ? "true" : "false"}</div>
          </div>
        );
        if (props.gameState["players"][playerid]["active"]) {
          playerData.push(curPlayer);
        } else {
          playerData.push(
            <div key={playerData.length} className="text-gray-400">
              {curPlayer}
            </div>
          );
        }
      });

      for (let idx = 0; idx < Object.keys(props.mazes).length - 2; idx++) {
        drawTeacherCanvas(
          {
            players: props.gameState["players"],
            map: props.mazes[`level${idx}`],
            teacherid: props.gameState["teacher"]["_id"],
            level: idx,
          },
          teacherCanvasRefMap[idx],
          windowDimension.width * windowRatio
        );
      }

      setPlayers(playerData);
      setTimeRemaining(props.gameState["timeRemaining"]);
    }
  }, [props.gameState]);

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

  return (
    <>
      <div className="flex justify-center h-[10vw] border-solid">
        <div className="text-[4vw] p-8">Pin: {props.pin}</div>
        <div className="text-[4vw] p-8">Time remaining: {convertToTime(timeRemaining)}</div>
      </div>
      <div className="flex">
        <div className="basis-1/3 mx-auto border-solid overflow-y-scroll">
          <div className="text-[2vw] p-4">Players:</div>
          <div className="border-solid h-[25vw] p-4 text-[1vw]">{players}</div>
        </div>
        <div className="flex border-solid overflow-x-scroll h-[30vw] mr-[3vw]">
          {teacherCanvasDivs}
        </div>
      </div>
      <div>
        <hr />
      </div>
      <button onClick={() => endGame(props.pin)}>End game</button>
      <button onClick={() => extendGame(props.pin)}>Extend game (2 minutes)</button>
    </>
  );
};

export default TeacherGamePage;
