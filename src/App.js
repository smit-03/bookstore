import React from 'react';
import Header from './Components/Header';
import { ThemeProvider } from '@mui/material';
import { BrowserRouter } from "react-router-dom";
import MenuRoutePaths from './Components/MenuRoutePaths';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { theme } from './utils/theme'
const App = () => {

  return (
    <>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <ToastContainer />
          <Header />
          <MenuRoutePaths />
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
};

export default App;
