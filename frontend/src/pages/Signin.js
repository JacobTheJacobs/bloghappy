import { useState } from "react";
import { signin, authenticate, isAuth } from "../actions/auth";
import { withRouter, useHistory } from "react-router-dom";

const SigninComponent = () => {
  let history = useHistory();
  const [values, setValues] = useState({
    email: "demo@demo.com",
    password: "demodemo",
    errors: [],
    loading: false,
    message: "",
    showForm: true,
  });

  const { email, password, errors, loading, message, showForm } = values;

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.table({ name, email, password, error, loading, message, showForm });
    setValues({ ...values, loading: true, error: false });

    const user = { email, password };

    signin(user).then((data) => {
      console.log(data);
      if (data.data.error.length > 0) {
        setValues({
          ...values,
          errors: data.data.errorArray || data.data.error,
          loading: false,
        });
      } else {
        // save user token to cookie
        // save user info to localstorage
        // authenticate user
        authenticate(data, () => {
          if (isAuth() && isAuth().role === 1) {
            history.push(`/myDashboard`);
            window.location.reload();
          } else {
            history.push(`/`);
            window.location.reload();
          }
        });
      }
    });
  };

  const handleChange = (name) => (e) => {
    setValues({ ...values, error: false, [name]: e.target.value });
  };

  const showLoading = () =>
    loading ? <div className="alert alert-info">Loading...</div> : "";

  const showError = () =>
    errors.length > 0 ? (
      <div>
        {errors.map((err, i) => (
          <div key={i} className="alert alert-danger">
            {err}
          </div>
        ))}
      </div>
    ) : (
      ""
    );
  const showMessage = () =>
    message ? <div className="alert alert-info">{message}</div> : "";

  const signinForm = () => {
    return (
      <form
        onSubmit={handleSubmit}
        style={{ paddingLeft: "55px", paddingRight: "55px", margin: "30px" }}
      >
        <div className="form-group">
          <input
            value={email}
            onChange={handleChange("email")}
            type="email"
            className="form-control"
            placeholder="Type your email"
          />
        </div>
        <br></br>
        <div className="form-group">
          <input
            value={password}
            onChange={handleChange("password")}
            type="password"
            className="form-control"
            placeholder="Type your password"
          />
        </div>
        <br></br>
        <div>
          <button className="btn btn-primary">Login</button>
        </div>
      </form>
    );
  };

  return (
    <div className="container">
      <br></br> <br></br> <br></br>
      <div class="card">
        <div class="card-body" style={{ textAlign: "center" }}>
          <h5 class="card-title">Login</h5>
          {showError()}
          {showLoading()}
          {showMessage()}
          {showForm && signinForm()}
        </div>
      </div>
      <br></br> <br></br> <br></br> <br></br> <br></br> <br></br> <br></br>{" "}
      <br></br> <br></br> <br></br> <br></br> <br></br> <br></br> <br></br>{" "}
      <br></br> <br></br> <br></br>
      <br></br>
    </div>
  );
};

export default SigninComponent;
