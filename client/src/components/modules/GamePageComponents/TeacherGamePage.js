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

  // dimension of teacher game page window
  const [windowDimension, setWindowDimension] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // on window change
  useEffect(() => {
    if (
      Math.abs(window.innerWidth - windowDimension.width) > 20 ||
      Math.abs(window.innerHeight - windowDimension.height) > 20
    ) {
      setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
    }
  }, [props.gameState]);

  // canvas reference
  const teacherCanvasRef1 = useRef(null);
  const teacherCanvasRef2 = useRef(null);
  const teacherCanvasRef3 = useRef(null);

  useEffect(() => {
    if (props.gameState) {
      // console.log(props.gameState["players"]);
      let playerData = [];
      for (let playerid in props.gameState["players"]) {
        if (playerid !== props.gameState["teacher"]["_id"]) {
          let curPlayer = (
            <div key={playerData.length}>
              <div className="text-[2vw]">{props.gameState["players"][playerid]["name"]}</div>
              <div>Current Level: {props.gameState["players"][playerid]["level"]}</div>
              <div>x: {Math.round(props.gameState["players"][playerid].p.x * 100) / 100}</div>
              <div>y: {Math.round(props.gameState["players"][playerid].p.y * 100) / 100}</div>
              <div>
                questions answered: {props.gameState["players"][playerid]["flashcards_total"]}
              </div>
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
        }
      }

      drawTeacherCanvas(
        {
          players: props.gameState["players"],
          map: props.mazes["level1"],
          teacherid: props.gameState["teacher"]["_id"],
          level: 1,
        },
        teacherCanvasRef1,
        windowDimension.width * windowRatio
      );
      drawTeacherCanvas(
        {
          players: props.gameState["players"],
          map: props.mazes["level2"],
          teacherid: props.gameState["teacher"]["_id"],
          level: 2,
        },
        teacherCanvasRef2,
        windowDimension.width * windowRatio
      );
      drawTeacherCanvas(
        {
          players: props.gameState["players"],
          map: props.mazes["level3"],
          teacherid: props.gameState["teacher"]["_id"],
          level: 3,
        },
        teacherCanvasRef3,
        windowDimension.width * windowRatio
      );
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
          <div>
            <div className="pt-4 text-[1vw]">Level 1</div>
            <canvas
              className="p-4"
              ref={teacherCanvasRef1}
              width={windowDimension.width * 1 * windowRatio}
              height={windowDimension.width * 1 * windowRatio}
            />
          </div>
          <div>
            <div className="pt-4 text-[1vw]">Level 2</div>
            <canvas
              className="p-4"
              ref={teacherCanvasRef2}
              width={windowDimension.width * 1 * windowRatio}
              height={windowDimension.width * 1 * windowRatio}
            />
          </div>
          <div>
            <div className="pt-4 text-[1vw]">Level 3</div>
            <canvas
              className="p-4"
              ref={teacherCanvasRef3}
              width={windowDimension.width * 1 * windowRatio}
              height={windowDimension.width * 1 * windowRatio}
            />
          </div>
        </div>
      </div>
      <div>
        <hr />
      </div>
      <button onClick={() => endGame(props.pin)}>End game</button>
      <button onClick={() => extendGame(props.pin)}>Extend game</button>
    </>
  );
};

export default TeacherGamePage;
