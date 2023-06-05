import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Book from "../pages/Book";
import Users from "../pages/User";
import Categories from "../pages/Category";
import UpdateProfile from "../pages/UpdateProfile";
import Contact from "../pages/Contact";
import Cart from "../pages/Cart";
import Error from "../pages/Error";
import { RoutePaths } from "../utils/enum";

const MenuRoutePaths = () => {
  return (
    <>
      <Routes>
        <Route exact path={RoutePaths.home} element={<Home />} />
        <Route exact path="/home" element={<Home />} />
        <Route exact path={RoutePaths.login} element={<Login />} />
        <Route exact path={RoutePaths.register} element={<Register />} />
        <Route exact path={RoutePaths.book} element={<Book />} />
        <Route exact path={RoutePaths.user} element={<Users />} />
        <Route exact path={RoutePaths.category} element={<Categories />} />
        <Route exact path={RoutePaths.cart} element={<Cart />} />
        <Route
          exact
          path={RoutePaths.updateprofile}
          element={<UpdateProfile />}
        />
        <Route exact path={RoutePaths.contact} element={<Contact />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
};
export default MenuRoutePaths;
