// const xsize = 400;
// const ysize = 400;
// const mapxsize = 7200;
// const mapysize = 7200;
const tilewidth = 80;

// drawState:
// {
//     players: props.gameState["players"],
//     map: props.gameState["mazes"]["level2"],
//     teacherid: props.gameState["teacher"]["_id"],
//     level: 2,
//   },
export const drawTeacherCanvas = (drawState, canvasRef, xsize) => {
  //   console.log(drawState.p.x);
  //   console.log(drawState.p.y);
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let mapxsize = Math.floor(Math.sqrt(drawState.map.length)) * tilewidth;
  let scale = tilewidth / (mapxsize / xsize);

  for (let i = 0; i < mapxsize / tilewidth; i++) {
    for (let j = 0; j < mapxsize / tilewidth; j++) {
      // get tile at coordinate i,j
      const tile_idx = drawState["map"][(j * mapxsize) / tilewidth + i];
      if (tile_idx === 0) {
        ctx.fillStyle = "brown";
      } else if (tile_idx === 1) {
        ctx.fillStyle = "green";
      } else if (tile_idx === 2) {
        ctx.fillStyle = "blue";
      } else if (tile_idx === 4) {
        ctx.fillStyle = "purple";
      }

      ctx.fillRect(i * scale, j * scale, scale, scale);
      ctx.beginPath();
      ctx.rect(i * scale, j * scale, scale, scale);
      ctx.lineWidth = "1";
      ctx.strokeStyle = "rgba(0,0,0,0.1)";
      ctx.stroke();
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
