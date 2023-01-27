import React, { useState, useEffect } from "react";
import { Redirect } from "@reach/router";
import { socket } from "../../../client-socket";
import { joinLobby } from "../../../client-socket";

/**
 * Join game component for student users to join new lobbies
 *
 * @param {string} userId the user id
 * @param {string} userName display name of user
 * @param {string} displayname
 */
const JoinGame = (props) => {
  const [gamepin, setGamepin] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [invalidPin, setInvalidPin] = useState(false);

  const handleChange = (event) => {
    setGamepin(event.target.value);
  };

  const handleJoin = (id, username, displayname) => {
    console.log("inside of handle join");
    console.log(displayname);
    if (!invalidPin) {
      joinLobby({ studentid: id, pin: gamepin, studentname: username, displayname: displayname });
    }
  };

  useEffect(() => {
    socket.on("joinFail", (msg) => {
      // alert("not a valid pin number");
      setInvalidPin(true);
      setTimeout(() => {
        setInvalidPin(false);
      }, 800);
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
              {invalidPin && (
                <div className="fixed mb-[10vh] shake text-red-600 font-bold">Invalid PIN</div>
              )}
              <input
                className="my-4 text-2xl font-Ubuntu text-center"
                placeholder="Game Code"
                onInput={handleChange}
              ></input>
              <button
                className="mx-auto my-4 text-2xl rounded-xl font-Ubuntu text-blue-200 bg-blue-800 hover:bg-blue-500 cursor-pointer transition-all"
                onClick={() => handleJoin(props.userId, props.userName, props.displayname)}
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
