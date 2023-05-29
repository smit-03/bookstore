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

const BookGrid = () => {
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
        {books.map((book) => (
          <Grid item xs={4} sm={3} md={2} key={book.id} marginBottom="2vh">
            <BookCard elevation={3}>
              <BookImage
                src={book.base64image}
                alt={book.name}
                className="book-image"
              />
              <BookName variant="h6" style={{ fontSize: "1rem" }}>
                {book.name}
              </BookName>
              <BookSub variant="subtitle1">
                {book.description.slice(0, 30)}
              </BookSub>
              <BookSub variant="subtitle1">Rs. {book.price}</BookSub>
              <Button variant="contained" color="primary">
                Add to Cart
              </Button>
            </BookCard>
          </Grid>
        ))}
      </Grid>
    </GridContainer>
  );
};

export default BookGrid;
