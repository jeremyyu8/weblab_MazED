import React from "react";
import { useRef, useState, useEffect } from "react";
import { get, post } from "../../../utilities";
import { drawCatCarouselCanvas } from "../../../canvasManagerCatCarousel";

/**
 * Carousel is the carousel that shows on the lobby settings page
 *
 * Proptypes
 * @param {Array} content the content to be shown on the carousel
 * @param {Object} userData to be used to find the old skin
 * @param {function} setSkin to set the skin
 * @param {Object} catFileToName object mapping cat file name to cat nickname
 * @param {Object} catNameToFile object mapping cat nickname to cat file name
 * @param {function} setUserData react setter to set user data
 */
const Carousel = (props) => {
  const carousel = useRef();
  const [carouselContent, setCarouselContent] = useState([]);
  const [currentSelection, setCurrentSelection] = useState(
    props.catFileToName[props.userData.skin]
  );
  const [startidx, setStartIdx] = useState(undefined);
  const [skinChangeError, setSkinChangeError] = useState(false);

  const [loading, setLoading] = useState(false);
  const [doneLoading, setDoneLoading] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [flashing, setFlashing] = useState(true);

  const incrementCarousel = (delta) => {
    if (carousel.current) {
      const width = carousel.current.offsetWidth;
      let x = carousel.current.scrollLeft;
      if (x >= width * (props.content.length - 1) - 100 && delta === 1) {
        carousel.current.scrollTo(0, 0);
      } else if (x <= 100 && delta === -1) {
        carousel.current.scrollTo(width * (props.content.length - 1), 0);
      } else {
        carousel.current.scrollTo(x + width * delta, 0);
      }
    }
  };

  // declare canvas references
  const canvas_ref_grey_000 = useRef(null);
  const canvas_ref_grey_001 = useRef(null);
  const canvas_ref_grey_002 = useRef(null);
  const canvas_ref_grey_tabby_000 = useRef(null);
  const canvas_ref_grey_tabby_001 = useRef(null);
  const canvas_ref_grey_tabby_002 = useRef(null);
  const canvas_ref_black_000 = useRef(null);
  const canvas_ref_black_001 = useRef(null);
  const canvas_ref_black_002 = useRef(null);
  const canvas_ref_black_003 = useRef(null);
  const canvas_ref_blue_000 = useRef(null);
  const canvas_ref_blue_001 = useRef(null);
  const canvas_ref_blue_002 = useRef(null);
  const canvas_ref_blue_003 = useRef(null);
  const canvas_ref_brown_000 = useRef(null);
  const canvas_ref_brown_001 = useRef(null);
  const canvas_ref_brown_002 = useRef(null);
  const canvas_ref_calico_000 = useRef(null);
  const canvas_ref_creme_000 = useRef(null);
  const canvas_ref_creme_001 = useRef(null);
  const canvas_ref_creme_002 = useRef(null);
  const canvas_ref_dark_000 = useRef(null);
  const canvas_ref_dark_001 = useRef(null);
  const canvas_ref_dark_002 = useRef(null);
  const canvas_ref_dark_004 = useRef(null);
  const canvas_ref_ghost_000 = useRef(null);
  const canvas_ref_gold_000 = useRef(null);
  const canvas_ref_green_000 = useRef(null);
  const canvas_ref_green_001 = useRef(null);
  const canvas_ref_orange_002 = useRef(null);
  const canvas_ref_orange_003 = useRef(null);
  const canvas_ref_orange_tabby_000 = useRef(null);
  const canvas_ref_orange_tabby_001 = useRef(null);
  const canvas_ref_pink_000 = useRef(null);
  const canvas_ref_pink_001 = useRef(null);
  const canvas_ref_radioactive_000 = useRef(null);
  const canvas_ref_red_000 = useRef(null);
  const canvas_ref_Seal_Point_000 = useRef(null);
  const canvas_ref_Seal_Point_001 = useRef(null);
  const canvas_ref_white_000 = useRef(null);
  const canvas_ref_white_grey_000 = useRef(null);
  const canvas_ref_white_grey_001 = useRef(null);
  const canvas_ref_white_grey_002 = useRef(null);
  const canvas_ref_dark_003 = useRef(null);
  const canvas_ref_clown_000 = useRef(null);
  let canvasCarouselRefMap = {};
  canvasCarouselRefMap["grey_000"] = canvas_ref_grey_000;
  canvasCarouselRefMap["grey_001"] = canvas_ref_grey_001;
  canvasCarouselRefMap["grey_002"] = canvas_ref_grey_002;
  canvasCarouselRefMap["grey_tabby_000"] = canvas_ref_grey_tabby_000;
  canvasCarouselRefMap["grey_tabby_001"] = canvas_ref_grey_tabby_001;
  canvasCarouselRefMap["grey_tabby_002"] = canvas_ref_grey_tabby_002;
  canvasCarouselRefMap["black_000"] = canvas_ref_black_000;
  canvasCarouselRefMap["black_001"] = canvas_ref_black_001;
  canvasCarouselRefMap["black_002"] = canvas_ref_black_002;
  canvasCarouselRefMap["black_003"] = canvas_ref_black_003;
  canvasCarouselRefMap["blue_000"] = canvas_ref_blue_000;
  canvasCarouselRefMap["blue_001"] = canvas_ref_blue_001;
  canvasCarouselRefMap["blue_002"] = canvas_ref_blue_002;
  canvasCarouselRefMap["blue_003"] = canvas_ref_blue_003;
  canvasCarouselRefMap["brown_000"] = canvas_ref_brown_000;
  canvasCarouselRefMap["brown_001"] = canvas_ref_brown_001;
  canvasCarouselRefMap["brown_002"] = canvas_ref_brown_002;
  canvasCarouselRefMap["calico_000"] = canvas_ref_calico_000;
  canvasCarouselRefMap["creme_000"] = canvas_ref_creme_000;
  canvasCarouselRefMap["creme_001"] = canvas_ref_creme_001;
  canvasCarouselRefMap["creme_002"] = canvas_ref_creme_002;
  canvasCarouselRefMap["dark_000"] = canvas_ref_dark_000;
  canvasCarouselRefMap["dark_001"] = canvas_ref_dark_001;
  canvasCarouselRefMap["dark_002"] = canvas_ref_dark_002;
  canvasCarouselRefMap["dark_004"] = canvas_ref_dark_004;
  canvasCarouselRefMap["ghost_000"] = canvas_ref_ghost_000;
  canvasCarouselRefMap["gold_000"] = canvas_ref_gold_000;
  canvasCarouselRefMap["green_000"] = canvas_ref_green_000;
  canvasCarouselRefMap["green_001"] = canvas_ref_green_001;
  canvasCarouselRefMap["orange_002"] = canvas_ref_orange_002;
  canvasCarouselRefMap["orange_003"] = canvas_ref_orange_003;
  canvasCarouselRefMap["orange_tabby_000"] = canvas_ref_orange_tabby_000;
  canvasCarouselRefMap["orange_tabby_001"] = canvas_ref_orange_tabby_001;
  canvasCarouselRefMap["pink_000"] = canvas_ref_pink_000;
  canvasCarouselRefMap["pink_001"] = canvas_ref_pink_001;
  canvasCarouselRefMap["radioactive_000"] = canvas_ref_radioactive_000;
  canvasCarouselRefMap["red_000"] = canvas_ref_red_000;
  canvasCarouselRefMap["Seal_Point_000"] = canvas_ref_Seal_Point_000;
  canvasCarouselRefMap["Seal_Point_001"] = canvas_ref_Seal_Point_001;
  canvasCarouselRefMap["white_000"] = canvas_ref_white_000;
  canvasCarouselRefMap["white_grey_000"] = canvas_ref_white_grey_000;
  canvasCarouselRefMap["white_grey_001"] = canvas_ref_white_grey_001;
  canvasCarouselRefMap["white_grey_002"] = canvas_ref_white_grey_002;
  canvasCarouselRefMap["dark_003"] = canvas_ref_dark_003;
  canvasCarouselRefMap["clown_000"] = canvas_ref_clown_000;

  useEffect(() => {
    addEventListener("keydown", handleKeyDown);
    addEventListener("keyup", handleKeyUp);
  }, []);

  useEffect(() => {
    // draw carousels
    for (let skin of props.content) {
      console.log(skin);
      drawCatCarouselCanvas(canvasCarouselRefMap[skin], skin, pressed);
    }
  }, [carouselContent]);

  let pressed = { up: false, down: false, left: false, right: false };
  useEffect(() => {
    let renderInterval = setInterval(() => {
      for (let skin of props.content) {
        drawCatCarouselCanvas(canvasCarouselRefMap[skin], skin, pressed);
      }
    }, 100);

    return () => {
      clearInterval(renderInterval);
    };
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      pressed.right = true;
    } else if (e.key === "ArrowLeft") {
      pressed.left = true;
    } else if (e.key === "ArrowUp") {
      pressed.up = true;
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      pressed.down = true;
      e.preventDefault();
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === "ArrowRight") {
      pressed.right = false;
    } else if (e.key === "ArrowLeft") {
      pressed.left = false;
    } else if (e.key === "ArrowUp") {
      pressed.up = false;
    } else if (e.key === "ArrowDown") {
      pressed.down = false;
    }
  };

  useEffect(() => {
    let skins = [...props.content];
    let sidx = 0;
    for (let idx in skins) {
      if (skins[idx] === props.userData.skin) {
        sidx = idx;
        console.log(sidx);
        break;
      }
    }
    setStartIdx(sidx);
    // skins = skins.slice(startidx).concat(skins.slice(0, startidx));
    // console.log(skins);
    for (let idx in skins) {
      skins[idx] = {
        // content: "../gameassets/cats/" + skins[idx] + ".png",
        content: skins[idx],
        caption: props.catFileToName[skins[idx]],
      };
    }

    setCarouselContent(
      //absolute text-3xl bottom-[1vh] left-[50%] transform -translate-x-1/2
      skins.map((slide, idx) => {
        return (
          <>
            <div
              className="flex grow shrink-0 basis-full w-[100%] relative snap-start mt-2 hover:cursor-pointer flex-col"
              onClick={() => {
                setCurrentSelection(slide.caption);
              }}
            >
              <div
                className={`flex flex-col ${
                  currentSelection === slide.caption &&
                  "border-solid rounded-xl border-blue-500 glow-pulse2"
                } mx-auto p-5`}
              >
                <div className="flex-1 w-[100%] text-center">
                  <canvas ref={canvasCarouselRefMap[slide.content]} width={320} height={320} />
                </div>
                <div className="flex-1 text-3xl mx-auto my-5 ">{slide.caption}</div>
              </div>
            </div>
          </>
        );
      })
    );
  }, [currentSelection]);

  useEffect(() => {
    if (typeof startidx !== "undefined") {
      if (carousel.current) {
        console.log("inside of scroll", startidx);
        const width = carousel.current.offsetWidth;
        const x = carousel.current.scrollLeft;
        console.log("scrollwidth", width);
        console.log("scrollx", x);
        carousel.current.scrollTo(x + width * startidx, 0);
      }
    }
  }, [startidx]);

  const handleSkinChange = (skin) => {
    if (!skinChangeError) {
      if (props.catFileToName[props.userData.skin] === skin) {
        setSkinChangeError(true);
        setTimeout(() => {
          setSkinChangeError(false);
        }, 3000);
        return;
      }
      console.log("in here");
      console.log(skin);
      const changeDisplayName = async () => {
        setLoading(true);
        try {
          console.log(props.catNameToFile);
          console.log(skin);
          console.log(props.catNameToFile[skin]);
          await post("/api/setskin", { skin: props.catNameToFile[skin] });
          const data = await get("/api/userbyid");
          props.setUserData(data);
          setLoading(false);
          setDoneLoading(true);
          props.setSkin(props.catNameToFile[skin]);
          setTimeout(() => {
            setDoneLoading(false);
          }, 3000);
        } catch (err) {
          console.log(err);
          setLoading(false);
        }
      };
      changeDisplayName();
    }
  };

  return (
    <div className="pt-10 pb-20 relative">
      <button
        className={`editfbuttons absolute right-5 top-16 z-20 ${flashing === true && "glow-pulse"}`}
        onClick={() => {
          setShowTip(true);
          setFlashing(false);
        }}
      >
        Try me!
      </button>
      <div className="border-solid h-auto relative">
        <div className=" text-[2vw] mt-4 text-center">Choose Your Avatar</div>
        <div className="text-[1.5vw] text-center my-5">
          Current selection: <span className="text-blue-600">{currentSelection}</span>
        </div>
        <div className="w-[100%] h-auto relative">
          <div
            className="absolute left-[0.5vw] z-30 w-[3vw] h-[3vw] opacity-100 border-0 top-[50%] transform -translate-y-1/2 hover:cursor-pointer"
            onClick={() => {
              incrementCarousel(-1);
            }}
          >
            <svg
              aria-hidden="true"
              className="w-[3vw] h-[3vw] text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="butt"
                stroke-linejoin="miter"
                stroke-width="4"
                d="M15 19l-6-8 6-8"
              ></path>
            </svg>
          </div>

          <div
            className="absolute right-[0.5vw] z-30 w-[3vw] h-[3vw] opacity-100 border-0 top-[50%] transform -translate-y-1/2 hover:cursor-pointer"
            onClick={() => {
              incrementCarousel(1);
            }}
          >
            <svg
              aria-hidden="true"
              className="w-[3vw] h-[3vw] text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="butt"
                stroke-linejoin="miter"
                stroke-width="4"
                d="M9 5l6 8-6 8"
              ></path>
            </svg>
          </div>

          <div
            className="flex overflow-x-scroll no-scrollbar snap-mandatory snap-x scroll-smooth pb-8"
            ref={carousel}
          >
            {carouselContent}
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        {loading && <div className="text-green-500 mx-auto mb-5">Saving avatar...</div>}
        {doneLoading && <div className="text-green-500 mx-auto mb-5 text-xl">Saved!</div>}
        {skinChangeError && (
          <div className="text-red-600 animate-shake">
            Select an avatar different from the one you already have!
          </div>
        )}

        <button
          onClick={() => {
            handleSkinChange(currentSelection);
          }}
          className="editfbuttons mx-auto w-[20%] mt-3"
        >
          Save
        </button>
        {showTip && (
          <>
            <div className="fixed bottom-[40%] left-[50%] translate-x-[-50%] w-[30%] h-[15%] text-black bg-white opacity-80 text-xl p-8">
              Try using your arrowkeys to test out the movement of each avatar!
              <div className="flex h-[40%] relative flex-col">
                {/* <img src="./assets/arrows.png" style={{ width: 500, height: 600 }} /> */}
                <div>
                  <button
                    className="editfbuttons absolute w-[5vw] bottom-0 left-[50%] transform -translate-x-1/2"
                    onClick={() => {
                      setShowTip(false);
                    }}
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Carousel;
