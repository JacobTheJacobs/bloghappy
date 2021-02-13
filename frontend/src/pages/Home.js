import React from "react";
import { useState, useEffect } from "react";
import { listBlogsWithCategoriesAndTags } from "../actions/blog";
import { withRouter, useHistory, Link } from "react-router-dom";
import renderHTML from "react-render-html";
import moment from "moment";
import { DOMAIN, APP_NAME } from "../App";
import "../App.css";

import { Helmet } from "react-helmet";
const BASE_URL = process.env.REACT_APP_DEVELOPMENT_API;
const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [limit, setLimit] = useState(0);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(0);
  const [loadedBlogs, setLoadedBlogs] = useState([]);
  //META
  const headMeta = () => (
    <div className="application">
      <Helmet>
        <title>{APP_NAME}</title>
        <meta
          name="description"
          content="Programming blogs and tutorials on react node next vue php laravel and web developoment"
        />
        <link rel="canonical" href={`${DOMAIN}`} />
        <meta
          property="og:title"
          content={`Latest web developoment tutorials | ${APP_NAME}`}
        />
        <meta
          property="og:description"
          content="Programming blogs and tutorials on react node next vue php laravel and web developoment"
        />
        <meta property="og:type" content="webiste" />
        <meta property="og:url" content={`${DOMAIN}`} />
        <meta property="og:site_name" content={`${APP_NAME}`} />

        <meta
          property="og:image"
          content={`${DOMAIN}/static/images/seoblog.jpg`}
        />
        <meta
          property="og:image:secure_url"
          ccontent={`${DOMAIN}/static/images/seoblog.jpg`}
        />
        <meta property="og:image:type" content="image/jpg" />
      </Helmet>
    </div>
  );

  //init
  useEffect(() => {
    showAllBlogs();
  }, []);

  //init size blogs
  const showAllBlogs = () => {
    let skip = 0;
    let limit = 3;
    listBlogsWithCategoriesAndTags(skip, limit).then((data) => {
      console.log(data);
      if (data.error) {
        console.log(data.data.error);
      } else {
        const blogsArray = data.data.blogs;
        const categoryArray = data.data.categories;
        const blogsSize = data.data.size;

        setSkip(skip);
        setLimit(limit);
        setBlogs({ ...blogs, blogsArray });
        setCategories({ ...categories, categoryArray });
        setSize(blogsSize);
      }
    });
  };
  //load more blogs
  const loadMore = () => {
    let toSkip = skip + limit;
    listBlogsWithCategoriesAndTags(toSkip, limit).then((data) => {
      console.log(data);
      if (data.error) {
        console.log(data.data.error);
      } else {
        const blogsArray = data.data.blogs;
        const blogsSize = data.data.size;
        setLoadedBlogs([...loadedBlogs, ...blogsArray]);
        setSize(blogsSize);
        setSkip(toSkip);

        console.log(blogsSize, "blogsSize");
      }
    });
  };

  const loadMoreButton = () => {
    console.log(size, "size");
    console.log(limit, "limit");
    return (
      size > 0 && //2
      size >= limit && ( //2 2 4 2
        <button onClick={loadMore} className="btn btn-outline-primary btn-lg">
          Load mmore
        </button>
      )
    );
  };

  //show size categories
  const showBlogs = () => (
    <div className=" w3-col">
      {blogs.blogsArray
        ? blogs.blogsArray.map((blog) => (
            <div
              className="w3-card-4 w3-margin w3-white"
              key={blog._id}
              style={{ margin: ".5em" }}
            >
              <img
                style={{
                  maxHeight: "250px",
                  width: "auto",

                  left: "50%",
                  top: "50%",
                  height: "auto",
                  width: "100%",
                }}
                src={`api/blog/photo/${blog.slug}`}
                alt={blog.title}
                className="card-img-top"
                alt="..."
              />
              <div className="w3-container">
                <h3>
                  <b>{blog.title}</b>
                </h3>
                <h5>
                  Written by {blog.postedBy.name},{" "}
                  <span className="w3-opacity">
                    Published {moment(blog.updatedAt).fromNow()}
                  </span>
                </h5>
              </div>

              <div className="w3-container">
                <p className="card-text">{renderHTML(String(blog.excerpt))}</p>
                <div className="w3-row">
                  <div className="w3-col m8 s12">
                    <p>
                      <Link
                        to={`/blog/${blog.slug}`}
                        className="w3-button w3-padding-large w3-white w3-border"
                      >
                        <b>READ MORE »</b>
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        : ""}
    </div>
  );

  //show all loaded categories
  const showLoadedBlogs = () => (
    <div className="row">
      {loadedBlogs.length > 1
        ? loadedBlogs.map((blog) => (
            <div className="card" key={blog._id} style={{ margin: ".5em" }}>
              <p>
                Written by {blog.postedBy.name} | Published{" "}
                {moment(blog.updatedAt).fromNow()}
              </p>

              <img
                style={{ maxHeight: "250px", width: "auto" }}
                src={`api/blog/photo/${blog.slug}`}
                alt={blog.title}
                className="card-img-top"
                alt="..."
              />
              <div className="card-body">
                <h5 className="card-title">{blog.title}</h5>
                <p className="card-text">{renderHTML(String(blog.excerpt))}</p>
                <Link to={`/blog/${blog.slug}`} className="btn btn-primary">
                  Read More
                </Link>
              </div>
              {loadMoreButton()}
            </div>
          ))
        : ""}
    </div>
  );

  //list all categories
  const showCategories = () => (
    <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
      {categories.categoryArray
        ? categories.categoryArray.map((cat) => (
            <div
              key={cat._id}
              className="w3-card w3-margin"
              style={{ margin: "1em", backgroundColor: "white" }}
            >
              <div class="w3-container w3-padding">
                <Link
                  to={`/categories/${cat.name}`}
                  className="w3-ul w3-hoverable w3-white "
                  data-toggle="modal"
                  data-target="#addCategoryModal"
                  style={{
                    width: "100%",
                    height: "40px",
                    fontWeight: "900",
                    borderRadius: "15px",
                    background: "lighblue",
                    textDecoration: "none",
                    padding: "7px",
                  }}
                >
                  {cat.name}
                </Link>
              </div>
            </div>
          ))
        : ""}
    </div>
  );

  return (
    <React.Fragment>
      {headMeta()}
      <div>
        <section id="actions">
          <div
            style={{
              position: "relative",
              textAlign: "center",
              color: "white",
            }}
          ></div>
        </section>
        <section id="posts">
          <div className="container">
            <div>
              <br></br>
              <div class="w3-row">{showCategories()}</div>
              <div class="w3-row">
                {showBlogs()}
                {showLoadedBlogs()}
              </div>
            </div>
          </div>
        </section>
      </div>
    </React.Fragment>
  );
};

export default Home;
