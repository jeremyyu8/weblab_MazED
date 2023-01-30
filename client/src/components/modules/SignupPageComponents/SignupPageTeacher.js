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
      <div className="bg-spaceimg2 bg-fixed bg-cover h-screen flex flex-col items-center justify-center">
        <div class="rounded-xl bg-zinc-900 bg-opacity-80 px-16 py-10 shadow-lg max-sm:px-8 flex flex-col items-center justify-center">
          <div className="text-blue-200 text-3xl pb-8">Signup as a teacher</div>

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
          <div className="pt-8">
            <button
              className="editfbuttons"
              onClick={() => {
                setDisplayState(0);
              }}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPageTeacher;
