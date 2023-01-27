import React, { useState } from "react";

import LeftSideBarSettings from "./LeftSideBarSettings";
import LeftSideBarJoin from "./LeftSideBarJoin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons";
/**
 * LeftSideBar is a component in TeacherDashboard that holds my sets, past games, settings
 *
 * Proptypes
 * @param {string} _id of the story
 * @param {function} setRightSide for setting right side
 */
const LeftSideBar = (props) => {
  return (
    <>
      <div className="">
        <div
          className={`bg-gray-800 absolute top-0 left-0 overflow-y-hidden h-[calc(100vh_-_78px)] w-64 transform transition-transform duration-300 ${
            props.isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4"></div>
          <div className="p-4">
            <div className="" onClick={() => props.setRightSide("join")}>
              <LeftSideBarJoin />
            </div>

            <div className="" onClick={() => props.setRightSide("settings")}>
              <LeftSideBarSettings />
            </div>

            <button
              className=" font-medium fixed top-[50%] left-10"
              onClick={() => props.setIsOpen(!props.isOpen)}
            >
              Close Sidebar
            </button>
          </div>
        </div>

        <div className={`w-1/6 h-12 fixed top-[50%] z-10 ${props.isOpen ? "hidden" : "block"}`}>
          <button className=" font-medium p-2" onClick={() => props.setIsOpen(!props.isOpen)}>
            <FontAwesomeIcon icon={faAnglesRight} />
          </button>
        </div>
      </div>
    </>
  );
  return (
    <div
      className="left-0 h-screen m-0
                    flex flex-col bg-slate-900 text-white"
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
