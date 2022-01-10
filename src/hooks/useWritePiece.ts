import Jimp from "jimp";
import { useCallback, useState } from "react";
import Piece from "../types/Piece";
import { v4 as uuidv4 } from "uuid";

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
  return fetch(`${process.env.REACT_APP_INVOKE_URL}/upload-image`, {
    method: "PUT",
    headers: {
      "Content-Type": "image/jpeg",
    },
    body: image,
  });
}

function fetchWritePiece(piece: Piece, pictureId: string): Promise<Response> {
  const pieceWithId = {
    ...piece,
    id: uuidv4(),
    pictureId,
  };

  return fetch(`${process.env.REACT_APP_INVOKE_URL}/write-piece`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pieceWithId),
  });
}

export default function useWritePiece() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const writePiece = useCallback(async (piece: Piece, image: File) => {
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
    const writePieceResponse = await fetchWritePiece(piece, pictureId);

    // Handle piece write failure
    if (!writePieceResponse.ok) {
      setError(writePieceResponse.statusText);
      setLoading(false);
      return;
    }

    // Everything is good
    setLoading(false);
  }, []);

  return { writePiece, loading, error };
}
