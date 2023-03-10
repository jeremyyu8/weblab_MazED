import React, { useState, useEffect } from "react";

import { get, post } from "../../../utilities";

import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";

import { drawCatCarouselCanvas } from "../../../canvasManagerCatCarousel";
import Carousel from "./Carousel";
const GOOGLE_CLIENT_ID = "810136167494-687miqucn5faftjcgheo691e8n1pddti.apps.googleusercontent.com";

/**
 * Settings page inside of teacher dashboard
 *
 * Proptypes
 * @param {hl} hl handle logout
 * @param {userData} userData user data object (same structure as user mongoose schema)
 * @param {function} setUserData set user data state setter
 */
const Settings = (props) => {
  const [showDisplay, setShowDisplay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [doneLoading, setDoneLoading] = useState(false);
  const [input, setInput] = useState("");
  const [displayname, setDisplayname] = useState(props.userData.displayname);
  const [displaynameError, setDisplaynameError] = useState(false);
  const [skin, setSkin] = useState(props.userData.skin);

  let carouselContent = [
    "grey_000",
    "grey_001",
    "grey_002",
    "grey_tabby_000",
    "grey_tabby_001",
    "grey_tabby_002",
    "black_000",
    "black_001",
    "black_002",
    "black_003",
    "blue_000",
    "blue_001",
    "blue_002",
    "blue_003",
    "brown_000",
    "brown_001",
    "brown_002",
    "calico_000",
    "creme_000",
    "creme_001",
    "creme_002",
    "dark_000",
    "dark_001",
    "dark_002",
    "dark_004",
    "ghost_000",
    "gold_000",
    "green_000",
    "green_001",
    "orange_002",
    "orange_003",
    "orange_tabby_000",
    "orange_tabby_001",
    "pink_000",
    "pink_001",
    "radioactive_000",
    "red_000",
    "Seal_Point_000",
    "Seal_Point_001",
    "white_000",
    "white_grey_000",
    "white_grey_001",
    "white_grey_002",
    "dark_003",
    "clown_000",
  ];

  let catNames = [
    "Tawny",
    "Buttercup",
    "Snowball",
    "Rascal",
    "Peanut",
    "Nala",
    "Shadow",
    "Whiskers",
    "Jasper",
    "Casper",
    "Cleo",
    "Scaredy",
    "Oreo",
    "Simba",
    "Marmalade",
    "Felix",
    "Willow",
    "Spooky",
    "Zippy",
    "Chirpy",
    "Salem",
    "Luna",
    "Tuxedo",
    "Tabby",
    "Twix",
    "Witty",
    "Tilly",
    "Tiger",
    "Tiger Lily",
    "Zorro",
    "Tortie",
    "Coco",
    "Mittens",
    "Socks",
    "Zoey",
    "Rusty",
    "Tumble",
    "Spot",
    "Smokey",
    "Oscar",
    "Simba",
    "Smokey",
    "Tiger",
    "KChoi",
    "NTsao",
  ];

  let catFileToName = {};
  let catNameToFile = {};
  console.log(carouselContent.length);
  console.log(catNames.length);
  for (let idx = 0; idx < carouselContent.length; idx++) {
    catFileToName[carouselContent[idx]] = catNames[idx];
    catNameToFile[catNames[idx]] = carouselContent[idx];
  }

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
      const data = await get("/api/userbyid");
      props.setUserData(data);
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
  data.push(
    <div>
      Name: <span className="text-blue-600">{props.userData.name}</span>
    </div>
  );

  // role
  data.push(
    <div>
      Role: <span className="text-blue-600">{props.userData.role} </span>
    </div>
  );
  // account creation date
  data.push(
    <div>
      Avatar: <span className="text-blue-600">{catFileToName[skin]}</span>
    </div>
  );
  data.push(
    <div>
      Account creation date:{" "}
      <span className="text-blue-600">{make_human_readable(props.userData.creation_date)}</span>
    </div>
  );

  let stats = [];
  stats.push(
    <div>
      Games won: <span className="text-blue-600">{props.userData.games_won}</span>
    </div>
  );
  stats.push(
    <div>
      Games played: <span className="text-blue-600">{props.userData.games_played}</span>
    </div>
  );
  stats.push(
    <div>
      Players tagged: <span className="text-blue-600"> {props.userData.tags}</span>
    </div>
  );
  stats.push(
    <div>
      Been tagged: <span className="text-blue-600">{props.userData.tagged}</span>
    </div>
  );

  return (
    <>
      <div className="background">
        <div className="sheerbox h-full overflow-scroll no-scrollbar">
          <div className="w-[60vw] h-full overflow-scroll no-scrollbar">
            <div className="flex flex-col">
              <div className="text-[3.5vw] mt-10 mx-auto">Customization Settings</div>
              <div className="text-[2vw] mt-[2vh] mx-auto">
                Display Name: <span className="text-blue-600">{displayname}</span>
              </div>
            </div>
            <div className="flex justify-center m-4">
              <button
                className="font-Ubuntu w-[30%] p-1 text-md hover:cursor-pointer hover:bg-blue-400"
                onClick={handleShowChangeDisplay}
              >
                Change display name
              </button>
            </div>
            {showDisplay && (
              <>
                <div className="flex justify-center mt-[-0.8rem] mb-4">
                  <div>
                    <input
                      className="font-Ubuntu text-md p-1"
                      maxlength="15"
                      placeholder="New Display Name"
                      onInput={handleChange}
                    ></input>
                  </div>
                  <div>
                    <button
                      className="font-Ubuntu text-md hover:cursor-pointer hover:bg-blue-400 p-1"
                      onClick={() => handleDisplayNameChange(input)}
                    >
                      Confirm
                    </button>
                    <button
                      className="font-Ubuntu text-md hover:cursor-pointer hover:bg-blue-400 p-1"
                      onClick={cancelShowChangeDisplay}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            )}

            {loading && <div className="text-green-500">Saving display name...</div>}
            {doneLoading && <div className="text-green-500">Saved!</div>}
            {displaynameError && (
              <div className="text-red-600 animate-shake">
                display name must be at least 3 characters!
              </div>
            )}
            <hr />
            <div className="flex grow">
              <div className="flex-1 text-2xl">
                Account data:
                <div className="pt-[1vh] pb-[1vh] text-blue-200 text-xl">{data}</div>
              </div>
              <div className="flex-1 text-2xl">
                Lifetime stats:
                <div className="pt-[1vh] pb-[1vh] text-blue-200 text-xl">{stats}</div>
              </div>
            </div>

            <hr />
            <Carousel
              content={carouselContent}
              userData={props.userData}
              catFileToName={catFileToName}
              catNameToFile={catNameToFile}
              setSkin={setSkin}
              setUserData={props.setUserData}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
