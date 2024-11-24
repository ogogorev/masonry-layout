import { ScrollState } from "../../hooks/useScrollListener";

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
  scrollDirection: ScrollState["direction"]
) => {
  // return;

  const { first, afterFirst, beforeLast, last } = indexes;

  const {
    first: firstNode,
    afterFirst: afterFirstNode,
    beforeLast: beforeLastNode,
    last: lastNode,
  } = nodes;

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
    "batchSize",
    batchSize
    // "itemsCount",
    // itemsCount
    // "firstRef",
    // !!firstNode,
    // "afterFirstRef",
    // !!afterFirstNode
    // beforeLastRef: beforeLastNode,
    // lastRef: lastRef.current,
  );

  let newFirst = first;
  let newAfterFirst = afterFirst;
  let newBeforeLast = beforeLast;
  let newLast = last;

  // scrolling down
  if (scrollDirection === "down" && lastNode) {
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
    const isIntersecting = firstRect.bottom >= offset;

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
