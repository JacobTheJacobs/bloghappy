import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const create = (category, token) => {
  console.log(category);
  const request = axios
    .post(
      `/api/category`,
      { name: category },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => {
      return response;
    })
    .catch((err) => console.log(err));
  return request;
};

export const getCategories = () => {
  const request = axios
    .get(`/api/categories`)
    .then((response) => {
      return response;
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

export const singleCategory = (slug, token) => {
  console.log(slug);
  console.log(token);
  const request = axios
    .post(
      `/api/category/${slug}`,
      { slug: slug },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => {
      return response;
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

export const removeCategory = (slug, token) => {
  const request = axios
    .delete(`/api/category/${slug}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      return response;
    })
    .catch((err) => console.log(err));
  return request;
};
