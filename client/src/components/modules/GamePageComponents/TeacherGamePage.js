import React, { useState, useEffect } from "react";
import { endGame } from "../../../client-socket";

/**
 * teacher game page to display during the game
 *
 * Proptypes
 * @param {object} gameState holds all game data to parse and render on the teacher page
 * @param {string} pin the game pin
 */
const TeacherGamePage = (props) => {
  const [players, setPlayers] = useState(undefined);

  useEffect(() => {
    if (props.gameState) {
      // console.log(props.gameState["players"]);
      let playerData = [];
      for (let playerid in props.gameState["players"]) {
        if (playerid !== props.gameState["teacher"]["_id"]) {
          playerData.push(
            <div key={playerData.length} className="flex">
              <div className="pr-4">Player: {props.gameState["players"][playerid]["name"]}</div>
              <div className="pr-4">
                Current Level: {props.gameState["players"][playerid]["level"]}
              </div>
              <div className="pr-4">
                x: {Math.round(props.gameState["players"][playerid].p.x * 100) / 100}
              </div>
              <div className="pr-4">
                y: {Math.round(props.gameState["players"][playerid].p.y * 100) / 100}
              </div>
            </div>
          );
        }
      }
      setPlayers(playerData);
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
      <div className="text-center text-4xl">Pin: {props.pin}</div>
      <div>
        Game state:
        <div>Players:</div>
        <div>{players}</div>
        <div>Time Remaining:</div>
        <div>{convertToTime(props.gameState["timeRemaining"])}</div>
      </div>
      <button onClick={() => endGame(props.pin)}>End game</button>
    </>
  );
};

export default TeacherGamePage;
