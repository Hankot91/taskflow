import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import "./index.css";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";

// Aplica el tema guardado ANTES del primer render para evitar parpadeo
const stored = localStorage.getItem("taskflow-ui-preferences");
if (stored) {
	try {
		const parsed = JSON.parse(stored);
		if (parsed?.state?.theme === "dark") {
			document.documentElement.classList.add("dark");
			document.documentElement.style.colorScheme = "dark";
		}
	} catch {
		// ignorar si el JSON guardado está corrupto
	}
}

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ErrorBoundary>
			<App />
			<Toaster richColors position="top-right" closeButton />
		</ErrorBoundary>
	</StrictMode>,
);
