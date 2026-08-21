import { Easing, interpolate } from "remotion";

export const clampInterp = (
	frame: number,
	inputRange: number[],
	outputRange: number[],
	easing?: (n: number) => number,
) =>
	interpolate(frame, inputRange, outputRange, {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing,
	});

export const easeOut = Easing.out(Easing.cubic);
export const easeInOut = Easing.inOut(Easing.cubic);

// Ken Burns: escala lineal y continua a lo largo de toda la escena.
export const kenBurnsScale = (
	frame: number,
	durationInFrames: number,
	from: number,
	to: number,
) => clampInterp(frame, [0, durationInFrames], [from, to]);
