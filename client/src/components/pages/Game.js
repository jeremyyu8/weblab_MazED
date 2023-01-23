import React, { useEffect, useRef, useState } from "react";
import { socket, move, updateWindowSize } from "../../client-socket.js";

import { drawCanvas } from "../../canvasManager";
import { Redirect } from "@reach/router";
import { get, post } from "../../utilities.js";

const Game = () => {
  const [gamePin, setGamePin] = useState(undefined); // user game pin
  const [userData, setUserData] = useState(undefined); // user data
  const [redirect, setRedirect] = useState(false);
  const canvasRef = useRef(null); // canvas reference

  // authentication
  useEffect(() => {
    // const checkAuth = async () => {
    //   try {
    //     const data = await get("/api/userbyid");
    //     console.log("done fetching data", data);
    //     await setUserData(data);
    //     console.log("userData", userData);
    //     socket.emit("getPin", data._id);
    //   } catch (error) {
    //     console.log(error);
    //     setRedirect(true);
    //   }
    // };
    // checkAuth();
    get("/api/userbyid")
      .then((data) => {
        console.log(data);
        setUserData(data);
        socket.emit("getPin", data._id);
      })
      .catch((err) => {
        console.log("error");
        console.log(err);
        setRedirect(true);
      });
  }, []);

  // load game pin
  useEffect(() => {
    socket.on("receivePin", (pin) => {
      setGamePin(pin);
      console.log("gamepin", gamePin);
      console.log("pin", pin);
    });
  }, [gamePin, userData]);

  let pressed = { up: false, down: false, left: false, right: false };

  useEffect(() => {
    socket.on("update", (update) => {
      // console.log(update);
      if (userData && gamePin) {
        processUpdate(update[gamePin], userData._id);
      } else {
        // console.log("no user data?");
      }
    });
    // drawCanvas({ p: { x: 0, y: 0 } }, canvasRef);
  }, [userData, gamePin]);

  // add event listener to user key inputs
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [userData, gamePin]);

  // set the window size when they log in
  useEffect(() => {
    if (userData && gamePin) {
      updateWindowSize({
        x: window.innerWidth,
        y: window.innerHeight,
        _id: userData._id,
        pin: gamePin,
      });
    }
  }, [userData, gamePin]);

  const handleKeyUp = (e) => {
    console.log(userData);
    console.log(gamePin);
    if (e.key === "ArrowUp") {
      pressed["up"] = false;
    }
    if (e.key === "ArrowDown") {
      pressed["down"] = false;
    }
    if (e.key === "ArrowLeft") {
      pressed["left"] = false;
    }
    if (e.key === "ArrowRight") {
      pressed["right"] = false;
    }
    if (userData && gamePin) {
      move(pressed, userData._id, gamePin);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      pressed["up"] = true;
    }
    if (e.key === "ArrowDown") {
      pressed["down"] = true;
    }
    if (e.key === "ArrowLeft") {
      pressed["left"] = true;
    }
    if (e.key === "ArrowRight") {
      pressed["right"] = true;
    }
    if (userData && gamePin) {
      move(pressed, userData._id, gamePin);
    }
  };

  const processUpdate = (update, _id) => {
    drawCanvas(update, canvasRef, _id);
  };

  return (
    <>
      {redirect ? (
        <Redirect from="/game" to="/login" />
      ) : (
        <>
          {/* <div className="text-blue-400">Game page</div> */}
          <div className="fixed">
            <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} />
          </div>
        </>
      )}
    </>
  );
};

export default Game;
