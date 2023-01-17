import React from "react";

const StudentDashboard = () => {
  return (
    <>
      This is the student dashboard.
      <button
        onClick={() => {
          window.location.replace("/");
        }}
      >
        Back to Home
      </button>
    </>
  );
};

export default StudentDashboard;
