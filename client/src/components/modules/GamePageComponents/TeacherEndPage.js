import React, { useState, useEffect } from "react";
import { Link } from "@reach/router";
/**
 * teacher end page after the game ends
 *
 * @param {string} _id user _id
 * @param {object} gameState game state
 * @param {string} gamePin game pin
 */
const TeacherEndPage = (props) => {
  const [displayData, setDisplayData] = useState([]);

  useEffect(() => {
    let playerData = [];
    for (let playerid in props.gameState["players"]) {
      if (playerid !== props.gameState["teacher"]["_id"]) {
        let curPlayer = (
          <>
            <td>{props.gameState["players"][playerid]["name"]}</td>
            <td>
              {props.gameState["players"][playerid]["level"] === 4
                ? "Final lobby (finished)"
                : props.gameState["players"][playerid]["level"]}
            </td>
            <td>{props.gameState["players"][playerid]["flashcards_total"]}</td>
            <td>{props.gameState["players"][playerid]["tags"]}</td>
            <td>{props.gameState["players"][playerid]["speed"]}</td>
            <td>{props.gameState["players"][playerid]["power"]}</td>
            <td>{props.gameState["players"][playerid]["active"] ? "true" : "false"}</td>
          </>
        );
        if (props.gameState["players"][playerid]["active"]) {
          playerData.push(<tr className="p-2">{curPlayer}</tr>);
        } else {
          playerData.push(<div className="text-gray-400">{curPlayer}</div>);
        }
      }
    }
    setDisplayData(playerData);
  }, []);

  return (
    <>
      <div className="background">
        <div className="sheerbox w-[80%]">
          <div className="text-5xl">Game Results</div>
          <div className="flex-none flex-col mt-4 m-2 w-[90%] text-center">
            {displayData.length ? (
              <>
                <div className="overflow-y-scroll h-[70vh]">
                  <table class="table-auto w-full text-xl p-2 border-solid rounded-xl">
                    <thead>
                      <tr>
                        <th>Player Name</th>
                        <th>Level</th>
                        <th>Questions Answered</th>
                        <th># Players Tagged</th>
                        <th>Speed</th>
                        <th>Power</th>
                        <th>Active</th>
                      </tr>
                    </thead>
                    <tbody>{displayData}</tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="pt-3">No one played the game :(</div>
            )}
          </div>
          <div className="flex justify-center mt-3">
            <button className="editfbuttons font-Ubuntu">
              <Link to="/" className="no-underline text-black">
                Return to Dashboard
              </Link>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherEndPage;
