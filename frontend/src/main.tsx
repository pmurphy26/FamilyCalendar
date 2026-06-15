import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
//import { CalendarApp } from "./App.tsx";
import CalendarWithAuth from "./AppAuth.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CalendarWithAuth />
  </StrictMode>,
);
