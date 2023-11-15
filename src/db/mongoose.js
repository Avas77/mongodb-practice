const mongoose = require("mongoose");
const uri =
  "mongodb+srv://AvasBajra:notmycupoftea123@task-manager.vsf6qyq.mongodb.net/task-manager-api?retryWrites=true&w=majority";

mongoose.connect(uri);

const Tasks = mongoose.model("Tasks", {
  description: {
    type: String,
  },
  completed: {
    type: Boolean,
  },
});

const newTask = new Tasks({
  description: "Go to Office",
  completed: false,
});

newTask
  .save()
  .then(() => console.log(newTask))
  .catch((err) => console.log("Error", err));
