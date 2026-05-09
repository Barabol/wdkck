type ChartWidgetProps = {
	data: number[];
};

export const ChartWidget: React.FC<ChartWidgetProps> = ({ data }) => {
	const max = Math.max(...data, 1);

	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "flex-end",
				gap: 6,
			}}
		>
			{data.map((value, i) => {
				const heightPercent = (value / max) * 100;

				return (
					<div
						key={i}
						style={{
							flex: 1,
							height: `${heightPercent}%`,
							background: "linear-gradient(180deg, #3b82f6, #1d4ed8)",
							borderRadius: 4,
							transition: "0.2s",
						}}
						title={String(value)}
					/>
				);
			})}
		</div>
	);
};
