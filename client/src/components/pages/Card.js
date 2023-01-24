import React from "react";
import { Link } from "@reach/router";
/**
 * Card
 *
 * Proptypes
 * @param {text} text to display
 */
const Card = (props) => {
  return (
    <div className="p-4 xl:w-1/3 md:w-1/2 w-7/12 mb-12">
      <div className="bg-blue-500 bg-opacity-60 hover:bg-opacity-90 hover:scale-110 transition duration-300 ease-in-out h-full rounded-lg mb-6 flex flex-col relative overflow-hidden shadow-xl">
        <div class="text-4xl text-blue-100 mt-8 ml-8">{props.title}</div>
        <div className="pt-4 pl-8 pr-8 flex rounded-lg items-center text-gray-900 text-lg">
          <p>{props.text}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
