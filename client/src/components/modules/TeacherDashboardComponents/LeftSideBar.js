import React, { useState } from "react";

import LeftSideBarSets from "./LeftSideBarSets";
import LeftSideBarGames from "./LeftSideBarGames";
import LeftSideBarSettings from "./LeftSideBarSettings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft, faAnglesRight, faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";
const GOOGLE_CLIENT_ID = "810136167494-687miqucn5faftjcgheo691e8n1pddti.apps.googleusercontent.com";

/**
 * LeftSideBar is a component in TeacherDashboard that holds my sets, past games, settings
 *
 * Proptypes
 * @param {string} _id of the story
 * @param rightSide
 * @param {function} setRightSide for setting right side
 * @param {function} hl handle logout
 */

const LeftSideBar = (props) => {
  return (
    <>
      <div className="">
        <div
          className={` bg-gray-800 absolute top-0 z-20 left-0 overflow-y-hidden h-[calc(100vh_-_78px)] w-64 transform transition-transform duration-300 ${
            props.isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4">
            <button
              className="text-blue-600 hover:text-blue-400 hover:cursor-pointer pt-6 font-bold bg-transparent border-none text-4xl fixed top w-[20%] scale-75 transform translate-y-[-50%] right-0"
              onClick={() => props.setIsOpen(!props.isOpen)}
            >
              <FontAwesomeIcon icon={faAnglesLeft} size="xl" />
            </button>
            <div className="" onClick={() => props.setRightSide("Sets")}>
              <LeftSideBarSets rightSide={props.rightSide} />
            </div>
            <div className="" onClick={() => props.setRightSide("Games")}>
              <LeftSideBarGames rightSide={props.rightSide} />
            </div>

            <div className="" onClick={() => props.setRightSide("Settings")}>
              <LeftSideBarSettings rightSide={props.rightSide} />
            </div>

            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
              <button
                className="editfbuttons fixed bottom-[2vh] left-16 w-32 hover:cursor-pointer p-2"
                onClick={() => {
                  googleLogout();
                  props.hl();
                }}
              >
                <FontAwesomeIcon icon={faSignOut} /> Logout
              </button>
            </GoogleOAuthProvider>
          </div>
        </div>
      </div>

      <button
        // top-[calc(50vh_+_39px)]
        className="fixed top-[80px] bg-gray-800 rounded-md z-10 p-2 text-blue-600 hover:text-blue-400 border-none text-4xl font-bold hover:cursor-pointer scale-75"
        onClick={() => props.setIsOpen(!props.isOpen)}
      >
        <FontAwesomeIcon icon={faAnglesRight} size="xl" />
      </button>
    </>
  );
};

export default LeftSideBar;
