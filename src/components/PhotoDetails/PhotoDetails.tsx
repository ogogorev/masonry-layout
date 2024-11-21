import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { PexelsImage } from "../Image/PexelsImage";
import { PhotoData } from "../../api/pexels/types";
import { fetchPhoto } from "../../api/pexels/photos";

export const PhotoDetails = () => {
  const navigate = useNavigate();
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

  const navigateBack = () => {
    navigate(-1);
  };

  const { photographer, photographer_url, alt } = photoData || {};
  const date = new Date(
    Math.floor(Math.random() * Date.now()),
  ).toLocaleDateString();

  return (
    <div>
      {loading && "Loading..."}
      {error && error}

      {photoData && (
        <div>
          <button type="button" onClick={navigateBack}>
            Return to gallery
          </button>
          <div>
            <h1>{alt}</h1>

            <p>
              Author:{" "}
              <a href={photographer_url} target="_blank">
                {photographer}
              </a>
            </p>

            <span>{date} (random)</span>
          </div>

          <PexelsImage imageData={photoData} />
        </div>
      )}
    </div>
  );
};
