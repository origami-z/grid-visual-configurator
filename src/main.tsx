import React from "react";
import { createRoot } from "react-dom/client";
import "@salt-ds/theme/index.css";
import "antd/dist/reset.css";
import "./index.css";
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
