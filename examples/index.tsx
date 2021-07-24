import React from "react";
import { render } from "react-dom";
import { HashRouter as Router } from "react-router-dom";
import "./style.css";
import App from "./app";

const root = document.createElement("div");

render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.body.appendChild(root)
);
