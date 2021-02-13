const express = require("express");
const router = express.Router();
const { requireSignin, adminMiddleware } = require("../validation/middleware");
const { read } = require("../validation/middleware");
const Blog = require("../models/blog");
const Category = require("../models/category");
const formidable = require("formidable");
const slugify = require("slugify");
const stripHtml = require("string-strip-html");
const _ = require("lodash");
const fs = require("fs");

//helping method
const trimText = (str, length, delim, appendix) => {
  if (str.length <= length) return str;

  var trimmedStr = str.substr(0, length + delim.length);

  var lastDelimIndex = trimmedStr.lastIndexOf(delim);
  if (lastDelimIndex >= 0) trimmedStr = trimmedStr.substr(0, lastDelimIndex);

  if (trimmedStr) trimmedStr += appendix;
  return trimmedStr;
};

//@@@create new blog
//@@@localhost:3000/blog
//@@@POST
router.post("/blog", requireSignin, adminMiddleware, (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  console.log(form);
  // read
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not upload",
      });
    }
    console.log(err);
    console.log(fields, "field");
    console.log(files);
    const { title, body, categories } = fields;

    // validate
    if (!title || !title.length) {
      return res.status(400).json({
        error: "Title is required",
      });
    }

    if (!body || body.length < 200) {
      return res.status(400).json({
        error: "Content is too short",
      });
    }

    if (!categories || categories.length === 0) {
      return res.status(400).json({
        error: "one category is required or more",
      });
    }

    let blog = new Blog();
    blog.title = title;
    blog.body = body;
    blog.excerpt = trimText(body, 70, " ", " ...");
    blog.slug = slugify(title).toLowerCase();
    blog.mtitle = `${title} | ${process.env.APP_NAME}`;

    blog.postedBy = req.user._id;

    // categories
    let arrayOfCategories = categories && categories.split(",");
    // photo
    if (files.photo) {
      if (files.photo.size > 10000000) {
        return res.status(400).json({
          error: "Image should be less then 1mb in size",
        });
      }
      blog.photo.data = fs.readFileSync(files.photo.path);
      blog.photo.contentType = files.photo.type;
    }
    // save
    blog.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      // categories
      Blog.findByIdAndUpdate(
        result._id,
        { $push: { categories: arrayOfCategories } },
        { new: true }
      ).exec((err, result) => {
        if (err) {
          return res.status(400).json({
            error: err,
          });
        }
        res.json({
          error: "",
          result,
        });
      });
    });
  });
});

//@@@get all blogs
//@@@localhost:3000/blogs
//@@@POST
router.get("/blogs", (req, res) => {
  Blog.find({})
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name username")
    //return
    .select("_id title slug excerpt categories  postedBy createdAt updatedAt")
    .exec((err, data) => {
      if (err) {
        return res.json({
          error: err,
        });
      }
      res.json(data);
    });
});
//@@@get all blogs by categories
//@@@localhost:3000/blogs-categories
//@@@POST
router.post("/blogs-categories", (req, res) => {
  console.log(req.body);
  console.log(req.body.skip);
  let limit = req.body.limit ? parseInt(req.body.limit) : 10;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;

  let blogs;
  let categories;

  Blog.find({})
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name username profile")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select(
      "_id title slug excerpt categories tags postedBy createdAt updatedAt"
    )
    .exec((err, data) => {
      if (err) {
        return res.json({
          error: err,
        });
      }
      blogs = data; // blogs
      // get all categories
      Category.find({}).exec((err, categorie) => {
        if (err) {
          return res.json({
            error: err,
          });
        }
        categories = categorie; // categories
        // return all blogs categories
        res.json({ blogs, categories, size: blogs.length });
      });
    });
});
//@@@get blog by slug
//@@@localhost:3000/blog/:slug"
//@@@GET
router.get("/blog/:slug", (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOne({ slug })
    // .select("-photo")
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name username")
    .select(
      "_id title body slug mtitle mdesc categories tags postedBy createdAt updatedAt"
    )
    .exec((err, data) => {
      if (err) {
        return res.json({
          error: err,
        });
      }
      res.json(data);
    });
});
//@@@delete blog by slug
//@@@localhost:3000/blog/:slug"
//@@@DELETE
router.delete("/blog/:slug", requireSignin, adminMiddleware, (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOneAndRemove({ slug }).exec((err, data) => {
    if (err) {
      return res.json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: "Blog deleted successfully",
    });
  });
});
//@@@update blog by slug
//@@@localhost:3000/blog/:slug"
//@@@PUT
router.put("/blog/:slug", requireSignin, adminMiddleware, (req, res) => {
  const slug = req.params.slug.toLowerCase();
  console.log(slug);
  Blog.findOne({ slug }).exec((err, oldBlog) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    console.log(form);
    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: "Image could not upload",
        });
      }
      let slugBeforeMerge = oldBlog.slug;
      oldBlog = _.merge(oldBlog, fields);
      oldBlog.slug = slugBeforeMerge;
      const { body, desc, categories, tags } = fields;
      if (body) {
        oldBlog.excerpt = smartTrim(body, 320, " ", " ...");
        oldBlog.desc = stripHtml(body.substring(0, 160));
      }

      if (categories) {
        oldBlog.categories = categories.split(",");
      }

      if (files.photo) {
        if (files.photo.size > 10000000) {
          return res.status(400).json({
            error: "Image should be less then 1mb in size",
          });
        }
        oldBlog.photo.data = fs.readFileSync(files.photo.path);
        oldBlog.photo.contentType = files.photo.type;
      }

      oldBlog.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: err,
          });
        }
        // result.photo = undefined;
        res.json(result);
      });
    });
  });
});

//@@@get blogs photo
//@@@localhost:3000/blog/:slug"
//@@@GET
router.get("/blog/photo/:slug", (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOne({ slug })
    .select("photo")
    .exec((err, blog) => {
      if (err || !blog) {
        return res.status(400).json({
          error: err,
        });
      }
      res.set("Content-Type", blog.photo.contentType);
      return res.send(blog.photo.data);
    });
});

//@@@get blogs related
//@@@localhost:3000/blogs/related"
//@@@POST
router.post("/blogs/related", (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 3;
  const { _id, categories } = req.body;

  //get all dont include that id
  Blog.find({ _id: { $ne: _id }, categories: { $in: categories } })
    .limit(limit)
    .populate("postedBy", "_id name profile")
    .select("title slug excerpt postedBy createdAt updatedAt")
    .exec((err, blogs) => {
      if (err) {
        return res.status(400).json({
          error: "Blogs not found",
        });
      }
      res.json(blogs);
      console.log(blogs);
    });
});

module.exports = router;
