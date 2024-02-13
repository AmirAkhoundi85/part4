const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

usersRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
  });
  res.status(200).send(users);
});
usersRouter.post("/", async (req, res) => {
  let { name, username, password } = req.body;
  const saltRound = 10;

  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }
  if (password.length < 3) {
    return res
      .status(400)
      .json({ error: "Password must have at least 3 characters" });
  }

  const passwordHash = bcrypt.hashSync(password, saltRound);
  const newUser = User({
    name,
    username,
    password: passwordHash,
  });
  await newUser.save();
  res.status(201).json(newUser);
});

module.exports = usersRouter;
