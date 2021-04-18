const User = require("../models/user");
const jwt = require("jsonwebtoken");

const handleError = (err) => {
  //console.log(err.message, err.code);
  let errors = { email: "", password: "" };
  if (err.code == 11000) {
    errors.email = "this email already exists";
    return errors;
  }

  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
    return errors;
  }
  //let error = { email: "", password: "" };
}; //.ocde is only usueful in the unique related error

module.exports.signup_get = (req, res) => {
  res.render("authentication/signup");
}; //wihtout a route path ?

module.exports.login_get = (req, res) => {
  res.render("authentication/login");
};

module.exports.signup_post = async (req, res) => {
  //res.send("user signup"); this CAUSED Cannot set headers after they are sent to the client
  // tries to send a header after some of the body has already been written

  /* OLD WAY
  let user = new User({
    email: req.body.email,
    password: req.body.password,
  }); 
  NEW WAY
  */

  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    const token = createtoken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (e) {
    // console.log(e); //this error objects contains the errors handling msgs
    //e.cod => usually undefined but need it later on
    const errors = handleError(e);
    res.status(400).json({ errors });
  }
};
const maxAge = 24 * 60 * 60 * 3;
const createtoken = (id) => {
  return jwt.sign({ id }, "ninja for security", { expiresIn: maxAge });
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    res.status(201).json({ user: user._id });
  } catch (err) {
    res.status(400).json({});
  }
};
//custom error handling + mongoose validation error + mongoose
