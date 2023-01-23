import React, { useState, useEffect } from "react";
import { Link, Redirect } from "@reach/router";

import Navbar from "../modules/Navbar";
import LeftSideBar from "../modules/TeacherDashboardComponents/LeftSideBar";

import FlashcardSetsContainer from "../modules/TeacherDashboardComponents/FlashcardSetsContainer";
import Games from "../modules/TeacherDashboardComponents/Games";
import Settings from "../modules/TeacherDashboardComponents/Settings";
import Set from "../modules/TeacherDashboardComponents/Set";

import { get, post } from "../../utilities";

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
  const [rightComponent, setRightComponent] = useState("");
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState(undefined);
  const [userData, setUserData] = useState(undefined);
  const [setsMetadata, setSetsMetadata] = useState([]);

  useEffect(() => {
    if (rightSide === "sets")
      setRightComponent(
        <FlashcardSetsContainer
          metadata={setsMetadata}
          setSetsMetadata={setSetsMetadata}
          setUserData={setUserData}
          userId={props.userId}
        />
      );
    else if (rightSide == "pastGames") setRightComponent(<Games />);
    else setRightComponent(<Settings hl={props.hl} userData={userData} />);
  }, [rightSide, setsMetadata]);

  // get teacher data
  useEffect(() => {
    const renderDisplay = async () => {
      try {
        const data = await get("/api/userbyid");
        const metadata = await get("/api/setmetadata");
        setSetsMetadata(metadata.metadata);
        setUserData(data);
        if (data.role !== "teacher") {
          setRedirect(true);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setRedirect(true);
      }
    };
    renderDisplay();
  }, []);

  return (
    <>
      {redirect ? (
        <Redirect noThrow from="/teacher" to="/login" />
      ) : loading === true ? (
        <div>loading teacher dashboard...</div>
      ) : (
        <>
          <Navbar userId={userData._id} userRole={userData.role} userName={userData.name} />
          <div className="mt-[-8vh]">
            <div className="flex">
              <div className="basis-1/5 w-40 border-solid border-rose-400 overflow-y-hidden h-[calc(100vh_-_78px)]">
                <LeftSideBar setRightSide={setRightSide} />
              </div>
              <div className="flex-1 border-solid border-blue-600 overflow-y-hidden h-[calc(100vh_-_78px)]">
                {rightComponent}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default TeacherDashboard;
