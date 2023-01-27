const mazeLogic = require("./maze-logic");
const e = require("express");

// canvas constants
// const mapxsize = 7200;
// const mapysize = 7200;
const tilewidth = 80;

// for moving logic
const ACCEL = 0.02; // higher speeds: increment by ~0.01 or something
const DRAG_COEFFICIENT = 4;
const VCUTOFF = 0.02;

//in-game constants
const TOKEN_GAIN = 100;
const TOKEN_LOSS = -100;
const SPEED_LEVEL_UP_COST = 300;
const POWER_LEVEL_UP_COST = 200;
const UNLOCK_BORDER_COST = 500;

// p = position
// v = velocity
// m = map
// k = keys down
// camera = camera
// windowsize = {x: window.innerWidth, y: window.innerHeight} for the player's computer
// borders = {level1: [array of positions], level2: [array of positions], level3: [arrayof positions]}

/**
 * 
 * 
 * games = {pin1: gamestate1, pin2: gamestate2, pin3: gamestate3, …}
each gamestate: gamestate = {winner: X, maze: X, players: X, flashcardset: X,}
each player: player = {position: X, health: X … }
gamestate = 
{players:
{playerid: player object}
teacher: 
{_id: userId of the teacher}
status: 
"lobby" or "game" or "end"
mazes: 
{
level1: maze object, 
level2: maze object,
level3: maze object}
}
 */

let mazes = {};
let games = {};

// data: {pin: gamepin, cards: cards to be used during the game, teacherid: teacher id}
const makeNewGame = (data) => {
  const lobby = mazeLogic.generateLobby();
  const map1 = mazeLogic.generateFullMaze(11); // 11
  const map2 = mazeLogic.generateFullMaze(15); // 15
  const map3 = mazeLogic.generateFullMaze(25); // 25
  const endlobby = mazeLogic.generateLobby();

  const gameLength = 600; //seconds
  const newGame = {
    players: {},
    teacher: { _id: data.teacherid },
    status: "lobby",
    cards: data.cards,
    timeRemaining: gameLength,
    startTime: 0,
  };

  const newGameMazes = { lobby: lobby, level1: map1, level2: map2, level3: map3, level4: endlobby };

  games[data.pin] = newGame;
  mazes[data.pin] = newGameMazes;
  makeNewPlayer(data.teacherid, data.pin, "teacher");
};

