const express = require("express");
const Tasks = require("../models/tasks");
const auth = require("../middleware/auth");
const router = new express.Router();

//create task
router.post("/tasks", auth, async (req, res) => {
  const tasks = new Tasks({
    ...req.body,
    owner: req.user._id, // added user id to associate task with user
  });
  try {
    await tasks.save();
    res.status(201).send(tasks);
  } catch (error) {
    res.status(400).send(error);
  }
});

// get task of user
router.get("/tasks", auth, async (req, res) => {
  const match = { owner: req.user._id };
  const sort = {};
  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }
  try {
    await req.user.populate({
      path: "tasks",
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort,
      },
    });
    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

//Get task by id
router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Tasks.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send(`Task with id ${_id} not found`);
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update Task
router.patch("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  const payload = req.body;
  const updateKeys = Object.keys(payload);
  try {
    const task = await Tasks.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send("Task not found");
    }
    updateKeys.forEach((updates) => (task[updates] = payload[updates]));
    task.save();
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete Task
router.delete("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Tasks.findOneAndDelete({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send("Task not found");
    }
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
