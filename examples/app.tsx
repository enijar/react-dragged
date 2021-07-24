import React from "react";
import { Switch, Route } from "react-router-dom";
import Examples from "./examples";
import Basic from "./examples/basic";
import LargeList from "./examples/large-list";

export default function App() {
  return (
    <Switch>
      <Route exact path="/" component={Examples} />
      <Route exact path="/examples/basic" component={Basic} />
      <Route exact path="/examples/large-list" component={LargeList} />
    </Switch>
  );
}
