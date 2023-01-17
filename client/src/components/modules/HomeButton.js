import React from "react";

import "./HomeButton.css";

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
      className="home-button"
    >
      {props.text}
    </button>
  );
};

export default HomeButton;
