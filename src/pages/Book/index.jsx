import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
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
  Box,
  MenuItem,
} from "@mui/material";
import ImageField from "./ImageField";
import { FieldWrapper, RegLogButton } from "../../style";
import { toast } from "react-toastify";

import {
  getAllCategories,
  getAllBooksOfKeyword,
  getAllPaginatedBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
} from "../../service/book.service";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Book Name is required"),
  price: Yup.number().required("Price is required"),
  categoryId: Yup.number().required("Category is required"),
  description: Yup.string().required("Description is required"),
  base64image: Yup.mixed().required("Image is required"),
});

const Book = () => {
  const [books, setBooks] = useState([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [editingBook, setEditingBook] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [deleteBookId, setDeleteBookId] = useState(null);
  const [categories, setCategories] = useState([]);

  const initialValues = {
    id: editingBook?.id || 0,
    name: editingBook?.name || "",
    price: editingBook?.price || "",
    categoryId: editingBook?.categoryId || "",
    description: editingBook?.description || "",
    base64image: editingBook?.base64image || null,
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, [currentPage, pageSize, searchKeyword]);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  const fetchBooks = async () => {
    try {
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
    } catch (error) {
      toast.error("Failed to fetch books");
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
      const book = await getBookById(bookId);
      setEditingBook(book);
      setDeleteConfirmationOpen(false);
    } catch (error) {
      toast.error("Failed to fetch book details");
    }
  };

  const handleDeleteConfirmationOpen = (bookId) => {
    setDeleteBookId(bookId);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmationClose = () => {
    setDeleteBookId(null);
    setDeleteConfirmationOpen(false);
  };

  const handleDeleteBook = async () => {
    try {
      await deleteBook(deleteBookId);
      toast.success("Book deleted successfully");
      fetchBooks();
      setEditingBook(null);
      setDeleteConfirmationOpen(false);
      setDeleteBookId(null);
    } catch (error) {
      toast.error("Failed to delete book");
    }
  };

  const handleSaveBook = async (values) => {
    console.log(values);
    try {
      delete values.category;
      if (values.id !== 0) {
        await updateBook(values.id, values);
        toast.success("Book updated successfully");
      } else {
        await addBook(values);
        toast.success("Book added successfully");
      }
      fetchBooks();
      setEditingBook(null);
    } catch (error) {
      toast.error("Failed to save book");
    }
  };
  const handleCancelEdit = () => {
    setEditingBook(null);
  };

  return (
    <Box mt={4} mx={6}>
      <Typography variant="h4" align="center" mb={4}>
        Book Page
      </Typography>
      <Grid container justifyContent="flex-end" alignItems="center" mb={2}>
        <Grid item marginRight={2}>
          <TextField
            label="Search"
            variant="outlined"
            value={searchKeyword}
            onChange={handleSearchChange}
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setEditingBook({})}
          >
            Add
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
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
                <Typography variant="h6" style={{ color: "#1bbb0c" }}>
                  Actions
                </Typography>
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
                    onClick={() => handleDeleteConfirmationOpen(book.id)}
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

      <Dialog open={!!editingBook} onClose={handleCancelEdit}>
        <DialogTitle>Book Form</DialogTitle>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSaveBook}
        >
          {({ errors, touched }) => (
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
                    error={touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                  />
                  <Field
                    as={TextField}
                    variant="outlined"
                    fullWidth
                    id="price"
                    name="price"
                    label="Price"
                    error={touched.price && !!errors.price}
                    helperText={touched.price && errors.price}
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
                    error={touched.categoryId && !!errors.categoryId}
                    helperText={touched.categoryId && errors.categoryId}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Field>
                  <ImageField
                    id="bookimg"
                    name="base64image"
                    initialImage={editingBook?.base64image || null}
                    label="Book Image"
                    error={touched.base64image && !!errors.base64image}
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
                    error={touched.description && !!errors.description}
                    helperText={touched.description && errors.description}
                  />
                </FieldWrapper>

                <FieldWrapper>
                  <RegLogButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="secondary"
                  >
                    Save
                  </RegLogButton>
                  <RegLogButton
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </RegLogButton>
                </FieldWrapper>
              </DialogContent>
            </Form>
          )}
        </Formik>
      </Dialog>

      <Dialog
        open={deleteConfirmationOpen}
        onClose={handleDeleteConfirmationClose}
      >
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
          <Button variant="contained" onClick={handleDeleteConfirmationClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Book;
