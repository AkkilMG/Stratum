import { ErrorBoundary } from "./ui";
import { createRoot } from "react-dom/client";
import App from "./App";
createRoot(document.getElementById("root")!).render(<ErrorBoundary><App /></ErrorBoundary>);
