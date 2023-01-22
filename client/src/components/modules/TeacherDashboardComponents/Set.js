import React, { useEffect } from "react";
import { get, post } from "../../../utilities";
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

// _id={setData._id}
// title={setData.title}
// date={setData.last_modified_date}
// size={setData.size}
// setSetsMetadata={props.setSetsMetadata}

const Set = (props) => {
  const handleDeletion = () => {
    props.setSetsMetadata(props.metadata.filter((set) => set._id != props._id));
    post("/api/deleteset", { setid: props._id }).then(console.log("set deleted successfully"));
  };

  return (
    <>
      <div className="flex relative max-w-[95%] mx-auto border-solid border-black m-3">
        <div className="basis-1/6 text-center border-green-900 border-solid m-2">image</div>
        <div className="flex-1 border-green-700 border-solid text-4xl m-2">
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
      </div>
    </>
  );
};

export default Set;
