import { useEffect, useRef } from "react";

export type ScrollState = {
  direction: "down" | "up";
  position: number;
};

export const useScrollListener = (
  callback: (scrollState: ScrollState) => void,
  throttleMs: number
) => {
  const scrollState = useRef<ScrollState>({ direction: "down", position: 0 });
  const timeoutId = useRef<number>();

  useEffect(() => {
    const handleScroll = () => {
      scrollState.current.direction =
        window.scrollY < scrollState.current.position ? "up" : "down";
      scrollState.current.position = window.scrollY;
      callback(scrollState.current);
    };

    const listener = () => {
      if (!timeoutId.current) {
        timeoutId.current = setTimeout(() => {
          handleScroll();
          timeoutId.current = undefined;
        }, throttleMs);
      }
    };

    window.addEventListener("scroll", listener, { passive: true });

    return () => {
      window.removeEventListener("scroll", listener);
    };
  });

  return scrollState.current;
};
