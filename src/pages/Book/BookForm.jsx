import React, { useEffect, useState } from "react";
import { TextField, Typography, Container, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import authService from "../../service/auth.service";
import { toast } from "react-toastify";
import { RoutePaths } from "../../utils/enum";
import {
  RegFormContainer,
  FieldWrapper,
  RegLogButton,
  StyledCircularProgress,
} from "../../style";
import ImageField from "./ImageField";
import {
  addBook,
  updateBook,
  getAllCategories,
} from "../../service/book.service";
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Book Name is required"),
  price: Yup.number().required("Price is required"),
  categoryId: Yup.number().required("Category is required"),
  description: Yup.string().required("Description is required"),
  base64image: Yup.mixed().required("image is required"),
});

const initialValues = {
  id: editingBook?.id || 0,
  name: editingBook?.name || "",
  price: editingBook?.price || "",
  categoryId: editingBook?.categoryId || 0,
  description: editingBook?.description || "",
  base64image: editingBook?.base64image || null,
};

const BookForm = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSaveBook = async (values) => {
    try {
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

  return (
    <Container component="main">
      <RegFormContainer>
        <Typography component="h1" variant="h4" align="center" marginY="2rem">
          Book Form
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSaveBook}
        >
          {({ errors, touched }) => (
            <Form>
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
                  label="Role"
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
                  fullWidth
                  id="bookimg"
                  name="base64image"
                  label="Book Image"
                  error={touched.base64image && !!errors.base64image}
                  helperText={touched.base64image && errors.base64image}
                />
              </FieldWrapper>

              <Field
                as={TextField}
                variant="outlined"
                fullWidth
                id="description"
                name="description"
                type="description"
                label="Description"
                error={touched.description && !!errors.description}
                helperText={touched.description && errors.description}
              />
              <RegLogButton
                type="submit"
                variant="contained"
                color="secondary"
                style={{ marginTop: "2rem" }}
                disabled={loading}
              >
                {loading && <StyledCircularProgress size={20} />}
                Save
              </RegLogButton>
              <RegLogButton
                type="submit"
                variant="contained"
                color="secondary"
                style={{ marginTop: "2rem" }}
                disabled={loading}
                onClick={handleCancelEdit}
              >
                Cancel
              </RegLogButton>
            </Form>
          )}
        </Formik>
      </RegFormContainer>
    </Container>
  );
};

export default BookForm;
