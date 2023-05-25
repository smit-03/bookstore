import React from "react";
import { styled } from "@mui/system";
import {
  TextField,
  Button,
  Typography,
  Container,
  MenuItem,
  Breadcrumbs,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import authService from "../../service/auth.service";
import { toast } from "react-toastify";
import { RoutePaths } from "../../Components/MenuRoutePaths";

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  roleId: Yup.number().required("Role is required"),
  password: Yup.string()
    .required("Password is required")
    .min(4, "Password must be at least 4 characters long"),
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

//makeStyles is not compatible with 'react-18'. Can use styled compo. instead
/* const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: theme.spacing(4),
    },
    form: {
        width: '100%',
        : theme.spacing(2),
    },
    submitButton: {
        margin: theme.spacing(3, 0, 2),
    },
})); */

const FormContainer = styled("div")`
  display: flex;
  flex-direction: column;
  margin: 2rem;
`;

const SectionTitle = styled("h2")`
  margin-bottom: 2.5rem;
  font-weight: 400;
  position: relative;
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

const FieldWrapper = styled("div")`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const BreadcrumbsContainer = styled(Breadcrumbs)`
  margin: auto;
  display: flex;
  align-items: center;
`;

const RegisterButton = styled(Button)`
  align-self: flex-start;
  margin-top: 2rem;
  background-color: red;
`;

const Register = () => {
  const handleSubmit = (data) => {
    console.log(data);
    // data.roleId === 1 ? data.role = "Buyer" : data.role = "Seller";
    delete data.id;
    delete data.confirmPassword;

    authService
      .create(data)
      .then(() => {
        console.log("Registered!!");
        toast.success("Successfully Registered");
      })
      .catch(() => {
        toast.error();
      });
  };

  // We can use 'useFormik' Hook instead of <Formik> comp. of 'formik'
  /* const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: handleSubmit,
    }); */

  return (
    <Container component="main">
      <FormContainer>
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
                  <MenuItem value={1}>Buyer</MenuItem>
                  <MenuItem value={2}>Seller</MenuItem>
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
                <Link to={RoutePaths.login} style={{ textDecoration: "none" }}>
                  Already have an account??
                </Link>
              </div>
              <RegisterButton type="submit" variant="contained" color="success">
                Register
              </RegisterButton>
            </Form>
          )}
        </Formik>
      </FormContainer>
    </Container>
  );
};

export default Register;
