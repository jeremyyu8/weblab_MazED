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
    } else if (idx === 2) {
      props.setGameMode("infection");
    } else {
      props.setGameMode("individual");
    }
  };

  useEffect(() => {
    setCarouselContent(
      props.content.map((slide, idx) => {
        return (
          <>
            <div
              className="flex grow shrink-0 basis-full h-auto w-[100%] relative snap-start"
              onClick={() => handleOnClick(idx)}
            >
              <div className="w-[100%] text-center mb-8">
                <img src={slide.content} style={{ width: 250, height: 250 }} alt="map image" />
              </div>
              <div className="absolute text-3xl bottom-[2vh] left-[50%] transform -translate-x-1/2">
                {slide.caption}
              </div>
            </div>
          </>
        );
      })
    );
  }, []);

  return (
    <>
      <div className="border-solid">
        <div className="w-[100%] h-auto text-4xl mt-4 text-center">Game Mode</div>
        <div className="w-[100%] h-auto text-xl text-center">
          Currently selected: <span className="text-blue-600">{props.gameMode}</span>
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
