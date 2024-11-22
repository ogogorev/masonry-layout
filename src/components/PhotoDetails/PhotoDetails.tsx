import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { styled } from "@linaria/react";

import { breakpoints } from "../../styles/breakpoints";
import { PexelsImage } from "../Image/PexelsImage";
import { PhotoData } from "../../api/pexels/types";
import { fetchPhoto } from "../../api/pexels/photos";
import { PhotoInfo } from "./PhotoInfo";
import { Button } from "../ui/Button";
import { Text } from "../ui/Text";

const PageContainer = styled.div`
  max-width: 1200px;
  padding: 1.5rem 1rem;
  margin: 0 auto;
  height: 80vh;

  @media (min-width: ${breakpoints.lg}px) {
    padding: 1.5rem 2rem;
    height: 100vh;
  }
`;

const PhotoDetailsContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  font-size: 1.25rem;

  button {
    align-self: flex-start;
  }
`;

const PhotoWrapper = styled.div`
  max-height: 60%;
  text-align: center;

  padding-top: 1rem;

  img {
    max-width: 100%;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

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
    navigate("/");
  };

  return (
    <PageContainer>
      <PhotoDetailsContainer>
        <Button onClick={navigateBack}>go to gallery</Button>

        {loading && <Text>Loading...</Text>}
        {error && <Text>{error}</Text>}

        {photoData && (
          <>
            <PhotoWrapper>
              <PexelsImage imageData={photoData} />
            </PhotoWrapper>
            <PhotoInfo photoData={photoData} />
          </>
        )}
      </PhotoDetailsContainer>
    </PageContainer>
  );
};
