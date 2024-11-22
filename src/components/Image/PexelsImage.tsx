import { FC } from "react";
import { PhotoData } from "../../api/pexels/types";

type PexelsImageProps = {
  imageData: PhotoData;
};

// TODO: Rename to photo
export const PexelsImage: FC<PexelsImageProps> = ({ imageData }) => {
  return <img src={imageData.src.small} />;
};
