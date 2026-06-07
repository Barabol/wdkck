import React, { useEffect, useState } from "react";

type CameraWidgetType = {
	endpoint: string;
	intervalMs?: number;
};

export const CameraWidget: React.FC<CameraWidgetType> = ({
	endpoint,
	intervalMs = 1000,
}) => {
	const [src, setSrc] = useState(endpoint);

	useEffect(() => {
		const id = setInterval(() => {
			const cacheBustedUrl = `${endpoint}`;
			setSrc(cacheBustedUrl);
		}, intervalMs);

		return () => clearInterval(id);
	}, [endpoint, intervalMs]);

	return (
		<img
			src={src}
			alt="unable to get image"
			style={{
				width: "100%",
				height: "100%",
				objectFit: "cover",
			}}
		/>
	);
};
