import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Background, SafeArea, WipeCut } from "./primitives";
import { COLORS, fontBold, fontHeavy } from "./theme";
import { clampInterp, enterProgress } from "./utils";

export const Scene7: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const q1In = enterProgress(frame, 4, 16);
	const strikeProgress = clampInterp(frame, [60, 76], [0, 1]);
	const q1Dim = clampInterp(frame, [70, 96], [1, 0.35]);

	const q2Active = frame >= 88;
	const q2In = enterProgress(frame, 92, 18);
	const realmentePulse = spring({
		frame: frame - 92,
		fps,
		config: { damping: 9, mass: 0.7 },
		durationInFrames: 24,
	});

	return (
		<>
			<Background />
			<WipeCut frame={frame} />
			<SafeArea>
				<div
					style={{
						opacity: q1In * q1Dim,
						transform: `translateY(${(1 - q1In) * 16}px)`,
						position: "relative",
						...fontBold,
						color: COLORS.neutral,
						fontSize: 46,
						textAlign: "center",
					}}
				>
					¿Cuánto cuesta la casa?
					<div
						style={{
							position: "absolute",
							top: "50%",
							left: "50%",
							width: `${strikeProgress * 110}%`,
							height: 4,
							backgroundColor: COLORS.gold,
							transform: "translate(-50%, -50%)",
							borderRadius: 2,
						}}
					/>
				</div>

				{q2Active ? (
					<div
						style={{
							opacity: q2In,
							transform: `translateY(${(1 - q2In) * 30}px)`,
							...fontHeavy,
							color: COLORS.white,
							fontSize: 68,
							textAlign: "center",
							lineHeight: 1.3,
							marginTop: 56,
							maxWidth: 760,
						}}
					>
						¿Cuánto me costará{" "}
						<span
							style={{
								color: COLORS.gold,
								display: "inline-block",
								transform: `scale(${0.8 + 0.2 * Math.min(realmentePulse, 1.25)})`,
							}}
						>
							REALMENTE
						</span>{" "}
						comprarla?
					</div>
				) : null}
			</SafeArea>
		</>
	);
};
