import { useCuratedPhotos } from "../../hooks/useCuratedPhotos";
import { MasonryLayout } from "../Masonry/Masonry";
import { MasonryPhotoWrapper } from "./MasonryPhotoWrapper";
import { Loading } from "../ui/Loading";
import { PageContainer } from "../styled/PageContainer";

export const Photos = () => {
  const { photos, fetchNextPage, loading } = useCuratedPhotos(20);

  console.log("Photos rendered", { photos });

  return (
    <PageContainer>
      <MasonryLayout
        items={photos}
        onLastReached={fetchNextPage}
        renderItem={(photoData) => (
          <MasonryPhotoWrapper photoData={photoData} />
        )}
        stateKey="curatedPhotos"
      />
      {loading && <Loading />}
    </PageContainer>
  );
};
