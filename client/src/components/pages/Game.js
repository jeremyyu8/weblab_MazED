import React, { useEffect, useRef, useState } from "react";
import { socket, move, updateWindowSize } from "../../client-socket.js";

import { drawCanvas } from "../../canvasManager";

const Game = () => {
  const canvasRef = useRef(null);
  let pressed = { up: false, down: false, left: false, right: false };

  useEffect(() => {
    socket.on("update", (update) => {
      // console.log(update);
      processUpdate(update);
    });
    // drawCanvas({ p: { x: 0, y: 0 } }, canvasRef);
  }, []);

  // add event listener to user key inputs
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // set the window size when they log in
  useEffect(() => {
    updateWindowSize({ x: window.innerWidth, y: window.innerHeight });
  }, []);

  const handleKeyUp = (e) => {
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
    move(pressed);
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
    move(pressed);
  };

  const processUpdate = (update) => {
    drawCanvas(update[0], canvasRef);
  };

  return (
    <>
      {/* <div className="text-blue-400">Game page</div> */}
      <div className="fixed">
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} />
      </div>
    </>
  );
};

export default Game;
