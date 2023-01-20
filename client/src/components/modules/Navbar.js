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
 */
const Navbar = (props) => {
  let rightside;
  console.log(props);
  if (!props.userId) {
    if (!props.edit) {
      rightside = (
        <div className="hidden md:flex space-x-6">
          <Link
            to="/login"
            className="no-underline text-blue-500 text-center text-[15px] py-3 transition-colors duration-250 hover:text-sky-400"
          >
            Login
          </Link>
          <HomeButton text="Sign Up" url="/signup" />
        </div>
      );
    } else {
      rightside = <div className="text-lg">Editing...</div>;
    }
  } else {
    rightside = (
      <div className="hidden md:flex no-underline text-black text-center text-[18px] py-3">
        You are: {props.userName} ({props.userRole})
      </div>
    );
  }

  return (
    <>
      <nav className="fixed w-full top-0 bg-white z-10">
        <div className="flex items-center justify-between p-4 px-10 border-0 border-gray-200 border-solid border-b-2">
          <Link
            to="/"
            className="pt-2 text-[36px] font-[900] hover:cursor-pointer text-black no-underline"
          >
            MazeEd
          </Link>
          {rightside}
        </div>
      </nav>
    </>
  );
};

export default Navbar;

/*bye*/
