import { FC, useEffect, useMemo, useRef } from "react";
import { useStore } from "@nanostores/react";

import { ScrollState, useScrollListener } from "../../hooks/useScrollListener";
import { useResizeListener } from "../../hooks/useResizeListener";
import { MasonryItem as MasonryItemComponent } from "./MasonryItem";
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
  MasonryStyled,
  OffsetLine,
} from "./Masonry.styles";
import { checkIntersections } from "./utils";

type MasonryProps<ItemT extends MasonryItem> = {
  items: ItemT[];
  ItemContentComponent: FC<{ item: ItemT }>;
  batchSize?: number;
  onLastReached: () => void;
  stateKey: string;
  offset?: number;
  gap?: number;
  minColumnWidth?: number;
};

export const MasonryLayout = <ItemT extends MasonryItem>({
  items: itemsSrc,
  ItemContentComponent,
  onLastReached,
  batchSize = MASONRY_BATCH_SIZE,
  offset = MASONRY_OFFSET,
  stateKey,
  gap = MASONRY_GAP,
  minColumnWidth = MASONRY_MIN_COLUMN_WIDTH,
}: MasonryProps<ItemT>) => {
  const windowWidth = useResizeListener();

  const itemsCount = itemsSrc.length;

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

  const handleScroll = ({ direction: scrollDirection }: ScrollState) => {
    const { newFirst, newAfterFirst, newBeforeLast, newLast } =
      checkIntersections(
        { first, afterFirst, beforeLast, last },
        {
          first: firstRef.current,
          afterFirst: afterFirstRef.current,
          beforeLast: beforeLastRef.current,
          last: lastRef.current,
        },
        batchSize,
        offset,
        itemsCount,
        scrollDirection
      );

    if (newFirst !== first) $first.set(newFirst);
    if (newAfterFirst !== afterFirst) $afterFirst.set(newAfterFirst);
    if (newBeforeLast !== beforeLast) $beforeLast.set(newBeforeLast);
    if (newLast !== last) $last.set(newLast);
  };

  useScrollListener(handleScroll, 30);

  useEffect(() => {
    if (lastRef.current) {
      handleScroll({ direction: "down", position: 0 });
    }
  }, [beforeLastRef.current, lastRef.current, handleScroll]);

  useEffect(() => {
    if (last >= itemsCount - 1) {
      onLastReached();
    }
  }, [last, itemsCount, onLastReached]);

  console.log("Masonry rendered", {
    itemsSrc,
    items,
    first,
    afterFirst,
    beforeLast,
    last,
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
          const ref = getRefByIndex(i);
          return (
            <MasonryItemComponent
              key={itemContainer.key}
              ref={ref}
              refValue={ref}
              gridArea={itemContainer.gridArea}
            >
              <ItemContentComponent item={itemContainer.item} />
            </MasonryItemComponent>
          );
        })}
      </MasonryStyled>

      <OffsetLine top={offset} />
      <OffsetLine bottom={offset} />

      <div className={debugInfoClassName} />
    </>
  );
};
