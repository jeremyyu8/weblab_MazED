import React, { useState, useEffect } from "react";
import { get, post } from "../../../utilities";
/**
 * teacher end page after the game ends
 *
 * @param {string} _id user _id
 * @param {object} gameState game state
 * @param {string} gamePin game pin
 * @param {string} gameMode gameMode
 */
const TeacherEndPage = (props) => {
  const [displayData, setDisplayData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(false);

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

  // level completion times
  // completion times
  const compute_last_completion_time = (player) => {
    let level = player["level"];
    if (level === 0) {
      return "N/A";
    } else {
      let time = convertToTime(player[`level${level - 1}completion`]);
      return time;
    }
  };

  // load data
  useEffect(() => {
    const saveGame = async () => {
      try {
        console.log("saving game rn");
        await post("/api/savegame", { gamestate: props.gameState });
        setLoading(false);
        setSaved(true);
        setTimeout(() => {
          setSaved(false);
        }, 2000);
      } catch (err) {
        console.log(err);
        setLoading(false);
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 2000);
      }
    };
    saveGame();
  }, []);

  useEffect(() => {
    // sort players by rank first
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
        <>
          <td className="w-[15%] text-[2vw]">{props.gameState["players"][playerid]["rank"]}</td>
          <td className="w-[30%] text-[2vw]">{props.gameState["players"][playerid]["name"]}</td>
          <td className="w-[15%] text-[2vw]">
            {props.gameState["players"][playerid]["level"] === 4
              ? "Finished"
              : props.gameState["players"][playerid]["level"]}
          </td>
          <td className="w-[25%] text-[2vw]">
            {compute_last_completion_time(props.gameState["players"][playerid])}
          </td>
          <td className="w-[15%] text-[2vw]">{props.gameState["players"][playerid]["tags"]}</td>
          {/* <td>{props.gameState["players"][playerid]["flashcards_total"]}</td> */}
          {/* <td>{props.gameState["players"][playerid]["tags"]}</td>
            <td>{props.gameState["players"][playerid]["speed"]}</td>
            <td>{props.gameState["players"][playerid]["power"]}</td>
            <td>{props.gameState["players"][playerid]["active"] ? "true" : "false"}</td> */}
        </>
      );
      if (props.gameState["players"][playerid]["active"]) {
        playerData.push(<tr className="border-solid h-[15vh]">{curPlayer}</tr>);
        playerData.push(<tr className="border-solid h-[15vh]">{curPlayer}</tr>);
        playerData.push(<tr className="border-solid h-[15vh]">{curPlayer}</tr>);
        playerData.push(<tr className="border-solid h-[15vh]">{curPlayer}</tr>);
        playerData.push(<tr className="border-solid h-[15vh]">{curPlayer}</tr>);
        playerData.push(<tr className="border-solid h-[15vh]">{curPlayer}</tr>);
        playerData.push(<tr className="border-solid h-[15vh]">{curPlayer}</tr>);
        playerData.push(<tr className="border-solid h-[15vh]">{curPlayer}</tr>);
        playerData.push(<tr className="border-solid h-[15vh]">{curPlayer}</tr>);
        playerData.push(<tr className="border-solid h-[15vh]">{curPlayer}</tr>);
        playerData.push(<tr className="border-solid h-[15vh]">{curPlayer}</tr>);
        playerData.push(<tr className="border-solid h-[15vh]">{curPlayer}</tr>);
      } else {
        playerData.push(<tr className="outline-red-300 outline-4">{curPlayer}</tr>);
      }
    });
    setDisplayData(playerData);
  }, []);

  return (
    <>
      <div className="background">
        {loading && (
          <div className="fixed top-[5vh] left-[8vw] text-[3vw] text-green-500">
            Saving game data ... do not exit the page
          </div>
        )}
        {saved && (
          <div className="fixed top-[5vh] left-[8vw] text-[3vw] text-green-500">Saved!</div>
        )}
        {error && (
          <div className="fixed top-[5vh] left-[8vw] text-[3vw] text-red-500">
            Error saving data, oops
          </div>
        )}
        <div className="sheerbox w-[100%] h-[100%] overflow-y-hidden">
          <div className="text-5xl">Game Results</div>
          <div className="flex-none flex-col mt-4 m-2 w-[90%] text-center">
            {displayData.length ? (
              <>
                <div className="overflow-y-scroll h-[75vh] border-solid">
                  <div className="absolute w-[90%] flex h-[11vh] border-solid z-10 bg-black opacity-100">
                    <div className="w-[15%] text-[3vw] py-[3vh]">Rank</div>
                    <div className="w-[30%] text-[3vw] py-[3vh]">Name</div>
                    <div className="w-[15%] text-[3vw] py-[3vh]">Level</div>
                    <div className="w-[25%] text-[3vw] py-[3vh]">Time</div>
                    <div className="w-[15%] text-[3vw] py-[3vh]">Tags</div>
                  </div>
                  <div className="h-[11vh]"></div>
                  <table className="w-full text-xl p-2 rounded-xl">
                    {/* <thead>
                      <tr className="h-[10vh]">
                        <th className="w-[20%]">Rank</th>
                        <th className="w-[20%]">Name</th>
                        <th className="w-[20%]">Level</th>
                        <th className="w-[20%]">Total time</th>
                        {/* <th>Questions Answered</th>
                        <th># Players Tagged</th>
                        <th>Speed</th>
                        <th>Power</th>
                        <th>Active</th> */}
                    {/* </tr> */}
                    {/* </thead> */}
                    <tbody>{displayData}</tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="pt-3">No one played the game :(</div>
            )}
          </div>
          <div className="flex justify-center mt-2">
            <button
              className="editfbuttons font-Ubuntu w-[30vw] text-[1.5vw]"
              onClick={() => {
                window.location.replace("/");
              }}
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherEndPage;
