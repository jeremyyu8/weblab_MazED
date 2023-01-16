import React from "react";

const Signup = () => {
  return (
    <>
      This is the signup page.
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

export default Signup;
