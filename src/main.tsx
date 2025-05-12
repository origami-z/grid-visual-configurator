import { SaltProviderNext } from "@salt-ds/core";
import "@salt-ds/theme/index.css";
import "@salt-ds/theme/css/theme-next.css";
import "antd/dist/reset.css";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <SaltProviderNext corner="rounded" accent="teal">
      <App />
    </SaltProviderNext>
  </React.StrictMode>
);
