import { Component, type ReactNode } from "react";
import { AlertOctagon, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
	children: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
}

export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error: unknown) {
		console.error("TaskFlow crashed:", error);
	}

	handleReload = () => {
		window.location.reload();
	};

	render() {
		if (!this.state.hasError) {
			return this.props.children;
		}

		return (
			<div className="flex min-h-screen items-center justify-center bg-background p-lg">
				<div className="w-full max-w-96 rounded-xl bg-surface-container-lowest p-lg text-center shadow-2xl ring-1 ring-black/5">
					<span className="mx-auto mb-md flex h-12 w-12 items-center justify-center rounded-full bg-error-container/40 text-error">
						<AlertOctagon className="h-6 w-6" aria-hidden="true" />
					</span>
					<h1 className="text-headline-md font-bold text-on-surface">
						Algo salió mal
					</h1>
					<p className="mt-2 text-body-md text-on-surface-variant">
						TaskFlow encontró un error inesperado. Tus tareas
						guardadas están a salvo — solo hay que recargar la
						página.
					</p>
					<button
						type="button"
						onClick={this.handleReload}
						className="mt-lg inline-flex items-center gap-sm rounded-lg bg-primary px-6 py-2 text-label-sm font-medium text-on-primary hover:bg-primary-container"
					>
						<RefreshCw className="h-4 w-4" aria-hidden="true" />
						Recargar página
					</button>
				</div>
			</div>
		);
	}
}
