import { FC, useEffect, useMemo, useRef, useState } from "react";

import { ScrollState, useScrollListener } from "../../hooks/useScrollListener";
import { MasonryItem } from "./types";
import { MASONRY_BATCH_SIZE, MASONRY_OFFSET, MASONRY_STEP } from "./consts";

import "./Masonry.css";

type MasonryProps = {
  items: Array<{ id: string; height: number }>;
  onLastReached: () => void;
  batchSize?: number;
  offset?: number;
};

export const MasonryLayout: FC<MasonryProps> = ({
  items: itemsSrc,
  onLastReached,
  batchSize = MASONRY_BATCH_SIZE,
  offset = MASONRY_OFFSET,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const firstRef = useRef<HTMLDivElement>(null);
  const afterFirstRef = useRef<HTMLDivElement>(null);
  const [first, setFirst] = useState(0);
  const [afterFirst, setAfterFirst] = useState(0);

  const beforeLastRef = useRef<HTMLDivElement>(null);
  const lastRef = useRef<HTMLDivElement>(null);
  const [beforeLast, setBeforeLast] = useState(batchSize);
  const [last, setLast] = useState(batchSize);

  const items: MasonryItem[] = useMemo(() => {
    if (!containerRef.current) return [];

    const gridComputedStyle = window.getComputedStyle(containerRef.current);

    const columnStrings = gridComputedStyle
      .getPropertyValue("grid-template-columns")
      .split(" ");
    const columnCount = columnStrings.length;

    const columns = Array(columnCount).fill(1);

    const getMinColI = () => {
      // TODO: Can be faster
      return columns.indexOf(Math.min(...columns));
    };

    const newItems: MasonryItem[] = [];

    itemsSrc.forEach((item, i) => {
      const minI = getMinColI();
      const gridCol = minI + 1;
      const gridRowStart = columns[minI];

      const gridRowSpan = Math.round(item.height / MASONRY_STEP);

      columns[minI] += gridRowSpan;

      const gridRowEnd = gridRowStart + gridRowSpan;

      if (i === 0) {
        console.log("items", { minI, gridRowStart, gridRowEnd, gridRowSpan });
      }

      newItems.push({
        ...item,
        gridCol,
        gridRow: [gridRowStart, gridRowEnd],
      });
    });

    return newItems;
  }, [containerRef.current, itemsSrc]);

  const checkIntersections = ({ direction: scrollDirection }: ScrollState) => {
    console.log(
      "checkIntersections",
      firstRef,
      afterFirstRef,
      beforeLastRef,
      lastRef
    );

    if (scrollDirection === "down") {
      if (!afterFirstRef.current) return;

      const afterFirstRect = afterFirstRef.current.getBoundingClientRect();

      console.log({ afterFirstRect });

      const isIntersecting = afterFirstRect.bottom >= offset;

      console.log("down", { isIntersecting, bottom: afterFirstRect.bottom });

      if (!isIntersecting) {
        setFirst(afterFirst);
        setAfterFirst(afterFirst + batchSize);
      }
    }

    if (scrollDirection === "up") {
      if (!firstRef.current) return;

      const firstRect = firstRef.current.getBoundingClientRect();
      const isIntersecting = firstRect.bottom >= offset;

      if (isIntersecting) {
        const nextFirst = Math.max(first - batchSize, 0);

        if (nextFirst < first) {
          setAfterFirst(first);
          setFirst(nextFirst);
        }
      }
    }

    /// ========================================================

    if (scrollDirection === "down") {
      if (!lastRef.current) return;

      const rect2 = lastRef.current.getBoundingClientRect();

      const isIntersecting = rect2.top <= window.innerHeight - offset;

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
      const isIntersecting = rect1.top <= window.innerHeight - offset;

      if (!isIntersecting) {
        setLast(beforeLast);
        setBeforeLast(beforeLast - batchSize);
      }
    }
  };

  const scrollState = useScrollListener(checkIntersections);

  useEffect(() => {
    if (lastRef.current) {
      checkIntersections(scrollState);
    }
  }, [beforeLastRef.current, lastRef.current, checkIntersections]);

  console.log("Masonry rendered", {
    itemsSrc,
    items,
    first,
    afterFirst,
  });

  const getRefByIndex = (index: number) => {
    if (index === afterFirst) return afterFirstRef;
    if (index === first) return firstRef;
    if (index === last - 1) return lastRef;
    if (index === beforeLast - 1) return beforeLastRef;
  };

  // Needed for debug
  const getColorByIndex = (index: number) => {
    if (index === afterFirst) return "green";
    if (index === first) return "green";
    if (index === last - 1) return "blue";
    if (index === beforeLast - 1) return "blue";
  };

  return (
    <>
      <div ref={containerRef} id="grid" className="masonry">
        {items.map((item, i) => {
          if (i < first || i > last) return null;

          return (
            <div
              key={item.id}
              id={item.id}
              ref={getRefByIndex(i)}
              className="item"
              style={{
                gridRow: `${item.gridRow[0]} / ${item.gridRow[1]}`,
                gridColumn: item.gridCol,
                backgroundColor: getColorByIndex(i),
              }}
            >
              {item.id}
            </div>
          );
        })}
      </div>

      <div className="line" style={{ top: `${offset}px` }}></div>
      <div className="line" style={{ bottom: `${offset}px` }}></div>

      <div className="debug-info">
        Rendered items from {first} to {last}
      </div>
    </>
  );
};
