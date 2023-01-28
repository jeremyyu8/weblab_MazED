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

  const [open, setOpen] = useState(true);
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
          />
        );
      } else if (rightSide === "Settings") {
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
            <div className="fixed top-[75px] h-[20px] text-center pt-[3px] w-full z-50 mx-auto bg-red-500">
              <div className="hover:cursor-pointer" onClick={handleRejoin}>
                You are currently inside of another lobby! Click to rejoin.
              </div>
            </div>
          )}
          <div class="h-[75px]"></div>

          <div className="flex h-[calc(100vh_-_75px)]">
            <div
              className={` ${open ? "w-[12%]" : "w-[3%] "} bg-gray-800 p-5 relative duration-300`}
            >
              <img
                src="../../assets/control.png"
                className={`absolute cursor-pointer -right-3 top-[2.5%] z-10 w-8 border-dark-purple
           border-2 rounded-full ${!open && "rotate-180"}`}
                onClick={() => setOpen(!open)}
              />

              <div className="flex gap-x-4 items-center">
                <img
                  src="../../assets/logo.png"
                  className={`cursor-pointer duration-500 ${open && "rotate-[360deg]"} w-10`}
                />
                <h1 className={`text-white origin-left font-medium text-xl ${!open && "hidden"}`}>
                  Dashboard
                </h1>
              </div>

              <div className="pt-6">
                {Menus.map((Menu, index) => (
                  <div
                    onClick={() => {
                      setRightSide(Menu.title);
                    }}
                    key={index}
                    className={`${
                      rightSide === Menu.title && "bg-light-white"
                    } flex rounded-md py-2 my-5 cursor-pointer hover:bg-light-white text-gray-300 text-xl items-center gap-x-4`}
                  >
                    <img className="w-10" src={`../../assets/${Menu.src}.png`} />
                    <span className={`${!open && "hidden"} origin-left duration-200 my-auto`}>
                      {Menu.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-hidden">
              {loading === false && rightComponent}
              {loading === true && (
                <div className="background text-[2vw] text-blue-700">
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
