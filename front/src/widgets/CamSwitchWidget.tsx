import React, { useState } from "react";

type StearingWidgetType = {
	endpoint: string;
};

export const CamSwitchWidget: React.FC<StearingWidgetType> = ({
	endpoint,
}) => {
	const [id, setId] = useState<number>(0);

	async function handleStart(way: string) {
		try {
			await fetch(`${endpoint}/${way}?id=${id}`, {
				method: "GET",
			});
		} catch (e) {
			console.log("unable to connect to server");
		}
	}

	return (
		<div
			style={{
				userSelect: "none",
				WebkitUserSelect: "none",
				display: "flex",
				flexDirection: "column",
				gap: "10px",
				alignItems: "center",
			}}
		>
			<input
				type="number"
				value={id}
				onChange={(e) => setId(Number(e.target.value))}
				style={{
					width: "55%",
					height: "40px",
					fontSize: "16px",
					textAlign: "center",
				}}
			/>

			<button
				style={{
					width: "55%",
					height: "80px",
				}}
				onPointerDown={() => handleStart("change")}
			>
				change cam
			</button>
		</div>
	);
};
