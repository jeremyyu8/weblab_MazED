import React, { useState, useEffect } from "react";
import { Link, Redirect } from "@reach/router";

import Navbar from "../modules/Navbar";
import LeftSideBar from "../modules/StudentDashboardComponents/LeftSideBar";
import JoinGame from "../modules/StudentDashboardComponents/JoinGame";
import Settings from "../modules/StudentDashboardComponents/Settings";

import { socket, checkAlreadyConnected } from "../../client-socket";

import { get, post } from "../../utilities";

/**
 * Student dashboard page
 *
 * Proptypes
 * @param {string} userId user id
 * @param {string} userRole user role (teacher or student)
 * @param {string} userName name of user
 * @param {function} hl handle logout
 */
const StudentDashboard = (props) => {
  const [rightSide, setRightSide] = useState("join"); //options are join or settings, default to join
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState(undefined);
  const [redirectGame, setRedirectGame] = useState(undefined);
  const [userData, setUserData] = useState(undefined);
  const [rightComponent, setRightComponent] = useState(undefined);
  const [foundGame, setFoundGame] = useState(false);

  useEffect(() => {
    if (userData) {
      if (rightSide === "join") {
        setRightComponent(
          <JoinGame
            userId={userData._id}
            userName={userData.name}
            displayname={userData.displayname}
          />
        );
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

  // check if student was already inside of a game
  useEffect(() => {
    if (userData) {
      checkAlreadyConnected(userData._id);
    }
  }, [userData]);

  useEffect(() => {
    socket.on("checkAlreadyConnectedResult", (result) => {
      console.log("received checked already connected thing");
      if (userData) {
        if (result._id === userData._id && result.result === true) {
          console.log("found a game you were already connected to");
          setFoundGame(true);
        }
      }
    });
  }, [userData]);

  const handleRejoin = () => {
    setRedirectGame(true);
  };

  return (
    <>
      {redirect ? (
        <Redirect noThrow from="/student" to="/login" />
      ) : redirectGame ? (
        <Redirect noThrow from="/teacher" to="/game" />
      ) : (
        <>
          {loading === true && <Navbar blank={true} />}
          {loading === false && (
            <Navbar
              userId={userData._id}
              userRole={userData.role}
              userName={userData.displayname}
            />
          )}
          {foundGame && (
            <div className="fixed top-[75px] h-[20px] text-center pt-[3px] w-full z-10 mx-auto bg-red-500">
              <div className="hover:cursor-pointer" onClick={handleRejoin}>
                You are currently inside of another lobby! Click to rejoin.
              </div>
            </div>
          )}
          <div class="h-[75px]"></div>
          <div className="flex">
            <div className="w-40 overflow-y-hidden h-[calc(100vh_-_78px)]">
              <LeftSideBar setRightSide={setRightSide} />
            </div>
            <div className="flex-1 overflow-y-hidden h-[calc(100vh_-_78px)]">
              {loading === false && rightComponent}
              {loading === true && (
                <div className="background text-[2vw] text-green-200">
                  Loading student dashboard...
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default StudentDashboard;
