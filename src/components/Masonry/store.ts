import { atom, map, PreinitializedWritableAtom } from "nanostores";

type MasonryState = {
  $first: PreinitializedWritableAtom<number>;
  $afterFirst: PreinitializedWritableAtom<number>;
  $beforeLast: PreinitializedWritableAtom<number>;
  $last: PreinitializedWritableAtom<number>;
};

type MasonryStateValues = {
  first: number;
  afterFirst: number;
  beforeLast: number;
  last: number;
};

type MasonryStore = Record<string, MasonryState>;

export const $masonryStore = map<MasonryStore>({});

const createState = ({
  first,
  afterFirst,
  beforeLast,
  last,
}: MasonryStateValues) => {
  return {
    $first: atom<number>(first),
    $afterFirst: atom<number>(afterFirst),
    $beforeLast: atom<number>(beforeLast),
    $last: atom<number>(last),
  };
};

export const getState = (
  key: string,
  initialStateValues: MasonryStateValues
) => {
  const store = $masonryStore.get()[key];
  if (store) return store;

  $masonryStore.setKey(key, createState(initialStateValues));
  return $masonryStore.get()[key];
};
