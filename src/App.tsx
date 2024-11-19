import { useEffect, useRef, useState } from "react";
// import './App.css'
import { MasonryLayout } from "./components/Masonry/Masonry";
import { photos } from "./data/curated";
import { Sandbox } from "./components/Sandbox/Sandbox";

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

const ITEMS = [
  {
    id: "Item 1",
    height: 571,
    gridRow: 19,
  },
  {
    id: "Item 2",
    height: 158,
    gridRow: 5,
  },
  {
    id: "Item 3",
    height: 137,
    gridRow: 5,
  },
  {
    id: "Item 4",
    height: 132,
    gridRow: 4,
  },
  {
    id: "Item 5",
    height: 361,
    gridRow: 12,
  },
  {
    id: "Item 6",
    height: 574,
    gridRow: 19,
  },
  {
    id: "Item 7",
    height: 549,
    gridRow: 18,
  },
  {
    id: "Item 8",
    height: 511,
    gridRow: 17,
  },
  {
    id: "Item 9",
    height: 529,
    gridRow: 18,
  },
  {
    id: "Item 10",
    height: 131,
    gridRow: 4,
  },
  {
    id: "Item 11",
    height: 537,
    gridRow: 18,
  },
  {
    id: "Item 12",
    height: 598,
    gridRow: 20,
  },
  {
    id: "Item 13",
    height: 183,
    gridRow: 6,
  },
  {
    id: "Item 14",
    height: 340,
    gridRow: 11,
  },
  {
    id: "Item 15",
    height: 112,
    gridRow: 4,
  },
  {
    id: "Item 16",
    height: 358,
    gridRow: 12,
  },
  {
    id: "Item 17",
    height: 175,
    gridRow: 6,
  },
  {
    id: "Item 18",
    height: 454,
    gridRow: 15,
  },
  {
    id: "Item 19",
    height: 459,
    gridRow: 15,
  },
  {
    id: "Item 20",
    height: 172,
    gridRow: 6,
  },
  {
    id: "Item 21",
    height: 396,
    gridRow: 13,
  },
  {
    id: "Item 22",
    height: 324,
    gridRow: 11,
  },
  {
    id: "Item 23",
    height: 272,
    gridRow: 9,
  },
  {
    id: "Item 24",
    height: 282,
    gridRow: 9,
  },
  {
    id: "Item 25",
    height: 240,
    gridRow: 8,
  },
  {
    id: "Item 26",
    height: 382,
    gridRow: 13,
  },
  {
    id: "Item 27",
    height: 377,
    gridRow: 13,
  },
  {
    id: "Item 28",
    height: 560,
    gridRow: 19,
  },
  {
    id: "Item 29",
    height: 553,
    gridRow: 18,
  },
  {
    id: "Item 30",
    height: 565,
    gridRow: 19,
  },
  {
    id: "Item 31",
    height: 593,
    gridRow: 20,
  },
  {
    id: "Item 32",
    height: 361,
    gridRow: 12,
  },
  {
    id: "Item 33",
    height: 422,
    gridRow: 14,
  },
  {
    id: "Item 34",
    height: 345,
    gridRow: 12,
  },
  {
    id: "Item 35",
    height: 436,
    gridRow: 15,
  },
  {
    id: "Item 36",
    height: 377,
    gridRow: 13,
  },
  {
    id: "Item 37",
    height: 407,
    gridRow: 14,
  },
  {
    id: "Item 38",
    height: 373,
    gridRow: 12,
  },
  {
    id: "Item 39",
    height: 378,
    gridRow: 13,
  },
  {
    id: "Item 40",
    height: 180,
    gridRow: 6,
  },
  {
    id: "Item 41",
    height: 196,
    gridRow: 7,
  },
  {
    id: "Item 42",
    height: 290,
    gridRow: 10,
  },
  {
    id: "Item 43",
    height: 274,
    gridRow: 9,
  },
  {
    id: "Item 44",
    height: 312,
    gridRow: 10,
  },
  {
    id: "Item 45",
    height: 124,
    gridRow: 4,
  },
  {
    id: "Item 46",
    height: 110,
    gridRow: 4,
  },
  {
    id: "Item 47",
    height: 573,
    gridRow: 19,
  },
  {
    id: "Item 48",
    height: 345,
    gridRow: 12,
  },
  {
    id: "Item 49",
    height: 395,
    gridRow: 13,
  },
  {
    id: "Item 50",
    height: 341,
    gridRow: 11,
  },
  {
    id: "Item 51",
    height: 285,
    gridRow: 10,
  },
  {
    id: "Item 52",
    height: 507,
    gridRow: 17,
  },
  {
    id: "Item 53",
    height: 561,
    gridRow: 19,
  },
  {
    id: "Item 54",
    height: 569,
    gridRow: 19,
  },
  {
    id: "Item 55",
    height: 196,
    gridRow: 7,
  },
  {
    id: "Item 56",
    height: 456,
    gridRow: 15,
  },
  {
    id: "Item 57",
    height: 593,
    gridRow: 20,
  },
  {
    id: "Item 58",
    height: 441,
    gridRow: 15,
  },
  {
    id: "Item 59",
    height: 431,
    gridRow: 14,
  },
  {
    id: "Item 60",
    height: 220,
    gridRow: 7,
  },
  {
    id: "Item 61",
    height: 156,
    gridRow: 5,
  },
  {
    id: "Item 62",
    height: 501,
    gridRow: 17,
  },
  {
    id: "Item 63",
    height: 338,
    gridRow: 11,
  },
  {
    id: "Item 64",
    height: 468,
    gridRow: 16,
  },
  {
    id: "Item 65",
    height: 239,
    gridRow: 8,
  },
  {
    id: "Item 66",
    height: 361,
    gridRow: 12,
  },
  {
    id: "Item 67",
    height: 538,
    gridRow: 18,
  },
  {
    id: "Item 68",
    height: 562,
    gridRow: 19,
  },
  {
    id: "Item 69",
    height: 388,
    gridRow: 13,
  },
  {
    id: "Item 70",
    height: 192,
    gridRow: 6,
  },
  {
    id: "Item 71",
    height: 209,
    gridRow: 7,
  },
  {
    id: "Item 72",
    height: 297,
    gridRow: 10,
  },
  {
    id: "Item 73",
    height: 500,
    gridRow: 17,
  },
  {
    id: "Item 74",
    height: 472,
    gridRow: 16,
  },
  {
    id: "Item 75",
    height: 262,
    gridRow: 9,
  },
  {
    id: "Item 76",
    height: 383,
    gridRow: 13,
  },
  {
    id: "Item 77",
    height: 488,
    gridRow: 16,
  },
  {
    id: "Item 78",
    height: 400,
    gridRow: 13,
  },
  {
    id: "Item 79",
    height: 354,
    gridRow: 12,
  },
  {
    id: "Item 80",
    height: 361,
    gridRow: 12,
  },
];

const PAGE_SIZE = 80;

const generateItems = (startIndex: number, amount: number) => {
  // return ITEMS;
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
  await waitMs(2500);
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
      {/* <Sandbox /> */}
    </>
  );
}

export default App;
