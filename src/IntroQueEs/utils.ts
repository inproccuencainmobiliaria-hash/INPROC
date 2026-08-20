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
export const easeIn = Easing.in(Easing.cubic);

export const idleFloat = (frame: number, amplitude = 6, speed = 0.07) =>
	Math.sin(frame * speed) * amplitude;
