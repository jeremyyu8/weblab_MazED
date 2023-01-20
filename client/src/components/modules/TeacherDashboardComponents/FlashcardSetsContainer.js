import React, { useState, useEffect } from "react";
import Set from "./Set";
import { get, post } from "../../../utilities";

const temp_sets = [
  { name: "math", date: "1/1/2022" },
  { name: "history", date: "1/2/2022" },
  { name: "science", date: "1/3/2022" },
];

/**
 * FlashcardSetsContainer renders flashcard metadata for teachers in their dashboard
 *
 * Proptypes
 * @param {metadata} metadata flashcard set metadata, in the form of an array of flashcard objects
 */
const FlashcardSetsContainer = (props) => {
  console.log("props of flashcardsetscontainer");
  console.log(props.metadata);

  return (
    <>
      <div className="flex border-solid mt-10 mx-10">
        <div className="text-6xl text-blue-900 border-solid flex-1">Flashcard Sets</div>
        <button
          className="my-auto mx-10 flex-none border-solid hover:bg-sky-300 cursor-pointer transition-all text-4xl"
          onClick={() => {
            window.location.replace("/teacher/edit");
          }}
        >
          Create New Set
        </button>
      </div>
      <div className="overflow-scroll max-w-[70%] px-6 mx-auto mt-[4vw] border border-solid border-black rounded-xl h-screen">
        {/* {loading ? <div>Fetching flashcard data...</div> : <>{flashCardSets}</>} */}
        {props.metadata.map((setData, i) => (
          <Set
            key={i}
            _id={setData._id}
            title={setData.title}
            date={setData.last_modified_date}
            size={setData.size}
          />
        ))}
      </div>
    </>
  );
};

export default FlashcardSetsContainer;
