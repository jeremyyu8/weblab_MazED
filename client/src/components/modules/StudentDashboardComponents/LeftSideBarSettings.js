import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const LeftSideBarSettings = (props) => {
  return (
    <div className={`leftbar-icon ${props.rightSide === "Settings" && "bg-blue-500"}`}>
      <FontAwesomeIcon icon={faUser} className="mr-3" />
      Profile
    </div>
  );
};

export default LeftSideBarSettings;
