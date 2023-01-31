import React from "react";
import HomeButton from "./HomeButton";
import { Link } from "@reach/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faBook, faSignIn, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

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
    rightside = (
      <div className="hidden md:flex space-x-6">
        <Link
          to="/"
          className="no-underline text-blue-900 text-center text-[20px] my-auto transition-colors duration-250 hover:text-blue-400 flex"
        >
          <FontAwesomeIcon className="no-underline mr-2 my-auto" icon={faArrowLeft} />
          Back
        </Link>
      </div>
    );
  } else if (!props.userId) {
    if (!props.edit) {
      rightside = (
        <div className="hidden md:flex space-x-6">
          <Link
            to="/rules"
            className="no-underline text-blue-900 text-center text-[20px] my-auto transition-colors duration-250 hover:text-blue-400 flex"
          >
            <FontAwesomeIcon className="no-underline mr-2 my-auto" icon={faBook} />
            Rules
          </Link>
          <Link
            to="/login"
            className="no-underline text-blue-900 text-center text-[20px] my-auto transition-colors duration-250 hover:text-blue-400 flex"
          >
            <FontAwesomeIcon className="no-underline mr-2 my-auto" icon={faSignIn} />
            Login
          </Link>
          <HomeButton text="Sign Up" url="/signup" />
        </div>
      );
    } else {
      rightside = (
        <div className="flex">
          <div className="text-xl mr-4">Editing</div>
          {/* <div className="text-lg mr-10">Editing</div> */}
          {/* <div className="dot-pulse"></div> */}
        </div>
      );
    }
  } else {
    rightside = (
      <>
        <div className="flex">
          <Link
            to="/rules"
            className="no-underline text-blue-900 text-center text-[20px] my-auto transition-colors duration-250 hover:text-blue-400 flex"
          >
            <FontAwesomeIcon className="no-underline mr-2 my-auto" icon={faBook} />
            Rules
          </Link>
          <div className="flex no-underline text-black text-center text-[20px] pl-6 py-3">
            <span className="text-blue-600 px-2">{props.userName}</span> ({props.userRole})
          </div>
        </div>
      </>
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
            MazeED
          </Link>
        </div>

        <div className="my-auto mr-8"> {rightside}</div>
      </nav>
    </>
  );
};

export default Navbar;

/* bye */
