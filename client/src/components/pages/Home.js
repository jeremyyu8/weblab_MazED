import React from "react";

// import modules
import Navbar from "../modules/Navbar";

const GOOGLE_CLIENT_ID = "810136167494-687miqucn5faftjcgheo691e8n1pddti.apps.googleusercontent.com";

const Home = () => {
  return (
    <>
      <Navbar />
      <div class="max-w-[50%] px-6 mx-auto mt-10 border border-solid border-red-500">
        <div class="text-4xl p-8 text-center border border-solid border-red-100 h-[50vh]">
          Hello!
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
