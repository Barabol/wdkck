import React, { useEffect, useState } from "react";

type CameraWidgetType = {
	endpoint: string;
	intervalMs?: number;
};

export const CameraWidget: React.FC<CameraWidgetType> = ({
	endpoint,
	intervalMs = 1000 / 10}) => {
	const [src, setSrc] = useState("");

	useEffect(() => {
		const id = setInterval(() => {
			const cacheBustedUrl = `${endpoint}?t=${Date.now()}`;
			setSrc(cacheBustedUrl);
		}, intervalMs);

		return () => clearInterval(id);
	}, [endpoint, intervalMs]);

	return (
		<img
			src={src}
			alt="camera stream"
			style={{
				width: "100%",
				height: "100%",
				objectFit: "cover",
			}}
		/>
	);
};
