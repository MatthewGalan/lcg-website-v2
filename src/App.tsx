import React from "react";
import EditorPage from "./components/portal/EditorPage";
import { createTheme, ThemeProvider } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PortalPage from "./components/portal/PortalPage";
import LoginPage from "./components/LoginPage";
import RequireAuth from "./components/RequireAuth";
import { LayoutAndPiecesProvider } from "./components/LayoutAndPiecesProvider";
import HomePage from "./components/home/HomePage";
import ViewPage from "./components/view/ViewPage";

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
    <LayoutAndPiecesProvider>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/view/:id" element={<ViewPage />} />

            <Route
              path="/portal"
              element={
                <RequireAuth>
                  <PortalPage />
                </RequireAuth>
              }
            />

            <Route
              path="/portal/editor/:id"
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
    </LayoutAndPiecesProvider>
  );
}

export default App;
