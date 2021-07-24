export type SortedItem<T> = T & {
  id: string;
};

export type Dragged<T> = {
  item: T;
  index: number;
  element: HTMLElement;
};

export type RenderItem<T> = (item: T) => any;

export type OnChange<T> = (items: T[]) => void;
