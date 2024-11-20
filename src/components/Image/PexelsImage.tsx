import { PhotoData } from "../../api/pexels/types";

export const PexelsImage = (imageData: PhotoData) => {
  return <img src={imageData.src.small} style={{ width: "100%" }} />;
};
