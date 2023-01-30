import React from "react";
import { Link } from "@reach/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faBook, faSignIn } from "@fortawesome/free-solid-svg-icons";

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
      className="py-3 px-7 text-white bg-blue-700 text-[18px] rounded-md align-baseline border-0 transition-colors duration-250 hover:bg-blue-500 cursor-pointer no-underline"
    >
      <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
      {props.text}
    </Link>
  );
};

export default HomeButton;
