import React from "react";

import LeftSideBarSets from "./LeftSideBarSets";
import LeftSideBarGames from "./LeftSideBarGames";
import LeftSideBarSettings from "./LeftSideBarSettings";

import "./LeftSideBar.css";

/**
 * LeftSideBar is a component in TeacherDashboard that holds my sets, past games, settings
 *
 * Proptypes
 * @param {string} _id of the story
 * @param {function} setRightSide for setting right side
 */
const LeftSideBar = (props) => {
  return (
    <div className="LeftSideBar-container">
      <div className="LeftSideBar-item" onClick={() => props.setRightSide("sets")}>
        <LeftSideBarSets />
      </div>

      <div className="LeftSideBar-item" onClick={() => props.setRightSide("pastGames")}>
        <LeftSideBarGames />
      </div>

      <div className="LeftSideBar-item" onClick={() => props.setRightSide("settings")}>
        <LeftSideBarSettings />
      </div>
    </div>
  );
};

export default LeftSideBar;
