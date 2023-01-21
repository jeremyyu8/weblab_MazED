const gameLogic = require("./game-logic");

let io;

const userToSocketMap = {}; // maps user ID to socket object
const socketToUserMap = {}; // maps socket ID to user object

const getSocketFromUserID = (userid) => userToSocketMap[userid];
const getUserFromSocketID = (socketid) => socketToUserMap[socketid];
const getSocketFromSocketID = (socketid) => io.sockets.connected[socketid];

const addUser = (user, socket) => {
  const oldSocket = userToSocketMap[user._id];
  if (oldSocket && oldSocket.id !== socket.id) {
    // there was an old tab open for this user, force it to disconnect
    // FIXME: is this the behavior you want?
    oldSocket.disconnect();
    delete socketToUserMap[oldSocket.id];
  }

  userToSocketMap[user._id] = socket;
  socketToUserMap[socket.id] = user;
};

const removeUser = (user, socket) => {
  if (user) delete userToSocketMap[user._id];
  delete socketToUserMap[socket.id];
};

const sendGameState = () => {
  // console.log(gameLogic.games);
  // console.log("emitting game state");
  io.emit("update", gameLogic.games);
};

const startRunningGame = () => {
  // let winResetTimer = 0;
  gameLogic.generateMap();
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

      socket.on("move", (dir) => {
        const user = getUserFromSocketID(socket.id);
        // console.log("received movement on server side");
        // if (user) gameLogic.movePlayer(user._id, dir);
        // TODO uncomment
        gameLogic.movePlayer(0, dir);
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
