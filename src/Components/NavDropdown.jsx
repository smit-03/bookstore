import { React, useMemo } from "react";
import { styled } from "@mui/system";
import { Menu, MenuItem, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, Route } from "react-router-dom";
import { RoutePaths } from "../utils/enum";
import { useAuthContext } from "../context/auth.context";
import shared from "../utils/shared";

const StyledMenu = styled(Menu)`
  .MuiPaper-root {
    background-color: #414141;
    color: white;
  }
`;

const NavDropdown = ({ anchorEl, handleMenuOpen, handleMenuClose }) => {
  const authContext = useAuthContext();
  const items = useMemo(() => {
    return shared.NavigationItems.filter(
      (item) =>
        !item.access.length || item.access.includes(authContext.user.roleId)
    );
  }, []);
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
      <StyledMenu
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
        {!authContext.user.id && (
          <MenuItem
            component={Link}
            to={RoutePaths.login}
            onClick={handleMenuClose}
            style={{ backgroundColor: "#414141" }}
          >
            Login
          </MenuItem>
        )}
        {items.map((item) => (
          <MenuItem
            component={Link}
            to={item.route}
            onClick={handleMenuClose}
            key={item.route}
          >
            {item.name}
          </MenuItem>
        ))}
        <MenuItem
          component={Link}
          to={RoutePaths.contact}
          onClick={handleMenuClose}
        >
          Contact
        </MenuItem>
      </StyledMenu>
    </>
  );
};

export default NavDropdown;
