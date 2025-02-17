require("dotenv").config(); 
const { Router } = require("express"); // import Router from express
const UserProfile = require("../models/user_profile"); // import UserProfile model
const { isLoggedIn } = require("./middleware"); // import isLoggedIn custom middleware
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken"); 

const router = Router();

router.get("/", isLoggedIn, async (req, res) => {
  const { email } = req.user; // get email from req.user property created by isLoggedIn middleware
  //send all profileInfo with that user
  res.json(
    await UserProfile.find({ email }).catch((error) =>
      res.status(400).json({ error })
    )
  );
});

// Show Route with isLoggedIn middleware
router.get("/:id", isLoggedIn, async (req, res) => {
  const { email } = req.user; // get email from req.user property created by isLoggedIn middleware
  const _id = req.params.id; // get id from params
  //send target UserProfile
  res.json(
    await UserProfile.findOne({ email, _id }).catch((error) =>
      res.status(400).json({ error })
    )
  );
});

// create Route with isLoggedIn middleware
router.post("/", isLoggedIn, async (req, res) => {
  const { email } = req.user; // get email from req.user property created by isLoggedIn middleware
  req.body.email = email; // add email property to req.body
  //create new UserProfile and send it in response
  res.json(
    await UserProfile.create(req.body).catch((error) =>
      res.status(400).json({ error })
    )
  );
});

// update Route with isLoggedIn middleware
router.put("/:id", isLoggedIn, async (req, res) => {
  const { email } = req.user; // get email from req.user property created by isLoggedIn middleware
  req.body.email = email; // add email property to req.body
  const _id = req.params.id;
  //update UserProfile with same id if belongs to logged in User
  res.json(
    await UserProfile.updateOne({ email, _id }, req.body, { new: true }).catch(
      (error) => res.status(400).json({ error })
    )
  );
});

// update Route with isLoggedIn middleware
router.delete("/:id", isLoggedIn, async (req, res) => {
  const { email } = req.user; // get email from req.user property created by isLoggedIn middleware
  const _id = req.params.id;
  //remove UserProfile with same id if belongs to logged in User
  res.json(
    await UserProfile.remove({ email, _id }).catch((error) =>
      res.status(400).json({ error })
    )
  );
});

module.exports = router