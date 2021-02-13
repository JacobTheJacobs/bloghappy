import { useState, useEffect } from "react";
import { withRouter, Link, useHistory } from "react-router-dom";

import { singleBlog, updateBlog } from "../actions/blog";

import { getCookie, isAuth } from "../actions/auth";
import { getCategories } from "../actions/category";
import renderHTML from "react-render-html";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
const BASE_URL = process.env.REACT_APP_DEVELOPMENT_API;
const QuillModules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { header: [3, 4, 5, 6] }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image", "video"],
    ["clean"],
    ["code-block"],
  ],
};

const QuillFormats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "link",
  "image",
  "video",
  "code-block",
];

const BlogUpdate = (props) => {
  let history = useHistory();
  const [body, setBody] = useState("");
  const [titleBlog, setTitleBlog] = useState("");
  const [categories, setCategories] = useState([]);

  const [checked, setChecked] = useState([]); // categories
  const [checkedTag, setCheckedTag] = useState([]); // tags

  const [values, setValues] = useState({
    title: "",
    error: "",
    success: "",
    formData: "",
    title: "",
    body: "",
    reload: false,
  });

  const { error, success, formData, title, reload } = values;
  const token = getCookie("token");
  const query = props.history.location.pathname.substring(18);

  useEffect(() => {
    initBlog();
  }, []);

  //form Data not async
  const initForm = () => {
    setTimeout(
      function () {
        setValues({ ...values, formData: new FormData() });
        console.log(formData);
      }.bind(this),
      2000
    );
  };

  const initCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        console.log(data.data.data);
        setCategories(data.data.data);
      }
    });
  };

  const initBlog = () => {
    if (query) {
      singleBlog(query).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          console.log(data.data.body);
          setValues({ ...values, title: data.data.title });
          setTitleBlog(data.data.title);
          setBody(data.data.body);
          setCategoriesArray(data.data.categories);
        }
      });
    }
    initCategories();
    initForm();
  };

  const setCategoriesArray = (blogCategories) => {
    console.log(blogCategories);
    let ca = [];
    blogCategories.map((c, i) => {
      console.log(c);
      ca.push(c._id);
    });
    setChecked(ca);
    console.log(ca);
  };

  const handleToggle = (c) => () => {
    setValues({ ...values, error: "" });
    // return the first index or -1
    const clickedCategory = checked.indexOf(c);
    const all = [...checked];

    if (clickedCategory === -1) {
      all.push(c);
    } else {
      all.splice(clickedCategory, 1);
    }
    console.log(all);
    setChecked(all);

    formData.set("categories", all);
    console.log(formData);
  };

  const findOutCategory = (c) => {
    const result = checked.indexOf(c);
    if (result !== -1) {
      return true;
    } else {
      return false;
    }
  };

  const showCategories = () => (
    <div>
      {categories.length > 0
        ? categories.map((c, i) => (
            <li key={i} className="list-unstyled">
              <input
                onChange={handleToggle(c._id)}
                checked={findOutCategory(c._id)}
                type="checkbox"
                className="mr-2"
              />
              <label className="form-check-label">{c.name}</label>
            </li>
          ))
        : null}
    </div>
  );

  const handleChange = (name) => (e) => {
    console.log(e.target.name);
    const value = name === "photo" ? e.target.files[0] : e.target.value;
    formData.set(name, value);

    setValues({ ...values, [name]: value, formData, error: "" });
    if (e.target.name === "title") {
      setTitleBlog(e.target.value);
    }
  };

  const handleBody = (e) => {
    console.log(e);

    setBody(e);

    formData.set("body", e);
    //console.log(formData.get("body"));

    localStorage.setItem("blog", JSON.stringify(e));
  };

  const editBlog = (e) => {
    e.preventDefault();
    updateBlog(formData, token, query).then((data) => {
      console.log(formData);
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          title: "",
          success: `Blog titled "${data.title}" is successfully updated`,
        });
        if (isAuth() && isAuth().role === 1) {
          history.push(`/myDashboard`);
        } else if (isAuth() && isAuth().role === 0) {
          history.push(`/`);
        }
      }
    });
  };

  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  const showSuccess = () => (
    <div
      className="alert alert-success"
      style={{ display: success ? "" : "none" }}
    >
      {success}
    </div>
  );

  const updateBlogForm = () => {
    return (
      <form enctype="multipart/form-data">
        <div className="form-group">
          <label className="text-muted">Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={titleBlog}
            onChange={handleChange("title")}
          />
        </div>

        <div className="form-group">
          <ReactQuill
            modules={QuillModules}
            formats={QuillFormats}
            value={body}
            placeholder="Write something amazing..."
            onChange={() => handleBody}
          />
        </div>

        <div>
          <button
            onClick={editBlog}
            className="btn btn-primary"
            style={{
              marginTop: "0.1em",
              width: "100%",
              padding: "10px",
              fontSize: "5rem",
              fontWeight: "bold",
            }}
          >
            Update
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="container-fluid pb-5">
      <div className="row">
        <div className="col-md-8">
          {updateBlogForm()}

          <div className="pt-3">
            {showSuccess()}
            {showError()}
          </div>

          {body && (
            <img
              src={`${BASE_URL}/blog/photo/${query}`}
              alt={title}
              style={{ width: "100%" }}
            />
          )}
        </div>

        <div className="col-md-4">
          <div>
            <div className="form-group pb-2">
              <h5>Featured image</h5>
              <hr />

              <small className="text-muted">Max size: 1mb</small>
              <br />
              <label className="btn btn-outline-info">
                Upload featured image
                <input
                  onChange={handleChange("photo")}
                  type="file"
                  accept="image/*"
                  hidden
                />
              </label>
            </div>
          </div>
          <div>
            <h5>Categories</h5>
            <hr />

            <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
              {showCategories()}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogUpdate;
