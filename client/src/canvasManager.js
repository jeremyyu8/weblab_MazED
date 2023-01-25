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
sprites["teacher"].src = "../gameassets/astronaut_teacher.png";
sprites["student"] = new Image(tilewidth, tilewidth);
sprites["student"].src = "../gameassets/astronaut.png";

export const drawCanvas = (drawState, canvasRef, _id, mazes) => {
  //   console.log(drawState.p.x);
  //   console.log(drawState.p.y);
  // use canvas reference of canvas element to get reference to canvas object
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

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

      ctx.drawImage(
        tile_render,
        (i - drawState["players"][_id].camera.x) * tilewidth,
        (j - drawState["players"][_id].camera.y) * tilewidth,
        tilewidth,
        tilewidth
      );
    }
  }

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
      ctx.drawImage(sprite, x * tilewidth, y * tilewidth, tilewidth, tilewidth);

      // draw sprite power level
      if (drawState["status"] !== "lobby") {
        ctx.font = "20px serif";
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

      // draw sprite hitbox
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
};
