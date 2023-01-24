const xsize = 400;
const ysize = 400;
const mapxsize = 7200;
const mapysize = 7200;
const tilewidth = 80;
const scale = tilewidth / (mapxsize / xsize);

// drawState:
// {
//     players: props.gameState["players"],
//     map: props.gameState["mazes"]["level2"],
//     teacherid: props.gameState["teacher"]["_id"],
//     level: 2,
//   },
export const drawTeacherCanvas = (drawState, canvasRef) => {
  //   console.log(drawState.p.x);
  //   console.log(drawState.p.y);
  // use canvas reference of canvas element to get reference to canvas object
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // clear the canvas to black
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < mapysize / tilewidth; i++) {
    for (let j = 0; j < mapxsize / tilewidth; j++) {
      // get tile at coordinate i,j
      const tile_idx = drawState["map"][(j * mapxsize) / tilewidth + i];
      if (tile_idx === 0) {
        ctx.fillStyle = "brown";
      } else if (tile_idx === 1) {
        ctx.fillStyle = "green";
      } else if (tile_idx === 2) {
        ctx.fillStyle = "blue";
      }

      ctx.fillRect(i * scale, j * scale, scale, scale);
    }
  }

  // draw all players
  ctx.fillStyle = "red";
  for (let playerid in drawState["players"]) {
    if (
      playerid !== drawState["teacherid"] &&
      drawState["players"][playerid]["level"] === drawState["level"]
    ) {
      let x = drawState["players"][playerid].p.x;
      let y = drawState["players"][playerid].p.y;
      ctx.fillRect(x * scale, y * scale, scale, scale);
    }
  }
};
