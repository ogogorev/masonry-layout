import { useEffect, useRef, useState } from "react";
// import './App.css'
import { MasonryLayout } from "./components/Masonry/Masonry2";
import { photos } from "./data/curated";

// Intentionally leaking API_KEY here to make review simpler.
const API_KEY = "9RVDW56gz2ZmsvAENZ03NdX70xaW0PCE2NUV47Hp1f1uXkJzMankkVqq";

const waitMs = (ms: number) => new Promise((res) => setTimeout(res, ms));

const fetchImages = async () => {
  // return fetch("https://api.pexels.com/v1/search?query=nature&per_page=100", {
  // return fetch("https://api.pexels.com/v1/curated?per_page=80", {
  //   headers: {
  //     Authorization: API_KEY,
  //   },
  // }).then(res => res.json());

  await waitMs(1000);

  return photos.slice(0, 15);
};

// const fetched = useRef(false);
//   useEffect(() => {
//     if (fetched.current) {
//       return;
//     }

//     fetched.current = true;

//     fetchImages().then((res) => {
//       console.log({ res });
//     });
//   });

// const usePexelsImages = (pageSize: number) => {
//   const [images, setImages] = useState<any[]>([]);

//   const load = async () => {
//     const newImages = await fetchImages();

//     setImages((images) => {
//       return [...images, ...newImages];
//     })
//   }

//   const loadNextPage = () => {

//   }

//   return {
//     images,
//     load,
//   };
// }

const PAGE_SIZE = 40;

const generateItems = (startIndex: number, amount: number) => {
  return Array(amount)
    .fill(null)
    .map((_, i) => {
      const n = i + startIndex;

      return {
        id: `Item ${n + 1}`,
        height: Math.floor(100 + Math.random() * 500),
      };
    });
};

const fetchItems = async (page: number) => {
  await waitMs(5000);
  return generateItems(page * PAGE_SIZE, PAGE_SIZE);
};

const useItems = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const loadItems = async (page: number) => {
    if (loading) return;

    setLoading(true);
    setCurrentPage(page);

    const newItems = await fetchItems(page);
    setItems((prevItems) => [...prevItems, ...newItems]);
    setLoading(false);
  };

  const fetched = useRef(false);
  if (!fetched.current) {
    fetched.current = true;
    loadItems(0);
  }

  const loadNextPage = () => {
    loadItems(currentPage + 1);
  };

  return {
    items,
    loading,
    loadNextPage,
  };
};

function App() {
  const { items, loading, loadNextPage } = useItems();

  console.log("App", { items });

  const onLastReached = () => {
    if (loading) return;

    console.log("onLastReached called");
    loadNextPage();
  };

  return (
    <>
      <MasonryLayout items={items} onLastReached={onLastReached} />
    </>
  );
}

export default App;
