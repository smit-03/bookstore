import React, { useState } from "react";
import { styled } from "@mui/material";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Link,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";

const StyledContainer = styled(Container)`
  padding-top: 40px;
  margin: 10vh auto;
`;

const StyledPaper = styled(Paper)`
  padding: 40px;
`;

const StyledTypography = styled(Typography)`
  margin-bottom: 20px;
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 20px;
`;

const StyledButton = styled(Button)`
  margin-top: 10px;
  margin-right: 10px;
`;

const StyledCircularProgress = styled(CircularProgress)`
  margin-right: 10px;
`;

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    // Simulating form submission with a timeout
    setTimeout(() => {
      setLoading(false);
      setShowSnackbar(true);
      setSnackbarSeverity("success");
      setSnackbarMessage("Your message has been submitted successfully!");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 2000);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowSnackbar(false);
  };

  return (
    <StyledContainer maxWidth="md">
      <StyledPaper elevation={3}>
        <StyledTypography variant="h5" component="h1" align="center">
          Contact Customer Service
        </StyledTypography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                label="Your Name"
                variant="outlined"
                fullWidth
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                label="Email Address"
                variant="outlined"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <StyledTextField
                label="Subject"
                variant="outlined"
                fullWidth
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <StyledTextField
                label="Message"
                variant="outlined"
                multiline
                rows={5}
                fullWidth
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <StyledButton
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
              >
                {loading && <StyledCircularProgress size={20} />}
                Submit
              </StyledButton>
              <StyledButton variant="contained" type="reset" disabled={loading}>
                Reset
              </StyledButton>
            </Grid>
          </Grid>
        </form>
        <StyledTypography
          variant="body2"
          align="center"
          marginTop="4vh"
          marginBottom="auto"
        >
          Need immediate assistance? Visit the{" "}
          <Link href="/contact">Customer Service</Link> page for answers to
          common questions.
        </StyledTypography>
      </StyledPaper>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
};

export default ContactPage;
