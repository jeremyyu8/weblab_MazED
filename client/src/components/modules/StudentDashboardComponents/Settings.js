import React, { useState, useEffect } from "react";

import { get } from "../../../utilities";

import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = "810136167494-687miqucn5faftjcgheo691e8n1pddti.apps.googleusercontent.com";

/**
 * Settings page inside of teacher dashboard
 *
 * Proptypes
 * @param {hl} hl handle logout
 * @param {userData} userData user data object (same structure as user mongoose schema)
 */
const Settings = (props) => {
  return (
    <>
      <div className="background">
        <div class="sheerbox">
          <div className="pt-[1vh] pb-[1vh] text-blue-200">
            <div>your id: {props.userData._id}</div>
            <div>your name: {props.userData.name} </div>
            <div>your role: {props.userData.role} </div>
            <div>account creation date: {props.userData.creation_date}</div>
            <div>number of sets: {props.userData.sets.length}</div>
          </div>
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <button
              onClick={() => {
                googleLogout();
                props.hl();
              }}
            >
              Logout
            </button>
          </GoogleOAuthProvider>
        </div>
      </div>
    </>
  );
};

export default Settings;
