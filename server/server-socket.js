const gameLogic = require("./game-logic");

// require .env
require("dotenv").config();

let io;

const userToSocketMap = {}; // maps user ID to socket object
const socketToUserMap = {}; // maps socket ID to user object
const userToPinMap = {}; // maps user ID to game pin

const getSocketFromUserID = (userid) => userToSocketMap[userid];
const getUserFromSocketID = (socketid) => socketToUserMap[socketid];
const getSocketFromSocketID = (socketid) => io.sockets.connected[socketid];

const addUser = (user, socket) => {
  const oldSocket = userToSocketMap[user._id];
  if (oldSocket && oldSocket.id !== socket.id) {
    // there was an old tab open for this user, force it to disconnect
    oldSocket.disconnect();
    delete socketToUserMap[oldSocket.id];
  }

  userToSocketMap[user._id] = socket;
  socketToUserMap[socket.id] = user;
};

const removeUser = (user, socket) => {
  console.log("remove user being called");
  console.log(user);
  if (user) {
    if (userToPinMap[user._id]) {
      let pin = userToPinMap[user._id];
      if (gameLogic.games[pin]) {
        gameLogic.games[pin]["players"][user._id]["active"] = false;
        console.log("setting player active to false");
      }
      delete userToPinMap[user._id];
    }
    delete userToSocketMap[user._id];
  }
  delete socketToUserMap[socket.id];
};

// send all maze data + player data
const sendGameState = () => {
  io.emit("update", gameLogic.games);
};

// send only live updating data
const sendMazes = (pin) => {
  io.emit("updateMazes", gameLogic.mazes[pin]);
};

const startRunningGame = () => {
  // let winResetTimer = 0;
  // sendMazes();
  setInterval(() => {
    gameLogic.updateGameState();
    // console.log(gameLogic.games);
    sendGameState();
  }, 1000 / process.env.FPS); // 60 frames per second
};

startRunningGame();

