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
    <div className="p-4 mt-8 text-[3vw] xl:w-1/3 md:w-1/3 md:text-[1.5vw] w-7/12">
      <div className="bg-blue-500 bg-opacity-60 hover:bg-opacity-90 hover:scale-110 transition duration-300 ease-in-out h-full rounded-lg mb-6 flex flex-col relative overflow-hidden shadow-xl">
        <div class="text-[4vw] text-blue-100 mt-8 ml-6 md:text-[3vw]">
          {props.title} {props.icon}
        </div>
        <div className="pt-4 pl-8 pr-8 flex rounded-lg items-center text-gray-900">
          <p>{props.text}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
