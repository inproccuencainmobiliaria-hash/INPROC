import type { CSSProperties } from "react";
import { interpolate } from "remotion";

type IconProps = {
	size?: number;
	color?: string;
	style?: CSSProperties;
};

// Straight-line house silhouette + door + window. Each sub-shape is its own
// <path> (not one path with multiple M's) because Chromium resets the dash
// phase at every subpath start, which breaks a single shared dashoffset.
// Segment lengths below are hand-measured (every segment is a straight line).
const OUTLINE_PATH = "M40,360 L40,180 L200,40 L360,180 L360,360 L40,360";
const OUTLINE_LENGTH = 1105.19;
const DOOR_PATH = "M170,360 L170,260 L230,260 L230,360";
const DOOR_LENGTH = 260;
const WINDOW_PATH = "M255,125 L305,125 L305,175 L255,175 Z";
const WINDOW_LENGTH = 200;

const OUTLINE_END = OUTLINE_LENGTH / (OUTLINE_LENGTH + DOOR_LENGTH + WINDOW_LENGTH);
const DOOR_END =
	(OUTLINE_LENGTH + DOOR_LENGTH) / (OUTLINE_LENGTH + DOOR_LENGTH + WINDOW_LENGTH);

const localProgress = (progress: number, start: number, end: number) =>
	Math.min(1, Math.max(0, (progress - start) / (end - start)));

const drawnPath = (d: string, length: number, progress: number, common: {
	stroke: string;
	strokeWidth: number;
}) => (
	<path
		d={d}
		fill="none"
		stroke={common.stroke}
		strokeWidth={common.strokeWidth}
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeDasharray={length}
		strokeDashoffset={length * (1 - progress)}
	/>
);

export const HouseOutline: React.FC<
	IconProps & { progress: number; strokeWidth?: number }
> = ({ size = 400, color = "#E8B84B", progress, strokeWidth = 5, style }) => {
	const common = { stroke: color, strokeWidth };
	return (
		<svg width={size} height={size} viewBox="0 0 400 400" style={style} fill="none">
			{drawnPath(OUTLINE_PATH, OUTLINE_LENGTH, localProgress(progress, 0, OUTLINE_END), common)}
			{drawnPath(DOOR_PATH, DOOR_LENGTH, localProgress(progress, OUTLINE_END, DOOR_END), common)}
			{drawnPath(WINDOW_PATH, WINDOW_LENGTH, localProgress(progress, DOOR_END, 1), common)}
		</svg>
	);
};

export const WarningTriangle: React.FC<IconProps> = ({
	size = 120,
	color = "#E85D4B",
	style,
}) => (
	<svg width={size} height={size} viewBox="0 0 100 100" style={style}>
		<path
			d="M50,8 L94,86 L6,86 Z"
			fill="none"
			stroke={color}
			strokeWidth={7}
			strokeLinejoin="round"
			strokeLinecap="round"
		/>
		<rect x={46} y={38} width={8} height={24} rx={4} fill={color} />
		<circle cx={50} cy={72} r={5} fill={color} />
	</svg>
);

export const DocumentStack: React.FC<{
	size?: number;
	progress: number;
	color?: string;
	accent?: string;
	style?: CSSProperties;
}> = ({ size = 220, progress, color = "#FFFFFF", accent = "#E8B84B", style }) => (
	<svg width={size} height={size} viewBox="0 0 220 220" style={style}>
		{[0, 1, 2].map((i) => {
			const local = Math.min(1, Math.max(0, progress * 3 - i));
			const y = 30 - i * 16 + (1 - local) * 34;
			const stroke = i === 2 ? accent : color;
			return (
				<g key={i} opacity={local} transform={`translate(${18 + i * 16}, ${y})`}>
					<rect x={0} y={0} width={140} height={168} rx={10} fill="none" stroke={stroke} strokeWidth={4} />
					<line x1={22} y1={40} x2={118} y2={40} stroke={stroke} strokeWidth={4} strokeLinecap="round" opacity={0.9} />
					<line x1={22} y1={64} x2={118} y2={64} stroke={stroke} strokeWidth={4} strokeLinecap="round" opacity={0.65} />
					<line x1={22} y1={88} x2={90} y2={88} stroke={stroke} strokeWidth={4} strokeLinecap="round" opacity={0.45} />
				</g>
			);
		})}
	</svg>
);

