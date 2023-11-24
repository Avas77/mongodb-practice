const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", ""); // get authorization token from header
    const decoded = jwt.verify(token, "test"); // decode the token to match with the token built using our secret key
    const user = await User.findOne({
      //find the user in the database with the matching token
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send("Please authenticate");
  }
};

module.exports = auth;
