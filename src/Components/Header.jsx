import React, { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useNavigate } from "react-router-dom";
import { RoutePaths } from "../utils/enum";
import { SearchBar, SearchResultsList } from "./searchBar";
import { searchBook } from "../service/book.service";
import NavDropdown from "./NavDropdown";
import NavigationLinks from "./NavigationLinks";
import {
  HeaderContainer,
  SLOButton,
  CounteItem,
  ResultContainer,
  NavigationButton,
} from "../assets/styles/HeaderStyle";
import { useAuthContext } from "../context/auth.context";
import Logo from "./Logo";
import { useCartContext } from "../context/cart.context";
import { toast } from "react-toastify";
import shared from "../utils/shared";

const Header = () => {
  const authContext = useAuthContext();
  const cartContext = useCartContext();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [input, setInput] = useState("");
  const [searchBarRef, setSearchBarRef] = useState(null);
  const resultsListRef = useRef(null);

  const [authContextUpdated, setAuthContextUpdated] = useState(false);

  useEffect(() => {
    console.log(authContext.user);
    setAuthContextUpdated((prevState) => !prevState);
  }, [authContext]);

  useEffect(() => {
    if (input.trim() === "") {
      setShowResults(false);
      setSearchResults([]);
    }
  }, [input]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        resultsListRef.current &&
        !resultsListRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleSearch = async (value) => {
    setInput(value);
    if (value.trim() !== "") {
      setShowResults(true);
      const delay = setTimeout(async () => {
        try {
          const res = await searchBook(value);
          setSearchResults(res);
        } catch (error) {
          console.error("Error searching for books:", error);
        }
      }, 700);

      return () => {
        clearTimeout(delay);
      };
    } else {
      setShowResults(false);
      setSearchResults([]);
    }
  };

  const addToCart = (book) => {
    if (!authContext.user.id) {
      navigate(RoutePaths.login);
      toast.error("Please Login");
    } else
      shared.addToCart(book, authContext.user.id).then((res) => {
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success("Item added in Cart");
          cartContext.updateCart();
        }
      });
  };

  const isTabletOrSmaller = useMediaQuery((theme) =>
    theme.breakpoints.down("md")
  );
  const theme = useTheme();
  const [anchorSrp, setAnchorSrp] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorSrp(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorSrp(null);
  };

  return (
    <>
      <HeaderContainer>
        <AppBar position="static">
          <Toolbar>
            {/* MenuIcon */}
            {isTabletOrSmaller ? (
              <NavDropdown
                anchorEl={anchorSrp}
                handleMenuOpen={handleMenuOpen}
                handleMenuClose={handleMenuClose}
              />
            ) : null}

            {/* Logo */}

            <Logo />

            {/* Home Icon */}

            <Link to={RoutePaths.home}>
              <HomeRoundedIcon
                style={{
                  fontSize: "2.2rem",
                  marginRight: "1rem",
                  color: "#fdfff1",
                }}
              />
            </Link>

            {/* Navlinks */}
            {!isTabletOrSmaller && <NavigationLinks key={authContextUpdated} />}

            {/* Searchbar */}
            <SearchBar
              onSearch={handleSearch}
              setInput={setInput}
              setRef={setSearchBarRef} // Pass the setSearchBarRef function as a prop
            />

            {/* SignIn/Logout-button/Icon */}
            {authContext.user.id ? (
              isTabletOrSmaller ? (
                <IconButton onClick={authContext.signOut}>
                  <LogoutIcon
                    style={{
                      border: "2px solid #fdfff1",
                      borderRadius: "50%",
                      marginLeft: theme.spacing(1),
                      padding: "5px",
                      color: "#fdfff1",
                    }}
                  />
                </IconButton>
              ) : (
                <SLOButton variant="outlined" onClick={authContext.signOut}>
                  Logout
                </SLOButton>
              )
            ) : isTabletOrSmaller ? (
              <Link to={RoutePaths.register}>
                <PersonAddIcon
                  style={{
                    border: "2px solid #fdfff1",
                    borderRadius: "50%",
                    marginLeft: theme.spacing(1),
                    padding: "5px",
                    color: "#fdfff1",
                  }}
                />
              </Link>
            ) : (
              <>
                {!authContext.user.id && (
                  <NavigationButton
                    color="inherit"
                    component={Link}
                    to={RoutePaths.login}
                    style={{
                      fontSize: "1rem",
                      fontFamily: "Roboto,Helvetica, Arial, sans-serif",
                      marginLeft: "1rem",
                      fontWeight: "700",
                      boxShadow: "0px 0px 4px #cd0000aa",
                      borderRadius: "15px",
                    }}
                  >
                    Login
                  </NavigationButton>
                )}
                <SLOButton
                  variant="outlined"
                  component={Link}
                  to={RoutePaths.register}
                >
                  Sign Up
                </SLOButton>
              </>
            )}

            {/* CartIcon */}
            <IconButton
              color="inherit"
              aria-label="cart"
              style={{
                height: "5vh",
                paddingRight: 0,
              }}
              onClick={() => navigate(RoutePaths.cart)}
            >
              <ShoppingCartIcon />
              <CounteItem>
                {authContext.user.id ? cartContext.cartData.length : ""}
              </CounteItem>
            </IconButton>
          </Toolbar>
        </AppBar>
      </HeaderContainer>
      {showResults && searchResults && (
        <ResultContainer ref={resultsListRef}>
          <SearchResultsList results={searchResults} addToCart={addToCart} />
        </ResultContainer>
      )}
    </>
  );
};

export default Header;
