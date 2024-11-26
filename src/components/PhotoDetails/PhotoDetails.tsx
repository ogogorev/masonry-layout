import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { styled } from "@linaria/react";

import { PhotoData } from "../../api/pexels/types";
import { fetchPhoto } from "../../api/pexels/photos";
import { PhotoInfo } from "./PhotoInfo";
import { Button } from "../ui/Button";
import { Text } from "../ui/Text";
import { PageContainer } from "../styled/PageContainer";
import { generateSrcSet } from "../PexelsPhoto/utils";

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
`;

const PhotoStyled = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const photoSizes = `
  (max-width: 1200px) 100vw,
  75vw
`;

export const PhotoDetails = () => {
  const navigate = useNavigate();
  const { photoId } = useParams();

  const [photoData, setPhotoData] = useState<PhotoData | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const navigateBack = () => {
    navigate(-1);
  };

  const srcSet = photoData ? generateSrcSet(photoData) : "";

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
    <PageContainer>
      <PhotoDetailsContainer>
        <Button onClick={navigateBack}>go back</Button>

        {loading && <Text>Loading...</Text>}
        {error && <Text>{error}</Text>}

        {photoData && (
          <>
            <PhotoWrapper>
              <PhotoStyled
                width={photoData.width}
                height={photoData.height}
                src={photoData.src.medium}
                alt={photoData.alt}
                sizes={photoSizes}
                srcSet={srcSet}
              />
            </PhotoWrapper>
            <PhotoInfo photoData={photoData} />
          </>
        )}
      </PhotoDetailsContainer>
    </PageContainer>
  );
};
