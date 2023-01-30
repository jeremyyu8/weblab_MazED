const IMG_WIDTH = 320;
const sprites = {};

const skins = [
  "black_000",
  "black_001",
  "black_002",
  "black_003",
  "blue_000",
  "blue_001",
  "blue_002",
  "blue_003",
  "brown_000",
  "brown_001",
  "brown_002",
  "calico_000",
  "clown_000",
  "creme_000",
  "creme_001",
  "creme_002",
  "dark_000",
  "dark_001",
  "dark_002",
  "dark_003",
  "dark_004",
  "ghost_000",
  "gold_000",
  "green_000",
  "green_001",
  "grey_000",
  "grey_001",
  "grey_002",
  "grey_tabby_000",
  "grey_tabby_001",
  "grey_tabby_002",
  "orange_002",
  "orange_003",
  "orange_tabby_000",
  "orange_tabby_001",
  "pink_000",
  "pink_001",
  "radioactive_000",
  "red_000",
  "Seal_Point_000",
  "Seal_Point_001",
  "white_000",
  "white_grey_000",
  "white_grey_001",
  "white_grey_002",
];

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
let animation_frames = {};

for (const skin of skins) {
  sprites[skin] = new Image(IMG_WIDTH, IMG_WIDTH);
  sprites[skin].src = "../gameassets/cats/" + skin + ".png";
  animation_frames[skin] = 0;
}

export const drawCatCarouselCanvas = (canvasRef, skin, dir) => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;

  let pxdir = 0;
  if (dir.right === true) {
    pxdir += 1;
  }
  if (dir.left === true) {
    pxdir += -1;
  }
  let pydir = 0;
  if (dir.up === true) {
    pydir += 1;
  }
  if (dir.down === true) {
    pydir += -1;
  }

  let main;
  let step;
  if (pxdir === 0 && pydir === 0) {
    main = 0;
    step = 0;
    animation_frames[skin] = 0;
  } else {
    main = dirObject[[pxdir, pydir]];
    step = animation_frames[skin];
    animation_frames[skin]++;
    if (animation_frames[skin] >= 4) {
      animation_frames[skin] = 0;
    }
  }

  ctx.drawImage(sprites[skin], 32 * step, 32 * main, 32, 32, 0, 0, IMG_WIDTH, IMG_WIDTH);
};
