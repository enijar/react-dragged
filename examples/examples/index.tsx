import React from "react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <ol>
      <li>
        <Link to="/examples/basic">Basic</Link>
      </li>
      <li>
        <Link to="/examples/large-list">Large List</Link>
      </li>
      <li>
        <Link to="/examples/custom-elements">Custom Elements</Link>
      </li>
    </ol>
  );
}
