import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { withRouter, useHistory } from "react-router-dom";
import { getCookie, isAuth } from "../actions/auth";
import { getCategories } from "../actions/category";
import { createBlog } from "../actions/blog";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { get } from "js-cookie";

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

const CreateBlog = () => {
  const blogFromLS = () => {
    if (typeof window.location.reload === "undefined") {
      return false;
    }

    if (localStorage.getItem("blog")) {
      return JSON.parse(localStorage.getItem("blog"));
    } else {
      return false;
    }
  };
  const [categories, setCategories] = useState([""]);
  const [checked, setChecked] = useState([]); // categories
  const [body, setBody] = useState(blogFromLS());
  const [values, setValues] = useState({
    error: "",
    sizeError: "",
    success: "",
    formData: "",
    title: "",
    hidePublishButton: false,
    reload: false,
  });

  const {
    error,
    sizeError,
    success,
    formData,
    title,
    hidePublishButton,
    reload,
  } = values;
  const token = getCookie("token");

  useEffect(() => {
    initForm();
    //initCategories();
    initCategories();
  }, [reload]);

  // body
  const initForm = () => {
    setValues({ ...values, formData: new FormData() });
    console.log();
  };
  // body
  const publishBlog = (e) => {
    e.preventDefault();

    createBlog(formData, token).then((data) => {
      console.log(data);
      if (data.data.error) {
        console.log(data.data.error);
        setValues({ ...values, error: data.data.error });
      } else {
        setValues({
          ...values,
          title: "",
          error: "",
          success: `A new blog titled "${data.data.title}" is created`,
        });
        setBody("");
        setCategories([]);
      }
    });
  };
  // body
  const createBlogForm = () => {
    return (
      <form encType="multipart/form-data">
        <div className="form-group">
          <label className="text-muted">Title</label>
          <input
            name="title"
            type="text"
            className="form-control"
            value={title}
            onChange={handleChange("title")}
            style={{ marginBottom: "2em" }}
          />
        </div>

        <div className="form-group">
          <ReactQuill
            name="body"
            type="text"
            modules={QuillModules}
            formats={QuillFormats}
            value={body}
            placeholder="Write something amazing..."
            onChange={handleBody}
          />
        </div>

        <div>
          <button
            onClick={publishBlog}
            className="btn btn-primary"
            style={{
              marginTop: "0.1em",
              width: "100%",
              padding: "10px",
              fontSize: "5rem",
              fontWeight: "bold",
            }}
          >
            Publish Blog
          </button>
        </div>
      </form>
    );
  };
  // body
  const handleChange = (name) => (e) => {
    // console.log(e.target.value);
    const value = name === "photo" ? e.target.files[0] : e.target.value;
    formData.set(name, value);

    setValues({ ...values, [name]: value, formData, error: "" });
  };
  // body
  const handleBody = (e) => {
    setBody(e);
    formData.set("body", e);
    formData.get("body");
    console.log(e);
    if (typeof window !== "undefined") {
      localStorage.setItem("blog", JSON.stringify(e));
    }
  };
  // categories
  const initCategories = () => {
    getCategories().then((data) => {
      console.log(data);
      setCategories(data.data.data);
    });
  };

  // categories
  const showCategories = () => (
    <>
      {categories.length > 0 || categories.length !== undefined
        ? categories.map((c, i) => (
            <li key={i} className="list-unstyled">
              <input
                onChange={handleToggle(c._id)}
                type="checkbox"
                className="mr-2"
              />
              <label className="form-check-label">{c.name}</label>
            </li>
          ))
        : null}
    </>
  );
  // categories
  const handleToggle = (c) => () => {
    setValues({ ...values, error: "" });
    // return the first index or -1
    const clickedCategory = checked.indexOf(c);
    const all = [...checked];

    if (clickedCategory === -1) {
      all.push(c);
    } else {
      //index clickedCategory
      all.splice(clickedCategory, 1);
    }
    console.log(all);
    setChecked(all);
    formData.set("categories", all);
  };
  // validate
  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );
  // validate
  const showSuccess = () => (
    <div
      className="alert alert-success"
      style={{ display: success ? "" : "none" }}
    >
      {success}
    </div>
  );

  return (
    <div className="container-fluid pb-5">
      <div className="row">
        <div className="col-md-8">
          {showError()}
          {createBlogForm()}
          <div className="pt-3">{showSuccess()}</div>
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

export default CreateBlog;
