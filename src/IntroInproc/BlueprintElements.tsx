import { COLORS } from "./theme";
import { clampInterp } from "./utils";

const GRID_STEP = 90;

// ---------------------------------------------------------------------------
// Grid backdrop revealed by the opening scan-line (frames 0-30).
// ---------------------------------------------------------------------------
export const TechnicalGrid: React.FC<{
	width: number;
	height: number;
}> = ({ width, height }) => {
	const verticals = [];
	for (let x = GRID_STEP; x < width; x += GRID_STEP) {
		verticals.push(x);
	}
	const horizontals = [];
	for (let y = GRID_STEP; y < height; y += GRID_STEP) {
		horizontals.push(y);
	}
	return (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
			{verticals.map((x) => (
				<line key={`v${x}`} x1={x} y1={0} x2={x} y2={height} stroke={COLORS.blueprint} strokeWidth={1} />
			))}
			{horizontals.map((y) => (
				<line key={`h${y}`} x1={0} y1={y} x2={width} y2={y} stroke={COLORS.blueprint} strokeWidth={1} />
			))}
			{/* algunas marcas de medición a lo largo de un eje, muy discretas */}
			{horizontals
				.filter((_, i) => i % 3 === 0)
				.map((y) => (
					<line key={`tick${y}`} x1={GRID_STEP} y1={y} x2={GRID_STEP - 14} y2={y} stroke={COLORS.line} strokeWidth={1} opacity={0.4} />
				))}
		</svg>
	);
};

// ---------------------------------------------------------------------------
// Helpers de trazo: cada segmento recto es su propio elemento SVG para que
// strokeDasharray/strokeDashoffset revele el trazo sin el bug de Chromium
// que reinicia la fase del dash en cada subpath de un <path> con varios M.
// ---------------------------------------------------------------------------
const DrawLine: React.FC<{
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	progress: number;
	color?: string;
	strokeWidth?: number;
}> = ({ x1, y1, x2, y2, progress, color = COLORS.line, strokeWidth = 2 }) => {
	const length = Math.hypot(x2 - x1, y2 - y1);
	return (
		<line
			x1={x1}
			y1={y1}
			x2={x2}
			y2={y2}
			stroke={color}
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeDasharray={length}
			strokeDashoffset={length * (1 - Math.min(Math.max(progress, 0), 1))}
		/>
	);
};

const arcLength = (radius: number, sweepDeg: number) =>
	radius * (Math.abs(sweepDeg) * (Math.PI / 180));

const arcPath = (cx: number, cy: number, radius: number, startDeg: number, endDeg: number) => {
	const toXY = (deg: number) => ({
		x: cx + radius * Math.cos((deg * Math.PI) / 180),
		y: cy + radius * Math.sin((deg * Math.PI) / 180),
	});
	const start = toXY(startDeg);
	const end = toXY(endDeg);
	const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
	return `M${start.x},${start.y} A${radius},${radius} 0 ${largeArc} 1 ${end.x},${end.y}`;
};

// ---------------------------------------------------------------------------
// Línea de cota con flechas en los extremos.
// ---------------------------------------------------------------------------
export const DimensionLine: React.FC<{
	frame: number;
	startFrame: number;
	x1: number;
	x2: number;
	y: number;
}> = ({ frame, startFrame, x1, x2, y }) => {
	const shaftP = clampInterp(frame, [startFrame, startFrame + 14], [0, 1]);
	const headsP = clampInterp(frame, [startFrame + 12, startFrame + 20], [0, 1]);
	const arrow = 12;
	return (
		<svg
			style={{ position: "absolute", left: 0, top: 0 }}
			width={1080}
			height={1920}
			viewBox="0 0 1080 1920"
		>
			<DrawLine x1={x1} y1={y} x2={x2} y2={y} progress={shaftP} color={COLORS.line} strokeWidth={2} />
			<DrawLine x1={x1} y1={y - 10} x2={x1} y2={y + 10} progress={headsP} color={COLORS.line} strokeWidth={2} />
			<DrawLine x1={x2} y1={y - 10} x2={x2} y2={y + 10} progress={headsP} color={COLORS.line} strokeWidth={2} />
			<DrawLine x1={x1} y1={y} x2={x1 + arrow} y2={y - 6} progress={headsP} color={COLORS.brand} strokeWidth={2} />
			<DrawLine x1={x1} y1={y} x2={x1 + arrow} y2={y + 6} progress={headsP} color={COLORS.brand} strokeWidth={2} />
			<DrawLine x1={x2} y1={y} x2={x2 - arrow} y2={y - 6} progress={headsP} color={COLORS.brand} strokeWidth={2} />
			<DrawLine x1={x2} y1={y} x2={x2 - arrow} y2={y + 6} progress={headsP} color={COLORS.brand} strokeWidth={2} />
		</svg>
	);
};

