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
  const [timeRemaining, setTimeRemaining] = useState(undefined);

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
      <div className="text-center text-4xl">Pin: {props.pin}</div>
      <div>
        <div className="text-4xl">Players:</div>
        <div>{players}</div>
        <hr />
        <div>Time Remaining:</div>
        <div>{timeRemaining}</div>
      </div>
      <button onClick={() => endGame(props.pin)}>End game</button>
    </>
  );
};

export default TeacherGamePage;
