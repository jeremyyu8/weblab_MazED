import React from "react";
import { useRef, useState, useEffect } from "react";
import { get, post } from "../../../utilities";

/**
 * Carousel is the carousel that shows on the lobby settings page
 *
 * Proptypes
 * @param {Array} content the content to be shown on the carousel
 * @param {Object} userData to be used to find the old skin
 * @param {function} setSkin to set the skin
 */
const Carousel = (props) => {
  const carousel = useRef();
  const [carouselContent, setCarouselContent] = useState([]);
  const [currentSelection, setCurrentSelection] = useState(props.userData.skin);

  const [loading, setLoading] = useState(false);
  const [doneLoading, setDoneLoading] = useState(false);

  const incrementCarousel = (delta) => {
    if (carousel.current) {
      const width = carousel.current.offsetWidth;
      const x = carousel.current.scrollLeft;
      if (x >= width * (props.content.length - 1) - 100 && delta === 1) {
        carousel.current.scrollTo(0, 0);
      } else if (x <= 100 && delta === -1) {
        carousel.current.scrollTo(width * (props.content.length - 1), 0);
      } else {
        carousel.current.scrollTo(x + width * delta, 0);
      }
    }
  };

  useEffect(() => {
    addEventListener("keydown", handleKeyDown);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      incrementCarousel(1);
    } else if (e.key === "ArrowLeft") {
      incrementCarousel(-1);
    }
  };

  useEffect(() => {
    let skins = [...props.content];
    let startidx = 0;
    for (let idx in skins) {
      if (skins[idx] === props.userData.skin) {
        startidx = idx;
        console.log(startidx);
        break;
      }
    }
    skins = skins.slice(startidx).concat(skins.slice(0, startidx));
    console.log(skins);
    for (let idx in skins) {
      skins[idx] = {
        content: "../gameassets/cats/" + skins[idx] + ".png",
        caption: skins[idx],
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
              <div className="flex-1 w-[100%] text-center">
                <img
                  onClick={() => {}}
                  className="hover:cursor-pointer"
                  src={slide.content}
                  style={{ width: 350, height: 350 }}
                  alt="map image"
                />
              </div>
              <div className="flex-1 text-3xl mx-auto my-5 ">{slide.caption}</div>
            </div>
          </>
        );
      })
    );
  }, []);

  const handleSkinChange = (skin) => {
    console.log("in here");
    const changeDisplayName = async () => {
      setLoading(true);
      await post("/api/setskin", { skin: skin });
      setLoading(false);
      setDoneLoading(true);
      props.setSkin(skin);
      setTimeout(() => {
        setDoneLoading(false);
      }, 3000);
    };
    changeDisplayName();
  };

  return (
    <div className="pt-10 pb-20">
      <div className="border-solid h-auto">
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
            className="flex overflow-x-scroll no-scrollbar snap-mandatory snap-x scroll-smooth"
            ref={carousel}
          >
            {carouselContent}
          </div>
        </div>
      </div>

      <div className="flex flex-col mt-10">
        {loading && <div className="text-green-500 mx-auto mb-5">Saving avatar...</div>}
        {doneLoading && (
          <div className="text-green-500 mx-auto mb-5 text-xl">
            Saved! Refresh the page before joining your next game to use your new avatar.
          </div>
        )}
        <button
          onClick={() => {
            handleSkinChange(currentSelection);
          }}
          className="editfbuttons mx-auto "
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Carousel;
