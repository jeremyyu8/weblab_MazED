import React, { useState, useEffect } from "react";
import Set from "./Set";
import { get, post } from "../../../utilities";

/**
 * FlashcardSetsContainer renders flashcard metadata for teachers in their dashboard
 *
 * Proptypes
 * @param {metadata} metadata flashcard set metadata, in the form of an array of flashcard objects
 * @param {function} setSetsMetadata setter for metadata
 */
const FlashcardSetsContainer = (props) => {
  return (
    <>
      <div className="flex border-solid mt-10 mx-10">
        <div className="text-6xl text-blue-900 border-solid flex-1">Flashcard Sets</div>
        <button
          className="my-auto mx-10 flex-none border-solid hover:bg-sky-300 cursor-pointer transition-all text-4xl"
          onClick={() => {
            window.location.replace("/teacher/edit/new");
          }}
        >
          Create New Set
        </button>
      </div>
      <div className="overflow-scroll max-w-[70%] px-6 mx-auto mt-[4vw] border border-solid border-black rounded-xl h-[50%]">
        {props.metadata.map((setData, i) => (
          <Set
            key={i}
            _id={setData._id}
            title={setData.title}
            date={setData.last_modified_date}
            size={setData.size}
            setSetsMetadata={props.setSetsMetadata}
            metadata={props.metadata}
          />
        ))}
      </div>
    </>
  );
};

export default FlashcardSetsContainer;
