import { useState, useEffect } from "react";
import { Link, Route } from "react-router-dom";

import { getCookie, isAuth } from "../actions/auth";
import { list, removeBlog } from "../actions/blog";
import moment from "moment";

const AllBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState("");
  const token = getCookie("token");

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = () => {
    list().then((data) => {
      console.log(data);
      if (data.error) {
        console.log(data.error);
      } else {
        setBlogs(data.data);
      }
    });
  };

  const deleteBlog = (slug) => {
    removeBlog(slug, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setMessage(data.message);
        loadBlogs();
      }
    });
  };

  const deleteConfirm = (slug) => {
    let answer = window.confirm("Are you sure you want to delete your blog?");
    if (answer) {
      deleteBlog(slug);
    }
  };

  const showUpdateButton = (blog) => {
    if (isAuth() && isAuth().role === 0) {
      return (
        <Link to={`/myDashboard/post/${blog.slug}`}>
          <a className="btn btn-sm btn-warning">Update</a>
        </Link>
      );
    } else if (isAuth() && isAuth().role === 1) {
      return (
        <Link to={`/myDashboard/post/${blog.slug}`}>
          <a className="ml-2 btn btn-sm btn-warning">Update</a>
        </Link>
      );
    }
  };

  const showAllBlogs = () => (
    <div>
      <table className="table table-striped">
        <thead className="thead-dark">
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Category</th>
            <th>Date</th>
            <th>Delete</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {blogs.length > 0
            ? blogs.map((blog, i) => {
                return (
                  <tr>
                    <td key={i}>{i + 1}</td>
                    <td>{blog.title}</td>
                    <td>Written by {blog.postedBy.name} |</td>
                    <td>Published on {moment(blog.updatedAt).fromNow()}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteConfirm(blog.slug)}
                      >
                        Delete
                      </button>
                    </td>
                    <td>{showUpdateButton(blog)}</td>
                  </tr>
                );
              })
            : null}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          {message && <div className="alert alert-warning">{message}</div>}
          {showAllBlogs()}
        </div>
      </div>
    </>
  );
};

export default AllBlogs;
