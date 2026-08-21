import { staticFile, useCurrentFrame } from "remotion";
import { KenBurnsPhoto, SafeArea } from "./primitives";
import { COLORS, fontMedium, textShadow } from "./theme";
import { clampInterp, kenBurnsScale } from "./utils";

export const Scene1: React.FC = () => {
	const frame = useCurrentFrame();

	const scale = kenBurnsScale(frame, 90, 1.12, 1.05);
	const translateY = clampInterp(frame, [0, 90], [-14, 14]);

	const textP = clampInterp(frame, [15, 33], [0, 1]);

	return (
		<>
			<KenBurnsPhoto
				src={staticFile("propiedad_01.jpg")}
				scale={scale}
				translateYPixels={translateY}
			/>
			<SafeArea style={{ display: "flex", alignItems: "flex-start" }}>
				<div
					style={{
						...fontMedium,
						color: COLORS.white,
						fontSize: 46,
						lineHeight: 1.35,
						textShadow,
						opacity: textP,
						transform: `translateY(${(1 - textP) * 24}px)`,
						maxWidth: 760,
					}}
				>
					Desde arriba no solo vemos una propiedad…
				</div>
			</SafeArea>
		</>
	);
};
