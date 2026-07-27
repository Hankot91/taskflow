import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR =
	'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function useModalA11y<T extends HTMLElement>(
	open: boolean,
	onClose: () => void,
) {
	const containerRef = useRef<T>(null);

	useEffect(() => {
		if (!open) return;

		const previouslyFocused = document.activeElement as HTMLElement | null;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		containerRef.current?.focus();

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
				return;
			}

			if (e.key !== "Tab" || !containerRef.current) return;

			const focusable =
				containerRef.current.querySelectorAll<HTMLElement>(
					FOCUSABLE_SELECTOR,
				);
			if (focusable.length === 0) return;

			const first = focusable[0];
			const last = focusable[focusable.length - 1];

			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = previousOverflow;
			previouslyFocused?.focus();
		};
	}, [open, onClose]);

	return containerRef;
}
