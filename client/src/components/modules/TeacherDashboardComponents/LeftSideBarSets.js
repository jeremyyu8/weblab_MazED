import React from "react";

const LeftSideBarSets = (props) => {
  return (
    <div className={`leftbar-icon ${props.rightSide === "Sets" && "bg-blue-500"}`}>My Sets</div>
  );
};

export default LeftSideBarSets;
