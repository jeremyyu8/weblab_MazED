import React from "react";

/**
 * rules and settings pop-up inside of game lobby
 *
 * @param {function} setShowRules setter for prop showRules
 */
const RulesAndSettings = (props) => {
  return (
    <>
      <div className="bg-white bg-opacity-70 fixed h-[50vh] w-[75vw] top-[25vh] left-[12.5vw] overflow-y-scroll">
        <div className="text-xl">
          These are the rules and settings of MazeED These are the rules and settings of MazeED
          These are the rules and settings of MazeED These are the rules and settings of MazeED
          These are the rules and settings of MazeED These are the rules and settings of MazeED
          These are the rules and settings of MazeED These are the rules and settings of MazeED
          These are the rules and settings of MazeED These are the rules and settings of MazeED
          These are the rules and settings of MazeED These are the rules and settings of MazeED
          These are the rules and settings of MazeED These are the rules and settings of MazeED
          These are the rules and settings of MazeED These are the rules and settings of MazeED
          These are the rules and settings of MazeED These are the rules and settings of MazeED
          These are the rules and settings of MazeED These are the rules and settings of MazeED
          These are the rules and settings of MazeED
        </div>
        <div className="flex justify-center">
          <button onClick={() => props.setShowRules(false)}>close</button>
        </div>
      </div>
    </>
  );
};

export default RulesAndSettings;
