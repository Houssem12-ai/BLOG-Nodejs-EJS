const express = require("express");
const app = express();
const mongoose = require("mongoose");
const router = require("./routes/articles");
app.set("view engine", "ejs");
app.use("/articles", router);
app.use(express.urlencoded({ extended: false }));

mongoose.connect("mongodb:://localhost/blog", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
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
  res.render("./articles/index", { articles: articles });
});

app.listen(3003, () => {
  console.log("server is up and running");
});