export const Stamp: React.FC<{
	size?: number;
	progress: number;
	color?: string;
	style?: CSSProperties;
}> = ({ size = 160, progress, color = "#E8B84B", style }) => {
	const down = progress < 0.5 ? progress / 0.5 : (1 - progress) / 0.5;
	const translateY = down * 42;
	const impact = progress > 0.44 && progress < 0.68;
	return (
		<svg width={size} height={size} viewBox="0 0 160 160" style={style}>
			<rect x={50} y={122} width={60} height={14} rx={4} fill={color} opacity={0.3} />
			{impact ? (
				<circle cx={80} cy={129} r={30} fill="none" stroke={color} strokeWidth={3} opacity={0.5} />
			) : null}
			<g transform={`translate(0, ${translateY})`}>
				<rect x={62} y={16} width={36} height={58} rx={6} fill={color} />
				<rect x={44} y={74} width={72} height={20} rx={6} fill={color} />
				<rect x={54} y={94} width={52} height={16} rx={4} fill={color} opacity={0.85} />
			</g>
		</svg>
	);
};

export const Calculator: React.FC<{
	size?: number;
	frame: number;
	color?: string;
	accent?: string;
	style?: CSSProperties;
}> = ({ size = 180, frame, color = "#FFFFFF", accent = "#E8B84B", style }) => {
	const keys = Array.from({ length: 12 }, (_, i) => i);
	const cycle = frame % 42;
	return (
		<svg width={size} height={(size * 220) / 180} viewBox="0 0 180 220" style={style}>
			<rect x={10} y={10} width={160} height={200} rx={16} fill="none" stroke={color} strokeWidth={4} />
			<rect x={26} y={28} width={128} height={38} rx={6} fill="none" stroke={color} strokeWidth={3} opacity={0.55} />
			{keys.map((i) => {
				const col = i % 3;
				const row = Math.floor(i / 3);
				const x = 30 + col * 42;
				const y = 84 + row * 34;
				const lit = cycle >= i * 3 && cycle < i * 3 + 7;
				return (
					<rect
						key={i}
						x={x}
						y={y}
						width={30}
						height={24}
						rx={5}
						fill={lit ? accent : "none"}
						stroke={lit ? accent : color}
						strokeWidth={2.5}
						opacity={lit ? 1 : 0.65}
					/>
				);
			})}
		</svg>
	);
};

export const GrowthBars: React.FC<{
	progress: number;
	width?: number;
	height?: number;
	color?: string;
	accent?: string;
}> = ({ progress, width = 480, height = 240, color = "#8FA3B8", accent = "#E8B84B" }) => {
	const bars = [0.42, 0.68, 0.92, 0.58];
	const gap = 22;
	const barW = (width - gap * (bars.length - 1)) / bars.length;
	return (
		<svg width={width} height={height + 16} viewBox={`0 0 ${width} ${height + 16}`}>
			<line x1={0} y1={height} x2={width} y2={height} stroke={color} strokeWidth={3} opacity={0.35} />
			{bars.map((h, i) => {
				const local = Math.min(1, Math.max(0, progress * bars.length - i * 0.55));
				const barH = h * height * local;
				const x = i * (barW + gap);
				const isLast = i === bars.length - 1;
				return (
					<rect
						key={i}
						x={x}
						y={height - barH}
						width={barW}
						height={barH}
						rx={8}
						fill={isLast ? accent : color}
						opacity={isLast ? 1 : 0.75}
					/>
				);
			})}
		</svg>
	);
};

export const PaintReveal: React.FC<{
	progress: number;
	width?: number;
	height?: number;
	wallColor?: string;
	rollerColor?: string;
}> = ({ progress, width = 480, height = 220, wallColor = "#E8B84B", rollerColor = "#FFFFFF" }) => {
	const x = progress * (width - 70);
	const paintedWidth = Math.max(0, x + 35);
	return (
		<svg width={width} height={height + 90} viewBox={`0 0 ${width} ${height + 90}`}>
			<rect x={0} y={0} width={width} height={height} rx={12} fill="none" stroke={rollerColor} strokeWidth={3} opacity={0.3} />
			<rect x={0} y={0} width={paintedWidth} height={height} rx={12} fill={wallColor} opacity={0.92} />
			<g transform={`translate(${x}, ${height / 2 - 20})`}>
				<rect x={0} y={0} width={64} height={40} rx={10} fill={rollerColor} />
				<line x1={32} y1={40} x2={32} y2={86} stroke={rollerColor} strokeWidth={7} strokeLinecap="round" />
			</g>
		</svg>
	);
};

