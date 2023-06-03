import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { styled } from "@mui/system";

import {
  Typography,
  TextField,
  TableContainer,
  TablePagination,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Container,
} from "@mui/material";
import ImageField from "./ImageField";
import {
  FieldWrapper,
  PageTitle,
  StyledButton,
  SearchField,
} from "../../style";
import { toast } from "react-toastify";
import Loading from "../../Components/Loading";

import {
  getAllBooksOfKeyword,
  getAllPaginatedBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
} from "../../service/book.service";
import SearchIcon from "@mui/icons-material/Search";
import categoryService from "../../service/category.service";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Book Name is required"),
  description: Yup.string().required("Description is required"),
  categoryId: Yup.number()
    .min(1, "Category is required")
    .required("Category is required"),
  price: Yup.number().required("Price is required"),
  base64image: Yup.string().required("Image is required"),
});

const Book = () => {
  const [books, setBooks] = useState([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteBookId, setDeleteBookId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchBooks();
      fetchCategories();
    }, 700);

    return () => {
      clearTimeout(delay);
    };
  }, [currentPage, pageSize, searchKeyword]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAll();
      setCategories(response);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch categories");
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      let response;
      const startIndex = currentPage * pageSize + 1;
      if (searchKeyword) {
        response = await getAllBooksOfKeyword(
          pageSize,
          startIndex,
          searchKeyword
        );
      } else {
        response = await getAllPaginatedBooks(pageSize, currentPage + 1);
      }
      setBooks(response.items);
      setTotalBooks(response.totalItems);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch books");
      setLoading(false);
    }
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
    setCurrentPage(0);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setCurrentPage(0);
  };

  const handleEditBook = async (bookId) => {
    try {
      setLoading(true);
      const book = await getBookById(bookId);
      setSelectedBook(book);
      setOpen(false);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch book details");
      setLoading(false);
    }
  };

  const handleopen = (bookId) => {
    setDeleteBookId(bookId);
    setOpen(true);
  };

  const handleClose = () => {
    setDeleteBookId(null);
    setOpen(false);
  };

  const handleDeleteBook = async () => {
    try {
      setLoading(true);
      await deleteBook(deleteBookId);
      toast.success("Book deleted successfully");
      fetchBooks();
      setSelectedBook(null);
      setOpen(false);
      setDeleteBookId(null);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to delete book");
      setLoading(false);
    }
  };

  const handleSaveBook = async (values) => {
    const bookData = {
      id: values.id,
      name: values.name,
      categoryId: values.categoryId,
      base64image: values.base64image,
      price: values.price,
      description: values.description,
    };
    try {
      setLoading(true);
      if (bookData.id !== 0) {
        console.log("edit ", bookData);
        console.log(bookData.id);
        await updateBook(bookData);
        toast.success("Book updated successfully");
      } else {
        console.log("add ", bookData);
        console.log(bookData.id);
        delete bookData.id;
        await addBook(bookData);
        toast.success("Book added successfully");
      }
      fetchBooks();
      setSelectedBook(null);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to save book");
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setSelectedBook(null);
  };

  const initialValues = {
    id: 0,
    name: "",
    price: "",
    categoryId: "",
    description: "",
    base64image: null,
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

  return (
    <Container style={{ marginTop: "15vh" }}>
      <PageTitle mb={4}>Book Page</PageTitle>
      <Grid container justifyContent="flex-end" alignItems="center" mb={2}>
        <Grid item marginRight={2}>
          <SearchField name="searchField">
            <input
              type="text"
              placeholder="Search"
              aria-label="Search"
              value={searchKeyword}
              onChange={handleSearchChange}
            />
            <SearchIcon />
          </SearchField>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              console.log("addclick");
              setSelectedBook({ id: 0 });
            }}
          >
            Add
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper} style={{ boxShadow: "none" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h6" style={{ color: "#1bbb0c" }}>
                  Book Name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" style={{ color: "#1bbb0c" }}>
                  Price
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" style={{ color: "#1bbb0c" }}>
                  Category
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="h6"
                  style={{ color: "#1bbb0c" }}
                ></Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.id}>
                <TableCell>{book.name}</TableCell>
                <TableCell>{book.price}</TableCell>
                <TableCell>{book.category}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleEditBook(book.id)}
                    style={{ marginRight: "8px" }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleopen(book.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={totalBooks}
        rowsPerPage={pageSize}
        page={currentPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handlePageSizeChange}
        style={{ marginTop: "16px" }}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} of ${count}`
        }
        labelRowsPerPage="Books per page:"
      />

      <Dialog open={!!selectedBook} onClose={handleCancelEdit}>
        <DialogTitle>Book Form</DialogTitle>
        <Formik
          initialValues={selectedBook || initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSaveBook}
        >
          {(formik) => (
            <Form>
              <DialogContent>
                <FieldWrapper>
                  <Field
                    as={TextField}
                    variant="outlined"
                    fullWidth
                    id="name"
                    name="name"
                    label="Book Name"
                    // error={touched.name && !!errors.name}
                    // helperText={touched.name && errors.name}
                  />
                  <Field
                    as={TextField}
                    variant="outlined"
                    fullWidth
                    id="price"
                    name="price"
                    label="Price"
                    type="number"
                    // error={touched.price && !!errors.price}
                    // helperText={touched.price && errors.price}
                  />
                </FieldWrapper>

                <FieldWrapper>
                  <Field
                    as={TextField}
                    variant="outlined"
                    fullWidth
                    id="categoryId"
                    name="categoryId"
                    select
                    label="Category"
                    // error={touched.categoryId && !!errors.categoryId}
                    // helperText={touched.categoryId && errors.categoryId}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Field>
                  <Field
                    component={ImageField}
                    id="bookimg"
                    name="base64image"
                    initialImage={selectedBook?.base64image}
                    label="Book Image"
                    value={formik.values.base64image}
                    onImageChange={(imageData) =>
                      formik.setFieldValue("base64image", imageData)
                    }
                  />
                </FieldWrapper>

                <FieldWrapper>
                  <Field
                    as={TextField}
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    id="description"
                    name="description"
                    label="Description"
                    // error={touched.description && !!errors.description}
                    // helperText={touched.description && errors.description}
                  />
                </FieldWrapper>

                <FieldWrapper>
                  <StyledButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="secondary"
                    onClick={() => console.log("save")}
                  >
                    Save
                  </StyledButton>
                  <StyledButton
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </StyledButton>
                </FieldWrapper>
              </DialogContent>
            </Form>
          )}
        </Formik>
      </Dialog>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this book?
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={handleDeleteBook}
          >
            Delete
          </Button>
          <Button variant="contained" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Book;
