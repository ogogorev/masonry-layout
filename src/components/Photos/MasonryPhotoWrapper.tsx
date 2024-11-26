import { FC, memo, MouseEvent } from "react";
import { NavigateFunction } from "react-router-dom";
import { styled } from "@linaria/react";

import { PhotoData } from "../../api/pexels/types";
import { generatePexelsPhotoUrl } from "../PexelsPhoto/utils";

const AnchorStyled = styled.a`
  display: block;
  width: 100%;
  max-height: 100%;
`;

const PhotoStyled = styled.img`
  width: 100%;
  border-radius: 8px;
`;

const AnchorStyled = styled.a`
  display: block;
`;

type MasonryPhotoItemProps = {
  item: PhotoData;
  navigate: NavigateFunction;
};

const MasonryPhotoItemC: FC<MasonryPhotoItemProps> = ({
  item: photoData,
  navigate,
}) => {
  const path = `/photo/${photoData.id}`;

  const handleLinkClick = (e: MouseEvent) => {
    e.preventDefault();

    navigate(path);
  };

  return (
    // Using anchor tag here as Link to be rendered slower
    <AnchorStyled href="path" onClick={handleLinkClick}>
      <PhotoStyled
        src={generatePexelsPhotoUrl(photoData, 200)}
        alt={photoData.alt}
      />
    </AnchorStyled>
  );
};

export const MasonryPhotoItem = memo(
  MasonryPhotoItemC,
  (prev: MasonryPhotoItemProps, next: MasonryPhotoItemProps) =>
    prev.item.id === next.item.id,
);
