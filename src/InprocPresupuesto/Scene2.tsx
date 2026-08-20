import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Background, SafeArea, WipeCut } from "./primitives";
import { COLORS, fontBold, fontHeavy } from "./theme";
import { enterProgress, idleBreath, idleFloat } from "./utils";

const LABELS = [
	"trámites",
	"impuestos",
	"financiamiento",
	"adecuaciones",
	"mudanza",
	"mantenimiento",
];

const RADIUS_X = 330;
const RADIUS_Y = 260;

export const Scene2: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cardIn = Math.min(
		spring({ frame, fps, config: { damping: 13 }, durationInFrames: 18 }),
		1,
	);
	const breathe = idleBreath(frame, 0.015, 0.05);

	const captionP = enterProgress(frame, 150, 20);

	return (
		<>
			<Background />
			<WipeCut frame={frame} />
			<SafeArea>
				<div
					style={{
						position: "relative",
						width: 800,
						height: 620,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					{LABELS.map((label, i) => {
						const start = 30 + i * 12;
						const p = Math.min(
							spring({
								frame: frame - start,
								fps,
								config: { damping: 12 },
								durationInFrames: 16,
							}),
							1,
						);
						const angle = (-90 + i * 60) * (Math.PI / 180);
						const x = Math.cos(angle) * RADIUS_X;
						const y = Math.sin(angle) * RADIUS_Y;
						const floatY = idleFloat(frame - start, 5, 0.05 + i * 0.004);
						return (
							<div
								key={label}
								style={{
									position: "absolute",
									left: `calc(50% + ${x}px)`,
									top: `calc(50% + ${y}px)`,
									transform: `translate(-50%, -50%) scale(${p}) translateY(${floatY}px)`,
									opacity: p,
									padding: "8px 16px",
									borderRadius: 999,
									border: `2px solid ${COLORS.neutral}`,
									color: COLORS.neutral,
									...fontBold,
									fontSize: 21,
									whiteSpace: "nowrap",
								}}
							>
								{label}
							</div>
						);
					})}
					<div
						style={{
							transform: `scale(${cardIn * breathe})`,
							backgroundColor: "rgba(255,255,255,0.03)",
							border: `3px solid ${COLORS.gold}`,
							borderRadius: 20,
							padding: "22px 34px",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							gap: 6,
						}}
					>
						<div
							style={{
								width: 46,
								height: 3,
								backgroundColor: COLORS.gold,
								borderRadius: 2,
								marginBottom: 6,
							}}
						/>
						<div style={{ ...fontHeavy, color: COLORS.white, fontSize: 58 }}>
							$120.000
						</div>
					</div>
				</div>
				<div
					style={{
						opacity: captionP,
						transform: `translateY(${(1 - captionP) * 20}px)`,
						...fontBold,
						color: COLORS.white,
						fontSize: 40,
						textAlign: "center",
						marginTop: 32,
						maxWidth: 700,
					}}
				>
					El precio no es el único costo
				</div>
			</SafeArea>
		</>
	);
};
