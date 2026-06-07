import './App.css'
import MainDashboard from './components/MainDashboard';
import { Device } from './objects/Device';
import config from './config.json';

const devices: Device[] = config.devices.map((item, index) =>
	new Device(
		index,
		item.name,
		"online",
		20,
		10,
		10,
		"2 Days",
		item.endpoint
	)
);

function App() {
	return (
		<div style={{ margin: 0 }}>
			<MainDashboard devices={devices} />
		</div>
	)
}

export default App
