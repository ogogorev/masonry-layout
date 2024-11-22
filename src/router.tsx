import { createBrowserRouter } from "react-router-dom";

import "./styles/globalStyles.ts";
import { PhotoDetails } from "./components/PhotoDetails/PhotoDetails.tsx";
import { Photos } from "./components/Photos/Photos.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Photos />,
  },
  {
    path: "/photo/:photoId",
    element: <PhotoDetails />,
  },
]);
