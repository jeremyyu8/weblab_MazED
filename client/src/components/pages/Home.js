import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities";
import { Link, Redirect } from "@reach/router";

// import modules
import Navbar from "../modules/Navbar";
import Card from "./Card.js";

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
              <div className="typewriter text-[2vw] w-[85%] mb-4">
                <h1>Welcome to MazED</h1>
              </div>
              <div className="p-2 text-blue-400 text-xl w-[70%] text-center">
                <p className="m-2 leading-8">
                  Multiplayer maze + tag game to create learning experiences custom to your
                  classroom
                </p>
              </div>

              {/* <div className="title">Can you find your way out?</div> */}
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
                  window.scrollTo({ top: document.body.scrollHeight * 0.34, behavior: "smooth" });
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
                <Card title="1. Create Account" text="Sign up as teacher or student account"></Card>
              </div>
              <div className="flex flex-wrap justify-evenly pb-8">
                <Card
                  title="Teachers"
                  text="Create new flashcard set or edit existing flashcard sets in 'My Sets'. Start a new game by pressing the play button on any flashcard set and students can join game using the game code"
                ></Card>
                <Card
                  title="Students"
                  text="Edit display name and customize character in 'Settings'. Join a game by entering game code provided by teacher in 'Join Game'"
                ></Card>
              </div>
              <div className="flex flex-wrap justify-evenly pb-4">
                <div className="p-4 mt-8 text-[3vw] xl:w-2/3 md:w-1/3 md:text-[1.5vw] w-7/12">
                  <div className="bg-blue-500 bg-opacity-60 hover:bg-opacity-90 hover:scale-110 transition duration-300 ease-in-out h-full rounded-lg mb-6 flex flex-col relative overflow-hidden shadow-xl">
                    <div class="text-[4vw] text-blue-100 mt-8 ml-8 md:text-[3vw]">Why MazED?</div>
                    <div className="pt-4 pl-8 pr-8 flex rounded-lg items-center text-gray-900">
                      <p className="leading-8">
                        Not only is MazED a fun and engaging way for students to learn, it provides
                        tools such as game analyses that help teachers better understand which
                        questions their students struggle on in order to identify how to help them.
                        Teachers can tailor MazED to their specific classroom needs through creating
                        their custom flashcard sets and choosing between different game modes and
                        customizations.
                      </p>
                    </div>
                    <div className="pt-16 text-center mb-10">
                      <Link
                        to="/signup"
                        className="text-white text-[2vw] bg-blue-800 rounded-full border-0 transition-colors duration-250 hover:bg-blue-500 cursor-pointer p-4 px-[3vw] no-underline"
                      >
                        Sign up for free today!
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default Home;
