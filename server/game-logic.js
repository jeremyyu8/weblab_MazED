// canvas constants
const mapxsize = 4000;
const mapysize = 4000;
const tilewidth = 80;

// for moving logic
const ACCEL = 0.02; // higher speeds: increment by ~0.01 or something
const DRAG_COEFFICIENT = 4;
const VCUTOFF = 0.02;

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
  const lobby = generateLobby();
  const map1 = generateMap();
  const map2 = generateMap();
  const map3 = generateMap();
  const newGame = {
    players: {},
    teacher: { _id: data.teacherid },
    mazes: { lobby: lobby, level1: map1, level2: map2, level3: map3 },
    status: "lobby",
    cards: data.cards,
  };

  games[data.pin] = newGame;
  makeNewPlayer(data.teacherid, data.pin, "teacher");
};

const playerJoin = (data) => {
  console.log("inside of playerjoin");
  console.log(data);
  makeNewPlayer(data.studentid, data.pin, data.studentname);
};

// TODO make this legit
const generateMap = () => {
  // generate random map
  let map = [];
  for (let i = 0; i < mapysize / tilewidth; i++) {
    for (let j = 0; j < mapxsize / tilewidth; j++) {
      if ((i == 5 && j == 6) || (i == 7 && j == 10) || (i == 35 && j == 35)) {
        map.push(1);
      } else {
        map.push(0);
      }
    }
  }
  return map;
  //   games[0].m = map;
};

// TODO make this legit
const generateLobby = () => {
  // generate lobby
  let map = [];
  for (let i = 0; i < mapysize / tilewidth; i++) {
    for (let j = 0; j < mapxsize / tilewidth; j++) {
      if ((i == 5 && j == 6) || (i == 7 && j == 10) || (i == 35 && j == 35)) {
        map.push(1);
      } else {
        map.push(0);
      }
    }
  }
  return map;
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
  let curPlayer = games[pin]["players"][_id];
  curPlayer.k["up"] = dir["up"];
  curPlayer.k["down"] = dir["down"];
  curPlayer.k["left"] = dir["left"];
  curPlayer.k["right"] = dir["right"];
};

// // update game statistics. running at 60fps
const updateGameState = () => {
  for (let pin in games) {
    for (let _id in games[pin]["players"]) {
      let curPlayer = games[pin]["players"][_id];

      // velocity update logic
      let movingx =
        (curPlayer.k["right"] === true || curPlayer.k["left"] === true) &&
        !(curPlayer.k["right"] === true && curPlayer.k["left"] === true);
      let movingy =
        (curPlayer.k["up"] === true || curPlayer.k["down"] === true) &&
        !(curPlayer.k["up"] === true && curPlayer.k["down"] === true);
      if (curPlayer.k["up"] === true) {
        curPlayer.v.y -= ACCEL;
      }
      if (curPlayer.k["down"] === true) {
        curPlayer.v.y += ACCEL;
      }
      if (curPlayer.k["left"] === true) {
        curPlayer.v.x -= ACCEL;
      }
      if (curPlayer.k["right"] === true) {
        curPlayer.v.x += ACCEL;
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

const gameStart = (pin) => {
  games[pin]["status"] = "game";
  Object.values(games[pin]["players"]).forEach((player) => {
    player.level = 1;
    console.log(player);
  });
};

module.exports = {
  games,
  movePlayer,
  updateGameState,
  generateMap,
  setWindowSize,
  makeNewGame,
  playerJoin,
  gameStart,
};
