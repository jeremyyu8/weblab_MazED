import React, { useState } from "react";

import Navbar from "../modules/Navbar";
import LeftSideBar from "../modules/TeacherDashboardComponents/LeftSideBar";

import FlashcardSetsContainer from "../modules/TeacherDashboardComponents/FlashcardSetsContainer";
import Games from "../modules/TeacherDashboardComponents/Games";
import Settings from "../modules/TeacherDashboardComponents/Settings";

/**
 * LeftSideBar is a component in TeacherDashboard that holds my sets, past games, settings
 *
 * Proptypes
 * @param {string} _id of the story
 * @param {function} setRightSide for setting right side
 */
const TeacherDashboard = () => {
  const [rightSide, setRightSide] = useState("sets"); //options are sets, pastGames, settings

  let rightComponent;
  if (rightSide === "sets") rightComponent = <FlashcardSetsContainer />;
  else if (rightSide == "pastGames") rightComponent = <Games />;
  else rightComponent = <Settings />;

  return (
    <>
      <Navbar />
      <div className="mt-[4.8vw]">
        <div className="flex">
          <div className="basis-1/5 w-40 border-solid border-rose-400">
            <LeftSideBar setRightSide={setRightSide} />
          </div>
          <div className="flex-1 border-solid border-rose-600">{rightComponent}</div>
        </div>
      </div>
    </>
  );
};

export default TeacherDashboard;
