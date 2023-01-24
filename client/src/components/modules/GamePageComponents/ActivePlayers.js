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
    Object.keys(props.activePlayers).forEach((_id) => {
      if (_id != props.teacherId && props.activePlayers[_id]["active"]) {
        active.push(<div key={_id}>{props.activePlayers[_id]["name"]}</div>);
      }
    });
    setActivePlayersDisplay(active);
  }, [props.activePlayers]);

  return (
    <>
      <div className="bg-white bg-opacity-70 fixed h-[50vh] w-[75vw] top-[25vh] left-[12.5vw] overflow-y-scroll">
        <>
          <div className="text-xl">
            {activePlayersDisplay.length === 0 ? (
              <div>No students connected!</div>
            ) : activePlayersDisplay.length === 1 ? (
              <div className="text-xl">There is 1 student connected </div>
            ) : (
              <div className="text-xl">
                There are {activePlayersDisplay.length} students connected
              </div>
            )}
          </div>
          <div className="text-md">{activePlayersDisplay}</div>
        </>

        <div className="flex justify-center">
          <button onClick={() => props.setShowActivePlayers(false)}>close</button>
        </div>
      </div>
    </>
  );
};

export default ActivePlayers;
