import React from "react";
import { Container, Breadcrumbs } from "@mui/material";
import { styled } from "@mui/system";
import { TextField, Typography, Button } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import authService from "../../service/auth.service";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { RoutePaths } from "../../Components/MenuRoutePaths";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(4, "Password must be at least 4 characters long"),
});

const initialValues = {
  email: "",
  password: "",
};

const MainContainer = styled("div")`
  display: flex;
  flex-direction: row;
  margin: 2rem;
  justify-content: space-between;
`;

const FormContainer = styled("div")`
  display: flex;
  flex-direction: column;
  margin: 2rem;
  flex: 1;
  width: 100%;
`;

const InfoContainer = styled("div")`
  display: flex;
  flex-direction: column;
  margin: 2rem;
  font-size: 18px;
  flex: 1;
  width: 100%;
`;

const SectionTitle = styled("h2")`
  margin-bottom: 2.5rem;
  font-weight: 400;
  position: relative;
  font-size: 2vw;
  &::after {
    content: "";
    position: absolute;
    bottom: -13px;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: rgba(0, 0, 0, 0.1);
  }
`;
const LoginButton = styled(Button)`
  align-self: flex-start;
  margin-top: auto;
  background-color: red;
`;

const BreadcrumbsContainer = styled(Breadcrumbs)`
  margin: auto;
  margin-right: 35vw;
  display: flex;
  align-items: center;
`;

const Login = () => {
  const handleSubmit = (data) => {
    console.log(data);
    delete data.id;

    authService
      .login(data)
      .then(() => {
        console.log("Logged In!!");
        toast.success("Successfully Loged In");
      })
      .catch(() => {
        toast.error();
      });
  };

  return (
    <Container component="main">
      <FormContainer>
        <BreadcrumbsContainer separator="›" aria-label="breadcrumb">
          <Typography color="textPrimary">Login</Typography>
          <Link
            to={RoutePaths.register}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Register
          </Link>
        </BreadcrumbsContainer>
        <MainContainer>
          <InfoContainer>
            <SectionTitle>New Customer</SectionTitle>
            <div>
              <Link to={RoutePaths.register} style={{ textDecoration: "none" }}>
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
            <LoginButton variant="contained" color="primary">
              <Link
                to={RoutePaths.register}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Create New Account
              </Link>
            </LoginButton>
          </InfoContainer>
          <FormContainer>
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
                  <LoginButton
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Login
                  </LoginButton>
                </Form>
              )}
            </Formik>
          </FormContainer>
        </MainContainer>
      </FormContainer>
    </Container>
  );
};

export default Login;
