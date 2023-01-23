import React, { useState, useEffect } from "react";
import Navbar from "../modules/Navbar";
import { Redirect } from "@reach/router";
import { Link } from "@reach/router";

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

          <div className="bg-spaceimg2 bg-fixed bg-cover h-screen flex flex-col items-center justify-center">
            <div class="rounded-xl bg-zinc-900 bg-opacity-80 px-16 py-10 shadow-lg max-sm:px-8 flex flex-col items-center justify-center">
              <div className="text-blue-200 text-7xl">You are not currently logged in</div>
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
              <div className="text-blue-200 text-2xl">
                {userId ? (
                  <div>
                    You are currently logged in with userId: {userId}. Your account type is:{" "}
                    {userRole}
                  </div>
                ) : (
                  <div>
                    Log in or{" "}
                    <Link
                      to="/signup"
                      className="no-underline text-blue-500 text-2xl transition-colors duration-250 hover:text-blue-300"
                    >
                      create a new account
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Login;
