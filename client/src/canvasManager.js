const xsize = window.innerWidth;
const ysize = window.innerHeight;
// const mapxsize = 7200;
// const mapysize = 7200;
const tilewidth = 80;
// const sprite = new Image(tilewidth, tilewidth);
// sprite.src = "../gameassets/astronaut.png";

const tiles = {
  0: null,
  1: null,
  2: null,
  3: null,
  4: null,
};
tiles[0] = new Image(tilewidth, tilewidth);
tiles[0].src = "../gameassets/wall.png";
tiles[1] = new Image(tilewidth, tilewidth);
tiles[1].src = "../gameassets/grass.png";
tiles[2] = new Image(tilewidth, tilewidth);
tiles[2].src = "../gameassets/border.png";
tiles[3] = new Image(tilewidth, tilewidth);
tiles[3].src = "../gameassets/tree.png";
tiles[4] = new Image(tilewidth, tilewidth);
tiles[4].src = "../gameassets/end.png";

const sprites = {
  teacher: null,
  student: null,
};
sprites["teacher"] = new Image(tilewidth, tilewidth);
sprites["teacher"].src = "../gameassets/black_000.png";
sprites["student"] = new Image(tilewidth, tilewidth);
sprites["student"].src = "../gameassets/creme_000.png";

// animation vectors
let six = [-1, -1]; // h
let seven = [0, -1]; // v
let eight = [1, -1]; // h
let nine = [1, 0]; // h
let ten = [1, 1]; // h
let eleven = [0, 1]; // v
let twelve = [-1, 1]; // h
let thirteen = [-1, 0]; // h
let dirObject = {};
dirObject[six] = 6;
dirObject[seven] = 7;
dirObject[eight] = 8;
dirObject[nine] = 9;
dirObject[ten] = 10;
dirObject[eleven] = 11;
dirObject[twelve] = 12;
dirObject[thirteen] = 13;

// shadow vectors
const shadows = {
  6: null,
  7: null,
  8: null,
  9: null,
  10: null,
  11: null,
  12: null,
  13: null,
};
// load images
shadows[6] = new Image(tilewidth, tilewidth);
shadows[6].src = "../gameassets/shadows/45.png";
shadows[7] = new Image(tilewidth, tilewidth);
shadows[7].src = "../gameassets/shadows/90.png";
shadows[8] = new Image(tilewidth, tilewidth);
shadows[8].src = "../gameassets/shadows/135.png";
shadows[9] = new Image(tilewidth, tilewidth);
shadows[9].src = "../gameassets/shadows/0.png";
shadows[10] = new Image(tilewidth, tilewidth);
shadows[10].src = "../gameassets/shadows/45.png";
shadows[11] = new Image(tilewidth, tilewidth);
shadows[11].src = "../gameassets/shadows/90.png";
shadows[12] = new Image(tilewidth, tilewidth);
shadows[12].src = "../gameassets/shadows/135.png";
shadows[13] = new Image(tilewidth, tilewidth);
shadows[13].src = "../gameassets/shadows/0.png";

// shadow offset values
let v = [10.5, 33 + 9, -12, -12];
let h = [0, 24 + 9, 9, 9];
let d1 = [9, 33 + 9, -6, -6]; // 45
let d2 = [9, 34.5 + 9, -9, -9]; // 135
let shadowoffset = { 6: d1, 7: v, 8: d2, 9: h, 10: d1, 11: v, 12: d2, 13: h };

// last animated thing
// playerid: {
// animation: ,
// step: ,
// hitboxes: ,
//}
//
let last_frame = {};
// let animation_counter = 0;

