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
                      <div className="px-4 pt-2 text-3xl text-blue-200">
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
                            newLobby(props._id);
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
    </>
  );
};

export default Set;
