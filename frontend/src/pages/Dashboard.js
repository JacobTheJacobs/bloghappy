import React from "react";
import Admin from "../actions/Admin";
import CreateBlog from "../components/blog";
import Category from "../components/category";
import AllBlogs from "../components/allblogs";

const Dashboard = () => {
  return (
    <Admin>
      <div style={{ backgroundColor: "white" }}>
        <header id="main-header" className="py-2 bg-primary text-white">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <h1>
                  <i className="fas fa-cog"></i> Dashboard
                </h1>
              </div>
            </div>
          </div>
        </header>

        <section id="actions" className="py-4 mb-4 bg-light">
          <div className="container">
            <div className="row">
              <div className="col-12" style={{ width: "100%" }}>
                <a
                  href="#"
                  className="btn btn-success btn-block"
                  data-toggle="modal"
                  data-target="#addCategoryModal"
                  style={{ width: "100%" }}
                >
                  <i className="fas fa-plus"></i> Add Category
                </a>
              </div>
            </div>
          </div>
        </section>

        <CreateBlog />
        <section>
          <div>
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <h4>Latest Posts</h4>
                  </div>
                  <AllBlogs />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="modal fade" id="addCategoryModal">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Add Category</h5>
                <button className="close" data-dismiss="modal">
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body ">
                <Category />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Admin>
  );
};

export default Dashboard;
