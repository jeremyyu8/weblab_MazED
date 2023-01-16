import React from "react";

const Login = () => {
  return (
    <>
      This is the login page.
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

export default Login;
