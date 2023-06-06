import React, { useState, useEffect } from "react";
import { TextField, Typography, Container, MenuItem } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import authService from "../../service/auth.service";
import { toast } from "react-toastify";
import { RoutePaths } from "../../utils/enum";
import Loading from "../../Components/Loading";
import {
  RegFormContainer,
  FieldWrapper,
  BreadcrumbsContainer,
  SectionTitle,
  StyledButton,
  PageTitle,
} from "../../style";
import { useAuthContext } from "../../context/auth.context";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);
  const authContext = useAuthContext();

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

  useEffect(() => {
    if (authContext.user.id) {
      navigate(RoutePaths.home);
    }
  }, [authContext.user, navigate]);

  const handleSubmit = (data) => {
    setloading(true);
    console.log(data);
    delete data.id;
    delete data.confirmPassword;

    authService
      .create(data)
      .then((res) => {
        console.log("Registered!!");
        toast.success("Successfully Registered");
        setloading(false);
        navigate(RoutePaths.login);
      })
      .catch((error) => {
        toast.error();
        setloading(false);
      });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container component="main">
      <RegFormContainer>
        <BreadcrumbsContainer separator="›" aria-label="breadcrumb">
          <Link
            to={RoutePaths.login}
            style={{ textDecoration: "none", color: "#fb3c3c" }}
          >
            Login
          </Link>
          <Typography color="textPrimary">Register</Typography>
        </BreadcrumbsContainer>
        <PageTitle mb={4} mt={3}>
          Register
        </PageTitle>

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
                  <MenuItem value="2">Seller</MenuItem>
                  <MenuItem value="3">Buyer</MenuItem>
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
                <Link to={RoutePaths.login} style={{ color: "#fb3c3c" }}>
                  Already have an account??
                </Link>
              </div>
              <StyledButton
                type="submit"
                variant="contained"
                color="secondary"
                style={{ marginTop: "2rem" }}
              >
                Register
              </StyledButton>
            </Form>
          )}
        </Formik>
      </RegFormContainer>
    </Container>
  );
};

export default Register;
