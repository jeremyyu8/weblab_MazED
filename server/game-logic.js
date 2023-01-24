const mazeLogic = require("./maze-logic");
const e = require("express");

// canvas constants
const mapxsize = 7200;
const mapysize = 7200;
const tilewidth = 80;

// for moving logic
const ACCEL = 0.02; // higher speeds: increment by ~0.01 or something
const DRAG_COEFFICIENT = 4;
const VCUTOFF = 0.02;

//in-game constants
const TOKEN_GAIN = 100;
const TOKEN_LOSS = 100;
const SPEED_LEVEL_UP_COST = 300;
const POWER_LEVEL_UP_COST = 200;

// p = position
// v = velocity
// m = map
// k = keys down
// camera = camera
// windowsize = {x: window.innerWidth, y: window.innerHeight} for the player's computer

/**
 * 
 * 
 * games = {pin1: gamestate1, pin2: gamestate2, pin3: gamestate3, …}
each gamestate: gamestate = {winner: X, maze: X, players: X, flashcardset: X,}
each player: player = {position: X, health: X … }
gamestate = 
{players:
{player: player object}
teacher: 
{_id: userId of the teacher}
status: 
"lobby" or "game" or "end"
mazes: 
{level 1: maze object, 
level 2: maze object,
level 3: maze object}
}

 */

let games = {};

// data: {pin: gamepin, cards: cards to be used during the game, teacherid: teacher id}
const makeNewGame = (data) => {
  const lobby = mazeLogic.generateLobby();
  const map1 = mazeLogic.generateFullMaze(25);
  const map2 = mazeLogic.generateFullMaze(25);
  const map3 = mazeLogic.generateFullMaze(25);

  const gameLength = 600; //seconds
  const newGame = {
    players: {},
    teacher: { _id: data.teacherid },
    mazes: { lobby: lobby, level1: map1, level2: map2, level3: map3 },
    status: "lobby",
    cards: data.cards,
    timeRemaining: gameLength,
  };

  games[data.pin] = newGame;
  makeNewPlayer(data.teacherid, data.pin, "teacher");
};

const endGame = (pin) => {
  games[pin]["status"] = "end";

  const twoMinutes = 120 * 1000;
  setTimeout(() => {
    delete games[pin];
  }, twoMinutes);
};

const playerJoin = (data) => {
  console.log("inside of playerjoin");
  console.log(data);
  makeNewPlayer(data.studentid, data.pin, data.studentname);
};

const changeTokens = (_id, pin, result) => {
  if (result === "correct") {
    games[pin]["players"][_id]["tokens"] += TOKEN_GAIN;
  } else {
    games[pin]["players"][_id]["tokens"] += TOKEN_LOSS;
  }
};

const upgradeSpeed = (_id, pin) => {
  if (games[pin]["players"][_id]["tokens"] >= SPEED_LEVEL_UP_COST) {
    games[pin]["players"][_id]["tokens"] -= SPEED_LEVEL_UP_COST;
    games[pin]["players"][_id]["speed"] += 1;
    return "success";
  }
  return "failure";
};

const upgradePower = (_id, pin) => {
  if (games[pin]["players"][_id]["tokens"] >= POWER_LEVEL_UP_COST) {
    games[pin]["players"][_id]["tokens"] -= POWER_LEVEL_UP_COST;
    games[pin]["players"][_id]["power"] += 1;
    return "success";
  }
  return "failure";
};

//note: id is user id, not socket id (in case socket disconnects)
// r =
// {_id: userid from mongo,
//     pos:
//     x: x-position,
//     y: y-position,
//     tokens: number of tokens,
//     power: tagging power,
//     speed: user speed,
//     level: current map level,
//     tagged: boolean
//     invincibility: boolean
//     questions_answerwed: int,
//     questions_correct: int,
//     visited_tiles: array}

const makeNewPlayer = (_id, pin, name) => {
  const newPlayer = {
    name: name,
    p: { x: 0, y: 0 },
    v: { x: 0, y: 0 },
    camera: { x: 0, y: 0 },
    k: { up: false, down: false, right: false, left: false },
    windowSize: { x: 1260, y: 700 },
    tokens: 0,
    power: 0,
    speed: 0,
    active: true,
    level: 0,
  };

  games[pin]["players"][_id] = newPlayer;
};

// set player window size
const setWindowSize = (_id, pin, x, y) => {
  games[pin]["players"][_id].windowSize.x = x;
  games[pin]["players"][_id].windowSize.y = y;
  console.log("pin", pin);
};

