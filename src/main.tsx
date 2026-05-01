/**
 * 🚀 APP ENTRY POINT
 * --------------------------------------------------------------------------
 * Bootstraps the React application and mounts it to the #root DOM element.
 * Imports global styles and the main App component.
 */
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
createRoot(document.getElementById("root")!).render(<App />);