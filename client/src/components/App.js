import React, { useState, useEffect } from "react";
import { Router } from "@reach/router";
import jwt_decode from "jwt-decode";

import Phaser from "phaser";
import { IonPhaser } from "@ion-phaser/react";

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
  const [userName, setUserName] = useState(undefined);

  useEffect(() => {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        setUserId(user._id);
        setUserRole(user.role);
        setUserName(user.name);
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
    window.location.replace("/");
  };

  //phaser
  const game = {
    width: "100%",
    height: "100%",
    type: Phaser.AUTO,
    scene: {
      init: function () {
        this.cameras.main.setBackgroundColor("#24252A");
      },
      create: function () {
        this.helloWorld = this.add.text(
          this.cameras.main.centerX,
          this.cameras.main.centerY,
          "Hello World",
          {
            font: "40px Arial",
            fill: "#ffffff",
          }
        );
        this.helloWorld.setOrigin(0.5);
      },
      update: function () {
        this.helloWorld.angle += 1;
      },
    },
  };
  return (
    <>
      <Router>
        <IonPhaser path="/game" game={game} />
        <Home path="/" userId={userId} userRole={userRole} userName={userName} />
        <GameLobby path="/lobby" />
        <TeacherEdit path="/teacher/edit/*" userId={userId} />
        <TeacherDashboard
          path="/teacher"
          userId={userId}
          userRole={userRole}
          userName={userName}
          hl={handleLogout}
        />
        <StudentDashboard
          path="/student"
          userId={userId}
          userRole={userRole}
          userName={userName}
          hl={handleLogout}
        />
        <StudentGame path="/student/game" />
        <Signup
          path="/signup"
          handleNewStudentAccount={handleNewStudentAccount}
          handleNewTeacherAccount={handleNewTeacherAccount}
          handleLogout={handleLogout}
          userId={userId}
          userRole={userRole}
        />
        <Login
          path="/login"
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          userId={userId}
          userRole={userRole}
        />
        <MazePage path="/maze" />
        <NotFound default />
      </Router>
    </>
  );
};

export default App;
