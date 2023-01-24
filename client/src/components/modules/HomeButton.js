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
      className="py-3 px-7 text-white bg-blue-700 text-[14px] rounded-md align-baseline border-0 transition-colors duration-250 hover:bg-blue-500 cursor-pointer no-underline"
    >
      {props.text}
    </Link>
  );
};

export default HomeButton;
