import React from "react";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";

// import modules
import Navbar from "./modules/Navbar";

// import pages
import TeacherDashboard from "./TeacherDashboard";
import Login from "./Login";
import Signup from "./Signup";
import Maze from "../Maze";

import "../../utilities.css";
import "./Home.css";

const GOOGLE_CLIENT_ID = "810136167494-687miqucn5faftjcgheo691e8n1pddti.apps.googleusercontent.com";

const Home = () => {
  return (
    <>
      <Navbar />
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