const endGame = (pin) => {
  games[pin]["status"] = "end";

  const twoMinutes = 120 * 1000;
  setTimeout(() => {
    console.log("deleting");
    delete games[pin];
    delete mazes[pin];
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
    games[pin]["players"][_id]["flashcards_correct"] += 1;
  } else {
    games[pin]["players"][_id]["tokens"] += TOKEN_LOSS;
  }
  games[pin]["players"][_id]["flashcards_total"] += 1;
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
  if (games[pin]["players"][_id]["tokens"] >= UNLOCK_BORDER_COST) {
    games[pin]["players"][_id]["tokens"] -= UNLOCK_BORDER_COST;
    games[pin]["players"][_id]["power"] += 1;
    return "success";
  }
  return "failure";
};

const untagMe = (_id, pin) => {
  // 5 second invincibility period
  games[pin]["players"][_id]["invincible"] = true;
  games[pin]["players"][_id]["tagged"] = false;
  setTimeout(() => {
    games[pin]["players"][_id]["invincible"] = false;
    console.log("untagging me!");
  }, 5000);
};
const unlockBorder = (_id, pin, bordersToUnlock) => {
  let level = "level" + games[pin]["players"][_id]["level"];
  if (games[pin]["players"][_id]["tokens"] >= UNLOCK_BORDER_COST) {
    games[pin]["players"][_id]["tokens"] -= UNLOCK_BORDER_COST;
    let newBorders = [];
    for (border of games[pin]["players"][_id]["borders"][level]) {
      let keep = true;
      for (toUnlock of bordersToUnlock) {
        if (border.x === toUnlock.x && border.y === toUnlock.y) {
          keep = false;
          break;
        }
      }
      if (keep) newBorders.push(border);
    }
    games[pin]["players"][_id]["borders"][level] = newBorders;
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
  console.log(pin);
  let borders1 = [];
  const level1width = Math.floor(Math.sqrt(mazes[pin]["level1"].length));
  for (let r = 0; r < level1width; r++) {
    for (let c = 0; c < level1width; c++) {
      if (mazes[pin]["level1"][r * level1width + c] === 2) {
        borders1.push({ x: c, y: r });
      }
    }
  }

  let borders2 = [];
  const level2width = Math.floor(Math.sqrt(mazes[pin]["level2"].length));
  for (let r = 0; r < level2width; r++) {
    for (let c = 0; c < level2width; c++) {
      if (mazes[pin]["level2"][r * level2width + c] === 2) {
        borders2.push({ x: c, y: r });
      }
    }
  }

  let borders3 = [];
  const level3width = Math.floor(Math.sqrt(mazes[pin]["level3"].length));
  for (let r = 0; r < level3width; r++) {
    for (let c = 0; c < level3width; c++) {
      if (mazes[pin]["level3"][r * level3width + c] === 2) {
        borders3.push({ x: c, y: r });
      }
    }
  }

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
    tagged: false, // currently tagged?
    tags: 0, // number of people that you tagged
    numtagged: 0, // number of people who tagged you
    flashcards_correct: 0, // number of flashcards correct
    flashcards_total: 0, // total number of flashcards answered
    invincible: false, // invincible after getting tagged
    newlevel: false, // if on new level
    level1completion: 0,
    level2completion: 0,
    level3completion: 0,
    borders: { level1: borders1, level2: borders2, level3: borders3 },
  };

  games[pin]["players"][_id] = newPlayer;
};

// set player window size
const setWindowSize = (_id, pin, x, y) => {
  games[pin]["players"][_id].windowSize.x = x;
  games[pin]["players"][_id].windowSize.y = y;
};

// // move player on player input
const movePlayer = (_id, pin, dir) => {
  if (!games || !games[pin]) {
    return;
  }
  let curPlayer = games[pin]["players"][_id];
  curPlayer.k["up"] = dir["up"];
  curPlayer.k["down"] = dir["down"];
  curPlayer.k["left"] = dir["left"];
  curPlayer.k["right"] = dir["right"];
};

// update game statistics. running at 60fps
const updateGameState = () => {
  if (!games) return;
  for (let pin in games) {
    // if the game is not lobby, check for collisions
    if (games[pin]["status"] !== "lobby") {
      let collisions = detectPlayerCollisions(pin);
      for (let collision of collisions) {
        let player1 = games[pin]["players"][collision[0]];
        let player2 = games[pin]["players"][collision[1]];

        // can't tag someone who is already tagged, or is invincible
        if (
          player1["tagged"] !== false ||
          player2["tagged"] !== false ||
          player1["invincible"] === true ||
          player2["invincible"] === true
        ) {
          continue;
        }

        // if powers are equal, both players get tagged
        // players freeze on tag
        console.log("someone got tagged");
        if (player1["power"] === player2["power"]) {
          player1["tagged"] = player2["name"];
          player2["tagged"] = player1["name"];
          player1["tags"] += 1;
          player2["tags"] += 1;
          player1["numtagged"] += 1;
          player2["numtagged"] += 1;
        } else if (player1["power"] > player2["power"]) {
          player2["tagged"] = player1["name"];
          player1["tags"] += 1;
          player2["numtagged"] += 1;
        } else {
          player1["tagged"] = player2["name"];
          player2["tags"] += 1;
          player1["numtagged"] += 1;
        }
      }
    }

    for (let _id in games[pin]["players"]) {
      // map size to use for each player
      let level;
      if (games[pin]["players"][_id]["level"] === 0) {
        level = "lobby";
      } else {
        level = "level" + games[pin]["players"][_id]["level"];
      }
      let mapxsize = Math.floor(Math.sqrt(mazes[pin][level].length)) * tilewidth;
      let mapysize = mapxsize;

      detectMapCollisions(_id, pin);

      let curPlayer = games[pin]["players"][_id];
      // freeze movement if tagged
      if (curPlayer["tagged"] !== false) {
        curPlayer.k["right"] === false;
        curPlayer.k["left"] === false;
        curPlayer.k["up"] === false;
        curPlayer.k["down"] === false;
        curPlayer.v.x = 0;
        curPlayer.v.y = 0;
        continue;
      }
      // freeze movement if moving to next level
      if (curPlayer["newlevel"] === true) {
        console.log("new level is true or something");
        let levelcompletionstring = "level" + curPlayer["level"] + "completion";
        curPlayer[levelcompletionstring] = games[pin]["startTime"];
        console.log(curPlayer);
        curPlayer["level"] += 1;
        curPlayer.k["right"] = false;
        curPlayer.k["left"] = false;
        curPlayer.k["up"] = false;
        curPlayer.k["down"] = false;
        curPlayer.p.x = 0;
        curPlayer.p.y = 0;
        curPlayer.v.x = 0;
        curPlayer.v.y = 0;
        curPlayer["newlevel"] = false;
        continue;
      }

      // velocity update logic
      let movingx =
        (curPlayer.k["right"] === true || curPlayer.k["left"] === true) &&
        !(curPlayer.k["right"] === true && curPlayer.k["left"] === true);
      let movingy =
        (curPlayer.k["up"] === true || curPlayer.k["down"] === true) &&
        !(curPlayer.k["up"] === true && curPlayer.k["down"] === true);
      if (curPlayer.k["up"] === true) {
        curPlayer.v.y -= ACCEL + 0.01 * curPlayer["speed"];
      }
      if (curPlayer.k["down"] === true) {
        curPlayer.v.y += ACCEL + 0.01 * curPlayer["speed"];
      }
      if (curPlayer.k["left"] === true) {
        curPlayer.v.x -= ACCEL + 0.01 * curPlayer["speed"];
      }
      if (curPlayer.k["right"] === true) {
        curPlayer.v.x += ACCEL + 0.01 * curPlayer["speed"];
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
  let level;
  if (player["level"] !== 0) {
    level = "level" + player["level"];
    map = mazes[pin][level];
  } else {
    map = mazes[pin]["lobby"];
  }

  let mapxsize = Math.floor(Math.sqrt(map.length)) * tilewidth;

  let l1 = player.p.x + player.v.x;
  let t1 = player.p.y + player.v.y;
  // tiles that player could potentially collide with
  let tiles = [];
  tiles.push({ x: Math.floor(l1), y: Math.floor(t1) });
  tiles.push({ x: tiles[0].x + 1, y: tiles[0].y });
  tiles.push({ x: tiles[0].x, y: tiles[0].y + 1 });
  tiles.push({ x: tiles[0].x + 1, y: tiles[0].y + 1 });

  //removing the unlocked borders
  if (games[pin]["status"] !== "lobby") {
    let newTiles = [];
    for (const tile of tiles) {
      let add = true;
      if (map[(tile.y * mapxsize) / tilewidth + tile.x] === 2) {
        let found = false;
        for (border of games[pin]["players"][_id]["borders"][level]) {
          if (border.x === tile.x && border.y === tile.y) {
            found = true;
            break;
          }
        }
        if (!found) {
          add = false;
        }
      }
      if (add) newTiles.push(tile);
    }

    tiles = newTiles;
  }

  for (let i = 0; i < tiles.length; i++) {
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
    } else if (tile_idx === 4) {
      player.p.x = 0;
      player.p.y = 0;
      player.v.x = 0;
      player.v.y = 0;
      console.log("player level upgrading from ", player["level"]);
      player["newlevel"] = true;
    }
  }
};

// detect collisions between players and other players
const detectPlayerCollisions = (pin) => {
  let collisions = [];

  let ids = Object.keys(games[pin]["players"]);
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      let _id1 = ids[i];
      let _id2 = ids[j];

      // can't collide with self
      if (_id1 === _id2) continue;

      // can't collide with teacher
      if (_id1 === games[pin]["teacher"]["_id"] || _id2 === games[pin]["teacher"]["_id"]) continue;

      // can't collide with players on different levels
      if (games[pin]["players"][_id1]["level"] !== games[pin]["players"][_id2]["level"]) continue;

      // can't collide with inactive players
      if (
        games[pin]["players"][_id1]["active"] === false ||
        games[pin]["players"][_id2]["active"] === false
      )
        continue;

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
    if (games[pin]) {
      games[pin]["timeRemaining"] -= 1;
      games[pin]["startTime"] += 1;
      if (games[pin]["timeRemaining"] === 0) {
        endGame(pin);
        clearInterval(interval);
      }
    }
  }, 1000);
};

const gameExtend = (pin) => {
  games[pin]["timeRemaining"] += 300;
};

module.exports = {
  games,
  mazes,
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
  untagMe,
  unlockBorder,
  endGame,
};
