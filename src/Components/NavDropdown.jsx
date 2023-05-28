import React from "react";
import { Menu, MenuItem, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { RoutePaths } from "../utils/enum";

const NavDropdown = ({ anchorEl, handleMenuOpen, handleMenuClose }) => {
  return (
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        aria-controls="dropdown-menu"
        aria-haspopup="true"
        onClick={handleMenuOpen}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="dropdown-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem
          component={Link}
          to={RoutePaths.home}
          onClick={handleMenuClose}
        >
          Home
        </MenuItem>
        <MenuItem
          component={Link}
          to={RoutePaths.about}
          onClick={handleMenuClose}
        >
          About
        </MenuItem>
        <MenuItem
          component={Link}
          to={RoutePaths.contact}
          onClick={handleMenuClose}
        >
          Contact
        </MenuItem>
      </Menu>
    </>
  );
};

export default NavDropdown;
