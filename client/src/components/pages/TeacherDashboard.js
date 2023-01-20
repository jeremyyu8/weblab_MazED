import React, { useState, useEffect } from "react";
import { Link, Redirect } from "@reach/router";

import Navbar from "../modules/Navbar";
import LeftSideBar from "../modules/TeacherDashboardComponents/LeftSideBar";

import FlashcardSetsContainer from "../modules/TeacherDashboardComponents/FlashcardSetsContainer";
import Games from "../modules/TeacherDashboardComponents/Games";
import Settings from "../modules/TeacherDashboardComponents/Settings";

import { get } from "../../utilities";

/**
 * Teacher Dashboard page
 * LeftSideBar is a component in TeacherDashboard that holds my sets, past games, settings
 *
 * Proptypes
 * @param {userId} userId user id
 * @param {userRole} userRole user role (teacher or student)
 * @param {userName} userName display name of user
 * @param {hl} hl handle logout
 */
const TeacherDashboard = (props) => {
  const [rightSide, setRightSide] = useState("sets"); //options are sets, pastGames, settings
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState(undefined);
  const [userData, setUserData] = useState(undefined);

  let rightComponent;
  if (rightSide === "sets") rightComponent = <FlashcardSetsContainer />;
  else if (rightSide == "pastGames") rightComponent = <Games />;
  else rightComponent = <Settings hl={props.hl} userData={userData} />;

  useEffect(() => {
    const renderDisplay = async () => {
      try {
        const data = await get("/api/userbyid");
        setUserData(data);
        if (data.role !== "teacher") {
          setRedirect(true);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch {
        setRedirect(true);
      }
      console.log("done with render display");
    };
    renderDisplay();
  }, []);

  return (
    <>
      {redirect ? (
        <Redirect noThrow from="/teacher" to="/login" />
      ) : loading === true ? (
        <div>loading...</div>
      ) : (
        <>
          <Navbar userId={userData._id} userRole={userData.role} userName={userData.name} />
          <div className="mt-[4.8vw]">
            <div className="flex">
              <div className="basis-1/5 w-40 border-solid border-rose-400">
                <LeftSideBar setRightSide={setRightSide} />
              </div>
              <div className="flex-1 border-solid border-blue-600">{rightComponent}</div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default TeacherDashboard;
