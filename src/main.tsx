
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  // Application entry point: render root component into DOM
  createRoot(document.getElementById("root")!).render(<App />);
  