import { FC, useEffect, useRef, useState } from "react";

import "./Masonry.css";

const OFFSET = 150;

type MasonryItemProps = {
  item: any;
  index: number;
  onIntersect?: (entry: any, index: number) => void;
};

const MasonryItem: FC<MasonryItemProps> = ({ item, index, onIntersect }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!onIntersect) return;

    const handleEntries = (entries: any[]) => {
      console.log(
        "handle entries called",
        entries,
        entries[0].target.id,
        entries[0].isIntersecting
      );

      if (entries.length > 1) {
        console.log({ entries });
        throw Error(
          "Unexpected amount of the enries in the Intersection callback!"
        );
      }

      const entry = entries[0];

      if (entry) {
        onIntersect(entry, index);
      }
    };

    const observer = new IntersectionObserver(handleEntries, {
      root: null,
      rootMargin: `-${OFFSET}px`,
      threshold: 0,
    });

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref, onIntersect]);

  return (
    <div
      key={item.id}
      id={item.id}
      ref={ref}
      className="item"
      style={{
        gridRow: `span ${item.gridRow}`,
        backgroundColor: onIntersect ? "blue" : undefined,
      }}
    >
      {item.id}
    </div>
  );
};

const STEP = 20 + 10;
const BATCH_SIZE = 10;

type MasonryItemType = {
  id: string;
  height: number;
};

type MasonryProps = {
  batchSize?: number;
  items: Array<MasonryItemType>;
};

export const MasonryLayout: FC<MasonryProps> = ({
  batchSize = BATCH_SIZE,
  items: itemsSrc,
}) => {
  const [first, setFirst] = useState(0);
  const [last, setLast] = useState(batchSize);

  const [trackedFirst, setTrackedFirst] = useState(0);
  const [trackedLast, setTrackedLast] = useState(batchSize);

  const items = itemsSrc.map((item) => {
    return {
      ...item,
      gridRow: Math.round(item.height / STEP),
    };
  });

  const visibleItems = items.slice(first, last);

  const handleIntersectionOfFirst = (entry: any) => {
    // setIndexes({ ...indexes, end: indexes.end + batchSize });
  };

  const handleIntersectionOfLast = (entry: any, index: number) => {
    if (index === last) {
      if (entry.isIntersecting) {
        setTrackedLast(index);

        const nextLast = Math.min(items.length, last + batchSize);
        setLast(nextLast);
      }
      return;
    }

    if (index === trackedLast) {
      if (entry.isIntersecting) {
      }
      return;
    }

    if (entry.isIntersecting) {
    } else {
      if (trackedLast < last) {
        setTrackedLast(trackedLast - batchSize);
        setLast(last - batchSize);
      }
      // setLast(trackedLast);
      // setTrackedLast(trackedLast - batchSize);
    }
  };

  const getIntersectionHandlerByIndex = (index: number) => {
    if (index === last - 1 || index === trackedLast - 1) {
      return handleIntersectionOfLast;
    }
  };

  console.log("Masonry rendered", {
    items,
    visibleItems,
    first,
    last,
    trackedFirst,
    trackedLast,
  });

  return (
    <>
      <div className="masonry">
        {visibleItems.map((item, i) => {
          return (
            <MasonryItem
              key={item.id}
              index={i}
              item={item}
              onIntersect={getIntersectionHandlerByIndex(i)}
            />
          );
        })}
      </div>

      <div className="line" style={{ top: `${OFFSET}px` }}></div>
      <div className="line" style={{ bottom: `${OFFSET}px` }}></div>
    </>
  );
};

// useEffect(() => {
//   console.log("useEffect called", lastRenderedNodeRef);

//   const handleEntries = (entries: any[]) => {
//     console.log(
//       "handle entries called",
//       entries,
//       entries[0].target.id,
//       entries[0].isIntersecting
//     );

//     if (entries.length > 2) {
//       console.log({ entries });
//       throw Error(
//         "Unexpected amount of the enries in the Intersection callback!"
//       );
//     }

//     const entry = entries[0];

//     if (entry && entry.isIntersecting) {
//       setIndexes({ ...indexes, end: indexes.end + batchSize });
//     }
//   };

//   const observer = new IntersectionObserver(handleEntries, {
//     root: null,
//     threshold: 1,
//   });

//   if (firstRenderedNodeRef.current)
//     observer.observe(firstRenderedNodeRef.current);
//   if (lastRenderedNodeRef.current)
//     observer.observe(lastRenderedNodeRef.current);

//   return () => {
//     if (firstRenderedNodeRef.current)
//       observer.unobserve(firstRenderedNodeRef.current);
//     if (lastRenderedNodeRef.current)
//       observer.unobserve(lastRenderedNodeRef.current);
//   };
// }, [firstRenderedNodeRef.current, lastRenderedNodeRef.current]);

// const predictItemsVisibleOnTheScreen = (
//   items: Array<{ height: number }>,
//   columns: number,
//   gap: number,
//   windowWidth: number,
//   windowHeight: number,
// ) => { };
