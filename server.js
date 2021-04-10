const express = require("express");
const app = express();
const mongoose = require("mongoose");
const router = require("./routes/articles");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use("/articles", router);

mongoose
  .connect("mongodb://localhost:27017/blog", {
    useNewUrlParser: true,
  })
  .then(() => console.log("al hamdu leleh"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  articles = [
    {
      title: "Test article",
      createdAt: new Date(),
      description: "description of the article",
    },
    {
      title: "Test article  2",
      createdAt: new Date(),
      description: "description of the article 2",
    },
  ];
  res.render("./articles/index", { articles: articles }); //it looks by default in views by put ./
});

app.listen(3003, () => {
  console.log("server is up and running");
});
