import { staticFile, useCurrentFrame } from "remotion";
import { KenBurnsPhoto, LateralWipeReveal, SafeArea } from "./primitives";
import { COLORS, fontBold, textShadow } from "./theme";
import { clampInterp, kenBurnsScale } from "./utils";

export const Scene2: React.FC = () => {
	const frame = useCurrentFrame();

	const scale = kenBurnsScale(frame, 120, 1.05, 1.18);
	const textP = clampInterp(frame, [20, 38], [0, 1]);

	return (
		<LateralWipeReveal frame={frame} duration={10}>
			<KenBurnsPhoto src={staticFile("propiedad_02.jpg")} scale={scale} />
			<SafeArea style={{ display: "flex", alignItems: "flex-start" }}>
				<div
					style={{
						...fontBold,
						color: COLORS.white,
						fontSize: 62,
						lineHeight: 1.2,
						textShadow,
						opacity: textP,
						transform: `translateY(${(1 - textP) * 26}px)`,
						maxWidth: 780,
					}}
				>
					Vemos una inversión con futuro.
				</div>
			</SafeArea>
		</LateralWipeReveal>
	);
};
