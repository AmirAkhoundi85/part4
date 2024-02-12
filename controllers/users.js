const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

usersRouter.get("/", async (req, res) => {
  const users= await User.find({})
  res.status(200).send(users);
});
usersRouter.post("/", async (req, res) => {
  let { name, username, password } = req.body;
  const saltRound = 10;
  const passwordHash = bcrypt.hashSync(password, saltRound);

  const newUser = User({
    name,
    username,
    password: passwordHash,
  });
  await newUser.save();
  res.status(201).json(newUser);
});

module.exports = usersRouter