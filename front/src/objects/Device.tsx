export class Device {
	id: number;
	name: string;
	status?: ("online" | "warning" | "offline");
	temp?: number;
	cpu?: number;
	mem?: number;
	uptime?: string;
	ip: string;
	constructor(id: number, name: string, status: ("online" | "warning" | "offline"),
		temp: number, cpu: number, mem: number, uptime: string, ip: string) {
		this.id = id;
		this.name = name;
		this.status = status;
		this.temp = temp;
		this.cpu = cpu;
		this.mem = mem;
		this.uptime = uptime;
		this.ip = ip;
	}
	statusStyle() {
		console.log(this.status)
		switch (this.status) {
			case "online":
				return { backgroundColor: "#22c55e", color: "white" };
			case "warning":
				return { backgroundColor: "#FFAF00", color: "white" };
			case "offline":
				return { backgroundColor: "#ef4444", color: "white" };
		}
	};
}

