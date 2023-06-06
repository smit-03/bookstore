import React from "react";
import logo from "../assets/images/site-logo.svg";
import "../assets/styles/Logo.css";
import { Link } from "react-router-dom";
import { RoutePaths } from "../utils/enum";

const Logo = () => {
  return (
    <div className="responsive-logo">
      <Link to={RoutePaths.home}>
        <img src={logo} alt="Smit Pativala" />
      </Link>
    </div>
  );
};

export default Logo;
