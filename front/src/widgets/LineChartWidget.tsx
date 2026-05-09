import React, { useEffect, useState } from "react";

type LineChartProps = {
	lineColor?: string;
	dotColor?: string;
	endpoint: string;
};

async function intervalHandler(endpoint: string): number[] {
	var data = await fetch(endpoint)
	var json = await data.json()
	console.log(json)
	return json
}

export const LineChartWidget: React.FC<LineChartProps> = ({
	endpoint,
	lineColor = "#3b82f6",
	dotColor = "#1d4ed8",
}) => {
	const [hovered, setHovered] = useState<{
		value: number;
		x: number;
		y: number;
	} | null>(null);

	const [data, setData] = useState<number[]>([1, 2, 3, 4]);
	useEffect(() => {
		const id = setInterval(() => {
			(async () => {
				const result = await intervalHandler(endpoint);
				setData(result);
			})();
		}, 1000);
		return () => clearInterval(id); // cleanup on unmount
	}, [endpoint]);

	const width = 100;
	const height = 100;

	const max = Math.max(...data, 1);
	const min = Math.min(...data, 0);

	const margin = 10;


	const innerWidth = width - margin * 2;
	const innerHeight = height - margin * 2;

	const getX = (index: number) =>
		margin + (index / (data.length - 1)) * innerWidth;

	const getY = (value: number) =>
		margin +
		(innerHeight -
			((value - min) / (max - min || 1)) * innerHeight);
	const points = data
		.map((v, i) => `${getX(i)},${getY(v)}`)
		.join(" ");

	return (
		<div style={{ width: "100%", height: "100%", position: "relative" }}>
			<svg
				viewBox={`0 0 ${width} ${height}`}
				preserveAspectRatio="none"
				style={{ width: "90%", height: "90%", padding: "5%" }}
			>
				{/* linia */}
				<polyline
					fill="none"
					stroke={lineColor}
					strokeWidth={1}
					points={points}
				/>

				{/* punkty */}
				{data.map((v, i) => {
					const x = getX(i);
					const y = getY(v);

					return (
						<circle
							key={i}
							cx={x}
							cy={y}
							r={1}
							fill={dotColor}
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
						transform: "translate(-50%, -120%)",
						background: "black",
						color: "white",
						padding: "4px 8px",
						borderRadius: 4,
						fontSize: 12,
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
