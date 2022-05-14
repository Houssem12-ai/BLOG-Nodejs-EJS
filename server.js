const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");

const mongoose = require("mongoose");
const Article = require("./models/article");

const routerArticle = require("./routes/articles");
const routerAuthentication = require("./routes/authen");

const { requireAuth, checkUser } = require("./middleware/authMidd");

app.set("view engine", "ejs");

//those two are not the same
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(cookieParser());
const port = 3003

mongoose
  .connect("mongodb://localhost:27017/blog", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(
    () =>
      app.listen(port, () => {
        console.log("server is up and running on port " + port );
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

// typage in javascript

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