const User = require("../models/user");
const jwt = require("jsonwebtoken");

const handleError = (err) => {
  console.log(err.message);

  let errors = { email: "", password: "" };

  if (err.message == "password incorrect") {
    errors.password = "this password is incorrect";
  }

  if (err.message == "email incorrect") {
    errors.email = "this email is not registred";
  }

  if (err.code == 11000) {
    errors.email = "this email already exists";
    return errors;
  }

  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;

  //let error = { email: "", password: "" };
}; //.ocde is only usueful in the unique related error

module.exports.signup_get = (req, res) => {
  res.render("authentication/signup");
}; //wihtout a route path ?

module.exports.login_get = (req, res) => {
  res.render("authentication/login");
};

//res.send("user signup"); this CAUSED Cannot set headers after they are sent to the client
// tries to send a header after some of the body has already been written

/* OLD WAY
  let user = new User({
    email: req.body.email,
    password: req.body.password,
  }); 
  NEW WAY
  */
module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    const token = createtoken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (e) {
    // console.log(e); //this error objects contains the errors handling msgs
    //e.cod => usually undefined but need it later on
    const errors = handleError(e);
    res.status(400).json({ errors });
  }
};

const maxAge = 24 * 60 * 60 * 3;
const createtoken = (id) => {
  // the payload will contains that id -> using it after for extracting user's infos
  return jwt.sign({ id }, "ninja for security", { expiresIn: maxAge });
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createtoken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
    //res.redirect("articles/new"); ===> can't be done from the backend
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json({ errors });
  }
};

/* what give u the access to grab the jwt cookie from the browser and delete it from the browser ??? */
/* he can't attend the button and make the  logout req only if he is already logged in   */
/* but what prevent me from going there directly ?????? */

module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/login");
};
//custom error handling + mongoose validation error + mongoose
