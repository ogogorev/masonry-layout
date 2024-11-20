export type MasonryItem = {
  id: number;
  width: number;
  height: number;
  // Added timestamp here to be able to generate more precise ids
  timestamp: number;
};

export type MasonryItemContainer<ItemT extends MasonryItem> = {
  gridArea: string;
  item: ItemT;
};
