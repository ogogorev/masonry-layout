import { FC, forwardRef, useEffect, useMemo, useRef, useState } from "react";

import "./Masonry.css";

const OFFSET = 0;

type MasonryItemProps = {
  item: any;
  index: number;
  onIntersect?: (entry: any, index: number) => void;
};

// const MasonryItem: FC<MasonryItemProps> = ({ item, index, onIntersect }) => {
const MasonryItem: FC<MasonryItemProps> = forwardRef(
  ({ item, index, onIntersect, color }, ref) => {
    // console.log("render item", ref);

    return (
      <div
        key={item.id}
        id={item.id}
        ref={ref}
        className="item"
        style={{
          gridRow: `${item.gridRow[0]} / ${item.gridRow[1]}`,
          gridColumn: item.gridCol,
          backgroundColor: color ? color : undefined,
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

  const firstRef = useRef<HTMLDivElement>(null);
  const afterFirstRef = useRef<HTMLDivElement>(null);
  const [first, setFirst] = useState(0);
  const [afterFirst, setAfterFirst] = useState(0);

  const beforeLastRef = useRef<HTMLDivElement>(null);
  const lastRef = useRef<HTMLDivElement>(null);
  const [beforeLast, setBeforeLast] = useState(batchSize);
  const [last, setLast] = useState(batchSize);

  const items: any[] | undefined = useMemo(() => {
    if (!containerRef.current) return undefined;

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

    // items
    //   .slice(start, end)
    //   .map(({ gridRow }) => gridRow)
    //   .forEach((gridRow) => {
    //     const minI = getMinColI();
    //     columns[minI] += gridRow;
    //   });

    const newItems = [];

    itemsSrc.forEach((item, i) => {
      const minI = getMinColI();
      const gridCol = minI + 1;
      const gridRowStart = columns[minI];

      const gridRowSpan = Math.round(item.height / STEP);

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

  const checkIntersections = () => {
    console.log(
      "checkIntersections",
      scrollDirection,
      firstRef,
      afterFirstRef,
      beforeLastRef,
      lastRef
    );

    if (scrollDirection === "down") {
      if (!afterFirstRef.current) return;

      const afterFirstRect = afterFirstRef.current.getBoundingClientRect();

      console.log({ afterFirstRect });

      const isIntersecting = afterFirstRect.bottom >= OFFSET;

      console.log("down", { isIntersecting, bottom: afterFirstRect.bottom });

      if (!isIntersecting) {
        setFirst(afterFirst);
        setAfterFirst(afterFirst + batchSize);
      }
    }

    if (scrollDirection === "up") {
      if (!firstRef.current) return;

      const firstRect = firstRef.current.getBoundingClientRect();
      const isIntersecting = firstRect.bottom >= OFFSET;

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
    itemsSrc,
    items,
    first,
    afterFirst,
  });

  const getRefByIndex = (index: number) => {
    if (index === afterFirst) return [afterFirstRef, "green"];
    if (index === first) return [firstRef, "green"];
    if (index === last - 1) return [lastRef, "blue"];
    if (index === beforeLast - 1) return [beforeLastRef, "blue"];
    return [];
  };

  return (
    <>
      <div ref={containerRef} id="grid" className="masonry">
        {items &&
          items.map((item, i) => {
            if (i < first || i > last) return null;

            const [ref, color] = getRefByIndex(i);

            return (
              <MasonryItem
                key={item.id}
                index={i}
                item={item}
                color={color}
                ref={ref}
              />
            );
          })}
      </div>

      <div className="line" style={{ top: `${OFFSET}px` }}></div>
      <div className="line" style={{ bottom: `${OFFSET}px` }}></div>

      <div className="debug-info">
        Rendered items from {first} to {last}
      </div>
    </>
  );
};
