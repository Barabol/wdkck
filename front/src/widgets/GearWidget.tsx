type StearingWidgetType = {
	endpoint: string
}
export const GearWidget: React.FC<StearingWidgetType> = (data) => {

	function handleStart(way: string) {
		console.log("start");
		try {
			fetch(`${data.endpoint}/${way}`, { method: "POST", body: "test " + way })
		}
		catch (e) {
			console.log("unable to connect to server")
		}
	};

	function handleEnd(way: string) {
		console.log("stop");
		try {
			fetch(`${data.endpoint}/${way}`, { method: "POST", body: "test1 " + way })
		}
		catch (e) {
			console.log("unable to connect to server")
		}
	};

	return (
		<div style={
			{
				userSelect: "none",
				WebkitUserSelect: "none"
			}
		}>
			<button style={{
				userSelect: "none",
				WebkitUserSelect: "none",
				width: "55%",
				height: "80px",
				margin: "0 25%",
				marginBottom: "10%"
			}}
				onPointerDown={() => { handleStart("gear") }}
			>
				⚙️
			</button>
		</div >

	)
}
