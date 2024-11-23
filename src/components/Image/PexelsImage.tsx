import { FC } from "react";
import { PhotoData } from "../../api/pexels/types";

type PexelsImageProps = {
  className?: string;
  imageData: PhotoData;
};

// TODO: Rename to photo
export const PexelsImage: FC<PexelsImageProps> = ({ className, imageData }) => {
  return <img className={className} src={imageData.src.small} />;
};
