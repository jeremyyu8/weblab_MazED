import React from "react";
import Navbar from "../modules/Navbar";

import "../../utilities.css";
import "./TeacherDashboard.css";

const TeacherDashboard = () => {
  return (
    <>
      <Navbar />
      This is the teacher dashboard.
      <button
        onClick={() => {
          window.location.replace("/");
        }}
      >
        Back to Home
      </button>
      <button
        onClick={() => {
          window.location.replace("/teacher/edit");
        }}
      >
        Edit
      </button>
    </>
  );
};

export default TeacherDashboard;
