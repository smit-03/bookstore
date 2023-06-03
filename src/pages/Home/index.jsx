import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Pagination,
} from "@mui/material";
import {
  BookCard,
  BookImage,
  BookName,
  BookSub,
  SearchField,
  PageTitle,
} from "../../style";
import { styled } from "@mui/system";
import SearchIcon from "@mui/icons-material/Search";
import BookDetailsOverlay from "./BookDetailsOverlay";
import {
  getAllPaginatedBooks,
  getAllBooksOfKeyword,
} from "../../service/book.service";
import Loading from "../../Components/Loading";

const BookListing = () => {
  const [books, setBooks] = useState([]);
  const [pageSize, setPageSize] = useState(8);
  const [keyword, setKeyword] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedBook, setSelectedBook] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

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
    }, 700);

    return () => {
      clearTimeout(delay);
    };
  }, [keyword]);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
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
        setLoading(false);
      } catch (error) {
        console.error("Error loading books:", error);
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
        <Loading />
      </div>
    );
  }
  const StyledTextField = styled(TextField)`
    .MuiSelect-root {
      padding-top: 6px;
      padding-bottom: 6px;
    }
  `;

  return (
    <Container style={{ marginTop: "15vh" }}>
      <PageTitle mb={4}>Book List</PageTitle>
      <Grid container>
        <Grid container justifyContent="flex-end" alignItems="center" mb={2}>
          <Grid
            item
            xs={6}
            alignSelf="flex-start"
            paddingTop="10px"
            marginRight="auto"
          >
            <Typography variant="h6">
              Total<span> - {totalCount} items</span>
            </Typography>
          </Grid>
          <Grid item marginRight={2}>
            <SearchField name="searchField">
              <input
                type="text"
                placeholder="Search"
                aria-label="Search"
                value={keyword}
                onChange={handleSearchChange}
              />
              <SearchIcon />
            </SearchField>
          </Grid>
          <Grid item>
            <StyledTextField
              variant="outlined"
              fullWidth
              id="sort-order"
              name="sort-order"
              select
              label=""
              value={sortOrder}
              onChange={handleSortOrder}
            >
              <MenuItem value="asc">a - z</MenuItem>
              <MenuItem value="desc">z - a</MenuItem>
            </StyledTextField>
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
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
              <BookImage src={book.base64image} alt={book.name} />
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
        style={{ marginTop: "2rem", marginBottom: "2rem" }}
      />
      <BookDetailsOverlay book={selectedBook} onClose={closeBookDetails} />
    </Container>
  );
};

export default BookListing;
