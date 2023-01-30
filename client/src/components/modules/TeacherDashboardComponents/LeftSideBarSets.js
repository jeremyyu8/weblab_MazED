import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
const LeftSideBarSets = (props) => {
  return (
    <div className={`leftbar-icon ${props.rightSide === "Sets" && "bg-blue-500"}`}>
      <FontAwesomeIcon icon={faFolderOpen} className="mr-3" />
      My Sets
    </div>
  );
};

export default LeftSideBarSets;
