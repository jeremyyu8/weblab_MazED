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
          <div className="bg-spaceimg2 bg-fixed bg-cover h-screen flex flex-col items-center justify-center">
            <div className="rounded-3xl bg-zinc-900 bg-opacity-80 px-16 py-10 shadow-lg max-sm:px-8 flex flex-col items-center justify-center">
              <div className="mx-auto mb-6 text-5xl text-blue-200">Join Game</div>
              <input
                className="my-4 text-2xl"
                placeholder="Game Code"
                onInput={handleChange}
              ></input>
              <button
                className="mx-auto my-4 text-5xl rounded-xl text-blue-200 bg-blue-800 hover:bg-blue-500 cursor-pointer transition-all"
                onClick={() => handleJoin(props.userId, props.userName)}
              >
                Enter
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default JoinGame;
