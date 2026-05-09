import { useState } from "react";
import { type Device } from "../objects/Device";
import WidgetCanvas from "./WidgetCanvas";
import { Widgets } from "../widgets/Widgets";

type DeviceCardProps = {
	device: Device;
	onClick: (device: Device) => void;
};
type MainDashboardProps = {
	devices?: Device[];
};

function DeviceCard({ device, onClick }: DeviceCardProps) {
	return (
		<div
			onClick={() => onClick(device)}
			style={{
				borderRadius: "16px",
				padding: "16px",
				boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
				border: "1px solid white",
				transition: "transform 0.2s",
			}}
			onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
			onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
		>
			<style>{`
        @keyframes blink {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.3); }
          60% { opacity: 1; transform: scale(1); }
        }
        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
          margin-right: 6px;
          margin-right: 6px;
          animation: blink 2s infinite;
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
				<h2 style={{ fontSize: "18px", margin: 0 }}>{device.name}</h2>

				<span
					style={{
						display: "flex",
						alignItems: "center",
						fontSize: "12px",
						fontWeight: 500,
					}}
				>
					<span
						className="dot"
						style={device.statusStyle()}
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
}
export default function MainDashboard({ devices = [] }: MainDashboardProps) {
	const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
	if (selectedDevice) {
		return (
			<div>
				<button
					onClick={() => { setSelectedDevice(null) }}
					style={{ float: "left" }}
				>return</button>
				<WidgetCanvas initialWidgets={Widgets(selectedDevice.ip)}>
				</WidgetCanvas>
			</div>
		);
	}
	else
		return (
			<div style={{ minHeight: "100vh", padding: "24px" }}>
				<h1 style={{ fontSize: "28px", marginBottom: "24px" }}>System IoT / MC</h1>

				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
						gap: "16px",
					}}
				>
					{devices.map((device) => (
						<DeviceCard
							key={device.id}
							device={device}
							onClick={(d) => {
								setSelectedDevice(d);
								console.log(d.name);
							}}
						/>
					))}
				</div>
			</div>
		);
}
