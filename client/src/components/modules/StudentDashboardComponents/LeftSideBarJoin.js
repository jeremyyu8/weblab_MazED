import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
const LeftSideBarJoin = (props) => {
  return (
    <div className={`leftbar-icon ${props.rightSide === "Join Game" && "bg-blue-500"}`}>
      <FontAwesomeIcon icon={faSignInAlt} className="mr-3" />
      Join Game
    </div>
  );
};

export default LeftSideBarJoin;
