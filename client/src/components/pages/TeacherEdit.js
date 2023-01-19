import React from "react";
import Navbar from "../modules/Navbar";
import Titlecard from "../modules/TeacherEditComponents/Titlecard";

import Image from "../modules/TeacherEditComponents/Image";
import Set from "../modules/TeacherEditComponents/Set";
const TeacherEdit = () => {
  return (
    <>
      <Navbar />
      <div className="mt-[6vw] flex-col">
        <div className="flex flex-1 justify-between">
          <div className="basis-1/3 border-solid text-6xl bg-green-50 m-5 p-5">
            <Titlecard />
          </div>
          <div className="basis-1/4 border-solid justify-center text-3xl m-5 h-32">
            <Image />
          </div>
        </div>
        <div className="flex-1 border-solid">
          <div className="border-solid border-black max-w-[80%] h-[25vw] m-10 mx-auto flex-col flex">
            <div className="flex-1 border-solid">
              <Set />
            </div>
            <button className="basis-1/6 border-solid hover:bg-sky-300 cursor-pointer transition-all text-4xl m-5 p-2 w-auto mx-auto">
              Add New Card
            </button>
          </div>
        </div>
        <div className="flex-1 border-solid flex justify-center">
          <button className="border-solid hover:bg-sky-300 cursor-pointer transition-all text-4xl m-5 p-2">
            Save and Exit
          </button>
        </div>
      </div>
    </>
  );
};

export default TeacherEdit;
