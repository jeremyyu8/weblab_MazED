import React, { useEffect, useState } from "react";
import { Redirect } from "@reach/router";
import { get, post } from "../../../utilities";
import { makeNewLobby } from "../../../client-socket";
import Carousel from "./Carousel";

// _id={setData._id}
// title={setData.title}
// date={setData.last_modified_date}
// size={setData.size}
// setSetsMetadata={props.setSetsMetadata}

/**
 * Set is a single flashcard set rendered on the teacher dashboard
 *
 * Proptypes
 * @param {_id} _id the unique id of the set
 * @param {title} title the title of the set
 * @param {date} date the date that the set was last modified
 * @param {size} size the length of the set
 * @param {metadata} metadata flashcard set metadata, in the form of an array of flashcard objects
 * @param {function} setSetsMetadata setter for set metadata
 * @param {function} setUserData setter for user data
 * @param {userId} userId the user id to pass into the game
 * @param {function} setIsOpen set left sidebar
 */
const Set = (props) => {
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [lobbySettings, setLobbySettings] = useState(false);

  // lobby settings
  const [numMazes, setNumMazes] = useState(3);
  const [gameTime, setGameTime] = useState(10);
  const [gameMode, setGameMode] = useState("individual");
  const [gameTimeError, setGameTimeError] = useState(false);
  const [numMazesError, setNumMazesError] = useState(false);

  const handleDeletion = () => {
    const deleteSet = async () => {
      setLoading(true);
      props.setSetsMetadata(props.metadata.filter((set) => set._id != props._id));
      await post("/api/deleteset", { setid: props._id });
      console.log("set deleted successfully");
      const data = await get("/api/userbyid");
      props.setUserData(data);
      setLoading(false);
      setConfirmDelete(false);
    };
    deleteSet();
  };

  const handleFirstDelete = () => {
    setConfirmDelete(true);
  };

  const handleBack = () => {
    setConfirmDelete(false);
  };

  const newLobby = (setid) => {
    const initializeLobby = async () => {
      try {
        const set = await get("/api/setbyid", { _id: setid });
        let pin = "";
        for (let i = 0; i < 6; i++) {
          pin += String(Math.floor(Math.random() * 10));
        }
        makeNewLobby({
          pin: pin,
          cards: set.cards,
          teacherid: props.userId,
          setid: setid,
          settitle: props.title,
          gameTime: gameTime,
          numMazes: numMazes,
          gameMode: gameMode,
        });
        setRedirect("/game");
      } catch (error) {
        alert("error retrieving set");
        console.log(error);
      }
    };

    if (numMazesError === true || gameTimeError === true) {
      return;
    }

    let bad = false;
    if (numMazes === "") {
      setNumMazesError(true);
      setInterval(() => {
        setNumMazesError(false);
      }, 2000);
      bad = true;
    }
    if (gameTime === "") {
      setGameTimeError(true);
      setInterval(() => {
        setGameTimeError(false);
      }, 2000);
      bad = true;
    }

    if (!bad) {
      console.log(gameTime);
      console.log(numMazes);
      console.log(gameMode);
      initializeLobby();
    }
  };

  const handleChangeGameTime = (e) => {
    if ((e.target.value >= 1 && e.target.value <= 99) || e.target.value === "") {
      setGameTime(e.target.value);
    }
  };

  const handleChangeNumMazes = (e) => {
    if ((e.target.value >= 2 && e.target.value <= 9) || e.target.value === "") {
      setNumMazes(e.target.value);
    }
  };

  const editCards = () => {
    setRedirect(`/teacher/edit/${props._id}`);
  };

  let temp = "../gameassets/radioactive_000_cropped.png";

  const carouselContent = [
    { content: temp, caption: "Individual" },
    { content: temp, caption: "Team" },
    { content: temp, caption: "Infection" },
  ];

  return (
    <>
      {redirect ? (
        <Redirect from="/teacher" to={redirect} />
      ) : (
        <>
          <div className="flex h-[30vh] relative w-[50vw] mx-auto border-solid border-blue-700 rounded-lg m-3">
            {loading ? (
              <div className="text-center mx-auto my-auto align-middle text-red-600">
                deleting set...
              </div>
            ) : (
              <>
                {confirmDelete ? (
                  <>
                    <div className="mx-auto mt-[10vh] text-blue-200 text-md">
                      Confirm you want to delete this set
                      <div className="mt-[1vh] flex justify-center">
                        <button className="editfbuttons" onClick={handleDeletion}>
                          Delete
                        </button>
                        <button className="editfbuttons" onClick={handleBack}>
                          Back
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="basis-1/6 text-center border-green-900 border-solid m-2">
                      image
                    </div>
                    <div className="flex-1 text-bold border-blue-700 rounded-xl border-solid m-2 overflow-y-auto overflow-x-auto">
                      <div className="px-4 pt-2 text-3xl text-blue-400">
                        {props.title === "" ? "(No title)" : props.title}
                      </div>
                      <div className="px-4 text-2xl text-blue-200">Flashcards: {props.size}</div>
                      <div className="px-4 text-sm text-gray-400">{props.date}</div>
                    </div>
                    <div className="flex-none flex-col m-2">
                      <div className="flex-1">
                        <button
                          className="editfbuttons mb-1"
                          onClick={() => {
                            props.setIsOpen(false);
                            setLobbySettings(true);
                          }}
                        >
                          Play
                        </button>
                      </div>
                      <div className="flex-1">
                        <button className="editfbuttons mb-1" onClick={editCards}>
                          Edit
                        </button>
                      </div>
                      <div className="flex-1">
                        <button className="editfbuttons" onClick={handleFirstDelete}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </>
      )}
      {lobbySettings && (
        <div className="fixed top-[15%] left-0 w-full h-[calc(100vh_-_80px)] mt-[-15vh] bg-white opacity-90 text-black z-50 border-solid">
          <div className="flex justify-end">
            <button
              className="font-Ubuntu mt-4 mr-4 hover:bg-red-400 hover:cursor-pointer"
              onClick={() => {
                setLobbySettings(false);
              }}
            >
              Cancel
            </button>
          </div>
          <div className="flex justify-center">
            <div className="text-4xl"> Lobby Settings</div>
          </div>
          <div className="flex justify-center">
            <div className="text-3xl"> Initializing game with set:</div>
          </div>
          <div className="flex justify-center">
            <div className="text-3xl text-blue-500"> {props.title}</div>
          </div>
          <div className="border-solid ml-[20%] mt-[4vh] h-[60%] w-[60%] overflow-y-auto overflow-x-hidden">
            <div className="flex justify-between border-solid w-full h-[30%]">
              <div className="mx-8 text-2xl mt-[5vh]">
                <div>Game Time (minutes):</div>
                {gameTimeError && (
                  <div className="text-red-600 text-sm animate-shake">
                    enter a valid number of minutes!
                  </div>
                )}
              </div>
              <input
                className="mx-8 h-[5vw] mt-[5vh] font-Ubuntu w-[5vw] transform -translate-y-1/4 text-3xl mr-[2vw]"
                type="number"
                min="1"
                max="99"
                value={gameTime}
                onInput={handleChangeGameTime}
              ></input>
            </div>
            <div className="flex justify-between border-solid w-full h-[30%]">
              <div className="mx-8 text-2xl mt-[5vh]">
                <div>Number of Mazes: </div>
                {numMazesError && (
                  <div className="text-red-600 text-sm animate-shake">
                    enter a valid number of mazes!
                  </div>
                )}
              </div>
              <input
                className="mx-8 h-[5vw] mt-[5vh] font-Ubuntu w-[5vw] transform -translate-y-1/4 text-3xl mr-[2vw]"
                type="number"
                min="2"
                max="9"
                value={numMazes}
                onInput={handleChangeNumMazes}
              ></input>
            </div>
            <Carousel content={carouselContent} setGameMode={setGameMode} gameMode={gameMode} />
          </div>
          <div className="absolute bottom-[2vh] w-[100%] left-[25%]">
            <div className="flex">
              <button
                className="font-Ubuntu text-3xl bg-blue-500 w-[50%] hover:cursor-pointer hover:bg-blue-400"
                onClick={() => {
                  newLobby(props._id);
                }}
              >
                Play now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Set;
