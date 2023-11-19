const express = require("express");
require("./db/mongoose");
const Tasks = require("./models/tasks");
const userRouter = require("./routes/user");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);

app.post("/tasks", async (req, res) => {
  const tasks = new Tasks(req.body);
  try {
    await tasks.save();
    res.status(201).send(tasks);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Tasks.find({});
    res.send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/tasks/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Tasks.findById(_id);
    if (!task) {
      return res.status(404).send(`Task with id ${_id} not found`);
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.patch("/tasks/:id", async (req, res) => {
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

app.delete("/tasks/:id", async (req, res) => {
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

app.listen(PORT, () => console.log("App listening at PORT 3000"));
