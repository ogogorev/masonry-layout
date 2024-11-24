import { useEffect, useState } from "react";

export const useResizeListener = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    let timeoutId: number;
    const handleResize = () => {
      timeoutId = setTimeout(() => {
        setWindowWidth(window.innerWidth);
      }, 1000);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  });

  return windowWidth;
};
