import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities";
import { Link, Redirect } from "@reach/router";

// import modules
import Navbar from "../modules/Navbar";
import Card from "./Card.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faPersonChalkboard,
  faBookOpenReader,
} from "@fortawesome/free-solid-svg-icons";
import "../../master.css";

const GOOGLE_CLIENT_ID = "810136167494-687miqucn5faftjcgheo691e8n1pddti.apps.googleusercontent.com";

/**
 * Home page
 *
 * Proptypes
 * @param {userId} userId user id
 * @param {userRole} userRole user role (teacher or student)
 * @param {userName} userName display name of user
 */
const Home = ({ userId, userRole, userName }) => {
  const [redirect, setRedirect] = useState(userId ? true : undefined);

  useEffect(() => {
    if (userId) {
      setRedirect(true);
    } else {
      setRedirect(undefined);
    }
  }, [userId]);

  const handleFileSelected = (e) => {
    post("/image", { name: "temp", desc: "temp desc", image: e.target.file });
  };

  return (
    <>
      {redirect ? (
        userRole === "teacher" ? (
          <Redirect noThrow from="/login" to="/teacher" />
        ) : (
          <Redirect noThrow from="/login" to="/student" />
        )
      ) : (
        <>
          <Navbar userId={userId} userRole={userRole} userName={userName} />
          <div className="background h-[100vh]">
            <div className="sheerbox w-[80%] h-[30%]">
              {/* <div className="hidden typewriter md:flex md:justify-center">
                <h1>Can you find your way out?</h1>
              </div> */}
              <div className="typewriter text-[2vw] w-[54%] mb-4">
                <h1>Welcome to MazED</h1>
              </div>
              <div className="mt-10 text-blue-400 text-3xl w-[70%] text-center">
                Making learning fun through a multiplayer maze game
              </div>
            </div>
            <div>
              {/* <Link to="/maze">
                <button>maze testing</button>
              </Link> */}

              {/* <div className="fixed left-[20%] translate-x-[-50%]">
                <svg className="arrows ">
                  <path class="a1" d="M0 0 L100 52 L200 0"></path>
                  <path class="a2" d="M0 40 L100 92 L200 40"></path>
                  <path class="a3" d="M0 80 L100 132 L200 80"></path>
                </svg>
              </div> */}

              <div
                onClick={() => {
                  window.scrollTo({ top: document.body.scrollHeight * 0.32, behavior: "smooth" });
                }}
                className="absolute left-[50%] transform translate-x-[-50%] bottom-[10%]"
              >
                <div class="arrow">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-stone-900 bg-fixed bg-cover h-auto p-[5vh]">
            <div className="pagetitle text-center p-8 pt-12">How it works</div>
            <div>
              <div className="flex flex-wrap justify-evenly pb-8">
                <Card
                  title="Create Account"
                  text="Sign up as a teacher or student!"
                  icon={<FontAwesomeIcon icon={faUserPlus} />}
                />
              </div>
              <div className="flex flex-wrap justify-evenly pb-8 m-5">
                <div className="arrow rotate-45">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="arrow rotate-[-45deg]">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>

              <div className="flex flex-wrap justify-evenly pb-8">
                <div className="p-4 mt-8 text-[3vw] xl:w-1/3 md:w-1/3 md:text-[1.5vw] w-7/12">
                  <div className="bg-blue-500 bg-opacity-60 hover:bg-opacity-90 hover:scale-110 transition duration-300 ease-in-out h-full rounded-lg mb-6 flex flex-col relative overflow-hidden shadow-xl">
                    <div class="text-[4vw] text-blue-100 mt-8 ml-6 md:text-[3vw]">
                      Teachers <FontAwesomeIcon icon={faPersonChalkboard} />
                    </div>
                    <div className="pt-4 pl-8 pr-8 flex rounded-lg items-center text-gray-900">
                      <ul>
                        <li>Create and edit flashcard sets</li>
                        <li>Start a new game by pressing the play button on any flashcard set.</li>
                        <li>Wait for students to join using the game code!</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 mt-8 text-[3vw] xl:w-1/3 md:w-1/3 md:text-[1.5vw] w-7/12">
                  <div className="bg-blue-500 bg-opacity-60 hover:bg-opacity-90 hover:scale-110 transition duration-300 ease-in-out h-full rounded-lg mb-6 flex flex-col relative overflow-hidden shadow-xl">
                    <div class="text-[4vw] text-blue-100 mt-8 ml-6 md:text-[3vw]">
                      Students <FontAwesomeIcon icon={faBookOpenReader} />
                    </div>
                    <div className="pt-4 pl-8 pr-8 flex rounded-lg items-center text-gray-900">
                      <ul>
                        <li>Customize avatar and display name in profile.</li>
                        <li>Join a game by entering a game code provided by the teacher!</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap justify-evenly pb-4">
                <div className="p-4 mt-8 text-[3vw] xl:w-2/3 md:w-1/3 md:text-[1.5vw] w-7/12">
                  <div className="bg-blue-500 bg-opacity-60 hover:bg-opacity-90 hover:scale-110 transition duration-300 ease-in-out h-full rounded-lg mb-6 flex flex-col relative overflow-hidden shadow-xl">
                    {/* <img src="./assets/logoicon.png" width={80} /> */}
                    <div class="text-[4vw] text-blue-100 mt-8 ml-8 md:text-[3vw]">Why MazED?</div>
                    <div className="pt-4 pl-8 pr-8 flex rounded-lg items-center text-gray-900">
                      <p className="leading-8">
                        MazED unlocks the thrill of learning through its multiplayer tag-style maze
                        game. With the ability for teachers to create flashcard sets and launch
                        lobbies, students are challenged to navigate through a virtual world while
                        mastering the material. Game analyses enable teachers to tailor to students'
                        needs. Customizable characters, multiple game modes, and real-time adaptive
                        learning techniques make each session exciting, turning studying into a game
                        that's too fun to put down!
                      </p>
                    </div>
                    <div className="pt-16 text-center mb-10">
                      <Link
                        to="/signup"
                        className="text-white text-[2vw] bg-blue-800 rounded-full border-0 transition-colors duration-250 hover:bg-blue-400 cursor-pointer p-4 px-[3vw] no-underline"
                      >
                        Sign up for free today!
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-[4vh]"></div>
              <hr className="bg-blue-300" />
              <footer className="text-blue-100 text-lg mt-[2vh] text-center">
                Copyright <span className="text-2xl">&#169;</span> MazED. {"{ web.lab } 2023"}
              </footer>
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default Home;
