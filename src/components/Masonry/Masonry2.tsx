import { FC, forwardRef, useEffect, useRef, useState } from "react";

import "./Masonry.css";

const OFFSET = 150;

type MasonryItemProps = {
  item: any;
  index: number;
  onIntersect?: (entry: any, index: number) => void;
};

// const MasonryItem: FC<MasonryItemProps> = ({ item, index, onIntersect }) => {
const MasonryItem: FC<MasonryItemProps> = forwardRef(
  ({ item, index, onIntersect }, ref) => {
    // console.log("render item", ref);

    return (
      <div
        key={item.id}
        id={item.id}
        ref={ref}
        className="item"
        style={{
          gridRow: `span ${item.gridRow}`,
          backgroundColor: ref ? "blue" : undefined,
        }}
      >
        {item.id}
      </div>
    );
  }
);

const STEP = 20 + 10;
const BATCH_SIZE = 10;

type MasonryItemType = {
  id: string;
  height: number;
};

type MasonryProps = {
  batchSize?: number;
  items: Array<MasonryItemType>;
  onLastReached: () => void;
};

let lastScrollPosition = 0;
let scrollDirection = "down";

export const MasonryLayout: FC<MasonryProps> = ({
  batchSize = BATCH_SIZE,
  items: itemsSrc,
  onLastReached,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [first, setFirst] = useState(0);

  const beforeLastRef = useRef<HTMLDivElement>(null);
  const lastRef = useRef<HTMLDivElement>(null);
  const [beforeLast, setBeforeLast] = useState(batchSize);
  const [last, setLast] = useState(batchSize);

  const items = itemsSrc.map((item) => {
    return {
      ...item,
      gridRow: Math.round(item.height / STEP),
    };
  });

  const visibleItems = items.slice(first, last);

  const checkIntersections = () => {
    console.log("checkLast", scrollDirection, beforeLastRef, lastRef);

    if (scrollDirection === "down") {
      if (!lastRef.current) return;

      const rect2 = lastRef.current.getBoundingClientRect();

      const isIntersecting = rect2.top <= window.innerHeight - OFFSET;

      if (isIntersecting) {
        const nextLast = Math.min(last + batchSize, items.length);

        if (nextLast > last) {
          setBeforeLast(last);
          setLast(nextLast);
        } else {
          onLastReached();
        }
      }
    }

    if (scrollDirection === "up") {
      if (!beforeLastRef.current) return;

      const rect1 = beforeLastRef.current.getBoundingClientRect();
      const isIntersecting = rect1.top <= window.innerHeight - OFFSET;

      if (!isIntersecting) {
        setLast(beforeLast);
        setBeforeLast(beforeLast - batchSize);
      }
    }
  };

  useEffect(() => {
    if (lastRef.current) {
      checkIntersections();
    }
  }, [beforeLastRef.current, lastRef.current, checkIntersections]);

  useEffect(() => {
    console.log("useEffect");

    const handleScroll = (event: any) => {
      console.log("scroll", { event }, window.scrollY);

      if (window.scrollY < lastScrollPosition) {
        scrollDirection = "up";
      } else {
        scrollDirection = "down";
      }

      lastScrollPosition = window.scrollY;

      checkIntersections();
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [checkIntersections]);

  console.log("Masonry rendered", {
    items,
    visibleItems,
    first,
    last,
    // trackedFirst,
    // beforeLast,
  });

  const getRefByIndex = (index: number) => {
    if (index === last - 1) return lastRef;
    if (index === beforeLast - 1) return beforeLastRef;
  };

  return (
    <>
      <div ref={containerRef} className="masonry">
        {visibleItems.map((item, i) => {
          return (
            <MasonryItem
              key={item.id}
              index={i}
              item={item}
              ref={getRefByIndex(i)}
            />
          );
        })}
      </div>

      <div className="line" style={{ top: `${OFFSET}px` }}></div>
      <div className="line" style={{ bottom: `${OFFSET}px` }}></div>
    </>
  );
};
