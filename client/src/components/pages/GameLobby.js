import React from "react";
import Phaser from "phaser";
import { IonPhaser } from "@ion-phaser/react";

const GameLobby = () => {
  //phaser
  const game = {
    width: "100%",
    height: "100%",
    type: Phaser.AUTO,
    scene: {
      init: function () {
        this.cameras.main.setBackgroundColor("#24252A");
      },
      create: function () {
        this.helloWorld = this.add.text(
          this.cameras.main.centerX,
          this.cameras.main.centerY,
          "Hello World",
          {
            font: "40px Arial",
            fill: "#ffffff",
          }
        );
        this.helloWorld.setOrigin(0.5);
      },
      update: function () {
        this.helloWorld.angle += 1;
      },
    },
  };

  return (
    <div className="flex justify-center">
      <div className="border-solid w-[50%] border-green-600 h-[50%] absolute top-11 z-10 bg-white">
        Game Lobby
      </div>
      <div className="fixed t-0">
        <IonPhaser path="/game" game={game} />
      </div>
    </div>
  );
};

export default GameLobby;
