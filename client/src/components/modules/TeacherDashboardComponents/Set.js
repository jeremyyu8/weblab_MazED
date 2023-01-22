import React, { useEffect, useState } from "react";
import { get, post } from "../../../utilities";

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
 */
const Set = (props) => {
  const [loading, setLoading] = useState(false);

  const handleDeletion = () => {
    const deleteSet = async () => {
      setLoading(true);
      props.setSetsMetadata(props.metadata.filter((set) => set._id != props._id));
      await post("/api/deleteset", { setid: props._id });
      console.log("set deleted successfully");
      const data = await get("/api/userbyid");
      props.setUserData(data);
      setLoading(false);
    };
    deleteSet();
  };

  return (
    <>
      <div className="flex h-[30vh] relative w-[50vw] mx-auto border-solid border-black m-3">
        {loading ? (
          <div className="text-center mx-auto my-auto align-middle border-solid">
            deleting set...
          </div>
        ) : (
          <>
            <div className="basis-1/6 text-center border-green-900 border-solid m-2">image</div>
            <div className="flex-1 border-green-700 border-solid text-3xl m-2 overflow-y-scroll overflow-x-scroll ">
              <div>{props.title === "" ? "(No title)" : props.title}</div>
              <div>Flashcards: {props.size}</div>
              <div className="text-sm text-gray-500">{props.date}</div>
            </div>
            <div className="flex-none flex-col border-green-700 border-solid m-2">
              <div className="flex-1 border-solid">
                <button
                  className="flex-1 hover:bg-sky-300 cursor-pointer transition-all text-3xl mr-20 p-2"
                  onClick={() => {
                    window.location.replace("/lobby");
                  }}
                >
                  Play
                </button>
              </div>
              <div className="flex-1 border-solid">
                <button
                  className="flex-1 hover:bg-sky-300 cursor-pointer transition-all text-3xl mr-20 p-2"
                  onClick={() => {
                    window.location.replace(`/teacher/edit/${props._id}`);
                  }}
                >
                  Edit
                </button>
              </div>
              <div className="flex-1 border-solid">
                <button
                  className="flex-1 hover:bg-sky-300 cursor-pointer transition-all text-3xl mr-20 p-2"
                  onClick={handleDeletion}
                >
                  Delete
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Set;
