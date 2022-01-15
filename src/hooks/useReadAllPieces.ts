import { useEffect, useState } from "react";
import Layout from "../types/Layout";
import Piece from "../types/Piece";

export interface LayoutAndPieces {
  layout: Layout;
  pieces: Piece[];
}

export default function useReadAllPieces() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [data, setData] = useState<LayoutAndPieces>();

  useEffect(() => {
    async function fetchAllPieces() {
      const response = await fetch(
        process.env.REACT_APP_INVOKE_URL + "/read-all-pieces"
      );

      // Handle response error
      if (!response.ok) {
        setError(response.statusText);
        setLoading(false);
        return;
      }

      // Grab response body
      const layoutAndPieces = await response.json();
      setData(layoutAndPieces);
      setLoading(false);
    }

    fetchAllPieces();
  }, []);

  return { loading, error, data };
}
