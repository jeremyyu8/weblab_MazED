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

          <div className="flex flex-col border-solid mx-auto w-[30%]">
            <div className="mx-auto m-3 text-3xl">This is the login page.</div>
            <div className="mx-auto m-3">
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
            </div>
            <div className="mx-auto m-3">
              {userId ? (
                <div>
                  You are currently logged in with userId: {userId}. Your account type is:{" "}
                  {userRole}
                </div>
              ) : (
                <div>You are not currently logged in. Log in or create a new account.</div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Login;
