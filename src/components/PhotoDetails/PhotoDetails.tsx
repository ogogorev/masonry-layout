import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { PexelsImage } from "../Image/PexelsImage";
import { PhotoData } from "../../api/pexels/types";
import { fetchPhoto } from "../../api/pexels/photos";

export const PhotoDetails = () => {
  const { photoId } = useParams();

  const [photoData, setPhotoData] = useState<PhotoData | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const fetchPhotoData = async (photoId: string) => {
      try {
        setLoading(true);
        const response = await fetchPhoto({ id: photoId });
        setPhotoData(response);
      } catch (e) {
        setError("Couldn't load the data :(");
      } finally {
        setLoading(false);
      }
    };
    if (photoId) {
      fetchPhotoData(photoId);
    }
  }, [photoId]);

  return (
    <div>
      {loading && "Loading..."}

      {photoData && <PexelsImage imageData={photoData} />}

      {error && error}
    </div>
  );
};
