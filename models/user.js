const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "please enter a valid email "],
  },
  password: {
    type: String,
    required: [true, "please enter a password"],
    minlength: [6, "the length of the password should be at least 6"],
  },
});

userSchema.post("save", (doc, next) => {
  console.log("new user have been created", doc);
  next();
});
// we get this property __v: 0 only after the user created

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("password is incorrect");
  }
  throw Error("email doesn't exist");
};

const User = mongoose.model("User", userSchema);
module.exports = User;
