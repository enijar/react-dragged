import React from "react";
import { Dragged, OnChange, RenderItem, SortedItem } from "./types";
import { addIdToItems, isBefore, moveItem } from "./utils";

export type Props<T> = {
  items: T[];
  onChange: OnChange<T>;
  renderItem: RenderItem<T>;
};

export default function DragSort<T>({ items, onChange, renderItem }: Props<T>) {
  /**
   * Store callbacks inside refs
   */

  const onChangeRef = React.useRef<OnChange<T>>(onChange);
  React.useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const renderItemRef = React.useRef<RenderItem<T>>(renderItem);
  React.useEffect(() => {
    renderItemRef.current = renderItem;
  }, [onChange]);

  /**
   * Logic
   */

  const sortedItems = React.useMemo(() => addIdToItems(items), [items]);
  const draggedRef = React.useRef<Dragged<T> | null>(null);
  const sortedItemsRef = React.useRef<SortedItem<T>[]>(sortedItems);

  const onDrag = React.useCallback(
    (item: T, index: number) => {
      return (event: React.DragEvent<HTMLElement>) => {
        let element = event.target as HTMLElement;
        if (!element.dataset.hasOwnProperty("dragSortType")) {
          element = element.closest(
            `[data-drag-sort-type="item"]`
          ) as HTMLElement;
        }

        switch (event.type) {
          case "dragstart":
            event.dataTransfer.effectAllowed = "move";
            // Fix for Firefox
            event.dataTransfer.setData("text/plain", "");
            element.dataset.dragSortState = "dragged";
            draggedRef.current = { item, index, element };
            break;
          case "dragenter":
            if (draggedRef.current === null) return;
            if (element === draggedRef.current.element) return;
            const container = draggedRef.current.element
              .parentElement as HTMLElement;
            if (isBefore([draggedRef.current.element, element])) {
              container.insertBefore(draggedRef.current.element, element);
            } else {
              container.insertBefore(element, draggedRef.current.element);
            }
            moveItem(sortedItemsRef.current, draggedRef.current.index, index);
            draggedRef.current.index = index;
            break;
          case "dragend":
            element.dataset.dragSortState = "static";
            onChangeRef.current([...sortedItemsRef.current]);
            break;
        }
      };
    },
    [items]
  );

  /**
   * Render UI
   */

  return (
    <div data-drag-sort="container">
      {sortedItems.map((item, index) => {
        return (
          <div
            key={item.id}
            draggable
            data-drag-sort-state="static"
            data-drag-sort-type="item"
            onDragStart={onDrag(item, index)}
            onDragEnter={onDrag(item, index)}
            onDragEnd={onDrag(item, index)}
          >
            {renderItemRef.current(item)}
          </div>
        );
      })}
    </div>
  );
}
