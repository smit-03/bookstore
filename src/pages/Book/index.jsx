import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
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
  base64image: Yup.mixed().required("image is required"),
});

const Book = () => {
  const [books, setBooks] = useState([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [editingBook, setEditingBook] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  //   const [selectedImage, setSelectedImage] = useState(
  //     editingBook?.base64image || null
  //   );
  const [deleteBookId, setDeleteBookId] = useState(null);
  const [categories, setCategories] = useState([]);

  const initialValues = {
    id: editingBook?.id || 0,
    name: editingBook?.name || "",
    price: editingBook?.price || "",
    categoryId: editingBook?.categoryId || 0,
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

  const handlePageChange = async (event, page) => {
    setCurrentPage(page);
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
      console.log(error);
      toast.error("Failed to delete book");
    }
  };

  const handleSaveBook = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);
      if (values.id !== 0) {
        await updateBook(values.id, values);
        toast.success("Book updated successfully");
      } else {
        console.log(values);
        await addBook(values);
        toast.success("Book added successfully");
      }
      fetchBooks();
      setEditingBook(null);
    } catch (error) {
      console.log(error);
      toast.error("Failed to save book");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingBook(null);
  };

  return (
    <Box mt={4} mx={2}>
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
                {" "}
                <strong>Book Name</strong>{" "}
              </TableCell>
              <TableCell>
                {" "}
                <strong>Price</strong>{" "}
              </TableCell>
              <TableCell>
                {" "}
                <strong>Category</strong>
              </TableCell>
              <TableCell>
                {" "}
                <strong>Actions</strong>{" "}
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
                    color="primary"
                    onClick={() => handleEditBook(book.id)}
                    style={{ marginRight: "8px" }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
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
        onPageChange={(event, newPage) => handlePageChange(event, newPage)}
        onRowsPerPageChange={(event) => handlePageSizeChange(event)}
        style={{ marginTop: "16px" }}
        labelDisplayedRows={({ from, to, count }) => {
          return `${from}-${to} of ${count}`;
        }}
        labelRowsPerPage="Books per page:"
      />

      <Dialog open={!!editingBook} onClose={handleCancelEdit}>
        <DialogTitle>{editingBook ? "Edit Book" : "Add Book"}</DialogTitle>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSaveBook}
        >
          {({ isSubmitting }) => (
            <Form>
              <DialogContent>
                <Field
                  as={TextField}
                  name="name"
                  label="Book Name"
                  variant="outlined"
                  fullWidth
                />
                <ErrorMessage name="name" component="div" />
                <Field
                  as={TextField}
                  name="price"
                  label="Price"
                  variant="outlined"
                  fullWidth
                />
                <ErrorMessage name="price" component="div" />
                <FormControl fullWidth variant="outlined" marginBottom="1rem">
                  <InputLabel id="category-label">Category</InputLabel>
                  <Field
                    as={Select}
                    name="categoryId"
                    labelId="category-label"
                    label="Category"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Field>
                  <ErrorMessage name="categoryId" component="div" />
                </FormControl>
                <Field
                  as={TextField}
                  name="description"
                  label="Description"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                />
                <ErrorMessage name="description" component="div" />
              </DialogContent>
              <DialogActions>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCancelEdit}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </DialogActions>
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
