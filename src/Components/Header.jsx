import React, { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Link } from "react-router-dom";
import { RoutePaths } from "../utils/enum";
import { SearchBar, SearchResultsList } from "./searchBar/searchBar";
import { searchBook } from "../service/book.service";
import NavDropdown from "./NavDropdown";
import NavigationLinks from "./NavigationLinks";
import {
  HeaderContainer,
  Title,
  SigninButton,
  CounteItem,
  ResultContainer,
} from "./HeaderStyle";

const Header = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [input, setInput] = useState("");
  const resultsListRef = useRef(null);

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
      await searchBook(value)
        .then((res) => {
          setSearchResults(res);
        })
        .catch((error) => {
          console.error("Error searching for books:", error);
        });
    } else {
      setShowResults(false);
      setSearchResults([]);
    }
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

            <Title variant="h6">myBooks</Title>

            {/* Navlinks */}
            {!isTabletOrSmaller && <NavigationLinks />}

            {/* Searchbar */}
            <SearchBar onSearch={handleSearch} setInput={setInput} />

            {/* SignIn button/Icon */}
            {isTabletOrSmaller ? (
              <Link to={RoutePaths.register}>
                <PersonAddIcon
                  style={{
                    border: "2px solid white",
                    borderRadius: "50%",
                    marginLeft: theme.spacing(1),
                    padding: "5px",
                    color: "white",
                  }}
                />
              </Link>
            ) : (
              <SigninButton
                variant="outlined"
                component={Link}
                to={RoutePaths.register}
              >
                Sign In
              </SigninButton>
            )}

            {/* CartIcon */}
            <IconButton
              color="inherit"
              aria-label="cart"
              style={{
                marginLeft: theme.spacing(2),
                height: "5vh",
              }}
            >
              <ShoppingCartIcon />
              <CounteItem>0</CounteItem>
            </IconButton>
          </Toolbar>
        </AppBar>
      </HeaderContainer>
      {showResults && searchResults && (
        <ResultContainer ref={resultsListRef}>
          <SearchResultsList results={searchResults} />
        </ResultContainer>
      )}
    </>
  );
};

export default Header;
