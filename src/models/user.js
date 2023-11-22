const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
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
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.method("generateAuthToken", async function generateAuthToken() {
  const user = this;
  const token = jwt.sign({ _id: user._id }, "test");
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
});

// find credentials in database
userSchema.static(
  "findByCredentials",
  async function findByCredentials(email, password) {
    const user = await User.findOne({ email }).exec();
    console.log(user);
    if (!user) {
      throw new Error("Unable to login");
    }
    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Unable to login");
    }
    return user;
  }
);

// Hashed passwords
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
