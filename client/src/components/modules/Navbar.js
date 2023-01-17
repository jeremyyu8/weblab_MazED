import React from "react";
import HomeButton from "./HomeButton";

import "./Navbar.css";

/**
 * Navbar
 *
 * Proptypes
 * None
 */
const Navbar = () => {
  return (
    <>
      <nav className="nav-container">
        <div className="nav-title" onClick={() => window.location.replace("/")}>
          MazEd
        </div>
        <div className="nav-items">
          <HomeButton text="Log In" url="/login" />
          <HomeButton text="Sign Up" url="/signup" />
        </div>
      </nav>
    </>
  );
};

export default Navbar;

/*bye*/
