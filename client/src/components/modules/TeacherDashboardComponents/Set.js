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

  const [confirmStart, setConfirmStart] = useState(false);

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

  let individual = "../gameassets/individualpic.png";
  let team = "../gameassets/teampic.png";
  let infection = "../gameassets/infectionpic.png";

  const carouselContent = [
    { content: individual, caption: "Individual" },
    { content: team, caption: "Team" },
    { content: infection, caption: "Infection" },
  ];

  return (
    <>
      {redirect ? (
        <Redirect from="/teacher" to={redirect} />
      ) : (
        <>
          {/* <div className="flex h-[30vh] relative w-[50vw] mx-auto border-solid border-blue-700 rounded-lg m-3"> */}
          <div className="flex h-[30vh] relative w-[50vw] mx-auto border-solid backdrop-blur-md border-blue-700 border-4 m-3 rounded-xl hover:shadow-[0_0_5px_5px_rgba(191,219,254,0.3)] transition-all ease-in">
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
                    <div className="flex-1 text-bold rounded-xl border-solid border-blue-500 border-4 p-5 m-5 overflow-y-auto overflow-x-auto">
                      <div className="text-4xl text-blue-200 font-bold">
                        {props.title === "" ? "(No title)" : props.title}
                      </div>
                      <div className="text-3xl mt-2 text-blue-300">Flashcards: {props.size}</div>
                      <div className="text-xl mt-2 text-blue-400">{props.date}</div>
                    </div>
                    <div className="flex-none flex-col m-5">
                      <div className="flex-1 flex">
                        <button
                          className="editfbuttons mx-auto"
                          onClick={() => {
                            props.setIsOpen(false);
                            setLobbySettings(true);
                          }}
                        >
                          Play
                        </button>
                      </div>
                      <div className="flex-1 flex">
                        <button className="editfbuttons mt-1 mx-auto" onClick={editCards}>
                          Edit
                        </button>
                      </div>
                      <div className="flex-1 flex">
                        <button className="editfbuttons mt-1 mx-auto" onClick={handleFirstDelete}>
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
        <div className="fixed top-0 left-0 w-full h-[calc(100vh_-_80px)] bg-blue-100 text-black z-50">
          <button
            className="absolute right-0 font-Ubuntu mt-4 mr-4 hover:bg-red-400 hover:cursor-pointer rounded-xl p-2 text-xl z-50"
            onClick={() => {
              setLobbySettings(false);
            }}
          >
            Cancel
          </button>

          <div className="flex flex-col h-[100%] relative">
            <div className="basis-1/5 flex flex-col p-5">
              <div className="text-4xl mx-auto"> Lobby Settings</div>
              <div className="text-3xl mx-auto mt-2"> Initializing game with set:</div>
              <div className="text-3xl mx-auto mt-2 text-blue-500"> {props.title}</div>
            </div>

            <div className="basis-[70%] overflow-y-auto overflow-x-hidden flex">
              <div className="rounded-xl border-solid border-blue-200 border-4 w-[60%] mx-auto overflow-y-auto overflow-x-hidden">
                <div className="flex justify-between w-full h-[30%] text-3xl">
                  <div className="my-auto mx-8">Game Time (minutes):</div>
                  {gameTimeError && (
                    <div className="text-red-600 text-sm animate-shake">
                      enter a valid number of minutes!
                    </div>
                  )}
                  <div className="flex basis-1/6 justify-center my-auto">
                    <input
                      className="hover: my-auto font-Ubuntu text-3xl p-3 h-[6vh] aspect-square"
                      type="number"
                      min="1"
                      max="99"
                      value={gameTime}
                      onInput={handleChangeGameTime}
                    ></input>
                  </div>
                </div>
                <div className="flex justify-between  w-full h-[30%] text-3xl">
                  <div className="my-auto mx-8">Number of Mazes: </div>
                  {numMazesError && (
                    <div className="text-red-600 text-sm animate-shake">
                      enter a valid number of mazes!
                    </div>
                  )}
                  <div className="flex basis-1/6 justify-center">
                    <input
                      className="my-auto font-Ubuntu text-3xl p-3 h-[6vh] aspect-square"
                      type="number"
                      min="2"
                      max="9"
                      value={numMazes}
                      onInput={handleChangeNumMazes}
                    ></input>
                  </div>
                </div>
                <Carousel content={carouselContent} setGameMode={setGameMode} gameMode={gameMode} />
              </div>
            </div>

            <div className="basis-1/6 flex justify-center">
              <button
                className="font-Ubuntu text-3xl rounded-xl bg-blue-500 w-[30%] hover:cursor-pointer hover:bg-blue-400 transform my-auto py-1"
                onClick={() => {
                  setConfirmStart(true);
                  // newLobby(props._id);
                }}
              >
                Play now
              </button>
            </div>

            <div
              className={`absolute w-[50%] h-auto py-10 top-[50%] left-[50%] transform translate-x-[-50%] rounded-xl translate-y-[-50%] bg-white border-blue-300 border-solid ${
                confirmStart === false && "hidden"
              }`}
            >
              <div className="flex flex-col">
                <div className="basis-1/6 text-5xl flex py-8">
                  <div className="mx-auto text-blue-500">Confirm Start?</div>
                </div>
                <div className="basis-2/3 text-4xl pb-8 flex flex-col justify-center">
                  <div className="mx-auto">
                    Game mode: <span className="text-blue-600">{gameMode}</span>{" "}
                  </div>
                  <div className="mx-auto mt-5">
                    Game time: <span className="text-blue-600">{gameTime}</span>
                  </div>
                  <div className="mx-auto mt-5">
                    Number of mazes: <span className="text-blue-600">{numMazes}</span>
                  </div>
                </div>
                <div className="basis-1/6 flex relative">
                  <div className="mx-auto flex justify-between my-4">
                    <button
                      className="editfbuttons"
                      onClick={() => {
                        newLobby(props._id);
                      }}
                    >
                      Start
                    </button>
                    <div className="basis-1/3"></div>
                    <button
                      className="editfbuttons"
                      onClick={() => {
                        setConfirmStart(false);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Set;
