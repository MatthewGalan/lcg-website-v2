import { useCallback, useState } from "react";
import lcgFetch, { FetchResult } from "../helpers/lcgFetch";

export function fetchDeleteImage(imageId: string) {
  return lcgFetch({
    endpoint: "/delete-image",
    method: "DELETE",
    body: imageId,
  });
}

export default function useDeleteImage(): [
  (imageId: string) => void,
  FetchResult
] {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const deleteImage = useCallback(async (imageId: string) => {
    setLoading(true);
    setError("");

    const result = await fetchDeleteImage(imageId);

    if (!result.ok) {
      setError(result.statusText);
    }

    setLoading(false);
  }, []);

  return [deleteImage, { loading, error }];
}
