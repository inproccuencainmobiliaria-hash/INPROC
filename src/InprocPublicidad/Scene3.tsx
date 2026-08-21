import { staticFile, useCurrentFrame } from "remotion";
import { KenBurnsPhoto, SafeArea } from "./primitives";
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

const polygonLength = (points: Array<{ x: number; y: number }>) => {
	let total = 0;
	for (let i = 0; i < points.length; i++) {
		const a = points[i];
		const b = points[(i + 1) % points.length];
		total += Math.hypot(b.x - a.x, b.y - a.y);
	}
	return total;
};

const PolygonOverlay: React.FC<{ progress: number }> = ({ progress }) => {
	const points = LIMITES_PROPIEDAD.map(toPixels);
	const d =
		points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";
	const length = polygonLength(points);

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
				stroke={COLORS.navy}
				strokeWidth={4}
				strokeLinejoin="round"
				strokeDasharray={length}
				strokeDashoffset={length * (1 - progress)}
			/>
		</svg>
	);
};

export const Scene3: React.FC = () => {
	const frame = useCurrentFrame();

	const scale = kenBurnsScale(frame, 120, 1.08, 1.12);
	const polygonP = clampInterp(frame, [10, 50], [0, 1]);
	const textP = clampInterp(frame, [60, 78], [0, 1]);

	return (
		<>
			<KenBurnsPhoto src={staticFile("propiedad_03.jpg")} scale={scale} />
			<PolygonOverlay progress={polygonP} />
			<SafeArea style={{ display: "flex", alignItems: "flex-start" }}>
				<div
					style={{
						...fontBold,
						color: COLORS.white,
						fontSize: 56,
						lineHeight: 1.25,
						textShadow,
						opacity: textP,
						transform: `translateY(${(1 - textP) * 26}px)`,
						maxWidth: 780,
					}}
				>
					Invierte hoy. Haz crecer tu patrimonio.
				</div>
			</SafeArea>
		</>
	);
};
