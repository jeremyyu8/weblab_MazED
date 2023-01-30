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

  <div>
    Players tagged: <span className="text-blue-600"> {props.userData.tags}</span>
  </div>;

  data.push(
    <div>
      Name: <span className="text-blue-600"> {props.userData.name}</span>
    </div>
  );
  // role
  data.push(
    <div>
      Role: <span className="text-blue-600"> {props.userData.role}</span>
    </div>
  );
  // number of sets
  data.push(
    <div>
      Number of sets <span className="text-blue-600"> {props.userData.sets.length}</span>
    </div>
  );
  // account creation date
  data.push(
    <div>
      Account creation date:{" "}
      <span className="text-blue-600"> {make_human_readable(props.userData.creation_date)}</span>
    </div>
  );

  return (
    <>
      <div className="background">
        <div className="sheerbox text-3xl">{data}</div>
        {/* <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <button
            onClick={() => {
              googleLogout();
              props.hl();
            }}
          >
            Logout
          </button>
        </GoogleOAuthProvider> */}
      </div>
    </>
  );
};

export default Settings;
