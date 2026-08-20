import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Background, SafeArea } from "./primitives";
import { HouseOutline, WarningTriangle } from "./icons";
import { COLORS, fontHeavy } from "./theme";
import { clampInterp, idleBreath, idleFloat } from "./utils";

export const Scene1: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const houseProgress = clampInterp(frame, [8, 100], [0, 1]);

	const textIn = Math.min(
		spring({ frame, fps, config: { damping: 14, mass: 0.6 }, durationInFrames: 16 }),
		1,
	);
	const textOut = clampInterp(frame, [44, 56], [1, 0]);
	const textScale = (0.85 + 0.15 * textIn) * Math.max(textOut, 0.001);
	const textTranslateY = (1 - textIn) * 24 - (1 - textOut) * 20;

	const alertSpring = spring({
		frame: frame - 50,
		fps,
		config: { damping: 9, mass: 0.7 },
		durationInFrames: 22,
	});
	const alertOpacity = clampInterp(frame, [50, 58], [0, 1]);
	const triangleRotate = interpolate(Math.min(alertSpring, 1), [0, 1], [-150, 0]);

	const flash = clampInterp(frame, [50, 54, 66], [0, 0.4, 0]);
	const breathe = idleBreath(frame - 70);
	const float = idleFloat(frame - 70, 4);

	return (
		<>
			<Background />
			<AbsoluteFill style={{ backgroundColor: COLORS.alert, opacity: flash }} />
			<SafeArea>
				<HouseOutline
					progress={houseProgress}
					size={560}
					color={COLORS.gold}
					style={{ position: "absolute", top: 20, opacity: 0.3 }}
				/>
				{frame < 60 ? (
					<div
						style={{
							opacity: textOut,
							transform: `scale(${textScale}) translateY(${textTranslateY}px)`,
							textAlign: "center",
						}}
					>
						<div style={{ ...fontHeavy, color: COLORS.white, fontSize: 56 }}>
							¿TIENES
						</div>
						<div
							style={{
								...fontHeavy,
								color: COLORS.gold,
								fontSize: 108,
								marginTop: 8,
							}}
						>
							$120.000
						</div>
					</div>
				) : null}
				{frame >= 48 ? (
					<div
						style={{
							opacity: alertOpacity,
							transform: `scale(${(0.6 + 0.4 * Math.min(alertSpring, 1.15)) * breathe}) translateY(${float}px)`,
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							gap: 18,
						}}
					>
						<WarningTriangle
							size={100}
							color={COLORS.alert}
							style={{ transform: `rotate(${triangleRotate}deg)` }}
						/>
						<div style={{ ...fontHeavy, color: COLORS.alert, fontSize: 92 }}>
							¡CUIDADO!
						</div>
					</div>
				) : null}
			</SafeArea>
		</>
	);
};