// // move player on player input
const movePlayer = (_id, pin, dir) => {
  if (!games) {
    return;
  }
  let curPlayer = games[pin]["players"][_id];
  curPlayer.k["up"] = dir["up"];
  curPlayer.k["down"] = dir["down"];
  curPlayer.k["left"] = dir["left"];
  curPlayer.k["right"] = dir["right"];
};

// // update game statistics. running at 60fps
const updateGameState = () => {
  if (!games) return;
  for (let pin in games) {
    for (let _id in games[pin]["players"]) {
      detectMapCollisions(_id, pin);
      let curPlayer = games[pin]["players"][_id];

      // velocity update logic
      let movingx =
        (curPlayer.k["right"] === true || curPlayer.k["left"] === true) &&
        !(curPlayer.k["right"] === true && curPlayer.k["left"] === true);
      let movingy =
        (curPlayer.k["up"] === true || curPlayer.k["down"] === true) &&
        !(curPlayer.k["up"] === true && curPlayer.k["down"] === true);
      if (curPlayer.k["up"] === true) {
        curPlayer.v.y = curPlayer.v.y - ACCEL - 0.01 * curPlayer["speed"];
      }
      if (curPlayer.k["down"] === true) {
        curPlayer.v.y += ACCEL + +0.01 * curPlayer["speed"];
      }
      if (curPlayer.k["left"] === true) {
        curPlayer.v.x = curPlayer.v.x - ACCEL - 0.01 * curPlayer["speed"];
      }
      if (curPlayer.k["right"] === true) {
        curPlayer.v.x += ACCEL + +0.01 * curPlayer["speed"];
      }
      if (movingx && movingy) {
        let v = Math.max(Math.abs(curPlayer.v.y), Math.abs(curPlayer.v.x));
        curPlayer.v.y /= Math.abs(curPlayer.v.y) / v;
        curPlayer.v.x /= Math.abs(curPlayer.v.x) / v;
      }

      // position update logic
      curPlayer.p.x += curPlayer.v.x;
      curPlayer.p.y += curPlayer.v.y;

      if (curPlayer.p.x < 0) {
        curPlayer.p.x = 0;
      } else if (curPlayer.p.x + 1 > mapxsize / tilewidth) {
        curPlayer.p.x = mapxsize / tilewidth - 1;
      }
      if (curPlayer.p.y < 0) {
        curPlayer.p.y = 0;
      } else if (curPlayer.p.y + 1 > mapysize / tilewidth) {
        curPlayer.p.y = mapysize / tilewidth - 1;
      }

      // velocity update logic
      const v_total = Math.sqrt(
        games[pin]["players"][_id].v.x ** 2 + games[pin]["players"][_id].v.y ** 2
      );
      const drag = v_total ** 2 * DRAG_COEFFICIENT; // rho \prop v^2
      if (games[pin]["players"][_id].v.x > 0) {
        if (games[pin]["players"][_id].v.x < VCUTOFF) {
          games[pin]["players"][_id].v.x = 0;
        } else {
          games[pin]["players"][_id].v.x -= Math.min(drag, games[pin]["players"][_id].v.x);
        }
      } else if (games[pin]["players"][_id].v.x < 0) {
        if (games[pin]["players"][_id].v.x > -VCUTOFF) {
          games[pin]["players"][_id].v.x = 0;
        } else {
          const dvx = Math.min(Math.abs(games[pin]["players"][_id].v.x), drag);
          games[pin]["players"][_id].v.x += dvx;
        }
      }
      if (games[pin]["players"][_id].v.y > 0) {
        if (games[pin]["players"][_id].v.y < VCUTOFF) {
          games[pin]["players"][_id].v.y = 0;
        } else {
          games[pin]["players"][_id].v.y -= Math.min(drag, games[pin]["players"][_id].v.y);
        }
      }
      if (games[pin]["players"][_id].v.y < 0) {
        if (games[pin]["players"][_id].v.y > -VCUTOFF) {
          games[pin]["players"][_id].v.y = 0;
        } else {
          const dvy = Math.min(Math.abs(games[pin]["players"][_id].v.y), drag);
          games[pin]["players"][_id].v.y += dvy;
        }
      }

      // camera update logic
      // camera coordinates are top left of camera screen
      curPlayer.camera.x = curPlayer.p.x + 0.5 - curPlayer.windowSize.x / tilewidth / 2;
      curPlayer.camera.y = curPlayer.p.y + 0.5 - curPlayer.windowSize.y / tilewidth / 2;
      if (curPlayer.camera.x < 0) {
        curPlayer.camera.x = 0;
      } else if (curPlayer.camera.x > mapxsize / tilewidth - curPlayer.windowSize.x / tilewidth) {
        curPlayer.camera.x = mapxsize / tilewidth - curPlayer.windowSize.x / tilewidth;
      }
      if (curPlayer.camera.y < 0) {
        curPlayer.camera.y = 0;
      } else if (curPlayer.camera.y > mapysize / tilewidth - curPlayer.windowSize.y / tilewidth) {
        curPlayer.camera.y = mapysize / tilewidth - curPlayer.windowSize.y / tilewidth;
      }
    }
  }
};

