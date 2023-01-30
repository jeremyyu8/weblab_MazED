import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHistory } from "@fortawesome/free-solid-svg-icons";
const LeftSideBarGames = (props) => {
  return (
    <div className={`leftbar-icon ${props.rightSide === "Games" && "bg-blue-500"}`}>
      <FontAwesomeIcon icon={faHistory} className="mr-3" />
      Past Games
    </div>
  );
};

export default LeftSideBarGames;
