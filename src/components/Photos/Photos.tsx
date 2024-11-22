import { FC } from "react";
import { Link } from "react-router-dom";

import { PhotoData } from "../../api/pexels/types";
import { PexelsImage } from "../Image/PexelsImage";
import { useCuratedPhotos } from "../../hooks/useCuratedPhotos";
import { MasonryLayout } from "../Masonry/Masonry";

const MasonryPhotoWrapper: FC<{ photoData: PhotoData }> = ({ photoData }) => {
  return (
    <Link to={`/photo/${photoData.id}`}>
      <PexelsImage imageData={photoData} />
    </Link>
  );
};

export const Photos = () => {
  const { photos, fetchNextPage } = useCuratedPhotos(20);

  console.log("App rendered", { photos });

  return (
    <MasonryLayout
      items={photos}
      onLastReached={fetchNextPage}
      renderItem={(photoData) => <MasonryPhotoWrapper photoData={photoData} />}
    />
  );
};
