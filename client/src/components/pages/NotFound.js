import React, { useRef, useState, useEffect } from "react";

import { drawCanvas404 } from "../../canvasManager404";

const NotFound = () => {
  let canvas404 = useRef(null);

  useEffect(() => {
    let animateCat = setInterval(() => {
      drawCanvas404(canvas404);
    }, 100);
    return () => {
      clearInterval(animateCat);
    };
  }, []);

  return (
    <div>
      <h1 className="text-6xl text-center mb-0">404 Not Found</h1>
      <div className="flex justify-center">
        <canvas ref={canvas404} width={480} height={480} />
      </div>
      <div className="text-center text-3xl mb-2">The page you requested couldn't be found.</div>
      <div className="flex justify-center">
        <button
          className="text-center font-Ubuntu w-[25%] text-xl hover:cursor-pointer hover:bg-blue-200 transition-all"
          onClick={() => {
            window.location.replace("/");
          }}
        >
          Back to home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
