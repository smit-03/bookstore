import React from "react";
import Header from "./Components/Header";
import { ThemeProvider } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { PageContainer } from "./style";
import MenuRoutePaths from "./utils/enum";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { theme } from "./utils/theme";
import Footer from "./Components/Footer";

const App = () => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <ToastContainer />
          <Header />
          <PageContainer>
            <MenuRoutePaths />
          </PageContainer>
          <Footer />
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
};

export default App;
