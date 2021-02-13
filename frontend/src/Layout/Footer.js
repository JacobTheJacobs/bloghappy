import React from "react";

const Footer = () => {
  const getDate = () => <span>{new Date().getFullYear()}</span>;
  return (
    <footer id="main-footer" className="bg-dark text-white mt-5 p-5">
      <div className="container">
        <div className="row">
          <div className="col">
            <p className="lead text-center">
              Copyright &copy;
              {getDate()}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
