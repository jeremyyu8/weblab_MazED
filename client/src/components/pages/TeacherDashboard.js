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
    if (rightSide === "sets") setRightComponent(<FlashcardSetsContainer metadata={setsMetadata} />);
    else if (rightSide == "pastGames") setRightComponent(<Games />);
    else setRightComponent(<Settings hl={props.hl} userData={userData} />);
  }, [rightSide, setsMetadata]);

  // TODO DELETE THIS TEMPORARY FUNCTION!
  const temp_func = () => {
    const body = {
      title: "test_set_1",
      size: 30,
      cards: [
        { question: "why", choices: ["a", "b", "c", "d"], answers: [1] },
        { question: "who", choices: ["asd", "b", "c", "d"], answers: [2] },
        { question: "as", choices: ["a", "b", "c", "s"], answers: [3, 0] },
      ],
    };

    post("/api/newset", body).then(console.log("new set created successfully"));
  };

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
        <div>loading user data and importing flashcards...</div>
      ) : (
        <>
          <Navbar userId={userData._id} userRole={userData.role} userName={userData.name} />
          <div className="mt-[-8vh]">
            <div className="flex">
              <div className="basis-1/5 w-40 border-solid border-rose-400">
                <LeftSideBar setRightSide={setRightSide} />
              </div>
              <div className="flex-1 border-solid border-blue-600">{rightComponent}</div>
            </div>
            <button onClick={temp_func}>click me (log in first please)</button>;
          </div>
        </>
      )}
    </>
  );
};

export default TeacherDashboard;
