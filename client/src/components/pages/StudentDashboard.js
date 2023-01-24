import React, { useState, useEffect } from "react";
import { Link, Redirect } from "@reach/router";

import Navbar from "../modules/Navbar";
import LeftSideBar from "../modules/StudentDashboardComponents/LeftSideBar";
import JoinGame from "../modules/StudentDashboardComponents/JoinGame";
import Settings from "../modules/StudentDashboardComponents/Settings";

import { get } from "../../utilities";

/**
 * Student dashboard page
 *
 * Proptypes
 * @param {string} userId user id
 * @param {string} userRole user role (teacher or student)
 * @param {string} userName display name of user
 * @param {function} hl handle logout
 */
const StudentDashboard = (props) => {
  const [rightSide, setRightSide] = useState("join"); //options are join or settings, default to join
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState(undefined);
  const [userData, setUserData] = useState(undefined);
  const [rightComponent, setRightComponent] = useState(undefined);

  useEffect(() => {
    if (userData) {
      if (rightSide === "join") {
        setRightComponent(<JoinGame userId={userData._id} userName={userData.name} />);
      } else if (rightSide === "settings") {
        setRightComponent(<Settings hl={props.hl} userData={userData} />);
      }
    }
  }, [userData, rightSide]);

  // get student data
  useEffect(() => {
    const renderDisplay = async () => {
      try {
        const data = await get("/api/userbyid");
        setUserData(data);
        if (data.role !== "student") {
          setRedirect(true);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch {
        console.log("error?");
        setRedirect(true);
      }
    };
    renderDisplay();
  }, []);

  return (
    <>
      {redirect ? (
        <Redirect noThrow from="/student" to="/login" />
      ) : loading === true ? (
        <div>loading...</div>
      ) : (
        <>
          <Navbar userId={userData._id} userRole={userData.role} userName={userData.name} />
          <div class="h-[75px]"></div>
          <div className="flex">
            <div className="w-40 overflow-y-hidden h-[calc(100vh_-_78px)]">
              <LeftSideBar setRightSide={setRightSide} />
            </div>
            <div className="flex-1 overflow-y-hidden h-[calc(100vh_-_78px)]">{rightComponent}</div>
          </div>
        </>
      )}
    </>
  );
};

export default StudentDashboard;
