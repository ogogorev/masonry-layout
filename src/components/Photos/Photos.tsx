import { useCuratedPhotos } from "../../hooks/useCuratedPhotos";
import { MasonryLayout } from "../Masonry/Masonry";
import { MasonryPhotoWrapper } from "./MasonryPhotoWrapper";

export const Photos = () => {
  const { photos, fetchNextPage } = useCuratedPhotos(20);

  console.log("Photos rendered", { photos });

  return (
    <MasonryLayout
      items={photos}
      onLastReached={fetchNextPage}
      renderItem={(photoData) => <MasonryPhotoWrapper photoData={photoData} />}
    />
  );
};
