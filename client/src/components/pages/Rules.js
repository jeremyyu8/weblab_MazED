import React, { useState, useEffect } from "react";
import { Redirect } from "@reach/router";
import InternalLink from ".//InternalLink";

// module imports
import Navbar from "../modules/Navbar";
import Card from "./Card.js";

const Rules = (props) => {
  return (
    <>
      <Navbar blank={true} />
      <div className="h-[75px]"></div>
      <div className="background h-auto">
        <div class="rounded-3xl text-blue-200 bg-black bg-opacity-60 px-16 py-10 shadow-lg max-sm:px-8 flex flex-col justify-center h-[80%] w-[85%] pt-2">
          <div className="pagetitle mt-6 mb-0 text-center p-2 text-6xl">How to Play</div>
          <div
            onClick={() => {
              window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
            }}
            className="top m-1 p-1 text-center text-xl hover:cursor-pointer underline text-blue-600 hover:text-blue-400"
          >
            Jump to Game Mode Descriptions
          </div>

          <div>
            <div className="flex flex-wrap justify-evenly pb-8">
              <Card
                title="Moving Around"
                text="Use the arrow keys to move your character around."
              ></Card>
              <div className="flex content-center p-4 mt-8 text-[3vw] xl:w-1/3 md:w-1/3 md:text-[1.5vw] w-7/12">
                <img
                  src="../assets/playeringame.png"
                  className="object-contain h-auto max-w-full"
                ></img>
              </div>
            </div>
          </div>
          <div>
            <div className="flex flex-wrap justify-evenly pb-8">
              <div className="flex content-center p-4 mt-8 text-[3vw] xl:w-1/3 md:w-1/3 md:text-[1.5vw] w-7/12">
                <img
                  src="../assets/answerquestion.png"
                  className="object-contain h-auto max-w-full"
                ></img>
              </div>
              <Card
                title="Earning Tokens"
                text="Click the answer question in the bottom left. Answer a question correctly to earn +100 tokens. Beware, answering a question incorrectly is -100 tokens!"
              ></Card>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap justify-evenly pb-8">
              <Card
                title="Upgrading"
                text="Players' speed and power can be upgraded using tokens in the top left corner of the game screen"
              ></Card>
              <div className="flex content-center p-4 mt-8 text-[3vw] xl:w-1/3 md:w-1/3 md:text-[1.5vw] w-7/12">
                <img src="../assets/upgrade.png" className="object-contain h-auto max-w-full"></img>
              </div>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap justify-evenly pb-8">
              <div className="flex content-center p-4 mt-8 text-[3vw] xl:w-1/3 md:w-1/3 md:text-[1.5vw] w-7/12">
                <img src="../assets/barrier.png" className="object-contain h-auto max-w-full"></img>
              </div>
              <Card
                title="Barriers"
                text="Barriers may block important sections of the maze. Players must pay a certain amount of tokens to remove barriers blocking their path."
              ></Card>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap justify-evenly pb-8">
              <Card
                title="Tagging"
                text="Tagging occurs when two players run into each other. The player with less power will be frozen in place for 5 seconds and then must answer 3 questions correctly to become untagged, after which they are granted a short invincibility period. If two players have the same power level, both will be tagged."
              ></Card>
              <div className="flex content-center p-4 mt-8 text-[3vw] xl:w-1/3 md:w-1/3 md:text-[1.5vw] w-7/12">
                <img src="../assets/tagged.png" className="object-contain h-auto max-w-full"></img>
              </div>
            </div>
          </div>
          <div>
            <div className="flex flex-wrap justify-evenly pb-8">
              <div className="flex content-center p-4 mt-8 text-[3vw] xl:w-1/3 md:w-1/3 md:text-[1.5vw] w-7/12">
                <img src="../assets/barrier.png" className="object-contain h-auto max-w-full"></img>
              </div>
              <Card
                title="Levels"
                text="A game may have multiple levels of mazes. Players must reach the end of a maze to advance to the next level through a portal. The first maze of each game is singleplayer."
              ></Card>
            </div>
          </div>
        </div>
      </div>

      <div id="section-1" className="background h-[120vh]">
        <div class="sheerbox h-[80%] w-[85%] mt-[6%]">
          <div className="pagetitle mt-12 text-center h-[20%]">Game Mode Rules</div>
          <div class="flex flex-wrap justify-evenly mt-8">
            <div class="p-2 text-[3vw] xl:w-1/4 w-7/12 h-[90%] md:w-1/3 md:text-[1.5vw]">
              <div class="bg-blue-900 border-solid border-8 border-blue-200 h-full rounded-lg mb-6 flex flex-col relative overflow-hidden shadow-xl hover:scale-110 transition duration-300 ease-in-out">
                <div class="px-3 py-4 pb-6">
                  <div class="text-blue-500 text-3xl text-bold mb-2 text-center font-bold">
                    Individual
                  </div>
                  <ul class="list-disc text-blue-400">
                    <li className="my-4">Solve mazes in a race to the end</li>
                    <li className="my-4">Answer questions correctly to earn tokens</li>
                    <li className="my-4">
                      Spend tokens on upgrading player speed and power, also unlock key barriers in
                      the maze
                    </li>
                    <li className="my-4">
                      Players can tag and freeze other players with less power! Tagged players must
                      answer three questions correctly to continue playing.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="p-2 text-[3vw] xl:w-1/4 w-7/12 h-[90%] md:w-1/3 md:text-[1.5vw]">
              <div class="bg-blue-900 border-solid border-8 border-blue-200 h-full rounded-lg mb-6 flex flex-col relative overflow-hidden shadow-xl hover:scale-110 transition duration-300 ease-in-out">
                <div class="px-3 py-4 pb-6">
                  <div class="text-blue-500 text-3xl text-bold mb-2 text-center font-bold">
                    Team
                  </div>
                  <ul class="list-disc text-blue-400 ">
                    <li className="my-4">Players randomly assigned into 2 teams</li>
                    <li className="my-4">
                      Team with higher average level at the end of the game wins
                    </li>
                    <li className="my-4">
                      Ties are broken by the total number of tags by each team, then the total
                      finish time of last completed level of every team member
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="p-2 text-[3vw] xl:w-1/4 w-7/12 h-[90%] md:w-1/3 md:text-[1.5vw]">
              <div class="bg-blue-900 border-solid border-8 border-blue-200 h-full rounded-lg mb-6 flex flex-col relative overflow-hidden shadow-xl hover:scale-110 transition duration-300 ease-in-out">
                <div class="px-3 py-4 pb-6">
                  <div class="text-blue-500 text-3xl text-bold mb-2 text-center font-bold">
                    Infection
                  </div>
                  <ul class="list-disc text-blue-400 ">
                    <li className="my-4">1 player randomly chosen as "infected"</li>
                    <li className="my-4">
                      "Infected" player starts with upgraded stats:
                      <ul>
                        <li>power +5</li>
                        <li>speed +3</li>
                        <li>tokens +1000</li>
                        <li>level +1</li>
                      </ul>
                    </li>
                    <li className="my-4">
                      "Infected" team wins if they tag every other player, which also infects them
                    </li>
                    <li className="my-4">
                      "Infected" team loses when any player reaches the end of the final maze
                      without being tagged
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Rules;
