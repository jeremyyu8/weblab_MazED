import React from "react";

/**
 * Navbar Button
 *
 * Proptypes
 * @param {text} text to display
 * @param {url} url redirect url
 */
const HomeButton = (props) => {
  return (
    <button
      onClick={() => {
        window.location.replace(props.url);
      }}
      className="p-3 px-7 text-white bg-sky-500 text-[14px] rounded-md align-baseline border-0 transition-colors duration-250 hover:bg-sky-300 cursor-pointer"
    >
      {props.text}
    </button>
  );
};

export default HomeButton;
