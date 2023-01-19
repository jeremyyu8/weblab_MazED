import React, { useState } from "react";

import LeftSideBarSettings from "./LeftSideBarSettings";
import LeftSideBarJoin from "./LeftSideBarJoin";

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
      className="left-0 h-screen m-0 
                    flex flex-col bg-gray-900 text-white shadow-lg"
    >
      <div className="" onClick={() => props.setRightSide("join")}>
        <LeftSideBarJoin />
      </div>

      <div className="" onClick={() => props.setRightSide("settings")}>
        <LeftSideBarSettings />
      </div>
    </div>
  );
};

export default LeftSideBar;
