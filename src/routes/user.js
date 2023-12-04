const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const multer = require("multer");
const router = new express.Router();

const upload = multer({
  dest: "images",
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
      return cb(new Error("Please upload an image"));
    }
    cb(undefined, true);
  },
});

//Create a user
router.post("/user", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get Current logged in User
router.get("/user", auth, async (req, res) => {
  res.send(req.user);
});

// Get User By Id
router.get("/user/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

//Update details about current looged in user
router.patch("/user/me", auth, async (req, res) => {
  const payload = req.body;
  const updates = Object.keys(payload);
  try {
    updates.forEach((update) => (req.user[update] = payload[update]));
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// delete current logged in user
router.delete("/user/me", auth, async (req, res) => {
  try {
    await req.user.deleteOne({});
    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// user login
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      // find user in db
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken(); //generate new token for user login
    res.send({ user, token });
  } catch (error) {
    res.status(400).send();
  }
});

//user logout
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      //remove the token of the currently logged in user
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.post(
  "/users/me/avatar",
  upload.single("avatar"),
  (req, res) => {
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({
      error: error.message,
    });
  }
);

module.exports = router;
