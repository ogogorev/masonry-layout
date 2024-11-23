import { useEffect } from "react";
import { atom } from "nanostores";
import { useStore } from "@nanostores/react";

import { PhotoData, PhotosResponse } from "../api/pexels/types";
import { fetchCuratedPhotos, fetchUrl } from "../api/pexels/photos";

const $photos = atom<PhotoData[]>([]);
const $nextPage = atom<string>("");
const $loading = atom(false);

export const useCuratedPhotos = (pageSize: number) => {
  const photos = useStore($photos);
  const nextPage = useStore($nextPage);
  const loading = useStore($loading);

  const fetch = async (fetchFn: () => Promise<PhotosResponse>) => {
    if ($loading.get()) return;

    try {
      $loading.set(true);

      const response = await fetchFn();

      console.log({ response });

      const fetchTimestamp = Date.now();

      $photos.set([
        ...$photos.get(),
        // TODO: Adding timestamp here is a temporary solution, needed for ids
        ...response.photos.map((p) => ({ ...p, timestamp: fetchTimestamp })),
      ]);
      $nextPage.set(response.next_page);
    } catch (e) {
      // ... handle errors here
    } finally {
      $loading.set(false);
    }
  };

  const fetchNextPage = () => {
    if (nextPage) {
      fetch(() => fetchUrl(nextPage));
    }
  };

  useEffect(() => {
    fetch(() => fetchCuratedPhotos({ perPage: pageSize }));
  }, []);

  return {
    photos,
    loading,
    fetchNextPage,
  };
};
