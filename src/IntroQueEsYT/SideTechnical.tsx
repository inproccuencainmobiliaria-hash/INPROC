import { COLORS, VIDEO_WIDTH, VIDEO_HEIGHT } from "./theme";
import { clampInterp } from "./utils";

const MAX_OPACITY = 0.15;

const DrawLine: React.FC<{
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	progress: number;
	strokeWidth?: number;
}> = ({ x1, y1, x2, y2, progress, strokeWidth = 2 }) => {
	const length = Math.hypot(x2 - x1, y2 - y1);
	return (
		<line
			x1={x1}
			y1={y1}
			x2={x2}
			y2={y2}
			stroke={COLORS.brand}
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeDasharray={length}
			strokeDashoffset={length * (1 - Math.min(Math.max(progress, 0), 1))}
		/>
	);
};

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
const arcLength = (radius: number, sweepDeg: number) => radius * (Math.abs(sweepDeg) * (Math.PI / 180));

// Línea de cota con flechas, a la izquierda del bloque central.
const LeftDimension: React.FC<{ frame: number }> = ({ frame }) => {
	const shaftP = clampInterp(frame, [30, 46], [0, 1]);
	const headsP = clampInterp(frame, [42, 54], [0, 1]);
	const opacity = clampInterp(frame, [30, 48], [0, MAX_OPACITY]);
	const x1 = 240;
	const x2 = 480;
	const y = 420;
	const arrow = 10;
	return (
		<g opacity={opacity}>
			<DrawLine x1={x1} y1={y} x2={x2} y2={y} progress={shaftP} />
			<DrawLine x1={x1} y1={y - 9} x2={x1} y2={y + 9} progress={headsP} />
			<DrawLine x1={x2} y1={y - 9} x2={x2} y2={y + 9} progress={headsP} />
			<DrawLine x1={x1} y1={y} x2={x1 + arrow} y2={y - 5} progress={headsP} />
			<DrawLine x1={x1} y1={y} x2={x1 + arrow} y2={y + 5} progress={headsP} />
			<DrawLine x1={x2} y1={y} x2={x2 - arrow} y2={y - 5} progress={headsP} />
			<DrawLine x1={x2} y1={y} x2={x2 - arrow} y2={y + 5} progress={headsP} />
		</g>
	);
};

// Arco de ángulo, a la izquierda, debajo de la cota.
const LeftAngle: React.FC<{ frame: number }> = ({ frame }) => {
	const legsP = clampInterp(frame, [40, 54], [0, 1]);
	const arcP = clampInterp(frame, [50, 66], [0, 1]);
	const opacity = clampInterp(frame, [40, 58], [0, MAX_OPACITY]);
	const cx = 300;
	const cy = 700;
	const radius = 50;
	const startDeg = -90;
	const endDeg = 20;
	const leg1 = { x: cx, y: cy - 110 };
	const leg2 = { x: cx + 104, y: cy + 40 };
	const length = arcLength(radius, endDeg - startDeg);
	return (
		<g opacity={opacity}>
			<DrawLine x1={cx} y1={cy} x2={leg1.x} y2={leg1.y} progress={legsP} />
			<DrawLine x1={cx} y1={cy} x2={leg2.x} y2={leg2.y} progress={legsP} />
			<path
				d={arcPath(cx, cy, radius, startDeg, endDeg)}
				stroke={COLORS.brand}
				strokeWidth={2}
				fill="none"
				strokeDasharray={length}
				strokeDashoffset={length * (1 - arcP)}
			/>
		</g>
	);
};

// Puntos de conexión, a la derecha del bloque central.
const RIGHT_NODES = [
	{ x: 1440, y: 460 },
	{ x: 1560, y: 400 },
	{ x: 1660, y: 500 },
	{ x: 1580, y: 620 },
	{ x: 1450, y: 600 },
];
const RIGHT_LINKS: Array<[number, number]> = [
	[0, 1],
	[1, 2],
	[2, 3],
	[3, 4],
	[4, 0],
];

const RightConnections: React.FC<{ frame: number }> = ({ frame }) => (
	<g>
		{RIGHT_LINKS.map(([a, b], i) => {
			const p = clampInterp(frame, [46 + i * 3, 60 + i * 3], [0, 1]);
			const opacity = clampInterp(frame, [46 + i * 3, 60 + i * 3], [0, MAX_OPACITY]);
			return (
				<g key={i} opacity={opacity}>
					<DrawLine
						x1={RIGHT_NODES[a].x}
						y1={RIGHT_NODES[a].y}
						x2={RIGHT_NODES[b].x}
						y2={RIGHT_NODES[b].y}
						progress={p}
						strokeWidth={1.5}
					/>
				</g>
			);
		})}
		{RIGHT_NODES.map((n, i) => {
			const p = clampInterp(frame, [40 + i * 3, 50 + i * 3], [0, 1]);
			const opacity = clampInterp(frame, [40 + i * 3, 50 + i * 3], [0, MAX_OPACITY]);
			return <circle key={i} cx={n.x} cy={n.y} r={4 * (0.4 + 0.6 * p)} fill={COLORS.brand} opacity={opacity} />;
		})}
	</g>
);

export const SideTechnical: React.FC<{ frame: number }> = ({ frame }) => (
	<svg
		style={{ position: "absolute", left: 0, top: 0 }}
		width={VIDEO_WIDTH}
		height={VIDEO_HEIGHT}
		viewBox={`0 0 ${VIDEO_WIDTH} ${VIDEO_HEIGHT}`}
		fill="none"
	>
		<LeftDimension frame={frame} />
		<LeftAngle frame={frame} />
		<RightConnections frame={frame} />
	</svg>
);
