import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SafeArea } from "./primitives";
import { COLORS, fontMedium, SAFE_WIDTH, VIDEO_WIDTH, VIDEO_HEIGHT } from "./theme";
import { clampInterp, easeOut } from "./utils";

const LOGO_HEIGHT = 520;
const CENTER_X = VIDEO_WIDTH / 2;
const CENTER_Y = VIDEO_HEIGHT / 2;

// Ráfaga de líneas finas que convergen hacia el centro y se disuelven,
// dando entrada con energía antes de que se asiente el logo.
const ConvergingBurst: React.FC<{ frame: number }> = ({ frame }) => {
	const lines = [
		{ angle: -160, dist: 620, delay: 0 },
		{ angle: -110, dist: 520, delay: 2 },
		{ angle: -35, dist: 600, delay: 4 },
		{ angle: 20, dist: 540, delay: 1 },
		{ angle: 150, dist: 580, delay: 3 },
		{ angle: 200, dist: 520, delay: 5 },
	];
	const opacity = clampInterp(frame, [0, 10, 30, 42], [0, 0.35, 0.35, 0]);

	return (
		<svg
			style={{ position: "absolute", left: 0, top: 0 }}
			width={VIDEO_WIDTH}
			height={VIDEO_HEIGHT}
			viewBox={`0 0 ${VIDEO_WIDTH} ${VIDEO_HEIGHT}`}
		>
			{lines.map((l, i) => {
				const p = clampInterp(frame, [l.delay, l.delay + 26], [0, 1], easeOut);
				const rad = (l.angle * Math.PI) / 180;
				const startR = l.dist;
				const endR = l.dist * 0.18;
				const r = startR + (endR - startR) * p;
				const x = CENTER_X + Math.cos(rad) * r;
				const y = CENTER_Y + Math.sin(rad) * r;
				const len = 130 * (1 - p * 0.5);
				const x2 = x - Math.cos(rad) * len;
				const y2 = y - Math.sin(rad) * len;
				return (
					<line
						key={i}
						x1={x}
						y1={y}
						x2={x2}
						y2={y2}
						stroke={COLORS.navy}
						strokeWidth={2}
						strokeLinecap="round"
						opacity={opacity}
					/>
				);
			})}
		</svg>
	);
};

export const Scene4: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const wipeP = clampInterp(frame, [0, 12], [0, 100], easeOut);

	const logoP = Math.min(
		spring({ frame: frame - 12, fps, config: { damping: 16, mass: 0.7 }, durationInFrames: 26 }),
		1,
	);
	const logoOpacity = clampInterp(frame, [12, 30], [0, 1]);
	const logoScale = 0.9 + 0.1 * logoP;

	const glowP = clampInterp(frame, [12, 40], [0, 1]);
	const glowPulse = 1 + Math.sin(frame * 0.05) * 0.04;

	const textP = clampInterp(frame, [40, 56], [0, 1]);

	const linesP = clampInterp(frame, [18, 46], [0, 1], easeOut);
	const lineMaxWidth = 320;

	return (
		<AbsoluteFill style={{ backgroundColor: COLORS.white }}>
			<AbsoluteFill
				style={{
					background: `radial-gradient(circle at 50% 45%, rgba(22,38,79,0.06) 0%, rgba(22,38,79,0) 60%)`,
				}}
			/>

			<AbsoluteFill
				style={{
					backgroundColor: COLORS.navy,
					transform: `translateY(${-wipeP}%)`,
				}}
			/>

			<ConvergingBurst frame={frame} />

			<SafeArea
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<div
					style={{
						position: "relative",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<div
						style={{
							position: "absolute",
							left: "50%",
							top: "50%",
							width: LOGO_HEIGHT * 1.15 * glowPulse,
							height: LOGO_HEIGHT * 1.15 * glowPulse,
							transform: "translate(-50%, -50%)",
							borderRadius: "50%",
							opacity: glowP * 0.5,
							background:
								"radial-gradient(circle, rgba(22,38,79,0.14) 0%, rgba(22,38,79,0) 70%)",
						}}
					/>

					<div
						style={{
							position: "absolute",
							top: "50%",
							right: `calc(100% + 30px)`,
							width: lineMaxWidth * linesP,
							height: 2,
							backgroundColor: COLORS.navy,
							opacity: 0.2,
							transform: "translateY(-50%)",
						}}
					/>
					<div
						style={{
							position: "absolute",
							top: "50%",
							right: `calc(100% + 30px - ${lineMaxWidth * linesP}px)`,
							width: 6,
							height: 6,
							borderRadius: "50%",
							backgroundColor: COLORS.navy,
							opacity: linesP * 0.35,
							transform: "translate(-50%, -50%)",
						}}
					/>
					<div
						style={{
							position: "absolute",
							top: "50%",
							left: `calc(100% + 30px)`,
							width: lineMaxWidth * linesP,
							height: 2,
							backgroundColor: COLORS.navy,
							opacity: 0.2,
							transform: "translateY(-50%)",
						}}
					/>
					<div
						style={{
							position: "absolute",
							top: "50%",
							left: `calc(100% + 30px + ${lineMaxWidth * linesP}px)`,
							width: 6,
							height: 6,
							borderRadius: "50%",
							backgroundColor: COLORS.navy,
							opacity: linesP * 0.35,
							transform: "translate(-50%, -50%)",
						}}
					/>

					<Img
						src={staticFile("logo_inproc.png")}
						style={{
							height: LOGO_HEIGHT,
							width: "auto",
							opacity: logoOpacity,
							transform: `scale(${logoScale})`,
						}}
					/>
					<div
						style={{
							...fontMedium,
							color: COLORS.navy,
							fontSize: 40,
							marginTop: 30,
							opacity: textP,
							transform: `translateY(${(1 - textP) * 16}px)`,
							textAlign: "center",
							maxWidth: SAFE_WIDTH,
						}}
					>
						INPROC Bienes Raíces
					</div>
				</div>
			</SafeArea>
		</AbsoluteFill>
	);
};
