import { COLORS, CENTER_X, VIDEO_WIDTH, VIDEO_HEIGHT } from "./theme";
import { clampInterp, easeInOut } from "./utils";

const GRID_STEP = 120;

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
				<line key={`v${x}`} x1={x} y1={0} x2={x} y2={VIDEO_HEIGHT} stroke={COLORS.blueprint} strokeWidth={1} />
			))}
			{horizontals.map((y) => (
				<line key={`h${y}`} x1={0} y1={y} x2={VIDEO_WIDTH} y2={y} stroke={COLORS.blueprint} strokeWidth={1} />
			))}
		</svg>
	);
};

type LineDef = {
	fromLeft: boolean;
	y: number;
	speed: number;
	length: number;
	restOffset: number; // posición final relativa al centro, en x
};

const LINES: LineDef[] = [
	{ fromLeft: true, y: 220, speed: 17, length: 340, restOffset: -190 },
	{ fromLeft: true, y: 360, speed: 24, length: 260, restOffset: -100 },
	{ fromLeft: true, y: 720, speed: 13, length: 380, restOffset: -220 },
	{ fromLeft: true, y: 860, speed: 20, length: 300, restOffset: -70 },
	{ fromLeft: false, y: 260, speed: 15, length: 300, restOffset: 160 },
	{ fromLeft: false, y: 420, speed: 22, length: 340, restOffset: 90 },
	{ fromLeft: false, y: 680, speed: 12, length: 260, restOffset: 210 },
	{ fromLeft: false, y: 820, speed: 19, length: 320, restOffset: 70 },
];

const ENTRY_END = 30;
const CONVERGE_END = 70;
const FADE_START = 75;
const FADE_END = 118;

const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

export const DiagonalLines: React.FC<{ frame: number }> = ({ frame }) => {
	const fadeOpacity = clampInterp(frame, [FADE_START, FADE_END], [1, 0]);

	return (
		<svg
			style={{ position: "absolute", left: 0, top: 0 }}
			width={VIDEO_WIDTH}
			height={VIDEO_HEIGHT}
			viewBox={`0 0 ${VIDEO_WIDTH} ${VIDEO_HEIGHT}`}
		>
			{LINES.map((line, i) => {
				const dir = line.fromLeft ? 1 : -1;
				const start = line.fromLeft ? -300 : VIDEO_WIDTH + 300;
				const travelAt30 = line.speed * ENTRY_END;
				const midAt30 = start + dir * travelAt30;
				const restX = CENTER_X + line.restOffset;

				let mid: number;
				let length: number;

				if (frame < ENTRY_END) {
					mid = start + dir * line.speed * frame;
					length = line.length;
				} else {
					const ce = clampInterp(frame, [ENTRY_END, CONVERGE_END], [0, 1], easeInOut);
					mid = lerp(midAt30, restX, ce);
					length = lerp(line.length, line.length * 0.68, ce);
				}

				const x1 = mid - length / 2;
				const x2 = mid + length / 2;

				return (
					<line
						key={i}
						x1={x1}
						y1={line.y}
						x2={x2}
						y2={line.y}
						stroke={COLORS.brand}
						strokeWidth={2}
						strokeLinecap="round"
						opacity={fadeOpacity * 0.5}
					/>
				);
			})}
		</svg>
	);
};

export const Lines: React.FC<{ frame: number }> = ({ frame }) => (
	<>
		<FaintGrid />
		<DiagonalLines frame={frame} />
	</>
);
