import React, { useEffect, useState } from "react";

type Device = {
	name: string;
	status?: "online" | "warning" | "offline";
	temp?: number;
	cpu?: number;
	mem?: number;
	uptime?: string;
};

type DeviceWidgetProps = {
	ip: string;
};

export const DeviceWidget: React.FC<DeviceWidgetProps> = ({ ip }) => {
	const [device, setDevice] = useState<Device | null>(null);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const res = await fetch(`${ip}/stat`);

				if (!res.ok) {
					throw new Error("Request failed");
				}

				const data = await res.json();

				setDevice({
					name: data.name ?? ip,
					status: data.warning ? "warning" : "online",
					temp: data.temp,
					cpu: data.cpu,
					mem: data.mem,
					uptime: data.uptime,
				});
			} catch {
				setDevice({
					name: ip,
					status: "offline",
					temp: 0,
					cpu: 0,
					mem: 0,
					uptime: "none",
				});
			}
		};

		fetchStats();

		const interval = setInterval(fetchStats, 1000);

		return () => clearInterval(interval);
	}, [ip]);

	if (!device) {
		return (
			<div
				style={{
					padding: "16px",
					borderRadius: "16px",
					border: "1px solid white",
				}}
			>
				Loading...
			</div>
		);
	}

	const statusColor =
		device.status === "online"
			? "#22c55e"
			: device.status === "warning"
				? "#FFAF00"
				: "#ef4444";

	return (
		<div
			style={{
				padding: "16px",
				borderRadius: "16px",
				border: "1px solid white",
				boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
				fontFamily: "sans-serif",
			}}
		>
			<style>{`
				@keyframes pulseDot {
					0% {
						opacity: 1;
						transform: scale(1);
					}
					50% {
						opacity: 0.2;
						transform: scale(1.3);
					}
					100% {
						opacity: 1;
						transform: scale(1);
					}
				}
			`}</style>

			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "12px",
				}}
			>
				<h3
					style={{
						margin: 0,
						fontSize: "18px",
					}}
				>
					endpoint: {device.name}
				</h3>

				<span
					style={{
						display: "flex",
						alignItems: "center",
						fontSize: "12px",
						fontWeight: 500,
						textTransform: "capitalize",
					}}
				>
					<span
						style={{
							width: "10px",
							height: "10px",
							borderRadius: "50%",
							backgroundColor: statusColor,
							marginRight: "6px",
							animation: "pulseDot 2s infinite",
						}}
					/>
					{device.status}
				</span>
			</div>

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(2, 1fr)",
					gap: "8px",
					fontSize: "13px",
				}}
			>
				<div>
					<strong>Temp:</strong> {device.temp}°C
				</div>

				<div>
					<strong>CPU:</strong> {device.cpu}%
				</div>

				<div>
					<strong>RAM:</strong> {device.mem}%
				</div>

				<div>
					<strong>Uptime:</strong> {device.uptime}
				</div>
			</div>
		</div>
	);
};
