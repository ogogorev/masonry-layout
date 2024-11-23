import { useEffect, useMemo, useRef, useState } from "react";

import { ScrollState, useScrollListener } from "../../hooks/useScrollListener";
import { MasonryItem, MasonryItemContainer } from "./types";
import { MASONRY_BATCH_SIZE, MASONRY_OFFSET, MASONRY_STEP } from "./consts";

import {
  debugInfo as debugInfoClassName,
  MasonryItemStyled,
  MasonryStyled,
  OffsetLine,
} from "./Masonry.styles";

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
  const [beforeLast, setBeforeLast] = useState(batchSize - 1);
  const [last, setLast] = useState(batchSize - 1);

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
        key: `${item.id}-${item.timestamp}-${i}`, // TODO: Fix how ids are generated
        item: {
          ...item,
        },
      });
    });

    return newItems;
  }, [containerRef.current, itemsSrc]);

  const checkIntersections = ({ direction: scrollDirection }: ScrollState) => {
    // return;

    console.log(
      "checkIntersections",
      "f1",
      first,
      "f2",
      afterFirst,
      "l2",
      beforeLast,
      "l1",
      last,
      "firstRef",
      !!firstRef.current,
      "afterFirstRef",
      !!afterFirstRef.current
      // beforeLastRef: beforeLastRef.current,
      // lastRef: lastRef.current,
    );

    let newFirst = first;
    let newAfterFirst = afterFirst;
    let newBeforeLast = beforeLast;
    let newLast = last;

    // scrolling down, lower bound
    if (scrollDirection === "down" && lastRef.current) {
      const rect2 = lastRef.current.getBoundingClientRect();

      const isIntersecting = rect2.top <= window.innerHeight - offset;

      if (isIntersecting) {
        const nextLast = Math.min(last + batchSize, items.length - 1);

        if (nextLast > last) {
          newBeforeLast = last;
          newLast = nextLast;
        } else {
          onLastReached();
        }
      }
    }

    // scrolling down, upper bound
    if (scrollDirection === "down" && afterFirstRef.current) {
      const afterFirstRect = afterFirstRef.current.getBoundingClientRect();

      const isIntersecting = afterFirstRect.bottom >= offset;

      if (!isIntersecting) {
        newFirst = afterFirst;
        newAfterFirst = afterFirst + batchSize;
      }
    }

    // scrolling up, upper bound
    if (scrollDirection === "up" && firstRef.current) {
      const firstRect = firstRef.current.getBoundingClientRect();
      const isIntersecting = firstRect.bottom >= offset;

      if (isIntersecting) {
        const nextFirst = Math.max(first - batchSize, 0);

        if (nextFirst < first) {
          newAfterFirst = first;
          newFirst = nextFirst;
        }
      }
    }

    // scrolling up, lower bound
    if (scrollDirection === "up" && beforeLastRef.current) {
      const rect1 = beforeLastRef.current.getBoundingClientRect();
      const isIntersecting = rect1.top <= window.innerHeight - offset;

      if (!isIntersecting) {
        newLast = beforeLast;
        newBeforeLast = beforeLast - batchSize;
      }
    }

    /**
     * There are cases where the batch size is bigger than the amount
     * of items visible on the screen. For such cases, the batchSize should be adjusted
     * to avoid loading too many items. This issue is not addressed yet.
     */

    if (newAfterFirst >= newBeforeLast) {
      const d = Math.floor((newAfterFirst - newBeforeLast) / 2);
      newAfterFirst = newBeforeLast + d;
      newBeforeLast = newAfterFirst + 1;
    }

    if (newBeforeLast >= newLast) {
      newLast = newBeforeLast + 1;
    }

    if (newFirst !== first) setFirst(newFirst);
    if (newAfterFirst !== afterFirst) setAfterFirst(newAfterFirst);
    if (newBeforeLast !== beforeLast) setBeforeLast(newBeforeLast);
    if (newLast !== last) setLast(newLast);
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
    if (index === last) return lastRef;
    if (index === beforeLast) return beforeLastRef;
  };

  useEffect(() => {
    const childrenNumber = document.querySelectorAll("#grid > div")?.length;
    const debugInfo = document.querySelector(`.${debugInfoClassName}`);

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
      <MasonryStyled ref={containerRef} id="grid">
        {items.map((itemContainer, i) => {
          if (i < first || i > last) return null;

          return (
            <MasonryItemStyled
              key={itemContainer.key}
              ref={getRefByIndex(i)}
              gridArea={itemContainer.gridArea}
            >
              {renderItem(itemContainer.item)}
            </MasonryItemStyled>
          );
        })}
      </MasonryStyled>

      <OffsetLine top={offset} />
      <OffsetLine bottom={offset} />

      <div className={debugInfoClassName} />
    </>
  );
};
