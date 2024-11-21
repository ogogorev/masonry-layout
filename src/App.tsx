import { FC } from "react";
import { Link } from "react-router-dom";

import { PhotoData } from "./api/pexels/types";
import { PexelsImage } from "./components/Image/PexelsImage";
import { MasonryLayout } from "./components/Masonry/Masonry";
// import { Sandbox } from "./components/Sandbox/Sandbox";
import { useCuratedPhotos } from "./hooks/useCuratedPhotos";

const MasonryImageWrapper: FC<{ imageData: PhotoData }> = ({ imageData }) => {
  return (
    <Link to={`/photo/${imageData.id}`}>
      <PexelsImage imageData={imageData} />
    </Link>
  );
};

function App() {
  const { photos, fetchNextPage } = useCuratedPhotos(20);

  console.log("App rendered", { photos });

  return (
    <>
      <MasonryLayout
        items={photos}
        onLastReached={fetchNextPage}
        renderItem={(imageData) => (
          <MasonryImageWrapper imageData={imageData} />
        )}
      />
      {/* <Sandbox /> */}
    </>
  );
}

export default App;
