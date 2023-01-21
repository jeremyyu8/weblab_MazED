import React, { useEffect, useRef, useState } from "react";
import { socket, move } from "../../client-socket.js";

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

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
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
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      pressed["up"] = true;
      move(pressed);
    }
    if (e.key === "ArrowDown") {
      pressed["down"] = true;
      move(pressed);
    }
    if (e.key === "ArrowLeft") {
      pressed["left"] = true;
      move(pressed);
    }
    if (e.key === "ArrowRight") {
      pressed["right"] = true;
      move(pressed);
    }
  };

  const processUpdate = (update) => {
    drawCanvas(update[0], canvasRef);
  };

  return (
    <>
      <div className="text-blue-400">Game page</div>
      <canvas ref={canvasRef} width="1260" height="700" />
    </>
  );
};

export default Game;
