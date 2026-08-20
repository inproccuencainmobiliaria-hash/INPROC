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

export const enterProgress = (frame: number, start = 0, duration = 10) =>
	clampInterp(
		frame,
		[start, start + duration],
		[0, 1],
		Easing.out(Easing.cubic),
	);

export const getEnterStyle = (
	frame: number,
	start = 0,
	duration = 16,
	distance = 34,
) => {
	const p = enterProgress(frame, start, duration);
	return {
		opacity: p,
		translateY: (1 - p) * distance,
	};
};

// Gentle perpetual motion so nothing on screen sits fully static for long.
export const idleFloat = (frame: number, amplitude = 6, speed = 0.07) =>
	Math.sin(frame * speed) * amplitude;

export const idleBreath = (frame: number, amplitude = 0.02, speed = 0.06) =>
	1 + Math.sin(frame * speed) * amplitude;
