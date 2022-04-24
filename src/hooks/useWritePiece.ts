import { useCallback, useState } from "react";
import Piece from "../types/Piece";
import { v4 as uuidv4 } from "uuid";
import lcgFetch from "../helpers/lcgFetch";
import { useNavigate } from "react-router-dom";
import Layout from "../types/Layout";

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

async function updateLayout(layout: Layout, pieceId: string) {
  const updatedLayout = {
    ...layout,
    hidden: [pieceId, ...layout.hidden],
  };

  return await lcgFetch({
    endpoint: "/write-layout",
    method: "POST",
    body: JSON.stringify(updatedLayout),
  });
}

export default function useWritePiece(layout: Layout) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

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

        // Handle image upload failure
        if (!imageUploadResponse.ok) {
          setError(imageUploadResponse.statusText);
          setLoading(false);
          window.alert("Failed to upload image.");
          return;
        }

        pictureId = await imageUploadResponse.text();
      }

      if (!pictureId) {
        setLoading(false);
        const error = "Either pieceId or pictureId must be provided";
        setError(error);
        console.error(error);
        return;
      }

      // Write piece
      const pieceId = options.pieceId ?? uuidv4();
      const writePieceResponse = await fetchWritePiece(
        pieceId,
        piece,
        pictureId
      );

      // Handle piece write failure
      if (!writePieceResponse.ok) {
        setError(writePieceResponse.statusText);
        setLoading(false);
        return;
      }

      // Update layout if its a new piece
      if (!options.pieceId) {
        await updateLayout(layout, pieceId);
      }

      // Everything is good
      setLoading(false);

      navigate("/portal", { state: pieceId });
    },
    [navigate, layout]
  );

  return { writePiece, loading, error };
}
