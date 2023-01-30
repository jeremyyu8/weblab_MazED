const IMG_WIDTH = 480;
let animation_frame = 0;

let cat_404 = new Image(IMG_WIDTH, IMG_WIDTH);
cat_404.src = "../gameassets/cats/black_001.png";

export const drawCanvas404 = (canvasRef) => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;

  let current = animation_frame;
  animation_frame++;
  if (animation_frame >= 40) {
    animation_frame = 0;
  }
  let col;
  let row;
  if (current < 20) {
    col = Math.floor(current / 4);
    row = current - 4 * col;
  } else {
    col = 0;
    row = 0;
  }

  // col: 16 thru 20
  // row: 0 thru 3

  ctx.drawImage(cat_404, 32 * row, 32 * (16 + col) - 3, 32, 32, 0, 0, IMG_WIDTH, IMG_WIDTH);
};
