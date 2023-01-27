import React, { useState, useEffect } from "react";

/**
 * rules and settings pop-up inside of game lobby
 *
 * @param {function} setShowActivePlayers setter for prop showActivePlayers
 * @param {object} activePlayers list of active players
 * @param {string} teacherId teacher id
 */
const ActivePlayers = (props) => {
  const [activePlayersDisplay, setActivePlayersDisplay] = useState([]);

  useEffect(() => {
    let active = [];
    let cnt = 1;
    Object.keys(props.activePlayers).forEach((_id) => {
      if (_id != props.teacherId && props.activePlayers[_id]["active"]) {
        active.push(
          <div key={_id}>
            {cnt}. {props.activePlayers[_id]["name"]} ({props.activePlayers[_id]["displayname"]})
          </div>
        );
        cnt++;
      }
    });
    setActivePlayersDisplay(active);
  }, [props.activePlayers]);

  return (
    <>
      <div className="bg-white bg-opacity-70 fixed h-[50vh] w-[40vw] top-[25vh] left-[30vw] overflow-y-scroll">
        <>
          <div className="text-3xl p-4">
            {activePlayersDisplay.length === 0 ? (
              <div>No students connected!</div>
            ) : activePlayersDisplay.length === 1 ? (
              <div className="text-3xl">There is 1 student connected </div>
            ) : (
              <div className="text-3xl">
                There are {activePlayersDisplay.length} students connected
              </div>
            )}
          </div>
          <div className="text-2xl p-4">{activePlayersDisplay}</div>
        </>

        <div className="flex justify-center">
          <button
            className="absolute font-Ubuntu text-md bottom-4 w-[10%]"
            onClick={() => props.setShowActivePlayers(false)}
          >
            close
          </button>
        </div>
      </div>
    </>
  );
};

export default ActivePlayers;
