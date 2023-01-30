import React, { useState } from "react";

import LeftSideBarSets from "./LeftSideBarSets";
import LeftSideBarGames from "./LeftSideBarGames";
import LeftSideBarSettings from "./LeftSideBarSettings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons";
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
          className={` bg-gray-800 absolute top-0 z-20 left-0 overflow-y-hidden h-[calc(100vh_-_78px)] w-[15vw] transform transition-transform duration-300 ${
            props.isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4">
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
                className="font-Ubuntu fixed bottom-[2vh] w-[6vw] left-[4.5vw] bg-blue-300 hover:bg-blue-500 hover:cursor-pointer p-2"
                onClick={() => {
                  googleLogout();
                  props.hl();
                }}
              >
                Logout
              </button>
            </GoogleOAuthProvider>

            <button
              className=" font-medium fixed top-[50%] transform translate-y-[-50%] right-0 p-3 bg-blue-300 border-none hover:cursor-pointer hover:bg-blue-500"
              onClick={() => props.setIsOpen(!props.isOpen)}
            >
              <FontAwesomeIcon icon={faAnglesLeft} size="fa-2xl" />
            </button>
          </div>
        </div>
      </div>

      <button
        className="fixed top-[calc(50vh_+_39px)] transform translate-y-[-50%] z-10 font-medium p-3 bg-blue-300 border-none hover:cursor-pointer hover:bg-blue-500"
        onClick={() => props.setIsOpen(!props.isOpen)}
      >
        <FontAwesomeIcon icon={faAnglesRight} size="fa-2xl" />
      </button>
    </>
  );
};

export default LeftSideBar;
