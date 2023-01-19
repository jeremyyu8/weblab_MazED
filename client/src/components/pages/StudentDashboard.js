import React, { useState } from "react";

import Navbar from "../modules/Navbar";
import LeftSideBar from "../modules/StudentDashboardComponents/LeftSideBar";
import JoinGame from "../modules/StudentDashboardComponents/JoinGame";
import Settings from "../modules/StudentDashboardComponents/Settings";

const StudentDashboard = () => {
  const [rightSide, setRightSide] = useState("join"); //options are join or settings, default to join

  let rightComponent;
  if (rightSide === "join") rightComponent = <JoinGame />;
  else if (rightSide == "settings") rightComponent = <Settings />;

  return (
    <>
      <Navbar />
      <div className="mt-[4.8vw]">
        <div className="flex">
          <div className="basis-1/5 w-40 border-solid border-rose-400">
            <LeftSideBar setRightSide={setRightSide} />
          </div>
          <div className="flex-1 border-solid border-rose-600">{rightComponent} </div>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
