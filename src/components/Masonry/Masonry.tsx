import { useEffect, useMemo, useRef, useState } from "react";

import { ScrollState, useScrollListener } from "../../hooks/useScrollListener";
import { MasonryItem, MasonryItemContainer } from "./types";
import { MASONRY_BATCH_SIZE, MASONRY_OFFSET, MASONRY_STEP } from "./consts";

import "./Masonry.css";

type MasonryProps<ItemT extends MasonryItem> = {
  items: ItemT[];
  renderItem: (item: ItemT) => JSX.Element;
  batchSize?: number;
  offset?: number;
  onLastReached: () => void;
};

export const MasonryLayout = <ItemT extends MasonryItem>({
  items: itemsSrc,
  renderItem,
  onLastReached,
  batchSize = MASONRY_BATCH_SIZE,
  offset = MASONRY_OFFSET,
}: MasonryProps<ItemT>) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const firstRef = useRef<HTMLDivElement>(null);
  const afterFirstRef = useRef<HTMLDivElement>(null);
  const [first, setFirst] = useState(0);
  const [afterFirst, setAfterFirst] = useState(0);

  const beforeLastRef = useRef<HTMLDivElement>(null);
  const lastRef = useRef<HTMLDivElement>(null);
  const [beforeLast, setBeforeLast] = useState(batchSize);
  const [last, setLast] = useState(batchSize);

  const items: MasonryItemContainer<ItemT>[] = useMemo(() => {
    if (!containerRef.current) return [];

    const gridComputedStyle = window.getComputedStyle(containerRef.current);

    const columnStrings = gridComputedStyle
      .getPropertyValue("grid-template-columns")
      .split(" ");
    const columnWidth = Number(columnStrings[0].slice(0, -2));
    const columnCount = columnStrings.length;

    const columns = Array(columnCount).fill(1);

    const getMinColI = () => {
      // TODO: Can be faster
      return columns.indexOf(Math.min(...columns));
    };

    const newItems: MasonryItemContainer<ItemT>[] = [];

    itemsSrc.forEach((item, i) => {
      const minI = getMinColI();
      const gridCol = minI + 1;
      const gridRowStart = columns[minI];

      const ratio = item.width / item.height;
      const height = columnWidth / ratio;

      const gridRowSpan = Math.ceil(height / MASONRY_STEP);

      columns[minI] += gridRowSpan;

      const gridRowEnd = gridRowStart + gridRowSpan;

      const gridArea = `${gridRowStart} / ${gridCol} / ${gridRowEnd} / ${
        gridCol + 1
      }`;

      // if (i === 0) {
      //   console.log("calc", { item, ratio, columnWidth, gridRowSpan, height });
      // }

      newItems.push({
        gridArea,
        item: {
          ...item,
          id: `${item.id}-${item.timestamp}-${i}`, // TODO: Fix how ids are generated
        },
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

  useEffect(() => {
    const childrenNumber = document.querySelectorAll("#grid > div")?.length;
    const debugInfo = document.querySelector(".debug-info");

    if (debugInfo && childrenNumber) {
      console.log({ debugInfo: debugInfo.innerHTML });
      debugInfo.innerHTML = `
        Rendered items from ${first} to ${last}
        <br />
        DOM: ${childrenNumber}
        `;
    }
  });

  return (
    <>
      <div ref={containerRef} id="grid" className="masonry">
        {items.map((itemContainer, i) => {
          if (i < first || i > last) return null;

          return (
            <div
              key={itemContainer.item.id}
              ref={getRefByIndex(i)}
              style={{
                gridArea: itemContainer.gridArea,
              }}
            >
              {renderItem(itemContainer.item)}
            </div>
          );
        })}
      </div>

      <div className="line" style={{ top: `${offset}px` }}></div>
      <div className="line" style={{ bottom: `${offset}px` }}></div>

      <div className="debug-info"></div>
    </>
  );
};
