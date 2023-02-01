import React from "react";
import { useRef, useState, useEffect } from "react";

/**
 * Carousel is the carousel that shows on the lobby settings page
 *
 * Proptypes
 * @param {Array} content the content to be shown on the carousel
 * @param {function} setGameMode set game mode
 * @param {String} gameMode the currently selected game mode
 */
const Carousel = (props) => {
  const carousel = useRef();
  const [carouselContent, setCarouselContent] = useState([]);
  const [curIdx, setCurIdx] = useState(0);

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

  const handleOnClick = (idx) => {
    if (idx === 1) {
      props.setGameMode("team");
      setCurIdx(1);
      console.log("setting");
    } else if (idx === 2) {
      props.setGameMode("infection");
      setCurIdx(2);
    } else {
      props.setGameMode("individual");
      setCurIdx(0);
    }
  };

  //absolute text-3xl bottom-[2vh] left-[50%] transform -translate-x-1/2

  useEffect(() => {
    setCarouselContent(
      props.content.map((slide, idx) => {
        return (
          <>
            <div
              className="flex grow shrink-0 basis-full h-auto w-[50%] relative snap-start hover:cursor-pointer py-10"
              onClick={() => handleOnClick(idx)}
            >
              <div
                className={`flex flex-col ${
                  curIdx === idx && "border-solid rounded-xl border-blue-500 glow-pulse2"
                } mx-auto p-10`}
              >
                <img
                  className="mx-auto mb-8"
                  src={slide.content}
                  style={{ height: 200 }}
                  alt="map image"
                />
                <div className="text-3xl mx-auto">{slide.caption}</div>
              </div>
            </div>
          </>
        );
      })
    );
  }, [curIdx]);

  return (
    <>
      <div className="border-t-4 border-t-blue-200 border-solid border-l-0 border-r-0 border-b-0">
        <div className="w-[100%] h-auto text-4xl mt-4 text-center">Game Mode</div>
        <div className="w-[100%] h-auto text-xl text-center">
          Current selection: <span className="text-blue-600">{props.gameMode}</span>
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
    </>
  );
};

export default Carousel;
