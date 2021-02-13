import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { isAuth } from "./auth";

const Admin = ({ children }) => {
  let history = useHistory();
  useEffect(() => {
    if (!isAuth()) {
      history.push("/signin");
    } else if (isAuth().role !== 1) {
      history.push("/");
    }
  }, []);
  return <>{children}</>;
};

export default Admin;
