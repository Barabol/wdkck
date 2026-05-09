import './App.css'
import MainDashboard from './components/MainDashboard';
import { Device } from './objects/Device';

const ip = "http://127.0.0.1:8080/api"
const devices: Device[] = [
	new Device(0, "test-online", "online", 20, 10, 10, "2 Days", ip),
	new Device(1, "test-warning", "warning", 20, 10, 10, "2 Days", ip),
	new Device(2, "test-offline", "offline", 20, 10, 10, "2 Days", ip),
	new Device(3, "test-online", "online", 20, 10, 10, "2 Days", ip),
	new Device(4, "test-offline", "offline", 20, 10, 10, "2 Days", ip),
	new Device(5, "test-online", "online", 20, 10, 10, "2 Days", ip),
	new Device(6, "test-offline", "offline", 20, 10, 10, "2 Days", ip),
];


function App() {
	return (
		<div style={{ margin: 0 }}>
			<MainDashboard devices={devices} />
		</div>
	)
}

export default App
