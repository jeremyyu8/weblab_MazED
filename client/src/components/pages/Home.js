import React from "react";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";

// import pages
import TeacherDashboard from "./TeacherDashboard";
import Login from "./Login";
import Signup from "./Signup";
import Maze from "../Maze";

import "../../utilities.css";
import "./Home.css";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "810136167494-687miqucn5faftjcgheo691e8n1pddti.apps.googleusercontent.com";

const Home = ({ userId, handleLogin, handleLogout }) => {
  return (
    <>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        {userId ? (
          <button
            onClick={() => {
              googleLogout();
              handleLogout();
            }}
          >
            Logout
          </button>
        ) : (
          <GoogleLogin onSuccess={handleLogin} onError={(err) => console.log(err)} />
        )}
        <h1>Good luck on your project :)</h1>
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
        </a>
      </GoogleOAuthProvider>
      <br />
      <div>
        <button
          onClick={() => {
            window.location.replace("/teacher");
          }}
        >
          Teacher Dashboard
        </button>
        <button
          onClick={() => {
            window.location.replace("/student");
          }}
        >
          Student Dashboard
        </button>
        <button
          onClick={() => {
            window.location.replace("/login");
          }}
        >
          Login Page
        </button>
        <button
          onClick={() => {
            window.location.replace("/signup");
          }}
        >
          Signup
        </button>
        <button
          onClick={() => {
            window.location.replace("/maze");
          }}
        >
          Maze testing
        </button>
      </div>
    </>
  );
};

export default Home;
