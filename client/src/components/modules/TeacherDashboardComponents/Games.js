import React, { useState, useEffect } from "react";
import Game from "./Game";

/**
 * Games page inside of teacher dashboard
 *
 * Proptypes
 * @param {Array} games array of past games to render
 */
const Games = (props) => {
  const [redirect, setRedirect] = useState(false);
  const [games, setGames] = useState(false);

  useEffect(() => {
    setGames(
      props.games
        .map((game, idx) => {
          return <Game key={idx} datePlayed={game.dateplayed} gameState={game.gamestate} />;
        })
        .reverse()
    );
    console.log(props.games);
  }, []);

  //   getGames();
  // }, [props.userData]);

  return (
    <>
      {redirect ? (
        <Redirect from="/teacher" to={redirect} />
      ) : (
        <>
          <div className="background">
            <div class="sheerbox w-[70%]">
              <div className="flex mt-10">
                <div className="pagetitle text-5xl text-blue-200 my-auto">Past Games</div>
              </div>
              <div className="text-3xl text-blue-200 my-5">{games.length} games</div>
              <div className="overflow-y-auto overflow-x-hidden max-w-[95%] px-6 mx-auto mb-[6vw] rounded-xl h-[70vh]">
                {games.length ? (
                  games
                ) : (
                  <>
                    <div className="text-xl text-blue-300 text-center absolute top-[50%] left-[15%] w-[70%] transform -translate-y-1/2">
                      No past games to display. After playing games with your students, come back to
                      this page to analyze student performance!
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Games;
