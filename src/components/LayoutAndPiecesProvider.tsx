import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import LoadingSpinner from "./common/LoadingSpinner";
import { Stack } from "@mui/material";
import Layout from "../types/Layout";
import Piece from "../types/Piece";

const LayoutAndPiecesContext = createContext<
  | {
      layout: Layout;
      pieces: Piece[];
      setLayout: (layout: Layout) => void;
      setPiece: (piece: Piece) => void;
    }
  | undefined
>(undefined);

interface LayoutAndPiecesProviderProps {
  children: ReactNode;
}

export function LayoutAndPiecesProvider({
  children,
}: LayoutAndPiecesProviderProps) {
  const [layout, setLayout] = useState<Layout>({
    hidden: [],
    left: [],
    middle: [],
    right: [],
  });

  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    fetch(process.env.REACT_APP_INVOKE_URL + "/read-all-pieces")
      .then((response) => response.json())
      .then((data) => {
        setLayout(data.layout);
        setPieces(data.pieces);
      });
  }, [setLayout, setPieces]);

  const setPiece = useCallback(
    (piece: Piece) => {
      const updatedPieces = pieces.filter((p) => p.id !== piece.id);
      updatedPieces.push(piece);
      setPieces(updatedPieces);
    },
    [pieces, setPieces]
  );

  if (!layout) {
    return (
      <Stack
        sx={{
          height: "100vh",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LoadingSpinner />
      </Stack>
    );
  }

  return (
    <LayoutAndPiecesContext.Provider
      value={{
        layout,
        pieces,
        setLayout,
        setPiece,
      }}
    >
      {children}
    </LayoutAndPiecesContext.Provider>
  );
}

export function useLayoutAndPieces() {
  const context = useContext(LayoutAndPiecesContext);

  if (!context) {
    throw new Error(
      "useLayoutAndPieces must be used within a LayoutAndPiecesProvider"
    );
  }

  return context;
}
