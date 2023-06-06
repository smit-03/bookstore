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
  Container,
} from "@mui/material";
import {
  StyledButton,
  FieldWrapper,
  SearchField,
  PageTitle,
} from "../../style";
import { toast } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";
import categoryService from "../../service/category.service";
import Loading from "../../Components/Loading";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Category Name is required"),
});

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [totalCategories, setTotalCategories] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchCategories();
    }, 700);

    return () => {
      clearTimeout(delay);
    };
  }, [currentPage, pageSize, keyword]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      let response;
      const pageIndex = currentPage * pageSize + 1;
      if (keyword) {
        console.log("search");
        response = await categoryService.getAll({
          pageSize,
          pageIndex,
          keyword,
        });
      } else {
        console.log("All");
        response = await categoryService.getAll({ pageSize, pageIndex });
      }
      setCategories(response.items);
      setTotalCategories(response.totalItems);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch categorys");
      setLoading(false);
    }
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (event) => {
    setKeyword(event.target.value);
    setCurrentPage(0);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setCurrentPage(0);
  };

  const handleEditCategory = async (categoryid) => {
    setLoading(true);
    try {
      console.log("edit ", categoryid);
      const category = await categoryService.getById(categoryid);
      setSelectedCategory(category);
      setOpen(false);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch category details");
      setLoading(false);
    }
  };

  const handleOpen = (categoryid) => {
    setDeleteCategoryId(categoryid);
    setOpen(true);
  };

  const handleClose = () => {
    setDeleteCategoryId(null);
    setOpen(false);
  };

  const handleDeleteCategory = async () => {
    setLoading(true);
    try {
      console.log("del ", deleteCategoryId);
      await categoryService.deleteCategory(deleteCategoryId);
      toast.success("category deleted successfully");
      fetchCategories();
      setSelectedCategory(null);
      setOpen(false);
      setDeleteCategoryId(null);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to delete category");
      setLoading(false);
    }
  };

  const handleSavecategory = async (values) => {
    console.log(values);
    const data = {
      id: values.id,
      name: values.name,
    };
    setLoading(true);
    try {
      console.log("update ", data);
      if (data.id !== 0) {
        await categoryService.updateCategory(data);
        toast.success("category updated successfully");
      } else {
        delete data.id;
        await categoryService.addCategory(data);
        toast.success("category added successfully");
      }
      fetchCategories();
      setSelectedCategory(null);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to save category");
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setSelectedCategory(null);
  };

  const initialValues = {
    id: 0,
    name: "",
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container style={{ marginTop: "15vh" }}>
      <PageTitle mb={4}>Categories</PageTitle>
      <Grid container justifyContent="flex-end" alignItems="center" mb={2}>
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
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              console.log("addclick");
              setSelectedCategory({ id: 0 });
            }}
          >
            Add
          </Button>
        </Grid>
      </Grid>
      <TableContainer
        component={Paper}
        style={{ width: "90%", boxShadow: "none", marginLeft: "4vw" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h6" style={{ color: "#1bbb0c" }}>
                  Category Name
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
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell style={{ justifyItems: "flex-end" }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleEditCategory(category.id)}
                    style={{ marginRight: "8px" }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleOpen(category.id)}
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
        count={totalCategories}
        rowsPerPage={pageSize}
        page={currentPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handlePageSizeChange}
        style={{ marginTop: "16px" }}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} of ${count}`
        }
        labelRowsPerPage="categorys per page:"
      />

      <Dialog open={!!selectedCategory} onClose={handleCancelEdit}>
        <DialogTitle>Category Form</DialogTitle>
        <Formik
          initialValues={selectedCategory || initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSavecategory}
        >
          {({ errors, touched }) => (
            <Form>
              <DialogContent>
                <Field
                  as={TextField}
                  variant="outlined"
                  fullWidth
                  id="name"
                  name="name"
                  label="Category Name"
                  error={touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                />
                <FieldWrapper style={{ marginTop: "4vh" }}>
                  <StyledButton
                    type="submit"
                    variant="contained"
                    color="secondary"
                    onClick={() => console.log("save")}
                  >
                    Save
                  </StyledButton>
                  <StyledButton
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
          Are you sure you want to delete this category?
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={handleDeleteCategory}
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

export default Categories;
