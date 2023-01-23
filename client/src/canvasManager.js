const xsize = window.innerWidth;
const ysize = window.innerHeight;
const mapxsize = 4000;
const mapysize = 4000;
const tilewidth = 80;
const sprite = new Image(tilewidth, tilewidth);
sprite.src = "../gameassets/astronaut.png";

const tiles = {
  0: null,
  1: null,
};
tiles[0] = new Image(tilewidth, tilewidth);
tiles[0].src = "../gameassets/grass.png";
tiles[1] = new Image(tilewidth, tilewidth);
tiles[1].src = "../gameassets/tree.png";

// right now,
// drawState looks like:
// {p: {x: 0, y: 0}}
export const drawCanvas = (drawState, canvasRef, _id) => {
  //   console.log(drawState.p.x);
  //   console.log(drawState.p.y);
  // use canvas reference of canvas element to get reference to canvas object
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // clear the canvas to black
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // draw tile
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
      const tile_idx = drawState["mazes"]["lobby"][(j * mapxsize) / tilewidth + i];
      //   console.log((j * canvas.width) / tilewidth + i);
      //   console.log(drawState["players"][_id].m);
      //   console.log(tile_idx);
      const tile_render = tiles[tile_idx];
      ctx.drawImage(
        tile_render,
        (i - drawState["players"][_id].camera.x) * tilewidth,
        (j - drawState["players"][_id].camera.y) * tilewidth,
        tilewidth,
        tilewidth
      );
    }
  }

  Object.values(drawState["players"]).forEach((player) => {
    let x = player.p.x - player.camera.x;
    let y = player.p.y - player.camera.y;

    // draw sprite
    ctx.drawImage(sprite, x * tilewidth, y * tilewidth, tilewidth, tilewidth);

    // draw sprite hitbox
    ctx.beginPath();
    ctx.rect(x * tilewidth, y * tilewidth, tilewidth, tilewidth);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "red";
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
  });

  //   // draw all the players
  //   Object.values(drawState.players).forEach((p) => {
  //     drawPlayer(context, p.position.x, p.position.y, p.radius, p.color);
  //   });

  //   // draw all the foods
  //   Object.values(drawState.food).forEach((f) => {
  //     drawCircle(context, f.position.x, f.position.y, f.radius, f.color);
  //   });
};
