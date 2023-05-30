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
// import { CartProvider } from "./context/cart.context";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <AuthWrapper>
          {/* <CartProvider> */}
          <ThemeProvider theme={theme}>
            <ToastContainer />
            <Header />
            <PageContainer>
              <MenuRoutePaths />
            </PageContainer>
            <Footer />
          </ThemeProvider>
          {/* </CartProvider> */}
        </AuthWrapper>
      </BrowserRouter>
    </>
  );
};

export default App;
