import { FC } from "react";
import { PhotoData } from "../../api/pexels/types";

type PexelsPhotoProps = {
  className?: string;
  targetSize?: keyof PhotoData["src"];
  photoData: PhotoData;
};

export const PexelsPhoto: FC<PexelsPhotoProps> = ({
  className,
  targetSize = "medium",
  photoData,
}) => {
  const srcset = `
      ${photoData.src.original}?auto=compress&cs=tinysrgb&w=200 200w,
      ${photoData.src.original}?auto=compress&cs=tinysrgb&w=400 400w
      ${photoData.src.original}?auto=compress&cs=tinysrgb&w=600 600w,
      ${photoData.src.original}?auto=compress&cs=tinysrgb&w=800 800w,
      ${photoData.src.original}?auto=compress&cs=tinysrgb&w=1000 1000w,
      ${photoData.src.original}?auto=compress&cs=tinysrgb&w=1600 1600w,
      ${photoData.src.original}?auto=compress&cs=tinysrgb&w=3200 3200w,
      ${photoData.src.original}
 `;

  const sizes = `
    (max-width: 500px) 200w,
      600px
    `;

  return (
    <img
      className={className}
      // width={photoData.width}
      // height={photoData.height}
      src={photoData.src[targetSize]}
      alt={photoData.alt}
      sizes={sizes}
      srcSet={srcset}
    />
  );
};
