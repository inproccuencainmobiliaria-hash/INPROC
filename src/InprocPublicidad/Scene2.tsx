import { staticFile, useCurrentFrame } from "remotion";
import { BladeWipe, CornerBrackets, KenBurnsPhoto, RoomTag, SafeArea, TopScrim } from "./primitives";
import { AnimatedHeadline } from "./AnimatedHeadline";
import { COLORS, fontBold, textShadow } from "./theme";
import { clampInterp, kenBurnsScale } from "./utils";

export const Scene2: React.FC = () => {
	const frame = useCurrentFrame();

	const scale = kenBurnsScale(frame, 120, 1.05, 1.18);
	const translateX = clampInterp(frame, [0, 120], [-8, 8]);

	const bracketsP = clampInterp(frame, [18, 36], [0, 1]);
	const scrimP = clampInterp(frame, [16, 32], [0, 1]);
	const tagP = clampInterp(frame, [16, 32], [0, 1]);

	return (
		<BladeWipe frame={frame}>
			<KenBurnsPhoto
				src={staticFile("propiedad_02.jpg")}
				scale={scale}
				translateXPixels={translateX}
			/>
			<TopScrim opacity={scrimP} />
			<SafeArea style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
				<RoomTag icon="sofa" label="Sala" progress={tagP} />
				<div style={{ marginTop: 24 }}>
					<AnimatedHeadline
						frame={frame}
						startFrame={26}
						text="Vemos una inversión con futuro."
						style={{
							...fontBold,
							color: COLORS.white,
							fontSize: 62,
							lineHeight: 1.2,
							textShadow,
							maxWidth: 780,
						}}
					/>
				</div>
			</SafeArea>
			<SafeArea>
				<CornerBrackets progress={bracketsP} />
			</SafeArea>
		</BladeWipe>
	);
};
