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
        <div className="flex flex-col m-5">
          <div className="text-[2vw] mx-auto">Level {idx}</div>
          <canvas
            className="my-5"
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
          <div className="border-solid p-5" key={playerData.length}>
            <div className="text-[1.5vw]">
              <span className="text-blue-600">{props.gameState["players"][playerid]["name"]} </span>
              ({props.gameState["players"][playerid]["displayname"]})
            </div>
            <div className="mt-1">Rank: {props.gameState["players"][playerid]["rank"]}</div>
            <div className="mt-1">
              Level:{" "}
              {props.gameState["players"][playerid]["level"] === 4
                ? "Finished"
                : props.gameState["players"][playerid]["level"]}
            </div>
            {/* <div>x: {Math.round(props.gameState["players"][playerid].p.x * 100) / 100}</div>
            <div>y: {Math.round(props.gameState["players"][playerid].p.y * 100) / 100}</div> */}
            <div className="mt-1">
              Questions Answered: {props.gameState["players"][playerid]["flashcards_total"]}
            </div>
            <div className="mt-1">Tags: {props.gameState["players"][playerid]["tags"]}</div>
            <div className="mt-1">
              Active: {props.gameState["players"][playerid]["active"] ? "Yes" : "No"}
            </div>
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
    <div className="background">
      <div className="sheerbox w-[80%] h-full overflow-x-hidden overflow-y-hidden flex-col">
        <div className="flex justify-center h-[10vw] w-full border-solid basis-1/5">
          <div className="text-[4vw] basis-1/3 flex">
            <div className="mx-auto my-auto">Pin: {props.pin}</div>
          </div>
          <div className="text-[4vw] flex-1 flex">
            <div className="mx-auto my-auto">Time remaining: {convertToTime(timeRemaining)}</div>
          </div>
        </div>
        <div className="flex border-solid max-w-[100%]">
          <div className=" basis-2/6 mx-auto overflow-y-scroll no-scrollbar flex flex-col">
            <div className="text-[2vw] mx-auto transform translate-x-[1vw] mt-[2vw]">Players:</div>
            <div className="border-solid h-full ml-[2vw] my-[2vw] p-4 text-[1vw]">{players}</div>
          </div>
          <div className="flex-1 flex border-solid overflow-x-scroll mx-[2vw] my-[2vw] no-scrollbar">
            {teacherCanvasDivs}
          </div>
        </div>
        <div className="flex mt-10">
          <button className="editfbuttons w-[20vw]" onClick={() => endGame(props.pin)}>
            End game
          </button>
          <div className="basis-1/3"></div>
          <button className="editfbuttons w-[20vw]" onClick={() => extendGame(props.pin)}>
            Extend game (2 minutes)
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherGamePage;
