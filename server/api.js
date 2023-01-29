/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// import models so we can interact with the database
const User = require("./models/user");
const Set = require("./models/set");
const Card = require("./models/card");
const Image = require("./models/image");
const Game = require("./models/game");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.post("/signupteacher", auth.signupteacher);
router.post("/signupstudent", auth.signupstudent);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }
  res.send(req.user);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user)
    socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

//our get requests
/**
 *
 */
router.get("/setmetadata", (req, res) => {
  let metadata = [];
  const setMeta = async () => {
    // console.log("inside of setMeta");
    // console.log(req.user);
    if (req.user == null) {
      console.log("user undefined");
      return;
    }
    const curUser = await User.findById(req.user._id);
    for (const setId of curUser.sets) {
      curSet = await Set.findById(setId);
      if (!curSet) continue;
      const set_metadata = {
        _id: curSet._id,
        creation_date: curSet.creation_date,
        last_modified_date: curSet.last_modified_date,
        title: curSet.title,
        size: curSet.size,
      };
      metadata.push(set_metadata);
    }
    res.send({ metadata: metadata });
  };

  setMeta();
});

router.get("/setbyid", (req, res) => {
  const findSet = async () => {
    try {
      const set = await Set.findById(req.query._id);
      let cardsInSet = [];
      for (let cardid of set.cards) {
        const card = await Card.findById(cardid);
        cardsInSet.push(card);
      }
      res.send({ title: set.title, cards: cardsInSet });
    } catch (error) {
      res.send({ err: "error" });
    }
  };
  findSet();
});

router.get("/cardbyid", (req, res) => {
  const findCard = async () => {
    const card = await Card.findById(req.query._id);
    res.send(card);
  };
  findCard();
});

router.get("/userbyid", (req, res) => {
  if (!req.user) {
    throw "not logged in";
  }
  const findUser = async () => {
    const user = await User.findById(req.user._id);
    res.send(user);
  };
  findUser();
});

// return list of games by id
router.get("/gamesbyid", (req, res) => {
  const findGames = async () => {
    try {
      const curUser = await User.findById(req.user._id);
      let games = [];
      if (curUser) {
        for (let gameid of curUser.games) {
          const curGame = await Game.findById(gameid);
          games.push(curGame);
        }
      }
      res.send(games);
      console.log("successfully retrieved games");
    } catch (err) {
      console.log(err);
    }
  };
  findGames();
});

//our post requests

/**
 * /api/setbyid modifies an existing set
 *
 * req.body
 * @param {setid} id id of the set to modify
 * @param {cards} cards list of card objects to replace whatever is currently in the set
 * cards.card._id is null if the card is new, otherwise the card is being modified
 */
router.post("/setbyid", auth.ensureLoggedIn, (req, res) => {
  console.log("inside of post set by id");
  const saveNewSet = async () => {
    const curSet = await Set.findOne({ _id: req.body.setid });
    if (!curSet) {
      console.log("error retrieving set");
      res.status(404);
      return;
    }

    let cardIds = [];

    for (const card of req.body.cards) {
      // get card to modify
      if (card._id == null) {
        const newCard = new Card({
          question: card.question,
          choices: card.choices,
          answers: card.answers,
        });
        await newCard.save();
        cardIds.push(newCard._id); //
      } else {
        const curCard = await Card.findOne({ _id: card._id });
        curCard.question = card.question;
        curCard.choices = card.choices;
        curCard.answers = card.answers;
        await curCard.save();
        cardIds.push(curCard._id);
      }
    }

    curSet.title = req.body.title;
    curSet.cards = cardIds;
    curSet.last_modified_date = Date.now();
    curSet.size = cardIds.length;
    await curSet.save();
    console.log("set updated successfully");
    res.status(200);
    res.send({});
    // res.sendStatus(200).send({ msg: "set updated successfully" });
  };

  saveNewSet();
});

/**
 * /api/newset creates a new set existing set
 *
 * req.body
 * @param {title} title title of new set
 * @param {cards} cards array of Objects, each card has keys: "question, choices, answers"
 */