module.exports = {
  init: (http) => {
    io = require("socket.io")(http);

    io.on("connection", (socket) => {
      console.log(`socket has connected ${socket.id}`);
      socket.on("disconnect", (reason) => {
        const user = getUserFromSocketID(socket.id);
        removeUser(user, socket);
      });
      // description: teacher makes a new lobby
      // data: {pin: gamepin, cards: cards to be used during the game, teacherid: teacherid}
      socket.on("makeNewLobby", (data) => {
        socket.join(data.pin);
        userToPinMap[data.teacherid] = data.pin;
        gameLogic.makeNewGame(data);
      });

      // description: student attempts to join lobby
      // data: { studentid: id, pin: gamepin, studentname: username of student }
      socket.on("joinLobby", (data) => {
        console.log("calling join lobby");
        if (!gameLogic.games[data.pin]) {
          console.log(data.pin);
          socket.emit("joinFail", { err: "pin does not exist" });
        } else {
          socket.emit("joinSuccess");
          socket.join(data.pin);
          userToPinMap[data.studentid] = data.pin;

          // check if user was already in game before
          for (let _id in gameLogic.games[data.pin]["players"]) {
            if (_id === data.studentid) {
              // check if game started while they were disconnected, then update player level
              if (
                gameLogic.games[data.pin]["status"] !== "lobby" &&
                gameLogic.games[data.pin]["players"][_id]["level"] === 0
              ) {
                gameLogic.games[data.pin]["players"][_id]["level"] = 1;
              }
              return;
            }
          }

          // otherwise, this is a new user
          gameLogic.playerJoin(data);

          // user joined late and game already started, put user in level 1
          if (gameLogic.games[data.pin]["status"] !== "lobby") {
            gameLogic.games[data.pin]["players"][data.studentid]["level"] = 1;
          }
        }
      });

      socket.on("getMazes", (pin) => {
        sendMazes(pin);
      });

      socket.on("move", (data) => {
        const user = getUserFromSocketID(socket.id);
        // console.log("received movement on server side");
        if (user) gameLogic.movePlayer(data._id, data.pin, data.dir);
        else {
          console.log("user not logged in ");
        }
      });

      socket.on("getPin", (userId) => {
        if (userId) {
          if (userToPinMap[userId]) {
            // normal route, user found in userToPinMap
            let pin = userToPinMap[userId];
            if (gameLogic.games[pin]) {
              gameLogic.games[pin]["players"][userId]["active"] = true;
              socket.emit("receivePin", { pin: pin, cards: gameLogic.games[pin]["cards"] });
              return;
            }
          }

          // user disconnected; if user was already in a game, reconnect them
          for (let pin in gameLogic.games) {
            for (let _id in gameLogic.games[pin]["players"]) {
              if (_id === userId) {
                console.log("connecting new player");
                userToPinMap[userId] = pin;
                gameLogic.games[pin]["players"][userId]["active"] = true;
                gameLogic.games[pin]["players"][userId].v.x = 0;
                gameLogic.games[pin]["players"][userId].v.y = 0;
                // if user leaves during lobby and rejoins after lobby has already started, add them to level 1
                if (
                  gameLogic.games[pin]["status"] !== "lobby" &&
                  gameLogic.games[pin]["players"][userId]["level"] === 0
                ) {
                  gameLogic.games[pin]["players"][userId].p.x = 0;
                  gameLogic.games[pin]["players"][userId].p.y = 0;
                  gameLogic.games[pin]["players"][userId]["level"] = 1;
                }
                console.log("setting player active to true");
                socket.join(pin);

                // emit requested information
                socket.emit("receivePin", { pin: pin, cards: gameLogic.games[pin]["cards"] });
                return;
              }
            }
          }

          // otherwise, no user was found
          socket.emit("receivePin", { err: "no pin found" });
          console.log("user pin not found");
        } else {
          console.log("user not logged in");
        }
      });
      // getPin
      // receivePin

      // data: {_id: _id}
      socket.on("checkAlreadyConnected", (data) => {
        let result = gameLogic.checkAlreadyConnected(data._id);
        socket.emit("checkAlreadyConnectedResult", result);
      });

      // data: {windowsize.x: , windowsize.y: , _id: , pin: }
      socket.on("updateWindowSize", (data) => {
        gameLogic.setWindowSize(data._id, data.pin, data.x, data.y);
      });

      socket.on("startGame", (pin) => {
        gameLogic.gameStart(pin);
      });

      socket.on("extendGame", (pin) => {
        gameLogic.gameExtend(pin);
      });

      socket.on("changeTokens", (data) => {
        gameLogic.changeTokens(data._id, data.pin, data.result);
      });

      socket.on("upgradeSpeed", (data) => {
        result = gameLogic.upgradeSpeed(data._id, data.pin); //"success" or "failure"
        console.log("emitting upgradespeedresult");
        socket.emit("upgradeSpeedResult", { result: result, _id: data._id, pin: data.pin });
      });

      socket.on("upgradePower", (data) => {
        result = gameLogic.upgradePower(data._id, data.pin); //"success" or "failure"
        socket.emit("upgradePowerResult", { result: result, _id: data._id, pin: data.pin });
      });

      socket.on("untagMe", (data) => {
        gameLogic.untagMe(data._id, data.pin);
      });

      socket.on("unlockBorder", (data) => {
        result = gameLogic.unlockBorder(data._id, data.pin, data.bordersToUnlock); //"success" or "failure"
        socket.emit("unlockBorderResult", { result: result, _id: data._id, pin: data.pin });
      });

      socket.on("endGame", (data) => {
        gameLogic.endGame(data.pin);
      });
    });
  },

  addUser: addUser,
  removeUser: removeUser,

  getSocketFromUserID: getSocketFromUserID,
  getUserFromSocketID: getUserFromSocketID,
  getSocketFromSocketID: getSocketFromSocketID,
  getIo: () => io,
};
