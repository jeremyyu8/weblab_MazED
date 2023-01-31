const mazeLogic = require("./maze-logic");
const e = require("express");
// require .env
require("dotenv").config();

// canvas constants
// const mapxsize = 7200;
// const mapysize = 7200;
const tilewidth = 80;

// for moving logic
const ACCEL = 0.02 * 2; // higher speeds: increment by ~0.01 or something
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
  // const lobby = mazeLogic.generateLobby();
  const lobby = mazeLogic.generateLobby();
  const map0 = mazeLogic.generateTrivialMaze();
  const endlobby = mazeLogic.generateEndLobby();

  let maps = [];
  for (let idx = 1; idx <= data.numMazes; idx++) {
    if (idx === 1) {
      maps.push(mazeLogic.generateFullMaze(11));
    } else if (idx === 2) {
      maps.push(mazeLogic.generateFullMaze(17));
    } else if (idx === 3) {
      maps.push(mazeLogic.generateFullMaze(25));
    } else {
      maps.push(mazeLogic.generateFullMaze(35));
    }
  }
  maps.push(endlobby);

  const gameLength = data.gameTime * 60; //seconds

  let questionStats = {};
  for (const card of data.cards) {
    questionStats[card._id] = { correct: 0, attempts: 0 };
  }

  const newGame = {
    players: {},
    teacher: { _id: data.teacherid },
    status: "lobby",
    cards: data.cards,
    questionStats: questionStats,
    setid: data.setid,
    settitle: data.settitle,
    timeRemaining: gameLength,
    startTime: 0,
    numMazes: parseInt(data.numMazes),
    gameMode: data.gameMode,
    redRank: 0, // red team rank
    blueRank: 0, // blue team rank
    infectedRank: 1, // infected team rank, default winning
    notInfectedRank: 2, // not infected team rank, default losing
    pin: data.pin,
    active: true,
  };

  const newGameMazes = {
    lobby: lobby,
    level0: map0,
  };

  // actual levels
  for (let idx = 1; idx <= maps.length; idx++) {
    let leveltag = "level" + idx;
    newGameMazes[leveltag] = maps[idx - 1];
  }

  games[data.pin] = newGame;
  mazes[data.pin] = newGameMazes;
  makeNewPlayer(data.teacherid, data.pin, "teacher", "teacher");
  console.log(games);
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
  makeNewPlayer(data.studentid, data.pin, data.studentname, data.displayname, data.skin);
};

const changeTokens = (_id, pin, result, cardid) => {
  if (result === "correct") {
    games[pin]["players"][_id]["tokens"] += TOKEN_GAIN;
    games[pin]["players"][_id]["flashcards_correct"] += 1;
    games[pin]["questionStats"][cardid]["correct"] += 1;
  } else {
    games[pin]["players"][_id]["tokens"] += TOKEN_LOSS;
  }
  games[pin]["players"][_id]["flashcards_total"] += 1;
  games[pin]["questionStats"][cardid]["attempts"] += 1;
  console.log(games[pin]["questionStats"]);
};

const upgradeSpeed = (_id, pin) => {
  console.log("inside of upgradeSpeed");
  let cost = 100 * games[pin]["players"][_id]["speed"] + SPEED_LEVEL_UP_COST;
  if (games[pin]["players"][_id]["tokens"] >= cost) {
    games[pin]["players"][_id]["tokens"] -= cost;
    games[pin]["players"][_id]["speed"] += 1;
    return "success";
  }
  return "failure";
};

