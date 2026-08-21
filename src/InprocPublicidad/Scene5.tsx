import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { COLORS } from "./theme";
import { clampInterp } from "./utils";

export const Scene5: React.FC = () => {
	const frame = useCurrentFrame();
	const opacity = clampInterp(frame, [0, 12], [0, 1]);

	return (
		<AbsoluteFill style={{ backgroundColor: COLORS.navy, opacity }}>
			<Img
				src={staticFile("publicidad_final.png")}
				style={{
					width: "100%",
					height: "100%",
					objectFit: "contain",
				}}
			/>
		</AbsoluteFill>
	);
};
