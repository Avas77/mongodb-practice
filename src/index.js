const express = require("express");
require("./db/mongoose");
const User = require("./models/user");
const Tasks = require("./models/tasks");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post("/user", (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then(() => res.status(201).send(user))
    .catch((err) => res.status(400).send(err));
});

app.get("/user", (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((e) => res.status(500).send(e));
});

app.get("/user/:id", (req, res) => {
  const _id = req.params.id;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not found");
      }
      return res.send(user);
    })
    .catch((e) => res.status(500).send(e));
});

app.post("/tasks", (req, res) => {
  const tasks = new Tasks(req.body);
  console.log({ tasks });
  tasks
    .save()
    .then(() => res.status(201).send(tasks))
    .catch((err) => res.status(400).send(err));
});

app.get("/tasks", (req, res) => {
  Tasks.find({})
    .then((tasks) => res.send(tasks))
    .catch((e) => res.status(500).send(e));
});

app.get("/tasks/:id", (req, res) => {
  const _id = req.params.id;
  Tasks.findById(_id)
    .then((task) => {
      if (!task) {
        return res.status(404).send(`Task with id ${_id} not found`);
      }
      return res.send(task);
    })
    .catch((err) => res.status(500).send(err));
});

app.listen(PORT, () => console.log("App listening at PORT 3000"));
