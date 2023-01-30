import React from "react";

const LeftSideBarGames = (props) => {
  return (
    <div className={`leftbar-icon ${props.rightSide === "Games" && "bg-blue-500"}`}>Past Games</div>
  );
};

export default LeftSideBarGames;
