import React, { useState, useRef } from "react";
import type { WidgetData } from "../objects/WidgetData";

const roundTo = 20;

type ResizeDir = "right" | "bottom" | "corner";

type Props = {
	initialWidgets: WidgetData[];
};

export default function WidgetCanvas({ initialWidgets }: Props) {
	const [widgets, setWidgets] = useState<WidgetData[]>(initialWidgets);

	const draggingId = useRef<string | null>(null);
	const resizing = useRef<{
		id: string;
		dir: ResizeDir;
		startX: number;
		startY: number;
		startW: number;
		startH: number;
		startLeft: number;
		startTop: number;
	} | null>(null);

	const offset = useRef({ x: 0, y: 0 });

	const updateWidget = (id: string, patch: Partial<WidgetData>) => {
		setWidgets((prev) =>
			prev.map((w) => (w.id === id ? { ...w, ...patch } : w))
		);
	};

	const removeWidget = (id: string) => {
		setWidgets((prev) => prev.filter((w) => w.id !== id));
	};

	const onPointerDownDrag = (e: React.PointerEvent, w: WidgetData) => {
		draggingId.current = w.id;
		offset.current = {
			x: e.clientX - w.x,
			y: e.clientY - w.y,
		};
		(e.target as HTMLElement).setPointerCapture(e.pointerId);
	};

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
			startLeft: w.x,
			startTop: w.y,
		};
		(e.target as HTMLElement).setPointerCapture(e.pointerId);
	};

	const onPointerMove = (e: React.PointerEvent) => {
		const dragId = draggingId.current;
		const resize = resizing.current;

		if (dragId && !resize) {
			updateWidget(dragId, {
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

			updateWidget(resize.id, {
				width: Math.round(newW / roundTo) * roundTo,
				height: Math.round(newH / roundTo) * roundTo,
			});
		}
	};

	const onPointerUp = () => {
		draggingId.current = null;
		resizing.current = null;
	};

	return (
		<div
			onPointerMove={onPointerMove}
			onPointerUp={onPointerUp}
			style={{
				width: "100%",
				height: "100vh",
				position: "relative",
				overflow: "hidden",
				touchAction: "none",
			}}
		>
			{widgets.map((w) => (
				<div
					key={w.id}
					style={{
						position: "absolute",
						left: w.x,
						top: w.y,
						width: w.width,
						height: w.height,
						boxShadow: "inset 0 0 0 1px #ddd",
						display: "flex",
						flexDirection: "column",
						touchAction: "none",
					}}
				>
					{/* HEADER */}
					<div
						onPointerDown={(e) => onPointerDownDrag(e, w)}
						style={{
							padding: 10,
							color: "white",
							cursor: "grab",
							display: "flex",
							justifyContent: "space-between",
							fontSize: 13,
							fontWeight: 600,
							touchAction: "none",
						}}
					>
						{w.title ?? w.id}
						<button onClick={() => removeWidget(w.id)}>✕</button>
					</div>

					<div style={{ flex: 1, padding: 8, overflow: "auto" }}>
						{w.content}
					</div>

					<div
						onPointerDown={(e) => onPointerDownResize(e, w, "right")}
						style={{
							position: "absolute",
							right: 0,
							top: 0,
							width: 18,
							height: "100%",
							cursor: "ew-resize",
							touchAction: "none",
						}}
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
							touchAction: "none",
						}}
					/>

					<div
						onPointerDown={(e) => onPointerDownResize(e, w, "corner")}
						style={{
							position: "absolute",
							right: 0,
							bottom: 0,
							width: 26,
							height: 26,
							cursor: "se-resize",
							borderRadius: 6,
							touchAction: "none",
						}}
					/>
				</div>
			))}
		</div>
	);
}
