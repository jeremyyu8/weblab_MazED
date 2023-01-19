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
import "../output.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";
import GameLobby from "./pages/GameLobby.js";

/**
 * Define the "App" component
 */
const App = () => {
  const [userId, setUserId] = useState(undefined);
  const [userRole, setUserRole] = useState(undefined);

  useEffect(() => {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        setUserId(user._id);
        setUserRole(user.role);
      }
    });
  }, []);

  const handleLogin = (credentialResponse) => {
    const userToken = credentialResponse.credential;
    const decodedCredential = jwt_decode(userToken);
    post("/api/login", { token: userToken })
      .then((user) => {
        console.log(`Logged in as ${decodedCredential.name}`);
        setUserId(user._id);
        setUserRole(user.role);
        post("/api/initsocket", { socketid: socket.id });
      })
      .catch((err) => {
        alert("Failed to log in: user not found. Create a new account at the /signup route!");
      });
  };

  const handleNewTeacherAccount = (credentialResponse) => {
    const userToken = credentialResponse.credential;
    const decodedCredential = jwt_decode(userToken);
    post("/api/signupteacher", { token: userToken }).then((user) => {
      console.log(`Teacher account creation successful. Logged in as ${decodedCredential.name}`);
      setUserId(user._id);
      setUserRole(user.role);
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  const handleNewStudentAccount = (credentialResponse) => {
    const userToken = credentialResponse.credential;
    const decodedCredential = jwt_decode(userToken);
    post("/api/signupstudent", { token: userToken }).then((user) => {
      console.log(`Student account creation successful. Logged in as ${decodedCredential.name}`);
      setUserId(user._id);
      setUserRole(user.role);
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

        <GameLobby path="/lobby/" />
        <TeacherEdit path="/teacher/edit/" />
        <TeacherDashboard path="/teacher/" />
        <StudentDashboard path="/student/" />
        <StudentGame path="/student/game/" />
        <Signup
          path="/signup/"
          handleNewStudentAccount={handleNewStudentAccount}
          handleNewTeacherAccount={handleNewTeacherAccount}
          handleLogout={handleLogout}
          userId={userId}
          userRole={userRole}
        />
        <Login
          path="/login/"
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          userId={userId}
          userRole={userRole}
        />
        <MazePage path="/maze/" />
        <NotFound default />
      </Router>
    </>
  );
};

export default App;
