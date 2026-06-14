import React, { useEffect, useState } from "react";

type DetectionWidgetType = {
	endpoint: string;
};

type DetectionResult = {
	class: string;
	confidence: number;
};

export const DetectionWidget: React.FC<DetectionWidgetType> = ({ endpoint }) => {
	const [results, setResults] = useState<DetectionResult[]>([]);
	const [loading, setLoading] = useState(false);

	async function fetchData() {
		try {
			const res = await fetch(`${endpoint}/aidetect`, { method: "GET" });
			const data: DetectionResult[] = await res.json();

			const sorted = [...data].sort((a, b) => b.confidence - a.confidence);
			setResults(sorted);
		} catch (e) {
			console.log("unable to connect to server");
		}
	}

	useEffect(() => {
		const interval = setInterval(() => {
			fetchData();
		}, 500);

		return () => clearInterval(interval);
	}, [endpoint]);

	return (
		<div
			style={{
				userSelect: "none",
				WebkitUserSelect: "none",
			}}
		>
			<table style={{ width: "60%", margin: "0 auto", borderCollapse: "collapse" }}>
				<thead>
					<tr>
						<th style={{ textAlign: "left" }}>Class</th>
						<th style={{ textAlign: "right" }}>Confidence</th>
					</tr>
				</thead>

				<tbody>
					{results.map((item, idx) => (
						<tr key={idx}>
							<td>{item.class}</td>
							<td style={{ textAlign: "right" }}>
								{(item.confidence * 100).toFixed(2)}%
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
