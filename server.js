const express = require("express");
const app = express();

const mongoose = require("mongoose");
const Article = require("./models/article");

const routerArticle = require("./routes/articles");
const routerAuthentication = require("./routes/authen");

const methodOverride = require("method-override");

app.set("view engine", "ejs");

//those two are not the same
app.use(express.urlencoded({ extended: false })); // what is this
app.use(express.json());
app.use(methodOverride("_method"));

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

app.get("/", async (req, res) => {
  const articles = await Article.find().sort({ createAt: "desc" });
  //res.send(articles);
  res.render("articles/index", { articles: articles }); //it looks by default in views by put ./
});
//always put it at the end to all configuration are set before
app.use("/articles", routerArticle);
app.use("/", routerAuthentication);
