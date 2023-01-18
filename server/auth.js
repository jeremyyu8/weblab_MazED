const { OAuth2Client } = require("google-auth-library");
const User = require("./models/user");
const socketManager = require("./server-socket");

// create a new OAuth client used to verify google sign-in
//    TODO: replace with your own CLIENT_ID
const CLIENT_ID = "810136167494-687miqucn5faftjcgheo691e8n1pddti.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

// accepts a login token from the frontend, and verifies that it's legit
function verify(token) {
  return client
    .verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    })
    .then((ticket) => ticket.getPayload());
}

// gets user from DB, or makes a new teacher account if it doesn't exist yet
function getOrCreateUserTeacher(user) {
  // the "sub" field means "subject", which is a unique identifier for each user
  return User.findOne({ googleid: user.sub }).then((existingUser) => {
    if (existingUser) return existingUser;

    const newUser = new User({
      name: user.name,
      googleid: user.sub,
      role: "teacher",
    });

    return newUser.save();
  });
}

// gets user from DB, or makes a new student account if it doesn't exist yet
function getOrCreateUserStudent(user) {
  // the "sub" field means "subject", which is a unique identifier for each user
  return User.findOne({ googleid: user.sub }).then((existingUser) => {
    if (existingUser) return existingUser;

    const newUser = new User({
      name: user.name,
      googleid: user.sub,
      role: "student",
    });

    return newUser.save();
  });
}

function getUser(user) {
  // the "sub" field means "subject", which is a unique identifier for each user
  return User.findOne({ googleid: user.sub }).then((existingUser) => {
    console.log("I am inside of getUser");
    if (existingUser) return existingUser;
    else {
      console.log("I found an error inside of getUser");
      throw "User not found. Create a new account at the /signup route!";
    }
  });
}

// regular log in request.
// if the user does not exist, the user is asked to sign up instead

function login(req, res) {
  verify(req.body.token)
    .then((user) => getUser(user))
    .then((user) => {
      // persist user in the session
      req.session.user = user;
      res.send(user);
    })
    .catch((err) => {
      console.log(`Failed to log in: ${err}`);
      res.status(401).send({ err });
    });
}

// sign up as a new teacher account. if this is requested
// and an account (teacher/student) already exists, that account is logged in

function signupteacher(req, res) {
  verify(req.body.token)
    .then((user) => getOrCreateUserTeacher(user))
    .then((user) => {
      // persist user in the session
      req.session.user = user;
      res.send(user);
    })
    .catch((err) => {
      console.log(`Failed to log in: ${err}`);
      res.status(401).send({ err });
    });
}

// sign up as a new student account. if this is requested
// and an account (teacher/student) already exists, that account is logged in

function signupstudent(req, res) {
  verify(req.body.token)
    .then((user) => getOrCreateUserStudent(user))
    .then((user) => {
      // persist user in the session
      req.session.user = user;
      res.send(user);
    })
    .catch((err) => {
      console.log(`Failed to log in: ${err}`);
      res.status(401).send({ err });
    });
}

function logout(req, res) {
  req.session.user = null;
  res.send({});
}

function populateCurrentUser(req, res, next) {
  // simply populate "req.user" for convenience
  req.user = req.session.user;
  next();
}

function ensureLoggedIn(req, res, next) {
  if (!req.user) {
    return res.status(401).send({ err: "not logged in" });
  }

  next();
}

module.exports = {
  login,
  logout,
  signupteacher,
  signupstudent,
  populateCurrentUser,
  ensureLoggedIn,
};
