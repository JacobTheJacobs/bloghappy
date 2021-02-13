const express = require("express");
const router = express.Router();
const Category = require("../models/category");
const slugify = require("slugify");
const Blog = require("../models/blog");
// validators
const { runValidation } = require("../validation");
const { categoryCreateValidator } = require("../validation/auth");
const { requireSignin, adminMiddleware } = require("../validation/middleware");

//@@@create category
//@@@localhost:3000/category
//@@@POST
router.post(
  "/category",
  categoryCreateValidator,
  runValidation,
  requireSignin,
  adminMiddleware,
  (req, res) => {
    const { name } = req.body;
    console.log(req.body);
    let slug = slugify(name).toLowerCase();

    let category = new Category({ name, slug });
    category.save((err, data) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json({
        error: "",
        data,
      });
    });
  }
);

//@@@get all category
//@@@localhost:3000/category
//@@@POST
router.get("/categories", (req, res) => {
  Category.find({}).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json({
      error: "",
      data,
    });
  });
});

//@@@get single category
//@@@localhost:3000/category
//@@@POST
router.get("/category/:slug", (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Category.findOne({ slug }).exec((err, category) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json({
      error: "",
      category,
    });
  });
});

//@@@find by category
//@@@localhost:3000/category
//@@@POST
router.post("/category/:slug", (req, res) => {
  const slug = req.body.slug;
  console.log(slug, "slug");
  Category.findOne({ name: slug }).exec((err, category) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    // res.json(category);
    Blog.find({ categories: category })
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name")
      .select(
        "_id title slug excerpt categories postedBy tags createdAt updatedAt"
      )
      .exec((err, data) => {
        if (err) {
          return res.status(400).json({
            error: err,
          });
        }
        res.json({ category: category, blogs: data });
      });
  });
});

//@@@delete category
//@@@localhost:3000/category
//@@@DELETE
router.delete("/category/:slug", requireSignin, adminMiddleware, (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Category.findOneAndRemove({ slug }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json({
      message: "Category deleted successfully",
    });
  });
});

module.exports = router;
