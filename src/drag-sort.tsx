import React from "react";
import { Dragged, OnChange, RenderItem, SortedItem } from "./types";
import { addIdToItems, isBefore, moveItem } from "./utils";

export type Props<Item> = {
  items: Item[];
  onChange: OnChange<Item>;
  renderItem: RenderItem<Item>;
  renderContainerElement?: any;
  renderItemElement?: any;
};

export default function DragSort<Item>({
  items,
  onChange,
  renderItem,
  renderContainerElement,
  renderItemElement,
}: Props<Item>) {
  /**
   * Store callbacks inside refs
   */

  const onChangeRef = React.useRef<OnChange<Item>>(onChange);
  React.useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const renderItemRef = React.useRef<RenderItem<Item>>(renderItem);
  React.useEffect(() => {
    renderItemRef.current = renderItem;
  }, [onChange]);

  /**
   * Logic
   */

  const sortedItems = React.useMemo(() => addIdToItems(items), [items]);
  const draggedRef = React.useRef<Dragged<Item> | null>(null);
  const sortedItemsRef = React.useRef<SortedItem<Item>[]>(sortedItems);
  React.useEffect(() => {
    sortedItemsRef.current = sortedItems;
  }, [sortedItems]);

  const onDrag = React.useCallback(
    (item: Item, index: number) => {
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

  const ContainerElement = React.useMemo<any>(() => {
    if (!renderContainerElement) return "div";
    return renderContainerElement;
  }, [renderContainerElement]);

  const ItemElement = React.useMemo<any>(() => {
    if (!renderItemElement) return "div";
    return renderItemElement;
  }, [renderItemElement]);

  /**
   * Render UI
   */

  return (
    <ContainerElement data-drag-sort="container">
      {sortedItems.map((item, index) => {
        return (
          <ItemElement
            key={item.id}
            draggable
            data-drag-sort-state="static"
            data-drag-sort-type="item"
            onDragStart={onDrag(item, index)}
            onDragEnter={onDrag(item, index)}
            onDragEnd={onDrag(item, index)}
          >
            {renderItemRef.current(item, index)}
          </ItemElement>
        );
      })}
    </ContainerElement>
  );
}
