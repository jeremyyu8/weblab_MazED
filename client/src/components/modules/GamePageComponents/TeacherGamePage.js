import React, { useState, useEffect, useRef } from "react";
import { endGame, extendGame } from "../../../client-socket";
import { drawTeacherCanvas } from "../../../canvasManagerTeacher";

/**
 * teacher game page to display during the game
 *
 * Proptypes
 * @param {object} gameState holds all game data to parse and render on the teacher page
 * @param {string} pin the game pin
 */
const TeacherGamePage = (props) => {
  const [players, setPlayers] = useState(undefined);
  const [timeRemaining, setTimeRemaining] = useState(undefined);

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
              <div className="text-3xl">{props.gameState["players"][playerid]["name"]}</div>
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
            playerData.push(<div className="text-gray-400">{curPlayer}</div>);
          }
        }
      }

      drawTeacherCanvas(
        {
          players: props.gameState["players"],
          map: props.gameState["mazes"]["level1"],
          teacherid: props.gameState["teacher"]["_id"],
          level: 1,
        },
        teacherCanvasRef1
      );
      drawTeacherCanvas(
        {
          players: props.gameState["players"],
          map: props.gameState["mazes"]["level2"],
          teacherid: props.gameState["teacher"]["_id"],
          level: 2,
        },
        teacherCanvasRef2
      );
      drawTeacherCanvas(
        {
          players: props.gameState["players"],
          map: props.gameState["mazes"]["level3"],
          teacherid: props.gameState["teacher"]["_id"],
          level: 3,
        },
        teacherCanvasRef3
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
      <div>This is the teacher game page.</div>
      <div className="text-center text-6xl">Pin: {props.pin}</div>
      <div className="flex border-solid overflow-x-scroll h-[400px]">
        <canvas className="p-4" ref={teacherCanvasRef1} width="400px" height="400px" />
        <canvas className="p-4" ref={teacherCanvasRef2} width="400px" height="400px" />
        <canvas className="p-4" ref={teacherCanvasRef3} width="400px" height="400px" />
      </div>
      <div>
        <div className="text-4xl">Players:</div>
        <div>{players}</div>
        <hr />
        <div>Time Remaining:</div>
        <div>{timeRemaining}</div>
      </div>
      <button onClick={() => endGame(props.pin)}>End game</button>
      <button onClick={() => extendGame(props.pin)}>Extend game</button>
    </>
  );
};

export default TeacherGamePage;
