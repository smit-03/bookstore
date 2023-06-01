import React, { useEffect, useState } from "react";
import { Button, CircularProgress, Grid } from "@mui/material";
import { getAllBooks } from "../../service/book.service";
import {
  BookCard,
  BookImage,
  BookName,
  BookSub,
  GridContainer,
} from "../../style";
import BookDetailsOverlay from "./BookDetailsOverlay";
// import { CartContext } from "../../service/cart.context";
import { useAuthContext } from "../../context/auth.context";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { RoutePaths } from "../../utils/enum";

const BookGrid = () => {
  const authContext = useAuthContext();
  // const { addToCart, updateCartItemQuantity, cartItems } =
  //   useContext(CartContext);
  const [selectedBook, setSelectedBook] = useState(null);
  const navigate = useNavigate();

  const openBookDetails = (book) => {
    setSelectedBook(book);
  };

  const closeBookDetails = () => {
    setSelectedBook(null);
  };

  // const handleAddToCart = (book) => {
  //   if (authContext.user.id) {
  //     addToCart(book);
  //   } else {
  //     toast.warning("Please Login to add book in cart");
  //     navigate(RoutePaths.login);
  //   }
  // };

  // const handleRemoveFromCart = (book) => {
  //   updateCartItemQuantity(book, 0);
  // };

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllBooks();
        setBooks(response);
        setLoading(false);
      } catch (error) {
        console.error("Error getting books:", error);
      }
    };

    if (books.length === 0) {
      fetchData();
    }
  }, [books]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <GridContainer>
      <Grid container spacing={2} className="book-grid">
        {books.map((book) => {
          {
            /* const isInCart = cartItems.some((item) => item.id === book.id); */
          }
          return (
            <Grid
              item
              xs={4}
              sm={3}
              md={2}
              key={book.id}
              marginBottom="2vh"
              onClick={() => openBookDetails(book)}
              style={{ cursor: "pointer" }}
            >
              <BookCard elevation={3}>
                <BookImage
                  src={book.base64image}
                  alt={book.name}
                  className="book-image"
                />
                <BookName variant="h6" style={{ fontSize: "1rem" }}>
                  {book.name}
                </BookName>
                <BookSub variant="subtitle1">Rs. {book.price}</BookSub>
                {/* {isInCart ? ( */}
                {/* <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    style={{ textTransform: "capitalize" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromCart(book);
                    }}
                  >
                    Remove
                  </Button>
                ) : ( */}
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  style={{ textTransform: "capitalize" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // handleAddToCart(book);
                  }}
                >
                  Add to Cart
                </Button>
                {/* )} */}
              </BookCard>
            </Grid>
          );
        })}
      </Grid>
      <BookDetailsOverlay book={selectedBook} onClose={closeBookDetails} />
    </GridContainer>
  );
};

export default BookGrid;
