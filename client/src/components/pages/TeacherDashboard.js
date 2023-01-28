import React, { useState, useEffect } from "react";
import { Link, Redirect } from "@reach/router";

import Navbar from "../modules/Navbar";
import LeftSideBar from "../modules/TeacherDashboardComponents/LeftSideBar";

import FlashcardSetsContainer from "../modules/TeacherDashboardComponents/FlashcardSetsContainer";
import Games from "../modules/TeacherDashboardComponents/Games";
import Settings from "../modules/TeacherDashboardComponents/Settings";
import Set from "../modules/TeacherDashboardComponents/Set";

import { get, post } from "../../utilities";
import { socket, checkAlreadyConnected } from "../../client-socket";

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
  const [rightSide, setRightSide] = useState("Sets"); //options are sets, pastGames, settings
  const [rightComponent, setRightComponent] = useState("");
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState(undefined);
  const [redirectGame, setRedirectGame] = useState(undefined);
  const [userData, setUserData] = useState(undefined);
  const [setsMetadata, setSetsMetadata] = useState([]);
  const [foundGame, setFoundGame] = useState(false);

  const [open, setOpen] = useState(true);
  const [isOpen, setIsOpen] = useState(true);

  const Menus = [
    { title: "Sets", src: "Chart_fill" },
    { title: "Games", src: "Chat" },
    { title: "Settings", src: "Setting" },
  ];

  // collapse sidebar if screen is too small
  useEffect(() => {
    addEventListener("resize", handleResize);
  }, []);

  const handleResize = () => {
    if (window.innerWidth < 960) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (rightSide === "Sets")
      setRightComponent(
        <FlashcardSetsContainer
          metadata={setsMetadata}
          setSetsMetadata={setSetsMetadata}
          setUserData={setUserData}
          userId={props.userId}
        />
      );
    else if (rightSide == "Games") setRightComponent(<Games />);
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

  // check if teacher had a game running
  useEffect(() => {
    if (userData) {
      checkAlreadyConnected(userData._id);
    }
  }, [userData]);

  useEffect(() => {
    socket.on("checkAlreadyConnectedResult", (result) => {
      if (userData) {
        console.log(result);
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
  // return (
  //   <>
  //     {redirect ? (
  //       <Redirect noThrow from="/teacher" to="/login" />
  //     ) : redirectGame ? (
  //       <Redirect noThrow from="/teacher" to="/game" />
  //     ) : (
  //       <>
  //         {loading === true && <Navbar blank={true} />}
  //         {loading === false && (
  //           <Navbar userId={userData._id} userRole={userData.role} userName={userData.name} />
  //         )}
  //         {foundGame && (
  //           <div className="fixed top-[75px] h-[20px] text-center pt-[3px] w-full z-10 mx-auto bg-red-500">
  //             <div className="hover:cursor-pointer" onClick={handleRejoin}>
  //               You have a class playing! Click to rejoin
  //             </div>
  //           </div>
  //         )}
  //         <div class="h-[75px]"></div>
  //         <div className="flex h-[calc(100vh_-_75px)] font-Ubuntu text-blue-100">
  //           <div
  //             className={` ${open ? "w-[12%]" : "w-[3%] "} bg-gray-800 p-5 relative duration-300`}
  //           >
  //             <img
  //               src="../../assets/control.png"
  //               className={`absolute cursor-pointer -right-3 top-[2.5%] z-10 w-8 border-dark-purple
  //          border-2 rounded-full ${!open && "rotate-180"}`}
  //               onClick={() => setOpen(!open)}
  //             />

  //             <div className="flex gap-x-4 items-center mx-auto">
  //               <img
  //                 src="../../assets/logo.png"
  //                 className={`cursor-pointer duration-500 ${open && "rotate-[360deg]"} w-10`}
  //               />
  //               <h1 className={` origin-left font-medium text-xl ${!open && "hidden"}`}>
  //                 Dashboard
  //               </h1>
  //             </div>

  //             <div className="pt-6">
  //               {Menus.map((Menu, index) => (
  //                 <div
  //                   onClick={() => {
  //                     setRightSide(Menu.title);
  //                   }}
  //                   key={index}
  //                   className={`${
  //                     rightSide === Menu.title && "bg-blue-800"
  //                   } flex py-2 my-5 cursor-pointer text-xl items-center mx-auto gap-x-4 rounded-md hover:rounded-3xl hover:bg-blue-500 transition-all
  //                   duration-300 ease-in`}
  //                 >
  //                   <img className="w-10" src={`../../assets/${Menu.src}.png`} />
  //                   <span className={`${!open && "hidden"} origin-left duration-200 my-auto`}>
  //                     {Menu.title}
  //                   </span>
  //                 </div>
  //               ))}
  //             </div>
  //           </div>

  //           <div className="flex-1 overflow-y-hidden">
  //             {loading === false && rightComponent}
  //             {loading === true && (
  //               <div className="background text-[2vw] text-green-200">
  //                 Loading teacher dashboard...
  //               </div>
  //             )}
  //           </div>
  //         </div>
  //       </>
  //     )}
  //   </>
  // );

  return (
    <>
      {redirect ? (
        <Redirect noThrow from="/teacher" to="/login" />
      ) : redirectGame ? (
        <Redirect noThrow from="/teacher" to="/game" />
      ) : (
        <>
          {loading === true && <Navbar blank={true} />}
          {loading === false && (
            <Navbar userId={userData._id} userRole={userData.role} userName={userData.name} />
          )}
          {foundGame && (
            <div className="fixed top-[75px] h-[20px] text-center pt-[3px] w-full z-10 mx-auto bg-red-500">
              <div className="hover:cursor-pointer" onClick={handleRejoin}>
                You have a class playing! Click to rejoin
              </div>
            </div>
          )}
          <div className="bg-white bg-fixed bg-cover h-screen">
            <div class="h-[75px]"></div>
            <div className="relative">
              <LeftSideBar isOpen={isOpen} setIsOpen={setIsOpen} setRightSide={setRightSide} />
              <div
                className={`h-[calc(100vh_-_78px)] overflow-y-hidden overflow-x-hidden left-0 transition-left duration-300 ${
                  isOpen ? "ml-64" : "ml-0"
                }`}
              >
                {loading === false && rightComponent}
                {loading === true && (
                  <div className="background text-[2vw] text-green-200">
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

export default TeacherDashboard;
