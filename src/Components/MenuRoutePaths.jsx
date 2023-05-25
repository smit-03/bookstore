import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import About from "../pages/About";
import Contact from "../pages/Contact";

export const RoutePaths = {
  home: "/",
  login: "/login",
  register: "/register",
  about: "/about",
  contact: "/contact",
};

const MenuRoutePaths = () => {
  return (
    <>
      <Routes>
        <Route exact path={RoutePaths.home} element={<Home />} />
        <Route exact path={RoutePaths.login} element={<Login />} />
        <Route exact path={RoutePaths.register} element={<Register />} />
        <Route exact path={RoutePaths.about} element={<About />} />
        <Route exact path={RoutePaths.contact} element={<Contact />} />
      </Routes>
    </>
  );
};
export default MenuRoutePaths;
