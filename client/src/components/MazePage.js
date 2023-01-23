import React, { useState } from "react";
import Navbar from "./modules/Navbar";
import Maze from "./Maze";

const MazePage = () => {
  return (
    <>
      <Navbar />
      <div class="h-[75px]"></div>
      <div>Maze</div>
      <Maze />
    </>
  );
};

export default MazePage;
