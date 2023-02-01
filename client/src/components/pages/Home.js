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
                Making learning fun through an multiplayer maze game
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
                  text="Sign up as teacher or student!"
                  icon={<FontAwesomeIcon icon={faUserPlus} />}
                ></Card>
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
                <Card
                  title="Teachers"
                  icon={<FontAwesomeIcon icon={faPersonChalkboard} />}
                  text="Create and edit flashcard sets. Start a new game by pressing the play button on any flashcard set. Wait for students to join using the game code!"
                ></Card>
                <Card
                  title="Students"
                  icon={<FontAwesomeIcon icon={faBookOpenReader} />}
                  text="Customize avatar and display name in profile. Join a game by entering a game code provided by the teacher!"
                ></Card>
              </div>
              <div className="flex flex-wrap justify-evenly pb-4">
                <div className="p-4 mt-8 text-[3vw] xl:w-2/3 md:w-1/3 md:text-[1.5vw] w-7/12">
                  <div className="bg-blue-500 bg-opacity-60 hover:bg-opacity-90 hover:scale-110 transition duration-300 ease-in-out h-full rounded-lg mb-6 flex flex-col relative overflow-hidden shadow-xl">
                    {/* <img src="./assets/logoicon.png" width={80} /> */}
                    <div class="text-[4vw] text-blue-100 mt-8 ml-8 md:text-[3vw]">Why MazED?</div>
                    <div className="pt-4 pl-8 pr-8 flex rounded-lg items-center text-gray-900">
                      <p className="leading-8">
                        MazED not only only offers students a fun and engaging way to learn but also
                        provides game analyses that help teachers understand which questions
                        students struggle with and tailor to their needs. MazED enables teachers to
                        create unique flashcards sets and helps students improve by targeting on
                        problems that students miss more frequently. With multiple competitive game
                        modes and highly customizable characters, students are encouraged to learn
                        the material to win the game!
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
