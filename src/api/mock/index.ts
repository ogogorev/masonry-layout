import { useRef, useState } from "react";

const PAGE_SIZE = 80;

const waitMs = (ms: number) => new Promise((res) => setTimeout(res, ms));

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
  await waitMs(2500);
  return generateItems(page * PAGE_SIZE, PAGE_SIZE);
};

export const useItems = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading] = useState({ value: false });
  const [currentPage, setCurrentPage] = useState<number>();

  const setLoading = (value: boolean) => {
    loading.value = value;
  };

  const loadItems = async () => {
    if (loading.value) return;

    setLoading(true);

    const nextPage = currentPage != null ? currentPage + 1 : 0;
    const newItems = await fetchItems(nextPage);

    setItems((prevItems) => [...prevItems, ...newItems]);
    setCurrentPage(nextPage);
    setLoading(false);
  };

  const fetched = useRef(false);
  if (!fetched.current) {
    fetched.current = true;
    loadItems();
  }

  const loadNextPage = () => {
    loadItems();
  };

  return {
    items,
    loading,
    loadNextPage,
  };
};
