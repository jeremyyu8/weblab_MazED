import React from "react";
import Navbar from "../modules/Navbar";

import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = "810136167494-687miqucn5faftjcgheo691e8n1pddti.apps.googleusercontent.com";

const Login = ({ userId, userRole, handleLogin, handleLogout }) => {
  return (
    <>
      <Navbar />
      <div className="mt-[18vh]">
        This is the login page.
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
        {userId ? (
          <div>
            You are currently logged in with userId: {userId}. Your account type is: {userRole}
          </div>
        ) : (
          <div>You are not currently logged in. Log in or create a new account.</div>
        )}
      </div>
    </>
  );
};

export default Login;
