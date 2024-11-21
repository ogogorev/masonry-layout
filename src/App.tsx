import { PexelsImage } from "./components/Image/PexelsImage";
import { MasonryLayout } from "./components/Masonry/Masonry";
// import { Sandbox } from "./components/Sandbox/Sandbox";
import { useCuratedPhotos } from "./hooks/useCuratedPhotos";

function App() {
  const { photos, fetchNextPage } = useCuratedPhotos(20);

  console.log("App rendered", { photos });

  return (
    <>
      <MasonryLayout
        items={photos}
        onLastReached={fetchNextPage}
        renderItem={(imageData) => <PexelsImage imageData={imageData} />}
      />
      {/* <Sandbox /> */}
    </>
  );
}

export default App;
