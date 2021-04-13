module.exports.signup_get = (req, res) => {
  res.render("authentication/signup");
}; //wihtout a route path ?

module.exports.login_get = (req, res) => {
  res.render("authentication/login");
};

module.exports.signup_post = async (req, res) => {
  res.send("user signup");
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  try {
    const user = await user.save();
    console.log("successfully created");
  } catch (e) {
    console.log(e);
  }
};

module.exports.login_post = (req, res) => {
  res.send("user login");
};
