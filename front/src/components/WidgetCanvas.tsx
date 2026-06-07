import React, { useState, useRef } from "react";
import type { WidgetData } from "../objects/WidgetData";

const roundTo = 20;

type ResizeDir = "right" | "bottom" | "corner";

type Props = {
	initialWidgets: WidgetData[];
};

export default function WidgetCanvas({ initialWidgets }: Props) {
	const [widgets, setWidgets] = useState<WidgetData[]>([]);
	const [availableWidgets] = useState<WidgetData[]>(initialWidgets);
	const [showPanel, setShowPanel] = useState(true);

	/* ---------------- HISTORY ---------------- */
	const history = useRef<WidgetData[][]>([]);
	const redoStack = useRef<WidgetData[][]>([]);

	const pushHistory = (state: WidgetData[]) => {
		history.current.push(state.map((w) => ({ ...w })));
		redoStack.current = [];
		setWidgets(state);
	};

	const commit = () => {
		pushHistory(widgets);
	};

	const undo = () => {
		if (history.current.length === 0) return;

		const prev = history.current.pop()!;
		redoStack.current.push(widgets.map((w) => ({ ...w })));
		setWidgets(prev);
	};

	const redo = () => {
		if (redoStack.current.length === 0) return;

		const next = redoStack.current.pop()!;
		history.current.push(widgets.map((w) => ({ ...w })));
		setWidgets(next);
	};

	/* ---------------- refs ---------------- */
	const draggingId = useRef<string | null>(null);
	const resizing = useRef<{
		id: string;
		dir: ResizeDir;
		startX: number;
		startY: number;
		startW: number;
		startH: number;
		startXWidget: number;
		startYWidget: number;
	} | null>(null);

	const offset = useRef({ x: 0, y: 0 });

	/* ---------------- widget ops ---------------- */
	const updateWidgetLive = (id: string, patch: Partial<WidgetData>) => {
		setWidgets((prev) =>
			prev.map((w) => (w.id === id ? { ...w, ...patch } : w))
		);
	};

	const removeWidget = (id: string) => {
		pushHistory(widgets.filter((w) => w.id !== id));
	};

	const addWidget = (widget: WidgetData) => {
		if (widgets.some((w) => w.id === widget.id)) return;
		pushHistory([...widgets, widget]);
	};

	const isOpened = (id: string) => widgets.some((w) => w.id === id);

	/* ---------------- keyboard ---------------- */
	React.useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			const key = e.key.toLowerCase();

			if (e.ctrlKey && key === "a") {
				e.preventDefault();
				setShowPanel((v) => !v);
			}

			if (e.ctrlKey && key === "z") {
				e.preventDefault();
				undo();
			}

			if (e.ctrlKey && key === "y") {
				e.preventDefault();
				redo();
			}
		};

		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [widgets]);

	/* ---------------- drag ---------------- */
	const onPointerDownDrag = (e: React.PointerEvent, w: WidgetData) => {
		draggingId.current = w.id;

		offset.current = {
			x: e.clientX - w.x,
			y: e.clientY - w.y,
		};

		commit();

		(e.target as HTMLElement).setPointerCapture(e.pointerId);
	};

	/* ---------------- resize ---------------- */
	const onPointerDownResize = (
		e: React.PointerEvent,
		w: WidgetData,
		dir: ResizeDir
	) => {
		e.stopPropagation();

		resizing.current = {
			id: w.id,
			dir,
			startX: e.clientX,
			startY: e.clientY,
			startW: w.width,
			startH: w.height,
			startXWidget: w.x,
			startYWidget: w.y,
		};

		commit();
		(e.target as HTMLElement).setPointerCapture(e.pointerId);
	};

	const onPointerMove = (e: React.PointerEvent) => {
		const dragId = draggingId.current;
		const resize = resizing.current;

		if (dragId && !resize) {
			updateWidgetLive(dragId, {
				x: Math.round((e.clientX - offset.current.x) / roundTo) * roundTo,
				y: Math.round((e.clientY - offset.current.y) / roundTo) * roundTo,
			});
		}

		if (resize) {
			const dx = e.clientX - resize.startX;
			const dy = e.clientY - resize.startY;

			let newW = resize.startW;
			let newH = resize.startH;

			if (resize.dir === "right" || resize.dir === "corner") {
				newW = Math.max(150, resize.startW + dx);
			}

			if (resize.dir === "bottom" || resize.dir === "corner") {
				newH = Math.max(120, resize.startH + dy);
			}

			//console.log(Math.round(newW / roundTo) * roundTo, Math.round(newH / roundTo) * roundTo)
			updateWidgetLive(resize.id, {
				width: Math.round(newW / roundTo) * roundTo,
				height: Math.round(newH / roundTo) * roundTo,
			});
		}
	};

	const onPointerUp = () => {
		draggingId.current = null;
		resizing.current = null;
	};

	/* ---------------- UI ---------------- */
	return (
		<div style={{ display: "flex", width: "100%", height: "100vh" }}>
			{/* PANEL */}
			{showPanel && (
				<div
					style={{
						width: 220,
						border: "2 solid gray",
						padding: 10,
						overflowY: "auto",
					}}
				>
					<h4>Available widgets</h4>

					{availableWidgets.map((w) => {
						const opened = isOpened(w.id);

						return (
							<button
								key={w.id}
								onClick={() => addWidget(w)}
								disabled={opened}
								style={{
									width: "100%",
									marginBottom: 8,
									padding: 8,
									cursor: opened ? "not-allowed" : "pointer",
									opacity: opened ? 0.5 : 1,
								}}
							>
								{opened ? `✓ ${w.title}` : `＋ ${w.title}`}
							</button>
						);
					})}
				</div>
			)}

			{/* CANVAS */}
			<div
				onPointerMove={onPointerMove}
				onPointerUp={onPointerUp}
				style={{
					flex: 1,
					position: "relative",
					overflow: "hidden",
					touchAction: "none",
				}}
			>
				{/* TOGGLE */}
				<button
					onClick={() => setShowPanel((v) => !v)}
					title="toggle widget preview: crtl+a"
					style={{
						position: "absolute",
						top: 10,
						left: 10,
						zIndex: 10,
						padding: "6px 10px",
					}}

				>
					{showPanel ? "Hide panel" : "Show panel"}
				</button>

				{widgets.map((w) => (
					<div
						key={w.id}
						style={{
							position: "absolute",
							left: w.x,
							top: w.y,
							width: w.width,
							height: w.height,
							borderRadius: 6,
							border: "1px solid gray",
							boxShadow: "inset 0 0 0 1px #333",
							display: "flex",
							flexDirection: "column",
						}}
					>
						{/* HEADER */}
						<div
							onPointerDown={(e) => onPointerDownDrag(e, w)}
							style={{
								padding: 10,
								cursor: "grab",
								display: "flex",
								justifyContent: "space-between",
								background: "linear-gradient(180deg,rgba(22, 23, 29, 1) 0%, rgba(35, 39, 110, 1) 45%, rgba(41, 50, 117, 1) 50%, rgba(22, 23, 29, 1) 100%)",
								fontSize: 13,
								fontWeight: 600,
							}}
						>
							{w.title ?? w.id}
							<button
								onClick={() => removeWidget(w.id)}
								style={{
									background: "transparent",
									border: "none",
									color: "#aaa",
									cursor: "pointer",
								}}
							>
								✕
							</button>
						</div>

						<div style={{ flex: 1, padding: 8, overflow: "hidden", background: "#16171d" }}>
							{w.content}
						</div>

						{/* RESIZE */}
						<div
							onPointerDown={(e) => onPointerDownResize(e, w, "right")}
							style={{
								position: "absolute",
								right: 0,
								top: 0,
								width: 18,
								height: "100%",
								cursor: "ew-resize",
								background: "rgba(0,0,0,0.05)",
								opacity: 0,
								transition: "opacity 0.2s ease",
							}}
							className="resize-handle"
						/>

						<div
							onPointerDown={(e) => onPointerDownResize(e, w, "bottom")}
							style={{
								position: "absolute",
								bottom: 0,
								left: 0,
								width: "100%",
								height: 18,
								cursor: "ns-resize",
							}}
						/>

						<div
							onPointerDown={(e) => onPointerDownResize(e, w, "corner")}
							style={{
								position: "absolute",
								right: 0,
								bottom: 0,
								width: 24,
								height: 24,
								cursor: "se-resize",
								background: "#333",
								borderRadius: 6,
							}}
						/>
					</div>
				))}
			</div>
		</div>
	);
}
