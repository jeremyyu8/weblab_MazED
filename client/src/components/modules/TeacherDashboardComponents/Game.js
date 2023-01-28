import React, { useState, useEffect } from "react";
import { get, post } from "../../../utilities";

const Game = (props) => {
  // get("/api/setbyid", { _id: props.gameState["setid"] });
  const make_human_readable = (iso) => {
    let date = new Date(iso);
    let now = new Date();

    console.log("iso: ");
    console.log(iso);

    const utc1 = Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    );
    const utc2 = Date.UTC(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds()
    );

    let dif = Math.floor((utc2 - utc1) / 1000); // dif in seconds
    if (dif < 60) {
      return `Played: ${dif} seconds ago`;
    } else if (dif < 3600) {
      const m = Math.floor(dif / 60);
      const s = dif - m * 60;
      const mtag = m == 1 ? "minute" : "minutes";
      return `Played: ${m} ${mtag} ${s} seconds ago`;
    } else if (dif < 86400) {
      dif = Math.floor(dif / 60); // dif in minutes
      const h = Math.floor(dif / 60);
      const m = dif - h * 60;
      const htag = h == 1 ? "hour" : "hours";
      return `Played: ${h} ${htag} ${m} minutes ago`;
    } else if (dif < 31557600) {
      dif = Math.floor(dif / 3600); // dif in hours
      const d = Math.floor(dif / 24);
      const h = dif - d * 24;
      const dtag = d == 1 ? "day" : "days";
      return `Played: ${d} ${dtag} ${h} hours ago`;
    } else {
      dif = Math.floor(dif / 86400); // dif in days
      const y = Math.floor(dif / 365.25);
      const d = Math.floor(dif - y * 365.25);
      const ytag = y == 1 ? "year" : "years";
      return `Played: ${y} ${ytag} ${d} days ago`;
    }
  };
  return (
    <>
      <div className="flex flex-col border-solid bg-blue-600 p-5 w-[40vw]">
        <div>Game</div>
        <div>{make_human_readable(props.datePlayed)} </div>
        <div></div>
      </div>
    </>
  );
};

export default Game;
