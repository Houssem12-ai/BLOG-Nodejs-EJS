const express = require("express");
const router = express.Router();
const Article = require("../models/article");

// i can't believe !!!!
//order matters ?????????????????
router.get("/new", (req, res) => {
  res.render("./articles/new", { article: new Article() });
});

/* router.get("/new", (req, res) => {
  const article = {
    title: "something",
    description: "des des",
    markdown: "rod belek",
  };
  res.render("./articles/new", { article: article });
}); */

router.get("/:id", async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (article == null) {
    res.redirect("/");
  }
  res.render("articles/show", { article: article });
});

router.post("/", async (req, res) => {
  let article = new Article({
    //not making it constant
    // let cause a problem
    title: req.body.title,
    description: req.body.description,
    markdown: req.body.markdown,
  });
  try {
    article = await article.save(); //assign a variable to it
    res.redirect(`/articles/${article.id}`);
  } catch (e) {
    console.log(e);
    res.render("articles/new", { article: article });
  }
});

module.exports = router;
