import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

const main = () => {
  const el = document.getElementById("root");
  if (!el) return;

  const root = createRoot(el);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

main();
