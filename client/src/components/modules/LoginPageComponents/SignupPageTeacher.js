import React from "react";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = "810136167494-687miqucn5faftjcgheo691e8n1pddti.apps.googleusercontent.com";

/**
 * display signup for teachers
 *
 * Proptypes
 * @param {userId} userId userId if logged in else null
 * @param {handleLogin} handleLogin login function
 * @param {handleLogout} handleLogout logout function
 * @param {setDisplayState} setDisplayState set display state for signin page
 */
const SignupPageTeacher = ({ userId, handleLogin, handleLogout, setDisplayState }) => {
  return (
    <>
      <div>This is the signup display for teachers</div>
      <button
        onClick={() => {
          setDisplayState(0);
        }}
      >
        back
      </button>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        {userId ? (
          <button
            onClick={() => {
              console.log(userId);
              googleLogout();
              handleLogout();
            }}
          >
            Logout
          </button>
        ) : (
          <GoogleLogin onSuccess={handleLogin} onError={(err) => console.log(err)} />
        )}
      </GoogleOAuthProvider>
    </>
  );
};

export default SignupPageTeacher;
