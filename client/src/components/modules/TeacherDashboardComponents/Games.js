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
            <div class="sheerbox">
              <div className="flex mt-8">
                <div className="text-5xl text-blue-200 my-auto">Past Games</div>
              </div>
              <div className="overflow-y-auto overflow-x-hidden max-w-[95%] px-6 mx-auto mt-[2vw] mb-[6vw] rounded-xl h-[70vh]">
                {games.length ? (
                  games
                ) : (
                  <>
                    <div className="text-xl text-blue-300 text-center mt-[35vh]">
                      No past games to display
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
