import { staticFile, useCurrentFrame } from "remotion";
import { BladeWipe, CornerBrackets, KenBurnsPhoto, RoomTag, SafeArea, TopScrim } from "./primitives";
import { AnimatedHeadline } from "./AnimatedHeadline";
import { COLORS, fontBold, textShadow, VIDEO_WIDTH, VIDEO_HEIGHT } from "./theme";
import { clampInterp, kenBurnsScale } from "./utils";

// Polígono PROVISIONAL, centrado en el encuadre. Cada punto es un
// porcentaje [x%, y%] del ancho/alto del video. AJUSTAR con las
// coordenadas reales del límite de la propiedad antes de publicar.
export const LIMITES_PROPIEDAD: Array<[number, number]> = [
	[32, 38],
	[68, 34],
	[76, 58],
	[58, 76],
	[24, 66],
];

const toPixels = ([xPct, yPct]: [number, number]) => ({
	x: (xPct / 100) * VIDEO_WIDTH,
	y: (yPct / 100) * VIDEO_HEIGHT,
});

const segmentLengths = (points: Array<{ x: number; y: number }>) =>
	points.map((p, i) => {
		const next = points[(i + 1) % points.length];
		return Math.hypot(next.x - p.x, next.y - p.y);
	});

const PolygonOverlay: React.FC<{ frame: number; progress: number }> = ({ frame, progress }) => {
	const points = LIMITES_PROPIEDAD.map(toPixels);
	const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";
	const lengths = segmentLengths(points);
	const length = lengths.reduce((a, b) => a + b, 0);

	// Cuánto del recorrido acumulado hace falta para llegar a cada vértice,
	// para que su punto aparezca justo cuando el trazo lo alcanza.
	let acc = 0;
	const vertexThresholds = lengths.map((l) => {
		acc += l;
		return acc / length;
	});

	return (
		<svg
			style={{ position: "absolute", left: 0, top: 0 }}
			width={VIDEO_WIDTH}
			height={VIDEO_HEIGHT}
			viewBox={`0 0 ${VIDEO_WIDTH} ${VIDEO_HEIGHT}`}
		>
			<path
				d={d}
				fill="none"
				stroke={COLORS.white}
				strokeWidth={7}
				strokeLinejoin="round"
				opacity={0.5}
				strokeDasharray={length}
				strokeDashoffset={length * (1 - progress)}
			/>
			<path
				d={d}
				fill="none"
				stroke={COLORS.navy}
				strokeWidth={4}
				strokeLinejoin="round"
				strokeDasharray={length}
				strokeDashoffset={length * (1 - progress)}
			/>
			{points.map((p, i) => {
				const reached = clampInterp(progress, [vertexThresholds[i] - 0.03, vertexThresholds[i]], [0, 1]);
				const pulse = 1 + Math.sin(frame * 0.15 + i) * 0.08;
				return (
					<circle
						key={i}
						cx={p.x}
						cy={p.y}
						r={7 * reached * pulse}
						fill={COLORS.navy}
						stroke={COLORS.white}
						strokeWidth={2}
						opacity={reached}
					/>
				);
			})}
		</svg>
	);
};

export const Scene3: React.FC = () => {
	const frame = useCurrentFrame();

	const scale = kenBurnsScale(frame, 120, 1.08, 1.12);
	const translateY = clampInterp(frame, [0, 120], [10, -10]);

	const bracketsP = clampInterp(frame, [18, 36], [0, 1]);
	const scrimP = clampInterp(frame, [55, 70], [0, 1]);
	const tagP = clampInterp(frame, [14, 30], [0, 1]);
	const polygonP = clampInterp(frame, [10, 50], [0, 1]);

	return (
		<BladeWipe frame={frame}>
			<KenBurnsPhoto src={staticFile("propiedad_03.jpg")} scale={scale} translateYPixels={translateY} />
			<PolygonOverlay frame={frame} progress={polygonP} />
			<TopScrim opacity={scrimP} />
			<SafeArea style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
				<RoomTag icon="pool" label="Piscina" progress={tagP} />
				<div style={{ marginTop: 22 }}>
					<AnimatedHeadline
						frame={frame}
						startFrame={60}
						text="Invierte hoy. Haz crecer tu patrimonio."
						style={{
							...fontBold,
							color: COLORS.white,
							fontSize: 56,
							lineHeight: 1.25,
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
