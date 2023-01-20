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
 * @param {userId} userId user id
 * @param {userRole} userRole user role (teacher or student)
 * @param {userName} userName display name of user
 * @param {hl} hl handle logout
 */
const StudentDashboard = (props) => {
  const [rightSide, setRightSide] = useState("join"); //options are join or settings, default to join
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState(undefined);
  const [userData, setUserData] = useState(undefined);

  let rightComponent;
  if (rightSide === "join") rightComponent = <JoinGame />;
  else if (rightSide == "settings") rightComponent = <Settings hl={props.hl} userData={userData} />;

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
          <div className="mt-[4.8vw]">
            <div className="flex">
              <div className="basis-1/5 w-40 border-solid border-rose-400">
                <LeftSideBar setRightSide={setRightSide} />
                <div>Hi</div>
                <div>{userData.userRole}</div>
                <div>Bye</div>
              </div>
              <div className="flex-1 border-solid border-rose-600">{rightComponent} </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default StudentDashboard;
