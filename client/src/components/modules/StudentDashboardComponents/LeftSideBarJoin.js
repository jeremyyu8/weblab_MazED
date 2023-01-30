import React from "react";

const LeftSideBarJoin = (props) => {
  return (
    <div className={`leftbar-icon ${props.rightSide === "Join Game" && "bg-blue-500"}`}>
      Join Game
    </div>
  );
};

export default LeftSideBarJoin;
