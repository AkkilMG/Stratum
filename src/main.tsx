import { ErrorBoundary } from "./ui";
import { I18nProvider } from "./i18n";
import { createRoot } from "react-dom/client";
import App from "./App";
createRoot(document.getElementById("root")!).render(<I18nProvider><ErrorBoundary><App /></ErrorBoundary></I18nProvider>);
