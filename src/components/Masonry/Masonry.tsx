import { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "@nanostores/react";

import { ScrollState, useScrollListener } from "../../hooks/useScrollListener";
import { MasonryItem, MasonryItemContainer } from "./types";
import {
  MASONRY_BATCH_SIZE,
  MASONRY_MIN_COLUMN_WIDTH,
  MASONRY_GAP,
  MASONRY_OFFSET,
  MASONRY_ROW_HEIGHT,
} from "./consts";
import { getState } from "./store";
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
  onLastReached: () => void;
  stateKey: string;
  offset?: number;
  gap?: number;
  minColumnWidth?: number;
};

const useResizeListener = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    let timeoutId: number;
    const handleResize = () => {
      timeoutId = setTimeout(() => {
        setWindowWidth(window.innerWidth);
      }, 500);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  });

  return windowWidth;
};

export const MasonryLayout = <ItemT extends MasonryItem>({
  items: itemsSrc,
  renderItem,
  onLastReached,
  batchSize = MASONRY_BATCH_SIZE,
  offset = MASONRY_OFFSET,
  stateKey,
  gap = MASONRY_GAP,
  minColumnWidth = MASONRY_MIN_COLUMN_WIDTH,
}: MasonryProps<ItemT>) => {
  const windowWidth = useResizeListener();

  console.log("debug windowWidth", windowWidth);

  const { $first, $afterFirst, $beforeLast, $last } = getState(stateKey, {
    first: 0,
    afterFirst: 0,
    beforeLast: batchSize - 1,
    last: batchSize - 1,
  });

  const first = useStore($first);
  const afterFirst = useStore($afterFirst);
  const beforeLast = useStore($beforeLast);
  const last = useStore($last);

  const firstRef = useRef<HTMLDivElement>(null);
  const afterFirstRef = useRef<HTMLDivElement>(null);

  const beforeLastRef = useRef<HTMLDivElement>(null);
  const lastRef = useRef<HTMLDivElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const items: MasonryItemContainer<ItemT>[] = useMemo(() => {
    if (!containerRef.current) return [];

    const gridComputedStyle = window.getComputedStyle(containerRef.current);

    /**
     * The code below is really bad and has to be rewritten (or removed).
     * It's needed to fix the grid after a resize event. Since the width of grid columns
     * is dynamic, after a resize event the column widths might not be equal.
     * The grid items that are still assigned to the columns with smaller width prevent the grid
     * from normal resizing (where it would remove the not fitting columns).
     * To fix that I need to compare all the widths, recalculate the new column width,
     * and rearrange the grid. It becomes clear that grid is not the best solution
     * for such a dynamic masonry layout, but if I still keep it, then I should at least consider
     * fixing column width per breakpoint to avoid the math below.
     * // TODO: Find a better solution.
     */
    const columnStrings = gridComputedStyle
      .getPropertyValue("grid-template-columns")
      .split(" ");

    const DELTA = 2;
    const columnWidths = columnStrings.map((s) => Number(s.slice(0, -2)));
    const columnCount = columnWidths.filter(
      (cW) => Math.abs(cW - columnWidths[0]) < DELTA
    ).length;

    let columnWidth = columnWidths[0];

    if (columnCount < columnWidths.length) {
      const sumOfCurrentColumns = columnWidths.reduce((a, c) => a + c, 0);
      columnWidth =
        (sumOfCurrentColumns + gap * (columnWidths.length - columnCount)) /
        columnCount;
    }

    console.log(
      "debug windowWidth, columnWidth",
      columnStrings,
      columnWidths,
      columnCount
    );

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

      const gridRowSpan =
        Math.ceil(height / MASONRY_ROW_HEIGHT) + gap / MASONRY_ROW_HEIGHT;

      columns[minI] += gridRowSpan;

      const gridRowEnd = gridRowStart + gridRowSpan;

      const gridArea = `${gridRowStart} / ${gridCol} / ${gridRowEnd} / ${
        gridCol + 1
      }`;

      newItems.push({
        gridArea,
        key: `${item.id}-${item.timestamp}-${i}`, // TODO: Fix how ids are generated
        item: {
          ...item,
        },
      });
    });

    return newItems;
  }, [containerRef.current, itemsSrc, windowWidth]);

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

    if (newFirst !== first) $first.set(newFirst);
    if (newAfterFirst !== afterFirst) $afterFirst.set(newAfterFirst);
    if (newBeforeLast !== beforeLast) $beforeLast.set(newBeforeLast);
    if (newLast !== last) $last.set(newLast);
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
      <MasonryStyled
        ref={containerRef}
        id="grid"
        columnGap={gap}
        rowHeight={MASONRY_ROW_HEIGHT}
        minColumnWidth={minColumnWidth}
      >
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
