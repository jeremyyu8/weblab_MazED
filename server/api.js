/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");
const Set = require("./models/set");
const Card = require("./models/card");

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
  const metadata = [];
  const setMeta = async () => {
    console.log("inside of setMeta");
    console.log(req.user);
    if (req.user == null) {
      console.log("user undefined");
      return;
    }
    const curUser = await User.findById(req.user._id);
    curUser.sets.forEach(async (setId) => {
      curSet = await Set.findById(setId);
      const set_metadata = {
        _id: curSet._id,
        creation_date: curSet.creation_date,
        last_modified_date: curSet.last_modified_date,
        title: curSet.title,
        size: curSet.size,
      };
      metadata.push(set_metadata);
    });
    res.send({ metadata: metadata });
  };

  setMeta();
});

router.get("/setbyid", (req, res) => {
  Set.findById(req.query._id).then((set) => {
    res.send(set);
  });
});

router.get("/cardbyid", (req, res) => {
  Card.findById(req.query._id).then((card) => {
    res.send(card);
  });
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
  const saveNewSet = async () => {
    const curSet = await Set.findOne({ _id: req.body.setid });
    const cardIds = [];

    req.body.cards.forEach(async (card) => {
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
    });

    curSet.cards = cardIds;
    curSet.last_modified_date = Date.now;
    curSet.size = cardIds.length;
    await curSet.save();
    console.log("set updated successfully");
    res.send(200);
  };

  saveNewSet();
});

/**
 * /api/newset creates a new set existing set
 *
 * req.body
 * @param {userid} _id id of the set to modify
 * @param {set} set an object holding title and cards of the new set
 */
router.post("/newset", auth.ensureLoggedIn, (req, res) => {
  const createNewSet = async () => {
    const cardIds = [];

    req.body.cards.forEach(async (card) => {
      // get card to modify
      const newCard = new Card({
        question: card.question,
        choices: card.choices,
        answers: card.answers,
      });
      await newCard.save();
      cardIds.push(newCard._id); //
    });

    const newSet = new Set({
      title: req.body.set.title,
      size: req.body.set.cards.length,
      cards: cardIds,
    });

    await newSet.save();

    // get current user
    const curUser = User.findOne({ _id: req.user._id });
    curUser.sets.push(newSet._id);
    await curUser.save();
    console.log("set created successfully");
    res.send(200);
  };

  createNewSet();
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
