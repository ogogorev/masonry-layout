import { FC, memo } from "react";
import { NavigateFunction } from "react-router-dom";
import { styled } from "@linaria/react";

import { PhotoData } from "../../api/pexels/types";
import { PexelsImage } from "../Image/PexelsImage";

const PexelsPhotoStyled = styled(PexelsImage)`
  width: 100%;
  border-radius: 8px;
`;

type MasonryPhotoItemProps = {
  item: PhotoData;
  navigate: NavigateFunction;
};

const MasonryPhotoItemC: FC<MasonryPhotoItemProps> = ({
  item: photoData,
  navigate,
}) => {
  return (
    <div onClick={() => navigate(`/photo/${photoData.id}`)}>
      <PexelsPhotoStyled imageData={photoData} targetSize="medium" />
    </div>
  );
};

export const MasonryPhotoItem = memo(
  MasonryPhotoItemC,
  (prev: MasonryPhotoItemProps, next: MasonryPhotoItemProps) =>
    prev.item.id === next.item.id
);
