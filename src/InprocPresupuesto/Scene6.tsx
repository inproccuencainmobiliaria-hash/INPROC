import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Background, SafeArea, WipeCut } from "./primitives";
import { COLORS, fontBold, fontHeavy } from "./theme";
import { enterProgress, idleBreath } from "./utils";

const COLUMNS = [
	{ label: "Precio de la propiedad", fraction: 1, accent: false },
	{ label: "Gastos asociados", fraction: 0.78, accent: false },
	{ label: "Dinero de reserva", fraction: 0.42, accent: true },
];

const MAX_HEIGHT = 480;
const COLUMN_WIDTH = 180;
const GAP = 40;

export const Scene6: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const headerP = enterProgress(frame, 4, 18);
	const breathe = idleBreath(frame, 0.012, 0.045);

	return (
		<>
			<Background />
			<WipeCut frame={frame} />
			<SafeArea>
				<div
					style={{
						opacity: headerP,
						transform: `translateY(${(1 - headerP) * -18}px) scale(${breathe})`,
						...fontHeavy,
						color: COLORS.white,
						fontSize: 54,
						textAlign: "center",
						lineHeight: 1.25,
						marginBottom: 70,
						maxWidth: 720,
					}}
				>
					DEFINE TU PRESUPUESTO{" "}
					<span style={{ color: COLORS.gold }}>COMPLETO</span>
				</div>

				<div
					style={{
						display: "flex",
						alignItems: "flex-end",
						gap: GAP,
						height: MAX_HEIGHT,
					}}
				>
					{COLUMNS.map((col, i) => {
						const start = 20 + i * 16;
						const grow = Math.min(
							spring({
								frame: frame - start,
								fps,
								config: { damping: 14 },
								durationInFrames: 34,
							}),
							1,
						);
						const barH = MAX_HEIGHT * col.fraction * grow;
						return (
							<div
								key={col.label}
								style={{
									width: COLUMN_WIDTH,
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									justifyContent: "flex-end",
									height: MAX_HEIGHT,
								}}
							>
								<div
									style={{
										width: COLUMN_WIDTH,
										height: barH,
										borderRadius: "14px 14px 0 0",
										backgroundColor: col.accent ? COLORS.gold : COLORS.neutral,
										opacity: col.accent ? 1 : 0.75,
									}}
								/>
							</div>
						);
					})}
				</div>
				<div style={{ display: "flex", gap: GAP, marginTop: 24 }}>
					{COLUMNS.map((col, i) => {
						const start = 20 + i * 16 + 20;
						const p = enterProgress(frame, start, 14);
						return (
							<div
								key={col.label}
								style={{
									width: COLUMN_WIDTH,
									opacity: p,
									...fontBold,
									color: COLORS.neutral,
									fontSize: 22,
									textAlign: "center",
									lineHeight: 1.3,
								}}
							>
								{col.label}
							</div>
						);
					})}
				</div>
			</SafeArea>
		</>
	);
};