// detect collision between player and map objects
const detectMapCollisions = (_id, pin) => {
  let player = games[pin]["players"][_id];
  let map;
  if (player["level"] !== 0) {
    let level = "level" + player["level"];
    map = games[pin]["mazes"][level];
  } else {
    map = games[pin]["mazes"]["lobby"];
  }

  let l1 = player.p.x + 2 * player.v.x;
  let t1 = player.p.y + 2 * player.v.y;
  // tiles that player could potentially with
  let tiles = [];
  tiles.push({ x: Math.floor(l1), y: Math.floor(t1) });
  tiles.push({ x: tiles[0].x + 1, y: tiles[0].y });
  tiles.push({ x: tiles[0].x, y: tiles[0].y + 1 });
  tiles.push({ x: tiles[0].x + 1, y: tiles[0].y + 1 });
  for (let i = 0; i < 4; i++) {
    let tile = tiles[i];
    // console.log(tile.x, tile.y);
    // console.log((tile.y * mapxsize) / tilewidth + tile.x);
    let tile_idx = map[(tile.y * mapxsize) / tilewidth + tile.x];
    if (tile_idx === 0 || tile_idx === 2 || tile_idx === 3) {
      // border, wall, or tree, respectively
      // compute smallest translation vector to undo collision
      console.log("collision detected");
      let [minx, miny] = [0, 0];
      if (Math.abs(tile.x - 1 - l1) < Math.abs(tile.x + 1 - l1)) {
        minx = tile.x - 1 - l1;
      } else {
        minx = tile.x + 1 - l1;
      }

      if (Math.abs(tile.y - 1 - t1) < Math.abs(tile.y + 1 - t1)) {
        miny = tile.y - 1 - t1;
      } else {
        miny = tile.y + 1 - t1;
      }

      if (Math.abs(minx) < Math.abs(miny)) {
        [minx, miny] = [minx, 0];
      } else {
        [minx, miny] = [0, miny];
      }

      // do the translation
      player.p.x += minx;
      player.p.y += miny;
    }
  }
};

// detect collisions between players and other players
const detectPlayerCollisions = (pin) => {
  let game = games[pin]["players"];
  let collisions = [];

  for (let _id1 in game) {
    for (let _id2 in game) {
      // can't collide with self
      if (_id1 === _id2) continue;

      // can't collide with teacher
      if (_id1 === games[pin]["teacher"] || _id2 === games[pin]["teacher"]) continue;

      let player1 = games[pin]["players"][_id1];
      let player2 = games[pin]["players"][_id2];

      let [l1, t1] = [player1.p.x, player1.p.y];
      let [l2, t2] = [player2.p.x, player2.p.y];

      if ((l2 <= l1 && l1 <= l2 + 1) || (l1 <= l2 && l2 <= l1 + 1)) {
        if ((t2 <= t1 && t1 <= t2 + 1) || (t1 <= t2 && t2 <= t1 + 1)) {
          collisions.push([_id1, _id2]);
        }
      }
    }
  }

  return collisions;
};

const gameStart = (pin) => {
  games[pin]["status"] = "game";
  Object.values(games[pin]["players"]).forEach((player) => {
    player.level = 1;
    player.p.x = 0;
    player.p.y = 0;
    player.v.x = 0;
    player.v.y = 0;
  });

  interval = setInterval(() => {
    if (games[pin]["timeRemaining"] === 0) {
      endGame(pin);
      clearInterval(interval);
    }

    games[pin]["timeRemaining"] -= 1;
  }, 1000);
};

const gameExtend = (pin) => {
  games[pin]["timeRemaining"] += 300;
};

module.exports = {
  games,
  movePlayer,
  updateGameState,
  setWindowSize,
  makeNewGame,
  playerJoin,
  gameStart,
  gameExtend,
  changeTokens,
  upgradeSpeed,
  upgradePower,
  endGame,
};
