const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

const mongoose = require("mongoose");
const Article = require("./models/article");

const routerArticle = require("./routes/articles");
const routerAuthentication = require("./routes/authen");

const { requireAuth, checkUser } = require("./middleware/authMidd");
const methodOverride = require("method-override");

app.set("view engine", "ejs");

//those two are not the same
app.use(express.urlencoded({ extended: false })); // what is this
app.use(express.json());
app.use(methodOverride("_method"));
app.use(cookieParser());

mongoose
  .connect("mongodb://localhost:27017/blog", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(
    () =>
      app.listen(3003, () => {
        console.log("server is up and running");
      }) //new best practice
  )
  .catch((err) => console.log(err));

app.get("/", checkUser, async (req, res) => {
  const articles = await Article.find().sort({ createAt: "desc" });
  //res.send(articles);
  res.render("articles/index", { articles: articles }); //it looks by default in views by put ./
});

app.get("/set-cookies", (req, res) => {
  //res.setHeader("Set-Cookies", "newuser=true");
  res.cookie("newUser", false);
  res.cookie("isEmploye", true, { maxAge: 1000 * 60 * 24, secure: true });
  res.cookie("brobro", false, { maxAge: 1000 * 60, httpOnly: true });
  res.cookie("u know", false, { maxAge: 1000 * 60, httpOnly: true });

  //if only creates itif it doesn't exists
  res.send("cookies created w salem");
});

app.get("/read-cookies", (req, res) => {
  const something = req.cookies;
  res.json(something);
  console.log(something.newUser);
  /*   res.json({
    why: "shmeta",
    so: "yeaaa da ",
  }); 
  //res.send("helakfe"); */
});
//always put it at the end to all configuration are set before
app.use("*", checkUser);
app.use("/articles", requireAuth, routerArticle);
app.use("/", routerAuthentication);
