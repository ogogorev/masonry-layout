import { FC } from "react";
import { PhotoData } from "../../api/pexels/types";

type PexelsPhotoProps = {
  className?: string;
  targetSize?: keyof PhotoData["src"];
  photoData: PhotoData;
  srcSet?: string;
  sizes?: string;
};

export const PexelsPhoto: FC<PexelsPhotoProps> = ({
  className,
  targetSize = "medium",
  photoData,
  srcSet,
  sizes,
}) => {
  return (
    <img
      className={className}
      // width={photoData.width}
      // height={photoData.height}
      src={photoData.src[targetSize]}
      alt={photoData.alt}
      sizes={sizes}
      srcSet={srcSet}
    />
  );
};
