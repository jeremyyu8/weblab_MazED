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

  useEffect(() => {
    setDisplayData(
      <div>
        <div className="text-3xl">
          Your statistics: ({props.gameState["players"][props._id]["name"]})
        </div>
        <div>Level: {props.gameState["players"][props._id]["level"]}</div>
        <div>x: {Math.round(props.gameState["players"][props._id].p.x * 100) / 100}</div>
        <div>y: {Math.round(props.gameState["players"][props._id].p.y * 100) / 100}</div>
        <div>questions correct: {props.gameState["players"][props._id]["flashcards_correct"]}</div>
        <div>questions answered: {props.gameState["players"][props._id]["flashcards_total"]}</div>
        <div>number of people tagged: {props.gameState["players"][props._id]["tags"]}</div>
        <div>active: {props.gameState["players"][props._id]["active"] ? "true" : "false"}</div>
      </div>
    );
  }, []);

  return (
    <>
      <div>Student End Game Page</div>
      <div className="text-4xl">Game Ended</div>
      <div>{displayData}</div>
    </>
  );
};

export default StudentEndPage;
