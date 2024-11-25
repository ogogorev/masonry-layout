import { ScrollState } from "../../hooks/useScrollListener";
import { MasonryItem, MasonryItemContainer } from "./types";

export const checkIntersections = (
  indexes: {
    first: number;
    afterFirst: number;
    beforeLast: number;
    last: number;
  },
  nodes: {
    first: HTMLDivElement | null;
    afterFirst: HTMLDivElement | null;
    beforeLast: HTMLDivElement | null;
    last: HTMLDivElement | null;
  },
  batchSize: number,
  offset: number,
  itemsCount: number,
  { direction: scrollDirection, position: scrollPosition }: ScrollState
) => {
  // return;

  const { first, afterFirst, beforeLast, last } = indexes;

  const {
    first: firstNode,
    afterFirst: afterFirstNode,
    beforeLast: beforeLastNode,
    last: lastNode,
  } = nodes;

  // console.log(
  //   "checkIntersections",
  //   "f1",
  //   first,
  //   "f2",
  //   afterFirst,
  //   "l2",
  //   beforeLast,
  //   "l1",
  //   last,
  //   "batchSize",
  //   batchSize
  //   // "itemsCount",
  //   // itemsCount
  //   // "firstRef",
  //   // !!firstNode,
  //   // "afterFirstRef",
  //   // !!afterFirstNode
  //   // beforeLastRef: beforeLastNode,
  //   // lastRef: lastRef.current,
  // );

  let newFirst = first;
  let newAfterFirst = afterFirst;
  let newBeforeLast = beforeLast;
  let newLast = last;

  // If in the highest position, just show the first batch
  if (scrollDirection === "up" && scrollPosition === 0 && newFirst !== 0) {
    return {
      newFirst: 0,
      newAfterFirst: 0,
      newBeforeLast: batchSize - 1,
      newLast: batchSize - 1,
    };
  }

  // scrolling down or in the top position
  if ((scrollPosition === 0 || scrollDirection === "down") && lastNode) {
    // lower bound
    const rect2 = lastNode.getBoundingClientRect();

    const isIntersecting = rect2.top <= window.innerHeight - offset;

    if (isIntersecting) {
      const nextLast = Math.min(last + batchSize, itemsCount - 1);

      if (nextLast > last) {
        newBeforeLast = last;
        newLast = nextLast;

        // Check upper bound only if there will be an update in lower bound
        if (afterFirstNode) {
          const afterFirstRect = afterFirstNode.getBoundingClientRect();

          const isIntersecting = afterFirstRect.bottom >= offset;

          if (!isIntersecting) {
            newFirst = afterFirst;
            newAfterFirst = afterFirst + batchSize;
          }
        }
      }
    }
  }

  // scrolling up
  if (scrollDirection === "up" && firstNode) {
    // upper bound
    const firstRect = firstNode.getBoundingClientRect();

    const dist = firstRect.bottom - offset;

    // Hack needed to skip updates in case the scroll is far above the current element.
    // It implies the user scrolled all the way back. There will be a better fix later.
    if (dist > 20000) {
      return {
        newFirst,
        newAfterFirst,
        newBeforeLast,
        newLast,
      };
    }

    const isIntersecting = dist >= 0;

    if (isIntersecting) {
      const nextFirst = Math.max(first - batchSize, 0);

      if (nextFirst < first) {
        newAfterFirst = first;
        newFirst = nextFirst;

        // Check lower bound only if there will be an update in upper bound
        if (beforeLastNode) {
          const rect = beforeLastNode.getBoundingClientRect();
          const isIntersecting = rect.top <= window.innerHeight - offset;

          if (!isIntersecting) {
            newLast = beforeLast;
            newBeforeLast = beforeLast - batchSize;
          }
        }
      }
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

  return {
    newFirst,
    newAfterFirst,
    newBeforeLast,
    newLast,
  };
};

export const calculateColumns = (gridNode: HTMLElement, gap: number) => {
  const gridComputedStyle = window.getComputedStyle(gridNode);

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

  // console.log(
  //   "debug windowWidth, columnWidth",
  //   columnStrings,
  //   columnWidths,
  //   columnCount
  // );

  return { columnWidth, columnCount };
};

const getIndexOfMin = (array: number[]) => {
  return array.indexOf(Math.min(...array));
};

export const processItems = <ItemT extends MasonryItem>(
  sourceItems: ItemT[],
  columnHeights: number[],
  columnCount: number,
  columnWidth: number,
  rowHeight: number,
  gap: number
): [MasonryItemContainer<ItemT>[], number[]] => {
  const newColumnHeights = columnHeights.length
    ? [...columnHeights]
    : Array(columnCount).fill(1);

  const newItems: MasonryItemContainer<ItemT>[] = [];

  sourceItems.forEach((item, i) => {
    const minI = getIndexOfMin(newColumnHeights);
    const gridCol = minI + 1;
    const gridRowStart = newColumnHeights[minI];

    const ratio = item.width / item.height;
    const height = columnWidth / ratio;

    const gridRowSpan = Math.ceil(height / rowHeight) + gap / rowHeight;

    newColumnHeights[minI] += gridRowSpan;

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

  return [newItems, newColumnHeights];
};
