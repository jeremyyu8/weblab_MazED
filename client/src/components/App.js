import React, { useState, useEffect } from "react";
import { Router } from "@reach/router";
import jwt_decode from "jwt-decode";

// import pages

import NotFound from "./pages/NotFound.js";
import Home from "./pages/Home.js";
import TeacherDashboard from "./pages/TeacherDashboard.js";
import StudentDashboard from "./pages/StudentDashboard.js";
import Login from "./pages/Login.js";
import Signup from "./pages/Signup.js";
import TeacherEdit from "./pages/TeacherEdit.js";
import StudentGame from "./pages/StudentGame.js";
import MazePage from "./MazePage.js";

import "../utilities.css";
import "../output.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";

/**
 * Define the "App" component
 */
const App = () => {
  const [userId, setUserId] = useState(undefined);

  useEffect(() => {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        setUserId(user._id);
      }
    });
  }, []);

  const handleLogin = (credentialResponse) => {
    const userToken = credentialResponse.credential;
    const decodedCredential = jwt_decode(userToken);
    console.log(`Logged in as ${decodedCredential.name}`);
    post("/api/login", { token: userToken }).then((user) => {
      setUserId(user._id);
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  const handleLogout = () => {
    setUserId(undefined);
    post("/api/logout");
  };

  return (
    <>
      <Router>
        <Home path="/" />

        <TeacherEdit path="/teacher/edit" />
        <TeacherDashboard path="/teacher" />
        <StudentDashboard path="/student" />
        <StudentGame path="/student/game" />
        <Signup path="/signup" />
        <Login
          path="/login"
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          userId={userId}
        />
        <MazePage path="/maze" />
        <NotFound default />
      </Router>
    </>
  );
};

export default App;