// ---------------------------------------------------------------------------
// Ángulo trazado con su arco.
// ---------------------------------------------------------------------------
export const AngleMark: React.FC<{
	frame: number;
	startFrame: number;
	cx: number;
	cy: number;
}> = ({ frame, startFrame, cx, cy }) => {
	const legsP = clampInterp(frame, [startFrame, startFrame + 12], [0, 1]);
	const arcP = clampInterp(frame, [startFrame + 10, startFrame + 26], [0, 1]);
	const radius = 64;
	const startDeg = -90;
	const endDeg = 24;
	const leg1 = { x: cx, y: cy - 140 };
	const leg2 = { x: cx + 132, y: cy + 51 };
	const length = arcLength(radius, endDeg - startDeg);
	return (
		<svg
			style={{ position: "absolute", left: 0, top: 0 }}
			width={1080}
			height={1920}
			viewBox="0 0 1080 1920"
			fill="none"
		>
			<DrawLine x1={cx} y1={cy} x2={leg1.x} y2={leg1.y} progress={legsP} color={COLORS.line} strokeWidth={2} />
			<DrawLine x1={cx} y1={cy} x2={leg2.x} y2={leg2.y} progress={legsP} color={COLORS.line} strokeWidth={2} />
			<path
				d={arcPath(cx, cy, radius, startDeg, endDeg)}
				stroke={COLORS.brand}
				strokeWidth={2}
				fill="none"
				strokeDasharray={length}
				strokeDashoffset={length * (1 - arcP)}
			/>
		</svg>
	);
};

// ---------------------------------------------------------------------------
// Rectángulos dispersos que se ordenan en una grilla.
// ---------------------------------------------------------------------------
const RECTANGLES = [
	{ scatter: { x: 760, y: 1080, rot: -18 }, ordered: { x: 700, y: 1140 } },
	{ scatter: { x: 900, y: 1020, rot: 24 }, ordered: { x: 800, y: 1140 } },
	{ scatter: { x: 640, y: 1220, rot: 12 }, ordered: { x: 900, y: 1140 } },
	{ scatter: { x: 940, y: 1230, rot: -30 }, ordered: { x: 700, y: 1200 } },
	{ scatter: { x: 700, y: 990, rot: 30 }, ordered: { x: 800, y: 1200 } },
	{ scatter: { x: 860, y: 1280, rot: -10 }, ordered: { x: 900, y: 1200 } },
];
const RECT_W = 64;
const RECT_H = 42;

export const GridRectangles: React.FC<{ frame: number; startFrame: number }> = ({
	frame,
	startFrame,
}) => {
	return (
		<svg
			style={{ position: "absolute", left: 0, top: 0 }}
			width={1080}
			height={1920}
			viewBox="0 0 1080 1920"
			fill="none"
		>
			{RECTANGLES.map((r, i) => {
				const appear = clampInterp(frame, [startFrame + i * 2, startFrame + i * 2 + 10], [0, 1]);
				const order = clampInterp(frame, [startFrame + 14 + i * 3, startFrame + 34 + i * 3], [0, 1]);
				const x = r.scatter.x + (r.ordered.x - r.scatter.x) * order;
				const y = r.scatter.y + (r.ordered.y - r.scatter.y) * order;
				const rot = r.scatter.rot * (1 - order);
				return (
					<rect
						key={i}
						x={x - RECT_W / 2}
						y={y - RECT_H / 2}
						width={RECT_W}
						height={RECT_H}
						rx={4}
						stroke={order > 0.85 ? COLORS.brand : COLORS.line}
						strokeWidth={2}
						opacity={appear}
						transform={`rotate(${rot} ${x} ${y})`}
					/>
				);
			})}
		</svg>
	);
};

// ---------------------------------------------------------------------------
// Puntos de conexión que se enlazan formando una pequeña estructura.
// ---------------------------------------------------------------------------
const NODES = [
	{ x: 180, y: 900 },
	{ x: 330, y: 830 },
	{ x: 430, y: 970 },
	{ x: 300, y: 1080 },
	{ x: 165, y: 1010 },
];
const LINKS: Array<[number, number]> = [
	[0, 1],
	[1, 2],
	[2, 3],
	[3, 4],
	[4, 0],
	[1, 3],
];

export const ConnectionNetwork: React.FC<{ frame: number; startFrame: number }> = ({
	frame,
	startFrame,
}) => {
	return (
		<svg
			style={{ position: "absolute", left: 0, top: 0 }}
			width={1080}
			height={1920}
			viewBox="0 0 1080 1920"
			fill="none"
		>
			{LINKS.map(([a, b], i) => {
				const p = clampInterp(frame, [startFrame + 16 + i * 3, startFrame + 30 + i * 3], [0, 1]);
				return (
					<DrawLine
						key={i}
						x1={NODES[a].x}
						y1={NODES[a].y}
						x2={NODES[b].x}
						y2={NODES[b].y}
						progress={p}
						color={COLORS.line}
						strokeWidth={1.5}
					/>
				);
			})}
			{NODES.map((n, i) => {
				const p = clampInterp(frame, [startFrame + i * 4, startFrame + i * 4 + 10], [0, 1]);
				return (
					<circle
						key={i}
						cx={n.x}
						cy={n.y}
						r={5 * (0.4 + 0.6 * p)}
						fill={COLORS.brand}
						opacity={p}
					/>
				);
			})}
		</svg>
	);
};
