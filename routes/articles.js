const express = require("express");
const router = express.Router();
const Article = require("../models/article");

// i can't believe !!!!
//order matters ?????????????????
router.get("/new", (req, res) => {
  res.render("./articles/new");
});

/* router.get("/new", (req, res) => {
  const article = {
    title: "something",
    description: "des des",
    markdown: "rod belek",
  };
  res.render("./articles/new", { article: article });
}); */

router.get("/:id", (req, res) => {
  //res.send("salam");
});

router.post("/", async (req, res) => {
  const article = new Article({
    //not making it constant
    // let cause a problem
    title: req.body.title,
    description: req.body.description,
    markdown: req.body.markdown,
  });
  try {
    let article = await article.save(); //assign a variable to it
    res.redirect(`/article/${article.id}`, { article: article });
  } catch (e) {
    console.log(e);
    res.render("articles/new", { article: article });
  }
});

module.exports = router;
