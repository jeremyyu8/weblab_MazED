import React, { useState, useEffect } from "react";

/**
 * student end page after the game ends
 *
 * @param {string} _id user _id
 * @param {object} gameState game state
 * @param {string} gamePin game pin
 */
const StudentEndPage = (props) => {
  const [displayData, setDisplayData] = useState([]);

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

  useEffect(() => {
    let dataDisplay = [];
    // name
    dataDisplay.push(
      <div className="text-3xl">
        Your statistics: ({props.gameState["players"][props._id]["name"]})
      </div>
    );
    // level
    dataDisplay.push(
      <div>
        Level:{" "}
        {props.gameState["players"][playerid]["level"] === 4
          ? "Final lobby (finished)"
          : props.gameState["players"][playerid]["level"]}
      </div>
    );

    // completion times
    let level = props.gameState["players"][props._id]["level"];
    for (let i = 1; i < level; i++) {
      let time;
      if (i === 1) {
        time = convertToTime(props.gameState["players"][props._id][`level${i}completion`]);
      } else if (i === 2 || i === 3) {
        time = convertToTime(
          props.gameState["players"][props._id][`level${i}completion`] -
            props.gameState["players"][props._id][`level${i - 1}completion`]
        );
      }
      let levelcompletionstring = `Time to complete level ${i}: ${time}`;
      dataDisplay.push(<div>{levelcompletionstring}</div>);
    }
    if (level == 4) {
      dataDisplay.push(
        <div>
          Time to complete game:{" "}
          {convertToTime(props.gameState["players"][props._id]["level3completion"])}
        </div>
      );
    }

    // x coord
    dataDisplay.push(
      <div>x: {Math.round(props.gameState["players"][props._id].p.x * 100) / 100}</div>
    );

    // y coord
    dataDisplay.push(
      <div>y: {Math.round(props.gameState["players"][props._id].p.y * 100) / 100}</div>
    );

    // questions data
    dataDisplay.push(
      <div>questions correct: {props.gameState["players"][props._id]["flashcards_correct"]}</div>
    );
    dataDisplay.push(
      <div>questions answered: {props.gameState["players"][props._id]["flashcards_total"]}</div>
    );
    dataDisplay.push(
      <div>
        % correct:
        {Math.floor(
          (100 * props.gameState["players"][props._id]["flashcards_correct"]) /
            props.gameState["players"][props._id]["flashcards_total"]
        )}
      </div>
    );

    // tagged data
    dataDisplay.push(
      <div>number of people tagged: {props.gameState["players"][props._id]["tags"]}</div>
    );
    dataDisplay.push(
      <div>
        number of times you were tagged: {props.gameState["players"][props._id]["numtagged"]}
      </div>
    );

    // other stats
    dataDisplay.push(<div>speed: {props.gameState["players"][props._id]["speed"]}</div>);
    dataDisplay.push(<div>power: {props.gameState["players"][props._id]["power"]}</div>);
    dataDisplay.push(
      <div>active: {props.gameState["players"][props._id]["active"] ? "true" : "false"}</div>
    );

    setDisplayData(<div>{dataDisplay}</div>);
  }, []);

  return (
    <>
    <div className="background">
      <div className="sheerbox">
      <div>Student End Game Page</div>
      <div className="text-4xl">Game Ended</div>
      <div>{displayData}</div>
      </div>

    </div>

    </>
  );
};

export default StudentEndPage;
