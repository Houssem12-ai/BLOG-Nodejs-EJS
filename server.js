const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Article = require("./models/article");
const router = require("./routes/articles");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use("/articles", router);

mongoose
  .connect("mongodb://localhost:27017/blog", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("al hamdu leleh"))
  .catch((err) => console.log(err));

app.get("/", async (req, res) => {
  const articles = await Article.find().sort({ createAt: "desc" });
  //res.send(articles);
  res.render("articles/index", { articles: articles }); //it looks by default in views by put ./
});

app.listen(3003, () => {
  console.log("server is up and running");
});
