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
          {props.gameMode === "individual" && (
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
            </>
          )}

          {props.gameMode === "infection" && (
            <>
              <td className="w-[29.4%] text-[2vw]">
                {props.gameState["players"][playerid]["name"]}
              </td>
              <td className="w-[14.4%] text-[2vw]">
                {props.gameState["players"][playerid]["level"] === 4
                  ? "Finished"
                  : props.gameState["players"][playerid]["level"]}
              </td>
              <td className="w-[24.4%] text-[2vw]">
                {compute_last_completion_time(props.gameState["players"][playerid])}
              </td>
              <td className="w-[14.4%] text-[2vw]">
                {props.gameState["players"][playerid]["tags"]}
              </td>
              <td
                className={`w-[17.4%] text-[2vw] ${
                  props.gameState["players"][playerid]["infected"] && "text-red-600"
                } ${!props.gameState["players"][playerid]["infected"] && "text-green-600"}`}
              >
                {props.gameState["players"][playerid]["infected"] ? "Infected" : "Alive"}
              </td>
            </>
          )}
          {props.gameMode === "team" && (
            <>
              <td className="w-[29.4%] text-[2vw]">
                {props.gameState["players"][playerid]["name"]}
              </td>
              <td
                className={`w-[17.4%] text-[2vw] ${
                  props.gameState["players"][playerid]["team"] === "red" && "text-red-600"
                } ${props.gameState["players"][playerid]["team"] === "blue" && "text-blue-600"}`}
              >
                {props.gameState["players"][playerid]["team"]}
              </td>
              <td className="w-[14.4%] text-[2vw]">
                {props.gameState["players"][playerid]["level"] === 4
                  ? "Finished"
                  : props.gameState["players"][playerid]["level"]}
              </td>
              <td className="w-[24.4%] text-[2vw]">
                {compute_last_completion_time(props.gameState["players"][playerid])}
              </td>
              <td className="w-[14.4%] text-[2vw]">
                {props.gameState["players"][playerid]["tags"]}
              </td>
            </>
          )}
        </>
      );
      if (props.gameState["players"][playerid]["active"]) {
        playerData.push(<tr className="border-solid h-[15vh]">{curPlayer}</tr>);
      } else {
        playerData.push(<tr className="border-solid h-[15vh] outline-red-500">{curPlayer}</tr>);
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
          <div
            className={`text-5xl ${
              props.gameMode === "infection" &&
              props.gameState["infectedRank"] === 1 &&
              "text-red-600"
            } ${props.gameMode === "team" && props.gameState["redRank"] === 1 && "text-red-600"} ${
              props.gameMode === "team" && props.gameState["blueRank"] === 1 && "text-blue-600"
            }`}
          >
            {props.gameMode === "individual" ? "Game Results" : ""}
            {props.gameMode === "infection"
              ? `${
                  props.gameState["infectedRank"] === 1 ? "Infected Team Won" : "Infected Team Lost"
                }`
              : ""}
            {props.gameMode === "team"
              ? `${props.gameState["redRank"] === 1 ? "Red Team Won" : "Blue Team Won"}`
              : ""}
          </div>
          <div className="flex-none flex-col mt-4 m-2 w-[90%] text-center">
            {displayData.length ? (
              <>
                <div className="overflow-y-scroll h-[75vh] border-solid">
                  <div className="absolute w-[90%] flex h-[11vh] border-solid z-10 bg-black opacity-100">
                    {props.gameMode === "individual" && (
                      <>
                        <div className="w-[15%] text-[3vw] py-[3vh]">Rank</div>
                        <div className="w-[30%] text-[3vw] py-[3vh]">Name</div>
                        <div className="w-[15%] text-[3vw] py-[3vh]">Level</div>
                        <div className="w-[25%] text-[3vw] py-[3vh]">Time</div>
                        <div className="w-[15%] text-[3vw] py-[3vh]">Tags</div>
                      </>
                    )}

                    {props.gameMode === "infection" && (
                      <>
                        <div className="w-[29.4%] text-[3vw] py-[3vh]">Name</div>
                        <div className="w-[14.4%] text-[3vw] py-[3vh]">Level</div>
                        <div className="w-[24.4%] text-[3vw] py-[3vh]">Time</div>
                        <div className="w-[14.4%] text-[3vw] py-[3vh]">Tags</div>
                        <div className="w-[17.4%] text-[3vw] py-[3vh]">Status</div>
                      </>
                    )}

                    {props.gameMode === "team" && (
                      <>
                        <div className="w-[29.4%] text-[3vw] py-[3vh]">Name</div>
                        <div className="w-[17.4%] text-[3vw] py-[3vh]">Team</div>
                        <div className="w-[14.4%] text-[3vw] py-[3vh]">Level</div>
                        <div className="w-[24.4%] text-[3vw] py-[3vh]">Time</div>
                        <div className="w-[14.4%] text-[3vw] py-[3vh]">Tags</div>
                      </>
                    )}
                  </div>
                  <div className="h-[11vh]"></div>
                  <table className="w-full text-xl p-2 rounded-xl">
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
