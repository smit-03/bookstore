import React from "react";
import logo from "../assets/images/site-logo.svg";
import "../assets/styles/Logo.css";

const Logo = () => {
  return <img src={logo} alt="Site Logo" className="responsive-logo" />;
};

export default Logo;
