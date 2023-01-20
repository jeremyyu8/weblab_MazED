import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities";
import { Link, Redirect } from "@reach/router";

// import modules
import Navbar from "../modules/Navbar";

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

  const temp_func = () => {
    const body = {
      title: "test_set_1",
      size: 30,
      cards: [
        { questions: "why", choices: ["a", "b", "c", "d"], answers: [1] },
        { questions: "who", choices: ["asd", "b", "c", "d"], answers: [2] },
        { questions: "as", choices: ["a", "b", "c", "s"], answers: [3, 0] },
      ],
    };

    post("/api/newset", body).then(console.log("new set created successfully"));
  };

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
          <div className="relative max-w-[50%] px-6 mx-auto mt-[18vh] border border-solid border-black rounded-xl h-[70vh] bg-spaceimg">
            <div className="text-5xl pt-20 text-center text-rose-50">
              Can you find your way out?
            </div>
            <div className="text-3xl pt-16 text-center text-rose-100">Sign up for free!</div>
            <div className="pt-16 text-center">
              <Link
                to="/signup"
                className="text-white bg-sky-500 text-[14px] rounded-md border-0 transition-colors duration-250 hover:bg-sky-300 cursor-pointer p-4 px-12 no-underline"
              >
                Sign Up
              </Link>
            </div>
          </div>
          <div>
            <Link to="/teacher">
              <button>Teacher Dashboard</button>
            </Link>
            <Link to="/student">
              <button>Student Dashboard</button>
            </Link>
            <Link to="/maze">
              <button>maze testing</button>
            </Link>
            <button onClick={temp_func}>click me (log in first please)</button>;
          </div>
        </>
      )}
    </>
  );
};
export default Home;
