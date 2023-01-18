import React from "react";

/**
 * LeftSideBar is a component in TeacherDashboard that holds my sets, past games, settings
 *
 * Proptypes
 * @param {string} _id of the story
 * @param {function} setRightSide for setting right side
 */
const Set = (props) => {
  //{props.name} {props.date}
  return (
    <>
      <div className="flex relative max-w-[95%] mx-auto border-solid border-black m-3">
        <div className="flex-1">image</div>
        <div className="flex-1 border-green-700 border-solid text-xl">
          {props.name} {props.date}
        </div>
        <div className="flex-1 flex-col border-green-700 border-solid">
          <div className="flex-1 border-solid">
            <button className="flex-1 hover:bg-sky-300 cursor-pointer transition-all">Play</button>
          </div>
          <div className="flex-1 border-solid">
            <button className="flex-1 hover:bg-sky-300 cursor-pointer transition-all">Edit</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Set;
