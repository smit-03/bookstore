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
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteBookId, setDeleteBookId] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, [currentPage, pageSize, searchKeyword]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll();
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

  const handleImageChange = (imageData) => {
    setSelectedBook((prevselectedBook) => ({
      ...prevselectedBook,
      base64image: imageData,
    }));
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
      setSelectedBook(book);
      setOpen(false);
    } catch (error) {
      toast.error("Failed to fetch book details");
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
      await deleteBook(deleteBookId);
      toast.success("Book deleted successfully");
      fetchBooks();
      setSelectedBook(null);
      setOpen(false);
      setDeleteBookId(null);
    } catch (error) {
      toast.error("Failed to delete book");
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
    } catch (error) {
      toast.error("Failed to save book");
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
            onClick={() => {
              console.log("addclick");
              setSelectedBook({ id: 0 });
            }}
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
                  <RegLogButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="secondary"
                    onClick={() => console.log("save")}
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
    </Box>
  );
};

export default Book;
