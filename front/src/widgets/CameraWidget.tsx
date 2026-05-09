
type CaneraWidgetType = {
	endpoint: string
}
export const CameraWidget: React.FC<CaneraWidgetType> = (data) => {
	return (
		<img src={data.endpoint} style={{ width: "100%", height: "100%" }}></img>
	)

}
