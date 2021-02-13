import React from "react";
import { BrowserRouter } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div>
      <BrowserRouter>
        <Navbar />

        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h1>
                <i className="fas fa-cog"></i>
              </h1>
            </div>
          </div>
        </div>

        {children}
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default Layout;
