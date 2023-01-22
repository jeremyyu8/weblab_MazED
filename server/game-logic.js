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
games = [
  {
    p: { x: 0, y: 0 },
    v: { x: 0, y: 0 },
    camera: { x: 0, y: 0 },
    k: { up: false, down: false, right: false, left: false },
    windowSize: { x: 1260, y: 700 },
  },
];

// generate entire map
// this represents a 4000 x 4000 map
const generateMap = () => {
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
  games[0].m = map;
};

// set player window size
const setWindowSize = (x, y) => {
  games[0].windowSize.x = x;
  games[0].windowSize.y = y;
};

// move player on player input
const movePlayer = (id, dir) => {
  games[0].k["up"] = dir["up"];
  games[0].k["down"] = dir["down"];
  games[0].k["left"] = dir["left"];
  games[0].k["right"] = dir["right"];
  console.log(games[0].windowSize);
};

// update game statistics. running at 60fps
const updateGameState = () => {
  // velocity update logic
  let movingx = games[0].k["right"] === true || games[0].k["left"] === true;
  let movingy = games[0].k["up"] === true || games[0].k["down"] === true;
  if (games[0].k["up"] === true) {
    games[0].v.y -= ACCEL;
    if (movingx && Math.abs(games[0].v.y) < Math.abs(games[0].v.x)) {
      games[0].v.y = -Math.abs(games[0].v.x);
    }
  }
  if (games[0].k["down"] === true) {
    games[0].v.y += ACCEL;
    if (movingx && Math.abs(games[0].v.y) < Math.abs(games[0].v.x)) {
      games[0].v.y = Math.abs(games[0].v.x);
    }
  }
  if (games[0].k["left"] === true) {
    games[0].v.x -= ACCEL;
    if (movingy && Math.abs(games[0].v.x) < Math.abs(games[0].v.y)) {
      games[0].v.x = -Math.abs(games[0].v.y);
    }
  }
  if (games[0].k["right"] === true) {
    games[0].v.x += ACCEL;
    if (movingy && Math.abs(games[0].v.x) < Math.abs(games[0].v.y)) {
      games[0].v.x = Math.abs(games[0].v.y);
    }
  }

  // position update logic
  games[0].p.x += games[0].v.x;
  games[0].p.y += games[0].v.y;

  if (games[0].p.x < 0) {
    games[0].p.x = 0;
  } else if (games[0].p.x + 1 > mapxsize / tilewidth) {
    games[0].p.x = mapxsize / tilewidth - 1;
  }
  if (games[0].p.y < 0) {
    games[0].p.y = 0;
  } else if (games[0].p.y + 1 > mapysize / tilewidth) {
    games[0].p.y = mapysize / tilewidth - 1;
  }

  // velocity update logic
  const v_total = Math.sqrt(games[0].v.x ** 2 + games[0].v.y ** 2);
  const drag = v_total ** 2 * DRAG_COEFFICIENT; // rho \prop v^2
  if (games[0].v.x > 0) {
    if (games[0].v.x < VCUTOFF) {
      games[0].v.x = 0;
    } else {
      games[0].v.x -= Math.min(drag, games[0].v.x);
    }
  } else if (games[0].v.x < 0) {
    if (games[0].v.x > -VCUTOFF) {
      games[0].v.x = 0;
    } else {
      const dvx = Math.min(Math.abs(games[0].v.x), drag);
      games[0].v.x += dvx;
    }
  }
  if (games[0].v.y > 0) {
    if (games[0].v.y < VCUTOFF) {
      games[0].v.y = 0;
    } else {
      games[0].v.y -= Math.min(drag, games[0].v.y);
    }
  }
  if (games[0].v.y < 0) {
    if (games[0].v.y > -VCUTOFF) {
      games[0].v.y = 0;
    } else {
      const dvy = Math.min(Math.abs(games[0].v.y), drag);
      games[0].v.y += dvy;
    }
  }

  // camera update logic
  // camera coordinates are top left of camera screen
  games[0].camera.x = games[0].p.x + 0.5 - games[0].windowSize.x / tilewidth / 2;
  games[0].camera.y = games[0].p.y + 0.5 - games[0].windowSize.y / tilewidth / 2;
  if (games[0].camera.x < 0) {
    games[0].camera.x = 0;
  } else if (games[0].camera.x > mapxsize / tilewidth - games[0].windowSize.x / tilewidth) {
    games[0].camera.x = mapxsize / tilewidth - games[0].windowSize.x / tilewidth;
  }
  if (games[0].camera.y < 0) {
    games[0].camera.y = 0;
  } else if (games[0].camera.y > mapysize / tilewidth - games[0].windowSize.y / tilewidth) {
    games[0].camera.y = mapysize / tilewidth - games[0].windowSize.y / tilewidth;
  }
};

module.exports = {
  games,
  movePlayer,
  updateGameState,
  generateMap,
  setWindowSize,
};
