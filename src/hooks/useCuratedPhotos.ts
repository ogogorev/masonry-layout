import { useEffect, useRef, useState } from "react";
import { PhotoData, PhotosResponse } from "../api/pexels/types";
import { fetchCuratedPhotos, fetchUrl } from "../api/pexels/photos";

export const useCuratedPhotos = (pageSize: number) => {
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [nextPage, setNextPage] = useState<string>();
  const [loading, setLoading] = useState(false);

  // This internal state is needed to make sure that scroll events (that at some point piped directly to "fetchNextPage")
  // do not cause sending multiple requests in small amount of time
  // Using useRef to update loading state immediately. useState is not enough.
  const _loading = useRef(false);

  const updateLoading = (loading: boolean) => {
    setLoading(loading);
    _loading.current = loading;
  };

  const fetch = async (fetchFn: () => Promise<PhotosResponse>) => {
    if (loading || _loading.current) return;

    try {
      updateLoading(true);

      const response = await fetchFn();

      console.log({ response });

      setPhotos((prevPhotos) => {
        const fetchTimestamp = Date.now();

        return [
          ...prevPhotos,
          // TODO: Temporary solution, needed for ids
          ...response.photos.map((p) => ({ ...p, timestamp: fetchTimestamp })),
        ];
      });
      setNextPage(response.next_page);

      // TODO: Use finally here
      updateLoading(false);
    } catch (e) {
      // ... handle errors here
      updateLoading(false);
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
