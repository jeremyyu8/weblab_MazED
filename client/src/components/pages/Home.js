import React from "react";

// import modules
import Navbar from "../modules/Navbar";

const GOOGLE_CLIENT_ID = "810136167494-687miqucn5faftjcgheo691e8n1pddti.apps.googleusercontent.com";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="relative max-w-[50%] px-6 mx-auto mt-[18vh] border border-solid border-black rounded-xl h-[70vh]">
        <div className="text-5xl pt-20 text-center">Can you find your way out?</div>
        <div className="text-3xl pt-16 text-center">Sign up for free!</div>
        <div className="pt-16 text-center">
          <button
            onClick={() => {
              window.location.replace("/signup");
            }}
            className="text-white bg-sky-500 text-[14px] rounded-md border-0 transition-colors duration-250 hover:bg-sky-300 cursor-pointer p-4 px-12"
          >
            Sign Up
          </button>
        </div>
      </div>
      <div>
        <button
          onClick={() => {
            window.location.replace("/teacher");
          }}
        >
          Teacher Dashboard
        </button>
        <button
          onClick={() => {
            window.location.replace("/student");
          }}
        >
          Student Dashboard
        </button>
        <button
          onClick={() => {
            window.location.replace("/maze");
          }}
        >
          Maze testing
        </button>
      </div>
    </>
  );
};

export default Home;
