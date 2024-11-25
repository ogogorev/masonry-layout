import { useCuratedPhotos } from "../../hooks/useCuratedPhotos";
import { MasonryLayout } from "../Masonry/Masonry";
import { MasonryPhotoItem } from "./MasonryPhotoWrapper";
import { Loading } from "../ui/Loading";
import { PageContainer } from "../styled/PageContainer";
import { useNavigate } from "react-router-dom";
import { ComponentProps, useMemo } from "react";

export const Photos = () => {
  const { photos, fetchNextPage, loading } = useCuratedPhotos(50);

  const navigate = useNavigate();

  const ItemContentComponent = useMemo(() => {
    return (
      props: Omit<ComponentProps<typeof MasonryPhotoItem>, "navigate">
    ) => <MasonryPhotoItem {...props} navigate={navigate} />;
  }, [navigate]);

  //   console.log("Photos rendered", { photos });

  return (
    <PageContainer>
      <MasonryLayout
        items={photos}
        batchSize={10}
        onLastReached={fetchNextPage}
        ItemContentComponent={ItemContentComponent}
        stateKey="curatedPhotos"
      />
      {loading && <Loading />}
    </PageContainer>
  );
};
