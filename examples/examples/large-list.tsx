import React from "react";
import { Link } from "react-router-dom";
import DragSort from "../../src/drag-sort";

type Item = {
  title: string;
};

export default function LargeList() {
  const [items, setItems] = React.useState<Item[]>(
    Array.from({ length: 1000 }).map((_, index) => {
      return {
        title: `Title ${index + 1}`,
      };
    })
  );

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
      />
    </div>
  );
}
