import { SortedItem } from "./types";

export function isBefore(elements: HTMLElement[]): boolean {
  const [e1, e2] = elements;
  if (e2.parentNode === e1.parentNode) {
    for (
      let cur = e1.previousSibling;
      cur && cur.nodeType !== 9;
      cur = cur.previousSibling
    ) {
      if (cur === e2) return true;
    }
  }
  return false;
}

export function moveItem<T>(items: T[], fromIndex: number, toIndex: number) {
  const element = items[fromIndex];
  items.splice(fromIndex, 1);
  items.splice(toIndex, 0, element);
}

export function addIdToItems<T>(items: T[]): SortedItem<T>[] {
  const timestamp = Date.now();
  return items.map((item, index) => {
    return { ...item, $id: `${timestamp}-${index}` };
  });
}
