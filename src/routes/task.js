const express = require("express");
const Tasks = require("../models/tasks");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
  const tasks = new Tasks({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await tasks.save();
    res.status(201).send(tasks);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Tasks.find({});
    res.send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

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

router.patch("/tasks/:id", async (req, res) => {
  const _id = req.params.id;
  const payload = req.body;
  try {
    const task = await Tasks.findByIdAndUpdate(_id, payload, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      return res.status(404).send("Task not found");
    }
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/tasks/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Tasks.findByIdAndDelete(_id);
    if (!task) {
      return res.status(404).send("Task not found");
    }
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
