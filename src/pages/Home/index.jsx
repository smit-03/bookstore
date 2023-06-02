import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Button,
  Pagination,
} from "@mui/material";
import { BookCard, BookImage, BookName, BookSub } from "../../style";
import BookDetailsOverlay from "./BookDetailsOverlay";
import {
  getAllPaginatedBooks,
  getAllBooksOfKeyword,
} from "../../service/book.service";

const BookListing = () => {
  const [books, setBooks] = useState([]);
  const [pageSize, setPageSize] = useState(8);
  const [keyword, setKeyword] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const openBookDetails = (book) => {
    setSelectedBook(book);
  };

  const closeBookDetails = () => {
    setSelectedBook(null);
  };

  const [sortedBooks, setSortedBooks] = useState([]);

  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 1000);

    return () => {
      clearTimeout(delay);
    };
  }, [keyword]);

  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      try {
        let response;
        if (!debouncedKeyword || debouncedKeyword === "") {
          response = await getAllPaginatedBooks(pageSize, currentPage);
        } else {
          response = await getAllBooksOfKeyword(
            pageSize,
            currentPage,
            debouncedKeyword
          );
        }
        const { items, totalItems } = response;
        setBooks(items);
        setTotalCount(totalItems);
      } catch (error) {
        console.error("Error loading books:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [pageSize, currentPage, debouncedKeyword]);

  useEffect(() => {
    sortBooks();
  }, [sortOrder, books]);

  const sortBooks = () => {
    const sortedBooks = [...books];
    sortedBooks.sort((a, b) => {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });
    setSortedBooks(sortedBooks);
  };

  const handleSearchChange = (event) => {
    setKeyword(event.target.value);
    setCurrentPage(1);
  };

  const handleSortOrder = (e) => {
    setSortOrder(e.target.value);
  };
  const handlePageChange = async (event, page) => {
    setCurrentPage(page);
  };

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
    <Container>
      <Typography variant="h4">Book Listing</Typography>
      <Grid container className="name-wrapper">
        <Grid item xs={6}>
          <Typography variant="h6">
            Total<span> - {totalCount} items</span>
          </Typography>
        </Grid>
        <Grid item className="dropdown-wrapper">
          <FormControl fullWidth>
            <TextField
              id="text"
              name="text"
              placeholder="Search..."
              type="text"
              variant="outlined"
              size="small"
              value={keyword}
              onChange={handleSearchChange}
            />
          </FormControl>
        </Grid>
        <Grid item className="dropdown-wrapper">
          <FormControl>
            <InputLabel id="sort-order-label">Sort Order</InputLabel>
            <Select
              labelId="sort-order-label"
              id="sort-order"
              value={sortOrder}
              onChange={handleSortOrder}
              label="Sort Order"
            >
              <MenuItem value="asc">a - z</MenuItem>
              <MenuItem value="desc">z - a</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={2} className="book-grid">
        {sortedBooks.map((book) => (
          <Grid
            item
            xs={6}
            sm={4}
            md={3}
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
              <BookSub variant="subname1">Rs. {book.price}</BookSub>
              <Button
                variant="contained"
                color="primary"
                size="small"
                style={{ textTransform: "capitalize" }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                Add to Cart
              </Button>
            </BookCard>
          </Grid>
        ))}
      </Grid>
      <Pagination
        count={Math.ceil(totalCount / pageSize)}
        page={currentPage}
        onChange={(event, newPage) => handlePageChange(event, newPage)}
        color="primary"
        style={{ marginTop: "2rem" }}
      />
      <BookDetailsOverlay book={selectedBook} onClose={closeBookDetails} />
    </Container>
  );
};

export default BookListing;
