import { useCallback, useState } from "react";
import Piece from "../types/Piece";
import { v4 as uuidv4 } from "uuid";
import lcgFetch from "../helpers/lcgFetch";
import { useNavigate } from "react-router-dom";
import Layout from "../types/Layout";
import { fetchDeleteImage } from "./useDeleteImage";
import { useLayoutAndPieces } from "../components/LayoutAndPiecesProvider";

function fetchUploadImage(image: Blob): Promise<Response> {
  return lcgFetch({
    endpoint: "/upload-image",
    method: "PUT",
    contentType: "image/jpeg",
    body: image,
  });
}

function fetchWritePiece(
  pieceId: string,
  piece: Piece,
  pictureId: string
): Promise<Response> {
  const pieceWithId = {
    ...piece,
    id: pieceId,
    pictureId,
  };

  return lcgFetch({
    endpoint: "/write-piece",
    method: "POST",
    contentType: "application/json",
    body: JSON.stringify(pieceWithId),
  });
}

export default function useWritePiece(layout: Layout) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { setLayout, setPiece } = useLayoutAndPieces();

  const writePiece = useCallback(
    async (
      piece: Piece,
      options: { blob?: Blob; pieceId?: string; pictureId?: string }
    ) => {
      setError("");
      setLoading(true);

      let pictureId = options.pictureId;

      // Upload image if applicable
      if (options.blob) {
        const imageUploadResponse = await fetchUploadImage(options.blob);

        if (!imageUploadResponse.ok) {
          setError(imageUploadResponse.statusText);
          setLoading(false);
          window.alert("Failed to upload image.");
          return;
        }

        // Delete previous image if applicable
        if (piece.pictureId) {
          const imageDeleteResponse = await fetchDeleteImage(piece.pictureId);

          if (!imageDeleteResponse.ok) {
            setError(imageDeleteResponse.statusText);
            setLoading(false);
            return;
          }
        }

        pictureId = await imageUploadResponse.text();
      }

      if (!pictureId) {
        setLoading(false);
        setError("Either pieceId or pictureId must be provided");
        return;
      }

      // Write piece
      const pieceId = options.pieceId ?? uuidv4();
      const writePieceResponse = await fetchWritePiece(
        pieceId,
        piece,
        pictureId
      );

      // Save in local state so we don't have to refresh
      setPiece({ ...piece, id: pieceId, pictureId });

      // Handle piece write failure
      if (!writePieceResponse.ok) {
        setError(writePieceResponse.statusText);
        setLoading(false);
        return;
      }

      // Update layout if its a new piece
      if (!options.pieceId) {
        const updatedLayout = {
          ...layout,
          hidden: [pieceId, ...layout.hidden],
        };

        await lcgFetch({
          endpoint: "/write-layout",
          method: "POST",
          body: JSON.stringify(updatedLayout),
        });

        setLayout(updatedLayout);
      }

      // Everything is good
      setLoading(false);

      navigate("/portal", { state: pieceId });
    },
    [navigate, layout]
  );

  return { writePiece, loading, error };
}
