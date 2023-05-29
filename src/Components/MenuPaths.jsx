import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Error from "../pages/Error";
import { RoutePaths } from "../utils/enum";

const MenuRoutePaths = () => {
  return (
    <>
      <Routes>
        <Route exact path={RoutePaths.home} element={<Home />} />
        <Route exact path={RoutePaths.login} element={<Login />} />
        <Route exact path={RoutePaths.register} element={<Register />} />
        <Route exact path={RoutePaths.about} element={<About />} />
        <Route exact path={RoutePaths.contact} element={<Contact />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
};
export default MenuRoutePaths;
