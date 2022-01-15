import Jimp from "jimp";
import { useCallback, useState } from "react";
import Piece from "../types/Piece";
import { v4 as uuidv4 } from "uuid";
import lcgFetch from "../helpers/lcgFetch";
import { useNavigate } from "react-router-dom";

const MAX_DIMENSION = 200;

async function shrinkImage(image: File): Promise<Buffer> {
  const arrayBuffer = await image.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const jimpImage = await Jimp.read(buffer);

  if (
    jimpImage.bitmap.width > MAX_DIMENSION ||
    jimpImage.bitmap.height > MAX_DIMENSION
  ) {
    jimpImage.scaleToFit(MAX_DIMENSION, MAX_DIMENSION);
  }

  return jimpImage.getBufferAsync(Jimp.MIME_JPEG);
}

function fetchUploadImage(image: Buffer): Promise<Response> {
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

export default function useWritePiece() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const writePiece = useCallback(
    async (piece: Piece, image: File) => {
      setError("");
      setLoading(true);

      // Upload image
      const resizedImage = await shrinkImage(image);
      const imageUploadResponse = await fetchUploadImage(resizedImage);

      // Handle image upload failure
      if (!imageUploadResponse.ok) {
        setError(imageUploadResponse.statusText);
        setLoading(false);
        return;
      }

      // Write piece
      const pictureId = await imageUploadResponse.text();
      const pieceId = uuidv4();
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

      // Everything is good
      setLoading(false);

      navigate("/portal", { state: pieceId });
    },
    [navigate]
  );

  return { writePiece, loading, error };
}
