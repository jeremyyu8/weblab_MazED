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
            <div class="rounded-3xl bg-zinc-900 bg-opacity-80 px-16 py-10 shadow-lg max-sm:px-8 flex flex-col items-center justify-center">
              <div className="text-blue-200 text-7xl">Can you find your way out?</div>
              <div className="pt-16 text-center">
                <Link
                  to="/signup"
                  className="text-white bg-blue-800 text-3xl rounded-full border-0 transition-colors duration-250 hover:bg-blue-500 cursor-pointer p-4 px-12 no-underline"
                >
                  Sign Up for free
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

          <div className="bg-stone-900 bg-fixed bg-cover h-screen flex flex-col justify-evenly">
            <div className="flex flex-wrap justify-evenly">
              <div className="p-4 xl:w-1/3 md:w-1/2 w-7/12 mb-12">
                <div className="bg-blue-500 bg-opacity-60 hover:bg-opacity-90 hover:scale-110 transition duration-300 ease-in-out h-full rounded-lg mb-6 flex flex-col relative overflow-hidden shadow-xl">
                  <div class="text-4xl text-blue-100 mt-8 ml-8">Flashcards</div>
                  <div className="pt-4 pl-8 pr-8 flex rounded-lg items-center text-gray-900 text-lg">
                    <p>Create your own set of flashcards, custom to your classroom.</p>
                  </div>
                </div>
              </div>

              <div className="p-4 xl:w-1/3 md:w-1/2 w-7/12 mb-12">
                <div className="bg-blue-500 bg-opacity-60 hover:bg-opacity-90 hover:scale-110 transition duration-300 ease-in-out h-full rounded-lg mb-6 flex flex-col relative overflow-hidden shadow-xl">
                  <div class="text-4xl text-blue-100 mt-8 ml-8">Create</div>
                  <div className="pt-4 pl-8 pr-8 flex rounded-lg items-center text-gray-900 text-lg">
                    <p>Create and join unique game lobbies.</p>
                  </div>
                </div>
              </div>

              <div className="p-4 xl:w-1/3 md:w-1/2 w-7/12 mb-12">
                <div className="bg-blue-500 bg-opacity-60 hover:bg-opacity-90 hover:scale-110 transition duration-300 ease-in-out h-full rounded-lg mb-6 flex flex-col relative overflow-hidden shadow-xl">
                  <div class="text-4xl text-blue-100 mt-8 ml-8">MazED</div>
                  <div className="pt-4 pl-8 pr-8 flex rounded-lg items-center text-gray-900 text-lg">
                    <p>
                      Answer questions to escape the maze! Don't get tagged by other players, level
                      up to tag them first.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 xl:w-1/3 md:w-1/2 w-7/12 mb-12">
                <div className="bg-blue-500 bg-opacity-60 hover:bg-opacity-90 hover:scale-110 transition duration-300 ease-in-out h-full rounded-lg mb-6 flex flex-col relative overflow-hidden shadow-xl">
                  <div class="text-4xl text-blue-100 mt-8 ml-8">Review</div>
                  <div className="pt-4 pl-8 pr-8 flex rounded-lg items-center text-gray-900 text-lg">
                    <p>
                      Review past games and missed questions to enhance your learning experience.
                    </p>
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
