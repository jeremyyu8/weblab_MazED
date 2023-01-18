import React, { useState } from "react";

import LeftSideBarSettings from "./LeftSideBarSettings";
import LeftSideBarJoin from "./LeftSideBarJoin";
import "./LeftSideBar.css";

/**
 * LeftSideBar is a component in StudentDashboard that holds Join Game button and Settings button
 *
 * Proptypes
 * @param {string} _id of the story
 * @param {function} setRightSide for setting right side of the screen
 */
const LeftSideBar = (props) => {
  return (
    <div className="LeftSideBar-container">
      <div className="LeftSideBar-item" onClick={() => props.setRightSide("join")}>
        <LeftSideBarJoin />
      </div>

      <div className="LeftSideBar-item" onClick={() => props.setRightSide("settings")}>
        <LeftSideBarSettings />
      </div>
    </div>
  );
};

export default LeftSideBar;
