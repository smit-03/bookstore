import React, { useState, useEffect } from "react";
import { Container } from "@mui/material";
import { TextField, Typography } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import authService from "../../service/auth.service";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { RoutePaths } from "../../utils/enum";
import {
  LogFormContainer,
  BreadcrumbsContainer,
  MainContainer,
  InfoContainer,
  SectionTitle,
  StyledButton,
  PageTitle,
} from "../../style";
import { useAuthContext } from "../../context/auth.context";
import Loading from "../../Components/Loading";

const Login = () => {
  const authContext = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(5, "Password must be at least 5 characters long"),
  });

  const initialValues = {
    email: "",
    password: "",
  };

  useEffect(() => {
    if (authContext.user.id) {
      navigate(RoutePaths.home);
    }
  }, [authContext.user]);

  const handleSubmit = (data) => {
    setLoading(true);
    // console.log(data);
    delete data.id;

    authService
      .login(data)
      .then((res) => {
        console.log("Logged In!!");
        toast.success("Successfully Logged In");
        authContext.setUser(res);
        setLoading(false);
      })
      .catch((error) => {
        toast.error();
        setLoading(false);
      });
  };
  if (loading) {
    return <Loading />;
  }

  return (
    <Container component="main">
      <LogFormContainer>
        <BreadcrumbsContainer
          separator="›"
          aria-label="breadcrumb"
          style={{ marginRight: "35.56vw" }}
        >
          <Typography color="textPrimary">Login</Typography>
          <Link
            to={RoutePaths.register}
            style={{ textDecoration: "none", color: "#fb3c3c" }}
          >
            Register
          </Link>
        </BreadcrumbsContainer>
        <PageTitle mb={4} mt={3} mr={8}>
          Login
        </PageTitle>
        <MainContainer>
          <InfoContainer>
            <SectionTitle>New Customer</SectionTitle>
            <div>
              <Link to={RoutePaths.register} style={{ color: "#fb3c3c" }}>
                Registration is free and easy
              </Link>
            </div>
            <div>
              <ul>
                <li>Faster Checkout</li>
                <li>Save multiple shipping addresses</li>
                <li>view and track orders and more</li>
              </ul>
            </div>
            <StyledButton
              variant="contained"
              color="secondary"
              style={{ marginTop: "auto" }}
            >
              <Link
                to={RoutePaths.register}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Create New Account
              </Link>
            </StyledButton>
          </InfoContainer>
          <LogFormContainer>
            <SectionTitle>Registered Customer</SectionTitle>
            <div style={{ marginBottom: "1rem", fontSize: "18px" }}>
              <span>If you have an account with us, please login</span>
            </div>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form>
                  <Field
                    as={TextField}
                    variant="outlined"
                    fullWidth
                    id="email"
                    name="email"
                    label="Email Address"
                    style={{ margin: "1.5rem 0" }}
                    error={touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                  />
                  <Field
                    as={TextField}
                    variant="outlined"
                    fullWidth
                    id="password"
                    name="password"
                    type="password"
                    label="Password"
                    style={{ margin: "1.5rem 0 4rem 0" }}
                    error={touched.password && !!errors.password}
                    helperText={touched.password && errors.password}
                  />
                  <StyledButton
                    type="submit"
                    variant="contained"
                    color="secondary"
                    style={{ marginTop: "auto" }}
                  >
                    Login
                  </StyledButton>
                </Form>
              )}
            </Formik>
          </LogFormContainer>
        </MainContainer>
      </LogFormContainer>
    </Container>
  );
};

export default Login;
