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
  const [rightSide, setRightSide] = useState("Join Game"); //options are join or settings, default to join
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState(undefined);
  const [redirectGame, setRedirectGame] = useState(undefined);
  const [userData, setUserData] = useState(undefined);
  const [rightComponent, setRightComponent] = useState(undefined);
  const [foundGame, setFoundGame] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const Menus = [
    { title: "Join Game", src: "Chart_fill" },
    { title: "Settings", src: "Chat" },
  ];

  useEffect(() => {
    if (userData) {
      if (rightSide === "Join Game") {
        setRightComponent(
          <JoinGame
            userId={userData._id}
            userName={userData.name}
            displayname={userData.displayname}
            skin={userData.skin}
          />
        );
      } else if (rightSide === "Settings") {
        setRightComponent(<Settings hl={props.hl} userData={userData} setUserData={setUserData} />);
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
            <div className="fixed top-[75px] h-[20px] text-center pt-[3px] w-full z-50 mx-auto bg-red-500">
              <div className="hover:cursor-pointer" onClick={handleRejoin}>
                You are currently inside of another lobby! Click to rejoin.
              </div>
            </div>
          )}
          <div className="bg-white bg-fixed bg-cover h-screen">
            <div class="h-[75px]"></div>
            <div className="relative">
              <LeftSideBar
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                setRightSide={setRightSide}
                rightSide={rightSide}
                hl={props.hl}
              />
              <div
                className={`h-[calc(100vh_-_78px)] overflow-y-hidden overflow-x-hidden left-0 transition-left duration-300 ${
                  isOpen ? "ml-64" : "ml-0"
                }`}
              >
                {loading === false && rightComponent}
                {loading === true && (
                  <div className="background text-[2vw] text-blue-200">
                    Loading teacher dashboard...
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default StudentDashboard;
