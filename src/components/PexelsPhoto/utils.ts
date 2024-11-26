import { PhotoData } from "../../api/pexels/types";

export const generatePexelsPhotoUrl = (photoData: PhotoData, width: number) => {
  return `${photoData.src.original}?auto=compress&cs=tinysrgb&w=${width}`;
};

export const generateSrcSet = (photoData: PhotoData) => `
    ${photoData.src.original}?auto=compress&cs=tinysrgb&w=200 200w,
    ${photoData.src.original}?auto=compress&cs=tinysrgb&w=400 400w,
    ${photoData.src.original}?auto=compress&cs=tinysrgb&w=600 600w,
    ${photoData.src.original}?auto=compress&cs=tinysrgb&w=800 800w,
    ${photoData.src.original}?auto=compress&cs=tinysrgb&w=1000 1000w,
    ${photoData.src.original}?auto=compress&cs=tinysrgb&w=1600 1600w,
    ${photoData.src.original}?auto=compress&cs=tinysrgb&w=3200 3200w,
    ${photoData.src.original}
 `;
