import React from "react";

/**
 * Set is a single flashcard set rendered on the teacher dashboard
 *
 * Proptypes
 * @param {_id} _id the unique id of the set
 * @param {title} title the title of the set
 * @param {date} date the date that the set was last modified
 * @param {size} size the length of the set
 */
const Set = (props) => {
  console.log(props);
  return (
    <>
      <div className="flex relative max-w-[95%] mx-auto border-solid border-black m-3">
        <div className="basis-1/6 text-center border-green-900 border-solid m-2">image</div>
        <div className="flex-1 border-green-700 border-solid text-4xl m-2">
          <div>{props.title}</div>
          <div>{props.date}</div>
          <div>{props.size}</div>
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
        </div>
      </div>
    </>
  );
};

export default Set;
