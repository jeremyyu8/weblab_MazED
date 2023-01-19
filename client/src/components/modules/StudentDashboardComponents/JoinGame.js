import React from "react";

const JoinGame = () => {
  return (
    <div className="flex flex-col max-w-[50%] mx-auto mt-20 border-solid border-black rounded-xl h-auto p-4">
      <div className="mx-auto my-4 mb-10 text-9xl">Join Game</div>
      <div className="mx-auto my-4 border-solid text-9xl">Game Code</div>
      <button className="mx-auto my-4 text-9xl border-solid hover:bg-sky-300 cursor-pointer transition-all">
        Enter
      </button>
    </div>
  );
};

export default JoinGame;
