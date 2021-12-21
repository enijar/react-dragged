import React from "react";
import { Link } from "react-router-dom";
import DragSort from "../../src/drag-sort";

type Item = {
  title: string;
};

export default function CustomElements() {
  const [items, setItems] = React.useState<Item[]>([
    {
      title: "A",
    },
    {
      title: "B",
    },
    {
      title: "C",
    },
    {
      title: "D",
    },
    {
      title: "E",
    },
    {
      title: "F",
    },
  ]);

  return (
    <div className="items">
      <div>
        <Link to="/">Back to Examples</Link>
      </div>
      <DragSort<Item>
        items={items}
        onChange={setItems}
        renderItem={(item) => {
          return <div className="item">{item.title}</div>;
        }}
        renderContainerElement="ol"
        renderItemElement="li"
      />
    </div>
  );
}
