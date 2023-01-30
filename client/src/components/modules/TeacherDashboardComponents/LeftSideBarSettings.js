import React from "react";

const LeftSideBarSettings = (props) => {
  return (
    <div className={`leftbar-icon ${props.rightSide === "Settings" && "bg-blue-500"}`}>Profile</div>
  );
};

export default LeftSideBarSettings;
