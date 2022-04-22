import React from "react";
import EditorPage from "./components/EditorPage";
import { createTheme, ThemeProvider } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PortalPage from "./components/PortalPage";
import LoginPage from "./components/LoginPage";
import RequireAuth from "./components/RequireAuth";
import useReadAllPieces from "./hooks/useReadAllPieces";

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
  /**
   * TODO: convert useReadAllPieces so we call useEffect here instead of inside
   *       of the hook. then have useWritePiece update layOutAndPieces. this will
   *       prevent us from having to reload the page or call the API after a new
   *       piece is added.
   */

  const {
    loading: layoutAndPiecesLoading,
    error: layoutAndPiecesError,
    data: layoutAndPieces,
  } = useReadAllPieces();

  if (!layoutAndPieces) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<div>home page</div>} />
          <Route
            path="/portal"
            element={
              <RequireAuth>
                <PortalPage layoutAndPieces={layoutAndPieces} />
              </RequireAuth>
            }
          />
          <Route
            path="/portal/editor"
            element={
              <RequireAuth>
                <EditorPage layout={layoutAndPieces.layout} />
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
