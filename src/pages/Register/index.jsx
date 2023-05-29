import React, { useState } from "react";
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
  BreadcrumbsContainer,
  SectionTitle,
  RegLogButton,
  StyledCircularProgress,
} from "../../style";

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  roleId: Yup.number().required("Role is required"),
  password: Yup.string()
    .required("Password is required")
    .min(5, "Password must be at least 5 characters long"),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  roleId: "",
  password: "",
  confirmPassword: "",
};

const Register = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (data) => {
    console.log(data);
    delete data.id;
    delete data.confirmPassword;

    setLoading(true); // Set loading to true on form submission

    authService
      .create(data)
      .then(() => {
        console.log("Registered!!");
        toast.success("Successfully Registered");
      })
      .catch(() => {
        toast.error();
      })
      .finally(() => {
        setLoading(false); // Reset loading to false after API call is complete
      });
  };

  return (
    <Container component="main">
      <RegFormContainer>
        <BreadcrumbsContainer separator="›" aria-label="breadcrumb">
          <Link
            to={RoutePaths.login}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Login
          </Link>
          <Typography color="textPrimary">Register</Typography>
        </BreadcrumbsContainer>
        <Typography component="h1" variant="h4" align="center" marginY="2rem">
          Register
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <SectionTitle>Personal Information</SectionTitle>
              <FieldWrapper>
                <Field
                  as={TextField}
                  variant="outlined"
                  fullWidth
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  error={touched.firstName && !!errors.firstName}
                  helperText={touched.firstName && errors.firstName}
                />
                <Field
                  as={TextField}
                  variant="outlined"
                  fullWidth
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  error={touched.lastName && !!errors.lastName}
                  helperText={touched.lastName && errors.lastName}
                />
              </FieldWrapper>

              <FieldWrapper>
                <Field
                  as={TextField}
                  variant="outlined"
                  fullWidth
                  id="email"
                  name="email"
                  label="Email Address"
                  error={touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                />
                <Field
                  as={TextField}
                  variant="outlined"
                  fullWidth
                  id="roleId"
                  name="roleId"
                  select
                  label="Role"
                  error={touched.roleId && !!errors.roleId}
                  helperText={touched.roleId && errors.roleId}
                >
                  <MenuItem value={2}>Seller</MenuItem>
                  <MenuItem value={3}>Buyer</MenuItem>
                </Field>
              </FieldWrapper>

              <SectionTitle>Login Information</SectionTitle>
              <FieldWrapper>
                <Field
                  as={TextField}
                  variant="outlined"
                  fullWidth
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  error={touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                />
                <Field
                  as={TextField}
                  variant="outlined"
                  fullWidth
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  error={touched.confirmPassword && !!errors.confirmPassword}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                />
              </FieldWrapper>
              <div>
                <Link to={RoutePaths.login} style={{ color: "red" }}>
                  Already have an account??
                </Link>
              </div>
              <RegLogButton
                type="submit"
                variant="contained"
                color="secondary"
                style={{ marginTop: "2rem" }}
                disabled={loading}
              >
                {loading && <StyledCircularProgress size={20} />}
                Register
              </RegLogButton>
            </Form>
          )}
        </Formik>
      </RegFormContainer>
    </Container>
  );
};

export default Register;
