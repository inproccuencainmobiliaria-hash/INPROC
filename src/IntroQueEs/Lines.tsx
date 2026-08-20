import { COLORS, CENTER_X, CENTER_Y, VIDEO_WIDTH, VIDEO_HEIGHT } from "./theme";
import { clampInterp, easeIn } from "./utils";

const GRID_STEP = 100;

export const FaintGrid: React.FC = () => {
	const verticals = [];
	for (let x = GRID_STEP; x < VIDEO_WIDTH; x += GRID_STEP) {
		verticals.push(x);
	}
	const horizontals = [];
	for (let y = GRID_STEP; y < VIDEO_HEIGHT; y += GRID_STEP) {
		horizontals.push(y);
	}
	return (
		<svg
			style={{ position: "absolute", left: 0, top: 0 }}
			width={VIDEO_WIDTH}
			height={VIDEO_HEIGHT}
			viewBox={`0 0 ${VIDEO_WIDTH} ${VIDEO_HEIGHT}`}
		>
			{verticals.map((x) => (
				<line key={`v${x}`} x1={x} y1={0} x2={x} y2={VIDEO_HEIGHT} stroke={COLORS.blueprint} strokeWidth={1} opacity={0.5} />
			))}
			{horizontals.map((y) => (
				<line key={`h${y}`} x1={0} y1={y} x2={VIDEO_WIDTH} y2={y} stroke={COLORS.blueprint} strokeWidth={1} opacity={0.5} />
			))}
		</svg>
	);
};

type LineDef = {
	start: { x: number; y: number };
	dir: { x: number; y: number };
	speed: number;
	length: number;
};

const norm = (v: { x: number; y: number }) => {
	const len = Math.hypot(v.x, v.y) || 1;
	return { x: v.x / len, y: v.y / len };
};

const LINES: LineDef[] = [
	{ start: { x: -180, y: -120 }, dir: norm({ x: 1, y: 0.8 }), speed: 15, length: 320 },
	{ start: { x: 1260, y: -80 }, dir: norm({ x: -1, y: 0.9 }), speed: 11, length: 280 },
	{ start: { x: -220, y: 640 }, dir: norm({ x: 1, y: 0.15 }), speed: 19, length: 360 },
	{ start: { x: 1300, y: 1000 }, dir: norm({ x: -1, y: -0.2 }), speed: 13, length: 300 },
	{ start: { x: -160, y: 2080 }, dir: norm({ x: 0.9, y: -1 }), speed: 17, length: 340 },
	{ start: { x: 1240, y: 2020 }, dir: norm({ x: -0.85, y: -1 }), speed: 10, length: 260 },
	{ start: { x: 420, y: -220 }, dir: norm({ x: 0.25, y: 1 }), speed: 21, length: 300 },
	{ start: { x: 680, y: 2160 }, dir: norm({ x: -0.2, y: -1 }), speed: 12, length: 280 },
];

const ENTRY_END = 30;
const CONVERGE_END = 95;

const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

const DiagonalLines: React.FC<{ frame: number }> = ({ frame }) => {
	const fadeOpacity = clampInterp(frame, [90, 115], [1, 0]);

	return (
		<svg
			style={{ position: "absolute", left: 0, top: 0 }}
			width={VIDEO_WIDTH}
			height={VIDEO_HEIGHT}
			viewBox={`0 0 ${VIDEO_WIDTH} ${VIDEO_HEIGHT}`}
		>
			{LINES.map((line, i) => {
				// Posición y largo al final de la entrada (frame 30), antes de
				// que la línea cambie de rumbo hacia el centro.
				const travelAt30 = line.speed * ENTRY_END;
				const p2At30 = {
					x: line.start.x + line.dir.x * travelAt30,
					y: line.start.y + line.dir.y * travelAt30,
				};
				const p1At30 = {
					x: p2At30.x - line.dir.x * line.length,
					y: p2At30.y - line.dir.y * line.length,
				};
				const midAt30 = { x: (p1At30.x + p2At30.x) / 2, y: (p1At30.y + p2At30.y) / 2 };
				const towardCenter = norm({ x: CENTER_X - midAt30.x, y: CENTER_Y - midAt30.y });

				let mid: { x: number; y: number };
				let dir: { x: number; y: number };
				let length: number;

				if (frame < ENTRY_END) {
					const travel = line.speed * frame;
					const p2 = { x: line.start.x + line.dir.x * travel, y: line.start.y + line.dir.y * travel };
					const p1 = { x: p2.x - line.dir.x * line.length, y: p2.y - line.dir.y * line.length };
					mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
					dir = line.dir;
					length = line.length;
				} else {
					const ce = clampInterp(frame, [ENTRY_END, CONVERGE_END], [0, 1], easeIn);
					mid = { x: lerp(midAt30.x, CENTER_X, ce), y: lerp(midAt30.y, CENTER_Y, ce) };
					dir = towardCenter;
					length = line.length * (1 - ce);
				}

				const x1 = mid.x - (dir.x * length) / 2;
				const y1 = mid.y - (dir.y * length) / 2;
				const x2 = mid.x + (dir.x * length) / 2;
				const y2 = mid.y + (dir.y * length) / 2;

				return (
					<line
						key={i}
						x1={x1}
						y1={y1}
						x2={x2}
						y2={y2}
						stroke={i % 3 === 0 ? COLORS.brand : COLORS.line}
						strokeWidth={2}
						strokeLinecap="round"
						opacity={fadeOpacity * (i % 3 === 0 ? 0.8 : 0.55)}
					/>
				);
			})}
		</svg>
	);
};

const CentralGlow: React.FC<{ frame: number }> = ({ frame }) => {
	const rampIn = clampInterp(frame, [35, 55], [0, 0.5]);
	const peak = clampInterp(frame, [72, 88, 99], [0, 0.25, 0]);
	const opacity = Math.min(1, rampIn + peak);
	const size = 900;

	return (
		<div
			style={{
				position: "absolute",
				left: CENTER_X - size / 2,
				top: CENTER_Y - size / 2,
				width: size,
				height: size,
				borderRadius: "50%",
				opacity,
				background: `radial-gradient(circle, ${COLORS.brand} 0%, rgba(232,184,75,0) 70%)`,
			}}
		/>
	);
};

export const Lines: React.FC<{ frame: number }> = ({ frame }) => {
	return (
		<>
			<FaintGrid />
			<CentralGlow frame={frame} />
			<DiagonalLines frame={frame} />
		</>
	);
};
