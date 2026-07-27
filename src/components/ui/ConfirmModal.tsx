import { createPortal } from "react-dom";
import { AlertTriangle } from "lucide-react";
import { useModalA11y } from "@/hooks/useModalA11y";
import { cn } from "@/lib/utils";

interface ConfirmModalProps {
	open: boolean;
	title: string;
	description: string;
	confirmLabel?: string;
	cancelLabel?: string;
	tone?: "danger" | "default";
	onConfirm: () => void;
	onCancel: () => void;
}

export function ConfirmModal({
	open,
	title,
	description,
	confirmLabel = "Confirmar",
	cancelLabel = "Cancelar",
	tone = "danger",
	onConfirm,
	onCancel,
}: ConfirmModalProps) {
	const containerRef = useModalA11y(open, onCancel);

	if (!open) return null;

	return createPortal(
		<>
			<button
				type="button"
				aria-hidden="true"
				tabIndex={-1}
				onClick={onCancel}
				className="fixed inset-0 z-60 bg-on-background/40"
			/>
			<div
				ref={containerRef as React.RefObject<HTMLDivElement>}
				role="alertdialog"
				aria-modal="true"
				aria-labelledby="confirm-modal-title"
				aria-describedby="confirm-modal-desc"
				className="fixed left-1/2 top-1/2 z-60 w-[calc(100%-2rem)] max-w-96 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-surface-container-lowest/95 p-lg shadow-2xl ring-1 ring-black/5 backdrop-blur-xl focus:outline-none"
			>
				<div className="mb-md flex items-start gap-sm">
					<span
						className={cn(
							"flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
							tone === "danger"
								? "bg-error-container/40 text-error"
								: "bg-primary-container/20 text-primary",
						)}
					>
						<AlertTriangle
							className="h-4.5 w-4.5"
							aria-hidden="true"
						/>
					</span>
					<div>
						<h2
							id="confirm-modal-title"
							className="text-body-lg font-bold text-on-surface"
						>
							{title}
						</h2>
						<p
							id="confirm-modal-desc"
							className="mt-1 text-[13px] text-on-surface-variant"
						>
							{description}
						</p>
					</div>
				</div>

				<div className="flex justify-end gap-sm">
					<button
						type="button"
						onClick={onCancel}
						className="rounded-lg px-4 py-2 text-label-sm font-medium text-on-surface-variant hover:bg-surface-container-high"
					>
						{cancelLabel}
					</button>
					<button
						type="button"
						onClick={onConfirm}
						className={cn(
							"rounded-lg px-4 py-2 text-label-sm font-medium text-white",
							tone === "danger"
								? "bg-error hover:opacity-90"
								: "bg-primary hover:bg-primary-container",
						)}
					>
						{confirmLabel}
					</button>
				</div>
			</div>
		</>,
		document.body,
	);
}
