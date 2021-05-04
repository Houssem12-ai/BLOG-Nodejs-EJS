const jwt = require("jsonwebtoken");
const User = require("../models/user");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "ninja for security", (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.redirect("/login");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "ninja for security", async (err, decodedToken) => {
      //decoded toker contains an id in the payload :
      if (err) {
        res.locals.user = null;
        next(); //if not logged in -> nothing to do-> else throws that the var undefined cause we gonna check on it everytime
      } else {
        const user = await User.findById(decodedToken.id); //get user info and inject it ot the user later on
        res.locals.user = user; //locals-> making a variable that i want it to be accessible from the view
        //so we can access it's info in the views
        next();
      }
    });
  } else {
    res.locals.user = null;
    next(); //move to the page //move the next middleware in the stack
  }
};

module.exports = { requireAuth, checkUser };
