import React, { useState } from "react";

import Navbar from "../modules/Navbar";
import LeftSideBar from "../modules/TeacherDashboardComponents/LeftSideBar";

import FlashcardSetsContainer from "../modules/TeacherDashboardComponents/FlashcardSetsContainer";
import Games from "../modules/TeacherDashboardComponents/Games";
import Settings from "../modules/TeacherDashboardComponents/Settings";

const TeacherDashboard = () => {
  const [rightSide, setRightSide] = useState("sets"); //options are sets, pastGames, settings

  let rightComponent;
  if (rightSide === "sets") rightComponent = <FlashcardSetsContainer />;
  else if (rightSide == "pastGames") rightComponent = <Games />;
  else rightComponent = <Settings />;

  return (
    <>
      <Navbar />

      <div className="flex">
        <div className="flex-1 border-solid border-rose-400">
          <LeftSideBar setRightSide={setRightSide} />
        </div>
        <div className="flex-1 border-solid border-rose-600">{rightComponent}</div>
        <div className="flex-1 border-solid border-rose-900">
          <button
            onClick={() => {
              window.location.replace("/teacher/edit");
            }}
          >
            Edit
          </button>
        </div>
      </div>
    </>
  );
};

export default TeacherDashboard;
