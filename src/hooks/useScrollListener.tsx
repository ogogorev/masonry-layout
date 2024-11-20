import { useEffect, useState } from "react";

export type ScrollState = {
  direction: "down" | "up";
  position: number;
};

export const useScrollListener = (
  callback: (scrollState: ScrollState) => void
) => {
  // TODO: Add a comment explaining how I use useState here
  const [scrollState] = useState<ScrollState>({
    direction: "down",
    position: 0,
  });

  const handleScroll = () => {
    scrollState.direction =
      window.scrollY < scrollState.position ? "up" : "down";
    scrollState.position = window.scrollY;
    callback(scrollState);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [callback]);

  return scrollState;
};
