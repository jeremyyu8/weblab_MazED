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
      This is the student dashboard.
      <LeftSideBar rightSide={setRightSide} />
      {rightSide === "join" ? <JoinGame /> : <Settings />}
    </>
  );
};

export default StudentDashboard;
