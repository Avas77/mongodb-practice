const mongoose = require("mongoose");
const validator = require("validator");
const uri =
  "mongodb+srv://AvasBajra:notmycupoftea123@task-manager.vsf6qyq.mongodb.net/task-manager-api?retryWrites=true&w=majority";

mongoose.connect(uri);

const Tasks = mongoose.model("Tasks", {
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});
