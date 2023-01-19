import React, { useState, useEffect } from "react";
import Set from "./Set";
import { get, post } from "../../../utilities";

const temp_sets = [
  { name: "math", date: "1/1/2022" },
  { name: "history", date: "1/2/2022" },
  { name: "science", date: "1/3/2022" },
];

const FlashcardSetsContainer = () => {
  const [flashCardSets, setFlashCardSets] = useState([]);

  // const flashCardSets = temp_sets.map((user, i) => (
  //   <Set key={i} title={user.name} date={user.date} />
  // ));

  // on mount
  useEffect(() => {
    get("/api/setmetadata").then((sets) => {
      const metadata = sets.metadata;
      setFlashCardSets(
        metadata.map((setData) => (
          <Set
            key={setData._id}
            title={setData.title}
            date={setData.last_modified_date}
            size={setData.size}
          />
        ))
      );
    });
  }, []);

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
        {flashCardSets}
      </div>
    </>
  );
};

export default FlashcardSetsContainer;
