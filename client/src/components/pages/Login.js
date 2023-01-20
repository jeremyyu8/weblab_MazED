import React, { useState, useEffect } from "react";
import Navbar from "../modules/Navbar";
import { Redirect } from "@reach/router";

import {
  GoogleOAuthProvider,
  GoogleLogin,
  googleLogout,
  useGoogleLogin,
} from "@react-oauth/google";

const GOOGLE_CLIENT_ID = "810136167494-687miqucn5faftjcgheo691e8n1pddti.apps.googleusercontent.com";

const Login = ({ userId, userRole, handleLogin, handleLogout }) => {
  const [redirect, setRedirect] = useState(userId ? true : undefined);

  useEffect(() => {
    if (userId) {
      setRedirect(true);
    } else {
      setRedirect(undefined);
    }
  }, [userId]);

  // const custom_google_login = useGoogleLogin({
  //   onSuccess: handleLogin,
  // });

  return (
    <>
      {redirect ? (
        userRole === "teacher" ? (
          <Redirect noThrow from="/login" to="/teacher" />
        ) : (
          <Redirect noThrow from="/login" to="/student" />
        )
      ) : (
        <>
          <Navbar />
          <div>
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
                <GoogleLogin
                  render={(renderProps) => (
                    <button onClick={renderProps.onClick} disabled={renderProps.disabled}>
                      This is my custom Google button
                    </button>
                  )}
                  onSuccess={handleLogin}
                  onError={(err) => console.log(err)}
                />
                // <button
                //   type="button"
                //   className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2"
                //   // onClick={() => {
                //   //   useGoogleLogin({
                //   //     onSuccess: handleLogin,
                //   //   });
                //   // }}
                //   onClick={() => useGoogleLogin({ onSuccess: console.log("hi") })}
                // >
                //   <svg
                //     className="w-4 h-4 mr-2 -ml-1"
                //     aria-hidden="true"
                //     focusable="false"
                //     data-prefix="fab"
                //     data-icon="google"
                //     role="img"
                //     xmlns="http://www.w3.org/2000/svg"
                //     viewBox="0 0 488 512"
                //   >
                //     <path
                //       fill="currentColor"
                //       d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                //     ></path>
                //   </svg>
                //   Sign in with Google
                // </button>
              )}
            </GoogleOAuthProvider>
            <button
              type="button"
              className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2"
            >
              <svg
                className="w-4 h-4 mr-2 -ml-1"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
              Sign in with Google
            </button>
            {userId ? (
              <div>
                You are currently logged in with userId: {userId}. Your account type is: {userRole}
              </div>
            ) : (
              <div>You are not currently logged in. Log in or create a new account.</div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Login;
