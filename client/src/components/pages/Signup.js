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
          <div className="bg-spaceimg2 bg-fixed bg-cover h-screen flex flex-col items-center justify-center">
            <div class="rounded-xl bg-zinc-900 bg-opacity-80 px-16 py-10 shadow-lg max-sm:px-8 flex flex-col items-center justify-center">
              <div className="text-blue-200 text-7xl">Create an account as</div>
              <div className="flex flex-row flex-wrap gap-20 mt-8">
                <a href="#" class="no-underline flex flex-col items-center group gap-2">
                  <img
                    className="object-contain h-52 w-48 group-hover:scale-125 transition duration-300 ease-in-out"
                    src="https://upload.wikimedia.org/wikipedia/commons/6/60/Bringer_of_War_Planet.png"
                    onClick={() => {
                      setDisplayState(1);
                    }}
                  ></img>
                  <p className="text-blue-500 text-2xl group-hover:text-blue-300">Teacher</p>
                </a>

                <a href="#" class="no-underline flex flex-col items-center group gap-2">
                  <img
                    className="object-contain h-52 w-48 group-hover:scale-125 transition duration-300 ease-in-out"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Ice_planet.png/1200px-Ice_planet.png"
                    onClick={() => {
                      setDisplayState(2);
                    }}
                  ></img>
                  <p className="text-blue-500 text-2xl group-hover:text-blue-300">Student</p>
                </a>
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
          <div>
            {display}
            {userId ? (
              <div>
                You are currently logged in with userId: {userId}. Your account type is: {userRole}
              </div>
            ) : (
              <div>Create an account. You are not currently logged in.</div>
            )}
            <br />
          </div>
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
