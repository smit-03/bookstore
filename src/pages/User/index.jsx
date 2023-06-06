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
  MenuItem,
} from "@mui/material";
import {
  FieldWrapper,
  StyledButton,
  SearchField,
  PageTitle,
} from "../../style";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-toastify";

import userService from "../../service/user.service";
import { useAuthContext } from "../../context/auth.context";
import Loading from "../../Components/Loading";

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  roleId: Yup.number().required("Role is required"),
});

const Users = () => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [roles, setRoles] = useState([]);
  const authContext = useAuthContext();
  const [loading, setLoading] = useState(true);

  const loggedInUserId = authContext.user.id;

  useEffect(() => {
    const delay = setTimeout(() => {
      getRoles();
      fetchUsers();
    }, 700);

    return () => {
      clearTimeout(delay);
    };
  }, [currentPage, pageSize, keyword]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let response;
      const pageIndex = currentPage * pageSize + 1;
      if (keyword) {
        console.log("search");
        response = await userService.getAllUsers({
          pageSize,
          pageIndex,
          keyword,
        });
      } else {
        console.log("All");
        response = await userService.getAllUsers({ pageSize, pageIndex });
      }
      setUsers(response.items);
      setTotalUsers(response.totalItems);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch users");
      setLoading(false);
    }
  };

  const getRoles = () => {
    console.log("Roles");
    setLoading(true);
    userService.getAllRoles().then((res) => {
      if (res) {
        console.log(res);
        setRoles(res);
      }
    });
    setLoading(false);
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

  const handleEditUser = async (userid) => {
    setLoading(true);
    try {
      console.log("edit ", userid);
      const user = await userService.getById(userid);
      setSelectedUser(user);
      setOpen(false);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch user details");
      setLoading(false);
    }
  };

  const handleOpen = (userid) => {
    setDeleteUserId(userid);
    setOpen(true);
  };

  const handleClose = () => {
    setDeleteUserId(null);
    setOpen(false);
  };

  const handleDeleteUser = async () => {
    setLoading(true);
    try {
      console.log("del ", deleteUserId);
      await userService.deleteUser(deleteUserId);
      toast.success("User deleted successfully");
      fetchUsers();
      setSelectedUser(null);
      setOpen(false);
      setDeleteUserId(null);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to delete user");
      setLoading(false);
    }
  };

  const handleSaveUser = async (values) => {
    console.log(values);
    const userData = {
      id: values.id,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      roleId: values.roleId,
      role: values.role,
      password: values.password,
    };
    setLoading(true);
    try {
      console.log("update ", userData);
      await userService.update(userData);
      toast.success("User updated successfully");
      fetchUsers();
      setSelectedUser(null);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to save user");
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setSelectedUser(null);
  };

  const initialValues = {
    id: 0,
    email: "",
    lastName: "",
    firstName: "",
    roleId: 3,
    role: "",
    password: "",
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container style={{ marginTop: "15vh" }}>
      <PageTitle mb={4}>Users Page</PageTitle>
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
                  First Name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" style={{ color: "#1bbb0c" }}>
                  Last Name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" style={{ color: "#1bbb0c" }}>
                  Email
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" style={{ color: "#1bbb0c" }}>
                  Role
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
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.roleId}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleEditUser(user.id)}
                    style={{ marginRight: "8px" }}
                  >
                    Edit
                  </Button>
                  {loggedInUserId !== user.id && (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleOpen(user.id)}
                    >
                      Delete
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={totalUsers}
        rowsPerPage={pageSize}
        page={currentPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handlePageSizeChange}
        style={{ marginTop: "16px" }}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} of ${count}`
        }
        labelRowsPerPage="Users per page:"
      />

      <Dialog open={!!selectedUser} onClose={handleCancelEdit}>
        <DialogTitle>User Form</DialogTitle>
        <Formik
          initialValues={selectedUser || initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSaveUser}
        >
          {({ errors, touched }) => (
            <Form>
              <DialogContent>
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
                    {roles.length > 0 &&
                      roles.map((role) => (
                        <MenuItem value={role.id} key={"name" + role.id}>
                          {role.name}
                        </MenuItem>
                      ))}
                  </Field>
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
              </DialogContent>
            </Form>
          )}
        </Formik>
      </Dialog>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this user?
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={handleDeleteUser}
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

export default Users;
