import { useCallback, useState } from "react";
import lcgFetch, { FetchResult } from "../helpers/lcgFetch";
import { useNavigate } from "react-router-dom";
import Layout from "../types/Layout";

export default function useDeletePiece(): [
  (pieceId: string, layout: Layout) => void,
  FetchResult
] {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const deletePiece = useCallback(
    async (pieceId: string, layout: Layout) => {
      setLoading(true);
      setError("");

      const deleteResult = await lcgFetch({
        endpoint: "/delete-piece",
        method: "DELETE",
        contentType: "application/json",
        body: JSON.stringify({ id: pieceId }),
      });

      if (!deleteResult.ok) {
        setError(deleteResult.statusText);
        setLoading(false);
        return;
      }

      const updatedLayout = {
        hidden: layout.hidden.filter((id) => id !== pieceId),
        left: layout.left.filter((id) => id !== pieceId),
        middle: layout.middle.filter((id) => id !== pieceId),
        right: layout.right.filter((id) => id !== pieceId),
      };

      const layoutResult = await lcgFetch({
        endpoint: "/write-layout",
        method: "POST",
        body: JSON.stringify(updatedLayout),
      });

      if (!layoutResult.ok) {
        setError(layoutResult.statusText);
        setLoading(false);
        return;
      }

      setLoading(false);
      navigate("/portal");
    },
    [navigate]
  );

  return [deletePiece, { loading, error }];
}
