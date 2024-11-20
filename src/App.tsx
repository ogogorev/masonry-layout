import { MasonryLayout } from "./components/Masonry/Masonry";
// import { Sandbox } from "./components/Sandbox/Sandbox";
import { useItems } from "./api/mock";

function App() {
  const { items, loadNextPage } = useItems();

  return (
    <>
      <MasonryLayout items={items} onLastReached={loadNextPage} />
      {/* <Sandbox /> */}
    </>
  );
}

export default App;
