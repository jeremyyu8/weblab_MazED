import React from "react";

import LeftSideBarSets from "./LeftSideBarSets";
import LeftSideBarGames from "./LeftSideBarGames";
import LeftSideBarSettings from "./LeftSideBarSettings";

/**
 * LeftSideBar is a component in TeacherDashboard that holds my sets, past games, settings
 *
 * Proptypes
 * @param {string} _id of the story
 * @param {function} setRightSide for setting right side
 */
const LeftSideBar = (props) => {
  return (
    <div
      className="fixed top-[85px] left-0 h-screen m-0 w-40
                    flex flex-col bg-gray-900 text-white shadow-lg"
    >
      <div className="" onClick={() => props.setRightSide("sets")}>
        <LeftSideBarSets />
      </div>

      <div className="" onClick={() => props.setRightSide("pastGames")}>
        <LeftSideBarGames />
      </div>

      <div className="" onClick={() => props.setRightSide("settings")}>
        <LeftSideBarSettings />
      </div>
    </div>
  );
};

export default LeftSideBar;
