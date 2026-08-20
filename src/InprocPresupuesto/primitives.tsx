import type { CSSProperties, PropsWithChildren } from "react";
import { AbsoluteFill, Easing } from "remotion";
import { COLORS, SAFE_AREA, SAFE_HEIGHT, SAFE_WIDTH, VIDEO_HEIGHT } from "./theme";
import { clampInterp } from "./utils";

export const Background: React.FC = () => (
	<AbsoluteFill
		style={{
			background: `radial-gradient(circle at 50% 28%, ${COLORS.bgSoft} 0%, ${COLORS.bg} 68%)`,
		}}
	/>
);

export const SafeArea: React.FC<PropsWithChildren<{ style?: CSSProperties }>> = ({
	children,
	style,
}) => (
	<div
		style={{
			position: "absolute",
			top: SAFE_AREA.top,
			left: SAFE_AREA.left,
			width: SAFE_WIDTH,
			height: SAFE_HEIGHT,
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			...style,
		}}
	>
		{children}
	</div>
);

// A full-bleed color panel that slides up and off screen, used as an
// 8-10 frame "barrido" cut between scenes / scene halves.
export const WipeCut: React.FC<{
	frame: number;
	duration?: number;
	color?: string;
}> = ({ frame, duration = 9, color = COLORS.bgSoft }) => {
	const progress = clampInterp(
		frame,
		[0, duration],
		[0, 1],
		Easing.out(Easing.cubic),
	);
	if (progress >= 1) {
		return null;
	}
	return (
		<AbsoluteFill
			style={{
				backgroundColor: color,
				transform: `translateY(${-VIDEO_HEIGHT * progress}px)`,
			}}
		/>
	);
};

export const Underline: React.FC<{
	progress: number;
	width: number;
	color?: string;
	height?: number;
	style?: CSSProperties;
}> = ({ progress, width, color = COLORS.gold, height = 6, style }) => (
	<div
		style={{
			width: Math.max(0, width * progress),
			height,
			backgroundColor: color,
			borderRadius: height / 2,
			...style,
		}}
	/>
);
