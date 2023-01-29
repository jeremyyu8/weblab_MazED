import React, { useEffect } from "react";

/**
 * rules and settings pop-up inside of game lobby
 *
 * @param {function} setShowRules setter for prop showRules
 * @param {String} gameMode the game mode
 */
const RulesAndSettings = (props) => {
  useEffect(() => {
    console.log(props);
  }, []);
  return (
    <>
      <div className="bg-white bg-opacity-70 fixed h-[50vh] w-[75vw] top-[25vh] left-[12.5vw] overflow-y-scroll">
        <div className="text-3xl">
          Game mode: <span className="text-blue-600">{props.gameMode}</span>
        </div>
        <div className="text-xl">Tip: press "h" to enable hitboxes</div>
        <div className="flex justify-center">
          <button onClick={() => props.setShowRules(false)}>close</button>
        </div>
      </div>
    </>
  );
};

export default RulesAndSettings;
