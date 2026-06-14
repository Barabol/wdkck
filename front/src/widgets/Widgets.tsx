import type { WidgetData } from "../objects/WidgetData";
import { LineChartWidget } from "./LineChartWidget";
import { StearingWidget } from "./StearingWidget";
import { CameraWidget } from "./CameraWidget";
import Joystick from "./Joystick";
import { GearWidget } from "./GearWidget";
import { DetectionWidget } from "./DetectionWidget";
import { AiToggleWidget } from "./AiToggleWidget";
import { CamSwitchWidget } from "./CamSwitchWidget";


export function Widgets(ip: string): WidgetData[] {
	return [
		{
			id: "test",
			content: (
				<div>
					test
				</div>
			),
			x: 20,
			y: 20,
			width: 100,
			ip: ip,
			title: "test widget",
			height: 100
		},
		{
			id: "Joystickmv",
			title: "Stearing",
			content: (
				<div>
					<Joystick endpoint={ip + "/move"}></Joystick>
				</div>
			),
			x: 20,
			y: 20,
			width: 180,
			ip: ip,
			height: 220
		},
		{
			id: "camera",
			content: (
				<CameraWidget endpoint={ip + "/cam"}></CameraWidget>
			),
			x: 20,
			y: 20,
			width: 280,
			ip: ip,
			title: "cammera",
			height: 220
		},
		{
			id: "switchcamera",
			content: (
				<CamSwitchWidget endpoint={ip} />
			),
			x: 20,
			y: 20,
			width: 280,
			ip: ip,
			title: "camera switch",
			height: 220
		},
		{
			id: "aicamera",
			content: (
				<CameraWidget endpoint={ip + "/aicam"}></CameraWidget>
			),
			x: 20,
			y: 20,
			width: 280,
			ip: ip,
			title: "ai cammera",
			height: 220
		},
		{
			id: "stearing",
			title: "Stearing System",
			content: (
				<StearingWidget endpoint={ip} >
				</StearingWidget>
			),
			x: 20,
			y: 20,
			width: 300,
			ip: ip,
			height: 230
		},
		{
			id: "gear",
			title: "gear System",
			content: (
				<GearWidget endpoint={ip} />
			),
			x: 20,
			y: 20,
			width: 300,
			ip: ip,
			height: 230
		},
		{
			id: "aitoggle",
			title: "Ai toggle",
			content: (
				<AiToggleWidget endpoint={ip} />
			),
			x: 20,
			y: 20,
			width: 300,
			ip: ip,
			height: 230
		},
		{
			id: "detection",
			title: "AI detection",
			content: (
				<DetectionWidget endpoint={ip} />
			),
			x: 20,
			y: 20,
			width: 300,
			ip: ip,
			height: 230
		},

		{
			id: "Battery Level",
			title: "Battery Level",
			content: (
				<LineChartWidget
					endpoint={ip + "/battery"}
					lineColor="green"
					dotColor="green"
					xLabel="time"
					yLabel="battery"
				>
				</LineChartWidget>
			),
			x: 100,
			y: 100,
			width: 400,
			ip: ip,
			height: 300
		},
	]
}
