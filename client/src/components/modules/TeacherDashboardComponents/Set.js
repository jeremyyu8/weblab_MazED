import React from "react";

/**
 * LeftSideBar is a component in TeacherDashboard that holds my sets, past games, settings
 *
 * Proptypes
 * @param {string} _id of the story
 * @param {function} setRightSide for setting right side
 */
const Set = (props) => {
  //{props.title} {props.date}
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
                window.location.replace("/teacher/edit");
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
