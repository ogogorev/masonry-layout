import { FC } from "react";
import { PhotoData } from "../../api/pexels/types";

type PexelsImageProps = {
  imageData: PhotoData;
};

export const PexelsImage: FC<PexelsImageProps> = ({ imageData }) => {
  return <img src={imageData.src.small} style={{ width: "100%" }} />;
};
