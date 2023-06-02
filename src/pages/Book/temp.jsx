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
  getAllBooksOfKeyword,
  getAllPaginatedBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
} from "../../service/book.service";

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
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const initialValues = {
    id: 0,
    name: "",
    description: "",
    categoryId: "",
    price: 0,
    base64image: null,
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize]);

  const fetchData = async () => {
    setLoading(true);
    const response = await getAllPaginatedBooks(currentPage, pageSize);
    setBooks(response.items);
    setTotalBooks(response.totalItems);
    setLoading(false);
  };

  const fetchCategories = async () => {
    const response = await categoryService.getAll();
    setCategories(response);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(+event.target.value);
    setCurrentPage(0);
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const bookData = {
        ...values,
        categoryId: +values.categoryId,
      };
      console.log(bookData);

      if (bookData.id === 0) {
        delete bookData.id;
        console.log("add ", bookData);
        const response = await addBook(bookData);
        setBooks([...books, response.data]);
        toast.success("Book added successfully!");
      } else {
        console.log("edit ", bookData);
        const response = await updateBook(bookData);
        const updatedBooks = books.map((book) =>
          book.id === response.data.id ? response.data : book
        );
        setBooks(updatedBooks);
        toast.success("Book updated successfully!");
      }

      handleClose();
      resetForm();
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleEdit = async (bookId) => {
    try {
      const response = await getBookById(bookId);
      setSelectedBook(response.data);
      setOpen(true);
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleDelete = async (bookId) => {
    try {
      await deleteBook(bookId);
      const updatedBooks = books.filter((book) => book.id !== bookId);
      setBooks(updatedBooks);
      toast.success("Book deleted successfully!");
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBook(null);
  };

  return (
    <>
      <Typography variant="h4" component="h2" gutterBottom>
        Books
      </Typography>
      <Box display="flex" justifyContent="flex-end">
        <RegLogButton onClick={handleClickOpen}>Add Book</RegLogButton>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              books.map((book) => (
                <TableRow key={book.id}>
                  <TableCell>{book.id}</TableCell>
                  <TableCell>{book.name}</TableCell>
                  <TableCell>{book.description}</TableCell>
                  <TableCell>{book.category.name}</TableCell>
                  <TableCell>{book.price}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEdit(book.id)}
                      style={{ marginRight: "10px" }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDelete(book.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15, 20]}
          component="div"
          count={totalBooks}
          rowsPerPage={pageSize}
          page={currentPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handlePageSizeChange}
        />
      </TableContainer>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{selectedBook ? "Edit Book" : "Add Book"}</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={selectedBook || initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {(formik) => (
              <Form>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FieldWrapper>
                      <Field
                        name="name"
                        as={TextField}
                        label="Book Name"
                        fullWidth
                        required
                      />
                    </FieldWrapper>
                  </Grid>
                  <Grid item xs={12}>
                    <FieldWrapper>
                      <Field
                        name="description"
                        as={TextField}
                        label="Description"
                        fullWidth
                        required
                      />
                    </FieldWrapper>
                  </Grid>
                  <Grid item xs={12}>
                    <FieldWrapper>
                      <Field
                        name="categoryId"
                        as={TextField}
                        select
                        label="Category"
                        fullWidth
                        required
                      >
                        {categories.map((category) => (
                          <MenuItem key={category.id} value={category.id}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Field>
                    </FieldWrapper>
                  </Grid>
                  <Grid item xs={12}>
                    <FieldWrapper>
                      <Field
                        name="price"
                        as={TextField}
                        type="number"
                        label="Price"
                        fullWidth
                        required
                      />
                    </FieldWrapper>
                  </Grid>
                  <Grid item xs={12}>
                    <FieldWrapper>
                      <Field
                        name="base64image"
                        component={ImageField}
                        label="Image"
                        value={formik.values.base64image}
                        onImageChange={(imageData) =>
                          formik.setFieldValue("base64image", imageData)
                        }
                      />
                    </FieldWrapper>
                  </Grid>
                  <DialogActions>
                    <Button
                      color="primary"
                      variant="contained"
                      type="submit"
                      disabled={!formik.isValid}
                    >
                      Save
                    </Button>
                    <Button
                      onClick={handleClose}
                      color="secondary"
                      variant="contained"
                    >
                      Cancel
                    </Button>
                  </DialogActions>
                </Grid>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Book;
