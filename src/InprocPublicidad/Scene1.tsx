import { staticFile, useCurrentFrame } from "remotion";
import { CornerBrackets, KenBurnsPhoto, RoomTag, SafeArea, TopScrim } from "./primitives";
import { AnimatedHeadline } from "./AnimatedHeadline";
import { COLORS, fontMedium, textShadow } from "./theme";
import { clampInterp, kenBurnsScale } from "./utils";

export const Scene1: React.FC = () => {
	const frame = useCurrentFrame();

	// Ligero recorrido diagonal, como un sobrevuelo lento: sensación de
	// dron sin dejar nunca de cubrir el encuadre (scale siempre >= 1.05).
	const scale = kenBurnsScale(frame, 90, 1.14, 1.05);
	const translateX = clampInterp(frame, [0, 90], [10, -10]);
	const translateY = clampInterp(frame, [0, 90], [-16, 16]);

	const bracketsP = clampInterp(frame, [4, 22], [0, 1]);
	const scrimP = clampInterp(frame, [8, 24], [0, 1]);
	const tagP = clampInterp(frame, [8, 24], [0, 1]);

	return (
		<>
			<KenBurnsPhoto
				src={staticFile("propiedad_01.jpg")}
				scale={scale}
				translateXPixels={translateX}
				translateYPixels={translateY}
			/>
			<TopScrim opacity={scrimP} />
			<SafeArea style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
				<RoomTag icon="home" label="Fachada" progress={tagP} />
				<div style={{ marginTop: 22 }}>
					<AnimatedHeadline
						frame={frame}
						startFrame={18}
						text="Desde arriba no solo vemos una propiedad…"
						style={{
							...fontMedium,
							color: COLORS.white,
							fontSize: 46,
							lineHeight: 1.35,
							textShadow,
							maxWidth: 760,
						}}
					/>
				</div>
			</SafeArea>
			<SafeArea>
				<CornerBrackets progress={bracketsP} />
			</SafeArea>
		</>
	);
};
