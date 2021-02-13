import { useState, useEffect } from "react";

import { getCookie } from "../actions/auth";
import { create, getCategories, removeCategory } from "../actions/category";

const Category = () => {
  const [values, setValues] = useState({
    name: "",
    error: false,
    success: false,
    categories: [""],
    removed: false,
    reload: false,
  });

  const { name, error, success, categories, removed, reload } = values;
  const token = getCookie("token");

  useEffect(() => {
    loadCategories();
  }, [reload]);

  const loadCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setValues({ ...values, categories: data.data.data });
      }
    });
  };

  const showCategories = () => (
    <div>
      <table className="table table-striped">
        <thead className="thead-dark">
          <tr>
            <th>#</th>
            <th>_ID</th>
            <th>SLUG</th>
            <th>NAME</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0
            ? categories.map((cat, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{cat._id}</td>
                  <td>{cat.slug}</td>
                  <td>{cat.name}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteConfirm(cat.slug)}
                    >
                      <i className="fas fa-angle-double-right"></i> Delete
                    </button>
                  </td>
                </tr>
              ))
            : ""}
        </tbody>
      </table>
    </div>
  );

  const deleteConfirm = (slug) => {
    let answer = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (answer) {
      deleteCategory(slug);
    }
  };

  const deleteCategory = (slug) => {
    // console.log('delete', slug);

    removeCategory(slug, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setValues({
          ...values,
          error: false,
          success: false,
          name: "",
          removed: !removed,
          reload: !reload,
        });
      }
    });
  };

  const clickSubmit = () => {
    // console.log('create category', name);
    create(name, token).then((data) => {
      setValues({
        ...values,
        error: false,
        success: false,
        name: "",
        removed: !removed,
        reload: !reload,
      });
    });
    // window.location.reload();
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      name: e.target.value,
      error: false,
      success: false,
      removed: "",
    });
  };

  const showSuccess = () => {
    if (success) {
      return <p className="text-success">Category is created</p>;
    }
  };

  const showError = () => {
    if (error) {
      return <p className="text-danger">Category already exist</p>;
    }
  };

  const showRemoved = () => {
    if (removed) {
      return <p className="text-danger">Category is removed</p>;
    }
  };

  const newCategoryFom = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          type="text"
          className="form-control"
          onChange={handleChange}
          value={name}
          required
        />
      </div>
      <div>
        <div className="modal-footer">
          <button
            onClick={clickSubmit}
            className="btn btn-success"
            data-dismiss="modal"
          >
            Create
          </button>
        </div>
      </div>
    </form>
  );

  return (
    <>
      {showSuccess()}
      {showError()}
      {showRemoved()}

      {newCategoryFom()}
      {showCategories()}
    </>
  );
};

export default Category;
