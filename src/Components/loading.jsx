import React from "react";
import { showLoader, hideLoader } from "../service/request";
import "../assets/styles/Loading.css";

const Loading = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-container">
        <div className="dot dot-1"></div>
        <div className="dot dot-2"></div>
        <div className="dot dot-3"></div>
      </div>
    </div>
  );
};

Loading.show = showLoader;
Loading.hide = hideLoader;

export default Loading;
