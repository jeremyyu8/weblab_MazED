import React, { useState, useEffect } from "react";
import { Redirect } from "@reach/router";

// module imports
import Navbar from "../modules/Navbar";
import SignupPageStudent from "../modules/SignupPageComponents/SignupPageStudent";
import SignupPageTeacher from "../modules/SignupPageComponents/SignupPageTeacher";

const Signup = ({
  userId,
  userRole,
  handleNewTeacherAccount,
  handleNewStudentAccount,
  handleLogout,
}) => {
  const [displayState, setDisplayState] = useState(0);
  const [display, setDisplay] = useState(null);
  // 0: display options
  // 1: display teacher log-in
  // 2: display student log-in
  const [redirect, setRedirect] = useState(userId ? true : undefined);

  useEffect(() => {
    if (userId) {
      setRedirect(true);
    } else {
      setRedirect(undefined);
    }
  }, [userId]);

  useEffect(() => {
    if (displayState === 0) {
      setDisplay(
        <>
          <div className="background h-[100%]">
            <div class="sheerbox h-[90%] w-[60%] mt-[6%]">
              <div className="pagetitle mt-12 text-center h-[20%]">Create user account:</div>

              <div class="flex flex-wrap justify-evenly mt-8">
                <div class="p-4 text-[3vw] xl:w-2/5 w-7/12 h-[85%] md:w-1/3 md:text-[1.5vw]">
                  <div
                    class="bg-blue-100 hover:cursor-pointer border-solid border-8 border-blue-200 h-full rounded-lg mb-6 flex flex-col relative overflow-hidden shadow-xl hover:scale-110 transition duration-300 ease-in-out hover:border-blue-500"
                    onClick={() => {
                      setDisplayState(1);
                    }}
                  >
                    <div class="ml-4 mb-4">
                      <div className="flex justify-center">
                        <img
                          className="object-contain h-52 w-40"
                          src="https://upload.wikimedia.org/wikipedia/commons/6/60/Bringer_of_War_Planet.png"
                        ></img>
                      </div>
                    </div>
                    <div class="px-3 py-4 pb-6 h-[35vh]">
                      <div class="text-blue-500 text-3xl text-bold mb-2 text-center font-bold">
                        Teacher
                      </div>
                      <ul class="list-disc text-blue-400">
                        <li className="my-4">Create and play flashcard sets</li>
                        <li className="my-4">Start and manage maze games</li>
                        <li className="my-4">
                          See student statistics to improve classroom learning experience
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="p-4 text-[3vw] xl:w-2/5 w-7/12 h-[85%] md:w-1/3 md:text-[1.5vw]">
                  <div
                    class="bg-blue-100 hover:cursor-pointer border-solid border-8 border-blue-200 h-full rounded-lg mb-6 flex flex-col relative overflow-hidden shadow-xl hover:scale-110 transition duration-300 ease-in-out hover:border-blue-500"
                    onClick={() => {
                      setDisplayState(2);
                    }}
                  >
                    <div class="mb-4 ml-4">
                      <div className="flex justify-center">
                        <img
                          className="object-contain h-52 w-40"
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Ice_planet.png/1200px-Ice_planet.png"
                        ></img>
                      </div>
                    </div>

                    <div class="px-3 py-4 pb-6 h-[35vh]">
                      <div class="text-blue-500 text-3xl text-bold mb-2 text-center font-bold">
                        Student
                      </div>
                      <ul class="list-disc text-blue-400 ">
                        <li className="my-4">Join maze games using game code</li>
                        <li className="my-4">Review statistics across all played games</li>
                        <li className="my-4">Customize game character</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    } else if (displayState === 1) {
      setDisplay(
        <SignupPageTeacher
          userId={userId}
          handleLogin={handleNewTeacherAccount}
          handleLogout={handleLogout}
          setDisplayState={setDisplayState}
        />
      );
    } else {
      setDisplay(
        <SignupPageStudent
          userId={userId}
          handleLogin={handleNewStudentAccount}
          handleLogout={handleLogout}
          setDisplayState={setDisplayState}
        />
      );
    }
  }, [displayState, userId]);

  return (
    <>
      {redirect ? (
        userRole === "teacher" ? (
          <Redirect noThrow from="/signup" to="/teacher" />
        ) : (
          <Redirect noThrow from="/signup" to="/student" />
        )
      ) : (
        <>
          <Navbar />
          <div>{display}</div>
        </>
      )}
    </>
  );
};

export default Signup;

/* <h1>Good luck on your project :)</h1>
<h2> What you need to change in this skeleton</h2>
<ul>
  <li>
    Change the Frontend CLIENT_ID (Skeleton.js) to your team's CLIENT_ID (obtain this at
    http://weblab.us/clientid)
  </li>
  <li>Change the Server CLIENT_ID to the same CLIENT_ID (auth.js)</li>
  <li>
    Change the Database SRV (mongoConnectionURL) for Atlas (server.js). You got this in the
    MongoDB setup.
  </li>
  <li>Change the Database Name for MongoDB to whatever you put in the SRV (server.js)</li>
</ul>
<h2>How to go from this skeleton to our actual app</h2>
<a href="https://docs.google.com/document/d/110JdHAn3Wnp3_AyQLkqH2W8h5oby7OVsYIeHYSiUzRs/edit?usp=sharing">
  Check out this getting started guide
</a> */
