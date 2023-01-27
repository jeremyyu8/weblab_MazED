import React from "react";
import HomeButton from "./HomeButton";
import { Link } from "@reach/router";

const GOOGLE_CLIENT_ID = "810136167494-687miqucn5faftjcgheo691e8n1pddti.apps.googleusercontent.com";

/**
 * Navbar
 *
 * Proptypes
 * @param {userId} userId user id
 * @param {userRole} userRole user role (teacher or student)
 * @param {userName} userName display name of user
 * @param {edit} edit on the teacher edit screen
 * @param {blank} blank render a blank navbar
 */
const Navbar = (props) => {
  let rightside;
  if (props.blank === true) {
    rightside = "";
  } else if (!props.userId) {
    if (!props.edit) {
      rightside = (
        <div className="hidden md:flex space-x-6">
          <Link
            to="/login"
            className="no-underline text-blue-900 text-center text-[20px] my-auto transition-colors duration-250 hover:text-sky-400"
          >
            Login
          </Link>
          <HomeButton text="Sign Up" url="/signup" />
        </div>
      );
    } else {
      rightside = (
        <div className="flex">
          <div className="text-lg mr-10">Editing</div>
          <div className="dot-pulse"></div>
        </div>
      );
    }
  } else {
    rightside = (
      <div className="flex no-underline text-black text-center text-[18px] py-3">
        You are: <span className="text-gray-500 px-2">{props.userName}</span> ({props.userRole})
      </div>
    );
  }

  return (
    <>
      <nav className="fixed h-[75px] w-screen bg-opacity-80 top-0 bg-blue-100 border-0 border-b-2 z-10 flex justify-between">
        <div className="my-auto px-8">
          <Link
            to="/"
            className="text-[42px] font-[900] py-8px hover:cursor-pointer text-blue-900 no-underline"
          >
            MazeEd
          </Link>
        </div>
        <div className="my-auto mr-8"> {rightside}</div>
      </nav>
    </>
  );
};

export default Navbar;

/* bye */
