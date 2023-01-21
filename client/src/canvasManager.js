const xsize = 1260;
const ysize = 700;
const mapxsize = 4000;
const mapysize = 4000;
const tilewidth = 80;
const tile = new Image(tilewidth, tilewidth);
const sprite = new Image(tilewidth, tilewidth);
tile.src = "../gameassets/tile.png";
sprite.src = "../gameassets/astronaut.png";

const tiles = {
  0: null,
  1: null,
};
tiles[0] = new Image(tilewidth, tilewidth);
tiles[0].src = "../gameassets/tile.png";
tiles[1] = new Image(tilewidth, tilewidth);
tiles[1].src = "../gameassets/tree.png";

// right now,
// drawState looks like:
// {p: {x: 0, y: 0}}
export const drawCanvas = (drawState, canvasRef) => {
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
    let i = Math.floor(drawState.camera.x);
    i < Math.ceil(drawState.camera.x + canvas.width / tilewidth);
    i++
  ) {
    for (
      let j = Math.floor(drawState.camera.y);
      j < Math.ceil(drawState.camera.y + canvas.height / tilewidth);
      j++
    ) {
      // get tile at coordinate i,j
      const tile_idx = drawState.m[(j * mapxsize) / tilewidth + i];
      //   console.log((j * canvas.width) / tilewidth + i);
      //   console.log(drawState.m);
      //   console.log(tile_idx);
      const tile_render = tiles[tile_idx];
      ctx.drawImage(
        tile_render,
        (i - drawState.camera.x) * tilewidth,
        (j - drawState.camera.y) * tilewidth,
        tilewidth,
        tilewidth
      );
    }
  }

  let x = drawState.p.x - drawState.camera.x;
  let y = drawState.p.y - drawState.camera.y;

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
  let vx = drawState.v.x;
  let vy = drawState.v.y;
  let xdir = 0;
  if (vx > 0) {
    xdir = 2;
  } else if (vx < 0) {
    xdir = -2;
  }
  let ydir = 0;
  if (vy > 0) {
    ydir = 2;
  } else if (vy < 0) {
    ydir = -2;
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

  //   // draw all the players
  //   Object.values(drawState.players).forEach((p) => {
  //     drawPlayer(context, p.position.x, p.position.y, p.radius, p.color);
  //   });

  //   // draw all the foods
  //   Object.values(drawState.food).forEach((f) => {
  //     drawCircle(context, f.position.x, f.position.y, f.radius, f.color);
  //   });
};
