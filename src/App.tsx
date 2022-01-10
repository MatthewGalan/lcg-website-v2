import React from "react";
import EditorPage from "./components/EditorPage";
import { createTheme, ThemeProvider } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PortalPage from "./components/PortalPage";
import LoginPage from "./components/LoginPage";
import Cookies from "js-cookie";
import RequireAuth from "./components/RequireAuth";

const theme = createTheme({
  typography: {
    fontFamily: '"Poppins", sans-serif',
  },
  palette: {
    primary: {
      main: "#6d8d33",
    },
  },
  shape: {
    borderRadius: 0,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<div>home page</div>} />
          <Route
            path="/portal"
            element={
              <RequireAuth>
                <PortalPage />
              </RequireAuth>
            }
          />
          <Route
            path="/portal/editor"
            element={
              <RequireAuth>
                <EditorPage />
              </RequireAuth>
            }
          />
          <Route path="/portal/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
