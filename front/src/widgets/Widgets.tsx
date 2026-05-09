import type { WidgetData } from "../objects/WidgetData";
import { LineChartWidget } from "./LineChartWidget";
import { StearingWidget } from "./StearingWidget";
import { CameraWidget } from "./CameraWidget";


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
			height: 100
		},
		{
			id: "camera",
			content: (
				<CameraWidget endpoint={ip + "/cam"}></CameraWidget>
			),
			x: 20,
			y: 20,
			width: 100,
			ip: ip,
			height: 100
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
			id: "Battery Level",
			title: "Battery Level",
			content: (
				<LineChartWidget
					endpoint={ip + "/battery"}
					lineColor="green"
					dotColor="red"
				>
				</LineChartWidget>
			),
			x: 100,
			y: 100,
			width: 400,
			ip: ip,
			height: 300
		}
	]
}