export const drawCanvas = (drawState, canvasRef, _id, mazes, animation_counter) => {
  //   console.log(drawState.p.x);
  //   console.log(drawState.p.y);
  // use canvas reference of canvas element to get reference to canvas object
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  // clear the canvas to black
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // get current user level to render
  let map;
  if (drawState["players"][_id]["level"] !== 0) {
    let level = "level" + drawState["players"][_id]["level"];
    map = mazes[level];
  } else {
    map = mazes["lobby"];
  }
  let mapxsize = Math.floor(Math.sqrt(map.length)) * tilewidth;

  // draw tiles
  // draw image (img, canvasx, canvasy, xwidth, ywdith)
  for (
    let i = Math.floor(drawState["players"][_id].camera.x);
    i < Math.ceil(drawState["players"][_id].camera.x + canvas.width / tilewidth);
    i++
  ) {
    for (
      let j = Math.floor(drawState["players"][_id].camera.y);
      j < Math.ceil(drawState["players"][_id].camera.y + canvas.height / tilewidth);
      j++
    ) {
      // get tile at coordinate i,j
      const tile_idx = map[(j * mapxsize) / tilewidth + i];
      let tile_render = tiles[tile_idx];

      if (tile_idx === 2 && drawState["players"][_id]["level"] > 0) {
        let level = `level${drawState["players"][_id]["level"]}`;
        let found = false;
        for (const border of drawState["players"][_id]["borders"][level]) {
          if (border.x === i && border.y === j) {
            found = true;
            break;
          }
        }
        if (!found) {
          // console.log(i, j);
          // console.log(drawState["players"][_id]["borders"]["level1"]);
          tile_render = tiles[1];
        }
      }

      if (tile_render) {
        ctx.drawImage(
          tile_render,
          (i - drawState["players"][_id].camera.x) * tilewidth,
          (j - drawState["players"][_id].camera.y) * tilewidth,
          tilewidth,
          tilewidth
        );
      }
    }
  }

  // draw players
  for (let playerid in drawState["players"]) {
    if (drawState["players"][playerid].active === true) {
      // don't render teacher if not in the lobby
      if (drawState["teacher"]["_id"] === playerid && drawState["status"] !== "lobby") {
        continue;
      }
      // only render players in the same level
      if (drawState["players"][playerid]["level"] !== drawState["players"][_id]["level"]) {
        continue;
      }
      let player = drawState["players"][playerid];
      let x = player.p.x - drawState["players"][_id].camera.x;
      let y = player.p.y - drawState["players"][_id].camera.y;

      // draw sprite
      let sprite = sprites["student"];
      if (drawState["teacher"]["_id"] === playerid) {
        sprite = sprites["teacher"];
      }
      // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
      // sprite direction vector again
      let pxdir = 0;
      if (player.k["right"] === true) {
        pxdir += 1;
      }
      if (player.k["left"] === true) {
        pxdir += -1;
      }
      let pydir = 0;
      if (player.k["up"] === true) {
        pydir += 1;
      }
      if (player.k["down"] === true) {
        pydir += -1;
      }

      let dir;
      let step;
      let shadow;
      let off;
      if (pxdir === 0 && pydir === 0) {
        if (!last_frame[playerid]) {
          let newplayerid = {
            animation: 7,
            step: 0,
          };
          last_frame[playerid] = newplayerid;
          dir = 7;
          step = 0;
        } else {
          dir = last_frame[playerid]["animation"];
          last_frame[playerid]["step"] = 0;
          step = 0;
          shadow = shadows[dir];
          off = shadowoffset[dir];
        }
      } else {
        dir = dirObject[[pxdir, pydir]];
        shadow = shadows[dirObject[[pxdir, pydir]]];
        off = shadowoffset[dirObject[[pxdir, pydir]]];
        step = last_frame[playerid]["step"];
        if (animation_counter % 10 === 0) {
          last_frame[playerid]["step"]++;
          if (last_frame[playerid]["step"] >= 4) {
            last_frame[playerid]["step"] = 0;
          }
        }
        last_frame[playerid]["animation"] = dir;
      }
      ctx.drawImage(
        shadow,
        x * tilewidth + off[0],
        y * tilewidth + off[1],
        tilewidth + off[2],
        tilewidth + off[3]
      );
      ctx.drawImage(
        sprite,
        32 * step + 3,
        32 * dir + 0,
        29,
        29,
        x * tilewidth,
        y * tilewidth,
        tilewidth + 24,
        tilewidth + 24
      );

      // draw sprite power level
      if (drawState["status"] !== "lobby") {
        ctx.font = "20px Monospace";
        if (drawState["players"][playerid]["tagged"] !== false) {
          ctx.fillText("tagged", x * tilewidth, y * tilewidth);
        } else if (drawState["players"][playerid]["invincible"] === true) {
          ctx.fillText("invincible", x * tilewidth, y * tilewidth);
        } else {
          ctx.fillText(
            `power: ${drawState["players"][playerid]["power"]}`,
            x * tilewidth,
            y * tilewidth
          );
        }
      }

      let offset = drawState["status"] === "lobby" ? 5 : 20;
      // draw username
      ctx.font = "20px Monospace";
      if (drawState["teacher"]["_id"] !== playerid) {
        let horizontal_offset = drawState["players"][playerid]["displayname"].length * 3;
        ctx.fillText(
          `${drawState["players"][playerid]["displayname"]}`,
          x * tilewidth - horizontal_offset,
          y * tilewidth - offset
        );
      }

      // draw sprite hitboxes and dir vectors
      if (drawState["hitboxes"]) {
        ctx.beginPath();
        ctx.rect(x * tilewidth, y * tilewidth, tilewidth, tilewidth);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "red";
        if (drawState["teacher"]["_id"] === playerid) {
          ctx.strokeStyle = "black";
        }
        ctx.stroke();
        // sprite dir vector
        let cx = x + 1 / 2;
        let cy = y + 1 / 2;
        let xdir = 0;
        if (player.k["right"] === true) {
          xdir += 2;
        }
        if (player.k["left"] === true) {
          xdir += -2;
        }
        let ydir = 0;
        if (player.k["up"] === true) {
          ydir += -2;
        }
        if (player.k["down"] === true) {
          ydir += 2;
        }
        if (xdir !== 0 && ydir !== 0) {
          xdir /= Math.sqrt(2);
          ydir /= Math.sqrt(2);
        }
        ctx.beginPath();
        ctx.moveTo(cx * tilewidth, cy * tilewidth);
        ctx.lineTo((cx + xdir) * tilewidth, (cy + ydir) * tilewidth);
        ctx.strokeStyle = "green";
        ctx.stroke();
      }
    }
  }
  // draw players
  //   Object.values(drawState["players"]).forEach((player) => {
  //     // only draw active players
  //     if (player.active === true) {

  //     }
  //   });

  //   // draw all the players
  //   Object.values(drawState.players).forEach((p) => {
  //     drawPlayer(context, p.position.x, p.position.y, p.radius, p.color);
  //   });

  //   // draw all the foods
  //   Object.values(drawState.food).forEach((f) => {
  //     drawCircle(context, f.position.x, f.position.y, f.radius, f.color);
  //   });
  animation_counter++;
};
