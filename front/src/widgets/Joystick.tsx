import { useEffect, useRef, useState } from "react";

type Pos = { x: number; y: number };

type JoystickProperties = {
	endpoint: string;
};

export default function Joystick({ endpoint }: JoystickProperties) {
	const baseRef = useRef<HTMLDivElement>(null);

	const [pos, setPos] = useState<Pos>({ x: 0, y: 0 });

	const dragging = useRef(false);
	const released = useRef(false);

	const lastSent = useRef(0);
	const lastValue = useRef({ x: 0, y: 0 });
	useEffect(() => {
		const handleRelease = () => {
			dragging.current = false;
			reset();
		};

		window.addEventListener("mouseup", handleRelease);
		window.addEventListener("touchend", handleRelease);
		window.addEventListener("touchcancel", handleRelease);

		return () => {
			window.removeEventListener("mouseup", handleRelease);
			window.removeEventListener("touchend", handleRelease);
			window.removeEventListener("touchcancel", handleRelease);
		};
	}, []);
	const getPosition = (clientX: number, clientY: number) => {
		const rect = baseRef.current!.getBoundingClientRect();

		let dx = clientX - (rect.left + rect.width / 2);
		let dy = clientY - (rect.top + rect.height / 2);

		const radius = rect.width / 2;

		const distance = Math.sqrt(dx * dx + dy * dy);

		if (distance > radius) {
			const angle = Math.atan2(dy, dx);
			dx = Math.cos(angle) * radius;
			dy = Math.sin(angle) * radius;
		}

		return {
			x: dx / radius,
			y: dy / radius,
		};
	};

	const sendPosition = async (x: number, y: number) => {
		if (!endpoint) return;

		const now = performance.now();

		if (now - lastSent.current < 50) return;

		if (lastValue.current.x === x && lastValue.current.y === y) return;

		lastSent.current = now;
		lastValue.current = { x, y };

		try {
			await fetch(endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ x, y }),
			});
		} catch (err) {
			console.error("Joystick send failed:", err);
		}
	};

	const handleMove = (clientX: number, clientY: number) => {
		if (!dragging.current) return;

		const position = getPosition(clientX, clientY);

		setPos(position);
		sendPosition(position.x, position.y);
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		handleMove(e.clientX, e.clientY);
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		const t = e.touches[0];
		handleMove(t.clientX, t.clientY);
	};

	const reset = () => {
		if (released.current) return;
		released.current = true;

		setPos({ x: 0, y: 0 });
		sendPosition(0, 0);
	};

	return (
		<div
			ref={baseRef}
			onMouseDown={() => {
				dragging.current = true;
				released.current = false;
			}}
			onMouseUp={() => {
				dragging.current = false;
				reset();
			}}
			onMouseLeave={() => {
				if (dragging.current) {
					dragging.current = false;
					reset();
				}
			}}
			onMouseMove={handleMouseMove}
			onTouchStart={() => {
				dragging.current = true;
				released.current = false;
			}}
			onTouchMove={handleTouchMove}
			onTouchEnd={() => {
				dragging.current = false;
				reset();
			}}
			style={{
				width: 160,
				height: 160,
				borderRadius: "50%",
				background: "#222",
				position: "relative",
				touchAction: "none",
				userSelect: "none",
			}}
		>
			{/* stick */}
			<div
				style={{
					width: 50,
					height: 50,
					borderRadius: "50%",
					background: "#4ade80",
					position: "absolute",
					left: 80 + pos.x * 60 - 25,
					top: 80 + pos.y * 60 - 25,
					transition: dragging.current ? "none" : "0.15s",
				}}
			/>
		</div>
	);
}
