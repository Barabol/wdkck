type StearingWidgetType = {
	endpoint: string
}
export const StearingWidget: React.FC<StearingWidgetType> = (data) => {

	function handleStart(way: string) {
		console.log("start");
		fetch(`${data.endpoint}/${way}`, { method: "POST", body: "test " + way })
	};

	function handleEnd(way: string) {
		console.log("stop");
		fetch(`${data.endpoint}/${way}`, { method: "POST", body: "test1 " + way })
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
				width: "30%",
				height: "50px",
				margin: "0 25%",
				marginBottom: "10%"
			}}
				onPointerDown={() => { handleStart("up") }}
				onPointerLeave={() => { handleEnd("stop") }}
			>
				⬆️
			</button>
			<button style={{
				userSelect: "none",
				WebkitUserSelect: "none",
				width: "30%",
				height: "50px",
				float: "left",
				marginLeft: "10%"
			}}
				onPointerDown={() => { handleStart("left") }}
				onPointerLeave={() => { handleEnd("stop") }}
			>
				⬅️
			</button>
			<button style={{
				userSelect: "none",
				WebkitUserSelect: "none",
				width: "30%",
				height: "50px",
				float: "right",
				marginRight: "10%"
			}}
				onPointerDown={() => { handleStart("right") }}
				onPointerLeave={() => { handleEnd("stop") }}
			>
				➡️
			</button>
		</div >

	)
}
