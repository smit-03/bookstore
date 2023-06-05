import React, { useEffect, useState } from "react";
import { TextField, Container, MenuItem } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import authService from "../../service/auth.service";
import { toast } from "react-toastify";
import { RoutePaths } from "../../utils/enum";
import { useAuthContext } from "../../context/auth.context";
import userService from "../../service/user.service";
import {
  RegFormContainer,
  FieldWrapper,
  StyledButton,
  PageTitle,
} from "../../style";
import Loading from "../../Components/Loading";

const UpdateProfile = () => {
  const [loading, setLoading] = useState(false);
  const authContext = useAuthContext();
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(5, "Password must be at least 5 characters long"),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const userProfile = await userService.getById(authContext.user.id);
        const { password, ...userProfileWithoutPassword } = userProfile;
        setInitialValues(userProfileWithoutPassword);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch user profile");
        setLoading(false);
      }
    };

    if (!authContext.user.id) {
      navigate(RoutePaths.home);
    } else {
      fetchUserProfile();
    }
  }, [authContext.user, authContext.user.id, navigate]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const updatedUser = {
        id: authContext.user.id,
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        roleId: authContext.user.roleId,
        role: authContext.user.role,
        password: values.password,
      };
      await userService.update(updatedUser);
      toast.success("User updated successfully");
      setLoading(false);
      authContext.signOut();
      navigate(RoutePaths.login);
    } catch (error) {
      toast.error("Failed to update user");
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    navigate(RoutePaths.home);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Loading />
      </div>
    );
  }

  return (
    <Container component="main">
      <RegFormContainer>
        <PageTitle mb={4} mt={3}>
          Profile
        </PageTitle>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form style={{ marginTop: "3rem" }}>
              <FieldWrapper style={{ marginBottom: "3rem" }}>
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
              <FieldWrapper style={{ width: "49.3%", marginBottom: "3rem" }}>
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
              </FieldWrapper>
              <FieldWrapper>
                <Field
                  as={TextField}
                  variant="outlined"
                  fullWidth
                  id="password"
                  name="password"
                  type="password"
                  label="New Password"
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
              <FieldWrapper>
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
            </Form>
          )}
        </Formik>
      </RegFormContainer>
    </Container>
  );
};

export default UpdateProfile;