router.post("/newset", auth.ensureLoggedIn, (req, res) => {
  const createNewSet = async () => {
    let cardIds = [];
    console.log("inside of new set!");
    console.log(req.body);

    for (const card of req.body.cards) {
      const newCard = new Card({
        question: card.question,
        choices: card.choices,
        answers: card.answers,
      });
      await newCard.save();
      console.log(cardIds);
      cardIds.push(newCard._id);
    }

    console.log(cardIds);
    const newSet = new Set({
      title: req.body.title,
      size: req.body.cards.length,
      cards: cardIds,
    });

    await newSet.save();

    // get current user
    const curUser = await User.findOne({ _id: req.user._id });
    curUser.sets.push(newSet._id);
    await curUser.save();
    console.log("set created successfully");
    res.status(200);
    res.send({});
    // res.sendStatus(200).send({ msg: " set created successfully" });
  };

  createNewSet();
});

// router.post("/deleteset", (req, res) => {
//   Set.deleteOne({ _id: req.body.setid }).then(() => console.log(`Delete set ${req.body.setid}`));
// });

// body: { setid: the id of the set to delete }
router.post("/deleteset", auth.ensureLoggedIn, (req, res) => {
  const deleteSet = async () => {
    const set = await Set.findById(req.body.setid);
    if (!set) {
      console.log("error retrieving set");
      res.status(404);
      res.send({});
    }

    // delete all cards in the set
    let query = { $or: [] };
    for (let cardid of set.cards) {
      query["$or"].push({ _id: cardid });
    }
    if (query["$or"].length) {
      await Card.deleteMany(query);
    }

    // get current user, remove set from user set list
    const curUser = await User.findOne({ _id: req.user._id });
    const idx = curUser.sets.indexOf(set._id);
    if (idx !== -1) {
      // in case of db errors
      curUser.sets.splice(idx, 1);
      await curUser.save();
    }

    await Set.deleteOne({ _id: set._id });

    console.log("set deleted successfully");
    res.status(200);
    res.send({});
  };

  deleteSet();
});

// router.post("/spawn", (req, res) => {
//   if (req.user) {
//     socketManager.addUserToGame(req.user);
//   }
//   res.send({});
// });

// router.post("/despawn", (req, res) => {
//   if (req.user) {
//     socketManager.removeUserFromGame(req.user);
//   }
//   res.send({});
// });

/**
 * /api/displayname modifies the displayname of a user
 *
 * req.body
 * @param {displayname} displayname the new displayname
 */
router.post("/displayname", auth.ensureLoggedIn, (req, res) => {
  const newDisplayName = async () => {
    try {
      const curUser = await User.findById(req.user._id);
      curUser.displayname = req.body.displayname;
      await curUser.save();
      res.status(200);
      res.send({});
    } catch (err) {
      console.log(err);
      res.sendStatus(404).send({ msg: "user not logged in" });
    }
  };

  newDisplayName();
});

router.post("/setskin", auth.ensureLoggedIn, (req, res) => {
  const newSkin = async () => {
    try {
      const curUser = await User.findById(req.user._id);
      curUser.skin = req.body.skin;
      await curUser.save();
      res.status(200);
      res.send({});
    } catch (err) {
      console.log(err);
      res.sendStatus(404).send({ msg: "user not logged in" });
    }
  };
  newSkin();
  console.log("skin set");
});

/**
 * /api/savegame saves all game data
 *
 * @param {gamestate} gamestate the gamestate
 */
router.post("/savegame", auth.ensureLoggedIn, (req, res) => {
  const saveNewGame = async () => {
    let gamestate = req.body.gamestate;
    try {
      // first, check if game already exists
      // if it does, don't do anything
      const curGame = await Game.findOne({ pin: gamestate["pin"] });
      if (curGame) {
        console.log("game already exists");
        res.status(200);
        res.send({});
        return;
      }

      const newGame = new Game({
        gamestate: gamestate,
        pin: gamestate["pin"],
        dateplayed: Date.now(),
      });
      await newGame.save();
      for (let _id in gamestate["players"]) {
        const curUser = await User.findById(_id);
        if (_id === gamestate["teacher"]["_id"]) {
          curUser.games.push(newGame._id);
          await curUser.save();
        } else {
          curUser.games_played += 1;
          if (gamestate["players"][_id]["rank"] === 1) {
            curUser.games_won += 1;
          }
          curUser.tags += gamestate["players"][_id]["tags"];
          curUser.tagged += gamestate["players"][_id]["numtagged"];
          await curUser.save();
        }
      }
      console.log("successfully saved game state");
      res.status(200);
      res.send({});
    } catch (err) {
      console.log(err);
      res.sendStatus(404).send({ msg: "something went wrong saving the game state" });
    }
  };

  saveNewGame();
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
