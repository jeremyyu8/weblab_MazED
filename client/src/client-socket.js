import socketIOClient from "socket.io-client";
import { post } from "./utilities";
const endpoint = window.location.hostname + ":" + window.location.port;
export const socket = socketIOClient(endpoint);
socket.on("connect", () => {
  post("/api/initsocket", { socketid: socket.id });
});

export const move = (dir, _id, pin) => {
  socket.emit("move", { dir: dir, _id: _id, pin: pin });
};

export const updateWindowSize = (windowSize) => {
  socket.emit("updateWindowSize", windowSize);
};

/**
 * Event for making a new lobby
 * @param {data.pin} data.pin game pin
 * @param {data.cards} data.cards array of card objects to be used during the game
 */
export const makeNewLobby = (data) => {
  console.log(data);
  socket.emit("makeNewLobby", data);
};

export const joinLobby = (data) => {
  console.log(data);
  console.log("inside of join lobby");
  socket.emit("joinLobby", data);
};

export const startGame = (pin) => {
  console.log("starting game with pin", pin);
  socket.emit("startGame", pin);
};

export const changeTokens = (_id, pin, result) => {
  console.log("modifying tokens");
  socket.emit("changeTokens", { _id: _id, pin: pin, result: result });
};

export const upgradeSpeed = (_id, pin) => {
  console.log("attempting to upgrade speed");
  socket.emit("upgradeSpeed", { _id: _id, pin: pin });
};

export const upgradePower = (_id, pin) => {
  console.log("attempting to upgrade power");
  socket.emit("upgradePower", { _id: _id, pin: pin });
};

export const endGame = (pin) => {
  console.log(`ending game ${pin}`);
  socket.emit("endGame", { pin: pin });
};

export const untagMe = (_id, pin) => {
  socket.emit("untagMe", { _id: _id, pin: pin });
};
