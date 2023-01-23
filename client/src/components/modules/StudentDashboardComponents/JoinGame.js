import React, { useState, useEffect } from "react";
import { Redirect } from "@reach/router";
import { socket } from "../../../client-socket";
import { joinLobby } from "../../../client-socket";

/**
 * Join game component for student users to join new lobbies
 *
 * @param {string} userId the user id
 * @param {string} userName display name of user
 */
const JoinGame = (props) => {
  const [gamepin, setGamepin] = useState("");
  const [redirect, setRedirect] = useState(false);

  const handleChange = (event) => {
    setGamepin(event.target.value);
  };

  const handleJoin = (id, username) => {
    console.log("inside of handle join");
    console.log(id, username);
    joinLobby({ studentid: id, pin: gamepin, studentname: username });
  };

  useEffect(() => {
    socket.on("joinFail", (msg) => {
      alert("not a valid pin number");
      console.log(msg.err);
    });
    socket.on("joinSuccess", () => {
      setRedirect("/game");
    });
  }, []);

  return (
    <>
      {redirect ? (
        <Redirect from="/student" to="/game" />
      ) : (
        <>
          <div className="flex flex-col max-w-[50%] mx-auto mt-20 border-solid border-black rounded-xl p-4">
            <div className="mx-auto my-4 mb-10 text-5xl">Join Game</div>
            <input
              className="my-4 border-solid text-2xl"
              placeholder="Game Code"
              onInput={handleChange}
            ></input>
            <button
              className="mx-auto my-4 text-5xl border-solid hover:bg-sky-300 cursor-pointer transition-all"
              onClick={() => handleJoin(props.userId, props.userName)}
            >
              Enter
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default JoinGame;
