import React from "react";
import Header from "./Components/Header";
import { ThemeProvider } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { PageContainer } from "./style";
import MenuRoutePaths from "./Components/MenuPaths";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { theme } from "./utils/theme";
import Footer from "./Components/Footer";
import { AuthWrapper } from "./context/auth.context";
import { CartWrapper } from "./context/cart.context";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <AuthWrapper>
          <CartWrapper>
            <ThemeProvider theme={theme}>
              <ToastContainer autoClose={2000} style={{ marginTop: "6vh" }} />
              <Header />
              <PageContainer>
                <MenuRoutePaths />
              </PageContainer>
              <Footer />
            </ThemeProvider>
          </CartWrapper>
        </AuthWrapper>
      </BrowserRouter>
    </>
  );
};

export default App;
