import React, { useState } from "react";
import { styled } from "@mui/system";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  useMediaQuery,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link } from "react-router-dom";

const HeaderContainer = styled("div")`
  background-color: red;
  color: white;
  display: flex;
  align-items: center;
`;

const Title = styled(Typography)`
  font-weight: bold;
  margin-right: 3vw;
`;

const NavigationLinksContainer = styled("div")`
  justify-content: left;
`;

const NavigationButton = styled(Button)`
  && {
    margin-right: 8px;
  }
`;

const SearchForm = styled("form")`
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 4px;
  padding: 3px;
  margin-left: auto;
  width: 35%;

  & input {
    border: none;
    outline: none;
    flex-grow: 1;
    padding: 8px;
    font-size: 16px;
  }
`;

const SearchButton = styled(IconButton)`
  && {
    color: black;
    padding: 8px;
    border-radius: 0;
    &:hover {
      background-color: #f9545454;
    }
  }
`;

const SigninButton = styled(Button)`
  background-color: white;
  color: black;
  margin-left: 1vw;
  text-transform: capitalize;
  font-family: "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji";
  :hover {
    background-color: wheat;
  }
`;

const Header = () => {
  const isTabletOrSmaller = useMediaQuery((theme) =>
    theme.breakpoints.down("sm")
  );
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderNavigationLinks = () => {
    return (
      <NavigationLinksContainer>
        <NavigationButton color="inherit" component={Link} to="/">
          Home
        </NavigationButton>
        <NavigationButton color="inherit" component={Link} to="/about">
          About
        </NavigationButton>
        <NavigationButton color="inherit" component={Link} to="/contact">
          Contact
        </NavigationButton>
      </NavigationLinksContainer>
    );
  };

  const renderDropdownMenu = () => {
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
          <MenuItem component={Link} to="/" onClick={handleMenuClose}>
            Home
          </MenuItem>
          <MenuItem component={Link} to="/about" onClick={handleMenuClose}>
            About
          </MenuItem>
          <MenuItem component={Link} to="/contact" onClick={handleMenuClose}>
            Contact
          </MenuItem>
        </Menu>
      </>
    );
  };

  return (
    <HeaderContainer>
      <AppBar position="static">
        <Toolbar>
          {isTabletOrSmaller ? renderDropdownMenu() : null}
          <Title variant="h6">myBooks</Title>
          {!isTabletOrSmaller && renderNavigationLinks()}
          <SearchForm name="searchForm">
            <input
              type="text"
              placeholder="What are you Looking for??"
              aria-label="Search"
            />
            <SearchButton type="submit" color="inherit" aria-label="search">
              <SearchIcon />
            </SearchButton>
          </SearchForm>
          <SigninButton variant="outlined" component={Link} to="/register">
            Sign In
          </SigninButton>
          <IconButton
            color="inherit"
            aria-label="cart"
            style={{ marginLeft: "0.5vw" }}
          >
            <ShoppingCartIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </HeaderContainer>
  );
};

export default Header;
