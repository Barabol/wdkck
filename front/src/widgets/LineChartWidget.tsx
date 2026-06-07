import React, { useEffect, useState } from "react";

type LineChartProps = {
	endpoint: string;
	lineColor?: string;
	dotColor?: string;

	xLabel?: string;
	yLabel?: string;

	showGrid?: boolean;
	ticks?: number;

	backgroundColor?: string;
};

async function fetchData(endpoint: string): Promise<number[]> {
	try {
		const res = await fetch(endpoint);
		return await res.json();
	} catch {
		return [0];
	}
}

export const LineChartWidget: React.FC<LineChartProps> = ({
	endpoint,
	lineColor = "#3b82f6",
	dotColor = "#1d4ed8",
	xLabel = "X Axis",
	yLabel = "Y Axis",
	showGrid = true,
	ticks = 5,
	backgroundColor = "#333",
}) => {
	const [hovered, setHovered] = useState<{
		value: number;
		x: number;
		y: number;
	} | null>(null);

	const [data, setData] = useState<number[]>([]);

	useEffect(() => {
		const id = setInterval(async () => {
			const result = await fetchData(endpoint);
			setData(result);
		}, 1000);

		return () => clearInterval(id);
	}, [endpoint]);

	const width = 100;
	const height = 100;

	const margin = 20;
	const innerWidth = width - margin * 2;
	const innerHeight = height - margin * 2;

	const max = Math.max(...data, 1);
	const min = Math.min(...data, 0);
	const range = max - min || 1;

	const getX = (i: number) =>
		margin + (i / Math.max(data.length - 1, 1)) * innerWidth;

	const getY = (v: number) =>
		margin + innerHeight - ((v - min) / range) * innerHeight;

	const points = data.map((v, i) => `${getX(i)},${getY(v)}`).join(" ");

	const yTicks = Array.from({ length: ticks }).map((_, i) => {
		const value = min + (i / (ticks - 1)) * range;
		const y = getY(value);
		return { value, y };
	});

	return (
		<div style={{ width: "100%", height: "100%", position: "relative" }}>
			<svg
				viewBox={`0 0 ${width} ${height}`}
				preserveAspectRatio="none"
				style={{
					width: "100%",
					height: "100%",
					background: backgroundColor,
				}}
			>
				{/* GRID + LABELS */}
				{yTicks.map((tick, i) => (
					<g key={i}>
						{showGrid && (
							<line
								x1={margin}
								x2={width - margin}
								y1={tick.y}
								y2={tick.y}
								stroke="#e5e7eb"
								strokeWidth={0.5}
							/>
						)}

						<text
							x={margin - 2}
							y={tick.y + 1}
							fontSize={5}
							textAnchor="end"
							fill="#6b7280"
						>
							{tick.value.toFixed(0)}
						</text>
					</g>
				))}

				{/* AXES */}
				<line
					x1={margin}
					y1={margin}
					x2={margin}
					y2={height - margin}
					stroke="#111827"
					strokeWidth={1}
				/>

				<line
					x1={margin}
					y1={height - margin}
					x2={width - margin}
					y2={height - margin}
					stroke="#111827"
					strokeWidth={1}
				/>

				{/* LABELS */}
				<text
					x={8}
					y={height / 2}
					fontSize={6}
					textAnchor="middle"
					transform={`rotate(-90 8 ${height / 2})`}
					fill="#111827"
				>
					{yLabel}
				</text>

				<text
					x={width - 20}
					y={height - 9.5}
					fontSize={6}
					textAnchor="end"
					fill="#111827"
				>
					{xLabel}
				</text>

				{/* LINE */}
				<polyline
					fill="none"
					stroke={lineColor}
					strokeWidth={1.5}
					points={points}
				/>

				{/* POINTS */}
				{data.map((v, i) => {
					const prev = data[i - 1];
					const isSameAsPrev = i > 0 && v === prev;

					if (isSameAsPrev) return null;

					const x = getX(i);
					const y = getY(v);

					return (
						<circle
							key={i}
							cx={x}
							cy={y}
							r={1}
							fill={dotColor}
							opacity={0.9}
							onMouseEnter={() => setHovered({ value: v, x, y })}
							onMouseLeave={() => setHovered(null)}
							style={{ cursor: "pointer" }}
						/>
					);
				})}
			</svg>

			{/* TOOLTIP */}
			{hovered && (
				<div
					style={{
						position: "absolute",
						left: `${hovered.x}%`,
						top: `${hovered.y}%`,
						transform: "translate(-50%, -140%)",
						background: "rgba(0,0,0,0.85)",
						color: "white",
						padding: "4px 6px",
						borderRadius: 6,
						fontSize: 11,
						pointerEvents: "none",
						whiteSpace: "nowrap",
					}}
				>
					{hovered.value}
				</div>
			)}
		</div>
	);
};
