const express = require("express");
const router = express.Router();
const Article = require("../models/article");

router.get("/edit/:id", async (req, res) => {
  const article = await Article.findById(req.params.id);
  res.render("articles/edit", { article: article });
});

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

router.get("/:slug", async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });
  if (article == null) {
    res.redirect("/");
  }
  res.render("articles/show", { article: article });
});

router.post(
  "/",
  async (req, res, next) => {
    req.article = new Article();
    next();
  },
  houkihrayri("new")
);

router.put(
  "/:id",
  async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next();
  },
  houkihrayri("edit")
);

/* router.delete("/:id", async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (e) {
    console.log(error);
  }
}); */

router.delete("/:id", async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (e) {
    consol.log(e);
  }
});

function houkihrayri(path) {
  //here again we find the prob of duplicate key error when we succeed to update but fail to redirect and then we come again to submit -> duplicate key error
  return async (req, res) => {
    let article = req.article; //not making it constant
    article.title = req.body.title;
    article.description = req.body.description;
    article.markdown = req.body.markdown;
    try {
      article = await article.save(); //assign a variable to it
      res.redirect(`/articles/${article.slug}`);
    } catch (e) {
      console.log(e);
      res.render(`articles/${path}`, { article: article });
    }
  };
}

module.exports = router;
