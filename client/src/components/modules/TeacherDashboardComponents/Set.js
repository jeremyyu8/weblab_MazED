import React, { useEffect, useState } from "react";
import { Redirect } from "@reach/router";
import { get, post } from "../../../utilities";
import { makeNewLobby } from "../../../client-socket";

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
 */
const Set = (props) => {
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [lobbySettings, setLobbySettings] = useState(false);

  // lobby settings
  const [numMazes, setNumMazes] = useState(3);
  const [gameTime, setGameTime] = useState(0);

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
        makeNewLobby({ pin: pin, cards: set.cards, teacherid: props.userId, setid: setid });
        setRedirect("/game");
      } catch (error) {
        alert("error retrieving set");
        console.log(error);
      }
    };
    initializeLobby();
  };

  const editCards = () => {
    setRedirect(`/teacher/edit/${props._id}`);
  };

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
                    <div className="flex-1 border-blue-700 rounded-xl border-solid m-2 overflow-y-auto overflow-x-auto">
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
          <div className="border-solid ml-[20%] mt-[4vh] h-[60%] w-[60%] overflow-y-auto">
            <div className="flex justify-between border-solid w-full h-[30%]">
              <div className="mx-8 text-2xl mt-[5vh]">Game Time (minutes):</div>
              <input
                className="mx-8 h-[25%] mt-[5vh]"
                onInput={(event) => setGameTime(event.target.value)}
              ></input>
            </div>
            <div className="flex justify-between border-solid w-full h-[30%]">
              <div className="mx-8 text-2xl mt-[5vh]"> Number of Mazes: </div>
              <input
                className="mx-8 h-[25%] mt-[5vh]"
                onInput={(event) => setNumMazes(event.target.value)}
              ></input>
            </div>
            <div
              id="indicators-carousel"
              className="relative border-solid border-red-600"
              data-carousel="static"
            >
              <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
                <div className="duration-100 ease-in-out" data-carousel-item="active">
                  <div className="text-[7vw]">THIS IS ITEM 1</div>
                </div>
                <div class="hidden duration-100 ease-in-out" data-carousel-item>
                  <div>THIS IS ITEM 1</div>
                </div>
                <div class="hidden duration-100 ease-in-out" data-carousel-item>
                  <div>THIS IS ITEM 1</div>
                </div>
                <div class="hidden duration-100 ease-in-out" data-carousel-item>
                  <div>THIS IS ITEM 1</div>
                </div>
                <div class="hidden duration-100 ease-in-out" data-carousel-item>
                  <div>THIS IS ITEM 1</div>
                </div>
              </div>
              <div class="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-5 left-1/2">
                <button
                  type="button"
                  class="w-3 h-3 rounded-full"
                  aria-current="true"
                  aria-label="Slide 1"
                  data-carousel-slide-to="0"
                ></button>
                <button
                  type="button"
                  class="w-3 h-3 rounded-full"
                  aria-current="false"
                  aria-label="Slide 2"
                  data-carousel-slide-to="1"
                ></button>
                <button
                  type="button"
                  class="w-3 h-3 rounded-full"
                  aria-current="false"
                  aria-label="Slide 3"
                  data-carousel-slide-to="2"
                ></button>
                <button
                  type="button"
                  class="w-3 h-3 rounded-full"
                  aria-current="false"
                  aria-label="Slide 4"
                  data-carousel-slide-to="3"
                ></button>
                <button
                  type="button"
                  class="w-3 h-3 rounded-full"
                  aria-current="false"
                  aria-label="Slide 5"
                  data-carousel-slide-to="4"
                ></button>
              </div>
              <button
                type="button"
                class="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                data-carousel-prev
              >
                <span class="inline-flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                  <svg
                    aria-hidden="true"
                    class="w-5 h-5 text-white sm:w-6 sm:h-6 dark:text-gray-800"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 19l-7-7 7-7"
                    ></path>
                  </svg>
                  <span class="sr-only">Previous</span>
                </span>
              </button>
              <button
                type="button"
                class="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                data-carousel-next
              >
                <span class="inline-flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                  <svg
                    aria-hidden="true"
                    class="w-5 h-5 text-white sm:w-6 sm:h-6 dark:text-gray-800"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                  <span class="sr-only">Next</span>
                </span>
              </button>
            </div>
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
