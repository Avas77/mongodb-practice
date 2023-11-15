const mongoose = require("mongoose");
const validator = require("validator");
const uri =
  "mongodb+srv://AvasBajra:notmycupoftea123@task-manager.vsf6qyq.mongodb.net/task-manager-api?retryWrites=true&w=majority";

mongoose.connect(uri);

const User = mongoose.model("User", {
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    trim: true,
    validate(value) {
      if (value.includes("password")) {
        throw new Error("Password cannot be passowrd");
      }
    },
  },
  age: {
    type: Number,
  },
});

const me = new User({
  name: "Andrew",
  email: "test@gmail.com",
  password: "babulalmishra",
});

me.save()
  .then(() => console.log(me))
  .catch((err) => console.log("Error", err));

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

const newTask = new Tasks({
  description: "Go to Lunch",
});

newTask
  .save()
  .then(() => console.log(newTask))
  .catch((err) => console.log("Error", err));