const upgradePower = (_id, pin) => {
  let cost = 100 * games[pin]["players"][_id]["power"] + POWER_LEVEL_UP_COST;
  if (games[pin]["players"][_id]["tokens"] >= cost) {
    games[pin]["players"][_id]["tokens"] -= cost;
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

const makeNewPlayer = (_id, pin, name, displayname, skin) => {
  let numMazes = games[pin]["numMazes"];
  let borders = {};

  for (let idx = 0; idx <= numMazes; idx++) {
    let level_borders = [];
    let leveltag = "level" + idx;
    const levelwidth = Math.floor(Math.sqrt(mazes[pin][leveltag].length));
    for (let r = 0; r < levelwidth; r++) {
      for (let c = 0; c < levelwidth; c++) {
        if (mazes[pin][leveltag][r * levelwidth + c] === 2) {
          level_borders.push({ x: c, y: r });
        }
      }
    }
    borders[leveltag] = level_borders;
  }

  console.log("inside of makenewplayer");
  console.log(name, displayname, skin);
  const newPlayer = {
    name: name,
    displayname: displayname,
    p: { x: 0, y: 0 },
    v: { x: 0, y: 0 },
    camera: { x: 0, y: 0 },
    k: { up: false, down: false, right: false, left: false },
    windowSize: { x: 1260, y: 700 },
    rank: 0, // rank amongst all active players
    tokens: 0,
    power: 0,
    speed: 0,
    active: true,
    level: -1, // default to lobby
    tagged: false, // currently tagged?
    tags: 0, // number of people that you tagged
    numtagged: 0, // number of people who tagged you
    flashcards_correct: 0, // number of flashcards correct
    flashcards_total: 0, // total number of flashcards answered
    invincible: false, // invincible after getting tagged
    newlevel: false, // if on new level
    team: "neutral", // team mode, "red" or "blue"
    infected: false, // infection, by default false
    borders: borders,
    skin: skin,
  };

  // completion times, including the trivial level completion time
  for (let idx = 0; idx <= numMazes; idx++) {
    let level_completion_tag = "level" + idx + "completion";
    newPlayer[level_completion_tag] = 0;
  }

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

  // first, handle lobby activity logic
  let pins = Object.keys(games);
  for (let i = pins.length; i >= 0; i--) {
    let pin = pins[i];

    // make sure games pin exists idk
    if (games[pin]) {
      // if there are no active players, set state to be inactive
      let all_inactive = true;
      for (let _id in games[pin]["players"]) {
        if (games[pin]["players"][_id]["active"] === true) {
          all_inactive = false;
        }
      }
      if (all_inactive === true) {
        games[pin]["active"] = false;
        games[pin]["inactive_timer"] += 1 / process.env.FPS;
      } else {
        games[pin]["active"] = true;
        games[pin]["inactive_timer"] = 0;
      }

      // if everyone in the game is inactive for 1 minute, delete it
      if (games[pin]["inactive_timer"] > 60) {
        delete games[pin];
        continue;
      }
    }
  }

  // now handle actual game logic
  for (let pin in games) {
    // sort player ranks in each game
    if (games[pin]["status"] !== "lobby") {
      if (games[pin]["gameMode"] === "individual") {
        rankPlayers(pin);
      } else if (games[pin]["gameMode"] === "team") {
        rankTeams(pin);
      }
    }

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
        if (player1["power"] === player2["power"]) {
          player1["tagged"] = player2["name"];
          player2["tagged"] = player1["name"];
          player1["tags"] += 1;
          player2["tags"] += 1;
          player1["numtagged"] += 1;
          player2["numtagged"] += 1;
          // infection
          if (games[pin]["gameMode"] === "infection") {
            if (player1["infected"] === true) player2["infected"] = true;
            if (player2["infected"] === true) player1["infected"] = true;
          }
        } else if (player1["power"] > player2["power"]) {
          player2["tagged"] = player1["name"];
          player1["tags"] += 1;
          player2["numtagged"] += 1;
          // infection
          if (games[pin]["gameMode"] === "infection") {
            if (player1["infected"] === true) player2["infected"] = true;
          }
        } else {
          player1["tagged"] = player2["name"];
          player2["tags"] += 1;
          player1["numtagged"] += 1;
          // infection
          if (games[pin]["gameMode"] === "infection") {
            if (player2["infected"] === true) player1["infected"] = true;
          }
        }
      }

      if (games[pin]["gameMode"] === "infection") {
        checkInfectionEnd(pin); // check if any non-infected players remain
      }
    }

    for (let _id in games[pin]["players"]) {
      // map size to use for each player
      let level;
      if (games[pin]["players"][_id]["level"] === -1) {
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
        // new level invincibility
        games[pin]["players"][_id]["invincible"] = true;
        let level_completion_tag = "level" + curPlayer["level"] + "completion";
        curPlayer[level_completion_tag] = games[pin]["startTime"];
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
        console.log("player new level");
        console.log(curPlayer);
        // if game mode infection and non-infected player reaches the last level, the game ends
        if (games[pin]["gameMode"] === "infection" && curPlayer["infected"] === false) {
          console.log("new level for non infected player");
          console.log(curPlayer["level"], games[pin]["numMazes"] + 1);
          if (curPlayer["level"] === games[pin]["numMazes"] + 1) {
            games[pin]["infectedRank"] = 2;
            games[pin]["notInfectedRank"] = 1;
            console.log(games[pin]);
            endGame(pin);
          }
        }
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

// check for infection end
const checkInfectionEnd = (pin) => {
  for (let _id in games[pin]["players"]) {
    if (_id === games[pin]["teacher"]["_id"]) continue;
    if (games[pin]["players"][_id]["infected"] === false) return;
  }
  // end game if every player is infected
  endGame(pin);
};

// team rankings
const rankTeams = (pin) => {
  let red = [0, 0, 0]; // levels, tags, total time
  let blue = [0, 0, 0];
  for (let _id in games[pin]["players"]) {
    let player = games[pin]["players"][_id];
    if (player["team"] === "red") {
      red[0] += player["level"];
      red[1] += player["tags"];
      let time;
      if (player["level"] <= 0) {
        time = 3600;
      } else {
        let last = player["level"] - 1;
        let level_completion_tag = "level" + last + "completion";
        time = player[level_completion_tag];
      }
      red[2] += time;
    } else {
      blue[0] += player["level"];
      blue[1] += player["tags"];
      let time;
      if (player["level"] <= 0) {
        time = 3600;
      } else {
        let last = player["level"] - 1;
        let level_completion_tag = "level" + last + "completion";
        time = player[level_completion_tag];
      }
      blue[2] += time;
    }
  }
  let numPlayers = Object.keys(games[pin]["players"]).length;
  if (red[0] / numPlayers === blue[0] / numPlayers) {
    if (red[1] === blue[1]) {
      if (red[2] > blue[2]) {
        // total time
        games[pin]["blueRank"] = 1;
        games[pin]["redRank"] = 2;
      } else {
        games[pin]["blueRank"] = 2;
        games[pin]["redRank"] = 1;
      }
    }
    if (red[1] < blue[1]) {
      // total tags
      games[pin]["blueRank"] = 1;
      games[pin]["redRank"] = 2;
    } else {
      games[pin]["blueRank"] = 2;
      games[pin]["redRank"] = 1;
    }
  }

  if (red[0] / numPlayers < blue[0] / numPlayers) {
    // normalized sum of levels
    games[pin]["blueRank"] = 1;
    games[pin]["redRank"] = 2;
  } else {
    games[pin]["blueRank"] = 2;
    games[pin]["redRank"] = 1;
  }
};

// player rankings
const rankPlayers = (pin) => {
  let players = [];
  for (let _id in games[pin]["players"]) {
    // don't sort the teacher
    if (_id !== games[pin]["teacher"]["_id"]) {
      let player_level = games[pin]["players"][_id]["level"];
      let tags = games[pin]["players"][_id]["tags"];
      if (player_level <= 0) {
        players.push([_id, player_level, 3600, tags]);
      } else {
        let last = player_level - 1;
        let level_completion_tag = "level" + last + "completion";
        let level_completion_time = games[pin]["players"][_id][level_completion_tag];
        let tags = games[pin]["players"][_id]["tags"];
        players.push([_id, player_level, level_completion_time, tags]);
      }
    }
  }
  // sort from best player to worst player
  // < 0 means sort p1 before p2
  players.sort((p1, p2) => {
    if (p1[1] === p2[1]) {
      // same level
      if (p1[2] === p2[2]) {
        // and same level completion time
        if (p1[3] < p2[3]) return 1; // then sort by number of tags
        else return -1;
      }
      if (p1[2] > p2[2]) return 1;
      else return -1;
    } else {
      if (p1[1] < p2[1]) return 1;
      else return -1;
    }
  });

  players.forEach((player, idx) => {
    games[pin]["players"][player[0]]["rank"] = idx + 1;
  });
};

// detect collision between player and map objects
const detectMapCollisions = (_id, pin) => {
  let player = games[pin]["players"][_id];
  let map;
  let level;
  if (player["level"] !== -1) {
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
      player.v.x = 0;
      player.v.y = 0;
    } else if (tile_idx === 4 || tile_idx > 20) {
      player.p.x = 0;
      player.p.y = 0;
      player.v.x = 0;
      player.v.y = 0;
      console.log("player level upgrading from ", player["level"]);
      player["newlevel"] = true;
    }
  }
};

const toggleOffInvincible = (_id, pin) => {
  console.log("toggling off invincible");
  if (!games || !games[pin]) return;
  games[pin]["players"][_id]["invincible"] = false;
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

      // can't collide with anyone on level 0 (the trivial level)
      if (games[pin]["players"][_id1]["level"] === 0 || games[pin]["players"][_id2]["level"] === 0)
        continue;

      // can't tag someone on the same team in team mode
      if (
        games[pin]["gameMode"] === "team" &&
        games[pin]["players"][_id1]["team"] === games[pin]["players"][_id2]["team"]
      ) {
        continue;
      }

      // infected teams can only tag on the opposite side of infection
      if (
        games[pin]["gameMode"] === "infection" &&
        games[pin]["players"][_id1]["infected"] === games[pin]["players"][_id2]["infected"]
      ) {
        continue;
      }

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
    player.level = 0;
    player.p.x = 0;
    player.p.y = 0;
    player.v.x = 0;
    player.v.y = 0;
  });

  let player_ids = Object.keys(games[pin]["players"]);
  let real_player_ids = [];
  // filter out teacher
  for (let i = 0; i < player_ids.length; i++) {
    if (player_ids[i] === games[pin]["teacher"]["_id"]) continue;
    real_player_ids.push(player_ids[i]);
  }
  // assign teams
  if (games[pin]["gameMode"] === "team") {
    for (let i = 0; i < real_player_ids.length; i++) {
      if (i % 2 === 0) {
        games[pin]["players"][real_player_ids[i]].team = "red";
      } else {
        games[pin]["players"][real_player_ids[i]].team = "blue";
      }
    }
  } else if (games[pin]["gameMode"] === "infection") {
    // assign infected person
    let infected_idx = Math.floor(Math.random() * real_player_ids.length);
    games[pin]["players"][real_player_ids[infected_idx]].infected = true;

    // buff infected person stats
    games[pin]["players"][real_player_ids[infected_idx]].level = 1;
    games[pin]["players"][real_player_ids[infected_idx]].power = 5;
    games[pin]["players"][real_player_ids[infected_idx]].speed = 3;
    games[pin]["players"][real_player_ids[infected_idx]].tokens = 1000;
  }

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

const checkAlreadyConnected = (new_connected_id) => {
  for (let pin in games) {
    for (let _id in games[pin]["players"]) {
      if (new_connected_id === _id) {
        if (games[pin]["status"] !== "end") {
          return { result: true, _id: new_connected_id };
        }
      }
    }
  }
  return { result: false, _id: new_connected_id };
};

const gameExtend = (pin) => {
  games[pin]["timeRemaining"] += 120;
};

module.exports = {
  games,
  mazes,
  movePlayer,
  updateGameState,
  checkAlreadyConnected,
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
  toggleOffInvincible,
  endGame,
};
