import { spring, useVideoConfig } from "remotion";
import { COLORS, SAFE_AREA, SAFE_WIDTH, fontHeavy } from "./theme";
import { clampInterp } from "./utils";

const QueEsLine: React.FC<{ frame: number }> = ({ frame }) => {
	const { fps } = useVideoConfig();
	const p = Math.min(
		spring({ frame: frame - 45, fps, config: { damping: 14, mass: 0.6 }, durationInFrames: 18 }),
		1,
	);
	if (frame < 42) {
		return null;
	}
	return (
		<div
			style={{
				...fontHeavy,
				fontSize: 54,
				color: COLORS.white,
				opacity: p,
				transform: `translateY(${(1 - p) * 40}px)`,
			}}
		>
			¿QUÉ ES
		</div>
	);
};

const InprocLine: React.FC<{ frame: number }> = ({ frame }) => {
	const { fps } = useVideoConfig();
	const pulse = spring({ frame: frame - 60, fps, config: { damping: 9, mass: 0.7 }, durationInFrames: 22 });
	const enter = Math.min(pulse, 1.18);
	const opacity = clampInterp(frame, [60, 70], [0, 1]);

	// Destello lateral que barre la palabra: una copia del texto con
	// background-clip:text y un gradiente que se desplaza sobre ella,
	// combinada por encima con mix-blend-mode para iluminar solo el glifo.
	const sweepX = clampInterp(frame, [60, 78], [-40, 140]);

	if (frame < 58) {
		return null;
	}

	return (
		<div style={{ position: "relative" }}>
			<div
				style={{
					...fontHeavy,
					fontSize: 118,
					color: COLORS.brand,
					opacity,
					transform: `scale(${0.7 + 0.3 * enter})`,
				}}
			>
				INPROC?
			</div>
			<div
				style={{
					...fontHeavy,
					fontSize: 118,
					position: "absolute",
					left: 0,
					top: 0,
					opacity,
					transform: `scale(${0.7 + 0.3 * enter})`,
					color: "transparent",
					backgroundImage: `linear-gradient(100deg, transparent calc(${sweepX}% - 18%), rgba(255,255,255,0.95) ${sweepX}%, transparent calc(${sweepX}% + 18%))`,
					backgroundClip: "text",
					WebkitBackgroundClip: "text",
					WebkitTextFillColor: "transparent",
					mixBlendMode: "overlay",
					pointerEvents: "none",
				}}
			>
				INPROC?
			</div>
		</div>
	);
};

export const TitleReveal: React.FC<{ frame: number }> = ({ frame }) => {
	const underlineP = clampInterp(frame, [66, 84], [0, 1]);

	return (
		<div
			style={{
				position: "absolute",
				top: SAFE_AREA.top,
				left: SAFE_AREA.left,
				width: SAFE_WIDTH,
				height: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				gap: 8,
				textAlign: "center",
			}}
		>
			<QueEsLine frame={frame} />
			<InprocLine frame={frame} />
			<div
				style={{
					width: 320 * underlineP,
					height: 5,
					backgroundColor: COLORS.brand,
					borderRadius: 3,
					marginTop: 14,
				}}
			/>
		</div>
	);
};
