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
          <div className="bg-spaceimg2 bg-fixed bg-cover h-screen flex flex-col items-center justify-center">
            <div class="rounded-xl bg-zinc-900 bg-opacity-80 px-16 py-10 shadow-lg max-sm:px-8 flex flex-col items-center justify-center">
              <div className="text-blue-200 text-7xl">Can you find your way out?</div>
              <div className="text-3xl pt-16 text-center text-stone-100">Sign up for free!</div>
              <div className="pt-16 text-center">
                <Link
                  to="/signup"
                  className="text-white bg-blue-800 text-[14px] rounded-md border-0 transition-colors duration-250 hover:bg-blue-500 cursor-pointer p-4 px-12 no-underline"
                >
                  Sign Up
                </Link>
              </div>
            </div>
            <div>
              {/* <Link to="/teacher">
                <button>Teacher Dashboard</button>
              </Link>
              <Link to="/student">
                <button>Student Dashboard</button>
              </Link> */}
              <Link to="/maze">
                <button>maze testing</button>
              </Link>
            </div>
          </div>

          <div className="bg-stone-900 bg-fixed bg-cover h-screen"></div>
        </>
      )}
    </>
  );
};
export default Home;
