import React from "react";
import { Link } from "@reach/router";

/**
 * Navbar Button
 *
 * Proptypes
 * @param {text} text to display
 * @param {url} url redirect url
 */
const HomeButton = (props) => {
  return (
    <Link
      to={props.url}
      className="p-3 px-7 text-white bg-sky-500 text-[14px] rounded-md align-baseline border-0 transition-colors duration-250 hover:bg-sky-300 cursor-pointer no-underline"
    >
      {props.text}
    </Link>
  );
};

export default HomeButton;
