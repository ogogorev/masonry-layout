import { useCuratedPhotos } from "../../hooks/useCuratedPhotos";
import { MasonryLayout } from "../Masonry/Masonry";
import { MasonryPhotoWrapper } from "./MasonryPhotoWrapper";
import { Loading } from "../ui/Loading";

export const Photos = () => {
  const { photos, fetchNextPage, loading } = useCuratedPhotos(20);

  console.log("Photos rendered", { photos });

  return (
    <>
      <MasonryLayout
        items={photos}
        onLastReached={fetchNextPage}
        renderItem={(photoData) => (
          <MasonryPhotoWrapper photoData={photoData} />
        )}
        stateKey="curatedPhotos"
      />
      {loading && <Loading />}
    </>
  );
};