export const Lamp: React.FC<{
	on: number;
	size?: number;
	color?: string;
	glow?: string;
	style?: CSSProperties;
}> = ({ on, size = 200, color = "#FFFFFF", glow = "#E8B84B", style }) => (
	<svg width={size} height={(size * 260) / 220} viewBox="0 0 220 260" style={style}>
		<line x1={110} y1={0} x2={110} y2={58} stroke={color} strokeWidth={4} />
		<path d="M70,58 L150,58 L130,128 L90,128 Z" fill="none" stroke={color} strokeWidth={5} strokeLinejoin="round" />
		<circle cx={110} cy={93} r={46 * on} fill={glow} opacity={0.32 * on} />
		<circle cx={110} cy={93} r={14} fill={on > 0.5 ? glow : "none"} stroke={glow} strokeWidth={4} />
		<line x1={110} y1={128} x2={110} y2={168} stroke={color} strokeWidth={4} />
	</svg>
);

export const MovingBox: React.FC<{ size?: number; color?: string; style?: CSSProperties }> = ({
	size = 120,
	color = "#FFFFFF",
	style,
}) => (
	<svg width={size} height={size} viewBox="0 0 120 120" style={style}>
		<rect x={10} y={32} width={100} height={78} rx={6} fill="none" stroke={color} strokeWidth={5} />
		<path d="M10,32 L60,10 L110,32" fill="none" stroke={color} strokeWidth={5} strokeLinejoin="round" />
		<line x1={60} y1={10} x2={60} y2={45} stroke={color} strokeWidth={4} opacity={0.6} />
		<line x1={10} y1={32} x2={60} y2={45} stroke={color} strokeWidth={3} opacity={0.5} />
		<line x1={110} y1={32} x2={60} y2={45} stroke={color} strokeWidth={3} opacity={0.5} />
	</svg>
);

export const Wrench: React.FC<IconProps> = ({ size = 140, color = "#FFFFFF", style }) => (
	<svg width={size} height={size} viewBox="0 0 140 140" style={style}>
		<circle cx={100} cy={40} r={26} fill="none" stroke={color} strokeWidth={9} />
		<line x1={82} y1={58} x2={35} y2={105} stroke={color} strokeWidth={12} strokeLinecap="round" />
		<circle cx={35} cy={105} r={9} fill="none" stroke={color} strokeWidth={7} />
	</svg>
);

export const Drop: React.FC<IconProps> = ({ size = 60, color = "#E8B84B", style }) => (
	<svg width={size} height={(size * 80) / 60} viewBox="0 0 60 80" style={style}>
		<path
			d="M30,5 C45,30 52,45 52,55 a22,22 0 1 1 -44,0 C8,45 15,30 30,5 Z"
			fill={color}
		/>
	</svg>
);

export const PhoneShare: React.FC<{
	size?: number;
	color?: string;
	accent?: string;
	arrowProgress: number;
	style?: CSSProperties;
}> = ({ size = 220, color = "#FFFFFF", accent = "#E8B84B", arrowProgress, style }) => {
	const rise = arrowProgress * 90;
	const arrowOpacity = interpolate(
		arrowProgress,
		[0, 0.15, 0.8, 1],
		[0, 1, 1, 0],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);
	return (
		<svg width={size} height={(size * 330) / 220} viewBox="0 0 220 330" style={style}>
			<rect x={40} y={40} width={140} height={260} rx={24} fill="none" stroke={color} strokeWidth={7} />
			<line x1={85} y1={64} x2={135} y2={64} stroke={color} strokeWidth={6} strokeLinecap="round" opacity={0.6} />
			<circle cx={110} cy={278} r={10} fill="none" stroke={color} strokeWidth={5} />
			<g opacity={arrowOpacity} transform={`translate(110, ${170 - rise})`}>
				<line x1={0} y1={40} x2={0} y2={-30} stroke={accent} strokeWidth={9} strokeLinecap="round" />
				<path d="M-20,-8 L0,-38 L20,-8 Z" fill={accent} />
			</g>
		</svg>
	);
};
