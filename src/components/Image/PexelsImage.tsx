import { FC } from "react";
import { PhotoData } from "../../api/pexels/types";

type PexelsImageProps = {
  className?: string;
  targetSize?: keyof PhotoData["src"];
  imageData: PhotoData;
};

// TODO: Rename to photo
// TODO: Rerender only if the id has changed?
export const PexelsImage: FC<PexelsImageProps> = ({
  className,
  targetSize = "original",
  imageData,
}) => {
  return (
    <img
      className={className}
      src={imageData.src[targetSize]}
      alt={imageData.alt}
    />
  );
};

//   const srcset = `
//         ${imageData.src.original}?auto=compress&cs=tinysrgb&w=200 200w,
//         ${imageData.src.original}?auto=compress&cs=tinysrgb&w=400 400w,
//         ${imageData.src.original}?auto=compress&cs=tinysrgb&w=600 600w,
//         ${imageData.src.original}?auto=compress&cs=tinysrgb&w=800 800w,
//         ${imageData.src.original}?auto=compress&cs=tinysrgb&w=1000 1000w,
//         ${imageData.src.original}?auto=compress&cs=tinysrgb&w=1600 1600w,
//         ${imageData.src.original}?auto=compress&cs=tinysrgb&w=3200 3200w,
//         ${imageData.src.original}
// `;

//   const sizes = `
//         (max-width: 500px) 200w,
//         800w
//       `;
