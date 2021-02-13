import axios from "axios";
import cookie from "js-cookie";
const BASE_URL = process.env.REACT_APP_DEVELOPMENT_API;

export const signin = (user) => {
  const request = axios
    .post(`/signin`, user)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      if (err.response) {
        return err.response;
      } else if (err.request) {
        console.log(err.request.data);
      } else {
        console.log(err);
      }
    });
  return request;
};

export const signout = (next) => {
  removeCookie("token");
  removeLocalStorage("user");
  next();

  return axios
    .get(`/signout`)
    .then((response) => {
      console.log("signout success");
    })
    .catch((err) => console.log(err));
};

// set cookie
export const setCookie = (key, value) => {
  if (process.browser) {
    cookie.set(key, value, {
      expires: 1,
    });
  }
};

export const removeCookie = (key) => {
  if (process.browser) {
    cookie.remove(key, {
      expires: 1,
    });
  }
};
// get cookie
export const getCookie = (key) => {
  if (process.browser) {
    return cookie.get(key);
  }
};
// localstorage
export const setLocalStorage = (key, value) => {
  if (process.browser) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const removeLocalStorage = (key) => {
  if (process.browser) {
    localStorage.removeItem(key);
  }
};
// autheticate user by pass data to cookie and localstorage
export const authenticate = (data, next) => {
  console.log(data);
  setCookie("token", data.data.token);
  setLocalStorage("user", data.data.user);
  next();
};

export const isAuth = () => {
  if (process.browser) {
    const cookieChecked = getCookie("token");
    if (cookieChecked) {
      if (localStorage.getItem("user")) {
        return JSON.parse(localStorage.getItem("user"));
      } else {
        return false;
      }
    }
  }
};
