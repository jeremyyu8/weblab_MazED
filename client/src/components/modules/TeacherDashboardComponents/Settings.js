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
  const make_human_readable = (iso) => {
    let date = new Date(iso);

    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const utc = Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    );

    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  let data = [];
  // name
  data.push(<div>Name: {props.userData.name} </div>);
  // role
  data.push(<div>Role: {props.userData.role} </div>);
  // number of sets
  data.push(<div>Number of sets: {props.userData.sets.length}</div>);
  // account creation date
  data.push(<div>Account creation date: {make_human_readable(props.userData.creation_date)}</div>);

  return (
    <>
      <div className="background">
        <div className="sheerbox">{data}</div>
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
    </>
  );
};

export default Settings;
