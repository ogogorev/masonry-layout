import {
  FC,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useStore } from "@nanostores/react";

import { ScrollState, useScrollListener } from "../../hooks/useScrollListener";
import { useResizeListener } from "../../hooks/useResizeListener";
import { MasonryItem as MasonryItemComponent } from "./MasonryItem";
import { MasonryItem, MasonryItemContainer } from "./types";
import { calculateColumns, checkIntersections, processItems } from "./math";
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

  const windowWidth = useResizeListener();

  const [columnState, setColumnState] = useState({
    columnCount: 0,
    columnWidth: 0,
  });
  const { columnCount, columnWidth } = columnState;

  useLayoutEffect(() => {
    if (containerRef.current) {
      setColumnState(calculateColumns(containerRef.current, gap));
    }
  }, [containerRef.current, windowWidth]);

  const items: MasonryItemContainer<ItemT>[] = useMemo(() => {
    if (!columnCount || !columnWidth) return [];
    return processItems(
      itemsSrc,
      columnCount,
      columnWidth,
      MASONRY_ROW_HEIGHT,
      gap
    );
  }, [itemsSrc, columnCount, columnWidth]);

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
    columnWidth,
    columnCount,
    first,
    afterFirst,
    beforeLast,
    last,
    containerRef,
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
