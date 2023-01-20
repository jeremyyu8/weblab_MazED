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
        <div class="flex items-center justify-center w-56 h-56 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
          <div role="status">
            <svg
              aria-hidden="true"
              class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
        </div>
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
