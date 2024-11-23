import { FC } from "react";
import { Link } from "react-router-dom";
import { styled } from "@linaria/react";

import { PhotoData } from "../../api/pexels/types";
import { PexelsImage } from "../Image/PexelsImage";

const PexelsPhotoStyled = styled(PexelsImage)`
  width: 100%;
  border-radius: 8px;
`;

export const MasonryPhotoWrapper: FC<{ photoData: PhotoData }> = ({
  photoData,
}) => {
  return (
    <Link to={`/photo/${photoData.id}`}>
      <PexelsPhotoStyled imageData={photoData} targetSize="medium" />
    </Link>
  );
};
