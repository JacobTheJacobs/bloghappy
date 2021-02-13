import { useState, useEffect } from "react";
import { withRouter, Link, useHistory } from "react-router-dom";
import { getCookie } from "../actions/auth";
import Layout from "../Layout/Layout";
import { singleCategory } from "../actions/category";
import { Helmet } from "react-helmet";
import renderHTML from "react-render-html";
import moment from "moment";
const DOMAIN = process.env.REACT_APP_DEVELOPMENT_API;
const APP_NAME = process.env.REACT_APP_APP_NAME;
const BASE_URL = process.env.REACT_APP_DEVELOPMENT_API;
const CategoryHome = (props) => {
  const [category, setCategorie] = useState("");
  const [blogs, setBlogs] = useState([]);
  const token = getCookie("token");

  let history = useHistory();
  const query = props.history.location.pathname.substring(12);

  useEffect(() => {
    console.log(query);
    console.log(props.history.location.pathname.substring(12));
    singleCategory(query, token).then((data) => {
      setBlogs(data.data.blogs);
      setCategorie(data.data.category);
      if (data.error) {
        console.log(data.error);
      } else {
        console.log(data);
      }
    });
  }, []);
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

  //show size categories

  return (
    <>
      {headMeta()}
      <>
        <main>
          <div className="container-fluid text-center">
            <header>
              <div className="col-md-12 pt-3">
                <h1 className="display-4 font-weight-bold">{category?.name}</h1>
                {blogs.length > 0
                  ? blogs.map((blog) => (
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
                          src={`${BASE_URL}/blog/photo/${blog.slug}`}
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
                          <p className="card-text">
                            {renderHTML(String(blog.excerpt))}
                          </p>
                          <br></br>
                          <div className="w3-row">
                            <div>
                              {" "}
                              <Link
                                style={{ width: "60%", padding: "20px" }}
                                to={`/blog/${blog.slug}`}
                                className="w3-button  w3-white w3-border"
                              >
                                <b>READ MORE »</b>
                              </Link>
                            </div>
                            <br></br>
                          </div>
                        </div>
                      </div>
                    ))
                  : null}
              </div>
            </header>
          </div>
          <br></br> <br></br> <br></br> <br></br> <br></br> <br></br> <br></br>
        </main>
      </>
    </>
  );
};

export default CategoryHome;
