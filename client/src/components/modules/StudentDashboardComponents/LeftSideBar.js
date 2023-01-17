import React, { useState } from "react";
import "./LeftSideBar.css";
import LeftSideBarOption from "./LeftSideBarOption";

/**
 * LeftSideBar is a component in StudentDashboard that holds Join Game button and Settings button
 *
 * Proptypes
 * @param {string} _id of the story
 * @param {function} rightSide for setting right side
 */
const LeftSideBar = (props) => {
  return (
    <div>
      <button onClick={() => props.rightSide("join")}>Join</button>
      <button
        onClick={() => {
          props.rightSide("settings");
          console.log("hit");
        }}
      >
        Settings
      </button>
    </div>
  );
};

export default LeftSideBar;
