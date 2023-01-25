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
          <div className="background">
            <div className="sheerbox w-[80%] h-[40%]">
              {/* <div className="hidden typewriter md:flex md:justify-center">
                <h1>Can you find your way out?</h1>
              </div> */}
              <div className="typewriter text-[2vw] w-[85%]">
                <h1>Can you find your way out?</h1>
              </div>

              {/* <div className="title">Can you find your way out?</div> */}
              <div className="pt-16 text-center">
                <Link
                  to="/signup"
                  className="text-white text-[2vw] bg-blue-800 rounded-full border-0 transition-colors duration-250 hover:bg-blue-500 cursor-pointer p-4 px-[3vw] no-underline"
                >
                  Sign Up for free
                </Link>
              </div>
            </div>
            <div>
              <Link to="/maze">
                <button>maze testing</button>
              </Link>
            </div>
          </div>
          <div className="bg-stone-900 bg-fixed bg-cover h-auto flex flex-col justify-evenly">
            <div className="flex flex-wrap justify-evenly pb-8">
              <Card
                title="Flashcards"
                text="Create your own set of flashcards, custom to your classroom."
              ></Card>
              <Card title="Create" text="Create and join unique game lobbies."></Card>
              <Card
                title="MazED"
                text="Answer questions to escape the maze! Don't get tagged by other players, level
                      up to tag them first."
              ></Card>
              <Card
                title="Review"
                text="Review past games and missed questions to enhance your learning experience."
              ></Card>
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default Home;
