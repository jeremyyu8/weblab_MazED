import React, { useState, useEffect } from "react";

import { get, post } from "../../../utilities";

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
  const [showDisplay, setShowDisplay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [doneLoading, setDoneLoading] = useState(false);
  const [input, setInput] = useState("");
  const [displayname, setDisplayname] = useState(props.userData.displayname);
  const [displaynameError, setDisplaynameError] = useState(false);

  const handleChange = (event) => {
    if (event.target.value.length < 15) {
      setInput(event.target.value);
    }
  };

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

  const handleShowChangeDisplay = () => {
    setShowDisplay(true);
  };
  const cancelShowChangeDisplay = () => {
    setShowDisplay(false);
  };
  const handleDisplayNameChange = (displayname) => {
    const changeDisplayName = async () => {
      setShowDisplay(false);
      setLoading(true);
      await post("/api/displayname", { displayname: displayname });
      setLoading(false);
      setDoneLoading(true);
      setDisplayname(displayname);
      setTimeout(() => {
        setDoneLoading(false);
      }, 4000);
    };
    if (!displaynameError) {
      if (displayname.length < 3) {
        setDisplaynameError(true);
        setTimeout(() => {
          setDisplaynameError(false);
        }, 2000);
      } else {
        changeDisplayName();
      }
    }
  };

  let data = [];
  // name
  data.push(<div>Name: {props.userData.name} </div>);
  // display name
  data.push(<div>Display Name: {displayname}</div>);
  // role
  data.push(<div>Role: {props.userData.role} </div>);
  // account creation date
  data.push(<div>Account creation date: {make_human_readable(props.userData.creation_date)}</div>);

  return (
    <>
      <div className="background">
        <div className="sheerbox">
          <div className="w-[60vw] h-[80vh]">
            <div className="text-[4vw]">Customization Settings</div>
            <div className="text-[3vw] mt-[2vh]">
              Display Name: <span className="text-blue-600">{displayname}</span>
            </div>
            <button className="font-Ubuntu" onClick={handleShowChangeDisplay}>
              Change display name
            </button>
            {showDisplay && (
              <>
                <div>
                  <input className="font-Ubuntu" maxlength="15" onInput={handleChange}></input>
                </div>
                <div>
                  <button className="font-Ubuntu" onClick={() => handleDisplayNameChange(input)}>
                    Confirm
                  </button>
                  <button className="font-Ubuntu" onClick={cancelShowChangeDisplay}>
                    Cancel
                  </button>
                </div>
              </>
            )}
            {loading && <div className="text-green-500">Saving display name...</div>}
            {doneLoading && (
              <div className="text-green-500">
                Saved! Refresh the page before joining your next game to use your new display name.
              </div>
            )}
            {displaynameError && (
              <div className="text-red-600 animate-shake">
                display name must be at least 3 characters!
              </div>
            )}
            <hr />
            Account metadata:
            <div className="pt-[1vh] pb-[1vh] text-blue-200">{data}</div>
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
      </div>
    </>
  );
};

export default Settings;
