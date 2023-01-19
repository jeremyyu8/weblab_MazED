import React from "react";
import HomeButton from "./HomeButton";
import { Link } from "@reach/router";

/**
 * Navbar
 *
 * Proptypes
 * None
 */
const Navbar = () => {
  return (
    <>
      {/* <nav className="nav-container">
        <div className="nav-title" onClick={() => window.location.replace("/")}>
          <div className={"font-[900]"}>MazEd</div>
        </div>
        <div className="nav-items">
          <HomeButton text="Log In" url="/login" />
          <HomeButton text="Sign Up" url="/signup" />
        </div>
      </nav> */}
      <nav className="fixed w-full top-0 bg-white z-10">
        <div className="flex items-center justify-between p-4 px-10 border-0 border-gray-200 border-solid border-b-2">
          <Link
            to="/"
            className="pt-2 text-[36px] font-[900] hover:cursor-pointer text-black no-underline"
          >
            MazeEd
          </Link>
          <div className="hidden md:flex space-x-6">
            <HomeButton text="Log In" url="/login" />
            <HomeButton text="Sign Up" url="/signup" />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

/*bye*/
