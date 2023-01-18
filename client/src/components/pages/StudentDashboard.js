import React, { useState } from "react";

import Navbar from "../modules/Navbar";
import LeftSideBar from "../modules/StudentDashboardComponents/LeftSideBar";
import JoinGame from "../modules/StudentDashboardComponents/JoinGame";
import Settings from "../modules/StudentDashboardComponents/Settings";

const StudentDashboard = () => {
  const [rightSide, setRightSide] = useState("join"); //options are join or settings, default to join

  return (
    <>
      <Navbar />
      <div className="StudentDashboard-container">
        <div className="StudentDashboard-leftSide">
          <LeftSideBar setRightSide={setRightSide} />
        </div>
        <div className="StudentDashboard-rightSide">
          {rightSide === "join" ? <JoinGame /> : <Settings />}
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
