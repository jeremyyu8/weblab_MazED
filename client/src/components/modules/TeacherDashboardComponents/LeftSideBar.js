import React, { useState } from "react";

import LeftSideBarSets from "./LeftSideBarSets";
import LeftSideBarGames from "./LeftSideBarGames";
import LeftSideBarSettings from "./LeftSideBarSettings";
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
          className={`bg-gray-800 absolute top-0 z-20 left-0 overflow-y-hidden h-[calc(100vh_-_78px)] w-64 transform transition-transform duration-300 ${
            props.isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4"></div>
          <div className="p-4">
            <div className="" onClick={() => props.setRightSide("Sets")}>
              <LeftSideBarSets />{" "}
            </div>
            <div className="" onClick={() => props.setRightSide("Games")}>
              <LeftSideBarGames />
            </div>

            <div className="" onClick={() => props.setRightSide("Settings")}>
              <LeftSideBarSettings />
            </div>

            <button
              className=" font-medium fixed top-[2%] right-0"
              onClick={() => props.setIsOpen(!props.isOpen)}
            >
              Close Sidebar
            </button>
          </div>
        </div>
      </div>

      <button
        className="fixed top-[30%] z-10 font-medium p-2"
        onClick={() => props.setIsOpen(!props.isOpen)}
      >
        <FontAwesomeIcon icon={faAnglesRight} />
      </button>
    </>
  );
};
// const LeftSideBar = (props) => {
//   return (
//     <div
//       className="left-0 h-screen m-0
//                     flex flex-col bg-gray-900 text-white shadow-lg"
//     >
//       <div className="" onClick={() => props.setRightSide("sets")}>
//         <LeftSideBarSets />
//       </div>

//       <div className="" onClick={() => props.setRightSide("pastGames")}>
//         <LeftSideBarGames />
//       </div>

//       <div className="" onClick={() => props.setRightSide("settings")}>
//         <LeftSideBarSettings />
//       </div>
//     </div>
//   );
// };

export default LeftSideBar;
