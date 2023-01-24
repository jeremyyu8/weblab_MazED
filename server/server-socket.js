const gameLogic = require("./game-logic");

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

  // if user was already in a game, reconnect them
  for (let pin in gameLogic.games) {
    for (let _id in gameLogic.games[pin]["players"]) {
      if (_id === user._id) {
        userToPinMap[user._id] = pin;
        gameLogic.games[pin]["players"][user._id]["active"] = true;
        gameLogic.games[pin]["players"][user._id].v.x = 0;
        gameLogic.games[pin]["players"][user._id].v.y = 0;
        console.log("setting player active to true");
        socket.join(pin);
      }
    }
  }
};

const removeUser = (user, socket) => {
  console.log("remove user being called");
  console.log(user);
  if (user) {
    if (userToPinMap[user._id]) {
      let pin = userToPinMap[user._id];
      gameLogic.games[pin]["players"][user._id]["active"] = false;
      console.log("setting player active to false");
      delete userToPinMap[user._id];
    }
    delete userToSocketMap[user._id];
  }
  delete socketToUserMap[socket.id];
};

const sendGameState = () => {
  // console.log(gameLogic.games);
  // console.log("emitting game state");
  io.emit("update", gameLogic.games);
};

const startRunningGame = () => {
  // let winResetTimer = 0;
  setInterval(() => {
    gameLogic.updateGameState();
    sendGameState();

    // // Reset game 5 seconds after someone wins.
    // if (gameLogic.gameState.winner != null) {
    //   winResetTimer += 1;
    // }
    // if (winResetTimer > 60 * 5) {
    //   winResetTimer = 0;
    //   gameLogic.resetWinner();
    // }
  }, 1000 / 60); // 60 frames per second
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
        if (!gameLogic.games[data.pin]) {
          socket.emit("joinFail", { err: "pin does not exist" });
        } else {
          socket.emit("joinSuccess");
          socket.join(data.pin);
          userToPinMap[data.studentid] = data.pin;
          console.log("joining lobby");
          console.log(data);
          gameLogic.playerJoin(data);
        }
      });

      socket.on("move", (data) => {
        const user = getUserFromSocketID(socket.id);
        // console.log("received movement on server side");
        // if (user) gameLogic.movePlayer(user._id, dir);
        gameLogic.movePlayer(data._id, data.pin, data.dir);
        // TODO uncomment
      });

      socket.on("getPin", (userId) => {
        if (userId) {
          if (userToPinMap[userId]) {
            // user found in userToPinMap
            let pin = userToPinMap[userId];
            socket.emit("receivePin", { pin: pin, cards: gameLogic.games[pin]["cards"] });
            return;
          }
          // check if user was already in a game
          for (let pin in gameLogic.games) {
            for (let _id in gameLogic.games[pin]["players"]) {
              if (_id === userId) {
                socket.emit("receivePin", { pin, pin, cards: gameLogic.games[pin]["cards"] });
                return;
              }
            }
          }
          console.log("user pin not found");
        } else {
          console.log("user not logged in");
        }
      });
      // getPin
      // receivePin

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
        socket.emit("upgradeSpeedResult", { result: result, _id: data._id, pin: data.pin });
      });

      socket.on("upgradePower", (data) => {
        result = gameLogic.upgradePower(data._id, data.pin); //"success" or "failure"
        socket.emit("upgradePowerResult", { result: result, _id: data._id, pin: data.pin });
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
