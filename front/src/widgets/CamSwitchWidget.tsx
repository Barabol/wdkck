type StearingWidgetType = {
	endpoint: string
}
export const CamSwitchWidget: React.FC<StearingWidgetType> = (data) => {

	function handleStart(way: string) {
		try {
			fetch(`${data.endpoint}/${way}`, { method: "GET" })
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
				onPointerDown={() => { handleStart("camswitch") }}
			>
				change cam
			</button>
		</div >

	)
}
