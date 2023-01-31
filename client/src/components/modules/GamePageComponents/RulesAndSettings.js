import React, { useEffect, useState } from "react";

/**
 * rules and settings pop-up inside of game lobby
 *
 * @param {function} setShowRules setter for prop showRules
 * @param {String} gameMode the game mode
 * @param {Boolean} hitboxes whether or not hitboxes are enabled
 * @param {userData} userData
 */
const RulesAndSettings = (props) => {
  const [tip, setTip] = useState("");
  const [rules, setRules] = useState("");
  const [settings, setSettings] = useState(false);

  let files = [
    "grey_000",
    "grey_001",
    "grey_002",
    "grey_tabby_000",
    "grey_tabby_001",
    "grey_tabby_002",
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
    "creme_000",
    "creme_001",
    "creme_002",
    "dark_000",
    "dark_001",
    "dark_002",
    "dark_004",
    "ghost_000",
    "gold_000",
    "green_000",
    "green_001",
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
    "dark_003",
    "clown_000",
  ];

  let names = [
    "Tawny",
    "Buttercup",
    "Snowball",
    "Rascal",
    "Peanut",
    "Nala",
    "Shadow",
    "Whiskers",
    "Jasper",
    "Casper",
    "Cleo",
    "Scaredy",
    "Oreo",
    "Simba",
    "Marmalade",
    "Felix",
    "Willow",
    "Spooky",
    "Zippy",
    "Chirpy",
    "Salem",
    "Luna",
    "Tuxedo",
    "Tabby",
    "Twix",
    "Witty",
    "Tilly",
    "Tiger",
    "Tiger Lily",
    "Zorro",
    "Tortie",
    "Coco",
    "Mittens",
    "Socks",
    "Zoey",
    "Rusty",
    "Tumble",
    "Spot",
    "Smokey",
    "Oscar",
    "Simba",
    "Smokey",
    "Tiger",
    "KChoi",
    "NTsao",
  ];

  let catFileToName = {};
  for (let idx = 0; idx < files.length; idx++) {
    catFileToName[files[idx]] = names[idx];
  }

  let tips = [
    "press 'h' to toggle the hitboxes of other players",
    "tagged cats always sit",
    "after getting un-tagged, you have a 5 second invincibility period to escape your surroundings",
    "questions that you answer incorrectly will be given to you more frequently",
    "the cost for upgrading power and speed scales linearly",
    "the odds of hitting quads by the river given that you flop a set are approximately 4.7%",
    "the further you progress throughout the mazes, the more difficult they will get",
  ];

  useEffect(() => {
    console.log(props);
    setTip(getRandomTip());
  }, []);

  useEffect(() => {
    if (props.gameMode === "individual") {
      setRules(
        <>
          <div className="text-2xl">
            - Use the <span className="text-blue-700">arrow keys</span> to move!
            <br />
            <br />- You will be presented with a series of mazes once the game begins.{" "}
            <span className="text-blue-700">Solve every maze first to win!</span>
            <br />
            <br />- All mazes after the first are <span className="text-blue-700">multiplayer</span>
            , where you can <span className="text-blue-700">tag and get tagged</span> by other
            players!
            <br />
            <br />- Answer questions correctly to <span className="text-blue-700">earn tokens</span>
            ; spend them on upgrading stats and unlocking barriers in the maze
          </div>
        </>
      );
      /*At the start of the game, you will be assigned to either the red or blue team. 
      Your goal is to work together with your team to get through the mazes as quickly as possible. 
      Players on opposing teams may tag each other, so be on the lookout! 
      The team with the furthest average progress across all team members wins the game."
*/
    } else if (props.gameMode === "team") {
      setRules(
        <>
          <div className="text-2xl">
            - Use the <span className="text-blue-700">arrow keys</span> to move!
            <br />
            <br />- You will be presented with a series of mazes once the game begins. You will also
            be assigned to the<span className="text-red-700"> red </span> or{" "}
            <span className="text-blue-700">blue</span> team
            <br />
            <br />- Work with your team to get through the mazes. The team with furthese average
            progress will <span className="text-blue-700"></span>win the game!
            <br />
            <br />- All mazes after the first are <span className="text-blue-700">multiplayer</span>
            , where you can <span className="text-blue-700">tag players on the opposing team!</span>
            <br />
            <br />- Answer questions correctly to <span className="text-blue-700">earn tokens</span>
            ; spend them on upgrading stats and unlocking barriers in the maze
          </div>
        </>
      );
      /*"At the start of the game, one person will be assigned to be 'infected'. This person will start with higher speed, power, and tokens, and will also start one level ahead of everyone else. 
      Their goal is to tag everyone before they can finish the mazes. 
      The goal for everyone else is to complete the mazes. But be careful: infection spreads!"
       */
    } else if (props.gameMode === "infection") {
      setRules(
        <>
          <div className="text-2xl">
            - Use the <span className="text-blue-700">arrow keys</span> to move!
            <br />
            <br />- You will be presented with a series of mazes once the game begins. One player in
            the game will also be assigned as <span className="text-red-700">infected</span>
            <br />
            <br />- The <span className="text-red-700">infected</span> player starts with higher
            stats and will begin start one maze ahead of everyone
            <br />
            <br />- If any player reaches the end without being infected,{" "}
            <span className="text-blue-700">they win!</span>
            <br />
            <br />- If the infected player tags everyone, it's{" "}
            <span className="text-blue-700">game over</span>
            <br />
            <br />- Be careful. <span className="text-red-700">Infection spreads</span>
          </div>
        </>
      );
    }
  }, [props.gameMode]);

  const getRandomTip = () => {
    console.log("getting random tip");
    let idx = Math.floor(Math.random() * tips.length);
    return tips[idx];
  };

  return (
    <>
      <div className="bg-white bg-opacity-70 fixed z-30 h-auto w-[55vw] h-max-[80%] top-[50%] transform translate-y-[-50%] left-[50%] translate-x-[-50%] overflow-y-scroll no-scrollbar p-10">
        <div className="text-3xl text-center p-8">
          Game mode: <span className="text-blue-600">{props.gameMode}</span>
        </div>
        {!settings && (
          <>
            <div className="flex justify-between">
              <div className="text-2xl text-blue-700 px-8">Rules:</div>
              <div>
                <button
                  className="font-Ubuntu cursor-pointer hover:bg-blue-200 transition-all p-2 text-center mx-8"
                  onClick={() => {
                    setSettings(!settings);
                  }}
                >
                  {settings ? "Rules" : "Settings"}
                </button>
              </div>
            </div>
            <div className="text-xl p-4 px-8">{rules}</div>
            <div className="text-md text-blue-500 p-4 px-8">Random tip: {tip}</div>
          </>
        )}
        {settings && (
          <>
            <div className="flex justify-between">
              <div className="text-2xl text-blue-700 px-8">Settings:</div>
              <div>
                <button
                  className="font-Ubuntu cursor-pointer hover:bg-blue-200 transition-all text-center mx-8"
                  onClick={() => {
                    setSettings(!settings);
                  }}
                >
                  {settings ? "Rules" : "Settings"}
                </button>
              </div>
            </div>
            {props.userData && props.userData.role === "student" && (
              <>
                <div className="text-xl pt-4 px-8">
                  You are: <span className="text-blue-600">{props.userData.name}</span>
                </div>
                <div className="text-xl pt-4 pb-0 px-8">
                  Skin: <span className="text-blue-600">{catFileToName[props.userData.skin]}</span>
                </div>
                <div className="text-sm px-8">
                  {"This can be customized in your user settings page"}
                </div>
              </>
            )}
            {props.userData && props.userData.role === "teacher" && (
              <>
                <div className="text-xl p-4 px-8 pb-0">
                  You are: <span className="text-blue-600">{props.userData.name}</span>
                </div>
                <div className="text-xl pt-0 p-4 px-8">You are the owner of this lobby!</div>
              </>
            )}
            <div className="text-xl pt-4 pb-0 px-8">
              Hitboxes:{" "}
              {props.hitboxes ? (
                <span className="text-green-600">Enabled</span>
              ) : (
                <span className="text-red-600">Disabled</span>
              )}
            </div>
            <div className="text-sm px-8 pb-8">{"press 'h' to toggle hitboxes"}</div>
          </>
        )}
        <div className="flex justify-center p-4">
          <button
            className="font-Ubuntu w-[25%] cursor-pointer hover:bg-blue-200 p-2 transition-all"
            onClick={() => props.setShowRules(false)}
          >
            close
          </button>
        </div>
      </div>
    </>
  );
};

export default RulesAndSettings;
