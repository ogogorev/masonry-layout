import { PhotosResponse } from "./types";

// Intentionally leaking API_KEY here to make review simpler.
const API_KEY = "9RVDW56gz2ZmsvAENZ03NdX70xaW0PCE2NUV47Hp1f1uXkJzMankkVqq";

type CuratedPhotosRequestQueryParams = {
  perPage: number;
};

export const fetchCuratedPhotos = async ({
  perPage,
}: CuratedPhotosRequestQueryParams): Promise<PhotosResponse> => {
  return fetch(`https://api.pexels.com/v1/curated?per_page=${perPage}`, {
    headers: {
      Authorization: API_KEY,
    },
  }).then((res) => res.json());
};

export const fetchUrl = async (url: string): Promise<PhotosResponse> => {
  return fetch(url, {
    headers: {
      Authorization: API_KEY,
    },
  }).then((res) => res.json());
};
